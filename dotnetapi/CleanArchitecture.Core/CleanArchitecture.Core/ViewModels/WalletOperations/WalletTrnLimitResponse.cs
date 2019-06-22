using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.WalletOperations
{
    public class WalletTrnLimitResponse
    {
        public enResponseCode ReturnCode { get; set; }

        public string ReturnMsg { get; set; }

        public enErrorCode ErrorCode { get; set; }

        public string MinimumAmounts { get; set; }

        public string MaximumAmounts { get; set; }
    }
}
