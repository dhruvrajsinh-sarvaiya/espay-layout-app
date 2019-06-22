using CleanArchitecture.Core.ViewModels.Organization;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Activity_Log
{
    public interface IActivityRegisterData
    {
        //GetActivityLogResponse GetBackofficeAllActivityLog_Old(int UserId , int pageIndex , int pageSize, string IpAddress, string DeviceId, string ActivityAliasName, string URL, string ModuleType, long? StatusCode,DateTime? fromdate,DateTime? todate);
        GetActivityLogResponse GetBackofficeAllActivityLog(int UserId, int pageIndex, int pageSize, string IpAddress, string DeviceId, string ActivityAliasName, string ModuleType, long? StatusCode, DateTime? fromdate, DateTime? todate);// New change by Pratik 25-3-2019 Remove URL parameter to unnecessary pass to SP
        List<GetModuleData> GetAllModuleData();
    }
}
