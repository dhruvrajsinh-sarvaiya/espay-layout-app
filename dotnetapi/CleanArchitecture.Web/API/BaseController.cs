
using CleanArchitecture.Web.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.API
{
    [Authorize]
    [ServiceFilter(typeof(ApiExceptionFilter))]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public class BaseController : Controller
    {
        public BaseController()
        {
        }
    }
}
