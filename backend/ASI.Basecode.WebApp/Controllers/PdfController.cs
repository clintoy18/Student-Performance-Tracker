using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Collections.Generic;
using ASI.Basecode.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System;
using static ASI.Basecode.Resources.Constants.Enums;
using ASI.Basecode.Resources.Constants;

namespace YourApp.WebApp.Controllers
{
[ApiController]
[Route("pdf")]
public class PdfController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public PdfController(IPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpGet("test")]
    public IActionResult GenerateTestPdf()
    {
        try
        {
            var pdfBytes = _pdfService.GenerateSimplePdf("Test PDF", "This is a test PDF file.");
            return File(pdfBytes, "application/pdf", "sample.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error generating PDF: {ex.Message}");
        }
    }
}

    
}
