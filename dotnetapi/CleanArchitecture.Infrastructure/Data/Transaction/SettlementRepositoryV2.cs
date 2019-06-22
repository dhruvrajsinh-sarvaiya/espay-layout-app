﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class SettlementRepositoryV2: ISettlementRepositoryV1<BizResponse>
    {
        private readonly CleanArchitectureContext _dbContext;
        private readonly CleanArchitectureContext _dbContext1;
        private readonly CleanArchitectureContext _dbContext2;
        // private readonly ICommonRepository<TransactionQueue> _TransactionRepository;
        //private readonly ITransactionRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ICommonRepository<TradePoolQueue> _TradePoolQueue;
        private readonly ICommonRepository<TradeBuyRequest> _TradeBuyRequest;
        private readonly ICommonRepository<TradeBuyerListV1> _TradeBuyerList;
        private readonly ICommonRepository<TradeSellerListV1> _TradeSellerList;
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        private readonly ITransactionRepository<TradeStopLoss> _TradeStopLoss;
        private readonly ISignalRService _ISignalRService;
        private readonly IFrontTrnService _IFrontTrnService;
        private readonly SettledTradeTransactionQueue _SettledTradeTQ;
        private readonly UserManager<ApplicationUser> _userManager;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue; //24-11-2018 komal make Email Enqueue
        private readonly IWalletService _WalletService;
        string ControllerName = "SettlementRepositoryV2";
        TradePoolQueueV1 TradePoolQueueObj;
        //PoolOrder PoolOrderObj;
        //TradeCancelQueue tradeCancelQueue;        
        private readonly IMessageConfiguration _messageConfiguration;
        private readonly IMessageService _messageService;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        WalletDrCrResponse CreditWalletResult;//Rita 25-3-19 for by ref not possible

        public SettlementRepositoryV2(CleanArchitectureContext dbContext, ICommonRepository<TradePoolQueue> TradePoolQueue,
            ICommonRepository<TradeBuyRequest> TradeBuyRequest,ICommonRepository<TransactionQueue> TransactionRepository,
            IWalletService WalletService,//ITransactionRepository<TradeTransactionQueue> TradeTransactionRepository, 
            ISignalRService ISignalRService, IFrontTrnService IFrontTrnService, ITransactionRepository<TradeStopLoss> TradeStopLoss, 
            IMessageConfiguration messageConfiguration, UserManager<ApplicationUser> userManager,            
            ICommonRepository<TradeBuyerListV1> TradeBuyerList, ICommonRepository<TradeSellerListV1> TradeSellerList,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, SettledTradeTransactionQueue SettledTradeTQ,
            ICommonRepository<TradePairStastics> tradePairStastics, IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue)
        //ICommonRepository<TradeCancelQueue> TradeCancelQueueRepository
        {
            _dbContext = dbContext;
            _dbContext1 = dbContext;
            _dbContext2 = dbContext;
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
            _TradeStopLoss = TradeStopLoss;
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
            decimal GBaseCurrQty = 0;
            TradeSellerListV1 CurrenetSellerList=new TradeSellerListV1();
            //List<ProccessBuyWith> ProccessBuyWithList=new List<ProccessBuyWith>();
            
            try
            {
                //Task<IEnumerable<TradeSellerListV1>> MatchSellerListBaseAllResult = _TradeSellerList.GetAllAsync();
                Task<IEnumerable<TradeSellerListV1>> MatchSellerListBaseAllResult = _TradeSellerList.FindByAsync(e=>(e.Status == Convert.ToInt16(enTransactionStatus.Initialize) || e.Status == Convert.ToInt16(enTransactionStatus.Hold)) && e.IsAPITrade==0);//Rita 30-1-19 do not pick API trade
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
                IEnumerable<TradeSellerListV1> MatchSellerListBaseAll = await MatchSellerListBaseAllResult;
                //var pairStastics = await _tradePairStastics.GetSingleAsync(pair => pair.PairId == CurrentTradeBuyerListObj.PairID);
                TradePairStastics pairStastics = await _dbContext.Set<TradePairStastics>().FirstOrDefaultAsync(pair => pair.PairId == CurrentTradeBuyerListObj.PairID);

                if (CurrentTradeBuyerListObj.OrderType == 2)
                {
                    CurrentTradeBuyerListObj.Price = pairStastics.LTP;
                    //TradeTransactionQueueObj.BidPrice = pairStastics.LTP; //rita 17-12-18 do not update as needed in TQ Zero for Buyer and seller List
                }
                //rita 3-4-19 here update LTP only for related pair data only, added pair condition
                (from u in MatchSellerListBaseAll where u.OrderType == 2 && u.PairID == CurrentTradeBuyerListObj.PairID select u).ToList()
                        .ForEach(u => u.Price = pairStastics.LTP);

                MatchSellerListBase = MatchSellerListBaseAll.Where(item => (item.Price <= CurrentTradeBuyerListObj.Price)//|| item.OrderType==2 Rita 28-12-18 after updating price no need of this //&& item.IsProcessing == 0
                                                     && item.PairID == CurrentTradeBuyerListObj.PairID && item.OrderType != 3
                                                     //&& (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                                                     && item.RemainQty > 0).OrderBy(x => x.Price).ThenBy(x => x.TrnNo);
                if (CurrentTradeBuyerListObj.OrderType == 3)//SPOT Order,check Total Qty
                {
                    //decimal RemainQtySum1 = MatchSellerListBase.Sum(e=>e.RemainQty);//https://www.toptal.com/c-sharp/top-10-mistakes-that-c-sharp-programmers-make
                    decimal RemainQtySum = Helpers.DoRoundForTrading(Enumerable.Sum(MatchSellerListBase, a => a.RemainQty),18);

                    if (CurrentTradeBuyerListObj.RemainQty> RemainQtySum)//No sufficient Qty Found
                    {
                        goto SkipLoop;
                    }
                }
                foreach (TradeSellerListV1 SellerList in MatchSellerListBase)//MatchSellerList
                {
                    Task<bool> IsProResult = CheckIsProcessingBUY(CurrentTradeBuyerListObj.TrnNo, SellerList, pairStastics.LTP);

                    TrackDebitBit = 0;
                    CurrenetSellerList = SellerList;

                    //_dbContext.Entry(SellerList).Reload();
                    //if (SellerList.IsProcessing == 1)
                    //{
                    //    DateTime tTime=Helpers.UTC_To_IST().Add(new TimeSpan(0,0,0,5,0));//loop for 5 second only
                    //    while (Helpers.UTC_To_IST() < tTime)
                    //    {
                    //        await Task.Delay(300);
                    //        _dbContext.Entry(SellerList).Reload();
                    //        if (SellerList.IsProcessing == 1)
                    //            continue;//still wait
                    //        else
                    //            break;//exit loop
                    //    }                        
                    //    //Thread.Sleep(3000);
                    //    //_dbContext.Entry(SellerList).Reload();
                    //}
                    //if (SellerList.IsProcessing == 1 || SellerList.RemainQty == 0)
                    //{
                    //    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Buy skip IsProcessing " + SellerList.IsProcessing + " Remain Qty " + SellerList.RemainQty + " With " + SellerList.TrnNo, ControllerName, "##TrnNo " + CurrentTradeBuyerListObj.TrnNo, Helpers.UTC_To_IST()));
                    //    continue;
                    //}
                    //var TradeTQMakerObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == SellerList.TrnNo);
                    //Rita 28-12-18 after updating price no need of this 
                    //if (SellerList.OrderType == 2)//Market Order
                    //{
                    //    _dbContext.Entry(pairStastics).Reload();                       
                    //    if(pairStastics.LTP > CurrentTradeBuyerListObj.Price)//skip this record
                    //    {
                    //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Buy Maker LTP " + pairStastics.LTP + " > Curr Price " + CurrentTradeBuyerListObj.Price, ControllerName, "##TrnNo " + CurrentTradeBuyerListObj.TrnNo, Helpers.UTC_To_IST()));
                    //        continue;
                    //    }
                    //    SellerList.Price = pairStastics.LTP;
                    //}
                    //TrackBit = 1;
                    //Task<TradeTransactionQueue> TradeTQMakerObjResult = _dbContext.Set<TradeTransactionQueue>().FirstOrDefaultAsync(item => item.TrnNo == SellerList.TrnNo);
                    

                    decimal SettlementQty = 0;
                    decimal SettlementPrice = 0;
                    decimal BaseCurrQty = 0;
                    if(await IsProResult==false)
                    {
                        continue;
                    }
                    TrackBit = 1;//rita 26-12-18 move here if continue then not proceed this record
                    //var TQMakerObjResult = _TransactionRepository.GetSingleAsync(item => item.Id == SellerList.TrnNo);
             
                    SellerList.IsProcessing = 1;
                    SellerList.UpdatedBy = CurrentTradeBuyerListObj.TrnNo;//rita 8-1-19 for log
                    SellerList.CreatedBy = 800;//rita 10-1-19 for sp and code separate
                    //_TradeSellerList.UpdateAsync(SellerList); 
                    //Task SetIsProResult =
                     _TradeSellerList.UpdateField(SellerList,e=>e.IsProcessing, e => e.Price, e => e.UpdatedBy,e=>e.CreatedBy);
                    TradeTransactionQueue TradeTQMakerObj = _dbContext2.Set<TradeTransactionQueue>().FirstOrDefault(item => item.TrnNo == SellerList.TrnNo);
                    _dbContext1.Entry(SellerList).Reload();//Rita 18-1-19 here we get lates remain Qty
                    Task<TransactionQueue> TQMakerObjResult = _dbContext1.Set<TransactionQueue>().FirstOrDefaultAsync(item => item.Id == SellerList.TrnNo);
                    //====================================Partial SETTLEMENT TO MEMBER
                    if (SellerList.RemainQty < CurrentTradeBuyerListObj.RemainQty && SellerList.RemainQty != 0)//Do not Release Qty here //rita 8-2-18 release may occured so add <>0 Condition//Do not Release Qty here
                    {
                        SettlementQty = Helpers.DoRoundForTrading(SellerList.RemainQty, 18);//Take all Seller's Qty
                        GSettlementQty = SettlementQty;
                        SettlementPrice = SellerList.Price;
                        BaseCurrQty = Helpers.DoRoundForTrading(SettlementQty * SettlementPrice, 18);
                        GBaseCurrQty = BaseCurrQty;                       

                        //TradeTransactionQueue TradeTQMakerObj = await TradeTQMakerObjResult;
                        //await SetIsProResult;
                        TransactionQueue TQMakerObj = await TQMakerObjResult;
                        if (BaseCurrQty == 0)//Rita 29-1-19 release amount , here Qty used of Seller so make fail seller
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTBuy Continue Seller has BaseCurrQty:" + BaseCurrQty + " SettlementQty:" + SettlementQty + " SettlementPrice:" + SettlementPrice + " Maker TrnNo: " + SellerList.TrnNo, ControllerName, "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                            await ReleaseWalletAmountSell(SellerList, TQMakerObj, TradeTQMakerObj,1);
                            continue;
                        }

                        var CallspResult = Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, SellerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 11,1);
                        //SellerList.IsProcessing = 0;
                        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        //SellerList.MakeTransactionSuccess();
                        //_TradeSellerList.UpdateAsync(SellerList);//release here for instant process Rita 11-12-18 4:52 PM
                        //Here Bid Price of Seller always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        //rita 4-2-19 no need to change as settlement price of maker-seller and taker settle on same price
                        await InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeBuyerListObj.PairID, SellerList.TrnNo, SettlementQty, SettlementPrice, CurrentTradeBuyerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "SELL", "BUY");// SellerList.RemainQty//CurrentTradeBuyerListObj.Price , buy on price of seller's price 
                                                
                        if (await CallspResult == false)
                        {
                            _dbContext2.Entry(SellerList).Reload();//Rita 11-1-19 reload as incase of fail, currecnt IsProcessing set 1 as above assign
                            continue;
                        }

                        TrackDebitBit = 1;//refund if error occured
                        _dbContext2.Entry(SellerList).Reload();
                        _dbContext2.Entry(TradeTQMakerObj).Reload();

                        CurrentTradeBuyerListObj.RemainQty = Helpers.DoRoundForTrading(CurrentTradeBuyerListObj.RemainQty - SettlementQty, 18);
                        CurrentTradeBuyerListObj.DeliveredQty = Helpers.DoRoundForTrading(CurrentTradeBuyerListObj.DeliveredQty + SettlementQty, 18);
                        //if (SellerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.AskPrice= pairStastics.LTP;
                        //}                           
                        //WalletDrCrResponse CreditWalletResult=new WalletDrCrResponse();
                        Task<bool> WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 0, 1, TransactionQueueObj.TrnMode, CreditWalletResult);
                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj, SettlementPrice);                        

                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SettledBuyQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledBuyQty + SettlementQty,18);
                        TradeTransactionQueueObj.SettledSellQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledSellQty + BaseCurrQty,18);

                        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        //SellerList.MakeTransactionSuccess();
                       
                        TQMakerObj.MakeTransactionSuccess();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        Task<TradeStopLoss> MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);
                        

                        if (await WalletResult == false)
                        {
                            await MakeTradeStopLossObjResult;//for no contex error
                            var CallspReverseResult = Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, SellerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 11, 2, Convert.ToInt64(CreditWalletResult.ErrorCode));
                            _dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            //_dbContext.Entry(SellerList).Reload();
                            //SellerList.IsProcessing = 0;//Release Seller List    
                            //SellerList.RemainQty = SellerList.RemainQty + SettlementQty;//revert entry
                            //SellerList.SelledQty = SellerList.SelledQty - SettlementQty;//revert entry
                            //SellerList.MakeTransactionHold();
                            //_TradeSellerList.UpdateAsync(SellerList);
                            var CallspReverseResult1 =await CallspReverseResult;
                            _dbContext.Entry(SellerList).Reload();
                            _dbContext.Entry(TradeTQMakerObj).Reload();
                            _dbContext.Entry(TQMakerObj).Reload();
                            Task WalletFail = WalletFailOrderProcessBUY(CurrentTradeBuyerListObj.TrnNo, SellerList, TradeTQMakerObj, TQMakerObj, CreditWalletResult);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement RollBack ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " With: TrnNo " + SellerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT reverse result"+ CallspReverseResult1, ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            await WalletFail;
                        }
                        else
                        {
                            TradeStopLoss MakeTradeStopLossObj = await MakeTradeStopLossObjResult;//Rita 27-4-19 as second operation error if not wait
                            _dbContext.Database.BeginTransaction();
                            //Task PartDataResult = PartialBuyMakerDataUpdate(SellerList, TradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeBuyerListObj.TrnNo);
                            _dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                           // _dbContext.TransactionQueue.Attach(TQMakerObj);
                            //_dbContext.Entry(TQMakerObj).Property("df").IsModified = true;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            TradePoolQueueObj.Status = 1;//rita 23-3-19 update status as entry added from SP
                                                         //_dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                                                         //_dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);                           
                                                         //await PartDataResult;
                            

                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            //Rita 13-2-19 for error  : Violation of PRIMARY KEY constraint 'PK_SettledTradeTransactionQueue'. Cannot insert duplicate key in object 'dbo.SettledTradeTransactionQueue'. The duplicate key value is
                            try
                            {
                                _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                                _dbContext.SaveChanges();
                            }
                            catch(Exception ex)
                            {
                                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTBuy Partial Settle Entry Error:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                            }

                            TrackDebitBit = 0;
                            
                           
                            //ProccessBuyWithList.Add(new ProccessBuyWith { SellerList = SellerList, MakeTradeStopLossObj = MakeTradeStopLossObj,TQMakerObj=TQMakerObj,TradeTQMakerObj=TradeTQMakerObj,SettlementQty = SettlementQty, SettlementPrice = SettlementPrice, BaseCurrQty = BaseCurrQty });
                            //Task SignalRResult =
                            Task.Run(() => PartilaSettleBuySignalR(CurrentTradeBuyerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice,SettlementQty, CurrentTradeBuyerListObj.OrderType));
                                                      
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement Done of ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " Settled: " + CurrentTradeBuyerListObj.DeliveredQty + " Remain:" + CurrentTradeBuyerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));                           
                        }
                    }
                    //====================================FULL SETTLEMENT TO MEMBER
                    else if (SellerList.RemainQty >= CurrentTradeBuyerListObj.RemainQty && CurrentTradeBuyerListObj.RemainQty != 0)
                    {
                        SettlementQty = Helpers.DoRoundForTrading(CurrentTradeBuyerListObj.RemainQty, 18);
                        GSettlementQty = SettlementQty;
                        SettlementPrice = SellerList.Price;
                        BaseCurrQty = Helpers.DoRoundForTrading(SettlementQty * SettlementPrice, 18);
                        GBaseCurrQty = BaseCurrQty;
                        short IsFullSettledBit = 0;
                        if(SellerList.RemainQty == SettlementQty)
                            IsFullSettledBit = 1;
                        //TradeTransactionQueue TradeTQMakerObj = await TradeTQMakerObjResult;
                        // await SetIsProResult;
                        if (BaseCurrQty == 0)//Rita 29-1-19 release amount , here Qty used of Current Buyer Object , so release
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTBuy Continue Current Buyer has BaseCurrQty:" + BaseCurrQty + " SettlementQty:" + SettlementQty + " SettlementPrice:" + SettlementPrice + " Maker TrnNo: " + SellerList.TrnNo, ControllerName, "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                            await ReleaseWalletAmountBuy(CurrentTradeBuyerListObj, TransactionQueueObj, TradeTransactionQueueObj, 1);
                            SellerList.IsProcessing = 0;
                            _TradeSellerList.UpdateField(SellerList, e => e.IsProcessing);
                            break; //break loop
                        }

                        TransactionQueue TQMakerObj = await TQMakerObjResult;
                        var CallspResult = Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, SellerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 12,1);
                        //SellerList.IsProcessing = 0;
                        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
                        //if (SellerList.RemainQty == 0)//Make Seller Order Success
                        //    SellerList.MakeTransactionSuccess();
                        //else
                        //    SellerList.MakeTransactionHold();

                        //_TradeSellerList.UpdateAsync(SellerList);
                        

                        decimal TakeDisc = 0;
                        await InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeBuyerListObj.PairID, SellerList.TrnNo, SellerList.RemainQty, SettlementPrice, CurrentTradeBuyerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "SELL", "BUY");//+ SettlementQty//CurrentTradeBuyerListObj.Price , buy on price of seller's price
                                                
                        if (await CallspResult == false)
                        {
                            _dbContext2.Entry(SellerList).Reload();//Rita 11-1-19 reload as incase of fail, currecnt IsProcessing set 1 as above assign
                            continue;
                        }

                        TrackDebitBit = 1;//refund if error occured
                        _dbContext2.Entry(SellerList).Reload();
                        _dbContext2.Entry(TradeTQMakerObj).Reload();

                        //WalletDrCrResponse CreditWalletResult = new WalletDrCrResponse();
                        Task<bool> WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 1, IsFullSettledBit == 1 ? (short)1 : (short)0, TransactionQueueObj.TrnMode, CreditWalletResult);//SellerList.RemainQty == 0 //Rita 4-1-18 change condition based on bit
                        //if (SellerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.AskPrice = pairStastics.LTP;
                        //}

                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
                       
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");

                        //if (SellerList.RemainQty == 0)
                        if (IsFullSettledBit == 1)
                        {//Make Seller Order Success
                            //SellerList.MakeTransactionSuccess();
                            //TradeTQMakerObj.MakeTransactionSuccess();
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            TQMakerObj.MakeTransactionSuccess();
                            TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        }
                        //else
                        //    SellerList.MakeTransactionHold();

                        //make entry in case of success seller txn
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj, SettlementPrice);
                        //var WalletResult = WalletProcessBuy(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty,1, SellerList.RemainQty == 0 ?(short)1:(short)0);

                        CurrentTradeBuyerListObj.RemainQty = Helpers.DoRoundForTrading(CurrentTradeBuyerListObj.RemainQty - SettlementQty,18);
                        CurrentTradeBuyerListObj.DeliveredQty = Helpers.DoRoundForTrading(CurrentTradeBuyerListObj.DeliveredQty + SettlementQty,18);
                        CurrentTradeBuyerListObj.MakeTransactionSuccess();
                        TransactionQueueObj.MakeTransactionSuccess();
                        //MakeTransactionSettledEntry();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");
                        TradeTransactionQueueObj.SettledBuyQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledBuyQty + SettlementQty,18);
                        TradeTransactionQueueObj.SettledSellQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledSellQty + BaseCurrQty,18);
                        Task<SettledTradeTransactionQueue> SettledTradeTQResult = MakeTransactionSettledEntry(TradeTransactionQueueObj, SettlementPrice);
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        Task<TradeStopLoss> MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);


                        if (await WalletResult == false)
                        {
                            await MakeTradeStopLossObjResult;//for no contex error
                            var CallspReverseResult = Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, SellerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 12, 2, Convert.ToInt64(CreditWalletResult.ErrorCode));
                            _dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                            //_dbContext.Entry(SellerList).Reload();//no need as only one filed updated                            
                            //SellerList.IsProcessing = 0;//Release Seller List  
                            //SellerList.RemainQty = SellerList.RemainQty + SettlementQty;//Update first as updated value in below line
                            //SellerList.SelledQty = SellerList.SelledQty - SettlementQty;//this will give result 0
                            //SellerList.MakeTransactionHold();                                             
                            //_TradeSellerList.UpdateAsync(SellerList);
                            var CallspReverseResult1 = await CallspReverseResult;
                            _dbContext.Entry(SellerList).Reload();
                            _dbContext.Entry(TradeTQMakerObj).Reload();
                            _dbContext.Entry(TQMakerObj).Reload();
                            Task WalletFail =WalletFailOrderProcessBUY(CurrentTradeBuyerListObj.TrnNo, SellerList, TradeTQMakerObj, TQMakerObj, CreditWalletResult);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Rollback ##TrnNo:" + TradeTransactionQueueObj.TrnNo + " With: TrnNo " + SellerList.TrnNo;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT reverse Result " + CallspReverseResult1, ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            await WalletFail;
                        }
                        else
                        {
                            TradeStopLoss MakeTradeStopLossObj = await MakeTradeStopLossObjResult;//Rita 27-4-19 as second operation error if not wait
                            _dbContext.Database.BeginTransaction();
                            //if (IsFullSettledBit == 1)
                            //{
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            //Task PartDataResult = FullBuyMakerDataUpdate(SellerList, TradeTQMakerObj, TQMakerObj, SettledTradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeBuyerListObj.TrnNo);

                            _dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            TradePoolQueueObj.Status = 1;//rita 23-3-19 update status as entry added from SP
                            //_dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            SettledTradeTransactionQueue SettledTradeTQObj = await SettledTradeTQResult;
                           // _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);                           
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            //if (SellerList.RemainQty == 0)
                            //{
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}
                            //await PartDataResult;

                            

                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;
                            //Rita 13-2-19 for error  : Violation of PRIMARY KEY constraint 'PK_SettledTradeTransactionQueue'. Cannot insert duplicate key in object 'dbo.SettledTradeTransactionQueue'. The duplicate key value is
                            try
                            {
                                if (IsFullSettledBit == 1)
                                {
                                    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                                    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                                }
                                _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);
                                _dbContext.SaveChanges();
                            }
                            catch (Exception ex)
                            {
                                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTBuy FULL Settle Entry Error:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                            }
                            
                            //ProccessBuyWithList.Add(new ProccessBuyWith{ SellerList= SellerList, MakeTradeStopLossObj = MakeTradeStopLossObj, TQMakerObj = TQMakerObj, TradeTQMakerObj = TradeTQMakerObj, SettlementQty= SettlementQty,SettlementPrice= SettlementPrice,BaseCurrQty=BaseCurrQty });
                                                        
                            // Task SignalRResult =
                            Task.Run(() => FullSettleBuySignalR(CurrentTradeBuyerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty, SellerList, CurrentTradeBuyerListObj.OrderType));                            

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Done of ##TrnNo " + CurrentTradeBuyerListObj.TrnNo + " Settled: " + CurrentTradeBuyerListObj.DeliveredQty + " Remain:" + CurrentTradeBuyerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            break;//record settled                           
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
                // _dbContext.Entry(CurrentTradeBuyerListObj).Reload(); //in rollback reloaded, and in commit txn it is final , and
                SkipLoop:
                CurrentTradeBuyerListObj.IsProcessing = 0;//Release Buy Order                 
                _TradeBuyerList.UpdateField(CurrentTradeBuyerListObj, e => e.IsProcessing);
                //_TradeBuyerList.Update(CurrentTradeBuyerListObj);

               
                if (TrackBit == 0)//No any record Process
                {
                    if (CurrentTradeBuyerListObj.OrderType == 3)//Reverse Order , for LP integration remove release call
                    {
                        await ReleaseWalletAmountBuy(CurrentTradeBuyerListObj, TransactionQueueObj, TradeTransactionQueueObj);
                        //BuyFailTransactionNotification(CurrentTradeBuyerListObj, TransactionQueueObj.MemberID);//alreasy goes in Cancel SignalR                    
                    }
                    _Resp.ErrorCode = enErrorCode.Settlement_NoSettlementRecordFound;
                    _Resp.ReturnCode = enResponseCodeService.Fail;//Rita 8-3-19 for API call make it fail as process on LP
                    _Resp.ReturnMsg = "No Any Match Record Found";
                }
                else if (CurrentTradeBuyerListObj.OrderType == 3)
                {
                    if (CurrentTradeBuyerListObj.RemainQty != 0)//Revert all process of above
                    {
                        //only revert ramain amount
                        bool ReleaseResult =await ReleaseWalletAmountBuy(CurrentTradeBuyerListObj, TransactionQueueObj, TradeTransactionQueueObj,1);
                        //Here also need to revert all amount to given buyers
                        //if(ReleaseResult==true)
                        //{
                        //    foreach (var ProccessBuyWith in ProccessBuyWithList)
                        //    {
                        //        var CallspReverseResult = await Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, ProccessBuyWith.SellerList.TrnNo, ProccessBuyWith.SettlementQty, ProccessBuyWith.BaseCurrQty, 0, 11, 2);
                        //        _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), ProccessBuyWith.TQMakerObj, ProccessBuyWith.TradeTQMakerObj, "", ProccessBuyWith.MakeTradeStopLossObj.ordertype);

                        //    }
                        //    //BuyFailTransactionNotification(CurrentTradeBuyerListObj, TransactionQueueObj.MemberID);
                        //}
                        //else
                        //{

                        //}                        
                    }
                }
                //await Task.Delay(5000);//rita 1-1-19 wait for all operations done
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTBuy:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                //_dbContext.Entry(CurrentTradeBuyerListObj).Reload();
                CurrentTradeBuyerListObj.IsProcessing = 0;//Release Buy Order             
                //_TradeBuyerList.Update(CurrentTradeBuyerListObj);
                _dbContext.Entry(CurrentTradeBuyerListObj).Property(p=>p.IsProcessing).IsModified = true;
                //_dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                _dbContext.SaveChanges();
                if (CurrenetSellerList.TrnNo!=0)//here null condition not apply as this declare with new tag
                {
                    if (TrackDebitBit == 1)//rita 1-1-18 only if data updated
                    {
                        bool CallspReverseResult = await Callsp_TradeSettlement(CurrentTradeBuyerListObj.TrnNo, CurrenetSellerList.TrnNo, GSettlementQty, GBaseCurrQty, 0, 11, 2);
                    }
                    else
                    {
                        CurrenetSellerList.IsProcessing = 0;
                        _dbContext.Entry(CurrenetSellerList).Property(p => p.IsProcessing).IsModified = true;                        
                        _dbContext.SaveChanges();
                    }
                    //_dbContext.Entry(CurrenetSellerList).Reload();
                    //if (TrackDebitBit == 1)
                    //{                        
                    //    CurrenetSellerList.RemainQty = CurrenetSellerList.RemainQty + GSettlementQty;//reverse entry
                    //    CurrenetSellerList.SelledQty = CurrenetSellerList.SelledQty - GSettlementQty;//reverse entry
                    //    CurrenetSellerList.MakeTransactionHold();
                    //}
                    //CurrenetSellerList.IsProcessing = 0;//Release Seller List 
                    //_dbContext.Entry(CurrenetSellerList).State = EntityState.Modified;
                    //_dbContext.SaveChanges();
                    //_TradeSellerList.Update(CurrenetSellerList);
                }
                if(CurrentTradeBuyerListObj.RemainQty==0)//Rita 8-3-19 full pending then move on next LP
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                else
                    _Resp.ReturnCode = enResponseCodeService.Success;

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
            decimal GBaseCurrQty = 0;
            TradeBuyerListV1 CurrenetBuyerList = new TradeBuyerListV1();
            List<ProccessSellWith> ProccessSellWithList = new List<ProccessSellWith>();
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "Start Seller Process" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                //Task<IEnumerable<TradeBuyerListV1>> MatchSellerListBaseAllResult = _TradeBuyerList.GetAllAsync();
                Task<IEnumerable<TradeBuyerListV1>> MatchSellerListBaseAllResult = _TradeBuyerList.FindByAsync(e => (e.Status == Convert.ToInt16(enTransactionStatus.Initialize) || e.Status == Convert.ToInt16(enTransactionStatus.Hold)) && e.IsAPITrade == 0);//Rita 30-1-19 do not pick API trade
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
                IEnumerable<TradeBuyerListV1> MatchBuyerListBaseAll = await MatchSellerListBaseAllResult;
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "End Selection" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                // var pairStastics = await _tradePairStastics.GetSingleAsync(pair => pair.PairId == CurrentTradeSellerListObj.PairID);
                TradePairStastics pairStastics = await _dbContext.Set<TradePairStastics>().FirstOrDefaultAsync(pair => pair.PairId == CurrentTradeSellerListObj.PairID);

                if (CurrentTradeSellerListObj.OrderType == 2)
                {
                    CurrentTradeSellerListObj.Price = pairStastics.LTP;
                    //TradeTransactionQueueObj.AskPrice = pairStastics.LTP;//rita 17-12-18 do not update as needed in TQ Zero for Buyer and seller List
                }
                // MatchBuyerListBaseAll.Select(c => { c.Price = pairStastics.LTP; return c; }).ToList();
                //rita 3-4-19 here update LTP only for related pair data only, added pair condition
                (from u in MatchBuyerListBaseAll where u.OrderType == 2 && u.PairID== CurrentTradeSellerListObj.PairID select u).ToList()
                        .ForEach(u => u.Price = pairStastics.LTP);

                MatchBuyerListBase = MatchBuyerListBaseAll.Where(item => (item.Price >= CurrentTradeSellerListObj.Price)//||item.OrderType==2 Rita 28-12-18 after updating price no need of this //&& item.IsProcessing == 0
                                                     && item.PairID == CurrentTradeSellerListObj.PairID && item.OrderType != 3
                                                     //&& (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                                                     && item.RemainQty > 0).OrderByDescending(x => x.Price).ThenBy(x => x.TrnNo);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "Where Done" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                if (CurrentTradeSellerListObj.OrderType == 3)//SPOT Order,check Total Qty
                {
                    decimal RemainQtySum = Helpers.DoRoundForTrading(MatchBuyerListBase.Sum(e => e.RemainQty),18);
                    if (CurrentTradeSellerListObj.RemainQty > RemainQtySum)//No sufficient Qty Found
                    {
                        goto SkipLoop;
                    }
                }
                foreach (TradeBuyerListV1 BuyerList in MatchBuyerListBase)//MatchSellerList
                {
                    Task<bool> IsProResult = CheckIsProcessingSELL(CurrentTradeSellerListObj.TrnNo, BuyerList, pairStastics.LTP);
                    TrackDebitBit = 0;
                    CurrenetBuyerList = BuyerList;
                    //_dbContext.Entry(BuyerList).Reload();                   
                    //if (BuyerList.IsProcessing == 1)
                    //{
                    //    DateTime tTime = Helpers.UTC_To_IST().Add(new TimeSpan(0, 0, 0, 5, 0));//loop for 5 second only
                    //    while (Helpers.UTC_To_IST() < tTime)
                    //    {
                    //        await Task.Delay(300);
                    //        _dbContext.Entry(BuyerList).Reload();
                    //        if (BuyerList.IsProcessing == 1)
                    //            continue;//still wait
                    //        else
                    //            break;//exit loop
                    //    }
                    //    //Thread.Sleep(3000);
                    //    //_dbContext.Entry(SellerList).Reload();
                    //}
                    //if (BuyerList.IsProcessing == 1 || BuyerList.RemainQty==0)
                    //{
                    //    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Sell skip IsProcessing " + BuyerList.IsProcessing + " Remain Qty " + BuyerList.RemainQty + " With " + BuyerList.TrnNo, ControllerName,"##TrnNo " + CurrentTradeSellerListObj.TrnNo, Helpers.UTC_To_IST()));
                    //    continue;
                    //}
                    //var TradeTQMakerObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == BuyerList.TrnNo);
                    
                    //Rita 28-12-18 after updating price no need of this 
                    //if (BuyerList.OrderType == 2)//Market Order
                    //{
                    //    _dbContext.Entry(pairStastics).Reload();
                    //    if (pairStastics.LTP < CurrentTradeSellerListObj.Price)//skip this record
                    //    {
                    //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT Sell skip Maker LTP " + pairStastics.LTP + " < Curr Price " + CurrentTradeSellerListObj.Price, ControllerName, "##TrnNo " + CurrentTradeSellerListObj.TrnNo, Helpers.UTC_To_IST()));
                    //        continue;
                    //    }
                    //    BuyerList.Price = pairStastics.LTP;
                    //}
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "Loop Validate Done" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

                    // Task<TradeTransactionQueue> TradeTQMakerObjResult = _dbContext.Set<TradeTransactionQueue>().FirstOrDefaultAsync(item => item.TrnNo == BuyerList.TrnNo);
                    
                    decimal SettlementQty = 0;
                    decimal SettlementPrice = 0;
                    decimal BaseCurrQty = 0;
                    if (await IsProResult == false)
                    {
                        continue;
                    }
                    TrackBit = 1;
                    BuyerList.IsProcessing = 1;
                    BuyerList.UpdatedBy = CurrentTradeSellerListObj.TrnNo;//rita 8-1-19 for log
                    BuyerList.CreatedBy = 800;//rita 10-1-19 for sp and code separate
                    //_TradeBuyerList.UpdateAsync(BuyerList);
                    //Task SetIsProResult =
                    _TradeBuyerList.UpdateField(BuyerList, e => e.IsProcessing, e => e.Price,e => e.UpdatedBy, e => e.CreatedBy);

                    // var TQMakerObjResult = _TransactionRepository.GetSingleAsync(item => item.Id == BuyerList.TrnNo);
                    TradeTransactionQueue TradeTQMakerObj = _dbContext2.Set<TradeTransactionQueue>().FirstOrDefault(item => item.TrnNo == BuyerList.TrnNo);
                    _dbContext1.Entry(BuyerList).Reload();//Rita 18-1-19 here we get lates remain Qty
                    Task<TransactionQueue> TQMakerObjResult = _dbContext1.Set<TransactionQueue>().FirstOrDefaultAsync(item => item.Id == BuyerList.TrnNo);
                   
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "Loop outer Done" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                    //====================================Partial SETTLEMENT TO MEMBER
                    if (BuyerList.RemainQty < CurrentTradeSellerListObj.RemainQty && BuyerList.RemainQty != 0)//Do not Release Qty here //rita 8-2-18 release may occured so add <>0 Condition
                    {
                        SettlementQty = Helpers.DoRoundForTrading(BuyerList.RemainQty,18);//Give to Buyer , buyer's full settlement done here
                        GSettlementQty = SettlementQty;
                        SettlementPrice = CurrentTradeSellerListObj.Price;
                        BaseCurrQty = Helpers.DoRoundForTrading(SettlementQty * SettlementPrice,18);
                        GBaseCurrQty = BaseCurrQty;
                        //TradeTransactionQueue TradeTQMakerObj = await TradeTQMakerObjResult;
                        //await SetIsProResult;
                        TransactionQueue TQMakerObj = await TQMakerObjResult;//this gives error some times , so do not add below wallet call
                        if (BaseCurrQty == 0)//Rita 29-1-19 release amount , here Qty used of Seller so make fail seller
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell Continue Buyer has BaseCurrQty:" + BaseCurrQty + " SettlementQty:" + SettlementQty + " SettlementPrice:" + SettlementPrice + " Maker TrnNo: " + BuyerList.TrnNo, ControllerName, "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                            await ReleaseWalletAmountBuy(BuyerList, TQMakerObj, TradeTQMakerObj, 1);
                            continue;
                        }
                        var CallspResult = Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, BuyerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 13, 1);
                        //BuyerList.IsProcessing = 0;
                        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0  
                        //BuyerList.MakeTransactionSuccess();
                        //_TradeBuyerList.UpdateAsync(BuyerList);//release record
                       

                       
                        //Here Bid Price of Seller always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        //rita 4-2-19 change SettlementPrice to BuyerList.Price , as maker price different
                        await InsertTradePoolQueue(TransactionQueueObj.MemberID,CurrentTradeSellerListObj.PairID, BuyerList.TrnNo, SettlementQty, BuyerList.Price, CurrentTradeSellerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "BUY", "SELL");//BuyerList.RemainQty//BuyerList.Price selled base on seller's price


                        _dbContext2.Entry(BuyerList).Reload();//Rita 11-1-19 reload as incase of fail, currecnt IsProcessing set 1 as above assign
                        if (await CallspResult == false)
                        {
                            _dbContext2.Entry(BuyerList).Reload();//Rita 11-1-19 reload as incase of fail, currecnt IsProcessing set 1 as above assign
                            continue;
                        }
                        
                        TrackDebitBit = 1;//refund if error occured
                        _dbContext2.Entry(BuyerList).Reload();
                        _dbContext2.Entry(TradeTQMakerObj).Reload();

                        CurrentTradeSellerListObj.RemainQty = Helpers.DoRoundForTrading(CurrentTradeSellerListObj.RemainQty - SettlementQty, 18);
                        CurrentTradeSellerListObj.SelledQty = Helpers.DoRoundForTrading(CurrentTradeSellerListObj.SelledQty + SettlementQty, 18);

                        //if (BuyerList.OrderType == 2)
                        //{
                        //    TradeTQMakerObj.BidPrice = pairStastics.LTP;
                        //}
                        //WalletDrCrResponse CreditWalletResult = new WalletDrCrResponse();
                        Task<bool> WalletResult = WalletProcessSell(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 0, 1, TransactionQueueObj.TrnMode, CreditWalletResult);
                        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
                        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj, SettlementPrice);                        

                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SettledSellQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledSellQty + SettlementQty,18);
                        TradeTransactionQueueObj.SettledBuyQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledBuyQty + BaseCurrQty,18);

                        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
                        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
                        //BuyerList.MakeTransactionSuccess();
                        
                        TQMakerObj.MakeTransactionSuccess();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                       // var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        Task<TradeStopLoss> MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);


                        if (await WalletResult == false)
                        {
                            await MakeTradeStopLossObjResult;//for no contex error
                            var CallspReverseResult = Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, BuyerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 13, 2, Convert.ToInt64(CreditWalletResult.ErrorCode));
                            _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();
                           
                            //_dbContext.Entry(BuyerList).Reload();
                            // BuyerList.IsProcessing = 0;//Release Seller List 
                            //BuyerList.RemainQty = BuyerList.RemainQty + SettlementQty;//revert entry
                            //BuyerList.DeliveredQty = BuyerList.DeliveredQty - SettlementQty;//revert entry
                            //BuyerList.MakeTransactionHold();
                            //_TradeBuyerList.UpdateAsync(BuyerList);
                            var CallspReverseResult1 = await CallspReverseResult;

                            _dbContext.Entry(BuyerList).Reload();
                            _dbContext.Entry(TradeTQMakerObj).Reload();
                            _dbContext.Entry(TQMakerObj).Reload();
                            Task WalletFail = WalletFailOrderProcessSELL(CurrentTradeSellerListObj.TrnNo, BuyerList, TradeTQMakerObj, TQMakerObj, CreditWalletResult);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement SELL RollBack ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " With: TrnNo " + BuyerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT reverse result " + CallspReverseResult1, ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            await WalletFail;
                        }
                        else
                        {//last loop records does not revert, and commit in currecnt txn , as it is present in contex
                            TradeStopLoss MakeTradeStopLossObj = await MakeTradeStopLossObjResult;//Rita 27-4-19 as second operation error if not wait
                            _dbContext.Database.BeginTransaction();
                            //Task PartDataResult = PartialSellMakerDataUpdate(BuyerList, TradeTQMakerObj,SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeSellerListObj.TrnNo);
                            _dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            TradePoolQueueObj.Status = 1;//rita 23-3-19 update status as entry added from SP
                                                         //_dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                                                         //_dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);//Rita 14-2-19 as by fault remain this
                                                         //await PartDataResult;

                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;
                            //Rita 13-2-19 for error  : Violation of PRIMARY KEY constraint 'PK_SettledTradeTransactionQueue'. Cannot insert duplicate key in object 'dbo.SettledTradeTransactionQueue'. The duplicate key value is
                            try
                            {                               
                                _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                                _dbContext.SaveChanges();
                            }
                            catch (Exception ex)
                            {
                                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTSELL Partial Settle Entry Error:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                            }
                           
                            ProccessSellWithList.Add(new ProccessSellWith { BuyerList = BuyerList, MakeTradeStopLossObj = MakeTradeStopLossObj, TQMakerObj = TQMakerObj, TradeTQMakerObj = TradeTQMakerObj, SettlementQty = SettlementQty, SettlementPrice = SettlementPrice, BaseCurrQty = BaseCurrQty });
                            
                            // Task SignalRResult =
                            Task.Run(() => PartilaSettleSellSignalR(CurrentTradeSellerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty, CurrentTradeSellerListObj.OrderType));
                            
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement SELL Done of ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " Settled: " + CurrentTradeSellerListObj.SelledQty + " Remain:" + CurrentTradeSellerListObj.RemainQty;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));                           
                        }
                    }
                    //====================================FULL SETTLEMENT TO MEMBER
                    else if (BuyerList.RemainQty >= CurrentTradeSellerListObj.RemainQty && CurrentTradeSellerListObj.RemainQty != 0)
                    {
                        SettlementQty = Helpers.DoRoundForTrading(CurrentTradeSellerListObj.RemainQty,18);
                        GSettlementQty = SettlementQty;
                        SettlementPrice = CurrentTradeSellerListObj.Price;
                        BaseCurrQty = Helpers.DoRoundForTrading(SettlementQty * SettlementPrice,18);
                        GBaseCurrQty = BaseCurrQty;
                        short IsFullSettledBit = 0;
                        if (BuyerList.RemainQty == SettlementQty)
                            IsFullSettledBit = 1;
                        //TradeTransactionQueue TradeTQMakerObj = await TradeTQMakerObjResult;
                        //await SetIsProResult;
                        if (BaseCurrQty == 0)//Rita 29-1-19 release amount , here Qty used of Current Buyer Object , so release
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell Continue Current Seller has BaseCurrQty:" + BaseCurrQty + " SettlementQty:" + SettlementQty + " SettlementPrice:" + SettlementPrice + " Maker TrnNo: " + BuyerList.TrnNo, ControllerName, "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                            await ReleaseWalletAmountSell(CurrentTradeSellerListObj, TransactionQueueObj, TradeTransactionQueueObj, 1);
                            BuyerList.IsProcessing = 0;
                            _TradeBuyerList.UpdateField(BuyerList, e => e.IsProcessing);
                            break; //break loop
                        }
                        TransactionQueue TQMakerObj = await TQMakerObjResult;//this gives error some times , so do not add below wallet call
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENTSell", ControllerName, "Else SP Start" + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                        var CallspResult = Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, BuyerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 14, 1);
                        //BuyerList.IsProcessing = 0;
                        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0 
                        //if (BuyerList.RemainQty == 0)//Make Seller Order Success                        
                        //    BuyerList.MakeTransactionSuccess();
                        //else
                        //    BuyerList.MakeTransactionHold();
                        //_TradeBuyerList.UpdateAsync(BuyerList);
                        

                        decimal TakeDisc = 0;
                        //rita 4-2-19 change SettlementPrice to BuyerList.Price , as maker price different
                        await InsertTradePoolQueue(TransactionQueueObj.MemberID, CurrentTradeSellerListObj.PairID, BuyerList.TrnNo, BuyerList.RemainQty, BuyerList.Price, CurrentTradeSellerListObj.TrnNo, SettlementQty, SettlementPrice, TakeDisc, 0, "BUY", "SELL");//+SettlementQty//BuyerList.Price selled base on seller's price
                        
                        if (await CallspResult == false)
                        {
                            _dbContext2.Entry(BuyerList).Reload();//Rita 11-1-19 reload as incase of fail, currecnt IsProcessing set 1 as above assign
                            continue;
                        }

                        TrackDebitBit = 1;//refund if error occured
                        _dbContext2.Entry(BuyerList).Reload();
                        _dbContext2.Entry(TradeTQMakerObj).Reload();
                        //WalletDrCrResponse CreditWalletResult = new WalletDrCrResponse();
                        Task<bool> WalletResult = WalletProcessSell(TradeTransactionQueueObj, TradeTQMakerObj, SettlementPrice, SettlementQty, BaseCurrQty, 1, IsFullSettledBit == 1 ? (short)1 : (short)0, TransactionQueueObj.TrnMode, CreditWalletResult);//BuyerList.RemainQty rita 4-1-19 issue when two time debited from original buyer and this make wallet settled then last txn may fail due to insufficient balance

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
                        
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");                      

                        if (IsFullSettledBit == 1)
                        {//Make Seller Order Success
                            //BuyerList.MakeTransactionSuccess();
                            //TradeTQMakerObj.MakeTransactionSuccess();
                            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                            TQMakerObj.MakeTransactionSuccess();
                            TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                            TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
                        }
                        //else
                        //    BuyerList.MakeTransactionHold();

                        //make entry in case of success seller txn
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTQMakerObj, SettlementPrice);
                        

                        CurrentTradeSellerListObj.RemainQty = Helpers.DoRoundForTrading(CurrentTradeSellerListObj.RemainQty - SettlementQty,18);
                        CurrentTradeSellerListObj.SelledQty = Helpers.DoRoundForTrading(CurrentTradeSellerListObj.SelledQty + SettlementQty,18);
                        CurrentTradeSellerListObj.MakeTransactionSuccess();
                        TransactionQueueObj.MakeTransactionSuccess();
                        //MakeTransactionSettledEntry();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");
                        TradeTransactionQueueObj.SettledSellQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledSellQty + SettlementQty,18);
                        TradeTransactionQueueObj.SettledBuyQty = Helpers.DoRoundForTrading(TradeTransactionQueueObj.SettledBuyQty + BaseCurrQty,18);
                        Task<SettledTradeTransactionQueue> SettledTradeTQResult = MakeTransactionSettledEntry(TradeTransactionQueueObj, SettlementPrice);
                        //var MakeTradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == TQMakerObj.Id);
                        Task<TradeStopLoss> MakeTradeStopLossObjResult = _dbContext.Set<TradeStopLoss>().FirstOrDefaultAsync(e => e.TrnNo == TQMakerObj.Id);                        

                        if (await WalletResult == false)
                        {                            
                            await MakeTradeStopLossObjResult;//for no contex error
                            var CallspReverseResult = Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, BuyerList.TrnNo, SettlementQty, BaseCurrQty, SettlementPrice, 14, 2, Convert.ToInt64(CreditWalletResult.ErrorCode));
                            _dbContext.Entry(CurrentTradeSellerListObj).Reload();
                            _dbContext.Entry(TransactionQueueObj).Reload();
                            _dbContext.Entry(TradeTransactionQueueObj).Reload();                          
                            //_dbContext.Entry(BuyerList).Reload();
                            //BuyerList.IsProcessing = 0;//Release Seller List 
                            //BuyerList.RemainQty = BuyerList.RemainQty + SettlementQty;//reverse entry
                            //BuyerList.DeliveredQty = BuyerList.DeliveredQty - SettlementQty;//reverse entry
                            //BuyerList.MakeTransactionHold();
                            //_TradeBuyerList.UpdateAsync(BuyerList);
                            var CallspReverseResult1=await CallspReverseResult;
                            _dbContext.Entry(BuyerList).Reload();
                            _dbContext.Entry(TradeTQMakerObj).Reload();
                            _dbContext.Entry(TQMakerObj).Reload();
                            Task WalletFail = WalletFailOrderProcessSELL(CurrentTradeSellerListObj.TrnNo, BuyerList, TradeTQMakerObj, TQMakerObj, CreditWalletResult);
                            TrackDebitBit = 0;
                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement SELL Rollback ##TrnNo:" + TradeTransactionQueueObj.TrnNo + " With: TrnNo " + BuyerList.TrnNo;
                            Task.Run(()=> HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT reverse result "+ CallspReverseResult1, ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            await WalletFail;
                        }
                        else
                        {
                            TradeStopLoss MakeTradeStopLossObj = await MakeTradeStopLossObjResult;//Rita 27-4-19 as second operation error if not wait
                            _dbContext.Database.BeginTransaction();
                            
                            //if (IsFullSettledBit == 1)
                            //{
                            //    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                            //    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                            //}                                
                            //Task PartDataResult = FullSellMakerDataUpdate(BuyerList, TradeTQMakerObj, TQMakerObj, SettledTradeTQMakerObj, SettlementQty, BaseCurrQty, pairStastics.LTP, CurrentTradeSellerListObj.TrnNo);

                            _dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                            _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                            _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;                            

                            _dbContext.Entry(TQMakerObj).State = EntityState.Modified;
                            TradePoolQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                            TradePoolQueueObj.Status = 1;//rita 23-3-19 update status as entry added from SP
                            //_dbContext.Set<TradePoolQueueV1>().Add(TradePoolQueueObj);
                            SettledTradeTransactionQueue SettledTradeTQObj = await SettledTradeTQResult;
                            //_dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);                           
                            //await PartDataResult;

                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();
                            TrackDebitBit = 0;
                            //Rita 13-2-19 for error  : Violation of PRIMARY KEY constraint 'PK_SettledTradeTransactionQueue'. Cannot insert duplicate key in object 'dbo.SettledTradeTransactionQueue'. The duplicate key value is
                            try
                            {
                                if (IsFullSettledBit == 1)
                                {
                                    SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                                    _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                                }
                                _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQObj);
                                _dbContext.SaveChanges();
                            }
                            catch (Exception ex)
                            {
                                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTSELL FULL Settle Entry Error:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                            }
                           
                            ProccessSellWithList.Add(new ProccessSellWith { BuyerList = BuyerList, MakeTradeStopLossObj = MakeTradeStopLossObj, TQMakerObj = TQMakerObj, TradeTQMakerObj = TradeTQMakerObj, SettlementQty = SettlementQty, SettlementPrice = SettlementPrice, BaseCurrQty = BaseCurrQty });
                            
                            //Task SignalRResult = 
                            Task.Run(() => FullSettleSellSignalR(CurrentTradeSellerListObj.TrnNo, TransactionQueueObj, TradeTransactionQueueObj, TradeStopLossObj, MakeTradeStopLossObj, TQMakerObj, TradeTQMakerObj, accessToken, SettlementPrice, SettlementQty, BuyerList, CurrentTradeSellerListObj.OrderType));
                            //HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT SELL", ControllerName, "Full Settlement Done with " + BuyerList.TrnNo + "##TrnNo:" + CurrentTradeSellerListObj.TrnNo);

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement SELL Done of ##TrnNo " + CurrentTradeSellerListObj.TrnNo + " Settled: " + CurrentTradeSellerListObj.SelledQty + " Remain:" + CurrentTradeSellerListObj.RemainQty + " With TrnNo:"+ BuyerList.TrnNo;
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                            break;//record settled                           
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
                // _dbContext.Entry(CurrentTradeSellerListObj).Reload();//rita 19-12-18 no need to reload as only update one bit
                SkipLoop:
                CurrentTradeSellerListObj.IsProcessing = 0;//Release Sell Order             
                _TradeSellerList.UpdateField(CurrentTradeSellerListObj,e=>e.IsProcessing);
                //_TradeSellerList.Update(CurrentTradeSellerListObj);

                
                if (TrackBit == 0)//No any record Process
                {
                    if (CurrentTradeSellerListObj.OrderType == 3)//Reverse Order
                    {                        
                        await ReleaseWalletAmountSell(CurrentTradeSellerListObj, TransactionQueueObj, TradeTransactionQueueObj);
                        //SellFailTransactionNotification(CurrentTradeSellerListObj, TransactionQueueObj.MemberID);//alreasy goes in Cancel SignalR
                    }
                    _Resp.ErrorCode = enErrorCode.Settlement_NoSettlementRecordFound;
                    //_Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnCode = enResponseCodeService.Fail;//Rita 8-3-19 for API call make it fail as process on LP
                    _Resp.ReturnMsg = "No Any Match Record Found";
                }
                else if (CurrentTradeSellerListObj.OrderType == 3)
                {
                    if (CurrentTradeSellerListObj.RemainQty != 0)//Revert all process of above
                    {
                        //only revert ramain amount
                        bool ReleaseResult = await ReleaseWalletAmountSell(CurrentTradeSellerListObj, TransactionQueueObj, TradeTransactionQueueObj,1);
                        //Here also need to revert all amount to given buyers
                        //if(ReleaseResult==true)
                        //{
                        //    foreach (var ProccessSellWith in ProccessSellWithList)
                        //    {
                        //        var CallspReverseResult = await Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, ProccessSellWith.BuyerList.TrnNo, ProccessSellWith.SettlementQty, ProccessSellWith.BaseCurrQty, 0, 13, 2);
                        //        Task.Run(() => _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), ProccessSellWith.TQMakerObj, ProccessSellWith.TradeTQMakerObj, "", ProccessSellWith.MakeTradeStopLossObj.ordertype));
                        //    }

                        //    //SellFailTransactionNotification(CurrentTradeSellerListObj, TransactionQueueObj.MemberID);
                        //}
                        //else
                        //{
                        //}                        
                    }
                }
                //await Task.Delay(5000);//rita 1-1-19 wait for all operations done
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PROCESSSETLLEMENTSell:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                //_dbContext.Entry(CurrentTradeSellerListObj).Reload();
                CurrentTradeSellerListObj.IsProcessing = 0;//Release Sell Order   
                _dbContext.Entry(CurrentTradeSellerListObj).Property(p => p.IsProcessing).IsModified = true;
                //_dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                _dbContext.SaveChanges();
                //_TradeSellerList.Update(CurrentTradeSellerListObj);
                if (CurrenetBuyerList.TrnNo != 0)//here null condition not apply as this declare with new tag
                {
                    if (TrackDebitBit == 1)//rita 1-1-18 only if data updated
                    {
                        var CallspReverseResult = await Callsp_TradeSettlement(CurrentTradeSellerListObj.TrnNo, CurrenetBuyerList.TrnNo, GSettlementQty, GBaseCurrQty, 0, 13, 2);
                    }
                    else
                    {
                        CurrenetBuyerList.IsProcessing = 0;
                        _dbContext.Entry(CurrenetBuyerList).Property(p => p.IsProcessing).IsModified = true;
                        _dbContext.SaveChanges();
                    }
                    
                    //_dbContext.Entry(CurrenetBuyerList).Reload();
                    //if(TrackDebitBit == 1)
                    //{
                    //    CurrenetBuyerList.RemainQty = CurrenetBuyerList.RemainQty + GSettlementQty;//reverse entry
                    //    CurrenetBuyerList.DeliveredQty = CurrenetBuyerList.DeliveredQty - GSettlementQty;//reverse entry
                    //    CurrenetBuyerList.MakeTransactionHold();
                    //}
                    //CurrenetBuyerList.IsProcessing = 0;//Release Seller List                    
                    //_dbContext.Entry(CurrenetBuyerList).State = EntityState.Modified;
                    //_dbContext.SaveChanges();
                    //_TradeBuyerList.Update(CurrenetBuyerList);
                }
                if (CurrentTradeSellerListObj.RemainQty == 0)//Rita 3-8-19 full pending then move on next LP
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                else
                    _Resp.ReturnCode = enResponseCodeService.Success;
                
                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.Settlement_SettlementInternalError;
            }
            return _Resp;
        }

        public async Task WalletFailOrderProcessBUY(long TrnNo, TradeSellerListV1 SellerList, TradeTransactionQueue TradeTQMakerObj, TransactionQueue TQMakerObj, WalletDrCrResponse CreditWalletResult)//Rita 26-3-19 do not take global as object come here with original values which required,may global obj create an issue
        {//Rita 11-1-19 as Order has mismatch issue , make it disable , also operation only with Maker while settlement , currecnt object skip if error occured
            try
            {
                //InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed = 4347
                //InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed = 4348
                //InsufficientOutgoingBalFirstCur = 4345
                //InsufficietOutgoingBalSecondCur = 4346
                //CrDrCredit_SettledBalMismatchCrWallet = 4364
                //CrDrCredit_SettledBalMismatchCrWalletSecCur = 4365
                //CrDrCredit_SettledBalMismatchDrWallet = 4366
                //CrDrCredit_SettledBalMismatchDrWalletSecDr = 4367
                if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                {
                    //Incase of BUY First/Base Currecy -- CURRENCT TxnOnj - Debited , so skip
                    //Rita 7-3-19 Here First Means Second Currecny-ATCC, for Maker ,Second Currency total Hold , so not possible for Sell-Maker Order
                    if (CreditWalletResult.ErrorCode == enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed)
                    { }
                    //Incase of BUY Second Currecy -- MAKER TxnObj- Debited, make Maker cancel
                    //this error not possible for Seller, as his total Sell Qty/amount is hold
                    //Rita 7-3-19 Here Second Means First/Base Currecny, for Maker-Seller ,Base Currency Credit, so not possible for Sell Order
                    //For Current Object this poassible as BTC hold,but doest not process for it , so remove below code for Maker
                    else if (CreditWalletResult.ErrorCode == enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed 
                        || CreditWalletResult.ErrorCode == enErrorCode.InsufficietOutgoingBalSecondCur)
                    {
                        //TQMakerObj.MakeTransactionSuccess();
                        //TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        //TQMakerObj.SetTransactionStatusMsg("Success with partial cancellation-System");
                        //TQMakerObj.UpdatedDate = Helpers.UTC_To_IST();

                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Success with partial cancellation-System");
                        //TradeTQMakerObj.IsCancelled = 1;
                        //TradeTQMakerObj.UpdatedDate = Helpers.UTC_To_IST();
                        //TradeTQMakerObj.SettledDate = Helpers.UTC_To_IST();

                        //SellerList.MakeTransactionSuccess();
                        //SellerList.UpdatedDate = Helpers.UTC_To_IST();
                        //SellerList.CreatedBy = 700;
                        ////_TradeSellerList.UpdateField(SellerList, e => e.Status);
                        //_dbContext.Entry(SellerList).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(SellerList).Property(p => p.CreatedBy).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        //_dbContext.SaveChanges();
                        //try
                        //{
                        //    _ISignalRService.OnStatusCancel(TradeTQMakerObj.Status, TQMakerObj, TradeTQMakerObj, "", TradeTQMakerObj.ordertype, 1);
                        //}
                        //catch (Exception ex)
                        //{
                        //    HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY -signalR Error ##TrnNo:" + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo + " ErrorCode:" + CreditWalletResult.ErrorCode, ControllerName, ex);
                        //}
                    }
                    else if (CreditWalletResult.ErrorCode == enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur 
                        || CreditWalletResult.ErrorCode == enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr)
                    {
                        TQMakerObj.MakeTransactionInActive();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TQMakerObj.SetTransactionStatusMsg("Make InActive as Bal MisMatch-System");
                        TQMakerObj.UpdatedDate = Helpers.UTC_To_IST();

                        TradeTQMakerObj.MakeTransactionInActive();
                        TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TradeTQMakerObj.SetTransactionStatusMsg("Make InActive as Bal MisMatch-System");
                       // TradeTQMakerObj.IsCancelled = 1;
                        TradeTQMakerObj.UpdatedDate = Helpers.UTC_To_IST();
                        TradeTQMakerObj.SettledDate = Helpers.UTC_To_IST();

                        SellerList.MakeTransactionInActive();
                        SellerList.UpdatedDate = Helpers.UTC_To_IST();
                        SellerList.CreatedBy = 700;
                        //_TradeSellerList.UpdateField(SellerList, e => e.Status);
                        _dbContext.Entry(SellerList).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(SellerList).Property(p => p.CreatedBy).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        _dbContext.SaveChanges();

                        try
                        {
                            //fully cancel as fail order do not need to add in history
                            _ISignalRService.OnStatusCancel(TradeTQMakerObj.Status, TQMakerObj, TradeTQMakerObj, "", TradeTQMakerObj.ordertype,0);
                        }
                        catch (Exception ex)
                        {
                            HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY -signalR Error ##TrnNo:" + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo + " ErrorCode:" + CreditWalletResult.ErrorCode, ControllerName, ex);
                        }
                    }


                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY:##TrnNo " + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo, ControllerName, ex);
            }
        }
        public async Task WalletFailOrderProcessSELL(long TrnNo,TradeBuyerListV1 BuyerList, TradeTransactionQueue TradeTQMakerObj, TransactionQueue TQMakerObj, WalletDrCrResponse CreditWalletResult)
        {//Rita 11-1-19 as Order has mismatch issue , make it disable , also operation only with Maker while settlement , currecnt object skip if error occured
            try
            {
                //InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed = 4347
                //InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed = 4348
                //InsufficientOutgoingBalFirstCur = 4345
                //InsufficietOutgoingBalSecondCur = 4346
                //CrDrCredit_SettledBalMismatchCrWallet = 4364
                //CrDrCredit_SettledBalMismatchCrWalletSecCur = 4365
                //CrDrCredit_SettledBalMismatchDrWallet = 4366
                //CrDrCredit_SettledBalMismatchDrWalletSecDr = 4367
                if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                {
                    //Incase of SELL First/Base Currecy -- MAKER TxnObj- Debited, make Maker cancel   
                    //Rita 7-3-19 Here First Means Second Currecny-ATCC, Debited from Current SELLER Object , so not possible
                    if (CreditWalletResult.ErrorCode == enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed 
                        || CreditWalletResult.ErrorCode == enErrorCode.InsufficientOutgoingBalFirstCur)
                    {
                        //TQMakerObj.MakeTransactionSuccess();
                        //TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        //TQMakerObj.SetTransactionStatusMsg("Success with partial cancellation-System");
                        //TQMakerObj.UpdatedDate = Helpers.UTC_To_IST();

                        //TradeTQMakerObj.MakeTransactionSuccess();
                        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        //TradeTQMakerObj.SetTransactionStatusMsg("Success with partial cancellation-System");
                        //TradeTQMakerObj.IsCancelled =1;
                        //TradeTQMakerObj.UpdatedDate = Helpers.UTC_To_IST();
                        //TradeTQMakerObj.SettledDate = Helpers.UTC_To_IST();

                        //BuyerList.MakeTransactionSuccess();
                        //BuyerList.UpdatedDate = Helpers.UTC_To_IST();
                        //BuyerList.CreatedBy = 700;
                        ////_TradeSellerList.UpdateField(SellerList, e => e.Status);
                        //_dbContext.Entry(BuyerList).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(BuyerList).Property(p => p.CreatedBy).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        //_dbContext.Entry(TQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.Status).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        //_dbContext.Entry(TradeTQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        //_dbContext.SaveChanges();
                        //try
                        //{
                        //    _ISignalRService.OnStatusCancel(TradeTQMakerObj.Status, TQMakerObj, TradeTQMakerObj, "", TradeTQMakerObj.ordertype, 1);
                        //}
                        //catch (Exception ex)
                        //{
                        //    HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY -signalR Error ##TrnNo:" + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo + " ErrorCode:" + CreditWalletResult.ErrorCode, ControllerName, ex);
                        //}
                    }
                    //Incase of SELL Second Currecy -- CURRENCT TxnOnj - Debited , so skip
                    //Rita 4-3-19 incase of Maker-buyer has insufficient balance for Market order make inactivate that order
                    //Rita 7-3-19 Here Second Means First/Base Currecny , so this may come in case of HOLD BTC and may market up and need extra balance for Maker
                    else if (CreditWalletResult.ErrorCode == enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed || CreditWalletResult.ErrorCode == enErrorCode.InsufficietOutgoingBalSecondCur)//Rita 15-3-19 as Buyer Maker debit BTC so it may nagative
                    {
                       var releaseResult = await ReleaseWalletAmountBuy(BuyerList, TQMakerObj, TradeTQMakerObj, 1);//Release Maker
                    }
                    else if (CreditWalletResult.ErrorCode == enErrorCode.CrDrCredit_SettledBalMismatchCrWallet
                        || CreditWalletResult.ErrorCode == enErrorCode.CrDrCredit_SettledBalMismatchDrWallet)
                    {
                        TQMakerObj.MakeTransactionInActive();
                        TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TQMakerObj.SetTransactionStatusMsg("Make InActive as Bal MisMatch-System");
                        TQMakerObj.UpdatedDate = Helpers.UTC_To_IST();

                        TradeTQMakerObj.MakeTransactionInActive();
                        TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TradeTQMakerObj.SetTransactionStatusMsg("Make InActive as Bal MisMatch-System");
                        //TradeTQMakerObj.IsCancelled = 1;
                        TradeTQMakerObj.UpdatedDate = Helpers.UTC_To_IST();
                        TradeTQMakerObj.SettledDate = Helpers.UTC_To_IST();

                        BuyerList.MakeTransactionInActive();
                        BuyerList.UpdatedDate = Helpers.UTC_To_IST();
                        BuyerList.CreatedBy = 700;
                        //_TradeSellerList.UpdateField(SellerList, e => e.Status);
                        _dbContext.Entry(BuyerList).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(BuyerList).Property(p => p.CreatedBy).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        _dbContext.Entry(TQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.Status).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusCode).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.StatusMsg).IsModified = true;
                        _dbContext.Entry(TradeTQMakerObj).Property(p => p.UpdatedDate).IsModified = true;
                        _dbContext.SaveChanges();

                        try
                        {
                            //fully cancel as fail order do not need to add in history
                            _ISignalRService.OnStatusCancel(TradeTQMakerObj.Status, TQMakerObj, TradeTQMakerObj, "", TradeTQMakerObj.ordertype, 0);
                        }
                        catch (Exception ex)
                        {
                            HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY -signalR Error ##TrnNo:" + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo + " ErrorCode:" + CreditWalletResult.ErrorCode, ControllerName, ex);
                        }
                    }


                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletFailOrderProcessBUY:##TrnNo " + TrnNo + " with TrnNo:" + TradeTQMakerObj.TrnNo, ControllerName, ex);
            }
        }

        public async Task<bool> ReleaseWalletAmountBuy(TradeBuyerListV1 CurrentTradeBuyerListObj, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,short IsPartial=0)
        {
            try
            {
                decimal ReleaseAmt = TradeTransactionQueueObj.OrderTotalQty - TradeTransactionQueueObj.SettledSellQty;//always full amount,incase of error it should be partial-remain
                Task<WalletDrCrResponse> WalletResult = _WalletService.GetReleaseHoldNew(TradeTransactionQueueObj.Order_Currency, Helpers.GetTimeStamp(), ReleaseAmt,
                                                 TradeTransactionQueueObj.OrderAccountID, TradeTransactionQueueObj.TrnNo, enServiceType.Trading,
                                                 enWalletTrnType.BuyTrade, (enTrnType)TransactionQueueObj.TrnType, (EnAllowedChannels)TransactionQueueObj.TrnMode,"");
                var WalletResp = await WalletResult;
                if (WalletResp.ReturnCode != enResponseCode.Success && ReleaseAmt!=0)//Rita 29-1-19 if no amount remain direct update records
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseWalletAmountBuy Fail " + WalletResp.ErrorCode + " Msg " + WalletResp.ReturnMsg, ControllerName, "ReleaseAmt " + ReleaseAmt + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                else
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseWalletAmountBuy Success " + WalletResp.ErrorCode + " Msg " + WalletResp.ReturnMsg, ControllerName, "ReleaseAmt " + ReleaseAmt + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));                   
                    
                    if(IsPartial==0)//regular
                    {
                        TransactionQueueObj.MakeTransactionOperatorFail();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_NoSettlementRecordFound));
                        TransactionQueueObj.SetTransactionStatusMsg("No Any Match Record Found for SPOT Order");

                        TradeTransactionQueueObj.MakeTransactionOperatorFail();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_NoSettlementRecordFound));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("No Any Match Record Found for SPOT Order");
                        TradeTransactionQueueObj.SettledDate = Helpers.UTC_To_IST();//Rita 17-1-19 update date for Reporting
                        TradeTransactionQueueObj.UpdatedDate = Helpers.UTC_To_IST();

                        CurrentTradeBuyerListObj.MakeTransactionOperatorFail();
                    }
                    else//In case of error , make partial settlement done
                    {
                        //Rita 29-1-19 make success entry for partial success-cancel
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTransactionQueueObj, 0,1);

                        TransactionQueueObj.MakeTransactionSuccess();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");
                        TradeTransactionQueueObj.SettledDate = Helpers.UTC_To_IST();//Rita 17-1-19 update date for Reporting
                        TradeTransactionQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                        TradeTransactionQueueObj.IsCancelled = 1;

                        CurrentTradeBuyerListObj.MakeTransactionSuccess();
                        CurrentTradeBuyerListObj.IsProcessing = 0;

                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                        _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                    }
                    _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                    _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                    //_dbContext.Entry(CurrentTradeBuyerListObj).State = EntityState.Modified;
                    _dbContext.Entry(CurrentTradeBuyerListObj).Property(p => p.Status).IsModified = true;
                    _dbContext.Entry(CurrentTradeBuyerListObj).Property(p => p.IsProcessing).IsModified = true;

                    _dbContext.SaveChanges();
                    try
                    {                       
                        _ISignalRService.OnStatusCancel(TradeTransactionQueueObj.Status, TransactionQueueObj, TradeTransactionQueueObj, "", TradeTransactionQueueObj.ordertype, IsPartial);
                        
                        Task.Run(() => EmailSendPartialSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.BuyQty,
                        TradeTransactionQueueObj.TrnDate.ToString(), 0, 0, TradeTransactionQueueObj.BidPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType, 2));

                    }
                    catch (Exception ex)
                    {                        
                        HelperForLog.WriteErrorLog("ReleaseWalletAmountBuy Error ##TrnNo:" + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                    }
                    return true;

                }
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("ReleaseWalletAmountBuy:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                return false;
            }
        }

        public async Task<bool> ReleaseWalletAmountSell(TradeSellerListV1 CurrentTradeSellerListObj, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,short IsPartial = 0)
        {
            try
            {
                decimal ReleaseAmt = TradeTransactionQueueObj.OrderTotalQty - TradeTransactionQueueObj.SettledSellQty;//always full amount , or take here RemainAmt , ,incase of error it should be partial-remain
                Task<WalletDrCrResponse> WalletResult = _WalletService.GetReleaseHoldNew(TradeTransactionQueueObj.Order_Currency, Helpers.GetTimeStamp(), ReleaseAmt,
                                                 TradeTransactionQueueObj.OrderAccountID, TradeTransactionQueueObj.TrnNo, enServiceType.Trading,
                                                 enWalletTrnType.SellTrade, (enTrnType)TransactionQueueObj.TrnType, (EnAllowedChannels)TransactionQueueObj.TrnMode, "");
                var WalletResp = await WalletResult;
                if (WalletResp.ReturnCode != enResponseCode.Success && ReleaseAmt != 0)//Rita 29-1-19 if no amount remain direct update records
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseWalletAmountSell Fail " + WalletResp.ErrorCode + " Msg " + WalletResp.ReturnMsg, ControllerName, "ReleaseAmt " + ReleaseAmt + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                else
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseWalletAmountSell Success " + WalletResp.ErrorCode + " Msg " + WalletResp.ReturnMsg, ControllerName, "ReleaseAmt " + ReleaseAmt + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));
                    if (IsPartial == 0)//regular
                    {
                        TransactionQueueObj.MakeTransactionOperatorFail();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_NoSettlementRecordFound));
                        TransactionQueueObj.SetTransactionStatusMsg("No Any Match Record Found for SPOT Order");

                        TradeTransactionQueueObj.MakeTransactionOperatorFail();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_NoSettlementRecordFound));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("No Any Match Record Found for SPOT Order");
                        TradeTransactionQueueObj.SettledDate = Helpers.UTC_To_IST();//Rita 17-1-19 update date for Reporting
                        TradeTransactionQueueObj.UpdatedDate = Helpers.UTC_To_IST();

                        CurrentTradeSellerListObj.MakeTransactionOperatorFail();
                    }
                    else//In case of error , make partial settlement done
                    {
                        Task<SettledTradeTransactionQueue> SettledTradeTQMakerResult = MakeTransactionSettledEntry(TradeTransactionQueueObj, 0,1);
                        TransactionQueueObj.MakeTransactionSuccess();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.CancelOrder_ProccedSuccess));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");
                        TradeTransactionQueueObj.SettledDate = Helpers.UTC_To_IST();//Rita 17-1-19 update date for Reporting
                        TradeTransactionQueueObj.UpdatedDate = Helpers.UTC_To_IST();
                        TradeTransactionQueueObj.IsCancelled = 1;

                        CurrentTradeSellerListObj.MakeTransactionSuccess();
                        CurrentTradeSellerListObj.IsProcessing = 0;

                        SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
                        _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
                    }                   

                    _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                    _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                    //_dbContext.Entry(CurrentTradeSellerListObj).State = EntityState.Modified;
                    _dbContext.Entry(CurrentTradeSellerListObj).Property(p => p.Status).IsModified = true;
                    _dbContext.Entry(CurrentTradeSellerListObj).Property(p => p.IsProcessing).IsModified = true;

                    _dbContext.SaveChanges();
                    try
                    {
                        _ISignalRService.OnStatusCancel(TradeTransactionQueueObj.Status, TransactionQueueObj, TradeTransactionQueueObj, "", TradeTransactionQueueObj.ordertype, IsPartial);

                        Task.Run(() => EmailSendPartialSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.SellQty,
                           TradeTransactionQueueObj.TrnDate.ToString(), 0, 0, TradeTransactionQueueObj.AskPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType, 2));
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog("ReleaseWalletAmountSell Error ##TrnNo:" + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ReleaseWalletAmountSell:##TrnNo " + TradeTransactionQueueObj.TrnNo, ControllerName, ex);
                return false;
            }
        }

        private async Task<bool> CheckIsProcessingBUY(long TrnNo,TradeSellerListV1 SellerList,decimal LTP)
        {
            try
            {
                Task<TradeStopLoss> TradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == SellerList.TrnNo && (
                                                            (e.MarketIndicator == 0 && e.StopPrice >= LTP) ||// 250 to 300 scenario
                                                            (e.MarketIndicator == 1 && e.StopPrice <= LTP)// 300 to 350 scenario
                                                            ));
                try
                {
                    _dbContext1.Entry(SellerList).Reload();
                }
                catch(Exception ex)
                {
                    await Task.Delay(300);
                    try
                    {
                        _dbContext1.Entry(SellerList).Reload();
                    }
                    catch (Exception ex1)
                    {
                        await Task.Delay(300);
                        try
                        {
                            _dbContext1.Entry(SellerList).Reload();
                        }
                        catch (Exception ex2)
                        {

                        }
                    }
                }

                
                if (SellerList.IsProcessing == 1)
                {
                    DateTime tTime = Helpers.UTC_To_IST().Add(new TimeSpan(0, 0, 0, 5, 0));//loop for 5 second only
                    while (Helpers.UTC_To_IST() < tTime)
                    {
                        await Task.Delay(300);
                        _dbContext1.Entry(SellerList).Reload();
                        if (SellerList.IsProcessing == 1)
                            continue;//still wait
                        else
                            break;//exit loop
                    }
                    //Thread.Sleep(3000);
                    //_dbContext1.Entry(SellerList).Reload();
                }
                if (SellerList.IsProcessing == 1 || SellerList.RemainQty <= 0 || (SellerList.Status != 4 && SellerList.Status != 0))//rita 31-1-19 for cancellation , this order does not pick
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CheckIsProcessingBUY Buy skip IsProcessing " + SellerList.IsProcessing + " Remain Qty " + SellerList.RemainQty + " Status:" + SellerList.Status + " With " + SellerList.TrnNo, ControllerName, "##TrnNo " + TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                if (SellerList.OrderType == 4)
                {
                    TradeStopLoss TradeStopLossObj = await TradeStopLossObjResult;
                    if (TradeStopLossObj == null)//if record NOT-FOUND then not possible for Activation-with-Settlement
                        return false;
                }               

                return true;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckIsProcessingBUY:##TrnNo " + TrnNo + " With TrnNo:" + SellerList.TrnNo, ControllerName, ex);
                return false;
            }
        }
        private async Task<bool> CheckIsProcessingSELL(long TrnNo, TradeBuyerListV1 BuyerList,decimal LTP)
        {
            try
            {
                Task<TradeStopLoss> TradeStopLossObjResult = _TradeStopLoss.GetSingleAsync(e => e.TrnNo == BuyerList.TrnNo && (
                                                           (e.MarketIndicator == 0 && e.StopPrice >= LTP) ||// 250 to 300 scenario
                                                           (e.MarketIndicator == 1 && e.StopPrice <= LTP)// 300 to 350 scenario
                                                           ));
                
                try
                {
                    _dbContext1.Entry(BuyerList).Reload();
                }
                catch (Exception ex)
                {
                    await Task.Delay(300);
                    try
                    {
                        _dbContext1.Entry(BuyerList).Reload();
                    }
                    catch (Exception ex1)
                    {
                        await Task.Delay(300);
                        try
                        {
                            _dbContext1.Entry(BuyerList).Reload();
                        }
                        catch (Exception ex2)
                        {

                        }
                    }
                }
                if (BuyerList.IsProcessing == 1)
                {
                    DateTime tTime = Helpers.UTC_To_IST().Add(new TimeSpan(0, 0, 0, 5, 0));//loop for 5 second only
                    while (Helpers.UTC_To_IST() < tTime)
                    {
                        await Task.Delay(300);
                        _dbContext1.Entry(BuyerList).Reload();
                        if (BuyerList.IsProcessing == 1)
                            continue;//still wait
                        else
                            break;//exit loop
                    }
                    //Thread.Sleep(3000);
                    //_dbContext1.Entry(SellerList).Reload();
                }
                if (BuyerList.IsProcessing == 1 || BuyerList.RemainQty <= 0 || (BuyerList.Status != 4 && BuyerList.Status != 0))//rita 31-1-19 for cancellation , this order does not pick
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CheckIsProcessingSELL Sell skip IsProcessing " + BuyerList.IsProcessing + " Remain Qty " + BuyerList.RemainQty + " Status:" + BuyerList.Status + " With " + BuyerList.TrnNo, ControllerName, "##TrnNo " + TrnNo, Helpers.UTC_To_IST()));
                    return false;
                }
                if (BuyerList.OrderType == 4)
                {
                    TradeStopLoss TradeStopLossObj = await TradeStopLossObjResult;
                    if (TradeStopLossObj == null)//if record NOT-FOUND then not possible for Activation-with-Settlement
                        return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckIsProcessingSELL:##TrnNo " + TrnNo + " With TrnNo:" + BuyerList.TrnNo, ControllerName, ex);
                return false;
            }
        }

        //public async Task PartialBuyMakerDataUpdate(TradeSellerListV1 SellerList,TradeTransactionQueue TradeTQMakerObj, decimal SettlementQty,decimal BaseCurrQty, decimal LTP, long TrnNo)
        //{
        //    try
        //    {
        //        //_dbContext.Entry(SellerList).Reload();
        //       // _dbContext.Entry(SellerList).State = EntityState.Modified;
        //        //SellerList.IsProcessing = 0;
        //        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0 //this is updated above
        //        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
        //       // SellerList.MakeTransactionSuccess();

        //        //_dbContext.Entry(TradeTQMakerObj).Reload();
        //        //if (SellerList.OrderType == 2)
        //        //{
        //        //    TradeTQMakerObj.AskPrice = LTP;
        //        //}
        //        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
        //        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;
        //        //TradeTQMakerObj.MakeTransactionSuccess();
        //        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //        //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
        //    }
        //    catch(Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("PartialBuyMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
        //        throw ex;
        //    }
        //}

        //public async Task FullBuyMakerDataUpdate(TradeSellerListV1 SellerList, TradeTransactionQueue TradeTQMakerObj,TransactionQueue TQMakerObj, SettledTradeTransactionQueue SettledTradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        //{
        //    try
        //    {
        //        //_dbContext.Entry(SellerList).Reload();
        //        //_dbContext.Entry(SellerList).State = EntityState.Modified;

        //        //SellerList.IsProcessing = 0;//Release Seller List
        //        //SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
        //        //SellerList.SelledQty = SellerList.SelledQty + SettlementQty;//this will give result 0
        //        //_dbContext.Entry(TradeTQMakerObj).Reload();
        //        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;
        //        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + BaseCurrQty;

        //        if (SellerList.RemainQty == 0)
        //        {//Make Seller Order Success
        //         // SellerList.MakeTransactionSuccess();
        //            //TradeTQMakerObj.MakeTransactionSuccess();
        //            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //            TQMakerObj.MakeTransactionSuccess();
        //            TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //            TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //            //SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
        //            _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
        //        }
        //        //else
        //        //{                   
        //        //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
        //        //    TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
        //        //}
        //        //else
        //        //    SellerList.MakeTransactionHold();

        //        //if (SellerList.OrderType == 2)
        //        //{
        //        //    TradeTQMakerObj.AskPrice = LTP;
        //        //}
        //        //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("FullBuyMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
        //        throw ex;
        //    }
        //}

        //public async Task PartialSellMakerDataUpdate(TradeBuyerListV1 BuyerList, TradeTransactionQueue TradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        //{
        //    try
        //    {
        //        //_dbContext.Entry(BuyerList).Reload();
        //        //BuyerList.IsProcessing = 0;
        //        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//this will give result 0
        //        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0
        //        //BuyerList.MakeTransactionSuccess();

        //       // _dbContext.Entry(BuyerList).State = EntityState.Modified;

        //        //_dbContext.Entry(TradeTQMakerObj).Reload();
        //        //if (BuyerList.OrderType == 2)
        //        //{
        //        //    TradeTQMakerObj.BidPrice = LTP;
        //        //}
        //        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
        //        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
        //        //TradeTQMakerObj.MakeTransactionSuccess();
        //        //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //        //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //        //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("PartialSellMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
        //        throw ex;
        //    }
        //}

        //public async Task FullSellMakerDataUpdate(TradeBuyerListV1 BuyerList, TradeTransactionQueue TradeTQMakerObj, TransactionQueue TQMakerObj, SettledTradeTransactionQueue SettledTradeTQMakerObj, decimal SettlementQty, decimal BaseCurrQty, decimal LTP, long TrnNo)
        //{
        //    try
        //    {
        //        //_dbContext.Entry(BuyerList).Reload();
        //        //_dbContext.Entry(BuyerList).State = EntityState.Modified;
        //        //BuyerList.IsProcessing = 0;
        //        //BuyerList.RemainQty = BuyerList.RemainQty - SettlementQty;//Update first as updated value in below line
        //        //BuyerList.DeliveredQty = BuyerList.DeliveredQty + SettlementQty;//this will give result 0  
        //        //_dbContext.Entry(TradeTQMakerObj).Reload();
        //        //TradeTQMakerObj.SettledBuyQty = TradeTQMakerObj.SettledBuyQty + SettlementQty;
        //        //TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + BaseCurrQty;
        //        if (BuyerList.RemainQty == 0)
        //        {//Make Seller Order Success
        //            //BuyerList.MakeTransactionSuccess();
        //            //TradeTQMakerObj.MakeTransactionSuccess();
        //            //TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //            //TradeTQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //            TQMakerObj.MakeTransactionSuccess();
        //            TQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
        //            TQMakerObj.SetTransactionStatusMsg("Full Settlement Done");
        //            //SettledTradeTransactionQueue SettledTradeTQMakerObj = await SettledTradeTQMakerResult;
        //            _dbContext.Set<SettledTradeTransactionQueue>().Add(SettledTradeTQMakerObj);
        //        }
        //        //else
        //        //{                   
        //        //    TradeTQMakerObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
        //        //    TradeTQMakerObj.SetTransactionStatusMsg("Partial Settlement Done");
        //        //}
        //        //else
        //        //    BuyerList.MakeTransactionHold();

        //        //if (BuyerList.OrderType == 2)
        //        //{
        //        //    TradeTQMakerObj.BidPrice = LTP;
        //        //}               
        //        //_dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("FullSellMakerDataUpdate:##TrnNo " + TrnNo, ControllerName, ex);
        //        throw ex;
        //    }
        //}
             
        private async Task BuyFailTransactionNotification(TradeBuyerListV1 CurrentTradeBuyerListObj,long MemberID)
        {
            try
            {
                ActivityNotificationMessage notification = new ActivityNotificationMessage();
                notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionValidationFail);                
                notification.Param1 = CurrentTradeBuyerListObj.TrnNo.ToString();
                notification.Type = Convert.ToInt16(EnNotificationType.Fail);
                _ISignalRService.SendActivityNotificationV2(notification, MemberID.ToString(), 2);//Req.accessToken
                                                                                                                      //_ISignalRService.SendActivityNotificationV2(notification, Req.accessToken);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("BuyFailTransactionNotification Notification Send No Qty Found" + notification.MsgCode, ControllerName, "##TrnNo:" + CurrentTradeBuyerListObj.TrnNo, Helpers.UTC_To_IST()));
            }
            catch (Exception ex)
            {                
                HelperForLog.WriteErrorLog("BuyFailTransactionNotification:##TrnNo " + CurrentTradeBuyerListObj.TrnNo, ControllerName, ex);
            }
        }

        private async Task SellFailTransactionNotification(TradeSellerListV1 CurrentTradeSellerListObj, long MemberID)
        {
            try
            {
                ActivityNotificationMessage notification = new ActivityNotificationMessage();
                notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionValidationFail);
                notification.Param1 = CurrentTradeSellerListObj.TrnNo.ToString();
                notification.Type = Convert.ToInt16(EnNotificationType.Fail);
                _ISignalRService.SendActivityNotificationV2(notification, MemberID.ToString(), 2);//Req.accessToken
                                                                                                  //_ISignalRService.SendActivityNotificationV2(notification, Req.accessToken);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SellFailTransactionNotification Notification Send No Qty Found" + notification.MsgCode, ControllerName, "##TrnNo:" + CurrentTradeSellerListObj.TrnNo, Helpers.UTC_To_IST()));
            }
            catch (Exception ex)
            {                
                HelperForLog.WriteErrorLog("SellFailTransactionNotification:##TrnNo " + CurrentTradeSellerListObj.TrnNo, ControllerName, ex);
            }
        }

        public async Task PartilaSettleBuySignalR(long TrnNo, TransactionQueue TransactionQueueObj,TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken,decimal SettlementPrice,decimal SettlementQty,short OrderType)
        {
            try
            {
                //Task ActInactResult = ActiveInactiveSTOPNLimitOrders(TrnNo, SettlementPrice, TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.ordertype);

                if(OrderType!=3)//SPOT order no partial order possible , so no send any data
                {//do not send buyer-seller book , bcz no any order with this type of order
                   await _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, "", TradeStopLossObj.ordertype);
                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 1));
                    //Uday 08-12-2018 Send Email When Transction is Partially Settled             
                    Task.Run(() => EmailSendPartialSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate.ToString(),
                        TradeTransactionQueueObj.BuyQty - TradeTransactionQueueObj.SettledBuyQty, TradeTransactionQueueObj.SettledBuyQty, TradeTransactionQueueObj.BidPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType));
                }

                //==============Volume update only after success,Maker/Seller's Txn Success
                //var MakeTradeStopLossObj = await MakeTradeStopLossObjResult;
                await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype, SettlementPrice);
                //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);

                await _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 this is sell order so bifprice and BuyQty is zero , take settlement price and Qty
                _ISignalRService.OnLtpChange(SettlementPrice, TradeTQMakerObj.PairID, TradeTQMakerObj.PairName);//rita 11-1-19 for Stop and Limit add/remove in book
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                //Task EmailResult = 
                //Uday 03-01-2019 Send Email From Other Function
                //Task.Run(() => EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                //          TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                //          TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, TradeTQMakerObj.TrnNo,TradeTQMakerObj.SellQty, TradeTQMakerObj.AskPrice, 0));
                Task.Run(() => EmailSendPartialSettledTransaction(TradeTQMakerObj.TrnNo, TradeTQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.SellQty,
                    TradeTQMakerObj.TrnDate.ToString(), 0, 0, TradeTQMakerObj.AskPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, 1));

                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));
                //Send SMS For Fully Settled Transaction
                Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2));
               // await ActInactResult;
                
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("PartilaSettleBuySignalR", ControllerName, "Partial Settlement Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("PartilaSettleBuySignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }

        public async Task FullSettleBuySignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty,TradeSellerListV1 SellerList, short OrderType)
        {
            try
            {
                //Task ActInactResult = ActiveInactiveSTOPNLimitOrders(TrnNo, SettlementPrice, TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.ordertype);
                //Seller Txn partial Success;
                if (SellerList.RemainQty == 0)//Full Success
                {
                    await _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//rita 06-12-18 for success maker txn send call
                    await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype, SettlementPrice);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Fully Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2));

                    //Uday 08-12-2018 Send EMAIL When Transaction Is Settled
                    //Uday 03-01-2019 Send Email From Other Function
                    //Task.Run(() => EmailSendAsync(TQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                    //TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                    //TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, TradeTQMakerObj.TrnNo,TradeTQMakerObj.SellQty, TradeTQMakerObj.AskPrice, 0));
                    Task.Run(() => EmailSendPartialSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.SellQty,
                    TradeTQMakerObj.TrnDate.ToString(), 0, 0, TradeTQMakerObj.AskPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, 1));

                }
                else
                {
                    await _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 1));


                    //Uday 08-12-2018 Send Email When Transction is Partially Settled
                    Task.Run(() => EmailSendPartialSettledTransaction(TQMakerObj.Id, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.SellQty, TradeTQMakerObj.TrnDate.ToString(),
                        TradeTQMakerObj.SellQty - TradeTQMakerObj.SettledSellQty, TradeTQMakerObj.SettledSellQty, TradeTQMakerObj.AskPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType));
                    
                }
                await _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty
                await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, "", TradeStopLossObj.ordertype, SettlementPrice);//komal
                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Fully Settled Transaction
                _ISignalRService.OnLtpChange(SettlementPrice, TradeTQMakerObj.PairID, TradeTQMakerObj.PairName);//rita 11-1-19 for Stop and Limit add/remove in book
                Task.Run(() => SMSSendSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 2));

                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                
                //Uday 03-01-2019 Send Email From Other Functiom
                //Task EmailResult = EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                //          TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                //          TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType, TradeTransactionQueueObj.TrnNo,TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.BidPrice, 0);
                Task.Run(() => EmailSendPartialSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.BuyQty,
                    TradeTransactionQueueObj.TrnDate.ToString(), 0, 0, TradeTransactionQueueObj.BidPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType, 1));

                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));
                //await ActInactResult;
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("FullSettleBuySignalR", ControllerName, "Full Settlement Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("FullSettleBuySignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }
        
        public async Task PartilaSettleSellSignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty, short OrderType)
        {
            try
            {
                //Task ActInactResult = ActiveInactiveSTOPNLimitOrders(TrnNo, SettlementPrice, TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.ordertype);
                
                //Uday 03-01-2019 Send Email From Other Function
                //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Start", ControllerName, ""));
                //Task.Run(() => EmailSendAsync(TradeTQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                //           TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                //           TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, TradeTQMakerObj.TrnNo,TradeTQMakerObj.BuyQty, TradeTQMakerObj.BidPrice, 0));
                Task.Run(() => EmailSendPartialSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.BuyQty,
                    TradeTQMakerObj.TrnDate.ToString(), 0, 0, TradeTQMakerObj.BidPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, 1));

                //Task.Run(() => HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT EmailSend Done", ControllerName, ""));

                if (OrderType != 3)//SPOT order no partial order possible , so no send any data
                {//do not send buyer-seller book , bcz no any order with this type of order
                    await _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, "", TradeStopLossObj.ordertype);
                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 1));
                    //Uday 08-12-2018 Send Email When Transction is Partially Settled             
                    Task.Run(() => EmailSendPartialSettledTransaction(TransactionQueueObj.Id, TransactionQueueObj.MemberID.ToString(), TradeTransactionQueueObj.PairName, TradeTransactionQueueObj.SellQty, TradeTransactionQueueObj.TrnDate.ToString(),
                        TradeTransactionQueueObj.SellQty - TradeTransactionQueueObj.SettledSellQty, TradeTransactionQueueObj.SettledSellQty, TradeTransactionQueueObj.AskPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType));
                }

                //==============Volume update only after success,Maker/Seller's Txn Success   
                await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype, SettlementPrice);

                await _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//12-3-18 take settlement price and Qty
                
                _ISignalRService.OnLtpChange(SettlementPrice, TradeTQMakerObj.PairID, TradeTQMakerObj.PairName);//rita 11-1-19 for Stop and Limit add/remove in book
                //_IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, TradeTQMakerObj.BidPrice, TradeTQMakerObj.TrnNo, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate);                
                //Send SMS For Fully Settled Transaction
                Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2));
                //await ActInactResult;
                
            }
            catch (Exception ex)
            {
                //HelperForLog.WriteLogIntoFile("PartilaSettleSellSignalR", ControllerName, "Partial Settlement SELL Error " + ex.Message + "##TrnNo:" + TrnNo);
                HelperForLog.WriteErrorLog("PartilaSettleSellSignalR:##TrnNo " + TrnNo, ControllerName, ex);
            }
        }

        public async Task FullSettleSellSignalR(long TrnNo, TransactionQueue TransactionQueueObj, TradeTransactionQueue TradeTransactionQueueObj,TradeStopLoss TradeStopLossObj, TradeStopLoss MakeTradeStopLossObj, TransactionQueue TQMakerObj, TradeTransactionQueue TradeTQMakerObj,string accessToken, decimal SettlementPrice, decimal SettlementQty, TradeBuyerListV1 BuyerList, short OrderType)
        {
            try
            {
                //Task ActInactResult = ActiveInactiveSTOPNLimitOrders(TrnNo, SettlementPrice, TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.ordertype);
                //Seller Txn partial Success;
                if (BuyerList.RemainQty == 0)//Full Success
                {
                    await _IFrontTrnService.GetPairAdditionalVal(TradeTQMakerObj.PairID, SettlementPrice, TradeTQMakerObj.TrnNo, SettlementQty, TradeTQMakerObj.TrnDate);//rita 06-12-18 for success maker txn send call
                    await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype,SettlementPrice);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Fully Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 2));

                    //Uday 08-12-2018 Send EMAIL When Transaction Is Settled
                    //Uday 03-01-2019 Send Email From Other Function
                    //Task EmailResult1 =
                    //Task.Run(()=> EmailSendAsync(TQMakerObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTQMakerObj.PairName,
                    // TradeTQMakerObj.PairName.Split("_")[1], TradeTQMakerObj.TrnDate.ToString(),
                    // TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, TradeTQMakerObj.TrnNo,TradeTQMakerObj.BuyQty, TradeTQMakerObj.BidPrice, 0));
                    Task.Run(() => EmailSendPartialSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.BuyQty,
                    TradeTQMakerObj.TrnDate.ToString(), 0, 0, TradeTQMakerObj.BidPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, 1));

                }
                else
                {
                    await _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TQMakerObj, TradeTQMakerObj, "", MakeTradeStopLossObj.ordertype);

                    //Uday 06-12-2018 Send SMS When Transaction is Settled
                    //Send SMS For Partially Settled Transaction
                    Task.Run(() => SMSSendSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberMobile, SettlementPrice, SettlementQty, 1));


                    //Uday 08-12-2018 Send Email When Transction is Partially Settled
                    Task.Run(() => EmailSendPartialSettledTransaction(TQMakerObj.Id, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.BuyQty, TradeTQMakerObj.TrnDate.ToString(),
                        TradeTQMakerObj.BuyQty - TradeTQMakerObj.SettledBuyQty, TradeTQMakerObj.SettledBuyQty, TradeTQMakerObj.BidPrice, 0, TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType));
                    
                }
                await _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, SettlementPrice, TradeTransactionQueueObj.TrnNo, SettlementQty, TradeTransactionQueueObj.TrnDate);//12-3-18 take settlement price and Qty
                await _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, "", TradeStopLossObj.ordertype,SettlementPrice);//komal
                _ISignalRService.OnLtpChange(SettlementPrice, TradeTQMakerObj.PairID, TradeTQMakerObj.PairName);//rita 11-1-19 for Stop and Limit add/remove in book
                //Uday 06-12-2018 Send SMS When Transaction is Settled
                //Send SMS For Fully Settled Transaction
                Task.Run(() => SMSSendSettledTransaction(TradeTransactionQueueObj.TrnNo, TransactionQueueObj.MemberMobile, SettlementPrice, SettlementQty, 2));

                // Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Start", ControllerName, "", Helpers.UTC_To_IST()));
                
                //Uday 03-01-2019 Send Email From Other Function
                //Task.Run(() => EmailSendAsync(TransactionQueueObj.MemberID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                //          TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                //          TradeTransactionQueueObj.ordertype, TradeTransactionQueueObj.TrnType, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.SellQty, TradeTransactionQueueObj.AskPrice, 0));
                Task.Run(() => EmailSendPartialSettledTransaction(TradeTQMakerObj.TrnNo, TQMakerObj.MemberID.ToString(), TradeTQMakerObj.PairName, TradeTQMakerObj.SellQty,
                   TradeTQMakerObj.TrnDate.ToString(), 0, 0, TradeTQMakerObj.AskPrice, 0, TradeTQMakerObj.ordertype, TradeTQMakerObj.TrnType, 1));

                // Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT EmailSend Done", ControllerName, "", Helpers.UTC_To_IST()));
                //await ActInactResult;
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
                //Rita inserted from sp
                //TradePoolQueueObj = new TradePoolQueueV1()
                //{
                //    CreatedDate = Helpers.UTC_To_IST(),
                //    CreatedBy = MemberID,
                //    PairID = PairID,
                //    MakerTrnNo = MakerTrnNo,
                //    MakerQty = MakerQty,
                //    MakerPrice = MakerPrice,
                //    TakerTrnNo = TakerTrnNo,
                //    TakerQty = TakerQty,
                //    TakerPrice = TakerPrice,
                //    TakerDisc = TakerDisc,
                //    TakerLoss = TakerLoss,
                //    MakerType = MakerType,
                //    TakerType = TakerType,
                //    Status = Convert.ToInt16(enTransactionStatus.Success),//always etry after settlement done
                //};
                //TradePoolQueueObj = _TradePoolQueue.Add(TradePoolQueueObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
                TradePoolQueueObj = await _dbContext.Set<TradePoolQueueV1>().FirstOrDefaultAsync(item => item.MakerTrnNo == MakerTrnNo && item.TakerTrnNo == TakerTrnNo && item.Status==0);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTradePoolQueue:##TrnNo " + TakerTrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }

        private async Task<bool> WalletProcessBuy(TradeTransactionQueue TradeTQueueCurrentObj, TradeTransactionQueue TradeTQueueMakerObj, decimal Price,decimal SettledQty,decimal BaseCurrQty,short CurrIsFullSettled,short MakerIsFullSettled, short TrnMode, WalletDrCrResponse CreditWalletResult1)
        {
            CreditWalletResult = new WalletDrCrResponse();//here object pass not working in async method
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessBuy", ControllerName, "Start Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                //===============First-Base Currency======================================               
                CommonClassCrDr CrDrFirstCurrObj = new CommonClassCrDr();

                //TradeTQueueMakerObj credit wallet = +Price * SettledQty
                WalletCrDr CrFirstCurrObj = new WalletCrDr();
                CrFirstCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                CrFirstCurrObj.WalletId = TradeTQueueMakerObj.DeliveryWalletID;//Cr WalletID
                CrFirstCurrObj.trnType = enWalletTrnType.SellTrade;//enWalletTrnType.Cr_Trade //Rita 16-1-19 change as wallet team changed Enum
                CrFirstCurrObj.isFullSettled = MakerIsFullSettled;
                CrFirstCurrObj.IsMaker = 1;//rita 5-2-19 for charge , 1-Maker,2-taker
                //TradeTQueueCurrentObj Debit wallet = -Price * SettledQty
                WalletCrDr DrFirstCurrObj = new WalletCrDr();
                DrFirstCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                DrFirstCurrObj.WalletId = TradeTQueueCurrentObj.OrderWalletID;//Dr WalletID
                DrFirstCurrObj.trnType = enWalletTrnType.BuyTrade;//enWalletTrnType.Dr_Trade
                DrFirstCurrObj.isFullSettled = CurrIsFullSettled;
                DrFirstCurrObj.IsMaker = 2;//rita 5-2-19 for charge , 1-Maker,2-taker
                if (TradeTQueueCurrentObj.ordertype == 2) // ntrivedi 07-12-2018
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
                CrSecondCurrObj.trnType = enWalletTrnType.BuyTrade;//enWalletTrnType.Cr_Trade
                CrSecondCurrObj.isFullSettled = CurrIsFullSettled;
                CrSecondCurrObj.IsMaker = 2;//rita 5-2-19 for charge , 1-Maker,2-taker
                //TradeTQueueMakerObj Debit wallet = -SettledQty
                WalletCrDr DrSecondCurrObj = new WalletCrDr();
                DrSecondCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                DrSecondCurrObj.WalletId = TradeTQueueMakerObj.OrderWalletID;//Cr WalletID
                DrSecondCurrObj.trnType = enWalletTrnType.SellTrade;//enWalletTrnType.Dr_Trade
                DrSecondCurrObj.isFullSettled = MakerIsFullSettled;
                DrSecondCurrObj.IsMaker = 1;//rita 5-2-19 for charge , 1-Maker,2-taker
                if (TradeTQueueMakerObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrSecondCurrObj.isMarketTrade = 1;

                CrDrSecondCurrObj.Amount = SettledQty;
                CrDrSecondCurrObj.Coin = TradeTQueueCurrentObj.Delivery_Currency;
                CrDrSecondCurrObj.creditObject = CrSecondCurrObj;
                CrDrSecondCurrObj.debitObject = DrSecondCurrObj;

                //WalletDrCrResponse //rita 10-1-19 for make order fail base on error code
                //InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed = 4347
                //InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed = 4348
                //InsufficientOutgoingBalFirstCur = 4345
                //InsufficietOutgoingBalSecondCur = 4346
                //CrDrCredit_SettledBalMismatchCrWallet = 4364
                //CrDrCredit_SettledBalMismatchCrWalletSecCur = 4365
                //CrDrCredit_SettledBalMismatchDrWallet = 4366
                //CrDrCredit_SettledBalMismatchDrWalletSecDr = 4367
                CreditWalletResult = await _WalletService.GetWalletCreditDrForHoldNewAsyncFinal(CrDrSecondCurrObj, CrDrFirstCurrObj,
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
        private async Task<bool> WalletProcessSell(TradeTransactionQueue TradeTQueueCurrentObj, TradeTransactionQueue TradeTQueueMakerObj, decimal Price, decimal SettledQty, decimal BaseCurrQty, short CurrIsFullSettled, short MakerIsFullSettled, short TrnMode,WalletDrCrResponse CreditWalletResult1)
        {
            CreditWalletResult = new WalletDrCrResponse();//here object pass not working in async method
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("PROCESSSETLLEMENT WalletProcessSell", ControllerName, "Start Wallet Operation With TrnNo:" + TradeTQueueMakerObj.TrnNo + "##TrnNo:" + TradeTQueueCurrentObj.TrnNo, Helpers.UTC_To_IST()));
                //===============First-Base Currency======================================               
                CommonClassCrDr CrDrFirstCurrObj = new CommonClassCrDr();

                //TradeTQueueCurrentObj credit wallet = -Price * SettledQty
                WalletCrDr CrFirstCurrObj = new WalletCrDr();
                CrFirstCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                CrFirstCurrObj.WalletId = TradeTQueueCurrentObj.DeliveryWalletID;//Cr WalletID to Current Seller
                CrFirstCurrObj.trnType = enWalletTrnType.SellTrade;//enWalletTrnType.Cr_Trade //Rita 16-1-19 change as wallet team changed Enum
                CrFirstCurrObj.isFullSettled = CurrIsFullSettled;
                CrFirstCurrObj.IsMaker = 2;//rita 5-2-19 for charge , 1-Maker,2-taker
                //TradeTQueueMakerObj Debit wallet = +Price * SettledQty
                WalletCrDr DrFirstCurrObj = new WalletCrDr();
                DrFirstCurrObj.TrnRefNo = TradeTQueueMakerObj.TrnNo;
                DrFirstCurrObj.WalletId = TradeTQueueMakerObj.OrderWalletID;//Dr WalletID of Buyer
                DrFirstCurrObj.trnType = enWalletTrnType.BuyTrade;
                DrFirstCurrObj.isFullSettled = MakerIsFullSettled;
                DrFirstCurrObj.IsMaker = 1;//rita 5-2-19 for charge , 1-Maker,2-taker
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
                CrSecondCurrObj.trnType = enWalletTrnType.BuyTrade;
                CrSecondCurrObj.isFullSettled = MakerIsFullSettled;
                CrSecondCurrObj.IsMaker = 1;//rita 5-2-19 for charge , 1-Maker,2-taker
                //TradeTQueueCurrentObj Debit wallet = -SettledQty
                WalletCrDr DrSecondCurrObj = new WalletCrDr();
                DrSecondCurrObj.TrnRefNo = TradeTQueueCurrentObj.TrnNo;
                DrSecondCurrObj.WalletId = TradeTQueueCurrentObj.OrderWalletID;//Dr WalletID of Current Seller
                DrSecondCurrObj.trnType = enWalletTrnType.SellTrade;
                DrSecondCurrObj.isFullSettled = CurrIsFullSettled;
                DrSecondCurrObj.IsMaker = 2;//rita 5-2-19 for charge , 1-Maker,2-taker
                if (TradeTQueueCurrentObj.ordertype == 2) // ntrivedi 07-12-2018
                    DrSecondCurrObj.isMarketTrade = 1;

                CrDrSecondCurrObj.Amount = SettledQty;
                CrDrSecondCurrObj.Coin = TradeTQueueCurrentObj.Order_Currency;
                CrDrSecondCurrObj.creditObject = CrSecondCurrObj;
                CrDrSecondCurrObj.debitObject = DrSecondCurrObj;

                //WalletDrCrResponse //rita 10-1-19 for make order fail base on error code               

                CreditWalletResult = await _WalletService.GetWalletCreditDrForHoldNewAsyncFinal(CrDrSecondCurrObj, CrDrFirstCurrObj,
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

        public async Task<SettledTradeTransactionQueue> MakeTransactionSettledEntry(TradeTransactionQueue TradeTransactionQueueObj, decimal Price, short IsCancelled=0)
        {
            decimal BidPrice= TradeTransactionQueueObj.BidPrice;
            decimal AskPrice= TradeTransactionQueueObj.AskPrice;
            //rita 7-1-18 need for graph canculation
            //rita 3-1-18 set same price also in market order
            if (TradeTransactionQueueObj.ordertype == 2)
            {
                if (TradeTransactionQueueObj.TrnType == 4)//Buy
                {
                    BidPrice = Price;
                }
                else//Sell
                {
                    AskPrice = Price;
                }
            }
            try
            {
                SettledTradeTransactionQueue SettledTradeTQObj = new SettledTradeTransactionQueue()
                {
                    CreatedDate = Helpers.UTC_To_IST(),//rita 29-1-19 added for log
                    TrnNo = TradeTransactionQueueObj.TrnNo,
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
                    BidPrice = BidPrice,
                    SellQty = TradeTransactionQueueObj.SellQty,
                    AskPrice = AskPrice,
                    Order_Currency = TradeTransactionQueueObj.Order_Currency,
                    OrderTotalQty = TradeTransactionQueueObj.OrderTotalQty,
                    Delivery_Currency = TradeTransactionQueueObj.Delivery_Currency,
                    DeliveryTotalQty = TradeTransactionQueueObj.DeliveryTotalQty,
                    SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty,
                    SettledSellQty = TradeTransactionQueueObj.SettledSellQty,
                    Status = 1,// TradeTransactionQueueObj.Status,//rita 3-1-19 every time only success save
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

        //private async Task ActiveInactiveSTOPNLimitOrders(long TrnNo,decimal SettlementPrice,long PairID,short OrderType)
        //{
        //    long CurrTrnNo=0;
        //    try
        //    {
        //        if (CurrTrnNo == 0)
        //            return;
        //        //=========================Activation Process=======================================
        //        IEnumerable<TradeTransactionQueue> InActiveTxnList = await _TradeTransactionRepository.FindByAsync(e => e.PairID == PairID && e.Status == Convert.ToInt16(enTransactionStatus.InActive) && e.ordertype == 4);                

        //        IEnumerable<TradeStopLoss> TradeStopLossAllObj = await _TradeStopLoss.FindByAsync(e => e.PairID == PairID && e.ordertype == 4);

        //        foreach (TradeTransactionQueue _TQlist in InActiveTxnList)
        //        {
        //            CurrTrnNo = _TQlist.TrnNo;
        //            //TradeStopLoss TradeStopLossObj = TradeStopLossAllObj.Where(e => e.TrnNo ==_TQlist.TrnNo && (SettlementPrice>= e.RangeMin && SettlementPrice <= e.RangeMax)).FirstOrDefault();
        //            //This range condition not work as LTP not in range that time order should place ,here this LTP will not come in this condition
        //            TradeStopLoss TradeStopLossObj = TradeStopLossAllObj.Where(e => e.TrnNo ==_TQlist.TrnNo && (
        //                                                    (e.MarketIndicator == 0 && e.StopPrice >= SettlementPrice)||// 250 to 300 scenario
        //                                                    (e.MarketIndicator == 1 && e.StopPrice <= SettlementPrice)// 300 to 350 scenario
        //                                                    )).FirstOrDefault();
        //            if (TradeStopLossObj == null)//if record NOT-FOUND then not possible for Activation
        //                continue;
        //            //Make this active
        //            _TQlist.MakeTransactionHold();
        //            _TQlist.SetTransactionStatusMsg("Activated");
        //            await _TradeTransactionRepository.UpdateFieldAsync(_TQlist, e => e.Status, e => e.StatusMsg);

        //            if (_TQlist.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //            {
        //                TradeBuyerListV1 TradeBuyerListObj =await _TradeBuyerList.GetSingleAsync(e => e.TrnNo == _TQlist.TrnNo);
        //                TradeBuyerListObj.MakeTransactionHold();
        //                await _TradeBuyerList.UpdateFieldAsync(TradeBuyerListObj, e => e.Status);
        //            }
        //            else
        //            {
        //                TradeSellerListV1 TradeSellerListObj = await _TradeSellerList.GetSingleAsync(e => e.TrnNo == _TQlist.TrnNo);
        //                TradeSellerListObj.MakeTransactionHold();
        //                await _TradeSellerList.UpdateFieldAsync(TradeSellerListObj, e => e.Status);
        //            }

        //        }
        //        CurrTrnNo = 0;
        //        //=========================In Activation Process=======================================
        //        IEnumerable<TradeTransactionQueue> ActiveTxnList = await _TradeTransactionRepository.FindByAsync(e => e.PairID == PairID && e.Status == Convert.ToInt16(enTransactionStatus.Hold) && e.ordertype == 4);

        //        IEnumerable<TradeStopLoss> TradeStopLossAllACtObj = await _TradeStopLoss.FindByAsync(e => e.PairID == PairID && e.ordertype == 4);

        //        foreach (TradeTransactionQueue _TQlist in ActiveTxnList)
        //        {
        //            CurrTrnNo = _TQlist.TrnNo;
        //            //TradeStopLoss TradeStopLossObj = TradeStopLossAllObj.Where(e => e.TrnNo ==_TQlist.TrnNo && (SettlementPrice>= e.RangeMin && SettlementPrice <= e.RangeMax)).FirstOrDefault();
        //            //This range condition not work as LTP not in range that time order should place ,here this LTP will not come in this condition
        //            TradeStopLoss TradeStopLossObj = TradeStopLossAllACtObj.Where(e => e.TrnNo == _TQlist.TrnNo && (
        //                                                    (e.MarketIndicator == 0 && e.StopPrice >= SettlementPrice) ||// 250 to 300 scenario
        //                                                    (e.MarketIndicator == 1 && e.StopPrice <= SettlementPrice)// 300 to 350 scenario
        //                                                    )).FirstOrDefault();
        //            if (TradeStopLossObj != null)//if record FOUND then not possible for In-Activation
        //                continue;
        //            //Make this In-active for no record found
        //            _TQlist.MakeTransactionInActive();
        //            _TQlist.SetTransactionStatusMsg("Activated");
        //            await _TradeTransactionRepository.UpdateFieldAsync(_TQlist, e => e.Status, e => e.StatusMsg);

        //            if (_TQlist.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //            {
        //                TradeBuyerListV1 TradeBuyerListObj = await _TradeBuyerList.GetSingleAsync(e => e.TrnNo == _TQlist.TrnNo);
        //                TradeBuyerListObj.MakeTransactionInActive();
        //                await _TradeBuyerList.UpdateFieldAsync(TradeBuyerListObj, e => e.Status);
        //            }
        //            else
        //            {
        //                TradeSellerListV1 TradeSellerListObj = await _TradeSellerList.GetSingleAsync(e => e.TrnNo == _TQlist.TrnNo);
        //                TradeSellerListObj.MakeTransactionInActive();
        //                await _TradeSellerList.UpdateFieldAsync(TradeSellerListObj, e => e.Status);
        //            }

        //        }


        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog("ActiveInactiveSTOPNLimitOrders for TrnNo:"+ CurrTrnNo + " ##TrnNo " + TrnNo, ControllerName, ex);               
        //    }
        //}

        #region Repository SP
        public async Task<bool> Callsp_TradeSettlement(long TrnNo,long MakerTrnNo,decimal SettlementQty,decimal BaseCurrQty,decimal SettlementPrice,short ActionType,short ActionStage, long ErrorCode = 0, long UpdatedBy = 0)
        {
            bool ReturnCode = false;
            //long ErrorCode = 0;//rita 20-3-19 pass in sp in case of reverse wallet
            try
            {
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, string.Empty, DataRowVersion.Default,TrnNo),
                new SqlParameter("@MakerTrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, string.Empty, DataRowVersion.Default,MakerTrnNo),
                new SqlParameter("@SettlementQty",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, string.Empty, DataRowVersion.Default, SettlementQty),
                new SqlParameter("@BaseCurrQty",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, string.Empty, DataRowVersion.Default, BaseCurrQty),
                new SqlParameter("@SettlementPrice",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, string.Empty, DataRowVersion.Default, SettlementPrice),
                new SqlParameter("@ActionType",SqlDbType.TinyInt, 10, ParameterDirection.Input, false, 0, 0, string.Empty, DataRowVersion.Default, ActionType) ,
                new SqlParameter("@ActionStage",SqlDbType.TinyInt, 10, ParameterDirection.Input, false, 0, 0, string.Empty, DataRowVersion.Default, ActionStage) ,
                new SqlParameter("@ReturnCode",SqlDbType.Bit, 10, ParameterDirection.Output, false, 28, 8, string.Empty, DataRowVersion.Default, ReturnCode),
                new SqlParameter("@ErrorCode",SqlDbType.BigInt, 10, ParameterDirection.InputOutput, false, 0, 0, string.Empty, DataRowVersion.Default, ErrorCode),
                new SqlParameter("@UpdatedBy",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, string.Empty, DataRowVersion.Default, UpdatedBy)
            };
                var res = _dbContext2.Database.ExecuteSqlCommand("Sp_TradeSettlement @TrnNo ,@MakerTrnNo,@SettlementQty,@BaseCurrQty,@SettlementPrice,@ActionType,@ActionStage,@ReturnCode  OUTPUT,@ErrorCode  OUTPUT,@UpdatedBy", param1);
                ReturnCode = Convert.ToBoolean(@param1[7].Value);
                ErrorCode = Convert.ToInt64(@param1[8].Value);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("Sp_TradeSettlement",ControllerName, "##TrnNo:" + TrnNo + " ,MakerTrnNo=" + MakerTrnNo + 
                    ",SettlementQty=" + SettlementQty + ",BaseCurrQty=" + BaseCurrQty + ",SettlementPrice=" + SettlementPrice + ",ActionType=" + ActionType + ",ActionStage=" + ActionStage + ",ReturnCode=" + ReturnCode + ",ErrorCode=" + ErrorCode + ",UpdatedBy=" + UpdatedBy));


                return ReturnCode;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Callsp_TradeSettlement ##TrnNo " + TrnNo, ControllerName, ex);
                throw ex;
            }
        }
        #endregion

        //Uday 03-01-2019 Send The Settlement Email From Other Function
        //public async Task EmailSendAsync(string UserID, int Status, string PairName, string BaseMarket
        //   , string TrnDate, short OrderType, short TrnType, long TrnNo, decimal Qty = 0, decimal Price = 0, decimal Fees = 0)
        //{
        //    try
        //    {
        //        if (!string.IsNullOrEmpty(UserID) && !string.IsNullOrEmpty(PairName) && !string.IsNullOrEmpty(BaseMarket) &&
        //            Qty != 0 && !string.IsNullOrEmpty(TrnDate) && Price != 0 && Status == 1)
        //        {
        //            SendEmailRequest Request = new SendEmailRequest();
        //            ApplicationUser User = new ApplicationUser();
        //            User = await _userManager.FindByIdAsync(UserID);
        //            if (!string.IsNullOrEmpty(User.Email))
        //            {
        //                IQueryable Result = await _messageConfiguration.GetTemplateConfigurationAsync(Convert.ToInt16(enCommunicationServiceType.Email), Convert.ToInt16(EnTemplateType.TransactionSuccess), 0);
        //                foreach (TemplateMasterData Provider in Result)
        //                {
        //                    Provider.Content = Provider.Content.Replace("###USERNAME###".ToUpper(), User.UserName);
        //                    Provider.Content = Provider.Content.Replace("###TYPE###".ToUpper(), PairName);
        //                    Provider.Content = Provider.Content.Replace("###REQAMOUNT###".ToUpper(), Qty.ToString());  //Quantity
        //                    Provider.Content = Provider.Content.Replace("###STATUS###".ToUpper(), "Success");
        //                    Provider.Content = Provider.Content.Replace("###USER###".ToUpper(), User.UserName);
        //                    Provider.Content = Provider.Content.Replace("###CURRENCY###".ToUpper(), BaseMarket);
        //                    Provider.Content = Provider.Content.Replace("###DATETIME###".ToUpper(), TrnDate);
        //                    Provider.Content = Provider.Content.Replace("###AMOUNT###".ToUpper(), Price.ToString()); //Uday 02-01-2018 Email Price and Amount intechange  //Price
        //                    Provider.Content = Provider.Content.Replace("###FEES###".ToUpper(), Fees.ToString()); 
        //                    Provider.Content = Provider.Content.Replace("###FINAL###".ToUpper(), ((Price * Qty) + Fees).ToString()); //Uday 01-01-2019 In Final Price Calculation Change
        //                    Provider.Content = Provider.Content.Replace("###ORDERTYPE###".ToUpper(), ((enTransactionMarketType)OrderType).ToString());  //Uday 01-01-2019 Add OrderType In Email
        //                    Provider.Content = Provider.Content.Replace("###TRNTYPE###".ToUpper(), ((enTrnType)TrnType).ToString());   //Uday 01-01-2019 Add TranType In Email
        //                    Provider.Content = Provider.Content.Replace("###TRNNO###".ToUpper(), TrnNo.ToString()); //Uday 01-01-2019 Add TrnNo In Email

        //                    Request.Body = Provider.Content;
        //                    Request.Subject = Provider.AdditionalInfo;
        //                }
        //                Request.Recepient = User.Email;
        //                Request.EmailType = 0;
        //                //await _mediator.Send(Request);
        //                _pushNotificationsQueue.Enqueue(Request); //24-11-2018 komal make Email Enqueue
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("Settlement - EmailSendAsync Error ", ControllerName, ex);
        //    }
        //}
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

        public async Task EmailSendPartialSettledTransaction(long TrnNo, string UserId, string Pair, decimal Qty, string TrnDate, decimal RemainingQty, decimal SettleQty, decimal Amount, decimal Fee, short OrderType, short TrnType,short EmailType = 0)
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

                    //Uday 03-01-2019 Transaction Full Success email merge with this function

                    if (EmailType == 0)  // Partial Email
                    {
                        communicationParamater.Param1 = User.UserName;
                        communicationParamater.Param2 = Pair;
                        communicationParamater.Param3 = Helpers.DoRoundForTrading(Qty, 8).ToString();
                        communicationParamater.Param4 = Pair.Split("_")[1];
                        communicationParamater.Param5 = TrnDate;
                        communicationParamater.Param6 = Helpers.DoRoundForTrading(RemainingQty, 8).ToString();
                        communicationParamater.Param7 = Helpers.DoRoundForTrading(SettleQty, 8).ToString();
                        communicationParamater.Param8 = Helpers.DoRoundForTrading(Amount, 8).ToString();
                        communicationParamater.Param9 = Helpers.DoRoundForTrading(Fee, 8).ToString();
                        communicationParamater.Param10 = Helpers.DoRoundForTrading(((Amount * SettleQty) + Fee), 8).ToString();  //Uday 01-01-2019 In Final Price Calculation Change
                        communicationParamater.Param11 = ((enTransactionMarketType)OrderType).ToString();  //Uday 01-01-2019 Add OrderType In Email
                        communicationParamater.Param12 = ((enTrnType)TrnType).ToString();  //Uday 01-01-2019 Add TranType In Email
                        communicationParamater.Param13 = TrnNo.ToString(); //Uday 01-01-2019 Add TrnNo In Email

                        if (OrderType == 2) //Uday 04-01-2019 if ordertype is market than not give price and total
                        {
                            EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.Email_MArket_TransactionPartialSuccess, communicationParamater, enCommunicationServiceType.Email).Result;
                        }
                        else
                        {
                            EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.EMAIL_TransactionPartialSuccess, communicationParamater, enCommunicationServiceType.Email).Result;
                        }
                     }
                    else if (EmailType == 1)  // Full Success Email
                    {
                        communicationParamater.Param1 = User.UserName;
                        communicationParamater.Param2 = Pair;
                        communicationParamater.Param3 = Helpers.DoRoundForTrading(Qty, 8).ToString();
                        communicationParamater.Param4 = Pair.Split("_")[1];
                        communicationParamater.Param5 = TrnDate;
                        communicationParamater.Param6 = "Success";
                        communicationParamater.Param8 = Helpers.DoRoundForTrading(Amount, 8).ToString();
                        communicationParamater.Param9 = Helpers.DoRoundForTrading(Fee, 8).ToString();
                        communicationParamater.Param10 = Helpers.DoRoundForTrading(((Amount * Qty) + Fee), 8).ToString();
                        communicationParamater.Param11 = ((enTransactionMarketType)OrderType).ToString();
                        communicationParamater.Param12 = ((enTrnType)TrnType).ToString();
                        communicationParamater.Param13 = TrnNo.ToString();

                        if (OrderType == 2) //Uday 04-01-2019 if ordertype is market than not give price and total
                        {
                            EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.Email_Market_TransactionSuccess, communicationParamater, enCommunicationServiceType.Email).Result;
                        }
                        else
                        {
                            EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.TransactionSuccess, communicationParamater, enCommunicationServiceType.Email).Result;
                        }
                    }
                    else if (EmailType == 2)  //Rita 25-1-19 Cancel Order for STOP Order
                    {
                        communicationParamater.Param8 = User.UserName + "";
                        communicationParamater.Param1 = Pair + "";
                        communicationParamater.Param2 = Helpers.DoRoundForTrading(Qty, 8).ToString();
                        communicationParamater.Param3 = Pair.Split("_")[1];
                        communicationParamater.Param4 = TrnDate;
                        communicationParamater.Param5 = Helpers.DoRoundForTrading(Amount, 8).ToString();
                        communicationParamater.Param6 = Helpers.DoRoundForTrading(Fee, 8).ToString();
                        communicationParamater.Param7 = Helpers.DoRoundForTrading((Fee + (Amount * Qty)), 8).ToString();
                        communicationParamater.Param11 = ((enTransactionMarketType)OrderType).ToString();
                        communicationParamater.Param12 = ((enTrnType)TrnType).ToString();
                        communicationParamater.Param13 = TrnNo.ToString();

                        short CancelType = 1;//here used only for Fully cancelled
                        if (CancelType == 1) // Cancel Success
                        {
                            EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.EMAIL_OrderCancel, communicationParamater, enCommunicationServiceType.Email).Result;
                        }
                        //else if (CancelType == 2) // Cancel Partially
                        //{
                        //    communicationParamater.Param9 = Helpers.DoRoundForTrading(SettledQty, 8).ToString();
                        //    communicationParamater.Param10 = Helpers.DoRoundForTrading(CancelQty, 8).ToString();
                        //    communicationParamater.Param7 = Helpers.DoRoundForTrading((fee + (price * SettledQty)), 8).ToString();     //Uday 01-01-2019 In Final Price Calculation Change

                        //    EmailData = _messageService.SendMessageAsync(EnTemplateType.EMAIL_PartialOrderCancel, communicationParamater, enCommunicationServiceType.Email).Result;
                        //}
                        //else if (CancelType == 3) // Cancel Failed
                        //{
                        //    communicationParamater.Param7 = Helpers.DoRoundForTrading(0, 8).ToString();
                        //    EmailData = _messageService.SendMessageAsync(EnTemplateType.EMAIL_OrderCancelFailed, communicationParamater, enCommunicationServiceType.Email).Result;
                        //}
                    }

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
    public class ProccessBuyWith
    {
        public TradeSellerListV1 SellerList { get; set; }
        public TradeStopLoss MakeTradeStopLossObj { get; set; }
        public TradeTransactionQueue TradeTQMakerObj { get; set; }
        public TransactionQueue TQMakerObj { get; set; }
        public decimal SettlementQty { get; set; }
        public decimal SettlementPrice { get; set; }
        public decimal BaseCurrQty { get; set; }
    }
    public class ProccessSellWith
    {
        public TradeBuyerListV1 BuyerList { get; set; }
        public TradeStopLoss MakeTradeStopLossObj { get; set; }
        public TradeTransactionQueue TradeTQMakerObj { get; set; }
        public TransactionQueue TQMakerObj { get; set; }
        public decimal SettlementQty { get; set; }
        public decimal SettlementPrice { get; set; }
        public decimal BaseCurrQty { get; set; }
    }
}
