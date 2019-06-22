using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Affiliate;
using CleanArchitecture.Core.Entities.Charges;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.ControlPanel;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Wallet;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    public class MarketCap : IMarketCap
    {
        public ICommonRepository<MarketCapCounterMaster> _MarketCapCounterMaster;
        public ICommonRepository<CurrencyRateMaster> _CurrencyRateMaster;
        public ICommonRepository<AffiliateCommissionCron> _AffiliateCommissionCron;
        public ICommonRepository<CurrencyRateDetail> _CurrencyRateDetail;
        public ICommonRepository<WalletTypeMaster> _WalletTypeMaster;
        public IControlPanelRepository _controlPanelRepository;
        public IWalletSPRepositories _walletSPRepositories;
        private readonly IMarginWalletRepository _walletRepository1;
        private readonly IMarginClosePosition _marginClosePosition;
        private readonly IMarginSPRepositories _walletSPRepositories1;
        private readonly ICommonRepository<MarginCloseUserPositionWallet> _ClosePosition;
        public MarketCap(ICommonRepository<MarketCapCounterMaster> MarketCapCounterMaster, ICommonRepository<WalletTypeMaster> WalletTypeMaster, ICommonRepository<CurrencyRateMaster> CurrencyRateMaster, ICommonRepository<CurrencyRateDetail> CurrencyRateDetail, IControlPanelRepository controlPanelRepository, IWalletSPRepositories walletSPRepositories, ICommonRepository<AffiliateCommissionCron> AffiliateCommissionCron, IMarginWalletRepository walletRepository1, ICommonRepository<MarginCloseUserPositionWallet> ClosePosition, IMarginClosePosition marginClosePosition, IMarginSPRepositories walletSPRepositories1)
        {
            _MarketCapCounterMaster = MarketCapCounterMaster;
            _WalletTypeMaster = WalletTypeMaster;
            _CurrencyRateMaster = CurrencyRateMaster;
            _CurrencyRateDetail = CurrencyRateDetail;
            _controlPanelRepository = controlPanelRepository;
            _walletSPRepositories = walletSPRepositories;
            _AffiliateCommissionCron = AffiliateCommissionCron;
            _walletRepository1 = walletRepository1;
            _ClosePosition = ClosePosition;
            _marginClosePosition = marginClosePosition;
            _walletSPRepositories1 = walletSPRepositories1;
        }

        public MarketCapCounterMaster GetMarketCounter()
        {
            try
            {
                var data = _MarketCapCounterMaster.GetSingle(i => i.Status == 1);
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return null;
            }
        }

        public List<WalletTypeMaster> GetWalletTypeMaster()
        {
            try
            {
                var data = _WalletTypeMaster.List();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return null;
            }
        }

        public string SendAPIRequest(MarketCapCounterMaster marketCap, string ContentType = "application/json", int Timeout = 180000, string MethodType = "GET")
        {
            string responseFromServer = "";
            try
            {
                object ResponseObj = new object();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                string url = marketCap.Url;

                keyValuePairs.Add("#StartLimit#", marketCap.StartLimit.ToString());
                keyValuePairs.Add("#RecordCountLimit#", marketCap.RecordCountLimit.ToString());
                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    url = url.Replace(item.Key, item.Value);
                }

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                httpWebRequest.Method = MethodType.ToUpper();
                httpWebRequest.KeepAlive = false;
                httpWebRequest.Timeout = Timeout;
                httpWebRequest.ContentType = ContentType;
                HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, marketCap.Url + "Request::" + marketCap.StartLimit);
                HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                using (StreamReader sr = new StreamReader(httpWebResponse.GetResponseStream()))
                {
                    responseFromServer = sr.ReadToEnd();
                    sr.Close();
                    sr.Dispose();
                }
                httpWebResponse.Close();
                //HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, responseFromServer);
                return responseFromServer;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass CallAPI()
        {
            try
            {
                var objRes = GetMarketCounter();
                if (objRes != null)
                {
                    string response = SendAPIRequest(objRes);
                    if (response != null)
                    {
                        var parseObj = ParseResponse(response);
                        return parseObj;
                    }
                    else
                    {
                        return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound, ErrorCode = enErrorCode.NotFound };
                    }
                }
                else
                {
                    return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound, ErrorCode = enErrorCode.NotFound };
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass ParseResponse(string response)
        {
            try
            {
                var objRes = GetMarketCounter();
                var jsonRes = JsonConvert.DeserializeObject<MarketRoot>(response);
                JObject GenerateResponse = JObject.Parse(response);
                if (jsonRes.metadata.error == null)
                {
                    var typeObj = GetWalletTypeMaster();
                    if (typeObj != null)
                    {
                        //for (int i = 1; i <= objRes.RecordCountLimit; i++)
                        //{
                        var data = GenerateResponse.SelectToken("data");
                        var jsonDataRes = JsonConvert.DeserializeObject<Dictionary<string, IdObject>>(data.ToString());
                        foreach (KeyValuePair<string, IdObject> listRes in jsonDataRes)
                        {
                            var WalletTypeObj = typeObj.Find(x => x.WalletTypeName == listRes.Value.symbol.ToUpper());
                            if (listRes.Value.symbol.ToUpper().Contains("BTC"))
                            {
                                var IsLocalObj = GetIsLocalWalletTypeMaster();
                                if (IsLocalObj != null || IsLocalObj.Count != 0)
                                {
                                    foreach (var obj in IsLocalObj)
                                    {
                                        var LTP = GetLTP(obj.Id);
                                        CurrencyRateMaster currencyRateMaster = new CurrencyRateMaster();
                                        var currencyObj = _CurrencyRateMaster.GetSingle(ip => ip.WalletTypeId == obj.Id);
                                        if (currencyObj != null)
                                        {
                                            currencyObj.CurrentRate = Convert.ToDecimal(listRes.Value.quotes.USD.price) * LTP;
                                            currencyObj.UpdatedBy = 1;
                                            currencyObj.UpdatedDate = Helpers.UTC_To_IST();
                                            _CurrencyRateMaster.UpdateWithAuditLog(currencyObj);
                                        }
                                        else
                                        {
                                            currencyRateMaster.CurrentRate = Convert.ToDecimal(listRes.Value.quotes.USD.price) * LTP;
                                            currencyRateMaster.CreatedBy = 1;
                                            currencyRateMaster.CreatedDate = Helpers.UTC_To_IST();
                                            currencyRateMaster.UpdatedDate = Helpers.UTC_To_IST();
                                            currencyRateMaster.Status = 1;
                                            currencyRateMaster.WalletTypeId = obj.Id;
                                            currencyRateMaster = _CurrencyRateMaster.Add(currencyRateMaster);
                                        }
                                        CurrencyRateDetail currencyRateDetail = new CurrencyRateDetail();
                                        currencyRateDetail.CreatedBy = 1;
                                        currencyRateDetail.CreatedDate = Helpers.UTC_To_IST();
                                        currencyRateDetail.UpdatedDate = Helpers.UTC_To_IST();
                                        currencyRateDetail.Status = 1;
                                        currencyRateDetail.Price = Convert.ToDecimal(listRes.Value.quotes.USD.price) * LTP;
                                        currencyRateDetail.CurrencyRateMasterId = (currencyObj == null ? currencyRateMaster.Id : currencyObj.Id);
                                        currencyRateDetail.Volume_24h = 0 * LTP;
                                        currencyRateDetail.Market_cap = Convert.ToDecimal(listRes.Value.quotes.USD.market_cap) * LTP;
                                        currencyRateDetail.Percent_change_1h = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_1h) * LTP;
                                        currencyRateDetail.Percent_change_24h = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_24h) * LTP;
                                        currencyRateDetail.Percent_change_7d = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_7d) * LTP;
                                        currencyRateDetail.Last_updated = listRes.Value.last_updated.ToString();
                                        currencyRateDetail.CoinName = listRes.Value.name.ToString();
                                        currencyRateDetail.Symbol = listRes.Value.symbol.ToString();

                                        DateTime enteredDate = DateTime.Parse("1970/1/1 00:00:00");
                                        currencyRateDetail.Last_updatedDateTime = enteredDate.AddSeconds(Convert.ToDouble(listRes.Value.last_updated)).ToLocalTime();
                                        _CurrencyRateDetail.Add(currencyRateDetail);
                                    }
                                }
                            }
                            if (WalletTypeObj != null)
                            {
                                CurrencyRateMaster currencyRateMaster = new CurrencyRateMaster();
                                var currencyObj = _CurrencyRateMaster.GetSingle(ip => ip.WalletTypeId == WalletTypeObj.Id);
                                if (currencyObj != null)
                                {
                                    currencyObj.CurrentRate = Convert.ToDecimal(listRes.Value.quotes.USD.price);
                                    currencyObj.UpdatedBy = 1;
                                    currencyObj.UpdatedDate = Helpers.UTC_To_IST();
                                    _CurrencyRateMaster.UpdateWithAuditLog(currencyObj);
                                }
                                else
                                {
                                    currencyRateMaster.CurrentRate = Convert.ToDecimal(listRes.Value.quotes.USD.price);
                                    currencyRateMaster.CreatedBy = 1;
                                    currencyRateMaster.CreatedDate = Helpers.UTC_To_IST();
                                    currencyRateMaster.UpdatedDate = Helpers.UTC_To_IST();
                                    currencyRateMaster.Status = 1;
                                    currencyRateMaster.WalletTypeId = WalletTypeObj.Id;
                                    currencyRateMaster = _CurrencyRateMaster.Add(currencyRateMaster);
                                }
                                CurrencyRateDetail currencyRateDetail = new CurrencyRateDetail();
                                currencyRateDetail.CreatedBy = 1;
                                currencyRateDetail.CreatedDate = Helpers.UTC_To_IST();
                                currencyRateDetail.UpdatedDate = Helpers.UTC_To_IST();
                                currencyRateDetail.Status = 1;
                                currencyRateDetail.Price = Convert.ToDecimal(listRes.Value.quotes.USD.price);
                                currencyRateDetail.CurrencyRateMasterId = (currencyObj == null ? currencyRateMaster.Id : currencyObj.Id);
                                //2019-4-11 due to error its remove
                                //   currencyRateDetail.Volume_24h = Convert.ToDecimal(listRes.Value.quotes.USD.volume_24h);
                                currencyRateDetail.Volume_24h = Convert.ToDecimal(0);
                                currencyRateDetail.Market_cap = Convert.ToDecimal(listRes.Value.quotes.USD.market_cap);
                                currencyRateDetail.Percent_change_1h = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_1h);
                                currencyRateDetail.Percent_change_24h = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_24h);
                                currencyRateDetail.Percent_change_7d = Convert.ToDecimal(listRes.Value.quotes.USD.percent_change_7d);
                                currencyRateDetail.Last_updated = listRes.Value.last_updated.ToString();
                                currencyRateDetail.CoinName = listRes.Value.name.ToString();
                                currencyRateDetail.Symbol = listRes.Value.symbol.ToString();

                                DateTime enteredDate = DateTime.Parse("1970/1/1 00:00:00");
                                currencyRateDetail.Last_updatedDateTime = enteredDate.AddSeconds(Convert.ToDouble(listRes.Value.last_updated)).ToLocalTime();
                                _CurrencyRateDetail.Add(currencyRateDetail);
                            }
                        }
                        // }
                    }
                    else
                    {
                        return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound, ErrorCode = enErrorCode.NotFound };
                    }
                    return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.FindRecored, ErrorCode = enErrorCode.Success };
                }
                return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound, ErrorCode = enErrorCode.NotFound };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass UpdateMarketCapCounter()
        {
            try
            {
                var objRes = GetMarketCounter();
                if (objRes != null)
                {
                    if (objRes.MaxLimit == objRes.StartLimit)
                    {
                        objRes.StartLimit = 0;
                    }
                    else
                    {
                        objRes.StartLimit = objRes.StartLimit + objRes.RecordCountLimit;
                    }
                    objRes.UpdatedBy = 1;
                    objRes.UpdatedDate = Helpers.UTC_To_IST();
                    _MarketCapCounterMaster.UpdateWithAuditLog(objRes);
                    return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated, ErrorCode = enErrorCode.Success };
                }
                return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound, ErrorCode = enErrorCode.NotFound };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public List<WalletTypeMaster> GetIsLocalWalletTypeMaster()
        {
            try
            {
                var data = _controlPanelRepository.MarketCapIsLocal();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return null;
            }
        }

        public decimal GetLTP(long WalletTypeId)
        {
            try
            {
                var data = _controlPanelRepository.GetLTP(WalletTypeId);
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return 0;
            }
        }

        public BizResponseClass CallSP_InsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD")
        {
            try
            {
                var data = _walletSPRepositories.CallSP_InsertUpdateProfit(TrnDate, CurrencyName);
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return null;
            }
        }
        public BizResponseClass CallSP_ArbitrageInsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD")
        {
            try
            {
                var data = _walletSPRepositories.CallSP_InsertUpdateProfit(TrnDate, CurrencyName);
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "GetMarketCounter", ex);
                return null;
            }
        }

        public AffiliateCommissionCron InsertIntoCron(int Hour)
        {
            try
            {
                AffiliateCommissionCron cron = new AffiliateCommissionCron();
                var data = _controlPanelRepository.GetCronData();
                if (data != null)
                {
                    cron.FromDate = data.ToDate;
                    cron.ToDate = Convert.ToDateTime(data.ToDate).AddHours(Hour);

                }
                else
                {
                    Hour = 0 - Hour;
                    cron.FromDate = Helpers.UTC_To_IST().AddHours(Hour);
                    cron.ToDate = Helpers.UTC_To_IST();
                }
                cron.SchemeMappingId = 999;
                cron.Remarks = "Referral Commission Cron";
                cron.CreatedBy = 999;
                cron.CreatedDate = Helpers.UTC_To_IST();
                cron.Status = 1;
                cron = _AffiliateCommissionCron.Add(cron);

                return cron;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "InsertIntoCron", ex);
                return null;
            }
        }

        public AffiliateCommissionCron GetCronData()
        {
            try
            {
                var data = _controlPanelRepository.GetCronData();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarketCap", "InsertIntoCron", ex);
                return null;
            }
        }

        public async Task<bool> ForceWithdrwLoan()
        {
            try
            {
                IEnumerable<MarginCloseUserPositionWallet> OrderS = await _ClosePosition.FindByAsync(e => e.Status == 0);

                foreach (MarginCloseUserPositionWallet Order in OrderS)
                {
                    OpenPositionMaster openPositionMaster = _walletRepository1.GetPairPositionMasterValue(Order.UserID);
                    if (openPositionMaster == null)
                    {

                    }
                    else
                    {
                        CloseOpenPostionResponseMargin closeOpenPostionResponseMargin = await _marginClosePosition.CloseOpenPostionMargin(openPositionMaster.PairID, Order.UserID, "");
                        if(closeOpenPostionResponseMargin.ReturnCode != enResponseCode.Success && closeOpenPostionResponseMargin.ErrorCode != enErrorCode.Margin_ClosePositionNoHoldOrderFound) //ntrivedi 22-05-2019
                        {
                            Order.Status = 9;
                            Order.UpdatedBy = 900;
                            Order.ErrorCode = Convert.ToInt64(closeOpenPostionResponseMargin.ErrorCode);
                            Order.UpdatedDate = Helpers.UTC_To_IST();
                            _ClosePosition.Update(Order);
                            return true;
                        }
                    }
                    Order.Status = 6;
                    Order.UpdatedBy = 900;
                    Order.UpdatedDate = Helpers.UTC_To_IST();
                    _ClosePosition.Update(Order);
                    
                    MarginWithdrawPreConfirmResponse objectWithdraw = _walletSPRepositories1.CallSP_MarginWithdraw(Order.UserID, Order.SMSCode);
                    if (objectWithdraw.ReturnCode == enResponseCode.Success)
                    {
                        Order.Status = 1;                       
                    }
                    Order.ErrorCode = Convert.ToInt64(objectWithdraw.ErrorCode);
                    Order.ErrorMessage = objectWithdraw.ReturnMsg;
                    _ClosePosition.Update(Order);
                }
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ForceWithdrwLoan Internal Error", "MarginWalletServicce", ex);
                return false;
            }
        }
    }
}
