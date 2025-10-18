import type { ICourse } from "@interfaces/models/ICourse";
import { course } from "../lib/api";

export const getAllCourses = async () => {
    const response = await course.get('/list');
    return response.data;
};

export const fetchCourseByCourseCode = async (courseCode: string) => {
    const response = await course.get(`/code/${courseCode}`);
    return response.data;
};

export const addCourse = async (courseData: Partial<ICourse>) => {
    const response = await course.post('/add', {
        CourseCode: courseData.CourseCode,
        CourseName: courseData.CourseName,
        CourseDescription: courseData.CourseDescription,
        UserId: courseData.TeacherUserId
    });
    return response.data;
};

export const updateCourse = async (courseData: Partial<ICourse>) => {
    const response = await course.put('/update', {
        Id: courseData.Id,
        CourseCode: courseData.CourseCode,
        CourseName: courseData.CourseName,
        CourseDescription: courseData.CourseDescription,
        UserId: courseData.TeacherUserId
    });
    return response.data;
};

export const deleteCourseByCourseCode = async (courseCode: string) => {
    const response = await course.delete(`/delete/code/${courseCode}`);
    return response.data;
};

export const checkCourseCodeExists = async (courseCode: string): Promise<boolean> => {
    try {
        await course.get(`/code/${courseCode}`);
        return true; // Course exists
    } catch (error: any) {
        if (error.response?.status === 404) {
            return false; // Course doesn't exist
        }
        throw error; // Other errors
    }
};

// Get single course by ID
export const getCourseById = async (id: number) => {
  const response = await course.get(`/${id}`);
  return response.data;
};

// Delete a course
export const deleteCourse = async (id: number) => {
  const response = await course.delete(`/${id}`);
  return response.data;
};
