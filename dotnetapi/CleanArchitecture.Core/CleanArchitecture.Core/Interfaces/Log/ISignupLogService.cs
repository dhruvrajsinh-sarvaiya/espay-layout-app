using CleanArchitecture.Core.ViewModels.AccountViewModels.Log;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Log
{
    public interface ISignupLogService
    {
        long AddSignUpLog(SignUpLogViewModel model);
        Task<SignUpLogResponse> GetSignUpLogHistoryByUserId(long UserId, int pageIndex, int pageSize);
        void UpdateVerifiedUser(int TempUserId, int UserId);
    }
}
