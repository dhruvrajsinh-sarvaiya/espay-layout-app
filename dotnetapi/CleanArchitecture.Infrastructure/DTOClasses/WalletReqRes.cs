using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure.DTOClasses
{
    public class WalletReqRes : IRequest
    {
        public long UserId { get; set; }
    }
    public class MarketCapHandleTemp : IRequest
    {
        public string strMarketCapHandleTemp { get; set; } = "";
    }

    public class ProfitTemp : IRequest
    {
        public string CurrencyName { get; set; } = "USD";
        public DateTime Date { get; set; }
    }

    public class RecurringChargeCalculation : IRequest
    {
        public int Hour { get; set; }
    }

    public class RefferralCommissionTask : IRequest
    {
        public int Hour { get; set; }
    }

    public class RefferralCommissionTaskReq
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public long CronRefNo { get; set; }
    }
    public class MarginWalletReqRes : IRequest
    {
        public long UserId { get; set; }
    }
    public class StakingReqRes : IRequest
    {
        public int IsReqFromAdmin { get; set; }
    }

    public class ForceWithdrwLoanv2Req : IRequest
    {
        public int Hour { get; set; }
    }

    public class ServiceProviderReq : IRequest<ServiceProviderBalanceResponse>
    {
        public List<TransactionProviderResponse2> transactionProviderResponses2 { get; set; }
    }

   }
