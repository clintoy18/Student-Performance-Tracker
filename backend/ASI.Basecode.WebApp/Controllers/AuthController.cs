using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using ASI.Basecode.WebApp.Models;
using ASI.Basecode.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using static ASI.Basecode.Resources.Constants.Enums;
using ASI.Basecode.Data.Models;
using Microsoft.Extensions.Options;
using ASI.Basecode.Resources.Constants;
using System.IO;
using System.Linq;

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/auth/")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;

        public AuthController(IJwtService jwtService, IUserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request == null)
            {
                return BadRequest(new { message = "Request is null" });
            }

            var loginResult = _userService.AuthenticateUser(request.UserId, request.Password);

            if (loginResult == LoginResult.Success)
            {
                var user = _userService.FetchUser(request.UserId);

                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var token = _jwtService.GenerateToken(user.LastName, user.Role);

                return Ok(new LoginResponse
                {
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto {
                        UserId = user.UserId,
                        LastName = user.LastName,
                        Role = user.Role.ToString()
                    }
                });
            }
            else
            {
                return Unauthorized(new { message = "Invalid user ID or password." });
            }
        }
        
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterUserViewModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request format.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                var userViewModel = new RegisterUserViewModel
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    Password = request.Password,
                    Program = request.Program
                    // Add Role if needed, e.g., Role = UserRoles.User
                };

                _userService.RegisterUser(userViewModel);

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
    }
}