import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

/* =========================================================
   TYPES
========================================================= */

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  department: string;
  position: string;
  qualification: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

/* =========================================================
   SAMPLE DATA
========================================================= */

const INITIAL_TEACHERS: Teacher[] = [];

/* =========================================================
   FORM INITIAL STATE
========================================================= */

const EMPTY_FORM = {
  teacherId: "",
  name: "",
  email: "",
  phone: "",
  gender: "Male" as "Male" | "Female",
  department: "",
  position: "",
  qualification: "",
  status: "Active" as "Active" | "Inactive",
  joinedDate: "",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  // Fetch teachers from Backend API
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/teachers`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: Teacher[] = json.data.map((u: any) => ({
          id: u.id,
          teacherId: `TCH-${String(u.id).padStart(3, "0")}`,
          name: u.name,
          email: u.email,
          phone: u.phone || "N/A",
          gender: (u.gender as "Male" | "Female") || "Male",
          department: u.subject || "Computer Science",
          position: u.professionalTitle || "Lecturer",
          qualification: u.adminNotes || "Master's Degree",
          status: (u.status as "Active" | "Inactive") || "Active",
          joinedDate: u.joinedAt ? u.joinedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        }));
        setTeachers(mapped);
      }
    } catch (err) {
      console.error("Fetch teachers error:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* =====================================================
       FILTER
    ====================================================== */

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        teacher.name.toLowerCase().includes(searchValue) ||
        teacher.teacherId.toLowerCase().includes(searchValue) ||
        teacher.email.toLowerCase().includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" || teacher.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || teacher.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teachers, search, departmentFilter, statusFilter]);

  /* =====================================================
       OPEN ADD MODAL
    ====================================================== */

  const handleAddTeacher = () => {
    setEditingTeacher(null);

    setFormData({
      ...EMPTY_FORM,
      teacherId: `TCH-${String(teachers.length + 1).padStart(3, "0")}`,
      joinedDate: new Date().toISOString().split("T")[0],
    });

    setShowFormModal(true);
  };

  /* =====================================================
       OPEN EDIT MODAL
    ====================================================== */

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      teacherId: teacher.teacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      gender: teacher.gender,
      department: teacher.department,
      position: teacher.position,
      qualification: teacher.qualification,
      status: teacher.status,
      joinedDate: teacher.joinedDate,
    });

    setShowFormModal(true);
  };

  /* =====================================================
       SAVE TEACHER
    ====================================================== */

  const handleSaveTeacher = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.position
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check unique Teacher ID
    if (formData.teacherId) {
      const duplicateId = teachers.find(
        (t) =>
          t.teacherId.trim().toLowerCase() === formData.teacherId.trim().toLowerCase() &&
          (!editingTeacher || t.id !== editingTeacher.id)
      );
      if (duplicateId) {
        alert(`Teacher ID "${formData.teacherId}" already exists. Please enter a unique ID.`);
        return;
      }
    }

    // Check unique Email
    const duplicateEmail = teachers.find(
      (t) =>
        t.email.trim().toLowerCase() === formData.email.trim().toLowerCase() &&
        (!editingTeacher || t.id !== editingTeacher.id)
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
        position: formData.position,
        qualification: formData.qualification,
        joinedAt: formData.joinedDate,
        gender: formData.gender,
        status: formData.status,
      };

      if (editingTeacher) {
        await fetch(`${API_BASE_URL}/teachers/${editingTeacher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/teachers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchTeachers();
    } catch (err) {
      console.error("Save teacher error:", err);
    }

    setShowFormModal(false);
    setEditingTeacher(null);
    setFormData(EMPTY_FORM);
  };

  /* =====================================================
       DELETE
    ====================================================== */

  const openDeleteModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await fetch(`${API_BASE_URL}/teachers/${selectedTeacher.id}`, {
        method: "DELETE",
      });
      await fetchTeachers();
    } catch (err) {
      console.error("Delete teacher error:", err);
    }

    setShowDeleteModal(false);
    setSelectedTeacher(null);
  };

  /* =====================================================
       VIEW DETAIL
    ====================================================== */

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  /* =====================================================
       STATS
    ====================================================== */

  const totalTeachers = teachers.length;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active",
  ).length;

  const inactiveTeachers = teachers.filter(
    (teacher) => teacher.status === "Inactive",
  ).length;

  const departments = new Set(teachers.map((teacher) => teacher.department))
    .size;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
      }}
    >
      {/* =================================================
                PAGE HEADER
            ================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            Teacher Management
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Manage teachers, departments, positions and teacher information.
          </div>
        </div>

        <button
          onClick={handleAddTeacher}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(37,99,235,0.25)",
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          Add Teacher
        </button>
      </div>

      {/* =================================================
                STAT CARDS
            ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon="👨‍🏫"
          label="Total Teachers"
          value={totalTeachers}
          color="#3b82f6"
          background="#eff6ff"
        />

        <StatCard
          icon="✅"
          label="Active Teachers"
          value={activeTeachers}
          color="#10b981"
          background="#ecfdf5"
        />

        <StatCard
          icon="⛔"
          label="Inactive Teachers"
          value={inactiveTeachers}
          color="#ef4444"
          background="#fef2f2"
        />

        <StatCard
          icon="🏢"
          label="Departments"
          value={departments}
          color="#8b5cf6"
          background="#f5f3ff"
        />
      </div>

      {/* =================================================
                TABLE CARD
            ================================================== */}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {/* Search */}

            <div
              style={{
                position: "relative",
                width: 320,
              }}
            >
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
                placeholder="Search teacher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 13,
                  color: "#334155",
                }}
              />
            </div>

            {/* Filters */}

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
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
                  padding: "9px 12px",
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
              </select>
            </div>
          </div>
        </div>

        {/* =================================================
                    TABLE
                ================================================== */}

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1000,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                {[
                  "Teacher",
                  "Teacher ID",
                  "Department",
                  "Position",
                  "Phone",
                  "Status",
                  "Joined Date",
                  "Actions",
                ].map((heading) => (
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
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {/* Teacher */}

                  <td
                    style={{
                      padding: "13px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {teacher.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          {teacher.name}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginTop: 2,
                          }}
                        >
                          {teacher.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ID */}

                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 12,
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {teacher.teacherId}
                  </td>

                  {/* Department */}

                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    {teacher.department}
                  </td>

                  {/* Position */}

                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    {teacher.position}
                  </td>

                  {/* Phone */}

                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {teacher.phone}
                  </td>

                  {/* Status */}

                  <td
                    style={{
                      padding: "13px 16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 9px",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        background:
                          teacher.status === "Active" ? "#ecfdf5" : "#fef2f2",
                        color:
                          teacher.status === "Active" ? "#059669" : "#dc2626",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background:
                            teacher.status === "Active" ? "#10b981" : "#ef4444",
                        }}
                      />

                      {teacher.status}
                    </span>
                  </td>

                  {/* Joined Date */}

                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {teacher.joinedDate}
                  </td>

                  {/* Actions */}

                  <td
                    style={{
                      padding: "13px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {/* View */}

                      <ActionButton
                        icon="👁"
                        title="View"
                        background="#eff6ff"
                        color="#2563eb"
                        onClick={() => handleViewTeacher(teacher)}
                      />

                      {/* Edit */}

                      <ActionButton
                        icon="✏️"
                        title="Edit"
                        background="#fffbeb"
                        color="#d97706"
                        onClick={() => handleEditTeacher(teacher)}
                      />

                      {/* Delete */}

                      <ActionButton
                        icon="🗑"
                        title="Delete"
                        background="#fef2f2"
                        color="#dc2626"
                        onClick={() => openDeleteModal(teacher)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =================================================
                    EMPTY STATE
                ================================================== */}

        {filteredTeachers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 10,
              }}
            >
              👨‍🏫
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              No teachers found
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginTop: 4,
              }}
            >
              Try changing your search or filters.
            </div>
          </div>
        )}

        {/* TABLE FOOTER */}

        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </span>

          <div
            style={{
              display: "flex",
              gap: 5,
            }}
          >
            <button
              style={{
                width: 30,
                height: 30,
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                color: "#94a3b8",
              }}
            >
              ‹
            </button>

            <button
              style={{
                width: 30,
                height: 30,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              1
            </button>

            <button
              style={{
                width: 30,
                height: 30,
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              2
            </button>

            <button
              style={{
                width: 30,
                height: 30,
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
                ADD / EDIT MODAL
            ====================================================== */}

      {showFormModal && (
        <ModalOverlay onClose={() => setShowFormModal(false)}>
          <div
            style={{
              width: "min(680px, 95vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            {/* Modal Header */}

            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginTop: 3,
                  }}
                >
                  {editingTeacher
                    ? "Update teacher information"
                    : "Enter teacher information below"}
                </div>
              </div>

              <button
                onClick={() => setShowFormModal(false)}
                style={{
                  width: 30,
                  height: 30,
                  border: "none",
                  background: "#f1f5f9",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#64748b",
                }}
              >
                ×
              </button>
            </div>

            {/* Form */}

            <div
              style={{
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <FormInput
                  label="Teacher ID"
                  value={formData.teacherId}
                  placeholder="e.g. TCH-001"
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      teacherId: value,
                    })
                  }
                />

                <FormInput
                  label="Full Name"
                  required
                  value={formData.name}
                  placeholder="Enter full name"
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      name: value,
                    })
                  }
                />

                <FormInput
                  label="Email"
                  required
                  type="email"
                  value={formData.email}
                  placeholder="teacher@example.com"
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      email: value,
                    })
                  }
                />

                <FormInput
                  label="Phone"
                  value={formData.phone}
                  placeholder="012 345 678"
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      phone: value,
                    })
                  }
                />

                {/* Gender */}

                <FormSelect
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "Male" | "Female",
                    })
                  }
                  options={["Male", "Female"]}
                />

                {/* Department */}

                <FormSelect
                  label="Department"
                  required
                  value={formData.department}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      department: value,
                    })
                  }
                  options={[
                    "Computer Science",
                    "Mathematics",
                    "English",
                    "Science",
                  ]}
                  placeholder="Select department"
                />

                {/* Position */}

                <FormSelect
                  label="Position"
                  required
                  value={formData.position}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      position: value,
                    })
                  }
                  options={[
                    "Teacher",
                    "Senior Teacher",
                    "Head Teacher",
                    "Coordinator",
                  ]}
                  placeholder="Select position"
                />

                {/* Qualification */}

                <FormSelect
                  label="Qualification"
                  value={formData.qualification}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      qualification: value,
                    })
                  }
                  options={[
                    "Bachelor's Degree",
                    "Master's Degree",
                    "Doctorate",
                  ]}
                  placeholder="Select qualification"
                />

                {/* Joined Date */}

                <FormInput
                  label="Joined Date"
                  type="date"
                  value={formData.joinedDate}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      joinedDate: value,
                    })
                  }
                />

                {/* Status */}

                <FormSelect
                  label="Status"
                  value={formData.status}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as "Active" | "Inactive",
                    })
                  }
                  options={["Active", "Inactive"]}
                />
              </div>

              {/* Form Footer */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 24,
                  paddingTop: 18,
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <button
                  onClick={() => setShowFormModal(false)}
                  style={{
                    padding: "9px 18px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveTeacher}
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {editingTeacher ? "Update Teacher" : "Add Teacher"}
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
                DELETE MODAL
            ====================================================== */}

      {showDeleteModal && selectedTeacher && (
        <ModalOverlay onClose={() => setShowDeleteModal(false)}>
          <div
            style={{
              width: 400,
              maxWidth: "90vw",
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 14px",
              }}
            >
              🗑
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 7,
              }}
            >
              Delete Teacher?
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <strong>{selectedTeacher.name}</strong>? This action cannot be
              undone.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                marginTop: 22,
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "9px 20px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#64748b",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTeacher}
                style={{
                  padding: "9px 20px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Delete Teacher
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
                DETAIL MODAL
            ====================================================== */}

      {showDetailModal && selectedTeacher && (
        <ModalOverlay onClose={() => setShowDetailModal(false)}>
          <div
            style={{
              width: 500,
              maxWidth: "90vw",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Detail Header */}

            <div
              style={{
                padding: 22,
                background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {selectedTeacher.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {selectedTeacher.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 3,
                  }}
                >
                  {selectedTeacher.position} • {selectedTeacher.department}
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  width: 30,
                  height: 30,
                  border: "none",
                  background: "#fff",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#64748b",
                }}
              >
                ×
              </button>
            </div>

            {/* Details */}

            <div
              style={{
                padding: 22,
              }}
            >
              <DetailRow label="Teacher ID" value={selectedTeacher.teacherId} />

              <DetailRow label="Email" value={selectedTeacher.email} />

              <DetailRow label="Phone" value={selectedTeacher.phone} />

              <DetailRow label="Gender" value={selectedTeacher.gender} />

              <DetailRow
                label="Department"
                value={selectedTeacher.department}
              />

              <DetailRow label="Position" value={selectedTeacher.position} />

              <DetailRow
                label="Qualification"
                value={selectedTeacher.qualification}
              />

              <DetailRow
                label="Joined Date"
                value={selectedTeacher.joinedDate}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  Status
                </span>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 600,
                    background:
                      selectedTeacher.status === "Active"
                        ? "#ecfdf5"
                        : "#fef2f2",
                    color:
                      selectedTeacher.status === "Active"
                        ? "#059669"
                        : "#dc2626",
                  }}
                >
                  {selectedTeacher.status}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    padding: "9px 16px",
                    border: "none",
                    background: "#64748b",
                    color: "#fff",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditTeacher(selectedTeacher);
                  }}
                  style={{
                    padding: "9px 16px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ✏️ Edit Teacher
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  color,
  background,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  background: string;
}) {
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
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            marginBottom: 3,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon,
  title,
  background,
  color,
  onClick,
}: {
  icon: string;
  title: string;
  background: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        border: "none",
        borderRadius: 6,
        background,
        color,
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

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          marginBottom: 6,
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#ef4444",
              marginLeft: 3,
            }}
          >
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 11px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          outline: "none",
          fontSize: 12,
          color: "#334155",
          background: disabled ? "#f8fafc" : "#fff",
        }}
      />
    </div>
  );
}

/* =========================================================
   FORM SELECT
========================================================= */

function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          marginBottom: 6,
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#ef4444",
              marginLeft: 3,
            }}
          >
            *
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 11px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          outline: "none",
          fontSize: 12,
          color: value ? "#334155" : "#94a3b8",
          background: "#fff",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   MODAL OVERLAY
========================================================= */

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: "11px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#64748b",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#334155",
          textAlign: "right",
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
}
