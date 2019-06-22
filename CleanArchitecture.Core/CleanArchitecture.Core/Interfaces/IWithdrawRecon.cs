using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IWithdrawRecon
    {
        Task<BizResponseClass> WithdrawalReconV1(WithdrawalReconRequest request, long UserId, string accessToken);

        void TransactionReconEntry(long TrnNo, enTransactionStatus NewStatus, short OldStatus, long SerProID, long ServiceID, string Remarks, long UserID);
    }
}
