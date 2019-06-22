using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Infrastructure.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.DomainEvents
{
    public class WalletHandler : IRequestHandler<WalletReqRes>
    {
        private readonly IWalletService _IwalletService;
        private readonly IMarginWalletService _IMarginwalletService;
        public WalletHandler(IWalletService IwalletService, IMarginWalletService IMarginwalletService)
        {
            _IwalletService = IwalletService;
            _IMarginwalletService = IMarginwalletService;
        }
        public Task<Unit> Handle(WalletReqRes request, CancellationToken cancellationToken)
        {
            _IwalletService.CreateDefaulWallet(request.UserId);
            _IMarginwalletService.CreateAllMarginWallet(request.UserId);
            return Task.FromResult(new Unit());
        }
    }

    public class MarginWalletHandler : IRequestHandler<MarginWalletReqRes>
    {
        private readonly IMarginWalletService _IwalletService;
        public MarginWalletHandler(IMarginWalletService IwalletService)
        {
            _IwalletService = IwalletService;
        }
        public Task<Unit> Handle(MarginWalletReqRes request, CancellationToken cancellationToken)
        {
            _IwalletService.CreateAllMarginWallet(request.UserId);
            return Task.FromResult(new Unit());
        }
    }

    public class MarketCapHandler : IRequestHandler<MarketCapHandleTemp>
    {
        private readonly IMarketCap _IMarketCap;
        public MarketCapHandler(IMarketCap IMarketCap)
        {
            _IMarketCap = IMarketCap;
        }
        public Task<Unit> Handle(MarketCapHandleTemp temp, CancellationToken cancellationToken)
        {
            HelperForLog.WriteLogIntoFile("MarketCapHandler", "Task:Handle", "CallAPIForMarketCap");
            var res = _IMarketCap.CallAPI();
            HelperForLog.WriteLogIntoFile("MarketCapHandler", "Task:Handle", "Response::" + res.ReturnMsg + "###" + res.ReturnCode);
            if (res.ReturnCode == 0)
            {
                _IMarketCap.UpdateMarketCapCounter();
            }
            return Task.FromResult(new Unit());
        }
    }

    public class UserProfitHandler : IRequestHandler<ProfitTemp>
    {
        private readonly IMarketCap _IMarketCap;
        public UserProfitHandler(IMarketCap IMarketCap)
        {
            _IMarketCap = IMarketCap;
        }
        public Task<Unit> Handle(ProfitTemp temp, CancellationToken cancellationToken)
        {
            var res = _IMarketCap.CallSP_InsertUpdateProfit(temp.Date, temp.CurrencyName);
            var resArbitrage = _IMarketCap.CallSP_ArbitrageInsertUpdateProfit(temp.Date, temp.CurrencyName);
            return Task.FromResult(new Unit());
        }
    }

    public class MarginChargeHandler : IRequestHandler<RecurringChargeCalculation>
    {
        private readonly IMarginSPRepositories _walletSPRepositories;
        private readonly IMarginTransactionWallet _WalletTranx;

        public MarginChargeHandler(IMarginSPRepositories walletSPRepositories, IMarginTransactionWallet WalletTranx)
        {
            _walletSPRepositories = walletSPRepositories;
            _WalletTranx = WalletTranx;
        }
        public Task<Unit> Handle(RecurringChargeCalculation temp, CancellationToken cancellationToken)
        {
            long batchNo = 0;
            var res = _walletSPRepositories.Callsp_MarginChargeWalletCallBGTaskNew(ref batchNo); //ntrivedi new methodname added
            _WalletTranx.ReleaseMarginWalletforSettleLeverageBalance(batchNo);
            return Task.FromResult(new Unit());
        }
    }

    public class ReferralCommissionHandler : IRequestHandler<RefferralCommissionTask>
    {
        private readonly IWalletSPRepositories _walletSPRepositories;
        private readonly IMarketCap _IMarketCap;
        public ReferralCommissionHandler(IWalletSPRepositories walletSPRepositories, IMarketCap IMarketCap)
        {
            _walletSPRepositories = walletSPRepositories;
            _IMarketCap = IMarketCap;
        }
        public Task<Unit> Handle(RefferralCommissionTask temp, CancellationToken cancellationToken)
        {
            var data = _IMarketCap.GetCronData();
            if (data != null)
            {
                var today = Helpers.UTC_To_IST();
                if (Convert.ToDateTime(data.ToDate).AddHours(temp.Hour) < today)
                {
                    var insertData = _IMarketCap.InsertIntoCron(temp.Hour);
                    if (insertData != null)
                    {
                        var res = _walletSPRepositories.Callsp_ReferCommissionSignUp(insertData.Id, Convert.ToDateTime(insertData.FromDate), Convert.ToDateTime(insertData.ToDate));
                    }
                }
            }
            else
            {
                var insertData = _IMarketCap.InsertIntoCron(temp.Hour);
                if (insertData != null)
                {
                    var res = _walletSPRepositories.Callsp_ReferCommissionSignUp(insertData.Id, Convert.ToDateTime(insertData.FromDate), Convert.ToDateTime(insertData.ToDate));
                }
            }
            return Task.FromResult(new Unit());
        }
    }

    public class StakingHandler : IRequestHandler<StakingReqRes>
    {
        private readonly IWalletSPRepositories _walletSPRepositories;
        private readonly IWalletService _WalletService;
        public StakingHandler(IWalletSPRepositories walletSPRepositories, IWalletService WalletService)
        {
            _walletSPRepositories = walletSPRepositories;
            _WalletService = WalletService;
        }
        public Task<Unit> Handle(StakingReqRes request, CancellationToken cancellationToken)
        {
            UserUnstakingReq req = new UserUnstakingReq();
            var data = _WalletService.GetUnstackingCroneData();
            if (data.Data.Count > 0)
            {
                foreach (var x in data.Data)
                {
                    req.ChannelID = x.ChannelID;
                    req.StakingAmount = 0;
                    req.StakingHistoryId = x.Id;
                    req.StakingPolicyDetailId = 0;
                    long UserId = x.UserID;
                    req.Type = Core.Enums.EnUnstakeType.Full;
                    var Resp = _walletSPRepositories.Callsp_UnstakingSchemeRequest(req, UserId, request.IsReqFromAdmin);
                }
            }
            return Task.FromResult(new Unit());
        }
    }

    public class MarginTransactionHandler : IRequestHandler<ForceWithdrwLoanv2Req>
    {
        private readonly IMarketCap _IwalletService;
        public MarginTransactionHandler(IMarketCap IwalletService)
        {
            _IwalletService = IwalletService;
        }
        public Task<Unit> Handle(ForceWithdrwLoanv2Req request, CancellationToken cancellationToken)
        {
            _IwalletService.ForceWithdrwLoan();
            return Task.FromResult(new Unit());
        }
    }

    public class ServiceProviderHandler : IRequestHandler<ServiceProviderReq, ServiceProviderBalanceResponse>
    {
        string BalanceResp;
        string ethResp;
        decimal ethfee = 0;
        private readonly ICommonRepository<ThirdPartyAPIConfiguration> _thirdPartyCommonRepository;
        private readonly IGetWebRequest _getWebRequest;
        private readonly IWebApiSendRequest _webApiSendRequest;
        private readonly ICommonRepository<ServiceProviderMaster> _ServiceProviderMaster;
        private readonly WebApiParseResponse _WebApiParseResponse;

        public ServiceProviderHandler(ICommonRepository<ThirdPartyAPIConfiguration> thirdPartyCommonRepository, IGetWebRequest getWebRequest, IWebApiSendRequest webApiSendRequest, ICommonRepository<ServiceProviderMaster> ServiceProviderMaster, WebApiParseResponse WebApiParseResponse)
        {
            _thirdPartyCommonRepository = thirdPartyCommonRepository;
            _getWebRequest = getWebRequest;
            _webApiSendRequest = webApiSendRequest;
            _ServiceProviderMaster = ServiceProviderMaster;
            _WebApiParseResponse = WebApiParseResponse;
        }
        public Task<ServiceProviderBalanceResponse> Handle(ServiceProviderReq request, CancellationToken cancellationToken)
        {
            ServiceProviderBalanceResponse Resp = new ServiceProviderBalanceResponse();
            Resp.Data = new List<ServiceProviderBalance>();
            var transactionProviderResponses2 = request.transactionProviderResponses2;
            for (int i = 0; i < transactionProviderResponses2.Count; i++)
            {
                if (transactionProviderResponses2[i].ThirPartyAPIID == 0)
                {
                    Resp = new ServiceProviderBalanceResponse { ErrorCode = enErrorCode.InvalidThirdPartyAPIID, ReturnCode = enResponseCode.Fail, ReturnMsg = "No Data Found." };
                }
                var apiconfig = _thirdPartyCommonRepository.GetByIdAsync(transactionProviderResponses2[i].ThirPartyAPIID);
                var thirdPartyAPIConfiguration = apiconfig.GetAwaiter().GetResult();
                if (thirdPartyAPIConfiguration == null || transactionProviderResponses2.Count == 0)
                {
                    new ServiceProviderBalanceResponse { ErrorCode = enErrorCode.ThirdPartyDataNotFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                var thirdPartyAPIRequest = _getWebRequest.MakeWebRequestV2(transactionProviderResponses2[i].RefKey, transactionProviderResponses2[i].Address, transactionProviderResponses2[i].RouteID, transactionProviderResponses2[i].ThirPartyAPIID, transactionProviderResponses2[i].SerProDetailID);
                string apiResponse = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.BalCheckMethodType);

                var serviceProObj = _ServiceProviderMaster.GetById(transactionProviderResponses2[i].ServiceProID);
                if (serviceProObj != null)
                {
                    if (serviceProObj.ProviderName.Equals("ERC-223"))
                    {
                        thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace("getTokenBalance", "getEtherBalance");
                    }
                    else
                    {
                        thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace("contract/balance", "eth/balance");
                    }
                }
                else
                {
                    Resp = new ServiceProviderBalanceResponse { ErrorCode = enErrorCode.ThirdPartyDataNotFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                ethResp = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.BalCheckMethodType);
                if (!string.IsNullOrEmpty(apiResponse))
                {
                    WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses2[i].ThirPartyAPIID);
                    BalanceResp = ParsedResponse.Balance.ToString();
                    if (!string.IsNullOrEmpty(BalanceResp))
                    {
                        //decimal convertAmt = transactionProviderResponses2[i].ConvertAmount == 0 ? 1 : transactionProviderResponses2[i].ConvertAmount;
                        decimal responseString = Convert.ToDecimal(BalanceResp);
                        ServiceProviderBalance Result = new ServiceProviderBalance
                        {
                            Balance = responseString,
                            Address = transactionProviderResponses2[i].Address,
                            CurrencyName = transactionProviderResponses2[i].OpCode.ToUpper()
                        };
                        Resp.Data.Add(Result);
                        Resp.ErrorCode = enErrorCode.Success;
                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.FindRecored;
                        //return Resp;
                    }
                    else
                    {
                        Resp = new ServiceProviderBalanceResponse { ErrorCode = enErrorCode.BalanceIsNull, ReturnCode = enResponseCode.Fail, ReturnMsg = "Fail." };
                    }
                }
                if (!string.IsNullOrEmpty(ethResp))
                {
                    //WebAPIParseResponseCls ParsedResponses = new WebAPIParseResponseCls();
                    WebAPIParseResponseCls ParsedResponses = _WebApiParseResponse.TransactionParseResponse(ethResp, transactionProviderResponses2[i].ThirPartyAPIID);
                    BalanceResp = ParsedResponses.Balance.ToString();
                    if (!string.IsNullOrEmpty(BalanceResp))
                    {
                        ethfee = Convert.ToDecimal(BalanceResp);
                        ServiceProviderBalance Result = new ServiceProviderBalance
                        {
                            Balance = 0,
                            Fee = ethfee,
                            Address = transactionProviderResponses2[i].Address,
                            CurrencyName = "ETH"
                        };
                        Resp.Data.Add(Result);
                    }
                }
                else
                {
                    Resp = new ServiceProviderBalanceResponse { ErrorCode = enErrorCode.NullResponseFromAPI, ReturnCode = enResponseCode.Fail, ReturnMsg = "Fail." };
                }
            }
            return Task.FromResult(Resp);
        }
    }
}
