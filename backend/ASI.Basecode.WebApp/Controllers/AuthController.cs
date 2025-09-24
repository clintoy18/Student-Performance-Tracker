using ASI.Basecode.Services.Interfaces;
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

namespace ASI.Basecode.WebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loginResult = await _userService.AuthenticateUser(request.UserId, request.Password);

            if (loginResult == Enums.LoginResult.Success)
            {
                var user = await _userService.FetchUser(request.UserId);
                var token = _jwtService.GenerateToken(user.LastName, user.Role);

                return Ok(new LoginResponse
                {
                    Message = "Login successful",
                    Token = token,
                    User = {
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
        
        // [HttpPost("register")]
        // public IActionResult Register([FromBody] RegistrationRequest request)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(new { message = "Invalid request format." });
        //     }

        //     try
        //     {
        //         var userViewModel = new UserViewModel
        //         {
        //             UserId = request.UserId,
        //             Name = request.Name,
        //             Password = request.Password
        //         };

        //         _userService.AddUser(userViewModel);

        //         return Ok(new { message = "User registered successfully." });
        //     }
        //     catch (InvalidDataException ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        //     catch
        //     {
        //         return StatusCode(500, new { message = "An internal server error has occurred." });
        //     }
        // }

        // private string GenerateJwtToken(User user)
        // {
        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var key = Encoding.ASCII.GetBytes(_configuration["TokenAuthentication:SecretKey"]);
        //     var tokenDescriptor = new SecurityTokenDescriptor
        //     {
        //         Subject = new ClaimsIdentity(new[]
        //         {
        //             new Claim(ClaimTypes.NameIdentifier, user.UserId),
        //             new Claim(ClaimTypes.Name, $"{user.LastName}"),
        //             new Claim(ClaimTypes.Role, $"{user.Role}")
        //         }),
        //         Expires = DateTime.UtcNow.AddHours(1),
        //         SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        //         Audience = _configuration["TokenAuthentication:Audience"],
        //         Issuer = ASI.Basecode.Resources.Constants.Const.Issuer
        //     };
        //     var token = tokenHandler.CreateToken(tokenDescriptor);
        //     return tokenHandler.WriteToken(token);
        // }
    }
}