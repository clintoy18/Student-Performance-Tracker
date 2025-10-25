using ASI.Basecode.Services.ServiceModels;
using System.Collections.Generic;

public interface IPdfService
{
    byte[] GenerateSimplePdf(string title, string message);
    void GenerateAndSavePdf(string filePath, string title, string message);
    byte[] GenerateUserReport(UserStatisticsViewModel stats, List<UserViewAdminModel> users);
}
