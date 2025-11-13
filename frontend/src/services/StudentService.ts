import type { IStudentFeedbackRequest } from "@interfaces/requests/IStudentFeedbackRequest"
import { course, feedback, studentCourse } from "../lib/api"

export const fetchCoursesOfStudent = async(studentUserId: string) => {
    const response = await studentCourse.get(`student/${studentUserId}`)
    return response.data
}

export const createStudentFeedback = async(request: IStudentFeedbackRequest) => {
    const response = await feedback.post(`student/create`, request)
    return response.data
}

export const checkStudentFeedbackExists = async(studentUserId: string, courseCode: string) => {
    const response = await feedback.get(`student/exists/student/${studentUserId}/course/${courseCode}`, { studentUserId, courseCode })
    return response.data.exists
}