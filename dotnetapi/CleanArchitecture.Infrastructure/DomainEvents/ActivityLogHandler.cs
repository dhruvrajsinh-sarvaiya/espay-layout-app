﻿using CleanArchitecture.Core.Interfaces.Organization;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.DomainEvents
{
    public class ActivityLogHandler : IRequestHandler<ActivityReqRes>, IRequestHandler<ActivityRes>
    {
        private readonly IActivityLogProcess _IactivityRegister;
        public ActivityLogHandler(IActivityLogProcess IactivityRegister)
        {
            _IactivityRegister = IactivityRegister;
        }
        public Task<Unit> Handle(ActivityReqRes request, CancellationToken cancellationToken)
        {
            try
            {
                _IactivityRegister.AddActivityLog(request);
                return Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw;
            }
        }

        public Task<Unit> Handle(ActivityRes request, CancellationToken cancellationToken)
        {
            try
            {
                _IactivityRegister.UpdateActivityLogAsync(request);
                return Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                ex.ToString();
                //throw;
                return null;
            }
        }
    }
}
