using ASI.Basecode.Services.ServiceModels;
using System.Collections.Generic;
using static ASI.Basecode.Resources.Constants.Enums;

public interface IPdfService
{
    byte[] GenerateSimplePdf(string title, string message);
    void GenerateAndSavePdf(string filePath, string title, string message);
    //byte[] GenerateUserReport(UserStatisticsViewModel stats, List<UserViewAdminModel> users);
    byte[] GenerateDashboardSummaryReport(
        DashboardStatsViewModel dashboardStats,
        List<UserViewAdminModel> userLists,
        List<CourseViewModel> courses,
        UserRoles? roleFilter = null);

    byte[] GenerateCourseGradeSummary(List<CourseGradesViewModel> coursesGrades, string title = "Grades Summary Report");

    public byte[] GenerateGradesByCourse(CourseGradesViewModel courseGrades, string title = "Student Grades Report");



}
