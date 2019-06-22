using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CleanArchitecture.Web.API
{

    //[ApiExplorerSettings(IgnoreApi =true)]
    //[ApiExplorerSettings(GroupName = "v2")]//rita-komal 31-12-18  for versioning saperation use
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : Controller
    {
        private readonly IBasePage _basePage;
        private readonly ILogger<TransactionController> _logger;
        private readonly IFrontTrnService _frontTrnService;
        //private readonly ITransactionProcess _transactionProcess;
        //private readonly ITransactionProcessV1 _transactionProcessV1;
        private readonly IWithdrawTransaction _WithdrawTransaction;
        private readonly IWithdrawTransactionV1 _WithdrawTransactionV1;
        private readonly UserManager<ApplicationUser> _userManager;
        //private readonly ICancelOrderProcess _cancelOrderProcess;//Rita 5-2-19 not need here, as used in handler-mediateR
        private readonly ITransactionQueue<NewTransactionRequestCls> _iTransactionQueue;
        private readonly ITransactionQueue<NewTransactionRequestMarginCls> _iTransactionMarginQueue;
        private readonly ITransactionQueue<NewWithdrawRequestCls> _TransactionsQueue;
        private readonly ITransactionQueue<NewCancelOrderRequestCls> _TransactionQueueCancelOrder;
        private readonly IBackOfficeTrnService _backOfficeService;
        private readonly ITransactionConfigService _transactionConfigService;
        private readonly ISiteTokenConversion _ISiteTokenConversion;//Rita 9-2-19 added for Site Token conversion
        private readonly IResdisTradingManagment _IResdisTradingManagment;//Rita 15-3-19 added for Site Token conversion
        private readonly IMarginClosePosition _MarginClosePosition;

        public TransactionController(ILogger<TransactionController> logger, IBasePage basePage, IFrontTrnService frontTrnService,
            UserManager<ApplicationUser> userManager, //ITransactionProcess transactionProcess, //ICancelOrderProcess cancelOrderProcess,
            IWithdrawTransaction WithdrawTransaction, ITransactionQueue<NewTransactionRequestCls> iTransactionQueue, IBackOfficeTrnService backOfficeService,
             ITransactionQueue<NewWithdrawRequestCls> TransactionsQueue, ITransactionQueue<NewCancelOrderRequestCls> TransactionQueueCancelOrder,
             ITransactionConfigService transactionConfigService, IWithdrawTransactionV1 WithdrawTransactionV1,
             ISiteTokenConversion ISiteTokenConversion, ITransactionQueue<NewTransactionRequestMarginCls> iTransactionMarginQueue,
             IResdisTradingManagment IResdisTradingManagment, IMarginClosePosition MarginClosePosition)//ITransactionProcessV1 transactionProcessV1
        {
            _logger = logger;
            _basePage = basePage;
            _frontTrnService = frontTrnService;
            //_transactionProcess = transactionProcess;
            //_transactionProcessV1 = transactionProcessV1;
            _backOfficeService = backOfficeService;
            _userManager = userManager;
            //_cancelOrderProcess = cancelOrderProcess;
            _WithdrawTransaction = WithdrawTransaction;
            _iTransactionQueue = iTransactionQueue;
            _iTransactionMarginQueue = iTransactionMarginQueue;
            _TransactionsQueue = TransactionsQueue;
            _TransactionQueueCancelOrder = TransactionQueueCancelOrder;
            _transactionConfigService = transactionConfigService;
            _WithdrawTransactionV1 = WithdrawTransactionV1;
            _ISiteTokenConversion = ISiteTokenConversion;
            _IResdisTradingManagment = IResdisTradingManagment;
            _MarginClosePosition = MarginClosePosition;
        }

        #region "Transaction Process Methods"

        [HttpPost("CreateTransactionOrderBG/{Pair}")]
        [Authorize]
        public async Task<ActionResult> CreateTransactionOrderBG([FromBody]CreateTransactionRequest Request, string Pair)
        {
            try
            {
                //decimal aa = 0;
                //aa = 0.00000067649M;
                //decimal bb = Math.Truncate(100000000 * aa) / 100000000;
                //bb= Helpers.DoRoundForTrading(aa, 8);
                //aa = 0;
                //if (aa == 0)
                //    return Ok("");
                //Do Process for CreateOrder
                //For Testing Purpose
                //Task <ApplicationUser> userResult =_userManager.GetUserAsync(HttpContext.User);

                // khushali 15-03-2019 for use API Key Authorization
                Task<ApplicationUser> userResult;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = "AuthenticationFail", ErrorCode = enErrorCode.AuthenticationFail });
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                userResult = _userManager.FindByIdAsync(UserID);
                Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");               
                
                //NewTransactionRequestCls Req = new NewTransactionRequestCls();
                ////Req.accessToken = accessToken;
                //Req.TrnMode = Request.TrnMode;
                //Req.TrnType = Request.OrderSide;
                //Req.ordertype = Request.OrderType;
                //// Req.MemberID = user.Id;
                ////Req.MemberMobile = user.Mobile;
                //Req.MemberID = 16;
                //Req.MemberMobile = "8128748841";
                ////Req.SMSCode = Pair;
                //Req.TransactionAccount = Request.CurrencyPairID.ToString();
                //Req.Amount = Request.Total;
                //Req.PairID = Request.CurrencyPairID;
                //Req.Price = Request.Price;
                //Req.Qty = Request.Amount;
                //Req.DebitAccountID = Request.DebitWalletID;
                //Req.CreditAccountID = Request.CreditWalletID;
                //Req.StopPrice = Request.StopPrice;
                //Req.GUID = Guid.NewGuid();

                Guid NewTrnGUID = Guid.NewGuid();
                ApplicationUser user = await userResult;
                string accessToken = await accessTokenResult;
                _iTransactionQueue.Enqueue(new NewTransactionRequestCls()
                {
                    TrnMode = Request.TrnMode,
                    TrnType = Request.OrderSide,
                    ordertype = Request.OrderType,
                    SMSCode = Pair,
                    TransactionAccount = Request.CurrencyPairID.ToString(),
                    Amount = Request.Total,
                    PairID = Request.CurrencyPairID,
                    Price = Request.Price,
                    Qty = Request.Amount,
                    DebitAccountID = Request.DebitWalletID,
                    CreditAccountID = Request.CreditWalletID,
                    StopPrice = Request.StopPrice,
                    GUID = NewTrnGUID,
                    MemberID = user.Id,
                    MemberMobile = user.Mobile,
                    //MemberID = 16,
                    //MemberMobile = "8128748841",
                    accessToken = accessToken//accessToken
                });
                CreateTransactionResponse Response = new CreateTransactionResponse();
                //Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
                //BizResponse MethodResp = await MethodRespTsk;            

                //Response.ReturnCode = (enResponseCode)MethodResp.ReturnCode;
                //Response.ReturnMsg = MethodResp.ReturnMsg;
                //Response.ErrorCode = MethodResp.ErrorCode;

                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Order Created";
                Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

                Response.response = new CreateOrderInfo()
                {
                    //TrnID = Req.GUID
                    TrnID = NewTrnGUID
                };

                //return Ok(Response);
                return await Task.FromResult(Ok(Response));
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [HttpPost("Withdrawal")]
        [Authorize]
        public async Task<ActionResult> Withdrawal([FromBody]WithdrawalRequest Request)
        {
            try
            {
                //Do Process for CreateOrder
                //For Testing Purpose

                //var user = await _userManager.GetUserAsync(HttpContext.User);
                // khushali 15-03-2019 for use API Key Authorization
                ApplicationUser user;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = "AuthenticationFail", ErrorCode = enErrorCode.AuthenticationFail });
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user = await _userManager.FindByIdAsync(UserID);
                var accessToken = await HttpContext.GetTokenAsync("access_token");

                Guid NewTrnGUID = Guid.NewGuid();
                _TransactionsQueue.Enqueue(new NewWithdrawRequestCls()
                {
                    accessToken = accessToken,
                    TrnMode = Request.TrnMode,
                    TrnType = enTrnType.Withdraw,
                    MemberID = user.Id,
                    MemberMobile = user.Mobile,
                    //MemberID = 16,
                    //MemberMobile = "1234567890",
                    SMSCode = Request.asset,
                    TransactionAccount = Request.address,
                    Amount = Request.Amount,
                    DebitAccountID = Request.DebitWalletID,
                    AddressLabel = Request.AddressLabel,
                    WhitelistingBit = Request.WhitelistingBit,
                    GUID = NewTrnGUID,
                });
               

                //NewWithdrawRequestCls Req = new NewWithdrawRequestCls();
                //Req.accessToken = accessToken;
                //Req.TrnMode = Request.TrnMode;
                //Req.TrnType = enTrnType.Withdraw;
                //Req.MemberID = user.Id;
                //Req.MemberMobile = user.Mobile;
                ////Req.MemberID = 16;
                ////Req.MemberMobile = "1234567890";
                //Req.SMSCode = Request.asset;
                //Req.TransactionAccount = Request.address;
                //Req.Amount = Request.Amount;
                //Req.DebitAccountID = Request.DebitWalletID;
                //Req.AddressLabel = Request.AddressLabel;
                //Req.WhitelistingBit = Request.WhitelistingBit;

                ////BizResponse myResp = await _transactionProcess.ProcessNewTransactionAsync(Req);           
                //// var myResp = new Task(async()=>_transactionProcess.ProcessNewTransactionAsync(Req));

                CreateTransactionResponse Response = new CreateTransactionResponse();
                ////Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
                //Task<BizResponse> MethodRespTsk = _WithdrawTransaction.WithdrawTransactionTransactionAsync(Req);
                
                //BizResponse MethodResp = await MethodRespTsk;

                //if (MethodResp.ReturnCode == enResponseCodeService.Success)
                //    Response.ReturnCode = enResponseCode.Success;
                //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
                //    Response.ReturnCode = enResponseCode.Fail;
                //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
                //    Response.ReturnCode = enResponseCode.InternalError;

                //Response.ReturnCode = (enResponseCode)MethodResp.ReturnCode;
                //Response.ReturnMsg = MethodResp.ReturnMsg;
                //Response.ErrorCode = MethodResp.ErrorCode;

                //Response.response = new CreateOrderInfo()
                //{
                //    TrnID = Req.GUID
                //    //order_id = 1000001,
                //    //pair_name = "ltcusd",
                //    //price = 10,
                //    //side = "buy",
                //    //type = "stop-loss",
                //    //volume = 10
                //};

                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Order Created";
                Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

                Response.response = new CreateOrderInfo()
                {
                    TrnID = NewTrnGUID
                };

                //return Ok(Response);
                return await Task.FromResult(Ok(Response));
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
           
        }

        [Authorize]
        [HttpPost("WithdrawalTransaction")]
        public async Task<ActionResult<GetWithdrawalTransactionResponse>> WithdrawalTransaction(WithdrawalConfirmationRequest Request)
        {
            try
            {
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                // khushali 15-03-2019 for use API Key Authorization
                ApplicationUser user;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = "AuthenticationFail", ErrorCode = enErrorCode.AuthenticationFail });
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user = await _userManager.FindByIdAsync(UserID);
                
                GetWithdrawalTransactionResponse Response = new GetWithdrawalTransactionResponse();

                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    Response.ReturnMsg = "Fail";
                    return Ok(Response);
                }

                var response = await _WithdrawTransactionV1.WithdrawTransactionAPICallProcessAsync(Request, user.Id);
                var responsedata = _frontTrnService.GetWithdrawalTransaction(Request.RefNo); // Uday 12-01-2019 Add Withdrwal Data In response;

                if (responsedata != null)
                {
                    if (Request.TransactionBit == 1)
                    {
                        responsedata.FinalAmount = responsedata.Amount;
                    }
                    else if (Request.TransactionBit == 2)
                    {
                        responsedata.FinalAmount = responsedata.Amount + responsedata.Fee;
                    }
                }

                Response.Response = responsedata;
                Response.ErrorCode = response.ErrorCode;
                Response.ReturnMsg = response.ReturnMsg;

                if(response.ReturnCode == enResponseCodeService.Fail)
                    Response.ReturnCode = enResponseCode.Fail;
                else
                    Response.ReturnCode = enResponseCode.Success;

                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [Authorize]
        [HttpPost("GetWithdrawalTransaction/{RefId}")]
        public ActionResult<GetWithdrawalTransactionResponse> GetWithdrawalTransaction(string RefId)
        {
            GetWithdrawalTransactionResponse Response = new GetWithdrawalTransactionResponse();
            try
            {   
                var responsedata = _frontTrnService.GetWithdrawalTransaction(RefId);
                if (responsedata != null)
                {
                    Response.Response = responsedata;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [Authorize]
        [HttpPost("ResendEmailWithdrawalConfirmation/{TrnNo}")]
        public async Task<ActionResult<BizResponse>> ResendEmailWithdrawalConfirmation(long TrnNo)
        {
            try
            {
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                // khushali 15-03-2019 for use API Key Authorization
                ApplicationUser user;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = "AuthenticationFail", ErrorCode = enErrorCode.AuthenticationFail });
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user = await _userManager.FindByIdAsync(UserID);

                //user = await _userManager.GetUserAsync(HttpContext.User);

                BizResponse Response = new BizResponse();
                if (user == null)
                {
                    Response.ReturnCode = enResponseCodeService.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    Response.ReturnMsg = "Fail";

                    return Ok(Response);
                }

                var ResponseData  = _WithdrawTransactionV1.ResendEmailWithdrawalConfirmation(TrnNo,user.Id);
                return Ok(ResponseData.Result);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("CancelOrder")]
        [Authorize]
        public async Task<ActionResult> CancelOrder([FromBody]CancelOrderRequest Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                // khushali 15-03-2019 for use API Key Authorization
                ApplicationUser user;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = "AuthenticationFail", ErrorCode = enErrorCode.AuthenticationFail });
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user = await _userManager.FindByIdAsync(UserID);

                //user = await _userManager.GetUserAsync(HttpContext.User);
                var accessToken = await HttpContext.GetTokenAsync("access_token");

                //Task<BizResponse> MethodRespCancel = _cancelOrderProcess.ProcessCancelOrderAsyncV1(Request, accessToken);
                //BizResponse MethodResp = await MethodRespCancel;

                //if (MethodResp.ReturnCode == enResponseCodeService.Success)
                //    Response.ReturnCode = enResponseCode.Success;
                //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
                //    Response.ReturnCode = enResponseCode.Fail;
                //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
                //    Response.ReturnCode = enResponseCode.InternalError;

                //Response.ReturnMsg = MethodResp.ReturnMsg;
                //Response.ErrorCode = MethodResp.ErrorCode;
                //return Ok(MethodResp);
                if(Request.CancelAll==0)
                {
                    if(Request.TranNo==0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = "Enter Valid Transaction No";
                        Response.ErrorCode = enErrorCode.CancelOrder_EnterValidTransactionNo;
                        return await Task.FromResult(Ok(Response));
                    }
                }
                else if (Request.CancelAll == 2)
                {
                    if (Convert.ToInt32(Request.OrderType) == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = "Enter Valid Maket Type";
                        Response.ErrorCode = enErrorCode.InValidOrderType;
                        return await Task.FromResult(Ok(Response));
                    }
                }
                _TransactionQueueCancelOrder.Enqueue(new NewCancelOrderRequestCls()
                {
                    MemberID = user.Id,
                    TranNo = Request.TranNo,
                    accessToken = accessToken,
                    CancelAll=Request.CancelAll,
                    OrderType=Request.OrderType,
                    IsMargin=Request.IsMargin//Rita 21-2-19 for margin trading
                });
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Cancel Order Process Initialize";
                Response.ErrorCode = enErrorCode.CancelOrder_ProccedSuccess;

                return await Task.FromResult(Ok(Response));
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region "History Method"
        [HttpPost("GetTradeHistory")]
        [Authorize]
        public async Task<ActionResult<GetTradeHistoryResponse>> GetTradeHistory([FromBody]TradeHistoryRequest request)
        {
            GetTradeHistoryResponse Response = new GetTradeHistoryResponse();
            Int16 trnType = 999, marketType = 999, status = 999;
            long PairId = 999;
            string sCondition = "1=1";
            try
            {
                Task<ApplicationUser> user1=null;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.AuthenticationFail;
                    Response.ReturnMsg = "AuthenticationFail";
                    return Response;
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                if (!string.IsNullOrEmpty(UserID))
                    user1 = _userManager.FindByIdAsync(UserID);

                string expectedSignature = HttpContext.Request.Headers["X-Hub-Signature"];
                string ApiKey = HttpContext.Request.Headers["X-MJBSPLX-APIKEY"];
                
                if (!string.IsNullOrEmpty(request.Pair))
                {
                    if (!_frontTrnService.IsValidPairName(request.Pair))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    PairId = _frontTrnService.GetPairIdByName(request.Pair,request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                    if (PairId == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    sCondition += " And TTQ.PairID=" + PairId;
                }
                if (!string.IsNullOrEmpty(request.Trade) || !string.IsNullOrEmpty(request.MarketType) || !string.IsNullOrEmpty(request.FromDate))
                {
                    if (!string.IsNullOrEmpty(request.Trade))
                    {
                        trnType = _frontTrnService.IsValidTradeType(request.Trade);
                        if (trnType == 999)
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InValidTrnType;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        sCondition += " AND TTQ.TrnType=" + trnType;
                    }
                    if (!string.IsNullOrEmpty(request.MarketType))
                    {
                        marketType = _frontTrnService.IsValidMarketType(request.MarketType);
                        if (marketType == 999)
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidMarketType;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        sCondition += " AND TSL.ordertype=" + marketType;
                    }
                    if (!string.IsNullOrEmpty(request.FromDate))
                    {
                        if (string.IsNullOrEmpty(request.ToDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        if (!_frontTrnService.IsValidDateFormate(request.FromDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        if (!_frontTrnService.IsValidDateFormate(request.ToDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        //sCondition += " AND TTQ.TrnDate Between '" + fDate  + " AND '" + tDate  + "' ";
                        sCondition += "AND TTQ.SettledDate Between {0} AND {1} ";
                    }
                }
                if ((request.Status.ToString()) == "0")
                {
                    status = 999;
                }
                else
                {
                    if (request.Status != 1 && request.Status != 2 && request.Status != 9)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidStatusType;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    status = Convert.ToInt16(request.Status);
                }

                ApplicationUser user = user1.GetAwaiter().GetResult();
                long MemberID =user.Id;
                Response.response = _frontTrnService.GetTradeHistory(MemberID, sCondition, request.FromDate, request.ToDate, request.Page, status, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (Response.response.Count == 0)
                {
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = "Success";
                    return Response;
                }
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [HttpPost("GetActiveOrder")]  
        [Authorize]
        public async Task<ActionResult<GetActiveOrderResponse>> GetActiveOrder([FromBody]GetActiveOrderRequest request)
        {
            GetActiveOrderResponse Response = new GetActiveOrderResponse();
            Int16 trnType = 999;
            long PairId = 999;
            try
            {
                //Task<ApplicationUser> user1 = _userManager.GetUserAsync(HttpContext.User);
                // khushali 15-03-2019 for use API Key Authorization
                Task<ApplicationUser> user1;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.AuthenticationFail;
                    Response.ReturnMsg = "AuthenticationFail";
                    return Response;
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user1 =  _userManager.FindByIdAsync(UserID);

                if (!string.IsNullOrEmpty(request.Pair))
                {
                    if (!_frontTrnService.IsValidPairName(request.Pair))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    PairId = _frontTrnService.GetPairIdByName(request.Pair,request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                    if (PairId == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                }
                //if (request.Page == 0)
                //{
                //    Response.ReturnCode = enResponseCode.Fail;
                //    Response.ErrorCode = enErrorCode.InValidPageNo;
                //    return BadRequest(Response);
                //}
                if (!string.IsNullOrEmpty(request.OrderType) || !string.IsNullOrEmpty(request.FromDate))
                {
                    if (!string.IsNullOrEmpty(request.OrderType))
                    {
                        trnType = _frontTrnService.IsValidTradeType(request.OrderType);
                        if (trnType == 999)
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InValidTrnType;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                    }
                    if (!string.IsNullOrEmpty(request.FromDate))
                    {
                        if (string.IsNullOrEmpty(request.ToDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        if (!_frontTrnService.IsValidDateFormate(request.FromDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        if (!_frontTrnService.IsValidDateFormate(request.ToDate))
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                            Response.ReturnMsg = "Fail";
                            return Response;
                        }
                        //sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
                    }
                }
                ApplicationUser user = user1.GetAwaiter().GetResult();
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                long MemberID =user.Id;
                Response.response = _frontTrnService.GetActiveOrder(MemberID,request .FromDate,request .ToDate,PairId,request.Page,trnType, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (Response.response.Count == 0)
                {
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = "Success";
                    return Response;
                }
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }
        
        [HttpPost("GetRecentOrder")] 
        [Authorize]
        public async Task<ActionResult<GetRecentTradeResponce>> GetRecentOrder(string Pair="999")
        {
            short IsMargin = 0;
            long PairId = 999;
            GetRecentTradeResponce Response = new GetRecentTradeResponce();
            try
            {
                Task<ApplicationUser> user1;
                var UserID = "";
                if (!HttpContext.Items.Keys.Contains("APIUserID"))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.AuthenticationFail;
                    Response.ReturnMsg = "AuthenticationFail";
                    return Response;
                }
                UserID = HttpContext.Items["APIUserID"].ToString();
                user1 = _userManager.FindByIdAsync(UserID);
                if (Pair != "999")
                {
                    if (!_frontTrnService.IsValidPairName(Pair))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    PairId = _frontTrnService.GetPairIdByName(Pair,IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                    if (PairId == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                }
                ApplicationUser user = user1.GetAwaiter().GetResult();
                long MemberID = user.Id;
                Response.response = _frontTrnService.GetRecentOrder(PairId,MemberID, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (Response.response.Count == 0)
                {
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = "Success";
                    return Response;
                }
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetOrderhistory")]
        public ActionResult<GetTradeHistoryResponse> GetOrderhistory(string Pair="999")
        {
            short IsMargin = 0;
            GetTradeHistoryResponse Response = new GetTradeHistoryResponse();
            long PairId = 999;
            try
            {
                if(Pair != "999")
                {
                    if (!_frontTrnService.IsValidPairName(Pair))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                    PairId = _frontTrnService.GetPairIdByName(Pair,IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                    if (PairId == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidPairName;
                        Response.ReturnMsg = "Fail";
                        return Response;
                    }
                }
                Response.response = _frontTrnService.GetTradeHistory(PairId, "", "", "", 0, 0, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                Response.ReturnCode = enResponseCode.Success;
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }


        #endregion

        #region "Trading Data Method"
        [HttpGet("GetBuyerBook/{Pair}")]
        public ActionResult<GetBuySellBookResponse> GetBuyerBook(string Pair)
        {
            GetBuySellBookResponse Response = new GetBuySellBookResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, 0);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                var responsedata = _frontTrnService.GetBuyerBook(id, 0);//Rita 22-2-19 for Margin Trading Data bit
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.response = responsedata;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [HttpGet("GetSellerBook/{Pair}")]
        public ActionResult<GetBuySellBookResponse> GetSellerBook(string Pair)
        {
            GetBuySellBookResponse Response = new GetBuySellBookResponse();
            short IsMargin = 0;
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                var responsedata = _frontTrnService.GetSellerBook(id, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.response = responsedata;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [HttpGet("GetMarketCap/{Pair}")]
        public ActionResult<MarketCapResponse> GetMarketCap(string Pair)
        {
            short IsMargin = 0;
            MarketCapResponse Response = new MarketCapResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                if (IsMargin == 1)
                    Response.response = _frontTrnService.GetMarketCapMargin(id);
                else
                    Response.response = _frontTrnService.GetMarketCap(id);
                Response.ReturnCode = enResponseCode.Success;
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetVolumeDataByPair/{Pair}")]
        public ActionResult<GetVolumeDataByPairResponse> GetVolumeDataByPair(string Pair)
        {
            short IsMargin = 0;
            GetVolumeDataByPairResponse Response = new GetVolumeDataByPairResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                VolumeDataRespose responsedata;
                if (IsMargin == 1)
                    responsedata = _frontTrnService.GetVolumeDataByPairMargin(id);
                else
                    responsedata = _frontTrnService.GetVolumeDataByPair(id);

                if (responsedata != null)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetVolumeData/{BasePair}")]
        public ActionResult<GetVolumeDataResponse> GetVolumeData(string BasePair)
        {
            short IsMargin = 0;
            GetVolumeDataResponse Response = new GetVolumeDataResponse();
            try
            {
                long BasePairId = _frontTrnService.GetBasePairIdByName(BasePair, IsMargin);
                if (BasePairId == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                var responsedata = _frontTrnService.GetVolumeData(BasePairId, IsMargin);
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.response = responsedata;
                    Response.ReturnMsg = "Success";
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        
        [HttpGet("GetTradePairAsset")]
        public ActionResult<TradePairAssetResponce> GetTradePairAsset()
        {
            short IsMargin = 0;
            TradePairAssetResponce Response = new TradePairAssetResponce();
            try
            {
                List<BasePairResponse> responsedata;
                if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
                    responsedata = _frontTrnService.GetTradePairAssetMargin();
                else
                    responsedata = _frontTrnService.GetTradePairAsset();

                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetTradePairByName/{Pair}")]
        public ActionResult<TradePairByNameResponse> GetTradePairByName(string Pair)
        {
            short IsMargin = 0;
            TradePairByNameResponse Response = new TradePairByNameResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                if (IsMargin == 1)
                    Response.response = _frontTrnService.GetTradePairByNameMargin(id);
                else
                    Response.response = _frontTrnService.GetTradePairByName(id);

                Response.ReturnCode = enResponseCode.Success;
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnMsg = "Success";
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        [HttpGet("GetGraphDetail/{Pair}/{Interval}")]
        public ActionResult<GetGraphDetailReponse> GetGraphDetail(string Pair, string Interval)
        {
            short IsMargin = 0;
            int IntervalTime = 0;
            string IntervalData = "";
            GetGraphDetailReponse Response = new GetGraphDetailReponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                _frontTrnService.GetIntervalTimeValue(Interval, ref IntervalTime, ref IntervalData);
                if (IntervalTime == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.Graph_InvalidIntervalTime;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                var responsedata = _frontTrnService.GetGraphDetail(id, IntervalTime, IntervalData, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.response = responsedata;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetPairRates/{Pair}")]
        public ActionResult<GetPairRatesResponse> GetPairRates(string Pair)
        {
            short IsMargin = 0;
            GetPairRatesResponse Response = new GetPairRatesResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                var responsedata = _frontTrnService.GetPairRates(id);
                if (responsedata != null)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetMarketDepthChart/{Pair}")]
        public ActionResult<GetMarketDepthChartResponse> GetMarketDepthChart(string Pair)
        {
            //Uday 07-01-2019  MarketDepth Chart based on buyer and seller book.
            short IsMargin = 0;
            GetMarketDepthChartResponse Response = new GetMarketDepthChartResponse();
            try
            {
                if (!_frontTrnService.IsValidPairName(Pair))  //Check PairName is valid or not
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InvalidPairName;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit //Get Id based on pair name
                if (id == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                    return Response;
                }
                GetBuySellMarketBook responsedata;
                if (IsMargin == 1)
                    responsedata = _frontTrnService.GetMarketDepthChartMargin(id); //Get market depth chart based on buyer and seller book
                else
                    responsedata = _frontTrnService.GetMarketDepthChart(id); //Get market depth chart based on buyer and seller book

                if (responsedata != null)
                {
                    Response.Response = responsedata;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = "Success";
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "Fail";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }

        }

        #endregion
    }
}