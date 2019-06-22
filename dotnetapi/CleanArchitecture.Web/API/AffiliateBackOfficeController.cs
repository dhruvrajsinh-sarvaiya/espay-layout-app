﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Affiliate;
using CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate;
using CleanArchitecture.Core.ViewModels.BackOfficeAffiliate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.API
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AffiliateBackOfficeController : ControllerBase
    {
        private readonly IAffiliateBackOfficeService _affiliateBackOfficeService;
        private readonly UserManager<ApplicationUser> _userManager;
        public AffiliateBackOfficeController(IAffiliateBackOfficeService affiliateBackOfficeService, UserManager<ApplicationUser> userManager)
        {
            _affiliateBackOfficeService = affiliateBackOfficeService;
            _userManager = userManager;
        }
        
        #region Uday's Methods

        // [HttpGet("GetAffiliateDashboardCount")]
        [HttpGet]
        public ActionResult<AffiliateDashboardCountResponse> GetAffiliateDashboardCount()
        {
            try
            {
                AffiliateDashboardCountResponse Response = new AffiliateDashboardCountResponse();

                Response.Response = _affiliateBackOfficeService.GetAffiliateDashboardCount();
                Response.ErrorCode = enErrorCode.Success;
                Response.ReturnCode = enResponseCode.Success;

                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetAffiateUserRegistered")]
        [HttpPost]
        public ActionResult<GetAffiateUserRegisteredResponse> GetAffiateUserRegistered(GetAffiateUserRegisteredRequest Request)
        {
            try
            {
                GetAffiateUserRegisteredResponse Response = new GetAffiateUserRegisteredResponse();
                int Status = 999, SchemeType = 999;
                long ParentUser = 999;
                string sCondition = "";

                if (Request.Status != null)
                {
                    Status = Convert.ToInt16(Request.Status);
                }

                if (Request.SchemeType != null)
                {
                    SchemeType = Convert.ToInt16(Request.SchemeType);
                }

                if (Request.ParentUser != null)
                {
                    ParentUser = Convert.ToInt64(Request.ParentUser);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND AUM.CreatedDate Between {3} AND {4}";
                }

                Response = _affiliateBackOfficeService.GetAffiateUserRegistered(Request.FromDate, Request.ToDate, Status, SchemeType, ParentUser, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetReferralLinkClick")]
        [HttpPost]
        public ActionResult<GetReferralLinkClickResponse> GetReferralLinkClick(GetReferralLinkClickRequest Request)
        {
            try
            {
                GetReferralLinkClickResponse Response = new GetReferralLinkClickResponse();
                long UserId = 999;
                string sCondition = "";

                if (Request.UserId != 0 && Request.UserId != null)
                {
                    UserId = Convert.ToInt64(Request.UserId);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND ALC.CreatedDate Between {1} AND {2}";
                }

                Response = _affiliateBackOfficeService.GetReferralLinkClick(Request.FromDate, Request.ToDate, UserId, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetFacebookLinkClick")]
        [HttpPost]
        public ActionResult<GetFacebookLinkClickResponse> GetFacebookLinkClick(GetFacebookLinkClickRequest Request)
        {
            try
            {
                GetFacebookLinkClickResponse Response = new GetFacebookLinkClickResponse();
                long UserId = 999;
                string sCondition = "";

                if (Request.UserId != 0 && Request.UserId != null)
                {
                    UserId = Convert.ToInt64(Request.UserId);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND ALC.CreatedDate Between {1} AND {2}";
                }

                Response = _affiliateBackOfficeService.GetFacebookLinkClick(Request.FromDate, Request.ToDate, UserId, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetTwitterLinkClick")]
        [HttpPost]
        public ActionResult<GetTwitterLinkClickResponse> GetTwitterLinkClick(GetTwitterLinkClickRequest Request)
        {
            try
            {
                GetTwitterLinkClickResponse Response = new GetTwitterLinkClickResponse();
                long UserId = 999;
                string sCondition = "";

                if (Request.UserId != 0 && Request.UserId != null)
                {
                    UserId = Convert.ToInt64(Request.UserId);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND ALC.CreatedDate Between {1} AND {2}";
                }

                Response = _affiliateBackOfficeService.GetTwitterLinkClick(Request.FromDate, Request.ToDate, UserId, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetEmailSent")]
        [HttpPost]
        public ActionResult<GetEmailSentResponse> GetEmailSent(GetEmailSentRequest Request)
        {
            try
            {
                GetEmailSentResponse Response = new GetEmailSentResponse();
                long UserId = 999;
                string sCondition = "";

                if (Request.UserId != 0 && Request.UserId != null)
                {
                    UserId = Convert.ToInt64(Request.UserId);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND APS.CreatedDate Between {1} AND {2}";
                }

                Response = _affiliateBackOfficeService.GetEmailSent(Request.FromDate, Request.ToDate, UserId, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("GetSMSSent")]
        [HttpPost]
        public ActionResult<GetSMSSentResponse> GetSMSSent(GetSMSSentRequest Request)
        {
            try
            {
                GetSMSSentResponse Response = new GetSMSSentResponse();
                long UserId = 999;
                string sCondition = "";

                if (Request.UserId != 0 && Request.UserId != null)
                {
                    UserId = Convert.ToInt64(Request.UserId);
                }

                if (!string.IsNullOrEmpty(Request.FromDate))
                {
                    if (string.IsNullOrEmpty(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.FromDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidFromDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    if (!_affiliateBackOfficeService.IsValidDateFormate(Request.ToDate))
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ErrorCode = enErrorCode.InvalidToDateFormate;
                        Response.ReturnMsg = "Invalid Date Format";
                        return Response;
                    }

                    sCondition += " AND APS.CreatedDate Between {1} AND {2}";
                }

                Response = _affiliateBackOfficeService.GetSMSSent(Request.FromDate, Request.ToDate, UserId, sCondition, Request.PageNo, Request.PageSize);

                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        // [HttpGet("GetAllAffiliateUser")]
        [HttpGet]
        public ActionResult<GetAllAffiliateUserResponse> GetAllAffiliateUser()
        {
            try
            {
                GetAllAffiliateUserResponse Response = new GetAllAffiliateUserResponse();

                var _Res = _affiliateBackOfficeService.GetAllAffiliateUser();

                if (_Res.Count > 0)
                {
                    Response.Response = _Res;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ErrorCode = enErrorCode.Success;
                    Response.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ErrorCode = enErrorCode.NoDataFound;
                    Response.ReturnMsg = "No Data Found";
                }
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateDashboardCountResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        // Develop by Pratik :: 15-3-2019 
        //Modified By Rushabh 18-3-2019

        #region Scheme Type Mapping

        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> AddAffiliateSchemeTypeMapping(AffiliateSchemeTypeMappingViewModel model)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    //var obj = new AffiliateSchemeTypeMappingViewModel()
                    //{
                    //    SchemeMasterId = model.SchemeMasterId,
                    //    SchemeTypeMasterId = model.SchemeTypeMasterId,
                    //    MinimumDepositionRequired = model.MinimumDepositionRequired,
                    //    DepositWalletTypeId = model.DepositWalletTypeId,
                    //    CommissionTypeInterval = model.CommissionTypeInterval,
                    //    Description = model.Description,
                    //    CommissionHour = model.CommissionHour,
                    //};
                    Response = _affiliateBackOfficeService.AddAffiliateSchemeTypeMapping(model, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateSchemeTypeMappingResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}")]
        //[Authorize]
        public async Task<ActionResult> ListAffiliateSchemeTypeMapping(long? SchemeMasterId, long? SchemeTypeMasterId,int PageNo,int? PageSize)
        {
            AffiliateSchemeTypeMappingListResponse Response = new AffiliateSchemeTypeMappingListResponse();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    Response = await Task.FromResult(_affiliateBackOfficeService.ListAffiliateSchemeTypeMapping(SchemeMasterId, SchemeTypeMasterId, PageNo, PageSize));
                    //if (getData != null)
                    //{
                    //    return Ok(new AffiliateSchemeTypeMappingListResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.AffiliateSchemeTypeMappingList, AffiliateSchemeTypeMappingList = getData.AffiliateSchemeTypeMappingList, TotalCount = getData.TotalCount });
                    //}                        
                    //else
                    //{
                    //    return BadRequest(new AffiliateSchemeTypeMappingResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailAffiliateSchemeTypeMappingList, ErrorCode = enErrorCode.Status31020FailAffiliateSchemeTypeMappingList });
                    //}                        
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateSchemeTypeMappingResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult> GetAffiliateSchemeTypeMapping(AffiliateSchemeTypeMappingStatusViewModel model)
        {
            GetByIdSchemeTypeMapping Response = new GetByIdSchemeTypeMapping();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    Response = await Task.FromResult(_affiliateBackOfficeService.GetAffiliateSchemeTypeMapping(model.MappingId));
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeAffiliateSchemeTypeMappingStatus([FromBody]SchemeTypeMappingChangeStatusViewModel Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.MappingId == null || Request.MappingId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfTypeMappingIdRequired;
                    Response.ErrorCode = enErrorCode.AfSchemeTypeMappingIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ChangeAffiliateSchemeTypeMappingStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> UpdateAffiliateSchemeTypeMapping(AffiliateSchemeTypeMappingUpdateViewModel model)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    Response = _affiliateBackOfficeService.UpdateAffiliateSchemeTypeMapping(model, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new AffiliateSchemeTypeMappingResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Affiliate Scheme Master

        [HttpPost]
        public async Task<IActionResult> AddAffiliateScheme([FromBody]AffiliateSchemeMasterReqRes Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.AddAffiliateScheme(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAffiliateScheme([FromBody]AffiliateSchemeMasterReqRes Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                if (Request.SchemeMasterId == null || Request.SchemeMasterId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfIdRequired;
                    Response.ErrorCode = enErrorCode.AfSchemeMasterIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.UpdateAffiliateScheme(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeAffiliateSchemeStatus([FromBody]ChangeAffiliateSchemeStatus Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.SchemeMasterId == null || Request.SchemeMasterId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfIdRequired;
                    Response.ErrorCode = enErrorCode.AfSchemeMasterIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ChangeAffiliateSchemeStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{SchemeMasterId}")]
        public async Task<IActionResult> GetAffiliateSchemeById(long SchemeMasterId)
        {
            GetAffiliateSchemeMasterRes Response = new GetAffiliateSchemeMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.GetAffiliateSchemeById(SchemeMasterId, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}")]
        public async Task<IActionResult> ListAffiliateScheme(int PageNo,int? PageSize)
        {
            ListAffiliateSchemeMasterRes Response = new ListAffiliateSchemeMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ListAffiliateSchemeById(PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Affiliate Scheme Type Master

        [HttpPost]
        public async Task<IActionResult> AddAffiliateSchemeType([FromBody]AffiliateSchemeTypeMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    Response = await _affiliateBackOfficeService.AddAffiliateSchemeType(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAffiliateSchemeType([FromBody]AffiliateSchemeTypeMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.SchemeTypeId == null || Request.SchemeTypeId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfTypeIdRequired;
                    Response.ErrorCode = enErrorCode.AfSchemeTypeIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.UpdateAffiliateSchemeType(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeAffiliateSchemeTypeStatus([FromBody]ChangeAffiliateSchemeTypeStatus Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.SchemeTypeId == null || Request.SchemeTypeId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfTypeIdRequired;
                    Response.ErrorCode = enErrorCode.AfSchemeTypeIdRequired;
                    return Ok(Response);
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ChangeAffiliateSchemeTypeStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{SchemeTypeId}")]
        public async Task<IActionResult> GetAffiliateSchemeTypeById(long SchemeTypeId)
        {
            GetAffiliateSchemeTypeMasterRes Response = new GetAffiliateSchemeTypeMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.GetAffiliateSchemeTypeById(SchemeTypeId, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}")]
        public async Task<IActionResult> ListAffiliateSchemeType(int PageNo, int? PageSize)
        {
            ListAffiliateSchemeTypeMasterRes Response = new ListAffiliateSchemeTypeMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ListAffiliateSchemeTypeById(PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Affiliate Promotion Master

        [HttpPost]
        public async Task<IActionResult> AddAffiliatePromotion([FromBody]AffiliatePromotionMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    Response = await _affiliateBackOfficeService.AddAffiliatePromotion(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAffiliatePromotion([FromBody]AffiliatePromotionMasterReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.PromotionId == null || Request.PromotionId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfProIdRequired;
                    Response.ErrorCode = enErrorCode.AfProIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.UpdateAffiliatePromotion(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeAffiliatePromotionStatus([FromBody]ChangeAffiliatePromotionStatus Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.PromotionId == null || Request.PromotionId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfProIdRequired;
                    Response.ErrorCode = enErrorCode.AfProIdRequired;
                    return Ok(Response);
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ChangeAffiliatePromotionStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{PromotionId}")]
        public async Task<IActionResult> GetAffiliatePromotionById(long PromotionId)
        {
            GetAffiliatePromotionMasterRes Response = new GetAffiliatePromotionMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.GetAffiliatePromotionById(PromotionId, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}")]
        public async Task<IActionResult> ListAffiliatePromotion(int PageNo, int? PageSize)
        {
            ListAllAffiliatePromotionMasterRes Response = new ListAllAffiliatePromotionMasterRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ListAffiliatePromotion(PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Affiliate Scheme Detail

        [HttpPost]
        public async Task<IActionResult> AddAffiliateShemeDetail([FromBody]AffiliateShemeDetailReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.AddAffiliateSchemeDetail(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAffiliateShemeDetail([FromBody]AffiliateShemeDetailReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.DetailId == null || Request.DetailId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfdetailIdRequired;
                    Response.ErrorCode = enErrorCode.AfdetailIdRequired;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.UpdateAffiliateSchemeDetail(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeAffiliateShemeDetailStatus([FromBody]ChangeAffiliateSchemeDetailStatus Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                if (Request.DetailId == null || Request.DetailId <= 0)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.AfdetailIdRequired;
                    Response.ErrorCode = enErrorCode.AfdetailIdRequired;
                    return Ok(Response);
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ChangeAffiliateShemeDetailStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{DetailId}")]
        public async Task<IActionResult> GetAffiliateSchemeDetail(long DetailId)
        {
            GetAffiliateShemeDetailResById Response = new GetAffiliateShemeDetailResById();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.GetAffiliateSchemeDetail(DetailId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}")]
        public async Task<IActionResult> ListAffiliateSchemeDetail(int PageNo, int? PageSize)
        {
            ListAffiliateShemeDetailRes Response = new ListAffiliateShemeDetailRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _affiliateBackOfficeService.ListAffiliateSchemeDetail(PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        
        #endregion

        #region Commission history Report

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> AffiliateCommissionHistoryReport(int PageNo, int PageSize, DateTime? FromDate, DateTime? ToDate, long? TrnUserId, long? AffiliateUserId, long? SchemeMappingId, long? TrnRefNo)
        {
            ListAffiliateCommissionHistoryReport Response = new ListAffiliateCommissionHistoryReport();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _affiliateBackOfficeService.AffiliateCommissionHistoryReport(PageNo, PageSize, FromDate, ToDate, TrnUserId, AffiliateUserId, SchemeMappingId, TrnRefNo);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Graph API

        [HttpGet]
      //  [AllowAnonymous]
        public async Task<IActionResult> GetAffiliateInvitieChartDetail()
        {
            ListInviteFrdClaas Response = new ListInviteFrdClaas();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _affiliateBackOfficeService.GetAffiliateInviteFrieds();
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        //  [AllowAnonymous]
        public async Task<IActionResult> GetMonthWiseCommissionChartDetail(int? Year)
        {
            ListGetMonthWiseCommissionData Response = new ListGetMonthWiseCommissionData();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //var user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _affiliateBackOfficeService.GetMonthWiseCommissionChartDetail(Year);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

    }
}