using Microsoft.AspNetCore.Mvc;
using System;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "Pong!", timestamp = DateTime.UtcNow });
        }
        
        [HttpPost("echo")]
        public IActionResult Echo([FromBody] object data)
        {
            return Ok(new { 
                message = "Echo received!", 
                data,
                timestamp = DateTime.UtcNow 
            });
        }
    }
}