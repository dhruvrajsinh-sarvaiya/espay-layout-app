using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Transaction
{
    public class GetTradeHistoryResponse : BizResponseClass
    {
        public List<GetTradeHistoryInfo> response { get; set; }
    }
    public class GetTradeHistoryInfo
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public Decimal Total { get; set; }
        public DateTime DateTime { get; set; }
        public short Status { get; set; }
        public string StatusText { get; set; }
        public String PairName { get; set; }
        public Decimal? ChargeRs { get; set; }
        public short  IsCancel { get; set; }
        public string OrderType { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public string Chargecurrency { get; set; }

    }
    public class GetTradeHistoryResponseArbitrage : BizResponseClass
    {
        public List<GetTradeHistoryInfoArbitrage> response { get; set; }
    }
    public class GetTradeHistoryInfoArbitrage
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public Decimal Total { get; set; }
        public DateTime DateTime { get; set; }
        public short Status { get; set; }
        public string StatusText { get; set; }
        public String PairName { get; set; }
        public Decimal? ChargeRs { get; set; }
        public short IsCancel { get; set; }
        public string OrderType { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public string Chargecurrency { get; set; }
        public string ExchangeName { get; set; }//komal 08-06-2019 add exchange name

    }
}
