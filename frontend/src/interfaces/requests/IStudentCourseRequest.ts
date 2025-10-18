import type { ICourse } from "@interfaces/models/ICourse"

export interface IStudentCourseListRequest {
    studentCourseId: string
    studentUserId: string
    courseCode: string
    grade: number
    firstName: string
    middleName: string
    lastName: string
    program: string
    course: ICourse
}