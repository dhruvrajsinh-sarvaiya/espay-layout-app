using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration.FeedConfiguration
{
    public class InvokeAPIPlanCroneObj : IRequest
    {
        public DateTime Date { get; set; }
    }
}
