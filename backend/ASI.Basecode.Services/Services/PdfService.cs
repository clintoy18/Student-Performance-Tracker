using System.IO;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using System.Collections.Generic;
using System.Linq.Expressions;
using System;
using System.Linq;
using ASI.Basecode.Resources.Constants;
using static ASI.Basecode.Resources.Constants.Enums;


namespace ASI.Basecode.Services.Services
{
    public class PdfService : IPdfService
    {
        public byte[] GenerateSimplePdf(string title, string message)
        {
            try
            {
                // Basic sanity checks
                if (title == null) title = "Untitled PDF";
                if (message == null) message = "No message provided.";

                // Create a new PDF document
                var document = new PdfDocument();
                if (document == null)
                    throw new Exception("PdfDocument creation failed");

                var page = document.AddPage();
                if (page == null)
                    throw new Exception("AddPage() returned null");

                var gfx = XGraphics.FromPdfPage(page);
                if (gfx == null)
                    throw new Exception("XGraphics creation failed");

                // Use safe built-in font
                var titleFont = new XFont("Arial", 18, XFontStyle.Bold);
                var textFont = new XFont("Arial", 12, XFontStyle.Regular);

                gfx.DrawString(title, titleFont, XBrushes.Black,
                    new XRect(0, 40, page.Width, 40), XStringFormats.TopCenter);

                gfx.DrawString(message, textFont, XBrushes.Black,
                    new XRect(40, 100, page.Width - 80, page.Height - 140),
                    XStringFormats.TopLeft);

                using (var stream = new MemoryStream())
                {
                    document.Save(stream, false);
                    return stream.ToArray();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inside GenerateSimplePdf: {ex.Message}", ex);
            }
        }


        public void GenerateAndSavePdf(string filePath, string title, string message)
        {
            var pdfBytes = GenerateSimplePdf(title, message);
            File.WriteAllBytes(filePath, pdfBytes);
        }

        /// <summary>
        /// Generates a full admin user report (real data from UserService)
        /// </summary>
        //     public byte[] GenerateUserReport(UserStatisticsViewModel stats, List<UserViewAdminModel> users)
        //{
        //    if (stats == null)
        //        throw new ArgumentNullException(nameof(stats), "stats is null in GenerateUserReport");
        //    if (users == null)
        //        throw new ArgumentNullException(nameof(users), "users list is null in GenerateUserReport");
        //    if (users.Any(u => u == null))
        //        throw new ArgumentException("One or more users in the list are null", nameof(users));

        //    using (var document = new PdfDocument())
        //    {
        //        PdfPage page = document.AddPage();
        //        XGraphics gfx = XGraphics.FromPdfPage(page);

        //        var titleFont = new XFont("Verdana", 18, XFontStyle.Bold);
        //        var headerFont = new XFont("Verdana", 14, XFontStyle.Bold);
        //        var textFont = new XFont("Verdana", 12, XFontStyle.Regular);

        //        // Title
        //        gfx.DrawString("User Summary Report", titleFont, XBrushes.Black,
        //            new XRect(0, 40, page.Width, 40), XStringFormats.TopCenter);

        //        double y = 100;
        //        gfx.DrawString("📊 System Overview", headerFont, XBrushes.Black, new XPoint(40, y));
        //        y += 25;
        //        gfx.DrawString($"Total Users: {stats.TotalUsers}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        //        gfx.DrawString($"Total Students: {stats.TotalStudents}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        //        gfx.DrawString($"Total Teachers: {stats.TotalTeachers}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        //        gfx.DrawString($"Total Admins: {stats.TotalAdmins}", textFont, XBrushes.Black, new XPoint(60, y)); y += 40;

        //        gfx.DrawString("👥 User List", headerFont, XBrushes.Black, new XPoint(40, y));
        //        y += 25;

        //        // Table Header
        //        gfx.DrawString("User ID", headerFont, XBrushes.Black, new XPoint(40, y));
        //        gfx.DrawString("Name", headerFont, XBrushes.Black, new XPoint(140, y));
        //        gfx.DrawString("Program", headerFont, XBrushes.Black, new XPoint(320, y));
        //        gfx.DrawString("Role", headerFont, XBrushes.Black, new XPoint(460, y));
        //        y += 20;

        //        // Table Data
        //        foreach (var user in users)
        //        {
        //            // SAFETY: Prevent null fields
        //            var userId = user?.UserId ?? "-";
        //            var firstName = user?.FirstName ?? "-";
        //            var lastName = user?.LastName ?? "-";
        //            var program = string.IsNullOrWhiteSpace(user?.Program) ? "-" : user.Program;
        //            var role = user?.Role.ToString() ?? "-";

        //            gfx.DrawString(userId, textFont, XBrushes.Black, new XPoint(40, y));
        //            gfx.DrawString($"{firstName} {lastName}", textFont, XBrushes.Black, new XPoint(140, y));
        //            gfx.DrawString(program, textFont, XBrushes.Black, new XPoint(320, y));
        //            gfx.DrawString(role, textFont, XBrushes.Black, new XPoint(460, y));

        //            y += 20;
        //        }

        //        using (var stream = new MemoryStream())
        //        {
        //            document.Save(stream, false);
        //            return stream.ToArray();
        //        }
        //    }
        //}
        public byte[] GenerateDashboardSummaryReport(DashboardStatsViewModel dashboardStats, List<UserViewAdminModel> users, UserRoles? roleFilter = null)
        {
            if (dashboardStats == null)
                throw new ArgumentNullException(nameof(dashboardStats));
            if (users == null)
                throw new ArgumentNullException(nameof(users));

            using (var document = new PdfDocument())
            {
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // --- Layout ---
                double margin = 50;
                double y = 90;
                double pageWidth = page.Width;
                double contentWidth = pageWidth - (margin * 2);

                // --- Styles ---
                var titleFont = new XFont("Verdana", 20, XFontStyle.Bold);
                var headerFont = new XFont("Verdana", 12, XFontStyle.Bold);
                var sectionFont = new XFont("Verdana", 13, XFontStyle.Bold);
                var textFont = new XFont("Verdana", 11, XFontStyle.Regular);
                var footerFont = new XFont("Verdana", 9, XFontStyle.Italic);

                var primaryColor = XBrushes.SteelBlue;
                var boxColor = new XSolidBrush(XColor.FromArgb(245, 248, 255));
                var altRowColor = new XSolidBrush(XColor.FromArgb(240, 240, 240));
                var linePen = new XPen(XColor.FromArgb(200, 200, 200), 0.8);

                // --- Header Bar ---
                string headerTitle = roleFilter.HasValue
                    ? $"{roleFilter.Value.ToString().ToUpper()} DASHBOARD SUMMARY REPORT"
                    : "ADMIN DASHBOARD SUMMARY REPORT";

                gfx.DrawRectangle(XBrushes.SteelBlue, 0, 0, page.Width, 70);
                gfx.DrawString(headerTitle, titleFont, XBrushes.White,
                    new XRect(0, 20, page.Width, 40), XStringFormats.TopCenter);

                // --- Section: System Overview ---
                gfx.DrawString("SYSTEM OVERVIEW", sectionFont, primaryColor, new XPoint(margin, y));
                y += 20;

                double boxHeight = 100;
                gfx.DrawRoundedRectangle(boxColor, margin, y, contentWidth, boxHeight, 8, 8);
                y += 30;

                double textX = margin + 20;

                // Dynamic stats based on role filter
                int totalUsers = users.Count;
                int totalStudents = users.Count(u => u.Role == UserRoles.Student);
                int totalTeachers = users.Count(u => u.Role == UserRoles.Teacher);
                int totalAdmins = users.Count(u => u.Role == UserRoles.Admin);

                gfx.DrawString($"Total Users: {totalUsers}", textFont, XBrushes.Black, new XPoint(textX, y)); y += 20;
                if (!roleFilter.HasValue || roleFilter == UserRoles.Student)
                    gfx.DrawString($"Total Students: {totalStudents}", textFont, XBrushes.Black, new XPoint(textX, y)); y += 20;
                if (!roleFilter.HasValue || roleFilter == UserRoles.Teacher)
                    gfx.DrawString($"Total Teachers: {totalTeachers}", textFont, XBrushes.Black, new XPoint(textX, y)); y += 20;
                if (!roleFilter.HasValue || roleFilter == UserRoles.Admin)
                    gfx.DrawString($"Total Admins: {totalAdmins}", textFont, XBrushes.Black, new XPoint(textX, y));
                y += 50;

                // --- Section: Course Statistics ---
                gfx.DrawString("COURSE STATISTICS", sectionFont, primaryColor, new XPoint(margin, y));
                y += 20;

                gfx.DrawRoundedRectangle(boxColor, margin, y, contentWidth, 45, 8, 8);
                gfx.DrawString($"Total Courses: {dashboardStats.TotalCourses}", textFont, XBrushes.Black, new XPoint(textX, y + 25));
                y += 70;

                // --- Section: User List ---
                gfx.DrawString("USER LIST", sectionFont, primaryColor, new XPoint(margin, y));
                y += 25;

                // Column layout
                double[] colWidths = { 90, 200, 140, 110 };
                double tableStartX = margin;
                double rowHeight = 25;

                // --- Table Header ---
                gfx.DrawRoundedRectangle(XBrushes.LightSteelBlue, tableStartX, y, contentWidth, rowHeight, 5, 5);
                double textY = y + 7;
                gfx.DrawString("User ID", headerFont, XBrushes.Black, new XPoint(tableStartX + 10, textY));
                gfx.DrawString("Name", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + 10, textY));
                gfx.DrawString("Program", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + 10, textY));
                gfx.DrawString("Role", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 10, textY));
                y += rowHeight;

                int row = 0;

                foreach (var user in users)
                {
                    if (y > page.Height - 100)
                    {
                        page = document.AddPage();
                        gfx = XGraphics.FromPdfPage(page);
                        y = 100;
                        gfx.DrawString("USER LIST (continued)", sectionFont, primaryColor, new XPoint(margin, y));
                        y += 25;
                        gfx.DrawRoundedRectangle(XBrushes.LightSteelBlue, tableStartX, y, contentWidth, rowHeight, 10, 10);
                        gfx.DrawString("User ID", headerFont, XBrushes.Black, new XPoint(tableStartX + 10, y + 7));
                        gfx.DrawString("Name", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + 10, y + 7));
                        gfx.DrawString("Program", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + 10, y + 7));
                        gfx.DrawString("Role", headerFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 10, y + 7));
                        y += rowHeight;
                        row = 0;
                    }

                    var bgColor = (row % 2 == 0) ? XBrushes.White : altRowColor;
                    gfx.DrawRectangle(bgColor, tableStartX, y, contentWidth, rowHeight);
                    gfx.DrawLine(linePen, tableStartX, y + rowHeight, tableStartX + contentWidth, y + rowHeight);

                    var fullName = $"{user?.FirstName ?? "-"} {user?.LastName ?? "-"}";
                    var roleString = user?.Role.ToString() ?? "-";

                    double rowTextY = y + 14;
                    gfx.DrawString(user?.UserId ?? "-", textFont, XBrushes.Black, new XPoint(tableStartX + 10, rowTextY));
                    gfx.DrawString(fullName, textFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + 10, rowTextY));
                    gfx.DrawString(user?.Program ?? "-", textFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + 10, rowTextY));
                    gfx.DrawString(roleString, textFont, XBrushes.Black, new XPoint(tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 10, rowTextY));

                    y += rowHeight;
                    row++;
                }

                // --- Footer ---
                gfx.DrawLine(linePen, margin, page.Height - 60, page.Width - margin, page.Height - 60);
                gfx.DrawString($"Generated on: {DateTime.Now:MMMM dd, yyyy h:mm tt}", footerFont, XBrushes.Gray, new XPoint(margin, page.Height - 45));
                gfx.DrawString("Generated by: Admin Portal @All rights reserved Student-Performance-Tracker", footerFont, XBrushes.Gray, new XPoint(margin, page.Height - 30));

                using (var stream = new MemoryStream())
                {
                    document.Save(stream, false);
                    return stream.ToArray();
                }
            }
        }



    }
}
