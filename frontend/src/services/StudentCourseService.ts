// src/services/studentCourseService.ts
import type { ICourse } from "@interfaces/models/ICourse";
import { course, studentCourse } from "../lib/api";
import type { IStudentCourse, IStudentCourseListRequest } from "@interfaces";

// Get all students enrolled in a specific course
export const getStudentsByCourse = async (courseCode: string): Promise<IStudentCourseListRequest[]> => {
  const response = await studentCourse.get(`/course/${courseCode}`);
  return response.data;
};

// Get course details
export const getCourseDetails = async (courseCode: string): Promise<ICourse> => {
  const response = await course.get(`/code/${courseCode}`);
  return response.data;
};

// Get all courses a student is enrolled in
export const getCoursesByStudent = async (studentUserId: string): Promise<IStudentCourseListRequest[]> => {
  const response = await studentCourse.get(`/student/${studentUserId}`);
  return response.data;
};

// Enroll a student in a course (Admin only)
export const enrollStudentInCourse = async (data: { StudentUserId: string; CourseCode: string }) => {
  const response = await studentCourse.post("/enroll", data);
  return response.data;
};

// Remove a student from a course
export const removeStudentFromCourse = async (studentUserId: string, courseCode: string) => {
  const response = await studentCourse.delete(`/delete?studentUserId=${studentUserId}&courseCode=${courseCode}`);
  return response.data;
};

// Update a student's grade
export const updateStudentGrade = async (data: { StudentUserId: string; CourseCode: string; Grade: number }) => {
  const response = await studentCourse.put("/update", data);
  return response.data;
};

// Get all student-course enrollments
export const getAllEnrollments = async (): Promise<IStudentCourse[]> => {
  const response = await studentCourse.get("/all");
  return response.data;
};
