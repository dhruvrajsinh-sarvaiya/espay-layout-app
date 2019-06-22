using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.WalletOperations
{
    public class CheckTrnRefNoRes
    {
        public Int32 TotalCount { get; set; }
    }

    public class CheckTransactionSuccessOrNotRes
    {
        public enTransactionStatus Status { get; set; }
    }    
}
