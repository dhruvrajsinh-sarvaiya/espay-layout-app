using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Communication;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface ISignalRService
    {
        // khushali 12-03-2019 Remove internal use method from interface
        ////Pair wise
        //Task BuyerBook(GetBuySellBook Data, string Pair, short IsMargin = 0);
        //Task SellerBook(GetBuySellBook Data, string Pair, short IsMargin = 0);
        Task OrderHistory(GetTradeHistoryInfo Data, string Pair, string UserID, short IsMargin = 0);
        //Task ChartData(GetGraphDetailInfo Data, string Pair, short IsMargin = 0);
        Task ChartDataEveryLastMin(DateTime DateTime, short IsMargin = 0);
        //Task MarketData(MarketCapData Data, string Pair, short IsMargin = 0);
        //Task LastPrice(LastPriceViewModel Data,string Pair, short IsMargin = 0);
        //Task StopLimitBuyerBook(List<StopLimitBuySellBook> Data, string Pair, short IsMargin = 0);
        //Task StopLimitSellerBook(List<StopLimitBuySellBook> Data, string Pair, short IsMargin = 0);
        Task BulkBuyerBook(List<GetBuySellBook> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0);
        Task BulkSellerBook(List<GetBuySellBook> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0);
        Task BulkOrderHistory(List<GetTradeHistoryInfo> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0);

        ////user wise
        //Task ActiveOrder(ActiveOrderInfo Data, string Token, short IsMargin = 0);
        //Task TradeHistory(GetTradeHistoryInfo Data, string Token, string UserID, short IsMargin = 0);
        //Task RecentOrder(RecentOrderInfo Data, string Token, short IsMargin = 0);
        //Task WalletBalUpdate(WalletMasterResponse Data,string Wallet, string Token, short IsMargin = 0);
        ////Task SellerSideWalletBal(WalletMasterResponse Data, string Wallet, string Token, short IsMargin = 0);
        //Task ActivityNotification(string Msg,string Token, short IsMargin = 0);
        //Task OpenOrder(OpenOrderInfo Data, string Token, short IsMargin = 0);
        ////Base Market
        //Task PairData(VolumeDataRespose Data,string Base, short IsMargin = 0);
        Task MarketTicker(List<VolumeDataRespose> Data, string UserID, string Base="", short IsMargin = 0);

        //Event Call
        Task OnStatusPartialSuccess(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType);
        Task OnStatusSuccess(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType,decimal SettlementPrice);
        Task OnStatusHold(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType);
        Task OnStatusCancel(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType,short IsPartialCancel= 0);        
        Task OnVolumeChange(VolumeDataRespose volumeData, MarketCapData capData, string UserID);
        Task OnWalletBalChange(WalletMasterResponse Data, string WalletTypeName, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0); //ntrivedi optional parameter added for margin wallet balance change
        //void OnWalletBalChangeByUserID(WalletMasterResponse Data, string WalletTypeName,long UserID);
        Task OnLtpChange(Decimal LTP, long Pair, string PairName, short IsCancel = 0, short IsMargin = 0, string UserID = "");

        //Helper method
        Task GetAndSendActiveOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0);
        Task GetAndSendOpenOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0);
        GetTradeHistoryInfo GetAndSendTradeHistoryInfoData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, short OrderType, short IsPop = 0, decimal SettlementPrice=0);
        Task GetAndSendRecentOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0);
        //Task SendActivityNotification(string Msg, string Token, short TokenType = 1);//Commented by khushali 12-03-2019  for unused method
        Task SendActivityNotificationV2(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0);
        string GetTokenByUserID(string ID);
        Task SendWalletActivityList(ListAddWalletRequest ActivityListRequest, string ID, short IsMargin = 0);
        //Rita 20-2-19 for Margin Trading
        Task OnStatusCancelMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, short IsPartialCancel = 0);
        Task OnStatusPartialSuccessMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType);
        Task OnStatusHoldMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType);
        Task OnStatusSuccessMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, decimal SettlementPrice);
        Task OnVolumeChangeMargin(VolumeDataRespose volumeData, MarketCapData capData, string UserID);

        //============== Komal 3 June 2019 Arbitrange Trading
        Task MarketTickerArbitrage(List<VolumeDataRespose> Data, string UserID, string Base = "", short IsMargin = 0);
        Task LastPriceArbitrage(LastPriceViewModelArbitrage Data, string Pair, string UserID, short IsMargin = 0);
        Task SellerBookArbitrage(ArbitrageBuySellViewModel Data, string Pair, string UserID, short IsMargin = 0);
        Task BuyerBookArbitrage(ArbitrageBuySellViewModel Data, string Pair, string UserID, short IsMargin = 0);
        Task ProviderMarketDataArbitrage(ExchangeProviderListArbitrage Data, string Pair);
        Task ProfitIndicatorArbitrage(ProfitIndicatorInfo Data, string Pair);
        Task ExchangeListSmartArbitrage(List<ExchangeListSmartArbitrage> Data, string Pair);
        //Task ActivityNotificationV2Arbitrage(ActivityNotificationMessage Notification, string Token, string UserID, short IsMargin = 0);

        Task OnStatusSuccessArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, decimal SettlementPrice);
        Task OnStatusPartialSuccessArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType);
        Task OnStatusHoldArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType);
        Task OnStatusCancelArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, short IsPartialCancel = 0);
        Task OnVolumeChangeArbitrage(VolumeDataRespose volumeData, MarketCapData capData, string UserID);
        Task OnLtpChangeArbitrage(Decimal LTP, long Pair, string PairName, short IsCancel = 0, short IsMargin = 0, string UserID = "");
        Task SendActivityNotificationV2Arbitrage(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0);
    }

    public interface ISignalRServiceV2
    {
        
        //user wise
        Task OnWalletBalChange(WalletMasterResponse Data, string WalletTypeName, string Token, short TokenType = 1, string TrnNo = "");
        Task SendActivityNotificationV2(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "");        
    }
}
