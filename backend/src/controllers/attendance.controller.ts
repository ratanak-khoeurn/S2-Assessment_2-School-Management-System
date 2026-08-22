import { Request, Response } from "express";
import { Attendance, User, Course } from "../models/index.js";

// GET /api/attendance
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { date, courseId, studentId, status } = req.query;

    const whereClause: any = {};
    if (date) whereClause.date = date;
    if (courseId) whereClause.courseId = courseId;
    if (studentId) whereClause.studentId = studentId;
    if (status && status !== "All") whereClause.status = status;

    const records = await Attendance.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "Student",
          attributes: ["id", "name", "email", "phone", "subject"],
        },
        {
          model: Course,
          as: "Course",
          attributes: ["id", "courseName", "department", "room"],
        },
      ],
      order: [["date", "DESC"], ["id", "DESC"]],
    });

    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/attendance/batch (Mark attendance for multiple students)
export const markBatchAttendance = async (req: Request, res: Response) => {
  try {
    const { courseId, date, records } = req.body;
    // records: [{ studentId, status, remarks }]

    if (!courseId || !date || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "courseId, date, and records array are required",
      });
    }

    const savedRecords = [];

    for (const item of records) {
      const [record, _created] = await Attendance.findOrCreate({
        where: {
          courseId: Number(courseId),
          studentId: Number(item.studentId),
          date,
        },
        defaults: {
          status: item.status || "Present",
          remarks: item.remarks || null,
        },
      });

      if (!_created) {
        await record.update({
          status: item.status || record.status,
          remarks: item.remarks !== undefined ? item.remarks : record.remarks,
        });
      }

      savedRecords.push(record);
    }

    res.status(200).json({
      success: true,
      data: savedRecords,
      message: "Attendance recorded successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/attendance (Single record)
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, date, status, remarks } = req.body;

    if (!studentId || !courseId || !date) {
      return res.status(400).json({
        success: false,
        message: "studentId, courseId, and date are required",
      });
    }

    const record = await Attendance.create({
      studentId: Number(studentId),
      courseId: Number(courseId),
      date,
      status: status || "Present",
      remarks: remarks || null,
    });

    res.status(201).json({
      success: true,
      data: record,
      message: "Attendance recorded successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/attendance/:id
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, remarks, date } = req.body;

    const record = await Attendance.findByPk(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    await record.update({
      status: status ?? record.status,
      remarks: remarks !== undefined ? remarks : record.remarks,
      date: date ?? record.date,
    });

    res.status(200).json({
      success: true,
      data: record,
      message: "Attendance updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/attendance/:id
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const record = await Attendance.findByPk(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    await record.destroy();
    res.status(200).json({ success: true, message: "Attendance record deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
