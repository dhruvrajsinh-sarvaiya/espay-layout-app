using CleanArchitecture.Infrastructure.DTOClasses;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IActivityLogProcess
    {
        void AddActivityLog(ActivityReqRes activityReqRes);
        void UpdateActivityLogAsync(ActivityRes activityReqRes);
    }
}
