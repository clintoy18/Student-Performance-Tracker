import { studentCourse } from "lib/api"

export const fetchCoursesOfStudent = async(studentUserId: string) => {
    const response = await studentCourse.get(`student/${studentUserId}`)
    return response.data
}