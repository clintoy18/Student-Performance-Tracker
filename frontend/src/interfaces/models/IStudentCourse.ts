import type { ICourse } from "./ICourse";

export interface IStudentCourse {
  StudentCourseId?: string;
  StudentUserId: string;
  CourseCode: string;
  Grade: number | null;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Program?: string;
  Course?: ICourse | null;
}
