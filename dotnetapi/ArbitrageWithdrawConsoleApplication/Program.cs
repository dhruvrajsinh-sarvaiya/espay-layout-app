using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Configuration;
using System.Timers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Text;
using DepositStatusCheckApp;
using Microsoft.Extensions.Configuration;
using ArbitrageWithdrawConsoleApplication;
using Microsoft.Extensions.DependencyInjection;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Services.Transaction;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Infrastructure;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using CleanArchitecture.Core.Services;
using MediatR;
using CleanArchitecture.Core.Services.RadisDatabase;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.Entities.User;
using System.ComponentModel;
using CleanArchitecture.Core.ApiModels;

namespace ArbitrageWithdrawConsoleApplication
{
    public class Program
    {
        static DataCommon dComm = new DataCommon();
        static CommonFunctions logs = new CommonFunctions();
        public static IConfiguration Configuration { get; set; }

        static System.Timers.Timer TopupTick = new System.Timers.Timer();
        static System.Timers.Timer TransactionTick = new System.Timers.Timer();
        static bool IsProcessing = false;
        [STAThread]
        public static void Main(string[] args)
        {
            Console.Write("start");
            var builder = new ConfigurationBuilder()
                  .SetBasePath(Directory.GetCurrentDirectory())
                  .AddJsonFile("appsettings.json");
            Configuration = builder.Build();

            var conStr = Configuration["SqlServerConnectionString"];
            //IWalletDeposition bar = GetWithdrawObjectDependency(conStr);
            TransactionTick.Interval = Convert.ToInt32(Configuration["Interval"]); // 3000;
            TransactionTick.Elapsed += new ElapsedEventHandler(transaction_tick);
            TransactionTick.Start();
            Console.WriteLine("Press \'q\' to quit");
            while (Console.Read() != 'q') ;

        }

        #region TimerTick
        private static void transaction_tick(object sender, System.EventArgs e)
        {
            try
            {
                TransactionTick.Stop();
                //TransactionTick.Interval = 180000;
                CallAPI();
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "transaction_tick", ex.Source.ToString());
                ex = null;
            }
            finally
            {
               TransactionTick.Start();
            }
        }
        #endregion

        #region CallBackProcess

        private static void CallAPI()
        {
            string SqlStr = string.Empty;
            DataSet dSet = new DataSet();
            try
            {
                SqlStr = "select rt.ConvertAmount,rt.ServiceID,sp.ProviderName as 'RouteTag',sm.SMSCode,rt.Status,spd.ServiceProID,a.Id as 'AppType' from RouteConfigurationArbitrage rt inner join ServiceMasterArbitrage sm on sm.Id=rt.ServiceID inner join ServiceProviderDetailArbitrage spd on spd.Id=rt.SerProDetailID inner join AppType a on a.Id=spd.AppTypeID inner join ServiceProviderMasterArbitrage sp on sp.Id=spd.ServiceProID where rt.TrnType=6 and rt.status=1 ";
                dSet = (new DataCommon()).OpenDataSet("RouteConfiguration", SqlStr, dSet, 30);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        walletServiceData walletServiceDataObj = new walletServiceData();
                        walletServiceDataObj.ServiceID = Convert.ToInt32(dRow["ServiceID"]);
                        walletServiceDataObj.SerProID = Convert.ToInt64(dRow["ServiceProID"]);
                        walletServiceDataObj.SMSCode = dRow["SMSCode"].ToString();
                        walletServiceDataObj.WallletStatus = Convert.ToInt16(dRow["Status"]);
                        walletServiceDataObj.AppType = Convert.ToInt16(dRow["AppType"]);
                        walletServiceDataObj.RouteTag = dRow["RouteTag"].ToString();
                        walletServiceDataObj.CAmount = Convert.ToDecimal(dRow["ConvertAmount"]);
                        lock (walletServiceDataObj)
                        {
                            WaitCallback callBack;
                            callBack = new WaitCallback(CallAPISingle);
                            ThreadPool.QueueUserWorkItem(callBack, walletServiceDataObj);
                            Console.WriteLine(walletServiceDataObj.SMSCode);
                            //Thread.Sleep(500000);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallAPI");
            }
        }

        private static void CallAPISingle(object RefObj)
        {
            try
            {
                walletServiceData walletServiceDataObj = (walletServiceData)RefObj;
                CommonMethods CommonMethod = new CommonMethods();
                CommonMethod.Transfers = new List<RespTransfers>();
                CommonMethod.SMSCode = walletServiceDataObj.SMSCode;
                CommonMethod.SerProID = walletServiceDataObj.SerProID;
                CommonMethod.CovertAmount = walletServiceDataObj.CAmount;
                CommonMethod.RouteTag = walletServiceDataObj.RouteTag;
                string path = walletServiceDataObj.SMSCode + "_" + walletServiceDataObj.RouteTag;
                ReadMasterFile(path, ref CommonMethod);
                if (!string.IsNullOrEmpty(CommonMethod.Path_AddressGenerate))
                {
                    ReadTransactionalFile(CommonMethod.Path_AddressGenerate, ref CommonMethod);
                    if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                    {
                        logs.WriteRequestLog("Proceed for ", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                        if (walletServiceDataObj.RouteTag.Equals("BITGO"))
                        {
                            DataSet dSet = new DataSet();
                            GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.TrnId);
                        }

                        #region Other provider 
                        //else if (walletServiceDataObj.RouteTag.Equals("CRYPTO") && (!IsProcessing))
                        //{
                        //    if (!string.IsNullOrEmpty(CommonMethod.UserName) && !string.IsNullOrEmpty(CommonMethod.Password) && !string.IsNullOrEmpty(CommonMethod.RequestBody))
                        //    {
                        //        GetHistory(ref CommonMethod, walletServiceDataObj, CommonMethod.TrnId);
                        //    }
                        //    else
                        //    {
                        //        logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                        //    }
                        //}
                        //else if ((walletServiceDataObj.RouteTag.Equals("ERC-223") || (walletServiceDataObj.RouteTag.Equals("ERC-20(EtherScan)"))) && (!IsProcessing))
                        //{
                        //    if (!string.IsNullOrEmpty(CommonMethod.UserName) && !string.IsNullOrEmpty(CommonMethod.Password) && !string.IsNullOrEmpty(CommonMethod.RequestBody))
                        //    {
                        //        GetHistoryEtherScan(ref CommonMethod, walletServiceDataObj, CommonMethod.TrnId); 
                        //    }
                        //    else
                        //    {
                        //        logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                        //    }
                        //}
                        //else if (((walletServiceDataObj.RouteTag.Equals("Tron API")) && (!IsProcessing)) || ((walletServiceDataObj.RouteTag.Equals("SOXAPI")) && (!IsProcessing)))
                        //{
                        //    if (!string.IsNullOrEmpty(CommonMethod.UserName) && !string.IsNullOrEmpty(CommonMethod.Password) && !string.IsNullOrEmpty(CommonMethod.RequestBody))
                        //    {
                        //        GetHistoryTron(ref CommonMethod, walletServiceDataObj, CommonMethod.TrnId);
                        //    }
                        //    else
                        //    {
                        //        logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                        //    }
                        //}
                        #endregion

                        else
                        {
                            logs.WriteRequestLog("Route Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                        }
                    }
                    else
                    {
                        logs.WriteRequestLog("Transaction Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                    }
                }
                else
                {
                    logs.WriteRequestLog("Master File Detail not found", "CallAPISingle " + walletServiceDataObj.RouteTag, CommonMethod.SMSCode);
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallAPISingle");
            }
        }

        private static int CheckStatus(int confirmation)
        {
            int ActionType = 0;
            if (confirmation >= 3)
            {
                ActionType = 4;
            }
            return ActionType;
        }

        private static void GetHistory(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string SourceAddress = string.Empty;
            try
            {
                var conStr = Configuration["SqlServerConnectionString"];
                WithdrawalReconRequest request = new WithdrawalReconRequest();
                Console.WriteLine("Rows call post");
                SqlStr = "select top 5 TrnNo,0 as Charge,TrnID,ToAddress,Address,Amount,ToSerProID AS UserId,ProviderWalletID from ArbitrageDepositFund where status=6 AND IsProcessing = 0 and SMSCode='" + CommonMethod.SMSCode + "' and FromSerProID=" + CommonMethod.SerProID + " order by UpdatedDate";
                dSet = (new DataCommon()).OpenDataSet("ArbitrageDepositFund", SqlStr, dSet, 30);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    IsProcessing = true;
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        if (dSet.Tables[0].Rows.Count > 0)
                        {
                            SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 1,UpdatedDate=dbo.getistdate() WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }
                    }
                    Console.WriteLine("Rows count Fetch:" + dSet.Tables[0].Rows.Count.ToString());
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        string Response = CallThirdPartyAPI(ref CommonMethod, dRow["TrnId"].ToString(), CommonMethod.Authorization, CommonMethod.enterprise, dSet);
                        BitGoRes TPGenerateResponse = new BitGoRes();
                        RespTransfers transferObj = new RespTransfers();
                        TPGenerateResponse = JsonConvert.DeserializeObject<BitGoRes>(Response);
                        if (TPGenerateResponse != null)
                        {
                            if (TPGenerateResponse.entries != null)
                            {
                                string trnid = dRow["TrnID"].ToString();
                                if (TPGenerateResponse.id == (dRow["TrnID"]).ToString())
                                {
                                    if (TPGenerateResponse.entries != null)
                                    {
                                        foreach (var iv in TPGenerateResponse.entries)
                                        {
                                            if (!string.IsNullOrEmpty(iv.address) && iv.value > 0)
                                            {
                                                if (iv.value <= 0)
                                                {
                                                    SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=9 WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                                    continue;
                                                }
                                                if (iv.address.ToString().Equals(dSet.Tables[0].Rows[0]["Address"].ToString()))
                                                {
                                                    decimal amount = Math.Round((iv.value / CommonMethod.CovertAmount), 8);
                                                    if (Convert.ToDecimal(dRow["Amount"]) == amount)
                                                    {
                                                        if (iv.coinName.ToLower() == CommonMethod.SMSCode.ToLower())
                                                        {
                                                            transferObj.id = dRow["TrnID"].ToString();
                                                            transferObj.Amount = amount;
                                                            transferObj.coin = CommonMethod.SMSCode;
                                                            transferObj.txid = TPGenerateResponse.id;
                                                            transferObj.address = dRow["Address"].ToString();
                                                            transferObj.confirmations = TPGenerateResponse.confirmations;
                                                            if (transferObj.confirmations < 0)
                                                            {
                                                                request.ActionMessage = "Negative Confirmations";
                                                                request.ActionType = enWithdrawalReconActionType.Refund;
                                                                request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                                
                                                                logs.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                                SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=2,SystemRemarks='" + request.ActionMessage + "' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                                                continue;
                                                            }
                                                            else
                                                            {
                                                                logs.WriteRequestLog("confirmations  :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                                if (transferObj.confirmations >= 3)
                                                                {
                                                                    request.ActionMessage = "Success";
                                                                    request.ActionType = enWithdrawalReconActionType.Success;
                                                                    request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                                    //sp
                                                                    var res = Call_sp_CreditArbitrageProviderBalance(request.TrnNo, Convert.ToInt64(dRow["UserId"]), CommonMethod.SMSCode, Convert.ToDecimal(dRow["Amount"]));
                                                                    if (res.ReturnCode == 0)
                                                                    {
                                                                        SqlStr = "UPDATE ArbitrageDepositFund SET Status=1,SystemRemarks='Success',IsProcessing=0 WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                    }
                                                                    else
                                                                    {
                                                                        SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=9,SystemRemarks='" + res.ReturnMsg + "' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                                        logs.WriteRequestLog("Update Withdraw History :  " + dRow["TrnID"].ToString(), "GetHistory", "Remarks: " + res.ReturnMsg);
                                                                        continue;
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0, SystemRemarks='Success' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                }
                                                                (new DataCommon()).ExecuteQuery(SqlStr);

                                                            }
                                                            CommonMethod.Transfers.Add(transferObj);
                                                        }
                                                        else
                                                        {
                                                            Console.WriteLine("Coin Name Not Matched:" + iv.coinName.ToLower() + " " + CommonMethod.SMSCode.ToLower());
                                                            SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=9,SystemRemarks='CoinName Not Matched' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                                        }
                                                    }
                                                    else
                                                    {
                                                        SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 1,Status=9,SystemRemarks='Amount Not Matched' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                    }
                                                }
                                                else
                                                {
                                                    SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=9,SystemRemarks='Address Not Matched' WHERE Address='" + iv.address.ToString() + "' and  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0,Status=9  WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                                (new DataCommon()).ExecuteQuery(SqlStr);
                            }
                        }
                        else
                        {
                            SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0 WHERE TrnID = '" + dRow["TrnID"].ToString() + "' AND Address='" + dRow["Address"].ToString() + "' AND SerProID=" + CommonMethod.SerProID;
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " " + walletServiceDataObj.SMSCode);
                logs.WriteErrorLog(ex, "Program", "GetHistory" + " " + walletServiceDataObj.SMSCode);
            }
        }

        private static void TradeDepositHistoryUpdationForCryptoCoin(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            Int32 actionType;
            try
            {
                if (CommonMethod.Transfers.Count > 0)
                {
                    foreach (var item in CommonMethod.Transfers)
                    {
                        #region OLD Code
                        // update
                        //CommonMethod.SqlStr = "UPDATE ArbitrageDepositFund SET Confirmations =" + item.confirmations + ", confirmedTime ='" + item.confirmedTime + "', unconfirmedTime  ='" + item.unconfirmedTime + "', UpdatedDateTime = dbo.GetISTDate() WHERE TrnID = '" + item.txid + "' AND Address='" + item.address + "'";
                        //(new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                        //logs.WriteRequestLog("Update Deposit History :  " + item.txid, "TradeDepositHistoryInsertion", CommonMethod.SMSCode);

                        //if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' AND Address='" + item.address + "'") == "0")
                        //{
                        //    if (item.TrnNo == 0)
                        //    {
                        // create Order
                        // CreateOrder(ref CommonMethod, item);
                        //}

                        // Delivery Process Order
                        //if (item.confirmations >= 3)
                        //{
                        //DeliveryProcessOrder(ref CommonMethod, item, 1);
                        //    }
                        //}
                        //else // Order Already Intialized
                        //{
                        //    SqlStr = "UPDATE ArbitrageDepositFund SET status = 9,SystemRemarks='Order already proceed Crypto' WHERE TrnID = '" + item.txid + "' AND Address='" + item.address + "'";
                        //    (new DataCommon()).ExecuteQuery(SqlStr);
                        //    logs.WriteRequestLog("Order Already Intialized | " + item.txid, "TradeDepositHistoryUpdationForCryptoCoin", CommonMethod.SMSCode);
                        //}

                        //SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0 WHERE TrnID = '" + item.txid + "' AND Address='" + item.address + "'";
                        //(new DataCommon()).ExecuteQuery(SqlStr);
                        #endregion
                        actionType = CheckStatus(item.confirmations);
                        if (item.confirmations >= 3)
                        {
                            // update
                            CommonMethod.SqlStr = "UPDATE ArbitrageDepositFund SET Confirmations =" + item.confirmations + ", confirmedTime ='" + item.confirmedTime + "', unconfirmedTime  ='" + item.unconfirmedTime + "', UpdatedDateTime = dbo.GetISTDate(),status=1 WHERE TrnID = '" + item.txid + "' AND Address='" + item.address + "' AND SerProID=" + CommonMethod.SerProID;
                            (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                            logs.WriteRequestLog("Update Withdraw History :  " + item.txid, "TradeDepositHistoryInsertion", CommonMethod.SMSCode);

                            if (actionType == 4)
                            {
                                ReconAction(item.TrnNo, actionType, CommonMethod.SMSCode);
                            }
                        }
                        //Rita 14-7-18 common update , release this record from processing
                        SqlStr = "UPDATE ArbitrageDepositFund SET IsProcessing = 0 WHERE TrnID = '" + item.txid + "' AND Address='" + item.address + "' AND SerProID=" + CommonMethod.SerProID;
                        (new DataCommon()).ExecuteQuery(SqlStr);
                    }
                }
                IsProcessing = false;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "TradeDepositHistoryUpdationForCryptoCoin");
            }
        }

        private static void TradeWithdrawHistoryInsertion(ref CommonMethods CommonMethod)
        {
            DataSet dSet = new DataSet();
            //Int64 txno;
            Int32 actionType;
            //DataRow dRows = null;
            string SqlStr = string.Empty;
            try
            {
                foreach (var item in CommonMethod.Transfers)
                {
                    //Rushabh 09-07-2018 for ReconAction
                    item.TrnNo = GetTrnNo(item.id, CommonMethod.SMSCode, item.address);
                    actionType = CheckStatus(item.confirmations);
                    int Constatus = 0;
                    if (actionType > 3)
                    {
                        Constatus = 1;
                    }
                    else
                    {
                        Constatus = 4;
                    }
                    if (item.TrnNo > 0)
                    {
                        //if (Convert.ToInt16((new DataCommon()).ExecuteScalarWDM("Select Count(AccountNo) From MemberBankMaster Where AccountNo='" + item.address + "' AND BranchName = '" + item.coin.ToUpper() + "'")) > 0) 
                        //CommonMethod.SqlStr = "Select Count(AccountNo) From MemberBankMaster Where AccountNo = '" + item.address + "' AND BranchName = '" + CommonMethod.SMSCode.ToUpper() + "' AND SerProID=" + CommonMethod.ProviderID;
                        //if(Convert.ToInt32(new DataCommon().ExecuteScalarWDM(CommonMethod.SqlStr))>0)
                        //Rushabh 09-07-2018 Added provider condition
                        //{

                        CommonMethod.SqlStr = "SELECT TOP 1 AutoNo , Status From WithdrawHistory WHERE TrnID = '" + item.id + "' AND Address='" + item.address + "'";//Rita Added PK with ID and address , bcz now Same txnid with diff Address
                        dSet = (new DataCommon()).OpenDataSet("WithdrawHistory", CommonMethod.SqlStr, dSet, 30);

                        if (dSet.Tables[0].Rows.Count > 0)
                        {
                            // update
                            CommonMethod.SqlStr = "UPDATE WithdrawHistory SET Value =" + item.value + ", Amount =" + item.Amount + ", Address ='" + item.address + "', Confirmations =" + item.confirmations + ", confirmedTime ='" + item.confirmedTime + "', unconfirmedTime  ='" + item.unconfirmedTime + "',TrnNo=" + item.TrnNo + ",Charge=" + item.Fee + ",RouteTag='" + CommonMethod.RouteTag + "',SerProID=" + CommonMethod.SerProID + ", UpdatedDateTime = dbo.GetISTDate() WHERE TrnID = '" + item.id + "' AND Address='" + item.address + "'";
                            (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);
                            //(new CommonFunctions()).AddToLog(item.coin + " : " + i++);
                            logs.WriteRequestLog("Update Withdraw History :  " + item.id + " Address:" + item.address + " TrnNo:" + item.TrnNo, "TradeWithdrawHistoryInsertion", CommonMethod.SMSCode);
                        }
                        else
                        {
                            // insert
                            CommonMethod.SqlStr = "INSERT INTO WithdrawHistory(TrnID,SMSCode,WalletId,Address,Status,Confirmations,Value,confirmedTime,unconfirmedTime,createdTime,State,CreatedDateTime,TrnNo,Amount,SystemRemarks,ToAddress,Charge,RouteTag,SerProID,ProviderWalletID) " +
                            " VALUES('" + item.id + "','" + CommonMethod.SMSCode.ToUpper() + "','" + item.WalletID + "','" + item.address + "'," + Constatus + "," + item.confirmations + "," + item.value + ",'" + item.confirmedTime + "','" + item.unconfirmedTime + "','" + item.createdTime + "','" + item.state + "', dbo.GetISTDate()," + item.TrnNo + "," + item.Amount + ",'Inserted','" + item.address + "'," + item.Fee + ",'" + CommonMethod.RouteTag + "'," + CommonMethod.SerProID + "," + CommonMethod.walletid + ")";
                            (new DataCommon()).ExecuteQuery(CommonMethod.SqlStr);

                            // create Order
                            //CreateOrder(ref CommonMethod, item);
                            logs.WriteRequestLog("Insert Withdraw History with Txnid :  " + item.txid + " Address:" + item.address + " TrnNo:" + item.TrnNo, "TradeWithdrawHistoryInsertion", CommonMethod.SMSCode);
                        }

                        // Delivery Process Order                    
                        //if ((new DataCommon()).ExecuteScalarWDM("Select Count(TrnID) From TradeDepositCompletedTrn Where TrnID='" + item.txid + "' AND Address='" + item.address + "'") == "0")
                        //{
                        //if (item.TrnNo > 0 && actionType == 4)
                        //{
                        //DeliveryProcessOrder(ref CommonMethod, item);
                        //Add here TQ condition if status=4
                        CommonMethod.SqlStr = "SELECT Status FROM TransactionQueue WHERE TrnNo=" + item.TrnNo + " AND SMSCode='" + CommonMethod.SMSCode + "'";
                        Int32 Status = Convert.ToInt32(new DataCommon().ExecuteScalarWDM(CommonMethod.SqlStr));
                        if (Status == 4 && actionType == 4)
                        {
                            ReconAction(item.TrnNo, actionType, CommonMethod.SMSCode);//Rushabh 09-07-2018 Replace DeliveryProcessOrder With ReconAction
                        }

                        //}
                        //}
                        //else // Order Already Intialized
                        //{
                        //    SqlStr = "UPDATE WithdrawHistory SET status = 9,SystemRemarks='Txn Already Proceed BitGo' WHERE TrnID = '" + item.txid + "'  AND Address='" + item.address + "'";
                        //    (new DataCommon()).ExecuteQuery(SqlStr);
                        //    logs.WriteRequestLog("Order Already Intialized | " + item.txid + " Address:" + item.address, "TradeDepositHistoryUpdationForCryptoCoin", CommonMethod.SMSCode);
                        //}
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "TradeDepositHistoryInsertion");
            }
        }

        private static Int64 GetTrnNo(string txid, string wallet, string address)
        {
            Int64 no = 0;
            try
            {
                string SqlStr = "SELECT TQ.TrnNo FROM TransactionQueue TQ INNER JOIN TransactionRequest TR ON TR.TrnNo=TQ.TrnNo and TR.OprTrnID='" + txid + "' WHERE TQ.TrnType=6 and TQ.Status=4 and TQ.SMSCode='" + wallet + "'" + " and TQ.CustomerMobile='" + address + "'";
                string txno = (new DataCommon()).ExecuteScalarWDM(SqlStr);
                no = Convert.ToInt64(txno);
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "GetTrnNo");
            }
            return no;
        }

        private static BizResponseClass Call_sp_CreditArbitrageProviderBalance(Int64 TrnNo, Int64 ProviderId, string SMSCode, decimal Amount)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnNo),
                new SqlParameter("@ProviderId",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,ProviderId),
                new SqlParameter("@WalletTypeName",SqlDbType.VarChar, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,SMSCode),
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Amount),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = (new DataCommon()).ExecuteSP("sp_CreditArbitrageProviderBalance", ref param1);

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[4].Value);
                bizResponseClass.ReturnMsg = @param1[5].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[6].Value);

                logs.WriteRequestLog("Call_sp_CreditArbitrageProviderBalance:" + bizResponseClass.ErrorCode.ToString() + " RetMsg:" + bizResponseClass.ReturnMsg, "Call_sp_CreditArbitrageProviderBalance ", SMSCode);

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "Call_sp_CreditArbitrageProviderBalance");
                return null;
            }
        }

        private static void ReconAction(Int64 TrnNo, Int32 ActionType, string SMSCode)
        {
            string RetMsg = "";
            Int32 RetCode = 0;
            //, string ActionRemarks, Int16 RetCode, string RetMsg
            try
            {
                SqlParameter[] Params = new SqlParameter[]
                {
                    new SqlParameter("@TrnNo", SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnNo),
                    new SqlParameter("@ActionType", SqlDbType.TinyInt, 4, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, ActionType),
                    new SqlParameter("@ActionBy", SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, 999),
                    new SqlParameter("@ActRemarks", SqlDbType.VarChar, 150, ParameterDirection.Input, true, 0, 0, String.Empty, DataRowVersion.Default, "System.Withdraw.Success"),
                    new SqlParameter("@ReturnCode", SqlDbType.Int, 8, ParameterDirection.Output, true, 0, 0, String.Empty, DataRowVersion.Default, 0),
                    new SqlParameter("@ReturnMsg", SqlDbType.VarChar, 500, ParameterDirection.Output, true, 0, 0, String.Empty, DataRowVersion.Default, "")
                };
                (new DataCommon()).ExecuteSP("sp_ReconAction", ref Params);

                if (Params[4].Value != DBNull.Value)
                    RetCode = Convert.ToInt16(Params[4].Value);

                if (Params[5].Value != DBNull.Value)
                    RetMsg = Convert.ToString(Params[5].Value);

                logs.WriteRequestLog("Recon Completed RetCode:" + RetCode.ToString() + " RetMsg:" + RetMsg, "ReconAction", SMSCode);
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "ReconAction");
            }
        }

        private static void GetHistoryEtherScan(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string SourceAddress = string.Empty;
            try
            {
                //Console.WriteLine("Rows call pre");
                //var builder = new ConfigurationBuilder()
                //.SetBasePath(Directory.GetCurrentDirectory())
                //.AddJsonFile("appsettings.json");

                //Configuration = builder.Build();

                var conStr = Configuration["SqlServerConnectionString"];

                WithdrawalReconRequest request = new WithdrawalReconRequest();
                //if (IsProcessing)
                //    return;
                //SqlStr = "SELECT AutoNo, TrnID , Address, SMSCode,Value, Amount, Confirmations,OrderID From WithdrawHistory WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 0 AND IsProcessing = 0";
                //dSet = (new DataCommon()).OpenDataSet("WithdrawHistory", SqlStr, dSet, 30);
                //SqlStr = "SELECT TrnNo FROM TransactionQueue WHERE SMSCode = '" + CommonMethod.SMSCode + "' AND Status = 4 AND TrnType=" + (int)EnTrnType.Withdraw +" AND SerProID="+CommonMethod.SerProID;
                Console.WriteLine("Rows call post ETH");
                SqlStr = "select top 5 TrnNo,Charge,TrnID,ToAddress,Address,Amount,UserId,ProviderWalletID from WithdrawHistory where status=6 AND IsProcessing = 0 and SMSCode='" + CommonMethod.SMSCode + "' and SerProID=" + CommonMethod.SerProID + "  order by UpdatedDate";
                dSet = (new DataCommon()).OpenDataSet("WithdrawHistory", SqlStr, dSet, 30);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    IsProcessing = true;
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        //SqlStr = "SELECT * FROM WithdrawHistory WHERE SMSCode='" + CommonMethod.SMSCode + "' AND TrnID = '" + dRow["TrnID"].ToString() + "' AND Address='" + dRow["Address"].ToString() + "' AND SerProID=" + CommonMethod.SerProID;
                        //dSet = (new DataCommon()).OpenDataSet("WithdrawHistory", SqlStr, dSet, 30);
                        if (dSet.Tables[0].Rows.Count > 0)
                        {
                            SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,UpdatedDate=dbo.getistdate() WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }

                    }
                    Console.WriteLine("Rows count Fetch:" + dSet.Tables[0].Rows.Count.ToString());
                    //IsProcessing = false;
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        //SqlStr = "Select Top 1 AccountNo From MemberBankMaster Where IsDefaultAddress=1 AND Type=1 AND Status=1 AND  MemberID=1 AND BranchName = '" + CommonMethod.SMSCode.ToUpper() + "' AND SerProID=" + dRow["SerProID"].ToString() + "";
                        //SqlStr = "Select Top 1 AccountNo From MemberBankMaster Where IsDefaultAddress=1 AND Type=1 AND Status=1 AND  MemberID=1 AND BranchName = '" + CommonMethod.SMSCode.ToUpper() + "' AND SerProID=" + CommonMethod.SerProID;
                        //SourceAddress = (new DataCommon()).ExecuteScalarWDM(SqlStr);
                        //String Response = CallThirdPartyCryptoAPI(ref CommonMethod, dRow["Address"].ToString(), dRow["TrnID"].ToString(), dRow["TrnNo"].ToString(), SourceAddress, Convert.ToDecimal(dRow["Amount"]));
                        string Response = CallThirdPartyEtherScanStatusAPI(ref CommonMethod, dRow["TrnId"].ToString(), CommonMethod.Authorization, CommonMethod.enterprise);
                        EtherScanStatusResponse TPGenerateResponse = new EtherScanStatusResponse();
                        RespTransfers transferObj = new RespTransfers();
                        TPGenerateResponse = JsonConvert.DeserializeObject<EtherScanStatusResponse>(Response);
                        //JObject GenerateResponse = JObject.Parse(Response);
                        if (TPGenerateResponse != null)
                        {
                            if (TPGenerateResponse.isError == "0")
                            {
                                if (TPGenerateResponse.transaction != null)
                                {
                                    string path = Configuration["MainPath"] + "\\Configuration\\Local\\Local_TransactionFile.txt";
                                    ReadTransactionalFile1(path, ref CommonMethod);

                                    string Response1 = CallThirdPartyEtherScanAPI(ref CommonMethod, dRow["TrnId"].ToString(), CommonMethod.Authorization, CommonMethod.enterprise, dSet);
                                    EtherScanConfirmResponse TPGenerateResponse1 = new EtherScanConfirmResponse();
                                    TPGenerateResponse1 = JsonConvert.DeserializeObject<EtherScanConfirmResponse>(Response1);

                                    if (TPGenerateResponse1 != null)
                                    {
                                        if (TPGenerateResponse1.isError == false)
                                        {
                                            string trnid = dRow["TrnID"].ToString();
                                            transferObj.id = dRow["TrnID"].ToString();
                                            transferObj.Amount = Convert.ToDecimal(dRow["Amount"].ToString());//CommonMethod.CovertAmount; //Convert.ToDecimal(amount);
                                            transferObj.coin = CommonMethod.SMSCode;
                                            transferObj.txid = TPGenerateResponse1.txnid;
                                            // transferObj.Value = Convert.ToDecimal(dRow["Value"]);
                                            // transferObj. = Convert.ToInt64(dRow["OrderID"]);
                                            transferObj.address = dRow["Address"].ToString();
                                            // transferObj. = dRow["FromAddress"].ToString();
                                            transferObj.confirmations = TPGenerateResponse1.confirmations;
                                            //transferObj.confirmations = -1;//for testing
                                            if (transferObj.confirmations < 0) //ntrivedi treat as failed 26-07-2018
                                            {
                                                request.ActionMessage = "Negative Confirmations";
                                                request.ActionType = enWithdrawalReconActionType.Refund;
                                                request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                IWalletDeposition bar = GetWithdrawObjectDependency(conStr);
                                                var res = bar.WithdrawalReconV1(request, Convert.ToInt64(dRow["UserId"]), null).GetAwaiter().GetResult();

                                                logs.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,Status=9 WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                                continue;
                                            }
                                            else
                                            {
                                                logs.WriteRequestLog("confirmations  :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                if (transferObj.confirmations >= 3)
                                                {
                                                    request.ActionMessage = "Success";
                                                    request.ActionType = enWithdrawalReconActionType.Success;
                                                    request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                    IWalletDeposition bar = GetWithdrawObjectDependency(conStr);
                                                    var res = bar.WithdrawalReconV1(request, Convert.ToInt64(dRow["UserId"]), null).GetAwaiter().GetResult();
                                                    if (res.ReturnCode == 0)
                                                    {
                                                        SqlStr = "UPDATE WithdrawHistory SET confirmations = " + TPGenerateResponse1.confirmations + " , Status=1,SystemRemarks='Success',IsProcessing=0  WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                    }
                                                    else
                                                    {
                                                        SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,Status=9,SystemRemarks='" + res.ReturnMsg + "' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                        (new DataCommon()).ExecuteQuery(SqlStr);
                                                        logs.WriteRequestLog("Update Withdraw History :  " + dRow["TrnID"].ToString(), "GetHistory", "Remarks: " + res.ReturnMsg);
                                                        continue;

                                                    }
                                                }
                                                else
                                                {
                                                    SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,confirmations = " + TPGenerateResponse1.confirmations + " , SystemRemarks='Success' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                }
                                                (new DataCommon()).ExecuteQuery(SqlStr);
                                            }
                                            CommonMethod.Transfers.Add(transferObj);
                                        }
                                    }
                                }
                                else
                                {
                                    SqlStr = "UPDATE WithdrawERCTokenQueue SET Status = 9 WHERE TrnRefNo = '" + dRow["TrnID"].ToString() + "'";
                                    (new DataCommon()).ExecuteQuery(SqlStr);

                                    SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,Status=9,SystemRemarks='Lost Transaction Found' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                }
                            }
                        }
                        else
                        {
                            SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0 WHERE TrnID = '" + dRow["TrnID"].ToString() + "' AND Address='" + dRow["Address"].ToString() + "' AND SerProID=" + CommonMethod.SerProID;
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " " + walletServiceDataObj.SMSCode);
                logs.WriteErrorLog(ex, "Program", "GetHistoryEtherScan" + " " + walletServiceDataObj.SMSCode);
            }
        }

        private static void GetHistoryTron(ref CommonMethods CommonMethod, walletServiceData walletServiceDataObj, string trnID)
        {
            DataSet dSet = new DataSet();
            string SqlStr = string.Empty;
            string SourceAddress = string.Empty;
            try
            {
                var conStr = Configuration["SqlServerConnectionString"];
                WithdrawalReconRequest request = new WithdrawalReconRequest();
                Console.WriteLine("Rows call post ETH");
                SqlStr = "select top 5 TrnNo,Charge,TrnID,ToAddress,Address,Amount,UserId,ProviderWalletID from WithdrawHistory where status=6 AND IsProcessing = 0 and SMSCode='" + CommonMethod.SMSCode + "' and SerProID=" + CommonMethod.SerProID + " order by UpdatedDate";//and TrnNo=7096 added
                dSet = (new DataCommon()).OpenDataSet("WithdrawHistory", SqlStr, dSet, 30);
                if (dSet.Tables[0].Rows.Count > 0)
                {
                    IsProcessing = true;
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        if (dSet.Tables[0].Rows.Count > 0)
                        {
                            SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,UpdatedDate=dbo.getistdate() WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                            (new DataCommon()).ExecuteQuery(SqlStr);
                        }

                    }
                    Console.WriteLine("Rows count Fetch:" + dSet.Tables[0].Rows.Count.ToString());
                    foreach (DataRow dRow in dSet.Tables[0].Rows)
                    {
                        //--2019-5-21 Receipt Start
                        CommonMethods commonMethodsObj = new CommonMethods();
                        ReadMasterFile("Receipt_" + walletServiceDataObj.RouteTag, ref commonMethodsObj); // Read  Master File
                        if (!string.IsNullOrEmpty(commonMethodsObj.Path_GetReceipt))
                        {
                            ReadTransactionalFile(commonMethodsObj.Path_GetReceipt, ref commonMethodsObj); // Read Transaction file for specific coin               
                            if (!string.IsNullOrEmpty(commonMethodsObj.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(commonMethodsObj.ContentType))
                            {
                                String ReceiptResponse = CallThirdPartyEtherScanStatusAPI(ref commonMethodsObj, dRow["TrnId"].ToString(), "", "");
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

                                                string Response2 = CallThirdPartyTRONAPI(ref CommonMethod, dRow["TrnId"].ToString(), CommonMethod.Authorization, CommonMethod.enterprise, dSet);
                                                TRNOResponse TPGenerateResponse = new TRNOResponse();
                                                RespTransfers transferObj = new RespTransfers();
                                                TPGenerateResponse = JsonConvert.DeserializeObject<TRNOResponse>(Response2);
                                                if (TPGenerateResponse != null)
                                                {
                                                    if (TPGenerateResponse.isError == 0)
                                                    {

                                                        string trnid = dRow["TrnID"].ToString();
                                                        transferObj.id = dRow["TrnID"].ToString();
                                                        transferObj.Amount = Convert.ToDecimal(dRow["Amount"].ToString());
                                                        transferObj.coin = CommonMethod.SMSCode;
                                                        transferObj.txid = TPGenerateResponse.txn_id;
                                                        transferObj.address = dRow["Address"].ToString();
                                                        transferObj.confirmations = Convert.ToInt32(TPGenerateResponse.confirmations);
                                                        if (transferObj.confirmations < 0)
                                                        {
                                                            request.ActionMessage = "Negative Confirmations";
                                                            request.ActionType = enWithdrawalReconActionType.Refund;
                                                            request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                            IWalletDeposition bar = GetWithdrawObjectDependency(conStr);
                                                            var res = bar.WithdrawalReconV1(request, Convert.ToInt64(dRow["UserId"]), null).GetAwaiter().GetResult();

                                                            logs.WriteRequestLog("confirmations < 0 :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                            SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,Status=9 WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            logs.WriteRequestLog("confirmations  :  " + transferObj.txid, "GetHistory", CommonMethod.SMSCode);
                                                            if (transferObj.confirmations >= 3)
                                                            {
                                                                request.ActionMessage = "Success";
                                                                request.ActionType = enWithdrawalReconActionType.Success;
                                                                request.TrnNo = Convert.ToInt64(dRow["TrnNo"]);
                                                                IWalletDeposition bar = GetWithdrawObjectDependency(conStr);
                                                                var res = bar.WithdrawalReconV1(request, Convert.ToInt64(dRow["UserId"]), null).GetAwaiter().GetResult();
                                                                if (res.ReturnCode == 0)
                                                                {
                                                                    SqlStr = "UPDATE WithdrawHistory SET confirmations = " + Convert.ToInt32(TPGenerateResponse.confirmations) + " , Status=1,SystemRemarks='Success',IsProcessing=0  WHERE TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                }
                                                                else
                                                                {
                                                                    SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,Status=9,SystemRemarks='" + res.ReturnMsg + "' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                                    (new DataCommon()).ExecuteQuery(SqlStr);
                                                                    logs.WriteRequestLog("Update Withdraw History :  " + dRow["TrnID"].ToString(), "GetHistory", "Remarks: " + res.ReturnMsg);
                                                                    continue;

                                                                }
                                                            }
                                                            else
                                                            {
                                                                SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0,confirmations = " + TPGenerateResponse.confirmations + " , SystemRemarks='Success' WHERE  TrnID = '" + dRow["TrnID"].ToString() + "'";
                                                            }
                                                            (new DataCommon()).ExecuteQuery(SqlStr);
                                                        }
                                                        CommonMethod.Transfers.Add(transferObj);

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //--2019-5-21 Receipt end
                        //else
                        //{
                        //    SqlStr = "UPDATE WithdrawHistory SET IsProcessing = 0 WHERE TrnID = '" + dRow["TrnID"].ToString() + "' AND Address='" + dRow["Address"].ToString() + "' AND SerProID=" + CommonMethod.SerProID;
                        //    (new DataCommon()).ExecuteQuery(SqlStr);
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " " + walletServiceDataObj.SMSCode);
                logs.WriteErrorLog(ex, "Program", "GetHistoryTron" + " " + walletServiceDataObj.SMSCode);
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
                    //CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);
                    logs.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);
                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;
                    //vsolanki
                    httpWebRequest.Headers.Add("Authorization", Authorization);
                    httpWebRequest.Headers.Add("enterprise", enterprise);

                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();
                    }
                    httpWebResponse.Close();
                    logs.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyAPI", CommonMethod.SMSCode);

                }
                else
                {
                    logs.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyAPI", CommonMethod.SMSCode);
                }
                return CommonMethod.DepositHistoryResponse;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallThirdPartyAPI");
                return ex.ToString();
            }
        }

        private static void ParseBitGoAPIResponse(ref CommonMethods CommonMethod)
        {
            try
            {
                JObject GenerateResponse = JObject.Parse(CommonMethod.DepositHistoryResponse);
                //JArray jarr = (JArray)person1.SelectToken("transfers");
                if (Convert.ToString(GenerateResponse.SelectToken("coin")).ToLower() == CommonMethod.SMSCode.ToLower())
                {
                    if (CommonMethod.Category == 1) // For BTC , BTG , BCH , XRP , LTC Response 
                    {
                        //Rushabh 02-07-2018 as We get 'transactions' token instead of 'transfer' in withdraw response.
                        //foreach (var item in GenerateResponse.SelectToken("transfers").Select((val, i) => new { i, val }))
                        //foreach (var item in GenerateResponse.SelectToken("transactions").Select((val, i) => new { i, val }))
                        //{
                        //item.val["IsValid"] = false;


                        foreach (var item in GenerateResponse.SelectToken("outputs"))
                        {
                            if (!IsNullOrEmpty(item["id"]) && !IsNullOrEmpty(item["address"]) && !IsNullOrEmpty(item["value"]) && !IsNullOrEmpty(item["valueString"]) && Convert.ToBoolean(item["isSegwit"]) == false && IsNullOrEmpty(item["wallet"]) && IsNullOrEmpty(item["redeemScript"]))
                            {
                                //if (Convert.ToString(item1["address"]) == CommonMethod.orgwallet && Convert.ToDecimal(item1["value"]) > 0)
                                //{
                                string value = (string)item.SelectToken("address");
                                item["address"] = value;
                                item["value"] = Convert.ToDecimal(item["value"]);
                                item["Amount"] = Convert.ToDecimal(item["value"]) / CommonMethod.CovertAmount;
                                item["confirmedTime"] = Convert.ToString(item["date"]);
                                item["Fee"] = Convert.ToDecimal(item["fee"]);
                                item["WalletID"] = Convert.ToString(item["fromWallet"]);
                                item["IsValid"] = true;
                                //}
                            }
                        }



                        //if (Convert.ToBoolean(item.val["IsValid"]))
                        //{
                        //    CommonMethod.Transfers.Add(JsonConvert.DeserializeObject<RespTransfers>(JsonConvert.SerializeObject(item.val)));
                        //    Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                        //}
                        // }
                    }
                    #region crypto
                    //else if (CommonMethod.Category == 2) // For LTC , XRP Response
                    //{
                    //    foreach (var item in GenerateResponse.SelectToken("transfers").Select((val, i) => new { i, val }))
                    //    {
                    //        item.val["IsValid"] = false;
                    //        if (!IsNullOrEmpty(item.val["entries"]) && !IsNullOrEmpty(item.val["id"]) && !IsNullOrEmpty(item.val["txid"]) && !IsNullOrEmpty(item.val["coin"]) && !IsNullOrEmpty(item.val["wallet"]) && !IsNullOrEmpty(item.val["value"]) && !IsNullOrEmpty(item.val["state"]))
                    //        {

                    //            foreach (var item1 in item.val.SelectToken("entries"))
                    //            {
                    //                if (Convert.ToString(item1["value"]) == Convert.ToString(item.val["value"]) && !IsNullOrEmpty(item1["wallet"]))
                    //                {
                    //                    string value = (string)item1.SelectToken("address");
                    //                    item.val["address"] = value;
                    //                    if (Convert.ToString(item.val["coin"]) == "xrp" && !Convert.ToString(item1.SelectToken("address")).Contains("?dt="))
                    //                    {
                    //                        item.val["IsValid"] = false;
                    //                        continue;
                    //                    }
                    //                    item.val["Amount"] = Convert.ToDecimal(item.val["value"]) / Convert.ToDecimal(ConfigurationManager.AppSettings[Convert.ToString(item.val["coin"])]);
                    //                    item.val["IsValid"] = true;
                    //                }
                    //            }
                    //        }
                    //        if (Convert.ToBoolean(item.val["IsValid"]))
                    //        {
                    //            CommonMethod.Transfers.Add(JsonConvert.DeserializeObject<RespTransfers>(JsonConvert.SerializeObject(item.val)));
                    //            Console.WriteLine(CommonMethod.SMSCode + " Count : " + CommonMethod.Transfers.Count);
                    //        }
                    //    }
                    //}
                }
                //logs.WriteRequestLog("Generate Response :  " + JsonConvert.SerializeObject(CommonMethod.Transfers), "CallThirdPartyAPI", CommonMethod.SMSCode);
                #endregion
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "ParseBitGoAPIResponse");
            }
        }

        private static string CallThirdPartyCryptoAPI(ref CommonMethods CommonMethod, string Address, string TrnID, string AutoNo, string SourceAddress = "", decimal Amount = 0)
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
                    ReqStr = ReqStr.Replace("#Address#", Address);//Address
                    ReqStr = ReqStr.Replace("#TrnID#", TrnID);//TrnID
                    ReqStr = ReqStr.Replace("#AutoNo#", AutoNo);//TrnNo
                    ReqStr = ReqStr.Replace("#SourceAddress#", SourceAddress);//rita 18-5-18 needed for Deduction call to RPC                    
                    ReqStr = ReqStr.Replace("#Amount#", Amount.ToString());//rita 18-5-18 needed for Deduction call to RPC                    
                    logs.WriteRequestLog("RPC Address generate Request :  " + ReqStr, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                    StreamWriter sw = new StreamWriter(myReqrpc.GetRequestStream());
                    sw.Write(ReqStr);
                    sw.Close();

                    WebResponse response = myReqrpc.GetResponse();

                    StreamReader StreamReader = new StreamReader(response.GetResponseStream());
                    CommonMethod.DepositHistoryResponse = StreamReader.ReadToEnd();
                    StreamReader.Close();
                    response.Close();

                    logs.WriteRequestLog("RPC Address Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                    return CommonMethod.DepositHistoryResponse;
                }
                else
                {
                    logs.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
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
                    logs.WriteRequestLog("BlockChainTransfer exception : " + CommonMethod.DepositHistoryResponse, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                }

                logs.WriteRequestLog("webex : " + webex, "CallThirdPartyCryptoAPI", CommonMethod.SMSCode);
                return CommonMethod.DepositHistoryResponse;
            }
        }

        private static string CallThirdPartyEtherScanStatusAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise)
        {
            try
            {
                var RequestBody = CommonMethod.RequestBody;
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    //vsolanki
                    RequestBody = RequestBody.Replace("#Username#", CommonMethod.UserName);
                    RequestBody = RequestBody.Replace("#Password#", CommonMethod.Password);
                    RequestBody = RequestBody.Replace("#trnID#", trnID);

                    //CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);
                    logs.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyEtherScanStatusAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);

                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;

                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(RequestBody);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    //try
                    //{
                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();
                    }
                    httpWebResponse.Close();
                    logs.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyEtherScanStatusAPI", CommonMethod.SMSCode);
                    //}
                    //catch (WebException webex)
                    //{
                    //    WebResponse errResp = webex.Response;
                    //    using (Stream respStream = errResp.GetResponseStream())
                    //    {
                    //        StreamReader reader = new StreamReader(respStream);
                    //        string text = reader.ReadToEnd();
                    //        logs.WriteRequestLog("Response :  " + text, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);
                    //    }
                    //}
                }
                else
                {
                    logs.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyEtherScanStatusAPI", CommonMethod.SMSCode);
                }
                return CommonMethod.DepositHistoryResponse;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallThirdPartyEtherScanStatusAPI");
                return ex.ToString();
            }
        }

        private static string CallThirdPartyEtherScanAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                var RequestBody = CommonMethod.RequestBody;
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL1) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    //vsolanki
                    RequestBody = RequestBody.Replace("#Username#", CommonMethod.UserName);
                    RequestBody = RequestBody.Replace("#Password#", CommonMethod.Password);
                    RequestBody = RequestBody.Replace("#trnID#", trnID);

                    //CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);
                    logs.WriteRequestLog("Request :  " + CommonMethod.Str_URL1, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL1);

                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;

                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(RequestBody);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    //try
                    //{
                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();
                    }
                    httpWebResponse.Close();
                    logs.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);
                    //}
                    //catch (WebException webex)
                    //{
                    //    WebResponse errResp = webex.Response;
                    //    using (Stream respStream = errResp.GetResponseStream())
                    //    {
                    //        StreamReader reader = new StreamReader(respStream);
                    //        string text = reader.ReadToEnd();
                    //        logs.WriteRequestLog("Response :  " + text, "CallThirdPartyEtherScanAPI", CommonMethod.SMSCode);

                    //        CommonMethod.DepositHistoryResponse = "";

                    //        //Call Status API
                    //        string path = Configuration["MainPath"] + "\\Configuration\\Local\\Local_TransactionFile.txt";
                    //        ReadTransactionalFile1(path, ref CommonMethod);
                    //        string Response = CallThirdPartyEtherScanStatusAPI(ref CommonMethod,trnID,CommonMethod.Authorization, CommonMethod.enterprise);
                    //        EtherScanStatusResponse TPGenerateResponse = new EtherScanStatusResponse();
                    //        RespTransfers transferObj = new RespTransfers();
                    //        TPGenerateResponse = JsonConvert.DeserializeObject<EtherScanStatusResponse>(Response);

                    //        if (TPGenerateResponse.isError == false)
                    //        {
                    //            if (TPGenerateResponse.transaction != null)
                    //            {
                    //                if (TPGenerateResponse.transaction.status == null)
                    //                {

                    //                }
                    //                if (TPGenerateResponse.transaction.status == 0)
                    //                {
                    //                   // Refund Process 
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
                }
                else
                {
                    logs.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyAPI", CommonMethod.SMSCode);
                }
                return CommonMethod.DepositHistoryResponse;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallThirdPartyEtherScanAPI");
                return ex.ToString();
            }
        }

        private static string CallThirdPartyTRONAPI(ref CommonMethods CommonMethod, string trnID, string Authorization, string enterprise, DataSet dSet)
        {
            try
            {
                var RequestBody = CommonMethod.RequestBody;
                //CommonMethods CommonMethod = (CommonMethods)CommonMethodObj;
                if (!string.IsNullOrEmpty(CommonMethod.Str_URL) && !string.IsNullOrEmpty(CommonMethod.Str_RequestType) && !string.IsNullOrEmpty(CommonMethod.ContentType))
                {
                    //vsolanki
                    RequestBody = RequestBody.Replace("#Username#", CommonMethod.UserName);
                    RequestBody = RequestBody.Replace("#Password#", CommonMethod.Password);
                    RequestBody = RequestBody.Replace("#trnID#", trnID);

                    //CommonMethod.Str_URL = CommonMethod.Str_URL.Replace("#ProviderWalletID#", CommonMethod.ProviderWalletID);
                    logs.WriteRequestLog("Request :  " + CommonMethod.Str_URL, "CallThirdPartyTRONAPI", CommonMethod.SMSCode);

                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(CommonMethod.Str_URL);

                    httpWebRequest.ContentType = CommonMethod.ContentType;
                    httpWebRequest.Method = CommonMethod.Str_RequestType;
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = 180000;

                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(RequestBody);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    //try
                    //{
                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader StreamReaderObj = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        CommonMethod.DepositHistoryResponse = StreamReaderObj.ReadToEnd();
                        StreamReaderObj.Close();
                        StreamReaderObj.Dispose();
                    }
                    httpWebResponse.Close();
                    logs.WriteRequestLog("Response :  " + CommonMethod.DepositHistoryResponse, "CallThirdPartyTRONAPI", CommonMethod.SMSCode);

                }
                else
                {
                    logs.WriteRequestLog("Generate Response :  Transaction Detail not found", "CallThirdPartyTRONAPI", CommonMethod.SMSCode);
                }
                return CommonMethod.DepositHistoryResponse;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "CallThirdPartyTRONAPI");
                return ex.ToString();
            }
        }

        #endregion


        #region "ReadFiles"

        public static void ReadMasterFile(string APIName, ref CommonMethods CommonMethod)
        {
            string FilePath = Configuration["MainPath"] + "\\Configuration\\MasterFile_" + APIName + ".txt";
            try
            {
                if (System.IO.File.Exists(FilePath) == true)
                {
                    CommonMethod.StaticArray[0] = "0";
                    CommonMethod.TransactionFile = Configuration["MainPath"] + "\\Configuration"; //FilePath

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
                            CommonMethod.TransactionFile = CommonMethod.TransactionFile + "\\" + line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1) + "\\";
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

                    logs.WriteRequestLog("Transaction File Path :  " + CommonMethod.Path_AddressGenerate, "ReadMasterFile", CommonMethod.SMSCode);
                }
                else
                {

                    logs.WriteRequestLog(FilePath + " File Not Found", "ReadMasterFile", CommonMethod.SMSCode);
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "ReadMasterFile");
            }
        }

        public static void ReadTransactionalFile(string Path, ref CommonMethods CommonMethod)
        {
            try
            {
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
                        else if (CommonMethod.TrnLeftTitle.Contains("orgwallet")) //Read orgwallet Type  -- Parth 27-06-2018 Wallet Compare for BitgoAPI
                        {
                            CommonMethod.orgwallet = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
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
                        else if (CommonMethod.TrnLeftTitle.Contains("assetfromrequest")) //Read assetfromrequest call
                        {
                            CommonMethod.AssetFromRequest = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("authorization"))
                        {
                            CommonMethod.Authorization = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("trnid"))
                        {
                            CommonMethod.TrnId = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("enterprise"))
                        {
                            CommonMethod.enterprise = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("#WalletId#"))
                        {
                            CommonMethod.walletid = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                    }

                    logs.WriteRequestLog("Transaction URL :  " + CommonMethod.Str_URL + " Request Type : " + CommonMethod.Str_RequestType + " Content Type : " + CommonMethod.ContentType, "ReadTransactionalFile", CommonMethod.SMSCode);
                }
                else
                {
                    logs.WriteRequestLog(Path + " File Not Found", "ReadTransactionalFile", CommonMethod.SMSCode);
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "ReadTransactionalFile:" + CommonMethod.SMSCode);
            }
        }

        public static void ReadTransactionalFile1(string Path, ref CommonMethods CommonMethod)
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
                            CommonMethod.Str_URL1 = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
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
                        else if (CommonMethod.TrnLeftTitle.Contains("orgwallet")) //Read orgwallet Type  -- Parth 27-06-2018 Wallet Compare for BitgoAPI
                        {
                            CommonMethod.orgwallet = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
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
                        else if (CommonMethod.TrnLeftTitle.Contains("assetfromrequest")) //Read assetfromrequest Rita 18-5-18 second RPC call
                        {
                            CommonMethod.AssetFromRequest = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("authorization"))
                        {
                            CommonMethod.Authorization = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("trnid"))
                        {
                            CommonMethod.TrnId = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("enterprise"))
                        {
                            CommonMethod.enterprise = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        else if (CommonMethod.TrnLeftTitle.Contains("#WalletId#"))
                        {
                            CommonMethod.walletid = line.Substring(line.IndexOf(CommonMethod.MainSaperator) + 1);
                        }
                        //Console.WriteLine(CommonMethod.Str_URL + CommonMethod.Str_RequestType + CommonMethod.ContentType);
                    }

                    logs.WriteRequestLog("Transaction Status URL :  " + CommonMethod.Str_URL + " Request Type : " + CommonMethod.Str_RequestType + " Content Type : " + CommonMethod.ContentType, "ReadTransactionalFile", CommonMethod.SMSCode);
                }
                else
                {
                    logs.WriteRequestLog(Path + " File Not Found", "ReadTransactionalFile1", CommonMethod.SMSCode);
                }
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "ReadTransactionalFile1:" + CommonMethod.SMSCode);
            }
        }

        #endregion

        public class walletServiceData
        {
            public int RecordCount { get; set; }
            public Int32 ServiceID { get; set; }
            public string SMSCode { get; set; }
            public int WallletStatus { get; set; }
            public int ServiceStatus { get; set; }
            public int AppType { get; set; }
            public string RouteTag { get; set; }
            public decimal CAmount { get; set; }
            public Int64 SerProID { get; set; }
        }

        public class CommonMethods
        {
            public string TransactionFile;
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
            public int Category;
            public string UserName;
            public string Str_URL1 = string.Empty;
            public string AssetName;
            public string Password;
            public string RequestBody;
            public string AssetFromRequest;
            public List<RespLocalCoin> RespLocalCoins { get; set; }
            public string orgwallet;
            public Int64 SerProID;
            public string RouteTag;
            public decimal CovertAmount = 1;
            public string TrnId { get; set; }
            public string Authorization;
            public string enterprise;
            public string walletid;

        }


        enum EnAppType
        {
            BITGO = 1,
            CRYPTO = 2
        }
        enum EnTrnType
        {
            Transaction = 1,
            Buy_Trade = 4,
            Sell_Trade = 5,
            Withdraw = 6,
            Shoping_Cart = 7,
            Deposit = 8,
            Generate_Address = 9
        }

        public class RespTransfers
        {
            public string id { get; set; }
            public string coin { get; set; }
            public string WalletID { get; set; }
            public string txid { get; set; }
            public decimal Fee { get; set; }
            public string address { get; set; }
            public int confirmations { get; set; }
            public long value { get; set; }
            public string state { get; set; }
            public string confirmedTime { get; set; }
            public string unconfirmedTime { get; set; }
            public string createdTime { get; set; }
            public bool IsValid { get; set; }
            public decimal Amount { get; set; }
            public long TrnNo { get; set; }
        }

        public class RespLocalCoin
        {
            public int confirmations { get; set; }
            public string txid { get; set; }
            public string address { get; set; }
            public string confirmedTime { get; set; }
            public string unconfirmedTime { get; set; }
            public int value { get; set; }
            public decimal Amount { get; set; }
        }

        public static bool IsNullOrEmpty(JToken token)
        {
            return (token == null) ||
                   (token.Type == JTokenType.Array && !token.HasValues) ||
                   (token.Type == JTokenType.Object && !token.HasValues) ||
                   (token.Type == JTokenType.String && token.ToString() == String.Empty) ||
                   (token.Type == JTokenType.Null);
        }

        public static IWalletDeposition GetWithdrawObjectDependency(string conStr)
        {
            try
            {
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
                return bar;
            }
            catch (Exception ex)
            {
                logs.WriteErrorLog(ex, "Program", "GetWithdrawObjectDependency");
                throw ex;
            }
        }

    }
}