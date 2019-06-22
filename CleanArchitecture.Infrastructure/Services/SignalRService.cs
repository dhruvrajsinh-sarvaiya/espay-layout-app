using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Communication;
using CleanArchitecture.Core.Entities.Configuration.FeedConfiguration;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.FeedConfiguration;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.Services.RadisDatabase;
using CleanArchitecture.Core.SignalR;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    public class SignalRService : ISignalRService
    {
        private readonly ISignalRQueue _signalRQueue;
        private readonly ILogger<SignalRService> _logger;
        private readonly IMediator _mediator;
        //private readonly EFCommonRepository<TransactionQueue> _TransactionRepository;
        //private readonly EFCommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly IFrontTrnRepository _frontTrnRepository;
        private RedisConnectionFactory _fact;
        public String Token = null;
        public string ControllerName = "SignalRService";
        private SocketHub _chat;
        private ThirdPartySocketHub _clientHub; // khushali 12-03-2019 for Client Socket API access 
        private readonly IConfiguration _configuration;
        private readonly IExchangeFeedConfiguration _exchangeFeedConfiguration;
        private ICommonRepository<UserAPIKeyDetails> _userAPIKeyDetailsRepository;
        private readonly ThirdPartyAPISignalRQueue _thirdPartyAPISignalRQueue;
        private readonly ITrnMasterConfiguration _ITrnMasterConfiguration;

        public SignalRService(ILogger<SignalRService> logger, IMediator mediator, IFrontTrnRepository frontTrnRepository,
             RedisConnectionFactory Factory, ISignalRQueue signalRQueue, SocketHub chat, IConfiguration Configuration,
             IExchangeFeedConfiguration exchangeFeedConfiguration, ICommonRepository<UserAPIKeyDetails> UserAPIKeyDetailsRepository,
             ThirdPartySocketHub ClientHub, ThirdPartyAPISignalRQueue thirdPartyAPISignalRQueue, ITrnMasterConfiguration ITrnMasterConfiguration)
        {
            _fact = Factory;
            _logger = logger;
            _mediator = mediator;
            // _TransactionRepository = TransactionRepository;
            _frontTrnRepository = frontTrnRepository;
            //_TradeTransactionRepository = TradeTransactionRepository;
            _signalRQueue = signalRQueue;
            _chat = chat;
            _configuration = Configuration;
            _exchangeFeedConfiguration = exchangeFeedConfiguration;
            _userAPIKeyDetailsRepository = UserAPIKeyDetailsRepository;
            _clientHub = ClientHub; // khushali 12-03-2019 for Client Socket API access 
            _thirdPartyAPISignalRQueue = thirdPartyAPISignalRQueue;
            _ITrnMasterConfiguration = ITrnMasterConfiguration;
        }

        #region Pairwise Reguler Method

        public async Task BuyerBook(GetBuySellBook Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<GetBuySellBook> CommonData = new SignalRComm<GetBuySellBook>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BuyerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveBuyerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = 0;
                CommonData.IsMargin = IsMargin;

                //SignalRDataBuyerBook SendData = new SignalRDataBuyerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BuyerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.BuyerBook;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if(res.ErrorCode==enErrorCode.Success)
                Task UserHub = _chat.BuyerBook(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.BuyerBook(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task SellerBook(GetBuySellBook Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<GetBuySellBook> CommonData = new SignalRComm<GetBuySellBook>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.SellerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveSellerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = 0;
                CommonData.IsMargin = IsMargin;

                //SignalRDataSellerBook SendData = new SignalRDataSellerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.SellerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(() =>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.SellerBook;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.SellerBook(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.SellerBook(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                ///Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OrderHistory(GetTradeHistoryInfo Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<GetTradeHistoryInfo> CommonData = new SignalRComm<GetTradeHistoryInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.OrderHistory);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveOrderHistory);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.OrderHistory;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.OrderHistory;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);


                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.OrderHistory(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.OrderHistory(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ChartData(GetGraphDetailInfo Data, string Pair, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<GetGraphDetailInfo> CommonData = new SignalRComm<GetGraphDetailInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ChartData);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveChartData);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ChartData;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.ChartData(SendData.Parameter, SendData.DataObj);
                Task ClientHub = _clientHub.ChartData(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ChartDataEveryLastMin(DateTime DateTime, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                List<GetGraphResponsePairWise> GraphResponsesList = new List<GetGraphResponsePairWise>();
                if (IsMargin == 1)
                    GraphResponsesList = _frontTrnRepository.GetGraphDataEveryLastMinMargin(DateTime.ToString("yyyy-MM-dd HH:mm:00:000"));
                else
                    GraphResponsesList = _frontTrnRepository.GetGraphDataEveryLastMin(DateTime.ToString("yyyy-MM-dd HH:mm:00:000"));

                if (GraphResponsesList != null)  // Uday 01-03-2019   Handle null response
                {
                    foreach (GetGraphResponsePairWise GraphData in GraphResponsesList)
                    {
                        GetGraphDetailInfo GraphDetailInfo = new GetGraphDetailInfo();
                        GraphDetailInfo.Close = GraphData.CloseVal;
                        GraphDetailInfo.High = GraphData.High;
                        GraphDetailInfo.Open = GraphData.OpenVal;
                        GraphDetailInfo.Low = GraphData.Low;
                        DateTime dt2 = new DateTime(1970, 1, 1);
                        //GraphDetailInfo.DataDate = Convert.ToInt64(GraphData.DataDate.Subtract(dt2).TotalMilliseconds);
                        GraphDetailInfo.DataDate = GraphData.DataDate;
                        GraphDetailInfo.Volume = GraphData.Volume;
                        GraphDetailInfo.Close = GraphData.CloseVal;
                        ChartData(GraphDetailInfo, GraphData.PairName, IsMargin);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task MarketData(MarketCapData Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<MarketCapData> CommonData = new SignalRComm<MarketCapData>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.MarketData);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveMarketData);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.MarketData;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.MarketData;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.MarketData(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.MarketData(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task LastPrice(LastPriceViewModel Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<LastPriceViewModel> CommonData = new SignalRComm<LastPriceViewModel>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.Price);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveLastPrice);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.Price;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.Price;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.LastPrice(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.LastPrice(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task StopLimitBuyerBook(List<StopLimitBuySellBook> Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<List<StopLimitBuySellBook>> CommonData = new SignalRComm<List<StopLimitBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.StopLimitBuyerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveStopLimitBuyerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;


                //SignalRDataBuyerBook SendData = new SignalRDataBuyerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.StopLimitBuyerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.StopLimitBuyerBook;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.StopLimitBuyerBook(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.StopLimitBuyerBook(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task StopLimitSellerBook(List<StopLimitBuySellBook> Data, string Pair, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<List<StopLimitBuySellBook>> CommonData = new SignalRComm<List<StopLimitBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.StopLimitSellerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveStopLimitSellerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;


                //SignalRDataBuyerBook SendData = new SignalRDataBuyerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.StopLimitSellerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.StopLimitSellerBook;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.StopLimitSellerBook(SendData.Parameter, SendData.DataObj);
                Task ClientHub = _clientHub.StopLimitSellerBook(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task BulkBuyerBook(List<GetBuySellBook> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<List<GetBuySellBook>> CommonData = new SignalRComm<List<GetBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BulkBuyerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.ReceiveBulkBuyerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = Convert.ToInt16(LP);
                CommonData.IsMargin = IsMargin;

                //SignalRDataBuyerBook SendData = new SignalRDataBuyerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BulkBuyerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));
                //Task.Run(() => _signalRQueue.Enqueue(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                await _chat.BuyerBookLP(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }        

        public async Task BulkSellerBook(List<GetBuySellBook> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<List<GetBuySellBook>> CommonData = new SignalRComm<List<GetBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BulkSellerBook);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.ReceiveBulkSellerBook);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = Convert.ToInt16(LP);
                CommonData.IsMargin = IsMargin;

                //SignalRDataBuyerBook SendData = new SignalRDataBuyerBook();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BulkSellerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));
                //Task.Run(() => _signalRQueue.Enqueue(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                await _chat.SellerBookLP(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task BulkOrderHistory(List<GetTradeHistoryInfo> Data, string Pair, enLiquidityProvider LP, short IsMargin = 0)
        {
            try
            {
                SignalRComm<List<GetTradeHistoryInfo>> CommonData = new SignalRComm<List<GetTradeHistoryInfo>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BulkOrderHistory);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.ReceiveBulkOrderHistory);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = Convert.ToInt16(LP);
                CommonData.IsMargin = IsMargin;
                
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BulkSellerBook;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                await _chat.OrderHistoryLP(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region UserSpecific
        // khushali 12-03-2019 Add UserID argument for all user specific method
        public async Task ActiveOrder(ActiveOrderInfo Data, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<ActiveOrderInfo> CommonData = new SignalRComm<ActiveOrderInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActiveOrder);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveActiveOrder);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                //SignalRDataOpenOrder SendData = new SignalRDataOpenOrder();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ActiveOrder;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.ActiveOrder;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);                
                var UserHub = _chat.ActiveOrder(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.ActiveOrder(APIkeys, SendData.DataObj);
                //}                
                //Task.WaitAll();

                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OpenOrder(OpenOrderInfo Data, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<OpenOrderInfo> CommonData = new SignalRComm<OpenOrderInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.OpenOrder);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveOpenOrder);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                //SignalRDataOpenOrder SendData = new SignalRDataOpenOrder();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.OpenOrder;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.OpenOrder;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.OpenOrder(SendData.Parameter, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.OpenOrder(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.OpenOrder(APIkeys, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task TradeHistory(GetTradeHistoryInfo Data, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<GetTradeHistoryInfo> CommonData = new SignalRComm<GetTradeHistoryInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.TradeHistory);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveTradeHistory);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.TradeHistory;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.TradeHistory;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.TradeHistory(SendData.Parameter, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.TradeHistory(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.TradeHistory(APIkeys, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task RecentOrder(RecentOrderInfo Data, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<RecentOrderInfo> CommonData = new SignalRComm<RecentOrderInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.RecentOrder);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveRecentOrder);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.RecentOrder;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.RecentOrder;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.RecentOrder(SendData.Parameter, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.RecentOrder(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.RecentOrder(APIkeys, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task WalletBalUpdate(WalletMasterResponse Data, string Wallet, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<WalletMasterResponse> CommonData = new SignalRComm<WalletMasterResponse>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BuyerSideWallet);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveWalletBal);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BuyerSideWallet;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                SendData.WalletName = Wallet;

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.BuyerSideWallet;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.WalletName = Wallet;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.WalletBalUpdate(SendData.Parameter,SendData.WalletName, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.WalletBalUpdate(SendData.Parameter, SendData.WalletName, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.WalletBalUpdate(APIkeys, SendData.WalletName, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        //Commented by khushali 12-03-2019  for unused method
        //public async Task SellerSideWalletBal(WalletMasterResponse Data, string Wallet, string Token, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        //{
        //    try
        //    {
        //        SignalRComm<WalletMasterResponse> CommonData = new SignalRComm<WalletMasterResponse>();
        //        CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
        //        CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.SellerSideWallet);
        //        CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveSellerSideWalletBal);
        //        CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
        //        CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
        //        CommonData.Data = Data;
        //        CommonData.Parameter = null;
        //        CommonData.IsMargin = IsMargin;

        //        SignalRData SendData = new SignalRData();
        //        SendData.Method = enMethodName.SellerSideWallet;
        //        SendData.Parameter = Token;
        //        SendData.DataObj = JsonConvert.SerializeObject(CommonData);
        //        SendData.WalletName = Wallet;

        //        //Task.Run(()=>_mediator.Send(SendData));

        //        //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
        //        //if (res.ErrorCode == enErrorCode.Success)
        //            await _chat.WalletBalUpdate(SendData.Parameter, SendData.WalletName, SendData.DataObj);
        //        //Task.Run(() => _signalRQueue.Enqueue(SendData));
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
        //        //throw ex;
        //    }
        //}

        //public async Task ActivityNotification(string Msg, string Token, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        //{
        //    try
        //    {
        //        SignalRComm<String> CommonData = new SignalRComm<String>();
        //        CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
        //        CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActivityNotification);
        //        CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveNotification);
        //        CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
        //        CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
        //        CommonData.Data = Msg;
        //        CommonData.Parameter = null;
        //        CommonData.IsMargin = IsMargin;

        //        //SignalRDataNotify SendData = new SignalRDataNotify();
        //        SignalRData SendData = new SignalRData();
        //        SendData.Method = enMethodName.ActivityNotification;
        //        SendData.Parameter = Token;
        //        SendData.DataObj = JsonConvert.SerializeObject(CommonData);
        //        //SendData.WalletName = Wallet;
        //        //Task.Run(()=>HelperForLog.WriteLogForSocket("ActivityNotification", ControllerName, " MSG :" + Msg));
        //        //Task.Run(()=>_mediator.Send(SendData));

        //        //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
        //        //if (res.ErrorCode == enErrorCode.Success)
        //            await _chat.ActivityNotification(SendData.Parameter, SendData.DataObj);
        //        //Task.Run(() => _signalRQueue.Enqueue(SendData));
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
        //        //throw ex;
        //    }
        //}

        public async Task ActivityNotificationV2(ActivityNotificationMessage Notification, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<ActivityNotificationMessage> CommonData = new SignalRComm<ActivityNotificationMessage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActivityNotification);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveNotification);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Notification;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                //SignalRDataNotify SendData = new SignalRDataNotify();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ActivityNotification;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.ActivityNotification;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //SendData.WalletName = Wallet;
                //Task.Run(()=>HelperForLog.WriteLogForSocket("ActivityNotification", ControllerName, " MSG :" + Notification.MsgCode.ToString()));
                //Task.Run(()=>_mediator.Send(SendData));

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.ActivityNotification(SendData.Parameter, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.ActivityNotification(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.ActivityNotification(APIkeys, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        // khushali 12-01-2019
        public async Task ActivityList(ListAddWalletRequest Request, string Token, string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<ListAddWalletRequest> CommonData = new SignalRComm<ListAddWalletRequest>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.WalletActivity);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveWalletActivity);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Request;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.WalletActivity;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);


                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.WalletActivity;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 1;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);
                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                //await _chat.WalletActivity(SendData.Parameter, SendData.DataObj);
                //Task ClientHub;
                //var APIkeyTask = GetClientAPIKeyByUserID(UserID);
                var UserHub = _chat.WalletActivity(SendData.Parameter, SendData.DataObj);
                //var APIkeys = await APIkeyTask;
                //if (APIkeys != null && APIkeys.Count > 0)
                //{
                //    ClientHub = _clientHub.WalletActivity(APIkeys, SendData.DataObj);
                //}
                //Task.WaitAll();
                //Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region BaseMarket
        public async Task PairData(VolumeDataRespose Data, string Base,string UserID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<VolumeDataRespose> CommonData = new SignalRComm<VolumeDataRespose>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.PairData);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecievePairData);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.Base);
                CommonData.Data = Data;
                CommonData.Parameter = Base;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.PairData;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>_mediator.Send(SendData));

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.PairData;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.PairData(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.PairData(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //_signalRQueue.Enqueue(SendData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task MarketTicker(List<VolumeDataRespose> Data, string UserID, string Base = "", short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                SignalRComm<List<VolumeDataRespose>> CommonData = new SignalRComm<List<VolumeDataRespose>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.MarketTicker);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveMarketTicker);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.Base);
                CommonData.Data = Data;
                CommonData.Parameter = Base;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.MarketTicker;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //_mediator.Send(SendData);

                ThirdPartyAPISinalR TPSendData = new ThirdPartyAPISinalR();
                TPSendData.Method = enMethodName.MarketTicker;
                TPSendData.DataObj = JsonConvert.SerializeObject(CommonData);
                TPSendData.Parameter = CommonData.Parameter;
                TPSendData.UserID = UserID;
                TPSendData.IsPrivate = 0;
                _thirdPartyAPISignalRQueue.Enqueue(TPSendData);

                //var res = _exchangeFeedConfiguration.CheckFeedDataLimit(System.Text.ASCIIEncoding.ASCII.GetByteCount(SendData.DataObj), Convert.ToInt16(SendData.Method));
                //if (res.ErrorCode == enErrorCode.Success)
                Task UserHub = _chat.MarketTicker(SendData.Parameter, SendData.DataObj);
                //Task ClientHub = _clientHub.MarketTicker(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
                //_signalRQueue.Enqueue(SendData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }
        #endregion

        #region GlobalEvents

        public async Task OnStatusSuccess(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, decimal SettlementPrice)
        {
            //update Recent Order
            //pop OpenOrder
            //add tradehistory
            //add orderhistory
            //pop buyer/seller book;
            //DateTime curtime = DateTime.UtcNow;
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();

                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    //BuySellmodel.Amount = 0;
                    //BuySellmodel.OrderId = new Guid();
                    //BuySellmodel.RecordCount = 0;
                    //if (NewTradeTransaction.TrnType == 4)//Buy
                    //{
                    //    BuySellmodel.Price = NewTradeTransaction.BidPrice;
                    //    Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName , "1 BuyerBook Pop call      TRNNO : " + Newtransaction.Id));
                    //}
                    //else//Sell
                    //{
                    //    BuySellmodel.Price = NewTradeTransaction.AskPrice;
                    //    Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName , "1 SellerBook Pop call     TRNNO : " + Newtransaction.Id));

                    //}
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (NewTradeTransaction.TrnType == 4)//Buy
                    {
                        list = _frontTrnRepository.GetBuyerBook(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                        foreach (var model in list)
                        {
                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {

                            Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                            () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Update call          TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            BuySellmodel.Amount = 0;
                            BuySellmodel.OrderId = new Guid();
                            BuySellmodel.RecordCount = 0;
                            BuySellmodel.Price = NewTradeTransaction.BidPrice;
                            Task.Run(() => Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook pop call       TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                        }

                    }
                    else//Sell
                    {
                        list = _frontTrnRepository.GetSellerBook(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                        foreach (var model in list)
                        {

                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {
                            Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                            () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Update call         TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            BuySellmodel.Amount = 0;
                            BuySellmodel.OrderId = new Guid();
                            BuySellmodel.RecordCount = 0;
                            BuySellmodel.Price = NewTradeTransaction.AskPrice;
                            Task.Run(() => Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                () => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook pop call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                        }

                    }
                    historyInfo = GetAndSendTradeHistoryInfoData(Newtransaction, NewTradeTransaction, OrderType,0,SettlementPrice);
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullySettled);
                    notification.Param1 = historyInfo.Price.ToString();
                    notification.Param2 = historyInfo.Amount.ToString();
                    notification.Param3 = historyInfo.Total.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    //ActivityNotificationV2(notification, Token);

                    if (OrderType == 3)
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                    () => OrderHistory(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString()),
                                    () => TradeHistory(historyInfo, Token, UserID),
                                    () => ActivityNotificationV2(notification, Token, UserID)));
                    }
                    //else if(OrderType==4)
                    //{
                    //    Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType),
                    //               () => GetAndSendOpenOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, 1),
                    //               () => OrderHistory(historyInfo, historyInfo.PairName),
                    //               () => TradeHistory(historyInfo, Token),
                    //               () => ActivityNotificationV2(notification, Token)));
                    //}
                    else
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                   () => OrderHistory(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString()),
                                   () => TradeHistory(historyInfo, Token, UserID),
                                   () => ActivityNotificationV2(notification, Token, UserID)));
                    }
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }
       
        public async Task OnStatusPartialSuccess(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType)
        {
            //update Buyer/seller book
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                //HelperForLog.WriteLogForSocket("OnStatusPartialSuccess", ControllerName, " TransactionQueue :" + JsonConvert.SerializeObject(Newtransaction) + " TradeTransactionQueue :" + JsonConvert.SerializeObject(NewTradeTransaction));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (NewTradeTransaction.TrnType == 4)//Buy
                    {
                        list = _frontTrnRepository.GetBuyerBook(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                        foreach (var model in list)
                        {
                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {

                            Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                            () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id));
                        }
                        else
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusPartialSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));
                    }
                    else//Sell
                    {
                        list = _frontTrnRepository.GetSellerBook(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                        foreach (var model in list)
                        {

                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {
                            Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                            () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id));
                        }
                        else
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusPartialSuccess" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));
                    }
                    //Rita 13-3-19 for Settled Qty update
                    if (OrderType != 3)//for market ordre not sent open and recent ordre 
                    {

                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));

                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }
        
        public async Task OnStatusHold(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType)
        {
            //add buyer/seller book
            //add OpenOrder
            //add recent order
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {

                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                //HelperForLog.WriteLogForSocket("OnStatusHold", ControllerName, " TransactionQueue :" );
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                List<GetBuySellBook> list = new List<GetBuySellBook>();
                if (!string.IsNullOrEmpty(Token))
                {
                    if (OrderType == 4)
                    {
                        HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChange(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName,UserID: NewTradeTransaction.MemberID.ToString(), IsCancel:1);
                    }
                    else
                    {
                        if (NewTradeTransaction.TrnType == 4)//Buy
                        {
                            list = _frontTrnRepository.GetBuyerBook(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                            foreach (var model in list)
                            {
                                //BuySellmodel = model;
                                BuySellmodel.Amount = model.Amount;
                                BuySellmodel.Price = model.Price;
                                BuySellmodel.OrderId = model.OrderId;
                                BuySellmodel.RecordCount = model.RecordCount;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                                () => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " BuyerBook Amount " + BuySellmodel.Amount + " Price " + BuySellmodel.Price));
                            }
                            else
                                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));

                        }
                        else//Sell
                        {
                            list = _frontTrnRepository.GetSellerBook(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                            foreach (var model in list)
                            {
                                //BuySellmodel = model;
                                BuySellmodel.Price = model.Price;
                                BuySellmodel.Amount = model.Amount;
                                BuySellmodel.OrderId = model.OrderId;
                                BuySellmodel.RecordCount = model.RecordCount;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                                () => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " SellerBook Amount " + BuySellmodel.Amount + " Price " + BuySellmodel.Price));
                            }
                            else
                                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));

                        }
                    }
                    if (OrderType != 3)//for market ordre not sent open and recent ordre 
                    {
                        //if (OrderType == 4)
                        //{
                        //    //var OpenOrderData = _frontTrnRepository.CheckOpenOrderRange(NewTradeTransaction.TrnNo);
                        //    //if (OpenOrderData != null)
                        //    //{
                        //    //    Task.Run(() => Parallel.Invoke(() => GetAndSendOpenOrderData(Newtransaction, NewTradeTransaction, Token, OrderType),
                        //    // () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType)));
                        //    //}
                        //    //else
                        //    //{
                        //        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType),
                        //      () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType)));
                        //   // }
                        //}
                        //else
                        //{
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                           () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));
                        // }
                    }

                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHold" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                ////throw ex;
            }
        }
        
        public async Task OnStatusCancel(short Status, TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, short IsPartialCancel = 0)
        {
            //pop from OpenOrder
            //update Recent order
            //Buyer/Seller pop
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancel " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    //BuySellmodel.Amount = 0;
                    //BuySellmodel.OrderId = new Guid();
                    //BuySellmodel.RecordCount = 0;
                    //if (NewTradeTransaction.TrnType == 4)//Buy
                    //{
                    //    BuySellmodel.Price = NewTradeTransaction.BidPrice;
                    //    Task.Run(()=>Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Pop call      TRNNO : " + Newtransaction.Id)));
                    //}
                    //else//Sell
                    //{
                    //    BuySellmodel.Price = NewTradeTransaction.AskPrice;
                    //    Task.Run(()=>Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Pop call     TRNNO : " + Newtransaction.Id)));

                    //}
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (OrderType != 4)
                    {
                        if (NewTradeTransaction.TrnType == 4)//Buy
                        {
                            list = _frontTrnRepository.GetBuyerBook(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                            foreach (var model in list)
                            {
                                BuySellmodel = model;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {

                                Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                                () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Update call          TRNNO : " + Newtransaction.Id));
                            }
                            else
                            {
                                BuySellmodel.Amount = 0;
                                BuySellmodel.OrderId = new Guid();
                                BuySellmodel.RecordCount = 0;
                                BuySellmodel.Price = NewTradeTransaction.BidPrice;
                                Task.Run(() => Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                    () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook pop call       TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                            }

                        }
                        else//Sell
                        {
                            list = _frontTrnRepository.GetSellerBook(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                            foreach (var model in list)
                            {

                                BuySellmodel = model;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                                () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Update call         TRNNO : " + Newtransaction.Id));
                            }
                            else
                            {
                                BuySellmodel.Amount = 0;
                                BuySellmodel.OrderId = new Guid();
                                BuySellmodel.RecordCount = 0;
                                BuySellmodel.Price = NewTradeTransaction.AskPrice;
                                Task.Run(() => Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                                    () => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook pop call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                            }
                        }
                    }
                    else
                    {
                        HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChange(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName,IsCancel:1,UserID: NewTradeTransaction.MemberID.ToString());
                    }
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRCancelOrder);
                    notification.Param1 = NewTradeTransaction.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);//rita 06-12-18 change from fail to success
                    if (IsPartialCancel == 0)//Fully Cancel
                    {
                        if (OrderType == 3) //for spot no open/recent order
                        {
                            Task.Run(() => Parallel.Invoke(() => ActivityNotificationV2(notification, Token, UserID),
                                () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                       () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                       () => ActivityNotificationV2(notification, Token, UserID)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancel" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }

                    }
                    else if (IsPartialCancel == 1)//Partial Cancel
                    {
                        historyInfo = GetAndSendTradeHistoryInfoData(Newtransaction, NewTradeTransaction, OrderType);
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                        () => GetAndSendRecentOrderData(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                        () => OrderHistory(historyInfo, Token, NewTradeTransaction.MemberID.ToString()),
                                        () => ActivityNotificationV2(notification, Token, UserID)));
                        Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancel  Fully+Cancel+Process" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }
        
        public async Task OnVolumeChange(VolumeDataRespose volumeData, MarketCapData capData,string UserID)
        {
            try
            {
                HelperForLog.WriteLogForSocket("OnVolumeChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "Call OnVolumeChangeMethod : volumeData : " + JsonConvert.SerializeObject(volumeData) + " : Market Data : " + JsonConvert.SerializeObject(capData));
                if (volumeData != null && capData != null)
                {
                    LastPriceViewModel lastPriceData = new LastPriceViewModel();
                    lastPriceData.LastPrice = capData.LastPrice;
                    lastPriceData.UpDownBit = volumeData.UpDownBit;

                    string Base = volumeData.PairName.Split("_")[1];

                    //PairData(volumeData, Base);
                    //HelperForLog.WriteLogForSocket("OnVolumeChange", ControllerName, "After Pair Data Call Base :"+ Base+ "  DATA :" + JsonConvert.SerializeObject(volumeData));
                    //MarketData(capData, volumeData.PairName);
                    //HelperForLog.WriteLogForSocket("OnVolumeChange", ControllerName, "After Market Data Call Pair :" + volumeData.PairName +"  DATA :" + JsonConvert.SerializeObject(capData));
                    //LastPrice(lastPriceData, volumeData.PairName);
                    Task.Run(() => Parallel.Invoke(() => PairData(volumeData, Base, UserID),
                                    () => MarketData(capData, volumeData.PairName, UserID),
                                    () => LastPrice(lastPriceData, volumeData.PairName, UserID),
                                    () => HelperForLog.WriteLogForSocket("OnVolumeChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "After Last price Call Pair :" + volumeData.PairName + "  DATA :" + JsonConvert.SerializeObject(lastPriceData))));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }
       
        public async Task OnWalletBalChange(WalletMasterResponse Data, string WalletTypeName, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0) //ntrivedi 21-02-2018 added for margin wallet balance change
        {
            try
            {
                var MemberID = Token;
                if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
                {
                    Token = GetTokenByUserID(Token);
                }
                if (!string.IsNullOrEmpty(Token))
                {

                    //BuyerSideWalletBal(Data, WalletTypeName, Token);
                    //SellerSideWalletBal(Data, WalletTypeName, Token);
                    Task.Run(() => Parallel.Invoke(() => WalletBalUpdate(Data, WalletTypeName, Token, MemberID, IsMargin),
                                    //() => SellerSideWalletBal(Data, WalletTypeName, Token),
                                    () => HelperForLog.WriteLogForSocket("OnWalletBalChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Wallet Name : " + WalletTypeName + "         TRNNO : " + TrnNo.ToString() + " Member ID :" + MemberID + "   Data : " + JsonConvert.SerializeObject(Data) + " \n Token :" + Token)));
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        public async Task SendActivityNotificationV2(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {
                var MemberID = Token;
                //Thread.Sleep(5000);

                //HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 1 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token);
                if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
                {
                    Token = GetTokenByUserID(Token);
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    ActivityNotificationV2(ActivityNotification, Token, MemberID, IsMargin);
                    Task.Run(() => HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 2 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token));
                    //Task.Run(()=>Parallel.Invoke(()=>ActivityNotificationV2(ActivityNotification, Token, IsMargin),
                    //()=>HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 2 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token)));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        // khushali 12-01-2019
        public async Task SendWalletActivityList(ListAddWalletRequest ActivityListRequest, string ID, short IsMargin = 0)//Rita 20-2-19 for Margin Trading Data bit
        {
            try
            {

                //HelperForLog.WriteLogForSocket("ListAddWalletRequest " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 1 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityList) + " \n Token :" + Token);

                string Token = GetTokenByUserID(ID);
                if (!string.IsNullOrEmpty(Token))
                {
                    Task.Run(() => Parallel.Invoke(() => ActivityList(ActivityListRequest, Token, ID, IsMargin),
                    () => HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "   Data : " + JsonConvert.SerializeObject(ActivityListRequest) + " \n Token :" + Token)));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        public async Task OnLtpChange(Decimal LTP, long Pair, string PairName, short IsCancel = 0, short IsMargin = 0, string UserID = "")//Rita 20-2-19 for Margin Trading Data bit
        {
            List<StopLimitBuySellBook> DataBuy = new List<StopLimitBuySellBook>();
            List<StopLimitBuySellBook> DataSell = new List<StopLimitBuySellBook>();
            try
            {
                HelperForLog.WriteLogForSocket("OnLtpChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " LTP :" + LTP + " Pair :" + Pair);
                if (IsCancel == 0)
                {
                    if (IsMargin == 1)//Margin Trading
                    {
                        DataBuy = _frontTrnRepository.GetStopLimitBuySellBooksMargin(LTP, Pair, enOrderType.BuyOrder);
                        DataSell = _frontTrnRepository.GetStopLimitBuySellBooksMargin(LTP, Pair, enOrderType.SellOrder);
                    }
                    else
                    {
                        DataBuy = _frontTrnRepository.GetStopLimitBuySellBooks(LTP, Pair, enOrderType.BuyOrder);
                        DataSell = _frontTrnRepository.GetStopLimitBuySellBooks(LTP, Pair, enOrderType.SellOrder);
                    }

                    Task.Run(() => StopLimitBuyerBook(DataBuy, PairName, UserID, IsMargin));
                    Task.Run(() => StopLimitSellerBook(DataSell, PairName, UserID, IsMargin));
                }
                else if (IsCancel == 1)
                {
                    if (IsMargin == 1)//Margin Trading
                    {
                        DataBuy = _frontTrnRepository.GetStopLimitBuySellBooksMargin(LTP, Pair, enOrderType.BuyOrder, 1);
                        DataSell = _frontTrnRepository.GetStopLimitBuySellBooksMargin(LTP, Pair, enOrderType.SellOrder, 1);
                    }
                    else
                    {
                        DataBuy = _frontTrnRepository.GetStopLimitBuySellBooks(LTP, Pair, enOrderType.BuyOrder, 1);
                        DataSell = _frontTrnRepository.GetStopLimitBuySellBooks(LTP, Pair, enOrderType.SellOrder, 1);
                    }

                    Task.Run(() => StopLimitBuyerBook(DataBuy, PairName, UserID,IsMargin));
                    Task.Run(() => StopLimitSellerBook(DataSell, PairName, UserID, IsMargin));
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
            }
        }
        #endregion

        //Rita 5-3-19 for margin trading
        #region margin Global Event trading

        public async Task OnStatusSuccessMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, decimal SettlementPrice)
        {
            //update Recent Order
            //pop OpenOrder
            //add tradehistory
            //add orderhistory
            //pop buyer/seller book;
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();

                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (NewTradeTransaction.TrnType == 4)//Buy
                    {
                        list = _frontTrnRepository.GetBuyerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                        foreach (var model in list)
                        {
                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {

                            Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                            () => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Update call          TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            BuySellmodel.Amount = 0;
                            BuySellmodel.OrderId = new Guid();
                            BuySellmodel.RecordCount = 0;
                            BuySellmodel.Price = NewTradeTransaction.BidPrice;
                            Task.Run(() => Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                () => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook pop call       TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                        }

                    }
                    else//Sell
                    {
                        list = _frontTrnRepository.GetSellerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                        foreach (var model in list)
                        {

                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {
                            Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                            () => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Update call         TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            BuySellmodel.Amount = 0;
                            BuySellmodel.OrderId = new Guid();
                            BuySellmodel.RecordCount = 0;
                            BuySellmodel.Price = NewTradeTransaction.AskPrice;
                            Task.Run(() => Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                () => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook pop call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                        }

                    }
                    historyInfo = GetAndSendTradeHistoryInfoDataMargin(Newtransaction, NewTradeTransaction, OrderType, 0, SettlementPrice);
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullySettled);
                    notification.Param1 = historyInfo.Price.ToString();
                    notification.Param2 = historyInfo.Amount.ToString();
                    notification.Param3 = historyInfo.Total.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    if (OrderType == 3)
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                    () => OrderHistory(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                    () => TradeHistory(historyInfo, Token, UserID, 1),
                                    () => ActivityNotificationV2(notification, Token, UserID, 1)));
                    }
                    else
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendActiveOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                   () => OrderHistory(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                   () => TradeHistory(historyInfo, Token, UserID, 1),
                                   () => ActivityNotificationV2(notification, Token, UserID, 1)));
                    }
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccessMargin" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("OnStatusSuccessMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
            }
        }

        public async Task OnStatusPartialSuccessMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType)
        {
            //update Buyer/seller book
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                //HelperForLog.WriteLogForSocket("OnStatusPartialSuccess", ControllerName, " TransactionQueue :" + JsonConvert.SerializeObject(Newtransaction) + " TradeTransactionQueue :" + JsonConvert.SerializeObject(NewTradeTransaction));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (NewTradeTransaction.TrnType == 4)//Buy
                    {
                        list = _frontTrnRepository.GetBuyerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                        foreach (var model in list)
                        {
                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {

                            Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                            () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id));
                        }
                        else
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));
                    }
                    else//Sell
                    {
                        list = _frontTrnRepository.GetSellerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                        foreach (var model in list)
                        {

                            BuySellmodel = model;
                            break;
                        }
                        if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                        {
                            Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                            () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id));
                        }
                        else
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));
                    }
                    //Rita 13-3-19 for Settled Qty update
                    if (OrderType != 3)//for market ordre not sent open and recent ordre 
                    {

                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));


                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("OnStatusPartialSuccessMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
            }
        }

        public async Task OnStatusHoldMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType)
        {
            //add buyer/seller book
            //add OpenOrder
            //add recent order
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {

                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                //HelperForLog.WriteLogForSocket("OnStatusHold", ControllerName, " TransactionQueue :" );
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                List<GetBuySellBook> list = new List<GetBuySellBook>();
                if (!string.IsNullOrEmpty(Token))
                {
                    if (OrderType == 4)
                    {
                        HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChange(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName, IsCancel: 1, IsMargin: 1, UserID: NewTradeTransaction.MemberID.ToString());
                    }
                    else
                    {
                        if (NewTradeTransaction.TrnType == 4)//Buy
                        {
                            list = _frontTrnRepository.GetBuyerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                            foreach (var model in list)
                            {
                                //BuySellmodel = model;
                                BuySellmodel.Amount = model.Amount;
                                BuySellmodel.Price = model.Price;
                                BuySellmodel.OrderId = model.OrderId;
                                BuySellmodel.RecordCount = model.RecordCount;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                                () => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " BuyerBook Amount " + BuySellmodel.Amount + " Price " + BuySellmodel.Price));
                            }
                            else
                                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));

                        }
                        else//Sell
                        {
                            list = _frontTrnRepository.GetSellerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                            foreach (var model in list)
                            {
                                //BuySellmodel = model;
                                BuySellmodel.Price = model.Price;
                                BuySellmodel.Amount = model.Amount;
                                BuySellmodel.OrderId = model.OrderId;
                                BuySellmodel.RecordCount = model.RecordCount;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                                () => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " SellerBook Amount " + BuySellmodel.Amount + " Price " + BuySellmodel.Price));
                            }
                            else
                                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found"));

                        }
                    }
                    if (OrderType != 3)//for market ordre not sent open and recent ordre 
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                           () => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));

                    }

                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("OnStatusHoldMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                ////throw ex;
            }
        }

        public async Task OnStatusCancelMargin(short Status, TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, short IsPartialCancel = 0)
        {
            //pop from OpenOrder
            //update Recent order
            //Buyer/Seller pop
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfo historyInfo = new GetTradeHistoryInfo();
                GetBuySellBook BuySellmodel = new GetBuySellBook();
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    List<GetBuySellBook> list = new List<GetBuySellBook>();
                    if (OrderType != 4)
                    {
                        if (NewTradeTransaction.TrnType == 4)//Buy
                        {
                            list = _frontTrnRepository.GetBuyerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.BidPrice);
                            foreach (var model in list)
                            {
                                BuySellmodel = model;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {

                                Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                                () => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Update call          TRNNO : " + Newtransaction.Id));
                            }
                            else
                            {
                                BuySellmodel.Amount = 0;
                                BuySellmodel.OrderId = new Guid();
                                BuySellmodel.RecordCount = 0;
                                BuySellmodel.Price = NewTradeTransaction.BidPrice;
                                Task.Run(() => Parallel.Invoke(() => BuyerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                    () => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook pop call       TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                            }

                        }
                        else//Sell
                        {
                            list = _frontTrnRepository.GetSellerBookMargin(NewTradeTransaction.PairID, NewTradeTransaction.AskPrice);
                            foreach (var model in list)
                            {

                                BuySellmodel = model;
                                break;
                            }
                            if (BuySellmodel.OrderId.ToString() != "00000000-0000-0000-0000-000000000000")
                            {
                                Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                                () => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Update call         TRNNO : " + Newtransaction.Id));
                            }
                            else
                            {
                                BuySellmodel.Amount = 0;
                                BuySellmodel.OrderId = new Guid();
                                BuySellmodel.RecordCount = 0;
                                BuySellmodel.Price = NewTradeTransaction.AskPrice;
                                Task.Run(() => Parallel.Invoke(() => SellerBook(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                    () => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook pop call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " : No Data Found")));
                            }
                        }
                    }
                    else
                    {
                        HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChange(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName, UserID: NewTradeTransaction.MemberID.ToString(), IsCancel: 1, IsMargin: 1);
                    }
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRCancelOrder);
                    notification.Param1 = NewTradeTransaction.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);//rita 06-12-18 change from fail to success
                    if (IsPartialCancel == 0)//Fully Cancel
                    {
                        if (OrderType == 3) //for spot no open/recent order
                        {
                            Task.Run(() => Parallel.Invoke(() => ActivityNotificationV2(notification, Token, UserID, 1),
                                () => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                       () => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                       () => ActivityNotificationV2(notification, Token, UserID, 1)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelMargin " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }

                    }
                    else if (IsPartialCancel == 1)//Partial Cancel
                    {
                        historyInfo = GetAndSendTradeHistoryInfoDataMargin(Newtransaction, NewTradeTransaction, OrderType);
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                        () => GetAndSendRecentOrderDataMargin(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                        () => OrderHistory(historyInfo, Token, NewTradeTransaction.MemberID.ToString(), IsMargin: 1),
                                        () => ActivityNotificationV2(notification, Token, UserID, 1)));
                        Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelMargin  Fully+Cancel+Process" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("OnStatusCancelMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
            }
        }

        public async Task OnVolumeChangeMargin(VolumeDataRespose volumeData, MarketCapData capData, string UserID)
        {
            try
            {
                HelperForLog.WriteLogForSocket("OnVolumeChangeMargin" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "Call OnVolumeChangeMethod : volumeData : " + JsonConvert.SerializeObject(volumeData) + " : Market Data : " + JsonConvert.SerializeObject(capData));
                if (volumeData != null && capData != null)
                {
                    LastPriceViewModel lastPriceData = new LastPriceViewModel();
                    lastPriceData.LastPrice = capData.LastPrice;
                    lastPriceData.UpDownBit = volumeData.UpDownBit;

                    string Base = volumeData.PairName.Split("_")[1];

                    Task.Run(() => Parallel.Invoke(() => PairData(volumeData, Base, UserID, IsMargin: 1),
                                    () => MarketData(capData, volumeData.PairName, UserID, IsMargin: 1),
                                    () => LastPrice(lastPriceData, volumeData.PairName, UserID, IsMargin: 1),
                                    () => HelperForLog.WriteLogForSocket("OnVolumeChangeMargin" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "After Last price Call Pair :" + volumeData.PairName + "  DATA :" + JsonConvert.SerializeObject(lastPriceData))));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:OnVolumeChangeMargin" + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region HelperMethods
        public async Task GetAndSendActiveOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                ActiveOrderInfo activeOrder = new ActiveOrderInfo();
                activeOrder.Id = Newtransaction.Id;
                activeOrder.TrnDate = Newtransaction.TrnDate;
                activeOrder.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                activeOrder.Order_Currency = NewTradeTransaction.Order_Currency;
                activeOrder.Delivery_Currency = NewTradeTransaction.Delivery_Currency;
                if (IsPop == 1)
                    activeOrder.Amount = 0;
                else
                    activeOrder.Amount = (NewTradeTransaction.BuyQty == 0) ? NewTradeTransaction.SellQty : (NewTradeTransaction.SellQty == 0) ? NewTradeTransaction.BuyQty : NewTradeTransaction.BuyQty;
                activeOrder.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                activeOrder.IsCancelled = NewTradeTransaction.IsCancelled;
                activeOrder.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                activeOrder.PairId = NewTradeTransaction.PairID;
                activeOrder.PairName = NewTradeTransaction.PairName;
                //Rita 12-3-19 this required for front side
                activeOrder.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                activeOrder.SettledDate = NewTradeTransaction.SettledDate;

                //HelperForLog.WriteLogForSocket("GetAndSendOpenOrderData", ControllerName, " 1 OpenOrder call TRNNO:" + Newtransaction.Id);
                if (IsPop != 1)//send notification,not pop call
                {
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullyCreated);
                    notification.Param1 = activeOrder.Price.ToString();
                    notification.Param2 = activeOrder.Amount.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    Task.Run(() =>
                        Parallel.Invoke(() => ActiveOrder(activeOrder, Token, UserID),
                                    () => ActivityNotificationV2(notification, Token, UserID)));
                    //ActivityNotificationV2(notification, Token);
                    //OpenOrder(OpenOrderModel, Token);
                }
                else
                {
                    ActiveOrder(activeOrder, Token, UserID);
                }
                HelperForLog.WriteLogForSocket("GetAndSendActiveOrderData", ControllerName, " 1 ActiveOrder call TRNNO:" + Newtransaction.Id + " Order Type " + OrderType);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }
        public async Task GetAndSendOpenOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                OpenOrderInfo openOrder = new OpenOrderInfo();
                openOrder.Id = Newtransaction.Id;
                openOrder.TrnDate = Newtransaction.TrnDate;
                openOrder.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                openOrder.Order_Currency = NewTradeTransaction.Order_Currency;
                openOrder.Delivery_Currency = NewTradeTransaction.Delivery_Currency;
                if (IsPop == 1)
                    openOrder.Amount = 0;
                else
                    openOrder.Amount = (NewTradeTransaction.BuyQty == 0) ? NewTradeTransaction.SellQty : (NewTradeTransaction.SellQty == 0) ? NewTradeTransaction.BuyQty : NewTradeTransaction.BuyQty;
                openOrder.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                openOrder.IsCancelled = NewTradeTransaction.IsCancelled;
                openOrder.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                openOrder.PairId = NewTradeTransaction.PairID;
                openOrder.PairName = NewTradeTransaction.PairName;


                if (IsPop != 1)//send notification,not pop call
                {
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullyCreated);
                    notification.Param1 = openOrder.Price.ToString();
                    notification.Param2 = openOrder.Amount.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    Task.Run(() =>
                        Parallel.Invoke(() => OpenOrder(openOrder, Token, UserID),
                                    () => ActivityNotificationV2(notification, Token, UserID)));
                }
                else
                {
                    OpenOrder(openOrder, Token, UserID);
                }
                HelperForLog.WriteLogForSocket("GetAndSendOpenOrderData", ControllerName, " 1 OpenOrder call TRNNO:" + Newtransaction.Id + " Order Type " + OrderType);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }
        public GetTradeHistoryInfo GetAndSendTradeHistoryInfoData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, short OrderType, short IsPop = 0, decimal SettlementPrice = 0)
        {
            try
            {
                //var OrderHistoryList = _frontTrnRepository.GetTradeHistory(0, "", "", "", 0, 0, Newtransaction.Id);
                GetTradeHistoryInfo model = new GetTradeHistoryInfo();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";

                //Rita 09-4-09 in case of buy send settlement price for OrderHistory in front side , LTP and History Diff.price issue solved
                //model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Price = (NewTradeTransaction.TrnType == 4) ? (SettlementPrice == 0 ? NewTradeTransaction.BidPrice : SettlementPrice) : NewTradeTransaction.AskPrice;
                model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; //Rita 19-11-18 May be Qty not fully sell from Pool
                                                                                                                              //model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;

                //komal 30 April 2019 add charge
                model.ChargeRs = Newtransaction.ChargeRs;
                model.Total = model.Type == "BUY" ? (((decimal)model.Price * model.Amount) - model.ChargeRs == null ? 0 : (decimal)model.ChargeRs) : (((decimal)model.Price * model.Amount));
                model.DateTime = Convert.ToDateTime(NewTradeTransaction.SettledDate);
                model.Status = NewTradeTransaction.Status;
                model.StatusText = Enum.GetName(typeof(enTransactionStatus), model.Status);
                model.PairName = NewTradeTransaction.PairName;
                model.ChargeRs = Convert.ToDecimal(Newtransaction.ChargeRs);
                model.IsCancel = NewTradeTransaction.IsCancelled;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                return model;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return null;
            }
        }
        public async Task GetAndSendRecentOrderData(TransactionQueue Newtransaction, TradeTransactionQueue NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                RecentOrderInfo model = new RecentOrderInfo();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Qty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; ;
                model.DateTime = NewTradeTransaction.TrnDate;
                model.Status = Enum.GetName(typeof(enTransactionStatus), NewTradeTransaction.Status);
                model.PairId = NewTradeTransaction.PairID;
                model.PairName = NewTradeTransaction.PairName;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.StatusCode = NewTradeTransaction.Status;
                model.IsCancel = NewTradeTransaction.IsCancelled;//Rita 22-3-19 added for separate status with success in case of partial cancel
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                RecentOrder(model, Token, UserID);
                //HelperForLog.WriteLogForSocket("GetAndSendRecentOrderData", ControllerName, "2 RecentOrder TRNNO:" + Newtransaction.Id);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        //Rita 20-2-19 for margin trading
        public async Task GetAndSendActiveOrderDataMargin(TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                //Rita 01-05-19 for margin trading
                if (NewTradeTransaction.ordertype == 4 && NewTradeTransaction.IsWithoutAmtHold == 1 && NewTradeTransaction.ISOrderBySystem == 1)
                {
                    HelperForLog.WriteLogForSocket("GetAndSendActiveOrderDataMargin", ControllerName, " skip this system Order ##TrnNo:" + Newtransaction.Id + " Order Type " + OrderType);
                    return;
                }                    

                ActiveOrderInfo activeOrder = new ActiveOrderInfo();
                activeOrder.Id = Newtransaction.Id;
                activeOrder.TrnDate = Newtransaction.TrnDate;
                activeOrder.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                activeOrder.Order_Currency = NewTradeTransaction.Order_Currency;
                activeOrder.Delivery_Currency = NewTradeTransaction.Delivery_Currency;
                if (IsPop == 1)
                    activeOrder.Amount = 0;
                else
                    activeOrder.Amount = (NewTradeTransaction.BuyQty == 0) ? NewTradeTransaction.SellQty : (NewTradeTransaction.SellQty == 0) ? NewTradeTransaction.BuyQty : NewTradeTransaction.BuyQty;
                activeOrder.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                activeOrder.IsCancelled = NewTradeTransaction.IsCancelled;
                activeOrder.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                activeOrder.PairId = NewTradeTransaction.PairID;
                activeOrder.PairName = NewTradeTransaction.PairName;
                //Rita 12-3-19 this required for front side
                activeOrder.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                activeOrder.SettledDate = NewTradeTransaction.SettledDate;

                //HelperForLog.WriteLogForSocket("GetAndSendOpenOrderData", ControllerName, " 1 OpenOrder call TRNNO:" + Newtransaction.Id);
                if (IsPop != 1)//send notification,not pop call
                {
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullyCreated);
                    notification.Param1 = activeOrder.Price.ToString();
                    notification.Param2 = activeOrder.Amount.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    Task.Run(() =>
                        Parallel.Invoke(() => ActiveOrder(activeOrder, Token, UserID, 1),
                                    () => ActivityNotificationV2(notification, Token, UserID, 1)));
                    //ActivityNotificationV2(notification, Token);
                    //OpenOrder(OpenOrderModel, Token);
                }
                else
                {
                    ActiveOrder(activeOrder, Token, UserID, 1);
                }
                HelperForLog.WriteLogForSocket("GetAndSendActiveOrderDataMargin", ControllerName, " 1 ActiveOrder call TRNNO:" + Newtransaction.Id + " Order Type " + OrderType);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetAndSendActiveOrderDataMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
            }
        }
        public GetTradeHistoryInfo GetAndSendTradeHistoryInfoDataMargin(TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, short OrderType, short IsPop = 0, decimal SettlementPrice = 0)
        {
            try
            {
                //var OrderHistoryList = _frontTrnRepository.GetTradeHistory(0, "", "", "", 0, 0, Newtransaction.Id);
                GetTradeHistoryInfo model = new GetTradeHistoryInfo();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                //Rita 09-4-09 in case of buy send settlement price for OrderHistory in front side , LTP and History Diff.price issue solved
                //model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Price = (NewTradeTransaction.TrnType == 4) ? (SettlementPrice == 0 ? NewTradeTransaction.BidPrice : SettlementPrice) : NewTradeTransaction.AskPrice;
                model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; //Rita 19-11-18 May be Qty not fully sell from Pool
                //model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;

                //komal 30 April 2019 add charge
                model.ChargeRs = Newtransaction.ChargeRs;
                model.Total = model.Type == "BUY" ? (((decimal)model.Price * model.Amount) - model.ChargeRs == null ? 0 : (decimal)model.ChargeRs) : ((decimal)(model.Price * model.Amount));
                model.DateTime = Convert.ToDateTime(NewTradeTransaction.SettledDate);
                model.Status = NewTradeTransaction.Status;
                model.StatusText = Enum.GetName(typeof(enTransactionStatus), model.Status);
                model.PairName = NewTradeTransaction.PairName;
                model.ChargeRs = Convert.ToDecimal(Newtransaction.ChargeRs);
                model.IsCancel = NewTradeTransaction.IsCancelled;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                return model;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetAndSendTradeHistoryInfoDataMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
                return null;
            }
        }
        public async Task GetAndSendRecentOrderDataMargin(TransactionQueueMargin Newtransaction, TradeTransactionQueueMargin NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                //Rita 01-05-19 for margin trading
                if (NewTradeTransaction.ordertype == 4 && NewTradeTransaction.IsWithoutAmtHold == 1 && NewTradeTransaction.ISOrderBySystem == 1)
                {
                    HelperForLog.WriteLogForSocket("GetAndSendRecentOrderDataMargin", ControllerName, " skip this system Order ##TrnNo:" + Newtransaction.Id + " Order Type " + OrderType);
                    return;
                }
                RecentOrderInfo model = new RecentOrderInfo();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Qty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; ;
                model.DateTime = NewTradeTransaction.TrnDate;
                model.Status = Enum.GetName(typeof(enTransactionStatus), NewTradeTransaction.Status);
                model.PairId = NewTradeTransaction.PairID;
                model.PairName = NewTradeTransaction.PairName;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.StatusCode = NewTradeTransaction.Status;
                model.IsCancel = NewTradeTransaction.IsCancelled;//Rita 22-3-19 added for separate status with success in case of partial cancel
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                RecentOrder(model, Token, UserID, 1);
                //HelperForLog.WriteLogForSocket("GetAndSendRecentOrderDataMargin", ControllerName, "2 RecentOrder TRNNO:" + Newtransaction.Id);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetAndSendRecentOrderDataMargin ##TrnNo:" + NewTradeTransaction.TrnNo, ControllerName, ex);
                //throw ex;
            }
        }

        //Commented by khushali 12-03-2019  for unused method
        //public async Task SendActivityNotification(string Msg, string Token, short TokenType = 1)
        //{
        //    try
        //    {
        //        if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
        //        {
        //            Token = GetTokenByUserID(Token);
        //        }
        //        if (!string.IsNullOrEmpty(Token))
        //        {
        //            ActivityNotification(Msg, Token);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        //throw ex;
        //    }
        //}

        public string GetTokenByUserID(string ID)
        {
            try
            {
                var Redis = new RadisServices<ConnetedClientToken>(this._fact);
                string AccessToken = Redis.GetHashData(_configuration.GetValue<string>("SignalRKey:RedisToken") + ID.ToString(), "Token");
                return AccessToken;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return "";
            }
        }

        public async Task<List<string>> GetClientAPIKeyByUserID(string ID)
        {
            List<string> ClientAPIKeyList = new List<string>();
            try
            {
                var Redis = new RadisServices<ConnetedClientList>(this._fact);
                var APIKeyList = await _userAPIKeyDetailsRepository.FindByAsync(o => o.UserID == Convert.ToInt64(ID) && o.Status == 1);
                if (APIKeyList != null)
                {
                    foreach (var keyDetails in APIKeyList)
                    {
                        ConnetedClientList Cleint = Redis.GetData(_configuration.GetValue<string>("SignalRKey:RedisClientConnection") + keyDetails.APIKey);
                        if (Cleint != null && !string.IsNullOrEmpty(Cleint.ConnectionId))
                        {
                            ClientAPIKeyList.Add(Cleint.ConnectionId);
                        }
                    }
                }
                return await Task.FromResult(ClientAPIKeyList);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
        #endregion

        //Komal 3-06-2019 Arbitrage Trading
        #region Pairwise Arbitrage Method

        public async Task BuyerBookArbitrage(ArbitrageBuySellViewModel Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<ArbitrageBuySellViewModel> CommonData = new SignalRComm<ArbitrageBuySellViewModel>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BuyerBookArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveBuyerBookArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = 0;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BuyerBookArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.BuyerBookArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task SellerBookArbitrage(ArbitrageBuySellViewModel Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<ArbitrageBuySellViewModel> CommonData = new SignalRComm<ArbitrageBuySellViewModel>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.SellerBookArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveSellerBookArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.LP = 0;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.SellerBookArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.SellerBookArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OrderHistoryArbitrage(GetTradeHistoryInfoArbitrage Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<GetTradeHistoryInfoArbitrage> CommonData = new SignalRComm<GetTradeHistoryInfoArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.OrderHistoryArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveOrderHistoryArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.OrderHistoryArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.OrderHistory(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task MarketDataArbitrage(MarketCapData Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<MarketCapData> CommonData = new SignalRComm<MarketCapData>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.MarketDataArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveMarketDataArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.MarketDataArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.MarketDataArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task LastPriceArbitrage(LastPriceViewModelArbitrage Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<LastPriceViewModelArbitrage> CommonData = new SignalRComm<LastPriceViewModelArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.PriceArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveLastPriceArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.PriceArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                Task UserHub = _chat.LastPriceArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task StopLimitBuyerBookArbitrage(List<StopLimitBuySellBook> Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<List<StopLimitBuySellBook>> CommonData = new SignalRComm<List<StopLimitBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.StopLimitBuyerBookArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveStopLimitBuyerBookArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.StopLimitBuyerBookArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.StopLimitBuyerBookArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task StopLimitSellerBookArbitrage(List<StopLimitBuySellBook> Data, string Pair, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<List<StopLimitBuySellBook>> CommonData = new SignalRComm<List<StopLimitBuySellBook>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.StopLimitSellerBookArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveStopLimitSellerBookArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.StopLimitSellerBookArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.StopLimitSellerBookArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ChartDataArbitrage(GetGraphDetailInfo Data, string Pair, short IsMargin = 0)
        {
            try
            {
                SignalRComm<GetGraphDetailInfo> CommonData = new SignalRComm<GetGraphDetailInfo>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ChartDataArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveChartDataArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ChartDataArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.ChartDataArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ChartDataEveryLastMinArbitrage(DateTime DateTime, short IsMargin = 0)
        {
            try
            {
                List<GetGraphResponsePairWise> GraphResponsesList = new List<GetGraphResponsePairWise>();
                GraphResponsesList = _frontTrnRepository.GetGraphDataEveryLastMinArbitrage(DateTime.ToString("yyyy-MM-dd HH:mm:00:000"));

                if (GraphResponsesList != null)
                {
                    foreach (GetGraphResponsePairWise GraphData in GraphResponsesList)
                    {
                        GetGraphDetailInfo GraphDetailInfo = new GetGraphDetailInfo();
                        GraphDetailInfo.Close = GraphData.CloseVal;
                        GraphDetailInfo.High = GraphData.High;
                        GraphDetailInfo.Open = GraphData.OpenVal;
                        GraphDetailInfo.Low = GraphData.Low;
                        DateTime dt2 = new DateTime(1970, 1, 1);
                        //GraphDetailInfo.DataDate = Convert.ToInt64(GraphData.DataDate.Subtract(dt2).TotalMilliseconds);
                        GraphDetailInfo.DataDate = GraphData.DataDate;
                        GraphDetailInfo.Volume = GraphData.Volume;
                        GraphDetailInfo.Close = GraphData.CloseVal;
                        ChartDataArbitrage(GraphDetailInfo, GraphData.PairName, IsMargin);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ProviderMarketDataArbitrage(ExchangeProviderListArbitrage Data,string Pair)
        {
            try
            {
                SignalRComm<ExchangeProviderListArbitrage> CommonData = new SignalRComm<ExchangeProviderListArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ProviderMarketDataArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveProviderMarketDataArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ProviderMarketDataArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.ProviderMarketDataArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ProfitIndicatorArbitrage(ProfitIndicatorInfo Data, string Pair)
        {
            try
            {
                SignalRComm<ProfitIndicatorInfo> CommonData = new SignalRComm<ProfitIndicatorInfo>();
                

                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ProfitIndicatorArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveProfitIndicatorArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ProfitIndicatorArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.ProfitIndicatorArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ExchangeListSmartArbitrage(List<ExchangeListSmartArbitrage> Data, string Pair)
        {
            try
            {
                SignalRComm<List<ExchangeListSmartArbitrage>> CommonData = new SignalRComm<List<ExchangeListSmartArbitrage>>();


                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ExchangeListSmartArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveExchangeListSmartArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.PairName);
                CommonData.Data = Data;
                CommonData.Parameter = Pair;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ExchangeListSmartArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.ExchangeListSmartArbitrage(SendData.Parameter, SendData.DataObj);
                Task.WaitAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region Arbitrage UserSpecific

        public async Task ActiveOrderArbitrage(ActiveOrderInfoArbitrage Data, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<ActiveOrderInfoArbitrage> CommonData = new SignalRComm<ActiveOrderInfoArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActiveOrderArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveActiveOrderArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ActiveOrderArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
           
                var UserHub = _chat.ActiveOrderArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task TradeHistoryArbitrage(GetTradeHistoryInfoArbitrage Data,string Pair, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<GetTradeHistoryInfoArbitrage> CommonData = new SignalRComm<GetTradeHistoryInfoArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.TradeHistoryArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveTradeHistoryArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.TradeHistoryArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                var UserHub = _chat.TradeHistoryArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task RecentOrderArbitrage(RecentOrderInfoArbitrage Data, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<RecentOrderInfoArbitrage> CommonData = new SignalRComm<RecentOrderInfoArbitrage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.RecentOrderArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveRecentOrderArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.RecentOrderArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                var UserHub = _chat.RecentOrderArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task WalletBalUpdateArbitrage(WalletMasterResponse Data, string Wallet, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<WalletMasterResponse> CommonData = new SignalRComm<WalletMasterResponse>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.WalletBalArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveWalletBalArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.WalletBalArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                SendData.WalletName = Wallet;

                var UserHub = _chat.WalletBalUpdateArbitrage(SendData.Parameter, SendData.WalletName, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ActivityNotificationV2Arbitrage(ActivityNotificationMessage Notification, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<ActivityNotificationMessage> CommonData = new SignalRComm<ActivityNotificationMessage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActivityNotificationArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveNotificationArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Notification;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                //SignalRDataNotify SendData = new SignalRDataNotify();
                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ActivityNotificationArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                var UserHub = _chat.ActivityNotificationArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ActivityListArbitrage(ListAddWalletRequest Request, string Token, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<ListAddWalletRequest> CommonData = new SignalRComm<ListAddWalletRequest>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.WalletActivityArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveWalletActivityArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Request;
                CommonData.Parameter = null;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.WalletActivityArbitrage;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                var UserHub = _chat.WalletActivityArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region BaseMarket
        public async Task PairDataArbitrage(VolumeDataRespose Data, string Base, string UserID, short IsMargin = 0)
        {
            try
            {
                SignalRComm<VolumeDataRespose> CommonData = new SignalRComm<VolumeDataRespose>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.PairDataArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecievePairDataArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.Base);
                CommonData.Data = Data;
                CommonData.Parameter = Base;
                CommonData.IsMargin = IsMargin;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.PairDataArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.PairDataArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task MarketTickerArbitrage(List<VolumeDataRespose> Data, string UserID, string Base = "", short IsMargin = 0)
        {
            try
            {
                SignalRComm<List<VolumeDataRespose>> CommonData = new SignalRComm<List<VolumeDataRespose>>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.MarketTickerArbitrage);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveMarketTickerArbitrage);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.Base);
                CommonData.Data = Data;
                CommonData.Parameter = Base;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.MarketTickerArbitrage;
                SendData.Parameter = CommonData.Parameter;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);

                Task UserHub = _chat.MarketTickerArbitrage(SendData.Parameter, SendData.DataObj);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }
        #endregion

        #region Arbitrage GlobalEvents

        public async Task OnStatusSuccessArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, decimal SettlementPrice)
        {
            //update Recent Order
            //pop OpenOrder
            //add tradehistory
            //add orderhistory
            //buyer/seller book;
            //DateTime curtime = DateTime.UtcNow;
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfoArbitrage historyInfo = new GetTradeHistoryInfoArbitrage();
                ArbitrageBuySellViewModel BuySellmodel;

                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));
                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    
                    //if (NewTradeTransaction.TrnType == 4)//Buy
                    //{
                        //BuySellmodel = new ArbitrageBuySellViewModel();
                        //BuySellmodel.LPType = Newtransaction.LPType;
                        //BuySellmodel.LTP = SettlementPrice;
                        //BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;
                        //Parallel.Invoke(() => BuyerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                        //                () => HelperForLog.WriteLogForSocket("OnStatusSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook Update call          TRNNO : " + Newtransaction.Id + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName));
                    //}
                    //else//Sell
                    //{
                        //BuySellmodel = new ArbitrageBuySellViewModel();
                        //BuySellmodel.LPType = Newtransaction.LPType;
                        //BuySellmodel.LTP = NewTradeTransaction.AskPrice;
                        //BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;
                        //Parallel.Invoke(() => SellerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                        //                () => HelperForLog.WriteLogForSocket("OnStatusSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook Update call         TRNNO : " + Newtransaction.Id + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName));
                        
                   // }

                    //ExchangeProviderListArbitrage exchangeProvider = new ExchangeProviderListArbitrage();
                    //exchangeProvider.LPType = Newtransaction.LPType;
                    //exchangeProvider.LTP = SettlementPrice;
                    //exchangeProvider.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName; ;
                    //try
                    //{
                    //    var ExchangeInfo = _frontTrnRepository.GetLocalPairStatistics(NewTradeTransaction.PairID);
                    //    if (ExchangeInfo != null)
                    //    {
                    //        exchangeProvider.UpDownBit = ExchangeInfo.UpDownBit;
                    //        exchangeProvider.Volume = ExchangeInfo.Volume;
                    //        exchangeProvider.ChangePer = ExchangeInfo.ChangePer;
                    //    }
                    //}
                    //catch(Exception e)
                    //{
                    //    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, e);
                    //}
                    //ProviderMarketDataArbitrage(exchangeProvider, NewTradeTransaction.PairName);

                    historyInfo = GetAndSendTradeHistoryInfoDataArbitrage(Newtransaction, NewTradeTransaction, OrderType, 0, SettlementPrice);
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullySettled);
                    notification.Param1 = historyInfo.Price.ToString();
                    notification.Param2 = historyInfo.Amount.ToString();
                    notification.Param3 = historyInfo.Total.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    //ActivityNotificationV2(notification, Token);

                    if (OrderType == 3)
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                  //  () => OrderHistoryArbitrage(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString()),
                                    () => TradeHistoryArbitrage(historyInfo,NewTradeTransaction.PairName, Token, UserID),
                                    () => ActivityNotificationV2Arbitrage(notification, Token, UserID)));
                        //komal 10-06-2019 Send Local Trade Only
                        if (Newtransaction.SerProID== 2000002) 
                            OrderHistoryArbitrage(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString());
                    }
                    else
                    {
                        Task.Run(() => Parallel.Invoke(() => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendActiveOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                   //() => OrderHistoryArbitrage(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString()),
                                   () => TradeHistoryArbitrage(historyInfo, NewTradeTransaction.PairName, Token, UserID),
                                   () => ActivityNotificationV2Arbitrage(notification, Token, UserID)));
                        //komal 10-06-2019 Send Local Trade Only
                        if (Newtransaction.SerProID == 2000002)
                            OrderHistoryArbitrage(historyInfo, historyInfo.PairName, NewTradeTransaction.MemberID.ToString());
                    }
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                }
                else
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Token Not Found TRNNO : " + Newtransaction.Id + "  MemberID : " + NewTradeTransaction.MemberID.ToString()));
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        public async Task OnStatusPartialSuccessArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType)
        {
            //update Buyer/seller book
            string UserID = NewTradeTransaction.MemberID.ToString();
            ArbitrageBuySellViewModel BuySellmodel;
            try
            {

                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {

                    //if (NewTradeTransaction.TrnType == 4)//Buy
                    //{
                    //    BuySellmodel = new ArbitrageBuySellViewModel();
                    //    BuySellmodel.LPType = Newtransaction.LPType;
                    //    BuySellmodel.LTP = NewTradeTransaction.BidPrice;
                    //    BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;
                    //    Parallel.Invoke(() => BuyerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName));
                    //}
                    //else//Sell
                    //{
                    //    BuySellmodel = new ArbitrageBuySellViewModel();
                    //    BuySellmodel.LPType = Newtransaction.LPType;
                    //    BuySellmodel.LTP = NewTradeTransaction.AskPrice;
                    //    BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;
                    //    Parallel.Invoke(() => SellerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                    //                        () => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName));
                    //}
                    //Rita 13-3-19 for Settled Qty update
                    if (OrderType != 3)//for market ordre not sent open and recent ordre 
                    {

                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                   () => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));

                    }
                }
                else
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusPartialSuccessArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Token Not Found TRNNO : " + Newtransaction.Id + "  MemberID : " + NewTradeTransaction.MemberID.ToString()));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OnStatusHoldArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType)
        {
            //add OpenOrder
            //add recent order
            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                ArbitrageBuySellViewModel BuySellmodel;
                GetTradeHistoryInfoArbitrage historyInfo = new GetTradeHistoryInfoArbitrage();
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));

                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    if (OrderType == 4)
                    {
                        HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChangeArbitrage(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName, UserID: NewTradeTransaction.MemberID.ToString(), IsCancel: 1);
                    }
                    //else
                    //{
                    //    //if (NewTradeTransaction.TrnType == 4)//Buy
                    //{
                    //    BuySellmodel = new ArbitrageBuySellViewModel();
                    //    BuySellmodel.LPType = Newtransaction.LPType;
                    //    BuySellmodel.LTP = NewTradeTransaction.BidPrice;
                    //    BuySellmodel.ProviderName= _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;

                    //    Parallel.Invoke(() => BuyerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 BuyerBook call          TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName)); 
                    //}
                    //else//Sell
                    //{
                    //    BuySellmodel = new ArbitrageBuySellViewModel();
                    //    BuySellmodel.LPType = Newtransaction.LPType;
                    //    BuySellmodel.LTP = NewTradeTransaction.AskPrice;
                    //    BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;
                    //    Parallel.Invoke(() => SellerBookArbitrage(BuySellmodel, NewTradeTransaction.PairName, NewTradeTransaction.MemberID.ToString()),
                    //                    () => HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 SellerBook call         TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName + " LTP " + BuySellmodel.LTP + " LPType " + BuySellmodel.LPType + " ProviderName " + BuySellmodel.ProviderName));
                    //}
                    //}
                    if (OrderType != 3)
                    { 
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                           () => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));
                       
                    }

                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                }
                else
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusHoldArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Token Not Found TRNNO : " + Newtransaction.Id + "  MemberID : "+ NewTradeTransaction.MemberID.ToString()));
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                ////throw ex;
            }
        }

        public async Task OnStatusCancelArbitrage(short Status, TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, short IsPartialCancel = 0)
        {
            //pop from OpenOrder
            //update Recent order

            string UserID = NewTradeTransaction.MemberID.ToString();
            try
            {
                GetTradeHistoryInfoArbitrage historyInfo = new GetTradeHistoryInfoArbitrage();
                Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "0 start Socket call       TRNNO : " + Newtransaction.Id));

                if (string.IsNullOrEmpty(Token))
                {
                    Token = GetTokenByUserID(NewTradeTransaction.MemberID.ToString());
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    if (OrderType == 4)
                    {
                        HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "1 Order type 4 call OnLtpVhange    TRNNO : " + Newtransaction.Id + " Pair :" + NewTradeTransaction.PairName);
                        this.OnLtpChangeArbitrage(0, NewTradeTransaction.PairID, NewTradeTransaction.PairName, IsCancel: 1, UserID: NewTradeTransaction.MemberID.ToString());
                    }
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRCancelOrder);
                    notification.Param1 = NewTradeTransaction.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);//rita 06-12-18 change from fail to success
                    if (IsPartialCancel == 0)//Fully Cancel
                    {
                        if (OrderType == 3) //for spot no open/recent order
                        {
                            Task.Run(() => Parallel.Invoke(() => ActivityNotificationV2Arbitrage(notification, Token, UserID),
                                () => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }
                        else
                        {
                            //komal 17-06-2019 add Trade History call 
                            historyInfo = GetAndSendTradeHistoryInfoDataArbitrage(Newtransaction, NewTradeTransaction, OrderType);
                            Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                       () => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                       () => ActivityNotificationV2Arbitrage(notification, Token, UserID),
                                       () => TradeHistoryArbitrage(historyInfo, NewTradeTransaction.PairName, Token, UserID)));
                            Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));
                        }

                    }
                    else if (IsPartialCancel == 1)//Partial Cancel
                    {
                        //komal 17-06-2019 add Trade History call 
                        historyInfo = GetAndSendTradeHistoryInfoDataArbitrage(Newtransaction, NewTradeTransaction, OrderType);
                        Task.Run(() => Parallel.Invoke(() => GetAndSendActiveOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID, 1),
                                        () => GetAndSendRecentOrderDataArbitrage(Newtransaction, NewTradeTransaction, Token, OrderType, UserID),
                                       // () => OrderHistoryArbitrage(historyInfo, Token, NewTradeTransaction.MemberID.ToString()),
                                        () => TradeHistoryArbitrage(historyInfo, NewTradeTransaction.PairName, Token, UserID),
                                        () => ActivityNotificationV2Arbitrage(notification, Token, UserID)));
                        //komal 10-06-2019 Send Local Trade Only
                        if (Newtransaction.SerProID == 2000002)
                            OrderHistoryArbitrage(historyInfo, Token, NewTradeTransaction.MemberID.ToString());
                        Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage  Fully+Cancel+Process" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "2 Complete Socket call    TRNNO : " + Newtransaction.Id));

                    }
                }
                else
                    Task.Run(() => HelperForLog.WriteLogForSocket("OnStatusCancelArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Token Not Found TRNNO : " + Newtransaction.Id + "  MemberID : " + NewTradeTransaction.MemberID.ToString()));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OnVolumeChangeArbitrage(VolumeDataRespose volumeData, MarketCapData capData, string UserID)
        {
            try
            {
                HelperForLog.WriteLogForSocket("OnVolumeChangeArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "Call OnVolumeChangeMethod : volumeData : " + JsonConvert.SerializeObject(volumeData) + " : Market Data : " + JsonConvert.SerializeObject(capData));
                if (volumeData != null && capData != null)
                {
                    LastPriceViewModelArbitrage lastPriceData = new LastPriceViewModelArbitrage();
                    lastPriceData.LastPrice = capData.LastPrice;
                    lastPriceData.UpDownBit = volumeData.UpDownBit;

                    string Base = volumeData.PairName.Split("_")[1];

                    Task.Run(() => Parallel.Invoke(() => PairDataArbitrage(volumeData, Base, UserID, IsMargin: 1),
                                    () => MarketDataArbitrage(capData, volumeData.PairName, UserID, IsMargin: 1),
                                    () => LastPriceArbitrage(lastPriceData, volumeData.PairName, UserID, IsMargin: 1),
                                    () => HelperForLog.WriteLogForSocket("OnVolumeChangeArbitrage" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, "After Last price Call Pair :" + volumeData.PairName + "  DATA :" + JsonConvert.SerializeObject(lastPriceData))));

                    //komal 11-06-2019 LTP change call for buy-sell book
                    ArbitrageBuySellViewModel BuySellmodel = new ArbitrageBuySellViewModel();
                    BuySellmodel.LPType =(short)enAppType.COINTTRADINGLocal;
                    BuySellmodel.LTP = capData.LastPrice;
                    BuySellmodel.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == 2000002).ProviderName;
                    Task.Run(() => SellerBookArbitrage(BuySellmodel, volumeData.PairName, ""));
                    Task.Run(() => BuyerBookArbitrage(BuySellmodel, volumeData.PairName, ""));
                   
                    ExchangeProviderListArbitrage exchangeProvider = new ExchangeProviderListArbitrage();
                    exchangeProvider.LPType = (short)enAppType.COINTTRADINGLocal;
                    exchangeProvider.LTP = capData.LastPrice;
                    exchangeProvider.ProviderName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == 2000002).ProviderName; ;
                    exchangeProvider.UpDownBit = volumeData.UpDownBit;
                    exchangeProvider.Volume = volumeData.Low24Hr;
                    exchangeProvider.ChangePer = volumeData.ChangePer;
                    ProviderMarketDataArbitrage(exchangeProvider, volumeData.PairName);

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:OnVolumeChangeArbitrage" + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task OnLtpChangeArbitrage(Decimal LTP, long Pair, string PairName, short IsCancel = 0, short IsMargin = 0, string UserID = "")
        {
            List<StopLimitBuySellBook> DataBuy = new List<StopLimitBuySellBook>();
            List<StopLimitBuySellBook> DataSell = new List<StopLimitBuySellBook>();
            try
            {
                HelperForLog.WriteLogForSocket("OnLtpChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " LTP :" + LTP + " Pair :" + Pair);
                if (IsCancel == 0)
                {
                    DataBuy = _frontTrnRepository.GetStopLimitBuySellBooksArbitrage(LTP, Pair, enOrderType.BuyOrder);
                    DataSell = _frontTrnRepository.GetStopLimitBuySellBooksArbitrage(LTP, Pair, enOrderType.SellOrder);
                }
                else if (IsCancel == 1)
                {
                    DataBuy = _frontTrnRepository.GetStopLimitBuySellBooksArbitrage(LTP, Pair, enOrderType.BuyOrder, 1);
                    DataSell = _frontTrnRepository.GetStopLimitBuySellBooksArbitrage(LTP, Pair, enOrderType.SellOrder, 1);
                }

                Task.Run(() => StopLimitBuyerBookArbitrage(DataBuy, PairName, UserID, IsMargin));
                Task.Run(() => StopLimitSellerBookArbitrage(DataSell, PairName, UserID, IsMargin));
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
            }
        }

        public async Task SendActivityNotificationV2Arbitrage(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "", short IsMargin = 0)
        {
            try
            {
                var MemberID = Token;
                //HelperForLog.WriteLogForSocket("SendActivityNotificationV2Arbitrage " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 1 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token);
                if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
                {
                    Token = GetTokenByUserID(Token);
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    ActivityNotificationV2Arbitrage(ActivityNotification, Token, MemberID, IsMargin);
                    Task.Run(() => HelperForLog.WriteLogForSocket("SendActivityNotificationV2Arbitrage " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 2 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }
        #endregion

        #region Arbitrage HelperMethods

        public async Task GetAndSendActiveOrderDataArbitrage(TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                ActiveOrderInfoArbitrage activeOrder = new ActiveOrderInfoArbitrage();
                activeOrder.Id = Newtransaction.Id;
                activeOrder.TrnDate = Newtransaction.TrnDate;
                activeOrder.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                activeOrder.Order_Currency = NewTradeTransaction.Order_Currency;
                activeOrder.Delivery_Currency = NewTradeTransaction.Delivery_Currency;
                if (IsPop == 1)
                    activeOrder.Amount = 0;
                else
                    activeOrder.Amount = (NewTradeTransaction.BuyQty == 0) ? NewTradeTransaction.SellQty : (NewTradeTransaction.SellQty == 0) ? NewTradeTransaction.BuyQty : NewTradeTransaction.BuyQty;
                activeOrder.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                activeOrder.IsCancelled = NewTradeTransaction.IsCancelled;
                activeOrder.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                activeOrder.PairId = NewTradeTransaction.PairID;
                activeOrder.PairName = NewTradeTransaction.PairName;
                //Rita 12-3-19 this required for front side
                activeOrder.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                activeOrder.SettledDate = NewTradeTransaction.SettledDate;
                if (Newtransaction.SerProID == 0) //08-06-2019 komal add Exchange name
                    activeOrder.ExchangeName = "LOCAL";
                else
                    activeOrder.ExchangeName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;

                //HelperForLog.WriteLogForSocket("GetAndSendActiveOrderDataArbitrage", ControllerName, " 1 OpenOrder call TRNNO:" + Newtransaction.Id);
                if (IsPop != 1)//send notification,not pop call
                {
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullyCreated);
                    notification.Param1 = activeOrder.Price.ToString();
                    notification.Param2 = activeOrder.Amount.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                    Task.Run(() =>
                        Parallel.Invoke(() => ActiveOrderArbitrage(activeOrder, Token, UserID),
                                    () => ActivityNotificationV2Arbitrage(notification, Token, UserID)));
                }
                else
                {
                    ActiveOrderArbitrage(activeOrder, Token, UserID);
                }
                HelperForLog.WriteLogForSocket("GetAndSendActiveOrderData", ControllerName, " 1 ActiveOrder call TRNNO:" + Newtransaction.Id + " Order Type " + OrderType);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        public GetTradeHistoryInfoArbitrage GetAndSendTradeHistoryInfoDataArbitrage(TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, short OrderType, short IsPop = 0, decimal SettlementPrice = 0)
        {
            try
            {
                //var OrderHistoryList = _frontTrnRepository.GetTradeHistory(0, "", "", "", 0, 0, Newtransaction.Id);
                GetTradeHistoryInfoArbitrage model = new GetTradeHistoryInfoArbitrage();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";

                //Rita 09-4-09 in case of buy send settlement price for OrderHistory in front side , LTP and History Diff.price issue solved
                //model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Price = (NewTradeTransaction.TrnType == 4) ? (SettlementPrice == 0 ? NewTradeTransaction.BidPrice : SettlementPrice) : NewTradeTransaction.AskPrice;
                model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; //Rita 19-11-18 May be Qty not fully sell from Pool
                                                                                                                              //model.Amount = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;

                //komal 30 April 2019 add charge
                model.ChargeRs = Newtransaction.ChargeRs;
                model.Total = model.Type == "BUY" ? (((decimal)model.Price * model.Amount) - model.ChargeRs == null ? 0 : (decimal)model.ChargeRs) : (((decimal)model.Price * model.Amount));
                model.DateTime = Convert.ToDateTime(NewTradeTransaction.SettledDate);
                model.Status = NewTradeTransaction.Status;
                model.StatusText = Enum.GetName(typeof(enTransactionStatus), model.Status);
                model.PairName = NewTradeTransaction.PairName;
                model.ChargeRs = Convert.ToDecimal(Newtransaction.ChargeRs);
                model.IsCancel = NewTradeTransaction.IsCancelled;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                if (Newtransaction.SerProID == 0) //08-06-2019 komal add Exchange name
                    model.ExchangeName = "LOCAL";
                else
                    model.ExchangeName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;

                return model;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return null;
            }
        }

        public async Task GetAndSendRecentOrderDataArbitrage(TransactionQueueArbitrage Newtransaction, TradeTransactionQueueArbitrage NewTradeTransaction, string Token, short OrderType, string UserID, short IsPop = 0)
        {
            try
            {
                RecentOrderInfoArbitrage model = new RecentOrderInfoArbitrage();
                model.TrnNo = NewTradeTransaction.TrnNo;
                model.Type = (NewTradeTransaction.TrnType == 4) ? "BUY" : "SELL";
                model.Price = (NewTradeTransaction.BidPrice == 0) ? NewTradeTransaction.AskPrice : (NewTradeTransaction.AskPrice == 0) ? NewTradeTransaction.BidPrice : NewTradeTransaction.BidPrice;
                model.Qty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.BuyQty : NewTradeTransaction.SellQty; ;
                model.DateTime = NewTradeTransaction.TrnDate;
                model.Status = Enum.GetName(typeof(enTransactionStatus), NewTradeTransaction.Status);
                model.PairId = NewTradeTransaction.PairID;
                model.PairName = NewTradeTransaction.PairName;
                model.OrderType = Enum.GetName(typeof(enTransactionMarketType), OrderType);
                model.StatusCode = NewTradeTransaction.Status;
                model.IsCancel = NewTradeTransaction.IsCancelled;//Rita 22-3-19 added for separate status with success in case of partial cancel
                model.SettledDate = NewTradeTransaction.SettledDate;
                model.SettledQty = (NewTradeTransaction.TrnType == 4) ? NewTradeTransaction.SettledBuyQty : NewTradeTransaction.SettledSellQty;
                if (Newtransaction.SerProID == 0) //08-06-2019 komal add Exchange name
                    model.ExchangeName = "LOCAL";
                else
                    model.ExchangeName = _ITrnMasterConfiguration.GetServiceProviderMasterArbitrageList().ToList().Find(e => e.Id == Newtransaction.SerProID).ProviderName;

                RecentOrderArbitrage(model, Token, UserID);
                //HelperForLog.WriteLogForSocket("GetAndSendRecentOrderDataArbitrage", ControllerName, "2 RecentOrder TRNNO:" + Newtransaction.Id);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        #endregion
    }

    public class SignalRServiceV2 : ISignalRServiceV2
    {
        private readonly ISignalRQueue _signalRQueue;
        private readonly ILogger<SignalRService> _logger;
        private readonly IMediator _mediator;
        private readonly IFrontTrnRepository _frontTrnRepository;
        private RedisConnectionFactory _fact;
        public String Token = null;
        public string ControllerName = "SignalRService";
        private readonly IConfiguration _configuration;
        public SignalRServiceV2(ILogger<SignalRService> logger, IMediator mediator, IFrontTrnRepository frontTrnRepository,
             RedisConnectionFactory Factory, ISignalRQueue signalRQueue, IConfiguration Configuration)
        {
            _fact = Factory;
            _logger = logger;
            _mediator = mediator;
            _frontTrnRepository = frontTrnRepository;
            _signalRQueue = signalRQueue;
            _configuration = Configuration;
        }
        
        #region UserSpecific        

        public async Task WalletBalUpdate(WalletMasterResponse Data, string Wallet, string Token)
        {
            try
            {
                SignalRComm<WalletMasterResponse> CommonData = new SignalRComm<WalletMasterResponse>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.BuyerSideWallet);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveWalletBal);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Data;
                CommonData.Parameter = null;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.BuyerSideWallet;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                SendData.WalletName = Wallet;

                //Task.Run(()=>_mediator.Send(SendData));
                Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        public async Task ActivityNotificationV2(ActivityNotificationMessage Notification, string Token)
        {
            try
            {
                SignalRComm<ActivityNotificationMessage> CommonData = new SignalRComm<ActivityNotificationMessage>();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ActivityNotification);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveNotification);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.OneToOne);
                CommonData.ParamType = Enum.GetName(typeof(enSignalRParmType), enSignalRParmType.AccessToken);
                CommonData.Data = Notification;
                CommonData.Parameter = null;

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.ActivityNotification;
                SendData.Parameter = Token;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //Task.Run(()=>HelperForLog.WriteLogForSocket("ActivityNotification", ControllerName, " MSG :" + Notification.MsgCode.ToString()));
                //Task.Run(()=>_mediator.Send(SendData));
                Task.Run(() => _signalRQueue.Enqueue(SendData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                //throw ex;
            }
        }

        #endregion

        #region GlobalEvents

        public async Task OnWalletBalChange(WalletMasterResponse Data, string WalletTypeName, string Token, short TokenType = 1, string TrnNo = "")
        {
            try
            {
                var MemberID = Token;
                if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
                {
                    Token = GetTokenByUserID(Token);
                }
                if (!string.IsNullOrEmpty(Token))
                {

                    //BuyerSideWalletBal(Data, WalletTypeName, Token);
                    //SellerSideWalletBal(Data, WalletTypeName, Token);
                    Task.Run(() => Parallel.Invoke(() => WalletBalUpdate(Data, WalletTypeName, Token),
                                    //() => SellerSideWalletBal(Data, WalletTypeName, Token),
                                    () => HelperForLog.WriteLogForSocket("OnWalletBalChange" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " Wallet Name : " + WalletTypeName + "         TRNNO : " + TrnNo.ToString() + " Member ID :" + MemberID + "   Data : " + JsonConvert.SerializeObject(Data) + " \n Token :" + Token)));
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }
        public async Task SendActivityNotificationV2(ActivityNotificationMessage ActivityNotification, string Token, short TokenType = 1, string TrnNo = "")
        {
            try
            {
                //Thread.Sleep(5000);

                //HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 1 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token);
                if (TokenType == Convert.ToInt16(enTokenType.ByUserID))
                {
                    Token = GetTokenByUserID(Token);
                }
                if (!string.IsNullOrEmpty(Token))
                {
                    ActivityNotificationV2(ActivityNotification, Token);
                    Task.Run(() => HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 2 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token));
                    //Task.Run(() => Parallel.Invoke(() => ActivityNotificationV2(ActivityNotification, Token),
                    //() => HelperForLog.WriteLogForSocket("SendActivityNotificationV2 " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), ControllerName, " 2 TRNNO : " + TrnNo.ToString() + "   Data : " + JsonConvert.SerializeObject(ActivityNotification) + " \n Token :" + Token)));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        #endregion

        #region HelperMethods        

        public string GetTokenByUserID(string ID)
        {
            try
            {
                var Redis = new RadisServices<ConnetedClientToken>(this._fact);
                string AccessToken = Redis.GetHashData(_configuration.GetValue<string>("SignalRKey:RedisToken") + ID.ToString(), "Token");
                return AccessToken;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return "";
            }
        }
        #endregion
    }

}