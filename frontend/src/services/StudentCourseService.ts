// src/services/studentCourseService.ts
import { api } from "../lib/api";

//refactor to interfaces
export interface ICourse {
  id: number;
  courseCode: string;
  courseName: string;
  courseDescription: string;
}

export interface IStudentCourse {
  studentCourseId: string;
  userId: string;
  courseCode: string;
  grade: number | null;
  course: ICourse | null;
}


// Get all students enrolled in a specific course
export const getStudentsByCourse = async (courseCode: string): Promise<IStudentCourse[]> => {
  const response = await api.get(`/student-course/course/${courseCode}`);
  return response.data;
};

// Get course details
export const getCourseDetails = async (courseCode: string): Promise<ICourse> => {
  const response = await api.get(`/course/${courseCode}`);
  return response.data;
};

// Get all courses a student is enrolled in
export const getCoursesByStudent = async (studentUserId: string): Promise<IStudentCourse[]> => {
  const response = await api.get(`/student-course/student/${studentUserId}`);
  return response.data;
};

// Enroll a student in a course
export const enrollStudentInCourse = async (data: IStudentCourse) => {
  const response = await api.post("/student-course/enroll", data);
  return response.data;
};

// Remove a student from a course
export const removeStudentFromCourse = async (studentUserId: string, courseCode: string) => {
  const response = await api.delete(`/student-course/delete?studentUserId=${studentUserId}&courseCode=${courseCode}`);
  return response.data;
};

// Update a student's grade
export const updateStudentGrade = async (studentUserId: string, courseCode: string, grade: number) => {
  const response = await api.put(`/student-course/grades/update?studentUserId=${studentUserId}&courseCode=${courseCode}`, grade);
  return response.data;
};

// Optional: get all student-course enrollments
export const getAllEnrollments = async (): Promise<IStudentCourse[]> => {
  const response = await api.get("/student-course/all");
  return response.data;
};
