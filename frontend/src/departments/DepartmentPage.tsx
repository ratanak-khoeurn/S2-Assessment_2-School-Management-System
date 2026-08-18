import React, { useState } from "react";

// =========================
// TYPES & INTERFACES
// =========================

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  budget: string;
  status: "Active" | "Inactive";
}

// =========================
// MOCK DATA
// =========================

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "DEP-001",
    code: "CS",
    name: "Computer Science",
    headOfDepartment: "Dr. Sarah Jenkins",
    totalTeachers: 14,
    totalStudents: 320,
    totalCourses: 12,
    budget: "$120,000",
    status: "Active",
  },
  {
    id: "DEP-002",
    code: "MATH",
    name: "Mathematics",
    headOfDepartment: "Prof. Robert Chen",
    totalTeachers: 10,
    totalStudents: 240,
    totalCourses: 8,
    budget: "$95,000",
    status: "Active",
  },
  {
    id: "DEP-003",
    code: "PHYS",
    name: "Physics & Astronomy",
    headOfDepartment: "Dr. Elena Rostova",
    totalTeachers: 8,
    totalStudents: 180,
    totalCourses: 6,
    budget: "$110,000",
    status: "Active",
  },
  {
    id: "DEP-004",
    code: "ENG",
    name: "English Literature",
    headOfDepartment: "Dr. Marcus Vance",
    totalTeachers: 12,
    totalStudents: 290,
    totalCourses: 9,
    budget: "$80,000",
    status: "Active",
  },
  {
    id: "DEP-005",
    code: "CHEM",
    name: "Chemistry",
    headOfDepartment: "Dr. Alan Grant",
    totalTeachers: 9,
    totalStudents: 150,
    totalCourses: 7,
    budget: "$105,000",
    status: "Inactive",
  },
];

export default function DepartmentPage() {
  const [departments, setDepartments] =
    useState<Department[]>(INITIAL_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(
    null,
  );
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);

  // Form State (used for Add and Edit)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headOfDepartment: "",
    budget: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Filter Logic
  const filteredDepartments = departments.filter(
    (dep) =>
      dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // =========================
  // ACTION HANDLERS
  // =========================

  // Create
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newDep: Department = {
      id: `DEP-00${departments.length + 1}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      headOfDepartment: formData.headOfDepartment || "Unassigned",
      totalTeachers: 0,
      totalStudents: 0,
      totalCourses: 0,
      budget: formData.budget.startsWith("$")
        ? formData.budget
        : `$${formData.budget || "0"}`,
      status: formData.status,
    };

    setDepartments([newDep, ...departments]);
    resetForm();
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (dep: Department) => {
    setEditingDepartment(dep);
    setFormData({
      name: dep.name,
      code: dep.code,
      headOfDepartment: dep.headOfDepartment,
      budget: dep.budget.replace("$", ""),
      status: dep.status,
    });
  };

  // Update
  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;

    const updatedList = departments.map((dep) => {
      if (dep.id === editingDepartment.id) {
        return {
          ...dep,
          name: formData.name,
          code: formData.code.toUpperCase(),
          headOfDepartment: formData.headOfDepartment,
          budget: formData.budget.startsWith("$")
            ? formData.budget
            : `$${formData.budget}`,
          status: formData.status,
        };
      }
      return dep;
    });

    setDepartments(updatedList);
    setEditingDepartment(null);
    resetForm();
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deletingDepartment) return;
    setDepartments(
      departments.filter((dep) => dep.id !== deletingDepartment.id),
    );
    setDeletingDepartment(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      headOfDepartment: "",
      budget: "",
      status: "Active",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, margin: 20 }}>
      {/* ================= HEADER & ACTIONS ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
            Departments
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Manage academic departments, department heads, and allocations.
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.25)",
          }}
        >
          <span>＋</span> Add Department
        </button>
      </div>

      {/* ================= CONTROLS BAR ================= */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "14px 18px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search department, code, or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              fontSize: 13,
              outline: "none",
              color: "#1e293b",
            }}
          />
        </div>

        {/* View Switcher Toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#f1f5f9",
            padding: 3,
            borderRadius: 6,
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            style={{
              border: "none",
              background: viewMode === "grid" ? "#fff" : "transparent",
              color: viewMode === "grid" ? "#1e293b" : "#64748b",
              borderRadius: 4,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                viewMode === "grid" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
            }}
          >
            田 Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={{
              border: "none",
              background: viewMode === "table" ? "#fff" : "transparent",
              color: viewMode === "table" ? "#1e293b" : "#64748b",
              borderRadius: 4,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
            }}
          >
            ☰ List
          </button>
        </div>
      </div>

      {/* ================= GRID VIEW ================= */}
      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {filteredDepartments.map((dep) => (
            <div
              key={dep.id}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        background: "#eff6ff",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        border: "1px solid #bfdbfe",
                      }}
                    >
                      {dep.code}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {dep.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {dep.id}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 12,
                      background:
                        dep.status === "Active" ? "#dcfce7" : "#f1f5f9",
                      color: dep.status === "Active" ? "#15803d" : "#64748b",
                    }}
                  >
                    {dep.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    marginBottom: 16,
                    padding: "8px 12px",
                    background: "#f8fafc",
                    borderRadius: 6,
                  }}
                >
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>Head: </span>
                  <strong>{dep.headOfDepartment}</strong>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "8px 4px",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {dep.totalTeachers}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>
                      Teachers
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "8px 4px",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {dep.totalStudents}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>
                      Students
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "8px 4px",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {dep.totalCourses}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>
                      Courses
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 12,
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Budget:{" "}
                  <strong style={{ color: "#0f172a" }}>{dep.budget}</strong>
                </div>

                {/* ACTION BUTTONS (GRID) */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setViewingDepartment(dep)}
                    title="View Details"
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      color: "#3b82f6",
                      borderRadius: 4,
                      padding: "6px 8px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleOpenEdit(dep)}
                    title="Edit Department"
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      color: "#f59e0b",
                      borderRadius: 4,
                      padding: "6px 8px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeletingDepartment(dep)}
                    title="Delete Department"
                    style={{
                      background: "#fef2f2",
                      border: "none",
                      color: "#ef4444",
                      borderRadius: 4,
                      padding: "6px 8px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Code / Name
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Head of Dept
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Teachers
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Students
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Annual Budget
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dep, index) => (
                <tr
                  key={dep.id}
                  style={{
                    borderBottom:
                      index < filteredDepartments.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <td style={{ padding: "14px 18px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: 13,
                      }}
                    >
                      {dep.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {dep.code} • {dep.id}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontSize: 13,
                      color: "#334155",
                    }}
                  >
                    {dep.headOfDepartment}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontSize: 13,
                      color: "#334155",
                    }}
                  >
                    {dep.totalTeachers}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontSize: 13,
                      color: "#334155",
                    }}
                  >
                    {dep.totalStudents}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {dep.budget}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 12,
                        background:
                          dep.status === "Active" ? "#dcfce7" : "#f1f5f9",
                        color: dep.status === "Active" ? "#15803d" : "#64748b",
                      }}
                    >
                      {dep.status}
                    </span>
                  </td>
                  {/* ACTION BUTTONS (TABLE) */}
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 6,
                      }}
                    >
                      <button
                        onClick={() => setViewingDepartment(dep)}
                        title="View Details"
                        style={{
                          background: "#f1f5f9",
                          border: "none",
                          borderRadius: 4,
                          padding: "6px 8px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleOpenEdit(dep)}
                        title="Edit Department"
                        style={{
                          background: "#f1f5f9",
                          border: "none",
                          borderRadius: 4,
                          padding: "6px 8px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeletingDepartment(dep)}
                        title="Delete Department"
                        style={{
                          background: "#fef2f2",
                          border: "none",
                          borderRadius: 4,
                          padding: "6px 8px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {viewingDepartment && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Department Details
              </div>
              <button
                onClick={() => setViewingDepartment(null)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: "#eff6ff",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "1px solid #bfdbfe",
                }}
              >
                {viewingDepartment.code}
              </div>
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}
                >
                  {viewingDepartment.name}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {viewingDepartment.id}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#f8fafc",
                padding: 14,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Head of Dept:</span>
                <strong style={{ color: "#1e293b" }}>
                  {viewingDepartment.headOfDepartment}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Status:</span>
                <strong
                  style={{
                    color:
                      viewingDepartment.status === "Active"
                        ? "#16a34a"
                        : "#64748b",
                  }}
                >
                  {viewingDepartment.status}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Annual Budget:</span>
                <strong style={{ color: "#1e293b" }}>
                  {viewingDepartment.budget}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Total Teachers:</span>
                <strong style={{ color: "#1e293b" }}>
                  {viewingDepartment.totalTeachers}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Total Students:</span>
                <strong style={{ color: "#1e293b" }}>
                  {viewingDepartment.totalStudents}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>Total Courses:</span>
                <strong style={{ color: "#1e293b" }}>
                  {viewingDepartment.totalCourses}
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 18,
              }}
            >
              <button
                onClick={() => setViewingDepartment(null)}
                style={secondaryButtonStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT FORM MODAL ================= */}
      {(isAddModalOpen || editingDepartment) && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDepartment(null);
                }}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                editingDepartment
                  ? handleUpdateDepartment
                  : handleCreateDepartment
              }
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div>
                <label style={labelStyle}>Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biological Sciences"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIO"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Head of Department</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.headOfDepartment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      headOfDepartment: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <label style={labelStyle}>Annual Budget ($)</label>
                  <input
                    type="text"
                    placeholder="e.g. 90,000"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "Inactive",
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDepartment(null);
                  }}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={primaryButtonStyle}>
                  {editingDepartment ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingDepartment && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalCardStyle, maxWidth: 400 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: 8,
              }}
            >
              Delete Department
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#475569",
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              Are you sure you want to delete{" "}
              <strong>{deletingDepartment.name}</strong> (
              {deletingDepartment.code})? This action cannot be undone.
            </div>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                onClick={() => setDeletingDepartment(null)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{ ...primaryButtonStyle, background: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// REUSABLE STYLES
// =========================

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  width: "100%",
  maxWidth: 450,
  padding: 24,
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 16,
  color: "#94a3b8",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#475569",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
