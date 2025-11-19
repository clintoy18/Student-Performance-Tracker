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
        //wraps the course name para dili taas
        private List<string> WrapText(XGraphics gfx, string text, XFont font, double maxWidth)
        {
            var words = text.Split(' ');
            var lines = new List<string>();
            var current = "";

            foreach (var word in words)
            {
                var test = (current.Length == 0) ? word : current + " " + word;
                var size = gfx.MeasureString(test, font);

                if (size.Width > maxWidth)
                {
                    lines.Add(current);
                    current = word;
                }
                else
                {
                    current = test;
                }
            }

            if (!string.IsNullOrWhiteSpace(current))
                lines.Add(current);

            return lines;
        }

        public void GenerateAndSavePdf(string filePath, string title, string message)
        {
            var pdfBytes = GenerateSimplePdf(title, message);
            File.WriteAllBytes(filePath, pdfBytes);
        }

        //generates summary of reports by roles or all
        public byte[] GenerateDashboardSummaryReport(
         DashboardStatsViewModel dashboardStats,
         List<UserViewAdminModel> users,
         List<CourseViewModel> courses,
         UserRoles? roleFilter = null)
        {
            if (dashboardStats == null) throw new ArgumentNullException(nameof(dashboardStats));
            if (users == null) throw new ArgumentNullException(nameof(users));
            if (courses == null) throw new ArgumentNullException(nameof(courses));

            using (var document = new PdfDocument())
            {
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // Layout
                double margin = 40;
                double y = 70;
                double pageWidth = page.Width;
                double contentWidth = pageWidth - (margin * 2);

                // Fonts
                var titleFont = new XFont("Helvetica", 20, XFontStyle.Bold);
                var sectionFont = new XFont("Helvetica", 14, XFontStyle.Bold);
                var textFont = new XFont("Helvetica", 11, XFontStyle.Regular);
                var footerFont = new XFont("Helvetica", 9, XFontStyle.Italic);

                // Colors
                var primaryColor = XBrushes.DarkSlateBlue;
                var cardColor = new XSolidBrush(XColor.FromArgb(245, 245, 245)); // softer gray
                var altRowColor = new XSolidBrush(XColor.FromArgb(240, 240, 240));
                var tableHeader = XBrushes.Gainsboro;
                var linePen = new XPen(XColor.FromArgb(200, 200, 200), 0.6);

                // --- Header ---
                string headerTitle = roleFilter.HasValue
                    ? $"{roleFilter.Value.ToString().ToUpper()} DASHBOARD SUMMARY"
                    : "ALL DASHBOARD SUMMARY";

                gfx.DrawRectangle(primaryColor, 0, 0, page.Width, 60);
                gfx.DrawString(headerTitle, titleFont, XBrushes.White,
                    new XRect(0, 15, page.Width, 40), XStringFormats.TopCenter);

                // --- Overview Cards ---
                double cardHeight = 90;
                double cardGap = 15;
                double cardWidth = (contentWidth - cardGap * 2) / 3;
                double cardY = y;

                // Total Users
                gfx.DrawRoundedRectangle(cardColor, margin, cardY, cardWidth, cardHeight, 8, 8);
                gfx.DrawString($"Total Users: {users.Count}", sectionFont, primaryColor,
                    new XPoint(margin + 10, cardY + 35));

                // Students
                gfx.DrawRoundedRectangle(cardColor, margin + cardWidth + cardGap, cardY, cardWidth, cardHeight, 8, 8);
                gfx.DrawString($"Students: {users.Count(u => u.Role == UserRoles.Student)}",
                    sectionFont, primaryColor, new XPoint(margin + cardWidth + cardGap + 10, cardY + 35));

                // Teachers
                gfx.DrawRoundedRectangle(cardColor, margin + 2 * (cardWidth + cardGap), cardY, cardWidth, cardHeight, 8, 8);
                gfx.DrawString($"Teachers: {users.Count(u => u.Role == UserRoles.Teacher)}",
                    sectionFont, primaryColor, new XPoint(margin + 2 * (cardWidth + cardGap) + 10, cardY + 35));

                y += cardHeight + 50;

                // --- Course Stats ---
                gfx.DrawString("COURSE STATISTICS", sectionFont, primaryColor, new XPoint(margin, y));
                y += 25;

                gfx.DrawRoundedRectangle(cardColor, margin, y, contentWidth, 40, 8, 8);
                gfx.DrawString($"Total Courses: {dashboardStats.TotalCourses}", textFont,
                    XBrushes.Black, new XPoint(margin + 10, y + 25));

                y += 70;

                // --- User List Table ---
                gfx.DrawString("USER LIST", sectionFont, primaryColor, new XPoint(margin, y));
                y += 25;

                double[] colWidthsUsers = { 80, 180, 140, 100 };
                double rowHeight = 25;

                // Header
                gfx.DrawRectangle(tableHeader, margin, y, contentWidth, rowHeight);
                gfx.DrawString("User ID", textFont, XBrushes.Black, new XPoint(margin + 10, y + 16));
                gfx.DrawString("Name", textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + 10, y + 16));
                gfx.DrawString("Program", textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + colWidthsUsers[1] + 10, y + 16));
                gfx.DrawString("Role", textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + colWidthsUsers[1] + colWidthsUsers[2] + 10, y + 16));
                y += rowHeight;

                int row = 0;

                foreach (var user in users)
                {
                    if (y > page.Height - 80)
                    {
                        page = document.AddPage();
                        gfx = XGraphics.FromPdfPage(page);
                        y = 60;
                    }

                    var bgColor = (row % 2 == 0) ? XBrushes.White : altRowColor;
                    gfx.DrawRectangle(bgColor, margin, y, contentWidth, rowHeight);

                    gfx.DrawString(user.UserId ?? "-", textFont, XBrushes.Black, new XPoint(margin + 10, y + 16));
                    gfx.DrawString($"{user.FirstName} {user.LastName}", textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + 10, y + 16));
                    gfx.DrawString(user.Program ?? "-", textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + colWidthsUsers[1] + 10, y + 16));
                    gfx.DrawString(user.Role.ToString(), textFont, XBrushes.Black, new XPoint(margin + colWidthsUsers[0] + colWidthsUsers[1] + colWidthsUsers[2] + 10, y + 16));

                    y += rowHeight;
                    row++;
                }

                y += 40;

                // --- COURSE LIST TABLE ---
                gfx.DrawString("COURSE LIST", sectionFont, primaryColor, new XPoint(margin, y));
                y += 25;

                double[] colWidthsCourses = { 120, 200, 200 };

                // Header
                gfx.DrawRectangle(tableHeader, margin, y, contentWidth, rowHeight);
                gfx.DrawString("Course Code", textFont, XBrushes.Black, new XPoint(margin + 10, y + 16));
                gfx.DrawString("Course Name", textFont, XBrushes.Black, new XPoint(margin + colWidthsCourses[0] + 10, y + 16));
                gfx.DrawString("Description", textFont, XBrushes.Black, new XPoint(margin + colWidthsCourses[0] + colWidthsCourses[1] + 10, y + 16));
                y += rowHeight;

                row = 0;

                foreach (var c in courses)
                {
                    // WRAP COURSE NAME
                    var wrappedCourseName = WrapText(gfx, c.CourseName ?? "-", textFont, colWidthsCourses[1] - 10);
                    double lineCount = wrappedCourseName.Count;
                    double dynamicHeight = lineCount * 14 + 10; // adjust height based on lines

                    if (y + dynamicHeight > page.Height - 80)
                    {
                        page = document.AddPage();
                        gfx = XGraphics.FromPdfPage(page);
                        y = 60;
                    }

                    var bgColor = (row % 2 == 0) ? XBrushes.White : altRowColor;
                    gfx.DrawRectangle(bgColor, margin, y, contentWidth, dynamicHeight);

                    gfx.DrawString(c.CourseCode, textFont, XBrushes.Black, new XPoint(margin + 10, y + 16));

                    // Draw WRAPPED NAME
                    double lineY = y + 14;
                    foreach (var line in wrappedCourseName)
                    {
                        gfx.DrawString(line, textFont, XBrushes.Black,
                            new XPoint(margin + colWidthsCourses[0] + 10, lineY));
                        lineY += 14;
                    }

                    // Description (single line)
                    gfx.DrawString(c.CourseDescription ?? "-", textFont, XBrushes.Black,
                        new XPoint(margin + colWidthsCourses[0] + colWidthsCourses[1] + 10, y + 16));

                    y += dynamicHeight;
                    row++;
                }


                // --- Footer ---A
                gfx.DrawLine(linePen, margin, page.Height - 50, page.Width - margin, page.Height - 50);
                gfx.DrawString($"Generated on: {DateTime.Now:MMMM dd, yyyy h:mm tt}", footerFont, XBrushes.Gray,
                    new XPoint(margin, page.Height - 35));
                gfx.DrawString("Student Performance Tracker | All Rights Reserved", footerFont, XBrushes.Gray,
                    new XPoint(margin, page.Height - 20));

                using (var stream = new MemoryStream())
                {
                    document.Save(stream, false);
                    return stream.ToArray();
                }
            }
        }


        //generates all the grades of each course 

        public byte[] GenerateCourseGradeSummary(List<CourseGradesViewModel> coursesGrades, string title = "Grades Per Course Report")
        {
            if (coursesGrades == null) throw new ArgumentNullException(nameof(coursesGrades));

            using (var document = new PdfDocument())
            {
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // Layout
                double margin = 40;
                double y = 60;
                double pageWidth = page.Width;
                double contentWidth = pageWidth - (margin * 2);

                // Fonts
                var titleFont = new XFont("Helvetica", 20, XFontStyle.Bold);
                var courseFont = new XFont("Helvetica", 14, XFontStyle.Bold);
                var studentFont = new XFont("Helvetica", 11, XFontStyle.Regular);
                var footerFont = new XFont("Helvetica", 9, XFontStyle.Italic);

                // Colors
                var primaryColor = XBrushes.DarkSlateBlue;
                var altRowColor = new XSolidBrush(XColor.FromArgb(240, 240, 240));
                var tableHeader = XBrushes.Gainsboro;
                var linePen = new XPen(XColor.FromArgb(200, 200, 200), 0.6);

                // --- Header ---
                gfx.DrawRectangle(primaryColor, 0, 0, page.Width, 50);
                gfx.DrawString(title, titleFont, XBrushes.White,
                    new XRect(0, 10, page.Width, 40), XStringFormats.TopCenter);

                y += 20;

                foreach (var course in coursesGrades)
                {
                    // --- Course Title ---
                    if (y > page.Height - 100)
                    {
                        page = document.AddPage();
                        gfx = XGraphics.FromPdfPage(page);
                        y = 60;
                    }

                    gfx.DrawString($"{course.CourseCode} - {course.CourseName}", courseFont, primaryColor, new XPoint(margin, y));
                    y += 25;

                    // Table header for students
                    double colWidthId = 100;
                    double colWidthName = 250;
                    double colWidthGrade = 80;
                    double rowHeight = 20;

                    gfx.DrawRectangle(tableHeader, margin, y, contentWidth, rowHeight);
                    gfx.DrawString("Student ID", studentFont, XBrushes.Black, new XPoint(margin + 5, y + 14));
                    gfx.DrawString("Student Name", studentFont, XBrushes.Black, new XPoint(margin + colWidthId + 5, y + 14));
                    gfx.DrawString("Grade", studentFont, XBrushes.Black, new XPoint(margin + colWidthId + colWidthName + 5, y + 14));
                    y += rowHeight;

                    int row = 0;
                    foreach (var student in course.StudentGrades)
                    {
                        if (y > page.Height - 80)
                        {
                            page = document.AddPage();
                            gfx = XGraphics.FromPdfPage(page);
                            y = 60;
                        }

                        var bgColor = (row % 2 == 0) ? XBrushes.White : altRowColor;
                        gfx.DrawRectangle(bgColor, margin, y, contentWidth, rowHeight);

                        gfx.DrawString(student.StudentId ?? "-", studentFont, XBrushes.Black, new XPoint(margin + 5, y + 14));
                        gfx.DrawString(student.StudentName ?? "-", studentFont, XBrushes.Black, new XPoint(margin + colWidthId + 5, y + 14));
                        gfx.DrawString(student.Grade?.ToString("F2") ?? "-", studentFont, XBrushes.Black, new XPoint(margin + colWidthId + colWidthName + 5, y + 14));

                        y += rowHeight;
                        row++;
                    }

                    y += 30; // space before next course
                }

                // --- Footer ---
                gfx.DrawLine(linePen, margin, page.Height - 50, page.Width - margin, page.Height - 50);
                gfx.DrawString($"Generated on: {DateTime.Now:MMMM dd, yyyy h:mm tt}", footerFont, XBrushes.Gray,
                    new XPoint(margin, page.Height - 35));
                gfx.DrawString("Student Performance Tracker | All Rights Reserved", footerFont, XBrushes.Gray,
                    new XPoint(margin, page.Height - 20));

                using (var stream = new MemoryStream())
                {
                    document.Save(stream, false);
                    return stream.ToArray();
                }
            }
        }


    }




}
