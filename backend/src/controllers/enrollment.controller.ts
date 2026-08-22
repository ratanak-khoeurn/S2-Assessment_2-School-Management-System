import { Request, Response } from "express";
import { Enrollment, User, Course } from "../models/index.js";

// GET /api/enrollments
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, status } = req.query;

    const whereClause: any = {};
    if (studentId) whereClause.studentId = studentId;
    if (courseId) whereClause.courseId = courseId;
    if (status && status !== "All") whereClause.status = status;

    const enrollments = await Enrollment.findAll({
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
          attributes: ["id", "courseName", "department", "schedule", "room"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ success: true, data: enrollments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/enrollments
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, studentIds, courseId, status } = req.body;

    if (!courseId || (!studentId && (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0))) {
      return res.status(400).json({ success: false, message: "courseId and studentId or studentIds are required" });
    }

    const cId = Number(courseId);
    const targetStudentIds: number[] = studentIds && Array.isArray(studentIds)
      ? studentIds.map(Number)
      : [Number(studentId)];

    // Check for each student
    const createdEnrollments = [];
    const skippedStudents = [];

    for (const sId of targetStudentIds) {
      const existing = await Enrollment.findOne({
        where: { studentId: sId, courseId: cId },
      });

      if (existing) {
        skippedStudents.push(sId);
      } else {
        const item = await Enrollment.create({
          studentId: sId,
          courseId: cId,
          status: status || "active",
        });
        createdEnrollments.push(item);
      }
    }

    res.status(201).json({
      success: true,
      data: createdEnrollments,
      count: createdEnrollments.length,
      skipped: skippedStudents.length,
      message: `Successfully enrolled ${createdEnrollments.length} student(s)${
        skippedStudents.length > 0 ? ` (${skippedStudents.length} already enrolled)` : ""
      }`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/enrollments/:id
export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, courseId } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    await enrollment.update({
      status: status !== undefined ? status : enrollment.status,
      courseId: courseId !== undefined ? Number(courseId) : enrollment.courseId,
    });

    res.status(200).json({
      success: true,
      data: enrollment,
      message: "Enrollment updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/enrollments/:id
export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    await enrollment.destroy();
    res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
