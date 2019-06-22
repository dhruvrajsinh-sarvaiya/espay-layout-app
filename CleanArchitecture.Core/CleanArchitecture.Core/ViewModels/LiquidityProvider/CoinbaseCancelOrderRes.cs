using CleanArchitecture.Core.Enums;
using CoinbasePro.Services.Orders.Models.Responses;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.LiquidityProvider
{
    public class CoinbaseCancelOrderRes
    {
        public string ErrorMsg { get; set; }
        public enErrorCode ErrorCode { get; set; }
        public CancelOrderResponse Result { get; set; }
    }
}
