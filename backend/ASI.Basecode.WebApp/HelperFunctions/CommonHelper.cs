using ASI.Basecode.Resources.Constants;
using ASI.Basecode.Services.Utils.Response;
using System.Net;

namespace ASI.Basecode.WebApp.HelperFunctions
{
    public static class CommonHelper
    {
        public static (ResponseModel Response, int StatusCode) GetAddResultMessage(int status)
        {
            if (status >= AppConstants.CrudStatusCodes.Success)
            {
                return (new ResponseModel(Resources.Messages.Common.Added), (int)HttpStatusCode.OK);
            }
            else if (status == AppConstants.CrudStatusCodes.DuplicateExist)
            {
                return (new ResponseModel(Resources.Messages.Common.DuplicateExists), (int)HttpStatusCode.Conflict);
            }
            else
            {
                return (new ResponseModel(Resources.Messages.Common.AddFailed), (int)HttpStatusCode.BadRequest);
            }
        }
    }
}
