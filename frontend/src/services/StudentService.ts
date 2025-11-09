import type { IStudentFeedbackRequest } from "@interfaces/requests/IStudentFeedbackRequest"
import { feedback, studentCourse } from "lib/api"

export const fetchCoursesOfStudent = async(studentUserId: string) => {
    const response = await studentCourse.get(`student/${studentUserId}`)
    return response.data
}

export const createStudentFeedback = async(request: IStudentFeedbackRequest) => {
    const response = await feedback.put(`student/create`,
        { request }
    )
    return response.data
}