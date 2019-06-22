using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Infrastructure.DTOClasses;
using System;
using System.Collections.Generic;
using System.Text;
using CleanArchitecture.Infrastructure.Interfaces;
using System.Net;
using System.Security.Cryptography;
using CleanArchitecture.Core.ViewModels.Transaction;

namespace CleanArchitecture.Infrastructure.Services
{
    public class GetWebRequest : IGetWebRequest
    {
        readonly ICommonRepository<RouteConfiguration> _routeRepository;
        readonly ICommonRepository<RouteConfigurationArbitrage> _RouteConfigurationArbitrage;
        readonly ICommonRepository<ArbitrageThirdPartyAPIConfiguration> _ArbitrageThirdPartyAPIConfiguration;
        readonly ICommonRepository<ServiceProConfigurationArbitrage> _ServiceProConfigurationArbitrage;
        readonly ICommonRepository<ThirdPartyAPIConfiguration> _thirdPartyCommonRepository;
        readonly ICommonRepository<ServiceProviderDetail> _serviceProviderDetail;
        readonly ICommonRepository<ServiceProviderDetailArbitrage> _serviceProviderDetailArbitrage;
        readonly ICommonRepository<ServiceProConfiguration> _ServiceProConfiguration;
        //readonly ICommonRepository<WalletTypeMaster> _WalletTypeMaster;
        //readonly ICommonRepository<ProviderConfiguration> _providerRepository;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        public GetWebRequest(ICommonRepository<RouteConfiguration> routeRepository, ICommonRepository<ThirdPartyAPIConfiguration> thirdPartyCommonRepository,
              //ICommonRepository<ProviderConfiguration> providerRepository, 
              //ICommonRepository<WalletTypeMaster> WalletTypeMaster,
              ICommonRepository<ServiceProConfiguration> ServiceProConfiguration,
              ICommonRepository<ServiceProviderDetail> serviceProviderDetail,
              Microsoft.Extensions.Configuration.IConfiguration configuration,
              ICommonRepository<ServiceProviderDetailArbitrage> serviceProviderDetailArbitrage,
              ICommonRepository<ServiceProConfigurationArbitrage> ServiceProConfigurationArbitrage,
              ICommonRepository<RouteConfigurationArbitrage> RouteConfigurationArbitrage,
              ICommonRepository<ArbitrageThirdPartyAPIConfiguration> ArbitrageThirdPartyAPIConfiguration)
        {
            _thirdPartyCommonRepository = thirdPartyCommonRepository;
            _routeRepository = routeRepository;
            //_WalletTypeMaster = WalletTypeMaster;
            //_providerRepository = providerRepository;
            _ServiceProConfiguration = ServiceProConfiguration;
            _serviceProviderDetail = serviceProviderDetail;
            _configuration = configuration;
            _RouteConfigurationArbitrage = RouteConfigurationArbitrage;
            _ArbitrageThirdPartyAPIConfiguration = ArbitrageThirdPartyAPIConfiguration;
            _ServiceProConfigurationArbitrage = ServiceProConfigurationArbitrage;
            _serviceProviderDetailArbitrage = serviceProviderDetailArbitrage;
        }

        public ThirdPartyAPIRequest MakeWebRequest(long routeID, long thirdpartyID, long serproDetailID, TransactionQueue TQ = null, WithdrawERCAdminAddress AdminAddress = null)
        {
            try
            {
                RouteConfiguration routeConfiguration;
                ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                //ProviderConfiguration providerConfiguration;
                //ServiceProviderDetail ServiceProviderDetail;
                ServiceProConfiguration ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();


                thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(thirdpartyID);
                var SerProconfigObj = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID);
                var SerProconfigID = SerProconfigObj.ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _routeRepository.GetById(routeID);

                //thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APIBalURL;
                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.APIRequestBody;

                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }
                //Rushabh 09-05-2019 For ERC-223 Withdraw Request Body Parameter Replacement
                if (ServiceProConfiguration != null)
                {
                    keyValuePairs.Add("#Param1#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param1));
                    keyValuePairs.Add("#Param2#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param2));
                    keyValuePairs.Add("#Param3#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param3));
                    keyValuePairs.Add("#Param4#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param4));
                    keyValuePairs.Add("#Param5#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param5));
                }

                keyValuePairs.Add("#OPERATORCODE#", routeConfiguration.OpCode);
                //keyValuePairs.Add("#WALLETID#", routeConfiguration.ProviderWalletID);
                keyValuePairs.Add("#ORGADDRESS#", routeConfiguration.ProviderWalletID);// Org Wallet Address/ID  

                //if(!string.IsNullOrEmpty(thirdPartyAPIConfiguration.APIBalURL))
                //{
                //    keyValuePairs.Add("#OPERATORCODE#", routeConfiguration.OpCode);                    
                //    keyValuePairs.Add("#ORGADDRESS#", routeConfiguration.ProviderWalletID);// Org Wallet Address/ID  
                //}

                if (!string.IsNullOrEmpty(thirdPartyAPIConfiguration.TimeStamp))
                    keyValuePairs.Add("#TIMESTAMP#", Helpers.UTC_To_IST().ToString(thirdPartyAPIConfiguration.TimeStamp));

                if (TQ != null)//Rita 25-10-2018 incase of transation
                {
                    keyValuePairs.Add("#SMSCODE#", TQ.SMSCode);
                    keyValuePairs.Add("#TRANSACTIONID#", TQ.Id.ToString());
                    keyValuePairs.Add("#AMOUNT#", TQ.Amount.ToString());
                    keyValuePairs.Add("#USERADDRESS#", TQ.TransactionAccount);
                    //decimal Amt = routeConfiguration.ConvertAmount * TQ.Amount; For Testing Purpose
                    string amount = "";
                    if (SerProconfigObj.IsStopConvertAmount == 0)
                    {
                        amount = Math.Truncate(routeConfiguration.ConvertAmount * TQ.Amount).ToString(); // Rushabh 03-05-2019 convert amount set only integer value to paro api  
                    }
                    else
                    {
                        amount = TQ.Amount.ToString(); // Rushabh 03-05-2019 convert amount set only integer value to paro api  
                    }

                    //keyValuePairs.Add("#CONVERTEDAMT#", ((double)(routeConfiguration.ConvertAmount * TQ.Amount)).ToString()); //ntrivedi 11-12-2018 convert amount set only integer value to paro api                  
                    keyValuePairs.Add("#CONVERTEDAMT#", amount); //ntrivedi 11-12-2018 convert amount set only integer value to paro api                  

                }
                else//In case of Wallet Operation
                {

                }

                if (AdminAddress != null)
                {
                    keyValuePairs.Add("#SITENAME#", _configuration["sitename"].ToString());
                    keyValuePairs.Add("#SITEID#", _configuration["site_id"].ToString());
                    keyValuePairs.Add("#REFID#", AdminAddress.RefKey);
                    keyValuePairs.Add("#FROMADDRESS#", AdminAddress.Address);
                    keyValuePairs.Add("#TOADDRESS#", TQ.TransactionAccount);
                    keyValuePairs.Add("#COIN#", TQ.SMSCode);
                    keyValuePairs.Add("#GASLIMIT#", routeConfiguration.GasLimit.ToString());
                    keyValuePairs.Add("#VALUE#", TQ.Amount.ToString());
                }

                string filename = "testing";
                keyValuePairs.Add("#FilePath#", "C:\\Users\\BcAdmin102\\AppData\\Roaming\\MultiChain\\nups\\" + filename + ".txt");
                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                //ntrivedi moved code below due to hmac is making after request body replacing 10-12-2018
                //Rushabh 11-10-2018 For Authorization Header
                if (thirdPartyAPIConfiguration.AuthHeader != string.Empty)
                {

                    foreach (string mainItem in thirdPartyAPIConfiguration.AuthHeader.Split("###"))
                    {

                        string[] item = mainItem.Split(":");
                        //thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item[0], item[1]);
                        //thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item[0], item[1]);
                        string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                        item[1] = item[1].Replace("#BASIC#", Convert.ToBase64String(Encoding.Default.GetBytes(authInfo)));
                        if (item[0] == "Sign") // ntrivedi for withdaraw
                        {
                            string hashSignHeader = hashMACsha512(thirdPartyAPIRequest.RequestBody, item[1]);
                            //AddToLog("Transaction Req hashSignHeader=" & hashSignHeader, "ThirdPartyAPI", trnObj)
                            //  myReq.Headers.Add(HeaderKeyValuePairArray(0), hashSignHeader)
                            keyValuePairsHeader.Add(item[0], hashSignHeader);
                        }
                        else
                        {
                            keyValuePairsHeader.Add(item[0], item[1]);
                        }

                    }
                }

                //Rita 25-10-2018 added in common dynamic header part
                //if(thirdPartyAPIConfiguration.AuthHeader == "RPC")
                //{
                //    string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                //    authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));
                //    authInfo = "Basic " + authInfo;
                //    keyValuePairsHeader.Add("Authorization", authInfo);                
                //}
                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;

                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequest", ex);
                throw ex;
            }
        }

        public ThirdPartyAPIRequest MakeWebRequestV2(string Refkey, string Address, long routeID, long thirdpartyID, long serproDetailID, TransactionQueue TQ = null, WithdrawERCAdminAddress AdminAddress = null, short IsValidateUrl = 0)
        {
            try
            {
                RouteConfiguration routeConfiguration;
                ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                //ProviderConfiguration providerConfiguration;
                //ServiceProviderDetail ServiceProviderDetail;
                ServiceProConfiguration ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();


                thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(thirdpartyID);
                var SerProconfigID = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _routeRepository.GetById(routeID);

                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APIBalURL;
                if (IsValidateUrl == 1)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APIValidateURL;
                }

                //thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.BalCheckRequestBody;
                //var IsLocal = _WalletTypeMaster.GetSingle(x => x.WalletTypeName.ToUpper() == routeConfiguration.OpCode.ToUpper());
                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }

                if (ServiceProConfiguration != null)
                {
                    keyValuePairs.Add("#Param1#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param1));
                    keyValuePairs.Add("#Param2#", (String.IsNullOrEmpty(ServiceProConfiguration.Param2) ? "" : ServiceProConfiguration.Param2));
                    keyValuePairs.Add("#Param3#", (String.IsNullOrEmpty(ServiceProConfiguration.Param3) ? "" : ServiceProConfiguration.Param3));
                    keyValuePairs.Add("#Param4#", (String.IsNullOrEmpty(ServiceProConfiguration.Param4) ? "" : ServiceProConfiguration.Param4));
                    keyValuePairs.Add("#Param5#", (String.IsNullOrEmpty(ServiceProConfiguration.Param5) ? "" : ServiceProConfiguration.Param5));
                }
                keyValuePairs.Add("#OPERATORCODE#", routeConfiguration.OpCode);
                if (routeConfiguration.OpCode == "ETH")
                {
                    keyValuePairs.Add("#SMSCODE#", "");
                }
                else
                {
                    keyValuePairs.Add("#SMSCODE#", routeConfiguration.OpCode);
                }
                //keyValuePairs.Add("#WALLETID#", routeConfiguration.ProviderWalletID);
                keyValuePairs.Add("#ORGADDRESS#", routeConfiguration.ProviderWalletID);// Org Wallet Address/ID  
                keyValuePairs.Add("#RefKey#", Refkey);
                keyValuePairs.Add("#Address#", Address);
                keyValuePairs.Add("#ADDRESS#", Address);

                if (!string.IsNullOrEmpty(thirdPartyAPIConfiguration.TimeStamp))
                    keyValuePairs.Add("#TIMESTAMP#", Helpers.UTC_To_IST().ToString(thirdPartyAPIConfiguration.TimeStamp));

                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                //ntrivedi moved code below due to hmac is making after request body replacing 10-12-2018
                //Rushabh 11-10-2018 For Authorization Header
                if (!string.IsNullOrEmpty(thirdPartyAPIConfiguration.AuthHeader))
                {
                    foreach (string mainItem in thirdPartyAPIConfiguration.AuthHeader.Split("###"))
                    {
                        string[] item = mainItem.Split(":");
                        //string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                        //item[1] = item[1].Replace("#BASIC#", Convert.ToBase64String(Encoding.Default.GetBytes(authInfo)));
                        //if (item[0] == "Sign") // ntrivedi for withdaraw
                        //{
                        //    string hashSignHeader = hashMACsha512(thirdPartyAPIRequest.RequestBody, item[1]);
                        //    keyValuePairsHeader.Add(item[0], hashSignHeader);
                        //}
                        //else
                        //{
                        keyValuePairsHeader.Add(item[0], item[1]);
                        //}
                    }
                }
                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;
                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequestV2", ex);
                throw ex;
            }
        }

        private string hashMACsha512(string Message, string key)
        {
            try
            {
                byte[] keyByte = UTF8Encoding.UTF8.GetBytes(key);
                using (HMACSHA512 hmacsha256 = new HMACSHA512(keyByte))
                {
                    hmacsha256.ComputeHash(UTF8Encoding.UTF8.GetBytes(Message));
                    return ByteToString(hmacsha256.Hash);
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequest", ex);
                throw ex;
            }
        }
        private string ByteToString(byte[] buff)
        {
            string sbinary = "";
            for (int i = 0; i <= buff.Length - 1; i++)
                sbinary += buff[i].ToString("x2");
            return sbinary;
        }

        public ThirdPartyAPIRequest MakeWebRequestWallet(long routeID, long thirdpartyID, long serproDetailID, string FileName, string Coin)
        {
            try
            {
                RouteConfiguration routeConfiguration;
                ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                ServiceProConfiguration ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();

                thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(thirdpartyID);
                var SerProconfigID = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _routeRepository.GetById(routeID);

                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.APIRequestBody;

                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }
                keyValuePairs.Add("#FilePath#", FileName);
                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                if (thirdPartyAPIConfiguration.AuthHeader != string.Empty)
                {
                    foreach (string mainItem in thirdPartyAPIConfiguration.AuthHeader.Split("###"))
                    {
                        string[] item = mainItem.Split(":");
                        string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                        item[1] = item[1].Replace("#BASIC#", Convert.ToBase64String(Encoding.Default.GetBytes(authInfo)));
                        if (item[0] == "Sign") // ntrivedi for withdaraw
                        {
                            string hashSignHeader = hashMACsha512(thirdPartyAPIRequest.RequestBody, item[1]);
                            keyValuePairsHeader.Add(item[0], hashSignHeader);
                        }
                        else
                        {
                            keyValuePairsHeader.Add(item[0], item[1]);
                        }
                    }
                }
                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;
                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequest", ex);
                throw ex;
            }
        }

        public ThirdPartyAPIRequest MakeWebRequestColdWallet(long routeID, long thirdpartyID, long serproDetailID, string ReqBody, string Coin)
        {
            try
            {
                RouteConfiguration routeConfiguration;
                ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                //ProviderConfiguration providerConfiguration;
                //ServiceProviderDetail ServiceProviderDetail;
                ServiceProConfiguration ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();


                thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(thirdpartyID);
                var SerProconfigID = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _routeRepository.GetById(routeID);


                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.APIRequestBody;

                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }

                keyValuePairs.Add("#RequestBody#", ReqBody);


                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                //temporary commented.. bcz testing with static data
                #region OldCode
                //if (thirdPartyAPIConfiguration.AuthHeader != string.Empty)
                //{

                //    foreach (string mainItem in thirdPartyAPIConfiguration.AuthHeader.Split("###"))
                //    {

                //        string[] item = mainItem.Split(":");
                //        //thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item[0], item[1]);
                //        //thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item[0], item[1]);
                //        string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                //        item[1] = item[1].Replace("#BASIC#", Convert.ToBase64String(Encoding.Default.GetBytes(authInfo)));
                //        if (item[0] == "Sign") // ntrivedi for withdaraw
                //        {
                //            string hashSignHeader = hashMACsha512(thirdPartyAPIRequest.RequestBody, item[1]);
                //            //AddToLog("Transaction Req hashSignHeader=" & hashSignHeader, "ThirdPartyAPI", trnObj)
                //            //  myReq.Headers.Add(HeaderKeyValuePairArray(0), hashSignHeader)
                //            keyValuePairsHeader.Add(item[0], hashSignHeader);
                //        }
                //        else
                //        {
                //            keyValuePairsHeader.Add(item[0], item[1]);
                //        }

                //    }
                //}
                #endregion
                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;

                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequestColdWallet", ex);
                throw ex;
            }
        }

        public ThirdPartyAPIRequest MakeWebRequestERC20(long routeID, long thirdpartyID, long serproDetailID, string password, string sitename, string siteid)
        {
            try
            {
                RouteConfiguration routeConfiguration;
                ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                ServiceProConfiguration ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();

                thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(thirdpartyID);
                var SerProconfigID = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _routeRepository.GetById(routeID);

                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.APIRequestBody;

                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }
                //{"sitename":"#Param2#","site_id":"#Param1#","access_token":"#Param3#","wallet_address":"#Param4#","wallet_key":"#Param5#"}

                //Rushabh 07-05-2019 now onwards following parameters will be fetched from database (ServiceProConfiguration) so commented that code
                //keyValuePairs.Add("#sitename#", sitename);
                //keyValuePairs.Add("#site_id#", siteid);

                if (password != null)
                {
                    keyValuePairs.Add("#password#", password);
                }

                keyValuePairs.Add("#ContractAddress#", String.IsNullOrEmpty(routeConfiguration.ContractAddress) ? "" : routeConfiguration.ContractAddress); if (ServiceProConfiguration != null)
                {
                    keyValuePairs.Add("#Param2#", ServiceProConfiguration.Param2);//sitename
                    keyValuePairs.Add("#Param1#", ServiceProConfiguration.Param1);//siteid
                    keyValuePairs.Add("#Param3#", ServiceProConfiguration.Param3);//accesstoken
                    keyValuePairs.Add("#Param4#", ServiceProConfiguration.Param4);//contract address
                    keyValuePairs.Add("#Param5#", ServiceProConfiguration.Param5);
                }

                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    //thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;

                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequestERC20", ex);
                throw ex;
            }
        }

        public ServiceProConfiguration GetServiceProviderConfiguration(long serproDetailID)
        {
            try
            {
                ServiceProConfiguration ServiceProConfiguration;
                var SerProconfigID = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfiguration.GetSingle(item => item.Id == SerProconfigID);
                return ServiceProConfiguration;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "GetServiceProviderConfiguration", ex);
                throw ex;
            }
        }

        public ThirdPartyAPIRequest ArbitrageMakeWebRequest(long routeID, long thirdpartyID, long serproDetailID, TransactionQueueArbitrage TQ = null, WithdrawERCAdminAddress AdminAddress = null)
        {
            try
            {
                RouteConfigurationArbitrage routeConfiguration;
                ArbitrageThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
                ServiceProConfigurationArbitrage ServiceProConfiguration;
                ThirdPartyAPIRequest thirdPartyAPIRequest = new ThirdPartyAPIRequest();
                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                WebHeaderCollection keyValuePairsHeader = new WebHeaderCollection();

                thirdPartyAPIConfiguration = _ArbitrageThirdPartyAPIConfiguration.GetById(thirdpartyID);
                var SerProconfigObj = _serviceProviderDetail.GetSingle(item => item.Id == serproDetailID);
                var SerProconfigID = SerProconfigObj.ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfigurationArbitrage.GetSingle(item => item.Id == SerProconfigID);
                routeConfiguration = _RouteConfigurationArbitrage.GetById(routeID);

                thirdPartyAPIRequest.RequestURL = thirdPartyAPIConfiguration.APISendURL;
                thirdPartyAPIRequest.RequestBody = thirdPartyAPIConfiguration.APIRequestBody;

                if (thirdPartyAPIConfiguration == null || routeConfiguration == null)
                {
                    return thirdPartyAPIRequest;
                }
                if (ServiceProConfiguration != null)
                {
                    keyValuePairs.Add("#Param1#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param1));
                    keyValuePairs.Add("#Param2#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param2));
                    keyValuePairs.Add("#Param3#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param3));
                    keyValuePairs.Add("#Param4#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param4));
                    keyValuePairs.Add("#Param5#", (String.IsNullOrEmpty(ServiceProConfiguration.Param1) ? "" : ServiceProConfiguration.Param5));
                }

                keyValuePairs.Add("#OPERATORCODE#", routeConfiguration.OpCode);
                keyValuePairs.Add("#ORGADDRESS#", routeConfiguration.ProviderWalletID);// Org Wallet Address/ID  
                if (!string.IsNullOrEmpty(thirdPartyAPIConfiguration.TimeStamp))
                    keyValuePairs.Add("#TIMESTAMP#", Helpers.UTC_To_IST().ToString(thirdPartyAPIConfiguration.TimeStamp));

                if (TQ != null)
                {
                    keyValuePairs.Add("#SMSCODE#", TQ.SMSCode);
                    keyValuePairs.Add("#TRANSACTIONID#", TQ.Id.ToString());
                    keyValuePairs.Add("#AMOUNT#", TQ.Amount.ToString());
                    keyValuePairs.Add("#USERADDRESS#", TQ.TransactionAccount);
                    string amount = "";
                    if (SerProconfigObj.IsStopConvertAmount == 0)
                    {
                        amount = Math.Truncate(routeConfiguration.ConvertAmount * TQ.Amount).ToString();
                    }
                    else
                    {
                        amount = TQ.Amount.ToString(); 
                    }
                    keyValuePairs.Add("#CONVERTEDAMT#", amount); 
                }
                else//In case of Wallet Operation
                {

                }
                if (AdminAddress != null)
                {
                    keyValuePairs.Add("#SITENAME#", _configuration["sitename"].ToString());
                    keyValuePairs.Add("#SITEID#", _configuration["site_id"].ToString());
                    keyValuePairs.Add("#REFID#", AdminAddress.RefKey);
                    keyValuePairs.Add("#FROMADDRESS#", AdminAddress.Address);
                    keyValuePairs.Add("#TOADDRESS#", TQ.TransactionAccount);
                    keyValuePairs.Add("#COIN#", TQ.SMSCode);
                    keyValuePairs.Add("#GASLIMIT#", routeConfiguration.GasLimit.ToString());
                    keyValuePairs.Add("#VALUE#", TQ.Amount.ToString());
                }

                string filename = "testing";
                keyValuePairs.Add("#FilePath#", "C:\\Users\\BcAdmin102\\AppData\\Roaming\\MultiChain\\nups\\" + filename + ".txt");
                foreach (KeyValuePair<string, string> item in keyValuePairs)
                {
                    thirdPartyAPIRequest.RequestURL = thirdPartyAPIRequest.RequestURL.Replace(item.Key, item.Value);
                    if (thirdPartyAPIRequest.RequestBody != null)
                    {
                        thirdPartyAPIRequest.RequestBody = thirdPartyAPIRequest.RequestBody.Replace(item.Key, item.Value);
                    }
                }

                if (thirdPartyAPIConfiguration.AuthHeader != string.Empty)
                {
                    foreach (string mainItem in thirdPartyAPIConfiguration.AuthHeader.Split("###"))
                    {
                        string[] item = mainItem.Split(":");
                        string authInfo = ServiceProConfiguration.UserName + ":" + ServiceProConfiguration.Password;
                        item[1] = item[1].Replace("#BASIC#", Convert.ToBase64String(Encoding.Default.GetBytes(authInfo)));
                        if (item[0] == "Sign") 
                        {
                            string hashSignHeader = hashMACsha512(thirdPartyAPIRequest.RequestBody, item[1]);
                            keyValuePairsHeader.Add(item[0], hashSignHeader);
                        }
                        else
                        {
                            keyValuePairsHeader.Add(item[0], item[1]);
                        }

                    }
                }
                thirdPartyAPIRequest.keyValuePairsHeader = keyValuePairsHeader;

                thirdPartyAPIRequest.DelayAddress = routeConfiguration.IsDelayAddress;
                thirdPartyAPIRequest.walletID = routeConfiguration.ProviderWalletID;
                return thirdPartyAPIRequest;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "MakeWebRequest", ex);
                throw ex;
            }
        }
        public ServiceProConfigurationArbitrage GetServiceProviderConfigurationArbitrage(long serproDetailID)
        {
            try
            {
                ServiceProConfigurationArbitrage ServiceProConfiguration;
                var SerProconfigID = _serviceProviderDetailArbitrage.GetSingle(item => item.Id == serproDetailID).ServiceProConfigID;
                ServiceProConfiguration = _ServiceProConfigurationArbitrage.GetSingle(item => item.Id == SerProconfigID);
                return ServiceProConfiguration;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWebRequest", "GetServiceProviderConfigurationArbitrage", ex);
                throw ex;
            }
        }
    }
}
