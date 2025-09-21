using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using ASI.Basecode.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using System;
using System.IO;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format." });
            }

            User user = new();
            var loginResult = _userService.AuthenticateUser(request.UserId, request.Password, ref user);

            if (loginResult == LoginResult.Success)
            {
                var token = GenerateJwtToken(user);

                return Ok(new LoginResponse
                {
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto
                    {
                        UserId = user.UserId,
                        Name = user.Name
                    }
                });
            }
            else
            {
                return Unauthorized(new { message = "Invalid user ID or password." });
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format." });
            }

            try
            {
                var userViewModel = new UserViewModel
                {
                    UserId = request.UserId,
                    Name = request.Name,
                    Password = request.Password
                };

                _userService.AddUser(userViewModel);

                return Ok(new { message = "User registered successfully." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "An internal server error has occurred." });
            }
        }

        private string GenerateJwtToken(ASI.Basecode.Data.Models.User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["TokenAuthentication:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId),
                    new Claim(ClaimTypes.Name, user.Name)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _configuration["TokenAuthentication:Audience"],
                Issuer = ASI.Basecode.Resources.Constants.Const.Issuer
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public class LoginRequest
        {
            [Required]
            public string UserId { get; set; }
            
            [Required]
            public string Password { get; set; }
        }

        public class RegistrationRequest
        {
            [Required]
            [StringLength(20, MinimumLength = 3)]
            public string UserId { get; set; }

            [Required]
            [StringLength(100)]
            public string Name { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 6)]
            public string Password { get; set; }
            
            // Add other registration fields as needed
            // public string Email { get; set; }
        }

        public class LoginResponse
        {
            public string Message { get; set; }
            public string Token { get; set; }
            public UserDto User { get; set; }
        }

        public class UserDto
        {
            public string UserId { get; set; }
            public string Name { get; set; }
        }
    }
}