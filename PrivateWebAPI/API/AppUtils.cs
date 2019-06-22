using System.Collections.Generic;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.User;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.API
{
    public class AppUtils
    {
        internal static IActionResult SignIn(ApplicationUser user, IList<string> roles)
        {
            var userResult = new { User = new { DisplayName = user.UserName, Roles = roles } };
            return new ObjectResult(userResult);
        }

        internal static IActionResult StanderdSignIn(ApplicationUser user, object obj)
        {
            var userResult = new { User = new { DisplayName = user.UserName, Roles = obj } };
            return new ObjectResult(userResult);
        }

        internal static IActionResult StanderdSignUp(string message)
        {
            var userResult = new { message = message };
            return new ObjectResult(userResult);
        }

        internal static IActionResult Standerdlogin(string message)
        {
            var userResult = new { message = message };
            return new ObjectResult(userResult);
        }

    }
}