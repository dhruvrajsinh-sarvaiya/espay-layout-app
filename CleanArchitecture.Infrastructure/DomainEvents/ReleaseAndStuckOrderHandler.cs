using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.DomainEvents
{
    //khushali 03-04-2019 for release txn and stuck order cron
    public class ReleaseOrderHandler : IRequestHandler<ReleaseOrdercls>
    {
        private readonly EFCommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ITransactionQueue<NewCancelOrderRequestCls> _TransactionQueueCancelOrder;
        private readonly EFCommonRepository<TradeBuyerListV1> _TradeBuyerList;
        private readonly EFCommonRepository<TradeSellerListV1> _TradeSellerList;
        private readonly EFCommonRepository<SettledTradeTransactionQueue> _settledTradeTransactionRepository;
        private readonly ISettlementRepositoryV1<BizResponse> _settlementRepositoryV1;
        private readonly ICommonRepository<TradePoolQueueV1> _tradePoolQueueV1;
        private readonly IWalletService _WalletService;
        private readonly ITradeReconProcessV1 _tradeReconProcessV1; // khushali for Trade Recon
        private readonly EFCommonRepository<CronMaster> _cronMaster;

        public ReleaseOrderHandler(EFCommonRepository<TradeTransactionQueue> TradeTransactionRepository,
            ITransactionQueue<NewCancelOrderRequestCls> TransactionQueueCancelOrder, EFCommonRepository<TradeBuyerListV1> TradeBuyerList, EFCommonRepository<TradeSellerListV1> TradeSellerList, EFCommonRepository<SettledTradeTransactionQueue> SettledTradeTransactionRepository,
            ISettlementRepositoryV1<BizResponse> SettlementRepositoryV1, ICommonRepository<TradePoolQueueV1> TradePoolQueueV1, 
            IWalletService WalletService, ITradeReconProcessV1 TradeReconProcessV1, EFCommonRepository<CronMaster> CronMaster)
        {
            _TradeTransactionRepository = TradeTransactionRepository;
            _TransactionQueueCancelOrder = TransactionQueueCancelOrder;
            _TradeBuyerList = TradeBuyerList;
            _TradeSellerList = TradeSellerList;
            _settledTradeTransactionRepository = SettledTradeTransactionRepository;
            _settlementRepositoryV1 = SettlementRepositoryV1;
            _tradePoolQueueV1 = TradePoolQueueV1;
            _WalletService = WalletService;
            _tradeReconProcessV1 = TradeReconProcessV1;
            _cronMaster = CronMaster;
        }
        public async Task<Unit> Handle(ReleaseOrdercls request, CancellationToken cancellationToken)
        {
            CronMaster cronMaster = new CronMaster();
            try
            {
                cronMaster =  _cronMaster.FindBy(e => e.Id == (short)enCronMaster.ReleaseOrderHandler).FirstOrDefault();
                if(cronMaster != null  && cronMaster.Status == 1)
                {
                    var Data = _TradeTransactionRepository.FindBy(e => (e.Status == (short)enTransactionStatus.Hold || CheckTrnInBuyerSellerListExist(e.TrnNo, e.Status, e.TrnType)) && (e.CreatedDate <= request.DateTime && e.CreatedDate >= request.DateTime.AddDays(-7)));
                    foreach (var TrnObj in Data)
                    {                        
                        BizResponseClass _Resp = new BizResponseClass();
                        if (!CheckTrnInBuyerSellerListExist(TrnObj.TrnNo, TrnObj.Status, TrnObj.TrnType))
                        {

                            //// Reverse order  operation -  call sp  'Sp_TradeSettlement'
                            if (_tradeReconProcessV1.CheckBuyerSellerListIsProcessing(TrnObj) == 1)
                            {
                                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseStuckOrderHandler", "-- Handle CRON", "StuckOrderHandler start " + "##TrnNo:" + TrnObj.TrnNo, Helpers.UTC_To_IST()));
                                _tradeReconProcessV1.ProcessReleaseStuckOrderOrderAsync(_Resp, TrnObj, 1); // By Admin
                                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm(" ReleaseStuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo + "##Response : " + JsonConvert.SerializeObject(_Resp), Helpers.UTC_To_IST()));

                                #region "old realse order call"
                                //var TradePoolData = _tradePoolQueueV1.FindBy(e => e.TakerTrnNo == TrnObj.TrnNo && e.Status == 0);
                                //if (TradePoolData == null)
                                //{
                                //    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo + "###RESPONSE### Update entry SUCCESS", Helpers.UTC_To_IST()));
                                //    await UpdateBuyerSellerListEntry(TrnObj, true);  // update buyer seller list status
                                //}
                                //else
                                //{
                                //    foreach (var TradePoolResult in TradePoolData)
                                //    {
                                //        var BaseCurrQty = Helpers.DoRoundForTrading(TradePoolResult.TakerQty * TradePoolResult.TakerPrice, 18);
                                //        short ActionType = TrnObj.TrnType == (short)enTrnType.Buy_Trade ? (short)enSP_TradeSettlementActionType.Buy : (short)enSP_TradeSettlementActionType.Sell;
                                //        var CallSpResult = await _settlementRepositoryV1.Callsp_TradeSettlement(TrnObj.TrnNo, TradePoolResult.MakerTrnNo, TradePoolResult.TakerQty, BaseCurrQty, TradePoolResult.TakerPrice, ActionType, 2, UpdatedBy: 1);
                                //        enTransactionStatus WalletTransactionStatus = _WalletService.CheckTransactionSuccessOrNot(TradePoolResult.MakerTrnNo);
                                //        if (WalletTransactionStatus == enTransactionStatus.Success)
                                //        {
                                //            var MakeTradeTransaction = _TradeTransactionRepository.GetSingle(e => e.TrnNo == TradePoolResult.MakerTrnNo);
                                //            MakeTradeTransaction.Status = 1;
                                //            _TradeTransactionRepository.Update(MakeTradeTransaction);
                                //            await UpdateBuyerSellerListEntry(MakeTradeTransaction);
                                //        }
                                //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo + "###RESPONSE###" + CallSpResult.ToString(), Helpers.UTC_To_IST()));
                                //        if (CallSpResult)
                                //        {
                                //            await UpdateBuyerSellerListEntry(TrnObj, true);  // update buyer seller list status
                                //        }
                                //    }
                                //}
                                #endregion
                            }

                        }

                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseOrderHandler", "-- Handle CRON", "ReleaseOrderHandler start " + "##TrnNo:" + TrnObj.TrnNo, Helpers.UTC_To_IST()));
                        
                        _TransactionQueueCancelOrder.Enqueue(new NewCancelOrderRequestCls()
                        {
                            MemberID = TrnObj.MemberID,
                            TranNo = TrnObj.TrnNo,
                            accessToken = "",
                            CancelAll = 0,
                            OrderType = (enTransactionMarketType)TrnObj.ordertype,
                            IsMargin = 0
                        });
                        await Task.Delay(500);
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseOrderHandler", "-- Handle CRON", "ReleaseOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo, Helpers.UTC_To_IST()));
                    }
                }                
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        public bool CheckTrnInBuyerSellerListExist(long TrnNo, short Status, short TrnType)
        {
            bool IsProcessing = false;
            string StatusList = "3,0,9";
            try
            {
                if (TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                {
                    return _TradeBuyerList.FindBy(e => e.TrnNo == TrnNo).Count() <= 0 && Array.IndexOf(StatusList.Split(",").ToArray(), Status) > -1;
                }
                else if (TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                {
                    return _TradeSellerList.FindBy(e => e.TrnNo == TrnNo).Count() <= 0 && Array.IndexOf(StatusList.Split(",").ToArray(), Status) > -1;

                }
                return IsProcessing;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTrnInBuyerSellerListExist:##TrnNo " + TrnNo, "ReleaseOrderHandler", ex);
                return false;
            }
        }

        //public async Task UpdateBuyerSellerListEntry(TradeTransactionQueue TradeTransactionQueueObj, bool IsProcessing = false)
        //{
        //    TradeSellerListV1 SellerList;
        //    TradeBuyerListV1 BuyerList;
        //    try
        //    {
        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry Start " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //        {
        //            BuyerList = _TradeBuyerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (BuyerList != null)
        //            {

        //                BuyerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    BuyerList.IsProcessing = 0;
        //                }
        //                _TradeBuyerList.Update(BuyerList);
        //            }
        //        }
        //        else if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
        //        {
        //            SellerList = _TradeSellerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (SellerList != null)
        //            {
        //                SellerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    SellerList.IsProcessing = 0;
        //                }
        //                _TradeSellerList.Update(SellerList);
        //            }
        //        }

        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry end " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        await Task.CompletedTask;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("UpdateBuyerSellerListEntry:##TrnNo " + TradeTransactionQueueObj.TrnNo, "StuckOrderHandler", ex);
        //        throw ex;
        //    }
        //}

        //public short CheckBuyerSellerListIsProcessing(TradeTransactionQueue TradeTransactionQueueObj)
        //{
        //    short IsProcessing = 0;
        //    TradeSellerListV1 SellerList;
        //    TradeBuyerListV1 BuyerList;
        //    try
        //    {
        //        //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CheckBuyerSellerListIsProcessing", "Handler", "check BuyerSellerList Entry Start " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //        {
        //            BuyerList = _TradeBuyerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            IsProcessing = BuyerList.IsProcessing;
        //        }
        //        else if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
        //        {
        //            SellerList = _TradeSellerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            IsProcessing = SellerList.IsProcessing;
        //        }

        //        //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CheckBuyerSellerListIsProcessing", "Handler", "check BuyerSellerList Entry end " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        return IsProcessing;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("CheckBuyerSellerListIsProcessing:##TrnNo " + TradeTransactionQueueObj.TrnNo, "ReleaseOrderHandler", ex);
        //        throw ex;
        //    }
        //}
    }

    public class StuckOrderHandler : IRequestHandler<StuckOrdercls>
    {
        private readonly EFCommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly EFCommonRepository<TradeBuyerListV1> _TradeBuyerList;
        private readonly EFCommonRepository<TradeSellerListV1> _TradeSellerList;
        private readonly FrontTrnRepository _frontTrnRepository;
        private readonly EFCommonRepository<SettledTradeTransactionQueue> _settledTradeTransactionRepository;
        private readonly ISettlementRepositoryV1<BizResponse> _settlementRepositoryV1;
        private readonly ICommonRepository<TradePoolQueueV1> _tradePoolQueueV1;
        private readonly IWalletService _WalletService;
        private readonly ITradeReconProcessV1 _tradeReconProcessV1; // khushali for Trade Recon
        private readonly EFCommonRepository<CronMaster> _cronMaster;

        public StuckOrderHandler(EFCommonRepository<TradeTransactionQueue> TradeTransactionRepository,
            EFCommonRepository<TradeBuyerListV1> TradeBuyerList, EFCommonRepository<TradeSellerListV1> TradeSellerList, 
            FrontTrnRepository FrontTrnRepository, EFCommonRepository<SettledTradeTransactionQueue> SettledTradeTransactionRepository,
            ISettlementRepositoryV1<BizResponse> SettlementRepositoryV1, ICommonRepository<TradePoolQueueV1> TradePoolQueueV1,
            IWalletService WalletService, ITradeReconProcessV1 TradeReconProcessV1, EFCommonRepository<CronMaster> CronMaster)
        {
            _TradeTransactionRepository = TradeTransactionRepository;
            _TradeBuyerList = TradeBuyerList;
            _TradeSellerList = TradeSellerList;
            _frontTrnRepository = FrontTrnRepository;
            _settledTradeTransactionRepository = SettledTradeTransactionRepository;
            _settlementRepositoryV1 = SettlementRepositoryV1;
            _tradePoolQueueV1 = TradePoolQueueV1;
            _WalletService = WalletService;
            _tradeReconProcessV1 = TradeReconProcessV1;
            _cronMaster = CronMaster;
        }

        public async Task<Unit> Handle(StuckOrdercls request, CancellationToken cancellationToken)
        {
            CronMaster cronMaster = new CronMaster();
            try
            {
                cronMaster = _cronMaster.FindBy(e => e.Id == (short)enCronMaster.StuckOrderHandler).FirstOrDefault();
                if (cronMaster != null && cronMaster.Status == 1)
                {
                    var Data = _frontTrnRepository.ReleaseAndStuckOrder(request.DateTime);
                    foreach (var TrnOrder in Data)
                    {
                        BizResponseClass _Resp = new BizResponseClass();
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler start " + "##TrnNo:" + TrnOrder.TrnNo, Helpers.UTC_To_IST()));
                        TradeTransactionQueue TrnObj = _TradeTransactionRepository.FindBy(e => e.TrnNo == TrnOrder.TrnNo).FirstOrDefault();
                        _tradeReconProcessV1.ProcessReleaseStuckOrderOrderAsync(_Resp, TrnObj, 1); // By Admin
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnOrder.TrnNo + "##Response : " + JsonConvert.SerializeObject(_Resp), Helpers.UTC_To_IST()));
                        await Task.Delay(500);
                        #region old Stuck order call
                        //var TradePoolData = _tradePoolQueueV1.FindBy(e => e.TakerTrnNo == TrnObj.TrnNo && e.Status == 0);
                        //if (TradePoolData == null)
                        //{
                        //    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo + "###RESPONSE### Update entry SUCCESS", Helpers.UTC_To_IST()));
                        //    await UpdateBuyerSellerListEntry(TrnObj, true);  // update buyer seller list status
                        //}
                        //else
                        //{
                        //    foreach (var TradePoolResult in TradePoolData)
                        //    {
                        //        var BaseCurrQty = Helpers.DoRoundForTrading(TradePoolResult.TakerQty * TradePoolResult.TakerPrice, 18);
                        //        short ActionType = TrnObj.TrnType == (short)enTrnType.Buy_Trade ? (short)enSP_TradeSettlementActionType.Buy : (short)enSP_TradeSettlementActionType.Sell;
                        //        var CallSpResult = await _settlementRepositoryV1.Callsp_TradeSettlement(TrnObj.TrnNo, TradePoolResult.MakerTrnNo, TradePoolResult.TakerQty, BaseCurrQty, TradePoolResult.TakerPrice, ActionType, 2, UpdatedBy: 1);
                        //        //enTransactionStatus WalletTransactionStatus = _WalletService.CheckTransactionSuccessOrNot(TradePoolResult.MakerTrnNo);
                        //        enTransactionStatus WalletTransactionStatus= enTransactionStatus.Success;
                        //        if (WalletTransactionStatus == enTransactionStatus.Success)
                        //        {
                        //            var MakeTradeTransaction = _TradeTransactionRepository.GetSingle(e => e.TrnNo == TradePoolResult.MakerTrnNo);
                        //            MakeTradeTransaction.Status = 1;
                        //            _TradeTransactionRepository.Update(MakeTradeTransaction);
                        //            await UpdateBuyerSellerListEntry(MakeTradeTransaction);
                        //        }
                        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("StuckOrderHandler", "-- Handle CRON", "StuckOrderHandler End " + "##TrnNo:" + TrnObj.TrnNo + "###RESPONSE###" + CallSpResult.ToString(), Helpers.UTC_To_IST()));
                        //        if (CallSpResult)
                        //        {
                        //            await UpdateBuyerSellerListEntry(TrnObj, true);  // update buyer seller list status
                        //        }
                        //    }
                        //}
                        #endregion

                    }
                }
                return await Task.FromResult(new Unit());
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        //public async Task UpdateBuyerSellerListEntry(TradeTransactionQueue TradeTransactionQueueObj, bool IsProcessing = false)
        //{
        //    TradeSellerListV1 SellerList;
        //    TradeBuyerListV1 BuyerList;
        //    try
        //    {
        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry Start " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //        {
        //            BuyerList = _TradeBuyerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (BuyerList != null)
        //            {

        //                BuyerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    BuyerList.IsProcessing = 0;
        //                }
        //                _TradeBuyerList.Update(BuyerList);
        //            }
        //        }
        //        else if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
        //        {
        //            SellerList = _TradeSellerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (SellerList != null)
        //            {
        //                SellerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    SellerList.IsProcessing = 0;
        //                }
        //                _TradeSellerList.Update(SellerList);
        //            }
        //        }

        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry end " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        await Task.CompletedTask;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("UpdateBuyerSellerListEntry:##TrnNo " + TradeTransactionQueueObj.TrnNo, "StuckOrderHandler", ex);
        //        throw ex;
        //    }
        //}
    }

    //khushali 03-04-2019 for margin trading release txn and stuck order cron
    public class MarginStuckOrderHandler : IRequestHandler<MarginStuckOrdercls>
    {
        private readonly EFCommonRepository<TradeTransactionQueueMargin> _TradeTransactionRepository;
        private readonly EFCommonRepository<TradeBuyerListMarginV1> _TradeBuyerList;
        private readonly EFCommonRepository<TradeSellerListMarginV1> _TradeSellerList;
        private readonly FrontTrnRepository _frontTrnRepository;
        private readonly EFCommonRepository<SettledTradeTransactionQueueMargin> _settledTradeTransactionRepository;
        private readonly ISettlementRepositoryMarginV1<BizResponse> _settlementRepositoryV1;
        private readonly ICommonRepository<TradePoolQueueMarginV1> _tradePoolQueueV1;
        private readonly IWalletService _WalletService;
        private readonly ITradeReconProcessMarginV1 _tradeReconProcessV1; // khushali for Trade Recon
        private readonly EFCommonRepository<CronMaster> _cronMaster;

        public MarginStuckOrderHandler(EFCommonRepository<TradeTransactionQueueMargin> TradeTransactionRepository,
            EFCommonRepository<TradeBuyerListMarginV1> TradeBuyerList, EFCommonRepository<TradeSellerListMarginV1> TradeSellerList,
            FrontTrnRepository FrontTrnRepository, EFCommonRepository<SettledTradeTransactionQueueMargin> SettledTradeTransactionRepository,
            ISettlementRepositoryMarginV1<BizResponse> SettlementRepositoryV1, ICommonRepository<TradePoolQueueMarginV1> TradePoolQueueV1,
            IWalletService WalletService, ITradeReconProcessMarginV1 TradeReconProcessV1, EFCommonRepository<CronMaster> CronMaster)
        {
            _TradeTransactionRepository = TradeTransactionRepository;
            _TradeBuyerList = TradeBuyerList;
            _TradeSellerList = TradeSellerList;
            _frontTrnRepository = FrontTrnRepository;
            _settledTradeTransactionRepository = SettledTradeTransactionRepository;
            _settlementRepositoryV1 = SettlementRepositoryV1;
            _tradePoolQueueV1 = TradePoolQueueV1;
            _WalletService = WalletService;
            _tradeReconProcessV1 = TradeReconProcessV1;
            _cronMaster = CronMaster;
        }

        public async Task<Unit> Handle(MarginStuckOrdercls request, CancellationToken cancellationToken)
        {
            CronMaster cronMaster = new CronMaster();
            try
            {
                cronMaster = _cronMaster.FindBy(e => e.Id == (short)enCronMaster.MarginStuckOrderHandler).FirstOrDefault();
                if (cronMaster != null && cronMaster.Status == 1)
                {
                    var Data = _frontTrnRepository.MarginReleaseAndStuckOrder(request.DateTime);
                    foreach (var TrnOrder in Data)
                    {
                        BizResponseClass _Resp = new BizResponseClass();
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("MarginStuckOrderHandler", "-- Handle CRON", "MarginStuckOrderHandler start " + "##TrnNo:" + TrnOrder.TrnNo, Helpers.UTC_To_IST()));
                        TradeTransactionQueueMargin TrnObj = _TradeTransactionRepository.FindBy(e => e.TrnNo == TrnOrder.TrnNo).FirstOrDefault();
                        _tradeReconProcessV1.ProcessReleaseStuckOrderOrderAsync(_Resp, TrnObj, 1); // By Admin
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("MarginStuckOrderHandler", "-- Handle CRON", "MarginStuckOrderHandler End " + "##TrnNo:" + TrnOrder.TrnNo + "##Response : " + JsonConvert.SerializeObject(_Resp), Helpers.UTC_To_IST()));
                        await Task.Delay(500);
                    }
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        //public async Task UpdateBuyerSellerListEntry(TradeTransactionQueue TradeTransactionQueueObj, bool IsProcessing = false)
        //{
        //    TradeSellerListV1 SellerList;
        //    TradeBuyerListV1 BuyerList;
        //    try
        //    {
        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry Start " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
        //        {
        //            BuyerList = _TradeBuyerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (BuyerList != null)
        //            {

        //                BuyerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    BuyerList.IsProcessing = 0;
        //                }
        //                _TradeBuyerList.Update(BuyerList);
        //            }
        //        }
        //        else if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
        //        {
        //            SellerList = _TradeSellerList.FindBy(e => e.TrnNo == TradeTransactionQueueObj.TrnNo).SingleOrDefault();
        //            if (SellerList != null)
        //            {
        //                SellerList.Status = TradeTransactionQueueObj.Status;
        //                if (IsProcessing)
        //                {
        //                    SellerList.IsProcessing = 0;
        //                }
        //                _TradeSellerList.Update(SellerList);
        //            }
        //        }

        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("UpdateBuyerSellerListEntry", "StuckOrderHandler", "Update BuyerSellerList Entry end " + "##TrnNo:" + TradeTransactionQueueObj.TrnNo, Helpers.UTC_To_IST()));

        //        await Task.CompletedTask;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("UpdateBuyerSellerListEntry:##TrnNo " + TradeTransactionQueueObj.TrnNo, "StuckOrderHandler", ex);
        //        throw ex;
        //    }
        //}
    }
}
