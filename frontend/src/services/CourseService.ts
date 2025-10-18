// src/services/courseService.ts
import { api } from "../lib/api";

// TypeScript interfaces (optional but recommended)
export interface ICourse {
  id?: number;
  courseCode: string;
  courseName: string;
  courseDescription: string;
  userId?: string; // Teacher ID
  createdAt?: string;
}

// Get all courses
export const getAllCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// Get single course by ID
export const getCourseById = async (id: number) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Create new course
export const createCourse = async (courseData: ICourse) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

// Update a course
export const updateCourse = async (id: number, courseData: ICourse) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

// Delete a course
export const deleteCourse = async (id: number) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};
