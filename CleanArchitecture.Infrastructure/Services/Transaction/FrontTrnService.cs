using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Communication;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.Interfaces.User;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{
    public class FrontTrnService : IFrontTrnService
    {
        #region constructor
        private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly ICommonRepository<TradePairMaster> _tradeMasterRepository;
        private readonly ICommonRepository<TradePairDetail> _tradeDetailRepository;
        private readonly ICommonRepository<ServiceMaster> _serviceMasterRepository;
        private readonly ILogger<FrontTrnService> _logger;
        private readonly ICommonRepository<TradeTransactionQueue> _tradeTransactionQueueRepository;
        private readonly ICommonRepository<SettledTradeTransactionQueue> _settelTradeTranQueue;
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        private readonly ICommonRepository<Market> _marketRepository;
        private readonly ICommonRepository<MarketMargin> _marketRepositoryMargin;
        private readonly ICommonRepository<FavouritePair> _favouritePairRepository;
        private readonly IBasePage _basePage;
        private readonly ICommonRepository<TradeGraphDetail> _graphDetailRepository;
        private readonly ISignalRService _signalRService;
        private readonly ICommonRepository<SettledTradeTransactionQueue> _settleTradeTransactionQueue;
        private readonly IBackOfficeTrnRepository _backOfficeTrnRepository;
        private readonly IWalletService _walletService;
        private readonly IWalletRepository _walletRepository;
        private readonly ICommonRepository<TransactionQueue> _transactionQueue;
        private readonly IUserService _userService;
        private readonly IProfileConfigurationService _profileConfigurationService;
        //Rita 20-2-19 for Margin Trading
        private readonly ICommonRepository<TradeGraphDetailMargin> _graphDetailRepositoryMargin;
        private readonly ICommonRepository<SettledTradeTransactionQueueMargin> _settleTradeTransactionQueueMargin;
        private readonly ICommonRepository<TradePairStasticsMargin> _tradePairStasticsMargin;
        private readonly ICommonRepository<TradePairDetailMargin> _tradeDetailRepositoryMargin;
        private readonly ITrnMasterConfiguration _trnMasterConfiguration;//master configuration Take from cache
        private readonly ICommonRepository<FavouritePairMargin> _favouritePairRepositoryMargin;
        private readonly ICommonRepository<TradingConfiguration> _tradingConfigurationRepository;

        //komal 6-6-2019 Arbitrage Trading
        private readonly ICommonRepository<SettledTradeTransactionQueueArbitrage> _settleTradeTransactionQueueArbitrage;
        private readonly ICommonRepository<TradeGraphDetailArbitrage> _graphDetailRepositoryArbitrage;
        private readonly ICommonRepository<TradePairStasticsArbitrage> _tradePairStasticsArbitrage;
        private readonly ICommonRepository<TradePairDetailArbitrage> _tradeDetailRepositoryArbitrage;

        public FrontTrnService(IFrontTrnRepository frontTrnRepository,
            ICommonRepository<TradePairMaster> tradeMasterRepository,
            ICommonRepository<TradePairDetail> tradeDetailRepository,
            ILogger<FrontTrnService> logger, IWalletRepository walletRepository,
            ICommonRepository<ServiceMaster> serviceMasterRepository,
            ICommonRepository<TradeTransactionQueue> tradeTransactionQueueRepository,
            ICommonRepository<SettledTradeTransactionQueue> settelTradeTranQueue,
            ICommonRepository<TradePairStastics> tradePairStastics,
            ICommonRepository<Market> marketRepository,
            ICommonRepository<FavouritePair> favouritePairRepository,
            IBasePage basePage,
            ICommonRepository<TradeGraphDetail> graphDetailRepository,
            ISignalRService signalRService,
            ICommonRepository<SettledTradeTransactionQueue> settleTradeTransactionQueue,
            IBackOfficeTrnRepository backOfficeTrnRepository,
            IWalletService walletService, ICommonRepository<TransactionQueue> transactionQueue,
            IUserService userService, IProfileConfigurationService profileConfigurationService,
            ICommonRepository<SettledTradeTransactionQueueMargin> settleTradeTransactionQueueMargin,
            ICommonRepository<TradeGraphDetailMargin> graphDetailRepositoryMargin,
            ICommonRepository<TradePairStasticsMargin> tradePairStasticsMargin,
            ICommonRepository<TradePairDetailMargin> tradeDetailRepositoryMargin, ITrnMasterConfiguration trnMasterConfiguration,
            ICommonRepository<MarketMargin> marketRepositoryMargin, ICommonRepository<FavouritePairMargin> favouritePairRepositoryMargin,
            ICommonRepository<TradingConfiguration> TradingConfigurationRepository,
            ICommonRepository<SettledTradeTransactionQueueArbitrage> settleTradeTransactionQueueArbitrage,
            ICommonRepository<TradeGraphDetailArbitrage> graphDetailRepositoryArbitrage,
            ICommonRepository<TradePairStasticsArbitrage> tradePairStasticsArbitrage,
            ICommonRepository<TradePairDetailArbitrage> tradeDetailRepositoryArbitrage)

        {
            _frontTrnRepository = frontTrnRepository;
            _tradeMasterRepository = tradeMasterRepository;
            _tradeDetailRepository = tradeDetailRepository;
            _logger = logger;
            _walletRepository = walletRepository;
            _serviceMasterRepository = serviceMasterRepository;
            _tradeTransactionQueueRepository = tradeTransactionQueueRepository;
            _settelTradeTranQueue = settelTradeTranQueue;
            _tradePairStastics = tradePairStastics;
            _marketRepository = marketRepository;
            _favouritePairRepository = favouritePairRepository;
            _basePage = basePage;
            _graphDetailRepository = graphDetailRepository;
            _signalRService = signalRService;
            _settleTradeTransactionQueue = settleTradeTransactionQueue;
            _backOfficeTrnRepository = backOfficeTrnRepository;
            _walletService = walletService;
            _transactionQueue = transactionQueue;
            _userService = userService;
            _profileConfigurationService = profileConfigurationService;
            //Rita 20-2-19 for Margin Trading
            _settleTradeTransactionQueueMargin = settleTradeTransactionQueueMargin;
            _graphDetailRepositoryMargin = graphDetailRepositoryMargin;
            _tradePairStasticsMargin = tradePairStasticsMargin;
            _tradeDetailRepositoryMargin = tradeDetailRepositoryMargin;
            _trnMasterConfiguration = trnMasterConfiguration;
            _marketRepositoryMargin = marketRepositoryMargin;
            _favouritePairRepositoryMargin = favouritePairRepositoryMargin;
            _tradingConfigurationRepository = TradingConfigurationRepository;
            _settleTradeTransactionQueueArbitrage = settleTradeTransactionQueueArbitrage;
            _graphDetailRepositoryArbitrage = graphDetailRepositoryArbitrage;
            _tradePairStasticsArbitrage = tradePairStasticsArbitrage;
            _tradeDetailRepositoryArbitrage = tradeDetailRepositoryArbitrage;
        }
        #endregion

        #region History Methods

        public List<GetTradeHistoryInfo> GetTradeHistory(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<TradeHistoryResponce> list;// = _frontTrnRepository.GetTradeHistory(MemberID, sCondition, FromDate, TodDate, page, IsAll);

                if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
                    list = _frontTrnRepository.GetTradeHistoryMargin(MemberID, sCondition, FromDate, TodDate, page, IsAll);
                else
                    list = _frontTrnRepository.GetTradeHistory(MemberID, sCondition, FromDate, TodDate, page, IsAll);

                List<GetTradeHistoryInfo> responce = new List<GetTradeHistoryInfo>();

                if (list != null)
                {
                    if (page > 0)
                    {
                        int skip = Helpers.PageSize * (page - 1);
                        list = list.Skip(skip).Take(Helpers.PageSize).ToList();
                    }

                    foreach (TradeHistoryResponce model in list)
                    {
                        responce.Add(new GetTradeHistoryInfo
                        {
                            Amount = model.Amount,
                            ChargeRs = model.ChargeRs == null ? 0 : (decimal)model.ChargeRs,
                            DateTime = model.DateTime,
                            PairName = model.PairName,
                            Price = model.Price,
                            Status = model.Status,
                            StatusText = model.StatusText,
                            TrnNo = model.TrnNo,
                            Type = model.Type,
                            Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs == null ? 0 : (decimal)model.ChargeRs) : ((model.Price * model.Amount)),
                            IsCancel = model.IsCancelled,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty,
                            Chargecurrency = model.Chargecurrency
                        });
                    }
                }
                return responce;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public List<RecentOrderInfo> GetRecentOrder(long PairId, long MemberID, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit)
        {
            try
            {
                //string st = "";
                List<RecentOrderRespose> list;// = _frontTrnRepository.GetRecentOrder(PairId, MemberID);

                if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit)
                    list = _frontTrnRepository.GetRecentOrderMargin(PairId, MemberID);
                else
                    list = _frontTrnRepository.GetRecentOrder(PairId, MemberID);

                List<RecentOrderInfo> responce = new List<RecentOrderInfo>();
                if (list != null)
                {
                    foreach (RecentOrderRespose model in list)
                    {
                        //if (model.Status == Convert.ToInt16(enTransactionStatus.Success))
                        //    st = "Success";
                        //else if (model.Status == Convert.ToInt16(enTransactionStatus.Hold))
                        //    st = "Hold";
                        //else if (model.Status == Convert.ToInt16(enTransactionStatus.SystemFail))
                        //    st = "Fail";

                        responce.Add(new RecentOrderInfo
                        {
                            Qty = model.Qty,
                            DateTime = model.DateTime,
                            Price = model.Price,
                            TrnNo = model.TrnNo,
                            Type = model.Type,
                            Status = model.Status,
                            PairId = model.PairId,
                            PairName = model.PairName,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            StatusCode = model.StatusCode,
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty,
                            ISFollowersReq = model.ISFollowersReq
                        });
                    }
                }
                return responce;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<ActiveOrderInfo> GetActiveOrder(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<ActiveOrderDataResponse> ActiveOrderList;// = _frontTrnRepository.GetActiveOrder(MemberID, FromDate, TodDate, PairId, trnType);
                if (IsMargin == 1)
                    ActiveOrderList = _frontTrnRepository.GetActiveOrderMargin(MemberID, FromDate, TodDate, PairId, trnType);
                else
                    ActiveOrderList = _frontTrnRepository.GetActiveOrder(MemberID, FromDate, TodDate, PairId, trnType);

                List<ActiveOrderInfo> responceData = new List<ActiveOrderInfo>();
                if (ActiveOrderList != null)
                {
                    if (Page > 0)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        ActiveOrderList = ActiveOrderList.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    foreach (ActiveOrderDataResponse model in ActiveOrderList)
                    {
                        responceData.Add(new ActiveOrderInfo
                        {
                            Amount = model.Amount,
                            Delivery_Currency = model.Delivery_Currency,
                            Id = model.TrnNo,
                            IsCancelled = model.IsCancelled,
                            Order_Currency = model.Order_Currency,
                            Price = model.Price,
                            TrnDate = model.TrnDate,
                            Type = model.Type,
                            PairName = model.PairName,
                            PairId = model.PairId,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty
                        });
                    }

                }
                return responceData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<OpenOrderInfo> GetOpenOrder(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<OpenOrderInfo> _Res = new List<OpenOrderInfo>();
                List<OpenOrderQryResponse> list;// = _frontTrnRepository.GetOpenOrder(MemberID, FromDate, TodDate, PairId, trnType);

                if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
                    list = _frontTrnRepository.GetOpenOrderMargin(MemberID, FromDate, TodDate, PairId, trnType);
                else
                    list = _frontTrnRepository.GetOpenOrder(MemberID, FromDate, TodDate, PairId, trnType);

                if (list != null)
                {
                    if (Page > 0)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        list = list.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    foreach (OpenOrderQryResponse model in list)
                    {
                        _Res.Add(new OpenOrderInfo
                        {
                            Amount = model.Amount,
                            Delivery_Currency = model.Delivery_Currency,
                            Id = model.TrnNo,
                            IsCancelled = model.IsCancelled,
                            Order_Currency = model.Order_Currency,
                            Price = model.Price,
                            TrnDate = model.TrnDate,
                            Type = model.Type,
                            PairName = model.PairName,
                            PairId = model.PairId,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype)
                        });
                    }

                }
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public CopiedLeaderOrdersResponse GetCopiedLeaderOrders(long MemberID, string FromDate = "", string TodDate = "", long PairId = 999, short trnType = 999, string FollowTradeType = "", long FollowingTo = 0, int PageSize = 0, int PageNo = 0)
        {
            List<CopiedLeaderOrdersInfo> leaderOrdersInfos = new List<CopiedLeaderOrdersInfo>();
            CopiedLeaderOrdersResponse _Res = new CopiedLeaderOrdersResponse();
            int skip;
            int size;
            try
            {
                if (PageSize == 0)
                    size = Helpers.PageSize;
                else
                    size = PageSize;

                skip = size * (PageNo);
                var list = _frontTrnRepository.GetCopiedLeaderOrders(MemberID, FromDate, TodDate, PairId, trnType, FollowTradeType, FollowingTo);
                if (list.Count == 0)
                {
                    _Res.Response = leaderOrdersInfos;
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "NoDataFound";
                    return _Res;
                }
                _Res.TotalCount = list.Count();
                foreach (var model in list.Skip(skip).Take(size))
                {
                    leaderOrdersInfos.Add(new CopiedLeaderOrdersInfo
                    {
                        Amount = model.Amount,
                        ChargeRs = 0,// model.ChargeRs,
                        DateTime = model.DateTime,
                        PairName = model.PairName,
                        Price = model.Price,
                        Status = model.Status,
                        StatusText = model.StatusText,
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        IsCancel = model.IsCancelled,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        SettledDate = model.SettledDate,
                        SettledQty = model.SettledQty,
                        FollowTradeType = model.FollowTradeType,
                        FollowingTo = model.FollowingTo
                    });
                }
                _Res.Response = leaderOrdersInfos;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        #region Insert Trading Data methods

        public async Task GetPairAdditionalVal(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "")
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# #ParameterValue1# " + " #TrnNo# :" + TrnNo + " #CurrentRate# : " + CurrentRate + " #Quantity# : " + Quantity, "FrontService", "Object Data : "));
                //Calucalte ChangePer
                decimal Volume24 = 0, ChangePer = 0, High24Hr = 0, Low24Hr = 0, WeekHigh = 0, WeekLow = 0, Week52High = 0, Week52Low = 0, ChangeValue = 0;
                short UpDownBit = 1; //komal 13-11-2018 set defau
                decimal tradeprice = 0; //todayopen, todayclose;
                decimal LastRate = 0;

                //Uday 22-12-2018 Get All Record Of Last One Day Of Particular Pair
                var SettledData = _settleTradeTransactionQueue.FindBy(x => x.PairID == PairId && x.Status == 1 && x.SettledDate >= _basePage.UTC_To_IST().AddDays(-1)).ToList();//TrnDate Rita 11-4-19 only settle txn , not created txn

                //var tradeRateData = _settleTradeTransactionQueue.FindBy(x => x.TrnDate > _basePage.UTC_To_IST().AddDays(-1) && x.PairID == PairId && x.Status == 1 && (x.TrnType == Convert.ToInt16(enTrnType.Sell_Trade) || x.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))).OrderByDescending(x => x.TrnNo).FirstOrDefault();
                var tradeRateData = SettledData.OrderByDescending(x => x.Id).FirstOrDefault();
                if (tradeRateData != null)
                {
                    if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                    {
                        LastRate = tradeRateData.BidPrice;
                    }
                    else if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                    {
                        LastRate = tradeRateData.AskPrice;
                    }
                }
                else
                {
                    LastRate = 0;
                }

                //var tradedata = _settleTradeTransactionQueue.GetSingle(x => x.TrnDate > _basePage.UTC_To_IST().AddDays(-1) && x.PairID == PairId && x.Status == 1);
                var tradedata = SettledData.OrderBy(x => x.Id).FirstOrDefault();
                if (tradedata != null)
                {
                    //Task.Run(()=>HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# #CHANGEPER# #Count# : 1 " + " #TrnNo# :" + TrnNo + " #BidPrice# : " + tradedata.BidPrice + " #AskPrice# : " + tradedata.AskPrice, "FrontService", "Object Data : "));
                    if (tradedata.TrnType == 4)
                    {
                        tradeprice = tradedata.BidPrice;
                    }
                    else if (tradedata.TrnType == 5)
                    {
                        tradeprice = tradedata.AskPrice;
                    }
                    if (LastRate > 0 && tradeprice > 0)
                    {
                        ChangePer = ((LastRate * 100) / tradeprice) - 100;
                        //Calculate ChangeValue
                        ChangeValue = LastRate - tradeprice;
                    }
                    else if (LastRate > 0 && tradeprice == 0)
                    {
                        ChangePer = 100;
                        ChangeValue = LastRate;
                    }
                    else
                    {
                        ChangePer = 0;
                        ChangeValue = 0;
                    }
                }
                else
                {
                    ChangePer = 0;
                    ChangeValue = 0;
                }

                //Calculate Volume24
                tradeprice = 0;
                decimal tradeqty = 0, sum = 0;
                //var tradedata1 = _settleTradeTransactionQueue.FindBy(x => x.TrnDate >= _basePage.UTC_To_IST().AddDays(-1) && x.TrnDate <= _basePage.UTC_To_IST() && x.PairID == PairId && x.Status == 1 && (x.TrnType == 4 || x.TrnType == 5));
                var tradedata1 = SettledData;
                if (tradedata1 != null && tradedata1.Count() > 0)
                {

                    //foreach (var trade in tradedata1)
                    //{
                    //    //Task.Run(()=>HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# #VolumeData#  " + " #TrnNo# :" + trade.TrnNo + " #BidPrice# : " + trade.BidPrice + " #AskPrice# : " + trade.AskPrice, "FrontService", "Object Data : "));
                    //    if (trade.TrnType == 4)
                    //    {
                    //        tradeprice = trade.BidPrice;
                    //        tradeqty = trade.BuyQty;
                    //    }
                    //    else if (trade.TrnType == 5)
                    //    {
                    //        tradeprice = trade.AskPrice;
                    //        tradeqty = trade.SellQty;
                    //    }
                    //    else
                    //    {
                    //        tradeprice = 0;
                    //        tradeqty = 0;
                    //    }
                    //    sum += (tradeprice * tradeqty);
                    //}
                    foreach (var trade in tradedata1)//Rita 11-4-19 taken settledQty instead of total Qty
                    {
                        if (trade.TrnType == 4)
                        {
                            tradeqty = trade.SettledSellQty;
                        }
                        else if (trade.TrnType == 5)
                        {
                            tradeqty = trade.SettledBuyQty;
                        }
                        else
                        {
                            tradeqty = 0;
                        }
                        sum += tradeqty;
                    }
                    Volume24 = sum;
                }
                else
                {
                    Volume24 = 0;
                }

                //Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# " + " #VolumeData :" + Volume24 + " #ChangePer# : " + ChangePer, "FrontService", "Object Data : "));

                //Insert In GraphDetail Only BidPrice
                var DataDate = TranDate;
                var tradegraph = new TradeGraphDetail()
                {
                    PairId = PairId,
                    TranNo = TrnNo,
                    DataDate = DataDate,
                    ChangePer = ChangePer,
                    Volume = Volume24,
                    BidPrice = CurrentRate,
                    LTP = CurrentRate,
                    Quantity = Quantity,
                    CreatedBy = 1,
                    CreatedDate = _basePage.UTC_To_IST()
                };

                try
                {
                    tradegraph = _graphDetailRepository.Add(tradegraph);
                }
                catch (Exception ex)
                {
                    //Uday 08-01-2019 add Trnno in errorlog. check which trnno has been duplicate
                    HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# " + " #TradeGraphDetail# #DuplicateTrnNo# : " + TrnNo, "FrontService", "Duplicate TrnNo in TradeGraphDetail");
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #TrnNo# : " + TrnNo + "  ", this.GetType().Name, ex);
                }
                finally
                {
                    //Calculate High Low Data For 24Hr
                    //var tardeTrabDetail = _settleTradeTransactionQueue.FindBy(x => x.PairID == PairId && x.Status == 1 && x.TrnDate >= _basePage.UTC_To_IST().AddDays(-1) && x.TrnDate <= _basePage.UTC_To_IST()).OrderBy(x => x.Id).ToList();
                    var tardeTrabDetail = SettledData.OrderByDescending(x => x.Id).ToList();
                    High24Hr = LastRate;
                    Low24Hr = LastRate;
                    if (tardeTrabDetail.Count > 0)
                    {
                        foreach (SettledTradeTransactionQueue type in tardeTrabDetail)
                        {
                            decimal price = 0;
                            if (type.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                            {
                                price = type.BidPrice;
                            }
                            else if (type.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                            {
                                price = type.AskPrice;
                            }

                            if (price > High24Hr)
                            {
                                High24Hr = price;
                            }
                            if (price < Low24Hr)
                            {
                                Low24Hr = price;
                            }
                        }
                    }

                    //Calculate High Low Data For Week
                    var WeekData = _frontTrnRepository.GetHighLowValue(PairId, -7);
                    if (WeekData != null)
                    {
                        WeekHigh = WeekData.HighPrice;
                        WeekLow = WeekData.LowPrice;
                    }

                    //Calculate High Low Data For 52Week
                    var Week52Data = _frontTrnRepository.GetHighLowValue(PairId, -365);
                    if (Week52Data != null)
                    {
                        Week52High = Week52Data.HighPrice;
                        Week52Low = Week52Data.LowPrice;
                    }
                    #region commentedCode
                    ////Calculate High Low Data For Week
                    //var tradegraphdetail2 = _graphDetailRepository.FindBy(x => x.DataDate >= _basePage.UTC_To_IST().AddDays(-7) && x.DataDate <= _basePage.UTC_To_IST()).OrderBy(x => x.TranNo).ToList();
                    //WeekHigh = CurrentRate;
                    //WeekLow = CurrentRate;
                    //if (tradegraphdetail2.Count > 0)
                    //{
                    //    foreach (TradeGraphDetail type in tradegraphdetail2)
                    //    {
                    //        if (type.BidPrice > WeekHigh)
                    //        {
                    //            WeekHigh = type.BidPrice;
                    //        }
                    //        if (type.BidPrice < WeekLow)
                    //        {
                    //            WeekLow = type.BidPrice;
                    //        }
                    //    }
                    //}

                    ////Calculate High Low Data For 52Week
                    //var tradegraphdetail3 = _graphDetailRepository.FindBy(x => x.DataDate >= _basePage.UTC_To_IST().AddDays(-365) && x.DataDate <= _basePage.UTC_To_IST()).OrderBy(x => x.TranNo).ToList();
                    //Week52High = CurrentRate;
                    //Week52Low = CurrentRate;
                    //if (tradegraphdetail3.Count > 0)
                    //{
                    //    foreach (TradeGraphDetail type in tradegraphdetail2)
                    //    {
                    //        if (type.BidPrice > Week52High)
                    //        {
                    //            Week52High = type.BidPrice;
                    //        }
                    //        if (type.BidPrice < Week52Low)
                    //        {
                    //            Week52Low = type.BidPrice;
                    //        }
                    //    }
                    //}              

                    ////Calculate Open Close
                    //var now = _basePage.UTC_To_IST();
                    //DateTime startDateTime = new DateTime(now.Year, now.Month, now.Day, 0, 0, 0);
                    //DateTime endDateTime = _basePage.UTC_To_IST();

                    //var tradegraphdetail1 = _graphDetailRepository.FindBy(x => x.DataDate >= startDateTime && x.DataDate <= endDateTime).OrderBy(x => x.TranNo).FirstOrDefault();
                    //if (tradegraphdetail1 != null)
                    //{
                    //    todayopen = tradegraphdetail1.BidPrice;
                    //    todayclose = CurrentRate;
                    //}
                    //else
                    //{
                    //    todayopen = CurrentRate;
                    //    todayclose = CurrentRate;
                    //}


                    ////Update TradeGraph Detail Data

                    //tradegraph.High24Hr = High24Hr;
                    //tradegraph.Low24Hr = Low24Hr;
                    //tradegraph.HighWeek = WeekHigh;
                    //tradegraph.LowWeek = WeekLow;
                    //tradegraph.High52Week = Week52High;
                    //tradegraph.Low52Week = Week52Low;
                    //tradegraph.LTP = CurrentRate;
                    //tradegraph.TodayOpen = todayopen;
                    //tradegraph.TodayClose = todayclose;                   
                    //_graphDetailRepository.Update(tradegraph);

                    //Uday 14-11-2018 CurrentRate Calculation Changes based on TrnDate
                    #endregion
                    var pairData = _tradePairStastics.GetSingle(x => x.PairId == PairId);
                    HelperForLog.WriteLogIntoFile("#GetLastPairData# #PairId : " + PairId + " #TrnNo# : " + TrnNo + " UpDownBit : " + pairData.UpDownBit + " LTP : " + pairData.LTP + " Last TrnDate : " + pairData.TranDate, "Object Data : ");
                    //if (TranDate > pairData.TranDate)
                    //{
                    //    pairData.LTP = CurrentRate;
                    //    pairData.CurrentRate = CurrentRate;
                    //}
                    //else
                    //{
                    //    CurrentRate = pairData.CurrentRate;
                    //}
                    //Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# #ParameterValue2# " + " #TrnNo# :" + TrnNo + " #CurrentRate# : " + CurrentRate + " #Quantity# : " + Quantity, "FrontService", "Object Data : "));
                    // _tradePairStastics.Update(pairData);

                    if (CurrentRate > pairData.High24Hr) //komal 13-11-2018 Change code sequence cos got 0 every time
                    {
                        UpDownBit = 1;
                        Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# " + " #Inside CurrentRate > pairData.High24Hr : UpdownbBit = 1 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else if (CurrentRate < pairData.Low24Hr)
                    {
                        UpDownBit = 0;
                        Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# " + " #Inside CurrentRate < pairData.High24Hr : UpdownbBit = 0 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else
                    {
                        if (CurrentRate < pairData.LTP)
                        {
                            UpDownBit = 0;
                        }
                        else if (CurrentRate > pairData.LTP)
                        {
                            UpDownBit = 1;
                        }
                        else if (CurrentRate == pairData.LTP)//komal 13-11-2018 if no change then set as it is
                        {
                            UpDownBit = pairData.UpDownBit;
                        }
                        Task.Run(() => HelperForLog.WriteLogIntoFile("#GetPairAdditionalVal# " + " #Inside Else Part UpDownBit : " + pairData.UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));

                    }

                    Task.Run(() => HelperForLog.WriteLogIntoFile("#UpdatePairLTPStart# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    pairData.ChangePer24 = ChangePer;
                    pairData.ChangeVol24 = Volume24;
                    pairData.High24Hr = High24Hr;
                    pairData.Low24Hr = Low24Hr;
                    pairData.LTP = CurrentRate;
                    pairData.CurrentRate = CurrentRate;
                    pairData.HighWeek = WeekHigh;
                    pairData.LowWeek = WeekLow;
                    pairData.High52Week = Week52High;
                    pairData.Low52Week = Week52Low;
                    pairData.TranDate = TranDate;
                    pairData.UpDownBit = UpDownBit;
                    pairData.ChangeValue = ChangeValue;
                    _tradePairStastics.Update(pairData);
                    Task.Run(() => HelperForLog.WriteLogIntoFile("#UpdatePairLTEND# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    //komal 16-11-2018 Set Volume Data avoid DB call
                    //var VolumeData = GetVolumeDataByPair(PairId);

                    VolumeDataRespose VolumeData = new VolumeDataRespose();
                    VolumeData.PairId = PairId;
                    VolumeData.PairName = _tradeMasterRepository.GetById(PairId).PairName;
                    VolumeData.Currentrate = pairData.CurrentRate;
                    VolumeData.ChangePer = pairData.ChangePer24;
                    VolumeData.Volume24 = pairData.ChangeVol24;
                    VolumeData.High24Hr = pairData.High24Hr;
                    VolumeData.Low24Hr = pairData.Low24Hr;
                    VolumeData.HighWeek = pairData.HighWeek;
                    VolumeData.LowWeek = pairData.LowWeek;
                    VolumeData.High52Week = pairData.High52Week;
                    VolumeData.Low52Week = pairData.Low52Week;
                    VolumeData.UpDownBit = pairData.UpDownBit;


                    //komal 16-11-2018 Set MArket Data avoid DB call
                    //var MarketData = GetMarketCap(PairId);
                    MarketCapData MarketData = new MarketCapData();
                    MarketData.Change24 = pairData.High24Hr - pairData.Low24Hr;
                    MarketData.ChangePer = pairData.ChangePer24;
                    MarketData.High24 = pairData.High24Hr;
                    MarketData.Low24 = pairData.Low24Hr;
                    MarketData.LastPrice = pairData.LTP;
                    MarketData.Volume24 = pairData.ChangeVol24;

                    Task.Run(() => HelperForLog.WriteLogIntoFile("#VolumeDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => HelperForLog.WriteLogIntoFile("#MarketDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => _signalRService.OnVolumeChange(VolumeData, MarketData, UserID));

                    // Uday 28-02-2019 Comment this code because every two minute call for all pair also give data so front side issue, so front team said remove this call
                    //var GraphDataList = _frontTrnRepository.GetGraphData(PairId, 1, "MINUTE", _basePage.UTC_To_IST(), 1);
                    //if (GraphDataList.Count() > 0)
                    //{
                    //    // DateTime dt2 = new DateTime(1970, 1, 1);
                    //    // List<GetGraphDetailInfo> responseData = new List<GetGraphDetailInfo>();

                    //    //responseData = GraphDataList.Select(a => new GetGraphDetailInfo()
                    //    //{
                    //    //    DataDate = Convert.ToInt64(a.DataDate.Subtract(dt2).TotalMilliseconds),
                    //    //    High = a.High,
                    //    //    Low = a.Low,
                    //    //    Open = a.OpenVal,
                    //    //    Close = a.OpenVal,
                    //    //    Volume = a.Volume,
                    //    //}).ToList();

                    //    var GraphData = GraphDataList.FirstOrDefault();
                    //    Task.Run(() => HelperForLog.WriteLogIntoFile("#GraphDataToSocket# #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    //    Task.Run(() => _signalRService.ChartData(GraphData, VolumeData.PairName));
                    //}

                    //Uday 25-12-2018  SignalR Call For Market Ticker
                    var PairDetailMarketTicker = _tradeDetailRepository.GetSingle(x => x.PairId == PairId);
                    if (PairDetailMarketTicker != null)
                    {
                        if (PairDetailMarketTicker.IsMarketTicker == 1)
                        {
                            List<VolumeDataRespose> MarketTickerData = new List<VolumeDataRespose>();
                            MarketTickerData.Add(VolumeData);
                            Task.Run(() => HelperForLog.WriteLogIntoFile("#MarketTickerSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                            Task.Run(() => _signalRService.MarketTicker(MarketTickerData, UserID));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 20-2-19 for margin trading
        public async Task GetPairAdditionalValMargin(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "")
        {
            string MethodName = "GetPairAdditionalValMargin";
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #ParameterValue1# " + " #TrnNo# :" + TrnNo + " #CurrentRate# : " + CurrentRate + " #Quantity# : " + Quantity, "FrontService", "Object Data : "));
                //Calucalte ChangePer
                decimal Volume24 = 0, ChangePer = 0, High24Hr = 0, Low24Hr = 0, WeekHigh = 0, WeekLow = 0, Week52High = 0, Week52Low = 0, ChangeValue = 0;
                short UpDownBit = 1; //komal 13-11-2018 set defau
                decimal tradeprice = 0; //todayopen, todayclose;
                decimal LastRate = 0;

                //Uday 22-12-2018 Get All Record Of Last One Day Of Particular Pair
                var SettledData = _settleTradeTransactionQueueMargin.FindBy(x => x.PairID == PairId && x.Status == 1 && x.SettledDate >= _basePage.UTC_To_IST().AddDays(-1)).ToList();//TrnDate Rita 11-4-19 only settle txn , not created txn

                var tradeRateData = SettledData.OrderByDescending(x => x.Id).FirstOrDefault();
                if (tradeRateData != null)
                {
                    if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                    {
                        LastRate = tradeRateData.BidPrice;
                    }
                    else if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                    {
                        LastRate = tradeRateData.AskPrice;
                    }
                }
                else
                {
                    LastRate = 0;
                }

                var tradedata = SettledData.OrderBy(x => x.Id).FirstOrDefault();
                if (tradedata != null)
                {
                    if (tradedata.TrnType == 4)
                    {
                        tradeprice = tradedata.BidPrice;
                    }
                    else if (tradedata.TrnType == 5)
                    {
                        tradeprice = tradedata.AskPrice;
                    }
                    if (LastRate > 0 && tradeprice > 0)
                    {
                        ChangePer = ((LastRate * 100) / tradeprice) - 100;
                        //Calculate ChangeValue
                        ChangeValue = LastRate - tradeprice;
                    }
                    else if (LastRate > 0 && tradeprice == 0)
                    {
                        ChangePer = 100;
                        ChangeValue = LastRate;
                    }
                    else
                    {
                        ChangePer = 0;
                        ChangeValue = 0;
                    }
                }
                else
                {
                    ChangePer = 0;
                    ChangeValue = 0;
                }

                //Calculate Volume24
                tradeprice = 0;
                decimal tradeqty = 0, sum = 0;
                var tradedata1 = SettledData;
                if (tradedata1 != null && tradedata1.Count() > 0)
                {

                    //foreach (var trade in tradedata1)
                    //{
                    //    if (trade.TrnType == 4)
                    //    {
                    //        tradeprice = trade.BidPrice;
                    //        tradeqty = trade.BuyQty;
                    //    }
                    //    else if (trade.TrnType == 5)
                    //    {
                    //        tradeprice = trade.AskPrice;
                    //        tradeqty = trade.SellQty;
                    //    }
                    //    else
                    //    {
                    //        tradeprice = 0;
                    //        tradeqty = 0;
                    //    }
                    //    sum += (tradeprice * tradeqty);
                    //}
                    foreach (var trade in tradedata1)//Rita 11-4-19 taken settledQty instead of total Qty
                    {
                        if (trade.TrnType == 4)
                        {
                            tradeqty = trade.SettledSellQty;
                        }
                        else if (trade.TrnType == 5)
                        {
                            tradeqty = trade.SettledBuyQty;
                        }
                        else
                        {
                            tradeqty = 0;
                        }
                        sum += tradeqty;
                    }
                    Volume24 = sum;
                }
                else
                {
                    Volume24 = 0;
                }

                //Insert In GraphDetail Only BidPrice
                var DataDate = TranDate;
                var tradegraph = new TradeGraphDetailMargin()
                {
                    PairId = PairId,
                    TranNo = TrnNo,
                    DataDate = DataDate,
                    ChangePer = ChangePer,
                    Volume = Volume24,
                    BidPrice = CurrentRate,
                    LTP = CurrentRate,
                    Quantity = Quantity,
                    CreatedBy = 1,
                    CreatedDate = _basePage.UTC_To_IST()
                };

                try
                {
                    tradegraph = _graphDetailRepositoryMargin.Add(tradegraph);
                }
                catch (Exception ex)
                {
                    //Uday 08-01-2019 add Trnno in errorlog. check which trnno has been duplicate
                    HelperForLog.WriteLogIntoFile(MethodName + " #TradeGraphDetail# #DuplicateTrnNo# : " + TrnNo, "FrontService", "Duplicate TrnNo in TradeGraphDetail");
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #TrnNo# : " + TrnNo + "  ", this.GetType().Name, ex);
                }
                finally
                {
                    //Calculate High Low Data For 24Hr
                    //var tardeTrabDetail = _settleTradeTransactionQueue.FindBy(x => x.PairID == PairId && x.Status == 1 && x.TrnDate >= _basePage.UTC_To_IST().AddDays(-1) && x.TrnDate <= _basePage.UTC_To_IST()).OrderBy(x => x.Id).ToList();
                    var tardeTrabDetail = SettledData.OrderByDescending(x => x.Id).ToList();
                    High24Hr = LastRate;
                    Low24Hr = LastRate;
                    if (tardeTrabDetail.Count > 0)
                    {
                        foreach (SettledTradeTransactionQueueMargin type in tardeTrabDetail)
                        {
                            decimal price = 0;
                            if (type.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                            {
                                price = type.BidPrice;
                            }
                            else if (type.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                            {
                                price = type.AskPrice;
                            }

                            if (price > High24Hr)
                            {
                                High24Hr = price;
                            }
                            if (price < Low24Hr)
                            {
                                Low24Hr = price;
                            }
                        }
                    }

                    //Calculate High Low Data For Week
                    var WeekData = _frontTrnRepository.GetHighLowValueMargin(PairId, -7);
                    if (WeekData != null)
                    {
                        WeekHigh = WeekData.HighPrice;
                        WeekLow = WeekData.LowPrice;
                    }

                    //Calculate High Low Data For 52Week
                    var Week52Data = _frontTrnRepository.GetHighLowValueMargin(PairId, -365);
                    if (Week52Data != null)
                    {
                        Week52High = Week52Data.HighPrice;
                        Week52Low = Week52Data.LowPrice;
                    }
                    #region commentedCode
                    //Uday 14-11-2018 CurrentRate Calculation Changes based on TrnDate
                    #endregion
                    var pairData = _tradePairStasticsMargin.GetSingle(x => x.PairId == PairId);
                    HelperForLog.WriteLogIntoFile(MethodName + " #GetLastPairData# #PairId : " + PairId + " #TrnNo# : " + TrnNo + " UpDownBit : " + pairData.UpDownBit + " LTP : " + pairData.LTP + " Last TrnDate : " + pairData.TranDate, "Object Data : ");

                    if (CurrentRate > pairData.High24Hr) //komal 13-11-2018 Change code sequence cos got 0 every time
                    {
                        UpDownBit = 1;
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside CurrentRate > pairData.High24Hr : UpdownbBit = 1 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else if (CurrentRate < pairData.Low24Hr)
                    {
                        UpDownBit = 0;
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside CurrentRate < pairData.High24Hr : UpdownbBit = 0 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else
                    {
                        if (CurrentRate < pairData.LTP)
                        {
                            UpDownBit = 0;
                        }
                        else if (CurrentRate > pairData.LTP)
                        {
                            UpDownBit = 1;
                        }
                        else if (CurrentRate == pairData.LTP)//komal 13-11-2018 if no change then set as it is
                        {
                            UpDownBit = pairData.UpDownBit;
                        }
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside Else Part UpDownBit : " + pairData.UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));

                    }

                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #UpdatePairLTPStart# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    pairData.ChangePer24 = ChangePer;
                    pairData.ChangeVol24 = Volume24;
                    pairData.High24Hr = High24Hr;
                    pairData.Low24Hr = Low24Hr;
                    pairData.LTP = CurrentRate;
                    pairData.CurrentRate = CurrentRate;
                    pairData.HighWeek = WeekHigh;
                    pairData.LowWeek = WeekLow;
                    pairData.High52Week = Week52High;
                    pairData.Low52Week = Week52Low;
                    pairData.TranDate = TranDate;
                    pairData.UpDownBit = UpDownBit;
                    pairData.ChangeValue = ChangeValue;
                    _tradePairStasticsMargin.Update(pairData);
                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #UpdatePairLTEND# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    //komal 16-11-2018 Set Volume Data avoid DB call
                    VolumeDataRespose VolumeData = new VolumeDataRespose();
                    VolumeData.PairId = PairId;
                    //VolumeData.PairName = _tradeMasterRepository.GetById(PairId).PairName;
                    VolumeData.PairName = _trnMasterConfiguration.GetTradePairMasterMargin().Where(e => e.Id == PairId).FirstOrDefault().PairName;
                    VolumeData.Currentrate = pairData.CurrentRate;
                    VolumeData.ChangePer = pairData.ChangePer24;
                    VolumeData.Volume24 = pairData.ChangeVol24;
                    VolumeData.High24Hr = pairData.High24Hr;
                    VolumeData.Low24Hr = pairData.Low24Hr;
                    VolumeData.HighWeek = pairData.HighWeek;
                    VolumeData.LowWeek = pairData.LowWeek;
                    VolumeData.High52Week = pairData.High52Week;
                    VolumeData.Low52Week = pairData.Low52Week;
                    VolumeData.UpDownBit = pairData.UpDownBit;

                    //komal 16-11-2018 Set MArket Data avoid DB call
                    MarketCapData MarketData = new MarketCapData();
                    MarketData.Change24 = pairData.High24Hr - pairData.Low24Hr;
                    MarketData.ChangePer = pairData.ChangePer24;
                    MarketData.High24 = pairData.High24Hr;
                    MarketData.Low24 = pairData.Low24Hr;
                    MarketData.LastPrice = pairData.LTP;
                    MarketData.Volume24 = pairData.ChangeVol24;

                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #VolumeDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #MarketDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => _signalRService.OnVolumeChangeMargin(VolumeData, MarketData, UserID));


                    //Uday 25-12-2018  SignalR Call For Market Ticker
                    var PairDetailMarketTicker = _tradeDetailRepositoryMargin.GetSingle(x => x.PairId == PairId);
                    if (PairDetailMarketTicker != null)
                    {
                        if (PairDetailMarketTicker.IsMarketTicker == 1)
                        {
                            List<VolumeDataRespose> MarketTickerData = new List<VolumeDataRespose>();
                            MarketTickerData.Add(VolumeData);
                            Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #MarketTickerSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                            Task.Run(() => _signalRService.MarketTicker(MarketTickerData, UserID, "", IsMargin: 1));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPairAdditionalValMargin ##TrnNo:" + TrnNo, "FrontTrnService", ex);
                //throw ex;
            }
        }

        public async Task GetPairAdditionalValArbitrage(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "")
        {
            string MethodName = "GetPairAdditionalValArbitrage";
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #ParameterValue1# " + " #TrnNo# :" + TrnNo + " #CurrentRate# : " + CurrentRate + " #Quantity# : " + Quantity, "FrontService", "Object Data : "));
                //Calucalte ChangePer
                decimal Volume24 = 0, ChangePer = 0, High24Hr = 0, Low24Hr = 0, WeekHigh = 0, WeekLow = 0, Week52High = 0, Week52Low = 0, ChangeValue = 0;
                short UpDownBit = 1; //komal 13-11-2018 set default
                decimal tradeprice = 0; //todayopen, todayclose;
                decimal LastRate = 0;

                //Uday 22-12-2018 Get All Record Of Last One Day Of Particular Pair
                var SettledData = _settleTradeTransactionQueueArbitrage.FindBy(x => x.PairID == PairId && x.Status == 1 && x.SettledDate >= _basePage.UTC_To_IST().AddDays(-1)).ToList();//TrnDate Rita 11-4-19 only settle txn , not created txn

                var tradeRateData = SettledData.OrderByDescending(x => x.Id).FirstOrDefault();
                if (tradeRateData != null)
                {
                    if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                    {
                        LastRate = tradeRateData.BidPrice;
                    }
                    else if (tradeRateData.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                    {
                        LastRate = tradeRateData.AskPrice;
                    }
                }
                else
                {
                    LastRate = 0;
                }

                var tradedata = SettledData.OrderBy(x => x.Id).FirstOrDefault();
                if (tradedata != null)
                {
                    if (tradedata.TrnType == 4)
                    {
                        tradeprice = tradedata.BidPrice;
                    }
                    else if (tradedata.TrnType == 5)
                    {
                        tradeprice = tradedata.AskPrice;
                    }
                    if (LastRate > 0 && tradeprice > 0)
                    {
                        ChangePer = ((LastRate * 100) / tradeprice) - 100;
                        //Calculate ChangeValue
                        ChangeValue = LastRate - tradeprice;
                    }
                    else if (LastRate > 0 && tradeprice == 0)
                    {
                        ChangePer = 100;
                        ChangeValue = LastRate;
                    }
                    else
                    {
                        ChangePer = 0;
                        ChangeValue = 0;
                    }
                }
                else
                {
                    ChangePer = 0;
                    ChangeValue = 0;
                }

                //Calculate Volume24
                tradeprice = 0;
                decimal tradeqty = 0, sum = 0;
                var tradedata1 = SettledData;
                if (tradedata1 != null && tradedata1.Count() > 0)
                {
                    foreach (var trade in tradedata1)//Rita 11-4-19 taken settledQty instead of total Qty
                    {
                        if (trade.TrnType == 4)
                        {
                            tradeqty = trade.SettledSellQty;
                        }
                        else if (trade.TrnType == 5)
                        {
                            tradeqty = trade.SettledBuyQty;
                        }
                        else
                        {
                            tradeqty = 0;
                        }
                        sum += tradeqty;
                    }
                    Volume24 = sum;
                }
                else
                {
                    Volume24 = 0;
                }

                //Insert In GraphDetail Only BidPrice
                var DataDate = TranDate;
                var tradegraph = new TradeGraphDetailArbitrage()
                {
                    PairId = PairId,
                    TranNo = TrnNo,
                    DataDate = DataDate,
                    ChangePer = ChangePer,
                    Volume = Volume24,
                    BidPrice = CurrentRate,
                    LTP = CurrentRate,
                    Quantity = Quantity,
                    CreatedBy = 1,
                    CreatedDate = _basePage.UTC_To_IST()
                };

                try
                {
                    tradegraph = _graphDetailRepositoryArbitrage.Add(tradegraph);
                }
                catch (Exception ex)
                {
                    //Uday 08-01-2019 add Trnno in errorlog. check which trnno has been duplicate
                    HelperForLog.WriteLogIntoFile(MethodName + " #TradeGraphDetail# #DuplicateTrnNo# : " + TrnNo, "FrontService", "Duplicate TrnNo in TradeGraphDetail");
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #TrnNo# : " + TrnNo + "  ", this.GetType().Name, ex);
                }
                finally
                {
                    //Calculate High Low Data For 24Hr
                    var tardeTrabDetail = SettledData.OrderByDescending(x => x.Id).ToList();
                    High24Hr = LastRate;
                    Low24Hr = LastRate;
                    if (tardeTrabDetail.Count > 0)
                    {
                        foreach (SettledTradeTransactionQueueArbitrage type in tardeTrabDetail)
                        {
                            decimal price = 0;
                            if (type.TrnType == Convert.ToInt16(enTrnType.Buy_Trade))
                            {
                                price = type.BidPrice;
                            }
                            else if (type.TrnType == Convert.ToInt16(enTrnType.Sell_Trade))
                            {
                                price = type.AskPrice;
                            }

                            if (price > High24Hr)
                            {
                                High24Hr = price;
                            }
                            if (price < Low24Hr)
                            {
                                Low24Hr = price;
                            }
                        }
                    }

                    //Calculate High Low Data For Week
                    var WeekData = _frontTrnRepository.GetHighLowValueArbitrage(PairId, -7);
                    if (WeekData != null)
                    {
                        WeekHigh = WeekData.HighPrice;
                        WeekLow = WeekData.LowPrice;
                    }

                    //Calculate High Low Data For 52Week
                    var Week52Data = _frontTrnRepository.GetHighLowValueArbitrage(PairId, -365);
                    if (Week52Data != null)
                    {
                        Week52High = Week52Data.HighPrice;
                        Week52Low = Week52Data.LowPrice;
                    }
                    #region commentedCode
                    //Uday 14-11-2018 CurrentRate Calculation Changes based on TrnDate
                    #endregion
                    var pairData = _tradePairStasticsArbitrage.GetSingle(x => x.PairId == PairId);
                    HelperForLog.WriteLogIntoFile(MethodName + " #GetLastPairData# #PairId : " + PairId + " #TrnNo# : " + TrnNo + " UpDownBit : " + pairData.UpDownBit + " LTP : " + pairData.LTP + " Last TrnDate : " + pairData.TranDate, "Object Data : ");

                    if (CurrentRate > pairData.High24Hr) //komal 13-11-2018 Change code sequence cos got 0 every time
                    {
                        UpDownBit = 1;
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside CurrentRate > pairData.High24Hr : UpdownbBit = 1 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else if (CurrentRate < pairData.Low24Hr)
                    {
                        UpDownBit = 0;
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside CurrentRate < pairData.High24Hr : UpdownbBit = 0 : TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    }
                    else
                    {
                        if (CurrentRate < pairData.LTP)
                        {
                            UpDownBit = 0;
                        }
                        else if (CurrentRate > pairData.LTP)
                        {
                            UpDownBit = 1;
                        }
                        else if (CurrentRate == pairData.LTP)//komal 13-11-2018 if no change then set as it is
                        {
                            UpDownBit = pairData.UpDownBit;
                        }
                        Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #Inside Else Part UpDownBit : " + pairData.UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));

                    }

                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #UpdatePairLTPStart# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    pairData.ChangePer24 = ChangePer;
                    pairData.ChangeVol24 = Volume24;
                    pairData.High24Hr = High24Hr;
                    pairData.Low24Hr = Low24Hr;
                    pairData.LTP = CurrentRate;
                    pairData.CurrentRate = CurrentRate;
                    pairData.HighWeek = WeekHigh;
                    pairData.LowWeek = WeekLow;
                    pairData.High52Week = Week52High;
                    pairData.Low52Week = Week52Low;
                    pairData.TranDate = TranDate;
                    pairData.UpDownBit = UpDownBit;
                    pairData.ChangeValue = ChangeValue;
                    _tradePairStasticsArbitrage.Update(pairData);
                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #UpdatePairLTEND# " + " UpDownBit : " + UpDownBit + " TrnNo : " + TrnNo + " CurrentRate : " + pairData.CurrentRate, "Object Data : "));
                    //komal 16-11-2018 Set Volume Data avoid DB call
                    VolumeDataRespose VolumeData = new VolumeDataRespose();
                    VolumeData.PairId = PairId;
                    //VolumeData.PairName = _tradeMasterRepository.GetById(PairId).PairName;
                    VolumeData.PairName = _trnMasterConfiguration.GetTradePairMasterArbitrage().Where(e => e.Id == PairId).FirstOrDefault().PairName;
                    VolumeData.Currentrate = pairData.CurrentRate;
                    VolumeData.ChangePer = pairData.ChangePer24;
                    VolumeData.Volume24 = pairData.ChangeVol24;
                    VolumeData.High24Hr = pairData.High24Hr;
                    VolumeData.Low24Hr = pairData.Low24Hr;
                    VolumeData.HighWeek = pairData.HighWeek;
                    VolumeData.LowWeek = pairData.LowWeek;
                    VolumeData.High52Week = pairData.High52Week;
                    VolumeData.Low52Week = pairData.Low52Week;
                    VolumeData.UpDownBit = pairData.UpDownBit;

                    //komal 16-11-2018 Set MArket Data avoid DB call
                    MarketCapData MarketData = new MarketCapData();
                    MarketData.Change24 = pairData.High24Hr - pairData.Low24Hr;
                    MarketData.ChangePer = pairData.ChangePer24;
                    MarketData.High24 = pairData.High24Hr;
                    MarketData.Low24 = pairData.Low24Hr;
                    MarketData.LastPrice = pairData.LTP;
                    MarketData.Volume24 = pairData.ChangeVol24;

                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #VolumeDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #MarketDataToSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                    Task.Run(() => _signalRService.OnVolumeChangeArbitrage(VolumeData, MarketData, UserID));


                    //Uday 25-12-2018  SignalR Call For Market Ticker
                    var PairDetailMarketTicker = _tradeDetailRepositoryArbitrage.GetSingle(x => x.PairId == PairId);
                    if (PairDetailMarketTicker != null)
                    {
                        if (PairDetailMarketTicker.IsMarketTicker == 1)
                        {
                            List<VolumeDataRespose> MarketTickerData = new List<VolumeDataRespose>();
                            MarketTickerData.Add(VolumeData);
                            Task.Run(() => HelperForLog.WriteLogIntoFile(MethodName + " #MarketTickerSocket# #PairId# : " + PairId + " #TrnNo# : " + TrnNo, "FrontService", "Object Data : "));
                            Task.Run(() => _signalRService.MarketTickerArbitrage(MarketTickerData, UserID, "", IsMargin: 0));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPairAdditionalValArbitrage ##TrnNo:" + TrnNo, "FrontTrnService", ex);
                //throw ex;
            }
        }

        public List<GetGraphDetailInfo> GetGraphDetail(long PairId, int IntervalTime, string IntervalData, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<GetGraphDetailInfo> responseData = new List<GetGraphDetailInfo>();

                IOrderedEnumerable<GetGraphDetailInfo> list;
                if (IsMargin == 1)
                    list = _frontTrnRepository.GetGraphDataMargin(PairId, IntervalTime, IntervalData, _basePage.UTC_To_IST()).OrderBy(x => x.DataDate);
                else
                    list = _frontTrnRepository.GetGraphData(PairId, IntervalTime, IntervalData, _basePage.UTC_To_IST()).OrderBy(x => x.DataDate);


                //Uday 14-11-2018 Direct Query On Absolute View So No conversion required
                //DateTime dt2 = new DateTime(1970, 1, 1);
                //responseData = list.Select(a => new GetGraphDetailInfo()
                //{
                //    DataDate = Convert.ToInt64(a.DataDate.Subtract(dt2).TotalMilliseconds),
                //    High = a.High,
                //    Low = a.Low,
                //    Open = a.OpenVal,
                //    Close = a.OpenVal,
                //    Volume = a.Volume,
                //}).ToList();

                //return responseData;

                return list.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public bool addSetteledTradeTransaction(SettledTradeTransactionQueue queueData)
        {
            try
            {
                var model = _settelTradeTranQueue.Add(queueData);
                if (model.Id != 0)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #region Trading Data Method

        public List<GetBuySellBook> GetBuyerBook(long id, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<GetBuySellBook> list;// = _frontTrnRepository.GetBuyerBook(id, Price: -1);
                if (IsMargin == 1)
                    list = _frontTrnRepository.GetBuyerBookMargin(id, Price: -1);
                else
                    list = _frontTrnRepository.GetBuyerBook(id, Price: -1);

                #region unuseddata
                //List<GetBuySellBook> response = new List<GetBuySellBook>();
                //if (list != null)
                //{
                //    foreach (var data in list)
                //    {
                //        if (data.Price > 0 && data.Amount > 0)
                //        {
                //            response.Add(data);
                //        }
                //    }
                //}
                //return responce;
                #endregion
                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetBuySellBook> GetSellerBook(long id, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<GetBuySellBook> list;// = _frontTrnRepository.GetSellerBook(id, Price: -1);
                if (IsMargin == 1)
                    list = _frontTrnRepository.GetSellerBookMargin(id, Price: -1);
                else
                    list = _frontTrnRepository.GetSellerBook(id, Price: -1);

                #region unuseddata
                //List<GetBuySellBook> responce = new List<GetBuySellBook>();
                //if (list != null)
                //{
                //    foreach (var data in list)
                //    {
                //        if (data.Price > 0 && data.Amount > 0)
                //        {
                //            responce.Add(data);
                //        }
                //    }
                //}
                //return responce;
                #endregion 
                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<BasePairResponse> GetTradePairAsset()
        {
            //decimal ChangePer = 0;
            //decimal Volume24 = 0;
            List<BasePairResponse> responsedata;
            try
            {
                responsedata = new List<BasePairResponse>();
                //var basePairData = _marketRepository.GetAll();
                //Rita 01-05-19 added priority ,also added status condition
                IEnumerable<Market> basePairData = _trnMasterConfiguration.GetMarket().Where(x => x.Status == 1).OrderBy(x => x.Priority);//rita 23-2-19 taken from cache Implemented

                var TradePairList = _frontTrnRepository.GetTradePairAsset();

                if (basePairData != null)
                {
                    foreach (var bpair in basePairData)
                    {
                        BasePairResponse basePair = new BasePairResponse();

                        //var baseService = _serviceMasterRepository.GetSingle(x => x.Id == bpair.ServiceID);
                        //Rita 01-05-19 added priority
                        var pairData = TradePairList.Where(x => x.BaseId == bpair.ServiceID).OrderBy(x => x.Priority);
                        if (pairData.Count() > 0)
                        {
                            basePair.BaseCurrencyId = pairData.FirstOrDefault().BaseId;
                            basePair.BaseCurrencyName = pairData.FirstOrDefault().BaseName;
                            basePair.Abbrevation = pairData.FirstOrDefault().BaseCode;

                            List<TradePairRespose> pairList = new List<TradePairRespose>();
                            #region unuseddata
                            //foreach (var pair in pairData)
                            //{
                            //    TradePairRespose tradePair = new TradePairRespose();
                            //    var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pmdata.Id);
                            //    var chidService = _serviceMasterRepository.GetSingle(x => x.Id == pmdata.SecondaryCurrencyId);
                            //    var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pmdata.Id);
                            //    GetPairAdditionalVal(pmdata.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);

                            //    tradePair.PairId = pair.PairId;
                            //    tradePair.Pairname = pair.Pairname;
                            //    tradePair.Currentrate = pair.Currentrate;
                            //    tradePair.BuyFees = pair.BuyFees;
                            //    tradePair.SellFees = pair.SellFees;
                            //    tradePair.ChildCurrency = pair.ChildCurrency;
                            //    tradePair.Abbrevation = pair.Abbrevation;
                            //    tradePair.ChangePer = pair.ChangePer;
                            //    tradePair.Volume = pair.Volume;
                            //    tradePair.High24Hr = pair.High24Hr;
                            //    tradePair.Low24Hr = pair.Low24Hr;
                            //    tradePair.HighWeek = pair.HighWeek;
                            //    tradePair.LowWeek = pair.LowWeek;
                            //    tradePair.High52Week = pair.High52Week;
                            //    tradePair.Low52Week = pair.Low52Week;
                            //    tradePair.UpDownBit = pair.UpDownBit;

                            //    pairList.Add(tradePair);
                            //}
                            #endregion
                            pairList = pairData.Select(pair => new TradePairRespose
                            {
                                PairId = pair.PairId,
                                Pairname = pair.Pairname,
                                Currentrate = pair.Currentrate,
                                BuyFees = pair.BuyFees,
                                SellFees = pair.SellFees,
                                ChildCurrency = pair.ChildCurrency,
                                Abbrevation = pair.Abbrevation,
                                ChangePer = pair.ChangePer,
                                Volume = pair.Volume,
                                High24Hr = pair.High24Hr,
                                Low24Hr = pair.Low24Hr,
                                HighWeek = pair.HighWeek,
                                LowWeek = pair.LowWeek,
                                High52Week = pair.High52Week,
                                Low52Week = pair.Low52Week,
                                UpDownBit = pair.UpDownBit,
                            }).ToList();

                            basePair.PairList = pairList;
                            responsedata.Add(basePair);
                        }
                    }
                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 23-2-19 for margin trading
        public List<BasePairResponse> GetTradePairAssetMargin()
        {
            List<BasePairResponse> responsedata;
            try
            {
                responsedata = new List<BasePairResponse>();
                //IEnumerable<MarketMargin> basePairData = _marketRepositoryMargin.GetAll();
                //Rita 01-05-19 added priority,also added status condition
                IEnumerable<MarketMargin> basePairData = _trnMasterConfiguration.GetMarketMargin().Where(x => x.Status == 1).OrderBy(x => x.Priority);

                var TradePairList = _frontTrnRepository.GetTradePairAssetMargin();

                if (basePairData != null)
                {
                    foreach (var bpair in basePairData)
                    {
                        BasePairResponse basePair = new BasePairResponse();
                        //Rita 01-05-19 added priority
                        var pairData = TradePairList.Where(x => x.BaseId == bpair.ServiceID).OrderBy(x => x.Priority);
                        if (pairData.Count() > 0)
                        {
                            basePair.BaseCurrencyId = pairData.FirstOrDefault().BaseId;
                            basePair.BaseCurrencyName = pairData.FirstOrDefault().BaseName;
                            basePair.Abbrevation = pairData.FirstOrDefault().BaseCode;

                            List<TradePairRespose> pairList = new List<TradePairRespose>();
                            pairList = pairData.Select(pair => new TradePairRespose
                            {
                                PairId = pair.PairId,
                                Pairname = pair.Pairname,
                                Currentrate = pair.Currentrate,
                                BuyFees = pair.BuyFees,
                                SellFees = pair.SellFees,
                                ChildCurrency = pair.ChildCurrency,
                                Abbrevation = pair.Abbrevation,
                                ChangePer = pair.ChangePer,
                                Volume = pair.Volume,
                                High24Hr = pair.High24Hr,
                                Low24Hr = pair.Low24Hr,
                                HighWeek = pair.HighWeek,
                                LowWeek = pair.LowWeek,
                                High52Week = pair.High52Week,
                                Low52Week = pair.Low52Week,
                                UpDownBit = pair.UpDownBit,
                            }).ToList();

                            basePair.PairList = pairList;
                            responsedata.Add(basePair);
                        }
                    }
                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public List<VolumeDataRespose> GetVolumeData(long BasePairId, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            //decimal ChangePer = 0;
            // decimal Volume24 = 0;

            List<VolumeDataRespose> responsedata;
            try
            {
                responsedata = new List<VolumeDataRespose>();
                //var pairMasterData = _tradeMasterRepository.FindBy(x => x.BaseCurrencyId == BasePairId);
                List<TradePairTableResponse> TradePairList;// = _frontTrnRepository.GetTradePairAsset(BasePairId);
                //var pairMasterData = TradePairList.Where(x => x.BaseId == BasePairId).ToList();
                if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
                    TradePairList = _frontTrnRepository.GetTradePairAssetMargin(BasePairId);
                else
                    TradePairList = _frontTrnRepository.GetTradePairAsset(BasePairId);

                if (TradePairList != null && TradePairList.Count() > 0)
                {
                    foreach (var pmdata in TradePairList)
                    {
                        VolumeDataRespose volumedata = new VolumeDataRespose();
                        //var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pmdata.Id);
                        //var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pmdata.Id);
                        //GetPairAdditionalVal(pmdata.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);


                        volumedata.PairId = pmdata.PairId;
                        volumedata.PairName = pmdata.Pairname;
                        volumedata.Currentrate = pmdata.Currentrate;
                        //volumedata.ChangePer = System.Math.Round(Volume24, 2);
                        //volumedata.Volume24 = System.Math.Round(ChangePer, 2);
                        volumedata.ChangePer = pmdata.ChangePer;
                        volumedata.Volume24 = pmdata.Volume;
                        volumedata.High24Hr = pmdata.High24Hr;
                        volumedata.Low24Hr = pmdata.Low24Hr;
                        volumedata.HighWeek = pmdata.HighWeek;
                        volumedata.LowWeek = pmdata.LowWeek;
                        volumedata.High52Week = pmdata.High52Week;
                        volumedata.Low52Week = pmdata.Low52Week;
                        volumedata.UpDownBit = pmdata.UpDownBit;

                        responsedata.Add(volumedata);
                    }
                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public VolumeDataRespose GetVolumeDataByPair(long PairId)
        {
            //decimal ChangePer = 0;
            //decimal Volume24 = 0;

            VolumeDataRespose responsedata;
            try
            {
                responsedata = new VolumeDataRespose();
                var pairMasterData = _tradeMasterRepository.GetActiveById(PairId);

                if (pairMasterData != null)
                {
                    var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pairMasterData.Id);
                    var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pairMasterData.Id);
                    //GetPairAdditionalVal(pairMasterData.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);

                    responsedata.PairId = pairMasterData.Id;
                    responsedata.PairName = pairMasterData.PairName;
                    responsedata.Currentrate = pairStastics.CurrentRate;
                    //volumedata.ChangePer = System.Math.Round(Volume24, 2);
                    //volumedata.Volume24 = System.Math.Round(ChangePer, 2);
                    responsedata.ChangePer = pairStastics.ChangePer24;
                    responsedata.Volume24 = pairStastics.ChangeVol24;
                    responsedata.High24Hr = pairStastics.High24Hr;
                    responsedata.Low24Hr = pairStastics.Low24Hr;
                    responsedata.HighWeek = pairStastics.HighWeek;
                    responsedata.LowWeek = pairStastics.LowWeek;
                    responsedata.High52Week = pairStastics.High52Week;
                    responsedata.Low52Week = pairStastics.Low52Week;
                    responsedata.UpDownBit = pairStastics.UpDownBit;

                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 23-2-19 for margin trading
        public VolumeDataRespose GetVolumeDataByPairMargin(long PairId)
        {
            VolumeDataRespose responsedata;
            try
            {
                responsedata = new VolumeDataRespose();
                //var pairMasterData = _tradeMasterRepository.GetActiveById(PairId);
                TradePairMasterMargin pairMasterData = _trnMasterConfiguration.GetTradePairMasterMargin().Where(e => e.Id == PairId && e.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();

                if (pairMasterData != null)
                {
                    TradePairDetailMargin pairDetailData = _trnMasterConfiguration.GetTradePairDetailMargin().Where(x => x.PairId == pairMasterData.Id).FirstOrDefault();
                    TradePairStasticsMargin pairStastics = _tradePairStasticsMargin.GetSingle(x => x.PairId == pairMasterData.Id);
                    //GetPairAdditionalVal(pairMasterData.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);

                    responsedata.PairId = pairMasterData.Id;
                    responsedata.PairName = pairMasterData.PairName;
                    responsedata.Currentrate = pairStastics.CurrentRate;
                    //volumedata.ChangePer = System.Math.Round(Volume24, 2);
                    //volumedata.Volume24 = System.Math.Round(ChangePer, 2);
                    responsedata.ChangePer = pairStastics.ChangePer24;
                    responsedata.Volume24 = pairStastics.ChangeVol24;
                    responsedata.High24Hr = pairStastics.High24Hr;
                    responsedata.Low24Hr = pairStastics.Low24Hr;
                    responsedata.HighWeek = pairStastics.HighWeek;
                    responsedata.LowWeek = pairStastics.LowWeek;
                    responsedata.High52Week = pairStastics.High52Week;
                    responsedata.Low52Week = pairStastics.Low52Week;
                    responsedata.UpDownBit = pairStastics.UpDownBit;

                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public PairRatesResponse GetPairRates(long PairId, short IsMargin = 0)//Rita 23-2-19 for Margin Trading Data bit
        {
            try
            {
                PairRatesResponse responseData = new PairRatesResponse();

                if (IsMargin == 1)
                    responseData = _frontTrnRepository.GetPairRatesMargin(PairId);
                else
                    responseData = _frontTrnRepository.GetPairRates(PairId);

                return responseData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public GetTradePairByName GetTradePairByName(long id)
        {
            //decimal ChangePer = 0;
            // decimal Volume24 = 0;
            GetTradePairByName responsedata = new GetTradePairByName();
            try
            {
                var pairMasterData = _tradeMasterRepository.GetById(id);
                if (pairMasterData != null)
                {

                    var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pairMasterData.Id);
                    var baseService = _serviceMasterRepository.GetSingle(x => x.Id == pairMasterData.BaseCurrencyId);
                    var chidService = _serviceMasterRepository.GetSingle(x => x.Id == pairMasterData.SecondaryCurrencyId);
                    var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pairMasterData.Id);
                    //GetPairAdditionalVal(pairMasterData.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);

                    responsedata.PairId = pairMasterData.Id;
                    responsedata.Pairname = pairMasterData.PairName;
                    responsedata.Currentrate = pairStastics.CurrentRate;
                    responsedata.BuyFees = pairDetailData.BuyFees;
                    responsedata.SellFees = pairDetailData.SellFees;
                    responsedata.ChildCurrency = chidService.Name;
                    responsedata.Abbrevation = chidService.SMSCode;
                    //tradePair.ChangePer = System.Math.Round(ChangePer, 2);
                    //tradePair.Volume = System.Math.Round(Volume24, 2);
                    responsedata.ChangePer = pairStastics.ChangePer24;
                    responsedata.Volume = pairStastics.ChangeVol24;
                    responsedata.High24Hr = pairStastics.High24Hr;
                    responsedata.Low24Hr = pairStastics.Low24Hr;
                    responsedata.HighWeek = pairStastics.HighWeek;
                    responsedata.LowWeek = pairStastics.LowWeek;
                    responsedata.High52Week = pairStastics.High52Week;
                    responsedata.Low52Week = pairStastics.Low52Week;
                    responsedata.UpDownBit = pairStastics.UpDownBit;

                    responsedata.BaseCurrencyId = baseService.Id;
                    responsedata.BaseCurrencyName = baseService.Name;
                    responsedata.BaseAbbrevation = baseService.SMSCode;
                }
                return responsedata;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public GetTradePairByName GetTradePairByNameMargin(long id)
        {
            //decimal ChangePer = 0;
            // decimal Volume24 = 0;
            GetTradePairByName responsedata = new GetTradePairByName();
            try
            {
                //var pairMasterData = _tradeMasterRepository.GetById(id);
                TradePairMasterMargin pairMasterData = _trnMasterConfiguration.GetTradePairMasterMargin().Where(e => e.Id == id).FirstOrDefault();

                if (pairMasterData != null)
                {

                    TradePairDetailMargin pairDetailData = _trnMasterConfiguration.GetTradePairDetailMargin().Where(x => x.PairId == pairMasterData.Id).FirstOrDefault();
                    ServiceMasterMargin baseService = _trnMasterConfiguration.GetServicesMargin().Where(x => x.Id == pairMasterData.BaseCurrencyId).FirstOrDefault();
                    ServiceMasterMargin chidService = _trnMasterConfiguration.GetServicesMargin().Where(x => x.Id == pairMasterData.SecondaryCurrencyId).FirstOrDefault();
                    TradePairStasticsMargin pairStastics = _tradePairStasticsMargin.GetSingle(x => x.PairId == pairMasterData.Id);

                    responsedata.PairId = pairMasterData.Id;
                    responsedata.Pairname = pairMasterData.PairName;
                    responsedata.Currentrate = pairStastics.CurrentRate;
                    responsedata.BuyFees = pairDetailData.BuyFees;
                    responsedata.SellFees = pairDetailData.SellFees;
                    responsedata.ChildCurrency = chidService.Name;
                    responsedata.Abbrevation = chidService.SMSCode;
                    //tradePair.ChangePer = System.Math.Round(ChangePer, 2);
                    //tradePair.Volume = System.Math.Round(Volume24, 2);
                    responsedata.ChangePer = pairStastics.ChangePer24;
                    responsedata.Volume = pairStastics.ChangeVol24;
                    responsedata.High24Hr = pairStastics.High24Hr;
                    responsedata.Low24Hr = pairStastics.Low24Hr;
                    responsedata.HighWeek = pairStastics.HighWeek;
                    responsedata.LowWeek = pairStastics.LowWeek;
                    responsedata.High52Week = pairStastics.High52Week;
                    responsedata.Low52Week = pairStastics.Low52Week;
                    responsedata.UpDownBit = pairStastics.UpDownBit;

                    responsedata.BaseCurrencyId = baseService.Id;
                    responsedata.BaseCurrencyName = baseService.Name;
                    responsedata.BaseAbbrevation = baseService.SMSCode;
                }
                return responsedata;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public MarketCapData GetMarketCap(long PairId)
        {
            try
            {
                MarketCapData dataRes = new MarketCapData();
                VolumeDataRespose res = new VolumeDataRespose();
                var pairMasterData = _tradeMasterRepository.GetById(PairId);
                if (pairMasterData != null)
                {
                    var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pairMasterData.Id);
                    if (pairStastics != null)
                    {
                        dataRes.Change24 = pairStastics.High24Hr - pairStastics.Low24Hr;
                        dataRes.ChangePer = pairStastics.ChangePer24;
                        dataRes.High24 = pairStastics.High24Hr;
                        dataRes.Low24 = pairStastics.Low24Hr;
                        dataRes.LastPrice = pairStastics.LTP;
                        dataRes.Volume24 = pairStastics.ChangeVol24;
                    }
                }
                return dataRes;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public MarketCapData GetMarketCapMargin(long PairId)
        {
            try
            {
                MarketCapData dataRes = new MarketCapData();
                VolumeDataRespose res = new VolumeDataRespose();
                //var pairMasterData = _tradeMasterRepository.GetById(PairId);
                TradePairMasterMargin pairMasterData = _trnMasterConfiguration.GetTradePairMasterMargin().Where(e => e.Id == PairId).FirstOrDefault();
                if (pairMasterData != null)
                {
                    var pairStastics = _tradePairStasticsMargin.GetSingle(x => x.PairId == pairMasterData.Id);
                    if (pairStastics != null)
                    {
                        dataRes.Change24 = pairStastics.High24Hr - pairStastics.Low24Hr;
                        dataRes.ChangePer = pairStastics.ChangePer24;
                        dataRes.High24 = pairStastics.High24Hr;
                        dataRes.Low24 = pairStastics.Low24Hr;
                        dataRes.LastPrice = pairStastics.LTP;
                        dataRes.Volume24 = pairStastics.ChangeVol24;
                    }
                }
                return dataRes;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public long GetPairIdByName(string pair, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            long PairID = 0;
            try
            {
                if (IsMargin == 1)
                {
                    TradePairMasterMargin TradePairMarginObj = _trnMasterConfiguration.GetTradePairMasterMargin().Where(p => p.PairName == pair && p.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                    if (TradePairMarginObj == null)
                        return 0;
                    PairID = TradePairMarginObj.Id;
                }
                else
                {
                    TradePairMaster TradePairObj = _trnMasterConfiguration.GetTradePairMaster().Where(p => p.PairName == pair && p.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                    if (TradePairObj == null)
                        return 0;
                    PairID = TradePairObj.Id;
                }

                //return _frontTrnRepository.GetPairIdByName(pair);
                return PairID;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public long GetBasePairIdByName(string BasePair, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            long BasePairID = 0;
            try
            {

                if (IsMargin == 1)
                {
                    ServiceMasterMargin ServiceMasterMarginObj = _trnMasterConfiguration.GetServicesMargin().Where(p => p.SMSCode == BasePair).FirstOrDefault();
                    if (ServiceMasterMarginObj == null)
                        return 0;
                    BasePairID = ServiceMasterMarginObj.Id;
                }
                else
                {
                    ServiceMaster ServiceMasterObj = _trnMasterConfiguration.GetServices().Where(p => p.SMSCode == BasePair).FirstOrDefault();
                    if (ServiceMasterObj == null)
                        return 0;
                    BasePairID = ServiceMasterObj.Id;
                }

                //var model = _serviceMasterRepository.GetSingle(x => x.SMSCode == BasePair);
                //if (model == null)
                //    return 0;

                //return model.Id;
                return BasePairID;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<VolumeDataRespose> GetMarketTicker(short IsMargin = 0)//Rita 23-2-19 for Margin Trading Data bit
        {
            try
            {
                List<VolumeDataRespose> list;// = _backOfficeTrnRepository.GetUpdatedMarketTicker();
                if (IsMargin == 1)
                    list = _backOfficeTrnRepository.GetUpdatedMarketTickerMargin();
                else
                    list = _backOfficeTrnRepository.GetUpdatedMarketTicker();

                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public int GetMarketTickerSignalR(short IsMargin = 0)//Rita 23-2-19 for Margin Trading Data bit
        {
            try
            {
                List<VolumeDataRespose> list;// = _backOfficeTrnRepository.GetUpdatedMarketTicker();
                if (IsMargin == 1)
                    list = _backOfficeTrnRepository.GetUpdatedMarketTickerMargin();
                else
                    list = _backOfficeTrnRepository.GetUpdatedMarketTicker();

                if (list.Count != 0)
                {
                    _signalRService.MarketTicker(list, "");
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public GetBuySellMarketBook GetMarketDepthChart(long PairId)
        {
            GetBuySellMarketBook Response = new GetBuySellMarketBook();
            try
            {
                decimal UpdatedAmount = 0;
                var BuyerBookData = _frontTrnRepository.GetBuyerBook(PairId, Price: -1); // Uday 08-01-2019 Change Order For Data From Ascending to Descending
                var SellerBookData = _frontTrnRepository.GetSellerBook(PairId, Price: -1);

                List<GetBuySellMarketBookData> BuySellBookData = new List<GetBuySellMarketBookData>();
                if (BuyerBookData.Count < 0 && SellerBookData.Count < 0) // if both have no data than give error no data found
                {
                    return null;
                }
                else
                {
                    //Buyer Book Calculation
                    BuySellBookData = new List<GetBuySellMarketBookData>();
                    if (BuyerBookData.Count > 0)  //Bid array calculation for market depth chart
                    {
                        foreach (var BuyerData in BuyerBookData)
                        {
                            GetBuySellMarketBookData Data = new GetBuySellMarketBookData();
                            UpdatedAmount = UpdatedAmount + BuyerData.Amount;

                            Data.Price = BuyerData.Price;
                            Data.Amount = UpdatedAmount;

                            BuySellBookData.Add(Data); //Add buyer book object after market depth calculation.
                        }
                    }
                    Response.Bid = BuySellBookData;


                    //Seller Book Calculation
                    UpdatedAmount = 0;  // For Seller Book reinitialize the amount.
                    BuySellBookData = new List<GetBuySellMarketBookData>();
                    if (SellerBookData.Count > 0)  //Bid array calculation for market depth chart
                    {
                        foreach (var SellerData in SellerBookData)
                        {
                            GetBuySellMarketBookData Data = new GetBuySellMarketBookData();
                            UpdatedAmount = UpdatedAmount + SellerData.Amount;

                            Data.Price = SellerData.Price;
                            Data.Amount = UpdatedAmount;

                            BuySellBookData.Add(Data); //Add buyer book object after market depth calculation.
                        }
                    }
                    Response.Ask = BuySellBookData;
                }

                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 23-2-19 for Margin Trading Data bit
        public GetBuySellMarketBook GetMarketDepthChartMargin(long PairId)
        {
            GetBuySellMarketBook Response = new GetBuySellMarketBook();
            try
            {
                decimal UpdatedAmount = 0;
                var BuyerBookData = _frontTrnRepository.GetBuyerBookMargin(PairId, Price: -1); // Uday 08-01-2019 Change Order For Data From Ascending to Descending
                var SellerBookData = _frontTrnRepository.GetSellerBookMargin(PairId, Price: -1);

                List<GetBuySellMarketBookData> BuySellBookData = new List<GetBuySellMarketBookData>();
                if (BuyerBookData.Count < 0 && SellerBookData.Count < 0) // if both have no data than give error no data found
                {
                    return null;
                }
                else
                {
                    //Buyer Book Calculation
                    BuySellBookData = new List<GetBuySellMarketBookData>();
                    if (BuyerBookData.Count > 0)  //Bid array calculation for market depth chart
                    {
                        foreach (var BuyerData in BuyerBookData)
                        {
                            GetBuySellMarketBookData Data = new GetBuySellMarketBookData();
                            UpdatedAmount = UpdatedAmount + BuyerData.Amount;

                            Data.Price = BuyerData.Price;
                            Data.Amount = UpdatedAmount;

                            BuySellBookData.Add(Data); //Add buyer book object after market depth calculation.
                        }
                    }
                    Response.Bid = BuySellBookData;


                    //Seller Book Calculation
                    UpdatedAmount = 0;  // For Seller Book reinitialize the amount.
                    BuySellBookData = new List<GetBuySellMarketBookData>();
                    if (SellerBookData.Count > 0)  //Bid array calculation for market depth chart
                    {
                        foreach (var SellerData in SellerBookData)
                        {
                            GetBuySellMarketBookData Data = new GetBuySellMarketBookData();
                            UpdatedAmount = UpdatedAmount + SellerData.Amount;

                            Data.Price = SellerData.Price;
                            Data.Amount = UpdatedAmount;

                            BuySellBookData.Add(Data); //Add buyer book object after market depth calculation.
                        }
                    }
                    Response.Ask = BuySellBookData;
                }

                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //public List<HistoricalPerformanceYear> GetHistoricalPerformance(long UserId)
        //{
        //    try
        //    {
        //        decimal MonthStartValue = 0, MonthEndValue = 0, DepositValue=0, WithdrwalValue=0;
        //        List<HistoricalPerformanceYear> Response = new List<HistoricalPerformanceYear>();
        //        List<HistoricalPerformanceMonth> MonthWiseData = new List<HistoricalPerformanceMonth>();
        //        List<HistoricalPerformanceYear> YearWiseData = new List<HistoricalPerformanceYear>(); 

        //        //Get Starting of the month Equity Value From User wallet
        //        var MonthStartWallet = _walletService.ListWallet(UserId);

        //        //Get Ending of the month Equity Value From User wallet
        //        var MonthEndWallet = _walletService.ListWallet(UserId);


        //        //Calculate Coin value to dollar convertion for MonthStart  
        //        if (MonthStartWallet.Wallets != null)
        //        {
        //            if (MonthStartWallet.Wallets.Count > 0)
        //            {
        //                foreach (var wallet in MonthStartWallet.Wallets)
        //                {
        //                    MonthStartValue = MonthStartValue + (wallet.Balance * 72);  // Uday 08-01-2018  Take 72 doller value static because not implement the dollar conversation for coin
        //                }
        //            }
        //        }
        //        //MonthStartValue /= 1.2M;


        //        //Calculate Coin value to dollar convertion for MonthEnd
        //        if (MonthEndWallet.Wallets != null)
        //        {
        //            if (MonthEndWallet.Wallets.Count > 0)
        //            {
        //                foreach (var wallet in MonthEndWallet.Wallets)
        //                {
        //                    MonthEndValue = MonthEndValue + ((wallet.Balance) * 72);  // Uday 08-01-2018  Take 72 doller value static because not implement the dollar conversation for coin
        //                }
        //            }
        //        }
        //       // MonthEndValue /= 3.7M;    

        //        //Get The Total Withdrwal Value of current month
        //        DepositValue = _frontTrnRepository.GetHistoricalPerformanceData(UserId,1);


        //        //Get The Total Deposit value of current month
        //        WithdrwalValue = _frontTrnRepository.GetHistoricalPerformanceData(UserId, 2);


        //        //Calculate Performance Value
        //        decimal Value1 = (MonthEndValue + WithdrwalValue);
        //        decimal Value2 = (MonthStartValue + DepositValue);
        //        decimal Value3 = Value1 - Value2;
        //        decimal Value4 = 0;

        //        //Uday 08-01-2019 Give data month wise in response
        //        HistoricalPerformanceMonth CurrentMonth = new HistoricalPerformanceMonth();
        //        if (Value2 != 0)
        //        {
        //            CurrentMonth.MonthName = _basePage.UTC_To_IST().ToString("MMMMM");
        //            CurrentMonth.PerformanceValue = (Value3 / Value2) * 100;
        //            Value4 = (Value3 / Value2);
        //            CurrentMonth.PerformanceCurrency = "USD";
        //            CurrentMonth.MonthIndex = _basePage.UTC_To_IST().Month;
        //        }
        //        else
        //        {
        //            CurrentMonth.MonthName = _basePage.UTC_To_IST().ToString("MMMMM");
        //            CurrentMonth.PerformanceValue = 0;
        //            CurrentMonth.PerformanceCurrency = "USD";
        //            CurrentMonth.MonthIndex = _basePage.UTC_To_IST().Month;
        //        }
        //        MonthWiseData.Add(CurrentMonth);


        //        //Calculate For Current Year Wise Calculation
        //        HistoricalPerformanceYear CurrentYear = new HistoricalPerformanceYear();
        //        CurrentYear.MonthData = MonthWiseData;
        //        CurrentYear.Year = _basePage.UTC_To_IST().Year;
        //        CurrentYear.PerformanceValue = 1 + Value4;  //For All Month Calculate Sum (1+M1)(1+M2)
        //        YearWiseData.Add(CurrentYear);

        //        Response = YearWiseData;
        //        return Response;
        //    }
        //    catch(Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        #region Historical Performance Year Wise Method Of Wallet
        //public List<HistoricalPerformanceYear> GetHistoricalPerformance(long UserId)
        //{
        //    try
        //    {
        //        string[] FullMonths = { "null", "January", "February", "March", "April", "May", "June",
        //                                    "July", "August", "September", "October", "November", "December" };

        //        int IsMonthValue = 0;
        //        int StartingMonth=0, EndingMonth=0;
        //        decimal Value1=0, Value2=0, Value3=0, Value4=0, YearlyPerformance = 0;
        //        decimal MonthStartValue = 0, MonthEndValue = 0, DepositValue = 0, WithdrwalValue = 0;
        //        var JoiningDate = _userService.GetUserJoiningDate(UserId);
        //        var CurrentDate = Helpers.UTC_To_IST();
        //        List<HistoricalPerformanceYear> Response = new List<HistoricalPerformanceYear>();

        //        for (short i=Convert.ToInt16(JoiningDate.Year); i <= Convert.ToInt16(CurrentDate.Year);i++)
        //        {
        //            HistoricalPerformanceYear YearData = new HistoricalPerformanceYear();
        //            List<HistoricalPerformanceMonth> MonthWiseData = new List<HistoricalPerformanceMonth>();
        //            HistoricalPerformanceMonth MonthData = new HistoricalPerformanceMonth();
        //            var StasticsData = _walletService.GetYearwiseWalletStatistics(UserId, i);
        //            YearlyPerformance = 1;
        //            if (StasticsData.ReturnCode == 0)
        //            {
        //                //MonthWiseData Calculation

        //                var MonthStasticsData = StasticsData.Balances.MonthwiseData.TranAmount;

        //                if (CurrentDate.Year == JoiningDate.Year)
        //                {
        //                    StartingMonth = JoiningDate.Month;
        //                    EndingMonth = CurrentDate.Month;
        //                }
        //                else if(JoiningDate.Year == i)
        //                {
        //                    StartingMonth = JoiningDate.Month;
        //                    EndingMonth = 12;
        //                }
        //                else if (CurrentDate.Year == i)
        //                {
        //                    StartingMonth = 1;
        //                    EndingMonth = CurrentDate.Month;
        //                }
        //                else
        //                {
        //                    StartingMonth = 1;
        //                    EndingMonth = 12;
        //                }

        //                for (int j = StartingMonth; j<= EndingMonth; j++)
        //                {

        //                    IsMonthValue = 0;
        //                    MonthData = new HistoricalPerformanceMonth();
        //                    for (int k=0;k<MonthStasticsData.Count;k++)
        //                    {
        //                        if(j == MonthStasticsData[k].Month)
        //                        {

        //                            //MonthStartValue = MonthStasticsData[k].StartingBalance;
        //                            //MonthEndValue = MonthStasticsData[k].EndingBalance;
        //                            MonthStartValue = 250000;
        //                            MonthEndValue = 270550;

        //                            if (MonthStasticsData[k].Data[0].TrnTypeId == 9) // Withdrwal
        //                            {
        //                                WithdrwalValue = MonthStasticsData[k].Data[0].TotalAmount;
        //                            }
        //                            else // Deposit
        //                            {
        //                                DepositValue = MonthStasticsData[k].Data[0].TotalAmount;
        //                            }


        //                            if (MonthStasticsData[k].Data[1].TrnTypeId == 9) // Withdrwal
        //                            {
        //                                WithdrwalValue = MonthStasticsData[k].Data[1].TotalAmount;
        //                            }
        //                            else // Deposit
        //                            {
        //                                DepositValue = MonthStasticsData[k].Data[1].TotalAmount;
        //                            }

        //                            //Calculate Performance Value
        //                            Value1 = (MonthEndValue + WithdrwalValue);
        //                            Value2 = (MonthStartValue + DepositValue);
        //                            Value3 = Value1 - Value2;

        //                            if (Value2 != 0)
        //                            {
        //                                MonthData.MonthName = FullMonths[MonthStasticsData[k].Month];
        //                                MonthData.PerformanceValue = (Value3 / Value2) * 100;
        //                                Value4 = Value3 / Value2;
        //                                MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
        //                                MonthData.MonthIndex = MonthStasticsData[k].Month;
        //                            }
        //                            else
        //                            {
        //                                MonthData.MonthName = FullMonths[MonthStasticsData[k].Month];
        //                                MonthData.PerformanceValue = 0;
        //                                Value4 = 0;
        //                                MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
        //                                MonthData.MonthIndex = MonthStasticsData[k].Month;
        //                            }
        //                            MonthWiseData.Add(MonthData);
        //                            IsMonthValue = 1;
        //                            break;
        //                        }
        //                    }
        //                    if(IsMonthValue ==0)  // Month Data Not Available (No Any Transaction)
        //                    {
        //                        MonthData.MonthName = FullMonths[j];
        //                        MonthData.PerformanceValue = 0;
        //                        MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
        //                        MonthData.MonthIndex = j;
        //                        MonthWiseData.Add(MonthData);
        //                    }

        //                    YearlyPerformance *= (1 + Value4);
        //                }

        //                YearData.Year = i;
        //                YearData.MonthData = MonthWiseData;
        //                YearData.PerformanceValue = YearlyPerformance;

        //                Response.Add(YearData);
        //            }                  
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        #endregion

        public List<HistoricalPerformanceYear> GetHistoricalPerformance(long UserId)
        {
            try
            {
                string[] FullMonths = { "null", "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December" };

                int StartingMonth = 0, EndingMonth = 0;
                decimal Value1 = 0, Value2 = 0, Value3 = 0, Value4 = 0, YearlyPerformance = 0;
                decimal MonthStartValue = 0, MonthEndValue = 0, DepositValue = 0, WithdrwalValue = 0;
                var userAvailable = _userService.GetUserById(UserId);

                if (userAvailable == false)
                {
                    return null;
                }

                var JoiningDate = _userService.GetUserJoiningDate(UserId);
                var CurrentDate = Helpers.UTC_To_IST();
                List<HistoricalPerformanceYear> Response = new List<HistoricalPerformanceYear>();

                for (short i = Convert.ToInt16(CurrentDate.Year); i >= Convert.ToInt16(JoiningDate.Year); i--)
                {
                    HistoricalPerformanceYear YearData = new HistoricalPerformanceYear();
                    //List<HistoricalPerformanceMonth> MonthWiseData = new List<HistoricalPerformanceMonth>();
                    //HistoricalPerformanceMonth MonthData = new HistoricalPerformanceMonth();
                    decimal[] Monthdata = new decimal[12];
                    //var StasticsData = _walletService.GetYearwiseWalletStatistics(UserId, i);
                    YearlyPerformance = 1;


                    //var MonthStasticsData = StasticsData.Balances.MonthwiseData.TranAmount;

                    //if (CurrentDate.Year == JoiningDate.Year)
                    //{
                    //    StartingMonth = JoiningDate.Month;
                    //    EndingMonth = CurrentDate.Month;
                    //}
                    //else if (JoiningDate.Year == i)
                    //{
                    //    StartingMonth = JoiningDate.Month;
                    //    EndingMonth = 12;
                    //}
                    //else if (CurrentDate.Year == i)
                    //{
                    //    StartingMonth = 1;
                    //    EndingMonth = CurrentDate.Month;
                    //}
                    //else
                    //{
                    //    StartingMonth = 1;
                    //    EndingMonth = 12;
                    //}

                    StartingMonth = 1;
                    EndingMonth = 12;

                    for (int j = StartingMonth; j <= EndingMonth; j++)
                    {

                        //MonthData = new HistoricalPerformanceMonth();
                        var MonthStasticsData = _walletService.GetMonthwiseWalletStatistics(UserId, Convert.ToInt16(j), i);

                        if (MonthStasticsData.ReturnCode == 0)
                        {
                            var MonthTranData = MonthStasticsData.Balances.TranAmount;
                            MonthStartValue = MonthStasticsData.Balances.StartingBalance;
                            MonthEndValue = MonthStasticsData.Balances.EndingBalance;

                            if (MonthTranData[0].TrnTypeId == 9) // Withdrwal
                            {
                                WithdrwalValue = MonthTranData[0].TotalAmount;
                            }
                            else // Deposit
                            {
                                DepositValue = MonthTranData[0].TotalAmount;
                            }


                            if (MonthTranData[1].TrnTypeId == 9) // Withdrwal
                            {
                                WithdrwalValue = MonthTranData[1].TotalAmount;
                            }
                            else // Deposit
                            {
                                DepositValue = MonthTranData[1].TotalAmount;
                            }

                            //Calculate Performance Value
                            Value1 = (MonthEndValue + WithdrwalValue);
                            Value2 = (MonthStartValue + DepositValue);
                            Value3 = Value1 - Value2;

                            if (Value2 != 0)
                            {
                                Monthdata[j - 1] = Helpers.DoRoundForTrading(((Value3 / Value2) * 100), 3);
                                //MonthData.MonthName = FullMonths[j];
                                //MonthData.PerformanceValue = (Value3 / Value2) * 100;
                                Value4 = Helpers.DoRoundForTrading(((Value3 / Value2) * 100), 3);
                                //MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
                                //MonthData.MonthIndex = j;
                            }
                            else
                            {
                                Monthdata[j - 1] = 0;
                                //MonthData.MonthName = FullMonths[j];
                                //MonthData.PerformanceValue = 0;
                                Value4 = 0;
                                //MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
                                //MonthData.MonthIndex = j;
                            }
                            //MonthWiseData.Add(MonthData);
                        }
                        else
                        {
                            Monthdata[j - 1] = 0;
                            //MonthData.MonthName = FullMonths[j];
                            //MonthData.PerformanceValue = 0;
                            //MonthData.PerformanceCurrency = StasticsData.BaseCurrency;
                            //MonthData.MonthIndex = j;
                            //MonthWiseData.Add(MonthData);
                        }
                        YearlyPerformance *= (1 + Value4);
                    }

                    YearData.Year = i;
                    if (YearlyPerformance == 1)
                    {
                        YearData.Total = 0;
                    }
                    else
                    {
                        YearData.Total = Helpers.DoRoundForTrading(YearlyPerformance, 3);
                    }
                    YearData.Data = Monthdata;
                    //YearData.MonthData = MonthWiseData;
                    //YearData.PerformanceValue = YearlyPerformance;

                    Response.Add(YearData);
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<HistoricalPerformanceYear> GetHistoricalPerformanceV1(long UserId)
        {
            try
            {
                string[] FullMonths = { "null", "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December" };

                var userAvailable = _userService.GetUserById(UserId);
                if (userAvailable == false)
                {
                    return null;
                }

                var JoiningDate = _userService.GetUserJoiningDate(UserId);
                var CurrentDate = Helpers.UTC_To_IST();
                List<HistoricalPerformanceYear> Response = new List<HistoricalPerformanceYear>();

                for (short i = Convert.ToInt16(CurrentDate.Year); i >= Convert.ToInt16(JoiningDate.Year); i--)
                {
                    HistoricalPerformanceYear YearData = new HistoricalPerformanceYear();
                    YearData.Year = i;
                    decimal[] Monthdata = new decimal[13];
                    var monthObjs = _walletRepository.GetHistoricalPerformanceYearWise(UserId, i);
                    foreach (var m in monthObjs)
                    {

                        Monthdata[m.AutoNo] = m.ProfitPer;
                    }
                    Monthdata[0] = 0;
                    YearData.Data = Monthdata;
                    Response.Add(YearData);
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public GetWithdrawalTransactionData GetWithdrawalTransaction(string RefId)
        {
            try
            {
                GetWithdrawalTransactionData Response = new GetWithdrawalTransactionData();

                var Data = _transactionQueue.GetSingle(x => x.GUID.ToString() == RefId);
                if (Data != null)
                {
                    Response.TrnNo = Data.Id;
                    Response.TransactionAddress = Data.TransactionAccount;
                    Response.TrnDate = Data.TrnDate;
                    Response.Amount = Data.Amount;
                    Response.Currency = Data.SMSCode;
                    Response.Status = Data.Status;
                    Response.Fee = Convert.ToDecimal(Data.ChargeRs);
                    Response.IsVerified = Data.IsVerified;
                    Response.CurrencyName = Data.ChargeCurrency;

                    if (Data.Status == 4 || Data.Status == 6)
                    {
                        Response.StatusMsg = ((EnWithdrwalConfirmationStatus)Data.IsVerified).ToString();
                    }
                    else
                    {
                        if (Response.IsVerified == 9)
                        {
                            Response.StatusMsg = ((EnWithdrwalConfirmationStatus)9).ToString();
                        }
                        else
                        {
                            if (Data.Status == 2)
                            {
                                Response.StatusMsg = "ProviderFail";
                            }
                            else
                            {
                                Response.StatusMsg = ((enTransactionStatus)Data.Status).ToString();
                            }

                        }
                    }

                    return Response;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        #region FavPair Methods

        public int AddToFavouritePair(long PairId, long UserId)
        {
            try
            {
                var pairData = _tradeMasterRepository.GetById(PairId);
                if (pairData == null)
                {
                    return 2;
                }
                var favouritePair = _favouritePairRepository.GetSingle(x => x.PairId == PairId && x.UserId == UserId);
                if (favouritePair == null)
                {
                    //Add With First Time
                    favouritePair = new FavouritePair()
                    {
                        PairId = PairId,
                        UserId = UserId,
                        Status = 1,
                        CreatedBy = UserId,
                        CreatedDate = _basePage.UTC_To_IST()
                    };
                    favouritePair = _favouritePairRepository.Add(favouritePair);
                }
                else if (favouritePair != null)
                {
                    if (favouritePair.Status == 1)
                    {
                        return 1;  // already added as favourite pair
                    }
                    else if (favouritePair.Status == 9)
                    {
                        favouritePair.Status = 1;
                        _favouritePairRepository.Update(favouritePair);
                    }
                }
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public int RemoveFromFavouritePair(long PairId, long UserId)
        {
            try
            {
                var favouritePair = _favouritePairRepository.GetSingle(x => x.PairId == PairId && x.UserId == UserId);
                if (favouritePair == null)
                {
                    return 1;
                }
                else if (favouritePair != null)
                {
                    favouritePair.Status = 9;
                    _favouritePairRepository.Update(favouritePair);
                }
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<FavouritePairInfo> GetFavouritePair(long UserId, short IsMargin = 0)//Rita 23-2-19 for Margin Trading Data bit
        {
            List<FavouritePairInfo> responsedata = new List<FavouritePairInfo>();
            try
            {
                //Uday 05-12-2018 Optize with query
                //var favouritepair = _favouritePairRepository.FindBy(x => x.UserId == UserId && x.Status == 1);

                if (IsMargin == 1)
                    responsedata = _frontTrnRepository.GetFavouritePairsMargin(UserId);
                else
                    responsedata = _frontTrnRepository.GetFavouritePairs(UserId);

                //var favouritepair = _frontTrnRepository.GetFavouritePairs(UserId);
                //return favouritepair;
                return responsedata;

                //if (favouritepair != null && favouritepair.Count() > 0)
                //{
                //    foreach (var favPair in favouritepair)
                //    {
                //        FavouritePairInfo response = new FavouritePairInfo();
                //        var pairMasterData = _tradeMasterRepository.GetById(favPair.PairId);
                //        var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pairMasterData.Id);
                //        var chidService = _serviceMasterRepository.GetSingle(x => x.Id == pairMasterData.SecondaryCurrencyId);
                //        var baseService = _serviceMasterRepository.GetSingle(x => x.Id == pairMasterData.BaseCurrencyId);
                //        var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pairMasterData.Id);

                //        response.PairId = pairMasterData.Id;
                //        response.Pairname = pairMasterData.PairName;
                //        response.Currentrate = pairStastics.CurrentRate;
                //        response.BuyFees = pairDetailData.BuyFees;
                //        response.SellFees = pairDetailData.SellFees;
                //        response.ChildCurrency = chidService.Name;
                //        response.Abbrevation = chidService.SMSCode;
                //        response.BaseCurrency = baseService.Name;
                //        response.BaseAbbrevation = baseService.SMSCode;
                //        response.ChangePer = pairStastics.ChangePer24;
                //        response.Volume = pairStastics.ChangeVol24;
                //        response.High24Hr = pairStastics.High24Hr;
                //        response.Low24Hr = pairStastics.Low24Hr;
                //        response.HighWeek = pairStastics.HighWeek;
                //        response.LowWeek = pairStastics.LowWeek;
                //        response.High52Week = pairStastics.High52Week;
                //        response.Low52Week = pairStastics.Low52Week;
                //        response.UpDownBit = pairStastics.UpDownBit;

                //        responsedata.Add(response);
                //    }
                //    return responsedata;
                //}
                //else
                //{
                //    return responsedata;
                //}
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 23-2-19 for Margin Trading Data bit
        public int AddToFavouritePairMargin(long PairId, long UserId)
        {
            try
            {
                TradePairMasterMargin pairData = _trnMasterConfiguration.GetTradePairMasterMargin().Where(e => e.Id == PairId).FirstOrDefault();
                if (pairData == null)
                {
                    return 2;
                }
                FavouritePairMargin favouritePair = _favouritePairRepositoryMargin.GetSingle(x => x.PairId == PairId && x.UserId == UserId);
                if (favouritePair == null)
                {
                    //Add With First Time
                    favouritePair = new FavouritePairMargin()
                    {
                        PairId = PairId,
                        UserId = UserId,
                        Status = 1,
                        CreatedBy = UserId,
                        CreatedDate = _basePage.UTC_To_IST()
                    };
                    favouritePair = _favouritePairRepositoryMargin.Add(favouritePair);
                }
                else if (favouritePair != null)
                {
                    if (favouritePair.Status == 1)
                    {
                        return 1;  // already added as favourite pair
                    }
                    else if (favouritePair.Status == 9)
                    {
                        favouritePair.Status = 1;
                        _favouritePairRepositoryMargin.Update(favouritePair);
                    }
                }
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public int RemoveFromFavouritePairMargin(long PairId, long UserId)
        {
            try
            {
                var favouritePair = _favouritePairRepositoryMargin.GetSingle(x => x.PairId == PairId && x.UserId == UserId);
                if (favouritePair == null)
                {
                    return 1;
                }
                else if (favouritePair != null)
                {
                    favouritePair.Status = 9;
                    _favouritePairRepositoryMargin.Update(favouritePair);
                }
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #region parameterValidation

        public bool IsValidPairName(string Pair)
        {
            try
            {
                String Pattern = "^[A-Z_]{5,20}$";//rita 10-1-19 change lengt hvalidation
                if (Regex.IsMatch(Pair, Pattern, RegexOptions.IgnoreCase))
                    return true;

                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public Int16 IsValidTradeType(string Type)
        {
            //enTrnType
            try
            {
                if (Type.ToUpper().Equals("BUY"))
                    return Convert.ToInt16(enTrnType.Buy_Trade);
                else if (Type.ToUpper().Equals("SELL"))
                    return Convert.ToInt16(enTrnType.Sell_Trade);
                else if (Type.ToUpper().Equals("Withdraw"))
                    return Convert.ToInt16(enTrnType.Withdraw);
                else
                    return 999;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public Int16 IsValidMarketType(string Type)
        {
            //enTransactionMarketType
            try
            {
                //if (Type.ToUpper().Equals(Enum.GetName(typeof(enTransactionMarketType), enTransactionMarketType.LIMIT)))
                //    return Convert.ToInt16(enTransactionMarketType.LIMIT);
                //else if (Type.ToUpper().Equals(Enum.GetName(typeof(enTransactionMarketType), enTransactionMarketType.MARKET)))
                //    return Convert.ToInt16(enTransactionMarketType.MARKET);
                //else if (Type.ToUpper().Equals(Enum.GetName(typeof(enTransactionMarketType), enTransactionMarketType.STOP_Limit)))
                //    return Convert.ToInt16(enTransactionMarketType.STOP_Limit);
                //else if (Type.ToUpper().Equals(Enum.GetName(typeof(enTransactionMarketType), enTransactionMarketType.STOP)))
                //    return Convert.ToInt16(enTransactionMarketType.STOP);
                //else if (Type.ToUpper().Equals(Enum.GetName(typeof(enTransactionMarketType), enTransactionMarketType.SPOT)))
                //    return Convert.ToInt16(enTransactionMarketType.SPOT);
                //else 
                //    return 999;

                if (Type.ToUpper().Equals("LIMIT"))
                {
                    return Convert.ToInt16(enTransactionMarketType.LIMIT);
                }
                else if (Type.ToUpper().Equals("MARKET"))
                {
                    return Convert.ToInt16(enTransactionMarketType.MARKET);
                }
                else if (Type.ToUpper().Equals("STOP_LIMIT"))
                {
                    return Convert.ToInt16(enTransactionMarketType.STOP_Limit);
                }
                else if (Type.ToUpper().Equals("STOP"))
                {
                    return Convert.ToInt16(enTransactionMarketType.STOP);
                }
                else if (Type.ToUpper().Equals("SPOT"))
                {
                    return Convert.ToInt16(enTransactionMarketType.SPOT);
                }
                else
                {
                    return 999;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public short IsValidStatus(string status)
        {
            try
            {
                if (status.ToUpper().Equals("SETTLED"))
                    return Convert.ToInt16(enTransactionStatus.Success);
                if (status.ToUpper().Equals("CURRENT"))
                    return Convert.ToInt16(enTransactionStatus.Hold);
                else
                    return 999;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public bool IsValidDateFormate(string date)
        {
            try
            {
                DateTime dt = DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public void GetIntervalTimeValue(string Interval, ref int IntervalTime, ref string IntervalData)
        {
            try
            {
                switch (Interval)
                {
                    case "1m":
                        IntervalTime = 1;
                        IntervalData = "MINUTE";
                        break;
                    case "3m":
                        IntervalTime = 3;
                        IntervalData = "MINUTE";
                        break;
                    case "5m":
                        IntervalTime = 5;
                        IntervalData = "MINUTE";
                        break;
                    case "15m":
                        IntervalTime = 15;
                        IntervalData = "MINUTE";
                        break;
                    case "30m":
                        IntervalTime = 30;
                        IntervalData = "MINUTE";
                        break;
                    case "1H":
                        IntervalTime = 1;
                        IntervalData = "HOUR";
                        break;
                    case "2H":
                        IntervalTime = 2;
                        IntervalData = "HOUR";
                        break;
                    case "4H":
                        IntervalTime = 4;
                        IntervalData = "HOUR";
                        break;
                    case "6H":
                        IntervalTime = 6;
                        IntervalData = "HOUR";
                        break;
                    case "12H":
                        IntervalTime = 12;
                        IntervalData = "HOUR";
                        break;
                    case "1D":
                        IntervalTime = 1;
                        IntervalData = "DAY";
                        break;
                    case "1W":
                        IntervalTime = 1;
                        IntervalData = "WEEK";
                        break;
                    case "1M":
                        IntervalTime = 1;
                        IntervalData = "MONTH";
                        break;
                    default:
                        IntervalTime = 0;
                        break;
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        #region TopGainer And ToLooser Pair
        public List<TopLooserGainerPairData> GetFrontTopGainerPair(int Type)
        {
            try
            {
                var Data = _frontTrnRepository.GetFrontTopGainerPair(Type);

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetFrontTopLooserPair(int Type)
        {
            try
            {
                var Data = _frontTrnRepository.GetFrontTopLooserPair(Type);

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetFrontTopLooserGainerPair()
        {
            try
            {
                var Data = _frontTrnRepository.GetFrontTopLooserGainerPair();

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TopLeadersListResponse TopLeadersList()
        {
            TopLeadersListResponse _Res = new TopLeadersListResponse();
            List<TopLeaderListInfo> leaderList = new List<TopLeaderListInfo>();
            int cnt = 0;
            try
            {
                var list = _profileConfigurationService.GetFrontLeaderList(0, 0, 2);
                list = _profileConfigurationService.GetFrontLeaderList(0, list.TotalCount, 2);
                //leaderList = _frontTrnRepository.TopLeaderList();

                foreach (var obj in list.LeaderList.OrderByDescending(e => e.NoOfFollowerFollow))
                {
                    leaderList.Add(new TopLeaderListInfo()
                    {
                        IsFollow = obj.IsFollow,
                        IsWatcher = obj.IsWatcher,
                        LeaderId = obj.LeaderId,
                        LeaderName = obj.LeaderName,
                        NoOfFollowers = obj.NoOfFollowerFollow,
                        UserDefaultVisible = obj.UserDefaultVisible
                    });
                    cnt++;
                    if (cnt >= 5)
                        break;
                }
                _Res.Response = leaderList;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TradeWatchListResponse getTradeWatchList(long userId)
        {
            List<TradeWatchLists> WatcherTrade = new List<TradeWatchLists>();
            try
            {
                TradeWatchListResponse _Res = new TradeWatchListResponse();
                var watchList = _profileConfigurationService.GetWatcherWiseLeaderList(0, 50, Convert.ToInt32(userId));

                if (watchList.TotalCount > 50)
                    watchList = _profileConfigurationService.GetWatcherWiseLeaderList(0, watchList.TotalCount, Convert.ToInt32(userId));

                foreach (var obj in watchList.WatcherList)
                {
                    WatcherTrade.Add(new TradeWatchLists()
                    {
                        LeaderId = obj.LeaderId,
                        LeaderName = obj.LeaderName,
                    });
                }
                _Res.Response = _frontTrnRepository.getTradeWatchList(WatcherTrade);
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TopProfitGainerLoserResponse GetTopProfitGainer(DateTime date, int size)
        {
            TopProfitGainerLoserResponse _Res = new TopProfitGainerLoserResponse();
            List<TopProfitGainerLoser> profitGainers = new List<TopProfitGainerLoser>();
            try
            {
                var list = _profileConfigurationService.GetFrontLeaderList(0, 0, 2);
                list = _profileConfigurationService.GetFrontLeaderList(0, list.TotalCount, 2);
                //var leaderList = _frontTrnRepository.TopLeaderList(1);
                long[] leaderArray = list.LeaderList.Select(x => (long)x.LeaderId).ToArray();
                //var currentDate =DateTime.UtcNow.AddDays(-12);
                var profitList = _walletService.LeaderBoardWeekWiseTopFive(leaderArray, date, 1, size);
                if (profitList.Data == null)
                {
                    _Res.Response = profitGainers;
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "Success";
                    return _Res;
                }
                foreach (var obj in profitList.Data)
                {
                    //var MonthStasticsData = _walletService.GetMonthwiseWalletStatistics(obj.LeaderId, Convert.ToInt16(currentDate.Month), Convert.ToInt16(currentDate.Year));
                    //var Diff = MonthStasticsData.Balances.EndingBalance - MonthStasticsData.Balances.StartingBalance;
                    var leaderData = list.LeaderList.SingleOrDefault(e => e.LeaderId == obj.UserId);
                    profitGainers.Add(new TopProfitGainerLoser()
                    {
                        LeaderId = obj.UserId,
                        LeaderName = leaderData.LeaderName,
                        Profit = obj.ProfitAmount,
                        //AutoId = obj.AutoId,
                        Email = obj.Email,
                        ProfitPer = obj.ProfitPer
                    });
                }
                _Res.Response = profitGainers;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TopProfitGainerLoserResponse TopProfitLoser(DateTime date, int size)
        {
            TopProfitGainerLoserResponse _Res = new TopProfitGainerLoserResponse();
            List<TopProfitGainerLoser> profitGainers = new List<TopProfitGainerLoser>();
            try
            {
                var list = _profileConfigurationService.GetFrontLeaderList(0, 0, 2);
                list = _profileConfigurationService.GetFrontLeaderList(0, list.TotalCount, 2);
                //var leaderList = _frontTrnRepository.TopLeaderList(1);
                long[] leaderArray = list.LeaderList.Select(x => (long)x.LeaderId).ToArray();
                //var currentDate =DateTime.UtcNow.AddDays(-12);
                var profitList = _walletService.LeaderBoardWeekWiseTopFive(leaderArray, date, 0, size);
                if (profitList.Data == null)
                {
                    _Res.Response = profitGainers;
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "Success";
                    return _Res;
                }
                foreach (var obj in profitList.Data)
                {
                    //var MonthStasticsData = _walletService.GetMonthwiseWalletStatistics(obj.LeaderId, Convert.ToInt16(currentDate.Month), Convert.ToInt16(currentDate.Year));
                    //var Diff = MonthStasticsData.Balances.EndingBalance - MonthStasticsData.Balances.StartingBalance;
                    var leaderData = list.LeaderList.SingleOrDefault(e => e.LeaderId == obj.UserId);
                    profitGainers.Add(new TopProfitGainerLoser()
                    {
                        LeaderId = obj.UserId,
                        LeaderName = leaderData.LeaderName,
                        Profit = obj.ProfitAmount,
                        //AutoId = obj.AutoId,
                        Email = obj.Email,
                        ProfitPer = obj.ProfitPer
                    });
                }
                _Res.Response = profitGainers;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #region SiteTokenConversion

        public SiteTokenConvertFundResponse GetSiteTokenConversionData(long? UserID, string SourceCurrency = "", string TargetCurrency = "", string FromDate = "", string ToDate = "", short IsMargin = 0)
        {
            SiteTokenConvertFundResponse _Res = new SiteTokenConvertFundResponse();
            List<SiteTokenConvertInfo> convertInfos = new List<SiteTokenConvertInfo>();
            try
            {
                var list = _frontTrnRepository.GetSiteTokenConversionData(UserID, SourceCurrency, TargetCurrency, FromDate, ToDate, IsMargin);
                if (list.Count == 0)
                {
                    _Res.Response = convertInfos;
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "NoDataFound";
                    return _Res;
                }

                foreach (var obj in list)
                {
                    convertInfos.Add(new SiteTokenConvertInfo()
                    {
                        SourceCurrency = obj.SourceCurrency,
                        SourceCurrencyID = obj.SourceCurrencyID,
                        SourceCurrencyQty = obj.SourceCurrencyQty,
                        SourceToBasePrice = obj.SourceToBasePrice,
                        SourceToBaseQty = obj.SourceToBaseQty,
                        TargerCurrency = obj.TargerCurrency,
                        TargerCurrencyID = obj.TargerCurrencyID,
                        TargetCurrencyQty = obj.TargerCurrencyQty,
                        TokenPrice = obj.TokenPrice,
                        UserID = obj.UserID,
                        TrnDate = obj.CreatedDate
                    });
                }
                _Res.Response = convertInfos;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #region trading configuration

        public TradingConfigurationList TradingConfiguration()
        {
            TradingConfigurationList _Res = new TradingConfigurationList();
            List<TradingConfigurationViewModel> convertInfos = new List<TradingConfigurationViewModel>();
            try
            {
                var list = _tradingConfigurationRepository.GetAllList();
                if (list.Count == 0)
                {
                    _Res.Data = convertInfos;
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "NoDataFound";
                    return _Res;
                }

                foreach (var obj in list)
                {
                    convertInfos.Add(new TradingConfigurationViewModel()
                    {
                        CreatedDate = obj.CreatedDate,
                        Id = obj.Id,
                        Name = obj.Name,
                        Status = obj.Status
                    });
                }
                _Res.Data = convertInfos;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = EnResponseMessage.FindRecored;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }


        public BizResponseClass ChangeTradingConfigurationStatus(long ConfigID, short Status, long UserID)
        {
            BizResponseClass _Res = new BizResponseClass();
            try
            {
                var Data = _tradingConfigurationRepository.GetById(ConfigID);
                if (Data == null)
                {
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    _Res.ReturnMsg = "NoDataFound";
                    return _Res;
                }

                Data.Status = Status;
                Data.UpdatedBy = UserID;
                Data.UpdatedDate = Helpers.UTC_To_IST();
                _tradingConfigurationRepository.Update(Data);

                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.RecordUpdatedSuccessfully;
                _Res.ReturnMsg = EnResponseMessage.RecordUpdated;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        #endregion


        #region History Methods
        public List<GetTradeHistoryInfoArbitrage> GetTradeHistoryArbitrage(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<TradeHistoryResponceArbitrage> list;

                //if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
                //    list = _frontTrnRepository.GetTradeHistoryMargin(MemberID, sCondition, FromDate, TodDate, page, IsAll);
                //else
                list = _frontTrnRepository.GetTradeHistoryArbitrage(MemberID, sCondition, FromDate, TodDate, page, IsAll);

                List<GetTradeHistoryInfoArbitrage> responce = new List<GetTradeHistoryInfoArbitrage>();

                if (list != null)
                {
                    if (page > 0)
                    {
                        int skip = Helpers.PageSize * (page - 1);
                        list = list.Skip(skip).Take(Helpers.PageSize).ToList();
                    }

                    foreach (TradeHistoryResponceArbitrage model in list)
                    {
                        responce.Add(new GetTradeHistoryInfoArbitrage
                        {
                            Amount = model.Amount,
                            ChargeRs = model.ChargeRs == null ? 0 : (decimal)model.ChargeRs,
                            DateTime = model.DateTime,
                            PairName = model.PairName,
                            Price = model.Price,
                            Status = model.Status,
                            StatusText = model.StatusText,
                            TrnNo = model.TrnNo,
                            Type = model.Type,
                            Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs == null ? 0 : (decimal)model.ChargeRs) : ((model.Price * model.Amount)),
                            IsCancel = model.IsCancelled,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty,
                            Chargecurrency = model.Chargecurrency,
                            ExchangeName = model.ExchangeName
                        });
                    }
                }
                return responce;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public List<RecentOrderInfoArbitrage> GetRecentOrderArbitrage(long PairId, long MemberID, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit)
        {
            try
            {
                List<RecentOrderResposeArbitrage> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetRecentOrderMargin(PairId, MemberID);
                //else
                list = _frontTrnRepository.GetRecentOrderArbitrage(PairId, MemberID);

                List<RecentOrderInfoArbitrage> responce = new List<RecentOrderInfoArbitrage>();
                if (list != null)
                {
                    foreach (RecentOrderResposeArbitrage model in list)
                    {
                        responce.Add(new RecentOrderInfoArbitrage
                        {
                            Qty = model.Qty,
                            DateTime = model.DateTime,
                            Price = model.Price,
                            TrnNo = model.TrnNo,
                            Type = model.Type,
                            Status = model.Status,
                            PairId = model.PairId,
                            PairName = model.PairName,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            StatusCode = model.StatusCode,
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty,
                            ISFollowersReq = model.ISFollowersReq,
                            ExchangeName = model.ExchangeName
                        });
                    }
                }
                return responce;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<ActiveOrderInfoArbitrage> GetActiveOrderArbitrage(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<ActiveOrderDataResponseArbitrage> ActiveOrderList;
                //if (IsMargin == 1)
                //    ActiveOrderList = _frontTrnRepository.GetActiveOrderMargin(MemberID, FromDate, TodDate, PairId, trnType);
                //else
                ActiveOrderList = _frontTrnRepository.GetActiveOrderArbitrage(MemberID, FromDate, TodDate, PairId, trnType);

                List<ActiveOrderInfoArbitrage> responceData = new List<ActiveOrderInfoArbitrage>();
                if (ActiveOrderList != null)
                {
                    if (Page > 0)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        ActiveOrderList = ActiveOrderList.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    foreach (ActiveOrderDataResponseArbitrage model in ActiveOrderList)
                    {
                        responceData.Add(new ActiveOrderInfoArbitrage
                        {
                            Amount = model.Amount,
                            Delivery_Currency = model.Delivery_Currency,
                            Id = model.TrnNo,
                            IsCancelled = model.IsCancelled,
                            Order_Currency = model.Order_Currency,
                            Price = model.Price,
                            TrnDate = model.TrnDate,
                            Type = model.Type,
                            PairName = model.PairName,
                            PairId = model.PairId,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                            SettledDate = model.SettledDate,
                            SettledQty = model.SettledQty,
                            ExchangeName = model.ExchangeName
                        });
                    }

                }
                return responceData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<OpenOrderInfo> GetOpenOrderArbitrage(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<OpenOrderInfo> _Res = new List<OpenOrderInfo>();
                List<OpenOrderQryResponse> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetOpenOrderMargin(MemberID, FromDate, TodDate, PairId, trnType);
                //else
                list = _frontTrnRepository.GetOpenOrderArbitrage(MemberID, FromDate, TodDate, PairId, trnType);

                if (list != null)
                {
                    if (Page > 0)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        list = list.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    foreach (OpenOrderQryResponse model in list)
                    {
                        _Res.Add(new OpenOrderInfo
                        {
                            Amount = model.Amount,
                            Delivery_Currency = model.Delivery_Currency,
                            Id = model.TrnNo,
                            IsCancelled = model.IsCancelled,
                            Order_Currency = model.Order_Currency,
                            Price = model.Price,
                            TrnDate = model.TrnDate,
                            Type = model.Type,
                            PairName = model.PairName,
                            PairId = model.PairId,
                            OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype)
                        });
                    }

                }
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion =========================================

        #region Arbitrage Trading Data Method
        public long GetPairIdByNameArbitrage(string pair, short IsMargin = 0)
        {
            long PairID = 0;
            try
            {
                if (IsMargin == 1)
                {
                    //TradePairMasterMargin TradePairMarginObj = _trnMasterConfiguration.GetTradePairMasterMargin().Where(p => p.PairName == pair && p.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                    //if (TradePairMarginObj == null)
                    //    return 0;
                    //PairID = TradePairMarginObj.Id;
                }
                else
                {
                    TradePairMasterArbitrage TradePairObj = _trnMasterConfiguration.GetTradePairMasterArbitrage().Where(p => p.PairName == pair && p.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                    if (TradePairObj == null)
                        return 0;
                    PairID = TradePairObj.Id;
                }

                //return _frontTrnRepository.GetPairIdByName(pair);
                return PairID;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetBuySellBook> GetBuyerBookArbitrage(long id, short IsMargin = 0)
        {
            try
            {
                List<GetBuySellBook> list;
                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetBuyerBookMargin(id, Price: -1);
                //else
                list = _frontTrnRepository.GetBuyerBookArbitrage(id, Price: -1);

                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetBuySellBook> GetSellerBookArbitrage(long id, short IsMargin = 0)
        {
            try
            {
                List<GetBuySellBook> list;
                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetSellerBookMargin(id, Price: -1);
                //else
                list = _frontTrnRepository.GetSellerBookArbitrage(id, Price: -1);

                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetGraphDetailInfo> GetGraphDetailArbitrage(long PairId, int IntervalTime, string IntervalData, short IsMargin = 0)//Rita 22-2-19 for Margin Trading Data bit
        {
            try
            {
                List<GetGraphDetailInfo> responseData = new List<GetGraphDetailInfo>();

                IOrderedEnumerable<GetGraphDetailInfo> list;
                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetGraphDataMargin(PairId, IntervalTime, IntervalData, _basePage.UTC_To_IST()).OrderBy(x => x.DataDate);
                //else
                list = _frontTrnRepository.GetGraphDataArbitrage(PairId, IntervalTime, IntervalData, _basePage.UTC_To_IST()).OrderBy(x => x.DataDate);

                return list.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ProfitIndicatorInfo GetProfitIndicatorArbitrage(long PairId, short IsMargin = 0)
        {
            try
            {
                ProfitIndicatorInfo responseData = new ProfitIndicatorInfo();

                List<ExchangeProviderListArbitrage> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetExchangeProviderList(PairId);
                //else
                list = _frontTrnRepository.GetExchangeProviderListArbitrage(PairId);
                if (list == null || list.Count == 0)
                    return null;

                List<ExchangeProviderListArbitrage> Buylist;
                List<ExchangeProviderListArbitrage> Selllist;
                Buylist = list.Where(e => e.TrnType == 4).Where(e=>e.LTP!=0).ToList();
                Selllist = list.Where(e => e.TrnType == 5).Where(e => e.LTP != 0).ToList();
                List<LeftProvider> LeftProListBuy = new List<LeftProvider>();
                foreach (ExchangeProviderListArbitrage sBuylist in Buylist)
                {
                    LeftProvider LeftProvider = new LeftProvider();
                    LeftProvider.RouteID = sBuylist.RouteID;
                    LeftProvider.RouteName = sBuylist.RouteName;
                    LeftProvider.SerProID = sBuylist.ProviderID;
                    LeftProvider.ProviderName = sBuylist.ProviderName;
                    LeftProvider.LTP = sBuylist.LTP;
                    List<Provider> Providers = new List<Provider>();
                    foreach (ExchangeProviderListArbitrage ssBuylist in Buylist)
                    {
                        Provider ToProvider = new Provider();
                        ToProvider.RouteID = ssBuylist.RouteID;
                        ToProvider.RouteName = ssBuylist.RouteName;
                        ToProvider.SerProID = ssBuylist.ProviderID;
                        ToProvider.ProviderName = ssBuylist.ProviderName;
                        ToProvider.LTP = ssBuylist.LTP;

                        var diff = LeftProvider.LTP - ToProvider.LTP;
                        ToProvider.Profit = diff * 100 / Math.Min(LeftProvider.LTP, ToProvider.LTP);

                        Providers.Add(ToProvider);
                    }
                    LeftProvider.Providers = Providers;
                    LeftProListBuy.Add(LeftProvider);
                }

                List<LeftProvider> LeftProListSell = new List<LeftProvider>();
                foreach (ExchangeProviderListArbitrage sSelllist in Selllist)
                {
                    LeftProvider LeftProvider = new LeftProvider();
                    LeftProvider.RouteID = sSelllist.RouteID;
                    LeftProvider.RouteName = sSelllist.RouteName;
                    LeftProvider.SerProID = sSelllist.ProviderID;
                    LeftProvider.ProviderName = sSelllist.ProviderName;
                    LeftProvider.LTP = sSelllist.LTP;
                    List<Provider> Providers = new List<Provider>();
                    foreach (ExchangeProviderListArbitrage ssSelllist in Selllist)
                    {
                        Provider ToProvider = new Provider();
                        ToProvider.RouteID = ssSelllist.RouteID;
                        ToProvider.RouteName = ssSelllist.RouteName;
                        ToProvider.SerProID = ssSelllist.ProviderID;
                        ToProvider.ProviderName = ssSelllist.ProviderName;
                        ToProvider.LTP = ssSelllist.LTP;

                        var diff = ToProvider.LTP - LeftProvider.LTP;
                        ToProvider.Profit = diff * 100 / Math.Min(LeftProvider.LTP, ToProvider.LTP);

                        Providers.Add(ToProvider);
                    }
                    LeftProvider.Providers = Providers;
                    LeftProListSell.Add(LeftProvider);
                }



                responseData.BUY = LeftProListBuy;
                responseData.SELL = LeftProListSell;

                return responseData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name + " ##PairId:" + PairId, ex);
                return null;
                //throw ex;
            }
        }

        public List<ExchangeProviderListArbitrage> ExchangeProviderListArbitrage(long PairId, short IsMargin = 0)
        {
            try
            {
                //ProfitIndicatorInfo responseData = new ProfitIndicatorInfo();

                List<ExchangeProviderListArbitrage> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetExchangeProviderList(PairId);
                //else
                list = _frontTrnRepository.GetExchangeProviderListArbitrage(PairId);
                if (list == null || list.Count == 0)
                    return null;

                List<ExchangeProviderListArbitrage> Buylist;

                Buylist = list.Where(e => e.TrnType == 4).ToList();
                return Buylist;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rita 12-6-19 for display profit data in smart arbitrage screen in front
        public List<ExchangeListSmartArbitrage> ExchangeListSmartArbitrageService(long PairId, string PairName, short ProviderCount, short IsMargin = 0)
        {
            try
            {

                List<ExchangeListSmartArbitrage> responseData = new List<ExchangeListSmartArbitrage>();

                List<ExchangeProviderListArbitrage> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetExchangeProviderList(PairId);
                //else
                list = _frontTrnRepository.GetExchangeProviderListArbitrage(PairId);
                if (list == null || list.Count == 0)
                    return null;              

                List<ExchangeProviderListArbitrage> Buylist;
                List<ExchangeProviderListArbitrage> Selllist;

                //here LTP zero then gives error 
                Buylist = list.Where(e => e.TrnType == 4).Where(e => e.LTP != 0).OrderBy(e=>e.LTP).Take(ProviderCount).ToList();//take top 5 provider
                Selllist = list.Where(e => e.TrnType == 5).Where(e => e.LTP != 0).OrderByDescending(e=>e.LTP).Take(ProviderCount).ToList();//take top 5 provider

                foreach (ExchangeProviderListArbitrage sSelllist in Selllist)//High seller common for differnt low Buyer
                {
                    Providers ProviderSELL = new Providers();
                    ProviderSELL.RouteID = sSelllist.RouteID;
                    ProviderSELL.RouteName = sSelllist.RouteName;
                    ProviderSELL.SerProID = sSelllist.ProviderID;
                    ProviderSELL.ProviderName = sSelllist.ProviderName;
                    ProviderSELL.LPType = sSelllist.LPType;
                    ProviderSELL.LTP = sSelllist.LTP;

                    foreach (ExchangeProviderListArbitrage sBuylist in Buylist)
                    {
                        if (ProviderSELL.LPType == sBuylist.LPType)
                            continue;
                        ExchangeListSmartArbitrage TableList = new ExchangeListSmartArbitrage();
                        Providers ProviderBuy = new Providers();
                       
                        TableList.Pair = PairName;
                        TableList.ProviderSELL = ProviderSELL;                      

                        ProviderBuy.RouteID = sBuylist.RouteID;
                        ProviderBuy.RouteName = sBuylist.RouteName;
                        ProviderBuy.SerProID = sBuylist.ProviderID;
                        ProviderBuy.ProviderName = sBuylist.ProviderName;
                        ProviderBuy.LPType = sBuylist.LPType;
                        ProviderBuy.LTP = sBuylist.LTP;

                        var diff = ProviderSELL.LTP - ProviderBuy.LTP;
                        if (diff <= 0)
                            continue;

                        TableList.ProfitPer = diff * 100 / ProviderBuy.LTP;

                        TableList.ProviderBuy = ProviderBuy;
                        responseData.Add(TableList);
                    }

                }
                    return responseData.OrderByDescending(e=>e.ProfitPer).ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name + " ##PairId:" + PairId, ex);
                return null;
                //throw ex;
            }
        }

        public List<BasePairResponse> GetTradePairAssetArbitrage()
        {
            //decimal ChangePer = 0;
            //decimal Volume24 = 0;
            List<BasePairResponse> responsedata;
            try
            {
                responsedata = new List<BasePairResponse>();
                //var basePairData = _marketRepository.GetAll();
                //Rita 01-05-19 added priority ,also added status condition
                IEnumerable<MarketArbitrage> basePairData = _trnMasterConfiguration.GetMarketArbitrage().Where(x => x.Status == 1).OrderBy(x => x.Priority);//rita 23-2-19 taken from cache Implemented

                var TradePairList = _frontTrnRepository.GetTradePairAssetArbitrageInfo();

                if (basePairData != null)
                {
                    foreach (var bpair in basePairData)
                    {
                        BasePairResponse basePair = new BasePairResponse();

                        //var baseService = _serviceMasterRepository.GetSingle(x => x.Id == bpair.ServiceID);
                        //Rita 01-05-19 added priority
                        var pairData = TradePairList.Where(x => x.BaseId == bpair.ServiceID).OrderBy(x => x.Priority);
                        if (pairData.Count() > 0)
                        {
                            basePair.BaseCurrencyId = pairData.FirstOrDefault().BaseId;
                            basePair.BaseCurrencyName = pairData.FirstOrDefault().BaseName;
                            basePair.Abbrevation = pairData.FirstOrDefault().BaseCode;

                            List<TradePairRespose> pairList = new List<TradePairRespose>();
                            #region unuseddata
                            //foreach (var pair in pairData)
                            //{
                            //    TradePairRespose tradePair = new TradePairRespose();
                            //    var pairDetailData = _tradeDetailRepository.GetSingle(x => x.PairId == pmdata.Id);
                            //    var chidService = _serviceMasterRepository.GetSingle(x => x.Id == pmdata.SecondaryCurrencyId);
                            //    var pairStastics = _tradePairStastics.GetSingle(x => x.PairId == pmdata.Id);
                            //    GetPairAdditionalVal(pmdata.Id, pairDetailData.Currentrate, ref Volume24, ref ChangePer);

                            //    tradePair.PairId = pair.PairId;
                            //    tradePair.Pairname = pair.Pairname;
                            //    tradePair.Currentrate = pair.Currentrate;
                            //    tradePair.BuyFees = pair.BuyFees;
                            //    tradePair.SellFees = pair.SellFees;
                            //    tradePair.ChildCurrency = pair.ChildCurrency;
                            //    tradePair.Abbrevation = pair.Abbrevation;
                            //    tradePair.ChangePer = pair.ChangePer;
                            //    tradePair.Volume = pair.Volume;
                            //    tradePair.High24Hr = pair.High24Hr;
                            //    tradePair.Low24Hr = pair.Low24Hr;
                            //    tradePair.HighWeek = pair.HighWeek;
                            //    tradePair.LowWeek = pair.LowWeek;
                            //    tradePair.High52Week = pair.High52Week;
                            //    tradePair.Low52Week = pair.Low52Week;
                            //    tradePair.UpDownBit = pair.UpDownBit;

                            //    pairList.Add(tradePair);
                            //}
                            #endregion
                            pairList = pairData.Select(pair => new TradePairRespose
                            {
                                PairId = pair.PairId,
                                Pairname = pair.Pairname,
                                Currentrate = pair.Currentrate,
                                BuyFees = pair.BuyFees,
                                SellFees = pair.SellFees,
                                ChildCurrency = pair.ChildCurrency,
                                Abbrevation = pair.Abbrevation,
                                ChangePer = pair.ChangePer,
                                Volume = pair.Volume,
                                High24Hr = pair.High24Hr,
                                Low24Hr = pair.Low24Hr,
                                HighWeek = pair.HighWeek,
                                LowWeek = pair.LowWeek,
                                High52Week = pair.High52Week,
                                Low52Week = pair.Low52Week,
                                UpDownBit = pair.UpDownBit,
                            }).ToList();

                            basePair.PairList = pairList;
                            responsedata.Add(basePair);
                        }
                    }
                    return responsedata;
                }
                else
                {
                    return responsedata;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ArbitrageBuySellViewModel> GetExchangeProviderBuySellBookArbitrage(long PairId, short TrnType)
        {
            try
            {
                return _frontTrnRepository.GetExchangeProviderBuySellBookArbitrage(PairId, TrnType);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<SmartArbitrageHistoryInfo> SmartArbitrageHistoryList(long PairId,long MemberID, string FromDat, string ToDate, short IsMargin = 0)
        {
            try
            {

                List<SmartArbitrageHistoryInfo> list;

                //if (IsMargin == 1)
                //    list = _frontTrnRepository.GetExchangeProviderList(PairId);
                //else
                list = _frontTrnRepository.SmartArbitrageHistoryList(PairId, MemberID,FromDat,ToDate);
                if (list == null || list.Count == 0)
                    return null;
               
                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion =========================================
    }
}
