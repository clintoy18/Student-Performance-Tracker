export interface IUserStatistics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
}

export interface IDashboardStats {
  userStats: IUserStatistics;
  totalCourses: number;
}
