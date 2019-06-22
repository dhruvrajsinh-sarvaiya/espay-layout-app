using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Transaction
{
    public class GetRecentTradeResponce : BizResponseClass
    {
        public List<RecentOrderInfo> response { get; set; }
    }
    public class GetRecentTradeResponceArbitrage : BizResponseClass
    {
        public List<RecentOrderInfoArbitrage> response { get; set; }
    }
    public class RecentOrderInfo
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Qty { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public string OrderType { get; set; }
        public short StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public short ISFollowersReq { get; set; }
        public short IsCancel { get; set; } = 0;//Rita 22-3-19 added for in cancellation process display with fail status in front ,as present in API response GetTradeHistoryInfo
    }
    public class RecentOrderInfoArbitrage
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Qty { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public string OrderType { get; set; }
        public short StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public short ISFollowersReq { get; set; }
        public short IsCancel { get; set; } = 0;//Rita 22-3-19 added for in cancellation process display with fail status in front ,as present in API response GetTradeHistoryInfo
        public string ExchangeName { get; set; }//komal 08-06-2019 add exchange name
    }
}
