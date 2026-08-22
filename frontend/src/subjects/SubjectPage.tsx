import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

export interface Subject {
  id: number;
  subjectCode: string;
  name: string;
  department: string;
  credits: number;
  teacherName: string;
  teacherId?: number | null;
  schedule: string;
  room: string;
  capacity: number;
  enrolledCount: number;
  status: "Active" | "Inactive";
}

const INITIAL_SUBJECTS: Subject[] = [];

const EMPTY_FORM = {
  subjectCode: "",
  name: "",
  department: "Computer Science",
  credits: 3,
  teacherName: "",
  teacherId: null as number | null,
  schedule: "Mon, Wed 08:00 AM - 09:30 AM",
  room: "Room 101",
  capacity: 40,
  enrolledCount: 0,
  status: "Active" as "Active" | "Inactive",
};

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [teachersList, setTeachersList] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Fetch subjects and teachers from backend API
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: Subject[] = json.data.map((c: any) => ({
          id: c.id,
          subjectCode: c.enrollmentCode || `SUB-${c.id}`,
          name: c.courseName,
          department: c.department,
          credits: 3,
          teacherName: c.Teacher ? c.Teacher.name : "Unassigned",
          teacherId: c.teacherId,
          schedule: c.schedule || "TBA",
          room: c.room || "TBA",
          capacity: c.capacity || 40,
          enrolledCount: Array.isArray(c.Enrollments) ? c.Enrollments.length : 0,
          status: "Active",
        }));
        setSubjects(mapped);
      }
    } catch (err) {
      console.error("Fetch subjects error:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/teachers`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTeachersList(json.data.map((t: any) => ({ id: t.id, name: t.name })));
        if (!formData.teacherName && json.data.length > 0) {
          setFormData((prev) => ({ ...prev, teacherName: json.data[0].name, teacherId: json.data[0].id }));
        }
      }
    } catch (err) {
      console.error("Fetch teachers error:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.subjectCode.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q);
      const matchDept =
        departmentFilter === "All" || item.department === departmentFilter;
      return matchSearch && matchDept;
    });
  }, [subjects, search, departmentFilter]);

  const handleAdd = () => {
    setEditingSubject(null);
    setFormData({
      ...EMPTY_FORM,
      subjectCode: `SUB-${String(subjects.length + 101)}`,
      teacherName: teachersList.length > 0 ? teachersList[0].name : "",
      teacherId: teachersList.length > 0 ? teachersList[0].id : null,
    });
    setShowFormModal(true);
  };

  const handleEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData({
      subjectCode: sub.subjectCode,
      name: sub.name,
      department: sub.department,
      credits: sub.credits,
      teacherName: sub.teacherName,
      teacherId: sub.teacherId ?? null,
      schedule: sub.schedule,
      room: sub.room,
      capacity: sub.capacity,
      enrolledCount: sub.enrolledCount,
      status: sub.status,
    });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.subjectCode || !formData.department) {
      alert("Please fill in Subject Name, Code and Department.");
      return;
    }

    // Check unique subject code
    const duplicateCode = subjects.find(
      (s) =>
        s.subjectCode.trim().toLowerCase() === formData.subjectCode.trim().toLowerCase() &&
        (!editingSubject || s.id !== editingSubject.id)
    );
    if (duplicateCode) {
      alert(`Subject Code "${formData.subjectCode}" already exists. Please enter a unique code.`);
      return;
    }

    const matchedTeacher = teachersList.find((t) => t.name === formData.teacherName);
    const teacherId = matchedTeacher ? matchedTeacher.id : formData.teacherId;

    try {
      const payload = {
        courseName: formData.name,
        enrollmentCode: formData.subjectCode,
        department: formData.department,
        capacity: formData.capacity,
        schedule: formData.schedule,
        room: formData.room,
        teacherId: teacherId || null,
      };

      if (editingSubject) {
        await fetch(`${API_BASE_URL}/subjects/${editingSubject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/subjects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchSubjects();
    } catch (err) {
      console.error("Save subject error:", err);
    }

    setShowFormModal(false);
    setEditingSubject(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    try {
      await fetch(`${API_BASE_URL}/subjects/${selectedSubject.id}`, {
        method: "DELETE",
      });
      await fetchSubjects();
    } catch (err) {
      console.error("Delete subject error:", err);
    }
    setShowDeleteModal(false);
    setSelectedSubject(null);
  };

  const total = subjects.length;
  const totalCapacity = subjects.reduce((sum, s) => sum + s.capacity, 0);
  const totalEnrolled = subjects.reduce((sum, s) => sum + s.enrolledCount, 0);
  const totalTeachers = new Set(subjects.map((s) => s.teacherName)).size;

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Subject / Course Management
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, margin: 0 }}>
            Configure curriculum, credit hours, schedules, and instructor assignments.
          </p>
        </div>

        <button
          onClick={handleAdd}
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
          <span>➕</span> Add Subject
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatWidget icon="📚" label="Total Subjects" value={total} color="#f59e0b" bg="#fffbeb" />
        <StatWidget icon="👥" label="Enrolled Students" value={totalEnrolled} color="#3b82f6" bg="#eff6ff" />
        <StatWidget icon="👨‍🏫" label="Active Teachers" value={totalTeachers} color="#10b981" bg="#ecfdf5" />
        <StatWidget icon="🪑" label="Total Seat Capacity" value={totalCapacity} color="#8b5cf6" bg="#f5f3ff" />
      </div>

      {/* Table Container */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ position: "relative", width: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by subject code, name, teacher..."
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

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 12,
              color: "#475569",
              background: "#fff",
            }}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Subject Code", "Subject Name", "Department", "Credits", "Assigned Teacher", "Schedule & Room", "Seats", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        color: "#64748b",
                        fontSize: 11,
                        fontWeight: 600,
                        borderBottom: "1px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>
                      {s.subjectCode}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
                    {s.name}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {s.department}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                    {s.credits} Credits
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#334155", fontWeight: 500 }}>
                    👨‍🏫 {s.teacherName}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#64748b" }}>
                    <div>{s.schedule}</div>
                    <div style={{ color: "#94a3b8", marginTop: 2 }}>📍 {s.room}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: s.enrolledCount >= s.capacity ? "#dc2626" : "#059669" }}>
                      {s.enrolledCount}
                    </span>
                    <span style={{ color: "#94a3b8" }}> / {s.capacity}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionButton
                        icon="👁"
                        title="View"
                        bg="#eff6ff"
                        color="#2563eb"
                        onClick={() => {
                          setSelectedSubject(s);
                          setShowDetailModal(true);
                        }}
                      />
                      <ActionButton
                        icon="✏️"
                        title="Edit"
                        bg="#fffbeb"
                        color="#d97706"
                        onClick={() => handleEdit(s)}
                      />
                      <ActionButton
                        icon="🗑"
                        title="Delete"
                        bg="#fef2f2"
                        color="#dc2626"
                        onClick={() => {
                          setSelectedSubject(s);
                          setShowDeleteModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <ModalOverlay onClose={() => setShowFormModal(false)}>
          <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0", color: "#0f172a" }}>
              {editingSubject ? "Edit Subject" : "Create New Subject"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Label>Subject Code *</Label>
                <Input
                  value={formData.subjectCode}
                  onChange={(e: any) => setFormData({ ...formData, subjectCode: e.target.value })}
                  placeholder="e.g. CS-101"
                />
              </div>
              <div>
                <Label>Subject Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Web Development"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onChange={(e: any) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                </Select>
              </div>
              <div>
                <Label>Credits</Label>
                <Input
                  type="number"
                  value={formData.credits}
                  onChange={(e: any) => setFormData({ ...formData, credits: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Assigned Teacher</Label>
                <Select
                  value={formData.teacherName}
                  onChange={(e: any) => setFormData({ ...formData, teacherName: e.target.value })}
                >
                  <option value="">-- Select Teacher --</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Classroom / Lab</Label>
                <Input
                  value={formData.room}
                  onChange={(e: any) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g. Room 201"
                />
              </div>
              <div>
                <Label>Schedule</Label>
                <Input
                  value={formData.schedule}
                  onChange={(e: any) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="e.g. Mon, Wed 08:00 AM"
                />
              </div>
              <div>
                <Label>Max Seat Capacity</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e: any) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setShowFormModal(false)}
                style={{ padding: "9px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ padding: "9px 20px", background: "#2563eb", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
              >
                {editingSubject ? "Save Changes" : "Create Subject"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSubject && (
        <ModalOverlay onClose={() => setShowDeleteModal(false)}>
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>Delete Subject?</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
              Are you sure you want to delete <strong>{selectedSubject.name}</strong> ({selectedSubject.subjectCode})?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubject && (
        <ModalOverlay onClose={() => setShowDetailModal(false)}>
          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>{selectedSubject.name}</h3>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>{selectedSubject.subjectCode} • {selectedSubject.department}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><strong>Credits:</strong> {selectedSubject.credits}</div>
              <div><strong>Instructor:</strong> {selectedSubject.teacherName}</div>
              <div><strong>Schedule:</strong> {selectedSubject.schedule}</div>
              <div><strong>Room:</strong> {selectedSubject.room}</div>
              <div><strong>Capacity:</strong> {selectedSubject.capacity} Seats</div>
              <div><strong>Enrolled:</strong> {selectedSubject.enrolledCount} Students</div>
            </div>
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button onClick={() => setShowDetailModal(false)} style={{ padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                Close
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

function ActionButton({ icon, title, bg, color, onClick }: any) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 6,
        background: bg,
        color: color,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
      }}
    >
      {icon}
    </button>
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

function Input(props: any) {
  return <input {...props} style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, outline: "none", ...props.style }} />;
}

function Select(props: any) {
  return <select {...props} style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13, background: "#fff", outline: "none", ...props.style }} />;
}
