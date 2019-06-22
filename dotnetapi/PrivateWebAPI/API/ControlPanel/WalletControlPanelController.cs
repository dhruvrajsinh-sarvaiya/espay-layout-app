using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Services;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.BackOffice.PasswordPolicy;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletConfiguration;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.Interfaces;
using LucidOcean.MultiChain;
using LucidOcean.MultiChain.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CleanArchitecture.Web.API.ControlPanel
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    //[Authorize]
    public class WalletControlPanelController : Controller
    {
        #region Constructor
        private readonly EncyptedDecrypted _encdecAEC;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IControlPanelServices _controlPanelServices;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        Infrastructure.Data.MultiChainClient _client = null;

        public WalletControlPanelController(
            UserManager<ApplicationUser> userManager, IControlPanelServices controlPanelServices,
            Microsoft.Extensions.Configuration.IConfiguration configuration, EncyptedDecrypted encdecAEC,
            IPushNotificationsQueue<SendEmailRequest> PushNotificationsQueue)
        {
            _userManager = userManager;
            _controlPanelServices = controlPanelServices;
            _configuration = configuration;
            _encdecAEC = encdecAEC;
            _pushNotificationsQueue = PushNotificationsQueue;
            //_client = new Infrastructure.Data.MultiChainClient(MultichainSetting.Connection);
        }

        #endregion

        #region TransactionBlockedChannel

        [HttpPost]
        public async Task<IActionResult> BlockTransactionForChannel([FromBody] TransactionBlockedChannelReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = await _controlPanelServices.BlockTranForChannel(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> GetBlockTransactionForChannel(long ID, long? ChannelID, short? Status)
        {
            ListTransactionBlockedChannelRes Response = new ListTransactionBlockedChannelRes();
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
                    Response = _controlPanelServices.GetBlockTranForChannel(ID, Status, ChannelID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListBlockTransactionForChannel(enWalletTrnType? TrnType, long? ChannelID, short? Status)
        {
            ListTransactionBlockedChannelRes Response = new ListTransactionBlockedChannelRes();
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
                    Response = _controlPanelServices.ListBlockTranForChannel(TrnType, ChannelID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region WalletPolicyAllowedDay

        [HttpPost]
        public async Task<IActionResult> AddWalletPolicyAllowedDay([FromBody] WalletPolicyAllowedDayReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = await _controlPanelServices.AddWPolicyAllowedDay(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> GetWalletPolicyAllowedDay(long ID, EnWeekDays? DayNo, long? PolicyID, short? Status)
        {
            ListWalletPolicyAllowedDayRes Response = new ListWalletPolicyAllowedDayRes();
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
                    Response = _controlPanelServices.GetWPolicyAllowedDay(ID, DayNo, PolicyID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListWalletPolicyAllowedDay(EnWeekDays? DayNo, long? PolicyID, short? Status)
        {
            ListWalletPolicyAllowedDayRes Response = new ListWalletPolicyAllowedDayRes();
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
                    Response = _controlPanelServices.ListWPolicyAllowedDay(DayNo, PolicyID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        #endregion

        #region User Methods

        [HttpGet]
        public async Task<IActionResult> GetUserCount(long? OrgID, long? UserTypeID, short? Status, long? RoleID)
        {
            TodaysCount Response = new TodaysCount();
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
                    Response = _controlPanelServices.GetUserCount(OrgID, UserTypeID, Status, RoleID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserCountStatusWise()
        {
            StatusWiseRes Response = new StatusWiseRes();
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
                    Response = _controlPanelServices.GetUCntStatusWise();
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
        public async Task<IActionResult> GetUserCountTypeWise()
        {
            UTypeWiseRes Response = new UTypeWiseRes();
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
                    Response = _controlPanelServices.GetUCntTypeWise();
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
        public async Task<IActionResult> GetUserCountOrgWise()
        {
            OrgWiseRes Response = new OrgWiseRes();
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
                    Response = _controlPanelServices.GetUCntOrgWise();
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
        public async Task<IActionResult> GetUserCountRoleWise()
        {
            RolewiseUserCount Response = new RolewiseUserCount();
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
                    Response = _controlPanelServices.GetUCntRoleWise();
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
        public async Task<IActionResult> GetTodaysUserCount(short? Status)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetTodayUserCount(Status);
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
        public async Task<IActionResult> ListAllUserDetails(long? OrgID, long? UserType, short? Status, int? PageNo, int? PageSize)
        {
            ListUserDetailRes Response = new ListUserDetailRes();
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
                    Response = _controlPanelServices.ListAllUserDetails(OrgID, UserType, Status, PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //vsolanki 2018-11-27
        [HttpGet]
        public async Task<IActionResult> ListUserLastFive()
        {
            UserList Response = new UserList();
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
                    Response = _controlPanelServices.ListUserLast5();
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

        #region User Type Methods

        [HttpGet]
        public async Task<IActionResult> ListUserTypes(short? Status)
        {
            ListUserTypeRes Response = new ListUserTypeRes();
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
                    Response = _controlPanelServices.ListAllUserType(Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Organization Methods
        [HttpGet]
        public async Task<IActionResult> GetOrgCount(short? Status)
        {
            TodaysCount Response = new TodaysCount();
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
                    Response = _controlPanelServices.GetOrganizationCount(Status);
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

        [HttpPost("{OrgID}")]
        public async Task<IActionResult> SetDefaultOrg(long OrgID)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 2;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _controlPanelServices.SetDefaultOrganization(OrgID, user.Id);
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
        public async Task<IActionResult> GetTodaysOrgCount(short? Status)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetTodayOrganizationCount(Status);
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
        public async Task<IActionResult> ListOrgDetails(short? Status, long? OrgID)
        {
            OrgList Response = new OrgList();
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
                    Response = await _controlPanelServices.ListOrgDetail(Status, OrgID);
                }
                //var respObj = JsonConvert.SerializeObject(Response);
                //dynamic respObjJson = JObject.Parse(respObj);
                //HelperForLog.WriteLogIntoFile("ListOrgDetail", "ListOrgDetail", "return controller");

                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Wallet Methods

        [HttpGet]
        public async Task<IActionResult> GetWalletCount(long? WalletTypeID, short? Status, long? OrgID, long? UserID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetWalletCount(WalletTypeID, Status, OrgID, UserID);
                }
                //var respObj = JsonConvert.SerializeObject(Response);
                //dynamic respObjJson = JObject.Parse(respObj);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetWalletCountTypeWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWCntTypeWise();
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
        public async Task<IActionResult> GetWalletCountStatusWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWCntStatusWise();
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
        public async Task<IActionResult> GetWalletCountOrgWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWCntOrgWise();
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
        public async Task<IActionResult> GetWalletCountUserWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWCntUserWise();
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

        [HttpGet("{PageSize}/{Page}")]
        public async Task<IActionResult> ListAllWallet(DateTime? FromDate, DateTime? ToDate, short? Status, int PageSize, int Page, long? UserId, long? OrgId, string WalletType)
        {
            ListWalletRes Response = new ListWalletRes();
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
                    Response = _controlPanelServices.ListAllWallet(FromDate, ToDate, Status, PageSize, Page, UserId, OrgId, WalletType);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{AccWalletId}")]
        public async Task<IActionResult> GetWalletIdWise(string AccWalletId)
        {
            WalletRes1 Response = new WalletRes1();
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
                    Response = _controlPanelServices.GetWalletIdWise(AccWalletId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region Authorized Apps

        [HttpPost]//("{AppName}/{SecreteKey}/{SiteURL}")
        public async Task<IActionResult> AddAuthorizeApps([FromBody] AuthAppReq Request)
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
                    Response = await _controlPanelServices.AddAuthorizedApps(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        [HttpGet]
        public async Task<IActionResult> ListAuthorizedAppDetails(short? Status)
        {
            ListAuthAppRes Response = new ListAuthAppRes();
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
                    Response = _controlPanelServices.ListAuthorizedAppDetail(Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{AppID}")]
        public async Task<IActionResult> GetAuthorizedAppDetails(long AppID, short? Status)
        {
            ListAuthAppRes Response = new ListAuthAppRes();
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
                    Response = _controlPanelServices.GetAuthorizedAppDetail(AppID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region TranTypeWiseReport

        [HttpGet("{Type}")]
        public async Task<IActionResult> GetBlockedTrnTypeWiseWalletDetails(enWalletTrnType Type, int? PageNo, int? PageSize)
        {
            ListBlockTrnTypewiseReport Response = new ListBlockTrnTypewiseReport();
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
                    Response = _controlPanelServices.GetBlockedTrnTypeWiseWalletDetail(Type, PageNo, PageSize);
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

        #region Wallet Authorized User Methods

        [HttpGet]
        public async Task<IActionResult> GetWalletAuthUserCount(short? Status, long? OrgID, long? UserID, long? RoleID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetWalletAuthUserCount(Status, OrgID, UserID, RoleID);
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
        public async Task<IActionResult> GetWalletAuthUserCountStatusWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWAUCntStatusWise();
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
        public async Task<IActionResult> GetWalletAuthUserCountOrgWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetWAUCntOrgWise();
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
        public async Task<IActionResult> GetWalletAuthUserCountRoleWise()
        {
            RolewiseUserCount Response = new RolewiseUserCount();
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
                    Response = _controlPanelServices.GetWAUCntRoleWise();
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

        #region Log Listing Methods

        [HttpGet]
        public async Task<IActionResult> GetUserActivityLog(long? UserID, DateTime? FromDate, DateTime? ToDate)
        {
            ListUserActivityLoging Response = new ListUserActivityLoging();
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
                    Response = _controlPanelServices.GetUserActivities(UserID, FromDate, ToDate);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region User Role Methods

        [HttpGet]
        public async Task<IActionResult> GetUserRoleCount(short? Status)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetUserRoleCount(Status);
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
        public async Task<IActionResult> ListRoleDetails(short? Status)
        {
            RoleList Response = new RoleList();
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
                    Response = _controlPanelServices.ListRoleDetail(Status);
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

        #region Currency Method

        [HttpGet]
        public async Task<IActionResult> GetCurrencyCount(short? Status)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetCurrencyCount(Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListCurrencyDetails(short? Status)
        {
            CurrencyList Response = new CurrencyList();
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
                    Response = _controlPanelServices.ListCurrencyDetail(Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddCurrencyType([FromBody] CurrencyMasterReq Request)
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
                    Response = await _controlPanelServices.AddNewCurrencyType(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Wallet Type Methods

        [HttpPost]
        public async Task<IActionResult> AddWalletTypeDetail([FromBody] WalletTypeMasterReq Request)
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
                    Response = await _controlPanelServices.AddWalletTypeDetails(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetWalletTypeCount(short? Status, long? CurrencyTypeID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetWalletTypeCount(Status, CurrencyTypeID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{CurrencyTypeID}")]
        public async Task<IActionResult> GetWalletTypeDetails(long CurrencyTypeID)
        {
            WalletTypeMasterResp Response = new WalletTypeMasterResp();
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
                    Response = _controlPanelServices.GetWalletTypeDetail(CurrencyTypeID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListWalletTypeDetails(short? Status, long? CurrencyTypeID)
        {
            WalletTypeList Response = new WalletTypeList();
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
                    Response = _controlPanelServices.ListWalletTypeDetail(Status, CurrencyTypeID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region ChargeTypeMaster Methods

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargeTypeCount(short? Status, long? ChargeTypeID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetChargeTypeCount(Status, ChargeTypeID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> ListChargeTypeDetail(short? Status, long? ChargeTypeID)
        {
            ChargeTypeList Response = new ChargeTypeList();
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
                    Response = _controlPanelServices.ListChargeTypeDetail(Status, ChargeTypeID);
                }

                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-14
        [HttpPost]
        public async Task<IActionResult> InsertUpdateChargeType([FromBody]ChargeTypeReq Req)
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
                    Response = _controlPanelServices.InsertUpdateChargeType(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-14
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeChargeTypeStatus(long Id, ServiceStatus Status)
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
                    Response = _controlPanelServices.ChangeChargeTypeStatus(Id, Convert.ToInt16(Status), user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region CommissionTypeMaster Methods

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommisssionTypeCount(short? Status, long? TypeID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetCommissionTypeCount(Status, TypeID);
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> ListCommisssionTypeDetail(short? Status, long? TypeID)
        {
            CommisssionTypeList Response = new CommisssionTypeList();
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
                    Response = _controlPanelServices.ListCommissionTypeDetail(Status, TypeID);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-13
        [HttpPost]
        public async Task<IActionResult> InsertUpdateCommisssionType([FromBody]CommisssionTypeReq Req)
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
                    Response = _controlPanelServices.InsertUpdateCommisssionType(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-13
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeCommisssionTypeReqStatus(long Id, ServiceStatus Status)
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
                    Response = _controlPanelServices.ChangeCommisssionTypeReqStatus(Id, Convert.ToInt16(Status), user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region Charge Policy Methods 

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargePolicyRecCount(long? WalletTypeID, short? Status, long? WalletTrnTypeID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetChargePolicyRecCount(WalletTypeID, Status, WalletTrnTypeID);
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargePolicyCountWalletTypeWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetChargePolicyWalletTypeWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargePolicyCountStatusWise()
        {
            StatusWiseRes Response = new StatusWiseRes();
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
                    Response = _controlPanelServices.GetChargePolicyStatusWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargePolicyCountWalletTrnTypeWise()
        {
            WalletTrnTypeWiseRes Response = new WalletTrnTypeWiseRes();
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
                    Response = _controlPanelServices.GetChargePolicyWalletTrnTypeWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetChargePolicyDetail(short? Status, long? WalletType, long? WalletTrnType)
        {
            ListChargePolicy Response = new ListChargePolicy();
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
                    Response = _controlPanelServices.GetChargePolicyList(Status, WalletType, WalletTrnType);
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

        //vsolanki 27-11-2018
        [HttpGet]
        public async Task<IActionResult> ListChargePolicyLastFive()
        {
            ListChargePolicy Response = new ListChargePolicy();
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
                    Response = _controlPanelServices.ListChargePolicyLast5();
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

        //vsolnki 28-11-2018
        [HttpPost]
        public async Task<IActionResult> InsertChargePolicy([FromBody]ChargePolicyReq Req)
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
                    Response = _controlPanelServices.InsertChargePolicy(Req);
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

        //vsolnki 28-11-2018
        [HttpPost]
        public async Task<IActionResult> UpdateChargePolicy(long Id, [FromBody]UpdateChargePolicyReq Req)
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
                    Response = _controlPanelServices.UpdateChargePolicy(Id, Req);
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

        #region Commission Policy Methods 

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommissionPolicyRecCount(long? WalletTypeID, short? Status, long? WalletTrnTypeID)
        {
            CountRes Response = new CountRes();
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
                    Response = _controlPanelServices.GetCommissionPolicyRecCount(WalletTypeID, Status, WalletTrnTypeID);
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommissionPolicyCountWalletTypeWise()
        {
            WalletTypeWiseRes Response = new WalletTypeWiseRes();
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
                    Response = _controlPanelServices.GetCommissionPolicyWalletTypeWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommissionPolicyCountStatusWise()
        {
            StatusWiseRes Response = new StatusWiseRes();
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
                    Response = _controlPanelServices.GetCommissionPolicyStatusWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommissionPolicyCountWalletTrnTypeWise()
        {
            WalletTrnTypeWiseRes Response = new WalletTrnTypeWiseRes();
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
                    Response = _controlPanelServices.GetCommissionPolicyWalletTrnTypeWiseCount();
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

        //vsolanki 24-11-2018
        [HttpGet]
        public async Task<IActionResult> GetCommissionPolicyDetail(short? Status, long? WalletType, long? WalletTrnType)
        {
            ListCommissionPolicy Response = new ListCommissionPolicy();
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
                    Response = _controlPanelServices.GetCommissionPolicyList(Status, WalletType, WalletTrnType);
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

        //vsolanki 27-11-2018
        [HttpGet]
        public async Task<IActionResult> ListCommissionPolicyLastFive()
        {
            ListCommissionPolicy Response = new ListCommissionPolicy();
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
                    Response = _controlPanelServices.ListCommissionPolicy();
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

        //Rushabh 28/11/2018
        [HttpPost]
        public async Task<IActionResult> AddCommissionPolicy([FromBody] CommPolicyReq Request)
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
                    Response = _controlPanelServices.AddCommPolicy(Request, user.Id);

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

        [HttpPost("{CommPolicyID}")]
        public async Task<IActionResult> UpdateCommissionPolicyDetail(long CommPolicyID, [FromBody] UpdateCommPolicyReq Request)
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
                    Response = _controlPanelServices.UpdateCommPolicyDetail(CommPolicyID, Request, user.Id);
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

        #region Graph API

        //vsolanki 2018-11-27
        [HttpGet]
        public async Task<IActionResult> GetMonthwiseUserCount()
        {
            ListWalletGraphRes Response = new ListWalletGraphRes();
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
                    Response = _controlPanelServices.GraphForUserCount();
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
        public async Task<IActionResult> GetMonthwiseOrgCount()
        {
            ListWalletGraphRes Response = new ListWalletGraphRes();
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
                    Response = _controlPanelServices.GraphForOrgCount();
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
        public async Task<IActionResult> GetTranCountTypewise()
        {
            ListTransactionTypewiseCount Response = new ListTransactionTypewiseCount();
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
                    Response = _controlPanelServices.GraphForTrnTypewiseCount();
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

        #region Wallet Usage Policy

        //Rushabh 19-12-2018
        [HttpGet]
        public async Task<IActionResult> ListUsagePolicy(long? WalletTypeID, short? Status)
        {
            ListWalletusagePolicy2 Response = new ListWalletusagePolicy2();
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
                    Response = _controlPanelServices.ListUsagePolicy(WalletTypeID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        //vsolanki 2018-11-27
        [HttpGet]
        public async Task<IActionResult> ListUsagePolicyLastFive()
        {
            ListWalletusagePolicy Response = new ListWalletusagePolicy();
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
                    Response = _controlPanelServices.ListUsagePolicyLast5();
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

        //2018-12-14
        [HttpPost]
        public async Task<IActionResult> InsertUpdateWalletUsagePolicy([FromBody]AddWalletUsagePolicyReq Req)
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
                    Response = _controlPanelServices.InsertUpdateWalletUsagePolicy(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-14
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeWalletUsagePolicyStatus(long Id, ServiceStatus Status)
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
                    Response = _controlPanelServices.ChangeWalletUsagePolicyStatus(Id, Convert.ToInt16(Status), user.Id);
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

        #region WTrnTypeMaster
        //vsoalnki 2018-11-28
        [HttpPost("{TrnTypeId}/{Status}")]
        public async Task<IActionResult> UpdateWTrnTypeStatus(long TrnTypeId, ServiceStatus Status)
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
                    Response = _controlPanelServices.UpdateWTrnTypeStatus(TrnTypeId, Convert.ToInt16(Status));
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

        //vsolanki 2018-11-28
        [HttpGet]
        public async Task<IActionResult> ListWalletTrnType()
        {
            ListTypeRes Response = new ListTypeRes();
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
                    Response = _controlPanelServices.ListWalletTrnType();
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

        #region BlockWalletTrnTypeMaster
        //vsoalnki 2018-11-28
        [HttpPost]
        public async Task<IActionResult> InsertBlockWalletTrnType([FromBody]BlockWalletTrnTypeReq Req)
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
                    Response = _controlPanelServices.InsertBlockWalletTrnType(Req);
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

        //vsolanki 2018-11-28
        [HttpGet("{WalletType}")]
        public async Task<IActionResult> GetBlockWTypewiseTrnTypeList(long WalletType)
        {
            ListTypeRes Response = new ListTypeRes();
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
                    Response = _controlPanelServices.GetBlockWTypewiseTrnTypeList(WalletType);
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

        #region Wallet Type

        //vsolanki 2018-11-28
        [HttpGet]
        public async Task<IActionResult> ListWalletType()
        {
            ListTypeRes Response = new ListTypeRes();
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
                    Response = _controlPanelServices.ListWalletType();
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

        #region AllowedChannel Methods

        [HttpGet("{ChannelID}")]
        public async Task<IActionResult> GetAllowedChannelDetail(long ChannelID, short? Status)
        {
            ListChannels Response = new ListChannels();
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
                    Response = _controlPanelServices.GetChannels(ChannelID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddAllowedChannel([FromBody] AllowedChannelReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = await _controlPanelServices.AddAllowedChannels(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListChannelDetail()
        {
            ListChannels Response = new ListChannels();
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
                    Response = _controlPanelServices.ListChannels();
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListChannelwiseTransactionCount()
        {
            ListChannelwiseTrnCount Response = new ListChannelwiseTrnCount();
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
                    Response = _controlPanelServices.ListChannelwiseTrnCnt();
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

        #region other

        [HttpGet]
        public async Task<IActionResult> GetOrgAllDetail()
        {
            ListOrgDetail Response = new ListOrgDetail();
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
                    Response = await _controlPanelServices.GetOrgAllDetail();
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
        public async Task<ActionResult<ListTypeWiseDetail>> GetDetailTypeWise()
        {
            ListTypeWiseDetail Response = new ListTypeWiseDetail();
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
                    Response = await _controlPanelServices.GetDetailTypeWise();
                }
                //  var respObj = JsonConvert.SerializeObject(Response);
                // dynamic respObjJson = JObject.Parse(respObj);
                //HelperForLog.WriteLogIntoFile( this.ControllerContext.RouteData.Values["action"].ToString(), this.GetType().Name, "get res", null);
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpGet]
        //public async Task<ActionResult<ListTypeWiseDetail>> GetDetailTypeWiseV1()
        //{
        //    ListTypeWiseDetail Response = new ListTypeWiseDetail();
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
        //            Response =  _controlPanelServices.GetDetailTypeWiseV1();
        //        }
        //        HelperForLog.WriteLogIntoFile(this.ControllerContext.RouteData.Values["action"].ToString(), this.GetType().Name, "get res", null);
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}
        #endregion

        #region Transaction method test
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<GetTradeHistoryResponse>> GetTradeHistory()
        {
            try
            {
                GetTradeHistoryResponse Response = new GetTradeHistoryResponse();
                var User = await _userManager.GetUserAsync(HttpContext.User);
                Response.response = _controlPanelServices.GetTradeHistory(User.Id);
                return Response;
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region TransactionPolicy
        //2018-12-12
        [HttpGet]
        public async Task<IActionResult> ListTransactionPolicy()
        {
            ListTransactionPolicyRes Response = new ListTransactionPolicyRes();
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
                    Response = _controlPanelServices.ListTransactionPolicy();
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-12
        [HttpPost]
        public async Task<IActionResult> InsertTransactionPolicy([FromBody]AddTransactionPolicyReq Req)
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
                    Response = _controlPanelServices.InsertTransactionPolicy(Req, user.Id);
                }
                //var respObj = JsonConvert.SerializeObject(Response);
                //dynamic respObjJson = JObject.Parse(respObj);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-12
        [HttpPost("{TrnPolicyId}")]
        public async Task<IActionResult> UpdateTransactionPolicy([FromBody]UpdateTransactionPolicyReq Req, long TrnPolicyId)
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
                    Response = _controlPanelServices.UpdateTransactionPolicy(Req, user.Id, TrnPolicyId);
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

        //2018-12-12
        [HttpPost("{TrnPolicyId}/{Status}")]
        public async Task<IActionResult> ChangeTransactionPolicyStatus(long TrnPolicyId, ServiceStatus Status)
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
                    Response = _controlPanelServices.UpdateTransactionPolicyStatus(Convert.ToInt16(Status), user.Id, TrnPolicyId);
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

        #region UserWalletAllowTrnType

        //2018-12-13
        [HttpGet]
        public async Task<IActionResult> ListUserWalletBlockTrnType(string WalletId, long? TrnTypeId)
        {
            ListUserWalletBlockTrnType Response = new ListUserWalletBlockTrnType();
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
                    Response = _controlPanelServices.ListUserWalletBlockTrnType(WalletId, TrnTypeId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-13
        [HttpPost]
        public async Task<IActionResult> InsertUpdateUserWalletBlockTrnType([FromBody]InsertUpdateUserWalletBlockTrnTypeReq Req)
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
                    Response = _controlPanelServices.InsertUpdateUserWalletBlockTrnType(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-13
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeUserWalletBlockTrnTypeStatus(long Id, ServiceStatus Status)
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
                    Response = _controlPanelServices.ChangeUserWalletBlockTrnTypeStatus(Id, Convert.ToInt16(Status), user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region WalletAuthorizeUserMaster
        //2018-12-13
        [HttpGet("{AccWalletId}")]
        public async Task<IActionResult> ListWalletAuthorizeUser(string AccWalletId)
        {
            ListWalletAuthorizeUserRes Response = new ListWalletAuthorizeUserRes();
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
                    Response = _controlPanelServices.ListWalletAuthorizeUser(AccWalletId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region AllowTrnTypeRoleWise

        //2018-12-22
        [HttpGet]
        public async Task<IActionResult> ListAllowTrnTypeRoleWise(long? RoleId, long? TrnTypeId, short? Status)
        {
            ListAllowTrnTypeRoleWise Response = new ListAllowTrnTypeRoleWise();
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
                    Response = await _controlPanelServices.ListAllowTrnTypeRoleWise(RoleId, TrnTypeId, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-12
        [HttpPost]
        public async Task<IActionResult> InserUpdateAllowTrnTypeRole([FromBody]InserUpdateAllowTrnTypeRoleReq Req)
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
                    Response = await _controlPanelServices.InserUpdateAllowTrnTypeRole(Req, user.Id);
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

        //2018-12-12
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeAllowTrnTypeRoleStatus(long Id, ServiceStatus Status)
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
                    Response = await _controlPanelServices.ChangeAllowTrnTypeRoleStatus(Convert.ToInt16(Status), user.Id, Id);
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

        #region Staking Configuration

        [HttpPost]
        public async Task<IActionResult> AddStakingPolicy([FromBody] StakingPolicyReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = await _controlPanelServices.AddStakingPolicy(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{PolicyDetailId}")]
        public async Task<IActionResult> UpdateStakingPolicyDetail(long PolicyDetailId, [FromBody] UpdateStakingDetailReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = await _controlPanelServices.UpdateStakingPolicy(PolicyDetailId, Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{PolicyDetailId}/{Status}")]
        public async Task<IActionResult> ChangeStakingPolicyDetailStatus(long PolicyDetailId, ServiceStatus Status)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
                ApplicationUser User = new ApplicationUser(); User.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (User == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _controlPanelServices.ChangeStakingPolicyStatus(PolicyDetailId, Status, User.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{StackingPolicyMasterId}")]
        public async Task<IActionResult> ListStackingPolicyDetail(long StackingPolicyMasterId, EnStakingType? StakingType, EnStakingSlabType? SlabType, short? Status)
        {
            ListStakingPolicyDetailRes2 Response = new ListStakingPolicyDetailRes2();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                }
                else
                {
                    Response = await _controlPanelServices.ListStakingPolicy(StackingPolicyMasterId, StakingType, SlabType, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PolicyDetailID}")]
        public async Task<IActionResult> GetStackingPolicyDetail(long PolicyDetailID, short? Status)
        {
            ListStakingPolicyDetailRes Response = new ListStakingPolicyDetailRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                }
                else
                {
                    Response = await _controlPanelServices.GetStakingPolicy(PolicyDetailID, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //Removed By Rushabh On 28-01-2019 As Vishvata Created Another Method For That

        //[HttpPost("{PolicyMasterId}/{Status}")]
        //public async Task<IActionResult> ChangeStakingMasterStatus(long PolicyMasterId, ServiceStatus Status)
        //{
        //    try
        //    {
        //        BizResponseClass Response = new BizResponseClass();
        //        ApplicationUser User = new ApplicationUser(); User.Id = 1;
        //        //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
        //        if (User == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //            Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        }
        //        else
        //        {
        //            Response = await _controlPanelServices.UpdateMasterPolicyStatus(PolicyMasterId, Status, User.Id);
        //        }
        //        return Ok(Response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
        //    }
        //}

        [HttpGet]
        public async Task<IActionResult> ListUnStackingRequest(long? Userid, short? Status, EnUnstakeType UnStakingType)
        {
            ListUnStakingHistory Response = new ListUnStakingHistory();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                }
                else
                {
                    Response = await _controlPanelServices.ListUnStakingHistory(Userid, Status, UnStakingType);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{AdminReqID}/{Bit}")]
        public async Task<IActionResult> AcceptRejectUnstakingRequest(long AdminReqID, ServiceStatus Bit, UserUnstakingReq Request)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                }
                else
                {
                    Response = await _controlPanelServices.AdminUnstakeRequest(AdminReqID, Bit, user.Id, Request);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region StopLossMaster

        //2018-12-28
        [HttpGet]
        public async Task<IActionResult> ListStopLoss(long? WalletTypeId, short? Status)
        {
            ListStopLossRes Response = new ListStopLossRes();
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
                    Response = await _controlPanelServices.ListStopLoss(WalletTypeId, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-28
        [HttpPost]
        public async Task<IActionResult> InserUpdateStopLoss([FromBody]InserUpdateStopLossReq Req)
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
                    Response = await _controlPanelServices.InserUpdateStopLoss(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-28
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeStopLossStatus(long Id, ServiceStatus Status)
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
                    Response = await _controlPanelServices.ChangeStopLossStatus(Convert.ToInt16(Status), user.Id, Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        //2019-02-23 move to margin control panel
        #region LeverageMaster

        //2018-12-28
        [HttpGet]
        public async Task<IActionResult> ListLeverage(long? WalletTypeId, short? Status)
        {
            ListLeverageRes Response = new ListLeverageRes();
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
                    Response = await _controlPanelServices.ListLeverage(WalletTypeId, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-28
        [HttpPost]
        public async Task<IActionResult> InserUpdateLeverage([FromBody]InserUpdateLeverageReq Req)
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
                    Response = await _controlPanelServices.InserUpdateLeverage(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-28
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeLeverageStatus(long Id, ServiceStatus Status)
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
                    Response = await _controlPanelServices.ChangeLeverageStatus(Convert.ToInt16(Status), user.Id, Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Import-Export Address

        [HttpPost]
        public async Task<IActionResult> ImportAddress()
        {
            //BizResponseClass Response = new ListImpExpAddressRes();
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var httpRequest = Request.Form;
                if (httpRequest.Files.Count == 0)
                {
                    return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FileNotFound, ErrorCode = enErrorCode.FileRequiredToImport });
                }
                var file = httpRequest.Files[0];
                string data = System.IO.Path.GetExtension(file.FileName);
                data = data.ToUpper();
                data = data.Substring(1);

                ApplicationUser user = new ApplicationUser(); user.Id = 1;
                //ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    //new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                    return Ok(Response);
                }
                else
                {
                    var postedFile = httpRequest.Files[file.Name];
                    string folderDirctory = user.Id.ToString();
                    string webRootPath = _configuration["ImportedFilePath"].ToString();
                    string newPath = webRootPath + folderDirctory;
                    if (!Directory.Exists(newPath))
                    {
                        Directory.CreateDirectory(newPath);
                    }
                    string Extension = System.IO.Path.GetExtension(file.FileName);
                    string fileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition).FileName.Trim('"');
                    fileName = fileName.Replace(fileName, "ImportAddress_" + Helpers.UTC_To_IST().ToString("yyyyMMddHHmmssfff") + Extension);

                    string fullPath = newPath + "/" + fileName;
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await postedFile.CopyToAsync(stream);
                    }
                    Response = await _controlPanelServices.ImportAddressDetails(newPath, fullPath);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetExportAddressDetails(long? ServiceProviderID, long? UserID, long? WalletTypeID)
        {
            //ListImpExpAddressRes Response = new ListImpExpAddressRes();
            BizResponseClass Response = new BizResponseClass();
            try
            {
                //ApplicationUser user = new ApplicationUser(); user.Id = 71;
                ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    //new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _controlPanelServices.ExportAddressDetails(ServiceProviderID, UserID, WalletTypeID, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> ListAddressDetails(long? ServiceProviderID, long? UserID, long? WalletTypeID, string Address, int PageNo, int PageSize)
        {
            //ListImpExpAddressRes Response = new ListImpExpAddressRes();
            ListAddressRes Response = new ListAddressRes();
            try
            {
                ApplicationUser user = new ApplicationUser(); user.Id = 71;
                // ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.StandardLoginfailed, ErrorCode = enErrorCode.StandardLoginfailed };
                }
                else
                {
                    Response = _controlPanelServices.ListAddressDetails(ServiceProviderID, UserID, WalletTypeID, Address, PageNo, PageSize);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmAddExport(string emailConfirmCode)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                if (!string.IsNullOrEmpty(emailConfirmCode))
                {
                    byte[] DecpasswordBytes = _encdecAEC.GetPasswordBytes(_configuration["AESSalt"].ToString());
                    var bytes = Convert.FromBase64String(emailConfirmCode);
                    var encodedString = Encoding.UTF8.GetString(bytes);
                    string DecryptToken = EncyptedDecrypted.Decrypt(encodedString, DecpasswordBytes);
                    ExpAddress_EmailLinkTokenViewModel dmodel = JsonConvert.DeserializeObject<ExpAddress_EmailLinkTokenViewModel>(DecryptToken);
                    dmodel.Expirytime = dmodel.Expirytime.AddDays(10);
                    if (dmodel?.Expirytime >= DateTime.UtcNow)   /// Check the link expiration time 
                    {
                        if (dmodel.Id == 0)
                        {
                            //return null;
                            //throw new Exception(String.Format("Validation Fail ", dmodel.Id));
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ReturnMsg = "Invalid Link";
                            Response.ErrorCode = enErrorCode.InvalidConfirmationId;
                            return BadRequest(Response);
                        }
                        else
                        {
                            var user = await _userManager.FindByEmailAsync(dmodel.Email);
                            if (dmodel.DownloadLink == null || dmodel.DownloadLink == string.Empty)
                            {
                                Response.ReturnCode = enResponseCode.Fail;
                                Response.ReturnMsg = "Invalid Link";
                                Response.ErrorCode = enErrorCode.DownloadFilePathNotFound;
                                return BadRequest(Response);
                            }
                            if (user == null)
                            {
                                Response.ReturnCode = enResponseCode.Fail;
                                Response.ReturnMsg = "Invalid Link";
                                Response.ErrorCode = enErrorCode.UserDetailNotFound;
                                return BadRequest(Response);
                            }
                            else
                            {
                                if (System.IO.File.Exists(dmodel.DownloadLink))
                                {
                                    ////throw new HttpResponseException(HttpStatusCode.NotFound);
                                    //Resp.StatusCode = HttpStatusCode.BadRequest;
                                    //return Resp;
                                    var content = new FileStream(dmodel.DownloadLink, FileMode.Open, FileAccess.Read, FileShare.Read);
                                    var response = File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");//FileStreamResult //"application/octet-stream"
                                    return response;
                                }
                                Response.ReturnCode = enResponseCode.Fail;
                                Response.ReturnMsg = "Invalid Link";
                                Response.ErrorCode = enErrorCode.DownloadFileNotFound;
                                return BadRequest(Response);
                                #region Old Code
                                ////Copy the source file stream to MemoryStream and close the file stream
                                //MemoryStream responseStream = new MemoryStream();
                                //Stream fileStream = System.IO.File.Open(dmodel.DownloadLink, FileMode.Open);
                                //fileStream.CopyTo(responseStream);                                    
                                //responseStream.Position = 0;

                                //Resp.StatusCode = HttpStatusCode.OK;
                                //fileStream.Close();
                                ////Write the memory stream to HttpResponseMessage content
                                //Resp.Content = new StreamContent(responseStream);
                                //string contentDisposition = string.Concat("attachment; filename=", "ExportedAddress.xlsx");
                                //Resp.Content.Headers.ContentDisposition = ContentDispositionHeaderValue.Parse(contentDisposition);
                                //Resp.StatusCode = HttpStatusCode.Accepted;

                                #endregion
                            }
                        }
                    }
                    else
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = "Link Expired";
                        Response.ErrorCode = enErrorCode.LinkExpired;
                        return BadRequest(Response);
                    }
                }
                Response.ReturnCode = enResponseCode.Fail;
                Response.ReturnMsg = "Confirmation Code Required";
                Response.ErrorCode = enErrorCode.emailConfirmCodeRequired;
                return BadRequest(Response);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ConfirmAddExport", "WalletControlPanelController", ex);
                throw;
            }
        }


        //[HttpGet]
        //public HttpResponseMessage GetbookFor(string downloadFilePath)
        //{
        //    HttpResponseMessage response = new HttpResponseMessage();
        //    try
        //    {                
        //        //Check if the file exists. If the file doesn't exist, throw a file not found exception
        //        if (!System.IO.File.Exists(downloadFilePath))
        //        {
        //            //throw new HttpResponseException(HttpStatusCode.NotFound);
        //            return response;
        //        }

        //        //Copy the source file stream to MemoryStream and close the file stream
        //        MemoryStream responseStream = new MemoryStream();
        //        Stream fileStream = System.IO.File.Open(downloadFilePath, FileMode.Open);

        //        fileStream.CopyTo(responseStream);
        //        fileStream.Close();
        //        responseStream.Position = 0;


        //        response.StatusCode = HttpStatusCode.OK;

        //        //Write the memory stream to HttpResponseMessage content
        //        response.Content = new StreamContent(responseStream);
        //        string contentDisposition = string.Concat("attachment; filename=", "Exported Address");
        //        response.Content.Headers.ContentDisposition =
        //                      ContentDispositionHeaderValue.Parse(contentDisposition);
        //        return response;
        //    }
        //    catch(Exception ex)
        //    {
        //        //throw new HttpResponseException(HttpStatusCode.InternalServerError);
        //        return response;
        //    }
        //}

        #endregion

        #region Export Wallet

        [HttpPost("{FileName}/{Coin}")]
        public async Task<IActionResult> ExportWallet(string FileName, string Coin)
        {
            try
            {
                var Response = await _controlPanelServices.ExportWallet(FileName, Coin);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region StakingPolicyMaster

        // 15-1-2019
        [HttpGet]
        public async Task<IActionResult> ListStakingPolicyMaster(long? WalletTypeID, short? Status, EnStakingSlabType? SlabType, EnStakingType? StakingType)
        {
            ListStakingPolicyRes Response = new ListStakingPolicyRes();
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
                    Response = _controlPanelServices.ListStakingPolicyMaster(WalletTypeID, Status, (SlabType == null ? Convert.ToInt16(0) : Convert.ToInt16(SlabType)), (StakingType == null ? Convert.ToInt16(0) : Convert.ToInt16(StakingType)));
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        // 15-1-2019
        [HttpPost]
        public async Task<IActionResult> InsertUpdateStakingPolicy([FromBody]InsertUpdateStakingPolicyReq Req)
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
                    Response = _controlPanelServices.InsertUpdateStakingPolicy(Req, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        // 15-1-2019
        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeStakingPolicyStatus(long Id, ServiceStatus Status)
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
                    Response = _controlPanelServices.ChangeStakingPolicyStatus(Id, Convert.ToInt16(Status), user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Charge
        [HttpGet]
        public async Task<IActionResult> ListChargesTypeWise(string WalletTypeName, long? TrnTypeId)
        {
            try
            {
                ListChargesTypeWise Response = new ListChargesTypeWise();
                Response = _controlPanelServices.ListChargesTypeWise(WalletTypeName, TrnTypeId);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> TrnChargeLogReport(int PageNo, int PageSize, short? Status, long? TrnTypeID, long? WalleTypeId, short? SlabType, DateTime? FromDate, DateTime? ToDate, long? TrnNo)
        {
            try
            {
                ListTrnChargeLogRes Response = new ListTrnChargeLogRes();
                Response = _controlPanelServices.TrnChargeLogReport(PageNo, PageSize, Status, TrnTypeID, WalleTypeId, SlabType, FromDate, ToDate, TrnNo);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region DepositCounterMaster

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> GetDepositCounter(long? WalletTypeID, long? SerProId, int PageNo, int PageSize)
        {
            try
            {
                ListDepositeCounterRes Response = new ListDepositeCounterRes();
                Response = _controlPanelServices.GetDepositCounter(WalletTypeID, SerProId, PageNo, PageSize);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> InsertUpdateDepositCounter([FromBody]InsertUpdateDepositCounterReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
                Response = _controlPanelServices.InsertUpdateDepositCounter(Request);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{Id}/{Status}")]
        public async Task<IActionResult> ChangeDepositCounterStatus(long Id, ServiceStatus Status)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
                Response = _controlPanelServices.ChangeDepositCounterStatus(Id, Convert.ToInt16(Status));
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region Admin Assets

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> AdminAssets(long? WalletTypeId, EnWalletUsageType? WalletUsageType, int PageNo, int PageSize)
        {
            try
            {
                long userid = 1;
                ListAdminAssetsres Response = new ListAdminAssetsres();
                Response = _controlPanelServices.AdminAssets(WalletTypeId, WalletUsageType, userid, PageNo, PageSize);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Organization Ledger

        [HttpGet]
        public async Task<IActionResult> ListOrganizationWallet(long? WalletTypeId, EnWalletUsageType? WalletUsageType)
        {
            try
            {
                ListOrgLedger Response = new ListOrgLedger();
                Response = _controlPanelServices.OrganizationLedger(WalletTypeId, WalletUsageType);
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region ChargeConfigurationMaster

        [HttpPost]
        public async Task<IActionResult> AddChargeConfiguration([FromBody]ChargeConfigurationMasterReq Request)
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
                    Response = await _controlPanelServices.AddNewChargeConfiguration(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{MasterId}")]
        public async Task<IActionResult> UpdateChargeConfiguration(long MasterId, [FromBody]ChargeConfigurationMasterReq2 Request)
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
                    Response = await _controlPanelServices.UpdateChargeConfiguration(MasterId, Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{MasterId}")]
        public async Task<IActionResult> GetChargeConfiguration(long MasterId)
        {
            ChargeConfigurationMasterRes2 Response = new ChargeConfigurationMasterRes2();
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
                    Response = await _controlPanelServices.GetChargeConfiguration(MasterId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListChargeConfiguration(long? WalletTypeId, long? TrnType, short? SlabType, short? Status)
        {
            ListChargeConfigurationMasterRes Response = new ListChargeConfigurationMasterRes();
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
                    Response = await _controlPanelServices.ListChargeConfiguration(WalletTypeId, TrnType, SlabType, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region ChargeConfigurationDetail

        [HttpPost]
        public async Task<IActionResult> AddChargeConfigurationDeatil([FromBody]ChargeConfigurationDetailReq Request)
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
                    Response = await _controlPanelServices.AddNewChargeConfigurationDetail(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost("{DetailId}")]
        public async Task<IActionResult> UpdateChargeConfigurationDetail(long DetailId, [FromBody]ChargeConfigurationDetailReq Request)
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
                    Response = await _controlPanelServices.UpdateChargeConfigurationDetail(DetailId, Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{DetailId}")]
        public async Task<IActionResult> GetChargeConfigurationDetail(long DetailId)
        {
            ChargeConfigurationDetailRes2 Response = new ChargeConfigurationDetailRes2();
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
                    Response = await _controlPanelServices.GetChargeConfigurationDetail(DetailId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListChargeConfigurationDetail(long? MasterId, long? ChargeType, short? ChargeValueType, short? ChargeDistributionBasedOn, short? Status)
        {
            ListChargeConfigurationDetailRes Response = new ListChargeConfigurationDetailRes();
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
                    Response = await _controlPanelServices.ListChargeConfigurationDetail(MasterId, ChargeType, ChargeValueType, ChargeDistributionBasedOn, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region WalletTrnLimitConfiguration

        [HttpPost]
        public async Task<IActionResult> AddMasterLimitConfiguration([FromBody]WalletTrnLimitConfigurationInsReq Request)
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
                    Response = await _controlPanelServices.AddMasterLimitConfiguration(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateMasterLimitConfiguration([FromBody]WalletTrnLimitConfigurationUpdReq Request)
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
                    Response = await _controlPanelServices.UpdateMasterLimitConfiguration(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeMasterLimitConfigStatus([FromBody]ChangeServiceStatus Request)
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
                    Response = await _controlPanelServices.ChangeMasterLimitConfigStatus(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListMasterLimitConfiguration(long? WalletTypeId, long? TrnType, EnIsKYCEnable? IsKYCEnable, short? Status)
        {
            ListWalletTrnLimitConfigResp Response = new ListWalletTrnLimitConfigResp();
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
                    Response = await _controlPanelServices.ListMasterLimitConfiguration(WalletTypeId, TrnType, IsKYCEnable, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetMasterLimitConfiguration(long Id)
        {
            GetWalletTrnLimitConfigResp Response = new GetWalletTrnLimitConfigResp();
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
                    Response = await _controlPanelServices.GetMasterLimitConfiguration(Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        //2019-02-23 move to margin control panel
        #region Leaverage Report 

        [HttpGet("{PageNo}/{PageSize}")]
        public async Task<IActionResult> LeveragePendingReport(long? WalletTypeId, long? UserId, DateTime? FromDate, DateTime? ToDate, int PageNo, int PageSize)
        {
            try
            {
                ListLeaverageReportRes Response = new ListLeaverageReportRes();
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
                    Response = _controlPanelServices.LeveragePendingReport(WalletTypeId, UserId, FromDate, ToDate, PageNo, PageSize);
                }
                return Ok(Response);

            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{FromDate}/{ToDate}/{PageNo}/{PageSize}")]
        public async Task<IActionResult> LeverageReport(long? WalletTypeId, long? UserId, DateTime FromDate, DateTime ToDate, int PageNo, int PageSize, short? Status)
        {
            try
            {
                ListLeaverageRes Response = new ListLeaverageRes();
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
                    Response = _controlPanelServices.LeverageReport(WalletTypeId, UserId, FromDate, ToDate, PageNo, PageSize, Status);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Deposition Recon

        [HttpGet("{PageNo}")]
        public async Task<IActionResult> DepositionReport(string Trnid, string Address, short? IsInternal, long? UserID, string CoinName, long? Provider, int PageNo, int? PageSize)
        {
            try
            {
                DepositionHistoryRes Response = new DepositionHistoryRes();
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
                    Response = await _controlPanelServices.DepositionReport(Trnid, Address, IsInternal, UserID, CoinName, Provider, PageNo, Convert.ToInt32(PageSize == null ? Helpers.PageSize : PageSize));
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DepositionReconProcess([FromBody]DepositionReconReq Request)
        {
            try
            {
                ListDepositionReconRes Response = new ListDepositionReconRes();
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
                    Response = await _controlPanelServices.DepositionReconProcess(Request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region TradingChargeTypeMaster

        [HttpGet]
        public async Task<IActionResult> ListTradingChargeType()
        {
            try
            {
                ListTradingChargeTypeRes Response = new ListTradingChargeTypeRes();
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
                    Response = _controlPanelServices.ListTradingChargeTypeMaster();
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpPost]
        public async Task<IActionResult> InsertTradingChargeType([FromBody]InsertTradingChargeTypeReq Request)
        {
            try
            {
                BizResponseClass Response = new BizResponseClass();
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
                    Response = _controlPanelServices.InsertTradingChargeType(Request);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion


        // Develop by Pratik 14-3-2019
        #region Deposition Interval 

        //[HttpPost("AddDepositionInterval")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddDepositionInterval(DepositionIntervalViewModel model)
        {
            try
            {
                ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

                var obj = new DepositionIntervalViewModel()
                {
                    DepositHistoryFetchListInterval = model.DepositHistoryFetchListInterval,
                    DepositStatusCheckInterval = model.DepositStatusCheckInterval,
                    Status=model.Status,
                };
                long id = _controlPanelServices.AddDepositionInterval(obj, user.Id);
                if (id != 0)
                {
                    return new OkObjectResult(
                    new DepositionIntervalResponse
                    {
                        ReturnCode = enResponseCode.Success,
                        ReturnMsg = EnResponseMessage.SuccessfullAddOrUpdateDepositionInterval
                    });
                }
                else
                {
                    return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailAddOrUpdateDepositionInterval, ErrorCode = enErrorCode.Status33001FailAddOrUpdateDepositionInterval });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        //[HttpPost("ListDepositionInterval")]
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> ListDepositionInterval()
        {
            try
            {
                var getData = await Task.FromResult(_controlPanelServices.ListDepositionInterval());
                if (getData != null)
                    return Ok(new ListDepositionIntervalResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.DepositionIntervalList, ListDepositionInterval = getData.ListDepositionInterval });
                else
                    return BadRequest(new ListDepositionIntervalResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailDepositionIntervalList, ErrorCode = enErrorCode.Status33002FailDepositionIntervalList });
            }
            catch (Exception ex)
            {
                return BadRequest(new ListDepositionIntervalResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        //[HttpPost("DisableDepositionInterval")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DisableDepositionInterval(DepositionIntervalStatusViewModel model)
        {
            try
            {
                ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                var obj = new DepositionIntervalStatusViewModel()
                {
                    Id = model.Id
                };
                bool id = _controlPanelServices.DisableDepositionInterval(obj, user.Id);
                if (id == true)
                {
                    return new OkObjectResult(
                    new DepositionIntervalResponse
                    {
                        ReturnCode = enResponseCode.Success,
                        ReturnMsg = EnResponseMessage.DisableDepositionIntervalStatus
                    });
                }
                else
                {
                    return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailDisableDepositionIntervalStatus, ErrorCode = enErrorCode.Status33003FailDisableDepositionIntervalStatus });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //[HttpPost("EnableDepositionInterval")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EnableDepositionInterval(DepositionIntervalStatusViewModel model)
        {
            try
            {
                ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                var obj = new DepositionIntervalStatusViewModel()
                {
                    Id = model.Id
                };
                bool id = _controlPanelServices.EnableDepositionInterval(obj, user.Id);
                if (id == true)
                {
                    return new OkObjectResult(
                    new DepositionIntervalResponse
                    {
                        ReturnCode = enResponseCode.Success,
                        ReturnMsg = EnResponseMessage.EnableDepositionIntervalStatus
                    });
                }
                else
                {
                    return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailEnableDepositionIntervalStatus, ErrorCode = enErrorCode.Status33004FailEnableDepositionIntervalStatus });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new DepositionIntervalResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion



        [HttpGet]
        [Authorize]
        public async Task<ActionResult> ListMultichainAddress(string chainName, int PageIndex, int PageSize)
        {
            try
            {
                var connection = _controlPanelServices.MultichainConnection(chainName);
                if (connection != null)
                {
                    _client = new Infrastructure.Data.MultiChainClient(connection.hostname, Convert.ToInt32(connection.port), connection.username, connection.password, connection.chainName);
                    if (_client != null)
                    {
                        var TotalCountAddress = await Task.FromResult(_client.MultichainLP.ListAddressesTotalCount().Result);
                        var getData = await Task.FromResult(_client.MultichainLP.ListAddresses(PageSize, PageIndex).Result);
                        List<string> listStringAddress = new List<string>();
                        foreach (object data in getData)
                        {
                            string myString = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                            var ms = new MemoryStream(Encoding.Unicode.GetBytes(myString));
                            DataContractJsonSerializer deserializer = new DataContractJsonSerializer(typeof(MultichainViewModel));
                            MultichainViewModel obj = (MultichainViewModel)deserializer.ReadObject(ms);
                            listStringAddress.Add(obj.address);
                        }

                        if (getData != null)
                            return Ok(new ListMultichainAddressViewModel { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.GetMultichainAddressList, listaddressitem = listStringAddress, TotalCount = TotalCountAddress.Count });
                        else
                            return BadRequest(new ListMultichainAddressViewModel { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailMultichainAddressList, ErrorCode = enErrorCode.Status33005FailMultichainAddressList });
                    }
                    else
                    {
                        return BadRequest(new ListMultichainAddressViewModel { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailMultichainConnectionNode, ErrorCode = enErrorCode.Status33007FailMultichainConnectionNode });
                    }
                }
                else
                {
                    return BadRequest(new ListMultichainAddressViewModel { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailMultichainConnection, ErrorCode = enErrorCode.Status33006FailMultichainConnection });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ListMultichainAddressViewModel { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.FailMultichainConnectionNode, ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

    }
}