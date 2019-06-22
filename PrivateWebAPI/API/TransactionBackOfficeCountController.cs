using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels.Transaction.BackOfficeCount;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.API
{
    [Route("api/[controller]")]
    public class TransactionBackOfficeCountController : ControllerBase
    {
        private readonly IBackOfficeCountTrnService _backOfficeCountTrnService;

        public TransactionBackOfficeCountController(IBackOfficeCountTrnService backOfficeCountTrnService)
        {
            _backOfficeCountTrnService = backOfficeCountTrnService;
        }

        [HttpGet("GetActiveTradeUserCount")]
        public ActionResult<ActiveTradeUserCountResponse> GetActiveTradeUserCount(short IsMargin = 0)
        {
            try
            {
                ActiveTradeUserCountResponse Response = new ActiveTradeUserCountResponse();

                Response.Response = _backOfficeCountTrnService.GetActiveTradeUserCount(IsMargin);
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;

                return Ok(Response);
            }
            catch(Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetConfigurationCount")]
        public ActionResult<ConfigurationCountResponse> GetConfigurationCount(short IsMargin=0)
        {
            try
            {
                ConfigurationCountResponse Response = new ConfigurationCountResponse();
                Response = _backOfficeCountTrnService.GetConfigurationCount(IsMargin);
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("GetLedgerCount")]
        public ActionResult<LedgerCountResponse> GetLedgerCount(short IsMargin = 0)
        {
            try
            {
                LedgerCountResponse response = new LedgerCountResponse();
                response = _backOfficeCountTrnService.GetLedgerCount(IsMargin);                 
                return response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpGet("GetOrderSummaryCount")]
        //public ActionResult<OrderSummaryCountResponse> GetOrderSummaryCount()
        //{
        //    try
        //    {
        //        OrderSummaryCountResponse Response = new OrderSummaryCountResponse();

        //        Response.Response = _backOfficeCountTrnService.GetOrderSummaryCount();
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;

        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        [HttpGet("GetTradeSummaryCount")]
        public ActionResult<TradeSummaryCountResponse> GetTradeSummaryCount(short IsMargin = 0)
        {
            try
            {
                TradeSummaryCountResponse Response = new TradeSummaryCountResponse();
                Response= _backOfficeCountTrnService.GetTradeSummaryCount(IsMargin);
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpGet("GetProfitSummaryCount")]
        //public ActionResult<GetProfitSummaryCountResponse> GetProfitSummaryCount()
        //{
        //    try
        //    {
        //        GetProfitSummaryCountResponse Response = new GetProfitSummaryCountResponse();

        //        Response.Response = _backOfficeCountTrnService.GetProfitSummaryCount();
        //        Response.ErrorCode = enErrorCode.Success;
        //        Response.ReturnCode = enResponseCode.Success;

        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        [HttpGet("GetTradeUserMarketTypeCount/{Type}")]
        public ActionResult<TradeUserMarketTypeCountResponse> GetTradeUserMarketTypeCount(string Type, short IsMargin = 0)
        {
            try
            {
                TradeUserMarketTypeCountResponse Response = new TradeUserMarketTypeCountResponse();

                if (!Type.Equals("Today") && !Type.Equals("Week") && !Type.Equals("Month") && !Type.Equals("Year"))
                {
                    Response.ErrorCode = enErrorCode.InvalidTimeType;
                    Response.ReturnCode = enResponseCode.Fail;
                    return Response;
                }

                Response.Response = _backOfficeCountTrnService.GetTradeUserMarketTypeCount(Type, IsMargin);
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
    }
}