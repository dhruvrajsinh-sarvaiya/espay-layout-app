﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Web.API.Configuration
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] //for testing only //komal 10-06-2019 make authorize
    public class TransactionConfigurationController : ControllerBase
    {
        private readonly ITransactionConfigService _transactionConfigService;
        //private readonly ILogger<TransactionConfigurationController> _logger; //komal 03 May 2019, Cleanup
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBasePage _basePage;
        private readonly ITrnMasterConfiguration _trnMasterConfiguration;

        public TransactionConfigurationController(ITransactionConfigService transactionConfigService, UserManager<ApplicationUser> userManager, IBasePage basePage, ITrnMasterConfiguration trnMasterConfiguration)
        {
            _transactionConfigService = transactionConfigService;
            _userManager = userManager;
            _basePage = basePage;
            _trnMasterConfiguration = trnMasterConfiguration;
        }

        #region Service
        //[HttpPost("AddServiceConfiguration")]
        //public async Task<ActionResult> AddServiceConfiguration([FromBody]ServiceConfigurationRequest Request)
        //{
        //    ServiceConfigurationResponse Response = new ServiceConfigurationResponse();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); 
        //        user = await _userManager.GetUserAsync(HttpContext.User);
        //        long ServiceId;
        //        if (Request.IsMargin == 1)
        //            ServiceId = await _transactionConfigService.AddServiceConfigurationMargin(Request, user.Id);
        //        else
        //            ServiceId = await _transactionConfigService.AddServiceConfiguration(Request, user.Id);

        //        if (ServiceId == -1) // Uday 08-01-2019 Check Coin Already available or not
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.CoinAlreadyAvailable;
        //            Response.ReturnMsg = "Coin Already Available.";
        //            return Ok(Response);
        //        }
        //        if (ServiceId == -2) //Uday 08-01-2019 Coin not contain any special character
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.CoinNotContainSpecialCharacter;
        //            Response.ReturnMsg = "Coin not contain any special character.";
        //            return Ok(Response);
        //        }

        //        if (ServiceId != 0)
        //        {
        //            Response.Response = new ServiceConfigurationInfo() { ServiceId = ServiceId };
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            if (Request.IsMargin == 1)
        //                _trnMasterConfiguration.UpdateServiceMarginList();
        //            else
        //                _trnMasterConfiguration.UpdateServiceList();
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.DataInsertFail;  //Uday 02-01-2019 Add Error Code When Coin Adding is fail
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //[HttpPost("UpdateServiceConfiguration")]
        //public async Task<ActionResult> UpdateServiceConfiguration([FromBody]ServiceConfigurationRequest Request)
        //{
        //    ServiceConfigurationResponse Response = new ServiceConfigurationResponse();
        //    try
        //    {
        //        if (Request.ServiceId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InValid_ID;
        //            return Ok(Response);
        //        }

        //        ApplicationUser user = new ApplicationUser(); 
        //        user = await _userManager.GetUserAsync(HttpContext.User);
                
        //        long ServiceId;
        //        if (Request.IsMargin == 1)
        //            ServiceId = _transactionConfigService.UpdateServiceConfigurationMargin(Request, user.Id);
        //        else
        //            ServiceId = _transactionConfigService.UpdateServiceConfiguration(Request, user.Id);

        //        if (ServiceId == -1) // Uday 08-01-2019 Check Coin Already available or not
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.CoinAlreadyAvailable;
        //            Response.ReturnMsg = "Coin Already Available.";
        //            return Ok(Response);
        //        }
        //        if (ServiceId == -2) //Uday 08-01-2019 Coin not contain any special character
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.CoinNotContainSpecialCharacter;
        //            Response.ReturnMsg = "Coin not contain any special character.";
        //            return Ok(Response);
        //        }

        //        if (ServiceId != 0)
        //        {
        //            Response.Response = new ServiceConfigurationInfo() { ServiceId = ServiceId };
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            if (Request.IsMargin == 1)
        //            {
        //                _trnMasterConfiguration.UpdateServiceMarginList();
        //                _trnMasterConfiguration.UpdateTradePairMasterMarginList();//Rita 28-2-19 as SMScode update,pairmaster data updated in method so update cache                    
        //            }
        //            else
        //            {
        //                _trnMasterConfiguration.UpdateServiceList();
        //                _trnMasterConfiguration.UpdateTradePairMasterList();//Rita 28-2-19 as SMScode update,pairmaster data updated in method so update cache                    
        //            }

        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        [AllowAnonymous]
        [HttpGet("GetServiceConfiguration/{ServiceId}")]
        public ActionResult<ServiceConfigurationGetResponse> GetServiceConfiguration(long ServiceId, short IsMargin = 0)
        {
            ServiceConfigurationGetResponse Response = new ServiceConfigurationGetResponse();
            try
            {
                if (ServiceId == 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InValid_ID;
                    return Ok(Response);
                }
                ServiceConfigurationRequest responsedata = new ServiceConfigurationRequest();//_transactionConfigService.GetServiceConfiguration(ServiceId);
                if (IsMargin == 1)
                    responsedata = _transactionConfigService.GetServiceConfigurationMargin(ServiceId);
                else
                    responsedata = _transactionConfigService.GetServiceConfiguration(ServiceId);

                if (responsedata != null)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.Response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [AllowAnonymous]
        [HttpGet("GetAllServiceConfiguration")]
        public ActionResult<ServiceConfigurationGetAllResponse> GetAllServiceConfiguration(short IsMargin = 0)
        {
            ServiceConfigurationGetAllResponse Response = new ServiceConfigurationGetAllResponse();
            try
            {
                var responsedata = _transactionConfigService.GetAllServiceConfiguration(0, IsMargin);
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.Response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        [AllowAnonymous]
        [HttpGet("GetAllServiceConfigurationData")]
        public ActionResult<ServiceConfigurationGetAllResponse> GetAllServiceConfigurationData(short IsMargin = 0)
        {
            ServiceConfigurationGetAllResponse Response = new ServiceConfigurationGetAllResponse();
            try
            {
                var responsedata = _transactionConfigService.GetAllServiceConfiguration(1, IsMargin);
                if (responsedata != null && responsedata.Count != 0)
                {
                    Response.ReturnCode = enResponseCode.Success;
                    Response.Response = responsedata;
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpGet("GetBaseMarket")]
        //public ActionResult<MarketResponse> GetBaseMarket(short? ActiveOnly, short IsMargin = 0)
        //{
        //    MarketResponse Response = new MarketResponse();
        //    try
        //    {
        //        List<MarketViewModel> responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _transactionConfigService.GetAllMarketDataMargin(Convert.ToInt16(ActiveOnly));
        //        else
        //            responsedata = _transactionConfigService.GetAllMarketData(Convert.ToInt16(ActiveOnly));

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
        //[HttpGet("GetAllServiceConfigurationByBase/{Base}")]
        //public ActionResult<GetServiceByBaseReasponse> GetAllServiceConfigurationByBase(string Base, short IsMargin = 0)
        //{
        //    GetServiceByBaseReasponse Response = new GetServiceByBaseReasponse();
        //    try
        //    {
        //        List<ServiceCurrencyData> responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _transactionConfigService.GetAllServiceConfigurationByBaseMargin(Base);
        //        else
        //            responsedata = _transactionConfigService.GetAllServiceConfigurationByBase(Base);

        //        if (responsedata == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.Response = responsedata;
        //            Response.ErrorCode = enErrorCode.Success;
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //[HttpPost("SetActiveService/{ServiceId}")]
        //public ActionResult SetActiveService(long ServiceId, short IsMargin = 0)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        if (ServiceId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InValid_ID;
        //            return Ok(Response);
        //        }

        //        int responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _transactionConfigService.SetActiveServiceMargin(ServiceId);
        //        else
        //            responsedata = _transactionConfigService.SetActiveService(ServiceId);

        //        if (responsedata == 1)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            if (IsMargin == 1)
        //                _trnMasterConfiguration.UpdateServiceMarginList();
        //            else
        //                _trnMasterConfiguration.UpdateServiceList();
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //[HttpPost("SetInActiveService/{ServiceId}")]
        //public ActionResult SetInActiveService(long ServiceId, short IsMargin = 0)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        if (ServiceId == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.InValid_ID;
        //            return Ok(Response);
        //        }
        //        int responsedata;
        //        if (IsMargin == 1)
        //            responsedata = _transactionConfigService.SetInActiveServiceMargin(ServiceId);
        //        else
        //            responsedata = _transactionConfigService.SetInActiveService(ServiceId);

        //        if (responsedata == 1)
        //        {
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;
        //            if (IsMargin == 1)
        //                _trnMasterConfiguration.UpdateServiceMarginList();
        //            else
        //                _trnMasterConfiguration.UpdateServiceList();
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ErrorCode = enErrorCode.NoDataFound;
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        //[HttpPost("ListCurrency")]
        //public ActionResult<GetServiceByBaseReasponse> ListCurrency(short IsMargin = 0, short ActiveOnly = 0)
        //{
        //    GetServiceByBaseReasponse Response = new GetServiceByBaseReasponse();
        //    try
        //    {
        //        if (IsMargin == 1)
        //            Response = _transactionConfigService.GetCurrencyMargin();
        //        else
        //            Response = _transactionConfigService.GetCurrency(ActiveOnly);

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        #endregion

        #region remove method from front
       // #region providermaster
       // [HttpGet("GetProviderList")]
       // public ActionResult<ServiceProviderResponse> GetProviderList()
       // {
       //     ServiceProviderResponse res = new ServiceProviderResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllProvider();
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpGet("GetProviderById/{id:long}")]
       // public ActionResult<ServiceProviderResponseData> GetProviderById(long id)
       // {
       //     ServiceProviderResponseData res = new ServiceProviderResponseData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetPoviderByID(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddServiceProvider")]
       // public async Task<ActionResult<BizResponseClass>> AddServiceProvider([FromBody]ServiceProviderRequest request)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); 
       //         user = await _userManager.GetUserAsync(HttpContext.User);
              
       //         long Id = _transactionConfigService.AddProviderService(request, user.Id);
       //         if (Id != 0)
       //         {
       //             _trnMasterConfiguration.UpdateServiceProividerMasterList();
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateServiceProvider")]
       // public async Task<ActionResult<ServiceProviderResponseData>> UpdateServiceProvider([FromBody]ServiceProviderRequest request)
       // {
       //     ServiceProviderResponseData res = new ServiceProviderResponseData();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             return res;
       //         }
       //         ApplicationUser user = new ApplicationUser();
       //         user =await _userManager.GetUserAsync(HttpContext.User);

       //         state = _transactionConfigService.UpdateProviderService(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             return res;
       //         }
       //         res.Response = _transactionConfigService.GetPoviderByID(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         _trnMasterConfiguration.UpdateServiceProividerMasterList();
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetActiveProvider/{id:long}")]
       // public ActionResult<BizResponseClass> SetActiveProvider(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveProvider(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //             res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveProvider/{id:long}")]
       // public ActionResult<BizResponseClass> SetInActiveProvider(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveProvider(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //             res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region Apptype
       // [HttpGet("GetAppType")]
       // public ActionResult<AppTypeResponse> GetAppType()
       // {
       //     AppTypeResponse res = new AppTypeResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAppType();
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpGet("GetAppTypeById/{id:long}")]
       // public ActionResult<AppTypeResponseData> GetAppTypeById(long id)
       // {
       //     AppTypeResponseData res = new AppTypeResponseData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAppTypeById(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddAppType")]
       // public async Task<ActionResult<AppTypeResponseData>> AddAppType([FromBody]AppTypeRequest request)
       // {
       //     AppTypeResponseData res = new AppTypeResponseData();
       //     //BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser();
       //         user =await _userManager.GetUserAsync(HttpContext.User);
       //         long id = _transactionConfigService.AddAppType(request, user.Id);
       //         if (id != 0)
       //         {
       //             res.Response = _transactionConfigService.GetAppTypeById(id);
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("UpdateAppType")]
       // public async Task<ActionResult<AppTypeResponseData>> UpdateAppType([FromBody]AppTypeRequest request)
       // {
       //     AppTypeResponseData res = new AppTypeResponseData();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return res;
       //         }
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateAppType(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.Response = _transactionConfigService.GetAppTypeById(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("SetActiveAppType/{id:long}")]
       // public ActionResult<BizResponseClass> SetActiveAppType(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveAppType(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveAppType/{id:long}")]
       // public ActionResult<BizResponseClass> SetInActiveAppType(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveAppType(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion

       // #region providerType
       // [HttpGet("GetServiceProviderType")]
       // public ActionResult<ProviderTypeResponse> GetServiceProviderType()
       // {

       //     ProviderTypeResponse res = new ProviderTypeResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetProviderType();
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpGet("GetServiceProviderTypeById/{id:long}")]
       // public ActionResult<ProviderTypeResponseData> GetServiceProviderTypeById(long id)
       // {
       //     ProviderTypeResponseData res = new ProviderTypeResponseData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetProviderTypeById(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;

       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddProviderType")]
       // public async Task<ActionResult<ProviderTypeResponseData>> AddProviderType([FromBody]ProviderTypeRequest request)
       // {
       //     ProviderTypeResponseData res = new ProviderTypeResponseData();
       //     //BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user = await _userManager.GetUserAsync(HttpContext.User);
       //         long id = _transactionConfigService.AddProviderType(request, user.Id);
       //         if (id != 0)
       //         {
       //             res.Response = _transactionConfigService.GetProviderTypeById(id);
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("UpdateProviderType")]
       // public async Task<ActionResult<ProviderTypeResponseData>> UpdateProviderType([FromBody]ProviderTypeRequest request)
       // {
       //     ProviderTypeResponseData res = new ProviderTypeResponseData();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return res;
       //         }
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateProviderType(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.Response = _transactionConfigService.GetProviderTypeById(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("SetActiveProviderType/{id:long}")]
       // public ActionResult<BizResponseClass> SetActiveProviderType(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveProviderType(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveProviderType/{id:long}")]
       // public ActionResult<BizResponseClass> SetInActiveProviderType(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveProviderType(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion

       // #region  providerConfiguration

       // [HttpGet("GetProviderConfigurationById/{id:long}")]
       // public ActionResult<ProviderConfigurationResponse> GetProviderConfigurationById(long id)
       // {
       //     ProviderConfigurationResponse res = new ProviderConfigurationResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetProviderConfiguration(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddProviderConfiguration")]
       // public async Task<ActionResult<BizResponseClass>> AddProviderConfiguration([FromBody]ProviderConfigurationRequest request)
       // {
       //     //ProviderConfigurationResponce res = new ProviderConfigurationResponce();
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user=await _userManager.GetUserAsync(HttpContext.User);
       //         long id = _transactionConfigService.AddProviderConfiguration(request, user.Id);
       //         if (id != 0)
       //         {
       //             //res.response = _transactionConfigService.GetProviderConfiguration(id);
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         res.ErrorCode = enErrorCode.DataInsertFail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("UpdateProviderConfiguration")]
       // public async Task<ActionResult<ProviderConfigurationResponse>> UpdateProviderConfiguration([FromBody]ProviderConfigurationRequest request)
       // {
       //     ProviderConfigurationResponse res = new ProviderConfigurationResponse();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return res;
       //         }
       //         ApplicationUser user = new ApplicationUser(); user=await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateProviderConfiguration(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.Response = _transactionConfigService.GetProviderConfiguration(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("SetActiveProviderConfiguration/{id:long}")]
       // public ActionResult<BizResponseClass> SetActiveProviderConfiguration(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveProviderConfiguration(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveProviderConfiguration/{id:long}")]
       // public ActionResult<BizResponseClass> SetInActiveProviderConfiguration(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveProviderConfiguration(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // [HttpPost("GetAllProviderConfiguration")]
       // public ActionResult<AllProConfigResponse> GetAllProviderConfiguration()
       // {
       //     try
       //     {
       //         AllProConfigResponse res = new AllProConfigResponse();
       //         res = _transactionConfigService.GetAllProviderConfiguration();
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("ListProviderConfiguration")]
       // public ActionResult<ListProConfigResponse> ListProviderConfiguration()
       // {
       //     try
       //     {
       //         ListProConfigResponse res = new ListProConfigResponse();
       //         res = _transactionConfigService.ListProviderConfiguration();
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region DemonConfiguration

       // [HttpGet("GetDemonConfigurationById/{id:long}")]
       // public ActionResult<DemonConfigurationResponce> GetDemonConfigurationById(long id)
       // {
       //     DemonConfigurationResponce res = new DemonConfigurationResponce();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetDemonConfiguration(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddDemonConfiguration")]
       // public async Task<ActionResult<BizResponseClass>> AddDemonConfiguration([FromBody]DemonConfigurationRequest request)
       // {
       //     BizResponseClass res = new BizResponseClass();

       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         long id = _transactionConfigService.AddDemonConfiguration(request, user.Id);
       //         if (id != 0)
       //         {
       //             //res.response = _transactionConfigService.GetDemonConfiguration(id);
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         res.ErrorCode = enErrorCode.DataInsertFail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("UpdateDemonConfiguration")]
       // public async Task<ActionResult<DemonConfigurationResponce>> UpdateDemonConfiguration([FromBody]DemonConfigurationRequest request)
       // {
       //     DemonConfigurationResponce res = new DemonConfigurationResponce();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateDemonConfiguration(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = _transactionConfigService.GetDemonConfiguration(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("SetActiveDemonConfiguration/{id:long}")]
       // public IActionResult SetActiveDemonConfiguration(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveDemonConfig(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveDemonConfiguration/{id:long}")]
       // public IActionResult SetInActiveDemonConfiguration(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveDemonConfig(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("GetAllDemonConfig")]
       // public ActionResult<ListDemonConfigResponse> GetAllDemonConfig()
       // {
       //     try
       //     {
       //         ListDemonConfigResponse res = new ListDemonConfigResponse();
       //         res = _transactionConfigService.GetAllDemonConfigV1();
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // [HttpPost("ListDemonConfig")]
       // public ActionResult<ListDemonConfigResponseV1> ListDemonConfig()
       // {
       //     try
       //     {
       //         ListDemonConfigResponseV1 res = new ListDemonConfigResponseV1();
       //         res = _transactionConfigService.ListDemonConfigV1();
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region Provider Details

       // [HttpGet("GetProviderDetailList")]
       // public IActionResult GetProviderDetailList()
       // {
       //     ProviderDetailResponseList res = new ProviderDetailResponseList();
       //     try
       //     {
       //         IEnumerable<ProviderDetailViewModel> list = _transactionConfigService.GetProviderDetailList();
       //         if (list == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = _transactionConfigService.getProviderDetailsDataList(list);
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetProviderDetailById/{id:long}")]
       // public IActionResult GetProviderDetailById(long id)
       // {
       //     ProviderDetailResponse res = new ProviderDetailResponse();
       //     try
       //     {
       //         ProviderDetailViewModel obj = _transactionConfigService.GetProviderDetailById(id);
       //         if (obj == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = _transactionConfigService.getProviderDetailDataById(obj);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response.Id = obj.Id;
       //         //res.response.Provider = _transactionConfigService.GetPoviderByID(obj.ServiceProID);
       //         //res.response.ProviderType = _transactionConfigService.GetProviderTypeById(obj.ProTypeID);
       //         //res.response.AppType = _transactionConfigService.GetAppTypeById(obj.AppTypeID);
       //         //res.response.TrnType = null;
       //         //res.response.Limit = null;
       //         //res.response.DemonConfiguration = _transactionConfigService.GetDemonConfiguration(obj.DemonConfigID);
       //         //res.response.ProviderConfiguration = _transactionConfigService.GetProviderConfiguration(obj.ServiceProConfigID);
       //         //res.response.thirdParty = null;

       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("AddProviderDetail")]
       // public async Task<IActionResult> AddProviderDetail([FromBody]ProviderDetailRequest request)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long Id = _transactionConfigService.AddProviderDetail(request, user.Id);
       //         if (Id != 0)
       //         {
       //             _trnMasterConfiguration.UpdateServiceProviderDetailList();
       //             //res.response = new ServiceProviderViewModel { Id = Id };
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateProviderDetail")]
       // public async Task<IActionResult> UpdateProviderDetail([FromBody]ProviderDetailRequest request)
       // {
       //     ProviderDetailResponse res = new ProviderDetailResponse();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateProviderDetail(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         ProviderDetailViewModel obj = _transactionConfigService.GetProviderDetailById(request.Id);
       //         if (obj == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }

       //         res.Response.Id = obj.Id;
       //         res.Response.Provider = _transactionConfigService.GetPoviderByID(obj.ServiceProID);
       //         res.Response.ProviderType = _transactionConfigService.GetProviderTypeById(obj.ProTypeID);
       //         res.Response.AppType = _transactionConfigService.GetAppTypeById(obj.AppTypeID);
       //         res.Response.TrnType = obj.TrnTypeID;
       //         res.Response.Limit = _transactionConfigService.GetLimitById(obj.LimitID);
       //         res.Response.DemonConfiguration = _transactionConfigService.GetDemonConfiguration(obj.DemonConfigID);
       //         res.Response.ProviderConfiguration = _transactionConfigService.GetProviderConfiguration(obj.ServiceProConfigID);
       //         res.Response.thirdParty = null;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;

       //         _trnMasterConfiguration.UpdateServiceProviderDetailList();
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetActiveProviderDetail/{id:long}")]
       // public IActionResult SetActiveProviderDetail(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveProviderDetail(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetInActiveProviderDetail/{id:long}")]
       // public IActionResult SetInActiveProviderDetail(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveProviderDetail(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion

       // #region ProductConfiguration

       // [HttpPost("AddProductConfiguration")]
       // public async Task<IActionResult> AddProductConfiguration([FromBody]ProductConfigurationRequest Request)
       // {
       //     ProductConfigurationResponse Response = new ProductConfigurationResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long ProductId = _transactionConfigService.AddProductConfiguration(Request, user.Id);

       //         if (ProductId != 0)
       //         {
       //             Response.Response = new ProductConfigurationInfo() { ProductId = ProductId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             //Response.ErrorCode =enErrorCode. // not inserted
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpPost("UpdateProductConfiguration")]
       // public async Task<IActionResult> UpdateProductConfiguration([FromBody]ProductConfigurationRequest Request)
       // {
       //     ProductConfigurationResponse Response = new ProductConfigurationResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long ProductId = _transactionConfigService.UpdateProductConfiguration(Request, user.Id);

       //         if (ProductId != 0)
       //         {
       //             Response.Response = new ProductConfigurationInfo() { ProductId = ProductId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetProductConfiguration/{ProductId}")]
       // public IActionResult GetProductConfiguration(long ProductId)
       // {
       //     ProductConfigurationGetResponse Response = new ProductConfigurationGetResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetProductConfiguration(ProductId);
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetAllProductConfiguration")]
       // public IActionResult GetAllProductConfiguration()
       // {
       //     ProductConfigurationGetAllResponse Response = new ProductConfigurationGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllProductConfiguration();
       //         if (responsedata.Count != 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpPost("SetActiveProduct/{ProductId}")]
       // public IActionResult SetActiveProduct(long ProductId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetActiveProduct(ProductId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpPost("SetInActiveProduct/{ProductId}")]
       // public IActionResult SetInActiveProduct(long ProductId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetInActiveProduct(ProductId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // #endregion

       // #region RouteConfiguration
       // //[HttpPost("AddRouteConfiguration")]
       // //public async Task<IActionResult> AddRouteConfiguration([FromBody]RouteConfigurationRequest Request)
       // //{
       // //    RouteConfigurationResponse Response = new RouteConfigurationResponse();
       // //    try
       // //    {
       // //        ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);// await _userManager.GetUserAsync(HttpContext.User);
       // //        long RouteId = _transactionConfigService.AddRouteConfiguration(Request,user.Id);

       // //        if (RouteId != 0)
       // //        {
       // //            Response.response = new RouteConfigurationInfo() { RouteId = RouteId };
       // //            Response.ReturnCode = enResponseCode.Success;
       // //            Response.ErrorCode = enErrorCode.Success;

       // //            _trnMasterConfiguration.UpdateRouteConfigurationList();
       // //        }
       // //        else
       // //        {
       // //            Response.ReturnCode = enResponseCode.Fail;
       // //            //Response.ErrorCode =enErrorCode. // not inserted
       // //        }
       // //        return Ok(Response);
       // //    }
       // //    catch (Exception ex)
       // //    {
       // //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       // //    }
       // //}
       // [HttpPost("UpdateWithdrawRouteConfiguration")]
       // public async Task<ActionResult<BizResponseClass>> UpdateWithdrawRouteConfiguration([FromBody]WithdrawRouteConfigRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long RouteId = _transactionConfigService.UpdateWithdrawRouteConfig(Request, user.Id);

       //         if (RouteId == 0)
       //         {
       //             //Uday 28-01-2019 Update master configuration detail(cache)
       //             _trnMasterConfiguration.UpdateRouteConfigurationList();

       //             //Response.response = new RouteConfigurationInfo() { RouteId = RouteId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.ReturnMsg = "Update Successfully....";
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //             Response.ReturnMsg = "Update Fail";
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }


       // //Rushabh 26-04-2019 Added TrnType Parameter
       // [HttpGet("GetWithdrawRouteByService/{ServiceId}/{TrnType}")]
       // public ActionResult<WithdrawConfigResponse2> GetWithdrawRouteByService(long ServiceId, enTrnType TrnType)
       // {
       //     WithdrawConfigResponse2 Response = new WithdrawConfigResponse2();
       //     try
       //     {
       //         Response = _transactionConfigService.GetRouteConfiguration(ServiceId, TrnType);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Rushabh 26-04-2019 Change In Response Parameter,nowonwards AccNoStartsWith,AccNoValidationRegex,AccountNoLen will be return inside AvailableRoutes
       // [HttpGet("GetAllRouteConfiguration/{TrnType}")]
       // public ActionResult<WithdrawConfigResponse> GetAllRouteConfiguration(enTrnType TrnType)
       // {
       //     WithdrawConfigResponse Response = new WithdrawConfigResponse();
       //     try
       //     {
       //         Response = _transactionConfigService.GetAllRouteConfiguration(TrnType);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetActiveRoute/{RouteId}")]
       // public ActionResult<BizResponseClass> SetActiveRoute(long RouteId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetActiveRoute(RouteId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetInActiveRoute/{RouteId}")]
       // public ActionResult<BizResponseClass> SetInActiveRoute(long RouteId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetInActiveRoute(RouteId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("AddWithdrawRouteConfiguration")]
       // public async  Task<ActionResult<BizResponseClass>> AddWithdrawRouteConfiguration([FromBody]WithdrawRouteConfigRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         Response = _transactionConfigService.AddWithdrawRouteConfig(Request, user.Id);

       //         //Uday 28-01-2019 Update master configuration detail(cache)
       //         _trnMasterConfiguration.UpdateRouteConfigurationList();

       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("GetAvailableRoute")]
       // public ActionResult<AvailableRouteResponse> GetAvailableRoute()
       // {
       //     try
       //     {
       //         AvailableRouteResponse Response = new AvailableRouteResponse();
       //         Response = _transactionConfigService.GetAvailableRoute();
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region ThirdPartyAPIConfiguration

       // [HttpGet("GetAllThirdPartyAPI")]
       // public IActionResult GetAllThirdPartyAPI()
       // {
       //     ThirdPartyAPIConfigResponseAllData res = new ThirdPartyAPIConfigResponseAllData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllThirdPartyAPIConfig();
       //         if (res.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpGet("GetThirdPartyAPIById/{Id:long}")]
       // public IActionResult GetThirdPartyAPIById(long Id)
       // {
       //     ThirdPartyAPIConfigResponse res = new ThirdPartyAPIConfigResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetThirdPartyAPIConfigById(Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("AddThirdPartyAPIConfig")]
       // public async Task<IActionResult> AddThirdPartyAPIConfig([FromBody]ThirdPartyAPIConfigRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     //ThirdPartyAPIConfigResponse  Response = new ThirdPartyAPIConfigResponse();
       //     try
       //     {
       //         //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         //long Id= _transactionConfigService.AddThirdPartyAPI(Request,user.Id);
       //         //if (Id != 0)
       //         //{
       //         //    Response.response = _transactionConfigService.GetThirdPartyAPIConfigById(Id);
       //         //    Response.ReturnCode = enResponseCode.Success;
       //         //    Response.ErrorCode = enErrorCode.Success;
       //         //}
       //         //else
       //         //{
       //         //    Response.ReturnCode = enResponseCode.Fail;
       //         //    //Response.ErrorCode = enErrorCode.NoDataFound;
       //         //}
       //         //return Ok(Response);

       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddThirdPartyAPI(Request, user.Id);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("UpdateThirdPartyAPIConfig")]
       // public async Task<IActionResult> UpdateThirdPartyAPIConfig([FromBody]ThirdPartyAPIConfigRequest request)
       // {
       //     //ThirdPartyAPIConfigResponse res = new ThirdPartyAPIConfigResponse();
       //     BizResponseClass res = new BizResponseClass();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateThirdPartyAPI(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response = _transactionConfigService.GetThirdPartyAPIConfigById(request.Id);
       //         //if (res.response == null)
       //         //{
       //         //    res.ReturnCode = enResponseCode.Fail;
       //         //    res.ErrorCode = enErrorCode.NoDataFou             nd;
       //         //    return Ok(res);
       //         //}
       //         res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }

       // }
       // [HttpPost("SetActiveThirdPartyAPIConfig/{id:long}")]
       // public IActionResult SetActiveThirdPartyAPIConfig(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveThirdPartyAPI(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetInActiveThirdPartyAPIConfig/{id:long}")]
       // public IActionResult SetInActiveThirdPartyAPIConfig(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveThirdPartyAPI(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // #endregion

       // #region ThirdPartyAPIResponse

       // [HttpGet("GetAllThirdPartyAPIRespose")]
       // public IActionResult GetAllThirdPartyAPIRespose()
       // {
       //     ThirdPartyAPIResponseConfigResponseAllData res = new ThirdPartyAPIResponseConfigResponseAllData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllThirdPartyAPIResponse();
       //         if (res.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpGet("GetThirdPartyAPIResposeById/{Id:long}")]
       // public IActionResult GetThirdPartyAPIResposeById(long Id)
       // {
       //     ThirdPartyAPIResponseConfigResponse res = new ThirdPartyAPIResponseConfigResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetThirdPartyAPIResponseById(Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("AddThirdPartyAPIRespose")]
       // public async Task<IActionResult> AddThirdPartyAPIRespose([FromBody]ThirdPartyAPIResponseConfigRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         //long Id = _transactionConfigService.AddThirdPartyAPIResponse(Request,user.Id);
       //         //if (Id != 0)
       //         //{
       //         //    Response.response = _transactionConfigService.GetThirdPartyAPIResponseById(Id);
       //         //    Response.ReturnCode = enResponseCode.Success;
       //         //    Response.ErrorCode = enErrorCode.Success;
       //         //}
       //         //else
       //         //{
       //         //    Response.ReturnCode = enResponseCode.Fail;
       //         //    Response.ErrorCode = enErrorCode.NoDataFound;
       //         //}
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddThirdPartyAPIResponse(Request, user.Id);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       //[HttpPost("UpdateThirdPartyAPIResponse")]
       // public async Task<IActionResult> UpdateThirdPartyAPIResponse([FromBody]ThirdPartyAPIResponseConfigRequest request)
       // {
       //     //ThirdPartyAPIResponseConfigResponse  res = new ThirdPartyAPIResponseConfigResponse();
       //     bool state = false;
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateThirdPartyAPIResponse(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response = _transactionConfigService.GetThirdPartyAPIResponseById(request.Id);
       //         //if (res.response == null)
       //         //{
       //         //    res.ReturnCode = enResponseCode.Fail;
       //         //    res.ErrorCode = enErrorCode.NoDataFound;
       //         //    return Ok(res);
       //         //}
       //         res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }

       // }
       // [HttpPost("SetActiveThirdPartyAPIResponse/{id:long}")]
       // public IActionResult SetActiveThirdPartyAPIResponse(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveThirdPartyAPIResponse(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetInActiveThirdPartyAPIResponse/{id:long}")]
       // public IActionResult SetInActiveThirdPartyAPIResponse(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveThirdPartyAPIResponse(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion

       // #region TradePairConfiguration
       // [HttpPost("AddPairConfiguration")]
       // public async Task<ActionResult<TradePairConfigResponse>> AddPairConfiguration([FromBody]TradePairConfigRequest Request)
       // {
       //     TradePairConfigResponse Response = new TradePairConfigResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long PairId;
       //         if (Request.IsMargin == 1)
       //             PairId = _transactionConfigService.AddPairConfigurationMargin(Request, user.Id);
       //         else
       //             PairId = _transactionConfigService.AddPairConfiguration(Request, user.Id);

       //         if (PairId != 0)
       //         {
       //             if (PairId == -1)
       //             {
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.AddPairConfiguration_PairAlreadyAvailable;
       //                 Response.ReturnMsg = EnResponseMessage.AddPairConfiguration_PairAlreadyAvailable;
       //                 return Response;
       //             }

       //             Response.Response = new TradePairConfigInfo() { PairId = PairId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;

       //             if (Request.IsMargin == 1)
       //             {
       //                 _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //                 _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //             }
       //             else
       //             {
       //                 _trnMasterConfiguration.UpdateTradePairMasterList();
       //                 _trnMasterConfiguration.UpdateTradePairDetailList();
       //             }

       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }



       // [HttpPost("UpdatePairConfiguration")]
       // public async Task<ActionResult<TradePairConfigResponse>> UpdatePairConfiguration([FromBody]TradePairConfigRequest Request)
       // {
       //     TradePairConfigResponse Response = new TradePairConfigResponse();
       //     try
       //     {
       //         if (Request.Id == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long PairId;
       //         if (Request.IsMargin == 1)
       //             PairId = _transactionConfigService.UpdatePairConfigurationMargin(Request, user.Id);
       //         else
       //             PairId = _transactionConfigService.UpdatePairConfiguration(Request, user.Id);

       //         if (PairId != 0)
       //         {
       //             Response.Response = new TradePairConfigInfo() { PairId = PairId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;

       //             if (Request.IsMargin == 1)
       //             {
       //                 _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //                 _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //             }
       //             else
       //             {
       //                 _trnMasterConfiguration.UpdateTradePairMasterList();
       //                 _trnMasterConfiguration.UpdateTradePairDetailList();
       //             }
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetPairConfiguration")]
       // public ActionResult<TradePairConfigGetResponse> GetPairConfiguration(long PairId, short IsMargin = 0)
       // {
       //     TradePairConfigGetResponse Response = new TradePairConfigGetResponse();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         TradePairConfigRequest responsedata;
       //         if (IsMargin == 1)
       //             responsedata = _transactionConfigService.GetPairConfigurationMargin(PairId);
       //         else
       //             responsedata = _transactionConfigService.GetPairConfiguration(PairId);

       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetAllPairConfiguration")]
       // public ActionResult<TradePairConfigGetAllResponse> GetAllPairConfiguration(short IsMargin = 0)
       // {
       //     TradePairConfigGetAllResponse Response = new TradePairConfigGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllPairConfiguration(IsMargin);
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpPost("SetActivePair/PairId")]
       // public IActionResult SetActivePair(long PairId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         int responsedata;
       //         if (IsMargin == 1)
       //             responsedata = _transactionConfigService.SetActivePairMargin(PairId);
       //         else
       //             responsedata = _transactionConfigService.SetActivePair(PairId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             if (IsMargin == 1)
       //                 _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             else
       //                 _trnMasterConfiguration.UpdateTradePairMasterList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpPost("SetInActivePair/PairId")]
       // public IActionResult SetInActivePair(long PairId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         int responsedata;
       //         if (IsMargin == 1)
       //             responsedata = _transactionConfigService.SetInActivePairMargin(PairId);
       //         else
       //             responsedata = _transactionConfigService.SetInActivePair(PairId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             if (IsMargin == 1)
       //                 _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             else
       //                 _trnMasterConfiguration.UpdateTradePairMasterList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("ListPair")]
       // public ActionResult<ListPairResponse> ListPair(short IsMargin = 0)
       // {
       //     try
       //     {
       //         ListPairResponse Response = new ListPairResponse();
       //         Response = _transactionConfigService.ListPair(IsMargin);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion

       // #region Other Configuration
       // [HttpGet("GetAllServiceTypeMaster")]
       // public IActionResult GetAllServiceTypeMaster()
       // {
       //     ServiceTypeMasterResponse Response = new ServiceTypeMasterResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllServiceTypeMaster();
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetAllTransactionType")]
       // public IActionResult GetAllTransactionType()
       // {
       //     TransactionTypeResponse Response = new TransactionTypeResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllTransactionType();
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // [HttpGet("GetOrderType")]
       // public ActionResult<OrderTypeResponse> GetOrderType()
       // {
       //     OrderTypeResponse Response = new OrderTypeResponse();
       //     try
       //     {
       //         Response = _transactionConfigService.GetOrderType();
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // #endregion

       // #region Limit

       // [HttpGet("GetAllLimitData")]
       // public ActionResult<LimitResponseAllData> GetAllLimitData()
       // {
       //     LimitResponseAllData res = new LimitResponseAllData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllLimitData();
       //         if (res.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpGet("GetLimitsById/{Id:long}")]
       // public ActionResult<LimitResponse> GetLimitsById(long Id)
       // {
       //     LimitResponse res = new LimitResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetLimitById(Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("AddLimits")]
       // public async Task<ActionResult<BizResponseClass>> AddLimits([FromBody]LimitRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         long Id = _transactionConfigService.AddLimitData(Request, user.Id);
       //         if (Id != 0)
       //         {
       //             //Response.Response = _transactionConfigService.GetLimitById(Id);
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.ReturnMsg = "Success";
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //             Response.ReturnMsg = "Fail";
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("UpdateLimits")]
       // public async Task<ActionResult<BizResponseClass>> UpdateLimits([FromBody]LimitRequest request)
       // {
       //     //LimitResponse  res = new LimitResponse();
       //     BizResponseClass Response = new BizResponseClass();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             Response.ReturnMsg = "Fail";
       //             return Response;
       //         }
       //         ApplicationUser user = new ApplicationUser(); user= await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateLimitData(request, user.Id);
       //         if (state == false)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //             Response.ReturnMsg = "Fail";
       //             return Response;
       //         }
       //         var res = _transactionConfigService.GetLimitById(request.Id);
       //         if (res == null)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //             Response.ReturnMsg = "Fail";
       //             return Response;
       //         }
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ErrorCode = enErrorCode.Success;
       //         Response.ReturnMsg = "Success";
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // [HttpPost("SetActiveLimit/{id:long}")]
       // public IActionResult SetActiveLimit(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveLimit(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetInActiveLimit/{id:long}")]
       // public IActionResult SetInActiveLimit(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveLimit(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // #endregion

       // #region Liquidity API Manager
       // [HttpPost("AddLiquidityAPIManager")]
       // public async  Task<IActionResult> AddLiquidityAPIManager(LiquidityAPIManagerRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddLiquidityAPIManager(Request, user.Id);
       //         if (response != 0)
       //         {
       //             //Uday 28-01-2019 Update master configuration detail(cache)
       //             _trnMasterConfiguration.UpdateServiceProviderDetailList();

       //             Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetAllLiquidityAPIManager")]
       // public IActionResult GetAllLiquidityAPIManager()
       // {
       //     GetAllLiquidityAPIManager res = new GetAllLiquidityAPIManager();
       //     try
       //     {
       //         var list = _transactionConfigService.GetAllLiquidityAPIManager();
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetLiquidityAPIManager/{Id}")]
       // public IActionResult GetLiquidityAPIManager(long Id)
       // {
       //     GetLiquidityAPIManager res = new GetLiquidityAPIManager();
       //     try
       //     {
       //         var data = _transactionConfigService.GetLiquidityAPIManager(Id);
       //         if (data == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = data;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateLiquidityAPIManager")]
       // public async Task<IActionResult> UpdateLiquidityAPIManager(LiquidityAPIManagerUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.UpdateLiquidityAPIManager(Request, user.Id);
       //         if (response != 0)
       //         {
       //             //Uday 28-01-2019 Update master configuration detail(cache)
       //             _trnMasterConfiguration.UpdateServiceProviderDetailList();

       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region Manage Market
       // [HttpPost("AddMarketData")]
       // public ActionResult<BizResponseClass> AddMarketData([FromBody] MarketDataRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass res = new BizResponseClass();
       //         if (Request.IsMargin == 1)
       //             res = _transactionConfigService.AddMarketDataV2Margin(Request, 2);
       //         else
       //             res = _transactionConfigService.AddMarketDataV2(Request, 2);

       //         if (res.ReturnCode == enResponseCode.Success)//Rita 6-3-19 update cache
       //         {
       //             if (Request.IsMargin == 1)
       //                 _trnMasterConfiguration.UpdateMarketMargin();
       //             else
       //                 _trnMasterConfiguration.UpdateMarket();
       //         }

       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateMarketData")]
       // public ActionResult<MarketDataResponse> UpdateMarketData([FromBody] MarketDataRequest Request)
       // {
       //     try
       //     {
       //         MarketDataResponse res = new MarketDataResponse();
       //         if (Request.IsMargin == 1)
       //             res = _transactionConfigService.UpdateMarketDataV2Margin(Request, 2);
       //         else
       //             res = _transactionConfigService.UpdateMarketDataV2(Request, 2);

       //         if (res.ReturnCode == enResponseCode.Success)//Rita 6-3-19 update cache
       //         {
       //             if (Request.IsMargin == 1)
       //                 _trnMasterConfiguration.UpdateMarketMargin();
       //             else
       //                 _trnMasterConfiguration.UpdateMarket();
       //         }

       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region Trade Route
       // [HttpPost("AddTradeRouteConfiguration")]
       // public ActionResult<BizResponseClass> AddTradeRouteConfiguration(TradeRouteConfigRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.AddTradeRouteConfiguration(Request, 1);
       //         if (response != 0)
       //         {
       //             if (response == -1)
       //             {
       //                 Response.ReturnMsg = EnResponseMessage.TradeRouteAlreadyAvailable;
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.TradeRouteAlreadyAvailable;
       //             }
       //             else
       //             {
       //                 //Uday 28-01-2019 Update master configuration detail(cache)
       //                 _trnMasterConfiguration.UpdateRouteConfigurationList();

       //                 Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //                 Response.ReturnCode = enResponseCode.Success;
       //                 Response.ErrorCode = enErrorCode.Success;
       //             }
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateTradeRouteConfiguration")]
       // public ActionResult<BizResponseClass> UpdateTradeRouteConfiguration(TradeRouteConfigRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.UpdateTradeRouteConfiguration(Request, 1);
       //         if (response != 0)
       //         {
       //             if (response == -1)
       //             {
       //                 Response.ReturnMsg = EnResponseMessage.TradeRouteAlreadyAvailable;
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.TradeRouteAlreadyAvailable;
       //             }
       //             else
       //             {
       //                 //Uday 28-01-2019 Update master configuration detail(cache)
       //                 _trnMasterConfiguration.UpdateRouteConfigurationList();

       //                 Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //                 Response.ReturnCode = enResponseCode.Success;
       //                 Response.ErrorCode = enErrorCode.Success;
       //             }
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetAllTradeRouteConfiguration")]
       // public ActionResult<GetAllTradeRouteConfiguration> GetAllTradeRouteConfiguration()
       // {
       //     GetAllTradeRouteConfiguration res = new GetAllTradeRouteConfiguration();
       //     try
       //     {
       //         var list = _transactionConfigService.GetAllTradeRouteConfiguration();
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetTradeRouteConfiguration/{Id}")]
       // public ActionResult<GetTradeRouteConfiguration> GetTradeRouteConfiguration(long Id)
       // {
       //     GetTradeRouteConfiguration res = new GetTradeRouteConfiguration();
       //     try
       //     {
       //         var Data = _transactionConfigService.GetTradeRouteConfiguration(Id);
       //         if (Data == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = Data;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("GetAvailableTradeRoute/{TrnType}")]
       // public ActionResult<AvailableRouteResponse> GetAvailableTradeRoute(int TrnType)
       // {
       //     try
       //     {
       //         AvailableRouteResponse Response = new AvailableRouteResponse();
       //         var Data = _transactionConfigService.GetAvailableTradeRoute(TrnType);

       //         if (Data.Count == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(Response);
       //         }
       //         Response.Response = Data;
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ErrorCode = enErrorCode.Success;
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetTradeRouteForPriority/{PairId}/{OrderType}/{TrnType}")]
       // public ActionResult<GetAllTradeRouteConfiguration> GetTradeRouteForPriority(long PairId, long OrderType, int TrnType)
       // {
       //     GetAllTradeRouteConfiguration res = new GetAllTradeRouteConfiguration();
       //     try
       //     {
       //         var list = _transactionConfigService.GetTradeRouteForPriority(PairId, OrderType, TrnType);
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateTradeRoutePriority")]
       // public ActionResult<BizResponseClass> UpdateTradeRoutePriority(TradeRoutePriorityUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.UpdateTradeRoutePriority(Request, 1);
       //         if (response != 0)
       //         {
       //             //Uday 28-01-2019 Update master configuration detail(cache)
       //             _trnMasterConfiguration.UpdateRouteConfigurationList();

       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region MarketTicker Pair Configurtation
       // [HttpGet("GetMarketTickerPairData")]
       // public ActionResult<GetMarketTickerPairData> GetMarketTickerPairData(short IsMargin = 0)
       // {
       //     GetMarketTickerPairData res = new GetMarketTickerPairData();
       //     try
       //     {
       //         var list = _transactionConfigService.GetMarketTickerPairData(IsMargin);
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateMarketTickerPairData")]
       // public ActionResult<BizResponseClass> UpdateMarketTickerPairData(UpdateMarketTickerPairData Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.UpdateMarketTickerPairData(Request, 1, Request.IsMargin);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             if (Request.IsMargin == 1)//Rita 5-3-19 update cache as updated in trade pair detail
       //                 _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //             else
       //                 _trnMasterConfiguration.UpdateTradePairDetailList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region CoinListRequest

       // [HttpPost("GetAllCoinRequest")]
       // public ActionResult<CoinListRequestResponse> GetAllCoinRequest([FromBody]GetCoinRequestListRequest Request)
       // {
       //     try
       //     {
       //         CoinListRequestResponse Response = new CoinListRequestResponse();
       //         if (!string.IsNullOrEmpty(Request.Status))
       //         {
       //             if (!"Request,Accept,Reject".Contains(Request.Status))
       //             {
       //                 Response.ErrorCode = enErrorCode.InvalidStatus;
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ReturnMsg = "InvalidStatus";
       //                 return Response;
       //             }
       //         }
       //         Response = _transactionConfigService.GetAllCoinRequest(Request);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("SetCoinRequestStatus")]
       // public ActionResult<BizResponseClass> SetCoinRequestStatus([FromBody] SetCoinRequestStatusRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         Response = _transactionConfigService.SetCoinRequestStatus(Request, 2);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion

       // #region Reload Master Configuration
       // [HttpGet("UpdateServiceMasterInMemory")]
       // public ActionResult UpdateServiceMasterInMemory(short IsMargin = 0)
       // {
       //     try
       //     {
       //         if (IsMargin == 1)
       //             _trnMasterConfiguration.UpdateServiceMarginList();
       //         else
       //             _trnMasterConfiguration.UpdateServiceList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetServices());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("UpdateServiceProividerMasterInMemory")]
       // public ActionResult UpdateServiceProividerMasterInMemory()
       // {
       //     try
       //     {
       //         _trnMasterConfiguration.UpdateServiceProividerMasterList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetServiceProviderMaster());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("UpdateServiceProividerDetailInMemory")]
       // public ActionResult UpdateServiceProividerDetailInMemory()
       // {
       //     try
       //     {
       //         _trnMasterConfiguration.UpdateServiceProviderDetailList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetServiceProviderDetail());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("UpdateRouteConfigurationInMemory")]
       // public ActionResult UpdateRouteConfigurationInMemory()
       // {
       //     try
       //     {
       //         _trnMasterConfiguration.UpdateRouteConfigurationList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetRouteConfiguration());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("UpdateTradePairMasterInMemory")]
       // public ActionResult UpdateTradePairMasterInMemory(short IsMargin = 0)
       // {
       //     try
       //     {
       //         if (IsMargin == 1)
       //             _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //         else
       //             _trnMasterConfiguration.UpdateTradePairMasterList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetTradePairMaster());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("UpdateTradePairDetailInMemory")]
       // public ActionResult UpdateTradePairDetailInMemory(short IsMargin = 0)
       // {
       //     try
       //     {
       //         if (IsMargin == 1)
       //             _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //         else
       //             _trnMasterConfiguration.UpdateTradePairDetailList();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);

       //         //return Ok(_trnMasterConfiguration.GetTradePairDetail());

       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // //Rita 6-3-19 added for update cache data for Market
       // [HttpGet("UpdateMarketInMemory")]
       // public ActionResult UpdateMarketInMemory(short IsMargin = 0)
       // {
       //     try
       //     {
       //         if (IsMargin == 1)
       //             _trnMasterConfiguration.UpdateMarketMargin();
       //         else
       //             _trnMasterConfiguration.UpdateMarket();

       //         BizResponseClass Response = new BizResponseClass();
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ReturnMsg = "Successfully Reloaded";
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region TokenConfiguration

       // [HttpGet("GetSiteTokenRateType")]
       // public ActionResult<SiteTokenTypeResponse> GetSiteTokenRateType()
       // {
       //     try
       //     {
       //         return _transactionConfigService.GetSiteTokenType();
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // [HttpGet("GetAllSiteToken")]
       // public ActionResult<SiteTokenMasterResponse> GetAllSiteToken(short IsMargin = 0)
       // {
       //     try
       //     {
       //         if (IsMargin == 1)
       //             return _transactionConfigService.GetAllSiteTokenMargin();
       //         else
       //             return _transactionConfigService.GetAllSiteToken();
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // [HttpPost("AddSiteToken")]
       // public ActionResult<BizResponseClass> AddSiteToken([FromBody]SiteTokenMasterRequest request)
       // {
       //     try
       //     {
       //         if (request.IsMargin == 1)
       //             return _transactionConfigService.AddSiteTokenMargin(request, 2);
       //         else
       //             return _transactionConfigService.AddSiteToken(request, 2);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // [HttpPost("UpdateSiteToken")]
       // public ActionResult<BizResponseClass> UpdateSiteToken([FromBody]SiteTokenMasterRequest request)
       // {
       //     try
       //     {
       //         if (request.IsMargin == 1)
       //             return _transactionConfigService.UpdateSiteTokenMargin(request, 2);
       //         else
       //             return _transactionConfigService.UpdateSiteToken(request, 2);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // #endregion

       // #region Arbitrage

       // [HttpPost("PairConfigurationArbitrage")]  //Darshan Dholakiya added method for Arbitrage Changes : 04-06-2019
       // public async Task<ActionResult<TradePairConfigResponse>> PairConfigurationArbitrage([FromBody]TradePairConfigRequest Request)
       // {
       //     TradePairConfigResponse Response = new TradePairConfigResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser();
       //         user= await _userManager.GetUserAsync(HttpContext.User);
              
       //         long PairId;
       //         //if (Request.IsMargin == 1)
       //         //     PairId = _transactionConfigService.AddPairConfigurationMargin(Request, user.Id);
       //         // else
       //         //   
       //         PairId = _transactionConfigService.AddArbitragePairConfiguration(Request, user.Id);

       //         if (PairId != 0)
       //         {
       //             if (PairId == -1)
       //             {
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.AddPairConfiguration_PairAlreadyAvailable;
       //                 Response.ReturnMsg = EnResponseMessage.AddPairConfiguration_PairAlreadyAvailable;
       //                 return Response;
       //             }

       //             Response.Response = new TradePairConfigInfo() { PairId = PairId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;

       //             //if (Request.IsMargin == 1)
       //             // {
       //             //     _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             //     _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //             // }
       //             // else
       //             //{
       //             _trnMasterConfiguration.UpdateTradePairMasterArbitrageList();
       //             _trnMasterConfiguration.UpdateTradePairDetailArbitrageList();
       //             //}

       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }


       // [HttpPost("UpdatePairConfigurationArbitrage")] //Darshan Dholakiya added method for Arbitrage Changes : 05-06-2019
       // public async Task<ActionResult<TradePairConfigResponse>> UpdatePairConfigurationArbitrage([FromBody]TradePairConfigRequest Request)
       // {
       //     TradePairConfigResponse Response = new TradePairConfigResponse();
       //     try
       //     {
       //         if (Request.Id == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);
                
       //         long PairId;
       //         //if (Request.IsMargin == 1)
       //         //   PairId = _transactionConfigService.UpdatePairConfigurationMargin(Request, user.Id);
       //         //else
       //         PairId = _transactionConfigService.UpdatePairConfigurationArbitrage(Request, user.Id);

       //         if (PairId != 0)
       //         {
       //             Response.Response = new TradePairConfigInfo() { PairId = PairId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;

       //             //if (Request.IsMargin == 1)
       //             //{
       //             //    _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             //    _trnMasterConfiguration.UpdateTradePairDetailMarginList();
       //             //}
       //             //else
       //             //{
       //             _trnMasterConfiguration.UpdateTradePairMasterArbitrageList();
       //             _trnMasterConfiguration.UpdateTradePairDetailArbitrageList();
       //             //}
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }


       // [HttpGet("GetPairConfigurationArbitrage")] //Darshan Dholakiya added method for Arbitrage Changes : 05-06-2019
       // public ActionResult<TradePairConfigGetResponse> GetPairConfigurationArbitrage(long PairId, short IsMargin = 0)
       // {
       //     TradePairConfigGetResponse Response = new TradePairConfigGetResponse();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         TradePairConfigRequest responsedata;
       //         // if (IsMargin == 1)
       //         //     responsedata = _transactionConfigService.GetPairConfigurationMargin(PairId);
       //         //else
       //         responsedata = _transactionConfigService.GetPairConfigurationArbitrage(PairId);

       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }


       // [HttpGet("GetAllPairConfigurationArbitrage")] //Darshan Dholakiya added method for Arbitrage Changes : 05-06-2019
       // public ActionResult<TradePairConfigGetAllResponse> GetAllPairConfigurationArbitrage(short IsMargin = 0)
       // {
       //     TradePairConfigGetAllResponse Response = new TradePairConfigGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllPairConfigurationArbitrage(IsMargin);
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetActivePairArbitrage/PairId")] //Darshan Dholakiya added method for Arbitrage Changes : 05-06-2019
       // public IActionResult SetActivePairArbitrage(long PairId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         int responsedata;
       //         //if (IsMargin == 1)
       //         //    responsedata = _transactionConfigService.SetActivePairMargin(PairId);
       //         //else
       //         responsedata = _transactionConfigService.SetActivePairArbitrage(PairId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             // if (IsMargin == 1)
       //             //     _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             // else
       //             _trnMasterConfiguration.UpdateTradePairMasterArbitrageList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("SetInActivePairArbitrage/PairId")] //Darshan Dholakiya added method for Arbitrage Changes : 05-06-2019
       // public IActionResult SetInActivePairArbitrage(long PairId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (PairId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         int responsedata;
       //         //if (IsMargin == 1)
       //         //   responsedata = _transactionConfigService.SetInActivePairMargin(PairId);
       //         //else
       //         responsedata = _transactionConfigService.SetInActivePairArbitrage(PairId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             //if (IsMargin == 1)
       //             //    _trnMasterConfiguration.UpdateTradePairMasterMarginList();
       //             //else
       //             _trnMasterConfiguration.UpdateTradePairMasterArbitrageList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // [HttpPost("ListPairArbitrage")] //Darshan Dholakiya added method for Arbitrage Changes : 06-06-2019
       // public ActionResult<ListPairResponse> ListPairArbitrage(short IsMargin = 0)
       // {
       //     try
       //     {
       //         ListPairResponse Response = new ListPairResponse();
       //         Response = _transactionConfigService.ListPairArbitrage(IsMargin);
       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }


       // #endregion


       // #region Arbitrage Liquidity API Manager        
       // //khushali 04-06-2019 for Arbitrage Exchange configuration
       // [HttpGet("GetAllExchangeConfigurationArbitrage/{Page}")]
       // public ActionResult<GetAllLiquidityAPIManagerArbitrage> GetAllExchangeConfigurationArbitrage(int Page, int? PageSize)
       // {
       //     GetAllLiquidityAPIManagerArbitrage res = new GetAllLiquidityAPIManagerArbitrage();
       //     try
       //     {
       //         var list = _transactionConfigService.GetAllLiquidityAPIManagerArbitrage(Page, PageSize);
       //         if (list.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             res.ReturnMsg = EnResponseMessage.NotFound;
       //             return Ok(res);
       //         }
       //         res.Response = list.Response;
       //         res.Count = list.Count;
       //         res.PageSize = list.PageSize;
       //         res.TotalPage = list.TotalPage;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         res.ReturnMsg = "Success";
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetExchangeConfigurationArbitrage/{Id}")]
       // public ActionResult<GetLiquidityAPIManagerArbitrage> GetExchangeConfigurationArbitrage(long Id)
       // {
       //     GetLiquidityAPIManagerArbitrage res = new GetLiquidityAPIManagerArbitrage();
       //     try
       //     {
       //         var data = _transactionConfigService.GetLiquidityAPIManagerArbitrage(Id);
       //         if (data == null)
       //         {

       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             res.ReturnMsg = EnResponseMessage.NotFound;
       //             return Ok(res);
       //         }
       //         res.Response = data;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         res.ReturnMsg = "Success";
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateExchangeConfigurationArbitrage")]
       // public ActionResult<BizResponseClass> UpdateExchangeConfigurationArbitrage(LiquidityAPIManagerArbitrageUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.UpdateLiquidityAPIManagerArbitrage(Request, 1);
       //         if (response != 0)
       //         {
       //             _trnMasterConfiguration.UpdateServiceProviderDetailArbitrageList();
       //             _trnMasterConfiguration.UpdateServiceProividerMasterArbitrageList();
       //             _trnMasterConfiguration.UpdateRouteConfigurationArbitrageList();

       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //             Response.ReturnMsg = EnResponseMessage.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetAllProviderConfigurationArbitrage/{Page}")]
       // public ActionResult<GetAllLiquidityAPIProviderManagerArbitrage> GetAllProviderConfigurationArbitrage(int Page, int? PageSize)
       // {
       //     GetAllLiquidityAPIProviderManagerArbitrage res = new GetAllLiquidityAPIProviderManagerArbitrage();
       //     try
       //     {
       //         var list = _transactionConfigService.GetAllLiquidityAPIProviderManagerArbitrage(Page, PageSize);
       //         if (list == null || list?.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             res.ReturnMsg = EnResponseMessage.NotFound;
       //             return Ok(res);
       //         }
       //         res.Count = list.Count;
       //         res.PageSize = list.PageSize;
       //         res.TotalPage = list.TotalPage;
       //         res.Response = list.Response;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         res.ReturnMsg = "Success";
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpGet("GetProviderConfigurationArbitrage/{Id}")]
       // public ActionResult<GetLiquidityAPIProviderManagerArbitrage> GetProviderConfigurationArbitrage(long Id)
       // {
       //     GetLiquidityAPIProviderManagerArbitrage res = new GetLiquidityAPIProviderManagerArbitrage();
       //     try
       //     {
       //         var data = _transactionConfigService.GetLiquidityAPIProviderManagerArbitrage(Id);
       //         if (data == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             res.ReturnMsg = EnResponseMessage.NotFound;
       //             return Ok(res);
       //         }
       //         res.Response = data;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         res.ReturnMsg = "Success";
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("UpdateProviderConfigurationArbitrage")]
       // public ActionResult<BizResponseClass> UpdateProviderConfigurationArbitrage(LiquidityAPIProviderManagerArbitrageUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.UpdateLiquidityAPIProviderManagerArbitrage(Request, 1);
       //         if (response != 0)
       //         {

       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //             Response.ReturnMsg = EnResponseMessage.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("AddProviderConfigurationArbitrage")]
       // public ActionResult<BizResponseClass> AddProviderConfigurationArbitrage(LiquidityAPIProviderManagerArbitrageUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         var response = _transactionConfigService.AddLiquidityAPIProviderManagerArbitrage(Request, 1);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.RecordAdded;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.RecordAlreadyExist;
       //             Response.ReturnMsg = EnResponseMessage.RuleManagementRecordAlredyExist;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }


       // #endregion

       // #region ArbitrageServiceProvider
       // //Darshan Dholakiya added this method for arbitrage related changes : 07-06-2019
       // [HttpGet("GetProviderListArbitrage")]
       // public ActionResult<ServiceProviderResponse> GetProviderListArbitrage()
       // {
       //     ServiceProviderResponse res = new ServiceProviderResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllProviderArbitrage();
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:07-06-2019

       // [HttpGet("GetProviderByIdArbitrage/{id:long}")]
       // public ActionResult<ServiceProviderResponseData> GetProviderByIdArbitrage(long id)
       // {
       //     ServiceProviderResponseData res = new ServiceProviderResponseData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetPoviderByIDArbitrage(id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpPost("AddServiceProviderArbitrage")]
       // public async Task<ActionResult<BizResponseClass>> AddServiceProviderArbitrage([FromBody]ServiceProviderRequest request)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser();
       //         user =await _userManager.GetUserAsync(HttpContext.User);
       //         long Id = _transactionConfigService.AddProviderServiceArbitrage(request, user.Id);
       //         if (Id != 0)
       //         {
       //             _trnMasterConfiguration.UpdateServiceProividerMasterArbitrageList();
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return res;
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpPost("UpdateServiceProviderArbitrage")]
       // public async Task<ActionResult<ServiceProviderResponseData>> UpdateServiceProviderArbitrage([FromBody]ServiceProviderRequest request)
       // {
       //     ServiceProviderResponseData res = new ServiceProviderResponseData();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             return res;
       //         }
       //         ApplicationUser user = new ApplicationUser(); 
       //         user = await _userManager.GetUserAsync(HttpContext.User);
               
       //         state = _transactionConfigService.UpdateProviderServiceArbitrage(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             return res;
       //         }
       //         res.Response = _transactionConfigService.GetPoviderByIDArbitrage(request.Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return res;
       //         }
       //         _trnMasterConfiguration.UpdateServiceProividerMasterArbitrageList();
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpPost("AddServiceConfigurationArbitrage")]
       // public async Task<ActionResult> AddServiceConfigurationArbitrage([FromBody]ServiceConfigurationRequest Request)
       // {
       //     ServiceConfigurationResponse Response = new ServiceConfigurationResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); // await _userManager.GetUserAsync(HttpContext.User);
       //         user = await _userManager.GetUserAsync(HttpContext.User);
               

       //         long ServiceId;
       //         //if (Request.IsMargin == 1)
       //         //    ServiceId = await _transactionConfigService.AddServiceConfigurationMargin(Request, user.Id);
       //         //else
       //         ServiceId = await _transactionConfigService.AddServiceConfigurationArbitrage(Request, user.Id);

       //         if (ServiceId == -1) // Uday 08-01-2019 Check Coin Already available or not
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.CoinAlreadyAvailable;
       //             Response.ReturnMsg = "Coin Already Available.";
       //             return Ok(Response);
       //         }
       //         if (ServiceId == -2) //Uday 08-01-2019 Coin not contain any special character
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.CoinNotContainSpecialCharacter;
       //             Response.ReturnMsg = "Coin not contain any special character.";
       //             return Ok(Response);
       //         }

       //         if (ServiceId != 0)
       //         {
       //             Response.Response = new ServiceConfigurationInfo() { ServiceId = ServiceId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             //if (Request.IsMargin == 1)
       //             //    _trnMasterConfiguration.UpdateServiceMarginList();
       //             //else
       //             _trnMasterConfiguration.UpdateServiceArbitrageList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;  //Uday 02-01-2019 Add Error Code When Coin Adding is fail
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpPost("UpdateServiceConfigurationArbitrage")]
       // public async Task<ActionResult> UpdateServiceConfigurationArbitrage([FromBody]ServiceConfigurationRequest Request)
       // {
       //     ServiceConfigurationResponse Response = new ServiceConfigurationResponse();
       //     try
       //     {
       //         if (Request.ServiceId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }

       //         ApplicationUser user = new ApplicationUser(); // await _userManager.GetUserAsync(HttpContext.User);
       //         user = await _userManager.GetUserAsync(HttpContext.User);
               
       //         long ServiceId;
       //         //if (Request.IsMargin == 1)
       //         //    ServiceId = _transactionConfigService.UpdateServiceConfigurationMargin(Request, user.Id);
       //         //else
       //             ServiceId = _transactionConfigService.UpdateServiceConfigurationArbitrage(Request, user.Id);

       //         if (ServiceId == -1) // Uday 08-01-2019 Check Coin Already available or not
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.CoinAlreadyAvailable;
       //             Response.ReturnMsg = "Coin Already Available.";
       //             return Ok(Response);
       //         }
       //         if (ServiceId == -2) //Uday 08-01-2019 Coin not contain any special character
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.CoinNotContainSpecialCharacter;
       //             Response.ReturnMsg = "Coin not contain any special character.";
       //             return Ok(Response);
       //         }

       //         if (ServiceId != 0)
       //         {
       //             Response.Response = new ServiceConfigurationInfo() { ServiceId = ServiceId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //            // if (Request.IsMargin == 1)
       //            // {
       //            //     _trnMasterConfiguration.UpdateServiceMarginList();
       //            //    _trnMasterConfiguration.UpdateTradePairMasterMarginList();//Rita 28-2-19 as SMScode update,pairmaster data updated in method so update cache                    
       //            // }
       //             //else
       //             {
       //                 _trnMasterConfiguration.UpdateServiceArbitrageList();
       //                 _trnMasterConfiguration.UpdateTradePairMasterArbitrageList();//Rita 28-2-19 as SMScode update,pairmaster data updated in method so update cache                    
       //             }

       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpGet("GetServiceConfigurationArbitrage/{ServiceId}")]
       // public ActionResult<ServiceConfigurationGetResponse> GetServiceConfigurationArbitrage(long ServiceId, short IsMargin = 0)
       // {
       //     ServiceConfigurationGetResponse Response = new ServiceConfigurationGetResponse();
       //     try
       //     {
       //         if (ServiceId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         ServiceConfigurationRequest responsedata = new ServiceConfigurationRequest();//_transactionConfigService.GetServiceConfiguration(ServiceId);
       //         //if (IsMargin == 1)
       //         //    responsedata = _transactionConfigService.GetServiceConfigurationMargin(ServiceId);
       //         //else
       //             responsedata = _transactionConfigService.GetServiceConfigurationArbitrage(ServiceId);

       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }


       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpGet("GetAllServiceConfigurationArbitrage")]
       // public ActionResult<ServiceConfigurationGetAllResponse> GetAllServiceConfigurationArbitrage(short IsMargin = 0)
       // {
       //     ServiceConfigurationGetAllResponse Response = new ServiceConfigurationGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllServiceConfigurationArbitrage(0, IsMargin);
       //         if (responsedata != null && responsedata.Count != 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpGet("GetAllServiceConfigurationDataArbitrage")]
       // public ActionResult<ServiceConfigurationGetAllResponse> GetAllServiceConfigurationDataArbitrage(short IsMargin = 0)
       // {
       //     ServiceConfigurationGetAllResponse Response = new ServiceConfigurationGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllServiceConfigurationArbitrage(1, IsMargin);
       //         if (responsedata != null && responsedata.Count != 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpGet("GetBaseMarketArbitrage")]
       // public ActionResult<MarketResponse> GetBaseMarketArbitrage(short? ActiveOnly, short IsMargin = 0)
       // {
       //     MarketResponse Response = new MarketResponse();
       //     try
       //     {
       //         List<MarketViewModel> responsedata;
       //         //if (IsMargin == 1)
       //         //    responsedata = _transactionConfigService.GetAllMarketDataMargin(Convert.ToInt16(ActiveOnly));
       //        // else
       //             responsedata = _transactionConfigService.GetAllMarketDataArbitrage(Convert.ToInt16(ActiveOnly));

       //         if (responsedata == null)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;

       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpGet("GetAllServiceConfigurationByBaseArbitrage/{Base}")]
       // public ActionResult<GetServiceByBaseReasponse> GetAllServiceConfigurationByBaseArbitrage(string Base, short IsMargin = 0)
       // {
       //     GetServiceByBaseReasponse Response = new GetServiceByBaseReasponse();
       //     try
       //     {
       //         List<ServiceCurrencyData> responsedata;
       //         //if (IsMargin == 1)
       //         //    responsedata = _transactionConfigService.GetAllServiceConfigurationByBaseMargin(Base);
       //         // else
       //             responsedata = _transactionConfigService.GetAllServiceConfigurationByBaseArbitrage(Base);

       //         if (responsedata == null)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.Response = responsedata;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019

       // [HttpPost("SetActiveServiceArbitrage/{ServiceId}")]
       // public ActionResult SetActiveServiceArbitrage(long ServiceId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (ServiceId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }

       //         int responsedata;
       //         //if (IsMargin == 1)
       //         //   responsedata = _transactionConfigService.SetActiveServiceMargin(ServiceId);
       //         //else
       //             responsedata = _transactionConfigService.SetActiveServiceArbitrage(ServiceId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         //    if (IsMargin == 1)
       //         //        _trnMasterConfiguration.UpdateServiceMarginList();
       //         //    else
       //                 _trnMasterConfiguration.UpdateServiceArbitrageList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // //Darshan Dholakiya added this method for Arbitrage service changes:12-06-2019
       // [HttpPost("SetInActiveServiceArbitrage/{ServiceId}")]
       // public ActionResult SetInActiveServiceArbitrage(long ServiceId, short IsMargin = 0)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         if (ServiceId == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(Response);
       //         }
       //         int responsedata;
       //         //if (IsMargin == 1)
       //         //    responsedata = _transactionConfigService.SetInActiveServiceMargin(ServiceId);
       //         //else
       //             responsedata = _transactionConfigService.SetInActiveServiceArbitrage(ServiceId);

       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             //if (IsMargin == 1)
       //             //    _trnMasterConfiguration.UpdateServiceMarginList();
       //             //else
       //                 _trnMasterConfiguration.UpdateServiceArbitrageList();
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // [HttpPost("ListCurrencyArbitrage")]
       // public ActionResult<GetServiceByBaseReasponse> ListCurrencyArbitrage(short IsMargin = 0, short ActiveOnly = 0)
       // {
       //     GetServiceByBaseReasponse Response = new GetServiceByBaseReasponse();
       //     try
       //     {
       //         //if (IsMargin == 1)
       //         //    Response = _transactionConfigService.GetCurrencyMargin();
       //         //else
       //             Response = _transactionConfigService.GetCurrencyArbitrage(ActiveOnly);

       //         return Response;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion
        
       // #region Arbitrage Trade Route
       // //Darshan Dholakiya added this method for trade route changes:12-06-2019
       // [HttpPost("AddTradeRouteConfigurationArbitrage")]
       // public async Task<ActionResult<BizResponseClass>> AddTradeRouteConfigurationArbitrage(TradeRouteConfigRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();

       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddTradeRouteConfigurationArbitrage(Request, user.Id);
       //         if (response != 0)
       //         {
       //             if (response == -1)
       //             {
       //                 Response.ReturnMsg = EnResponseMessage.TradeRouteAlreadyAvailable;
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.TradeRouteAlreadyAvailable;
       //             }
       //             else
       //             {
       //                 //Uday 28-01-2019 Update master configuration detail(cache)
       //                 _trnMasterConfiguration.UpdateRouteConfigurationArbitrageList();

       //                 Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //                 Response.ReturnCode = enResponseCode.Success;
       //                 Response.ErrorCode = enErrorCode.Success;
       //             }
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }


       // //Darshan Dholakiya added this method for trade route changes:12-06-2019 
       // [HttpPost("UpdateTradeRouteConfigurationArbitrage")]
       // public async Task<ActionResult<BizResponseClass>> UpdateTradeRouteConfigurationArbitrage(TradeRouteConfigRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);
       //         var response = _transactionConfigService.UpdateTradeRouteConfigurationArbitrage(Request, user.Id);
       //         if (response != 0)
       //         {
       //             if (response == -1)
       //             {
       //                 Response.ReturnMsg = EnResponseMessage.TradeRouteAlreadyAvailable;
       //                 Response.ReturnCode = enResponseCode.Fail;
       //                 Response.ErrorCode = enErrorCode.TradeRouteAlreadyAvailable;
       //             }
       //             else
       //             {
       //                 //Uday 28-01-2019 Update master configuration detail(cache)
       //                 _trnMasterConfiguration.UpdateRouteConfigurationArbitrageList();

       //                 Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //                 Response.ReturnCode = enResponseCode.Success;
       //                 Response.ErrorCode = enErrorCode.Success;
       //             }
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for trade route changes:12-06-2019
       // [HttpGet("GetAllTradeRouteConfigurationArbitrage")]
       // public ActionResult<GetAllTradeRouteConfiguration> GetAllTradeRouteConfigurationArbitrage()
       // {
       //     GetAllTradeRouteConfiguration res = new GetAllTradeRouteConfiguration();
       //     try
       //     {
       //         var list = _transactionConfigService.GetAllTradeRouteConfigurationArbitrage();
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for trade route changes:13-06-2019

       // [HttpGet("GetTradeRouteConfigurationArbitrage/{Id}")]
       // public ActionResult<GetTradeRouteConfiguration> GetTradeRouteConfigurationArbitrage(long Id)
       // {
       //     GetTradeRouteConfiguration res = new GetTradeRouteConfiguration();
       //     try
       //     {
       //         var Data = _transactionConfigService.GetTradeRouteConfigurationArbitrageInfo(Id);
       //         if (Data == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = Data;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for trade route changes:13-06-2019

       // [HttpPost("UpdateTradeRoutePriorityArbitrage")]
       // public async Task<ActionResult<BizResponseClass>> UpdateTradeRoutePriorityArbitrage(TradeRoutePriorityUpdateRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass Response = new BizResponseClass();
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.UpdateTradeRoutePriorityArbitrage(Request, user.Id);
       //         if (response != 0)
       //         {
       //             //Uday 28-01-2019 Update master configuration detail(cache)
       //             _trnMasterConfiguration.UpdateRouteConfigurationArbitrageList();

       //             Response.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataUpdateFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for trade route changes:13-06-2019

       // [HttpGet("GetTradeRouteForPriorityArbitrage/{PairId}/{OrderType}/{TrnType}")]
       // public ActionResult<GetAllTradeRouteConfiguration> GetTradeRouteForPriorityArbitrage(long PairId, long OrderType, int TrnType)
       // {
       //     GetAllTradeRouteConfiguration res = new GetAllTradeRouteConfiguration();
       //     try
       //     {
       //         var list = _transactionConfigService.GetTradeRouteForPriorityArbitrage(PairId, OrderType, TrnType);
       //         if (list.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = list;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for trade route changes:13-06-2019

       // [HttpPost("GetAvailableTradeRouteArbitrage/{TrnType}")]
       // public ActionResult<AvailableRouteResponse> GetAvailableTradeRouteArbitrage(int TrnType)
       // {
       //     try
       //     {
       //         AvailableRouteResponse Response = new AvailableRouteResponse();
       //         var Data = _transactionConfigService.GetAvailableTradeRouteArbitrage(TrnType);

       //         if (Data.Count == 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(Response);
       //         }
       //         Response.Response = Data;
       //         Response.ReturnCode = enResponseCode.Success;
       //         Response.ErrorCode = enErrorCode.Success;
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion
     
       // #region Arbitrage Manage Market 
       // //Darshan Dholakiya added this method for Arbitrage changes:14-06-2019

       // [HttpPost("AddMarketDataArbitrage")]
       // public async  Task<ActionResult<BizResponseClass>> AddMarketDataArbitrage([FromBody] MarketDataRequest Request)
       // {
       //     try
       //     {
       //         BizResponseClass res = new BizResponseClass();
       //         // if (Request.IsMargin == 1)
       //         //     res = _transactionConfigService.AddMarketDataV2Margin(Request, 2);
       //         // else
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);
       //         res = _transactionConfigService.AddMarketDataV2Arbitrage(Request, user.Id);

       //         if (res.ReturnCode == enResponseCode.Success)//Rita 6-3-19 update cache
       //         {
       //         //    if (Request.IsMargin == 1)
       //         //        _trnMasterConfiguration.UpdateMarketMargin();
       //         //    else
       //                 _trnMasterConfiguration.UpdateMarketArbitrage();
       //         }

       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }


       // //Darshan Dholakiya added this method for Arbitrage changes:14-06-2019
       // [HttpPost("UpdateMarketDataArbitrage")]
       // public async Task<ActionResult<MarketDataResponse>> UpdateMarketDataArbitrage([FromBody] MarketDataRequest Request)
       // {
       //     try
       //     {
       //         MarketDataResponse res = new MarketDataResponse();
       //         //if (Request.IsMargin == 1)
       //         //    res = _transactionConfigService.UpdateMarketDataV2Margin(Request, 2);
       //         // else
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         res = _transactionConfigService.UpdateMarketDataV2Arbitrage(Request, user.Id);

       //         if (res.ReturnCode == enResponseCode.Success)//Rita 6-3-19 update cache
       //         {
       //         //    if (Request.IsMargin == 1)
       //         //        _trnMasterConfiguration.UpdateMarketMargin();
       //         //    else
       //                 _trnMasterConfiguration.UpdateMarketArbitrage();
       //         }

       //         return res;
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // #endregion

       // #region Arbitrage Provider Details
       // //Darshan Dholakiya added this method for Arbitrage provider chnages...17-06-2019
       // [HttpGet("GetProviderDetailListArbitrage")]
       // public IActionResult GetProviderDetailListArbitrage()
       // {
       //     ProviderDetailResponseList res = new ProviderDetailResponseList();
       //     try
       //     {
       //         IEnumerable<ProviderDetailViewModel> list = _transactionConfigService.GetProviderDetailListArbitrage();
       //         if (list == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = _transactionConfigService.getProviderDetailsDataListArbitrage(list);
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }
       // //Darshan Dholakiya added this method for arbitrage service provider changes:17-06-2019
       // [HttpGet("GetProviderDetailByIdArbitrage/{id:long}")]
       // public IActionResult GetProviderDetailByIdArbitrage(long id)
       // {
       //     ProviderDetailResponse res = new ProviderDetailResponse();
       //     try
       //     {
       //         ProviderDetailViewModel obj = _transactionConfigService.GetProviderDetailByIdArbitrage(id);
       //         if (obj == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.Response = _transactionConfigService.getProviderDetailDataByIdArbitrage(obj);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response.Id = obj.Id;
       //         //res.response.Provider = _transactionConfigService.GetPoviderByID(obj.ServiceProID);
       //         //res.response.ProviderType = _transactionConfigService.GetProviderTypeById(obj.ProTypeID);
       //         //res.response.AppType = _transactionConfigService.GetAppTypeById(obj.AppTypeID);
       //         //res.response.TrnType = null;
       //         //res.response.Limit = null;
       //         //res.response.DemonConfiguration = _transactionConfigService.GetDemonConfiguration(obj.DemonConfigID);
       //         //res.response.ProviderConfiguration = _transactionConfigService.GetProviderConfiguration(obj.ServiceProConfigID);
       //         //res.response.thirdParty = null;

       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }

       // }
       
       // //Darshan Dholakiya added this method for arbitrage service provider changes:17-06-2019
       // [HttpPost("AddProviderDetailArbitrage")]
       // public async Task<IActionResult> AddProviderDetailArbitrage([FromBody]ProviderDetailRequest request)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user = await _userManager.GetUserAsync(HttpContext.User);
       //         long Id = _transactionConfigService.AddProviderDetailArbitrage(request, user.Id);
       //         if (Id != 0)
       //         {
       //             _trnMasterConfiguration.UpdateServiceProviderDetailArbitrageList();
       //             //res.response = new ServiceProviderViewModel { Id = Id };
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Fail;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for arbitrage service provider changes:17-06-2019
       // [HttpPost("UpdateProviderDetailArbitrage")]
       // public async Task<IActionResult> UpdateProviderDetailArbitrage([FromBody]ProviderDetailRequest request)
       // {
       //     ProviderDetailResponse res = new ProviderDetailResponse();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = new ApplicationUser(); user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateProviderDetailArbitrage(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         ProviderDetailViewModel obj = new ProviderDetailViewModel();
       //         obj=_transactionConfigService.GetProviderDetailByIdArbitrage(request.Id);
       //         if (obj == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         ProviderDetailGetAllResponse Response = new ProviderDetailGetAllResponse();
       //         res.Response = Response;
       //         res.Response.Id = obj.Id;
       //         res.Response.Provider = _transactionConfigService.GetPoviderByIDArbitrage(obj.ServiceProID);
       //         res.Response.ProviderType = _transactionConfigService.GetProviderTypeByIdArbitrage(obj.ProTypeID);
       //         res.Response.AppType = _transactionConfigService.GetAppTypeById(obj.AppTypeID);
       //         res.Response.TrnType = obj.TrnTypeID;
       //         res.Response.Limit = _transactionConfigService.GetLimitByIdArbitrage(obj.LimitID);
       //         res.Response.DemonConfiguration = _transactionConfigService.GetDemonConfigurationArbitrage(obj.DemonConfigID);
       //         res.Response.ProviderConfiguration = _transactionConfigService.GetProviderConfigurationArbitrage(obj.ServiceProConfigID);
       //         res.Response.thirdParty = null;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;

       //         _trnMasterConfiguration.UpdateServiceProviderDetailArbitrageList();
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for arbitrage service provider changes:17-06-2019
       // [HttpPost("SetActiveProviderDetailArbitrage/{id:long}")]
       // public IActionResult SetActiveProviderDetailArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveProviderDetailArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
       //     }
       // }

       // //Darshan Dholakiya added this method for arbitrage service provider changes:17-06-2019
       // [HttpPost("SetInActiveProviderDetailArbitrage/{id:long}")]
       // public IActionResult SetInActiveProviderDetailArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveProviderDetailArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion

       // #region ArbitrageProductConfigure

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpPost("AddProductConfigurationArbitrage")]
       // public async Task<IActionResult> AddProductConfigurationArbitrage([FromBody]ProductConfigurationRequest Request)
       // {
       //     ProductConfigurationResponse Response = new ProductConfigurationResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user = await _userManager.GetUserAsync(HttpContext.User);
       //         long ProductId = _transactionConfigService.AddProductConfigurationArbitrage(Request, user.Id);

       //         if (ProductId != 0)
       //         {
       //             Response.Response = new ProductConfigurationInfo() { ProductId = ProductId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.DataInsertFail;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpPost("UpdateProductConfigurationArbitrage")]
       // public async Task<IActionResult> UpdateProductConfigurationArbitrage([FromBody]ProductConfigurationRequest Request)
       // {
       //     ProductConfigurationResponse Response = new ProductConfigurationResponse();
       //     try
       //     {
       //         ApplicationUser user = new ApplicationUser(); user = await _userManager.GetUserAsync(HttpContext.User);
       //         long ProductId = _transactionConfigService.UpdateProductConfigurationArbitrage(Request, user.Id);

       //         if (ProductId != 0)
       //         {
       //             Response.Response = new ProductConfigurationInfo() { ProductId = ProductId };
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpGet("GetProductConfigurationArbitrage/{ProductId}")]
       // public IActionResult GetProductConfigurationArbitrage(long ProductId)
       // {
       //     ProductConfigurationGetResponse Response = new ProductConfigurationGetResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetProductConfigurationArbitrage(ProductId);
       //         if (responsedata != null)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpGet("GetAllProductConfigurationArbitrage")]
       // public IActionResult GetAllProductConfigurationArbitrage()
       // {
       //     ProductConfigurationGetAllResponse Response = new ProductConfigurationGetAllResponse();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.GetAllProductConfigurationArbitrage();
       //         if (responsedata.Count != 0)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //             Response.Response = responsedata;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpPost("SetActiveProductArbitrage/{ProductId}")]
       // public IActionResult SetActiveProductArbitrage(long ProductId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetActiveProductArbitrage(ProductId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Arbitrage Product related changes:18-06-2019
       // [HttpPost("SetInActiveProductArbitrage/{ProductId}")]
       // public IActionResult SetInActiveProductArbitrage(long ProductId)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         var responsedata = _transactionConfigService.SetInActiveProductArbitrage(ProductId);
       //         if (responsedata == 1)
       //         {
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion

       // #region ThirdPartyAPIConfig Arbitrage
       // //Darshan Dholakiya added this method for Third party arbitrage changes:18-06-2019
       // [HttpGet("GetAllThirdPartyAPIArbitrage")]
       // public IActionResult GetAllThirdPartyAPIArbitrage()
       // {
       //     ThirdPartyAPIConfigResponseAllData res = new ThirdPartyAPIConfigResponseAllData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllThirdPartyAPIConfigArbitrage();
       //         if (res.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for Third party arbitrage changes:19-06-2019

       // [HttpGet("GetThirdPartyAPIByIdArbitrage/{Id:long}")]
       // public IActionResult GetThirdPartyAPIByIdArbitrage(long Id)
       // {
       //     ThirdPartyAPIConfigResponse res = new ThirdPartyAPIConfigResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetThirdPartyAPIConfigByIdArbitrage(Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return  Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Third party arbitrage changes:19-06-2019

       // [HttpPost("AddThirdPartyAPIConfigArbitrage")]
       // public async Task<IActionResult> AddThirdPartyAPIConfigArbitrage([FromBody]ThirdPartyAPIConfigRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     //ThirdPartyAPIConfigResponse  Response = new ThirdPartyAPIConfigResponse();
       //     try
       //     {
       //         //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         //long Id= _transactionConfigService.AddThirdPartyAPI(Request,user.Id);
       //         //if (Id != 0)
       //         //{
       //         //    Response.response = _transactionConfigService.GetThirdPartyAPIConfigById(Id);
       //         //    Response.ReturnCode = enResponseCode.Success;
       //         //    Response.ErrorCode = enErrorCode.Success;
       //         //}
       //         //else
       //         //{
       //         //    Response.ReturnCode = enResponseCode.Fail;
       //         //    //Response.ErrorCode = enErrorCode.NoDataFound;
       //         //}
       //         //return Ok(Response);

       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddThirdPartyAPIArbitrage(Request, user.Id);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // //Darshan Dholakiya added this method for Third party arbitrage changes:19-06-2019

       // [HttpPost("UpdateThirdPartyAPIConfigArbitrage")]
       // public async Task<IActionResult> UpdateThirdPartyAPIConfigArbitrage([FromBody]ThirdPartyAPIConfigRequest request)
       // {
       //     //ThirdPartyAPIConfigResponse res = new ThirdPartyAPIConfigResponse();
       //     BizResponseClass res = new BizResponseClass();
       //     bool state = false;
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateThirdPartyAPIArbitrage(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response = _transactionConfigService.GetThirdPartyAPIConfigById(request.Id);
       //         //if (res.response == null)
       //         //{
       //         //    res.ReturnCode = enResponseCode.Fail;
       //         //    res.ErrorCode = enErrorCode.NoDataFound;
       //         //    return Ok(res);
       //         //}
       //         res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }

       // }

       // //Darshan Dholakiya added this method for Third party arbitrage changes:19-06-2019

       // [HttpPost("SetActiveThirdPartyAPIConfigArbitrage/{id:long}")]
       // public IActionResult SetActiveThirdPartyAPIConfigArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveThirdPartyAPIArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for Third party arbitrage changes:19-06-2019

       // [HttpPost("SetInActiveThirdPartyAPIConfigArbitrage/{id:long}")]
       // public IActionResult SetInActiveThirdPartyAPIConfigArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveThirdPartyAPIArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion
 
       // #region ThirdPartyAPIResponseArbitrage
       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:19-06-2019
       // [HttpGet("GetAllThirdPartyAPIResposeArbitrage")]
       // public IActionResult GetAllThirdPartyAPIResposeArbitrage()
       // {
       //     ThirdPartyAPIResponseConfigResponseAllData res = new ThirdPartyAPIResponseConfigResponseAllData();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetAllThirdPartyAPIResponseArbitrage();
       //         if (res.Response.Count == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:19-06-2019
       // [HttpGet("GetThirdPartyAPIResposeByIdArbitrage/{Id:long}")]
       // public IActionResult GetThirdPartyAPIResposeByIdArbitrage(long Id)
       // {
       //     ThirdPartyAPIResponseConfigResponse res = new ThirdPartyAPIResponseConfigResponse();
       //     try
       //     {
       //         res.Response = _transactionConfigService.GetThirdPartyAPIResponseByIdArbitrage(Id);
       //         if (res.Response == null)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:19-06-2019
       // [HttpPost("AddThirdPartyAPIResposeArbitrage")]
       // public async Task<IActionResult> AddThirdPartyAPIResposeArbitrage([FromBody]ThirdPartyAPIResponseConfigRequest Request)
       // {
       //     BizResponseClass Response = new BizResponseClass();
       //     try
       //     {
       //         //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         //long Id = _transactionConfigService.AddThirdPartyAPIResponse(Request,user.Id);
       //         //if (Id != 0)
       //         //{
       //         //    Response.response = _transactionConfigService.GetThirdPartyAPIResponseById(Id);
       //         //    Response.ReturnCode = enResponseCode.Success;
       //         //    Response.ErrorCode = enErrorCode.Success;
       //         //}
       //         //else
       //         //{
       //         //    Response.ReturnCode = enResponseCode.Fail;
       //         //    Response.ErrorCode = enErrorCode.NoDataFound;
       //         //}
       //         ApplicationUser user = new ApplicationUser();
       //         user = await _userManager.GetUserAsync(HttpContext.User);

       //         var response = _transactionConfigService.AddThirdPartyAPIResponseArbitrage(Request, user.Id);
       //         if (response != 0)
       //         {
       //             Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
       //             Response.ReturnCode = enResponseCode.Success;
       //             Response.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             Response.ReturnCode = enResponseCode.Fail;
       //             Response.ErrorCode = enErrorCode.InternalError;
       //         }
       //         return Ok(Response);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:19-06-2019
       // [HttpPost("UpdateThirdPartyAPIResponseArbitrage")]
       // public async Task<IActionResult> UpdateThirdPartyAPIResponseArbitrage([FromBody]ThirdPartyAPIResponseConfigRequest request)
       // {
       //     //ThirdPartyAPIResponseConfigResponse  res = new ThirdPartyAPIResponseConfigResponse();
       //     bool state = false;
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         if (request.Id == 0)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.InValid_ID;
       //             return Ok(res);
       //         }
       //         ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
       //         state = _transactionConfigService.UpdateThirdPartyAPIResponseArbitrage(request, user.Id);
       //         if (state == false)
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //             return Ok(res);
       //         }
       //         //res.response = _transactionConfigService.GetThirdPartyAPIResponseById(request.Id);
       //         //if (res.response == null)
       //         //{
       //         //    res.ReturnCode = enResponseCode.Fail;
       //         //    res.ErrorCode = enErrorCode.NoDataFound;
       //         //    return Ok(res);
       //         //}
       //         res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
       //         res.ReturnCode = enResponseCode.Success;
       //         res.ErrorCode = enErrorCode.Success;
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }

       // }

       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:20-06-2019
       // [HttpPost("SetActiveThirdPartyAPIResponseArbitrage/{id:long}")]
       // public IActionResult SetActiveThirdPartyAPIResponseArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetActiveThirdPartyAPIResponseArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }
       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }
       // //Darshan Dholakiya added this method for ThirdPartyResponseArbitrage changes:20-06-2019
       // [HttpPost("SetInActiveThirdPartyAPIResponseArbitrage/{id:long}")]
       // public IActionResult SetInActiveThirdPartyAPIResponseArbitrage(long id)
       // {
       //     BizResponseClass res = new BizResponseClass();
       //     try
       //     {
       //         var response = _transactionConfigService.SetInActiveThirdPartyAPIResponseArbitrage(id);
       //         if (response == true)
       //         {
       //             res.ReturnCode = enResponseCode.Success;
       //             res.ErrorCode = enErrorCode.Success;
       //         }
       //         else
       //         {
       //             res.ReturnCode = enResponseCode.Fail;
       //             res.ErrorCode = enErrorCode.NoDataFound;
       //         }

       //         return Ok(res);
       //     }
       //     catch (Exception ex)
       //     {
       //         return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

       //     }
       // }

       // #endregion

        #endregion

        #region Reload Master Configuration Arbitrage

        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateServiceMasterInMemoryArbitrage")]
        //public ActionResult UpdateServiceMasterInMemoryArbitrage(short IsMargin = 0)
        //{
        //    try
        //    {
        //      //  if (IsMargin == 1)
        //      //      _trnMasterConfiguration.UpdateServiceMarginList();
        //      //  else
        //            _trnMasterConfiguration.UpdateServiceListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetServices());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateServiceProviderMasterInMemoryArbitrage")]
        //public ActionResult UpdateServiceProviderMasterInMemoryArbitrage()
        //{
        //    try
        //    {
        //        _trnMasterConfiguration.UpdateServiceProividerMasterListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetServiceProviderMaster());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateServiceProviderDetailInMemoryArbitrage")]
        //public ActionResult UpdateServiceProviderDetailInMemoryArbitrage()
        //{
        //    try
        //    {
        //        _trnMasterConfiguration.UpdateServiceProviderDetailListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetServiceProviderDetail());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateRouteConfigurationInMemoryArbitrage")]
        //public ActionResult UpdateRouteConfigurationInMemoryArbitrage()
        //{
        //    try
        //    {
        //        _trnMasterConfiguration.UpdateRouteConfigurationListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetRouteConfiguration());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateTradePairMasterInMemoryArbitrage")]
        //public ActionResult UpdateTradePairMasterInMemoryArbitrage(short IsMargin = 0)
        //{
        //    try
        //    {
        //      //  if (IsMargin == 1)
        //      //      _trnMasterConfiguration.UpdateTradePairMasterMarginList();
        //      //  else
        //            _trnMasterConfiguration.UpdateTradePairMasterListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetTradePairMaster());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateTradePairDetailInMemoryArbitrage")]
        //public ActionResult UpdateTradePairDetailInMemoryArbitrage(short IsMargin = 0)
        //{
        //    try
        //    {
        //      //  if (IsMargin == 1)
        //      //      _trnMasterConfiguration.UpdateTradePairDetailMarginList();
        //      //  else
        //            _trnMasterConfiguration.UpdateTradePairDetailListArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);

        //        //return Ok(_trnMasterConfiguration.GetTradePairDetail());

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        ////Darshan Dholakiya added this method for Reload Master Configuration Arbitrage changes : 20-06-2019
        //[HttpGet("UpdateMarketInMemoryArbitrage")]
        //public ActionResult UpdateMarketInMemoryArbitrage(short IsMargin = 0)
        //{
        //    try
        //    {
        //        //if (IsMargin == 1)
        //        //    _trnMasterConfiguration.UpdateMarketMargin();
        //        //else
        //            _trnMasterConfiguration.UpdateMarketArbitrage();

        //        BizResponseClass Response = new BizResponseClass();
        //        Response.ReturnCode = enResponseCode.Success;
        //        Response.ReturnMsg = "Successfully Reloaded";
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        #endregion

    }
}