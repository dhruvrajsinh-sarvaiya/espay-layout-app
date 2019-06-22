using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.User
{
    public class SubscribeNewsLetter : BizBase
    {
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
    }
}
