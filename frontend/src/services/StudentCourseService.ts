// src/services/studentCourseService.ts
import { api } from "../lib/api";

export interface IStudentCourse {
  id?: number;
  studentId: string;
  courseId: number;
  enrolledAt?: string;
}

// // Get all students enrolled in a course
// export const getStudentsByCourse = async (courseId: number) => {
//   const response = await api.get(`/courses/${courseId}/students`);
//   return response.data;
// };

// Get all courses of a student
export const getCoursesByStudent = async (studentId: string) => {
  const response = await api.get(`/students/${studentId}/courses`);
  return response.data;
};

// Enroll a student in a course
export const enrollStudentInCourse = async (data: IStudentCourse) => {
  const response = await api.post("/student-courses", data);
  return response.data;
};

// Remove a student from a course
export const removeStudentFromCourse = async (studentId: string, courseId: number) => {
  const response = await api.delete(`/student-courses/${studentId}/${courseId}`);
  return response.data;
};
