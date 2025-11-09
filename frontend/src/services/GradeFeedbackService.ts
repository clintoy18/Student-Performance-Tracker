import type { IFeedbackCreateRequest, IGradeFeedback } from "@interfaces";
import { feedback } from "../lib/api";

export const createFeedbackAsTeacher = async (request: IFeedbackCreateRequest) => {
    const response = await feedback.post('create/', request)
    return response.data
}

export const updateFeedbackAsTeacher = async (feedbackId: number, feedbackText: string) => {
    const response = await feedback.put(`update/${feedbackId}`, { feedback: feedbackText })
    return response.data
}

export const getFeedbackForStudent = async (studentUserId: string, courseCode: string): Promise<IGradeFeedback> => {
    const response = await feedback.get(`student/${studentUserId}/course/${courseCode}`)
    return response.data
}

export const checkFeedbackExists = async (studentUserId: string, courseCode: string): Promise<boolean> => {
    const response = await feedback.get(`exists/student/${studentUserId}/course/${courseCode}`)
    return response.data.exists
}