using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Web.Helper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.MasterConfiguration;
using System.ComponentModel.DataAnnotations;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;

namespace CleanArchitecture.Web.API.Configuration
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class MasterConfigurationController : Controller
    {
        #region "Ctor"
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMasterConfiguration _masterConfiguration;
        private readonly ICommunicationService _communicationService;

        public MasterConfigurationController(UserManager<ApplicationUser> userManager, IBasePage basePage, IMasterConfiguration masterConfiguration, ICommunicationService communicationService)
        {
            _userManager = userManager;
            _masterConfiguration = masterConfiguration;
            _communicationService = communicationService;
        }
        #endregion

        #region "CommServiceTypeMaster"

        //vsoalnki 13-11-2018
        [HttpGet]
        public async Task<IActionResult> GetAllCommServiceType()
        {
            CommServiceTypeRes Response = new CommServiceTypeRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetAllCommServiceTypeMaster();
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region "TemplateMaster"

        //vsoalnki 13-11-2018
        [HttpGet]
        public async Task<IActionResult> GetAllTemplate()
        {
            ListTemplateMasterRes Response = new ListTemplateMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetAllTemplateMaster();
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListTemplateType()
        {
            //TempRes Response = new TempRes();
            TemplateRes Response = new TemplateRes();            
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.ListTemplate();
                    if (Response.Result.Count()==0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.NotFound;
                        Response.ErrorCode = enErrorCode.NotFound;
                        return Ok(Response);
                    }
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = EnResponseMessage.FindRecored;
                    Response.ErrorCode = enErrorCode.Success;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        //vsoalnki 13-11-2018
        [HttpPost]
        public async Task<IActionResult> AddTemplate([FromBody]TemplateMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.AddTemplateMaster(Request, user.Id);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //vsoalnki 13-11-2018
        [HttpPost]
        public async Task<IActionResult> UpdateTemplate([FromBody]TemplateMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.UpdateTemplateMaster(Request, user.Id);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //vsoalnki 13-11-2018
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeTemplateStatus(long Id, ServiceStatus Status)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.DisableTemplateMaster(Id, Convert.ToInt16(Status));
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //vsoalnki 13-11-2018
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetTemplateById(long Id)
        {
            TemplateMasterRes Response = new TemplateMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetTemplateMasterById(Id);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        // khushali 10-01-2019
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetTemplateByCategory(long Id)
        {
            TemplateCategoryMasterRes Response = new TemplateCategoryMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetTemplateMasterByCategory(Id);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        // khushali 10-01-2019
        [HttpPost("{TemplateType}/{Status}/{TemplateID}")]
        public async Task<IActionResult> UpdateTemplateCategory(long TemplateType, ServiceStatus Status,long TemplateID)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.UpdateTemplateCategory(TemplateType, Convert.ToInt16(Status),TemplateID);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        // khushali 12-01-2019
        [HttpGet]
        public async Task<IActionResult> TemplateParameterInfo(long? Id)
        {
            ListTemplateParameterInfoRes Response = new ListTemplateParameterInfoRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.TemplateParameterInfo(Id);
                    if (Response.templateParameterInfoList.Count() == 0)
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.NotFound;
                        Response.ErrorCode = enErrorCode.NotFound;
                        return Ok(Response);
                    }
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = EnResponseMessage.FindRecored;
                    Response.ErrorCode = enErrorCode.Success;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region "MessagingQueue"

        //vsolanki 13-11-2018
        [HttpGet("{FromDate}/{ToDate}/{Page}")]
        public async Task<IActionResult> GetMessagingQueue(DateTime FromDate, DateTime ToDate, short? Status, long? MobileNo, int Page, int? PageSize)
        {
            ListMessagingQueueRes Response = new ListMessagingQueueRes();
            try
            {
                //Page = Page + 1; // khushali - 17-01-2019 removed change as per front team for pagination
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetMessagingQueue(FromDate, ToDate, Status, MobileNo, Page, PageSize);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region "EmailQueue"

        //vsolanki 14-11-2018
        [HttpGet("{FromDate}/{ToDate}/{Page}")]
        public async Task<IActionResult> GetEmailQueue(DateTime FromDate, DateTime ToDate, short? Status, string Email, int Page, int? PageSize)
        {
            ListEmailQueueRes Response = new ListEmailQueueRes();
            try
            {
                //Page = Page + 1; // khushali - 17-01-2019 removed change as per front team for pagination
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetEmailQueue(FromDate, ToDate, Status, Email, Page, PageSize);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region "WalletLedger"

        //vsolanki 14-11-2018
        [HttpGet("{FromDate}/{ToDate}/{WalletId}/{Page}/{PageSize}")]
        public async Task<IActionResult> GetWalletLedger(DateTime FromDate, DateTime ToDate, string WalletId, int Page, int PageSize)
        {
            ListWalletLedgerResponse Response = new ListWalletLedgerResponse();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetWalletLedger(FromDate, ToDate, WalletId, Page, PageSize);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        #endregion

        //#region "LimitRuleMaster"

        ////vsoalnki 14-11-2018
        //[HttpGet]
        //public async Task<IActionResult> GetAllLimitRule()
        //{
        //    ListLimitRuleMasterRes Response = new ListLimitRuleMasterRes();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.GetAllLimitRule();
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost]
        //public async Task<IActionResult> AddLimitRule([FromBody]LimitRuleMasterReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.AddLimitRule(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost("{LimitRuleMasterId}")]
        //public async Task<IActionResult> UpdateLimitRule([FromBody]LimitRuleMasterReq Request, long LimitRuleMasterId)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.UpdateLimitRule(LimitRuleMasterId, Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost("{LimitRuleMasterId}")]
        //public async Task<IActionResult> DisableLimitRule(long LimitRuleMasterId)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.DisableLimitRule(LimitRuleMasterId);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpGet("{LimitRuleMasterId}")]
        //public async Task<IActionResult> GetLimitRuleById(long LimitRuleMasterId)
        //{
        //    ListLimitRuleMasterRes Response = new ListLimitRuleMasterRes();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.GetLimitRuleById(LimitRuleMasterId);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        //#region "ChargeRuleMaster"

        ////vsoalnki 14-11-2018
        //[HttpGet]
        //public async Task<IActionResult> GetAllChargeRule()
        //{
        //    ListChargeRuleMasterRes Response = new ListChargeRuleMasterRes();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.GetAllChargeRule();
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost]
        //public async Task<IActionResult> AddChargeRule([FromBody]ChargeRuleMasterReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.AddChargeRule(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost("{ChargeRuleMasterId}")]
        //public async Task<IActionResult> UpdateChargeRule([FromBody]ChargeRuleMasterReq Request, long ChargeRuleMasterId)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.UpdateChargeRule(ChargeRuleMasterId, Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpPost("{ChargeRuleMasterId}")]
        //public async Task<IActionResult> DisableChargeRule(long ChargeRuleMasterId)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.DisableChargeRule(ChargeRuleMasterId);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        ////vsoalnki 14-11-2018
        //[HttpGet("{ChargeRuleMasterId}")]
        //public async Task<IActionResult> GetChargeRuleById(long ChargeRuleMasterId)
        //{
        //    ListChargeRuleMasterRes Response = new ListChargeRuleMasterRes();
        //    try
        //    {
        //        ApplicationUser user = new ApplicationUser(); user.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _communicationService.GetChargeRuleById(ChargeRuleMasterId);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        #region "NotificationQueue"

        //vsolanki 14-11-2018
        [HttpGet("{FromDate}/{ToDate}/{Page}")]
        public async Task<IActionResult> GetNotificationQueue(DateTime FromDate, DateTime ToDate, short? Status, int Page, int? PageSize)
        {
            ListNotificationQueueRes Response = new ListNotificationQueueRes();
            try
            {
                //Page = Page + 1; // khushali - 17-01-2019 removed change as per front team for pagination
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    var accessToken = await HttpContext.GetTokenAsync("access_token");
                    Response = _communicationService.GetNotificationQueue(FromDate, ToDate, Status, Page, PageSize);
                }
                var respObj = JsonConvert.SerializeObject(Response);
                dynamic respObjJson = JObject.Parse(respObj);
                return Ok(respObjJson);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region MasterConfiguration

        //#region Insert Method
        //[HttpPost]
        //public async Task<IActionResult> AddCountry(AddCountryReq Request)//[Required]string CountryName, [Required]string CountryCode
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.AddCountry(Request,user.Id);//Request.CountryName,Request.CountryCode,user.Id,Request.Status
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> AddState(AddStateReq Request)//string StateName, string StateCode, long CountryID
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.AddState(Request, user.Id);//Request.StateName, Request.StateCode, Request.CountryID
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> AddCity(AddCityReq Request)//string CityName, long StateID
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.AddCity(Request, user.Id);//user.Id--71   Request.CityName, Request.StateID
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> AddZipCode(AddZipCodeReq Request)//long ZipCode, string AreaName, long CityID
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.AddZipCode(Request, user.Id);//Request.ZipCode, Request.AreaName, Request.CityID
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        //#region Update Methods

        //[HttpPost]
        //public async Task<IActionResult> UpdateCountryDetail(AddCountryReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else if(Request.CountryID == null || Request.CountryID == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.MasterConfig;
        //            Response.ErrorCode = enErrorCode.InvalidMasterID;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.UpdateCountry(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> UpdateStateDetail(AddStateReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else if (Request.StateID == null || Request.StateID == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.MasterConfig;
        //            Response.ErrorCode = enErrorCode.InvalidMasterID;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.UpdateState(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> UpdateCityDetail(AddCityReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else if (Request.CityID == null || Request.CityID == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.MasterConfig;
        //            Response.ErrorCode = enErrorCode.InvalidMasterID;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.UpdateCity(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> UpdateZipCodeDetail(AddZipCodeReq Request)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else if (Request.ZipCodeID == null || Request.ZipCodeID == 0)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.MasterConfig;
        //            Response.ErrorCode = enErrorCode.InvalidMasterID;
        //        }
        //        else
        //        {
        //            var accessToken = await HttpContext.GetTokenAsync("access_token");
        //            Response = _masterConfiguration.UpdateZipCode(Request, user.Id);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        //#region Get Methods

        //[HttpGet]
        //public async Task<IActionResult> GetCountryDetail([Required]long CountryID)
        //{
        //    Countries Response = new Countries();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
        //            Response.BizResponseObj.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.BizResponseObj.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            Response = _masterConfiguration.GetCountry(CountryID);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetStateDetail([Required]long StateID)
        //{
        //    States Response = new States();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
        //            Response.BizResponseObj.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.BizResponseObj.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            Response = _masterConfiguration.GetState(StateID);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetCityDetail([Required]long CityID)
        //{
        //    Cities Response = new Cities();
        //    try
        //    {
        //        var user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (user == null)
        //        {
        //            Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
        //            Response.BizResponseObj.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.BizResponseObj.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            Response = _masterConfiguration.GetCity(CityID);
        //        }
        //        var respObj = JsonConvert.SerializeObject(Response);
        //        dynamic respObjJson = JObject.Parse(respObj);
        //        return Ok(respObjJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        //#endregion

        #endregion

        #region Report

        [HttpGet("{FromDate}/{ToDate}/{PageNo}/{PageSize}")]
        //[Authorize]
        public async Task<IActionResult> WithdrawalReport(DateTime FromDate, DateTime ToDate, int PageNo, int PageSize, string CoinName, long? UserID, short? Status, string Address, string TrnID, string TrnNo, long? OrgId)
        {
            RptWithdrawalRes Response = new RptWithdrawalRes();
            BizResponseClass obj = new BizResponseClass();
            try
            {
                // var user = await _userManager.GetUserAsync(HttpContext.User);
                var user = new ApplicationUser(); user.Id = 1;
                if (user == null)
                {
                    obj.ReturnCode = enResponseCode.Fail;
                    obj.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    obj.ErrorCode = enErrorCode.StandardLoginfailed;
                    Response.BizResponseObj = obj;
                }
                else
                {
                    Response = _masterConfiguration.WithdrawReport(FromDate, ToDate, PageNo, PageSize, CoinName, UserID, Status, Address, TrnID, TrnNo, OrgId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        [HttpGet("{FromDate}/{ToDate}/{PageNo}/{PageSize}")]
        // [Authorize]
        public async Task<IActionResult> DepositionReport(DateTime FromDate, DateTime ToDate, int PageNo, int PageSize, string CoinName, long? UserID, short? Status, string Address, string TrnID, long? OrgId)
        {
            RptDepositionRes Response = new RptDepositionRes();
            BizResponseClass obj = new BizResponseClass();
            try
            {
                var user = new ApplicationUser(); user.Id = 1;
                // var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    obj.ReturnCode = enResponseCode.Fail;
                    obj.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    obj.ErrorCode = enErrorCode.StandardLoginfailed;
                    Response.BizResponseObj = obj;
                }
                else
                {
                    Response = _masterConfiguration.DepositReport(FromDate, ToDate, PageNo, PageSize, CoinName, UserID, Status, Address, TrnID, OrgId);

                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        #endregion

        // khushali 18-01-2019
        #region "Email API manager"

        #region "Request Fromate API"

        [HttpGet("GetAllRequestFormat")]
        public IActionResult GetAllRequestFormat()
        {
            RequestFormatResAllData res = new RequestFormatResAllData();
            try
            {
                res.Result = _communicationService.GetAllRequestFormat();
                if (res.Result.Count == 0)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpGet("GetRequestFormatById/{Id:long}")]
        public IActionResult GetRequestFormatById(long Id)
        {
            RequestFormatResponse res = new RequestFormatResponse();
            try
            {
                res.Result = _communicationService.GetRequestFormatById(Id);
                if (res.Result == null)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpPost("AddRequestFormat")]
        public async Task<IActionResult> AddRequestFormat([FromBody]RequestFormatRequest Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var response = _communicationService.AddRequestFormat(Request, 1);
                if (response != 0)
                {
                    Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InternalError;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpPost("UpdateRequestFormat")]
        public async Task<IActionResult> UpdateRequestFormat([FromBody]RequestFormatRequest request)
        {
            BizResponseClass res = new BizResponseClass();
            bool state = false;
            try
            {
                if (request.RequestID == 0)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.InValid_ID;
                    return Ok(res);
                }
                
                state = _communicationService.UpdateRequestFormat(request, 1);
                if (state == false)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                //res.response = _transactionConfigService.GetThirdPartyAPIConfigById(request.Id);
                //if (res.response == null)
                //{
                //    res.ReturnCode = enResponseCode.Fail;
                //    res.ErrorCode = enErrorCode.NoDataFound;
                //    return Ok(res);
                //}
                res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }

        }

        [HttpPost("ChangeStatusRequestFormat")]
        public IActionResult ChangeStatusRequestFormat(long id,short Status)
        {
            BizResponseClass res = new BizResponseClass();
            try
            {
                var response = _communicationService.ChangeStatusRequestFormat(id,Status);
                if (response == true)
                {
                    res.ReturnCode = enResponseCode.Success;
                    res.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                }
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        #endregion

        #region "Email service provider"

        [HttpGet("GetCommunicationServiceType")]
        public IActionResult GetCommunicationServiceType()
        {
            CommunicationServiceResponse res = new CommunicationServiceResponse();
            try
            {
                res.Result = _communicationService.GetCommunicationServiceType();
                if (res.Result.Count == 0)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpGet("GetCommunicationServiceConfig/{ServiceType:long}")]
        public IActionResult GetCommunicationServiceConfiguration(long ServiceType)
        {
            CommunicationServiceConfigAllData res = new CommunicationServiceConfigAllData();
            try
            {
                res.Result = _communicationService.GetCommunicationServiceConfiguration(ServiceType);
                if (res.Result.Count == 0)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpGet("GetCommunicationServiceConfigById/{APIID:long}")]
        public IActionResult GetCommunicationServiceConfigurationById(long APIID)
        {
            CommunicationServiceConfigRes res = new CommunicationServiceConfigRes();
            try
            {
                res.Result = _communicationService.GetCommunicationServiceConfigurationById(APIID);
                if (res.Result == null)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpPost("AddCommunicationServiceConfig")]
        public async Task<IActionResult> AddCommunicationServiceConfig([FromBody]CommunicationServiceConfigRequest Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var response = _communicationService.AddCommunicationServiceConfig(Request, 1);
                if (response != 0)
                {
                    Response.ReturnMsg = EnResponseMessage.CommRecordInsertSuccess;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.InternalError;
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        [HttpPost("UpdateCommunicationServiceConfig")]
        public async Task<IActionResult> UpdateCommunicationServiceConfig([FromBody]CommunicationServiceConfigRequest request)
        {
            BizResponseClass res = new BizResponseClass();
            bool state = false;
            try
            {
                if (request.APID == 0 || request.SerproID == 0 || request.ServiceID == 0)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.InValid_ID;
                    return Ok(res);
                }
                state = _communicationService.UpdateCommunicationServiceConfig(request, 1);
                if (state == false)
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                    return Ok(res);
                }                
                res.ReturnMsg = EnResponseMessage.CommRecordUpdateSuccess;
                res.ReturnCode = enResponseCode.Success;
                res.ErrorCode = enErrorCode.Success;
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }

        }

        [HttpPost("ChangeStatusCommunicationServiceConfig/{APIID:long}/{ServiceID:long}/{SerProID:long}/{Status:int}")]
        public IActionResult ChangeStatusCommunicationServiceConfig(long APIID, long ServiceID, long SerProID, short Status)
        {
            BizResponseClass res = new BizResponseClass();
            try
            {
                var response = _communicationService.ChangeStatusCommunicationServiceConfig(APIID, ServiceID, SerProID, Status);
                if (response == true)
                {
                    res.ReturnCode = enResponseCode.Success;
                    res.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    res.ReturnCode = enResponseCode.Fail;
                    res.ErrorCode = enErrorCode.NoDataFound;
                }
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });

            }
        }

        #endregion

        #endregion
    }
}