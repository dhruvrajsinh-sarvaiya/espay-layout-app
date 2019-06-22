using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackofficeCleanArchitecture.Web.API
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
        private readonly ITransactionQueue<NewTransactionRequestArbitrageCls> _iTransactionArbitrageQueue;
        private readonly ITransactionQueue<NewWithdrawRequestCls> _TransactionsQueue;
        private readonly ITransactionQueue<NewCancelOrderRequestCls> _TransactionQueueCancelOrder;
        private readonly ITransactionQueue<NewCancelOrderArbitrageRequestCls> _TransactionQueueCancelOrderArbitrage; //komal 07-06-2019 cancel arbitrage Trade
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
             IResdisTradingManagment IResdisTradingManagment, IMarginClosePosition MarginClosePosition,
             ITransactionQueue<NewTransactionRequestArbitrageCls> iTransactionArbitrageQueue,
             ITransactionQueue<NewCancelOrderArbitrageRequestCls> TransactionQueueCancelOrderArbitrage)//ITransactionProcessV1 transactionProcessV1
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
            _iTransactionArbitrageQueue = iTransactionArbitrageQueue;
            _TransactionQueueCancelOrderArbitrage = TransactionQueueCancelOrderArbitrage;
        }

        #region "Transaction Process Methods"

        //[HttpPost("CreateTransactionOrder/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrder([FromBody]CreateTransactionRequest Request, string Pair)
        //{
        //    try
        //    {
        //        //Do Process for CreateOrder
        //        //For Testing Purpose
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        NewTransactionRequestCls Req = new NewTransactionRequestCls();
        //        Req.accessToken = accessToken;
        //        Req.TrnMode = Request.TrnMode;
        //        Req.TrnType = Request.OrderSide;
        //        Req.ordertype = Request.OrderType;
        //        Req.MemberID = user.Id;
        //        Req.MemberMobile = user.Mobile;
        //        //Req.MemberID = 16;
        //        //Req.MemberMobile = "8128748841";
        //        Req.SMSCode = Pair;
        //        Req.TransactionAccount = Request.CurrencyPairID.ToString();
        //        Req.Amount = Request.Total;
        //        Req.PairID = Request.CurrencyPairID;
        //        Req.Price = Request.Price;
        //        Req.Qty = Request.Amount;
        //        Req.DebitAccountID = Request.DebitWalletID;
        //        Req.CreditAccountID = Request.CreditWalletID;
        //        Req.StopPrice = Request.StopPrice;
        //        Req.GUID = Guid.NewGuid();
        //        //BizResponse myResp = await _transactionProcess.ProcessNewTransactionAsync(Req);           
        //        // var myResp = new Task(async()=>_transactionProcess.ProcessNewTransactionAsync(Req));

        //        CreateTransactionResponse Response = new CreateTransactionResponse();
        //        //Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
        //        Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
        //        BizResponse MethodResp = await MethodRespTsk;

        //        //if (MethodResp.ReturnCode == enResponseCodeService.Success)
        //        //    Response.ReturnCode = enResponseCode.Success;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
        //        //    Response.ReturnCode = enResponseCode.InternalError;

        //        Response.ReturnCode = (enResponseCode)MethodResp.ReturnCode;
        //        Response.ReturnMsg = MethodResp.ReturnMsg;
        //        Response.ErrorCode = MethodResp.ErrorCode;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = Req.GUID                  
        //        };

        //        //Response.ReturnCode = enResponseCode.Success;
        //        //return returnDynamicResult(Response);
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("CreateTransactionOrderBG/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrderBG([FromBody]CreateTransactionRequest Request, string Pair)
        //{
        //    try
        //    {
        //        //decimal aa = 0;
        //        //aa = 0.00000067649M;
        //        //decimal bb = Math.Truncate(100000000 * aa) / 100000000;
        //        //bb= Helpers.DoRoundForTrading(aa, 8);
        //        //aa = 0;
        //        //if (aa == 0)
        //        //    return Ok("");
        //        //Do Process for CreateOrder
        //        //For Testing Purpose
        //        //Task <ApplicationUser> userResult =_userManager.GetUserAsync(HttpContext.User);

        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> userResult;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            userResult = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            userResult = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");

        //        //NewTransactionRequestCls Req = new NewTransactionRequestCls();
        //        ////Req.accessToken = accessToken;
        //        //Req.TrnMode = Request.TrnMode;
        //        //Req.TrnType = Request.OrderSide;
        //        //Req.ordertype = Request.OrderType;
        //        //// Req.MemberID = user.Id;
        //        ////Req.MemberMobile = user.Mobile;
        //        //Req.MemberID = 16;
        //        //Req.MemberMobile = "8128748841";
        //        ////Req.SMSCode = Pair;
        //        //Req.TransactionAccount = Request.CurrencyPairID.ToString();
        //        //Req.Amount = Request.Total;
        //        //Req.PairID = Request.CurrencyPairID;
        //        //Req.Price = Request.Price;
        //        //Req.Qty = Request.Amount;
        //        //Req.DebitAccountID = Request.DebitWalletID;
        //        //Req.CreditAccountID = Request.CreditWalletID;
        //        //Req.StopPrice = Request.StopPrice;
        //        //Req.GUID = Guid.NewGuid();

        //        Guid NewTrnGUID = Guid.NewGuid();
        //        ApplicationUser user = await userResult;
        //        string accessToken = await accessTokenResult;
        //        _iTransactionQueue.Enqueue(new NewTransactionRequestCls()
        //        {
        //            TrnMode = Request.TrnMode,
        //            TrnType = Request.OrderSide,
        //            ordertype = Request.OrderType,
        //            SMSCode = Pair,
        //            TransactionAccount = Request.CurrencyPairID.ToString(),
        //            Amount = Request.Total,
        //            PairID = Request.CurrencyPairID,
        //            Price = Request.Price,
        //            Qty = Request.Amount,
        //            DebitAccountID = Request.DebitWalletID,
        //            CreditAccountID = Request.CreditWalletID,
        //            StopPrice = Request.StopPrice,
        //            GUID = NewTrnGUID,
        //            MemberID = user.Id,
        //            MemberMobile = user.Mobile,
        //            //MemberID = 16,
        //            //MemberMobile = "8128748841",
        //            accessToken = accessToken//accessToken
        //        });
        //        CreateTransactionResponse Response = new CreateTransactionResponse();
        //        //Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
        //        //BizResponse MethodResp = await MethodRespTsk;            

        //        //Response.ReturnCode = (enResponseCode)MethodResp.ReturnCode;
        //        //Response.ReturnMsg = MethodResp.ReturnMsg;
        //        //Response.ErrorCode = MethodResp.ErrorCode;

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            //TrnID = Req.GUID
        //            TrnID = NewTrnGUID
        //        };

        //        //return Ok(Response);
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        ////Rita 15-2-19 new method for Margin Trading
        //[HttpPost("CreateTransactionOrderMargin/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrderMargin([FromBody]CreateTransactionRequest Request, string Pair)
        //{
        //    try
        //    {
        //        //Task<ApplicationUser> userResult = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> userResult;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            userResult = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            userResult = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");

        //        Guid NewTrnGUID = Guid.NewGuid();
        //        ApplicationUser user = await userResult;
        //        string accessToken = await accessTokenResult;
        //        _iTransactionMarginQueue.Enqueue(new NewTransactionRequestMarginCls()
        //        {
        //            TrnMode = Request.TrnMode,
        //            TrnType = Request.OrderSide,
        //            ordertype = Request.OrderType,
        //            SMSCode = Pair,
        //            TransactionAccount = Request.CurrencyPairID.ToString(),
        //            Amount = Request.Total,
        //            PairID = Request.CurrencyPairID,
        //            Price = Request.Price,
        //            Qty = Request.Amount,
        //            DebitAccountID = Request.DebitWalletID,
        //            CreditAccountID = Request.CreditWalletID,
        //            StopPrice = Request.StopPrice,
        //            GUID = NewTrnGUID,
        //            MemberID = user.Id,
        //            MemberMobile = user.Mobile,
        //            accessToken = accessToken
        //        });
        //        CreateTransactionResponse Response = new CreateTransactionResponse();

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = NewTrnGUID
        //        };
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("CreateTransactionOrderArbitrage/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrderArbitrage([FromBody]CreateTransactionRequest Request, string Pair)
        //{
        //    try
        //    {
        //        Task<ApplicationUser> userResult;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            userResult = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            userResult = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");

        //        Guid NewTrnGUID = Guid.NewGuid();
        //        ApplicationUser user = await userResult;
        //        string accessToken = await accessTokenResult;
        //        _iTransactionArbitrageQueue.Enqueue(new NewTransactionRequestArbitrageCls()
        //        {
        //            TrnMode = Request.TrnMode,
        //            TrnType = Request.OrderSide,
        //            ordertype = Request.OrderType,
        //            SMSCode = Pair,
        //            TransactionAccount = Request.CurrencyPairID.ToString(),
        //            Amount = Request.Total,
        //            PairID = Request.CurrencyPairID,
        //            Price = Request.Price,
        //            Qty = Request.Amount,
        //            DebitAccountID = Request.DebitWalletID,
        //            CreditAccountID = Request.CreditWalletID,
        //            StopPrice = Request.StopPrice,
        //            GUID = NewTrnGUID,
        //            MemberID = user.Id,
        //            MemberMobile = user.Mobile,
        //            accessToken = accessToken,//accessToken
        //            LPType =Request.LPType
        //        });
        //        CreateTransactionResponse Response = new CreateTransactionResponse();

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = NewTrnGUID
        //        };
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("CreateTransactionOrderArbitrageBulk/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrderArbitrageBulk([FromBody]CreateTransactionRequestBulk Request, string Pair)
        //{
        //    try
        //    {
        //        Task<ApplicationUser> userResult;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            userResult = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            userResult = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");

        //        Guid NewTrnGUID = Guid.NewGuid();
        //        ApplicationUser user = await userResult;
        //        string accessToken = await accessTokenResult;

        //        foreach(CreateTransactionRequest sRequest in Request.MultipleOrderList)
        //        {
        //            _iTransactionArbitrageQueue.Enqueue(new NewTransactionRequestArbitrageCls()
        //            {
        //                TrnMode = sRequest.TrnMode,
        //                TrnType = sRequest.OrderSide,
        //                ordertype = sRequest.OrderType,
        //                SMSCode = Pair,
        //                TransactionAccount = sRequest.CurrencyPairID.ToString(),
        //                Amount = sRequest.Total,
        //                PairID = sRequest.CurrencyPairID,
        //                Price = sRequest.Price,
        //                Qty = sRequest.Amount,
        //                DebitAccountID = sRequest.DebitWalletID,
        //                CreditAccountID = sRequest.CreditWalletID,
        //                StopPrice = sRequest.StopPrice,
        //                GUID = NewTrnGUID,
        //                MemberID = user.Id,
        //                MemberMobile = user.Mobile,
        //                accessToken = accessToken,//accessToken
        //                LPType = sRequest.LPType
        //            });
        //            await Task.Delay(300);
        //        }

        //        CreateTransactionResponse Response = new CreateTransactionResponse();

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = NewTrnGUID
        //        };
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("CreateTransactionOrderSmartArbitrage/{Pair}")]
        //[Authorize]
        //public async Task<ActionResult> CreateTransactionOrderSmartArbitrage([FromBody]CreateTransactionRequestBulk Request, string Pair)
        //{
        //    try
        //    {
        //        Task<ApplicationUser> userResult;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            userResult = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            userResult = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        Task<string> accessTokenResult = HttpContext.GetTokenAsync("access_token");

        //        CreateTransactionResponse Response = new CreateTransactionResponse();

        //        if (Request.MultipleOrderList.Count() != 2)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidSmartArbitrageOrder;
        //            Response.ReturnMsg = "Fail";
        //            return await Task.FromResult(Ok(Response));
        //        }
        //        short IsBuy = 0;
        //        short IsSell = 0;
        //        foreach (CreateTransactionRequest sRequest in Request.MultipleOrderList)
        //        {
        //            if (sRequest.OrderSide == enTrnType.Buy_Trade)
        //                IsBuy = 1;
        //            else
        //                IsSell = 1;
        //        }
        //        if(IsBuy==0 || IsSell==0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.SmartArbitrageOrder_ShouldHave_BothBuyNSell;
        //            Response.ReturnMsg = "Fail";
        //            return await Task.FromResult(Ok(Response));
        //        }


        //        Guid NewTrnGUID = Guid.NewGuid();
        //        ApplicationUser user = await userResult;
        //        string accessToken = await accessTokenResult;

        //        foreach (CreateTransactionRequest sRequest in Request.MultipleOrderList)
        //        {
        //            _iTransactionArbitrageQueue.Enqueue(new NewTransactionRequestArbitrageCls()
        //            {
        //                TrnMode = sRequest.TrnMode,
        //                TrnType = sRequest.OrderSide,
        //                ordertype = sRequest.OrderType,
        //                SMSCode = Pair,
        //                TransactionAccount = sRequest.CurrencyPairID.ToString(),
        //                Amount = sRequest.Total,
        //                PairID = sRequest.CurrencyPairID,
        //                Price = sRequest.Price,
        //                Qty = sRequest.Amount,
        //                DebitAccountID = sRequest.DebitWalletID,
        //                CreditAccountID = sRequest.CreditWalletID,
        //                StopPrice = sRequest.StopPrice,
        //                GUID = NewTrnGUID,
        //                MemberID = user.Id,
        //                MemberMobile = user.Mobile,
        //                accessToken = accessToken,//accessToken
        //                LPType = sRequest.LPType,
        //                IsSmartArbitrage = 1
        //            });
        //            await Task.Delay(300);
        //        }



        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = NewTrnGUID
        //        };
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        ////Rita 13-9-19 Close Open Position User's Pair Wise
        //[HttpPost("CloseOpenPostionMargin")]
        //[Authorize]
        //public async Task<ActionResult<CloseOpenPostionResponseMargin>> CloseOpenPostionMargin([FromBody]CloseOpenPostionRequestMargin Request)
        //{
        //    try
        //    {
        //        CloseOpenPostionResponseMargin Response = new CloseOpenPostionResponseMargin();

        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        Response = await _MarginClosePosition.CloseOpenPostionMargin(Request.PairID, user.Id, accessToken);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost("Withdrawal")]
        //[Authorize]
        //public async Task<ActionResult> Withdrawal([FromBody]WithdrawalRequest Request)
        //{
        //    try
        //    {
        //        //Do Process for CreateOrder
        //        //For Testing Purpose

        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }

        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        Guid NewTrnGUID = Guid.NewGuid();
        //        _TransactionsQueue.Enqueue(new NewWithdrawRequestCls()
        //        {
        //            accessToken = accessToken,
        //            TrnMode = Request.TrnMode,
        //            TrnType = enTrnType.Withdraw,
        //            MemberID = user.Id,
        //            MemberMobile = user.Mobile,
        //            //MemberID = 16,
        //            //MemberMobile = "1234567890",
        //            SMSCode = Request.asset,
        //            TransactionAccount = Request.address,
        //            Amount = Request.Amount,
        //            DebitAccountID = Request.DebitWalletID,
        //            AddressLabel = Request.AddressLabel,
        //            WhitelistingBit = Request.WhitelistingBit,
        //            GUID = NewTrnGUID,
        //        });


        //        //NewWithdrawRequestCls Req = new NewWithdrawRequestCls();
        //        //Req.accessToken = accessToken;
        //        //Req.TrnMode = Request.TrnMode;
        //        //Req.TrnType = enTrnType.Withdraw;
        //        //Req.MemberID = user.Id;
        //        //Req.MemberMobile = user.Mobile;
        //        ////Req.MemberID = 16;
        //        ////Req.MemberMobile = "1234567890";
        //        //Req.SMSCode = Request.asset;
        //        //Req.TransactionAccount = Request.address;
        //        //Req.Amount = Request.Amount;
        //        //Req.DebitAccountID = Request.DebitWalletID;
        //        //Req.AddressLabel = Request.AddressLabel;
        //        //Req.WhitelistingBit = Request.WhitelistingBit;

        //        ////BizResponse myResp = await _transactionProcess.ProcessNewTransactionAsync(Req);           
        //        //// var myResp = new Task(async()=>_transactionProcess.ProcessNewTransactionAsync(Req));

        //        CreateTransactionResponse Response = new CreateTransactionResponse();
        //        ////Task<BizResponse> MethodRespTsk = _transactionProcess.ProcessNewTransactionAsync(Req);
        //        //Task<BizResponse> MethodRespTsk = _WithdrawTransaction.WithdrawTransactionTransactionAsync(Req);

        //        //BizResponse MethodResp = await MethodRespTsk;

        //        //if (MethodResp.ReturnCode == enResponseCodeService.Success)
        //        //    Response.ReturnCode = enResponseCode.Success;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
        //        //    Response.ReturnCode = enResponseCode.InternalError;

        //        //Response.ReturnCode = (enResponseCode)MethodResp.ReturnCode;
        //        //Response.ReturnMsg = MethodResp.ReturnMsg;
        //        //Response.ErrorCode = MethodResp.ErrorCode;

        //        //Response.response = new CreateOrderInfo()
        //        //{
        //        //    TrnID = Req.GUID
        //        //    //order_id = 1000001,
        //        //    //pair_name = "ltcusd",
        //        //    //price = 10,
        //        //    //side = "buy",
        //        //    //type = "stop-loss",
        //        //    //volume = 10
        //        //};

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Order Created";
        //        Response.ErrorCode = enErrorCode.TransactionProcessSuccess;

        //        Response.response = new CreateOrderInfo()
        //        {
        //            TrnID = NewTrnGUID
        //        };

        //        //return Ok(Response);
        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[Authorize]
        //[HttpPost("WithdrawalTransaction")]
        //public async Task<ActionResult<GetWithdrawalTransactionResponse>> WithdrawalTransaction(WithdrawalConfirmationRequest Request)
        //{
        //    try
        //    {
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        GetWithdrawalTransactionResponse Response = new GetWithdrawalTransactionResponse();

        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //            Response.ReturnMsg = "Fail";
        //            return Ok(Response);
        //        }

        //        var response = await _WithdrawTransactionV1.WithdrawTransactionAPICallProcessAsync(Request, user.Id, 0);
        //        var responsedata = _frontTrnService.GetWithdrawalTransaction(Request.RefNo); // Uday 12-01-2019 Add Withdrwal Data In response;

        //        if (responsedata != null)
        //        {
        //            if (Request.TransactionBit == 1)
        //            {
        //                responsedata.FinalAmount = responsedata.Amount;
        //            }
        //            else if (Request.TransactionBit == 2)
        //            {
        //                responsedata.FinalAmount = responsedata.Amount + responsedata.Fee;
        //            }
        //        }

        //        Response.Response = responsedata;
        //        Response.ErrorCode = response.ErrorCode;
        //        Response.ReturnMsg = response.ReturnMsg;

        //        if (response.ReturnCode == enResponseCodeService.Fail)
        //            Response.ReturnCode = enResponseCode.Fail;
        //        else
        //            Response.ReturnCode = enResponseCode.Success;

        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[Authorize]
        //[HttpPost("GetWithdrawalTransaction/{RefId}")]
        //public ActionResult<GetWithdrawalTransactionResponse> GetWithdrawalTransaction(string RefId)
        //{
        //    GetWithdrawalTransactionResponse Response = new GetWithdrawalTransactionResponse();
        //    try
        //    {
        //        var responsedata = _frontTrnService.GetWithdrawalTransaction(RefId);
        //        if (responsedata != null)
        //        {
        //            Response.Response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[Authorize]
        //[HttpPost("ResendEmailWithdrawalConfirmation/{TrnNo}")]
        //public async Task<ActionResult<BizResponse>> ResendEmailWithdrawalConfirmation(long TrnNo)
        //{
        //    try
        //    {
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        BizResponse Response = new BizResponse();
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCodeService.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //            Response.ReturnMsg = "Fail";

        //            return Ok(Response);
        //        }

        //        var ResponseData = _WithdrawTransactionV1.ResendEmailWithdrawalConfirmation(TrnNo, user.Id);
        //        return Ok(ResponseData.Result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost("CancelOrder")]
        //[Authorize]
        //public async Task<ActionResult> CancelOrder([FromBody]CancelOrderRequest Request)
        //{
        //    try
        //    {
        //        BizResponseClass Response = new BizResponseClass();
        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        //Task<BizResponse> MethodRespCancel = _cancelOrderProcess.ProcessCancelOrderAsyncV1(Request, accessToken);
        //        //BizResponse MethodResp = await MethodRespCancel;

        //        //if (MethodResp.ReturnCode == enResponseCodeService.Success)
        //        //    Response.ReturnCode = enResponseCode.Success;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
        //        //    Response.ReturnCode = enResponseCode.InternalError;

        //        //Response.ReturnMsg = MethodResp.ReturnMsg;
        //        //Response.ErrorCode = MethodResp.ErrorCode;
        //        //return Ok(MethodResp);
        //        if (Request.CancelAll == 0)
        //        {
        //            if (Request.TranNo == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = "Enter Valid Transaction No";
        //                Response.ErrorCode = enErrorCode.CancelOrder_EnterValidTransactionNo;
        //                return await Task.FromResult(Ok(Response));
        //            }
        //        }
        //        else if (Request.CancelAll == 2)
        //        {
        //            if (Convert.ToInt32(Request.OrderType) == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = "Enter Valid Maket Type";
        //                Response.ErrorCode = enErrorCode.InValidOrderType;
        //                return await Task.FromResult(Ok(Response));
        //            }
        //        }
        //        _TransactionQueueCancelOrder.Enqueue(new NewCancelOrderRequestCls()
        //        {
        //            MemberID = user.Id,
        //            TranNo = Request.TranNo,
        //            accessToken = accessToken,
        //            CancelAll = Request.CancelAll,
        //            OrderType = Request.OrderType,
        //            IsMargin = Request.IsMargin//Rita 21-2-19 for margin trading
        //        });
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Cancel Order Process Initialize";
        //        Response.ErrorCode = enErrorCode.CancelOrder_ProccedSuccess;

        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////komal 07-06-2019 cancel arbitrage Trade
        //[HttpPost("CancelOrderArbitrage")]
        //[Authorize]
        //public async Task<ActionResult> CancelOrderArbitrage([FromBody]CancelOrderArbitrageRequest Request)
        //{
        //    try
        //    {
        //        BizResponseClass Response = new BizResponseClass();
        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        //Task<BizResponse> MethodRespCancel = _cancelOrderProcess.ProcessCancelOrderAsyncV1(Request, accessToken);
        //        //BizResponse MethodResp = await MethodRespCancel;

        //        //if (MethodResp.ReturnCode == enResponseCodeService.Success)
        //        //    Response.ReturnCode = enResponseCode.Success;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.Fail)
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //else if (MethodResp.ReturnCode == enResponseCodeService.InternalError)
        //        //    Response.ReturnCode = enResponseCode.InternalError;

        //        //Response.ReturnMsg = MethodResp.ReturnMsg;
        //        //Response.ErrorCode = MethodResp.ErrorCode;
        //        //return Ok(MethodResp);
        //        if (Request.CancelAll == 0)
        //        {
        //            if (Request.TranNo == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = "Enter Valid Transaction No";
        //                Response.ErrorCode = enErrorCode.CancelOrder_EnterValidTransactionNo;
        //                return await Task.FromResult(Ok(Response));
        //            }
        //        }
        //        else if (Request.CancelAll == 2)
        //        {
        //            if (Convert.ToInt32(Request.OrderType) == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = "Enter Valid Maket Type";
        //                Response.ErrorCode = enErrorCode.InValidOrderType;
        //                return await Task.FromResult(Ok(Response));
        //            }
        //        }
        //        _TransactionQueueCancelOrderArbitrage.Enqueue(new NewCancelOrderArbitrageRequestCls()
        //        {
        //            MemberID = user.Id,
        //            TranNo = Request.TranNo,
        //            accessToken = accessToken,
        //            CancelAll = Request.CancelAll,
        //            OrderType = Request.OrderType
        //            //IsMargin = Request.IsMargin//Rita 21-2-19 for margin trading
        //        });
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Cancel Order Process Initialize";
        //        Response.ErrorCode = enErrorCode.CancelOrder_ProccedSuccess;

        //        return await Task.FromResult(Ok(Response));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}


        ////Rita 9-2-19 Method for Currency Convert Calculation
        //[HttpPost("SiteTokenCalculation")]
        //[Authorize]
        //public async Task<ActionResult<SiteTokenCalculationResponse>> SiteTokenCalculation([FromBody]SiteTokenCalculationRequest Request)
        //{
        //    try
        //    {
        //        SiteTokenCalculationResponse Response = new SiteTokenCalculationResponse();

        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        if (Request.IsMargin == 1)
        //            Response = await _ISiteTokenConversion.SiteTokenCalculationMargin(Request, user.Id, accessToken);
        //        else
        //            Response = await _ISiteTokenConversion.SiteTokenCalculation(Request, user.Id, accessToken);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////Rita 7-2-19 Method for Currency Convert to Site Token
        //[HttpPost("SiteTokenConversion")]
        //[Authorize]
        //public async Task<ActionResult<SiteTokenConversionResponse>> SiteTokenConversion([FromBody]SiteTokenConversionRequest Request)
        //{
        //    try
        //    {
        //        SiteTokenConversionResponse Response = new SiteTokenConversionResponse();

        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        var accessToken = await HttpContext.GetTokenAsync("access_token");

        //        if (Request.IsMargin == 1)
        //            Response = await _ISiteTokenConversion.SiteTokenConversionAsyncMargin(Request, user.Id, accessToken);
        //        else
        //            Response = await _ISiteTokenConversion.SiteTokenConversionAsync(Request, user.Id, accessToken);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        //#region "History Method"
        //[HttpPost("GetTradeHistory")]
        //[Authorize]
        //public async Task<ActionResult<GetTradeHistoryResponse>> GetTradeHistory([FromBody] TradeHistoryRequest request)
        //{
        //    GetTradeHistoryResponse Response = new GetTradeHistoryResponse();
        //    Int16 trnType = 999, marketType = 999, status = 999;
        //    //
        //    long PairId = 999;
        //    string sCondition = "1=1";
        //    try
        //    {
        //        //var user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(request.Pair, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            sCondition += " And TTQ.PairID=" + PairId;
        //        }
        //        if (!string.IsNullOrEmpty(request.Trade) || !string.IsNullOrEmpty(request.MarketType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.Trade))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.Trade);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                sCondition += " AND TTQ.TrnType=" + trnType;
        //            }
        //            if (!string.IsNullOrEmpty(request.MarketType))
        //            {
        //                marketType = _frontTrnService.IsValidMarketType(request.MarketType);
        //                if (marketType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidMarketType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                sCondition += " AND TSL.ordertype=" + marketType;
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                //sCondition += " AND TTQ.TrnDate Between '" + fDate  + " AND '" + tDate  + "' ";
        //                sCondition += "AND TTQ.SettledDate Between {0} AND {1} ";
        //            }
        //        }
        //        if ((request.Status.ToString()) == "0")
        //        {
        //            status = 999;
        //        }
        //        else
        //        {
        //            if (request.Status != 1 && request.Status != 2 && request.Status != 9)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidStatusType;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            status = Convert.ToInt16(request.Status);
        //        }

        //        //if (request.Page == 0)
        //        //{
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //    Response.ErrorCode = enErrorCode.InValidPageNo;
        //        //    return BadRequest(Response);
        //        //}

        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetTradeHistory(MemberID, sCondition, request.FromDate, request.ToDate, request.Page, status, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetActiveOrder")]
        //[Authorize]
        //public async Task<ActionResult<GetActiveOrderResponse>> GetActiveOrder([FromBody]GetActiveOrderRequest request)
        //{
        //    GetActiveOrderResponse Response = new GetActiveOrderResponse();
        //    Int16 trnType = 999;
        //    long PairId = 999;
        //    try
        //    {
        //        //Task<ApplicationUser> user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(request.Pair, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        //if (request.Page == 0)
        //        //{
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //    Response.ErrorCode = enErrorCode.InValidPageNo;
        //        //    return BadRequest(Response);
        //        //}
        //        if (!string.IsNullOrEmpty(request.OrderType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.OrderType))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.OrderType);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                //sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetActiveOrder(MemberID, request.FromDate, request.ToDate, PairId, request.Page, trnType, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetOpenOrder")]
        //[Authorize]
        //public async Task<ActionResult<GetOpenOrderResponse>> GetOpenOrder([FromBody]GetOpenOrderRequest request)
        //{
        //    GetOpenOrderResponse Response = new GetOpenOrderResponse();
        //    Int16 trnType = 999;
        //    long PairId = 999;
        //    try
        //    {
        //        //Task<ApplicationUser> user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(request.Pair, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.OrderType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.OrderType))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.OrderType);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();

        //        long MemberID = user.Id;
        //        Response.Response = _frontTrnService.GetOpenOrder(MemberID, request.FromDate, request.ToDate, PairId, request.Page, trnType, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.Response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetRecentOrder")]
        //[Authorize]
        //public async Task<ActionResult<GetRecentTradeResponce>> GetRecentOrder(string Pair = "999", short IsMargin = 0)
        //{
        //    long PairId = 999;
        //    GetRecentTradeResponce Response = new GetRecentTradeResponce();
        //    try
        //    {
        //        //var user1 =  _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (Pair != "999")
        //        {
        //            if (!_frontTrnService.IsValidPairName(Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetRecentOrder(PairId, MemberID, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetOrderhistory")]
        //public ActionResult<GetTradeHistoryResponse> GetOrderhistory(string Pair = "999", short IsMargin = 0)
        //{
        //    GetTradeHistoryResponse Response = new GetTradeHistoryResponse();
        //    long PairId = 999;
        //    try
        //    {
        //        if (Pair != "999")
        //        {
        //            if (!_frontTrnService.IsValidPairName(Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        Response.response = _frontTrnService.GetTradeHistory(PairId, "", "", "", 0, 0, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[Authorize]
        //[HttpPost("TradeSettledHistory")]
        //public async Task<ActionResult<TradeSettledHistoryResponse>> TradeSettledHistory([FromBody]TradeSettledHistoryRequestFront request)
        //{
        //    Int16 trnType = 999, marketType = 999;
        //    long PairId = 999;
        //    try
        //    {
        //        TradeSettledHistoryResponse Response = new TradeSettledHistoryResponse();
        //        //var user =await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.PairName))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.PairName))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByName(request.PairName, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                return BadRequest(Response);
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.TrnType))
        //        {
        //            trnType = _frontTrnService.IsValidTradeType(request.TrnType);
        //            if (trnType == 999)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InValidTrnType;
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.OrderType))
        //        {
        //            marketType = _frontTrnService.IsValidMarketType(request.OrderType);
        //            if (marketType == 999)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidMarketType;
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (string.IsNullOrEmpty(request.ToDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                return Response;
        //            }
        //            if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                return Response;
        //            }
        //            if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                return Response;
        //            }
        //        }
        //        Response = _backOfficeService.TradeSettledHistory(PageSize: request.PageSize, PageNo: request.PageNo, PairID: PairId, TrnType: trnType, FromDate: request.FromDate, Todate: request.ToDate, OrderType: marketType, TrnNo: request.TrnNo, MemberID: user.Id, IsMargin: request.IsMargin);

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[Authorize]
        //[HttpPost("GetCopiedLeaderOrders")]
        //public async Task<ActionResult<CopiedLeaderOrdersResponse>> GetCopiedLeaderOrders([FromBody]CopiedLeaderOrdersRequest request)
        //{
        //    CopiedLeaderOrdersResponse Response = new CopiedLeaderOrdersResponse();
        //    Int16 trnType = 999;//, marketType = 999; //komal 03 May 2019, Cleanup
        //    long PairId = 999;
        //    try
        //    {
        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair) || !string.IsNullOrEmpty(request.TrnType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.Pair))
        //            {
        //                if (!_frontTrnService.IsValidPairName(request.Pair))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidPairName;
        //                    return Response;
        //                }
        //                PairId = _frontTrnService.GetPairIdByName(request.Pair);//request.IsMargin//Rita 22-2-19 for Margin Trading Data bit
        //                if (PairId == 0)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidPairName;
        //                    return base.BadRequest(base.Response);
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.TrnType))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.TrnType);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    return Response;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    return Response;
        //                }
        //            }
        //        }
        //        Response = _frontTrnService.GetCopiedLeaderOrders(user.Id, request.FromDate, request.ToDate, PairId, trnType, FollowTradeType: request.FollowTradeType, FollowingTo: request.FollowingTo, PageNo: request.PageNo, PageSize: request.PageSize);
        //        //if (Response.Response.Count == 0)
        //        //{
        //        //    Response.ErrorCode = enErrorCode.NoDataFound;
        //        //    Response.ReturnCode = enResponseCode.Success;
        //        //    Response.ReturnMsg = "Success";
        //        //    return Response;
        //        //}
        //        //Response.ErrorCode = enErrorCode.Success;
        //        //Response.ReturnCode = enResponseCode.Success;
        //        //Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region "Trading Data Method"
        //[HttpGet("GetBuyerBook/{Pair}")]
        //public ActionResult<GetBuySellBookResponse> GetBuyerBook(string Pair, short IsMargin = 0)
        //{
        //    GetBuySellBookResponse Response = new GetBuySellBookResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetBuyerBook(id, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpGet("GetSellerBook/{Pair}")]
        //public ActionResult<GetBuySellBookResponse> GetSellerBook(string Pair, short IsMargin = 0)
        //{
        //    GetBuySellBookResponse Response = new GetBuySellBookResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetSellerBook(id, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpGet("GetVolumeData/{BasePair}")]
        //public ActionResult<GetVolumeDataResponse> GetVolumeData(string BasePair, short IsMargin = 0)
        //{
        //    GetVolumeDataResponse Response = new GetVolumeDataResponse();
        //    try
        //    {
        //        long BasePairId = _frontTrnService.GetBasePairIdByName(BasePair, IsMargin);
        //        if (BasePairId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetVolumeData(BasePairId, IsMargin);
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.response = responsedata;
        //            Response.ReturnMsg = "Success";
        //            Response.ErrorCode = enErrorCode.Success;
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetTradePairAsset")]
        //public ActionResult<TradePairAssetResponce> GetTradePairAsset(short IsMargin = 0)
        //{
        //    TradePairAssetResponce Response = new TradePairAssetResponce();
        //    try
        //    {
        //        List<BasePairResponse> responsedata;
        //        if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
        //            responsedata = _frontTrnService.GetTradePairAssetMargin();
        //        else
        //            responsedata = _frontTrnService.GetTradePairAsset();

        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.response = responsedata;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetTradePairByName/{Pair}")]
        //public ActionResult<TradePairByNameResponse> GetTradePairByName(string Pair, short IsMargin = 0)
        //{
        //    TradePairByNameResponse Response = new TradePairByNameResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        if (IsMargin == 1)
        //            Response.response = _frontTrnService.GetTradePairByNameMargin(id);
        //        else
        //            Response.response = _frontTrnService.GetTradePairByName(id);

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpGet("GetGraphDetail/{Pair}/{Interval}")]
        //public ActionResult<GetGraphDetailReponse> GetGraphDetail(string Pair, string Interval, short IsMargin = 0)
        //{
        //    int IntervalTime = 0;
        //    string IntervalData = "";
        //    GetGraphDetailReponse Response = new GetGraphDetailReponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        _frontTrnService.GetIntervalTimeValue(Interval, ref IntervalTime, ref IntervalData);
        //        if (IntervalTime == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.Graph_InvalidIntervalTime;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetGraphDetail(id, IntervalTime, IntervalData, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetMarketCap/{Pair}")]
        //public ActionResult<MarketCapResponse> GetMarketCap(string Pair, short IsMargin = 0)
        //{
        //    MarketCapResponse Response = new MarketCapResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        if (IsMargin == 1)
        //            Response.response = _frontTrnService.GetMarketCapMargin(id);
        //        else
        //            Response.response = _frontTrnService.GetMarketCap(id);
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetVolumeDataByPair/{Pair}")]
        //public ActionResult<GetVolumeDataByPairResponse> GetVolumeDataByPair(string Pair, short IsMargin = 0)
        //{
        //    GetVolumeDataByPairResponse Response = new GetVolumeDataByPairResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        VolumeDataRespose responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _frontTrnService.GetVolumeDataByPairMargin(id);
        //        else
        //            responsedata = _frontTrnService.GetVolumeDataByPair(id);

        //        if (responsedata != null)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.response = responsedata;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetPairRates/{Pair}")]
        //public ActionResult<GetPairRatesResponse> GetPairRates(string Pair, short IsMargin = 0)
        //{
        //    GetPairRatesResponse Response = new GetPairRatesResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetPairRates(id);
        //        if (responsedata != null)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.response = responsedata;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        [HttpGet("GetMarketTicker")]
        public ActionResult<GetMarketTickerResponse> GetMarketTicker(short IsMargin = 0)
        {
            GetMarketTickerResponse Response = new GetMarketTickerResponse();
            try
            {
                var responsedata = _frontTrnService.GetMarketTicker(IsMargin);

                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.Response = responsedata;
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
        //[HttpGet("GetMarketTickerSignalR")]
        //public ActionResult<BizResponseClass> GetMarketTickerSignalR(short IsMargin = 0)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var responsedata = _frontTrnService.GetMarketTickerSignalR(IsMargin);

        //        if (responsedata != 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetMarketDepthChart/{Pair}")]
        //public ActionResult<GetMarketDepthChartResponse> GetMarketDepthChart(string Pair, short IsMargin = 0)
        //{
        //    //Uday 07-01-2019  MarketDepth Chart based on buyer and seller book.
        //    GetMarketDepthChartResponse Response = new GetMarketDepthChartResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))  //Check PairName is valid or not
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByName(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit //Get Id based on pair name
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        GetBuySellMarketBook responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _frontTrnService.GetMarketDepthChartMargin(id); //Get market depth chart based on buyer and seller book
        //        else
        //            responsedata = _frontTrnService.GetMarketDepthChart(id); //Get market depth chart based on buyer and seller book

        //        if (responsedata != null)
        //        {
        //            Response.Response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[Authorize]
        //[HttpGet("GetHistoricalPerformance/{LeaderId}")]
        //public async Task<ActionResult<GetHistoricalPerformanceResponse>> GetHistoricalPerformance(long LeaderId)
        //{
        //    try
        //    {
        //        GetHistoricalPerformanceResponse Response = new GetHistoricalPerformanceResponse();

        //        ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

        //        //Uday 30-01-2019 Get historical performance of Leader
        //        if (LeaderId == 0)  // Get the data of login user
        //        {
        //            var responseData = _frontTrnService.GetHistoricalPerformance(user.Id);
        //            Response.Response = responseData;
        //        }
        //        else // get the data of leader
        //        {
        //            var responseData = _frontTrnService.GetHistoricalPerformance(LeaderId);

        //            if (responseData == null)
        //            {
        //                Response.Response = responseData;
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.HistoricalPerformance_LeaderNotFound;
        //                Response.ReturnMsg = "Leader id not found";
        //                return Ok(Response);
        //            }

        //            Response.Response = responseData;
        //        }

        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ErrorCode = enErrorCode.Success;
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region "Favourite Pair Method"
        //[Authorize]
        //[HttpPost("AddToFavouritePair/{PairId}")]
        //public async Task<ActionResult<BizResponseClass>> AddToFavouritePair(long PairId, short IsMargin = 0)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        if (PairId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.FavPair_InvalidPairId;
        //            Response.ErrorCode = enErrorCode.FavPair_InvalidPairId;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        else
        //        {
        //            var UserId = user.Id;
        //            int returnCode;
        //            if (IsMargin == 1)
        //                returnCode = _frontTrnService.AddToFavouritePairMargin(PairId, UserId);
        //            else
        //                returnCode = _frontTrnService.AddToFavouritePair(PairId, UserId);

        //            if (returnCode == 2)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_InvalidPairId;
        //                Response.ErrorCode = enErrorCode.FavPair_InvalidPairId;
        //                Response.ReturnMsg = "Fail";
        //            }
        //            if (returnCode == 1)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_AlreadyAdded;
        //                Response.ErrorCode = enErrorCode.FavPair_AlreadyAdded;
        //                Response.ReturnMsg = "Fail";
        //            }
        //            else if (returnCode == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_AddedSuccess;
        //                Response.ErrorCode = enErrorCode.FavPair_AddedSuccess;
        //                Response.ReturnMsg = "Success";
        //            }
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[Authorize]
        //[HttpPost("RemoveFromFavouritePair/{PairId}")]
        //public async Task<ActionResult<BizResponseClass>> RemoveFromFavouritePair(long PairId, short IsMargin = 0)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        if (PairId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.FavPair_InvalidPairId;
        //            Response.ErrorCode = enErrorCode.FavPair_InvalidPairId;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        else
        //        {
        //            var UserId = user.Id;

        //            int returnCode;
        //            if (IsMargin == 1)
        //                returnCode = _frontTrnService.RemoveFromFavouritePairMargin(PairId, UserId);
        //            else
        //                returnCode = _frontTrnService.RemoveFromFavouritePair(PairId, UserId);

        //            if (returnCode == 1)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_InvalidPairId;
        //                Response.ErrorCode = enErrorCode.FavPair_InvalidPairId;
        //                Response.ReturnMsg = "Fail";
        //            }
        //            else if (returnCode == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_RemoveSuccess;
        //                Response.ErrorCode = enErrorCode.FavPair_RemoveSuccess;
        //                Response.ReturnMsg = "Success";
        //            }
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[Authorize]
        //[HttpGet("GetFavouritePair")]
        //public async Task<ActionResult<FavoritePairResponse>> GetFavouritePair(short IsMargin = 0)
        //{
        //    FavoritePairResponse Response = new FavoritePairResponse();
        //    try
        //    {
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        ApplicationUser user;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user = await _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user = await _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        else
        //        {
        //            var UserId = user.Id;
        //            var response = _frontTrnService.GetFavouritePair(UserId, IsMargin);
        //            if (response != null && response.Count != 0)
        //            {
        //                Response.response = response;
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ErrorCode = enErrorCode.Success;
        //                Response.ReturnMsg = "Success";
        //            }
        //            else
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.FavPair_NoPairFound;
        //                Response.ErrorCode = enErrorCode.FavPair_NoPairFound;
        //                Response.ReturnMsg = "Fail";
        //            }
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region TopGainer And TopLooser Front
        //[HttpGet("GetFrontTopGainerPair/{Type}")]
        //public ActionResult<TopLooserGainerPairDataResponse> GetFrontTopGainerPair(int Type)
        //{
        //    try
        //    {
        //        //Uday 04-01-2019  Top Gainer Pair Data give with Different Filteration
        //        TopLooserGainerPairDataResponse Response = new TopLooserGainerPairDataResponse();

        //        if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))
        //        {
        //            var Data = _frontTrnService.GetFrontTopGainerPair(Type);

        //            if (Data.Count != 0)
        //            {
        //                Response.Response = Data;
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ErrorCode = enErrorCode.Success;
        //                Response.ReturnMsg = "Success";
        //            }
        //            else
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.NoDataFound;
        //                Response.ReturnMsg = "Fail";
        //            }
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InValidTopLossGainerFilterType;
        //            Response.ReturnMsg = EnResponseMessage.InValidTopLossGainerFilterType;
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetFrontTopLooserPair/{Type}")]
        //public ActionResult<TopLooserGainerPairDataResponse> GetFrontTopLooserPair(int Type)
        //{
        //    try
        //    {
        //        //Uday 04-01-2019  Top Looser Pair Data give with Different Filteration
        //        TopLooserGainerPairDataResponse Response = new TopLooserGainerPairDataResponse();

        //        if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise) || Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))
        //        {
        //            var Data = _frontTrnService.GetFrontTopLooserPair(Type);

        //            if (Data.Count != 0)
        //            {
        //                Response.Response = Data;
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ErrorCode = enErrorCode.Success;
        //                Response.ReturnMsg = "Success";
        //            }
        //            else
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.NoDataFound;
        //                Response.ReturnMsg = "Fail";
        //            }
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InValidTopLossGainerFilterType;
        //            Response.ReturnMsg = EnResponseMessage.InValidTopLossGainerFilterType;
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetFrontTopLooserGainerPair")]
        //public ActionResult<TopLooserGainerPairDataResponse> GetFrontTopLooserGainerPair()
        //{
        //    try
        //    {
        //        //Uday 04-01-2019  Top Gainer/Looser All Pair Data with name wise ascending order
        //        TopLooserGainerPairDataResponse Response = new TopLooserGainerPairDataResponse();

        //        var Data = _frontTrnService.GetFrontTopLooserGainerPair();
        //        if (Data.Count != 0)
        //        {
        //            Response.Response = Data;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("TopProfitGainer/{date}/{size}")]
        //public ActionResult<TopProfitGainerLoserResponse> TopProfitGainer(DateTime date, int size)
        //{
        //    TopProfitGainerLoserResponse response = new TopProfitGainerLoserResponse();
        //    try
        //    {
        //        response = _frontTrnService.GetTopProfitGainer(date, size);
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("TopProfitLoser/{date}/{size}")]
        //public ActionResult<TopProfitGainerLoserResponse> TopProfitLoser(DateTime date, int size)
        //{
        //    // DateTime? CurDate; //komal 03 May 2019, Cleanup
        //    TopProfitGainerLoserResponse response = new TopProfitGainerLoserResponse();
        //    try
        //    {
        //        response = _frontTrnService.TopProfitLoser(date, size);
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("TopLeadersList")]
        //public ActionResult<TopLeadersListResponse> TopLeadersList()
        //{
        //    TopLeadersListResponse response = new TopLeadersListResponse();
        //    try
        //    {
        //        response = _frontTrnService.TopLeadersList();
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("TradeWatchList")]
        //[Authorize]
        //public async Task<ActionResult<TradeWatchListResponse>> TradeWatchList()
        //{
        //    TradeWatchListResponse response = new TradeWatchListResponse();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        response = _frontTrnService.getTradeWatchList(user.Id);
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region CoinListRequest
        //[Authorize]
        //[HttpPost("AddCoinRequest")]
        //public async Task<ActionResult<BizResponseClass>> AddCoinRequest([FromBody] CoinListRequestRequest Request)
        //{
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        BizResponseClass Response = new BizResponseClass();
        //        Response = _transactionConfigService.AddCoinRequest(Request, user.Id);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[Authorize]
        //[HttpPost("GetUserCoinRequest")]
        //public async Task<ActionResult<CoinListRequestResponse>> GetUserCoinRequest()
        //{
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        CoinListRequestResponse Response = new CoinListRequestResponse();
        //        Response = _transactionConfigService.GetUserCoinRequest(user.Id);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region  SiteToken
        //[HttpPost("GetSiteTokenConversionData")]
        //[Authorize]
        //public async Task<ActionResult<SiteTokenConvertFundResponse>> GetSiteTokenConversionData(short IsMargin = 0)
        //{
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        return _frontTrnService.GetSiteTokenConversionData(user.Id, "", "", "", "", IsMargin);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetAllSiteToken")]
        ////[Authorize]
        //public ActionResult<SiteTokenMasterResponse> GetAllSiteToken(short IsMargin = 0)
        //{
        //    try
        //    {
        //        if (IsMargin == 1)
        //            return _transactionConfigService.GetAllSiteTokenMargin();
        //        else
        //            return _transactionConfigService.GetAllSiteToken(1);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //[HttpGet("TestCache")]
        ////[Authorize]
        //public ActionResult<BizResponseClass> TestCache()
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        BizResponse _Resp = new BizResponse();
        //        _IResdisTradingManagment.MakeNewTransactionEntry(_Resp);

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}


        //#region Listing Methods
        //[HttpGet("GetBaseMarket")]
        //public ActionResult<MarketResponse> GetBaseMarket(short IsMargin = 0)
        //{
        //    MarketResponse Response = new MarketResponse();
        //    try
        //    {
        //        List<MarketViewModel> responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _transactionConfigService.GetAllMarketDataMargin(1);
        //        else
        //            responsedata = _transactionConfigService.GetAllMarketData(1);

        //        if (responsedata == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.Response = responsedata;

        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost("ListPair")]
        //public ActionResult<ListPairResponse> ListPair(short IsMargin = 0)
        //{
        //    try
        //    {
        //        ListPairResponse Response = new ListPairResponse();
        //        Response = _transactionConfigService.ListPair(IsMargin);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost("ListCurrency")]
        //public ActionResult<GetServiceByBaseReasponse> ListCurrency(short IsMargin = 0)
        //{
        //    GetServiceByBaseReasponse Response = new GetServiceByBaseReasponse();
        //    try
        //    {
        //        if (IsMargin == 1)
        //            Response = _transactionConfigService.GetCurrencyMargin(1);
        //        else
        //            Response = _transactionConfigService.GetCurrency(1);

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion

        //#region "Arbitrage Trading History Method"
        //[HttpPost("GetTradeHistoryArbitrage")]
        //[Authorize]
        //public async Task<ActionResult<GetTradeHistoryResponseArbitrage>> GetTradeHistoryArbitrage([FromBody] TradeHistoryRequest request)
        //{
        //    GetTradeHistoryResponseArbitrage Response = new GetTradeHistoryResponseArbitrage();
        //    Int16 trnType = 999, marketType = 999, status = 999;
        //    //
        //    long PairId = 999;
        //    string sCondition = "1=1";
        //    try
        //    {
        //        //var user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByNameArbitrage(request.Pair, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            sCondition += " And TTQ.PairID=" + PairId;
        //        }
        //        if (!string.IsNullOrEmpty(request.Trade) || !string.IsNullOrEmpty(request.MarketType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.Trade))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.Trade);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                sCondition += " AND TTQ.TrnType=" + trnType;
        //            }
        //            if (!string.IsNullOrEmpty(request.MarketType))
        //            {
        //                marketType = _frontTrnService.IsValidMarketType(request.MarketType);
        //                if (marketType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidMarketType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                sCondition += " AND TSL.ordertype=" + marketType;
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                //sCondition += " AND TTQ.TrnDate Between '" + fDate  + " AND '" + tDate  + "' ";
        //                sCondition += "AND TTQ.SettledDate Between {0} AND {1} ";
        //            }
        //        }
        //        if ((request.Status.ToString()) == "0")
        //        {
        //            status = 999;
        //        }
        //        else
        //        {
        //            if (request.Status != 1 && request.Status != 2 && request.Status != 9)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidStatusType;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            status = Convert.ToInt16(request.Status);
        //        }

        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetTradeHistoryArbitrage(MemberID, sCondition, request.FromDate, request.ToDate, request.Page, status, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetOpenOrderArbitrage")]
        //[Authorize]
        //public async Task<ActionResult<GetOpenOrderResponse>> GetOpenOrderArbitrage([FromBody]GetOpenOrderRequest request)
        //{
        //    GetOpenOrderResponse Response = new GetOpenOrderResponse();
        //    Int16 trnType = 999;
        //    long PairId = 999;
        //    try
        //    {
        //        //Task<ApplicationUser> user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByNameArbitrage(request.Pair, request.IsMargin);
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.OrderType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.OrderType))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.OrderType);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();

        //        long MemberID = user.Id;
        //        Response.Response = _frontTrnService.GetOpenOrderArbitrage(MemberID, request.FromDate, request.ToDate, PairId, request.Page, trnType, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.Response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetActiveOrderArbitrage")]
        //[Authorize]
        //public async Task<ActionResult<GetActiveOrderResponseArbitrage>> GetActiveOrderArbitrage([FromBody]GetActiveOrderRequest request)
        //{
        //    GetActiveOrderResponseArbitrage Response = new GetActiveOrderResponseArbitrage();
        //    Int16 trnType = 999;
        //    long PairId = 999;
        //    try
        //    {
        //        //Task<ApplicationUser> user1 = _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (!string.IsNullOrEmpty(request.Pair))
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByNameArbitrage(request.Pair, request.IsMargin);
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.OrderType) || !string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (!string.IsNullOrEmpty(request.OrderType))
        //            {
        //                trnType = _frontTrnService.IsValidTradeType(request.OrderType);
        //                if (trnType == 999)
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InValidTrnType;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(request.FromDate))
        //            {
        //                if (string.IsNullOrEmpty(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //                {
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                    Response.ReturnMsg = "Fail";
        //                    return Response;
        //                }
        //                //sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        //var user = await _userManager.GetUserAsync(HttpContext.User);
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetActiveOrderArbitrage(MemberID, request.FromDate, request.ToDate, PairId, request.Page, trnType, request.IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpPost("GetRecentOrderArbitrage")]
        //[Authorize]
        //public async Task<ActionResult<GetRecentTradeResponceArbitrage>> GetRecentOrderArbitrage(string Pair = "999", short IsMargin = 0)
        //{
        //    long PairId = 999;
        //    GetRecentTradeResponceArbitrage Response = new GetRecentTradeResponceArbitrage();
        //    try
        //    {
        //        //var user1 =  _userManager.GetUserAsync(HttpContext.User);
        //        // khushali 15-03-2019 for use API Key Authorization
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (Pair != "999")
        //        {
        //            if (!_frontTrnService.IsValidPairName(Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        long MemberID = user.Id;
        //        Response.response = _frontTrnService.GetRecentOrderArbitrage(PairId, MemberID, IsMargin);
        //        if (Response.response.Count == 0)
        //        {
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ReturnMsg = "Success";
        //            return Response;
        //        }
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}


        //[HttpGet("GetOrderhistoryArbitrage")]
        //public ActionResult<GetTradeHistoryResponseArbitrage> GetOrderhistoryArbitrage(string Pair = "999", short IsMargin = 0)
        //{
        //    GetTradeHistoryResponseArbitrage Response = new GetTradeHistoryResponseArbitrage();
        //    long PairId = 999;
        //    try
        //    {
        //        if (Pair != "999")
        //        {
        //            if (!_frontTrnService.IsValidPairName(Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            PairId = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //            if (PairId == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        Response.response = _frontTrnService.GetTradeHistoryArbitrage(PairId, "", "", "", 0, 0, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnMsg = "Success";
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //#endregion =================================================

        //#region "Arbitrage Trading Data Method"
        //[HttpGet("GetBuyerBookArbitrage/{Pair}")]
        //public ActionResult<ArbitrageBuySellResponse> GetBuyerBookArbitrage(string Pair, short IsMargin = 0)
        //{
        //    ArbitrageBuySellResponse Response = new ArbitrageBuySellResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetExchangeProviderBuySellBookArbitrage(id, 4);
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.Response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpGet("GetSellerBookArbitrage/{Pair}")]
        //public ActionResult<ArbitrageBuySellResponse> GetSellerBookArbitrage(string Pair, short IsMargin = 0)
        //{
        //    ArbitrageBuySellResponse Response = new ArbitrageBuySellResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);//Rita 22-2-19 for Margin Trading Data bit
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetExchangeProviderBuySellBookArbitrage(id, 5);
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.Response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }

        //}

        //[HttpGet("GetGraphDetailArbitrage/{Pair}/{Interval}")]
        //public ActionResult<GetGraphDetailReponse> GetGraphDetailArbitrage(string Pair, string Interval, short IsMargin = 0)
        //{
        //    int IntervalTime = 0;
        //    string IntervalData = "";
        //    GetGraphDetailReponse Response = new GetGraphDetailReponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        _frontTrnService.GetIntervalTimeValue(Interval, ref IntervalTime, ref IntervalData);
        //        if (IntervalTime == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.Graph_InvalidIntervalTime;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetGraphDetailArbitrage(id, IntervalTime, IntervalData, IsMargin);
        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("GetProfitIndicatorArbitrage/{Pair}")]
        //public ActionResult<ProfitIndicatorResponse> GetProfitIndicatorArbitrage(string Pair, short IsMargin = 0)
        //{
        //    ProfitIndicatorResponse Response = new ProfitIndicatorResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.GetProfitIndicatorArbitrage(id, IsMargin);
        //        if (responsedata != null)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("ExchangeProviderListArbitrage/{Pair}")]
        //public ActionResult<ExchangeProviderListResponse> ExchangeProviderListArbitrage(string Pair, short IsMargin = 0)
        //{
        //    ExchangeProviderListResponse Response = new ExchangeProviderListResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.ExchangeProviderListArbitrage(id, IsMargin);
        //        if (responsedata != null)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////Darshan Dholakiya added this method for arbitrage changes:07-06-2019   
        //[HttpGet("GetTradePairAssetArbitrage")]
        //public ActionResult<TradePairAssetResponce> GetTradePairAssetArbitrage(short IsMargin = 0)
        //{
        //    TradePairAssetResponce Response = new TradePairAssetResponce();
        //    try
        //    {
        //        List<BasePairResponse> responsedata;
        //        // if (IsMargin == 1)//Rita 22-2-19 for Margin Trading Data bit
        //        //     responsedata = _frontTrnService.GetTradePairAssetMargin();
        //        // else
        //        responsedata = _frontTrnService.GetTradePairAssetArbitrage();

        //        if (responsedata != null && responsedata.Count != 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.response = responsedata;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet("ExchangeListSmartArbitrage/{Pair}")]
        //public ActionResult<ExchangeListSmartArbitrageResponse> ExchangeListSmartArbitrage(string Pair,short ProviderCount=5, short IsMargin = 0)
        //{
        //    ExchangeListSmartArbitrageResponse Response = new ExchangeListSmartArbitrageResponse();
        //    try
        //    {
        //        if (!_frontTrnService.IsValidPairName(Pair))
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InvalidPairName;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        long id = _frontTrnService.GetPairIdByNameArbitrage(Pair, IsMargin);
        //        if (id == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //            return Response;
        //        }
        //        var responsedata = _frontTrnService.ExchangeListSmartArbitrageService(id,Pair, ProviderCount, IsMargin);
        //        if (responsedata != null)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}


        //[HttpPost("SmartArbitrageHistory")]
        //public ActionResult<SmartArbitrageHistoryResponse> SmartArbitrageHistory([FromBody]SmartArbitrageHistoryRequest request)
        //{
        //    SmartArbitrageHistoryResponse Response = new SmartArbitrageHistoryResponse();
        //    try
        //    {
        //        long id = 999;
        //        Task<ApplicationUser> user1;
        //        var UserID = "";
        //        if (HttpContext.Items.Keys.Contains("APIUserID"))
        //        {
        //            UserID = HttpContext.Items["APIUserID"].ToString();
        //        }
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            user1 = _userManager.FindByIdAsync(UserID);
        //        }
        //        else
        //        {
        //            user1 = _userManager.GetUserAsync(HttpContext.User);
        //        }
        //        if (request.Pair != "999")
        //        {
        //            if (!_frontTrnService.IsValidPairName(request.Pair))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidPairName;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            id = _frontTrnService.GetPairIdByNameArbitrage(request.Pair, request.IsMargin);
        //            if (id == 0)
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.NoDataFound;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //        }
        //        if (!string.IsNullOrEmpty(request.FromDate))
        //        {
        //            if (string.IsNullOrEmpty(request.ToDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            if (!_frontTrnService.IsValidDateFormate(request.FromDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }
        //            if (!_frontTrnService.IsValidDateFormate(request.ToDate))
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ErrorCode = enErrorCode.InvalidToDateFormate;
        //                Response.ReturnMsg = "Fail";
        //                return Response;
        //            }                   
        //        }

        //        ApplicationUser user = user1.GetAwaiter().GetResult();
        //        long MemberID = user.Id;

        //        var responsedata = _frontTrnService.SmartArbitrageHistoryList(id, MemberID, request.FromDate, request.ToDate, request.IsMargin);
        //        if (responsedata != null)
        //        {
        //            Response.response = responsedata;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            Response.ReturnMsg = "Success";
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //            Response.ReturnMsg = "Fail";
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //#endregion =================================================
    }
}