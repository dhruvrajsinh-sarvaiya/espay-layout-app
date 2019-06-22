using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.MarginWallet
{
    public interface IMarginWalletTQInsert
    {
        MarginWalletTransactionQueue AddIntoWalletTransactionQueue(MarginWalletTransactionQueue wtq, byte AddorUpdate);
    }
}
