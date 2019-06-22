using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces.Activity_Log;
using CleanArchitecture.Core.Interfaces.Log;
using CleanArchitecture.Core.ViewModels.AccountViewModels.Log;
using CleanArchitecture.Core.ViewModels.BackOfficeComplain;
using CleanArchitecture.Core.ViewModels.Organization;
using CleanArchitecture.Infrastructure.Services.ActivityLog;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.API.BackOffice
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BackOfficeActivityLogController : BaseController
    {
        #region Field
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IActivityRegisterData _IactivityRegisterService;
        private readonly IActivityLog _activityLog;
        #endregion
        #region Ctore

        public BackOfficeActivityLogController(UserManager<ApplicationUser> userManager, IActivityRegisterData IactivityRegisterService, IActivityLog activityLog)
        {
            _userManager = userManager;
            _IactivityRegisterService = IactivityRegisterService;
            _activityLog = activityLog;
        }

        #endregion

        #region Method
        [HttpGet("GetAllActivityLog/{PageIndex}/{Page_Size}")]
        //public async Task<IActionResult> GetAllActivityLog(int PageIndex, int Page_Size, int UserId, string IpAddress, string DeviceId, string ActivityAliasName, string URL, string ModuleType, long? StatusCode, DateTime FromDate, DateTime ToDate)
        public async Task<IActionResult> GetAllActivityLog(int PageIndex, int Page_Size, DateTime? FromDate, DateTime? ToDate, int UserId, string IpAddress, string DeviceId, string ActivityAliasName, string ModuleType, long? StatusCode)
        {
            try
            {
                var user = await GetCurrentUserAsync();
                var Userid = await HttpContext.GetTokenAsync("access_token");
                HttpContext.Items[Userid] = user.Id;

                //var GetAllActivityData = _IactivityRegisterService.GetBackofficeAllActivityLog(UserId, PageIndex, Page_Size, IpAddress, DeviceId, ActivityAliasName, "", ModuleType, StatusCode, FromDate, ToDate);
                var GetAllActivityData = _IactivityRegisterService.GetBackofficeAllActivityLog(UserId, PageIndex, Page_Size, IpAddress, DeviceId, ActivityAliasName,  ModuleType, StatusCode, FromDate, ToDate); // New change by Pratik 25-3-2019 Remove URL parameter to unnecessary pass to SP
                if (GetAllActivityData != null)
                {
                    return Ok(new GetActivityLogResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessGetBackOffActivityData, GetActivityLogList = GetAllActivityData.GetActivityLogList, TotalCount= GetAllActivityData.TotalCount });
                }
                else
                    return Ok(new ActivityRegisterResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.ActivityDataNotAvailable, ErrorCode = enErrorCode.Status9028ActivityDataNotAvailable });
            }
            catch (Exception ex)
            {
                return BadRequest(new ActivityRegisterResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("GetActivityLogHistoryAdmin")]
        [Authorize]
        public async Task<IActionResult> GetActivityLogHistoryAdmin(int PageIndex , int Page_Size = 0, string Action = null, string Mode = null, string IPAddress = null, string Location = null, string UserName = null, DateTime? FromDate = null, DateTime? ToDate = null)
        {
            try
            {
                //var user = await GetCurrentUserAsync();
                //var Userid = await HttpContext.GetTokenAsync("access_token");
                //HttpContext.Items[Userid] = user.Id;

                var GetAllActivityData =await Task.FromResult( _activityLog.GetActivityLogHistoryAdmin(PageIndex + 1, Page_Size, Action, Mode, IPAddress, Location, UserName, FromDate, ToDate));
                if (GetAllActivityData != null)
                {
                    return Ok(new ActivityLogResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessGetBackOffActivityData, ActivityLogHistoryList = GetAllActivityData.ActivityLogHistoryList, TotalRow = GetAllActivityData.TotalRow });
                }
                else
                    return Ok(new ActivityLogResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.ActivityDataNotAvailable, ErrorCode = enErrorCode.Status9028ActivityDataNotAvailable });
            }
            catch (Exception ex)
            {
                return BadRequest(new ActivityLogResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("GetActivityLogHistoryByUserId")]
        [Authorize]
        public async Task<IActionResult> GetActivityLogHistoryByUserId(int pageIndex, int pageSize)
        {
            try
            {
                //var user = await GetCurrentUserAsync();
                //var Userid = await HttpContext.GetTokenAsync("access_token");
                //HttpContext.Items[Userid] = user.Id;
                ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                var GetAllActivityData = await Task.FromResult(_activityLog.GetActivityLogHistoryByUserId(user.Id, pageIndex, pageSize));
                if (GetAllActivityData != null)
                {
                    return Ok(new ActivityLogResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessGetBackOffActivityData, ActivityLogHistoryList = GetAllActivityData.ActivityLogHistoryList, TotalRow = GetAllActivityData.TotalRow });
                }
                else
                    return Ok(new ActivityLogResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.ActivityDataNotAvailable, ErrorCode = enErrorCode.Status9028ActivityDataNotAvailable });
            }
            catch (Exception ex)
            {
                return BadRequest(new ActivityLogResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        [HttpGet("GetAllModuleData")]
        public async Task<IActionResult> GetAllModuleData()
        {
            try
            {
                var user = await GetCurrentUserAsync();
                var UserIid = await HttpContext.GetTokenAsync("access_token");
                HttpContext.Items[UserIid] = user.Id;
                var ModuleDataList = _IactivityRegisterService.GetAllModuleData();
                return Ok(new GetModuleDataResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.BackOffGetAllModuleData, GetModuleData = ModuleDataList });
            }
            catch (Exception ex)
            {
                return BadRequest(new BackOffAddComResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region Helpers
        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }
        #endregion
    }
}