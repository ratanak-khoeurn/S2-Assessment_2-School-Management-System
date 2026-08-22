import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export interface StudentAttendanceRow {
  studentId: number;
  studentCode: string;
  name: string;
  email: string;
  department: string;
  status: AttendanceStatus;
  remarks: string;
}

interface CourseItem {
  id: number;
  courseName: string;
  enrollmentCode: string;
  department: string;
}

export default function AttendancePage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [roster, setRoster] = useState<StudentAttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Fetch available Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/subjects`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCourses(json.data);
          setSelectedCourseId(json.data[0].id);
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
      }
    };
    fetchCourses();
  }, []);

  // 2. Fetch enrolled students and attendance records for the selected course and date
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchRosterAndAttendance = async () => {
      try {
        setLoading(true);
        // Fetch enrollments for this course
        const enrRes = await fetch(`${API_BASE_URL}/enrollments?courseId=${selectedCourseId}`);
        const enrJson = await enrRes.json();

        // Fetch attendance logs for this course on selectedDate
        const attRes = await fetch(`${API_BASE_URL}/attendance?courseId=${selectedCourseId}&date=${selectedDate}`);
        const attJson = await attRes.json();

        const attendanceMap = new Map<number, { status: AttendanceStatus; remarks: string }>();
        if (attJson.success && Array.isArray(attJson.data)) {
          attJson.data.forEach((a: any) => {
            attendanceMap.set(a.studentId, {
              status: (a.status || "Present") as AttendanceStatus,
              remarks: a.remarks || "",
            });
          });
        }

        if (enrJson.success && Array.isArray(enrJson.data)) {
          const rows: StudentAttendanceRow[] = enrJson.data.map((e: any) => {
            const stu = e.Student;
            const existingAtt = attendanceMap.get(e.studentId);
            return {
              studentId: e.studentId,
              studentCode: `STU-${String(e.studentId).padStart(3, "0")}`,
              name: stu ? stu.name : "Unknown Student",
              email: stu ? stu.email : "",
              department: stu ? (stu.subject || "Computer Science") : "General",
              status: existingAtt ? existingAtt.status : "Present",
              remarks: existingAtt ? existingAtt.remarks : "",
            };
          });
          setRoster(rows);
        } else {
          setRoster([]);
        }
      } catch (err) {
        console.error("Fetch roster error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRosterAndAttendance();
  }, [selectedCourseId, selectedDate]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setRoster((curr) =>
      curr.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
    setSavedSuccess(false);
  };

  const handleRemarkChange = (studentId: number, remarks: string) => {
    setRoster((curr) =>
      curr.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
    setSavedSuccess(false);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setRoster((curr) => curr.map((r) => ({ ...r, status })));
    setSavedSuccess(false);
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourseId) return;

    try {
      const records = roster.map((r) => ({
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks,
      }));

      const res = await fetch(`${API_BASE_URL}/attendance/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          date: selectedDate,
          records,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.message || "Failed to save attendance");
      }
    } catch (err) {
      console.error("Save attendance error:", err);
    }
  };

  // Stats calculation
  const total = roster.length;
  const present = roster.filter((r) => r.status === "Present").length;
  const absent = roster.filter((r) => r.status === "Absent").length;
  const late = roster.filter((r) => r.status === "Late").length;
  const excused = roster.filter((r) => r.status === "Excused").length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0f172a" }}>
            Attendance Management
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, margin: 0 }}>
            Record and monitor student class attendance, absences, and excuses.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {savedSuccess && (
            <span style={{ fontSize: 13, color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              ✅ Saved Successfully!
            </span>
          )}
          <button
            onClick={handleSaveAttendance}
            disabled={roster.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: roster.length > 0 ? "#2563eb" : "#94a3b8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: roster.length > 0 ? "pointer" : "not-allowed",
              boxShadow: roster.length > 0 ? "0 2px 6px rgba(37,99,235,0.3)" : "none",
            }}
          >
            💾 Save Attendance
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        <StatWidget icon="📊" label="Attendance Rate" value={`${rate}%`} color="#3b82f6" bg="#eff6ff" />
        <StatWidget icon="✅" label="Present" value={present} color="#10b981" bg="#ecfdf5" />
        <StatWidget icon="❌" label="Absent" value={absent} color="#ef4444" bg="#fef2f2" />
        <StatWidget icon="⏰" label="Late" value={late} color="#f59e0b" bg="#fffbeb" />
        <StatWidget icon="📝" label="Excused" value={excused} color="#8b5cf6" bg="#f5f3ff" />
      </div>

      {/* Filters & Actions Bar */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Select Subject / Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 13,
                  background: "#fff",
                  outline: "none",
                  minWidth: 260,
                }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseName} ({c.enrollmentCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "7px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Quick Mark All Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Quick Mark:</span>
            <button
              onClick={() => handleMarkAll("Present")}
              disabled={roster.length === 0}
              style={{ padding: "6px 12px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll("Absent")}
              disabled={roster.length === 0}
              style={{ padding: "6px 12px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Attendance Sheet Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Student ID", "Student Name", "Department", "Attendance Status", "Remarks / Notes"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontSize: 11, fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roster.map((student, idx) => (
                <tr key={student.studentId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{idx + 1}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#2563eb" }}>
                    {student.studentCode}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{student.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
                    {student.department}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["Present", "Absent", "Late", "Excused"] as AttendanceStatus[]).map((st) => {
                        const isSelected = student.status === st;
                        const colors = {
                          Present: { bg: "#ecfdf5", border: "#10b981", text: "#059669" },
                          Absent: { bg: "#fef2f2", border: "#ef4444", text: "#dc2626" },
                          Late: { bg: "#fffbeb", border: "#f59e0b", text: "#d97706" },
                          Excused: { bg: "#f5f3ff", border: "#8b5cf6", text: "#7c3aed" },
                        }[st];

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, st)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              border: isSelected ? `1.5px solid ${colors.border}` : "1px solid #e2e8f0",
                              background: isSelected ? colors.bg : "#fff",
                              color: isSelected ? colors.text : "#64748b",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <input
                      type="text"
                      placeholder="Add note (optional)..."
                      value={student.remarks}
                      onChange={(e) => handleRemarkChange(student.studentId, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        fontSize: 12,
                        width: 200,
                        outline: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}
              {roster.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    {loading ? "Loading enrolled roster..." : "No students enrolled in this subject yet. Please enroll students first."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
