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
     public byte[] GenerateUserReport(UserStatisticsViewModel stats, List<UserViewAdminModel> users)
{
    if (stats == null)
        throw new ArgumentNullException(nameof(stats), "stats is null in GenerateUserReport");
    if (users == null)
        throw new ArgumentNullException(nameof(users), "users list is null in GenerateUserReport");
    if (users.Any(u => u == null))
        throw new ArgumentException("One or more users in the list are null", nameof(users));

    using (var document = new PdfDocument())
    {
        PdfPage page = document.AddPage();
        XGraphics gfx = XGraphics.FromPdfPage(page);

        var titleFont = new XFont("Verdana", 18, XFontStyle.Bold);
        var headerFont = new XFont("Verdana", 14, XFontStyle.Bold);
        var textFont = new XFont("Verdana", 12, XFontStyle.Regular);

        // Title
        gfx.DrawString("User Summary Report", titleFont, XBrushes.Black,
            new XRect(0, 40, page.Width, 40), XStringFormats.TopCenter);

        double y = 100;
        gfx.DrawString("📊 System Overview", headerFont, XBrushes.Black, new XPoint(40, y));
        y += 25;
        gfx.DrawString($"Total Users: {stats.TotalUsers}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        gfx.DrawString($"Total Students: {stats.TotalStudents}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        gfx.DrawString($"Total Teachers: {stats.TotalTeachers}", textFont, XBrushes.Black, new XPoint(60, y)); y += 20;
        gfx.DrawString($"Total Admins: {stats.TotalAdmins}", textFont, XBrushes.Black, new XPoint(60, y)); y += 40;

        gfx.DrawString("👥 User List", headerFont, XBrushes.Black, new XPoint(40, y));
        y += 25;

        // Table Header
        gfx.DrawString("User ID", headerFont, XBrushes.Black, new XPoint(40, y));
        gfx.DrawString("Name", headerFont, XBrushes.Black, new XPoint(140, y));
        gfx.DrawString("Program", headerFont, XBrushes.Black, new XPoint(320, y));
        gfx.DrawString("Role", headerFont, XBrushes.Black, new XPoint(460, y));
        y += 20;

        // Table Data
        foreach (var user in users)
        {
            // SAFETY: Prevent null fields
            var userId = user?.UserId ?? "-";
            var firstName = user?.FirstName ?? "-";
            var lastName = user?.LastName ?? "-";
            var program = string.IsNullOrWhiteSpace(user?.Program) ? "-" : user.Program;
            var role = user?.Role.ToString() ?? "-";

            gfx.DrawString(userId, textFont, XBrushes.Black, new XPoint(40, y));
            gfx.DrawString($"{firstName} {lastName}", textFont, XBrushes.Black, new XPoint(140, y));
            gfx.DrawString(program, textFont, XBrushes.Black, new XPoint(320, y));
            gfx.DrawString(role, textFont, XBrushes.Black, new XPoint(460, y));

            y += 20;
        }

        using (var stream = new MemoryStream())
        {
            document.Save(stream, false);
            return stream.ToArray();
        }
    }
}


    }
}
