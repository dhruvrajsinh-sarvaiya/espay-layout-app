using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.LiquidityProvider
{
    #region Balance And Currency List

    public class CurrencyResult
    {
        public string currency { get; set; }
        public string balance { get; set; }
        public string locked { get; set; }
        public string avg_krw_buy_price { get; set; }
        public bool modified { get; set; }
    }
    public class ListCurrencyResult
    {
        public List<CurrencyResult> Result { get; set; }
    }

    #endregion

    #region Ticker

    public class TickerResponse
    {
        public string market { get; set; }
        public string trade_date { get; set; }
        public string trade_time { get; set; }
        public string trade_date_kst { get; set; }
        public string trade_time_kst { get; set; }
        public long trade_timestamp { get; set; }
        public decimal opening_price { get; set; }
        public decimal high_price { get; set; }
        public decimal low_price { get; set; }
        public decimal trade_price { get; set; }
        public decimal prev_closing_price { get; set; }
        public string change { get; set; }
        public string change_price { get; set; }
        public decimal change_rate { get; set; }
        public decimal signed_change_price { get; set; }
        public decimal signed_change_rate { get; set; }
        public decimal trade_volume { get; set; }
        public decimal acc_trade_price { get; set; }
        public decimal acc_trade_price_24h { get; set; }
        public decimal acc_trade_volume { get; set; }
        public decimal acc_trade_volume_24h { get; set; }
        public decimal highest_52_week_price { get; set; }
        public string highest_52_week_date { get; set; }
        public decimal lowest_52_week_price { get; set; }
        public string lowest_52_week_date { get; set; }
        public long timestamp { get; set; }
    }

    #endregion

    #region Order Book

    public class OrderbookUnit
    {
        public int ask_price { get; set; }
        public int bid_price { get; set; }
        public decimal ask_size { get; set; }
        public decimal bid_size { get; set; }
    }

    public class UpbitOrderbookResponse
    {
        public string market { get; set; }
        public long timestamp { get; set; }
        public decimal total_ask_size { get; set; }
        public decimal total_bid_size { get; set; }
        public List<OrderbookUnit> orderbook_units { get; set; }
    }

    #endregion

    #region Pair List

    public class PairsResponse
    {
        public string market { get; set; }
        public string korean_name { get; set; }
        public string english_name { get; set; }
    }

    public class ListPairsResponse
    {
        public List<PairsResponse> Data { get; set; }
    }
    #endregion

    #region Order

    public class Trade
    {
        public string market { get; set; }
        public string uuid { get; set; }
        public string price { get; set; }
        public string volume { get; set; }
        public string funds { get; set; }
        public string side { get; set; }
    }

    public class OrdersResponse
    {
        public string uuid { get; set; }
        public string side { get; set; }
        public string ord_type { get; set; }
        public string price { get; set; }
        public string state { get; set; }
        public string market { get; set; }
        public DateTime created_at { get; set; }
        public string volume { get; set; }
        public string remaining_volume { get; set; }
        public string reserved_fee { get; set; }
        public string remaining_fee { get; set; }
        public string paid_fee { get; set; }
        public string locked { get; set; }
        public string executed_volume { get; set; }
        public int trades_count { get; set; }
        public List<Trade> trades { get; set; }
    }



    public class ListOrderResponse
    {
        public List<OrdersResponse> Data { get; set; }
    }

    public class CreateOrCancelOrderResponse
    {
        public string uuid { get; set; }
        public string side { get; set; }
        public string ord_type { get; set; }
        public string price { get; set; }
        public string avg_price { get; set; }
        public string state { get; set; }
        public string market { get; set; }
        public DateTime created_at { get; set; }
        public string volume { get; set; }
        public string remaining_volume { get; set; }
        public string reserved_fee { get; set; }
        public string remaining_fee { get; set; }
        public string paid_fee { get; set; }
        public string locked { get; set; }
        public string executed_volume { get; set; }
        public int trades_count { get; set; }
    }
    public class UpbitCancelOrderResponse
    {
        public string uuid { get; set; }
        public string side { get; set; }
        public string ord_type { get; set; }
        public string price { get; set; }
        public string state { get; set; }
        public string market { get; set; }
        public DateTime created_at { get; set; }
        public string volume { get; set; }
        public string remaining_volume { get; set; }
        public string reserved_fee { get; set; }
        public string remaining_fee { get; set; }
        public string paid_fee { get; set; }
        public string locked { get; set; }
        public string executed_volume { get; set; }
        public int trades_count { get; set; }
    }
    public class UpbitTrandeHistory
    {
        public string code { get; set; }
        public string tradeDate { get; set; }
        public string tradeTime { get; set; }
        public string tradeDateKst { get; set; }
        public string tradeTimeKst { get; set; }
        public long tradeTimestamp { get; set; }
        public double tradePrice { get; set; }
        public double tradeVolume { get; set; }
        public double prevClosingPrice { get; set; }
        public string change { get; set; }
        public double changePrice { get; set; }
        public string askBid { get; set; }
        public long sequentialId { get; set; }
        public long timestamp { get; set; }

    }
    public class TrandeHistoryResponse
    {

        public List<UpbitTrandeHistory> Result { get; set; } 
    }

    #endregion




}
