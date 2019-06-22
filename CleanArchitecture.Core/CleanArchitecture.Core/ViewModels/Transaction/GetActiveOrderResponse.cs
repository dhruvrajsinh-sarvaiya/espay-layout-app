using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Transaction
{
    public class GetActiveOrderResponse : BizResponseClass
    {
        public List<ActiveOrderInfo> response { get; set; }
    }
    public class GetActiveOrderResponseArbitrage : BizResponseClass
    {
        public List<ActiveOrderInfoArbitrage> response { get; set; }
    }
    public class  ActiveOrderInfo
    {
        public long Id { get; set; }
        public DateTime  TrnDate { get; set; }
        public string Type { get; set; }
        public string Order_Currency { get; set; }
        public string Delivery_Currency { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public short IsCancelled { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public string OrderType { get; set; }
        public DateTime? SettledDate { get; set; }//Rita 12-3-19 added for needed at front side
        public decimal SettledQty { get; set; }
        
    }
    public class ActiveOrderInfoArbitrage
    {
        public long Id { get; set; }
        public DateTime TrnDate { get; set; }
        public string Type { get; set; }
        public string Order_Currency { get; set; }
        public string Delivery_Currency { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public short IsCancelled { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public string OrderType { get; set; }
        public DateTime? SettledDate { get; set; }//Rita 12-3-19 added for needed at front side
        public decimal SettledQty { get; set; }
        public string ExchangeName { get; set; }//komal 08-06-2019 add exchange name
    }
    public class GetActiveOrderRequest
    {
        
        public string Pair { get; set; }

        public string OrderType { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public int Page { get; set; }

        public short IsMargin { get; set; } = 0;//Rita 21-2-19,   1-for Margin trading cancel txn
    }
}
