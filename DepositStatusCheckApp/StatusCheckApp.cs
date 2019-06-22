﻿using System;
using System.Threading;
using System.Configuration;
using System.Timers;
using System.Data.SqlClient;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.IO;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Core.Interfaces.Repository;
using Microsoft.Extensions.DependencyInjection.Extensions;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Infrastructure;
using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Core.Services;
using Microsoft.AspNetCore.Http;
using CleanArchitecture.Core.Services.RadisDatabase;
using MediatR;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.Interfaces.ControlPanel;

namespace DepositStatusCheckApp
{
    /// <summary>
    /// NOTE : Comment "TransactionTick.Start();" of CallAPI()'s finally statement for testing purpose 
    /// </summary>
    /// <param name="args"></param>

    class StatusCheckApp
    {
        static System.Timers.Timer TransactionTick = new System.Timers.Timer();
        public static IConfiguration Configuration { get; set; }
        static bool IsProcessing = false;
        //private readonly IWalletService _walletService;
        //private readonly IProcessStatusCheck _processStatusCheck;
        ServiceProvider ServiceProviderObj;
        //IWalletTransactionCrDr bar;       

        static void Main(string[] args)
        {
            try
            {
                Console.Write("start");
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json");

                Configuration = builder.Build();

                var conStr = Configuration["SqlServerConnectionString"];
                var serviceProvider = new ServiceCollection()
                .AddLogging()
                // .AddSingleton<IWalletTransactionCrDr, WalletTransactionCrDr>()
                .AddSingleton<IWalletSPRepositories, WalletSPRepository>()
                .AddSingleton<IWalletTQInsert, WalletTQRepository>()
                //.AddSingleton<ICommonRepository<WalletMaster>, EFCommonRepository<WalletMaster>>()
                //.AddSingleton<ICommonRepository<WalletLimitConfiguration>, EFCommonRepository<WalletLimitConfiguration>>()
                .AddSingleton(typeof(ICommonRepository<>), typeof(EFCommonRepository<>))
                //.AddSingleton<ICommonRepository<ThirdPartyAPIConfiguration>, EFCommonRepository<ThirdPartyAPIConfiguration>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<AddressMaster>, EFCommonRepository<AddressMaster>>()
                //.AddSingleton<ICommonRepository<TrnAcBatch>, EFCommonRepository<TrnAcBatch>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<TradeBitGoDelayAddresses>, EFCommonRepository<TradeBitGoDelayAddresses>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                //.AddSingleton<ICommonRepository<BeneficiaryMaster>, EFCommonRepository<BeneficiaryMaster>>()
                //.AddSingleton<ICommonRepository<UserPreferencesMaster>, EFCommonRepository<UserPreferencesMaster>>()
                //.AddSingleton<ICommonRepository<WalletTypeMaster>, EFCommonRepository<WalletTypeMaster>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                .AddSingleton<IWalletRepository, WalletRepository>()
                .AddSingleton<IBackOfficeTrnRepository, BackOfficeTrnRepository>()
                .AddSingleton<ICommonWalletFunction, CommonWalletFunction>()
                .AddSingleton<IWebApiRepository, WebApiDataRepository>()
                .AddTransient<IFrontTrnRepository, FrontTrnRepository>()
                .AddSingleton<RedisConnectionFactory>()
                 .AddSingleton<IMessageConfiguration, MessageConfiguration>()
                 .AddMemoryCache()
                 .AddSingleton<SqlConnectionFactory>()
               .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
               .AddSingleton<IMessageService, MessageService>()
                //.AddSingleton<IWebApiParseResponse, WebApiParseResponse>()
                .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
                .AddSingleton<IGetWebRequest, GetWebRequest>()
                .AddTransient<ISignalRService, SignalRService>()
                .AddSingleton<IMediator, Mediator>()
                .AddDbContext<CleanArchitectureContext>(options => options.UseSqlServer(conStr))
                .AddTransient<UserResolveService>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .AddScoped<ServiceFactory>(p => type => p.GetService(type))
                .AddScoped<IMediator, Mediator>()
                .AddScoped<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
                .AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddTransient<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
              //.AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddSingleton<RedisConnectionFactory>() 
              // .AddSingleton<ISignalRQueue, BackgroundSignalRTaskQueue>()
              // .AddSingleton<IPushNotificationsQueue<>, PushNotificationsQueue<>>()
              .AddSingleton<IPushNotificationsQueue<SendSMSRequest>, PushNotificationsQueue<SendSMSRequest>>()
                .AddSingleton<IWalletDeposition, WalletDeposition>()
              .AddSingleton<IPushNotificationsQueue<SendEmailRequest>, PushNotificationsQueue<SendEmailRequest>>()
                .BuildServiceProvider();

                IWalletDeposition bar = serviceProvider.GetService<IWalletDeposition>();
                //Console.WriteLine("Hello World!");

                string SqlStr = string.Empty;
                DataSet dSet = new DataSet();
                SqlStr = "SELECT top 1 * from DepositionInterval where Status='1'";
                //dSet = (new DataCommon()).OpenDataSet("DepositionInterval", SqlStr, dSet, 30);
                //if (dSet.Tables[0].Rows.Count > 0)
                //{
                //    TransactionTick.Interval = Convert.ToInt64(dSet.Tables[0].Rows[0]["DepositStatusCheckInterval"]);
                //}
                //else
                //{
                //    TransactionTick.Interval = Convert.ToInt64(Configuration["Interval"]); // 1000;
                //}
                TransactionTick.Interval = Convert.ToInt64(Configuration["Interval"]); // 1000;
                TransactionTick.Elapsed += new ElapsedEventHandler(transaction_tick);
                TransactionTick.Start();
                //CallAPI();// ntrivedi temperory
                //SetConsoleCtrlHandler(new HandlerRoutine(ConsoleCtrlCheck), true); //komal 10/9/20108 process rudely exits, 
                Console.WriteLine("Press \'q\' to quit");
                while (Console.Read() != 'q') ;
                CommonFunctions.WriteRequestLog("Application Starts On : " + UTC_To_IST(), "transaction_tick", "");
            }

            catch (Exception ex)
            {
                // new ProcessStatusCheck().WriteErrorLog(ex, "transaction_tick", ex.Source.ToString());
                CommonFunctions.WriteErrorLog(ex, "Program", "Main");
                ex = null;
            }
        }


        #region TimerTick
        private static void transaction_tick(object sender, System.EventArgs e)
        {
            try
            {
                TransactionTick.Stop();
                //TransactionTick.Interval = 18000000; // For Testing temperory ntrivedi
                CallAPI();
                TransactionTick.Start();  //ntrivedi 27-10-2018 temperory test

            }
            catch (Exception ex)
            {
                // new ProcessStatusCheck().WriteErrorLog(ex, "transaction_tick", ex.Source.ToString());
                CommonFunctions.WriteErrorLog(ex, "Program", "transaction_tick");
            }
            finally
            {
                TransactionTick.Start();
            }
        }
        #endregion

        #region classDeclaration
        public class walletServiceData
        {
            public Int32 ServiceID { get; set; }
            public string SMSCode { get; set; }
            public int WallletStatus { get; set; }
            public int ServiceStatus { get; set; }
            public int RecordCount { get; set; }
            public int AppType { get; set; }
            public long SerProID { get; set; }
            public string RouteTag { get; set; }
            public int FlushAddressEnable { get; set; }

            // public int ValidDays { get; set; } 
        }
        public class CommonMethods
        {
            public string TransactionFile;
            public string trnID;
            public string Authorization;
            public string enterprise;
            public string line;
            public string LeftTitle = null;
            public string[] StaticArray = new string[20];
            public char MainSaperator = ':';
            public int StaticCnt = 1;
            public string TrnLeftTitle = null;
            public StreamReader MsgFile;
            public string RequestType;
            public string Path_AddressGenerate, Path_CustomerDetail, Path_CustomerValidate, Path_CustomerRegistration, Path_BeneRegistration, Path_VerifyBeneficiary, Path_DeleteBeneficiary, Path_VerifyDeleteBeneficiary, PubKey, Path_GetReceipt;
            public string Str_URL = string.Empty;
            public string Str_RequestType;
            public string ContentType;
            public string Address1, Address2;
            public string ReturnMsg1, ReturnMsg2;
            public string SuccAPICodes;
            public string[] SuccAPICodesArray = new string[10];
            public string MatchRegex2;
            public string BeneActiveCode;
            public string DepositHistoryResponse;
            public List<RespTransfers> Transfers { get; set; }
            public string SqlStr = string.Empty;
            public DataSet dSet = new DataSet();
            public DataRow dRows = null;
            public string SMSCode = string.Empty;
            public int FlushAddressEnable = 0;
            public int Category;
            public string UserName;
            public string AssetName;
            public string Password;
            public string RequestBody;
            public string AssetFromRequest;
            public long DMemberID;
            public List<RespLocalCoin> RespLocalCoins { get; set; }
            public decimal ConvertAmt { get; set; } // ntrivedi
            public string ProviderWalletID { get; set; }
            public int ConfirmationCount { get; set; }
            public string Address = string.Empty;
            //private readonly IWalletService _walletService;




            //public CommonMethods(IWalletService walletService)
            //{
            //    _walletService = walletService;
            //}

            //public WalletDrCrResponse callDepencency()
            //{

            //    try
            //    {

            //    }
            //    catch (Exception ex)
            //    {
            //        //ex = null;
            //        WriteErrorLog(ex, "Program", "CallAPI");
            //    }
            //}

        }
        enum EnAppType
        {
            BitGoAPI = 1,
            CryptoAPI = 2,
            EtherScan = 3,
            TRCAPI = 4,
            TRC10TokenAPI = 5,
            TRC20TokenAPI = 6,
            NEOAPI = 7
        }

        public class RespTransfers
        {
            public long id { get; set; } // ntrivedi 28-05-2018 string to long
            public string coin { get; set; }
            public string wallet { get; set; }
            public string txid { get; set; }
            public string address { get; set; }
            public string fromAddress { get; set; }
            //public int height { get; set; }
            //public DateTime date { get; set; }
            public long confirmations { get; set; }
            public long value { get; set; }
            //public string valueString { get; set; }
            //public string feeString { get; set; }
            //public int payGoFee { get; set; }
            //public string payGoFeeString { get; set; }
            //public double usd { get; set; }
            //public double usdRate { get; set; }
            public string state { get; set; }
            //public IList<string> tags { get; set; }
            public string confirmedTime { get; set; }
            public string unconfirmedTime { get; set; }
            public string createdTime { get; set; }
            public bool IsValid { get; set; }
            public decimal Amount { get; set; }
            public long OrderId { get; set; }
            public string valueStr { get; set; }
        }

        public class RespLocalCoin
        {
            public long confirmations { get; set; }
            public string txid { get; set; }
            public string address { get; set; }
            public string confirmedTime { get; set; }
            public string unconfirmedTime { get; set; }
            public int value { get; set; }
            public decimal Amount { get; set; }
        }
        #endregion


        #region CallBackProcess
        public static void CallAPI()
        {
            string SqlStr = string.Empty;
            DataSet dSet = new DataSet();
            try
            {

                SqlStr = " SELECT DC.FlushAddressEnable,DC.AppType As AppType,SM.Id as ServiceID , SM.SMSCode,WM.Status AS WalletStatus , SM.Status AS ServiceStatus ,PM.ProviderName,DC.SerProId " +
                " FROM WalletTypeMasters WM INNER JOIN ServiceMaster SM ON SM.WalletTypeID=WM.Id  inner join DepositCounterMaster DC on DC.WalletTypeID = sm.WalletTypeID  inner join ServiceProviderMaster PM on PM.Id= DC.SerProId WHERE WM.status = 1 and WM.IsDepositionAllow = 1  and DC.Status = 1  and sm.Id=1000058";//Temp and sm.Id=1000052
                dSet = (new DataCommon()).OpenDataSet("WalletTypeMasters", SqlStr, dSet, 30);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        // Need common row object for each SMScode
                        walletServiceData walletServiceDataObj = new walletServiceData();
                        walletServiceDataObj.ServiceID = Convert.ToInt32(dRow["ServiceID"]);
                        walletServiceDataObj.SMSCode = dRow["SMSCode"].ToString();
                        walletServiceDataObj.WallletStatus = Convert.ToInt16(dRow["WalletStatus"]);
                        walletServiceDataObj.ServiceStatus = Convert.ToInt16(dRow["ServiceStatus"]);
                        walletServiceDataObj.AppType = Convert.ToInt16(dRow["AppType"]); // 2 for Local Coin
                                                                                         //   walletServiceDataObj.ValidDays = Convert.ToInt16(dRow["ValidDays"]); // komal 10/9/2018 get valid days from Table
                                                                                         //walletServiceDataObj.DeliveryRowsCount  = Convert.ToInt16(dRow["DeliveryRowsCount"]); // komal 10/9/2018 get Top count days from Table
                        walletServiceDataObj.RecordCount = 1; //komal 10/9/2018  temperory ntrivedi
                        walletServiceDataObj.SerProID = Convert.ToInt64(dRow["SerProID"]); // ntrivedi added 14-12-2018
                        walletServiceDataObj.RouteTag = dRow["ProviderName"].ToString(); // ntrivedi added 14-12-2018
                        walletServiceDataObj.FlushAddressEnable = Convert.ToInt32(dRow["FlushAddressEnable"]);
                        Console.Title = walletServiceDataObj.SMSCode + " Topup "; // ntrivedi easy to find 13-09-2018

                        CommonFunctions.WriteRequestLog("new timer call ", "CallAPI", walletServiceDataObj.SMSCode);
                        lock (walletServiceDataObj)
                        {
                            //isreturnwithfailure = false;
                            if (IsProcessing == false) //NTRIVEDI TEMPERORY
                            {
                                //isreturnwithfailure = true;
                                //Console.WriteLine("new timer call" + UTC_To_IST());
                                WaitCallback callBack;
                                callBack = new WaitCallback(CallAPISingle); // create thread for each SMSCode
                                ThreadPool.QueueUserWorkItem(callBack, walletServiceDataObj);
                            }
                            else
                            {
                                CommonFunctions.WriteRequestLog("IsProcessing = true so return", "CallAPI", walletServiceDataObj.SMSCode, Action: 2);
                            }

                            // Thread.Sleep(10000);
                            //}
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //ex = null;
                CommonFunctions.WriteErrorLog(ex, "Program", "CallAPI");
            }
            finally
            {
                //TransactionTick.Start(); //ntrivedi temperory 28-06-2018
            }
        }
        #endregion

        //#region Logging
        //public static void WriteLogIntoFile(byte CheckReq_Res, DateTime Date, string MethodName, string Controllername, string Req_Res = null, string accessToken = null)
        //{
        //    var logger = NLog.LogManager.GetCurrentClassLogger();
        //    try
        //    {
        //        if (CheckReq_Res == 1)
        //        {
        //            logger.Info("\nDate:" + Date + "\nMethodName:" + MethodName + ", Controllername: " + Controllername + "\nAccessToken: " + accessToken + "\nRequest: " + Req_Res + "\n===================================================================================================================");
        //        }
        //        else //if(CheckReq_Res==2)
        //        {
        //            logger.Info("\nDate:" + Date + "\nMethodName:" + MethodName + ", Controllername: " + Controllername + "\nResponse: " + Req_Res + "\n===================================================================================================================");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex);
        //    }
        //}
        //public static void WriteErrorLog(Exception ex, string methodName, string Source, string OtherInfo = "")
        //{
        //    var logger = NLog.LogManager.GetCurrentClassLogger();
        //    try
        //    {
        //        logger.Error("\nDate:" + UTC_To_IST() + "\nMethodName:" + methodName + ",Controllername: " + Source + "\nError: " + ex.Message + "\nOtherInfo:" + OtherInfo + "===================================================================================================================");
        //    }
        //    catch (Exception ex1)
        //    {
        //        logger.Error(ex1);
        //    }
        //}
        //public static void WriteRequestLog(string inputString, string methodName, string APIName, int IsAllow = 1, int Action = 1)
        //{
        //    string strFilePath = string.Empty;
        //    try
        //    {
        //        if (IsAllow == 1) //komal 12-9-2018 write log or not
        //        {
        //            //OperationContext context = OperationContext.Current;
        //            //MessageProperties prop = context.IncomingMessageProperties;
        //            //RemoteEndpointMessageProperty endpoint =
        //            //    prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
        //            string ip = "";
        //            string dir = AppDomain.CurrentDomain.BaseDirectory + "\\LogFiles\\";
        //            //If Not Directory.Exists(dir) Then
        //            //    Directory.CreateDirectory(dir)
        //            //End If
        //            strFilePath = (dir + APIName + "Log" + Convert.ToString("_")) + UTC_To_IST().ToString("yyyyMMdd") + ".txt";

        //            dynamic maxRetry = 2;

        //            //for Error: The process cannot access the file because it is being used by another process
        //            for (int retry = 0; retry <= maxRetry - 1; retry++)
        //            {
        //                try
        //                {
        //                    if (Action == 1) //komal 12-9-2018 multi line log
        //                    {
        //                        using (StreamWriter sw = new StreamWriter(strFilePath, true))
        //                        {
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", System.Web.HttpContext.Current.Request.UserHostAddress.ToString());
        //                            sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            sw.WriteLine((Convert.ToString("-----> ") + methodName) + " " + " Time " + UTC_To_IST());
        //                            sw.WriteLine(" Response : {0}", inputString);
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            //sw.WriteLine("");
        //                            sw.Flush();
        //                            sw.Close();
        //                        }
        //                        break;
        //                    }
        //                    else if (Action == 2) // komal 12-9-2018 two line log
        //                    {
        //                        using (StreamWriter sw = new StreamWriter(strFilePath, true))
        //                        {
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", System.Web.HttpContext.Current.Request.UserHostAddress.ToString());
        //                            sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            sw.WriteLine((Convert.ToString("-----> ") + methodName) + ":" + " Time " + UTC_To_IST() + ": Response - {0}", inputString);
        //                            //sw.WriteLine(" Response : {0}", inputString);
        //                            //sw.WriteLine("");
        //                            sw.Flush();
        //                            sw.Close();
        //                        }
        //                        break;
        //                    }
        //                    // TODO: might not be correct. Was : Exit For
        //                    //'Exit if success, either write three times
        //                }
        //                catch (IOException generatedExceptionName)
        //                {
        //                    if (retry < maxRetry - 1)
        //                    {
        //                        WriteErrorLog(generatedExceptionName, "Statuscheck app", "WriteRequestLog -Retry:Sleep");
        //                        // Wait some time before retry (2 secs)
        //                        Thread.Sleep(2000);
        //                        // handle unsuccessfull write attempts or just ignore.
        //                    }
        //                    else
        //                    {
        //                        WriteErrorLog(generatedExceptionName, "Statuscheck app", "WriteRequestLog-Retry Complete");
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        WriteErrorLog(ex, "Status check app", System.Reflection.MethodBase.GetCurrentMethod().Name + ":" + methodName);
        //        ex = null;
        //    }
        //}
        //#endregion

        #region CommonFunction

        private static void GetHistory(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            DataRow dRows = null;
            string SqlStr = string.Empty;
            decimal amount = 0;
            long trnno = 0;
            long autono = 0;
            string queryResult = "";
            int dayDiff = 1;
            try
            {
                //isreturnwithfailure = false;
                //if (IsProcessing)
                //{
                //    isreturnwithfailure = true;
                //    logs.WriteRequestLog("IsProcessing = true so return ", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
                //    return;
                //}
                //logs.WriteRequestLog("Fetching Rows :  " , "GetHistory", CommonMethod.SMSCode);
                //  dayDiff = walletServiceDataObj.ValidDays; //komal 10/9/2018 get valid days from table
                //dayDiff = (Configuration["DayDiff"] != string.Empty? Convert.ToInt16(Configuration["DayDiff"]):1);
                // ntrivedi 28-05-2018 temperory top 1
                CommonFunctions.WriteRequestLog("GetHistory ", "GetHistory", CommonMethod.SMSCode, Action: 2);
                SqlStr = "SELECT top " + walletServiceDataObj.RecordCount.ToString() + " ID, TrnID , Address, SMSCode, Amount, Confirmations,OrderID,isNull(FromAddress,'') as FromAddress From DepositHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0 and SerProID=" + walletServiceDataObj.SerProID + " order by updateddate"; // ntrivedi temperory order by updateddate
                dSet = (new DataCommon()).OpenDataSet("DepositHistory", SqlStr, dSet, 30);
                CommonFunctions.WriteRequestLog("GetHistory ", "GetHistory Query: " + SqlStr, CommonMethod.SMSCode, Action: 2);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    //logs.WriteRequestLog("Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]),Action: 2);
                    Console.WriteLine("Fetch Rows:" + dSet.Tables[0].Rows.Count + " for Coin" + CommonMethod.SMSCode);
                    IsProcessing = true;
                    CommonFunctions.WriteRequestLog("IsProcessing = true + Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2); // komal 10/9/2018 log for IsProcessing = true
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE Id = " + dRow["ID"].ToString() + ""; //ntrivedi 28-05-2018 trnid instead of AutoNo due to slow searching on TrnID
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                    //IsProcessing = false;  //komal 10/9/2018 move to CallAPISingle()
                    CommonFunctions.WriteRequestLog("Total Count :" + dSet.Tables[0].Rows.Count + " IsProcessing :" + IsProcessing.ToString(), "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);//komal 10/9/2018 test
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        trnID = dRow["TrnID"].ToString();
                        amount = 0;
                        autono = Convert.ToInt64(dRow["ID"]);
                        CommonFunctions.WriteRequestLog("New Loop TrnID :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

                        String Response = CallThirdPartyAPI(ref CommonMethod, trnID, CommonMethod.Authorization, CommonMethod.enterprise, dSet); // Generate ThirdParty API Response

                        //; /*CallThirdPartyCryptoAPI(ref CommonMethod, dRow["Address"].ToString(), dRow["TrnID"].ToString(), dRow["AutoNo"].ToString())*/
                        if (Response == string.Empty) // ntrivedi 28-05-2018
                        {
                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,updateddate=dbo.getistdate() WHERE ID = " + dRow["ID"].ToString() + "";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonFunctions.WriteRequestLog("Thirdparty Response Null for TrnID :  " + dRow["TrnID"].ToString(), "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                            continue;
                        }
                        BitGoResponses TPGenerateResponse = new BitGoResponses();
                        RespTransfers transferObj = new RespTransfers();
                        TPGenerateResponse = JsonConvert.DeserializeObject<BitGoResponses>(Response);
                        //JObject GenerateResponse = JObject.Parse(Response);
                        if (TPGenerateResponse != null)
                        {
                            if (TPGenerateResponse.coin.ToLower() == CommonMethod.SMSCode.ToLower()) // For BTC , BTG , BCH Response remove type receive condition ntrivedi 07-01-2018
                            {
                                if (TPGenerateResponse.entries != null)
                                {
                                    string trnid = dRow["TrnID"].ToString();
                                    trnid = dRow["SMSCode"].ToString();

                                    if (TPGenerateResponse.txid == (dRow["TrnID"]).ToString() && TPGenerateResponse.coin.ToLower() == (dRow["SMSCode"]).ToString().ToLower())
                                    {
                                        if (TPGenerateResponse.entries != null)
                                        {
                                            foreach (var iv in TPGenerateResponse.entries)
                                            {
                                                if (!string.IsNullOrEmpty(iv.address) && iv.value > 0)
                                                {
                                                    if (iv.value <= 0)
                                                    {
                                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative amount' WHERE ID = " + dRow["ID"].ToString() + "";
                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                        continue;
                                                    }
                                                    if (iv.address.ToString() == dRow["address"].ToString() && iv.wallet == CommonMethod.ProviderWalletID)
                                                    {
                                                        // iv["address"] = iv["address"].ToString();
                                                        //iv["Amount"] = Convert.ToDecimal(iv["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(iv["btc"])]);
                                                        amount = Math.Round((iv.value / CommonMethod.ConvertAmt), 8);
                                                        transferObj.id = Convert.ToInt64(dRow["ID"]);
                                                        transferObj.Amount = Convert.ToDecimal(amount);
                                                        transferObj.coin = CommonMethod.SMSCode;
                                                        transferObj.txid = TPGenerateResponse.txid;
                                                        // transferObj.Value = Convert.ToDecimal(dRow["Value"]);
                                                        transferObj.OrderId = Convert.ToInt64(dRow["OrderID"]);
                                                        transferObj.address = dRow["Address"].ToString();
                                                        transferObj.fromAddress = dRow["FromAddress"].ToString();
                                                        transferObj.confirmations = TPGenerateResponse.confirmations;
                                                        if (transferObj.confirmations < 0) //ntrivedi treat as failed 26-07-2018
                                                        {
                                                            CommonFunctions.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode, Action: 2);
                                                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative confirmation' WHERE ID = " + dRow["ID"].ToString() + "";
                                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                                            continue;
                                                        }

                                                        //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);
                                                        transferObj.valueStr = TPGenerateResponse.valueString;
                                                        transferObj.unconfirmedTime = TPGenerateResponse.unconfirmedTime.ToString();
                                                        transferObj.confirmedTime = TPGenerateResponse.confirmedTime.ToString();
                                                        CommonMethod.Transfers.Add(transferObj);
                                                    }
                                                    else
                                                    {
                                                        //SqlStr = dRow["address"].ToString(); //temperory
                                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch walletid or address' WHERE Address='" + iv.address.ToString() + "' and ID = " + dRow["ID"].ToString() + "";
                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='thirparty amount not found' WHERE ID = " + dRow["ID"].ToString() + "";
                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                }
                            }

                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='error not null Thirpdarty response' WHERE ID = " + dRow["ID"].ToString() + "";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                            CommonFunctions.WriteRequestLog("Loop done :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        }

                        Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                    }
                }
            }
            catch (Exception ex)
            {
                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + autono + "";
                (new DataCommon()).ExecuteQuery(SqlStr);
                CommonFunctions.WriteErrorLog(ex, "Program", "GetHistory");
            }
        }

        //Uday 09-02-2019  For EtherScan API Get History
        private static void GetHistoryEtherScan(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            long autono = 0;
            try
            {

                CommonFunctions.WriteRequestLog("GetHistoryEtherScan ", "GetHistoryEtherScan", CommonMethod.SMSCode, Action: 2);
                SqlStr = "SELECT top " + walletServiceDataObj.RecordCount.ToString() + " ID, TrnID , Address, SMSCode, Amount, Confirmations,OrderID,isNull(FromAddress,'') as FromAddress From DepositHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0 and SerProID=" + walletServiceDataObj.SerProID + " order by updateddate"; // ntrivedi temperory order by updateddate
                dSet = (new DataCommon()).OpenDataSet("DepositHistory", SqlStr, dSet, 30);
                CommonFunctions.WriteRequestLog("GetHistoryEtherScan ", "GetHistoryEtherScan Query: " + SqlStr, CommonMethod.SMSCode, Action: 2);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    //logs.WriteRequestLog("Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]),Action: 2);
                    Console.WriteLine("Fetch Rows:" + dSet.Tables[0].Rows.Count + " for Coin" + CommonMethod.SMSCode);
                    IsProcessing = true;
                    CommonFunctions.WriteRequestLog("IsProcessing = true + Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2); // komal 10/9/2018 log for IsProcessing = true
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE Id = " + dRow["ID"].ToString() + ""; //ntrivedi 28-05-2018 trnid instead of AutoNo due to slow searching on TrnID
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }

                    //IsProcessing = false;  //komal 10/9/2018 move to CallAPISingle()
                    CommonFunctions.WriteRequestLog("Total Count :" + dSet.Tables[0].Rows.Count + " IsProcessing :" + IsProcessing.ToString(), "GetHistoryEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);//komal 10/9/2018 test
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        trnID = dRow["TrnID"].ToString();
                        autono = Convert.ToInt64(dRow["ID"]);
                        CommonFunctions.WriteRequestLog("New Loop TrnID :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

                        String Response = CallThirdPartyEtherScanAPI(ref CommonMethod, trnID, CommonMethod.Authorization, CommonMethod.enterprise, dSet); // Generate ThirdParty API Response

                        if (Response == string.Empty) // ntrivedi 28-05-2018
                        {
                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,updateddate=dbo.getistdate() WHERE ID = " + dRow["ID"].ToString() + "";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonFunctions.WriteRequestLog("Thirdparty Response Null for TrnID :  " + dRow["TrnID"].ToString(), "GetHistoryEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                            continue;
                        }
                        ERC20Response TPGenerateResponse = new ERC20Response();
                        RespTransfers transferObj = new RespTransfers();
                        TPGenerateResponse = JsonConvert.DeserializeObject<ERC20Response>(Response);

                        if (TPGenerateResponse != null)
                        {
                            if (TPGenerateResponse.isError == false)
                            {
                                string trnid = dRow["TrnID"].ToString();
                                trnid = dRow["SMSCode"].ToString();

                                if (trnID == TPGenerateResponse.txnid)
                                {
                                    transferObj.id = Convert.ToInt64(dRow["ID"]);
                                    transferObj.Amount = Convert.ToDecimal(dRow["Amount"]);
                                    transferObj.coin = CommonMethod.SMSCode;
                                    transferObj.txid = TPGenerateResponse.txnid;
                                    transferObj.OrderId = Convert.ToInt64(dRow["OrderID"]);
                                    transferObj.address = dRow["Address"].ToString();
                                    transferObj.fromAddress = dRow["FromAddress"].ToString();
                                    transferObj.confirmations = TPGenerateResponse.confirmations;
                                    if (transferObj.confirmations < 0) //ntrivedi treat as failed 26-07-2018
                                    {
                                        CommonFunctions.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistoryEtherScan", CommonMethod.SMSCode, Action: 2);
                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative confirmation' WHERE ID = " + dRow["ID"].ToString() + "";
                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                        continue;
                                    }
                                    CommonMethod.Transfers.Add(transferObj);
                                }
                                else
                                {
                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch transaction id' WHERE ID = " + dRow["ID"].ToString() + "";
                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                }
                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='error not null Thirpdarty response' WHERE ID = " + dRow["ID"].ToString() + "";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                            CommonFunctions.WriteRequestLog("Loop done :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        }
                        Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                    }
                }
            }
            catch (Exception ex)
            {
                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + autono + "";
                (new DataCommon()).ExecuteQuery(SqlStr);
                CommonFunctions.WriteErrorLog(ex, "Program", "GetHistoryEtherScan");
            }
        }

        private static void GetHistoryTron(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            long autono = 0;
            try
            {

                CommonFunctions.WriteRequestLog("GetHistoryTron ", "GetHistoryTron", CommonMethod.SMSCode, Action: 2);
                SqlStr = "SELECT top " + walletServiceDataObj.RecordCount.ToString() + " ID, TrnID , Address, SMSCode, Amount, Confirmations,OrderID,isNull(FromAddress,'') as FromAddress From DepositHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0 and SerProID=" + walletServiceDataObj.SerProID + " order by updateddate ";///and id = 5887///Temp
                dSet = (new DataCommon()).OpenDataSet("DepositHistory", SqlStr, dSet, 30);
                CommonFunctions.WriteRequestLog("GetHistoryTron ", "GetHistoryTron Query: " + SqlStr, CommonMethod.SMSCode, Action: 2);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    Console.WriteLine("Fetch Rows:" + dSet.Tables[0].Rows.Count + " for Coin" + CommonMethod.SMSCode);
                    IsProcessing = true;
                    CommonFunctions.WriteRequestLog("IsProcessing = true + Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2); // komal 10/9/2018 log for IsProcessing = true
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE Id = " + dRow["ID"].ToString() + "";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                    CommonFunctions.WriteRequestLog("Total Count :" + dSet.Tables[0].Rows.Count + " IsProcessing :" + IsProcessing.ToString(), "GetHistoryTron", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);//komal 10/9/2018 test
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        trnID = dRow["TrnID"].ToString();
                        autono = Convert.ToInt64(dRow["ID"]);
                        CommonFunctions.WriteRequestLog("New Loop TrnID :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryTron", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

                        //--2019-5-20 Receipt Start
                        CommonMethods commonMethodsObj = new CommonMethods();
                        ReadMasterFile("Receipt_" + walletServiceDataObj.RouteTag, ref commonMethodsObj); // Read  Master File
                        if (!string.IsNullOrEmpty(commonMethodsObj.Path_GetReceipt))
                        {
                            ReadTransactionalFile(commonMethodsObj.Path_GetReceipt, ref commonMethodsObj); // Read Transaction file for specific coin               
                            if (!string.IsNullOrEmpty(commonMethodsObj.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(commonMethodsObj.ContentType))
                            {
                                String ReceiptResponse = CallThirdPartyTronAPI(ref commonMethodsObj, trnID, "", "", dSet);
                                if (ReceiptResponse != null)
                                {
                                    ReceiptResponse RResponse = new ReceiptResponse();
                                    RResponse = JsonConvert.DeserializeObject<ReceiptResponse>(ReceiptResponse);

                                    if (RResponse != null)
                                    {
                                        if (RResponse.isError == 0)
                                        {
                                            if (RResponse.status == "SUCCESS")
                                            {
                                                String Response = CallThirdPartyTronAPI(ref CommonMethod, trnID, "", "", dSet);
                                                if (Response == string.Empty)
                                                {
                                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,updateddate=dbo.getistdate() WHERE ID = " + dRow["ID"].ToString() + "";
                                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                                    CommonFunctions.WriteRequestLog("Thirdparty Response Null for TrnID :  " + dRow["TrnID"].ToString(), "GetHistoryTron", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                                                    continue;
                                                }
                                                TRNOResponse TPGenerateResponse = new TRNOResponse();
                                                RespTransfers transferObj = new RespTransfers();
                                                TPGenerateResponse = JsonConvert.DeserializeObject<TRNOResponse>(Response);

                                                if (TPGenerateResponse != null)
                                                {
                                                    if (TPGenerateResponse.isError == 0)
                                                    {
                                                        //string trnid = dRow["TrnID"].ToString();
                                                        var trnid = dRow["SMSCode"].ToString();

                                                        if (trnID == TPGenerateResponse.txn_id)
                                                        {
                                                            transferObj.id = Convert.ToInt64(dRow["ID"]);
                                                            transferObj.Amount = Convert.ToDecimal(dRow["Amount"]);
                                                            transferObj.coin = CommonMethod.SMSCode;
                                                            transferObj.txid = TPGenerateResponse.txn_id;
                                                            transferObj.OrderId = Convert.ToInt64(dRow["OrderID"]);
                                                            transferObj.address = dRow["Address"].ToString();
                                                            transferObj.fromAddress = dRow["FromAddress"].ToString();
                                                            transferObj.confirmations = TPGenerateResponse.confirmations;
                                                            if (transferObj.confirmations < 0)
                                                            {
                                                                CommonFunctions.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistoryTron", CommonMethod.SMSCode, Action: 2);
                                                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative confirmation' WHERE ID = " + dRow["ID"].ToString() + "";
                                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                                                continue;
                                                            }
                                                            CommonMethod.Transfers.Add(transferObj);
                                                        }
                                                        else
                                                        {
                                                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch transaction id' WHERE ID = " + dRow["ID"].ToString() + "";
                                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                                        }
                                                    }
                                                    else
                                                    {
                                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='error not null Thirpdarty response' WHERE ID = " + dRow["ID"].ToString() + "";
                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                    }
                                                    CommonFunctions.WriteRequestLog("Loop done :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryTron", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                                                }
                                                Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                                            }
                                            else
                                            {
                                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='Invalid Response' WHERE ID = " + dRow["ID"].ToString() + "";
                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                            }
                                        }
                                        else
                                        {
                                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='Invalid Response' WHERE ID = " + dRow["ID"].ToString() + "";
                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                        }
                                    }
                                    else
                                    {
                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='Invalid Response' WHERE ID = " + dRow["ID"].ToString() + "";
                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                    }
                                }
                                else
                                {
                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='Invalid Response' WHERE ID = " + dRow["ID"].ToString() + "";
                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                }
                            }
                            else
                            {
                                CommonFunctions.WriteRequestLog("Transaction Detail not found", "GetHistoryTron", CommonMethod.SMSCode, Action: 2);
                            }
                            //--Receipt end
                        }
                        else
                        {
                            CommonFunctions.WriteRequestLog("Master Detail not found", "GetHistoryTron", CommonMethod.SMSCode, Action: 2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + autono + "";
                (new DataCommon()).ExecuteQuery(SqlStr);
                CommonFunctions.WriteErrorLog(ex, "Program", "GetHistoryTron");
            }

        }

        private static void GetHistoryNEO(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            long autono = 0;
            try
            {

                CommonFunctions.WriteRequestLog("GetHistoryNEO ", "GetHistoryNEO", CommonMethod.SMSCode, Action: 2);
                SqlStr = "SELECT top " + walletServiceDataObj.RecordCount.ToString() + " ID, TrnID , Address, SMSCode, Amount, Confirmations,OrderID,isNull(FromAddress,'') as FromAddress From DepositHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0 and SerProID=" + walletServiceDataObj.SerProID + " order by updateddate ";///and id = 5887///Temp
                dSet = (new DataCommon()).OpenDataSet("DepositHistory", SqlStr, dSet, 30);
                CommonFunctions.WriteRequestLog("GetHistoryNEO ", "GetHistoryNEO Query: " + SqlStr, CommonMethod.SMSCode, Action: 2);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    Console.WriteLine("Fetch Rows:" + dSet.Tables[0].Rows.Count + " for Coin" + CommonMethod.SMSCode);
                    IsProcessing = true;
                    CommonFunctions.WriteRequestLog("IsProcessing = true + Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE Id = " + dRow["ID"].ToString() + "";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                    CommonFunctions.WriteRequestLog("Total Count :" + dSet.Tables[0].Rows.Count + " IsProcessing :" + IsProcessing.ToString(), "GetHistoryNEO", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);//komal 10/9/2018 test
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        trnID = dRow["TrnID"].ToString();
                        autono = Convert.ToInt64(dRow["ID"]);
                        CommonFunctions.WriteRequestLog("New Loop TrnID :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryNEO", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

                        String Response = CallThirdPartyNEOAPI(ref CommonMethod, trnID, "", "", dSet);
                        if (Response == string.Empty)
                        {
                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,updateddate=dbo.getistdate() WHERE ID = " + dRow["ID"].ToString() + "";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonFunctions.WriteRequestLog("Thirdparty Response Null for TrnID :  " + dRow["TrnID"].ToString(), "GetHistoryNEO", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                            continue;
                        }
                        NeoMainClassRes TPGenerateResponse = new NeoMainClassRes();
                        RespTransfers transferObj = new RespTransfers();
                        TPGenerateResponse = JsonConvert.DeserializeObject<NeoMainClassRes>(Response);

                        if (TPGenerateResponse != null)
                        {
                            //string trnid = dRow["TrnID"].ToString();
                            var SMSCode = dRow["SMSCode"].ToString();

                            for (int i = 0; i < TPGenerateResponse.vouts.Count; i++)
                            {
                                if (trnID == TPGenerateResponse.txid && TPGenerateResponse.txid == TPGenerateResponse.vouts[i].txid)
                                {
                                    if (TPGenerateResponse.vouts[i].address_hash == dRow["Address"].ToString())
                                    {
                                        if (TPGenerateResponse.vouts[i].value == Convert.ToDecimal(dRow["Amount"]))
                                        {
                                            if (TPGenerateResponse.vouts[i].asset == dRow["SMSCode"].ToString())
                                            {
                                                transferObj.id = Convert.ToInt64(dRow["ID"]);
                                                transferObj.Amount = Convert.ToDecimal(dRow["Amount"]);
                                                transferObj.coin = CommonMethod.SMSCode;
                                                transferObj.txid = TPGenerateResponse.txid;
                                                transferObj.OrderId = Convert.ToInt64(dRow["OrderID"]);
                                                transferObj.address = dRow["Address"].ToString();
                                                transferObj.fromAddress = dRow["FromAddress"].ToString();
                                                transferObj.confirmations = (GetConfirmationCount() - TPGenerateResponse.block_height);// 1;// TPGenerateResponse.confirmations;
                                                if (transferObj.confirmations < 0)
                                                {
                                                    CommonFunctions.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistoryNEO", CommonMethod.SMSCode, Action: 2);
                                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative confirmation' WHERE ID = " + dRow["ID"].ToString() + "";
                                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                                    continue;
                                                }
                                                CommonMethod.Transfers.Add(transferObj);
                                            }
                                            else
                                            {
                                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch SMSCode' WHERE ID = " + dRow["ID"].ToString() + "";
                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                            }
                                        }
                                        else
                                        {
                                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch Amount' WHERE ID = " + dRow["ID"].ToString() + "";
                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                        }
                                    }
                                    else
                                    {
                                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch Address' WHERE ID = " + dRow["ID"].ToString() + "";
                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                    }
                                }
                                else
                                {
                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch transaction id' WHERE ID = " + dRow["ID"].ToString() + "";
                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                }
                            }

                            CommonFunctions.WriteRequestLog("Loop done :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistoryNEO", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        }
                        Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                    }
                }
            }
            catch (Exception ex)
            {
                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + autono + "";
                (new DataCommon()).ExecuteQuery(SqlStr);
                CommonFunctions.WriteErrorLog(ex, "Program", "GetHistoryNEO");
            }

        }

        private static long GetConfirmationCount()
        {
            long ConfirmationCount = 0;
            try
            {
                CommonMethods CommonMethod = new CommonMethods();
                CommonMethod.Str_URL = "https://neoscan.io/api/main_net/v1/get_height";
                CommonMethod.ContentType = "application/json";
                CommonMethod.Str_RequestType = "GET";
                string Response = CallThirdPartyNEOAPI(ref CommonMethod, "", "", "", null);
                GetConfirm TPGenerateResponse = new GetConfirm();
                if (Response != null)
                {
                    TPGenerateResponse = JsonConvert.DeserializeObject<GetConfirm>(Response);
                    ConfirmationCount = TPGenerateResponse.height;
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "GetConfirmationCount");
            }
            return ConfirmationCount;
        }

        public static DateTime UTC_To_IST()
        {
            DateTime myUTC = DateTime.UtcNow;
            // 'Dim utcdate As DateTime = DateTime.ParseExact(DateTime.UtcNow, "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
            // Dim utcdate As DateTime = DateTime.ParseExact(myUTC, "M/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture)
            // 'Dim utcdate As DateTime = DateTime.ParseExact("11/09/2016 6:31:00 PM", "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
            DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(myUTC, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            // MsgBox(myUTC & " - " & utcdate & " - " & istdate)
            return istdate;

        }

        private static void TradeDepositHistoryUpdationForBitgo(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string queryResult;
            long CrWalletID;
            try
            {
                if (CommonMethod.Transfers.Count > 0)
                {
                    foreach (var item in CommonMethod.Transfers)
                    {
                        // update 
                        CommonMethod.SqlStr = "UPDATE DepositHistory SET Amount=" + item.Amount + ",Confirmations =" + item.confirmations + ", ConfirmedTime ='" + item.confirmedTime + "', epochtimepure  ='" + item.unconfirmedTime + "', UpdatedDate = dbo.GetISTDate(),SystemRemarks='Str Amt:" + item.valueStr + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                        CommonFunctions.WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryUpdationForBitgo", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        // ntrivedi temperory
                        if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' and Address='" + item.address + "'") != "0")
                        {
                            continue;
                        }
                        // ntrivedi 27-06-2018 IF fromaddress(DepositHistory) is fix DT address then debit from Distributor otherwise debit from ORG 
                        //if (!string.IsNullOrEmpty(item.fromAddress))
                        //{
                        //    SqlStr = "select * from AddressMaster Where PublicAddress=@PublicAddress and Status=1";
                        //    queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress", item.fromAddress, SqlStr);
                        //    if (string.IsNullOrEmpty(queryResult))
                        //    {
                        //        CommonMethod.DMemberID = 1;// organization
                        //    }
                        //    else
                        //    {
                        //        CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        //    }
                        //}

                        SqlStr = "select top 1 UserID from BizUserTypeMapping where UserType=0 order by UserID";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);// organization
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Org Record Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }
                        else
                        {
                            CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        }


                        SqlStr = "select WalletID from AddressMasters  AM " +
                                 " inner join WalletMasters WM on wm.Id = am.WalletId " +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.WalletTypeID " +
                                 " Where OriginalAddress = @PublicAddress and AM.Status = 1 and WTM.WalletTypeName = @CoinName";
                        queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress,@CoinName", item.address + "," + item.coin, SqlStr);
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            // ntrivedi temperory 29-10-2018
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Address Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;

                            //SqlStr = "INSERT INTO [dbo].[AddressMasters]([CreatedDate],[CreatedBy],[UpdatedBy],[UpdatedDate] " +
                            //        ",[Status],[WalletId],[Address],[IsDefaultAddress],[SerProID],[AddressLable]) "  +
                            //        " VALUES(dbo.GetISTDate(),900,900, dbo.GetISTDate(),1,'"+ queryResult + "', "+ item.address +",0,0,'test')";
                            //(new DataCommon()).ExecuteQuery(SqlStr);
                        }
                        else
                        {
                            CrWalletID = Convert.ToInt64(queryResult);
                            SqlStr = "select UserID from WalletMasters where ID=@WalletID";
                            string userID = (new DataCommon()).ExecuteScalarWDMParameterize("@WalletID", queryResult, SqlStr);
                            SqlStr = "UPDATE DepositHistory SET UserID=" + userID + " WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }

                        //if (item.OrderId == 0)
                        //{
                        //    // create Order
                        //    //CreateOrder(ref CommonMethod, item);
                        //}

                        // Delivery Process Order
                        if (item.confirmations >= CommonMethod.ConfirmationCount && CommonMethod.ConfirmationCount > 0) ////ntrivedi 11-05-2018 
                        {
                            //DeliveryProcessOrder(ref CommonMethod, item, 1, CommonMethod.DMemberID);
                            // trn pr , status ,date 
                            // ntrivedi move inside delivery process order function
                            SqlStr = "INSERT INTO TradeDepositCompletedTrn(TrnID,Address, Status, CreatedTime) VALUES('" + item.txid + "','" + item.address + "', 1 , dbo.GetISTDate())";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            //WalletService walletService = new WalletService();
                            //WalletDrCrResponse walletDrCrResponse = _walletService.DepositionWalletOperation("123456", item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.cr_Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit);
                            //_walletService.GetAddress("123");
                            //if(walletDrCrResponse.ReturnCode == 0)
                            //{
                            //    SqlStr = "UPDATE DepositHistory SET OrderID=" + walletDrCrResponse.TrnNo + ",StatusMsg='Success',Status=1,IsProcessing = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            //    (new DataCommon()).ExecuteQuery(SqlStr);
                            //}
                            //else
                            //{
                            //    SqlStr = "UPDATE DepositHistory SET OrderID=" + walletDrCrResponse.TrnNo  + ",StatusMsg='" + walletDrCrResponse.StatusMsg +"',Status=1,IsProcessing = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            //    (new DataCommon()).ExecuteQuery(SqlStr);
                            //}                  


                            //                        .AddDbContext<BloggingContext>(options =>
                            //options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));


                            //long id= bar.getOrgID();
                            // intentionally added code 04-11-2018 for checking the exception from dependency side 
                            Int32 ReturnCode = 0;
                            string ReturnMsg = string.Empty;
                            Int64 errorcode = 0;



                            sp_SelfOrder(item.txid, item.coin, item.Amount, item.id, ref ReturnMsg, ref ReturnCode, ref errorcode);
                            if (ReturnCode != 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET StatusMsg='Self Order failure',IsProcessing=0,UpdatedDate=dbo.getIstdate() WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                                continue;
                            }

                            var conStr = Configuration["SqlServerConnectionString"];
                            var serviceProvider = new ServiceCollection()
                .AddLogging()
                // .AddSingleton<IWalletTransactionCrDr, WalletTransactionCrDr>()
                .AddSingleton<IWalletSPRepositories, WalletSPRepository>()
                .AddSingleton<IWalletTQInsert, WalletTQRepository>()
                //.AddSingleton<ICommonRepository<WalletMaster>, EFCommonRepository<WalletMaster>>()
                //.AddSingleton<ICommonRepository<WalletLimitConfiguration>, EFCommonRepository<WalletLimitConfiguration>>()
                .AddSingleton(typeof(ICommonRepository<>), typeof(EFCommonRepository<>))
                //.AddSingleton<ICommonRepository<ThirdPartyAPIConfiguration>, EFCommonRepository<ThirdPartyAPIConfiguration>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<AddressMaster>, EFCommonRepository<AddressMaster>>()
                //.AddSingleton<ICommonRepository<TrnAcBatch>, EFCommonRepository<TrnAcBatch>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<TradeBitGoDelayAddresses>, EFCommonRepository<TradeBitGoDelayAddresses>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                //.AddSingleton<ICommonRepository<BeneficiaryMaster>, EFCommonRepository<BeneficiaryMaster>>()
                //.AddSingleton<ICommonRepository<UserPreferencesMaster>, EFCommonRepository<UserPreferencesMaster>>()
                //.AddSingleton<ICommonRepository<WalletTypeMaster>, EFCommonRepository<WalletTypeMaster>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                .AddSingleton<IWalletRepository, WalletRepository>()
                .AddSingleton<IBackOfficeTrnRepository, BackOfficeTrnRepository>()
                .AddSingleton<ICommonWalletFunction, CommonWalletFunction>()
                .AddSingleton<IWebApiRepository, WebApiDataRepository>()
                .AddTransient<IFrontTrnRepository, FrontTrnRepository>()
                .AddSingleton<RedisConnectionFactory>()
                 .AddSingleton<IMessageConfiguration, MessageConfiguration>()
                 .AddMemoryCache()
                 .AddSingleton<SqlConnectionFactory>()
               .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
               .AddSingleton<IMessageService, MessageService>()
                //.AddSingleton<IWebApiParseResponse, WebApiParseResponse>()
                .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
                .AddSingleton<IGetWebRequest, GetWebRequest>()
                .AddTransient<ISignalRService, SignalRService>()
                .AddSingleton<IMediator, Mediator>()
                .AddDbContext<CleanArchitectureContext>(options => options.UseSqlServer(conStr))
                .AddTransient<UserResolveService>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .AddScoped<ServiceFactory>(p => type => p.GetService(type))
                .AddScoped<IMediator, Mediator>()
                .AddScoped<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
                .AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddTransient<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
              //.AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddSingleton<RedisConnectionFactory>() 
              // .AddSingleton<ISignalRQueue, BackgroundSignalRTaskQueue>()
              // .AddSingleton<IPushNotificationsQueue<>, PushNotificationsQueue<>>()
              .AddSingleton<IPushNotificationsQueue<SendSMSRequest>, PushNotificationsQueue<SendSMSRequest>>()
                .AddSingleton<IWalletDeposition, WalletDeposition>()
              .AddSingleton<IPushNotificationsQueue<SendEmailRequest>, PushNotificationsQueue<SendEmailRequest>>()
                .BuildServiceProvider();

                            IWalletDeposition bar = serviceProvider.GetService<IWalletDeposition>();

                            WalletDrCrResponse walletDrCrResponse = bar.DepositionWalletOperation(UTC_To_IST().ToString("ddMMyyyyHHmmss"), item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit, enTrnType.Deposit, "");

                            if (walletDrCrResponse.ReturnCode == 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 1,StatusMsg='Success',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);


                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 9,StatusMsg='" + walletDrCrResponse.ReturnMsg + "',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                        //}
                        //else // Order Already Intialized
                        //{
                        //    SqlStr = "UPDATE DepositHistory SET status = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        //    (new DataCommon()).ExecuteQuery(SqlStr);
                        //    WriteRequestLog("Order Already Intialized | " + item.txid, "TradeDepositHistoryUpdationForCryptoCoin", CommonMethod.SMSCode, Action: 2);
                        //}

                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForBitgo");
            }
        }

        //Uday 09-02-2019  For EtherScan Update Deposit History
        private static void TradeDepositHistoryUpdationForEtherScan(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string queryResult;
            long CrWalletID;
            try
            {
                if (CommonMethod.Transfers.Count > 0)
                {
                    foreach (var item in CommonMethod.Transfers)
                    {
                        // update 
                        CommonMethod.SqlStr = "UPDATE DepositHistory SET Amount=" + item.Amount + ",Confirmations =" + item.confirmations + ",UpdatedDate = dbo.GetISTDate(),SystemRemarks='Str Amt:" + item.value + "' WHERE ID=" + item.id;
                        (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                        CommonFunctions.WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryUpdationForEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        // ntrivedi temperory
                        if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' and Address='" + item.address + "'") != "0")
                        {
                            continue;
                        }
                        // ntrivedi 27-06-2018 IF fromaddress(DepositHistory) is fix DT address then debit from Distributor otherwise debit from ORG 
                        //if (!string.IsNullOrEmpty(item.fromAddress))
                        //{
                        //    SqlStr = "select * from AddressMaster Where PublicAddress=@PublicAddress and Status=1";
                        //    queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress", item.fromAddress, SqlStr);
                        //    if (string.IsNullOrEmpty(queryResult))
                        //    {
                        //        CommonMethod.DMemberID = 1;// organization
                        //    }
                        //    else
                        //    {
                        //        CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        //    }
                        //}

                        SqlStr = "select top 1 UserID from BizUserTypeMapping where UserType=0 order by UserID";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);// organization
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Org Record Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }
                        else
                        {
                            CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        }

                        //Uday 07-02-2019 Check For Admin Address
                        SqlStr = "select top 1 Am.Id as [AddressId] " +
                                 " from AddressMasters AM inner join WalletMasters wm on wm.id = am.WalletId" +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.wallettypeid" +
                                 " where wm.UserID = (select top 1 UserID from BizUserTypeMapping where UserType = 0)" +
                                 " and (OriginalAddress = '" + item.address + "' or Address = '" + item.address + "') and AM.AddressType=1"; //ntrivedi 18-04-2018 for commisssion deposition in admin wallet balance need to add condition for AM.AddressType=1
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);
                        if (!string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Admin Address Not Allowed',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }


                        SqlStr = "select WalletID from AddressMasters  AM " +
                                 " inner join WalletMasters WM on wm.Id = am.WalletId " +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.WalletTypeID " +
                                 " Where OriginalAddress = @PublicAddress and AM.Status = 1 and WTM.WalletTypeName = @CoinName";
                        queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress,@CoinName", item.address + "," + item.coin, SqlStr);
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            // ntrivedi temperory 29-10-2018
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Address Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;

                            //SqlStr = "INSERT INTO [dbo].[AddressMasters]([CreatedDate],[CreatedBy],[UpdatedBy],[UpdatedDate] " +
                            //        ",[Status],[WalletId],[Address],[IsDefaultAddress],[SerProID],[AddressLable]) "  +
                            //        " VALUES(dbo.GetISTDate(),900,900, dbo.GetISTDate(),1,'"+ queryResult + "', "+ item.address +",0,0,'test')";
                            //(new DataCommon()).ExecuteQuery(SqlStr);
                        }
                        else
                        {
                            CrWalletID = Convert.ToInt64(queryResult);
                            SqlStr = "select UserID from WalletMasters where ID=@WalletID";
                            string userID = (new DataCommon()).ExecuteScalarWDMParameterize("@WalletID", queryResult, SqlStr);
                            SqlStr = "UPDATE DepositHistory SET UserID=" + userID + " WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }

                        //if (item.OrderId == 0)
                        //{
                        //    // create Order
                        //    //CreateOrder(ref CommonMethod, item);
                        //}

                        // Delivery Process Order
                        if (item.confirmations >= CommonMethod.ConfirmationCount && CommonMethod.ConfirmationCount > 0) ////ntrivedi 11-05-2018 
                        {
                            //DeliveryProcessOrder(ref CommonMethod, item, 1, CommonMethod.DMemberID);
                            // trn pr , status ,date 
                            // ntrivedi move inside delivery process order function
                            SqlStr = "INSERT INTO TradeDepositCompletedTrn(TrnID,Address, Status, CreatedTime) VALUES('" + item.txid + "','" + item.address + "', 1 , dbo.GetISTDate())";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            //WalletService walletService = new WalletService();
                            //WalletDrCrResponse walletDrCrResponse = _walletService.DepositionWalletOperation("123456", item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.cr_Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit);
                            //_walletService.GetAddress("123");
                            //if(walletDrCrResponse.ReturnCode == 0)
                            //{
                            //    SqlStr = "UPDATE DepositHistory SET OrderID=" + walletDrCrResponse.TrnNo + ",StatusMsg='Success',Status=1,IsProcessing = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            //    (new DataCommon()).ExecuteQuery(SqlStr);
                            //}
                            //else
                            //{
                            //    SqlStr = "UPDATE DepositHistory SET OrderID=" + walletDrCrResponse.TrnNo  + ",StatusMsg='" + walletDrCrResponse.StatusMsg +"',Status=1,IsProcessing = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            //    (new DataCommon()).ExecuteQuery(SqlStr);
                            //}                  


                            //                        .AddDbContext<BloggingContext>(options =>
                            //options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));


                            //long id= bar.getOrgID();
                            // intentionally added code 04-11-2018 for checking the exception from dependency side 
                            Int32 ReturnCode = 0;
                            string ReturnMsg = string.Empty;
                            Int64 errorcode = 0;



                            sp_SelfOrder(item.txid, item.coin, item.Amount, item.id, ref ReturnMsg, ref ReturnCode, ref errorcode);
                            if (ReturnCode != 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET StatusMsg='Self Order failure',IsProcessing=0,UpdatedDate=dbo.getIstdate() WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                                continue;
                            }

                            var conStr = Configuration["SqlServerConnectionString"];
                            var serviceProvider = new ServiceCollection()
                .AddLogging()
                // .AddSingleton<IWalletTransactionCrDr, WalletTransactionCrDr>()
                .AddSingleton<IWalletSPRepositories, WalletSPRepository>()
                .AddSingleton<IWalletTQInsert, WalletTQRepository>()
                //.AddSingleton<ICommonRepository<WalletMaster>, EFCommonRepository<WalletMaster>>()
                //.AddSingleton<ICommonRepository<WalletLimitConfiguration>, EFCommonRepository<WalletLimitConfiguration>>()
                .AddSingleton(typeof(ICommonRepository<>), typeof(EFCommonRepository<>))
                //.AddSingleton<ICommonRepository<ThirdPartyAPIConfiguration>, EFCommonRepository<ThirdPartyAPIConfiguration>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<AddressMaster>, EFCommonRepository<AddressMaster>>()
                //.AddSingleton<ICommonRepository<TrnAcBatch>, EFCommonRepository<TrnAcBatch>>()
                //.AddSingleton<ICommonRepository<WalletOrder>, EFCommonRepository<WalletOrder>>()
                //.AddSingleton<ICommonRepository<TradeBitGoDelayAddresses>, EFCommonRepository<TradeBitGoDelayAddresses>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                //.AddSingleton<ICommonRepository<BeneficiaryMaster>, EFCommonRepository<BeneficiaryMaster>>()
                //.AddSingleton<ICommonRepository<UserPreferencesMaster>, EFCommonRepository<UserPreferencesMaster>>()
                //.AddSingleton<ICommonRepository<WalletTypeMaster>, EFCommonRepository<WalletTypeMaster>>()
                //.AddSingleton<ICommonRepository<WalletAllowTrn>, EFCommonRepository<WalletAllowTrn>>()
                .AddSingleton<IWalletRepository, WalletRepository>()
                .AddSingleton<IBackOfficeTrnRepository, BackOfficeTrnRepository>()
                .AddSingleton<ICommonWalletFunction, CommonWalletFunction>()
                .AddSingleton<IWebApiRepository, WebApiDataRepository>()
                .AddTransient<IFrontTrnRepository, FrontTrnRepository>()
                .AddSingleton<RedisConnectionFactory>()
                 .AddSingleton<IMessageConfiguration, MessageConfiguration>()
                 .AddMemoryCache()
                 .AddSingleton<SqlConnectionFactory>()
               .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
               .AddSingleton<IMessageService, MessageService>()
                //.AddSingleton<IWebApiParseResponse, WebApiParseResponse>()
                .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
                .AddSingleton<IGetWebRequest, GetWebRequest>()
                .AddTransient<ISignalRService, SignalRService>()
                .AddSingleton<IMediator, Mediator>()
                .AddDbContext<CleanArchitectureContext>(options => options.UseSqlServer(conStr))
                .AddTransient<UserResolveService>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .AddScoped<ServiceFactory>(p => type => p.GetService(type))
                .AddScoped<IMediator, Mediator>()
                .AddScoped<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
                .AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddTransient<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
              //.AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              //.AddSingleton<RedisConnectionFactory>() 
              // .AddSingleton<ISignalRQueue, BackgroundSignalRTaskQueue>()
              // .AddSingleton<IPushNotificationsQueue<>, PushNotificationsQueue<>>()
              .AddSingleton<IPushNotificationsQueue<SendSMSRequest>, PushNotificationsQueue<SendSMSRequest>>()
                .AddSingleton<IWalletDeposition, WalletDeposition>()
              .AddSingleton<IPushNotificationsQueue<SendEmailRequest>, PushNotificationsQueue<SendEmailRequest>>()
                .BuildServiceProvider();

                            IWalletDeposition bar = serviceProvider.GetService<IWalletDeposition>();

                            WalletDrCrResponse walletDrCrResponse = bar.DepositionWalletOperation(UTC_To_IST().ToString("ddMMyyyyHHmmss"), item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit, enTrnType.Deposit, "");

                            if (walletDrCrResponse.ReturnCode == 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 1,StatusMsg='Success',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);


                                //2019-5-14 Flush Address ---Start---
                                FlushAddress(CommonMethod, item.id);
                                //------Flush end
                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 9,StatusMsg='" + walletDrCrResponse.ReturnMsg + "',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                        //}
                        //else // Order Already Intialized
                        //{
                        //    SqlStr = "UPDATE DepositHistory SET status = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        //    (new DataCommon()).ExecuteQuery(SqlStr);
                        //    WriteRequestLog("Order Already Intialized | " + item.txid, "TradeDepositHistoryUpdationForCryptoCoin", CommonMethod.SMSCode, Action: 2);
                        //}

                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForEtherScan");
            }
        }

        private static void TradeDepositHistoryUpdationForTRON(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string queryResult;
            long CrWalletID;
            try
            {
                if (CommonMethod.Transfers.Count > 0)
                {
                    foreach (var item in CommonMethod.Transfers)
                    {
                        CommonMethod.SqlStr = "UPDATE DepositHistory SET Amount=" + item.Amount + ",Confirmations =" + item.confirmations + ",UpdatedDate = dbo.GetISTDate(),SystemRemarks='Str Amt:" + item.value + "' WHERE ID=" + item.id;
                        (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                        CommonFunctions.WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryUpdationForEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

                        if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' and Address='" + item.address + "'") != "0")
                        {
                            continue;
                        }

                        SqlStr = "select top 1 UserID from BizUserTypeMapping where UserType=0 order by UserID";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);// organization
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Org Record Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id;
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }
                        else
                        {
                            CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        }

                        SqlStr = "select top 1 Am.Id as [AddressId] " +
                                 " from AddressMasters AM inner join WalletMasters wm on wm.id = am.WalletId" +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.wallettypeid" +
                                 " where wm.UserID = (select top 1 UserID from BizUserTypeMapping where UserType = 0)" +
                                 " and (OriginalAddress = '" + item.address + "' or Address = '" + item.address + "') and AM.AddressType=1";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);
                        if (!string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Admin Address Not Allowed',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }


                        SqlStr = "select WalletID from AddressMasters  AM " +
                                 " inner join WalletMasters WM on wm.Id = am.WalletId " +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.WalletTypeID " +
                                 " Where OriginalAddress = @PublicAddress and AM.Status = 1 and WTM.WalletTypeName = @CoinName";
                        queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress,@CoinName", item.address + "," + item.coin, SqlStr);
                        //queryResult = "40";
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Address Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id;
                            //(new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            //continue;
                        }
                        else
                        {
                            CrWalletID = Convert.ToInt64(queryResult);
                            SqlStr = "select UserID from WalletMasters where ID=@WalletID";
                            string userID = (new DataCommon()).ExecuteScalarWDMParameterize("@WalletID", queryResult, SqlStr);
                            SqlStr = "UPDATE DepositHistory SET UserID=" + userID + " WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }

                        if (item.confirmations >= CommonMethod.ConfirmationCount && CommonMethod.ConfirmationCount > 0) ////ntrivedi 11-05-2018 
                        {
                            SqlStr = "INSERT INTO TradeDepositCompletedTrn(TrnID,Address, Status, CreatedTime) VALUES('" + item.txid + "','" + item.address + "', 1 , dbo.GetISTDate())";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            Int32 ReturnCode = 0;
                            string ReturnMsg = string.Empty;
                            Int64 errorcode = 0;
                            sp_SelfOrder(item.txid, item.coin, item.Amount, item.id, ref ReturnMsg, ref ReturnCode, ref errorcode);
                            if (ReturnCode != 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET StatusMsg='Self Order failure',IsProcessing=0,UpdatedDate=dbo.getIstdate() WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                                continue;
                            }

                            var conStr = Configuration["SqlServerConnectionString"];
                            var serviceProvider = new ServiceCollection()
                .AddLogging()
                .AddSingleton<IWalletSPRepositories, WalletSPRepository>()
                .AddSingleton<IWalletTQInsert, WalletTQRepository>()
                .AddSingleton(typeof(ICommonRepository<>), typeof(EFCommonRepository<>))
                .AddSingleton<IWalletRepository, WalletRepository>()
                .AddSingleton<IBackOfficeTrnRepository, BackOfficeTrnRepository>()
                .AddSingleton<ICommonWalletFunction, CommonWalletFunction>()
                .AddSingleton<IWebApiRepository, WebApiDataRepository>()
                .AddTransient<IFrontTrnRepository, FrontTrnRepository>()
                .AddSingleton<RedisConnectionFactory>()
                 .AddSingleton<IMessageConfiguration, MessageConfiguration>()
                 .AddMemoryCache()
                 .AddSingleton<SqlConnectionFactory>()
               .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
               .AddSingleton<IMessageService, MessageService>()
                .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
                .AddSingleton<IGetWebRequest, GetWebRequest>()
                .AddTransient<ISignalRService, SignalRService>()
                .AddSingleton<IMediator, Mediator>()
                .AddDbContext<CleanArchitectureContext>(options => options.UseSqlServer(conStr))
                .AddTransient<UserResolveService>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .AddScoped<ServiceFactory>(p => type => p.GetService(type))
                .AddScoped<IMediator, Mediator>()
                .AddScoped<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
                .AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
              .AddSingleton<IPushNotificationsQueue<SendSMSRequest>, PushNotificationsQueue<SendSMSRequest>>()
                .AddSingleton<IWalletDeposition, WalletDeposition>()
              .AddSingleton<IPushNotificationsQueue<SendEmailRequest>, PushNotificationsQueue<SendEmailRequest>>()
                .BuildServiceProvider();

                            IWalletDeposition bar = serviceProvider.GetService<IWalletDeposition>();

                            WalletDrCrResponse walletDrCrResponse = bar.DepositionWalletOperation(UTC_To_IST().ToString("ddMMyyyyHHmmss"), item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit, enTrnType.Deposit, "");

                            if (walletDrCrResponse.ReturnCode == 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 1,StatusMsg='Success',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id;
                                (new DataCommon()).ExecuteQuery(SqlStr);

                                //2019-5-14 Flush Address ---Start---
                                //FlushAddress(CommonMethod, item.id);
                                //------Flush end
                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 9,StatusMsg='" + walletDrCrResponse.ReturnMsg + "',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForTRON");
            }
        }

        private static void TradeDepositHistoryUpdationForNeo(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string queryResult;
            long CrWalletID;
            try
            {
                if (CommonMethod.Transfers.Count > 0)
                {
                    foreach (var item in CommonMethod.Transfers)
                    {
                        // update 
                        CommonMethod.SqlStr = "UPDATE DepositHistory SET Amount=" + item.Amount + ",Confirmations =" + item.confirmations + ",UpdatedDate = dbo.GetISTDate(),SystemRemarks='Str Amt:" + item.value + "' WHERE ID=" + item.id;
                        (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                        CommonFunctions.WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryUpdationForEtherScan", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                        // ntrivedi temperory
                        if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' and Address='" + item.address + "'") != "0")
                        {
                            continue;
                        }

                        SqlStr = "select top 1 UserID from BizUserTypeMapping where UserType=0 order by UserID";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);// organization
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Org Record Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }
                        else
                        {
                            CommonMethod.DMemberID = Convert.ToInt64(queryResult);
                        }

                        SqlStr = "select top 1 Am.Id as [AddressId] " +
                                 " from AddressMasters AM inner join WalletMasters wm on wm.id = am.WalletId" +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.wallettypeid" +
                                 " where wm.UserID = (select top 1 UserID from BizUserTypeMapping where UserType = 0)" +
                                 " and (OriginalAddress = '" + item.address + "' or Address = '" + item.address + "') and AM.AddressType=1";
                        queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);

                        if (!string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Admin Address Not Allowed',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;
                        }


                        SqlStr = "select WalletID from AddressMasters  AM " +
                                 " inner join WalletMasters WM on wm.Id = am.WalletId " +
                                 " inner join WalletTypeMasters WTM on WTM.Id = wm.WalletTypeID " +
                                 " Where OriginalAddress = @PublicAddress and AM.Status = 1 and WTM.WalletTypeName = @CoinName";
                        queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress,@CoinName", item.address + "," + item.coin, SqlStr);
                        //queryResult = "40";
                        if (string.IsNullOrEmpty(queryResult))
                        {
                            SqlStr = "UPDATE DepositHistory SET StatusMsg='Address Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            CommonMethod.DMemberID = 0;
                            continue;

                            //SqlStr = "INSERT INTO [dbo].[AddressMasters]([CreatedDate],[CreatedBy],[UpdatedBy],[UpdatedDate] " +
                            //        ",[Status],[WalletId],[Address],[IsDefaultAddress],[SerProID],[AddressLable]) " +
                            //        " VALUES(dbo.GetISTDate(),900,900, dbo.GetISTDate(),1,'" + queryResult + "', " + item.address + ",0,0,'test')";
                            //(new DataCommon()).ExecuteQuery(SqlStr);
                        }
                        else
                        {
                            CrWalletID = Convert.ToInt64(queryResult);
                            SqlStr = "select UserID from WalletMasters where ID=@WalletID";
                            string userID = (new DataCommon()).ExecuteScalarWDMParameterize("@WalletID", queryResult, SqlStr);
                            SqlStr = "UPDATE DepositHistory SET UserID=" + userID + " WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }
                        if (item.confirmations >= CommonMethod.ConfirmationCount && CommonMethod.ConfirmationCount > 0)
                        {
                            SqlStr = "INSERT INTO TradeDepositCompletedTrn(TrnID,Address, Status, CreatedTime) VALUES('" + item.txid + "','" + item.address + "', 1 , dbo.GetISTDate())";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            Int32 ReturnCode = 0;
                            string ReturnMsg = string.Empty;
                            Int64 errorcode = 0;
                            sp_SelfOrder(item.txid, item.coin, item.Amount, item.id, ref ReturnMsg, ref ReturnCode, ref errorcode);
                            if (ReturnCode != 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET StatusMsg='Self Order failure',IsProcessing=0,UpdatedDate=dbo.getIstdate() WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                                continue;
                            }

                            var conStr = Configuration["SqlServerConnectionString"];
                            var serviceProvider = new ServiceCollection()
                .AddLogging()
                .AddSingleton<IWalletSPRepositories, WalletSPRepository>()
                .AddSingleton<IWalletTQInsert, WalletTQRepository>()
                .AddSingleton(typeof(ICommonRepository<>), typeof(EFCommonRepository<>))
                .AddSingleton<IWalletRepository, WalletRepository>()
                .AddSingleton<IBackOfficeTrnRepository, BackOfficeTrnRepository>()
                .AddSingleton<ICommonWalletFunction, CommonWalletFunction>()
                .AddSingleton<IWebApiRepository, WebApiDataRepository>()
                .AddTransient<IFrontTrnRepository, FrontTrnRepository>()
                .AddSingleton<RedisConnectionFactory>()
                 .AddSingleton<IMessageConfiguration, MessageConfiguration>()
                 .AddMemoryCache()
                 .AddSingleton<SqlConnectionFactory>()
               .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
               .AddSingleton<IMessageService, MessageService>()
                .AddSingleton<IWebApiSendRequest, WebAPISendRequest>()
                .AddSingleton<IGetWebRequest, GetWebRequest>()
                .AddTransient<ISignalRService, SignalRService>()
                .AddSingleton<IMediator, Mediator>()
                .AddDbContext<CleanArchitectureContext>(options => options.UseSqlServer(conStr))
                .AddTransient<UserResolveService>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .AddScoped<ServiceFactory>(p => type => p.GetService(type))
                .AddScoped<IMediator, Mediator>()
                .AddScoped<ICommonRepository<TransactionQueue>, EFCommonRepository<TransactionQueue>>()
                .AddScoped<ICommonRepository<TradeTransactionQueue>, EFCommonRepository<TradeTransactionQueue>>()
                .AddSingleton<IPushNotificationsQueue<SendSMSRequest>, PushNotificationsQueue<SendSMSRequest>>()
                .AddSingleton<IWalletDeposition, WalletDeposition>()
              .AddSingleton<IPushNotificationsQueue<SendEmailRequest>, PushNotificationsQueue<SendEmailRequest>>()
                .BuildServiceProvider();

                            IWalletDeposition bar = serviceProvider.GetService<IWalletDeposition>();

                            WalletDrCrResponse walletDrCrResponse = bar.DepositionWalletOperation(UTC_To_IST().ToString("ddMMyyyyHHmmss"), item.address, item.coin, item.Amount, item.id, enServiceType.WalletService, enWalletTrnType.Deposit, enWalletTranxOrderType.Credit, enWalletLimitType.DepositLimit, enTrnType.Deposit, "");

                            if (walletDrCrResponse.ReturnCode == 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 1,StatusMsg='Success',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET status = 9,StatusMsg='" + walletDrCrResponse.ReturnMsg + "',OrderID='" + walletDrCrResponse.TrnNo + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForNeo");
            }
        }

        private static void CallAPISingle(object RefObj)
        {
            string smscode = "";/*string trnID= "ddaa745649f8f09564daa1aaa51716ef49175b328c8d87aba4b207b3f178d620"; string Authorization = "Bearer v2x5e587227b1085bdcd4d5bd3421f0a702fff86d2137af0cf3a8624655d4e42f71"; string enterprise = "5a79359692f6f738073dffcbbb0c22df";*/
            try
            {
                walletServiceData walletServiceDataObj = (walletServiceData)RefObj;
                CommonMethods CommonMethod = new CommonMethods();
                CommonMethod.Transfers = new List<RespTransfers>(); // Need object of RespTransfers  for Thirdparty ApI response
                //CommonMethod.RespLocalCoins = new List<RespLocalCoin>(); // Need object of RespLocalCoins  for Thirdparty ApI response
                CommonMethod.SMSCode = walletServiceDataObj.SMSCode;
                CommonMethod.FlushAddressEnable = walletServiceDataObj.FlushAddressEnable;
                smscode = CommonMethod.SMSCode;
                ReadMasterFile(walletServiceDataObj.SMSCode, ref CommonMethod); // Read  Master File
                if (!string.IsNullOrEmpty(CommonMethod.Path_AddressGenerate))
                {
                    ReadTransactionalFile(CommonMethod.Path_AddressGenerate, ref CommonMethod); // Read Transaction file for specific coin               
                    if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                    {
                        switch (walletServiceDataObj.AppType)
                        {
                            case (int)EnAppType.BitGoAPI:
                                GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID);
                                TradeDepositHistoryUpdationForBitgo(ref CommonMethod);
                                //CallThirdPartyAPI(ref CommonMethod,trnID,Authorization,enterprise,null); // Generate ThirdParty API Response
                                //TradeDepositHistoryInsertion(ref CommonMethod); // Insert Trade Deposit History
                                break;
                            case (int)EnAppType.CryptoAPI:
                                //if (!string.IsNullOrEmpty(CommonMethod.UserName) && !string.IsNullOrEmpty(CommonMethod.Password) && !string.IsNullOrEmpty(CommonMethod.RequestBody))
                                //{
                                //GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID, CommonMethod.Authorization, CommonMethod.enterprise); // Get History From Deposit History SMScode Wise 
                                //TradeDepositHistoryUpdationForCryptoCoin(ref CommonMethod); // Update Crypto coin into Trade Deposit History
                                //}
                                //else
                                //{
                                //    logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
                                //}
                                break;
                            case (int)EnAppType.EtherScan:      //Uday  Integrate Status Check For EtherScan ERC20 Provider API
                                GetHistoryEtherScan(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID); // Get History From Deposit History SMScode Wise 
                                TradeDepositHistoryUpdationForEtherScan(ref CommonMethod); // Update Crypto coin into Trade Deposit History
                                break;
                            case (int)EnAppType.TRCAPI:
                                GetHistoryTron(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID); // Get History From Deposit History SMScode Wise 
                                TradeDepositHistoryUpdationForTRON(ref CommonMethod);
                                break;
                            case (int)EnAppType.TRC10TokenAPI:
                                GetHistoryTron(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID); // Get History From Deposit History SMScode Wise 
                                TradeDepositHistoryUpdationForTRON(ref CommonMethod);
                                break;
                            case (int)EnAppType.TRC20TokenAPI:
                                GetHistoryTron(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID); // Get History From Deposit History SMScode Wise 
                                TradeDepositHistoryUpdationForTRON(ref CommonMethod);
                                break;
                            case (int)EnAppType.NEOAPI:
                                GetHistoryNEO(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID); // Get History From Deposit History SMScode Wise 
                                TradeDepositHistoryUpdationForNeo(ref CommonMethod);
                                break;
                            default:
                                break;
                        }
                    }
                    else
                    {
                        CommonFunctions.WriteRequestLog("Transaction Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
                    }
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Master File Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
                }
            }
            catch (Exception ex)
            {
                //ex = null;
                CommonFunctions.WriteErrorLog(ex, "Program", "CallAPISingle");
            }
            finally
            {
                IsProcessing = false;
                CommonFunctions.WriteRequestLog("IsProcessing = false ", "CallAPISingle", smscode, Action: 2);
            }
        }

        private static void FlushAddress(CommonMethods CommonMethod, long Id)
        {
            string SqlStr = "", queryResult = "";

            if (CommonMethod.FlushAddressEnable == 1)
            {
                SqlStr = "UPDATE DepositHistory SET IsFlushAddProcess = 6 ,updateddate=dbo.getistdate() WHERE ID=" + Id;
                (new DataCommon()).ExecuteQuery(SqlStr);
                ReadMasterFile("Flush", ref CommonMethod);
                if (!string.IsNullOrEmpty(CommonMethod.Path_AddressGenerate))
                {
                    SqlStr = "SELECT Address FROM DepositHistory WHERE Status=1 AND ID=" + Id;
                    queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);
                    CommonMethod.Address = queryResult;//"0x2Ee7337C6bd7A0859C39A2e33b7Cb11Eb460088e";//

                    ReadTransactionalFile(CommonMethod.Path_AddressGenerate, ref CommonMethod);
                    if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                    {
                        String Response = CallThirdPartyEtherScanAPI(ref CommonMethod, "", null, null, null);

                        if (Response == string.Empty) // ntrivedi 28-05-2018
                        {
                            SqlStr = "UPDATE DepositHistory SET IsFlushAddProcess  = 0,updateddate=dbo.getistdate()  WHERE ID=" + Id;
                            (new DataCommon()).ExecuteQuery(SqlStr);
                            return;
                        }

                        //MainFlushResponse mainFlush = new MainFlushResponse();
                        FlushResponse subObj = new FlushResponse();
                        subObj = JsonConvert.DeserializeObject<FlushResponse>(Response);

                        if (subObj != null)
                        {
                            if (subObj.isError == 0)
                            {
                                SqlStr = "UPDATE DepositHistory SET IsFlushAddProcess = 1,FlushTrnHash='" + subObj.txn_hash + "' ,updateddate=dbo.getistdate() WHERE ID=" + Id;
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                            else
                            {
                                SqlStr = "UPDATE DepositHistory SET IsFlushAddProcess  = 0,updateddate=dbo.getistdate()  WHERE ID=" + Id;
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                    }
                    else
                    {
                        CommonFunctions.WriteRequestLog("Transaction Detail not found", "FlushAddress", CommonMethod.SMSCode, Action: 2);
                    }

                }
                else
                {
                    CommonFunctions.WriteRequestLog("Master File Detail not found", "FlushAddress", CommonMethod.SMSCode, Action: 2);
                }
            }
        }
        #endregion

        #region "ReadMasterFile"

        public static void ReadMasterFile(string APIName, ref CommonMethods CommonMethod)
        {
            string FilePath = Configuration["MainPath"] + "\\MasterFile_" + APIName + ".txt";

            try
            {
                if (System.IO.File.Exists(FilePath) == true)
                {
                    CommonMethod.StaticArray[0] = "0";
                    CommonMethod.TransactionFile = Configuration["MainPath"]; //FilePath

                    string[] lines = System.IO.File.ReadAllLines(FilePath);
                    foreach (string line in lines)
                    {
                        CommonMethod.LeftTitle = line.Substring(0, line.IndexOf(CommonMethod.MainSaperator)).ToLower();

                        if (CommonMethod.LeftTitle.ToUpper().Contains("STATIC"))
                        {
                            //Start with #1 Position
                            CommonMethod.StaticArray[CommonMethod.StaticCnt++] = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                            //StaticCnt++;
                        }
                        else if (CommonMethod.LeftTitle == "apiname")
                        {
                            CommonMethod.TransactionFile = CommonMethod.TransactionFile + "\\" + APIName + "\\";
                        }
                        else if (CommonMethod.LeftTitle == "requesttype")
                        {
                            CommonMethod.RequestType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.LeftTitle == "transactionfilepath")
                        {
                            CommonMethod.Path_AddressGenerate = CommonMethod.TransactionFile + line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.LeftTitle == "receiptfilepath")
                        {
                            CommonMethod.Path_GetReceipt = CommonMethod.TransactionFile + line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                    }

                    CommonFunctions.WriteRequestLog("Transaction File Path :  " + CommonMethod.Path_AddressGenerate, "ReadMasterFile", CommonMethod.SMSCode);
                }
                else
                {

                    CommonFunctions.WriteRequestLog(FilePath + " File Not Found", "ReadMasterFile", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "ReadMasterFile");
            }
        }

        public static void ReadTransactionalFile(string Path, ref CommonMethods CommonMethod)
        {

            try
            {
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (System.IO.File.Exists(Path) == true)
                {
                    string[] lines = System.IO.File.ReadAllLines(Path);
                    foreach (string line in lines)
                    {
                        CommonMethod.TrnLeftTitle = line.Substring(0, line.IndexOf(CommonMethod.MainSaperator)).ToLower();

                        if (CommonMethod.TrnLeftTitle.ToUpper().Contains("URL")) //Read URL
                        {
                            CommonMethod.Str_URL = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("requesttype")) //Read Request Type 
                        {
                            CommonMethod.Str_RequestType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("contenttype")) //Read Content Type
                        {
                            CommonMethod.ContentType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("category")) //Read Category Type
                        {
                            CommonMethod.Category = Convert.ToInt16(line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1));
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("assetname")) //Read AssetName
                        {
                            CommonMethod.AssetName = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("username")) //Read Username
                        {
                            CommonMethod.UserName = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("password")) //Read Password
                        {
                            CommonMethod.Password = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("requestbody")) //Read RequestBody
                        {
                            CommonMethod.RequestBody = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("assetfromrequest")) //Read RequestBody
                        {
                            CommonMethod.AssetFromRequest = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("authorization"))
                        {
                            CommonMethod.Authorization = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("trnID"))
                        {
                            CommonMethod.trnID = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("enterprise"))
                        {
                            CommonMethod.enterprise = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("convertamt")) //Read RequestBody
                        {
                            CommonMethod.ConvertAmt = Convert.ToInt64(line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1));
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("providerwalletid")) //Read RequestBody
                        {
                            CommonMethod.ProviderWalletID = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("confirmation")) //Read RequestBody
                        {
                            CommonMethod.ConfirmationCount = Convert.ToInt16(line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1));
                        }
                        //Console.WriteLine(CommonMethod.Str_URL + CommonMethod.Str_RequestType + CommonMethod.ContentType);
                    }

                    CommonFunctions.WriteRequestLog("Transaction URL :  " + CommonMethod.Str_URL + " Request Type : " + CommonMethod.Str_RequestType + " Content Type : " + CommonMethod.ContentType, "ReadTransactionalFile", CommonMethod.SMSCode);
                }
                else
                {
                    CommonFunctions.WriteRequestLog(Path + " File Not Found", "ReadTransactionalFile", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "ReadTransactionalFile");
            }
        }
        #endregion

        #region "CallThirdPartyAPI"

        private static string CallThirdPartyAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    //vsolanki

                    if (CommonMethod.Str_URL.Contains("#trnID#"))
                    {
                        CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#trnID#", trnID);
                    }
                    CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);


                    CommonFunctions.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;
                    //vsolanki
                    if (Authorization != null)
                    {
                        httpWebRequest.Headers.Add("Authorization", Authorization);
                    }
                    if (enterprise != null)
                    {
                        httpWebRequest.Headers.Add("enterprise", enterprise);
                    }
                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();

                    }
                    httpWebResponse.Close();
                    CommonFunctions.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyAPI", CommonMethod.SMSCode);
                    //JObject GenerateResponse = JObject.Parse(CommonMethod.DepositHistoryResponse);
                    // ntrivedi parsing will be in  caller method 25-10-2018
                    //JArray jarr = (JArray)person1.SelectToken("transfers");
                    //if (Convert.ToString(GenerateResponse.SelectToken("coin")).ToLower() == CommonMethod.SMSCode.ToLower())
                    //{
                    //    if (CommonMethod.Category == 1) // For BTC , BTG , BCH Response 
                    //    {
                    //        if(GenerateResponse !=null)
                    //        {
                    //            if(GenerateResponse.SelectToken("txid").ToString().Equals(dSet.Tables[0].Rows[0]["TrnID"]) && GenerateResponse.SelectToken("coin").ToString().Equals(dSet.Tables[0].Rows[0]["SMSCode"]))
                    //            {
                    //                if (GenerateResponse.SelectToken("entries") != null)
                    //                {
                    //                    foreach (var iv in GenerateResponse.SelectToken("entries"))
                    //                    {
                    //                        if (!IsNullOrEmpty(iv["address"]) && !IsNullOrEmpty(iv["value"]) && !IsNullOrEmpty(iv["valueString"]))
                    //                        {
                    //                            if (iv["address"].ToString().Equals(dSet.Tables[0].Rows[0]["address"]) && Convert.ToInt32(iv["value"]) >0 && Convert.ToDecimal(iv["value"])== Convert.ToDecimal(dSet.Tables[0].Rows[0]["Amount"]))
                    //                            {
                    //                                iv["address"] = iv["address"].ToString();
                    //                                iv["Amount"] = Convert.ToDecimal(iv["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(iv["btc"])]);                       
                    //                            }
                    //                        }
                    //                    }
                    //                }
                    //            }                                                              
                    //        }                                                      
                    //    }
                    //    else if (CommonMethod.Category == 2) // For LTC Response
                    //    {
                    //        foreach (var item in GenerateResponse.SelectToken("transfers").Select((val, i) => new { i, val }))
                    //        {
                    //            item.val["IsValid"] = false;
                    //            if (!IsNullOrEmpty(item.val["entries"]) && !IsNullOrEmpty(item.val["id"]) && !IsNullOrEmpty(item.val["txid"]) && !IsNullOrEmpty(item.val["coin"]) && !IsNullOrEmpty(item.val["wallet"]) && !IsNullOrEmpty(item.val["value"]) && !IsNullOrEmpty(item.val["state"]))
                    //            {

                    //                foreach (var item1 in item.val.SelectToken("entries"))
                    //                {
                    //                    if (Convert.ToString(item1["value"]) == Convert.ToString(item.val["value"]) && !IsNullOrEmpty(item1["wallet"]))
                    //                    {
                    //                        string value = (string)item1.SelectToken("address");
                    //                        item.val["address"] = value;
                    //                        if (Convert.ToString(item.val["coin"]) == "xrp" && !Convert.ToString(item1.SelectToken("address")).Contains("?dt="))
                    //                        {
                    //                            item.val["IsValid"] = false;
                    //                            continue;
                    //                        }
                    //                        item.val["Amount"] = Convert.ToDecimal(item.val["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(item.val["coin"])]);
                    //                        item.val["IsValid"] = true;
                    //                    }
                    //                }
                    //            }
                    //            if (Convert.ToBoolean(item.val["IsValid"]))
                    //            {
                    //                CommonMethod.Transfers.Add(JsonConvert.DeserializeObject<RespTransfers>(JsonConvert.SerializeObject(item.val)));
                    //                Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                    //            }
                    //        }
                    //    }
                    //}
                    CommonFunctions.WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyAPI", CommonMethod.SMSCode, Action: 2);
                    return "";
                }

            }
            catch (Exception ex)
            {

                CommonFunctions.WriteErrorLog(ex, "Program", "CallThirdPartyAPI");
                return "";
            }
        }

        private static string CallThirdPartyCryptoAPI(ref CommonMethods CommonMethod, string Address, string TrnID, string AutoNo)
        {
            try
            {
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {

                    string authInfo = CommonMethod.UserName + ":" + CommonMethod.Password;
                    authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

                    WebRequest myReqrpc = WebRequest.Create(CommonMethod.Str_URL);
                    myReqrpc.Headers["Authorization"] = "Basic " + authInfo;
                    myReqrpc.Method = CommonMethod.Str_RequestType;

                    string ReqStr = @"" + CommonMethod.RequestBody; //@"{""id"":""" + 1 + @""",""method"":""getnewaddress"",""params"":[]}";
                    ReqStr = ReqStr.Replace("#Address#", Address);
                    ReqStr = ReqStr.Replace("#TrnID#", TrnID);
                    ReqStr = ReqStr.Replace("#AutoNo#", AutoNo);

                    CommonFunctions.WriteRequestLog("RPC Address generate Request :  " + ReqStr, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                    StreamWriter sw = new StreamWriter(myReqrpc.GetRequestStream());
                    sw.Write(ReqStr);
                    sw.Close();

                    WebResponse response = myReqrpc.GetResponse();

                    StreamReader StreamReader = new StreamReader(response.GetResponseStream());
                    CommonMethod.DepositHistoryResponse = StreamReader.ReadToEnd();
                    StreamReader.Close();
                    response.Close();

                    CommonFunctions.WriteRequestLog("RPC Address Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
            }
            catch (WebException webex)
            {
                WebResponse errResp = webex.Response;
                using (Stream respStream = errResp.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(respStream);
                    string Text = reader.ReadToEnd();
                    if (Text.ToLower().Contains("code"))
                        CommonMethod.DepositHistoryResponse = Text;
                    webex = null;
                    CommonFunctions.WriteRequestLog("BlockChainTransfer exception : " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode, Action: 2);
                }

                CommonFunctions.WriteRequestLog("webex : " + webex, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode, Action: 2);
                return CommonMethod.DepositHistoryResponse;
            }
        }

        //Uday 09-02-2019  Call EtherScan Confirmation Check API
        private static string CallThirdPartyEtherScanAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                string requestBody;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    CommonFunctions.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;

                    requestBody = CommonMethod.RequestBody.Replace("#Username#", CommonMethod.UserName);
                    requestBody = requestBody.Replace("#Password#", CommonMethod.Password);
                    requestBody = requestBody.Replace("#trnID#", trnID);


                    requestBody = requestBody.Replace("#coin#", CommonMethod.SMSCode);
                    requestBody = requestBody.Replace("#forwarder_address#", CommonMethod.Address);

                    CommonFunctions.WriteRequestLog("Request :  " + requestBody, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);


                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(requestBody);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();

                    }
                    httpWebResponse.Close();
                    CommonFunctions.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);

                    CommonFunctions.WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode, Action: 2);
                    return "";
                }

            }
            catch (Exception ex)
            {

                CommonFunctions.WriteErrorLog(ex, "Program", "CallThirdPartyEtherScanAPI TrnID=" + trnID);
                return "";
            }
        }

        private static string CallThirdPartyTronAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                string requestBody;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    CommonFunctions.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyTronAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;
                    if (CommonMethod.UserName != null)
                    {
                        CommonMethod.RequestBody = CommonMethod.RequestBody.Replace("#Username#", CommonMethod.UserName);
                        CommonMethod.RequestBody = CommonMethod.RequestBody.Replace("#Password#", CommonMethod.Password);
                    }

                    requestBody = CommonMethod.RequestBody.Replace("#trnID#", trnID);//2019-5-20 temp

                    CommonFunctions.WriteRequestLog("Request :  " + requestBody, "CallThirdPartyTronAPI", CommonMethod.SMSCode);


                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(requestBody);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();

                    }
                    httpWebResponse.Close();
                    CommonFunctions.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyTronAPI", CommonMethod.SMSCode);

                    CommonFunctions.WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyTronAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyTronAPI", CommonMethod.SMSCode, Action: 2);
                    return "";
                }

            }
            catch (Exception ex)
            {

                CommonFunctions.WriteErrorLog(ex, "Program", "CallThirdPartyTronAPI TrnID=" + trnID);
                return "";
            }
        }

        private static string CallThirdPartyNEOAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                string requestBody;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    CommonFunctions.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyNEOAPI", CommonMethod.SMSCode);

                    CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#trnID#", trnID);//2019-5-20 temp

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;

                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();

                    }
                    httpWebResponse.Close();
                    CommonFunctions.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyNEOAPI", CommonMethod.SMSCode);

                    CommonFunctions.WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyNEOAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    CommonFunctions.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyNEOAPI", CommonMethod.SMSCode, Action: 2);
                    return "";
                }

            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "CallThirdPartyNEOAPI TrnID=" + trnID);
                return "";
            }
        }

        private static void sp_SelfOrder(string trnID, string SMSCode, decimal amount, long autoid, ref string RetMsg, ref Int32 RetCode, ref Int64 ErrorCode)
        {
            //string RetMsg = "";
            //Int32 RetCode = 0;
            //Int64 ErrorCode = 0;


            //, string ActionRemarks, Int16 RetCode, string RetMsg
            try
            {
                SqlParameter[] Params = new SqlParameter[]
                {
                    new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                    new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, trnID),
                    new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, SMSCode),
                    new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                    new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,autoid) ,
                    new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, 0) ,
                    new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,"") ,
                    new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, 0)
                };
                (new DataCommon()).ExecuteSP("sp_SelfOrder", ref Params);

                if (Params[5].Value != DBNull.Value)
                    RetCode = Convert.ToInt16(Params[5].Value);

                if (Params[6].Value != DBNull.Value)
                    RetMsg = Convert.ToString(Params[6].Value);

                if (Params[7].Value != DBNull.Value)
                    ErrorCode = Convert.ToInt64(Params[7].Value);

                CommonFunctions.WriteRequestLog("sp_SelfOrder Completed TrnID=trnID " + trnID + ",RetCode:" + RetCode.ToString() + " RetMsg:" + RetMsg, "ReconAction", SMSCode);
            }
            catch (Exception ex)
            {
                CommonFunctions.WriteErrorLog(ex, "Program", "ReconAction");
                throw ex;
            }
        }

        #endregion

        //public static IServiceCollection AddCustomDbContext(this IServiceCollection services)
        //{
        //    // Add framework services.
        //    services.AddDbContextPool<CleanArchitectureContext>(options =>
        //    {
        //        //string useSqLite = Startup.Configuration["Data:useSqLite"];
        //        //string useInMemory = Startup.Configuration["Data:useInMemory"];
        //        //if (useInMemory.ToLower() == "true")
        //        //{
        //        //    options.UseInMemoryDatabase("ClearArchitechture"); // Takes database name
        //        //}
        //        //else if (useSqLite.ToLower() == "true")
        //        //{
        //        //    var connection = Startup.Configuration["Data:SqlLiteConnectionString"];
        //        //    options.UseSqlite(connection);
        //        //    options.UseSqlite(connection, b => b.MigrationsAssembly("CleanArchitecture.Web"));

        //        //}
        //        //else
        //        //{
        //            var connection = Configuration["Data:SqlServerConnectionString"];
        //            options.UseSqlServer(connection);
        //            options.UseSqlServer(connection, b => b.MigrationsAssembly("CleanArchitecture.Web"));
        //        //}
        //        options.UseOpenIddict();
        //    });
        //    return services;
        //}

        //#region classDeclaration
        //public class walletServiceData
        //{
        //    public Int32 ServiceID { get; set; }
        //    public string SMSCode { get; set; }
        //    public int WallletStatus { get; set; }
        //    public int ServiceStatus { get; set; }
        //    public int RecordCount { get; set; }
        //    public int AppType { get; set; }
        //    // public int ValidDays { get; set; } 
        //}
        //public class CommonMethods
        //{
        //    public string TransactionFile;
        //    public string trnID;
        //    public string Authorization;
        //    public string enterprise;
        //    public string line;
        //    public string LeftTitle = null;
        //    public string[] StaticArray = new string[20];
        //    public char MainSaperator = ':';
        //    public int StaticCnt = 1;
        //    public string TrnLeftTitle = null;
        //    public StreamReader MsgFile;
        //    public string RequestType;
        //    public string Path_AddressGenerate, Path_CustomerDetail, Path_CustomerValidate, Path_CustomerRegistration, Path_BeneRegistration, Path_VerifyBeneficiary, Path_DeleteBeneficiary, Path_VerifyDeleteBeneficiary, PubKey;
        //    public string Str_URL = string.Empty;
        //    public string Str_RequestType;
        //    public string ContentType;
        //    public string Address1, Address2;
        //    public string ReturnMsg1, ReturnMsg2;
        //    public string SuccAPICodes;
        //    public string[] SuccAPICodesArray = new string[10];
        //    public string MatchRegex2;
        //    public string BeneActiveCode;
        //    public string DepositHistoryResponse;
        //    public List<RespTransfers> Transfers { get; set; }
        //    public string SqlStr = string.Empty;
        //    public DataSet dSet = new DataSet();
        //    public DataRow dRows = null;
        //    public string SMSCode = string.Empty;
        //    public int Category;
        //    public string UserName;
        //    public string AssetName;
        //    public string Password;
        //    public string RequestBody;
        //    public string AssetFromRequest;
        //    public long DMemberID;
        //    public List<RespLocalCoin> RespLocalCoins { get; set; }
        //    public decimal ConvertAmt { get; set; } // ntrivedi
        //    public string ProviderWalletID { get; set; }





        //    //public CommonMethods (IWalletService walletService)
        //    //{
        //    //    _walletService = walletService;
        //    //}

        //    //public WalletDrCrResponse callDepencency()
        //    //{

        //    //    try
        //    //    {

        //    //    }
        //    //    catch (Exception ex)
        //    //    {
        //    //        //ex = null;
        //    //        WriteErrorLog(ex, "Program", "CallAPI");
        //    //    }
        //    //}

        //}
        //enum EnAppType
        //{
        //    BitGoAPI = 1,
        //    CryptoAPI = 2
        //}

        //public class RespTransfers
        //{
        //    public long id { get; set; } // ntrivedi 28-05-2018 string to long
        //    public string coin { get; set; }
        //    public string wallet { get; set; }
        //    public string txid { get; set; }
        //    public string address { get; set; }
        //    public string fromAddress { get; set; }
        //    //public int height { get; set; }
        //    //public DateTime date { get; set; }
        //    public long confirmations { get; set; }
        //    public long value { get; set; }
        //    //public string valueString { get; set; }
        //    //public string feeString { get; set; }
        //    //public int payGoFee { get; set; }
        //    //public string payGoFeeString { get; set; }
        //    //public double usd { get; set; }
        //    //public double usdRate { get; set; }
        //    public string state { get; set; }
        //    //public IList<string> tags { get; set; }
        //    public string confirmedTime { get; set; }
        //    public string unconfirmedTime { get; set; }
        //    public string createdTime { get; set; }
        //    public bool IsValid { get; set; }
        //    public decimal Amount { get; set; }
        //    public long OrderId { get; set; }
        //    public string valueStr { get; set; }
        //}

        //public class RespLocalCoin
        //{
        //    public long confirmations { get; set; }
        //    public string txid { get; set; }
        //    public string address { get; set; }
        //    public string confirmedTime { get; set; }
        //    public string unconfirmedTime { get; set; }
        //    public int value { get; set; }
        //    public decimal Amount { get; set; }
        //}
        //#endregion


        //#region CallBackProcess
        //private static void CallAPI()
        //{
        //    string SqlStr = string.Empty;
        //    DataSet dSet = new DataSet();
        //    try
        //    {

        //        SqlStr = " SELECT 1 As AppType,SM.Id as ServiceID , SM.SMSCode,WM.Status AS WalletStatus , SM.Status AS ServiceStatus FROM WalletTypeMasters WM INNER JOIN ServiceMaster SM ON SM.WalletTypeID=WM.id WHERE WM.status = 1 and WM.IsDepositionAllow = 1";
        //        dSet = (new DataCommon()).OpenDataSet("WalletTypeMasters", SqlStr, dSet, 30);
        //        if (dSet.Tables[0].Rows.Count > 0)
        //        {
        //            foreach (DataRow dRow in dSet.Tables[0].Rows)
        //            {
        //                // Need common row object for each SMScode
        //                walletServiceData walletServiceDataObj = new walletServiceData();
        //                walletServiceDataObj.ServiceID = Convert.ToInt32(dRow["ServiceID"]);
        //                walletServiceDataObj.SMSCode = dRow["SMSCode"].ToString();
        //                walletServiceDataObj.WallletStatus = Convert.ToInt16(dRow["WalletStatus"]);
        //                walletServiceDataObj.ServiceStatus = Convert.ToInt16(dRow["ServiceStatus"]);
        //                walletServiceDataObj.AppType = Convert.ToInt16(dRow["AppType"]); // 2 for Local Coin
        //                                                                                 //   walletServiceDataObj.ValidDays = Convert.ToInt16(dRow["ValidDays"]); // komal 10/9/2018 get valid days from Table
        //                                                                                 //walletServiceDataObj.DeliveryRowsCount  = Convert.ToInt16(dRow["DeliveryRowsCount"]); // komal 10/9/2018 get Top count days from Table
        //                walletServiceDataObj.RecordCount = 5; //komal 10/9/2018 
        //                Console.Title = walletServiceDataObj.SMSCode + " Topup "; // ntrivedi easy to find 13-09-2018
        //                lock (walletServiceDataObj)
        //                {
        //                    //isreturnwithfailure = false;
        //                    if (IsProcessing == false)
        //                    {
        //                        //isreturnwithfailure = true;
        //                        WaitCallback callBack;
        //                        callBack = new WaitCallback(CallAPISingle); // create thread for each SMSCode
        //                        ThreadPool.QueueUserWorkItem(callBack, walletServiceDataObj);

        //                    }
        //                    else
        //                    {
        //                        WriteRequestLog("IsProcessing = true so return ", "CallAPI", walletServiceDataObj.SMSCode, Action: 2);
        //                    }

        //                    //Thread.Sleep(100);
        //                    //}
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //ex = null;
        //        WriteErrorLog(ex, "Program", "CallAPI");
        //    }
        //    finally
        //    {
        //        //TransactionTick.Start(); //ntrivedi temperory 28-06-2018
        //    }
        //}
        //#endregion

        //#region Logging
        //public static void WriteLogIntoFile(byte CheckReq_Res, DateTime Date, string MethodName, string Controllername, string Req_Res = null, string accessToken = null)
        //{
        //    var logger = NLog.LogManager.GetCurrentClassLogger();
        //    try
        //    {
        //        if (CheckReq_Res == 1)
        //        {
        //            logger.Info("\nDate:" + Date + "\nMethodName:" + MethodName + ", Controllername: " + Controllername + "\nAccessToken: " + accessToken + "\nRequest: " + Req_Res + "\n===================================================================================================================");
        //        }
        //        else //if(CheckReq_Res==2)
        //        {
        //            logger.Info("\nDate:" + Date + "\nMethodName:" + MethodName + ", Controllername: " + Controllername + "\nResponse: " + Req_Res + "\n===================================================================================================================");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex);
        //    }
        //}
        //public static void WriteErrorLog(Exception ex, string methodName, string Source, string OtherInfo = "")
        //{
        //    var logger = NLog.LogManager.GetCurrentClassLogger();
        //    try
        //    {
        //        logger.Error("\nDate:" + UTC_To_IST() + "\nMethodName:" + methodName + ",Controllername: " + Source + "\nError: " + ex.Message + "\nOtherInfo:" +  OtherInfo  +"===================================================================================================================");
        //    }
        //    catch (Exception ex1)
        //    {
        //        logger.Error(ex1);
        //    }
        //}
        //public static void WriteRequestLog(string inputString, string methodName, string APIName, int IsAllow = 1, int Action = 1)
        //{
        //    string strFilePath = string.Empty;
        //    try
        //    {
        //        if (IsAllow == 1) //komal 12-9-2018 write log or not
        //        {
        //            //OperationContext context = OperationContext.Current;
        //            //MessageProperties prop = context.IncomingMessageProperties;
        //            //RemoteEndpointMessageProperty endpoint =
        //            //    prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
        //            string ip = "";
        //            string dir = AppDomain.CurrentDomain.BaseDirectory + "\\LogFiles\\";
        //            //If Not Directory.Exists(dir) Then
        //            //    Directory.CreateDirectory(dir)
        //            //End If
        //            strFilePath = (dir + APIName + "Log" + Convert.ToString("_")) + UTC_To_IST().ToString("yyyyMMdd") + ".txt";

        //            dynamic maxRetry = 2;

        //            //for Error: The process cannot access the file because it is being used by another process
        //            for (int retry = 0; retry <= maxRetry - 1; retry++)
        //            {
        //                try
        //                {
        //                    if (Action == 1) //komal 12-9-2018 multi line log
        //                    {
        //                        using (StreamWriter sw = new StreamWriter(strFilePath, true))
        //                        {
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", System.Web.HttpContext.Current.Request.UserHostAddress.ToString());
        //                            sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            sw.WriteLine((Convert.ToString("-----> ") + methodName) + " " + " Time " + UTC_To_IST());
        //                            sw.WriteLine(" Response : {0}", inputString);
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            //sw.WriteLine("");
        //                            sw.Flush();
        //                            sw.Close();
        //                        }
        //                        break;
        //                    }
        //                    else if (Action == 2) // komal 12-9-2018 two line log
        //                    {
        //                        using (StreamWriter sw = new StreamWriter(strFilePath, true))
        //                        {
        //                            //sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", System.Web.HttpContext.Current.Request.UserHostAddress.ToString());
        //                            sw.WriteLine("----------------------------------------{0}---------------------------------------------------------", ip);
        //                            sw.WriteLine((Convert.ToString("-----> ") + methodName) + ":" + " Time " + UTC_To_IST() + ": Response - {0}", inputString);
        //                            //sw.WriteLine(" Response : {0}", inputString);
        //                            //sw.WriteLine("");
        //                            sw.Flush();
        //                            sw.Close();
        //                        }
        //                        break;
        //                    }
        //                    // TODO: might not be correct. Was : Exit For
        //                    //'Exit if success, either write three times
        //                }
        //                catch (IOException generatedExceptionName)
        //                {
        //                    if (retry < maxRetry - 1)
        //                    {
        //                        WriteErrorLog(generatedExceptionName, "Statuscheck app", "WriteRequestLog -Retry:Sleep");
        //                        // Wait some time before retry (2 secs)
        //                        Thread.Sleep(2000);
        //                        // handle unsuccessfull write attempts or just ignore.
        //                    }
        //                    else
        //                    {
        //                        WriteErrorLog(generatedExceptionName, "Statuscheck app", "WriteRequestLog-Retry Complete");
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        WriteErrorLog(ex, "Status check app", System.Reflection.MethodBase.GetCurrentMethod().Name + ":" + methodName);
        //        ex = null;
        //    }
        //}
        //#endregion

        //#region CommonFunction

        //private static void GetHistory(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        //{
        //    DataSet dSet = new DataSet();
        //    DataRow dRows = null;
        //    string SqlStr = string.Empty;
        //    decimal amount = 0;
        //    long trnno = 0;
        //    long autono = 0;
        //    string queryResult = "";
        //    int dayDiff = 1;
        //    try
        //    {
        //        //isreturnwithfailure = false;
        //        //if (IsProcessing)
        //        //{
        //        //    isreturnwithfailure = true;
        //        //    logs.WriteRequestLog("IsProcessing = true so return ", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
        //        //    return;
        //        //}
        //        //logs.WriteRequestLog("Fetching Rows :  " , "GetHistory", CommonMethod.SMSCode);
        //        //  dayDiff = walletServiceDataObj.ValidDays; //komal 10/9/2018 get valid days from table
        //        //dayDiff = (Configuration["DayDiff"] != string.Empty? Convert.ToInt16(Configuration["DayDiff"]):1);
        //        // ntrivedi 28-05-2018 temperory top 1
        //        SqlStr = "SELECT top " + walletServiceDataObj.RecordCount.ToString() + " ID, TrnID , Address, SMSCode, Amount, Confirmations,OrderID,isNull(FromAddress,'') as FromAddress From DepositHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0  order by UpdatedDate";
        //        dSet = (new DataCommon()).OpenDataSet("DepositHistory", SqlStr, dSet, 30);
        //        if (dSet.Tables[0].Rows.Count > 0)
        //        {
        //            //logs.WriteRequestLog("Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]),Action: 2);
        //            Console.WriteLine("Fetch Rows:" + dSet.Tables[0].Rows.Count);
        //            IsProcessing = true;
        //            WriteRequestLog("IsProcessing = true + Fetching Rows :  " + dSet.Tables[0].Rows.Count, "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2); // komal 10/9/2018 log for IsProcessing = true
        //            foreach (DataRow dRow in dSet.Tables[0].Rows)
        //            {
        //                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE Id = " + dRow["ID"].ToString() + ""; //ntrivedi 28-05-2018 trnid instead of AutoNo due to slow searching on TrnID
        //                (new DataCommon()).ExecuteQuery(SqlStr);
        //            }
        //            //IsProcessing = false;  //komal 10/9/2018 move to CallAPISingle()
        //            WriteRequestLog("Total Count :" + dSet.Tables[0].Rows.Count + " IsProcessing :" + IsProcessing.ToString(), "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);//komal 10/9/2018 test
        //            foreach (DataRow dRow in dSet.Tables[0].Rows)
        //            {
        //                trnID = dRow["TrnID"].ToString();
        //                amount = 0;
        //                autono = Convert.ToInt64(dRow["ID"]);
        //                WriteRequestLog("New Loop TrnID :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
        //                String Response = CallThirdPartyAPI(ref CommonMethod, trnID, CommonMethod.Authorization, CommonMethod.enterprise, dSet); // Generate ThirdParty API Response

        //                ; /*CallThirdPartyCryptoAPI(ref CommonMethod, dRow["Address"].ToString(), dRow["TrnID"].ToString(), dRow["AutoNo"].ToString())*/
        //                if (Response == string.Empty) // ntrivedi 28-05-2018
        //                {
        //                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + dRow["ID"].ToString() + "";
        //                    (new DataCommon()).ExecuteQuery(SqlStr);
        //                    WriteRequestLog("Thirdparty Response Null for TrnID :  " + dRow["TrnID"].ToString(), "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
        //                    continue;
        //                }
        //                BitGoResponses TPGenerateResponse = new BitGoResponses();
        //                RespTransfers transferObj = new RespTransfers();
        //                TPGenerateResponse = JsonConvert.DeserializeObject<BitGoResponses>(Response);
        //                //JObject GenerateResponse = JObject.Parse(Response);
        //                if (TPGenerateResponse != null)
        //                {
        //                    if (TPGenerateResponse.coin.ToLower() == CommonMethod.SMSCode.ToLower() && TPGenerateResponse.type == "receive") // For BTC , BTG , BCH Response 
        //                    {
        //                        if (TPGenerateResponse.entries != null)
        //                        {
        //                            string trnid = dSet.Tables[0].Rows[0]["TrnID"].ToString();
        //                             trnid = dSet.Tables[0].Rows[0]["SMSCode"].ToString();

        //                            if (TPGenerateResponse.txid == (dSet.Tables[0].Rows[0]["TrnID"]).ToString() && TPGenerateResponse.coin.ToLower()== (dSet.Tables[0].Rows[0]["SMSCode"]).ToString().ToLower())
        //                            {
        //                                if (TPGenerateResponse.entries != null)
        //                                {
        //                                    foreach (var iv in TPGenerateResponse.entries)
        //                                    {
        //                                        if (!string.IsNullOrEmpty(iv.address) && iv.value > 0)
        //                                        {
        //                                            if (iv.value <= 0)
        //                                            {
        //                                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative amount' WHERE ID = " + dRow["ID"].ToString() + "";
        //                                                (new DataCommon()).ExecuteQuery(SqlStr);
        //                                                continue;
        //                                            }
        //                                            if (iv.address.ToString().Equals(dSet.Tables[0].Rows[0]["address"]) && iv.wallet == CommonMethod.ProviderWalletID)
        //                                            {
        //                                                // iv["address"] = iv["address"].ToString();
        //                                                //iv["Amount"] = Convert.ToDecimal(iv["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(iv["btc"])]);
        //                                                amount = Math.Round((iv.value / CommonMethod.ConvertAmt), 8);
        //                                                transferObj.id = Convert.ToInt64(dRow["ID"]);
        //                                                transferObj.Amount = Convert.ToDecimal(amount);
        //                                                transferObj.coin = CommonMethod.SMSCode;
        //                                                transferObj.txid = TPGenerateResponse.txid;
        //                                                // transferObj.Value = Convert.ToDecimal(dRow["Value"]);
        //                                                transferObj.OrderId = Convert.ToInt64(dRow["OrderID"]);
        //                                                transferObj.address = dRow["Address"].ToString();
        //                                                transferObj.fromAddress = dRow["FromAddress"].ToString();
        //                                                transferObj.confirmations = TPGenerateResponse.confirmations;
        //                                                if (transferObj.confirmations < 0) //ntrivedi treat as failed 26-07-2018
        //                                                {
        //                                                    WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode, Action: 2);
        //                                                    SqlStr = "UPDATE DepositHistory SET IsProcessing = 0,Status=9,StatusMsg='negative confirmation' WHERE ID = " + dRow["ID"].ToString() + "";
        //                                                    (new DataCommon()).ExecuteQuery(SqlStr);
        //                                                    continue;
        //                                                }

        //                                                //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);
        //                                                transferObj.valueStr = TPGenerateResponse.valueString;
        //                                                transferObj.unconfirmedTime = TPGenerateResponse.unconfirmedTime.ToString();
        //                                                transferObj.confirmedTime = TPGenerateResponse.confirmedTime.ToString();
        //                                                CommonMethod.Transfers.Add(transferObj);
        //                                            }
        //                                            else
        //                                            {
        //                                                SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='mismatch walletid or address' WHERE ID = " + dRow["ID"].ToString() + "";
        //                                                (new DataCommon()).ExecuteQuery(SqlStr);
        //                                            }
        //                                        }
        //                                    }
        //                                }
        //                            }
        //                        }
        //                        else
        //                        {
        //                            SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='thirparty amount not found' WHERE ID = " + dRow["ID"].ToString() + "";
        //                            (new DataCommon()).ExecuteQuery(SqlStr);
        //                        }
        //                    }

        //                    else
        //                    {
        //                        SqlStr = "UPDATE DepositHistory SET IsProcessing = 1,Status=9,StatusMsg='error not null Thirpdarty response' WHERE ID = " + dRow["ID"].ToString() + "";
        //                        (new DataCommon()).ExecuteQuery(SqlStr);
        //                    }
        //                    WriteRequestLog("Loop done :" + dRow["TrnID"].ToString() + " IsProcessing :" + IsProcessing.ToString() + "", "GetHistory", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
        //                }

        //                Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE ID = " + autono + "";
        //        (new DataCommon()).ExecuteQuery(SqlStr);
        //        WriteErrorLog(ex, "Program", "GetHistory");
        //    }
        //}
        //public static DateTime UTC_To_IST()
        //{
        //         DateTime myUTC = DateTime.UtcNow;
        //        // 'Dim utcdate As DateTime = DateTime.ParseExact(DateTime.UtcNow, "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
        //        // Dim utcdate As DateTime = DateTime.ParseExact(myUTC, "M/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture)
        //        // 'Dim utcdate As DateTime = DateTime.ParseExact("11/09/2016 6:31:00 PM", "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
        //        DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(myUTC, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //        // MsgBox(myUTC & " - " & utcdate & " - " & istdate)
        //        return istdate;

        //}

        //private static void TradeDepositHistoryUpdationForBitgo(ref CommonMethods CommonMethod)
        //{
        //    DataSet dSet = new DataSet();
        //    string SqlStr = string.Empty;
        //    string queryResult;
        //    try
        //    {
        //        if (CommonMethod.Transfers.Count > 0)
        //        {
        //            foreach (var item in CommonMethod.Transfers)
        //            {
        //                // update                         
        //                CommonMethod.SqlStr = "UPDATE DepositHistory SET Amount=" + item.Amount + ",Confirmations =" + item.confirmations + ", ConfirmedTime ='" + item.confirmedTime + "', unconfirmedTime  ='" + item.unconfirmedTime + "', UpdatedDate = dbo.GetISTDate(),SystemRemarks='Str Amt:" + item.valueStr + "' WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
        //                (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
        //                WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryUpdationForBitgo", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);

        //                if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' and Address='" + item.address + "'") == "0")
        //                {
        //                    // ntrivedi 27-06-2018 IF fromaddress(DepositHistory) is fix DT address then debit from Distributor otherwise debit from ORG 
        //                    //if (!string.IsNullOrEmpty(item.fromAddress))
        //                    //{
        //                    //    SqlStr = "select * from AddressMaster Where PublicAddress=@PublicAddress and Status=1";
        //                    //    queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress", item.fromAddress, SqlStr);
        //                    //    if (string.IsNullOrEmpty(queryResult))
        //                    //    {
        //                    //        CommonMethod.DMemberID = 1;// organization
        //                    //    }
        //                    //    else
        //                    //    {
        //                    //        CommonMethod.DMemberID = Convert.ToInt64(queryResult);
        //                    //    }
        //                    //}

        //                    SqlStr = "select top 1 UserID from BizUserTypeMapping where UserType=0 order by UserID";
        //                    queryResult = (new DataCommon()).ExecuteScalarWDM(SqlStr);// organization
        //                    if (string.IsNullOrEmpty(queryResult))
        //                    {
        //                        SqlStr = "UPDATE DepositHistory SET StatusMsg='Org Record Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
        //                        (new DataCommon()).ExecuteQuery(SqlStr);
        //                        CommonMethod.DMemberID = 0;
        //                        continue;
        //                    }
        //                    else
        //                    {
        //                        CommonMethod.DMemberID = Convert.ToInt64(queryResult);
        //                    }

        //                    SqlStr = "select ID from AddressMaster Where Address=@PublicAddress and Status=1";
        //                    queryResult = (new DataCommon()).ExecuteScalarWDMParameterize("@PublicAddress", item.address, SqlStr);
        //                    if (string.IsNullOrEmpty(queryResult))
        //                    {
        //                        SqlStr = "UPDATE DepositHistory SET StatusMsg='Address Not found',Status=9,IsProcessing = 0 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
        //                        (new DataCommon()).ExecuteQuery(SqlStr);
        //                        CommonMethod.DMemberID = 0;
        //                        continue;
        //                    }

        //                    //if (item.OrderId == 0)
        //                    //{
        //                    //    // create Order
        //                    //    //CreateOrder(ref CommonMethod, item);
        //                    //}

        //                    // Delivery Process Order
        //                    if (item.confirmations >= 3) ////ntrivedi 11-05-2018 
        //                    {
        //                        //DeliveryProcessOrder(ref CommonMethod, item, 1, CommonMethod.DMemberID);
        //                        // trn pr , status ,date 
        //                        // ntrivedi move inside delivery process order function
        //                        //SqlStr = "INSERT INTO TradeDepositCompletedTrn(TrnID, Status, CreatedTime) VALUES('" + item.txid + "', 1 , dbo.GetISTDate())";
        //                        //(new DataCommon()).ExecuteQuery(SqlStr);
        //                        //WalletService walletService = new WalletService();



        //                    }
        //                }
        //                else // Order Already Intialized
        //                {
        //                    SqlStr = "UPDATE DepositHistory SET status = 9 WHERE ID=" + item.id; //TrnID = '" + item.txid + "'";
        //                    (new DataCommon()).ExecuteQuery(SqlStr);
        //                    WriteRequestLog("Order Already Intialized | " + item.txid, "TradeDepositHistoryUpdationForCryptoCoin", CommonMethod.SMSCode, Action: 2);
        //                }

        //                SqlStr = "UPDATE DepositHistory SET IsProcessing = 0 WHERE AutoNo=" + item.id; //TrnID = '" + item.txid + "'";
        //                (new DataCommon()).ExecuteQuery(SqlStr);
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForBitgo");
        //    }
        //}
        //private static void CallAPISingle(object RefObj)
        //{
        //    string smscode = "";/*string trnID= "ddaa745649f8f09564daa1aaa51716ef49175b328c8d87aba4b207b3f178d620"; string Authorization = "Bearer v2x5e587227b1085bdcd4d5bd3421f0a702fff86d2137af0cf3a8624655d4e42f71"; string enterprise = "5a79359692f6f738073dffcbbb0c22df";*/
        //    try
        //    {
        //        walletServiceData walletServiceDataObj = (walletServiceData)RefObj;
        //        CommonMethods CommonMethod = new CommonMethods();
        //        CommonMethod.Transfers = new List<RespTransfers>(); // Need object of RespTransfers  for Thirdparty ApI response
        //        //CommonMethod.RespLocalCoins = new List<RespLocalCoin>(); // Need object of RespLocalCoins  for Thirdparty ApI response
        //        CommonMethod.SMSCode = walletServiceDataObj.SMSCode;
        //        smscode = CommonMethod.SMSCode;
        //        ReadMasterFile(walletServiceDataObj.SMSCode, ref CommonMethod); // Read  Master File
        //        if (!string.IsNullOrEmpty(CommonMethod.Path_AddressGenerate))
        //        {
        //            ReadTransactionalFile(CommonMethod.Path_AddressGenerate, ref CommonMethod); // Read Transaction file for specific coin               
        //            if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
        //            {
        //                switch (walletServiceDataObj.AppType)
        //                {
        //                    case (int)EnAppType.BitGoAPI:
        //                        GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID);
        //                        TradeDepositHistoryUpdationForBitgo(ref CommonMethod);
        //                        //CallThirdPartyAPI(ref CommonMethod,trnID,Authorization,enterprise,null); // Generate ThirdParty API Response
        //                        //TradeDepositHistoryInsertion(ref CommonMethod); // Insert Trade Deposit History
        //                        break;
        //                    case (int)EnAppType.CryptoAPI:
        //                        //if (!string.IsNullOrEmpty(CommonMethod.UserName) && !string.IsNullOrEmpty(CommonMethod.Password) && !string.IsNullOrEmpty(CommonMethod.RequestBody))
        //                        //{
        //                        //GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.trnID, CommonMethod.Authorization, CommonMethod.enterprise); // Get History From Deposit History SMScode Wise 
        //                        //TradeDepositHistoryUpdationForCryptoCoin(ref CommonMethod); // Update Crypto coin into Trade Deposit History
        //                        //}
        //                        //else
        //                        //{
        //                        //    logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
        //                        //}
        //                        break;
        //                    default:
        //                        break;
        //                }
        //            }
        //            else
        //            {
        //                WriteRequestLog("Transaction Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
        //            }
        //        }
        //        else
        //        {
        //            WriteRequestLog("Master File Detail not found", "CallAPISingle", CommonMethod.SMSCode, Action: 2);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //ex = null;
        //        WriteErrorLog(ex, "Program", "CallAPISingle");
        //    }
        //    finally
        //    {
        //        IsProcessing = false; //komal 10/9/2018 finally stop thread 
        //        WriteRequestLog("IsProcessing = false ", "CallAPISingle", smscode, Action: 2);
        //    }
        //}
        //#endregion

        //#region "ReadMasterFile"

        //public static void ReadMasterFile(string APIName, ref CommonMethods CommonMethod)
        //{
        //    string FilePath = Configuration["MainPath"] + "\\MasterFile_" + APIName + ".txt";

        //    try
        //    {
        //        if (System.IO.File.Exists(FilePath) == true)
        //        {
        //            CommonMethod.StaticArray[0] = "0";
        //            CommonMethod.TransactionFile = Configuration["MainPath"]; //FilePath

        //            string[] lines = System.IO.File.ReadAllLines(FilePath);
        //            foreach (string line in lines)
        //            {
        //                CommonMethod.LeftTitle = line.Substring(0, line.IndexOf(CommonMethod.MainSaperator)).ToLower();

        //                if (CommonMethod.LeftTitle.ToUpper().Contains("STATIC"))
        //                {
        //                    //Start with #1 Position
        //                    CommonMethod.StaticArray[CommonMethod.StaticCnt++] = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                    //StaticCnt++;
        //                }
        //                else if (CommonMethod.LeftTitle == "apiname")
        //                {
        //                    CommonMethod.TransactionFile = CommonMethod.TransactionFile + "\\" + APIName + "\\";
        //                }
        //                else if (CommonMethod.LeftTitle == "requesttype")
        //                {
        //                    CommonMethod.RequestType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.LeftTitle == "transactionfilepath")
        //                {
        //                    CommonMethod.Path_AddressGenerate = CommonMethod.TransactionFile + line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }

        //            }

        //            WriteRequestLog("Transaction File Path :  " + CommonMethod.Path_AddressGenerate, "ReadMasterFile", CommonMethod.SMSCode);
        //        }
        //        else
        //        {

        //            WriteRequestLog(FilePath + " File Not Found", "ReadMasterFile", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        WriteErrorLog(ex, "Program", "ReadMasterFile");
        //    }
        //}

        //public static void ReadTransactionalFile(string Path, ref CommonMethods CommonMethod)
        //{

        //    try
        //    {
        //        //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
        //        if (System.IO.File.Exists(Path) == true)
        //        {
        //            string[] lines = System.IO.File.ReadAllLines(Path);
        //            foreach (string line in lines)
        //            {
        //                CommonMethod.TrnLeftTitle = line.Substring(0, line.IndexOf(CommonMethod.MainSaperator)).ToLower();

        //                if (CommonMethod.TrnLeftTitle.ToUpper().Contains("URL")) //Read URL
        //                {
        //                    CommonMethod.Str_URL = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("requesttype")) //Read Request Type 
        //                {
        //                    CommonMethod.Str_RequestType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("contenttype")) //Read Content Type
        //                {
        //                    CommonMethod.ContentType = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("category")) //Read Category Type
        //                {
        //                    CommonMethod.Category = Convert.ToInt16(line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1));
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("assetname")) //Read AssetName
        //                {
        //                    CommonMethod.AssetName = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("username")) //Read Username
        //                {
        //                    CommonMethod.UserName = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("password")) //Read Password
        //                {
        //                    CommonMethod.Password = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("requestbody")) //Read RequestBody
        //                {
        //                    CommonMethod.RequestBody = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("assetfromrequest")) //Read RequestBody
        //                {
        //                    CommonMethod.AssetFromRequest = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("authorization"))
        //                {
        //                    CommonMethod.Authorization = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("trnID"))
        //                {
        //                    CommonMethod.trnID = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("enterprise"))
        //                {
        //                    CommonMethod.enterprise = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("convertamt")) //Read RequestBody
        //                {
        //                    CommonMethod.ConvertAmt = Convert.ToInt64(line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1));
        //                }
        //                else if (CommonMethod.TrnLeftTitle.Contains("providerwalletid")) //Read RequestBody
        //                {
        //                    CommonMethod.ProviderWalletID = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
        //                }
        //                //Console.WriteLine(CommonMethod.Str_URL + CommonMethod.Str_RequestType + CommonMethod.ContentType);
        //            }

        //            WriteRequestLog("Transaction URL :  " + CommonMethod.Str_URL + " Request Type : " + CommonMethod.Str_RequestType + " Content Type : " + CommonMethod.ContentType, "ReadTransactionalFile", CommonMethod.SMSCode);
        //        }
        //        else
        //        {
        //            WriteRequestLog(Path + " File Not Found", "ReadTransactionalFile", CommonMethod.SMSCode, Convert.ToInt16(Configuration["AllowLog"]), Action: 2);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        WriteErrorLog(ex, "Program", "ReadTransactionalFile");
        //    }
        //}
        //#endregion


        //#region "CallThirdPartyAPI"

        //private static string CallThirdPartyAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        //{
        //    try
        //    {
        //        //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
        //        if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
        //        {
        //            //vsolanki

        //            if (CommonMethod.Str_URL.Contains("#trnID#"))
        //            {
        //                CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#trnID#", trnID);
        //            }
        //            CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);
        //            WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyAPI", CommonMethod.SMSCode);

        //            var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
        //            httpWebRequest.ContentType = CommonMethod.ContentType;
        //            httpWebRequest.Method = CommonMethod.Str_RequestType;
        //            httpWebRequest.KeepAlive = false;
        //            httpWebRequest.Timeout = 180000;
        //            //vsolanki
        //            httpWebRequest.Headers.Add("Authorization", Authorization);
        //            httpWebRequest.Headers.Add("enterprise", enterprise);

        //            HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
        //            using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
        //            {
        //                CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
        //                StreamReaderObj.Close();
        //                StreamReaderObj.Dispose();

        //            }
        //            httpWebResponse.Close();
        //            WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyAPI", CommonMethod.SMSCode);
        //            //JObject GenerateResponse = JObject.Parse(CommonMethod.DepositHistoryResponse);
        //            // ntrivedi parsing will be in  caller method 25-10-2018
        //            //JArray jarr = (JArray)person1.SelectToken("transfers");
        //            //if (Convert.ToString(GenerateResponse.SelectToken("coin")).ToLower() == CommonMethod.SMSCode.ToLower())
        //            //{
        //            //    if (CommonMethod.Category == 1) // For BTC , BTG , BCH Response 
        //            //    {
        //            //        if(GenerateResponse !=null)
        //            //        {
        //            //            if(GenerateResponse.SelectToken("txid").ToString().Equals(dSet.Tables[0].Rows[0]["TrnID"]) && GenerateResponse.SelectToken("coin").ToString().Equals(dSet.Tables[0].Rows[0]["SMSCode"]))
        //            //            {
        //            //                if (GenerateResponse.SelectToken("entries") != null)
        //            //                {
        //            //                    foreach (var iv in GenerateResponse.SelectToken("entries"))
        //            //                    {
        //            //                        if (!IsNullOrEmpty(iv["address"]) && !IsNullOrEmpty(iv["value"]) && !IsNullOrEmpty(iv["valueString"]))
        //            //                        {
        //            //                            if (iv["address"].ToString().Equals(dSet.Tables[0].Rows[0]["address"]) && Convert.ToInt32(iv["value"]) >0 && Convert.ToDecimal(iv["value"])== Convert.ToDecimal(dSet.Tables[0].Rows[0]["Amount"]))
        //            //                            {
        //            //                                iv["address"] = iv["address"].ToString();
        //            //                                iv["Amount"] = Convert.ToDecimal(iv["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(iv["btc"])]);                       
        //            //                            }
        //            //                        }
        //            //                    }
        //            //                }
        //            //            }                                                              
        //            //        }                                                      
        //            //    }
        //            //    else if (CommonMethod.Category == 2) // For LTC Response
        //            //    {
        //            //        foreach (var item in GenerateResponse.SelectToken("transfers").Select((val, i) => new { i, val }))
        //            //        {
        //            //            item.val["IsValid"] = false;
        //            //            if (!IsNullOrEmpty(item.val["entries"]) && !IsNullOrEmpty(item.val["id"]) && !IsNullOrEmpty(item.val["txid"]) && !IsNullOrEmpty(item.val["coin"]) && !IsNullOrEmpty(item.val["wallet"]) && !IsNullOrEmpty(item.val["value"]) && !IsNullOrEmpty(item.val["state"]))
        //            //            {

        //            //                foreach (var item1 in item.val.SelectToken("entries"))
        //            //                {
        //            //                    if (Convert.ToString(item1["value"]) == Convert.ToString(item.val["value"]) && !IsNullOrEmpty(item1["wallet"]))
        //            //                    {
        //            //                        string value = (string)item1.SelectToken("address");
        //            //                        item.val["address"] = value;
        //            //                        if (Convert.ToString(item.val["coin"]) == "xrp" && !Convert.ToString(item1.SelectToken("address")).Contains("?dt="))
        //            //                        {
        //            //                            item.val["IsValid"] = false;
        //            //                            continue;
        //            //                        }
        //            //                        item.val["Amount"] = Convert.ToDecimal(item.val["value"]) / Convert.ToDecimal(Configuration[Convert.ToString(item.val["coin"])]);
        //            //                        item.val["IsValid"] = true;
        //            //                    }
        //            //                }
        //            //            }
        //            //            if (Convert.ToBoolean(item.val["IsValid"]))
        //            //            {
        //            //                CommonMethod.Transfers.Add(JsonConvert.DeserializeObject<RespTransfers>(JsonConvert.SerializeObject(item.val)));
        //            //                Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
        //            //            }
        //            //        }
        //            //    }
        //            //}
        //            WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyAPI", CommonMethod.SMSCode);
        //            return CommonMethod.DepositHistoryResponse;
        //        }
        //        else
        //        {
        //            WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyAPI", CommonMethod.SMSCode, Action: 2);
        //            return "";
        //        }

        //    }
        //    catch (Exception ex)
        //    {

        //        WriteErrorLog(ex, "Program", "CallThirdPartyAPI");
        //        throw ex;
        //    }
        //}

        //private static string CallThirdPartyCryptoAPI(ref CommonMethods CommonMethod, string Address, string TrnID, string AutoNo)
        //{
        //    try
        //    {
        //        //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
        //        if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
        //        {

        //            string authInfo = CommonMethod.UserName + ":" + CommonMethod.Password;
        //            authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

        //            WebRequest myReqrpc = WebRequest.Create(CommonMethod.Str_URL);
        //            myReqrpc.Headers["Authorization"] = "Basic " + authInfo;
        //            myReqrpc.Method = CommonMethod.Str_RequestType;

        //            string ReqStr = @"" + CommonMethod.RequestBody; //@"{""id"":""" + 1 + @""",""method"":""getnewaddress"",""params"":[]}";
        //            ReqStr = ReqStr.Replace("#Address#", Address);
        //            ReqStr = ReqStr.Replace("#TrnID#", TrnID);
        //            ReqStr = ReqStr.Replace("#AutoNo#", AutoNo);

        //            WriteRequestLog("RPC Address generate Request :  " + ReqStr, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
        //            StreamWriter sw = new StreamWriter(myReqrpc.GetRequestStream());
        //            sw.Write(ReqStr);
        //            sw.Close();

        //            WebResponse response = myReqrpc.GetResponse();

        //            StreamReader StreamReader = new StreamReader(response.GetResponseStream());
        //            CommonMethod.DepositHistoryResponse = StreamReader.ReadToEnd();
        //            StreamReader.Close();
        //            response.Close();

        //            WriteRequestLog("RPC Address Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
        //            return CommonMethod.DepositHistoryResponse;
        //        }
        //        else
        //        {
        //            WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
        //            return CommonMethod.DepositHistoryResponse;
        //        }
        //    }
        //    catch (WebException webex)
        //    {
        //        WebResponse errResp = webex.Response;
        //        using (Stream respStream = errResp.GetResponseStream())
        //        {
        //            StreamReader reader = new StreamReader(respStream);
        //            string Text = reader.ReadToEnd();
        //            if (Text.ToLower().Contains("code"))
        //                CommonMethod.DepositHistoryResponse = Text;
        //            webex = null;
        //            WriteRequestLog("BlockChainTransfer exception : " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode, Action: 2);
        //        }

        //        WriteRequestLog("webex : " + webex, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode, Action: 2);
        //        return CommonMethod.DepositHistoryResponse;
        //    }
        //}

        //#endregion
    }
}
