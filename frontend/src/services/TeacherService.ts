// src/services/teacherService.ts
import { teacher, course, studentCourse, feedback } from "../lib/api";
import type { ICourse } from "@interfaces/models/ICourse";
import type { IStudentCourseListRequest } from "@interfaces";

// ==================== Dashboard Stats ====================

export interface ITeacherStats {
  totalCourses: number;
  totalStudents: number;
  courses: {
    courseCode: string;
    courseName: string;
    studentCount: number;
  }[];
}

/**
 * Get dashboard statistics for the logged-in teacher
 */
export const getTeacherDashboardStats = async (): Promise<ITeacherStats> => {
  const response = await teacher.get("/dashboard-stats");
  return response.data;
};

// ==================== Teacher's Courses ====================

export interface ITeacherCourse extends ICourse {
  studentCount: number;
}

/**
 * Get all courses assigned to the logged-in teacher
 */
export const getTeacherCourses = async (): Promise<ITeacherCourse[]> => {
  const response = await teacher.get("/my-courses");
  return response.data;
};

/**
 * Create a new course (assigned to the teacher)
 */
export const createCourse = async (data: {
  courseCode: string;
  courseName: string;
  courseDescription?: string;
  userId: string; // Teacher's userId
}) => {
  const response = await course.post("/add", data);
  return response.data;
};

/**
 * Update a course (teacher must own the course)
 */
export const updateCourse = async (data: {
  id: number;
  courseName: string;
  courseDescription?: string;
  userId: string;
}) => {
  const response = await course.put("/update", data);
  return response.data;
};

/**
 * Delete a course (teacher must own the course)
 */
export const deleteCourse = async (courseId: number) => {
  const response = await course.delete(`/delete/${courseId}`);
  return response.data;
};

// ==================== Students in Teacher's Courses ====================

/**
 * Get all students enrolled in a specific course
 * Teacher must own the course
 */
export const getStudentsInCourse = async (courseCode: string): Promise<IStudentCourseListRequest[]> => {
  const response = await studentCourse.get(`/course/${courseCode}`);
  return response.data;
};

/**
 * Update a student's grade in teacher's course
 */
export const updateStudentGrade = async (data: {
  studentUserId: string;
  courseCode: string;
  grade: number;
}) => {
  const response = await studentCourse.put("/update", data);
  return response.data;
};

// ==================== Teacher's Feedback ====================

export interface IGradeFeedback {
  id: number;
  feedback: string;
  studentCourseId: string;
  createdTime: string;
  teacherUserId: string;
  teacherName: string;
  courseCode: string;
  courseName: string;
}

/**
 * Get all feedback given by the logged-in teacher
 */
export const getTeacherFeedback = async (): Promise<IGradeFeedback[]> => {
  const response = await teacher.get("/my-feedback");
  return response.data;
};

/**
 * Create feedback for a student in teacher's course
 */
export const createFeedback = async (data: {
  feedback: string;
  courseStudentUserId: string;
  courseCode: string;
}) => {
  const response = await feedback.post("/create", data);
  return response.data;
};

/**
 * Update feedback (teacher must own the feedback)
 */
export const updateFeedback = async (feedbackId: number, feedbackText: string) => {
  const response = await feedback.put(`/update/${feedbackId}`, {
    feedback: feedbackText,
  });
  return response.data;
};

/**
 * Delete feedback (teacher must own the feedback)
 */
export const deleteFeedback = async (feedbackId: number) => {
  const response = await feedback.delete(`/delete/${feedbackId}`);
  return response.data;
};

// ==================== Helper Functions ====================

/**
 * Check if a course belongs to the logged-in teacher
 */
export const isTeacherCourse = async (courseCode: string, teacherUserId: string): Promise<boolean> => {
  const courses = await getTeacherCourses();
  return courses.some((c) => c.CourseCode === courseCode && c.TeacherUserId === teacherUserId);
};

/**
 * Get student count for a specific course
 */
export const getStudentCount = async (courseCode: string): Promise<number> => {
  const students = await getStudentsInCourse(courseCode);
  return students.length;
};