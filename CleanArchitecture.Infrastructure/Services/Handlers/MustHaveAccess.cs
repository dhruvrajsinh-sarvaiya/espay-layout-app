using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure.Services.Handlers
{
    public class MustHaveAccess : IAuthorizationRequirement
    {
        public MustHaveAccess()
        {

        }
    }
}
