using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class SettlementRepositoryV1Bk_1 //: ISettlementRepositoryV1<BizResponse>
    {
        private readonly CleanArchitectureContext _dbContext;
       // private readonly ICommonRepository<TransactionQueue> _TransactionRepository;
       // private readonly ICommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ICommonRepository<TradePoolQueue> _TradePoolQueue;
        private readonly ICommonRepository<TradeBuyRequest> _TradeBuyRequest;
        private readonly ICommonRepository<TradeBuyerListV1> _TradeBuyerList;
        private readonly ICommonRepository<TradeSellerListV1> _TradeSellerList;
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        //private readonly ICommonRepository<TradeStopLoss> _TradeStopLoss;
        private readonly ISignalRService _ISignalRService;
        private readonly IFrontTrnService _IFrontTrnService;
        private readonly SettledTradeTransactionQueue _SettledTradeTQ;
        private readonly UserManager<ApplicationUser> _userManager;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue; //24-11-2018 komal make Email Enqueue
        private readonly IWalletService _WalletService;
        string ControllerName = "SettlementRepositoryV1Bk_1";
        TradePoolQueueV1 TradePoolQueueObj;
        //PoolOrder PoolOrderObj;
        //TradeCancelQueue tradeCancelQueue;        
        private readonly IMessageConfiguration _messageConfiguration;
        private readonly IMessageService _messageService;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;

        public SettlementRepositoryV1Bk_1(CleanArchitectureContext dbContext, ICommonRepository<TradePoolQueue> TradePoolQueue,
            ICommonRepository<TradeBuyRequest> TradeBuyRequest,ICommonRepository<TransactionQueue> TransactionRepository,
            ICommonRepository<TradeTransactionQueue> TradeTransactionRepository, IWalletService WalletService, 
            ISignalRService ISignalRService, IFrontTrnService IFrontTrnService,// ICommonRepository<TradeStopLoss> TradeStopLoss, 
            IMessageConfiguration messageConfiguration, UserManager<ApplicationUser> userManager,            
            ICommonRepository<TradeBuyerListV1> TradeBuyerList, ICommonRepository<TradeSellerListV1> TradeSellerList,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, SettledTradeTransactionQueue SettledTradeTQ,
            ICommonRepository<TradePairStastics> tradePairStastics, IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue)
        //ICommonRepository<TradeCancelQueue> TradeCancelQueueRepository
        {
            _dbContext = dbContext;
            _TradePoolQueue = TradePoolQueue;
            _TradeBuyRequest = TradeBuyRequest;
            _TradeBuyerList = TradeBuyerList;
            _TradeSellerList = TradeSellerList;
            //_TradePoolMaster = TradePoolMaster;
            //_PoolOrder = PoolOrder;
            //_TransactionRepository = TransactionRepository;
            //_TradeTransactionRepository = TradeTransactionRepository;
            _WalletService = WalletService;
            _ISignalRService = ISignalRService;
            _IFrontTrnService = IFrontTrnService;
            //_TradeStopLoss = TradeStopLoss;
            //_mediator = mediator;
            _messageConfiguration = messageConfiguration;
            _userManager = userManager;
            //_TradeCancelQueueRepository = TradeCancelQueueRepository;
            _pushNotificationsQueue = pushNotificationsQueue;
            _SettledTradeTQ = SettledTradeTQ;
            _tradePairStastics = tradePairStastics;
            _messageService = messageService;
            _pushSMSQueue = pushSMSQueue;
        }

        #region ==============================PROCESS SETLLEMENT========================      

        public async Task<BizResponse> PROCESSSETLLEMENTBuy(BizResponse _Resp, TradeTransactionQueue TradeTransactionQueueObj,TransactionQueue TransactionQueueObj, TradeStopLoss TradeStopLossObj, TradeBuyerListV1 CurrentTradeBuyerListObj,string accessToken = "",short IsCancel=0)
        {           
            short TrackBit=0;
            short TrackDebitBit = 0;
            decimal GSettlementQty = 0;
            TradeSellerListV1 CurrenetSellerList=new TradeSellerListV1();
            try
            {
                var MatchSellerListBaseAllResult = _TradeSellerList.GetAllAsync();
                if (TradeTransactionQueueObj.IsCancelled == 1 || IsCancel == 1)
                {
                    //Code for settlement
                    //await CancellationProcessV1(_Resp, TransactionQueueObj, TradeTransactionQueueObj);
                    //return Task.FromResult(_Resp);
                    _Resp.ErrorCode = enErrorCode.CancelOrder_OrderalreadyCancelled;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Cancellation request is already in processing";
                    return _Resp;
                }

                if (CurrentTradeBuyerListObj.RemainQty == 0)
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_AlreadySettled;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "ALready Settled";
                    return _Resp;
                }                

                //make IsProcessing at insert time
                //CurrentTradeBuyerListObj.IsProcessing = 1;
                //CurrentTradeBuyerListObj.UpdatedDate = Helpers.UTC_To_IST();               
                //_TradeBuyerList.Update(CurrentTradeBuyerListObj);

                IEnumerable<TradeSellerListV1> MatchSellerListBase;
                var MatchSellerListBaseAll = await MatchSellerListBaseAllResult;
                //var pairStastics = await _tradePairStastics.GetSingleAsync(pair => pair.PairId == CurrentTradeBuyerListObj.PairID);
                TradePairStastics pairStastics = await _dbContext.Set<TradePairStastics>().FirstOrDefaultAsync(pair => pair.PairId == CurrentTradeBuyerListObj.PairID);

                if (CurrentTradeBuyerListObj.OrderType == 2)
                {
                    CurrentTradeBuyerListObj.Price = pairStastics.LTP;
                    TradeTransactionQueueObj.BidPrice = pairStastics.LTP;
                }
               
                MatchSellerListBase = MatchSellerListBaseAll.Where(item => (item.Price <= CurrentTradeBuyerListObj.Price|| item.OrderType==2) //&& item.IsProcessing == 0
                                                     && item.PairID == CurrentTradeBuyerListObj.PairID
                                                     && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                                                     && item.RemainQty > 0).OrderBy(x => x.Price).OrderBy(x => x.TrnNo);
                foreach (TradeSellerListV1 SellerList in MatchSellerListBase)//MatchSellerList
                {
                    TrackDebitBit = 0;
                    CurrenetSellerList = SellerList;

                    _dbContext.Entry(SellerList).Reload();
                    if (SellerList.IsProcessing == 1)
                    {
                        DateTime tTime=Helpers.UTC_To_IST().Add(new TimeSpan(0,0,0,5,0));//loop for 5 second only
                        while (Helpers.UTC_To_IST() < tTime)
                        {
                            await Task.Delay(300);
                            _dbContext.Entry(SellerList).Reload();
                            if (SellerList.IsProcessing == 1)
                                continue;//still wait
                            else
                                break;//exit loop
                        }                        
                        //Thread.Sleep(3000);
                        //_dbContext.Entry(SellerList).Reload();
                    }

                    if (SellerList.IsProcessing == 1 || SellerList.RemainQty == 0)
                    {
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Buy skip IsProcessing " + SellerList.IsProcessing + " Remain Qty " + SellerList.RemainQty + " With " + SellerList.TrnNo, ControllerName, "##TrnNo " + CurrentTradeBuyerListObj.TrnNo, Helpers.UTC_To_IST()));
                        continue;
                    }
                    
                    //var TradeTQMakerObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == SellerList.TrnNo);
                    Task<TradeTransactionQueue> TradeTQMakerObjResult = _dbContext.Set<TradeTransactionQueue>().FirstOrDefaultAsync(item => item.TrnNo == SellerList.TrnNo);
                    
                    if (SellerList.OrderType == 2)//Market Order
                    {
                        _dbContext.Entry(pairStastics).Reload();                       
                        if(pairStastics.LTP > CurrentTradeBuyerListObj.Price)//skip this record
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Buy Maker LTP " + pairStastics.LTP + " > Curr Price " + CurrentTradeBuyerListObj.Price, ControllerName, "##TrnNo " + CurrentTradeBuyerListObj.TrnNo, Helpers.UTC_To_IST()));
                            continue;
                        }
                        SellerList.Price = pairStastics.LTP;
                    }                        

                    TrackBit = 1;
                    decimal SettlementQty = 0;
                    decimal SettlementPrice = 0;
                    decimal BaseCurrQty = 0;
                    
                    //var TQMakerObjResult = _TransactionRepository.GetSingleAsync(item => item.Id == SellerList.TrnNo);
                    Task<TransactionQueue> TQMakerObjResult = _dbContext.Set<TransactionQueue>().FirstOrDefaultAsync(item => item.Id == SellerList.TrnNo);
                    SellerList.IsProcessing = 1;
                    _TradeSellerList.Update(SellerList);                   
                    //====================================Partial SETTLEMENT TO MEMBER
                    if (SellerList.RemainQty < CurrentTradeBuyerListObj.RemainQty)//Do not Release Qty here
                    {
                        SettlementQty = SellerList.RemainQty;//Take all Seller's Qty
                        GSettlementQty = SettlementQty;
                        SettlementPrice = SellerList.Price;
                        BaseCurrQty = SettlementQty * SettlementPrice;

                        SellerList.IsProcessing = 0;
                        SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                        SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        SellerList.MakeTransactionSuccess();
                        _TradeSellerList.Update(SellerList);//release here for instant process Rita 11-12-18 4:52 PM
                        TrackDebitBit = 1;//refund if error occured

                        CurrentTradeBuyerListObj.RemainQty = CurrentTradeBuyerListObj.RemainQty - SettlementQty;
                        CurrentTradeBuyerListObj.DeliveredQty = CurrentTradeBuyerListObj.DeliveredQty + SettlementQty;
                        //Here Bid Price of Seller always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeBuyerListObj.PairID, SellerList.TrnNo, SettlementQty, SettlementPrice, CurrentTradeBuyerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "SELL", "BUY");// SellerList.RemainQty//CurrentTradeBuyerListObj.Price , buy on price of seller's price 

                        TradeTransactionQueue TradeTQMakerObj = await TradeTQMakerObjResult;
                        //if (SellerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.AskPrice= pairStastics.LTP;
                        //}                           

                        Task<bool> WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 0, 1, TransactionQueueObj.TrnMode);
                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj);                        

                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + SettlementQty;
                        TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + BaseCurrQty;

                        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        //SellerList.MakeTransactionSuccess();

                        TransactionQueue TQMakerObj = await TQMakerObjResult;
                        TQMakerObj.MakeTransactionSuccess();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        Task<TradeStopLoss> MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);
                        

                        if (await WalletResult == false)
                        {
                            // HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT RollbackTransaction", ControllerName, "Balance credit fail" + "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo);
                            // _dbContext.Database.RollbackTransaction();
                            _dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            _dbContext.Entry(SellerList).Reload();
                            SellerList.IsProcessing = 0;//Release Seller List    
                            SellerList.RemainQty = SellerList.RemainQty + SettlementQty;//revert entry
                            SellerList.SelledQty = SellerList.SelledQty - SettlementQty;//revert entry
                            SellerList.MakeTransactionHold();
                            _TradeSellerList.Update(SellerList);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement RollBack ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " With: TrnNo " + SellerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                        }
                        else
                        {
                            _dbContext.Database.BeginTransaction();
                            Task PartDataResult = PartialBuyMakerDataUpdate(SellerList, TradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeBuyerListObj.TrnNo);
                            _dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            _dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //_dbContext.Entry(SellerList).Reload();
                            //_dbContext.Entry(SellerList).State = EntityState.Modified;
                            //SellerList.IsProcessing = 0;
                            //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                            //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                            //SellerList.MakeTransactionSuccess();                          

                            //_dbContext.Entry(TradeTQMakerObj).Reload();
                            //if (SellerList.OrderType == 2)
                            //{
                            //    TradeTQMakerObj.AskPrice = pairStastics.LTP;
                            //}                           
                            //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                            //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                            //TradeTQMakerObj.MakeTransactionSuccess();
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified; 
                            await PartDataResult;
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;
                            TradeStopLoss MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //Task SignalRResult =
                            Task.Run(() => PartilaSettleBuySignalR(CurrentTradeBuyerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice,SettlementQty));
                          
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT", ControllerName, "Partial Settlement Done with " + SellerList.TrnNo + "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo);
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement Done of ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " Settled: " + CurrentTradeBuyerListObj.DeliveredQty + " Remain:" + CurrentTradeBuyerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            //Continuew as record Partially settled
                            //try
                            //{                                
                            //    _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);

                            //    //==============Volume update only after success,Maker/Seller's Txn Success
                            //    var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);
                            //    _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 this is sell order so bifprice and BuyQty is zero , take settlement price and Qty

                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                            //    await EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                            //              TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                            //              TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));
                            //}
                            //catch (Exception ex)
                            //{
                            //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Partial Settlement Error " + ex.Message + "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo);
                            //}
                        }
                    }
                    //====================================FULL SETTLEMENT TO MEMBER
                    else if (SellerList.RemainQty >= CurrentTradeBuyerListObj.RemainQty && CurrentTradeBuyerListObj.RemainQty != 0)
                    {
                        SettlementQty = CurrentTradeBuyerListObj.RemainQty;
                        GSettlementQty = SettlementQty;
                        SettlementPrice = SellerList.Price;
                        BaseCurrQty = SettlementQty * SettlementPrice;

                        SellerList.IsProcessing = 0;
                        SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        if (SellerList.RemainQty == 0)//Make Seller Order Success
                            SellerList.MakeTransactionSuccess();
                        else
                            SellerList.MakeTransactionHold();

                        _TradeSellerList.Update(SellerList);
                        TrackDebitBit = 1;//refund if error occured

                        decimal TakeDisc = 0;
                        InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeBuyerListObj.PairID, SellerList.TrnNo, SellerList.RemainQty + SettlementQty, SettlementPrice, CurrentTradeBuyerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "SELL", "BUY");//CurrentTradeBuyerListObj.Price , buy on price of seller's price

                        var TradeTQMakerObj = await TradeTQMakerObjResult;
                        var WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 1, SellerList.RemainQty == 0 ? (short)1 : (short)0, TransactionQueueObj.TrnMode);
                        //if (SellerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.AskPrice = pairStastics.LTP;
                        //}

                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                        var TQMakerObj = await TQMakerObjResult;
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");

                        //if (SellerList.RemainQty == 0)
                        //{//Make Seller Order Success
                        //    SellerList.MakeTransactionSuccess();
                        //    TradeTQMakerObj.MakeTransactionSuccess();
                        //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        //    TQMakerObj.MakeTransactionSuccess();
                        //    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        //}
                        //else
                        //    SellerList.MakeTransactionHold();

                        //make entry in case of success seller txn
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj);
                        //var WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty,1, SellerList.RemainQty == 0 ?(short)1:(short)0);

                        CurrentTradeBuyerListObj.RemainQty = CurrentTradeBuyerListObj.RemainQty - SettlementQty;
                        CurrentTradeBuyerListObj.DeliveredQty = CurrentTradeBuyerListObj.DeliveredQty + SettlementQty;
                        CurrentTradeBuyerListObj.MakeTransactionSuccess();
                        TransactionQueueObj.MakeTransactionSuccess();
                        //MakeTransactionSettledEntry();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + SettlementQty;
                        TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + BaseCurrQty;
                        Task<SettledTradeTransactionQueue> SettledTradeTQResult = MakeTransactionSettledEntry(TradeTransactionQueueObj);
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        var MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);


                        if (await WalletResult == false)
                        {
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT RollbackTransaction", ControllerName, "Balance credit fail" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo);
                            //_dbContext.Database.RollbackTransaction();
                            _dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            _dbContext.Entry(SellerList).Reload();

                            SellerList.IsProcessing = 0;//Release Seller List  
                            SellerList.RemainQty = SellerList.RemainQty + SettlementQty;//Update first as updated value in below line
                            SellerList.SelledQty = SellerList.SelledQty - SettlementQty;//this will give result 0
                            SellerList.MakeTransactionHold();                                             
                            _TradeSellerList.Update(SellerList);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Rollback ##TrnNo:" + TradeTransactionQueueObj.TrnNo + " With: TrnNo " + SellerList.TrnNo;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                        }
                        else
                        {
                            _dbContext.Database.BeginTransaction();
                            SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            Task PartDataResult = FullBuyMakerDataUpdate(SellerList, TradeTQMakerObj, TQMakerObj, SettledTradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeBuyerListObj.TrnNo);

                            _dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            _dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            SettledTradeTransactionQueue SettledTradeTQObj = await SettledTradeTQResult;
                            _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);
                            //_dbContext.Entry(SellerList).Reload();
                            //_dbContext.Entry(SellerList).State = EntityState.Modified; 
                            
                            //SellerList.IsProcessing = 0;//Release Seller List 
                            //_dbContext.Entry(TradeTQMakerObj).Reload();
                            //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
                            //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                            //if (SellerList.RemainQty == 0)
                            //{//Make Seller Order Success
                            //    SellerList.MakeTransactionSuccess();
                            //    TradeTQMakerObj.MakeTransactionSuccess();
                            //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //    TQMakerObj.MakeTransactionSuccess();
                            //    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            //else
                            //    SellerList.MakeTransactionHold();
                           
                            //if (SellerList.OrderType == 2)
                            //{
                            //    TradeTQMakerObj.AskPrice = pairStastics.LTP;
                            //}
                            //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                            //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                            
                            //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;


                            //if (SellerList.RemainQty == 0)
                            //{
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            await PartDataResult;
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;

                            var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            // Task SignalRResult =
                            Task.Run(() => FullSettleBuySignalR(CurrentTradeBuyerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty, SellerList));
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT", ControllerName, "Full Settlement Done with " + SellerList.TrnNo + "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo);

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Done of ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " Settled: " + CurrentTradeBuyerListObj.DeliveredQty + " Remain:" + CurrentTradeBuyerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            break;//record settled
                            //try
                            //{
                            //    //Seller Txn partial Success;
                            //    var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //    if (SellerList.RemainQty == 0)//Full Success
                            //    {
                            //        _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    }
                            //    else
                            //    {
                            //        _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    }

                            //    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);//komal
                            //                                                                                                                                                                           //==============Volume update only after success
                            //    //_IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.BidPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate);
                            //    _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty


                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                            //    await EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                            //              TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                            //              TradeTransactionQueueObj.DeliveryTotalQty, TradeTransactionQueueObj.OrderTotalQty, 0);
                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));
                            //}
                            //catch (Exception ex)
                            //{
                            //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Full Settlement Error " + ex.Message + "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo);
                            //}
                        }
                        //_dbContext.Entry(SellerList).Reload();

                        //SellerList.IsProcessing = 0;//Release Seller List after break it jump to outer side of loop without release                 
                        //_TradeSellerList.Update(SellerList);
                        // break;//record settled //rita 10-12-18 if order rollback then continue loop
                    }
                    //_dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                    //_dbContext.Entry(TransactionQueueObj).Reload();
                    //_dbContext.Entry(TradeTransactionQueueObj).Reload();
                    //_dbContext.Entry(SellerList).Reload();

                    //SellerList.IsProcessing = 0;//Release Seller List                    
                    //_TradeSellerList.Update(SellerList);
                }
                _dbContext.Entry(CurrentTradeBuyerListObj).Reload(); //in rollback reloaded, and in commit txn it is final , and
                CurrentTradeBuyerListObj.IsProcessing = 0;//Release Buy Order             
                _TradeBuyerList.Update(CurrentTradeBuyerListObj);

                if (TrackBit == 0)//No any record Process
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_NoSettlementRecordFound;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "No Any Match Record Found";
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTBuy:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                _dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                CurrentTradeBuyerListObj.IsProcessing = 0;//Release Buy Order             
                _TradeBuyerList.Update(CurrentTradeBuyerListObj);
                if(CurrenetSellerList.TrnNo!=0)//here null condition not apply as this declare with new tag
                {
                    _dbContext.Entry(CurrenetSellerList).Reload();
                    if (TrackDebitBit == 1)
                    {
                        CurrenetSellerList.RemainQty = CurrenetSellerList.RemainQty + GSettlementQty;//reverse entry
                        CurrenetSellerList.SelledQty = CurrenetSellerList.SelledQty - GSettlementQty;//reverse entry
                        CurrenetSellerList.MakeTransactionHold();
                    }
                    CurrenetSellerList.IsProcessing = 0;//Release Seller List                    
                    _TradeSellerList.Update(CurrenetSellerList);
                }
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.Settlement_SettlementInternalError;
            }
            return _Resp;
        }

        public async Task<BizResponse> PROCESSSETLLEMENTSell(BizResponse _Resp, TradeTransactionQueue TradeTransactionQueueObj,TransactionQueue TransactionQueueObj, TradeStopLoss TradeStopLossObj,TradeSellerListV1 CurrentTradeSellerListObj, string accessToken = "", short IsCancel = 0)
        {
            short TrackBit = 0;
            short TrackDebitBit = 0;
            decimal GSettlementQty =0;
            TradeBuyerListV1 CurrenetBuyerList = new TradeBuyerListV1();
            try
            {
                var MatchSellerListBaseAllResult = _TradeBuyerList.GetAllAsync();
                if (TradeTransactionQueueObj.IsCancelled == 1 || IsCancel == 1)
                {
                    _Resp.ErrorCode = enErrorCode.CancelOrder_OrderalreadyCancelled;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Cancellation request is already in processing";
                    return _Resp;
                }
                if (CurrentTradeSellerListObj.RemainQty == 0)
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_AlreadySettled;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "ALready Settled";
                    return _Resp;
                }

                //make IsProcessing at insert time
                //CurrentTradeSellerListObj.IsProcessing = 1;
                //CurrentTradeSellerListObj.UpdatedDate = Helpers.UTC_To_IST();
                //_TradeSellerList.Update(CurrentTradeSellerListObj);
                
                IEnumerable<TradeBuyerListV1> MatchBuyerListBase;
                var MatchBuyerListBaseAll = await MatchSellerListBaseAllResult;
               // var pairStastics = await _tradePairStastics.GetSingleAsync(pair => pair.PairId == CurrentTradeSellerListObj.PairID);
                var pairStastics = await _dbContext.Set<TradePairStastics>().FirstOrDefaultAsync(pair => pair.PairId == CurrentTradeSellerListObj.PairID);

                if (CurrentTradeSellerListObj.OrderType == 2)
                {
                    CurrentTradeSellerListObj.Price = pairStastics.LTP;
                    TradeTransactionQueueObj.AskPrice = pairStastics.LTP;
                }
                MatchBuyerListBase = MatchBuyerListBaseAll.Where(item => (item.Price >= CurrentTradeSellerListObj.Price||item.OrderType==2) //&& item.IsProcessing == 0
                                                     && item.PairID == CurrentTradeSellerListObj.PairID
                                                     && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                                                     && item.RemainQty > 0).OrderByDescending(x => x.Price).OrderBy(x => x.TrnNo);
                foreach (TradeBuyerListV1 BuyerList in MatchBuyerListBase)//MatchSellerList
                {
                    TrackDebitBit = 0;
                    CurrenetBuyerList = BuyerList;
                    _dbContext.Entry(BuyerList).Reload();                   
                    if (BuyerList.IsProcessing == 1)
                    {
                        DateTime tTime = Helpers.UTC_To_IST().Add(new TimeSpan(0, 0, 0, 5, 0));//loop for 5 second only
                        while (Helpers.UTC_To_IST() < tTime)
                        {
                            await Task.Delay(300);
                            _dbContext.Entry(BuyerList).Reload();
                            if (BuyerList.IsProcessing == 1)
                                continue;//still wait
                            else
                                break;//exit loop
                        }
                        //Thread.Sleep(3000);
                        //_dbContext.Entry(SellerList).Reload();
                    }
                    if (BuyerList.IsProcessing == 1 || BuyerList.RemainQty==0)
                    {
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Sell skip IsProcessing " + BuyerList.IsProcessing + " Remain Qty " + BuyerList.RemainQty + " With " + BuyerList.TrnNo, ControllerName,"##TrnNo " + CurrentTradeSellerListObj.TrnNo, Helpers.UTC_To_IST()));
                        continue;
                    }
                    //var TradeTQMakerObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == BuyerList.TrnNo);
                    var TradeTQMakerObjResult = _dbContext.Set<TradeTransactionQueue>().FirstOrDefaultAsync(item => item.TrnNo == BuyerList.TrnNo);
                    if (BuyerList.OrderType == 2)//Market Order
                    {
                        _dbContext.Entry(pairStastics).Reload();
                        if (pairStastics.LTP < CurrentTradeSellerListObj.Price)//skip this record
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Sell skip Maker LTP " + pairStastics.LTP + " < Curr Price " + CurrentTradeSellerListObj.Price, ControllerName, "##TrnNo " + CurrentTradeSellerListObj.TrnNo, Helpers.UTC_To_IST()));
                            continue;
                        }
                        BuyerList.Price = pairStastics.LTP;
                    }
                    TrackBit = 1;
                    decimal SettlementQty = 0;
                    decimal SettlementPrice = 0;
                    decimal BaseCurrQty = 0;
                   
                   // var TQMakerObjResult = _TransactionRepository.GetSingleAsync(item => item.Id == BuyerList.TrnNo);
                    var TQMakerObjResult = _dbContext.Set<TransactionQueue>().FirstOrDefaultAsync(item => item.Id == BuyerList.TrnNo);
                    BuyerList.IsProcessing = 1;
                    _TradeBuyerList.Update(BuyerList);                   
                    //====================================Partial SETTLEMENT TO MEMBER
                    if (BuyerList.RemainQty < CurrentTradeSellerListObj.RemainQty)
                    {
                        SettlementQty = BuyerList.RemainQty;//Give to Buyer , buyer's full settlement done here
                        GSettlementQty = SettlementQty;
                        SettlementPrice = CurrentTradeSellerListObj.Price;
                        BaseCurrQty = SettlementQty * SettlementPrice;

                        BuyerList.IsProcessing = 0;
                        BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                        BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0  
                        BuyerList.MakeTransactionSuccess();
                        _TradeBuyerList.Update(BuyerList);//release record
                        TrackDebitBit = 1;//refund if error occured

                        CurrentTradeSellerListObj.RemainQty = CurrentTradeSellerListObj.RemainQty - SettlementQty;
                        CurrentTradeSellerListObj.SelledQty = CurrentTradeSellerListObj.SelledQty + SettlementQty;
                        //Here Bid Price of Seller always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        InsertTradePoolQueue(TransactionQueueObj.MemberID,CurrentTradeSellerListObj.PairID, BuyerList.TrnNo, SettlementQty, SettlementPrice, CurrentTradeSellerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "BUY", "SELL");//BuyerList.RemainQty//BuyerList.Price selled base on seller's price

                        var TradeTQMakerObj = await TradeTQMakerObjResult;
                        //if (BuyerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.BidPrice = pairStastics.LTP;
                        //}
                        var WalletResult = WalletProcessSell(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 0, 1, TransactionQueueObj.TrnMode);
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        var SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj);                        

                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + SettlementQty;
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + BaseCurrQty;

                        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
                        //BuyerList.MakeTransactionSuccess();

                        var TQMakerObj = await TQMakerObjResult;
                        TQMakerObj.MakeTransactionSuccess();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                       // var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        var MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);


                        if (await WalletResult == false)
                        {
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT SELL RollbackTransaction", ControllerName, "Balance credit fail" + "##TrnNo:" + CurrentTradeSellerListObj.TrnNo);
                            //_dbContext.Database.RollbackTransaction();
                            _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            _dbContext.Entry(BuyerList).Reload();
                             BuyerList.IsProcessing = 0;//Release Seller List 
                            BuyerList.RemainQty = BuyerList.RemainQty + SettlementQty;//revert entry
                            BuyerList.DeliveredQty = BuyerList.DeliveredQty - SettlementQty;//revert entry
                            BuyerList.MakeTransactionHold();
                            _TradeBuyerList.Update(BuyerList);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement SELL RollBack ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " With: TrnNo " + BuyerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                        }
                        else
                        {//last loop records does not revert, and commit in currecnt txn , as it is present in contex
                            _dbContext.Database.BeginTransaction();
                            Task PartDataResult = PartialSellMakerDataUpdate(BuyerList, TradeTQMakerObj,SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeSellerListObj.TrnNo);
                            _dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            _dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            //_dbContext.Entry(BuyerList).Reload();
                            //BuyerList.IsProcessing = 0;
                            //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                            //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
                            //BuyerList.MakeTransactionSuccess();

                            //_dbContext.Entry(BuyerList).State = EntityState.Modified;                         

                            //_dbContext.Entry(TradeTQMakerObj).Reload();
                            //if (BuyerList.OrderType == 2)
                            //{
                            //    TradeTQMakerObj.BidPrice = pairStastics.LTP;
                            //}                            
                            //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                            //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                            //TradeTQMakerObj.MakeTransactionSuccess();
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
                            await PartDataResult;
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;

                            var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            // Task SignalRResult =
                            Task.Run(() => PartilaSettleSellSignalR(CurrentTradeSellerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty));
                            
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement SELL Done of ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " Settled: " + CurrentTradeSellerListObj.SelledQty + " Remain:" + CurrentTradeSellerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            //Continuew as record Partially settled
                            //try
                            //{
                            //    //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                            //   Task EmailResult = EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                            //              TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                            //              TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                            //    //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));

                            //    _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);

                            //    //==============Volume update only after success,Maker/Seller's Txn Success
                            //    var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);
                            //    _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 take settlement price and Qty
                               
                            //}
                            //catch (Exception ex)
                            //{
                            //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Partial Settlement SELL Error " + ex.Message + "##TrnNo:" + CurrentTradeSellerListObj.TrnNo);
                            //}
                        }
                    }
                    //====================================FULL SETTLEMENT TO MEMBER
                    else if (BuyerList.RemainQty >= CurrentTradeSellerListObj.RemainQty && CurrentTradeSellerListObj.RemainQty != 0)
                    {
                        SettlementQty = CurrentTradeSellerListObj.RemainQty;
                        GSettlementQty = SettlementQty;
                        SettlementPrice = CurrentTradeSellerListObj.Price;
                        BaseCurrQty = SettlementQty * SettlementPrice;                        

                        BuyerList.IsProcessing = 0;
                        BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0 
                        if (BuyerList.RemainQty == 0)//Make Seller Order Success                        
                            BuyerList.MakeTransactionSuccess();
                        else
                            BuyerList.MakeTransactionHold();
                        _TradeBuyerList.Update(BuyerList);
                        TrackDebitBit = 1;//refund if error occured

                        decimal TakeDisc = 0;
                        InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeSellerListObj.PairID, BuyerList.TrnNo, BuyerList.RemainQty + SettlementQty, SettlementPrice, CurrentTradeSellerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "BUY", "SELL");//BuyerList.Price selled base on seller's price
                        var TradeTQMakerObj = await TradeTQMakerObjResult;
                        var WalletResult = WalletProcessSell(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 1, BuyerList.RemainQty == 0 ? (short)1 : (short)0, TransactionQueueObj.TrnMode);
                       
                        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
                       
                        //if (BuyerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.BidPrice = pairStastics.LTP;
                        //}
                        
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                        var TQMakerObj = await TQMakerObjResult;
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");

                        //if (BuyerList.RemainQty == 0)
                        //{//Make Seller Order Success
                        //    BuyerList.MakeTransactionSuccess();
                        //    TradeTQMakerObj.MakeTransactionSuccess();
                        //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        //    TQMakerObj.MakeTransactionSuccess();
                        //    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        //}
                        //else
                        //    BuyerList.MakeTransactionHold();

                        //make entry in case of success seller txn
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj);
                        

                        CurrentTradeSellerListObj.RemainQty = CurrentTradeSellerListObj.RemainQty - SettlementQty;
                        CurrentTradeSellerListObj.SelledQty = CurrentTradeSellerListObj.SelledQty + SettlementQty;
                        CurrentTradeSellerListObj.MakeTransactionSuccess();
                        TransactionQueueObj.MakeTransactionSuccess();
                        //MakeTransactionSettledEntry();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");
                        TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + SettlementQty;
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + BaseCurrQty;
                        Task<SettledTradeTransactionQueue> SettledTradeTQResult = MakeTransactionSettledEntry(TradeTransactionQueueObj);
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        var MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);                        

                        if (await WalletResult == false)
                        {
                            _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            _dbContext.Entry(BuyerList).Reload();
                            BuyerList.IsProcessing = 0;//Release Seller List 
                            BuyerList.RemainQty = BuyerList.RemainQty + SettlementQty;//reverse entry
                            BuyerList.DeliveredQty = BuyerList.DeliveredQty - SettlementQty;//reverse entry
                            BuyerList.MakeTransactionHold();
                            _TradeBuyerList.Update(BuyerList);
                            TrackDebitBit = 0;
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT Full Settlement SELL Wallet Fail", ControllerName, "Balance credit fail with TrnNo:" + BuyerList.TrnNo + "##TrnNo:" + TradeTransactionQueueObj.TrnNo);
                            //_dbContext.Database.RollbackTransaction();
                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement SELL Rollback ##TrnNo:" + TradeTransactionQueueObj.TrnNo + " With: TrnNo " + BuyerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                        }
                        else
                        {
                            _dbContext.Database.BeginTransaction();
                            SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            Task PartDataResult = FullSellMakerDataUpdate(BuyerList, TradeTQMakerObj, TQMakerObj, SettledTradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeSellerListObj.TrnNo);

                            _dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            _dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            SettledTradeTransactionQueue SettledTradeTQObj = await SettledTradeTQResult;
                            _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);
                            //_dbContext.Entry(BuyerList).Reload();
                            //_dbContext.Entry(BuyerList).State = EntityState.Modified;
                            //BuyerList.IsProcessing = 0;
                            //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
                            //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0  
                            //_dbContext.Entry(TradeTQMakerObj).Reload();
                            //if (BuyerList.RemainQty == 0)
                            //{//Make Seller Order Success
                            //    BuyerList.MakeTransactionSuccess();
                            //    TradeTQMakerObj.MakeTransactionSuccess();
                            //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //    TQMakerObj.MakeTransactionSuccess();
                            //    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            //else
                            //    BuyerList.MakeTransactionHold();                          

                            //if (BuyerList.OrderType == 2)
                            //{
                            //    TradeTQMakerObj.BidPrice = pairStastics.LTP;
                            //}                            
                            //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                            //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                            //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;                           
                            //if (BuyerList.RemainQty == 0)
                            //{
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            await PartDataResult;
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;
                            var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //Task SignalRResult = 
                            Task.Run(() => FullSettleSellSignalR(CurrentTradeSellerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty, BuyerList));
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT SELL", ControllerName, "Full Settlement Done with " + BuyerList.TrnNo + "##TrnNo:" + CurrentTradeSellerListObj.TrnNo);

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement SELL Done of ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " Settled: " + CurrentTradeSellerListObj.SelledQty + " Remain:" + CurrentTradeSellerListObj.RemainQty + " With TrnNo:"+ BuyerList.TrnNo;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            break;//record settled
                            //try
                            //{
                            //    //Seller Txn partial Success;
                            //    var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                            //    if (BuyerList.RemainQty == 0)//Full Success
                            //    {
                            //        _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    }
                            //    else
                            //    {
                            //        _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                            //    }

                            //    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);//komal
                            //                                                                                                                                                                           //==============Volume update only after success
                            //    //_IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.BidPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate);
                            //    _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty

                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                            //    await EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                            //              TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                            //              TradeTransactionQueueObj.DeliveryTotalQty, TradeTransactionQueueObj.OrderTotalQty, 0);
                            //    Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));
                            //}
                            //catch (Exception ex)
                            //{
                            //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Full Settlement  SELL Error " + ex.Message + "##TrnNo:" + CurrentTradeSellerListObj.TrnNo);
                            //}
                        }
                        //_dbContext.Entry(BuyerList).Reload();
                        //BuyerList.IsProcessing = 0;//Release Seller List after break it jump to outer side of loop without release                 
                        //_TradeBuyerList.Update(BuyerList);
                       // break;//record settled //rita 10-12-18 if order rollback then continue loop
                    }
                    //_dbContext.Entry(CurrentTradeSellerListObj).Reload();
                    //_dbContext.Entry(TransactionQueueObj).Reload();
                    //_dbContext.Entry(TradeTransactionQueueObj).Reload();
                    //_dbContext.Entry(BuyerList).Reload();
                    //BuyerList.IsProcessing = 0;//Release Seller List                    
                    //_TradeBuyerList.Update(BuyerList);
                }
                _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                CurrentTradeSellerListObj.IsProcessing = 0;//Release Sell Order             
                _TradeSellerList.Update(CurrentTradeSellerListObj);

                if (TrackBit == 0)//No any record Process
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_NoSettlementRecordFound;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "No Any Match Record Found";
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTSell:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                CurrentTradeSellerListObj.IsProcessing = 0;//Release Sell Order             
                _TradeSellerList.Update(CurrentTradeSellerListObj);
                if (CurrenetBuyerList.TrnNo != 0)//here null condition not apply as this declare with new tag
                {
                    _dbContext.Entry(CurrenetBuyerList).Reload();
                    if(TrackDebitBit == 1)
                    {
                        CurrenetBuyerList.RemainQty = CurrenetBuyerList.RemainQty + GSettlementQty;//reverse entry
                        CurrenetBuyerList.DeliveredQty = CurrenetBuyerList.DeliveredQty - GSettlementQty;//reverse entry
                        CurrenetBuyerList.MakeTransactionHold();
                    }
                    CurrenetBuyerList.IsProcessing = 0;//Release Seller List                    
                    _TradeBuyerList.Update(CurrenetBuyerList);
                }
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.Settlement_SettlementInternalError;
            }
            return _Resp;
        }

        public async Task PartialBuyMakerDataUpdate(TradeSellerListV1 SellerList,TradeTransactionQueue TradeTQMakerObj, decimal SettlementQty,decimal BaseCurrQty, decimal LTP, long TrnNo)
        {
            try
            {
                //_dbContext.Entry(SellerList).Reload();
               // _dbContext.Entry(SellerList).State = EntityState.Modified;
                //SellerList.IsProcessing = 0;
                //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0 //this is updated above
                //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
               // SellerList.MakeTransactionSuccess();

                _dbContext.Entry(TradeTQMakerObj).Reload();
                if (SellerList.OrderType == 2)
                {
                    TradeTQMakerObj.AskPrice = LTP;
                }
                TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                TradeTQMakerObj.MakeTransactionSuccess();
                TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("PartialBuyMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
                throw ex;
            }
        }

        public async Task FullBuyMakerDataUpdate(TradeSellerListV1 SellerList, TradeTransactionQueue TradeTQMakerObj,TransactionQueue TQMakerObj, SettledTradeTransactionQueue SettledTradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        {
            try
            {
                //_dbContext.Entry(SellerList).Reload();
                //_dbContext.Entry(SellerList).State = EntityState.Modified;

                //SellerList.IsProcessing = 0;//Release Seller List
                //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
                //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                _dbContext.Entry(TradeTQMakerObj).Reload();
                TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;

                if (SellerList.RemainQty == 0)
                {//Make Seller Order Success
                 // SellerList.MakeTransactionSuccess();
                    TradeTQMakerObj.MakeTransactionSuccess();
                    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                    TQMakerObj.MakeTransactionSuccess();
                    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                    //SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                }
                else
                {                   
                    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                    TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                }
                //else
                //    SellerList.MakeTransactionHold();

                if (SellerList.OrderType == 2)
                {
                    TradeTQMakerObj.AskPrice = LTP;
                }
                _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FullBuyMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
                throw ex;
            }
        }

        public async Task PartialSellMakerDataUpdate(TradeBuyerListV1 BuyerList, TradeTransactionQueue TradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        {
            try
            {
                //_dbContext.Entry(BuyerList).Reload();
                //BuyerList.IsProcessing = 0;
                //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
                //BuyerList.MakeTransactionSuccess();

               // _dbContext.Entry(BuyerList).State = EntityState.Modified;

                _dbContext.Entry(TradeTQMakerObj).Reload();
                if (BuyerList.OrderType == 2)
                {
                    TradeTQMakerObj.BidPrice = LTP;
                }
                TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                TradeTQMakerObj.MakeTransactionSuccess();
                TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PartialSellMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
                throw ex;
            }
        }

        public async Task FullSellMakerDataUpdate(TradeBuyerListV1 BuyerList, TradeTransactionQueue TradeTQMakerObj, TransactionQueue TQMakerObj, SettledTradeTransactionQueue SettledTradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        {
            try
            {
                //_dbContext.Entry(BuyerList).Reload();
                //_dbContext.Entry(BuyerList).State = EntityState.Modified;
                //BuyerList.IsProcessing = 0;
                //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
                //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0  
                _dbContext.Entry(TradeTQMakerObj).Reload();
                TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                if (BuyerList.RemainQty == 0)
                {//Make Seller Order Success
                    //BuyerList.MakeTransactionSuccess();
                    TradeTQMakerObj.MakeTransactionSuccess();
                    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                    TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                    TQMakerObj.MakeTransactionSuccess();
                    TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                    TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                    //SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                }
                else
                {                   
                    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                    TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                }
                //else
                //    BuyerList.MakeTransactionHold();

                if (BuyerList.OrderType == 2)
                {
                    TradeTQMakerObj.BidPrice = LTP;
                }               
                _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FullSellMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
                throw ex;
            }
        }



        public async Task PartilaSettleBuySignalR(long TrnNo, TransactionQueue TransactionQueueObj,TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken,decimal SettlementPrice,decimal SettlementQty)
        {
            try
            {
                _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);

                //==============Volume update only after success,Maker/Seller's Txn Success
                //var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);
                _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 this is sell order so bifprice and BuyQty is zero , take settlement price and Qty

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                Task EmailResult = EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                          TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                          TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));

                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Partially Settled Transaction
                SMSSendSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 1);

                //Send SMS For Fully Settled Transaction
                SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2);


                //Uday 08-12-2018 Send Email When Transction is Partially Settled             
                EmailSendPartialSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate.ToString(),
                    TradeTransactionQueueObj.BuyQty - TradeTransactionQueueObj.SettledBuyQty, TradeTransactionQueueObj.SettledBuyQty, TradeTransactionQueueObj.BidPrice, 0);
                
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("PartilaSettleBuySignalR", ControllerName, "Partial Settlement Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("PartilaSettleBuySignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }

        public async Task FullSettleBuySignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty,TradeSellerListV1 SellerList)
        {
            try
            {                
                //Seller Txn partial Success;
                if (SellerList.RemainQty == 0)//Full Success
                {
                    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                    _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//rita 06-12-18 for success maker txn send call

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Fully Settled Transaction
                    SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2);

                    //Uday 08-12-2018 Send EMAIL When Transaction Is Settled
                    Task EmailResult1 = EmailSendAsync(TQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                    TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                    TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                }
                else
                {
                    _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 1);


                    //Uday 08-12-2018 Send Email When Transction is Partially Settled
                    EmailSendPartialSettledTransaction(TQMakerObj.Id, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.SellQty, TradeTQMakerObj.TrnDate.ToString(),
                        TradeTQMakerObj.SellQty - TradeTQMakerObj.SettledSellQty, TradeTQMakerObj.SettledSellQty, TradeTQMakerObj.AskPrice, 0);
                    
                }

                _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);//komal
                                                                                                                                                                                       //==============Volume update only after success
                                                                                                                                                                                       //_IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.BidPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate);
                _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty

                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Fully Settled Transaction
                SMSSendSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 2);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                Task EmailResult = EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                          TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                          TradeTransactionQueueObj.DeliveryTotalQty, TradeTransactionQueueObj.OrderTotalQty, 0);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("FullSettleBuySignalR", ControllerName, "Full Settlement Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("FullSettleBuySignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }
        
        public async Task PartilaSettleSellSignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty)
        {
            try
            {
                //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                Task EmailResult = EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                           TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                           TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));

                _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);

                //==============Volume update only after success,Maker/Seller's Txn Success               
                _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);
                _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 take settlement price and Qty

                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Partially Settled Transaction
                SMSSendSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 1);

                //Send SMS For Fully Settled Transaction
                SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2);


                //Uday 08-12-2018 Send Email When Transction is Partially Settled             
                EmailSendPartialSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.SellQty, TradeTransactionQueueObj.TrnDate.ToString(),
                    TradeTransactionQueueObj.SellQty - TradeTransactionQueueObj.SettledSellQty, TradeTransactionQueueObj.SettledSellQty, TradeTransactionQueueObj.AskPrice, 0);
                
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("PartilaSettleSellSignalR", ControllerName, "Partial Settlement SELL Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("PartilaSettleSellSignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }

        public async Task FullSettleSellSignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty, TradeBuyerListV1 BuyerList)
        {
            try
            {
                //Seller Txn partial Success;
                if (BuyerList.RemainQty == 0)//Full Success
                {
                    _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);
                    _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//rita 06-12-18 for success maker txn send call

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Fully Settled Transaction
                    SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2);

                    //Uday 08-12-2018 Send EMAIL When Transaction Is Settled
                    Task EmailResult1 = EmailSendAsync(TQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                    TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                    TradeTQMakerObj.DeliveryTotalQty, TradeTQMakerObj.OrderTotalQty, 0);
                }
                else
                {
                    _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 1);


                    //Uday 08-12-2018 Send Email When Transction is Partially Settled
                    EmailSendPartialSettledTransaction(TQMakerObj.Id, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate.ToString(),
                        TradeTQMakerObj.BuyQty - TradeTQMakerObj.SettledBuyQty, TradeTQMakerObj.SettledBuyQty, TradeTQMakerObj.BidPrice, 0);
                    
                }

                _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, TradeStopLossObj.ordertype);//komal
                                                                                                                                                                                       //==============Volume update only after success
                                                                                                                                                                                       //_IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.BidPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate);
                _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty

                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Fully Settled Transaction
                SMSSendSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 2);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                Task EmailResult = EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                          TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                          TradeTransactionQueueObj.DeliveryTotalQty, TradeTransactionQueueObj.OrderTotalQty, 0);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("FullSettleSellSignalR", ControllerName, "Full Settlement  SELL Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("FullSettleSellSignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }

        public async Task InsertTradePoolQueue(long MemberID, long PairID, long MakerTrnNo, decimal MakerQty, decimal MakerPrice, long TakerTrnNo, decimal TakerQty, decimal TakerPrice, decimal TakerDisc, decimal TakerLoss, string MakerType, string TakerType)
        {
            try
            {
                TradePoolQueueObj = new TradePoolQueueV1()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = MemberID,
                    PairID = PairID,
                    MakerTrnNo = MakerTrnNo,
                    MakerQty = MakerQty,
                    MakerPrice = MakerPrice,
                    TakerTrnNo = TakerTrnNo,
                    TakerQty = TakerQty,
                    TakerPrice = TakerPrice,
                    TakerDisc = TakerDisc,
                    TakerLoss = TakerLoss,
                    MakerType = MakerType,
                    TakerType = TakerType,
                    Status = Convert.ToInt16(enTransactionStatus.Success),//always etry after settlement done
                };
                //TradePoolQueueObj = _TradePoolQueue.Add(TradePoolQueueObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTradePoolQueue:##TrnNo " + TakerTrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }

        private async Task<Boolean> WalletProcessBuy(TradeTransactionQueue TradeTQueueCurrentObj, TradeTransactionQueue TradeTQueueMakerObj, decimal Price,decimal SettledQty,decimal BaseCurrQty,short CurrIsFullSettled,short MakerIsFullSettled, short TrnMode)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessBuy", ControllerName, "Start Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                //===============First-Base Currency======================================               
                CommonClassCrDr CrDrFirstCurrObj = new CommonClassCrDr();

                //TradeTQueueMakerObj credit wallet = +Price * SettledQty
                WalletCrDr CrFirstCurrObj = new WalletCrDr();
                CrFirstCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                CrFirstCurrObj.WalletId = TradeTQueueMakerObj.DeliveryWalletID;//Cr WalletID
                //CrFirstCurrObj.trnType = enWalletTrnType.Cr_Trade;//Rita 16-1-19 change as wallet team changed enums
                CrFirstCurrObj.isFullSettled = MakerIsFullSettled;
                //TradeTQueueCurrentObj Debit wallet = -Price * SettledQty
                WalletCrDr DrFirstCurrObj = new WalletCrDr();
                DrFirstCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                DrFirstCurrObj.WalletId = TradeTQueueCurrentObj.OrderWalletID;//Dr WalletID
                //DrFirstCurrObj.trnType = enWalletTrnType.Dr_Trade;
                DrFirstCurrObj.isFullSettled = CurrIsFullSettled;
                if(TradeTQueueCurrentObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrFirstCurrObj.isMarketTrade = 1;



                CrDrFirstCurrObj.Amount = BaseCurrQty;
                CrDrFirstCurrObj.Coin = TradeTQueueCurrentObj.Order_Currency;
                CrDrFirstCurrObj.creditObject = CrFirstCurrObj;
                CrDrFirstCurrObj.debitObject = DrFirstCurrObj;
                //===============Second Currency===========================================                         
                CommonClassCrDr CrDrSecondCurrObj = new CommonClassCrDr();//Main trading currency
                //TradeTQueueCurrentObj credit wallet = +SettledQty    
                WalletCrDr CrSecondCurrObj = new WalletCrDr();//Current Buy Object
                CrSecondCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                CrSecondCurrObj.WalletId = TradeTQueueCurrentObj.DeliveryWalletID;//Cr WalletID
                //CrSecondCurrObj.trnType = enWalletTrnType.Cr_Trade;
                CrSecondCurrObj.isFullSettled = CurrIsFullSettled;
                //TradeTQueueMakerObj Debit wallet = -SettledQty
                WalletCrDr DrSecondCurrObj = new WalletCrDr();
                DrSecondCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                DrSecondCurrObj.WalletId = TradeTQueueMakerObj.OrderWalletID;//Cr WalletID
                //DrSecondCurrObj.trnType = enWalletTrnType.Dr_Trade;
                DrSecondCurrObj.isFullSettled = MakerIsFullSettled;
                if (TradeTQueueMakerObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrSecondCurrObj.isMarketTrade = 1;

                CrDrSecondCurrObj.Amount = SettledQty;
                CrDrSecondCurrObj.Coin = TradeTQueueCurrentObj.Delivery_Currency;
                CrDrSecondCurrObj.creditObject = CrSecondCurrObj;
                CrDrSecondCurrObj.debitObject = DrSecondCurrObj;


               var CreditWalletResult = await _WalletService.GetWalletCreditDrForHoldNewAsyncFinal(CrDrSecondCurrObj, CrDrFirstCurrObj,
                                          Helpers.GetTimeStamp(), enServiceType.Trading, (EnAllowedChannels)TrnMode);

                if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                {
                    Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessBuy", ControllerName, "Wallet Operation fail " + CreditWalletResult.ReturnMsg + " With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessBuy", ControllerName, "End Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));

                return true;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletProcessBuy:##TrnNo " + TradeTQueueCurrentObj.TrnNo, ControllerName, ex);
                return false;
            }
        }
        private async Task<Boolean> WalletProcessSell(TradeTransactionQueue TradeTQueueCurrentObj, TradeTransactionQueue TradeTQueueMakerObj, decimal Price, decimal SettledQty, decimal BaseCurrQty, short CurrIsFullSettled, short MakerIsFullSettled, short TrnMode)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessSell", ControllerName, "Start Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                //===============First-Base Currency======================================               
                CommonClassCrDr CrDrFirstCurrObj = new CommonClassCrDr();

                //TradeTQueueCurrentObj credit wallet = -Price * SettledQty
                WalletCrDr CrFirstCurrObj = new WalletCrDr();
                CrFirstCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                CrFirstCurrObj.WalletId = TradeTQueueCurrentObj.DeliveryWalletID;//Cr WalletID to Current Seller
                //CrFirstCurrObj.trnType = enWalletTrnType.Cr_Trade;//Rita 16-1-19 change as wallet team changed enums
                CrFirstCurrObj.isFullSettled = CurrIsFullSettled;
                //TradeTQueueMakerObj Debit wallet = +Price * SettledQty
                WalletCrDr DrFirstCurrObj = new WalletCrDr();
                DrFirstCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                DrFirstCurrObj.WalletId = TradeTQueueMakerObj.OrderWalletID;//Dr WalletID of Buyer
                //DrFirstCurrObj.trnType = enWalletTrnType.Dr_Trade;
                DrFirstCurrObj.isFullSettled = MakerIsFullSettled;
                if (TradeTQueueMakerObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrFirstCurrObj.isMarketTrade = 1;

                CrDrFirstCurrObj.Amount = BaseCurrQty;
                CrDrFirstCurrObj.Coin = TradeTQueueCurrentObj.Delivery_Currency;
                CrDrFirstCurrObj.creditObject = CrFirstCurrObj;
                CrDrFirstCurrObj.debitObject = DrFirstCurrObj;
                //===============Second Currency===========================================
                CommonClassCrDr CrDrSecondCurrObj = new CommonClassCrDr();//Main trading currency
                //TradeTQueueMakerObj credit wallet = +SettledQty
                WalletCrDr CrSecondCurrObj = new WalletCrDr();//Current Buy Object
                CrSecondCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                CrSecondCurrObj.WalletId = TradeTQueueMakerObj.DeliveryWalletID;//Cr WalletID to Buyer
                //CrSecondCurrObj.trnType = enWalletTrnType.Cr_Trade;
                CrSecondCurrObj.isFullSettled = MakerIsFullSettled;
                //TradeTQueueCurrentObj Debit wallet = -SettledQty
                WalletCrDr DrSecondCurrObj = new WalletCrDr();
                DrSecondCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                DrSecondCurrObj.WalletId = TradeTQueueCurrentObj.OrderWalletID;//Dr WalletID of Current Seller
                //DrSecondCurrObj.trnType = enWalletTrnType.Dr_Trade;
                DrSecondCurrObj.isFullSettled = CurrIsFullSettled;
                if (TradeTQueueCurrentObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrSecondCurrObj.isMarketTrade = 1;

                CrDrSecondCurrObj.Amount = SettledQty;
                CrDrSecondCurrObj.Coin = TradeTQueueCurrentObj.Order_Currency;
                CrDrSecondCurrObj.creditObject = CrSecondCurrObj;
                CrDrSecondCurrObj.debitObject = DrSecondCurrObj;


                var CreditWalletResult = await _WalletService.GetWalletCreditDrForHoldNewAsyncFinal(CrDrSecondCurrObj, CrDrFirstCurrObj,
                                           Helpers.GetTimeStamp(), enServiceType.Trading,(EnAllowedChannels)TrnMode);

                if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessBuy", ControllerName, "Wallet Operation fail " + CreditWalletResult.ReturnMsg + " With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessSell", ControllerName, "End Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletProcessSell:##TrnNo " + TradeTQueueCurrentObj.TrnNo, ControllerName, ex);
                return false;
            }
        }

        public async Task<SettledTradeTransactionQueue> MakeTransactionSettledEntry(TradeTransactionQueue TradeTransactionQueueObj,short IsCancelled=0)
        {
            try
            {
                var SettledTradeTQObj = new SettledTradeTransactionQueue()
                {
                    TrnNo= TradeTransactionQueueObj.TrnNo,
                    TrnDate = TradeTransactionQueueObj.TrnDate,
                    SettledDate = Helpers.UTC_To_IST(),
                    TrnType = TradeTransactionQueueObj.TrnType,
                    TrnTypeName = TradeTransactionQueueObj.TrnTypeName,
                    MemberID = TradeTransactionQueueObj.MemberID,
                    PairID = TradeTransactionQueueObj.PairID,
                    PairName = TradeTransactionQueueObj.PairName,
                    OrderWalletID = TradeTransactionQueueObj.OrderWalletID,
                    DeliveryWalletID = TradeTransactionQueueObj.DeliveryWalletID,
                    OrderAccountID = TradeTransactionQueueObj.OrderAccountID,
                    DeliveryAccountID = TradeTransactionQueueObj.DeliveryAccountID,
                    BuyQty = TradeTransactionQueueObj.BuyQty,
                    BidPrice = TradeTransactionQueueObj.BidPrice,
                    SellQty = TradeTransactionQueueObj.SellQty,
                    AskPrice = TradeTransactionQueueObj.AskPrice,
                    Order_Currency = TradeTransactionQueueObj.Order_Currency,
                    OrderTotalQty = TradeTransactionQueueObj.OrderTotalQty,
                    Delivery_Currency = TradeTransactionQueueObj.Delivery_Currency,
                    DeliveryTotalQty = TradeTransactionQueueObj.DeliveryTotalQty,
                    SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty,
                    SettledSellQty = TradeTransactionQueueObj.SettledSellQty,
                    Status = TradeTransactionQueueObj.Status,
                    StatusCode = TradeTransactionQueueObj.StatusCode,
                    StatusMsg = TradeTransactionQueueObj.StatusMsg,
                    IsCancelled= IsCancelled
                };
                return SettledTradeTQObj;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("MakeTransactionSettledEntry:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                throw ex;
            }
        }

        #region Repository Queries
        //public async Task<TradePairStastics> GetSingleAsync(Expression<Func<TradePairStastics, bool>> predicate)
        //{
        //    return await _dbContext.Set<TradePairStastics>().FirstOrDefaultAsync(predicate);
        //}
        #endregion

        public async Task EmailSendAsync(string UserID, int Status, string PairName, string BaseMarket
            , string TrnDate, decimal ReqAmount = 0, decimal Amount = 0, decimal Fees = 0)
        {
            try
            {
                if (!string.IsNullOrEmpty(UserID) && !string.IsNullOrEmpty(PairName) && !string.IsNullOrEmpty(BaseMarket) &&
                    ReqAmount != 0 && !string.IsNullOrEmpty(TrnDate) && Amount != 0 && Status == 1)
                {
                    SendEmailRequest Request = new SendEmailRequest();
                    ApplicationUser User = new ApplicationUser();
                    User = await _userManager.FindByIdAsync(UserID);
                    if (!string.IsNullOrEmpty(User.Email))
                    {
                        IQueryable Result = await _messageConfiguration.GetTemplateConfigurationAsync(Convert.ToInt16(enCommunicationServiceType.Email), Convert.ToInt16(EnTemplateType.TransactionSuccess), 0);
                        foreach (TemplateMasterData Provider in Result)
                        {
                            Provider.Content = Provider.Content.Replace("###USERNAME###".ToUpper(), User.UserName);
                            Provider.Content = Provider.Content.Replace("###TYPE###".ToUpper(), PairName);
                            Provider.Content = Provider.Content.Replace("###REQAMOUNT###".ToUpper(), ReqAmount.ToString());
                            Provider.Content = Provider.Content.Replace("###STATUS###".ToUpper(), "Success");
                            Provider.Content = Provider.Content.Replace("###USER###".ToUpper(), User.UserName);
                            Provider.Content = Provider.Content.Replace("###CURRENCY###".ToUpper(), BaseMarket);
                            Provider.Content = Provider.Content.Replace("###DATETIME###".ToUpper(), TrnDate);
                            Provider.Content = Provider.Content.Replace("###AMOUNT###".ToUpper(), Amount.ToString());
                            Provider.Content = Provider.Content.Replace("###FEES###".ToUpper(), Fees.ToString());
                            Provider.Content = Provider.Content.Replace("###FINAL###".ToUpper(), (Amount + Fees).ToString());
                            Request.Body = Provider.Content;
                            Request.Subject = Provider.AdditionalInfo;
                        }
                        Request.Recepient = User.Email;                       
                        Request.EmailType = 0;
                        //await _mediator.Send(Request);
                        _pushNotificationsQueue.Enqueue(Request); //24-11-2018 komal make Email Enqueue
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Settlement - EmailSendAsync Error ", ControllerName, ex);
            }
        }

        #endregion

        #region Send SMS And Email
        public async Task SMSSendSettledTransaction(long TrnNo, string MobileNumber, decimal Price, decimal Qty, int SettleType)
        {
            try
            {
                if (!string.IsNullOrEmpty(MobileNumber))
                {
                    SendSMSRequest SendSMSRequestObj = new SendSMSRequest();
                    ApplicationUser User = new ApplicationUser();
                    TemplateMasterData SmsData = new TemplateMasterData();

                    CommunicationParamater communicationParamater = new CommunicationParamater();
                    communicationParamater.Param1 = TrnNo + "";
                    communicationParamater.Param2 = Price + "";
                    communicationParamater.Param3 = Qty + "";
                    communicationParamater.Param4 = (Price * Qty) + "";

                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SendSMSTransaction - SMSSendSettledTransaction", ControllerName, " ##TrnNo : " + TrnNo + " ##MobileNo : " + MobileNumber + " ##Price : " + Price + " ##Qty : " + Qty + " ##Type : " + SettleType, Helpers.UTC_To_IST()));

                    if (SettleType == 1) // Partially Settelement
                    {
                        SmsData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_TransactionPartiallySettled, communicationParamater, enCommunicationServiceType.SMS).Result;
                    }
                    else if (SettleType == 2) // Full Sattelement
                    {
                        SmsData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_TransactionSettled, communicationParamater, enCommunicationServiceType.SMS).Result;
                    }
                    if (SmsData != null)
                    {
                        if (SmsData.IsOnOff == 1)
                        {
                            SendSMSRequestObj.Message = SmsData.Content;
                            SendSMSRequestObj.MobileNo = Convert.ToInt64(MobileNumber);
                            _pushSMSQueue.Enqueue(SendSMSRequestObj);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("SMSSendSettledTransaction:##TrnNo " + TrnNo, ControllerName, ex));
            }
        }

        public async Task EmailSendPartialSettledTransaction(long TrnNo,string UserId,string Pair,decimal Qty,string TrnDate,decimal RemainingQty,decimal SettleQty,decimal Amount,decimal Fee)
        {
            try
            {
                SendEmailRequest Request = new SendEmailRequest();
                ApplicationUser User = new ApplicationUser();
                TemplateMasterData EmailData = new TemplateMasterData();
                CommunicationParamater communicationParamater = new CommunicationParamater();

                User = await _userManager.FindByIdAsync(UserId);
                if (!string.IsNullOrEmpty(User.Email))
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SendEmailTransaction - EmailSendPartialSettledTransaction", ControllerName, " ##TrnNo : " + TrnNo, Helpers.UTC_To_IST()));

                    communicationParamater.Param1 = User.UserName;
                    communicationParamater.Param2 = Pair;
                    communicationParamater.Param3 = Qty + "";
                    communicationParamater.Param4 = Pair.Split("_")[1];
                    communicationParamater.Param5 = TrnDate;
                    communicationParamater.Param6 = RemainingQty + "";
                    communicationParamater.Param7 = SettleQty + "";
                    communicationParamater.Param8 = Amount + "";
                    communicationParamater.Param9 = Fee + "";
                    communicationParamater.Param10 = (Amount + Fee) + "";

                    EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.EMAIL_TransactionPartialSuccess, communicationParamater, enCommunicationServiceType.Email).Result;

                    if (EmailData != null)
                    {
                        Request.Body = EmailData.Content;
                        Request.Subject = EmailData.AdditionalInfo;
                        Request.Recepient = User.Email;
                        Request.EmailType = 0;
                        _pushNotificationsQueue.Enqueue(Request);
                    }
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("EmailSendCancelTransaction:##TrnNo " + TrnNo, ControllerName, ex));
            }
        }
        #endregion
    }
}
