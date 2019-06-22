using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.SignalR
{
    public class SocketMethods : BizBase
    {
        [Required]
        [StringLength(30)]
        public string MethodName { get; set; }

        [Required]
        [StringLength(30)]
        public string ReturnMethodName { get; set; }

        public short PublicOrPrivate { get; set; }

        public short EnumCode { get; set; }
    }
}
