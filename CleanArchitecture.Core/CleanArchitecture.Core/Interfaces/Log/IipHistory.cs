using CleanArchitecture.Core.ViewModels.AccountViewModels.Log;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Log
{
    public interface IipHistory
    {
        long AddIpHistory(IpHistoryViewModel model);
        IpHistoryResponse GetIpHistoryListByUserId(long UserId, int pageIndex, int pageSize, string IPAddress = null, DateTime? FromDate = null, DateTime? ToDate = null);
        bool IsIpHistoryExist(int UserId,string IPAddress);
        bool IsIpHistoryExistV1(int UserId, string IPAddress);
    }
}
