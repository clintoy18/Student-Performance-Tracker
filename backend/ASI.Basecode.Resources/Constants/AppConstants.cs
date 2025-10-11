namespace ASI.Basecode.Resources.Constants
{
    /// <summary>
    /// Class for variables with constant values
    /// </summary>
    public static class AppConstants
    {
        public static class Controllers
        {
            public const string Menu = "api/menu";
            public const string Account = "api/account";
            public const string StudentCourse = "api/course";

        }

        public static class LogTypes
        { 
            public const string LogAdd = "Add";
            public const string LogUpdate = "Update";
            public const string LogDelete = "Delete";
        }

        public static class CrudStatusCodes
        { 
            public static readonly int Success = 1;
            public static readonly int DuplicateExist = -2;
            public static readonly int DoesNotExist;
        }
    }
}
