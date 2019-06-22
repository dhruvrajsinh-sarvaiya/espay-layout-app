using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOpnAdvanced;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CleanArchitecture.Web.API
{
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class WalletOpnAdvancedController : Controller
    {
        #region Cotr
        private readonly IWalletService _walletService;
        private readonly IBasePage _basePage;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<WalletController> _logger;
        public WalletOpnAdvancedController(ILogger<WalletController> logger, IBasePage basePage, UserManager<ApplicationUser> userManager, IWalletService walletService)
        {
            _logger = logger;
            _basePage = basePage;
            _userManager = userManager;
            _walletService = walletService;
        }
        #endregion

        #region Method

        //2018-12-20
        [HttpGet]
        // [AllowAnonymous]//this method user for activity screen in bitgo
        public async Task<IActionResult> ListUserWalletRequest()
        {
            // ApplicationUser user = new ApplicationUser(); user.Id = 4;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListAddWalletRequest Response = new ListAddWalletRequest();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _walletService.ListAddUserWalletRequest(user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-20
        [HttpPost("{Status}/{RequestId}")]
        // [AllowAnonymous]
        public async Task<IActionResult> UpdateUserWalletPendingRequest(ServiceStatus Status, long RequestId)
        {
            // ApplicationUser user = new ApplicationUser(); user.Id =4;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            BizResponseClass Response = new BizResponseClass();
            if (Status == 0)
            {
                Response.ReturnCode = enResponseCode.Fail;
                Response.ReturnMsg = EnResponseMessage.InvalidStatus;
                Response.ErrorCode = enErrorCode.InvalidStatus;
                return Ok(Response);
            }
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _walletService.UpdateUserWalletPendingRequest(Convert.ToInt16(Status), RequestId, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-20
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> InsertUserWalletPendingRequest([FromBody]InsertWalletRequest request)
        {
            //ApplicationUser user = new ApplicationUser(); user.Id =35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            BizResponseClass Response = new BizResponseClass();
            //email validate

            Regex regex = new Regex(@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
            bool isValid = regex.IsMatch(request.Email.Trim());
            if (!isValid)
            {
                Response.ReturnCode = enResponseCode.Fail;
                Response.ReturnMsg = EnResponseMessage.EmailFail;
                Response.ErrorCode = enErrorCode.Status4087EmailFail;
                return Ok(Response);
            }
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _walletService.InsertUserWalletPendingRequest(request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-25
        [HttpGet("{WalletId}")]
        ///[AllowAnonymous]
        //this method user in wallet screen in bitgo(list user for xyz wallet)
        public async Task<IActionResult> ListUserWalletWise(string WalletId)
        {
            //ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListUserWalletWise Response = new ListUserWalletWise();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _walletService.ListUserWalletWise(WalletId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        //2018-12-29
        [HttpGet]
        //[AllowAnonymous]
        public async Task<IActionResult> ListWalletNew(string Coin)
        {
            // ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListWalletMasterRes Response = new ListWalletMasterRes();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _walletService.ListWalletMasterResponseNew(user.Id, Coin);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{Coin}")]
        // [AllowAnonymous]
        public async Task<IActionResult> GetWalletByTypeNew(string Coin)
        {
            //ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListWalletResNew Response = new ListWalletResNew();
            try
            {
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _walletService.GetWalletByCoinNew(user.Id, Coin);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        [HttpGet("{WalletId}")]
        // [AllowAnonymous]
        public async Task<IActionResult> GetWalletByWalletIdNew(string WalletId)
        {
            // ApplicationUser user = new ApplicationUser(); user.Id =35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListWalletResNew Response = new ListWalletResNew();
            try
            {
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _walletService.GetWalletByIdNew(user.Id, WalletId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region Cold Wallet
        [HttpPost("{Coin}")]
        //[AllowAnonymous]
        public async Task<IActionResult> CreateColdWallet(string Coin, [FromBody]InsertColdWalletRequest request)
        {
            //ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = await _walletService.ColdWallet(Coin, request, user.Id);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        #endregion

        #region ERC-20

        // [AllowAnonymous]
        [HttpPost("{Coin}/{AccWalletId}")]
        public async Task<IActionResult> CreateERC20Address(string Coin, string AccWalletId)
        {
            // ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _walletService.CreateERC20Address(user.Id, Coin, AccWalletId);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion

        #region Leader Board

        [HttpGet]
        // [AllowAnonymous]
        public async Task<IActionResult> LeaderBoard(int? UserCount)
        {
            //ApplicationUser user = new ApplicationUser(); user.Id = 35;
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ListLeaderBoardRes Response = new ListLeaderBoardRes();
            try
            {
                var accessToken = await HttpContext.GetTokenAsync("access_token");
                if (user == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
                    Response.ErrorCode = enErrorCode.StandardLoginfailed;
                }
                else
                {
                    Response = _walletService.LeaderBoard(UserCount);
                }
                return Ok(Response);
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        #endregion      

        #region Old Code
        //static int i = 1;
        //private ActionResult returnDynamicResult(dynamic respObjJson)
        //{
        //    i++;
        //    if (i % 2 == 0)
        //    {
        //        return Ok(respObjJson);
        //    }
        //    else if (i % 3 == 0)
        //    {
        //        return BadRequest();
        //    }
        //    else if (i % 5 == 0)
        //    {
        //        return Unauthorized();
        //    }
        //    else if (i % 7 == 0)
        //    {
        //        return NotFound();
        //    }
        //    else if (i % 9 == 0)
        //    {
        //        return NoContent();
        //    }
        //    else
        //    {
        //        return Ok(respObjJson);
        //    }

        //}
        //#region"Methods"
        ///// <summary>
        ///// vsolanki 1-10-2018 List Wallet Address
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}/{id}")]
        //public async Task<IActionResult> ListWalletAddress(string coin,string id, int sortOrder=-1, int limit=25,string prevId=null, string labelContains=null)
        //{
        //    string requeststring = "{'limit':25,'coin':'tbtc','addresses':[{'address':'2NFfxvXpAWjKng7enFougtvtxxCJ2hQEMo4','coin':'tbtc','label':'My address','wallet':'585c71a5df8380e0e3001318','coinSpecific':{'chain':0,'index':0,'redeemScript':'522101a5df8380e0e30c53ae'}}],'count':6,'pendingAddressCount':0,'totalAddressCount':6}";
        //    ListWalletAddressResponse Response = new ListWalletAddressResponse();
        //    Response = JsonConvert.DeserializeObject<ListWalletAddressResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success; ;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                               new JsonSerializerSettings
        //                               {
        //                                   NullValueHandling = NullValueHandling.Ignore
        //                               });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 1-10-2018 List Wallet Transaction
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}/{id}")]
        //public async Task<IActionResult> ListWalletTransaction(string coin, string id,string prevId=null,bool allTokens=false)
        //{
        //    string requeststring = "{'transactions':[{'id':'fe834f8484f36414cc83d01187a09e80cff670eb903332ef0540552cc7c1beef','size':405,'fee':17418,'date':'2016-12-23T04:57:55.942Z','hex':'010001a5df8380e0e3000000','fromWallet':'585c71a5df8380e0e3001318','blockHash':'00000000deb1fea813d2203258e8a0d78890c6ac0ca2df308775fc830ca7e835','blockHeight':1060644,'blockPosition':9,'inputIds':['7c95e04cf24cb2bc63ce27f9c6aad500ffcd9c4a1f76e015a2935e9074ae2e88:2'],'comment':'test transaction','inputs':[{'id':'7c95e04cf24cb2bc63ce27f9c6aad500ffcd9c4a1f76e015a2935e9074ae2e88:2','address':'2NBEqoSXRJ2giw2bhu98UHn5ysM3tNUhPYT','value':45947744,'wallet':'585c71a5df8380e0e3001318','fromWallet':'585c71a5df8380e0e3001318','chain':1,'index':2}],'outputs':[{'id':'fe834f8484f36414cc83d01187a09e80cff670eb903332ef0540552cc7c1beef:0','address':'n2eMqTT929pb1RDNuqEnxdaLau1rxy3efi','value':1000000}],'entries':[{'account':'2N6CYYGoBdpUiAXWeGJC11ypf9cKkBgoXZ7','value':1000000,'inputs':0,'outputs':1}]}],'coin':'tbtc'}";
        //    ListWalletTransactionResponse Response = new ListWalletTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<ListWalletTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 1-10-2018 Get Wallet Transaction
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}/{id}/{txid}")]
        //public async Task<IActionResult> GetWalletTransaction(string coin, string id,string txid)
        //{
        //    string requeststring = "{'id':'cc21875eb303e5efda9056585d68c79b10345585213a62c9c1a7bc331dfd5d93','normalizedTxHash':'e0e4bada8332ed254c20c4c1d2c25e5f13386509e7ac21d005a169925d07889a','date':'2017-09-06T23:48:50.928Z','hex':'0100000001c94b453b9e997cd8538ecb99c20d981beb7c359c536c16d13865afe96bb77bef000000006b483045022100f7861a0b6ea18b3a368a97c8a85df49e798ec9926bbc912862663dd72b3e18bd022068305d68276ca567d635a53ea0ac6ff730def71316c91d952e4b4baed489c13d0121033905507e505d4777707bc8b70a38e3ff450ceed772932784b5ac719c62f3cd8bffffffff0210f60300000000001976a914bcca7743d9e6417e81c322177dfdaf756093bf1a88aca08601000000000017a9143a1001939de68218f4153f01c90d9818accc8d6a8700000000','blockHash':'0000000000134c6c3840ad2fedb520081df15c5ac4efa43a8d42326500144399','blockHeight':1181203,'blockPosition':2,'confirmations':12431,'fee':10000,'feeString':'10000','size':224,'inputIds':['f09c34d3954e654e43edea3bff27051945e17efe7caa543674d16cd081b85704:1'],'inputs':[{'id':'ef7bb76be9af6538d1166c539c357ceb1b980dc299cb8e53d87c999e3b454bc9:0','address':'mi4NNLqqPVwQZGc6ZX4S3FG1fL3AnVCaug','value':369600,'valueString':'369600'}],'outputs':[{'id':'cc21875eb303e5efda9056585d68c79b10345585213a62c9c1a7bc331dfd5d93:0','address':'mxjBshD14gvw1JkKmBLyEJbz5bigNE357y','value':100000,'valueString':'100000','wallet':'59161139c86cffa0074b614d07dfc29b','chain':0,'index':36},{'id':'cc21875eb303e5efda9056585d68c79b10345585213a62c9c1a7bc331dfd5d93:1','address':'2MxYEMY8UKFPj8Ps5BXSHj3FLA2QfD9n7K1','value':259600,'valueString':'259600'}],'entries':[{'address':'2MxYEMY8UKFPj8Ps5BXSHj3FLA2QfD9n7K1','inputs':0,'outputs':1,'value':100000,'valueString':'100000'},{'address':'mi4NNLqqPVwQZGc6ZX4S3FG1fL3AnVCaug','inputs':1,'outputs':0,'value':-369600,'valueString':'-369600'},{'address':'mxjBshD14gvw1JkKmBLyEJbz5bigNE357y','wallet':'59161139c86cffa0074b614d07dfc29b','inputs':0,'outputs':1,'value':259600,'valueString':'259600'}]}";
        //    GetWalletTransactionResponse Response = new GetWalletTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<GetWalletTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Get First Pending Transaction
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}")]
        //public async Task<IActionResult> GetFirstPendingTransaction(string coin,string enterpriseId=null,string walletId=null)
        //{
        //    string requeststring = "{ 'walletId':'585c51a5df8380e0e3082e46','txid':'0x023d55519e14d6243e614273ca779d2e45c6bccea30cfb32cd859b8f93291c69','tx':'f901ec81c38504a817c8008307a120949e342e458e910017e538ca5868318d06a7fac0d240b90a8439425215000000000000000000000000406243ba15759c5b73bf8ed97bb037037619c5df00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000005a7e5ad1000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000414eec57fea039bdcf8d9346a36f77d799878aa3c9c97ec02d34678c8eca038e015c646ed7a8bb7501fe0c1422dc395f7434311daa1a21f9cbe912b46fe5606bf41c000000000000000000000000000000000000000000000000000000000000001ba09c427a0852c3cc06e5b7a67e51ba9d41c9efa66acf6cea28f814e3048a6e92efa03a1ba9ef435a21d473cf7cc4c2e55eb860481c36c1310e9076d02b4b88226f51','coin':'teth','gasPrice':1000000000000000000}";
        //    GetFirstPendingTransactionResponse Response = new GetFirstPendingTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<GetFirstPendingTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Change Fee on Transaction
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> ChangeFeeonTransaction(string coin, string id,[FromBody]ChangeFeeonTransactionRequest Request)
        //{
        //    string requeststring = "{'txid':'dd21875eb303e5efda9056585d68c79b10345585213a62c9c1a7bc331dfd5d93'}";
        //    ChangeFeeonTransactionResponse Response = new ChangeFeeonTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<ChangeFeeonTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 List Wallet Unspents
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}/{id}")]
        //public async Task<IActionResult> ListWalletUnspents(string coin, string id,int? minValue,int? maxValue,int? minHeight,int? minConfirms,string prevId= null)
        //{
        //    string requeststring = "{'unspents':[{'id':'952ac7fd9c1a5df8380e0e305fac8b42db:0','address':'2NEqutgZ741a5df8380e0e30gkrM9vAyn3','value':203125000,'blockHeight':999999999,'date':'2017-02-23T06:59:21.538Z','wallet':'58ae81a5df8380e0e307e876','fromWallet':null,'chain':0,'index':0,'redeemScript':'522102f601b186b23d6c7b1fc3a3363a7e47b1a48e13e559601c9cf22c98b249c288bf210385dd4200926a87b1363667d50b8e46d17f811ee7bed3c5c29607545f231233d521036ed3744f71e371796b8dfea84dbeeb49a270339ec34eb9a92b87b6874674ecb357ae','isSegwit':false}],'coin':'tbtc'}";
        //    ListWalletUnspentsResponse Response = new ListWalletUnspentsResponse();
        //    Response = JsonConvert.DeserializeObject<ListWalletUnspentsResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Get Total Balances
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}")]
        //public async Task<IActionResult> GetTotalBalances(string coin)
        //{
        //    string requeststring = "{'balance':1234567890,'balanceString':'1234567890','confirmedBalance':1234567890,'confirmedBalanceString':'1234567890','spendableBalance':1234567890,'spendableBalanceString':'1234567890'}";
        //    GetTotalBalancesResponse Response = new GetTotalBalancesResponse();
        //    Response = JsonConvert.DeserializeObject<GetTotalBalancesResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Get Maximum Spendable
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpGet("{coin}/{id}")]
        //public async Task<IActionResult> GetMaximumSpendable(string coin, string id, int? limit, int? minValue, int? maxValue, int? minHeight, int? feeRate, int? maxFeeRate, int? minConfirms, bool enforceMinConfirmsForChange = false)
        //{
        //    string requeststring = "{ 'maximumSpendable':100000000,'coin':'tbtc'}";
        //    GetMaximumSpendableResponse Response = new GetMaximumSpendableResponse();
        //    Response = JsonConvert.DeserializeObject<GetMaximumSpendableResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Consolidate Wallet Unspents
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> ConsolidateWalletUnspents(string coin, string id,[FromBody]ConsolidateWalletUnspentsRequest Request)
        //{
        //    string requeststring = "{'txid':'5885a7e6c7802206f69655ed763d14f101cf46501aef38e275c67c72cfcedb75','tx':'010000001945f506cad0d2b8be8e36ed5d4dbb7502cd3a2822d01f7afe411f9773c6fd381cad0 ...','status':'signed'}";
        //    ConsolidateWalletUnspentsResponse Response = new ConsolidateWalletUnspentsResponse();
        //    Response = JsonConvert.DeserializeObject<ConsolidateWalletUnspentsResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Fanout Wallet Unspents
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> FanoutWalletUnspents(string coin, string id,[FromBody]FanoutWalletUnspentsRequest Request)
        //{
        //    string requeststring = "{'txid':'5885a7e6c7802206f69655ed763d14f101cf46501aef38e275c67c72cfcedb75','tx':'010000001945f506cad0d2b8be8e36ed5d4dbb7502cd3a2822d01f7afe411f9773c6fd381cad0 ...','status':'signed'}";
        //    FanoutWalletUnspentsResponse Response = new FanoutWalletUnspentsResponse();
        //    Response = JsonConvert.DeserializeObject<FanoutWalletUnspentsResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Sweep
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> Sweep(string coin, string id,[FromBody]SweepRequest Request)
        //{
        //    string requeststring = "{'txid':'5885a7e6c7802206f69655ed763d14f101cf46501aef38e275c67c72cfcedb75','tx':'010000001945f506cad0d2b8be8e36ed5d4dbb7502cd3a2822d01f7afe411f9773c6fd381cad0 ...','status':'signed'}";
        //    SweepResponse Response = new SweepResponse();
        //    Response = JsonConvert.DeserializeObject<SweepResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ///// <summary>
        ///// vsolanki 2-10-2018 Build Transaction
        ///// </summary>
        ///// <param name="Request"></param>
        ///// <returns></returns>
        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> BuildTransaction(string coin, string id,[FromBody]BuildTransactionRequest Request)
        //{
        //    string requeststring = "{'txHex':'010000000179b0b5ad6641de8fed13270395e52515236c922d1dd5bee3a9dae68c3cbbf57d0100000000ffffffff0240420f000000000017a914f600974688ccdf5e72ce3f2b187afabbf4f1d3ec878e7835000000000017a9140c0a513cb9d8e46113c57aa46ae42d1bad29063d8700000000','txInfo':{'nP2SHInputs':1,'nSegwitInputs':0,'nOutputs':2,'unspents':[{'chain':1,'index':10,'redeemScript':'52210208906f13de98b88bc9f83886c39a1555ada816b12de6f029626af2ef9413708b2102bca01320026604530fc47068ce015b39b91bd72d8964b0c5023697645b1441ab210336d8e968990c8a5b2bad83a237c37957ce70586ed507b155941ea28ec953860153ae','id':'7df5bb3c8ce6daa9e3bed51d2d926c231525e595032713ed8fde4166adb5b079:1','address':'2MvevrYxML8NkRng4avXz7oMCgs5qxR7Mef','value':4508000}],'changeAddresses':['2MtLtTSsC98dF4zriFGvCfmce3A17Zz1McK']},'feeInfo':{'size':373,'fee':3730,'feeRate':10000,'payGoFee':0,'payGoFeeString':'0'}}";
        //    BuildTransactionResponse Response = new BuildTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<BuildTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response, Newtonsoft.Json.Formatting.Indented,
        //                                           new JsonSerializerSettings
        //                                           {
        //                                               NullValueHandling = NullValueHandling.Ignore
        //                                           });
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        ////Rushabh 03-10-2018

        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> SignTransaction(string coin, string id, [FromBody]SignTransactionRequest Request)
        //{
        //    string requeststring = "{'txHex': '010000000179b0b5ad6641de8fed13270395e52515236c922d1dd5bee3a9dae68c3cbbf57d0100000000ffffffff0240420f000000000017a914f600974688ccdf5e72ce3f2b187afabbf4f1d3ec878e7835000000000017a9140c0a513cb9d8e46113c57aa46ae42d1bad29063d8700000000'}";
        //    SignTransactionResponse Response = new SignTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<SignTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response);
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        //[HttpPost("{coin}/{id}")]
        //public async Task<IActionResult> SendTransaction(string coin, string id, [FromBody]SendTransaction Request)
        //{
        //    string requeststring = "{'txid':'415993bf16c856feb92ab15245a7d6b18757a276c2ac8f58fdbf6fad926857d6','txHex':'010000000179b0b5ad6641de8fed13270395e52515236c922d1dd5bee3a9dae68c3cbbf57d0100000000ffffffff0240420f000000000017a914f600974688ccdf5e72ce3f2b187afabbf4f1d3ec878e7835000000000017a9140c0a513cb9d8e46113c57aa46ae42d1bad29063d8700000000','status':'signed'}";
        //    SendTransactionResponse Response = new SendTransactionResponse();
        //    Response = JsonConvert.DeserializeObject<SendTransactionResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response);
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}

        //[HttpPost("{id}")]
        //public async Task<IActionResult> FreezeWallet(string id, [FromBody]FreezeWalletRequest Request)
        //{
        //    string requeststring = "{'time':'2016-04-01T03:51:39.779Z','expires':'2016-04-01T04:58:19.779Z'}";
        //    FreezeWalletResponse Response = new FreezeWalletResponse();
        //    Response = JsonConvert.DeserializeObject<FreezeWalletResponse>(requeststring);
        //    Response.ReturnCode = enResponseCode.Success;
        //    var respObj = JsonConvert.SerializeObject(Response);
        //    dynamic respObjJson = JObject.Parse(respObj);
        //    return returnDynamicResult(respObjJson);
        //}
        //#endregion
        #endregion
    }
}
