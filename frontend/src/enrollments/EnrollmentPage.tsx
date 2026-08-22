import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

export interface EnrollmentRecord {
  id: number;
  enrollmentCode: string;
  studentName: string;
  studentId: number;
  studentCode: string;
  courseId: number;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: string;
  enrolledDate: string;
  status: "Active" | "Pending" | "Completed" | "Dropped";
}

interface StudentOption {
  id: number;
  studentCode: string;
  name: string;
  email: string;
  department: string;
}

interface CourseOption {
  id: number;
  courseName: string;
  enrollmentCode: string;
  department: string;
  capacity: number;
}

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EnrollmentRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<EnrollmentRecord | null>(null);
  const [editCourseId, setEditCourseId] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<"Active" | "Pending" | "Completed" | "Dropped">("Active");

  // Modal form state
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [semester, setSemester] = useState("Semester 1 (2026)");
  const [initialStatus, setInitialStatus] = useState<"Active" | "Pending">("Active");

  // Fetch all data from backend API
  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: EnrollmentRecord[] = json.data.map((e: any) => ({
          id: e.id,
          enrollmentCode: `ENR-${String(e.id).padStart(4, "0")}`,
          studentName: e.Student ? e.Student.name : "Unknown Student",
          studentId: e.studentId,
          studentCode: `STU-${String(e.studentId).padStart(3, "0")}`,
          courseId: e.courseId,
          subjectCode: e.Course ? e.Course.enrollmentCode || `SUB-${e.courseId}` : "N/A",
          subjectName: e.Course ? e.Course.courseName : "Unknown Subject",
          department: e.Course ? e.Course.department : (e.Student ? e.Student.subject : "General"),
          semester: "Semester 1 (2026)",
          enrolledDate: e.createdAt ? e.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
          status: (e.status ? (e.status.charAt(0).toUpperCase() + e.status.slice(1)) : "Active") as any,
        }));
        setEnrollments(mapped);
      }
    } catch (err) {
      console.error("Fetch enrollments error:", err);
    }
  };

  const fetchStudentsAndCourses = async () => {
    try {
      const [stuRes, subRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students`),
        fetch(`${API_BASE_URL}/subjects`),
      ]);
      const stuJson = await stuRes.json();
      const subJson = await subRes.json();

      if (stuJson.success && Array.isArray(stuJson.data)) {
        setStudents(
          stuJson.data.map((u: any) => ({
            id: u.id,
            studentCode: `STU-${String(u.id).padStart(3, "0")}`,
            name: u.name,
            email: u.email,
            department: u.subject || "Computer Science",
          }))
        );
      }

      if (subJson.success && Array.isArray(subJson.data)) {
        setCourses(
          subJson.data.map((c: any) => ({
            id: c.id,
            courseName: c.courseName,
            enrollmentCode: c.enrollmentCode || `SUB-${c.id}`,
            department: c.department,
            capacity: c.capacity || 40,
          }))
        );
        if (subJson.data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(subJson.data[0].id);
        }
      }
    } catch (err) {
      console.error("Fetch metadata error:", err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    fetchStudentsAndCourses();
  }, []);

  // Filtered table data
  const filtered = useMemo(() => {
    return enrollments.filter((item) => {
      const q = search.toLowerCase();
      const match =
        item.studentName.toLowerCase().includes(q) ||
        item.studentCode.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q) ||
        item.enrollmentCode.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return match && matchStatus;
    });
  }, [enrollments, search, statusFilter]);

  // Students available for the selected course (excluding already enrolled)
  const availableStudents = useMemo(() => {
    if (!selectedCourseId) return [];
    const enrolledIds = enrollments
      .filter((e) => e.courseId === Number(selectedCourseId))
      .map((e) => e.studentId);
    return students.filter((s) => !enrolledIds.includes(s.id));
  }, [selectedCourseId, enrollments, students]);

  const filteredAvailableStudents = useMemo(() => {
    const q = studentSearch.toLowerCase();
    return availableStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [availableStudents, studentSearch]);

  const handleOpenAdd = () => {
    setSelectedStudentIds([]);
    setStudentSearch("");
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
    setShowModal(true);
  };

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudentIds((curr) =>
      curr.includes(studentId) ? curr.filter((id) => id !== studentId) : [...curr, studentId]
    );
  };

  const handleSelectAllAvailable = () => {
    if (selectedStudentIds.length === filteredAvailableStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredAvailableStudents.map((s) => s.id));
    }
  };

  const handleSaveEnrollment = async () => {
    if (!selectedCourseId) {
      alert("Please select a course/subject.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student to enroll.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          studentIds: selectedStudentIds,
          status: initialStatus.toLowerCase(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchEnrollments();
        setShowModal(false);
        setSelectedStudentIds([]);
      } else {
        alert(json.message || "Failed to enroll students.");
      }
    } catch (err) {
      console.error("Save enrollment error:", err);
    }
  };

  const handleOpenEdit = (rec: EnrollmentRecord) => {
    setEditingRecord(rec);
    setEditCourseId(rec.courseId);
    setEditStatus(rec.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/${editingRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: editCourseId,
          status: editStatus.toLowerCase(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchEnrollments();
        setShowEditModal(false);
        setEditingRecord(null);
      }
    } catch (err) {
      console.error("Save edit enrollment error:", err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: "Active" | "Pending" | "Completed" | "Dropped") => {
    try {
      await fetch(`${API_BASE_URL}/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });
      setEnrollments((curr) =>
        curr.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error("Update enrollment status error:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    try {
      await fetch(`${API_BASE_URL}/enrollments/${selectedRecord.id}`, {
        method: "DELETE",
      });
      await fetchEnrollments();
    } catch (err) {
      console.error("Delete enrollment error:", err);
    }
    setShowDeleteModal(false);
    setSelectedRecord(null);
  };

  // Stats
  const total = enrollments.length;
  const activeCount = enrollments.filter((e) => e.status === "Active").length;
  const pendingCount = enrollments.filter((e) => e.status === "Pending").length;
  const completedCount = enrollments.filter((e) => e.status === "Completed").length;

  const currentCourse = courses.find((c) => c.id === Number(selectedCourseId));
  const currentEnrolledCount = enrollments.filter((e) => e.courseId === Number(selectedCourseId)).length;

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Student Enrollment Management
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, margin: 0 }}>
            Batch enroll students to subjects, manage course rosters, approval statuses, and quotas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
          }}
        >
          <span>➕</span> Enroll Student(s)
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatWidget icon="📝" label="Total Enrollments" value={total} color="#3b82f6" bg="#eff6ff" />
        <StatWidget icon="⚡" label="Active Enrolled" value={activeCount} color="#10b981" bg="#ecfdf5" />
        <StatWidget icon="⏳" label="Pending Approval" value={pendingCount} color="#f59e0b" bg="#fffbeb" />
        <StatWidget icon="🎓" label="Completed Courses" value={completedCount} color="#8b5cf6" bg="#f5f3ff" />
      </div>

      {/* Table Container */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ position: "relative", width: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
            <input
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px 9px 36px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                outline: "none",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
                color: "#475569",
                background: "#fff",
                outline: "none",
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Enrollment Code", "Student", "Subject / Course", "Department", "Semester", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontSize: 11, fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#2563eb" }}>
                    {item.enrollmentCode}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{item.studentName}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.studentCode}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{item.subjectName}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.subjectCode}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {item.department}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                    {item.semester}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                    {item.enrolledDate}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        background:
                          item.status === "Active"
                            ? "#ecfdf5"
                            : item.status === "Pending"
                            ? "#fffbeb"
                            : item.status === "Completed"
                            ? "#f5f3ff"
                            : "#fef2f2",
                        color:
                          item.status === "Active"
                            ? "#059669"
                            : item.status === "Pending"
                            ? "#d97706"
                            : item.status === "Completed"
                            ? "#7c3aed"
                            : "#dc2626",
                      }}
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Pending">🟡 Pending</option>
                      <option value="Completed">🟣 Completed</option>
                      <option value="Dropped">🔴 Dropped</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        title="Edit Enrollment"
                        onClick={() => handleOpenEdit(item)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "none",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        title="Unenroll"
                        onClick={() => {
                          setSelectedRecord(item);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "none",
                          background: "#fef2f2",
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No enrollment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Multi-Student Enrollment Modal */}
      {showModal && (
        <ModalOverlay onClose={() => setShowModal(false)}>
          <div style={{ padding: 24, maxWidth: 560 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
              Batch Enroll Students to Subject
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 18px 0" }}>
              Select a subject and choose from students who are not yet enrolled.
            </p>

            {/* Step 1: Select Subject */}
            <div style={{ marginBottom: 16 }}>
              <Label>1. Select Subject / Course *</Label>
              <Select
                value={selectedCourseId}
                onChange={(e: any) => {
                  setSelectedCourseId(Number(e.target.value));
                  setSelectedStudentIds([]);
                }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseName} ({c.enrollmentCode}) • {c.department}
                  </option>
                ))}
              </Select>
              {currentCourse && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  <span>Department: <strong>{currentCourse.department}</strong></span>
                  <span>Enrolled: <strong>{currentEnrolledCount} / {currentCourse.capacity} seats</strong></span>
                </div>
              )}
            </div>

            {/* Step 2: Multi-Student Selection (Shows only NOT enrolled yet) */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Label>2. Select Student(s) to Enroll ({availableStudents.length} available) *</Label>
                {filteredAvailableStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllAvailable}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#2563eb",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {selectedStudentIds.length === filteredAvailableStudents.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                )}
              </div>

              {availableStudents.length === 0 ? (
                <div
                  style={{
                    padding: 20,
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    borderRadius: 8,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 20, display: "block", marginBottom: 4 }}>✅</span>
                  All registered students in the database are already enrolled in this subject!
                </div>
              ) : (
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, background: "#f8fafc" }}>
                  {/* Search inside student list */}
                  <input
                    type="text"
                    placeholder="Filter students by name or ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "6px 10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 8,
                      outline: "none",
                      background: "#fff",
                    }}
                  />

                  {/* Scrollable multi-select student checkboxes */}
                  <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                    {filteredAvailableStudents.map((s) => {
                      const isSelected = selectedStudentIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleStudent(s.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 10px",
                            borderRadius: 6,
                            background: isSelected ? "#eff6ff" : "#fff",
                            border: isSelected ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ cursor: "pointer" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{s.name}</div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              {s.studentCode} • {s.department} • {s.email}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Semester & Initial Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Label>Semester</Label>
                <Select value={semester} onChange={(e: any) => setSemester(e.target.value)}>
                  <option value="Semester 1 (2026)">Semester 1 (2026)</option>
                  <option value="Semester 2 (2026)">Semester 2 (2026)</option>
                  <option value="Summer Term (2026)">Summer Term (2026)</option>
                </Select>
              </div>

              <div>
                <Label>Initial Status</Label>
                <Select value={initialStatus} onChange={(e: any) => setInitialStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Approval</option>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ padding: "9px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEnrollment}
                disabled={selectedStudentIds.length === 0}
                style={{
                  padding: "9px 20px",
                  background: selectedStudentIds.length > 0 ? "#2563eb" : "#94a3b8",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: selectedStudentIds.length > 0 ? "pointer" : "not-allowed",
                  boxShadow: selectedStudentIds.length > 0 ? "0 2px 6px rgba(37,99,235,0.3)" : "none",
                }}
              >
                Enroll {selectedStudentIds.length > 0 ? `${selectedStudentIds.length} Student(s)` : "Students"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Enrollment Modal */}
      {showEditModal && editingRecord && (
        <ModalOverlay onClose={() => setShowEditModal(false)}>
          <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
              Edit Enrollment Record
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 18px 0" }}>
              Update subject assignment or enrollment status for {editingRecord.studentName}.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <Label>Student</Label>
                <div style={{ padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, color: "#334155" }}>
                  <strong>{editingRecord.studentName}</strong> ({editingRecord.studentCode})
                </div>
              </div>

              <div>
                <Label>Subject / Course</Label>
                <Select
                  value={editCourseId}
                  onChange={(e: any) => setEditCourseId(Number(e.target.value))}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseName} ({c.enrollmentCode}) • {c.department}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Enrollment Status</Label>
                <Select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value as any)}
                >
                  <option value="Active">🟢 Active</option>
                  <option value="Pending">🟡 Pending</option>
                  <option value="Completed">🟣 Completed</option>
                  <option value="Dropped">🔴 Dropped</option>
                </Select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ padding: "9px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                style={{
                  padding: "9px 20px",
                  background: "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRecord && (
        <ModalOverlay onClose={() => setShowDeleteModal(false)}>
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px 0" }}>Unenroll Student?</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
              Are you sure you want to remove <strong>{selectedRecord.studentName}</strong> from <strong>{selectedRecord.subjectName}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Yes, Unenroll
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function StatWidget({ icon, label, value, bg }: any) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>{value}</div>
      </div>
    </div>
  );
}

function ModalOverlay({ children, onClose }: any) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 540, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
        {children}
      </div>
    </div>
  );
}

function Label({ children }: any) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>{children}</div>;
}

function Select(props: any) {
  return <select {...props} style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, background: "#fff", outline: "none", ...props.style }} />;
}
