import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

/* =========================================================
   TYPES
========================================================= */

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  department: string;
  gradeLevel: string;
  status: "Active" | "Inactive" | "Graduated";
  joinedDate: string;
  emergencyContact?: string;
  address?: string;
}

const EMPTY_FORM = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  gender: "Male" as "Male" | "Female",
  department: "Computer Science",
  gradeLevel: "Year 1",
  status: "Active" as "Active" | "Inactive" | "Graduated",
  joinedDate: new Date().toISOString().split("T")[0],
  emergencyContact: "",
  address: "",
};

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");


  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Fetch students from Backend MySQL API
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/students`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: Student[] = json.data.map((u: any) => ({
          id: u.id,
          studentId: `STU-${String(u.id).padStart(3, "0")}`,
          name: u.name,
          email: u.email,
          phone: u.phone || "N/A",
          gender: (u.gender as "Male" | "Female") || "Male",
          department: u.subject || "Computer Science",
          gradeLevel: u.adminNotes || "Year 1",
          status: (u.status as "Active" | "Inactive" | "Graduated") || "Active",
          joinedDate: u.joinedAt ? u.joinedAt.split("T")[0] : new Date().toISOString().split("T")[0],
          address: u.address || "",
        }));
        setStudents(mapped);
      }
    } catch (err) {
      console.error("Error fetching students from API:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* Filter */
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = search.toLowerCase();
      const matchSearch =
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q);
      const matchDept =
        departmentFilter === "All" || student.department === departmentFilter;
      const matchStatus =
        statusFilter === "All" || student.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [students, search, departmentFilter, statusFilter]);

  /* Handlers */
  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      ...EMPTY_FORM,
      studentId: `STU-${String(students.length + 1).padStart(3, "0")}`,
      joinedDate: new Date().toISOString().split("T")[0],
    });
    setShowFormModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      department: student.department,
      gradeLevel: student.gradeLevel,
      status: student.status,
      joinedDate: student.joinedDate,
      emergencyContact: student.emergencyContact || "",
      address: student.address || "",
    });
    setShowFormModal(true);
  };

  const handleSaveStudent = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      alert("Please fill in Name, Email and Department.");
      return;
    }

    // Check unique Student ID
    if (formData.studentId) {
      const duplicateId = students.find(
        (s) =>
          s.studentId.trim().toLowerCase() === formData.studentId.trim().toLowerCase() &&
          (!editingStudent || s.id !== editingStudent.id)
      );
      if (duplicateId) {
        alert(`Student ID "${formData.studentId}" already exists. Please enter a unique ID.`);
        return;
      }
    }

    // Check unique Email
    const duplicateEmail = students.find(
      (s) =>
        s.email.trim().toLowerCase() === formData.email.trim().toLowerCase() &&
        (!editingStudent || s.id !== editingStudent.id)
    );
    if (duplicateEmail) {
      alert(`Email "${formData.email}" already exists. Please use a different email.`);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        joinedAt: formData.joinedDate,
        gradeLevel: formData.gradeLevel,
        gender: formData.gender,
        status: formData.status,
        address: formData.address,
      };

      if (editingStudent) {
        await fetch(`${API_BASE_URL}/students/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchStudents();
    } catch (err) {
      console.error("Save student error:", err);
    }

    setShowFormModal(false);
    setEditingStudent(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await fetch(`${API_BASE_URL}/students/${selectedStudent.id}`, {
        method: "DELETE",
      });
      await fetchStudents();
    } catch (err) {
      console.error("Delete student error:", err);
    }
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };


  /* Stats */
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const inactive = students.filter((s) => s.status === "Inactive").length;
  const departments = new Set(students.map((s) => s.department)).size;

  return (
    <div
      style={{
        minHeight: "100%",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
      }}
    >
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
            Student Management
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, margin: 0 }}>
            View, search, enroll, and manage student academic records.
          </p>
        </div>

        <button
          onClick={handleAddStudent}
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
          <span style={{ fontSize: 16 }}>➕</span>
          Add Student
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatWidget icon="👨‍🎓" label="Total Students" value={total} color="#3b82f6" bg="#eff6ff" />
        <StatWidget icon="✅" label="Active Students" value={active} color="#10b981" bg="#ecfdf5" />
        <StatWidget icon="⛔" label="Inactive Students" value={inactive} color="#ef4444" bg="#fef2f2" />
        <StatWidget icon="🏢" label="Departments" value={departments} color="#8b5cf6" bg="#f5f3ff" />
      </div>

      {/* Table Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Table Toolbar */}
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
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
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
                color: "#334155",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
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
                outline: "none",
              }}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </select>

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
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student", "Student ID", "Department", "Year Level", "Phone", "Status", "Joined Date", "Actions"].map(
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
              {filteredStudents.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#e0e7ff",
                          color: "#4338ca",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    {s.studentId}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {s.department}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {s.gradeLevel}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                    {s.phone}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        background:
                          s.status === "Active"
                            ? "#ecfdf5"
                            : s.status === "Graduated"
                            ? "#f5f3ff"
                            : "#fef2f2",
                        color:
                          s.status === "Active"
                            ? "#059669"
                            : s.status === "Graduated"
                            ? "#7c3aed"
                            : "#dc2626",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background:
                            s.status === "Active"
                              ? "#10b981"
                              : s.status === "Graduated"
                              ? "#8b5cf6"
                              : "#ef4444",
                        }}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                    {s.joinedDate}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionButton
                        icon="👁"
                        title="View"
                        bg="#eff6ff"
                        color="#2563eb"
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowDetailModal(true);
                        }}
                      />
                      <ActionButton
                        icon="✏️"
                        title="Edit"
                        bg="#fffbeb"
                        color="#d97706"
                        onClick={() => handleEditStudent(s)}
                      />
                      <ActionButton
                        icon="🗑"
                        title="Delete"
                        bg="#fef2f2"
                        color="#dc2626"
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowDeleteModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal (Add / Edit) */}
      {showFormModal && (
        <ModalOverlay onClose={() => setShowFormModal(false)}>
          <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0", color: "#0f172a" }}>
              {editingStudent ? "Edit Student Profile" : "Register New Student"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Label>Student ID</Label>
                <Input
                  value={formData.studentId}
                  onChange={(e: any) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chan Vathanak"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="012 345 678"
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
                <Label>Year Level</Label>
                <Select
                  value={formData.gradeLevel}
                  onChange={(e: any) => setFormData({ ...formData, gradeLevel: e.target.value })}
                >
                  <option value="Year 1">Year 1</option>
                  <option value="Year 2">Year 2</option>
                  <option value="Year 3">Year 3</option>
                  <option value="Year 4">Year 4</option>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onChange={(e: any) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e: any) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </Select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, Province"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setShowFormModal(false)}
                style={{
                  padding: "9px 16px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#475569",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudent}
                style={{
                  padding: "9px 20px",
                  background: "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {editingStudent ? "Save Changes" : "Register Student"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <ModalOverlay onClose={() => setShowDeleteModal(false)}>
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
              Delete Student?
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
              Are you sure you want to delete <strong>{selectedStudent.name}</strong> ({selectedStudent.studentId})? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "8px 18px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <ModalOverlay onClose={() => setShowDetailModal(false)}>
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#e0e7ff",
                  color: "#4338ca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {selectedStudent.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{selectedStudent.name}</h3>
                <span style={{ fontSize: 12, color: "#64748b" }}>{selectedStudent.studentId} • {selectedStudent.department}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><strong>Email:</strong> {selectedStudent.email}</div>
              <div><strong>Phone:</strong> {selectedStudent.phone}</div>
              <div><strong>Gender:</strong> {selectedStudent.gender}</div>
              <div><strong>Year Level:</strong> {selectedStudent.gradeLevel}</div>
              <div><strong>Status:</strong> {selectedStudent.status}</div>
              <div><strong>Joined Date:</strong> {selectedStudent.joinedDate}</div>
              <div style={{ gridColumn: "1 / -1" }}><strong>Address:</strong> {selectedStudent.address || "N/A"}</div>
            </div>

            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: "8px 18px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/* Helpers */
function StatWidget({ icon, label, value, bg }: any) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "16px 18px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "100%",
          maxWidth: 540,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Label({ children }: any) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>{children}</div>;
}

function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "8px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: 6,
        fontSize: 13,
        outline: "none",
        ...props.style,
      }}
    />
  );
}

function Select(props: any) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "8px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: 6,
        fontSize: 13,
        background: "#fff",
        outline: "none",
        ...props.style,
      }}
    />
  );
}
