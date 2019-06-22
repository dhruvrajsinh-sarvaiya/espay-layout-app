using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Repository
{
    public interface IWithdrawTransactionRepository
    {
        BizResponseClass WithdrwalInteranlTransferProcess(string RefId, string timestamp, int ChannelId);
        List<WithdrawERCAdminAddress> GetERCAdminAddress(string Coin);
    }
}
