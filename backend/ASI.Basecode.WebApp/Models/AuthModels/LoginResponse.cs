using ASI.Basecode.Data.Models;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Models
{
    public class LoginResponse
    {
        public string message { get; set; }
        public string token { get; set; }
        public UserDto user { get; set; }
    }
}
