using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class SettlementRepository: ISettlementRepository<BizResponse>
    {
        private readonly CleanArchitectureContext _dbContext;
        //private readonly ILogger<SettlementRepository> _logger;
        private readonly ICommonRepository<TransactionQueue> _TransactionRepository;
        private readonly ICommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ICommonRepository<TradePoolQueue> _TradePoolQueue;
        private readonly ICommonRepository<TradeBuyRequest> _TradeBuyRequest;
        private readonly ICommonRepository<TradeBuyerList> _TradeBuyerList;
        private readonly ICommonRepository<TradeSellerList> _TradeSellerList;
        private readonly ICommonRepository<TradePoolMaster> _TradePoolMaster;
        private readonly ICommonRepository<PoolOrder> _PoolOrder;
        private readonly ICommonRepository<TradeStopLoss> _TradeStopLoss;
        private readonly ISignalRService _ISignalRService;
        private readonly IFrontTrnService _IFrontTrnService;
        //private readonly IMediator _mediator;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICommonRepository<TradeCancelQueue> _TradeCancelQueueRepository;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue; //24-11-2018 komal make Email Enqueue

        private readonly IWalletService _WalletService;

        string ControllerName = "SettlementRepository";
        TradePoolQueue TradePoolQueueObj;
        //TradeBuyerList TradeBuyerListObj;
        PoolOrder PoolOrderObj;
        //TransactionQueue TransactionQueueObj;
        //TradeTransactionQueue TradeTransactionQueueObj;
        //TradeStopLoss _TradeStopLossObj;
        TradeCancelQueue tradeCancelQueue;
        //TradeTransactionStatus TradeTransactionStatusObj;
        private readonly IMessageConfiguration _messageConfiguration;
        //string DebitAccountID;
       // string CreditAccountID;
        //long DebitWalletID;
        //long CreditWalletID;

        public SettlementRepository(CleanArchitectureContext dbContext, ICommonRepository<TradePoolQueue> TradePoolQueue,
            ICommonRepository<TradeBuyRequest> TradeBuyRequest, ICommonRepository<TradeBuyerList> TradeBuyerList,
            ICommonRepository<TradeSellerList> TradeSellerList, ICommonRepository<TradePoolMaster> TradePoolMaster,
            ICommonRepository<PoolOrder> PoolOrder, ICommonRepository<TransactionQueue> TransactionRepository,
            ICommonRepository<TradeTransactionQueue> TradeTransactionRepository, IWalletService WalletService, 
            ISignalRService ISignalRService, IFrontTrnService IFrontTrnService, ICommonRepository<TradeStopLoss> TradeStopLoss, 
            IMessageConfiguration messageConfiguration, UserManager<ApplicationUser> userManager,
            ICommonRepository<TradeCancelQueue> TradeCancelQueueRepository,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue)
        {
            _dbContext = dbContext;
            //_logger = logger;
            _TradePoolQueue = TradePoolQueue;
            _TradeBuyRequest = TradeBuyRequest;
            _TradeBuyerList = TradeBuyerList;
            _TradeSellerList = TradeSellerList;
            _TradePoolMaster = TradePoolMaster;
            _PoolOrder = PoolOrder;
            _TransactionRepository = TransactionRepository;
            _TradeTransactionRepository = TradeTransactionRepository;
            _WalletService = WalletService;
            _ISignalRService = ISignalRService;
            _IFrontTrnService = IFrontTrnService;
            _TradeStopLoss = TradeStopLoss;
            //_mediator = mediator;
            _messageConfiguration = messageConfiguration;
            _userManager = userManager;
            _TradeCancelQueueRepository = TradeCancelQueueRepository;
            _pushNotificationsQueue = pushNotificationsQueue;
        }

        #region ==============================PROCESS SETLLEMENT========================
        public async Task InsertTradePoolQueue(long MemberID,long MakerTrnNo, long PoolID, decimal MakerQty, decimal MakerPrice, long TakerTrnNo, decimal TakerQty, decimal TakerPrice, decimal TakerDisc, decimal TakerLoss,long SellerListID)
        {
            try
            {
                TradePoolQueueObj = new TradePoolQueue()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = MemberID,
                    MakerTrnNo = MakerTrnNo,
                    PoolID = PoolID,
                    SellerListID = SellerListID,
                    MakerQty = MakerQty,
                    MakerPrice = MakerPrice,
                    TakerTrnNo = TakerTrnNo,
                    TakerQty = TakerQty,
                    TakerPrice = TakerPrice,
                    TakerDisc = TakerDisc,
                    TakerLoss = TakerLoss,
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
        public async Task CreatePoolOrderForSettlement(long OMemberID, long DMemberID, long UserID, long PoolID, long TrnNo, decimal Amount,long CreditWalletID,string CreditAccountID)
        {
            try
            {
                PoolOrderObj = new PoolOrder()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = UserID,
                    UserID = UserID,
                    DMemberID = DMemberID, //Pool gives Amount to Member/User
                    OMemberID = OMemberID, //Member/User Take Amount from Pool
                    TrnNo = TrnNo,
                    TrnMode = 0,
                    PayMode = Convert.ToInt16(enWebAPIRouteType.TradeServiceLocal),
                    ORemarks = "Order Created",
                    OrderAmt = Amount,
                    DeliveryAmt = Amount,
                    DiscPer = 0,
                    DiscRs = 0,
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                    UserWalletID = CreditWalletID,
                    UserWalletAccID = CreditAccountID,
                };
                PoolOrderObj = _PoolOrder.Add(PoolOrderObj);
                //return PoolOrderObj;
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreatePoolOrder:##TrnNo " + TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }

        public async Task<BizResponse> PROCESSSETLLEMENT(BizResponse _Resp, TradeBuyRequest TradeBuyRequestObj, ParallelProcessTrns ParallelTrnsObj, string accessToken = "",short IsCancel=0)
        {           
            short TrackBit=0;
            List<long> HoldTrnNos = new List<long> { };
            ParallelTrnsObj.HoldTrnNos = HoldTrnNos;
            try
            {
                //TransactionQueueObj = _TransactionRepository.GetById(TradeBuyRequestObj.TrnNo);
                TradeTransactionQueue TradeTransactionQueueObj = _TradeTransactionRepository.GetSingle(item => item.TrnNo == TradeBuyRequestObj.TrnNo);
                //TradeBuyerListObj = _TradeBuyerList.GetSingle(item => item.TrnNo == TradeBuyRequestObj.TrnNo);
                // _TradeStopLossObj = _TradeStopLoss.GetSingle(item => item.TrnNo == TradeBuyRequestObj.TrnNo);

                //var TradeTransactionQueueObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == TradeBuyRequestObj.TrnNo);                             
                //var TradeBuyerListResult = _TradeBuyerList.GetSingleAsync(item => item.TrnNo == TradeBuyRequestObj.TrnNo);
                //var TradeStopLossResult = _TradeStopLoss.GetSingleAsync(item => item.TrnNo == TradeBuyRequestObj.TrnNo);

                //DebitWalletID = TradeTransactionQueueObj.OrderWalletID;               
                // DebitAccountID= TradeTransactionQueueObj.OrderAccountID;
                //CreditWalletID = TradeTransactionQueueObj.DeliveryWalletID;              
                //CreditAccountID = TradeTransactionQueueObj.DeliveryAccountID;

                //DebitAccountID=_WalletService.GetAccWalletID(DebitWalletID);
                //CreditAccountID = _WalletService.GetAccWalletID(CreditWalletID);                
                //TradeTransactionQueue TradeTransactionQueueObj=await TradeTransactionQueueObjResult;
                var TransactionQueueObjResult = _TransactionRepository.GetByIdAsync(TradeBuyRequestObj.TrnNo);

                if (TradeTransactionQueueObj.IsCancelled == 1 || IsCancel==1)
                {
                    //Code for settlement
                   await CancellationProcess(_Resp, TradeBuyRequestObj,await TransactionQueueObjResult, TradeTransactionQueueObj);
                    //return Task.FromResult(_Resp);
                    return _Resp;
                }
                if (TradeBuyRequestObj.PendingQty == 0)
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_AlreadySettled;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "ALready Settled";
                    return _Resp;
                }

                var TradeBuyerListResult = _TradeBuyerList.GetSingleAsync(item => item.TrnNo == TradeBuyRequestObj.TrnNo);
                TradeBuyRequestObj.MakeTransactionHold();
                TradeBuyRequestObj.UpdatedDate = Helpers.UTC_To_IST();
                TradeBuyRequestObj.IsProcessing = 1;
                _TradeBuyRequest.UpdateAsync(TradeBuyRequestObj);

                TradeBuyerList TradeBuyerListObj=await TradeBuyerListResult;
                TradeBuyerListObj.MakeTransactionHold();
                TradeBuyerListObj.UpdatedDate = Helpers.UTC_To_IST();
                TradeBuyerListObj.IsProcessing = 1;
                _TradeBuyerList.UpdateAsync(TradeBuyerListObj);

                //Task EmailResult;
                var TradeStopLossResult = _TradeStopLoss.GetSingleAsync(item => item.TrnNo == TradeBuyRequestObj.TrnNo);
                IEnumerable<TradeSellerList> MatchSellerListBase;
                //SortedList<TradeSellerList, TradeSellerList>
                //if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))//Take price as Highest and find lower
                //{
                //   MatchSellerListBase = _TradeSellerList.FindBy(item => item.Price <= TradeBuyRequestObj.BidPrice && item.IsProcessing == 0
                //                                       && item.BuyServiceID == TradeBuyRequestObj.PaidServiceID &&
                //                                       item.SellServiceID == TradeBuyRequestObj.ServiceID
                //                                       && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                //                                       && item.RemainQty > 0);//Pending after partial Qty remain
                //}
                //else //Take price as Highest and find larger
                //{
                //    MatchSellerListBase = _TradeSellerList.FindBy(item => item.Price >= TradeBuyRequestObj.BidPrice && item.IsProcessing == 0
                //                                       && item.BuyServiceID == TradeBuyRequestObj.PaidServiceID &&
                //                                       item.SellServiceID == TradeBuyRequestObj.ServiceID
                //                                       && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                //                                       && item.RemainQty > 0);//Pending after partial Qty remain
                //}


                //MatchSellerListBase = _TradeSellerList.FindBy(item => item.Price >= TradeBuyRequestObj.BidPrice && item.IsProcessing == 0
                //                                     && item.BuyServiceID == TradeBuyRequestObj.PaidServiceID &&
                //                                     item.SellServiceID == TradeBuyRequestObj.ServiceID
                //                                     && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                //                                     && item.RemainQty > 0);//Pending after partial Qty remain

              var MatchSellerListBaseAll =await _TradeSellerList.GetAllAsync();//Pending after partial Qty remain

                MatchSellerListBase = MatchSellerListBaseAll.Where(item => item.Price >= TradeBuyRequestObj.BidPrice && item.IsProcessing == 0
                                                     && item.BuyServiceID == TradeBuyRequestObj.PaidServiceID &&
                                                     item.SellServiceID == TradeBuyRequestObj.ServiceID
                                                     && (item.Status == Convert.ToInt16(enTransactionStatus.Initialize) || item.Status == Convert.ToInt16(enTransactionStatus.Hold))
                                                     && item.RemainQty > 0).OrderByDescending(x => x.Price).OrderBy(x => x.TrnNo);

               //var MatchSellerList = MatchSellerListBase.OrderBy(x => x.Price).OrderBy(x => x.TrnNo);
               //var MatchSellerList = MatchSellerListBase.OrderByDescending(x => x.Price).OrderBy(x => x.TrnNo);

                foreach (TradeSellerList SellerList in MatchSellerListBase)//MatchSellerList
                {

                    if (SellerList.IsProcessing == 1)
                        continue;

                    TransactionQueue TransactionQueueObj=await TransactionQueueObjResult;
                    TrackBit = 1;
                    decimal SettlementQty = 0;
                    List<CreditWalletDrArryTrnID> CreditWalletDrArryTrnIDList = new List<CreditWalletDrArryTrnID>();
                    SellerList.IsProcessing = 1;
                    _TradeSellerList.Update(SellerList);
                    
                    var PoolMstResult = _TradePoolMaster.GetByIdAsync(SellerList.PoolID);                    
                    var TradeTQMakerObjResult = _TradeTransactionRepository.GetSingleAsync(item => item.TrnNo == SellerList.TrnNo);

                    //====================================Partial SETTLEMENT TO MEMBER
                    if (SellerList.RemainQty < TradeBuyRequestObj.PendingQty)
                    {
                        SettlementQty = SellerList.RemainQty;//Take all Seller's Qty
                        //Topup Order create
                        CreatePoolOrderForSettlement(TradeBuyRequestObj.UserID, SellerList.PoolID, TradeBuyRequestObj.UserID, SellerList.PoolID, TradeBuyRequestObj.TrnNo, SettlementQty, TradeTransactionQueueObj.DeliveryWalletID, TradeTransactionQueueObj.DeliveryAccountID);

                        TradeBuyRequestObj.PendingQty = TradeBuyRequestObj.PendingQty - SettlementQty;
                        TradeBuyRequestObj.DeliveredQty = TradeBuyRequestObj.DeliveredQty + SettlementQty;
                        TradeBuyerListObj.DeliveredQty = TradeBuyerListObj.DeliveredQty + SettlementQty;
                        //Here Bid Price of pool always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        if (SellerList.Price > TradeBuyRequestObj.BidPrice)//<  19-11-18 price always high then current order as buyer list view
                        {
                            //TakeDisc = (TradeBuyRequestObj.BidPrice - SellerList.Price) * SettlementQty;
                            TakeDisc = (SellerList.Price-TradeBuyRequestObj.BidPrice) * SettlementQty;
                        }
                        InsertTradePoolQueue(TradeBuyRequestObj.UserID,SellerList.TrnNo, SellerList.PoolID, SellerList.RemainQty, SellerList.Price, TradeBuyRequestObj.TrnNo, SettlementQty, TradeBuyRequestObj.BidPrice, TakeDisc, 0, SellerList.Id);

                        SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//this will give result 0
                        SellerList.MakeTransactionSuccess();
                       var PoolMst = await PoolMstResult;
                        PoolMst.TotalQty = PoolMst.TotalQty - SettlementQty;                        
                        PoolOrderObj.MakeTransactionSuccess();
                        PoolOrderObj.DRemarks = "Delivery Success with " + SellerList.Price;
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        //decimal SellRelQty = Helpers.DoRoundForTrading(SettlementQty * TradeBuyRequestObj.PaidQty / TradeBuyRequestObj.Qty, 8);

                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_PartialSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Partial Settlement Done");
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + SettlementQty;
                        //TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + SellRelQty;
                        var TradeTQMakerObj = await TradeTQMakerObjResult;
                        TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;

                        CreditWalletDrArryTrnIDList.Add(new CreditWalletDrArryTrnID { DrTrnRefNo = SellerList.TrnNo, Amount = SettlementQty });

                        _dbContext.Database.BeginTransaction();
                      
                        _dbContext.Entry(PoolOrderObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeBuyRequestObj).State = EntityState.Modified;
                        _dbContext.Entry(SellerList).State = EntityState.Modified;
                        _dbContext.Entry(PoolMst).State = EntityState.Modified;
                        _dbContext.Entry(TradeBuyerListObj).State = EntityState.Modified;
                        _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
                        _dbContext.Set<TradePoolQueue>().Add(TradePoolQueueObj);
                        //enWalletTrnType.Cr_Trade Rita 16-1-19 changes enums as wallet team change enums
                        var CreditWalletResult =_WalletService.GetWalletCreditNew(TradeTransactionQueueObj.Delivery_Currency, Helpers.GetTimeStamp(), 
                                                        enWalletTrnType.BuyTrade, SettlementQty, TradeBuyRequestObj.UserID,
                                                        TradeTransactionQueueObj.DeliveryAccountID, CreditWalletDrArryTrnIDList.ToArray(), TradeBuyRequestObj.TrnNo, 0, 
                                                        enWalletTranxOrderType.Credit, enServiceType.Trading, (enTrnType)TransactionQueueObj.TrnType);
                        if(CreditWalletResult.ReturnCode!=enResponseCode.Success)
                        {
                            HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT RollbackTransaction", ControllerName, "Balance credit fail" + CreditWalletResult.ReturnMsg + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                            _dbContext.Database.RollbackTransaction();

                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement RollBack TrnNo " + TradeBuyRequestObj.TrnNo + " With: TrnNo " + SellerList.TrnNo + "  Reason: " + CreditWalletResult.ReturnMsg;
                        }
                        else
                        {
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();

                            HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT", ControllerName, "Partial Settlement Done with " + SellerList.TrnNo + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                            _Resp.ErrorCode = enErrorCode.Settlement_PartialSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Partial Settlement Done of TrnNo " + TradeBuyRequestObj.TrnNo + " Settled: " + TradeBuyRequestObj.DeliveredQty + " Remain:" + TradeBuyRequestObj.PendingQty;
                            //Continuew as record Partially settled
                            try
                            {
                                TradeStopLoss _TradeStopLossObj= await TradeStopLossResult;
                                _ISignalRService.OnStatusPartialSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, _TradeStopLossObj.ordertype);//komal                                                                                                                                                                                                                //(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, short IsPartial=0)                                
                            }
                            catch (Exception ex)
                            {
                                HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Partial Settlement Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                            }
                        }
                        ParallelTrnsObj.HoldTrnNos.Add(SellerList.TrnNo);
                        
                    }
                    //====================================FULL SETTLEMENT TO MEMBER
                    else if (SellerList.RemainQty >= TradeBuyRequestObj.PendingQty && TradeBuyRequestObj.PendingQty!=0)
                    {
                        SettlementQty = TradeBuyRequestObj.PendingQty;
                        //Topup Order create
                        CreatePoolOrderForSettlement(TradeBuyRequestObj.UserID, SellerList.PoolID, TradeBuyRequestObj.UserID, SellerList.PoolID, TradeBuyRequestObj.TrnNo, SettlementQty, TradeTransactionQueueObj.DeliveryWalletID, TradeTransactionQueueObj.DeliveryAccountID);
                                              

                        //Here Bid Price of pool always low then user given in Order , base on above Query
                        decimal TakeDisc = 0;
                        if (SellerList.Price > TradeBuyRequestObj.BidPrice)//<
                        {
                            //TakeDisc = (TradeBuyRequestObj.BidPrice - SellerList.Price) * SettlementQty;
                            TakeDisc = (SellerList.Price - TradeBuyRequestObj.BidPrice) * SettlementQty;
                        }
                        InsertTradePoolQueue(TradeBuyRequestObj.UserID,SellerList.TrnNo, SellerList.PoolID, SellerList.RemainQty, SellerList.Price, TradeBuyRequestObj.TrnNo, SettlementQty, TradeBuyRequestObj.BidPrice, TakeDisc, 0, SellerList.Id);


                        SellerList.RemainQty = SellerList.RemainQty - SettlementQty;//Update first as updated value in below line
                        if (SellerList.RemainQty == 0)
                            SellerList.MakeTransactionSuccess();
                        else
                            SellerList.MakeTransactionHold();

                        var PoolMst = await PoolMstResult;
                        PoolMst.TotalQty = PoolMst.TotalQty - SettlementQty;

                        TradeBuyRequestObj.DeliveredQty = TradeBuyRequestObj.DeliveredQty + SettlementQty;//Fully settled Here
                        TradeBuyRequestObj.PendingQty = TradeBuyRequestObj.PendingQty - SettlementQty;//this will 0
                        
                        TradeBuyRequestObj.MakeTransactionSuccess();
                        TradeBuyerListObj.MakeTransactionSuccess();                        
                        TransactionQueueObj.MakeTransactionSuccess();
                        //MakeTransactionSettledEntry();
                        TransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");

                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionCode(Convert.ToInt64(enErrorCode.Settlement_FullSettlementDone));
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Settlement Done");
                        //decimal SellRelQty = Helpers.DoRoundForTrading(SettlementQty * TradeBuyRequestObj.PaidQty / TradeBuyRequestObj.Qty, 8);
                        TradeTransactionQueueObj.SettledBuyQty = TradeTransactionQueueObj.SettledBuyQty + SettlementQty;
                        //TradeTransactionQueueObj.SettledSellQty = TradeTransactionQueueObj.SettledSellQty + SellRelQty;
                        var TradeTQMakerObj = await TradeTQMakerObjResult;
                        TradeTQMakerObj.SettledSellQty = TradeTQMakerObj.SettledSellQty + SettlementQty;

                        TradeBuyerListObj.DeliveredQty = TradeBuyerListObj.DeliveredQty + SettlementQty;

                        PoolOrderObj.MakeTransactionSuccess();
                        PoolOrderObj.DRemarks = "Delivery Success with " + SellerList.Price;

                        CreditWalletDrArryTrnIDList.Add(new CreditWalletDrArryTrnID { DrTrnRefNo = SellerList.TrnNo, Amount = SettlementQty });

                        _dbContext.Database.BeginTransaction();
                      
                        _dbContext.Entry(PoolOrderObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeBuyRequestObj).State = EntityState.Modified;
                        _dbContext.Entry(SellerList).State = EntityState.Modified;
                        _dbContext.Entry(PoolMst).State = EntityState.Modified;
                        _dbContext.Entry(TradeBuyerListObj).State = EntityState.Modified;
                        _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                        _dbContext.Entry(TradeTQMakerObj).State = EntityState.Modified;
                        _dbContext.Set<TradePoolQueue>().Add(TradePoolQueueObj);
                        //enWalletTrnType.Cr_Trade Rita 16-1-19 changes enums as wallet team change enums
                        var CreditWalletResult = _WalletService.GetWalletCreditNew(TradeTransactionQueueObj.Delivery_Currency, Helpers.GetTimeStamp(),
                                                         enWalletTrnType.BuyTrade, SettlementQty, TradeBuyRequestObj.UserID,
                                                         TradeTransactionQueueObj.DeliveryAccountID, CreditWalletDrArryTrnIDList.ToArray(), TradeBuyRequestObj.TrnNo, 1,
                                                         enWalletTranxOrderType.Credit, enServiceType.Trading, (enTrnType)TransactionQueueObj.TrnType);
                        if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                        {
                            HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT RollbackTransaction", ControllerName, "Balance credit fail" + CreditWalletResult.ReturnMsg + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                            _dbContext.Database.RollbackTransaction();

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Rollback TrnNo:" + TradeBuyRequestObj.TrnNo + " With: TrnNo " + SellerList.TrnNo + "  Reason:" + CreditWalletResult.ReturnMsg;
                        }
                        else
                        {
                            _dbContext.SaveChanges();
                            _dbContext.Database.CommitTransaction();

                            HelperForLog.WriteLogIntoFile("PROCESSSETLLEMENT", ControllerName, "Full Settlement Done with " + SellerList.TrnNo + "##TrnNo:" + TradeBuyRequestObj.TrnNo);

                            _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementDone;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Full Settlement Done of TrnNo " + TradeBuyRequestObj.TrnNo + " Settled: " + TradeBuyRequestObj.DeliveredQty + " Remain:" + TradeBuyRequestObj.PendingQty;
                            try
                            {
                                TradeStopLoss _TradeStopLossObj = await TradeStopLossResult;
                                _ISignalRService.OnStatusSuccess(Convert.ToInt16(enTransactionStatus.Success), TransactionQueueObj, TradeTransactionQueueObj, accessToken, _TradeStopLossObj.ordertype);//komal
                                                                                                                                                                                                        //==============Volume update only after success
                                if (TradeTransactionQueueObj.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                                    _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.BidPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.BuyQty, TradeTransactionQueueObj.TrnDate);
                                else
                                    _IFrontTrnService.GetPairAdditionalVal(TradeTransactionQueueObj.PairID, TradeTransactionQueueObj.AskPrice, TradeTransactionQueueObj.TrnNo, TradeTransactionQueueObj.SellQty, TradeTransactionQueueObj.TrnDate);

                             await EmailSendAsync(TradeBuyRequestObj.UserID.ToString(), Convert.ToInt16(enTransactionStatus.Success), TradeTransactionQueueObj.PairName,
                                       TradeTransactionQueueObj.PairName.Split("_")[1], TradeTransactionQueueObj.TrnDate.ToString(),
                                       TradeTransactionQueueObj.DeliveryTotalQty, TradeTransactionQueueObj.OrderTotalQty, 0);
                            }
                            catch (Exception ex)
                            {
                                HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Full Settlement Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                            }
                        }


                        ParallelTrnsObj.HoldTrnNos.Add(SellerList.TrnNo);

                        _dbContext.Entry(SellerList).Reload();

                        SellerList.IsProcessing = 0;//Release Seller List                    
                        _TradeSellerList.Update(SellerList);
                        break;//record settled
                    }
                    //====================take always latest object from DB 
                    //==========as if txn not commit so dbnot change and object value changes , so take object value from DB
                    _dbContext.Entry(TradeBuyRequestObj).Reload();
                    _dbContext.Entry(TransactionQueueObj).Reload();
                    _dbContext.Entry(TradeTransactionQueueObj).Reload();
                    _dbContext.Entry(TradeBuyerListObj).Reload();                   
                    _dbContext.Entry(SellerList).Reload();

                    SellerList.IsProcessing = 0;//Release Seller List                    
                    _TradeSellerList.Update(SellerList);
                }
                _dbContext.Entry(TradeBuyRequestObj).Reload();
                TradeBuyRequestObj.IsProcessing = 0;//Release Buy Order             
                _TradeBuyRequest.Update(TradeBuyRequestObj);

                TradeBuyerListObj.IsProcessing = 0;
                _TradeBuyerList.Update(TradeBuyerListObj);              
                if (TrackBit==0)//No any record Process
                {
                    _Resp.ErrorCode = enErrorCode.Settlement_NoSettlementRecordFound;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "No Any Match Record Found";
                }            

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("PROCESSSETLLEMENT:##TrnNo " + TradeBuyRequestObj.TrnNo, ControllerName, ex);
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.Settlement_SettlementInternalError;
            }
            return _Resp;
        }
        public void MakeTransactionSettledEntry(TradeBuyRequest TradeBuyRequestObj,TradeTransactionQueue TradeTransactionQueueObj)
        {
            try
            {

            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("MakeTransactionSettledEntry:##TrnNo " + TradeBuyRequestObj.TrnNo, ControllerName, ex);
            }
        }
        #region Cancellation Process
        //public void CancellQueueEntry(TradeCancelQueue tradeCancelQueue, long TrnNo,long DeliverServiceID, decimal PendingBuyQty,decimal DeliverQty,short OrderType,decimal DeliverBidPrice,long UserID)
        //{
        //    try
        //    {
        //        tradeCancelQueue = new TradeCancelQueue()
        //        {
        //            TrnNo = TrnNo,
        //            DeliverServiceID = DeliverServiceID,
        //            TrnDate = Helpers.UTC_To_IST(),
        //            PendingBuyQty = PendingBuyQty,
        //            DeliverQty = DeliverQty,
        //            OrderType = OrderType,
        //            DeliverBidPrice = DeliverBidPrice,
        //            Status = 0,
        //            OrderID = 0,
        //            SettledDate = Helpers.UTC_To_IST(),
        //            StatusMsg = "Cancel Order",
        //            CreatedBy = UserID,
        //            CreatedDate = Helpers.UTC_To_IST()
        //        };              
        //    }
        //    catch(Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("CancellQueueEntry:##TrnNo " + TrnNo, ControllerName, ex);
        //    }
        //}

        //public void TradeTransactionStatusEntry(decimal DeliverQty)
        //{
        //    TradeTransactionStatus TradeTransactionStatusObj = new TradeTransactionStatus();
        //    TradeTransactionStatusObj.TrnNo = TradeTransactionQueueObj.TrnNo;
        //    TradeTransactionStatusObj.SettledQty = TradeTransactionStatusObj.TotalQty = TradeTransactionStatusObj.DeliveredQty = DeliverQty;
        //    TradeTransactionStatusObj.PendingQty = 0;
        //    //TradeTransactionStatusObj.SoldPrice;
        //    //TradeTransactionStatusObj.BidPrice


        //}
        public async Task<BizResponse> CancellationProcess(BizResponse _Resp, TradeBuyRequest TradeBuyRequestObj,TransactionQueue TransactionQueueObj,TradeTransactionQueue TradeTransactionQueueObj)
        {
            decimal DeliverQty = 0;
            short IsfullSettled = 0;
            try
            {
               //finding the return sell quantity of cancallation order depending on pendingqty of tradebuyquantity 
               //ALSO DIND THE SELL BID PRICE
               DeliverQty = Helpers.DoRoundForTrading(TransactionQueueObj.Amount * TradeBuyRequestObj.PendingQty / TradeBuyRequestObj.Qty, 18);//@TotalSellQty

                if(DeliverQty==0 || DeliverQty < 0 || DeliverQty > TransactionQueueObj.Amount)
                {
                    _Resp.ErrorCode = enErrorCode.CancelOrder_InvalidDeliveryamount;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Invalid Delivery amount";                 
                    return _Resp;
                }
                var PoolMst = _TradePoolMaster.GetSingle(e => e.Status == 1 && e.OnProcessing==0 && e.TotalQty >= DeliverQty && e.Id== TradeBuyRequestObj.SellStockID);
                if (PoolMst == null)
                {
                    _Resp.ErrorCode = enErrorCode.CancelOrder_StockNotAvilable;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Stock Not Avilable";
                    return _Resp;
                }
                var SellerListObj = _TradeSellerList.GetSingle(e => e.IsProcessing == 0 && e.RemainQty >= DeliverQty && e.TrnNo==TradeBuyRequestObj.TrnNo);
                if (SellerListObj == null)
                {
                    _Resp.ErrorCode = enErrorCode.CancelOrder_UnderProcessing;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Stock Not Avilable or in processing";
                    return _Resp;
                }
                SellerListObj.IsProcessing = 1;
                _TradeSellerList.Update(SellerListObj);

                //CancellQueueEntry(tradeCancelQueue, TradeBuyRequestObj.TrnNo, TransactionQueueObj.ServiceID, TradeBuyRequestObj.PendingQty, DeliverQty,0,0, TradeBuyRequestObj.UserID);
                //PoolOrderObj = CreatePoolOrderForSettlement(TradeBuyRequestObj.UserID, TradeBuyRequestObj.SellStockID, TradeBuyRequestObj.UserID, TradeBuyRequestObj.SellStockID, TradeBuyRequestObj.TrnNo, DeliverQty, CreditWalletID, CreditAccountID);
                //tradeCancelQueue.OrderID = PoolOrderObj.Id;

                tradeCancelQueue = _TradeCancelQueueRepository.GetSingle(e=>e.TrnNo==TradeBuyRequestObj.TrnNo);
                tradeCancelQueue.Status = 1; 
                //TradeBuyRequestObj.IsCancel = 1;
                TradeTransactionQueueObj.SetTransactionStatusMsg("Cancellation Initiated");
                PoolOrderObj.UserWalletID = TradeTransactionQueueObj.OrderWalletID;
                PoolOrderObj.UserWalletAccID = TradeTransactionQueueObj.OrderAccountID;
                //TradeTransactionQueueObj.IsCancelled = 1;
                //_TradeTransactionRepository.Update(TradeTransactionQueueObj);

                //_dbContext.Database.BeginTransaction();

                //_dbContext.Set<TradeCancelQueue>().Add(tradeCancelQueue);
                //_dbContext.Set<PoolOrder>().Add(PoolOrderObj);
                //_dbContext.Entry(PoolOrderObj).State = EntityState.Modified;
                //_dbContext.Entry(TradeBuyRequestObj).State = EntityState.Modified;                
                //_dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                //_dbContext.SaveChanges();
                //_dbContext.Database.CommitTransaction();

                InsertTradePoolQueue(TradeBuyRequestObj.UserID, TradeBuyRequestObj.TrnNo, PoolMst.Id, SellerListObj.RemainQty, SellerListObj.Price, TradeBuyRequestObj.TrnNo, DeliverQty,SellerListObj.Price,0,0, SellerListObj.Id);

                if (SellerListObj.RemainQty >= DeliverQty)
                {
                    PoolOrderObj.DeliveryAmt = DeliverQty;
                    PoolOrderObj.Status = 1;
                    PoolOrderObj.DRemarks = "Cancel order Delivery Success";
                    //PoolOrderObj.DMemberID = TradeBuyRequestObj.UserID; DeliveryGivenBy=@MemberID
                    //_PoolOrder.Update(PoolOrderObj);

                    PoolMst.TotalQty = PoolMst.TotalQty - DeliverQty;
                    PoolMst.UpdatedDate = DateTime.UtcNow;
                    PoolMst.UpdatedBy= TradeBuyRequestObj.UserID;
                    //_TradePoolMaster.Update(PoolMst);
                    SellerListObj.RemainQty = SellerListObj.RemainQty - DeliverQty;


                    TradeBuyRequestObj.Status = 1;
                    //_TradeBuyRequest.Update(TradeBuyRequestObj);
                    if(TradeBuyRequestObj.DeliveredQty > 0)
                    {
                        IsfullSettled = 0;
                        TradeTransactionQueueObj.MakeTransactionSuccess();
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");
                        TradeTransactionQueueObj.SettledDate = DateTime.UtcNow;
                        //_TradeTransactionRepository.Update(TradeTransactionQueueObj);

                        TransactionQueueObj.MakeTransactionSuccess();
                        TransactionQueueObj.SetTransactionStatusMsg("Success with partial cancellation");
                        //_TransactionRepository.Update(TransactionQueueObj);

                        TradeBuyRequestObj.MakeTransactionSuccess();
                        TradeBuyRequestObj.UpdatedDate = DateTime.UtcNow;
                        //_TradeBuyRequest.Update(TradeBuyRequestObj);
                        SellerListObj.MakeTransactionSuccess();
                    }
                    else
                    {
                        IsfullSettled = 1;
                        TradeTransactionQueueObj.MakeTransactionOperatorFail();
                        TradeTransactionQueueObj.SetTransactionStatusMsg("Full Order Cancellation");
                        TradeTransactionQueueObj.SettledDate = DateTime.UtcNow;
                        //_TradeTransactionRepository.Update(TradeTransactionQueueObj);

                        TransactionQueueObj.MakeTransactionOperatorFail();
                        //_TransactionRepository.Update(TransactionQueueObj);

                        TradeBuyRequestObj.MakeTransactionOperatorFail();
                        TradeBuyRequestObj.UpdatedDate = DateTime.UtcNow;
                        //_TradeBuyRequest.Update(TradeBuyRequestObj);
                        SellerListObj.MakeTransactionOperatorFail();
                    }

                    tradeCancelQueue.Status = 1;
                    tradeCancelQueue.SettledDate = DateTime.UtcNow;
                    tradeCancelQueue.UpdatedDate = DateTime.UtcNow;
                    tradeCancelQueue.StatusMsg = "Cancellation Successful.";                                        
                   
                    _dbContext.Set<TradePoolQueue>().Add(TradePoolQueueObj);
                    _dbContext.Entry(PoolOrderObj).State = EntityState.Modified;
                    _dbContext.Entry(PoolMst).State = EntityState.Modified;
                    _dbContext.Entry(TradeBuyRequestObj).State = EntityState.Modified;
                    _dbContext.Entry(TransactionQueueObj).State = EntityState.Modified;
                    _dbContext.Entry(TradeTransactionQueueObj).State = EntityState.Modified;
                    _dbContext.Entry(tradeCancelQueue).State = EntityState.Modified;
                    _dbContext.Entry(SellerListObj).State = EntityState.Modified;

                    List<CreditWalletDrArryTrnID> CreditWalletDrArryTrnIDList = new List<CreditWalletDrArryTrnID>();
                    CreditWalletDrArryTrnIDList.Add(new CreditWalletDrArryTrnID { DrTrnRefNo = TradeBuyRequestObj.TrnNo, Amount = DeliverQty });

                    //Credit back to Ordered Wallet
                    //enWalletTrnType.Cr_Trade Rita 16-1-19 changes enums as wallet team change enums
                    var CreditWalletResult =  _WalletService.GetWalletCreditNew(TradeTransactionQueueObj.Order_Currency, Helpers.GetTimeStamp(),
                        enWalletTrnType.BuyTrade, DeliverQty, TradeBuyRequestObj.UserID,
                        TradeTransactionQueueObj.OrderAccountID, CreditWalletDrArryTrnIDList.ToArray(), TradeBuyRequestObj.TrnNo, IsfullSettled,
                            enWalletTranxOrderType.Credit, enServiceType.Trading, (enTrnType)TransactionQueueObj.TrnType);                    

                    if (CreditWalletResult.ReturnCode != enResponseCode.Success)
                    {
                        HelperForLog.WriteLogIntoFile("CancellationProcess RollbackTransaction", ControllerName, "Balance credit fail" + CreditWalletResult.ReturnMsg + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                        _dbContext.Database.RollbackTransaction();

                        _Resp.ErrorCode = enErrorCode.Settlement_FullSettlementRollback;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Cancel Order Fail " + "  Reason:" + CreditWalletResult.ReturnMsg;
                    }
                    else
                    {
                        _dbContext.SaveChanges();
                        _dbContext.Database.CommitTransaction();
                        _Resp.ErrorCode = enErrorCode.CancelOrder_ProccedSuccess;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Cancel Order Insert Success";
                        return _Resp;

                    }

                    //TCQ object update pending
                    //Update Wallet 
                    //EXEC sp_InsertTransactionAccount 
                    //EXEC sp_InsertLedger

                }
                else
                {
                    _Resp.ErrorCode = enErrorCode.CancelOrder_StockErrorOccured;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Stock Error Occured";
                    return _Resp;
                }

                _Resp.ErrorCode = enErrorCode.CancelOrder_ProccedSuccess;
                _Resp.ReturnCode = enResponseCodeService.Success;
                _Resp.ReturnMsg = "Cancel Order Insert Success";
                return _Resp;

            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("CancellationProcess:##TrnNo " + TradeBuyRequestObj.TrnNo, ControllerName, ex);
                //_dbContext.Database.RollbackTransaction();
            }
            return _Resp;
        }
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
                            Provider.Content = Provider.Content.Replace("###USERNAME###".ToUpper(), User.Name);
                            Provider.Content = Provider.Content.Replace("###TYPE###".ToUpper(), PairName);
                            Provider.Content = Provider.Content.Replace("###REQAMOUNT###".ToUpper(), ReqAmount.ToString());
                            Provider.Content = Provider.Content.Replace("###STATUS###".ToUpper(), "Success");
                            Provider.Content = Provider.Content.Replace("###USER###".ToUpper(), User.Name);
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


    }
}
