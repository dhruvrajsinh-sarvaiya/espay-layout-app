using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Core.ViewModels.WalletOpnAdvanced;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.DTOClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CleanArchitecture.Infrastructure.Data
{
    public class WalletRepository : IWalletRepository
    {
        private readonly CleanArchitectureContext _dbContext;

        private readonly ILogger<WalletRepository> _log;

        public WalletRepository(ILogger<WalletRepository> log, CleanArchitectureContext dbContext)
        {
            _log = log;
            _dbContext = dbContext;
        }

        public WalletMaster GetById(long id)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                return _dbContext.Set<WalletMaster>().FirstOrDefault(e => e.Id == id && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #region OldCode
        //public List<T> List()
        //{
        //    try
        //    {                
        //        return _dbContext.Set<T>().ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //public T Add(T entity)
        //{
        //    try
        //    {
        //        _dbContext.Set<T>().Add(entity);
        //        _dbContext.SaveChanges();

        //        return entity;
        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //public void Delete(T entity)
        //{
        //    try
        //    {
        //        _dbContext.Set<T>().Remove(entity);
        //        _dbContext.SaveChanges();
        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //public void Update(T entity)
        //{
        //    try
        //    {
        //        _dbContext.Entry(entity).State = EntityState.Modified;
        //        _dbContext.SaveChanges();
        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //public T AddProduct(T entity)
        //{
        //    try
        //    {
        //        _dbContext.Set<T>().Add(entity);
        //        _dbContext.SaveChanges();

        //        return entity;
        //    }
        //    catch (Exception ex)
        //    {
        //       HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        #endregion
        public TradeBitGoDelayAddresses GetUnassignedETH()
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018 
                // ntrivedi 07-03-2019 for all eth token same address international coin we handle it from our side , all eth address are same we can recognize deposition from coin name as per conversation with cinmay bhai 
                return _dbContext.Set<TradeBitGoDelayAddresses>().Where(e => e.GenerateBit == 1 && e.WalletId == 0).OrderBy(e => e.Id).FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public bool WalletOperation(WalletLedger wl1, WalletLedger wl2, TransactionAccount ta1, TransactionAccount ta2, WalletMaster wm2, WalletMaster wm1)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018

                _dbContext.Database.BeginTransaction();
                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<WalletLedger>().Add(wl2);
                _dbContext.Set<TransactionAccount>().Add(ta1);
                _dbContext.Set<TransactionAccount>().Add(ta2);
                _dbContext.Entry(wm1).State = EntityState.Modified;
                _dbContext.Entry(wm2).State = EntityState.Modified;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                _dbContext.Database.RollbackTransaction();
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool WalletDeduction(WalletLedger wl1, TransactionAccount ta1, WalletMaster wm2, decimal amount)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018
                WalletMaster walletMasterReloaded = new WalletMaster();
                _dbContext.Database.BeginTransaction();
                walletMasterReloaded = GetById(wm2.Id);  // ntrivedi to fetch fresh balance
                walletMasterReloaded.DebitBalance(amount); // credit balance here to update fresh balance
                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<TransactionAccount>().Add(ta1);
                _dbContext.Entry(walletMasterReloaded).State = EntityState.Modified;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                _dbContext.Database.RollbackTransaction();
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool WalletDeductionwithTQ(WalletLedger wl1, TransactionAccount ta1, long walletID, WalletTransactionQueue wtq, decimal amount)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018
                WalletMaster walletMasterObj = GetById(walletID);
                _dbContext.Database.BeginTransaction();
                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;
                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<TransactionAccount>().Add(ta1);
                walletMasterObj.DebitBalance(amount);
                _dbContext.Entry(wtq).State = EntityState.Modified;
                _dbContext.Entry(walletMasterObj).State = EntityState.Modified;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
                _dbContext.Entry(walletMasterObj).Reload();
                return true;
            }
            catch (Exception ex)
            {
                _dbContext.Database.RollbackTransaction();
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public List<WalletMasterResponse> ListWalletMasterResponse(long UserId)
        {
            try
            {
                #region OldCode

                //List<WalletMasterResponse> items = (from u in _dbContext.WalletMasters
                //                                    join c in _dbContext.WalletTypeMasters
                //                                           on u.WalletTypeID equals c.Id
                //                                    where u.UserID == UserId
                //                                    select new WalletMasterResponse
                //                                    {
                //                                        AccWalletID = u.AccWalletID,
                //                                        WalletName = u.Walletname,
                //                                        CoinName = c.WalletTypeName,
                //                                        PublicAddress = u.PublicAddress,
                //                                        Balance = u.Balance,
                //                                        IsDefaultWallet = u.IsDefaultWallet,
                //                                        InBoundBalance=u.InBoundBalance,
                //                                        OutBoundBalance=u.OutBoundBalance
                //                                    }).AsEnumerable().ToList();
                #endregion
                //2019-2-15 added condi for only used trading wallet
                var items = _dbContext.WalletMasterResponse.FromSql(@"select u.AccWalletID,u.ExpiryDate,ISNULL(u.OrgID,0) AS OrgID,u.Walletname as WalletName,c.WalletTypeName as CoinName,u.PublicAddress,u.Balance,u.IsDefaultWallet,u.InBoundBalance,u.OutBoundBalance from WalletMasters u inner join WalletTypeMasters c on c.Id= u.WalletTypeID where u.Status < 9 and c.Status < 9 and Walletusagetype=0 AND u.UserID={0}", UserId).ToList(); //ntrivedi 23-04-2019  added c.status condition added
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<WalletMasterResponse> GetWalletMasterResponseByCoin(long UserId, string coin)
        {
            try
            {
                #region OldCode

                //List<WalletMasterResponse> items = (from u in _dbContext.WalletMasters
                //                                    join c in _dbContext.WalletTypeMasters
                //                                           on u.WalletTypeID equals c.Id
                //                                    where u.UserID == UserId && c.WalletTypeName == coin
                //                                    select new WalletMasterResponse
                //                                    {
                //                                        AccWalletID = u.AccWalletID,
                //                                        WalletName = u.Walletname,
                //                                        CoinName = c.WalletTypeName,
                //                                        PublicAddress = u.PublicAddress,
                //                                        Balance = u.Balance,
                //                                        IsDefaultWallet = u.IsDefaultWallet
                //                                    }).AsEnumerable().ToList();
                #endregion
                //2019-2-15 added condi for only used trading wallet
                var items = _dbContext.WalletMasterResponse.FromSql(@"select u.AccWalletID,u.ExpiryDate,ISNULL(u.OrgID,0) AS OrgID,u.Walletname as WalletName,c.WalletTypeName as CoinName,u.PublicAddress,u.Balance,u.IsDefaultWallet,u.InBoundBalance,u.OutBoundBalance from WalletMasters u inner join WalletTypeMasters c on c.Id= u.WalletTypeID where u.Status < 9 AND Walletusagetype=0 and  u.UserID={0} and c.WalletTypeName ={1}", UserId, coin).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<WalletMasterResponse> GetWalletMasterResponseById(long UserId, string coin, string walletId)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<WalletMasterResponse> items = (from u in _dbContext.WalletMasters
                                                    join c in _dbContext.WalletTypeMasters
                                                           on u.WalletTypeID equals c.Id
                                                    where u.Status < 9 && u.UserID == UserId && c.WalletTypeName == coin && u.AccWalletID == walletId && u.WalletUsageType == 0
                                                    select new WalletMasterResponse
                                                    {
                                                        AccWalletID = u.AccWalletID,
                                                        WalletName = u.Walletname,
                                                        CoinName = c.WalletTypeName,
                                                        PublicAddress = u.PublicAddress,
                                                        Balance = u.Balance,
                                                        ExpiryDate = u.ExpiryDate,
                                                        OrgID = Convert.ToInt64(u.OrgID == null ? 0 : u.OrgID),
                                                        IsDefaultWallet = u.IsDefaultWallet
                                                    }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public int CheckTrnRefNo(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType walletTrnType)
        {
            try
            {
                int response;
                if (walletTrnType != enWalletTrnType.Deposit)
                {
                    response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType && u.WalletTrnType == walletTrnType // ntrivedi added 09-01-2018
                                && u.WalletTrnType == walletTrnType
                                select u).Count();
                }
                else
                {
                    response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType && u.WalletTrnType == walletTrnType
                                select u).Count();
                }
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<int> CheckTrnRefNoAsync(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType walletTrnType)
        {
            try
            {
                Task<int> response;
                if (walletTrnType != enWalletTrnType.Deposit)
                {
                    response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType
                                && u.WalletTrnType == walletTrnType
                                select u).CountAsync();
                }
                else
                {
                    response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType
                                select u).CountAsync();
                }
                return await response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTrnRefNoAsync", this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rushabh 06-12-2018
        public async Task<CheckTrnRefNoRes> CheckTranRefNoAsync(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType walletTrnType)
        {
            try
            {
                CheckTrnRefNoRes response;
                string query = "SELECT COUNT(TrnNo) AS 'TotalCount' FROM WalletTransactionQueues WHERE TrnRefNo = {0} AND TrnType = {1}";
                if (walletTrnType != enWalletTrnType.Deposit)
                {
                    query += " AND WalletTrnType = {2}";
                    IQueryable<CheckTrnRefNoRes> Result = _dbContext.CheckTrnRefNoRes.FromSql(query, TrnRefNo, TrnType, walletTrnType);
                    response = Result.FirstOrDefault();
                }
                else
                {
                    IQueryable<CheckTrnRefNoRes> Result = _dbContext.CheckTrnRefNoRes.FromSql(query, TrnRefNo, TrnType);
                    response = Result.FirstOrDefault();
                }
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTranRefNoAsync", this.GetType().Name, ex);
                throw ex;
            }
        }

        public int CheckTrnRefNoForCredit(long TrnRefNo, enWalletTranxOrderType TrnType) // need to check whether walleet is pre deducted for this order
        {
            try
            {
                int response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType && (u.Status == enTransactionStatus.Hold || u.Status == enTransactionStatus.Success)
                                select u).Count();
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTrnRefNoForCredit", this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<int> CheckTrnRefNoForCreditAsync(long TrnRefNo, enWalletTranxOrderType TrnType) // need to check whether walleet is pre deducted for this order
        {
            try
            {
                return await (from u in _dbContext.WalletTransactionQueues
                              where u.TrnRefNo == TrnRefNo && u.TrnType == TrnType && (u.Status == enTransactionStatus.Initialize)
                              select u).CountAsync();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTrnRefNoForCreditAsync", this.GetType().Name, ex);
                throw ex;
            }

        }

        public WalletTransactionQueue AddIntoWalletTransactionQueue(WalletTransactionQueue wtq, byte AddorUpdate)//1=add,2=update
        {
            try
            {
                //WalletTransactionQueue w = new WalletTransactionQueue();
                if (AddorUpdate == 1)
                {
                    _dbContext.WalletTransactionQueues.Add(wtq);
                }
                else
                {
                    _dbContext.Entry(wtq).State = EntityState.Modified;
                }
                _dbContext.SaveChanges();
                return wtq;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public WalletTransactionOrder AddIntoWalletTransactionOrder(WalletTransactionOrder wo, byte AddorUpdate)//1=add,2=update)
        {
            try
            {
                if (AddorUpdate == 1)
                {
                    _dbContext.WalletTransactionOrders.Add(wo);
                }
                else
                {
                    _dbContext.Entry(wo).State = EntityState.Modified;
                }
                _dbContext.SaveChanges();
                return wo;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool CheckarryTrnID(CreditWalletDrArryTrnID[] arryTrnID, string coinName)
        {
            try
            {
                bool i = false;
                decimal totalAmtDrTranx;
                for (int t = 0; t <= arryTrnID.Length - 1; t++)
                {
                    var response = (from u in _dbContext.WalletTransactionQueues
                                    where u.TrnRefNo == arryTrnID[t].DrTrnRefNo && u.Status == enTransactionStatus.Hold && u.TrnType == Core.Enums.enWalletTranxOrderType.Debit
                                    && u.WalletType == coinName
                                    select u);
                    if (response.Count() != 1)
                    {
                        i = false;
                        return i;
                    }
                    totalAmtDrTranx = response.ToList()[0].Amount;
                    // total delivered amount _ current amount must less or equals total debit amount
                    decimal deliveredAmt = (from p in _dbContext.WalletTransactionOrders
                                            join u in _dbContext.WalletTransactionQueues on p.DTrnNo equals u.TrnNo
                                            where u.TrnRefNo == arryTrnID[t].DrTrnRefNo && u.TrnType == Core.Enums.enWalletTranxOrderType.Debit
                                            && u.WalletType == coinName && p.Status != enTransactionStatus.SystemFail
                                            select p).Sum(e => e.Amount);
                    if (!(totalAmtDrTranx - deliveredAmt - arryTrnID[t].Amount >= 0))
                    {
                        i = false;
                        return i;
                    }
                    arryTrnID[t].dWalletId = response.ToList()[0].WalletID;
                    arryTrnID[t].DrTQTrnNo = response.ToList()[0].TrnNo;

                    i = true;
                }
                return i;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<AddressMasterResponse> ListAddressMasterResponse(string AccWalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<AddressMasterResponse> items = (from u in _dbContext.AddressMasters
                                                     join c in _dbContext.WalletMasters
                                                     on u.WalletId equals c.Id
                                                     where u.Status < 9 && c.AccWalletID == AccWalletID && u.Status == Convert.ToInt16(ServiceStatus.Active) && c.WalletUsageType == 0
                                                     select new AddressMasterResponse
                                                     {
                                                         AddressLabel = u.AddressLable,
                                                         Address = u.Address,
                                                         IsDefaultAddress = u.IsDefaultAddress,
                                                     }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 16-10-2018
        public WithdrawHistoryResponse DepositHistoy(DateTime FromDate, DateTime ToDate, string Coin, string TrnNo, decimal? Amount, byte? Status, long Userid, int PageNo)
        {
            #region OLD CODE
            //List<DepoHistoryObject> items = (from u in _dbContext.DepositHistory
            //                             join s in _dbContext.ServiceMaster on u.SMSCode.ToLower() equals s.SMSCode.ToLower()
            //                             join sd in _dbContext.ServiceDetail on s.Id equals sd.ServiceId
            //                             where u.UserId == Userid && u.CreatedDate >= FromDate && u.CreatedDate <= ToDate && (Status == null || (u.Status == Status && Status != null)) && (Coin == null || (u.SMSCode == Coin && Coin != null)) && (Amount == null || (u.Amount == Amount && Amount != null))
            //                             orderby u.CreatedDate descending,u.Id descending
            //                             select new DepoHistoryObject
            //                             {
            //                                 TrnNo = u.Id, // ntrivedi added 10-12-2018
            //                                 TrnId = u.TrnID, // ntrivedi added 10-12-2018
            //                                 CoinName = u.SMSCode,
            //                                 Status = u.Status,
            //                                 Information = u.StatusMsg,
            //                                 Amount = u.Amount,
            //                                 Date = u.CreatedDate,
            //                                 Address = u.Address,
            //                                 Confirmations = u.Confirmations,
            //                                 ExplorerLink = JsonConvert.DeserializeObject<ServiceDetailJsonData>(sd.ServiceDetailJson).Explorer,
            //                                 StatusStr = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 2) ? "OperatorFail" : (u.Status == 3) ? "SystemFail" : (u.Status == 4) ? "Hold" : (u.Status == 5) ? "Refunded" : "Pending"
            //                             }).AsEnumerable().ToList();
            #endregion 
            List<HistoryObject> items = new List<HistoryObject>();
            //RUSHABH 11-12-2018
            try
            {
                if (TrnNo != null)
                {
                    items = _dbContext.HistoryObject.FromSql(@"SELECT D.Id AS 'TrnNo',ISNULL(D.TrnID,0) AS 'TrnId',D.SMSCode AS 'CoinName',D.Status,
                            D.StatusMsg AS 'Information',D.Amount,D.CreatedDate AS 'Date',D.Address,
                            ISNULL(D.Confirmations,0) AS 'Confirmations',
                            (CASE D.Status WHEN 0 THEN 'Initialize' WHEN 1 THEN 'Success' WHEN 2 THEN 'OperatorFail' 
                            WHEN 3 THEN 'SystemFail' WHEN 4 THEN 'Hold' WHEN 5 THEN 'Refunded' ELSE 'Pending' END) AS 'StatusStr', 
                            ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',Isnull(IsInternalTrn,2) As IsInternalTrn FROM DepositHistory D 
                            INNER JOIN ServiceMaster SM ON D.SMSCode = SM.SMSCode
                            INNER JOIN ServiceDetail SD ON SD.ServiceId = SM.Id
                            WHERE D.UserId={0} AND (D.TrnId={1} OR {1}='') 
                            ORDER BY D.CreatedDate DESC,D.ID DESC", Userid, (TrnNo == null ? "" : TrnNo)).ToList();
                }
                else
                {
                    items = _dbContext.HistoryObject.FromSql(@"SELECT D.Id AS 'TrnNo',ISNULL(D.TrnID,0) AS 'TrnId',D.SMSCode AS 'CoinName',D.Status,
                            D.StatusMsg AS 'Information',D.Amount,D.CreatedDate AS 'Date',D.Address,
                            ISNULL(D.Confirmations,0) AS 'Confirmations',
                            (CASE D.Status WHEN 0 THEN 'Initialize' WHEN 1 THEN 'Success' WHEN 2 THEN 'OperatorFail' 
                            WHEN 3 THEN 'SystemFail' WHEN 4 THEN 'Hold' WHEN 5 THEN 'Refunded' ELSE 'Pending' END) AS 'StatusStr', 
                            ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',Isnull(IsInternalTrn,2) As IsInternalTrn FROM DepositHistory D 
                            INNER JOIN ServiceMaster SM ON D.SMSCode = SM.SMSCode
                            INNER JOIN ServiceDetail SD ON SD.ServiceId = SM.Id
                            WHERE D.UserId={0} AND D.CreatedDate BETWEEN {1} AND {2} AND (D.Status={3} OR {3}=0) 
                            AND ({4}='' OR D.SMSCode={4}) AND (D.Amount={5} OR {5}=0) AND (D.TrnId={6} OR {6}='') 
                            ORDER BY D.CreatedDate DESC,D.ID DESC", Userid, FromDate, ToDate, (Status == null ? 0 : Status), (Coin == null ? "" : Coin), (Amount == null ? 0 : Amount), (TrnNo == null ? "" : TrnNo)).ToList();
                }
                if (items.Count() == 0)
                {
                    return new WithdrawHistoryResponse()
                    {
                        ReturnCode = enResponseCode.Fail,
                        ReturnMsg = EnResponseMessage.NotFound,
                        ErrorCode = enErrorCode.NotFound
                    };
                }
                if (PageNo > 0)
                {
                    int skip = Helpers.PageSize * (PageNo - 1);
                    items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                }
                return new WithdrawHistoryResponse()
                {
                    ReturnCode = enResponseCode.Success,
                    ReturnMsg = EnResponseMessage.FindRecored,
                    ErrorCode = enErrorCode.Success,
                    Histories = items
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 16-10-2018
        public WithdrawHistoryNewResponse WithdrawalHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, long Userid, int PageNo)
        {
            #region OldCode

            //List<HistoryObject> items = (from u in _dbContext.TransactionQueue
            //                             join w in _dbContext.WithdrawHistory
            //                             on u.Id equals w.TrnNo into ps
            //                             from w in ps.DefaultIfEmpty()
            //                             where u.TrnType == 6 && u.MemberID == Userid && u.TrnDate >= FromDate && u.TrnDate <= ToDate && (Status == null || (u.Status == Status && Status != null)) && (Coin == null || (u.SMSCode == Coin && Coin != null)) && (Amount == null || (u.Amount == Amount && Amount != null))
            //                             select new HistoryObject
            //                             {
            //                                 CoinName = u.SMSCode,
            //                                 Status = u.Status,
            //                                 Information = u.StatusMsg == null ? "Not Found" : u.StatusMsg,
            //                                 Amount = u.Amount,
            //                                 Date = u.CreatedDate,
            //                                 Address = u.TransactionAccount == null ? "Not" : u.TransactionAccount,
            //                                 Confirmations = w == null ? 0 : w.Confirmations,
            //                                 StatusStr = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 2) ? "OperatorFail" : (u.Status == 3) ? "SystemFail" : (u.Status == 4) ? "Hold" : (u.Status == 5) ? "Refunded" : "Pending"

            //                             }
            //                             ).AsEnumerable().ToList();
            //List<HistoryObject> items = (from u in _dbContext.WithdrawHistory
            //                             where u.UserId == Userid && u.TrnDate >= FromDate && u.TrnDate <= ToDate && (Status == null || (u.Status == Status && Status != null)) && (Coin == null || (u.SMSCode == Coin && Coin != null)) && (Amount == null || (u.Amount == Amount && Amount != null))
            //                             select new HistoryObject
            //                             {
            //                                 CoinName = u.SMSCode,
            //                                 Status = u.Status,
            //                                 Information = u.SystemRemarks,
            //                                 Amount = u.Amount,
            //                                 Date = u.CreatedDate,
            //                                 Address = u.Address,
            //                                 Confirmations = u.Confirmations,
            //                                 StatusStr = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 2) ? "OperatorFail" : (u.Status == 3) ? "SystemFail" : (u.Status == 4) ? "Hold" : (u.Status == 5) ? "Refunded" : "Pending"
            //                             }).AsEnumerable().ToList();

            #endregion

            //RUSHABH 11-12-2018
            try
            {
                var items = _dbContext.WithdrawHistoryObject.FromSql(@"SELECT  ISNULL( wt.WalletTypeName,'') AS ChargeCurrency,ISNULL(u.ChargeRs,0) as ChargeRs,isNull(W.TrnID,'') as 'TrnID',u.Id as 'TrnNo',u.SMSCode as 'CoinName' ,
    u.Status,ISNULL( u.StatusMsg,'Not Found') as 'Information',ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',
    ISNULL(u.TransactionAccount,'Not Available') as 'Address',u.Amount,u.CreatedDate as 'Date',
    ISNULL(w.Confirmations,0) as 'Confirmations',
    CASE When u.Status = 4 or u.Status = 6 Then 
    Case When u.IsVerified = 0 Then 'ConfirmationPending' When u.IsVerified = 1 Then 'Confirm' When u.IsVerified = 9 Then 'Cancelled' End
    Else CASE  WHEN u.Status = 0 THEN 'Initialize' WHEN u.Status = 1 THEN 'Success' WHEN u.Status = 2 THEN 'ProviderFail' 
    WHEN u.Status = 3 THEN 'SystemFail'  WHEn u.Status = 4 THEN 'Hold' WHEN u.Status = 5 And u.IsVerified = 9 THEN 'Cancelled' WHEN u.Status = 5
		THEN 'Refunded' WHEN u.Status = 6 THEN 'Pending' 
    ELSE 'Other' END End AS 'StatusStr',u.IsVerified as 'IsVerified',u.EmailSendDate as 'EmailSendDate',u.IsInternalTrn FROM TransactionQueue u LEFT JOIN WithdrawHistory w ON w.TrnNo=u.Id
    LEFT JOIN ServiceDetail SD ON u.ServiceID = SD.ServiceId
	LEFT JOIN TrnChargeLog tc ON tc.TrnRefNo=u.Id and tc.Status=1 LEFT JOIN ChargeConfigurationDetail cd on cd.Id=tc.ChargeConfigurationDetailID
    LEFT JOIN  WalletTypeMasters wt on wt.Id=cd.DeductionWalletTypeId WHERE u.TrnType = 6 and u.TrnDate >={0} and  u.TrnDate <= {1} and (u.Status={2} or {2}=0) and 
                                (u.SMSCode={3} or {3}='') and  (u.MemberID={4}) ORDER BY u.CreatedDate DESC,u.TrnRefNo DESC",
                                FromDate, ToDate, (Status == null ? 0 : Status), (Coin == null ? "" : Coin), Userid).ToList();

                if (items.Count() == 0)
                {
                    return new WithdrawHistoryNewResponse()
                    {
                        ReturnCode = enResponseCode.Fail,
                        ReturnMsg = EnResponseMessage.NotFound,
                        ErrorCode = enErrorCode.NotFound
                    };
                }
                if (PageNo > 0)
                {
                    int skip = Helpers.PageSize * (PageNo - 1);
                    items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                }
                return new WithdrawHistoryNewResponse()
                {
                    ReturnCode = enResponseCode.Success,
                    ReturnMsg = EnResponseMessage.FindRecored,
                    ErrorCode = enErrorCode.Success,
                    Histories = items
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public bool WalletCreditwithTQ(WalletLedger wl1, TransactionAccount ta1, WalletMaster wm2, WalletTransactionQueue wtq, CreditWalletDrArryTrnID[] arryTrnID, decimal TotalAmount)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018

                WalletMaster walletMasterReloaded = new WalletMaster();
                _dbContext.Database.BeginTransaction();
                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;
                var arrayObj = (from p in _dbContext.WalletTransactionOrders
                                join q in arryTrnID on p.OrderID equals q.OrderID
                                select p).ToList();
                arrayObj.ForEach(e => e.Status = enTransactionStatus.Success);
                arrayObj.ForEach(e => e.StatusMsg = "Success");
                arrayObj.ForEach(e => e.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate



                // update debit transaction(current tranx against which tranx) status if it is fully settled
                var arrayObjTQ = (from p in _dbContext.WalletTransactionQueues
                                  join q in arryTrnID on p.TrnNo equals q.DrTQTrnNo
                                  select new { p, q }).ToList();
                arrayObjTQ.ForEach(e => e.p.SettedAmt = e.p.SettedAmt + e.q.Amount);
                arrayObjTQ.ForEach(e => e.p.UpdatedDate = UTC_To_IST());
                arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.Status = enTransactionStatus.Success);
                arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.StatusMsg = "Success"); // ntrivedi update statusmsg
                arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate


                walletMasterReloaded = GetById(wm2.Id);  // ntrivedi to fetch fresh balance 
                _dbContext.Entry(walletMasterReloaded).Reload();

                walletMasterReloaded.CreditBalance(TotalAmount); // credit balance here to update fresh balance


                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<TransactionAccount>().Add(ta1);

                _dbContext.Entry(walletMasterReloaded).State = EntityState.Modified;

                _dbContext.Entry(wtq).State = EntityState.Modified;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();

                _dbContext.Entry(walletMasterReloaded).Reload();

                return true;
            }

            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                _dbContext.Database.RollbackTransaction();
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //_dbContext.Entry(wm2).Reload();
                throw ex;
            }
        }
        public DateTime UTC_To_IST()
        {
            try
            {
                DateTime myUTC = DateTime.UtcNow;
                // 'Dim utcdate As DateTime = DateTime.ParseExact(DateTime.UtcNow, "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
                // Dim utcdate As DateTime = DateTime.ParseExact(myUTC, "M/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture)
                // 'Dim utcdate As DateTime = DateTime.ParseExact("11/09/2016 6:31:00 PM", "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
                DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(myUTC, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                // MsgBox(myUTC & " - " & utcdate & " - " & istdate)
                return istdate;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Rushabh 16-10-2018
        public List<WalletLimitConfigurationRes> GetWalletLimitResponse(string AccWaletID)
        {
            //double StartTime, EndTime;
            //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<WalletLimitConfigurationRes> items = (from u in _dbContext.WalletLimitConfiguration
                                                           join c in _dbContext.WalletMasters
                                                           on u.WalletId equals c.Id
                                                           where u.Status < 9 && c.AccWalletID == AccWaletID && u.Status == Convert.ToInt16(ServiceStatus.Active) && c.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                                           select new WalletLimitConfigurationRes
                                                           {
                                                               TrnType = u.TrnType,
                                                               LimitPerDay = u.LimitPerDay,
                                                               LimitPerHour = u.LimitPerHour,
                                                               LimitPerTransaction = u.LimitPerTransaction,
                                                               AccWalletID = c.AccWalletID,
                                                               EndTime = u.EndTimeUnix,
                                                               LifeTime = u.LifeTime != null ? u.LifeTime : 0,
                                                               StartTime = u.StartTimeUnix
                                                           }).AsEnumerable().ToList();

                return items;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public List<AddressMasterResponse> GetAddressMasterResponse(string AccWalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<AddressMasterResponse> items = (from u in _dbContext.AddressMasters
                                                     join c in _dbContext.WalletMasters
                                                     on u.WalletId equals c.Id
                                                     where u.Status < 9 && c.AccWalletID == AccWalletID && u.IsDefaultAddress == 1 && u.Status == Convert.ToInt16(ServiceStatus.Active) && c.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)

                                                     select new AddressMasterResponse
                                                     {
                                                         AddressLabel = u.AddressLable,
                                                         Address = u.Address
                                                         //IsDefaultAddress = u.IsDefaultAddress,
                                                     }).AsEnumerable().ToList();
                if (items.Count() == 0)
                {
                    //2019-2-18 added condi for only used trading wallet
                    List<AddressMasterResponse> items1 = (from u in _dbContext.AddressMasters
                                                          join c in _dbContext.WalletMasters
                                                          on u.WalletId equals c.Id
                                                          where u.Status < 9 && c.AccWalletID == AccWalletID && u.Status == Convert.ToInt16(ServiceStatus.Active) && c.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                                          orderby u.CreatedDate descending

                                                          select new AddressMasterResponse
                                                          {
                                                              AddressLabel = u.AddressLable,
                                                              Address = u.Address,
                                                              //IsDefaultAddress = u.IsDefaultAddress,
                                                          }).AsEnumerable().Take(1).ToList();
                    return items1;
                }
                else
                {
                    return items;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 24-10-2018
        public List<BalanceResponse> GetAvailableBalance(long userid, long walletId)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<BalanceResponse> items = (from w in _dbContext.WalletMasters
                                               join wt in _dbContext.WalletTypeMasters
                                                       on w.WalletTypeID equals wt.Id
                                               where w.Status < 9 && w.Id == walletId && w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                               select new BalanceResponse
                                               {
                                                   Balance = w.Balance,
                                                   WalletId = w.Id,
                                                   WalletType = wt.WalletTypeName
                                               }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetAllAvailableBalance(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<BalanceResponse> items = (from w in _dbContext.WalletMasters
                                               join wt in _dbContext.WalletTypeMasters
                                                       on w.WalletTypeID equals wt.Id
                                               where w.Status < 9 && w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                               select new BalanceResponse
                                               {
                                                   Balance = w.Balance,
                                                   WalletId = w.Id,
                                                   WalletType = wt.WalletTypeName,
                                               }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public decimal GetTotalAvailbleBal(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var total = (from w in _dbContext.WalletMasters
                             where w.Status < 9 && w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                             select w.Balance
                            ).Sum();
                return total;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //convert
        public decimal NewGetTotalAvailbleBal(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var total = (from w in _dbContext.WalletMasters
                             where w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletTypeID == 1 && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                             select w.Balance
                            ).Sum();

                var t = _dbContext.BalanceTotal.FromSql("select ISNULL(cast(Round((sum(w.Balance*ts.LTP)),18) as decimal (28,18)),0) as TotalBalance from WalletMasters w inner join  wallettypemasters wt on wt.id = w.wallettypeid inner join servicemaster s on s.wallettypeid =wt.id inner join Tradepairmaster t on t.SecondaryCurrencyId=s.id inner join TradePairStastics ts on ts.PairId=t.id where userid={0}  and t.basecurrencyid=(select s.id from wallettypemasters wt inner join servicemaster s on s.wallettypeid =wt.id where wt.IsDefaultWallet=1)", userid).FirstOrDefault();
                if (t == null)
                {
                    return total;
                }
                var amt = total + t.TotalBalance;
                return amt;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 24-10-2018
        public List<BalanceResponse> GetUnSettledBalance(long userid, long walletid)
        {
            try
            {
                var result = (from w in _dbContext.WalletTransactionQueues
                              where w.WalletID == walletid && w.MemberID == userid && w.Status == enTransactionStatus.Hold || w.Status == enTransactionStatus.Pending
                              group w by new { w.WalletType } into g
                              select new BalanceResponse
                              {
                                  Balance = g.Sum(order => order.Amount),
                                  WalletType = g.Key.WalletType,
                                  WalletId = walletid
                              }).AsEnumerable().ToList();

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetAllUnSettledBalance(long userid)
        {
            try
            {
                var result = (from w in _dbContext.WalletTransactionQueues
                              where w.MemberID == userid && w.Status == enTransactionStatus.Hold || w.Status == enTransactionStatus.Pending
                              group w by new { w.WalletType, w.WalletID } into g
                              select new BalanceResponse
                              {
                                  Balance = g.Sum(order => order.Amount),
                                  WalletType = g.Key.WalletType,
                                  WalletId = g.Key.WalletID
                              }).AsEnumerable().ToList();
                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetUnClearedBalance(long userid, long walletid)
        {
            try
            {
                var result = (from w in _dbContext.DepositHistory
                              join wt in _dbContext.AddressMasters
                              on w.Address equals wt.Address
                              where wt.WalletId == walletid && w.UserId == userid && w.Status == Convert.ToInt16(ServiceStatus.InActive)
                              select new BalanceResponse
                              {
                                  Balance = w.Amount,
                                  WalletType = w.SMSCode,
                                  WalletId = walletid
                              }).AsEnumerable().ToList();

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetUnAllClearedBalance(long userid)
        {
            try
            {
                var result = (from w in _dbContext.DepositHistory
                              join wt in _dbContext.AddressMasters
                              on w.Address equals wt.Address
                              where w.UserId == userid && w.Status == Convert.ToInt16(ServiceStatus.InActive)
                              select new BalanceResponse
                              {
                                  Balance = w.Amount,
                                  WalletType = w.SMSCode,
                                  WalletId = wt.WalletId
                              }).AsEnumerable().ToList();
                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<StackingBalanceRes> GetStackingBalance(long userid, long walletid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var result = (from u in _dbContext.UserStacking
                              join w in _dbContext.WalletMasters
                              on u.WalletId equals w.Id
                              where u.WalletId == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                              select new StackingBalanceRes
                              {
                                  StackingAmount = u.StackingAmount,
                                  WalletType = u.WalletType,
                                  WalletId = walletid
                              }).AsEnumerable().ToList();

                if (result.Count() == 0)
                {
                    //2019-2-18 added condi for only used trading wallet
                    var result1 = (from u in _dbContext.StckingScheme
                                   join w in _dbContext.WalletMasters
                                  on u.WalletType equals w.WalletTypeID
                                   join wt in _dbContext.WalletTypeMasters
                                   on u.WalletType equals wt.Id
                                   where w.Id == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                   select new StackingBalanceRes
                                   {
                                       MaxLimitAmount = u.MaxLimitAmount,
                                       MinLimitAmount = u.MinLimitAmount,
                                       WalletType = wt.WalletTypeName,
                                       WalletId = walletid
                                   }).AsEnumerable().ToList();
                    return result1;
                }

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<StackingBalanceRes> GetAllStackingBalance(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var result = (from u in _dbContext.UserStacking
                              join w in _dbContext.WalletMasters
                              on u.WalletId equals w.Id
                              where w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                              select new StackingBalanceRes
                              {
                                  StackingAmount = u.StackingAmount,
                                  WalletType = u.WalletType,
                                  WalletId = w.Id
                              }).AsEnumerable().ToList();

                if (result.Count() == 0)
                {
                    //2019-2-18 added condi for only used trading wallet
                    var result1 = (from u in _dbContext.StckingScheme
                                   join w in _dbContext.WalletMasters
                                  on u.WalletType equals w.WalletTypeID
                                   join wt in _dbContext.WalletTypeMasters
                                   on u.WalletType equals wt.Id
                                   where w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                   select new StackingBalanceRes
                                   {
                                       MaxLimitAmount = u.MaxLimitAmount,
                                       MinLimitAmount = u.MinLimitAmount,
                                       WalletType = wt.WalletTypeName,
                                       WalletId = w.Id
                                   }).AsEnumerable().ToList();
                    return result1;
                }
                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetShadowBalance(long userid, long walletid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var result = (from u in _dbContext.MemberShadowBalance
                              join w in _dbContext.WalletMasters
                              on u.WalletID equals w.Id
                              join wt in _dbContext.WalletTypeMasters
                              on u.WalletTypeId equals wt.Id
                              where u.WalletID == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                              select new BalanceResponse
                              {
                                  Balance = u.ShadowAmount,
                                  WalletType = wt.WalletTypeName,
                                  WalletId = walletid
                              }).AsEnumerable().ToList();

                if (result.Count() == 0)
                {
                    //2019-2-18 added condi for only used trading wallet
                    var result1 = (from u in _dbContext.MemberShadowLimit
                                   join w in _dbContext.BizUserTypeMapping
                                   on u.MemberTypeId equals w.UserType
                                   join wt in _dbContext.WalletMasters
                                   on walletid equals wt.Id
                                   join wtm in _dbContext.WalletTypeMasters
                                                      on wt.WalletTypeID equals wtm.Id
                                   where u.WalletType == wt.WalletTypeID && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && wt.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                   select new BalanceResponse
                                   {
                                       Balance = u.ShadowLimitAmount,
                                       WalletType = wtm.WalletTypeName,
                                       WalletId = walletid
                                   }).AsEnumerable().ToList();
                    return result1;
                }

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public List<BalanceResponse> GetAllShadowBalance(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var result = (from u in _dbContext.MemberShadowBalance
                              join w in _dbContext.WalletMasters
                              on u.WalletID equals w.Id
                              join wt in _dbContext.WalletTypeMasters
                                                       on u.WalletTypeId equals wt.Id
                              where w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                              select new BalanceResponse
                              {
                                  Balance = u.ShadowAmount,
                                  WalletType = wt.WalletTypeName,
                                  WalletId = w.Id
                              }).AsEnumerable().ToList();

                if (result.Count() == 0)
                {
                    //2019-2-18 added condi for only used trading wallet
                    var result1 = (from u in _dbContext.MemberShadowLimit
                                   join w in _dbContext.BizUserTypeMapping
                                   on u.MemberTypeId equals w.UserType
                                   join wt in _dbContext.WalletMasters
                                   on u.WalletType equals wt.WalletTypeID
                                   join wtm in _dbContext.WalletTypeMasters
                                   on wt.WalletTypeID equals wtm.Id
                                   where u.WalletType == wt.WalletTypeID && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive) && wt.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                   select new BalanceResponse
                                   {
                                       Balance = u.ShadowLimitAmount,
                                       WalletType = wtm.WalletTypeName,
                                       WalletId = wt.Id
                                   }).AsEnumerable().ToList();
                    return result1;
                }

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public Balance GetAllBalances(long userid, long walletid)
        {
            #region OldCode

            //var Unsettled = (from w in _dbContext.WalletTransactionQueues
            //                 where w.WalletID == walletid && w.MemberID == userid && w.Status == enTransactionStatus.Hold || w.Status == enTransactionStatus.Pending
            //                 select w.Amount).Sum();


            //var availble = (from w in _dbContext.WalletMasters
            //                join wt in _dbContext.WalletTypeMasters
            //                        on w.WalletTypeID equals wt.Id
            //                where w.Id == walletid && w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active)
            //                select w.Balance).Sum();

            //var UnClearedBalance = (from w in _dbContext.DepositHistory
            //                        join wt in _dbContext.AddressMasters
            //                        on w.Address equals wt.Address
            //                        where wt.WalletId == walletid && w.UserId == userid && w.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                        select w.Amount
            //              ).Sum();

            //var ShadowBalance = (from u in _dbContext.MemberShadowBalance
            //                     join w in _dbContext.WalletMasters
            //                     on u.WalletID equals w.Id
            //                     join wt in _dbContext.WalletTypeMasters
            //                                              on u.WalletTypeId equals wt.Id
            //                     where u.WalletID == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                     select u.ShadowAmount).Sum();

            //var StackingBalance = (from u in _dbContext.UserStacking
            //                       join w in _dbContext.WalletMasters
            //                       on u.WalletId equals w.Id
            //                       where u.WalletId == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                       select u.StackingAmount).Sum(); 
            #endregion
            try
            {
                var items = _dbContext.Balance.FromSql(@"select ISNULL((select sum(Amount) from WalletTransactionQueues where WalletID ={0} AND MemberID = {1} AND (Status=4 or Status=6)),0 )as UnSettledBalance ,ISnull((select sum(w.Balance) from  WalletMasters w inner join WalletTypeMasters wt on wt.Id=w.WalletTypeId where w.Id = {0} and w.UserID = {1} and w.Status =1),0) as AvailableBalance,ISNULL((select sum(w.Amount) from DepositHistory w inner join AddressMasters wt on wt.Address=w.Address where w.Id = {0} and w.UserID = {1} and w.Status =0),0 )as UnClearedBalance,ISNULL((select sum(u.ShadowAmount) from MemberShadowBalance u inner join WalletMasters w on w.Id=u.WalletID inner join WalletTypeMasters wt on wt.Id= u.WalletTypeId where w.Id = {0} and w.UserID = {1} and w.Status =0),0) as ShadowBalance,ISNULL((select SUM(StakingAmount) from TokenStakingHistory where WalletID={0} and UserId={1} And Status in (1,4)),0) as StackingBalance", walletid, userid).First();

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 25-10-2018
        public List<BalanceResponseLimit> GetAvailbleBalTypeWise(long userid)
        {
            try
            {
                #region OldCode

                //var result = (from w in _dbContext.WalletMasters
                //              join wt in _dbContext.WalletTypeMasters
                //              on w.WalletTypeID equals wt.Id
                //              where w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active)
                //              group w by new { wt.WalletTypeName } into g
                //              select new BalanceResponseLimit
                //              {
                //                  Balance = g.Sum(order => order.Balance),
                //                  WalletType = g.Key.WalletTypeName,
                //              }).AsEnumerable().ToList();
                #endregion
                //2019-2-18 added condi for only used trading wallet
                var result = _dbContext.BalanceResponseLimit.FromSql(@"select wt.WalletTypeName as WalletType,ISNULL(SUM(w.Balance),0) as Balance from WalletTypeMasters wt left join WalletMasters w on w.WalletTypeID=wt.Id and w.UserID={0} and w.status=1 and w.WalletUsageType=0 where wt.Status=1  group by wt.WalletTypeName", userid).ToList();

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<BeneficiaryMasterRes1> GetAllWhitelistedBeneficiaries(long WalletTypeID, long UserID)
        {
            try
            {
                #region LINQ CODE
                //List<BeneficiaryMasterRes> items = (from b in _dbContext.BeneficiaryMaster
                //                                    where b.UserID == UserID && b.WalletTypeID == WalletTypeID && b.IsWhiteListed == 1 && b.Status != Convert.ToInt16(ServiceStatus.Disable)
                //                                    orderby b.Id, b.CreatedDate descending
                //                                    select new BeneficiaryMasterRes
                //                                    {
                //                                        Name = b.Name,
                //                                        BeneficiaryID = b.Id,
                //                                        Address = b.Address,
                //                                        Status = b.Status

                //                                    }).AsEnumerable().OrderByDescending(t => t.BeneficiaryID).ToList();
                //return items;
                #endregion
                List<BeneficiaryMasterRes1> Resp = new List<BeneficiaryMasterRes1>();
                string query = "SELECT B.Name,B.Id AS 'BeneficiaryID',B.Address,B.Status FROM BeneficiaryMaster B WHERE B.Status < 9 AND B.UserID = {0} AND B.WalletTypeID = {1} AND B.IsWhiteListed = 1 ORDER BY B.CreatedDate DESC"; //AND B.Status = {2} 
                IQueryable<BeneficiaryMasterRes1> Result = _dbContext.BeneficiaryMasterRes1.FromSql(query, UserID, WalletTypeID);//, Convert.ToInt16(ServiceStatus.Active)
                Resp = Result.ToList();
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<BeneficiaryMasterRes> GetAllBeneficiaries(long UserID)
        {
            try
            {
                List<BeneficiaryMasterRes> Resp = new List<BeneficiaryMasterRes>();
                string query = "SELECT B.Name,B.Id AS 'BeneficiaryID',B.Address,W.WalletTypeName AS 'CoinName',B.IsWhiteListed,B.Status FROM BeneficiaryMaster B INNER JOIN WalletTypeMasters W ON B.WalletTypeID = W.Id WHERE B.UserID = {0} AND B.Status < 9 ORDER BY B.CreatedDate DESC";
                IQueryable<BeneficiaryMasterRes> Result = _dbContext.BeneficiaryMasterRes.FromSql(query, UserID);//, Convert.ToInt16(ServiceStatus.Active)
                Resp = Result.ToList();
                return Resp;
                #region LINQ CODE
                //List<BeneficiaryMasterRes> items = (from b in _dbContext.BeneficiaryMaster
                //                                    join w in _dbContext.WalletTypeMasters
                //                                    on b.WalletTypeID equals w.Id
                //                                    where b.UserID == UserID && b.Status != Convert.ToInt16(ServiceStatus.Disable)
                //                                    orderby b.CreatedDate descending
                //                                    select new BeneficiaryMasterRes
                //                                    {
                //                                        Name = b.Name,
                //                                        BeneficiaryID = b.Id,
                //                                        Address = b.Address,
                //                                        CoinName = w.WalletTypeName,
                //                                        IsWhiteListed = b.IsWhiteListed,
                //                                        Status = b.Status
                //                                    }).AsEnumerable().OrderByDescending(t => t.BeneficiaryID).ToList();//.OrderByDescending(t=>t.BeneficiaryID)
                //return items;
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #region OldCode
        //public bool BeneficiaryBulkEdit(BulkBeneUpdateReq arryTrnID)
        //{
        //    try
        //    {
        //        _dbContext.Database.BeginTransaction();
        //        var arrayObj = (from p in _dbContext.BeneficiaryMaster
        //                        join q in arryTrnID.ID on p.Id equals q
        //                        select new { p, q }).ToList();
        //        if (arrayObj.Count() != 0)
        //        {
        //            //arrayObj.ForEach(e => e.p.IsWhiteListed = e.q.WhitelistingBit);
        //            arrayObj.ForEach(e => e.p.IsWhiteListed = arryTrnID.WhitelistingBit);
        //            arrayObj.ForEach(e =>
        //            {
        //                if (arryTrnID.WhitelistingBit == 9)
        //                {
        //                    e.p.Status = arryTrnID.WhitelistingBit;
        //                }
        //            });
        //            arrayObj.ForEach(e => e.p.UpdatedDate = UTC_To_IST());
        //            _dbContext.SaveChanges();
        //            _dbContext.Database.CommitTransaction();
        //            return true;
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        _dbContext.Database.RollbackTransaction();
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        #endregion
        public BeneUpdate BeneficiaryBulkEdit(string id, short bit)
        {
            try
            {
                BeneUpdate res = new BeneUpdate();
                string Query = "UPDATE BeneficiaryMaster SET IsWhiteListed = {0}";
                if (bit == 9)
                {
                    Query += ", Status=9";
                }
                Query += " WHERE ID IN(" + id + ") SELECT @@ROWCOUNT as 'AffectedRows'";
                IQueryable<BeneUpdate> Result = _dbContext.BeneUpdate.FromSql(Query, bit);
                res = Result.FirstOrDefault();
                return res;
            }
            catch (Exception ex)
            {
                //_dbContext.Database.RollbackTransaction(); ntrivedi 14-12-2018 not needed 
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        //public void GetSetLimitConfigurationMaster(int[] AllowTrnType, long userid, long WalletId)
        //{
        //    try
        //    {
        //        var arrayObj = (from p in _dbContext.WalletLimitConfigurationMaster
        //                        join q in AllowTrnType on p.TrnType equals q
        //                        select p).ToList();

        //        var fadd = from array in arrayObj
        //                   select new WalletLimitConfiguration
        //                   {
        //                       CreatedBy = userid,
        //                       CreatedDate = UTC_To_IST(),
        //                       WalletId = WalletId,
        //                       TrnType = array.TrnType,
        //                       LimitPerDay = array.LimitPerDay,
        //                       LimitPerHour = array.LimitPerHour,
        //                       LimitPerTransaction = array.LimitPerTransaction,
        //                       Status = Convert.ToInt16(ServiceStatus.Active),
        //                       StartTimeUnix = array.StartTimeUnix,
        //                       EndTimeUnix = array.EndTimeUnix,
        //                       LifeTime = null,
        //                       UpdatedDate = UTC_To_IST()
        //                   };
        //        _dbContext.WalletLimitConfiguration.AddRange(fadd);
        //        _dbContext.SaveChanges();

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //vsolanki 26-10-2018

        public DateTime UTC_To_IST(DateTime dateTime)
        {
            try
            {
                // DateTime myUTC = DateTime.UtcNow;
                // 'Dim utcdate As DateTime = DateTime.ParseExact(DateTime.UtcNow, "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
                // Dim utcdate As DateTime = DateTime.ParseExact(myUTC, "M/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture)
                // 'Dim utcdate As DateTime = DateTime.ParseExact("11/09/2016 6:31:00 PM", "M/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture)
                DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                // MsgBox(myUTC & " - " & utcdate & " - " & istdate)
                return istdate;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public decimal GetTodayAmountOfTQ(long userId, long WalletId)
        {
            try
            {
                DateTime startDateTime = UTC_To_IST(DateTime.UtcNow); //Today at 12:00:00
                DateTime endDateTime = UTC_To_IST(DateTime.UtcNow.AddDays(-1).AddTicks(-1));
                //var d = startDateTime.Date;
                //var amt = (from tq in _dbContext.WalletTransactionQueues
                //          where tq.Status == enTransactionStatus.Success && tq.TrnDate >= startDateTime &&
                //          tq.TrnDate <= endDateTime && tq.WalletID== WalletId && tq.MemberID==userId
                //          group tq by new { tq.TrnDate } into g
                //          select
                //          g.Sum(order => order.Amount));


                //   var total = (from tq in _dbContext.WalletTransactionQueues
                //                where tq.Status == enTransactionStatus.Success && tq.TrnDate <= startDateTime.Date &&
                //            tq.TrnDate >= endDateTime.Date && tq.WalletID == WalletId && tq.MemberID == userId
                //                select tq.Amount
                //).Sum();

                //change query 2019-1-31

                var total = _dbContext.BalanceTotal.FromSql("select isnull(sum(case Status when 4 then OrderTotalQty else SettledSellQty end) ,0) as TotalBalance from TradeTransactionQueue where TrnDate <= {0} AND TrnDate >= {1} and OrderWalletID ={2} and status in(1, 4)", startDateTime.Date, endDateTime.Date, WalletId).FirstOrDefault();
                if (total == null)
                {
                    return 0;
                }
                return total.TotalBalance;

                //return Convert.ToDecimal(amt);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 26-10-2018
        public List<WalletLedgerRes> GetWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page)
        {
            try
            {
                //int skip = Helpers.PageSize * (page - 1);
                List<WalletLedgerRes> wl = (from w in _dbContext.WalletLedgers
                                            where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                            orderby w.Id ascending
                                            select new WalletLedgerRes
                                            {
                                                LedgerId = w.Id,
                                                PreBal = w.PreBal,
                                                PostBal = w.PreBal,
                                                Remarks = "Opening Balance",
                                                Amount = 0,
                                                CrAmount = 0,
                                                DrAmount = 0,
                                                TrnDate = w.TrnDate
                                            }).Take(1).Union((from w in _dbContext.WalletLedgers
                                                              where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                                              orderby w.Id ascending
                                                              select new WalletLedgerRes
                                                              {
                                                                  LedgerId = w.Id,
                                                                  PreBal = w.PreBal,
                                                                  PostBal = w.PostBal,
                                                                  Remarks = w.Remarks,
                                                                  Amount = w.CrAmt > 0 ? w.CrAmt : w.DrAmt,
                                                                  CrAmount = w.CrAmt,
                                                                  DrAmount = w.DrAmt,
                                                                  TrnDate = w.TrnDate
                                                              })).ToList();

                if (page > 0)
                {
                    int skip = Helpers.PageSize * (page - 1);
                    wl = wl.Skip(skip).Take(Helpers.PageSize).ToList();
                }
                //var bal = wl[0].PreBal;
                decimal DrAmount = 0, CrAmount = 0, Amount = 0;

                //for(int i=0;i<wl.Count();i++)
                //{
                // wl[]
                //}
                //wl.ForEach(e =>
                // {
                // Amount = e.PreBal + e.CrAmount - e.DrAmount;
                // e.PostBal = Amount;
                // e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;
                // });
                return wl;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 26-10-2018
        public List<WalletLedgerRes> GetWalletLedgerV1(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount)
        {
            try
            {
                //int skip = Helpers.PageSize * (page - 1);
                List<WalletLedgerRes> wl = (from w in _dbContext.WalletLedgers
                                            where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                            orderby w.Id ascending
                                            select new WalletLedgerRes
                                            {
                                                LedgerId = w.Id,
                                                PreBal = w.PreBal,
                                                PostBal = w.PreBal,
                                                Remarks = "Opening Balance",
                                                Amount = 0,
                                                CrAmount = 0,
                                                DrAmount = 0,
                                                TrnDate = w.TrnDate
                                            }).Take(1).Union((from w in _dbContext.WalletLedgers
                                                              where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                                              orderby w.Id ascending
                                                              select new WalletLedgerRes
                                                              {
                                                                  LedgerId = w.Id,
                                                                  PreBal = w.PreBal,
                                                                  PostBal = w.PostBal,
                                                                  Remarks = w.Remarks,
                                                                  Amount = w.CrAmt > 0 ? w.CrAmt : w.DrAmt,
                                                                  CrAmount = w.CrAmt,
                                                                  DrAmount = w.DrAmt,
                                                                  TrnDate = w.TrnDate
                                                              })).ToList();

                TotalCount = wl.Count();
                if (page > 0)
                {
                    int skip = PageSize * (page - 1);
                    wl = wl.Skip(skip).Take(PageSize).ToList();
                }
                //var bal = wl[0].PreBal;
                //  decimal DrAmount = 0, CrAmount = 0, Amount = 0;
                decimal DrAmount = 0, CrAmount = 0, Amount = 0;
                wl.ForEach(e =>
                {
                    Amount = e.PreBal + e.CrAmount - e.DrAmount;
                    e.PostBal = Amount;
                    e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;

                });
                //for(int i=0;i<wl.Count();i++)
                //{
                //    wl[]
                //}
                //wl.ForEach(e =>
                //        {
                //            Amount = e.PreBal + e.CrAmount - e.DrAmount;
                //            e.PostBal = Amount;
                //            e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;
                //        });
                return wl;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-10-27
        public async Task<int> CreateDefaulWallet(long UserId)
        {
            try
            {
                //Craete wallet
                var WalletTypeObj = (from p in _dbContext.WalletTypeMasters
                                     where p.Status == Convert.ToInt16(ServiceStatus.Active)
                                     select p).ToList();

                var Wallets = from WalletTypearray in WalletTypeObj
                              select new WalletMaster
                              {
                                  CreatedBy = UserId,
                                  CreatedDate = UTC_To_IST(),
                                  Status = Convert.ToInt16(ServiceStatus.Active),
                                  UpdatedDate = UTC_To_IST(),
                                  Balance = 0,
                                  WalletTypeID = WalletTypearray.Id,
                                  UserID = UserId,
                                  Walletname = WalletTypearray.WalletTypeName + " DefaultWallet",
                                  AccWalletID = RandomGenerateWalletId(UserId, 1),
                                  IsDefaultWallet = 1,
                                  IsValid = true,
                                  PublicAddress = "",
                                  OrgID = 1
                              };
                _dbContext.WalletMasters.AddRange(Wallets);
                _dbContext.SaveChanges();

                //Add limit for following wallet Id           
                //  Array val = Enum.GetValues(typeof(enWalletLimitType));

                //    int[] AllowTrnType = { Convert.ToInt32(enWalletLimitType.APICallLimit) ,
                //Convert.ToInt32(enWalletLimitType.WithdrawLimit) ,
                //Convert.ToInt32(enWalletLimitType.DepositLimit) ,
                //Convert.ToInt32(enWalletLimitType.TradingLimit) };

                List<int> AllowTrnType = Helpers.GetEnumValue<enWalletLimitType>();

                //var arrayObj = (from p in _dbContext.WalletLimitConfigurationMaster
                //                join q in AllowTrnType on p.TrnType equals q
                //                select p).ToList();

                var walletObj = (from wm in _dbContext.WalletMasters
                                 where wm.UserID == UserId && wm.IsDefaultWallet == 1
                                 select wm).ToList();

                //var fadd = from array in arrayObj
                //           from ww in walletObj
                //           select new WalletLimitConfiguration
                //           {
                //               CreatedBy = UserId,
                //               CreatedDate = UTC_To_IST(),
                //               WalletId = ww.Id,
                //               TrnType = array.TrnType,
                //               LimitPerDay = array.LimitPerDay,
                //               LimitPerHour = array.LimitPerHour,
                //               LimitPerTransaction = array.LimitPerTransaction,
                //               Status = Convert.ToInt16(ServiceStatus.Active),
                //               StartTimeUnix = array.StartTimeUnix,
                //               EndTimeUnix = array.EndTimeUnix,
                //               LifeTime = array.LifeTime,
                //               UpdatedDate = UTC_To_IST()
                //           };
                //var faadT = _dbContext.WalletLimitConfiguration.AddRangeAsync(fadd);

                ///_dbContext.SaveChanges(); 

                //add WalletAllowTrn
                var trntypeObj = from type in AllowTrnType
                                 from ww in walletObj
                                 select new WalletAllowTrn
                                 {
                                     CreatedDate = UTC_To_IST(),
                                     CreatedBy = UserId,
                                     Status = Convert.ToInt16(ServiceStatus.Active),
                                     WalletId = ww.Id,
                                     TrnType = Convert.ToByte(type),
                                 };
                _dbContext.WalletAllowTrns.AddRange(trntypeObj);
                //await faadT;
                _dbContext.SaveChanges();

                var authObj = from ww in walletObj
                              select new WalletAuthorizeUserMaster
                              {
                                  RoleID = 1,
                                  UserID = UserId,
                                  Status = 1,
                                  CreatedBy = UserId,
                                  CreatedDate = UTC_To_IST(),
                                  UpdatedDate = UTC_To_IST(),
                                  WalletID = ww.Id,
                                  OrgID = Convert.ToInt64(ww.OrgID),
                              };
                _dbContext.WalletAuthorizeUserMaster.AddRange(authObj);
                _dbContext.SaveChanges();

                return 1;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateDefaulWallet", this.GetType().Name, ex);
                //  throw ex;
                return 0;
            }
        }

        private static Random random = new Random((int)DateTime.Now.Ticks);

        public string RandomGenerateWalletId(long userID, byte isDefaultWallet)
        {
            try
            {
                long maxValue = 9999999999;
                long minValue = 1000000000;
                long x = (long)Math.Round(random.NextDouble() * (maxValue - minValue - 1)) + minValue;
                string userIDStr = x.ToString() + userID.ToString().PadLeft(5, '0') + isDefaultWallet.ToString();
                return userIDStr;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public int CreateWalletForAllUser_NewService(string WalletType)
        {
            try
            {
                var WalletTypeObj = (from p in _dbContext.WalletTypeMasters
                                     where p.Status == Convert.ToInt16(ServiceStatus.Active) && p.WalletTypeName == WalletType
                                     select p).FirstOrDefault();

                //var Users = (from p in _dbContext.Users
                //             where p.IsEnabled == true
                //             select p).ToList();

                var Users = (from s in _dbContext.Users
                                 //from wt in WalletTypeObj
                             where !_dbContext.WalletMasters.Any(es => (es.UserID == s.Id) && (es.WalletTypeID == WalletTypeObj.Id) && (es.IsDefaultWallet == 1))
                             select s).ToList();
                //var ISExistWallet = (from item in _dbContext.WalletMasters
                //                     from WalletTypearray in WalletTypeObj
                //                     from ui in Users
                //                     where item.WalletTypeID == WalletTypearray.Id && item.IsDefaultWallet == 1 && item.UserID == ui.Id
                //                     select item).ToList();

                var Wallets = //from WalletTypearray in WalletTypeObj
                              from U in Users
                              select new WalletMaster
                              {
                                  CreatedBy = U.Id,
                                  CreatedDate = UTC_To_IST(),
                                  Status = Convert.ToInt16(ServiceStatus.Active),
                                  UpdatedDate = UTC_To_IST(),
                                  Balance = 0,
                                  WalletTypeID = WalletTypeObj.Id,
                                  UserID = U.Id,
                                  Walletname = WalletTypeObj.WalletTypeName + " DefaultWallet",
                                  AccWalletID = RandomGenerateWalletId(U.Id, 1),
                                  IsDefaultWallet = 1,
                                  IsValid = true,
                                  PublicAddress = ""
                              };
                _dbContext.WalletMasters.AddRange(Wallets);
                _dbContext.SaveChanges();

                //Add limit for following wallet Id           
                //  Array val = Enum.GetValues(typeof(enWalletLimitType));

                //    int[] AllowTrnType = { Convert.ToInt32(enWalletLimitType.APICallLimit) ,
                //Convert.ToInt32(enWalletLimitType.WithdrawLimit) ,
                //Convert.ToInt32(enWalletLimitType.DepositLimit) ,
                //Convert.ToInt32(enWalletLimitType.TradingLimit) };
                List<int> AllowTrnType = Helpers.GetEnumValue<enWalletLimitType>();


                //var arrayObj = (from p in _dbContext.WalletLimitConfigurationMaster
                //                join q in AllowTrnType on p.TrnType equals q
                //                select p).ToList();

                // var walletObj = Wallets;
                var walletObj = (from wm in _dbContext.WalletMasters
                                 join U in Users on wm.UserID equals U.Id
                                 where wm.UserID == U.Id && wm.IsDefaultWallet == 1 && wm.WalletTypeID == WalletTypeObj.Id
                                 select wm).ToList();

                //var fadd = from array in arrayObj
                //           from ww in walletObj
                //               //from U in Users
                //           select new WalletLimitConfiguration
                //           {
                //               CreatedBy = ww.UserID,
                //               CreatedDate = UTC_To_IST(),
                //               WalletId = ww.Id,
                //               TrnType = array.TrnType,
                //               LimitPerDay = array.LimitPerDay,
                //               LimitPerHour = array.LimitPerHour,
                //               LimitPerTransaction = array.LimitPerTransaction,
                //               Status = Convert.ToInt16(ServiceStatus.Active),
                //               StartTimeUnix = array.StartTimeUnix,
                //               EndTimeUnix = array.EndTimeUnix,
                //               LifeTime = null,
                //               UpdatedDate = UTC_To_IST()
                //           };
                //_dbContext.WalletLimitConfiguration.AddRange(fadd);
                //_dbContext.SaveChanges();

                //add WalletAllowTrn
                var trntypeObj = from type in AllowTrnType
                                 from ww in walletObj
                                     //from U in Users
                                 select new WalletAllowTrn
                                 {
                                     CreatedDate = UTC_To_IST(),
                                     CreatedBy = ww.UserID,
                                     Status = Convert.ToInt16(ServiceStatus.Active),
                                     WalletId = ww.Id,
                                     TrnType = Convert.ToByte(type),
                                 };
                _dbContext.WalletAllowTrns.AddRange(trntypeObj);
                //_dbContext.SaveChanges();

                var authObj = from ww in walletObj
                                  //from U in Users
                              select new WalletAuthorizeUserMaster
                              {
                                  RoleID = 1,
                                  UserID = ww.UserID,
                                  Status = 1,
                                  CreatedBy = ww.UserID,
                                  CreatedDate = UTC_To_IST(),
                                  UpdatedDate = UTC_To_IST(),
                                  WalletID = ww.Id,
                                  OrgID = Convert.ToInt64(ww.OrgID),
                              };
                _dbContext.WalletAuthorizeUserMaster.AddRange(authObj);
                _dbContext.SaveChanges();

                return 1;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //public int AddBulkData()
        //{
        //    try
        //    {
        //        var Users = (from s in _dbContext.Users
        //                     select s).ToList();

        //        //var Wallets = (from w in _dbContext.WalletMasters
        //        //               join u in Users on w.UserID equals u.Id
        //        //               select w).ToList();

        //        List<int> AllowTrnType = Helpers.GetEnumValue<enWalletLimitType>();

        //        var arrayObj = (from p in _dbContext.WalletLimitConfigurationMaster
        //                        join q in AllowTrnType on p.TrnType equals q
        //                        select p).ToList();

        //        var walletObj = (from wm in _dbContext.WalletMasters
        //                         from U in Users
        //                         where wm.UserID == U.Id
        //                         select wm).ToList();

        //        var limitObj = from array in arrayObj
        //                       from ww in walletObj
        //                           //from U in Users
        //                       select new WalletLimitConfiguration
        //                       {
        //                           CreatedBy = ww.UserID,
        //                           CreatedDate = UTC_To_IST(),
        //                           WalletId = ww.Id,
        //                           TrnType = array.TrnType,
        //                           LimitPerDay = array.LimitPerDay,
        //                           LimitPerHour = array.LimitPerHour,
        //                           LimitPerTransaction = array.LimitPerTransaction,
        //                           Status = Convert.ToInt16(ServiceStatus.Active),
        //                           StartTimeUnix = array.StartTimeUnix,
        //                           EndTimeUnix = array.EndTimeUnix,
        //                           LifeTime = array.LifeTime,
        //                           UpdatedDate = UTC_To_IST()
        //                       };
        //        _dbContext.WalletLimitConfiguration.AddRange(limitObj);
        //        //  _dbContext.SaveChanges();

        //        //add WalletAllowTrn
        //        var trntypeObj = from type in _dbContext.WTrnTypeMaster
        //                         from ww in walletObj
        //                             //from U in Users
        //                         select new WalletAllowTrn
        //                         {
        //                             CreatedDate = UTC_To_IST(),
        //                             CreatedBy = ww.UserID,
        //                             Status = Convert.ToInt16(ServiceStatus.Active),
        //                             WalletId = ww.Id,
        //                             TrnType = Convert.ToByte(type.TrnTypeId),
        //                         };
        //        _dbContext.WalletAllowTrns.AddRange(trntypeObj);

        //        var limit = limitObj.Count();
        //        var trn = trntypeObj.Count();
        //        // _dbContext.SaveChanges();

        //        var authObj = from ww in walletObj
        //                          //from U in Users
        //                      select new WalletAuthorizeUserMaster
        //                      {
        //                          RoleID = 1,
        //                          UserID = ww.UserID,
        //                          Status = 1,
        //                          CreatedBy = ww.UserID,
        //                          CreatedDate = UTC_To_IST(),
        //                          UpdatedDate = UTC_To_IST(),
        //                          WalletID = ww.Id,
        //                          OrgID = Convert.ToInt64(ww.OrgID),
        //                      };
        //        _dbContext.WalletAuthorizeUserMaster.AddRange(authObj);
        //        // _dbContext.SaveChanges();
        //        var auth = authObj.Count();
        //        return 1;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //vsolanki 2018-10-29
        public int AddBizUserTypeMapping(BizUserTypeMapping bizUser)
        {
            try
            {
                var UserTypeMap = _dbContext.BizUserTypeMapping.Add(bizUser);
                _dbContext.SaveChanges();
                return 1;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return 0;
            }
        }

        //vsolanki 2018-10-29
        public List<IncomingTrnRes> GetIncomingTransaction(long Userid, string Coin)
        {
            if (Coin == null)
            {
                Coin = "";
            }
            #region OldCode

            //    var myResult = _dbContext.DepositHistory.Where(r => r.Status == 0)
            //.Select((r, i) => new {idx = i, TrnID = r.TrnID });

            //var trns = (from trn in _dbContext.DepositHistory
            //            join wt in _dbContext.WalletTypeMasters
            //           on trn.SMSCode equals wt.WalletTypeName
            //            join s in _dbContext.ServiceMaster on trn.SMSCode.ToLower() equals s.SMSCode.ToLower()
            //            join sd in _dbContext.ServiceDetail on s.Id equals sd.ServiceId
            //            where trn.Status == Convert.ToInt16(enTransactionStatus.Pending) /*&& trn.Confirmations < 3 */ && trn.UserId == Userid && (Coin == null || (trn.SMSCode == Coin && Coin != null))
            //            select new IncomingTrnRes
            //            {
            //                AutoNo = trn.Id,
            //                TrnID = trn.TrnID,
            //                WalletType = trn.SMSCode,
            //                Confirmations = trn.Confirmations,
            //                Amount = trn.Amount,
            //                Address = trn.Address,
            //                ConfirmationCount = wt.ConfirmationCount,
            //              ExplorerLink = JsonConvert.DeserializeObject<ServiceDetailJsonData>(sd.ServiceDetailJson).Explorer
            //            }).ToList();
            //var test = trns.Select((r, i) => new IncomingTrnRes
            //{
            //    AutoNo = i + 1,
            //    TrnID = r.TrnID,
            //    WalletType = r.WalletType,
            //    Confirmations = r.Confirmations,
            //    Amount = r.Amount,
            //    Address = r.Address,
            //    ConfirmationCount = r.ConfirmationCount,
            //    ExplorerLink = r.ExplorerLink
            //}).ToList();
            #endregion
            try
            {
                var test = _dbContext.IncomingTrnRes.FromSql(@"SELECT  trn.Id as TrnNo,trn.CreatedDate as Date,ROW_NUMBER() OVER (ORDER BY trn.Id ) AS AutoNo,trn.TrnID,trn.SMSCode AS WalletType,trn.Confirmations,trn.Amount,trn.Address,wt.ConfirmationCount,ISNULL(JSON_QUERY(CAST(sd.ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]')AS ExplorerLink FROM DepositHistory trn INNER JOIN WalletTypeMasters wt ON wt.WalletTypeName=trn.SMSCode INNER JOIN ServiceMaster   s ON s.SMSCode=trn.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id WHERE trn.Status = 0 and trn.UserId = {0} and ({1} ='' or trn.SMSCode={1})", Userid, Coin).ToList();

                return test;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public long getOrgID()
        {
            try
            {
                var orgObj = _dbContext.BizUserTypeMapping.Where(u => u.UserType == 0).FirstOrDefault();
                if (orgObj == null)
                {
                    return 0;
                }
                else
                {
                    return orgObj.UserID;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public WalletTransactionQueue GetTransactionQueue(long TrnNo)
        {
            try
            {
                WalletTransactionQueue tq = _dbContext.WalletTransactionQueues.Where(u => u.TrnNo == TrnNo).SingleOrDefault();
                return tq;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<WalletTransactionQueue> GetTransactionQueueAsync(long TrnNo)
        {
            try
            {
                WalletTransactionQueue tq = await _dbContext.WalletTransactionQueues.Where(u => u.TrnNo == TrnNo).SingleOrDefaultAsync();
                return tq;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetTransactionQueueAsync", this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool WalletCreditDebitwithTQ(WalletLedger wl1, WalletLedger wl2, TransactionAccount ta1, TransactionAccount ta2, WalletMaster wm2, WalletMaster wm1, WalletTransactionQueue wtq1, WalletTransactionQueue wtq2, WalletTransactionOrder order)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018

                _dbContext.Database.BeginTransaction();
                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<WalletLedger>().Add(wl2);
                _dbContext.Set<TransactionAccount>().Add(ta1);
                _dbContext.Set<TransactionAccount>().Add(ta2);
                _dbContext.Entry(wm1).State = EntityState.Modified;
                _dbContext.Entry(wm2).State = EntityState.Modified;
                _dbContext.Entry(wtq1).State = EntityState.Modified;
                _dbContext.Entry(wtq2).State = EntityState.Modified;
                _dbContext.Entry(order).State = EntityState.Modified;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
                return true;
            }

            catch (Exception ex)
            {
                _dbContext.Database.RollbackTransaction();
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public long GetTypeMappingObj(long userid)
        {
            try
            {
                var UserTypeObj = _dbContext.BizUserTypeMapping.Where(u => u.UserID == userid).SingleOrDefault();
                if (UserTypeObj == null)
                {
                    return -1; //ntrivedi usertype can be 0
                }
                else
                {
                    return UserTypeObj.UserType;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<long> GetTypeMappingObjAsync(long userid)
        {
            try
            {
                Task<BizUserTypeMapping> UserTypeObj1 = _dbContext.BizUserTypeMapping.Where(u => u.UserID == userid).FirstOrDefaultAsync();
                BizUserTypeMapping UserTypeObj = await UserTypeObj1;
                if (UserTypeObj == null)
                {
                    return -1; //ntrivedi usertype can be 0
                }
                else
                {
                    return UserTypeObj.UserType;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetTypeMappingObjAsync", this.GetType().Name, ex);
                throw ex;
            }
        }
        public decimal GetLedgerLastPostBal(long walletId)
        {
            try
            {
                var ledgers = (from ledger in _dbContext.WalletLedgers
                               where ledger.WalletId == walletId
                               orderby ledger.TrnDate descending
                               select ledger).Take(1).First();
                if (ledgers != null)
                {
                    var bal = ledgers.PostBal;
                    return bal;
                }
                return 0;
                #region OldCode

                //else
                //{
                //    var bals = (from wallet in _dbContext.WalletMasters
                //               where wallet.Id == walletId
                //               orderby wallet.CreatedDate descending
                //               select wallet).Take(1).FirstOrDefault();
                //    if(bals.Balance==0)
                //    {
                //        return 0;
                //    }
                //    return bals.Balance;
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rushabh 2018-12-04
        public List<OutgoingTrnRes> GetOutGoingTransaction(long Userid, string Coin)
        {
            try
            {
                List<OutgoingTrnRes> res = new List<OutgoingTrnRes>();
                string str = "SELECT WH.TrnNo as TrnNo,WH.CreatedDate as Date,ROW_NUMBER() OVER (ORDER BY WH.ID) AS 'AutoNo',WH.TrnID,WH.SMSCode AS 'WalletType',WH.Confirmations,WH.Amount,WH.Address,WT.ConfirmationCount,ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink' FROM WithdrawHistory WH INNER JOIN WalletTypeMasters WT ON WH.SMSCode = WT.WalletTypeName INNER JOIN ServiceMaster SM ON WH.SMSCode = SM.SMSCode INNER JOIN ServiceDetail SD ON SM.Id = SD.ServiceId WHERE WH.UserId = {0} AND WH.Status = {1}";
                if (Coin != null && Coin != "")
                {
                    str += " AND WH.SMSCode={2}";
                }
                IQueryable<OutgoingTrnRes> Result = _dbContext.OutgoingTrnRes.FromSql(str, Userid, Convert.ToInt16(enTransactionStatus.Pending), Coin);
                res = Result.ToList();

                #region Old Code

                //var trns = (from trn in _dbContext.WithdrawHistory
                //            join wt in _dbContext.WalletTypeMasters
                //            on trn.SMSCode equals wt.WalletTypeName
                //            join s in _dbContext.ServiceMaster on trn.SMSCode.ToLower() equals s.SMSCode.ToLower()
                //            join sd in _dbContext.ServiceDetail on s.Id equals sd.ServiceId
                //            where trn.Status == Convert.ToInt16(enTransactionStatus.Pending) /*&& trn.Confirmations < 3 */&& trn.UserId == Userid && (Coin == null || (trn.SMSCode == Coin && Coin != null))
                //            select new OutgoingTrnRes
                //            {
                //                AutoNo = trn.Id,
                //                TrnID = trn.TrnID,
                //                WalletType = trn.SMSCode,
                //                Confirmations = trn.Confirmations,
                //                Amount = trn.Amount,
                //                Address = trn.Address,
                //                ConfirmationCount = wt.ConfirmationCount,
                //                //ExplorerLink = JsonConvert.DeserializeObject<ServiceDetailJsonData>(sd.ServiceDetailJson).Explorer
                //            }).ToList();
                //var test = trns.Select((r, i) => new OutgoingTrnRes
                //{
                //    AutoNo = i + 1,
                //    TrnID = r.TrnID,
                //    WalletType = r.WalletType,
                //    Confirmations = r.Confirmations,
                //    Amount = r.Amount,
                //    Address = r.Address,
                //    ConfirmationCount = r.ConfirmationCount,
                //    ExplorerLink = r.ExplorerLink
                //}).ToList();
                //return test;

                #endregion

                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-11-02

        public List<TransfersRes> GetTransferIn(string Coin, int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId, ref int TotalCount)
        {
            try
            {
                List<TransfersRes> trns = new List<TransfersRes>();
                trns = _dbContext.TransfersRes.FromSql(@"SELECT  o.Id as OrgId,o.OrganizationName,ROW_NUMBER() OVER (ORDER BY trn.Id ) AS AutoNo,trn.TrnID,trn.SMSCode AS WalletType,  JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',trn.Confirmations,trn.Amount,trn.Address,wt.ConfirmationCount,trn.ConfirmedTime,u.id as UserId,u.UserName AS 'UserName',ISNULL(u.Email,'') as Email,cast(trn.Amount as varchar) as StrAmount  FROM DepositHistory trn INNER JOIN WalletTypeMasters wt ON wt.WalletTypeName=trn.SMSCode INNER JOIN ServiceMaster   s ON s.SMSCode=trn.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id INNER JOIN BizUser u ON u.Id= trn.UserId inner join WalletAuthorizeUserMaster wu on wu.UserID=trn.UserId inner join Organizationmaster o on o.id=wu.OrgID  WHERE (trn.Status = 0) AND  (trn.SMSCode={1})  AND (trn.UserId={2} or {2}=0) and (trn.Address={3} or {3}='') and  (trn.TrnID={4} or {4}='') and  (wu.OrgId={0} or {0}=0)", (OrgId == null ? 0 : OrgId), Coin, (UserId == null ? 0 : UserId), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID)).ToList();
                TotalCount = trns.Count();
                #region oldcode
                //if (FromDate == null && ToDate == null)
                //{
                //    #region OldCode

                //    //    trns = (from trn in _dbContext.DepositHistory
                //    //            join wt in _dbContext.WalletTypeMasters
                //    //           on trn.SMSCode equals wt.WalletTypeName
                //    //            join u in _dbContext.Users
                //    //            on trn.UserId equals u.Id
                //    //            where trn.Status == Status && /*trn.Confirmations < 3 &&*/ (Coin == null || (trn.SMSCode == Coin && Coin != null))
                //    //             && (trn.CreatedDate == null || (trn.CreatedDate >= FromDate && trn.CreatedDate != null)) && (trn.CreatedDate == null || (trn.CreatedDate <= ToDate && trn.CreatedDate != null))
                //    //            select new TransfersRes
                //    //            {
                //    //                AutoNo = trn.Id,
                //    //                TrnID = trn.TrnID,
                //    //                WalletType = trn.SMSCode,
                //    //                Confirmations = trn.Confirmations,
                //    //                Amount = trn.Amount,
                //    //                Address = trn.Address,
                //    //                ConfirmationCount = wt.ConfirmationCount,
                //    //                ConfirmedTime = trn.ConfirmedTime,
                //    //                User = u.UserName
                //    //            }).ToList();
                //    //trns = _dbContext.TransfersRes.FromSql(@"SELECT  ROW_NUMBER() OVER (ORDER BY trn.Id ) AS AutoNo,trn.TrnID,trn.SMSCode AS WalletType,trn.Confirmations,trn.Amount,trn.Address,wt.ConfirmationCount,trn.ConfirmedTime,u.UserName AS 'User' FROM DepositHistory trn INNER JOIN WalletTypeMasters wt ON wt.WalletTypeName=trn.SMSCode INNER JOIN ServiceMaster   s ON s.SMSCode=trn.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id INNER JOIN BizUser u ON u.Id= trn.UserId  WHERE (trn.Status = {0} 0r {0} = 99) AND  ({1} ='' or trn.SMSCode={1})", Status, Coin).ToList();

                //    //fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                //    //string tdate = ToDate.ToString();
                //    //tdate = ToDate.ToString() + " 23:59:59";
                //    //ToDate = DateTime.ParseExact(tdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                //    #endregion

                //    trns = _dbContext.TransfersRes.FromSql(@"SELECT  o.Id as OrgId,o.OrganizationName,ROW_NUMBER() OVER (ORDER BY trn.Id ) AS AutoNo,trn.TrnID,trn.SMSCode AS WalletType,  JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',trn.Confirmations,trn.Amount,trn.Address,wt.ConfirmationCount,trn.ConfirmedTime,u.UserName AS 'UserName',ISNULL(u.Email,'') as Email FROM DepositHistory trn INNER JOIN WalletTypeMasters wt ON wt.WalletTypeName=trn.SMSCode INNER JOIN ServiceMaster   s ON s.SMSCode=trn.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id INNER JOIN BizUser u ON u.Id= trn.UserId inner join WalletAuthorizeUserMaster wu on wu.UserID=trn.UserId inner join Organizationmaster o on o.id=wu.OrgID  WHERE (trn.Status = 6) AND  (trn.SMSCode={1})  AND (trn.UserId={2} or {2}=0) and (trn.Address={3} or {3}='') and  (trn.TrnID={4} or {4}='') and  (wu.OrgId={5} or {5}=0)", Status, Coin, (UserId == null ? 0 : UserId), (Address == null?"": Address), (TrnID==null?"": TrnID), (OrgId==null?0: OrgId)).ToList();
                //    TotalCount = trns.Count();
                //}
                //else
                //{
                //    #region OldCode

                //    //trns = (from trn in _dbContext.DepositHistory
                //    //        join wt in _dbContext.WalletTypeMasters
                //    //       on trn.SMSCode equals wt.WalletTypeName
                //    //        join u in _dbContext.Users
                //    //        on trn.UserId equals u.Id
                //    //        where trn.Status == Status /*&& trn.Confirmations < 3*/ && (Coin == null || (trn.SMSCode == Coin && Coin != null))
                //    //        select new TransfersRes
                //    //        {
                //    //            AutoNo = trn.Id,
                //    //            TrnID = trn.TrnID,
                //    //            WalletType = trn.SMSCode,
                //    //            Confirmations = trn.Confirmations,
                //    //            Amount = trn.Amount,
                //    //            Address = trn.Address,
                //    //            ConfirmationCount = wt.ConfirmationCount,
                //    //            ConfirmedTime = trn.ConfirmedTime,
                //    //            User = u.UserName
                //    //        }).ToList();
                //    #endregion
                //    trns = _dbContext.TransfersRes.FromSql(@"SELECT  ROW_NUMBER() OVER (ORDER BY trn.Id ) AS AutoNo,trn.TrnID,trn.SMSCode AS WalletType,  JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',trn.Confirmations,trn.Amount,trn.Address,wt.ConfirmationCount,trn.ConfirmedTime,u.UserName AS 'UserName',ISNULL(u.Email,'') as Email FROM DepositHistory trn INNER JOIN WalletTypeMasters wt ON wt.WalletTypeName=trn.SMSCode INNER JOIN ServiceMaster   s ON s.SMSCode=trn.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id INNER JOIN BizUser u ON u.Id= trn.UserId inner join WalletAuthorizeUserMaster wu on wu.UserID=trn.UserId   WHERE (trn.Status = {0}) AND  (trn.SMSCode={1}) and (trn.CreatedDate >= {2} ) AND (trn.CreatedDate <= {3} ) AND (trn.UserId={4} or {4}=0) and (trn.Address={5} or {5}='') and  (trn.TrnID={6} or {6}='') and  (wu.OrgId={7} or {7}=0)", Status, Coin, FromDate, ToDate, (UserId == null ? 0 : UserId), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID), (OrgId == null ? 0 : OrgId)).ToList();
                //    TotalCount = trns.Count();
                //}
                #endregion
                if (Page > 0)
                {
                    int skip = PageSize * (Page - 1);
                    trns = trns.Skip(skip).Take(PageSize).ToList();
                }
                #region OldCode

                //var test = trns.Select((r, i) => new TransfersRes
                //{
                //    AutoNo = i + 1,
                //    TrnID = r.TrnID,
                //    WalletType = r.WalletType,
                //    Confirmations = r.Confirmations,
                //    Amount = r.Amount,
                //    Address = r.Address,
                //    ConfirmationCount = r.ConfirmationCount,
                //    ConfirmedTime = r.ConfirmedTime,
                //    User = r.User
                //}).ToList();  
                #endregion
                return trns;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //RUSHABH 04-12-2018
        public List<TransfersRes> TransferOutHistory(string CoinName, int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId, ref int TotalCount)
        {
            try
            {
                List<TransfersRes> History = new List<TransfersRes>();
                string str = "SELECT o.Id as OrgId,o.OrganizationName,ROW_NUMBER() OVER (ORDER BY WH.ID) AS 'AutoNo',WH.TrnID,WH.SMSCode AS 'WalletType', WH.Confirmations,JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',WH.confirmedTime,WH.Amount,cast(WH.Amount as varchar) as StrAmount,WH.Address,WT.ConfirmationCount,U.UserName AS 'UserName',U.id as UserId,ISNULL(u.Email,'') as Email FROM WithdrawHistory WH INNER JOIN WalletTypeMasters WT ON  WT.WalletTypeName=WH.SMSCode  INNER JOIN BizUser U ON  U.Id=WH.UserId inner join WalletAuthorizeUserMaster wu on wu.UserID=WH.UserId INNER JOIN ServiceMaster   s ON s.SMSCode=WH.SMSCode INNER JOIN ServiceDetail sd ON sd.ServiceId=s.Id inner join Organizationmaster o on o.id=wu.OrgID WHERE WH.SMSCode = {0} AND WH.Status = 6 AND (WH.UserId={2} or {2}=0) and (WH.Address={3} or {3}='') and  (WH.TrnID={4} or {4}='') and (wu.OrgId={1} or {1}=0) ";

                History = _dbContext.TransfersRes.FromSql(str, CoinName, (OrgId == null ? 0 : OrgId), (UserId == null ? 0 : UserId), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID)).ToList();
                TotalCount = History.Count();
                #region oldcode
                //if (FromDate != null && ToDate != null)
                //{
                //    //DateTime toDate = ToDate;
                //    //string tdate = ToDate.ToString();
                //    //tdate = ToDate.ToString();
                //    //tdate = tdate.Replace("00:00:00", "23:59:59");
                //    //ToDate = DateTime.ParseExact(tdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                //    str += "AND (WH.CreatedDate between {6} and {7})";
                //    History = _dbContext.TransfersRes.FromSql(str, CoinName, Status, (UserId == null ? 0 : UserId), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID), (OrgId == null ? 0 : OrgId), FromDate, ToDate).ToList();
                //    TotalCount = History.Count();
                //    #region OLD CODE
                //    //History = (from Wh in _dbContext.WithdrawHistory
                //    //           join WT in _dbContext.WalletTypeMasters
                //    //           on Wh.SMSCode equals WT.WalletTypeName
                //    //           join u in _dbContext.Users
                //    //           on Wh.UserId equals u.Id
                //    //           where Wh.Status == Status && Wh.Confirmations < 3 && (CoinName == null || (Wh.SMSCode == CoinName && CoinName != null))
                //    //           && (Wh.CreatedDate == null || (Wh.CreatedDate >= FromDate && Wh.CreatedDate != null)) && (Wh.CreatedDate == null || (Wh.CreatedDate <= ToDate && Wh.CreatedDate != null))
                //    //           select new TransfersRes
                //    //           {
                //    //               AutoNo = Wh.Id,
                //    //               TrnID = Wh.TrnID,
                //    //               WalletType = Wh.SMSCode,
                //    //               Confirmations = Wh.Confirmations,
                //    //               Amount = Wh.Amount,
                //    //               Address = Wh.Address,
                //    //               ConfirmationCount = WT.ConfirmationCount,
                //    //               ConfirmedTime = Wh.confirmedTime,
                //    //               User = u.UserName
                //    //           }).ToList();
                //    #endregion
                //}
                //else
                //{
                //    History = _dbContext.TransfersRes.FromSql(str, CoinName, Status, (UserId == null ? 0 : UserId), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID), (OrgId == null ? 0 : OrgId)).ToList();
                //    TotalCount = History.Count();
                //    #region OLD COD
                //    //History = (from Wh in _dbContext.DepositHistory
                //    //           join WT in _dbContext.WalletTypeMasters
                //    //           on Wh.SMSCode equals WT.WalletTypeName
                //    //           join u in _dbContext.Users
                //    //           on Wh.UserId equals u.Id
                //    //           where Wh.Status == Status && Wh.Confirmations < 3 && (CoinName == null || (Wh.SMSCode == CoinName && CoinName != null))
                //    //           select new TransfersRes
                //    //           {
                //    //               AutoNo = Wh.Id,
                //    //               TrnID = Wh.TrnID,
                //    //               WalletType = Wh.SMSCode,
                //    //               Confirmations = Wh.Confirmations,
                //    //               Amount = Wh.Amount,
                //    //               Address = Wh.Address,
                //    //               ConfirmationCount = WT.ConfirmationCount,
                //    //               ConfirmedTime = Wh.ConfirmedTime,
                //    //               User = u.UserName
                //    //           }).ToList();
                //    #endregion
                //}
                #endregion
                if (Page > 0)
                {
                    int skip = PageSize * (Page - 1);
                    History = History.Skip(skip).Take(PageSize).ToList();
                }
                #region OLD COD
                //var dump = History.Select((rec, i) => new TransfersRes
                //{
                //    AutoNo = i + 1,
                //    TrnID = rec.TrnID,
                //    WalletType = rec.WalletType,
                //    Confirmations = rec.Confirmations,
                //    Amount = rec.Amount,
                //    Address = rec.Address,
                //    ConfirmationCount = rec.ConfirmationCount,
                //    ConfirmedTime = rec.ConfirmedTime,
                //    User = rec.User
                //}).ToList();
                #endregion
                return History;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-11-03
        public List<TokenConvertHistoryRes> ConvertFundHistory(long Userid, DateTime FromDate, DateTime ToDate, string Coin)
        {
            try
            {
                var h = (from c in _dbContext.ConvertFundHistory
                         join w in _dbContext.WalletMasters
                         on c.FromWalletId equals w.Id
                         join wt in _dbContext.WalletTypeMasters
                         on w.WalletTypeID equals wt.Id
                         where w.UserID == Userid && (Coin == null || (wt.WalletTypeName == Coin && Coin != null)) && c.TrnDate >= FromDate && c.TrnDate <= ToDate && c.Status == Convert.ToInt16(ServiceStatus.Active)
                         select new TokenConvertHistoryRes
                         {
                             CoinName = wt.WalletTypeName,
                             Amount = c.SourcePrice,
                             Price = c.Price,
                             Total = c.DestinationPrice,
                             Date = c.TrnDate
                         }).ToList();
                return h;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 2018-10-15
        //public bool CheckUserBalanceV1(long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance)
        //{
        //    try
        //    {
        //        // select sum(CrAmt) from transactionaccounts where WalletID = 12
        //        decimal wObjBal;
        //        WalletMaster walletObject = (from w in _dbContext.WalletMasters
        //                            where w.Id == WalletId
        //                            select w).First();
        //        IQueryable<SumAmount> Result1 = _dbContext.SumAmounts.FromSql(@"SELECT (SUM(CrAmt)  - SUM(DrAmt)) AS 'DifferenceAmount'  FROM TransactionAccounts WHERE WalletID = {0} AND IsSettled = 1 AND Type = {1}", WalletId, enBalance);
        //        #region old code
        //        //var crsum = _dbContext.SumAmounts.FromSql(@"select sum(CrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
        //        //var drsum = _dbContext.SumAmounts.FromSql(@"select sum(DrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
        //        //decimal creditamt, debitamt;
        //        //creditamt = crsum.FirstOrDefault();
        //        //decimal total = Convert.ToDecimal(crsum.FirstOrDefault()) - Convert.ToDecimal(drsum.FirstOrDefault());
        //        #endregion
        //        var temp = Result1.FirstOrDefault();
        //        //if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
        //        //{
        //        //    return true;
        //        //}

        //        if (enBalance == enBalanceType.AvailableBalance)
        //        {
        //            wObjBal = walletObject.Balance;
        //        }
        //        else if (enBalance == enBalanceType.OutBoundBalance)
        //        {
        //            wObjBal = walletObject.OutBoundBalance;
        //        }
        //        else if (enBalance == enBalanceType.InBoundBalance)
        //        {
        //            wObjBal = walletObject.InBoundBalance;
        //        }
        //        else
        //        {
        //            return false;
        //        }
        //        if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
        //        {
        //            return true;
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + temp.DifferenceAmount.ToString() + ",dbbalance=" + wObjBal.ToString());
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        public async Task<bool> CheckTrnIDDrForHoldAsync(CommonClassCrDr arryTrnID)
        {
            try
            {
                //bool i = false;
                //decimal totalAmtDrTranx;
                //for (int t = 0; t <= arryTrnID.Length - 1; t++)
                //{
                var response = (from u in _dbContext.WalletTransactionQueues
                                where u.TrnRefNo == arryTrnID.debitObject.TrnRefNo && (u.Status == enTransactionStatus.Initialize || u.Status == enTransactionStatus.Hold)
                                && u.TrnType == Core.Enums.enWalletTranxOrderType.Debit
                                && u.Amount - u.SettedAmt >= arryTrnID.Amount
                                select new TempEntity { TrnNo = u.TrnNo, SetteledAmount = u.SettedAmt, Amount = u.Amount }).ToList();
                if (response.Count != 1)
                {
                    //i = false;
                    return false;
                }
                arryTrnID.debitObject.WTQTrnNo = response[0].TrnNo;

                var deliveredAmt = (from p in _dbContext.WalletTransactionOrders
                                    where p.DTrnNo == arryTrnID.debitObject.WTQTrnNo && p.Status != enTransactionStatus.SystemFail
                                    select p.Amount).Sum();

                if (!(response[0].Amount - deliveredAmt - arryTrnID.Amount >= 0))
                {
                    //i = false;
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckTrnIDDrForHoldAsync", this.GetType().Name, ex);
                throw ex;
            }
        }
        #region OldCode

        //public bool WalletCreditDebitwithTQ(WalletLedger wl1, TransactionAccount ta1, WalletLedger w2,TransactionAccount t2 , WalletMaster cr,WalletMaster dr, WalletTransactionQueue wtq, CreditWalletDrArryTrnID arryTrnID, decimal TotalAmount)
        //{
        //    try
        //    { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018

        //        WalletMaster walletMasterReloaded = new WalletMaster();
        //        _dbContext.Database.BeginTransaction();
        //        //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
        //        //wl1.TrnNo = wtq.TrnNo;
        //        var arrayObj = (from p in _dbContext.WalletTransactionOrders
        //                        join q in arryTrnID on p.OrderID equals q.OrderID
        //                        select p).ToList();
        //        arrayObj.ForEach(e => e.Status = enTransactionStatus.Success);
        //        arrayObj.ForEach(e => e.StatusMsg = "Success");
        //        arrayObj.ForEach(e => e.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate



        //        // update debit transaction(current tranx against which tranx) status if it is fully settled
        //        var arrayObjTQ = (from p in _dbContext.WalletTransactionQueues
        //                          join q in arryTrnID on p.TrnNo equals q.DrTQTrnNo
        //                          select new { p, q }).ToList();
        //        arrayObjTQ.ForEach(e => e.p.SettedAmt = e.p.SettedAmt + e.q.Amount);
        //        arrayObjTQ.ForEach(e => e.p.UpdatedDate = UTC_To_IST());
        //        arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.Status = enTransactionStatus.Success);
        //        arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.StatusMsg = "Success"); // ntrivedi update statusmsg
        //        arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate


        //        walletMasterReloaded = GetById(wm2.Id);  // ntrivedi to fetch fresh balance


        //        walletMasterReloaded.CreditBalance(TotalAmount); // credit balance here to update fresh balance


        //        _dbContext.Set<WalletLedger>().Add(wl1);
        //        _dbContext.Set<TransactionAccount>().Add(ta1);

        //        _dbContext.Entry(walletMasterReloaded).State = EntityState.Modified;

        //        _dbContext.Entry(wtq).State = EntityState.Modified;
        //        _dbContext.SaveChanges();
        //        _dbContext.Database.CommitTransaction();

        //        _dbContext.Entry(walletMasterReloaded).Reload();

        //        return true;
        //    }

        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        _dbContext.Database.RollbackTransaction();
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        //_dbContext.Entry(wm2).Reload();
        //        throw ex;
        //    }
        //}

        //public async Task<long> GetTypeMappingObjAsync(long userid)
        //{
        //    try
        //    {
        //        Task<BizUserTypeMapping> UserTypeObj1 = _dbContext.BizUserTypeMapping.Where(u => u.UserID == userid).FirstOrDefaultAsync();
        //        BizUserTypeMapping UserTypeObj = await UserTypeObj1;
        //        if (UserTypeObj == null)
        //        {
        //            return -1; //ntrivedi usertype can be 0
        //        }
        //        else
        //        {
        //            return UserTypeObj.UserType;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        #endregion
        public async Task<bool> WalletCreditDebitwithTQTest(MemberShadowBalance FirstDebitShadowWallet, MemberShadowBalance SecondDebitShadowWallet, WalletTransactionQueue firstDrTQ, WalletTransactionQueue secondDrTQ, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletLedger wl1, WalletLedger wl2, WalletLedger wl3, WalletLedger wl4, TransactionAccount ta1, TransactionAccount ta2, TransactionAccount ta3, TransactionAccount ta4)
        {
            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018
                WalletMaster firstCr, firstDr, secondCr, secondDr;

                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;

                _dbContext.Database.BeginTransaction();
                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "begin transaction"));

                var arrayObj = (from p in _dbContext.WalletTransactionOrders
                                where p.OrderID == firstCurrObj.creditObject.OrderID || p.OrderID == secondCurrObj.creditObject.OrderID
                                select p).ToList();
                arrayObj.ForEach(e => e.Status = enTransactionStatus.Success);
                arrayObj.ForEach(e => e.StatusMsg = "Success");
                arrayObj.ForEach(e => e.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 1"));


                var arrayObjCrTQ = (from p in _dbContext.WalletTransactionQueues
                                    where p.TrnNo == firstCurrObj.creditObject.WTQTrnNo || p.TrnNo == secondCurrObj.creditObject.WTQTrnNo
                                    select p).ToList();
                arrayObjCrTQ.ForEach(e => e.Status = enTransactionStatus.Success);
                arrayObjCrTQ.ForEach(e => e.StatusMsg = "Success");
                arrayObjCrTQ.ForEach(e => e.UpdatedDate = UTC_To_IST());

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 2"));


                FirstDebitShadowWallet.ShadowAmount = FirstDebitShadowWallet.ShadowAmount - firstCurrObj.Amount;
                SecondDebitShadowWallet.ShadowAmount = SecondDebitShadowWallet.ShadowAmount - secondCurrObj.Amount;
                _dbContext.Entry(firstDrTQ).State = EntityState.Modified;
                _dbContext.Entry(secondDrTQ).State = EntityState.Modified;
                _dbContext.Entry(FirstDebitShadowWallet).State = EntityState.Modified;
                _dbContext.Entry(SecondDebitShadowWallet).State = EntityState.Modified;
                //walletMasterReloaded = GetById(wm2.Id);  // ntrivedi to fetch fresh balance

                //// update debit transaction(current tranx against which tranx) status if it is fully settled
                //var arrayObjTQ = (from p in _dbContext.WalletTransactionQueues
                //                  join q in arryTrnID on p.TrnNo equals q.DrTQTrnNo
                //                  select new { p, q }).ToList();
                //arrayObjTQ.ForEach(e => e.p.SettedAmt = e.p.SettedAmt + e.q.Amount);
                //arrayObjTQ.ForEach(e => e.p.UpdatedDate = UTC_To_IST());
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.Status = enTransactionStatus.Success);
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.StatusMsg = "Success"); // ntrivedi update statusmsg
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 3"));


                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<WalletLedger>().Add(wl2);
                _dbContext.Set<WalletLedger>().Add(wl3);
                _dbContext.Set<WalletLedger>().Add(wl4);

                _dbContext.Set<TransactionAccount>().Add(ta1);
                _dbContext.Set<TransactionAccount>().Add(ta2);
                _dbContext.Set<TransactionAccount>().Add(ta3);
                _dbContext.Set<TransactionAccount>().Add(ta4);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 4"));

                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> firstCrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == firstCurrObj.creditObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> firstDrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == firstCurrObj.debitObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> secondCrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == secondCurrObj.creditObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> secondDrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == secondCurrObj.debitObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                firstCr = await firstCrTask;
                firstCr.CreditBalance(firstCurrObj.Amount);
                firstDr = await firstDrTask;
                firstDr.DebitBalance(firstCurrObj.Amount);
                secondCr = await secondCrTask;
                secondCr.CreditBalance(secondCurrObj.Amount);
                secondDr = await secondDrTask;
                secondDr.DebitBalance(secondCurrObj.Amount);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 5"));

                _dbContext.Entry(firstCr).State = EntityState.Modified;
                _dbContext.Entry(firstDr).State = EntityState.Modified;
                _dbContext.Entry(secondCr).State = EntityState.Modified;
                _dbContext.Entry(secondDr).State = EntityState.Modified;
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 6"));

                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 7"));

                _dbContext.Entry(wl1).Reload();
                _dbContext.Entry(wl2).Reload();
                _dbContext.Entry(wl3).Reload();
                _dbContext.Entry(wl4).Reload();
                _dbContext.Entry(firstDrTQ).Reload();
                _dbContext.Entry(secondDrTQ).Reload();
                return true;
            }

            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("WalletCreditDebitwithTQTest", this.GetType().Name, ex));
                _dbContext.Database.RollbackTransaction();
                Task.Run(() => HelperForLog.WriteErrorLog("WalletCreditDebitwithTQTest", this.GetType().Name, ex));
                _dbContext.Entry(wl1).Reload();
                _dbContext.Entry(wl2).Reload();
                _dbContext.Entry(wl3).Reload();
                _dbContext.Entry(wl4).Reload();
                _dbContext.Entry(firstDrTQ).Reload();
                _dbContext.Entry(secondDrTQ).Reload();
                throw ex;
            }
        }
        public async Task<WalletTransactionOrder> AddIntoWalletTransactionOrderAsync(WalletTransactionOrder wo, byte AddorUpdate)//1=add,2=update)
        {
            try
            {
                if (AddorUpdate == 1)
                {
                    await _dbContext.WalletTransactionOrders.AddAsync(wo);
                }
                else
                {
                    _dbContext.Entry(wo).State = EntityState.Modified;
                }
                await _dbContext.SaveChangesAsync();
                return wo;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("AddIntoWalletTransactionOrderAsync", this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<bool> WalletCreditDebitwithTQTestFinal(WalletTransactionQueue FirstCurrWT, WalletTransactionQueue SecondCurrWT, WalletTransactionOrder SecondCurrWO, WalletTransactionOrder firstCurrWO, MemberShadowBalance FirstDebitShadowWallet, MemberShadowBalance SecondDebitShadowWallet, WalletTransactionQueue firstDrTQ, WalletTransactionQueue secondDrTQ, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletLedger wl1, WalletLedger wl2, WalletLedger wl3, WalletLedger wl4, TransactionAccount ta1, TransactionAccount ta2, TransactionAccount ta3, TransactionAccount ta4)
        {
            WalletMaster firstCr, firstDr, secondCr, secondDr;

            firstCr = new WalletMaster();
            firstDr = new WalletMaster();
            secondCr = new WalletMaster();
            secondDr = new WalletMaster();

            try
            { // returns the address for ETH which are previously generated but not assinged to any wallet ntrivedi 26-09-2018

                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;

                _dbContext.Database.BeginTransaction();
                //_dbContext.Set<WalletTransactionQueue>().Add(wtq);
                //wl1.TrnNo = wtq.TrnNo;
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "begin transaction"));

                //var arrayObj = (from p in _dbContext.WalletTransactionOrders
                //                where p.OrderID == firstCurrObj.creditObject.OrderID || p.OrderID == secondCurrObj.creditObject.OrderID
                //                select p).ToList();
                //arrayObj.ForEach(e => e.Status = enTransactionStatus.Success);
                //arrayObj.ForEach(e => e.StatusMsg = "Success");
                //arrayObj.ForEach(e => e.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 1"));


                //var arrayObjCrTQ = (from p in _dbContext.WalletTransactionQueues
                //                    where p.TrnNo == firstCurrObj.creditObject.WTQTrnNo || p.TrnNo == secondCurrObj.creditObject.WTQTrnNo
                //                    select p).ToList();
                //arrayObjCrTQ.ForEach(e => e.Status = enTransactionStatus.Success);
                //arrayObjCrTQ.ForEach(e => e.StatusMsg = "Success");
                //arrayObjCrTQ.ForEach(e => e.UpdatedDate = UTC_To_IST());

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 2"));


                FirstDebitShadowWallet.ShadowAmount = FirstDebitShadowWallet.ShadowAmount - firstCurrObj.Amount;
                SecondDebitShadowWallet.ShadowAmount = SecondDebitShadowWallet.ShadowAmount - secondCurrObj.Amount;
                _dbContext.Entry(firstDrTQ).State = EntityState.Modified;
                _dbContext.Entry(secondDrTQ).State = EntityState.Modified;
                _dbContext.Entry(FirstDebitShadowWallet).State = EntityState.Modified;
                _dbContext.Entry(SecondDebitShadowWallet).State = EntityState.Modified;
                _dbContext.Entry(FirstCurrWT).State = EntityState.Modified;
                _dbContext.Entry(SecondCurrWT).State = EntityState.Modified;
                _dbContext.Entry(SecondCurrWO).State = EntityState.Modified;
                _dbContext.Entry(firstCurrWO).State = EntityState.Modified;
                //walletMasterReloaded = GetById(wm2.Id);  // ntrivedi to fetch fresh balance

                //// update debit transaction(current tranx against which tranx) status if it is fully settled
                //var arrayObjTQ = (from p in _dbContext.WalletTransactionQueues
                //                  join q in arryTrnID on p.TrnNo equals q.DrTQTrnNo
                //                  select new { p, q }).ToList();
                //arrayObjTQ.ForEach(e => e.p.SettedAmt = e.p.SettedAmt + e.q.Amount);
                //arrayObjTQ.ForEach(e => e.p.UpdatedDate = UTC_To_IST());
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.Status = enTransactionStatus.Success);
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.StatusMsg = "Success"); // ntrivedi update statusmsg
                //arrayObjTQ.Where(d => d.p.SettedAmt >= d.p.Amount).ToList().ForEach(e => e.p.UpdatedDate = UTC_To_IST()); // ntrivedi update updateddate

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 3"));


                _dbContext.Set<WalletLedger>().Add(wl1);
                _dbContext.Set<WalletLedger>().Add(wl2);
                _dbContext.Set<WalletLedger>().Add(wl3);
                _dbContext.Set<WalletLedger>().Add(wl4);

                _dbContext.Set<TransactionAccount>().Add(ta1);
                _dbContext.Set<TransactionAccount>().Add(ta2);
                _dbContext.Set<TransactionAccount>().Add(ta3);
                _dbContext.Set<TransactionAccount>().Add(ta4);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 4"));

                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> firstCrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == firstCurrObj.creditObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> firstDrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == firstCurrObj.debitObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> secondCrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == secondCurrObj.creditObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                Task<WalletMaster> secondDrTask = _dbContext.WalletMasters.SingleAsync(w => w.Id == secondCurrObj.debitObject.WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                firstCr = await firstCrTask;
                firstCr.CreditBalance(firstCurrObj.Amount);
                firstDr = await firstDrTask;
                firstDr.DebitBalance(firstCurrObj.Amount);
                secondCr = await secondCrTask;
                secondCr.CreditBalance(secondCurrObj.Amount);
                secondDr = await secondDrTask;
                secondDr.DebitBalance(secondCurrObj.Amount);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 5"));

                _dbContext.Entry(firstCr).State = EntityState.Modified;
                _dbContext.Entry(firstDr).State = EntityState.Modified;
                _dbContext.Entry(secondCr).State = EntityState.Modified;
                _dbContext.Entry(secondDr).State = EntityState.Modified;
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 6"));

                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("WalletCreditDebitwithTQTest", "WalletRepository", "step 7"));

                //_dbContext.Entry(wl1).Reload();
                //_dbContext.Entry(wl2).Reload();
                //_dbContext.Entry(wl3).Reload();
                //_dbContext.Entry(wl4).Reload();
                //_dbContext.Entry(firstDrTQ).Reload();
                //_dbContext.Entry(secondDrTQ).Reload();
                return true;
            }

            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("AddIntoWalletTransactionOrderAsync", this.GetType().Name, ex));
                _dbContext.Database.RollbackTransaction();
                Task.Run(() => HelperForLog.WriteErrorLog("AddIntoWalletTransactionOrderAsync", this.GetType().Name, ex));
                if (firstCr.Id > 0)
                    _dbContext.Entry(firstCr).Reload();
                if (firstDr.Id > 0)
                    _dbContext.Entry(firstDr).Reload();
                if (secondCr.Id > 0)
                    _dbContext.Entry(secondCr).Reload();
                if (secondDr.Id > 0)
                    _dbContext.Entry(secondDr).Reload();
                _dbContext.Entry(firstDrTQ).Reload();
                _dbContext.Entry(secondDrTQ).Reload();
                _dbContext.Entry(FirstDebitShadowWallet).Reload();
                _dbContext.Entry(SecondDebitShadowWallet).Reload();
                _dbContext.Entry(FirstCurrWT).Reload();
                _dbContext.Entry(SecondCurrWT).Reload();
                _dbContext.Entry(SecondCurrWO).Reload();
                _dbContext.Entry(firstCurrWO).Reload();
                Task.Run(() => HelperForLog.WriteErrorLog("AddIntoWalletTransactionOrderAsync", this.GetType().Name, ex));
                throw ex;
            }
        }
        #region OldCode

        //public BizResponseClass Callsp_CrDrWallet(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType,long firstCurrWalletType,long secondCurrWalletType)
        //{
        //    try
        //    {
        //        BizResponseClass bizResponseClass = new BizResponseClass();
        //        SqlParameter[] param1 = new SqlParameter[]{
        //        new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
        //        new SqlParameter("@serviceType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt32(serviceType)),
        //        new SqlParameter("@firstCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.Coin),
        //        new SqlParameter("@secondCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.Coin),
        //        new SqlParameter("@firstCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrWalletType) ,
        //        new SqlParameter("@secondCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,secondCurrWalletType) ,
        //        new SqlParameter("@firstCurrAmount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 18, 8, String.Empty, DataRowVersion.Default, firstCurrObj.Amount) ,
        //        new SqlParameter("@secondCurrAmount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 18, 8, String.Empty, DataRowVersion.Default, secondCurrObj.Amount) ,
        //        new SqlParameter("@firstCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WTQTrnNo) ,
        //        new SqlParameter("@secondCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WTQTrnNo) ,
        //        new SqlParameter("@firstCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,firstCurrObj.creditObject.TrnRefNo) ,
        //        new SqlParameter("@firstCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.TrnRefNo) ,
        //        new SqlParameter("@secondCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.TrnRefNo) ,
        //        new SqlParameter("@secondCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.TrnRefNo) ,
        //        new SqlParameter("@firstCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.WalletId) ,
        //        new SqlParameter("@firstCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WalletId) ,
        //        new SqlParameter("@secondCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.WalletId) ,
        //        new SqlParameter("@secondCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WalletId) ,
        //        new SqlParameter("@firstCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.UserID) ,
        //        new SqlParameter("@firstCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.UserID) ,
        //        new SqlParameter("@secondCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.UserID) ,
        //        new SqlParameter("@secondCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.UserID) ,
        //        new SqlParameter("@firstCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.isFullSettled) ,
        //        new SqlParameter("@firstCurrDrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.isFullSettled) ,
        //        new SqlParameter("@secondCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.isFullSettled) ,
        //        new SqlParameter("@secondCurrDrisFullSettledD",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.isFullSettled) ,
        //        new SqlParameter("@firstCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.trnType) ,
        //        new SqlParameter("@firstCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.trnType) ,
        //        new SqlParameter("@secondCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.trnType) ,
        //        new SqlParameter("@secondCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.trnType) ,
        //        new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
        //        new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
        //        new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode) ,
        //    };
        //        var res = _dbContext.Database.ExecuteSqlCommand("sp_CrDrWallet @timeStamp ,@serviceType ,@firstCurrCoin ,@secondCurrCoin ,@firstCurrWalletType ,@secondCurrWalletType ,@firstCurrAmount ,@secondCurrAmount ,@firstCurrDrTQTrnno  ,@secondCurrDrTQTrnno  ,@firstCurrCrTrnRefNo ,@firstCurrDrTrnRefNo ,@secondCurrCrTrnRefNo ,@secondCurrDrTrnRefNo ,@firstCurrCrWalletID ,@firstCurrDrWalletID ,@secondCurrCrWalletID ,@secondCurrDrWalletID ,@firstCurrCrUserID ,@firstCurrDrUserID, @secondCurrCrUserID ,@secondCurrDrUserID ,@firstCurrCrisFullSettled ,@firstCurrDrisFullSettled ,@secondCurrCrisFullSettled ,@secondCurrDrisFullSettledD ,@firstCurrCrTrnType ,@firstCurrDrTrnType ,@secondCurrCrTrnType ,@secondCurrDrTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
        //        bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[30].Value);
        //        bizResponseClass.ReturnMsg = @param1[31].Value.ToString();
        //        bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[32].Value);
        //        return bizResponseClass;
        //        //return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }            
        //}
        #endregion
        //public void ReloadEntity(WalletMaster wm1, WalletMaster wm2, WalletMaster wm3, WalletMaster wm4)
        //{
        //    try
        //    {
        //        _dbContext.Entry(wm1).Reload();
        //        _dbContext.Entry(wm2).Reload();
        //        _dbContext.Entry(wm3).Reload();
        //        _dbContext.Entry(wm4).Reload();

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        public void ReloadEntity(WalletMaster wm1, WalletMaster wm2, WalletMaster wm3, WalletMaster wm4)
        {
            try
            {
                try
                {
                    _dbContext.Entry(wm1).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "w1", this.GetType().Name, ex);
                }
                try
                {
                    _dbContext.Entry(wm2).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "w2", this.GetType().Name, ex);
                }
                try
                {
                    _dbContext.Entry(wm3).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "w3", this.GetType().Name, ex);
                }
                try
                {
                    _dbContext.Entry(wm4).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "w4", this.GetType().Name, ex);
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }

        public async Task<bool> CheckUserBalanceV1Async(long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                // select sum(CrAmt) from transactionaccounts where WalletID = 12
                decimal wObjBal;
                //2019-2-18 added condi for only used trading wallet
                var walletObjectTask = (from w in _dbContext.WalletMasters
                                        where w.Id == WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                        select w).FirstAsync();
                //IQueryable<WalletMaster> ResultBalWallet = _dbContext.WalletMaster.FromSql(@"SELECT (SUM(CrAmt)  - SUM(DrAmt)) AS 'DifferenceAmount'  FROM TransactionAccounts WHERE WalletID = {0} AND IsSettled = 1 AND Type = {1}", WalletId, enBalance);

                IQueryable<SumAmount> ResultBal = _dbContext.SumAmounts.FromSql(@"SELECT ISNULL((SUM(CrAmt)  - SUM(DrAmt)),0) AS 'DifferenceAmount'  FROM TransactionAccounts WHERE WalletID = {0} AND IsSettled = 1 AND Type = {1}", WalletId, enBalance);

                IQueryable<SumAmount> Result1 = _dbContext.SumAmounts.FromSql(@"SELECT ISNULL((SUM(CrAmt)  - SUM(DrAmt)),0) AS 'DifferenceAmount'  FROM TransactionAccounts WHERE WalletID = {0} AND IsSettled = 1 AND Type = {1}", WalletId, enBalance);
                #region old code
                //var crsum = _dbContext.SumAmounts.FromSql(@"select sum(CrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
                //var drsum = _dbContext.SumAmounts.FromSql(@"select sum(DrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
                //decimal creditamt, debitamt;
                //creditamt = crsum.FirstOrDefault();
                //decimal total = Convert.ToDecimal(crsum.FirstOrDefault()) - Convert.ToDecimal(drsum.FirstOrDefault());
                #endregion
                var temp = Result1.FirstOrDefault();
                //if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
                //{
                //    return true;
                //}

                WalletMaster walletObject = await walletObjectTask;
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObject.WalletUsageType != Convert.ToInt16(enWalletUsageType))
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
                    return false;
                }
                if (enBalance == enBalanceType.AvailableBalance)
                {
                    wObjBal = walletObject.Balance;
                }
                else if (enBalance == enBalanceType.OutBoundBalance)
                {
                    wObjBal = walletObject.OutBoundBalance;
                }
                else if (enBalance == enBalanceType.InBoundBalance)
                {
                    wObjBal = walletObject.InBoundBalance;
                }
                else
                {
                    return false;
                }
                if (wObjBal < 0) //ntrivedi 04-01-2018
                {
                    return false;
                }
                if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
                {
                    return true;
                }
                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + temp.DifferenceAmount.ToString() + ",dbbalance=" + wObjBal.ToString());
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckUserBalanceV1Async", this.GetType().Name, ex);
                throw ex;
            }
        }
        public bool CheckUserBalanceV1(long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                // select sum(CrAmt) from transactionaccounts where WalletID = 12
                decimal wObjBal;

                //2019-2-18 added condi for only used trading wallet
                WalletMaster walletObject = (from w in _dbContext.WalletMasters
                                             where w.Id == WalletId && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                             select w).First();
                IQueryable<SumAmount> Result1 = _dbContext.SumAmounts.FromSql(@"SELECT ISNULL((SUM(CrAmt)  - SUM(DrAmt)),0) AS 'DifferenceAmount'  FROM TransactionAccounts WHERE WalletID = {0} AND IsSettled = 1 AND Type = {1}", WalletId, enBalance);
                #region old code
                //var crsum = _dbContext.SumAmounts.FromSql(@"select sum(CrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
                //var drsum = _dbContext.SumAmounts.FromSql(@"select sum(DrAmt) As 'DifferenceAmount' from transactionaccounts where WalletID = {0} ", WalletId);
                //decimal creditamt, debitamt;
                //creditamt = crsum.FirstOrDefault();
                //decimal total = Convert.ToDecimal(crsum.FirstOrDefault()) - Convert.ToDecimal(drsum.FirstOrDefault());
                #endregion
                var temp = Result1.FirstOrDefault();
                //if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
                //{
                //    return true;
                //}
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObject.WalletUsageType != Convert.ToInt16(enWalletUsageType))
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
                    return false;
                }
                if (enBalance == enBalanceType.AvailableBalance)
                {
                    wObjBal = walletObject.Balance;
                }
                else if (enBalance == enBalanceType.OutBoundBalance)
                {
                    wObjBal = walletObject.OutBoundBalance;
                }
                else if (enBalance == enBalanceType.InBoundBalance)
                {
                    wObjBal = walletObject.InBoundBalance;
                }
                else
                {
                    return false;
                }
                if (wObjBal < 0) //ntrivedi 04-01-2018
                {
                    return false;
                }
                if (temp.DifferenceAmount == wObjBal && temp.DifferenceAmount > 0)
                {
                    return true;
                }
                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + temp.DifferenceAmount.ToString() + ",dbbalance=" + wObjBal.ToString());
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<bool> CheckTrnIDDrForMarketAsync(CommonClassCrDr arryTrnID)
        {
            try
            {
                GetCount count;
                TQTrnAmt sumAmount;

                IQueryable<GetCount> Result1 = _dbContext.GetCount.FromSql(@"SELECT count(TrnNo)  as 'Count' FROM WalletTransactionQueues WHERE TrnRefNo = {0} and Status=4 and TrnType={1} and WalletDeductionType={2}", arryTrnID.debitObject.TrnRefNo, enWalletTranxOrderType.Debit, enWalletDeductionType.Market);
                IQueryable<TQTrnAmt> Result2 = _dbContext.TQTrnAmt.FromSql(@"SELECT Amount-SettedAmt as 'DifferenceAmount',TrnNo  FROM WalletTransactionQueues WHERE TrnRefNo = {0} and Status=4 and TrnType={1} and WalletDeductionType={2}", arryTrnID.debitObject.TrnRefNo, enWalletTranxOrderType.Debit, enWalletDeductionType.Market);
                count = Result1.First();
                sumAmount = Result2.First();
                if (count.Count != 1)
                {
                    return false;
                }
                if (sumAmount.DifferenceAmount < arryTrnID.Amount)
                {
                    arryTrnID.debitObject.differenceAmount = arryTrnID.Amount - sumAmount.DifferenceAmount;
                }
                arryTrnID.debitObject.WTQTrnNo = sumAmount.TrnNo;
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //public async Task<WalletLimitConfiguration> GetWalletLimit (int TranType, long WalletID)
        //{
        //    try
        //    {
        //        WalletLimitConfiguration obj = new WalletLimitConfiguration();
        //        IQueryable<WalletLimitConfiguration> Result = _dbContext.WLimitConfigObj.FromSql(@"SELECT * FROM WalletLimitConfiguration WHERE TrnType = {0} AND WalletId = {1} AND Status = {2}",TranType,WalletID,Convert.ToInt16(ServiceStatus.Active));
        //        obj = Result.FirstOrDefault();
        //        return obj;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        public async Task<HistoryAllSumAmount> GetHistorySum(long WalletID)
        {
            try
            {
                HistoryAllSumAmount obj = new HistoryAllSumAmount();
                var Daily = _dbContext.WithdrawHistoryObj.FromSql(@"SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount' FROM WithdrawHistory WHERE WalletId = {0} AND Status IN(1,4,6) AND CreatedDate BETWEEN DATEADD(DD, 0, DATEDIFF(DD, 0, dbo.GetISTDate())) AND dbo.GetISTDate()", WalletID);
                var Hourly = _dbContext.WithdrawHistoryObj.FromSql(@"SELECT ISNULL(SUM(AMOUNT),0) AS 'TotalAmount' FROM WithdrawHistory WHERE WalletId = {0} AND Status IN(1,4,6) AND CreatedDate BETWEEN DATEADD(HOUR, DATEDIFF(HH, 0, dbo.GetISTDate()), 0) AND dbo.GetISTDate()", WalletID);
                var LifeTime = _dbContext.WithdrawHistoryObj.FromSql(@"SELECT ISNULL(SUM(AMOUNT),0) AS 'TotalAmount' FROM WithdrawHistory WHERE WalletId = {0} AND Status IN(1,4,6)", WalletID);
                obj.Daily = Convert.ToDecimal(Daily.FirstOrDefault().TotalAmount);
                obj.Hourly = Convert.ToDecimal(Hourly.FirstOrDefault().TotalAmount);
                obj.LifeTime = Convert.ToDecimal(LifeTime.FirstOrDefault().TotalAmount);
                return obj;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<ApplicationUser> GetUserById(long id)
        {
            try
            {
                return _dbContext.Set<ApplicationUser>().FirstOrDefault(e => e.Id == id);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public async Task<AllSumAmount> GetSumForPolicy(long WalletType, long TrnType)
        {
            try
            {
                SumAmountAndCount Daily = new SumAmountAndCount();
                SumAmountAndCount Monthly = new SumAmountAndCount();
                SumAmountAndCount Hourly = new SumAmountAndCount();
                SumAmountAndCount Weekly = new SumAmountAndCount();
                SumAmountAndCount LifeTime = new SumAmountAndCount();
                SumAmountAndCount Yearly = new SumAmountAndCount();

                AllSumAmount obj = new AllSumAmount();

                string sqlDaily = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE  CreatedDate BETWEEN DATEADD(DD, 0, DATEDIFF(DD, 0, dbo.GetISTDate())) AND dbo.GetISTDate() AND ";

                string sqlMonthly = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE CreatedDate BETWEEN DATEADD(MM, 0, DATEDIFF(MM, 0, dbo.GetISTDate())) AND dbo.GetISTDate() AND ";

                string sqlYearly = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE  CreatedDate BETWEEN DATEADD(YY, 0, DATEDIFF(YY, 0, dbo.GetISTDate())) AND dbo.GetISTDate() AND ";

                string sqlHourly = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE  CreatedDate BETWEEN DATEADD(HOUR, 0, DATEDIFF(HOUR, 0, dbo.GetISTDate())) AND dbo.GetISTDate() AND ";

                string sqlWeekly = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE CreatedDate BETWEEN DATEADD(WEEK, 0, DATEDIFF(WEEK, 0, dbo.GetISTDate())) AND dbo.GetISTDate() AND ";

                string sqlLife = "SELECT ISNULL(SUM(Amount),0) AS 'TotalAmount',ISNULL(SUM(Count),0) AS 'TotalCount' FROM Statastics WHERE ";

                if (WalletType != 0)
                {
                    sqlDaily = sqlDaily + "WalletType={0}";
                    Daily = _dbContext.SumAmountAndCount.FromSql(sqlDaily, WalletType).FirstOrDefault();

                    sqlHourly = sqlHourly + "WalletType={0}";
                    Hourly = _dbContext.SumAmountAndCount.FromSql(sqlHourly, WalletType).FirstOrDefault();

                    sqlMonthly = sqlMonthly + "WalletType={0}";
                    Monthly = _dbContext.SumAmountAndCount.FromSql(sqlMonthly, WalletType).FirstOrDefault();

                    sqlYearly = sqlYearly + "WalletType={0}";
                    Yearly = _dbContext.SumAmountAndCount.FromSql(sqlYearly, WalletType).FirstOrDefault();

                    sqlLife = sqlLife + "WalletType={0}";
                    LifeTime = _dbContext.SumAmountAndCount.FromSql(sqlLife, WalletType).FirstOrDefault();

                    sqlWeekly = sqlWeekly + "WalletType={0}";
                    Weekly = _dbContext.SumAmountAndCount.FromSql(sqlWeekly, WalletType).FirstOrDefault();
                }
                else if (TrnType != 0)
                {
                    sqlDaily = sqlDaily + "TrnType={0}";
                    Daily = _dbContext.SumAmountAndCount.FromSql(sqlDaily, TrnType).FirstOrDefault();

                    sqlHourly = sqlDaily + "TrnType={0}";
                    Hourly = _dbContext.SumAmountAndCount.FromSql(sqlHourly, TrnType).FirstOrDefault();

                    sqlMonthly = sqlMonthly + "TrnType={0}";
                    Monthly = _dbContext.SumAmountAndCount.FromSql(sqlMonthly, TrnType).FirstOrDefault();

                    sqlYearly = sqlYearly + "TrnType={0}";
                    Yearly = _dbContext.SumAmountAndCount.FromSql(sqlYearly, TrnType).FirstOrDefault();

                    sqlLife = sqlLife + "TrnType={0}";
                    LifeTime = _dbContext.SumAmountAndCount.FromSql(sqlLife, TrnType).FirstOrDefault();

                    sqlWeekly = sqlWeekly + "TrnType={0}";
                    Weekly = _dbContext.SumAmountAndCount.FromSql(sqlWeekly, TrnType).FirstOrDefault();
                }

                obj.DailyAmount = Convert.ToDecimal(Daily.TotalAmount);
                obj.MonthlyAmount = Convert.ToDecimal(Monthly.TotalAmount);
                obj.WeeklyAmount = Convert.ToDecimal(Weekly.TotalAmount);
                obj.HourlyAmount = Convert.ToDecimal(Hourly.TotalAmount);
                obj.LifeTimeAmount = Convert.ToDecimal(LifeTime.TotalAmount);
                obj.YearlyAmount = Convert.ToDecimal(Yearly.TotalAmount);

                obj.DailyCount = Convert.ToInt64(Daily.TotalCount);
                obj.MonthlyCount = Convert.ToInt64(Monthly.TotalCount);
                obj.WeeklyCount = Convert.ToInt64(Weekly.TotalCount);
                obj.HourlyCount = Convert.ToInt64(Hourly.TotalCount);
                obj.LifeTimeCount = Convert.ToInt64(LifeTime.TotalCount);
                obj.YearlyCount = Convert.ToInt64(Yearly.TotalCount);

                return obj;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneUpdate UpdateDefaultWallets(long WalletTypeID, long UserID)
        {
            try
            {
                BeneUpdate res = new BeneUpdate();
                //2019-2-15 added condi for only used trading wallet
                string Query = "UPDATE WalletMasters SET IsDefaultWallet = 0 WHERE UserID = {0} AND Walletusagetype=0 and WalletTypeID = {1} SELECT @@ROWCOUNT as 'AffectedRows'";
                IQueryable<BeneUpdate> Result = _dbContext.BeneUpdate.FromSql(Query, UserID, WalletTypeID);
                res = Result.FirstOrDefault();
                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #region AddUserWalletRequest

        //2018-12-20
        public List<AddWalletRequestRes> ListAddUserWalletRequest(long UserId)
        {
            try
            {
                var items = _dbContext.AddWalletRequestRes.FromSql(@"SELECT CASE a.Type  WHEN 1 THEN 'AddRequest' ELSE 'RemoveRequest' END AS 'RequestType',a.OwnerApprovalStatus,CASE a.OwnerApprovalStatus WHEN 0 THEN 'Pending' WHEN 1 THEN 'Accepted' ELSE 'Rejected' END AS 'StrOwnerApprovalStatus',a.Message,a.Id AS RequestId,w.Walletname AS WalletName,wt.WalletTypeName AS WalletType,a.Status AS Status,r.RoleType AS RoleName,a.ReceiverEmail AS ToEmail,b.Email AS FromEmail,CASE a.Status WHEN 0 THEN 'Pending' WHEN 1 THEN 'Accepted' ELSE 'Rejected' END AS 'StrStatus'  FROM AddRemoveUserWalletRequest a INNER JOIN WalletMasters w ON w.Id = a.WalletID INNER JOIN WalletTypeMasters wt ON wt.Id = w.WalletTypeID INNER JOIN BizUser b ON b.Id =a.FromUserId INNER JOIN UserRoleMaster r ON r.Id =a.RoleId  WHERE a.Status=0 AND w.WalletUsageType=0 AND
 ((a.FromUserId={0}  and a.OwnerApprovalStatus=0) 
 OR (a.ToUserId={0}  AND a.OwnerApprovalStatus=1) 
 OR (a.WalletOwnerUserID={0} AND a.OwnerApprovalStatus=0))", UserId).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<List<UserWalletWise>> ListUserWalletWise(long WalletId)
        {
            try
            {
                var items = _dbContext.UserWalletWise.FromSql(@"SELECT r.id as RoleID,r.RoleType as RoleName,b.UserName as UserName,Isnull(b.Email,'') as Email,w.Walletname as WalletName,wt.WalletTypeName as WalletType from WalletAuthorizeUserMaster a INNER JOIN UserRoleMaster r on r.Id=a.RoleId  INNER JOIN BizUser b on b.Id = a.UserID inner join WalletMasters w on w.id = a.WalletID INNER JOIN WalletTypeMasters wt on wt.Id=w.WalletTypeID where a.status=1 and a.WalletID={0} and w.WalletUsageType=0", WalletId).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListUserWalletWise", "WalletRepository", ex);
                throw ex;
            }
        }

        #endregion

        #region Staking Policy

        public List<StakingPolicyDetailRes> GetStakingPolicyData(short statkingTypeID, short currencyTypeID)
        {
            try
            {
                string Query = "SELECT SPD.ID AS 'PolicyDetailID',SPM.StakingType, " +
                    "CASE SPM.StakingType WHEN 1 THEN 'FD' WHEN 2 THEN 'Charge' END AS 'StakingTypeName',SPM.SlabType," +
                    "CASE SPM.SlabType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Range' END AS 'SlabTypeName',SPM.WalletTypeID," +
                    "(SELECT WTM.WalletTypeName FROM WalletTypeMasters WTM WHERE WTM.id=SPM.WalletTypeID) AS 'StakingCurrency'," +
                    "SPD.StakingDurationWeek AS 'DurationWeek',SPD.StakingDurationMonth AS 'DurationMonth',SPD.InterestType," +
                    "ISNULL(CASE SPD.InterestType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Percentage' END,'-') AS 'InterestTypeName'," +
                    "CASE SPM.SlabType WHEN 1 THEN CAST(SPD.MinAmount AS varchar) WHEN 2 THEN CAST(MinAmount AS varchar) +'-' + CAST(MaxAmount AS varchar) END AS 'AvailableAmount', " +
                    "SPD.MinAmount,SPD.MaxAmount,SPD.InterestValue,SPD.InterestWalletTypeID AS 'MaturityCurrencyID',ISNULL(WT.WalletTypeName,'-') AS 'MaturityCurrencyName'," +
                    "ISNULL(SPD.MakerCharges, 0) AS 'MakerCharges',ISNULL(SPD.TakerCharges, 0) AS 'TakerCharges',SPD.Status," +
                    "SPD.EnableAutoUnstaking,CASE SPD.EnableAutoUnstaking WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableAutoUnstaking'," +
                    "SPD.EnableStakingBeforeMaturity," +
                    "SPD.RenewUnstakingEnable,CASE SPD.RenewUnstakingEnable WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrRenewUnstakingEnable',SPD.RenewUnstakingPeriod," +
                    "CASE SPD.EnableStakingBeforeMaturity WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableStakingBeforeMaturity'," +
                    "SPD.EnableStakingBeforeMaturityCharge " +
                    "FROM StakingPolicyDetail SPD " +
                    "INNER JOIN StakingPolicyMaster SPM ON SPD.StakingPolicyID = SPM.Id " +
                    "LEFT JOIN WalletTypeMasters WT ON WT.Id = SPD.InterestWalletTypeID " +
                    "WHERE SPD.Status = 1  AND SPM.Status = 1 AND SPM.StakingType = {0} AND SPM.WalletTypeID = {1}";
                var data = _dbContext.StakingPolicyDetailRes.FromSql(Query, statkingTypeID, currencyTypeID).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public PreStackingConfirmationRes GetPreStackingData(long PolicyDetailID)
        {
            try
            {
                PreStackingConfirmationRes data = new PreStackingConfirmationRes();
                string Query = "SELECT SPD.ID AS 'PolicyDetailID',SPM.StakingType, " +
                    "CASE SPM.StakingType WHEN 1 THEN 'FD' WHEN 2 THEN 'Charge' END AS 'StakingTypeName',SPM.SlabType," +
                    "CASE SPM.SlabType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Range' END AS 'SlabTypeName',SPM.WalletTypeID,SPD.InterestWalletTypeID," +
                    "ISNULL(WT.WalletTypeName,'-') AS 'MaturityCurrencyName',SPD.InterestType," +
                    "ISNULL(CASE SPD.InterestType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Percentage' END,'-') AS 'InterestTypeName'," +
                    "SPD.InterestValue,SPD.StakingDurationWeek AS 'DurationWeek',SPD.StakingDurationMonth AS 'DurationMonth',SPD.MinAmount,SPD.MaxAmount," +
                    "ISNULL(SPD.MakerCharges, 0) AS 'MakerCharges',ISNULL(SPD.TakerCharges, 0) AS 'TakerCharges',SPD.EnableAutoUnstaking," +
                    "CASE SPD.EnableAutoUnstaking WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableAutoUnstaking',SPD.EnableStakingBeforeMaturity," +
                    "CASE SPD.EnableStakingBeforeMaturity WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableStakingBeforeMaturity'," +
                    "SPD.EnableStakingBeforeMaturityCharge " +
                    "FROM StakingPolicyDetail SPD " +
                    "INNER JOIN StakingPolicyMaster SPM ON SPD.StakingPolicyID = SPM.Id " +
                    "LEFT JOIN WalletTypeMasters WT ON WT.Id = SPD.InterestWalletTypeID " +
                    "WHERE SPD.Status = 1 AND SPD.Id = {0}";
                data = _dbContext.PreStackingConfirmationRes.FromSql(Query, PolicyDetailID).FirstOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPreStackingData", "WalletRepository", ex);
                throw ex;
            }
        }

        #endregion

        public async Task<List<WalletMasterRes>> ListWalletMasterResponseNew(long UserId, string Coin)
        {
            try
            {
                //2019-2-15 added condi for only used trading wallet
                var data = _dbContext.WalletMasterRes.FromSql("select r.Id as RoleId ,r.RoleName as RoleName ,u.AccWalletID,u.ExpiryDate,ISNULL(u.OrgID,0) AS OrgID,u.Walletname as WalletName,c.WalletTypeName as CoinName,u.PublicAddress,u.Balance,u.IsDefaultWallet,u.InBoundBalance,u.OutBoundBalance from WalletAuthorizeUserMaster wa inner join WalletMasters u on u.Id=wa.WalletID inner join WalletTypeMasters c on c.Id= u.WalletTypeID inner join UserRoleMaster r on r.id=wa.RoleID where wa.Status = 1 AND wa.UserID={0} AND Walletusagetype=0 AND (c.wallettypename={1} or {1}='')", UserId, (Coin == null ? "" : Coin)).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListWalletMasterResponseNew", "WalletRepository", ex);
                throw ex;
            }
        }

        public async Task<List<WalletMasterRes>> GetWalletMasterResponseByCoinNew(long UserId, string coin)
        {
            try
            {
                //2019-2-15 added condi for only used trading wallet
                var data = _dbContext.WalletMasterRes.FromSql("select r.Id as RoleId ,r.RoleName as RoleName ,u.AccWalletID,u.ExpiryDate,ISNULL(u.OrgID,0) AS OrgID,u.Walletname as WalletName,c.WalletTypeName as CoinName,u.PublicAddress,u.Balance,u.IsDefaultWallet,u.InBoundBalance,u.OutBoundBalance from WalletAuthorizeUserMaster wa inner join WalletMasters u on u.Id=wa.WalletID inner join WalletTypeMasters c on c.Id= u.WalletTypeID inner join UserRoleMaster r on r.id=wa.RoleID where wa.Status = 1 AND wa.UserID={0} AND Walletusagetype=0 and c.WalletTypeName={1}", UserId, coin).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletMasterResponseByCoinNew", "WalletRepository", ex);
                throw ex;
            }
        }

        public async Task<List<WalletMasterRes>> GetWalletMasterResponseByIdNew(long UserId, string walletId)
        {
            try
            {
                var data = _dbContext.WalletMasterRes.FromSql("select r.Id as RoleId ,r.RoleName as RoleName ,u.AccWalletID,u.ExpiryDate,ISNULL(u.OrgID,0) AS OrgID,u.Walletname as WalletName,c.WalletTypeName as CoinName,u.PublicAddress,u.Balance,u.IsDefaultWallet,u.InBoundBalance,u.OutBoundBalance from WalletAuthorizeUserMaster wa inner join WalletMasters u on u.Id=wa.WalletID inner join WalletTypeMasters c on c.Id= u.WalletTypeID inner join UserRoleMaster r on r.id=wa.RoleID where wa.Status = 1  AND Walletusagetype=0 AND wa.UserID={0} AND  u.AccWalletID={1}", UserId, walletId).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletMasterResponseByIdNew", "WalletRepository", ex);
                throw ex;
            }
        }

        // NEW balance API
        public Balance GetAllBalancesNew(long userid, long walletid)
        {
            #region OldCode

            //var Unsettled = (from w in _dbContext.WalletTransactionQueues
            //                 where w.WalletID == walletid && w.MemberID == userid && w.Status == enTransactionStatus.Hold || w.Status == enTransactionStatus.Pending
            //                 select w.Amount).Sum();


            //var availble = (from w in _dbContext.WalletMasters
            //                join wt in _dbContext.WalletTypeMasters
            //                        on w.WalletTypeID equals wt.Id
            //                where w.Id == walletid && w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active)
            //                select w.Balance).Sum();

            //var UnClearedBalance = (from w in _dbContext.DepositHistory
            //                        join wt in _dbContext.AddressMasters
            //                        on w.Address equals wt.Address
            //                        where wt.WalletId == walletid && w.UserId == userid && w.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                        select w.Amount
            //              ).Sum();

            //var ShadowBalance = (from u in _dbContext.MemberShadowBalance
            //                     join w in _dbContext.WalletMasters
            //                     on u.WalletID equals w.Id
            //                     join wt in _dbContext.WalletTypeMasters
            //                                              on u.WalletTypeId equals wt.Id
            //                     where u.WalletID == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                     select u.ShadowAmount).Sum();

            //var StackingBalance = (from u in _dbContext.UserStacking
            //                       join w in _dbContext.WalletMasters
            //                       on u.WalletId equals w.Id
            //                       where u.WalletId == walletid && w.UserID == userid && u.Status == Convert.ToInt16(ServiceStatus.InActive)
            //                       select u.StackingAmount).Sum(); 
            #endregion
            try
            {
                var items = _dbContext.Balance.FromSql(@"select ISNULL((select sum(Amount) from WalletTransactionQueues where WalletID ={0} AND MemberID = {1} AND (Status=4 or Status=6)),0 )as UnSettledBalance ,ISnull((select sum(w.Balance) from WalletAuthorizeUserMaster wa inner join WalletMasters w on w.Id=wa.WalletID join WalletTypeMasters wt on wt.Id=w.WalletTypeId where wa.WalletID = {0} and wa.UserID = {1} and wa.Status =1),0) as AvailableBalance,ISNULL((select sum(w.Amount) from DepositHistory w inner join AddressMasters wt on wt.Address=w.Address where w.Id = {0} and w.UserID = {1} and w.Status =0),0 )as UnClearedBalance,ISNULL((select sum(u.ShadowAmount) from MemberShadowBalance u inner join WalletMasters w on w.Id=u.WalletID inner join WalletTypeMasters wt on wt.Id= u.WalletTypeId where w.Id = {0} and w.UserID = {1} and w.Status =0),0) as ShadowBalance,ISNULL((select SUM(StakingAmount) from TokenStakingHistory where WalletID={0} and UserId={1} And Status in (1,4)),0) as StackingBalance", walletid, userid).First();

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public Balance GetAllBalancesV1(long userid, long walletid)
        {

            try
            {
                var items = _dbContext.Balance.FromSql(@"select ISNULL((select (sum(wtq.Amount)) from WalletTransactionQueues wtq inner join WalletMasters w on w.id=wtq.WalletID where WalletID ={0} AND MemberID = {1} AND (wtq.Status=4 or wtq.Status=6)),0 )as UnSettledBalance ,ISnull((select sum(w.Balance) from WalletAuthorizeUserMaster wa inner join WalletMasters w on w.Id=wa.WalletID join WalletTypeMasters wt on wt.Id=w.WalletTypeId where wa.WalletID = {0} and wa.UserID = {1} and wa.Status =1),0) as AvailableBalance,ISNULL((select sum(w.Amount) from DepositHistory w inner join AddressMasters wt on wt.Address=w.Address where w.Id = {0} and w.UserID = {1} and w.Status =0),0 )as UnClearedBalance,ISNULL((select sum(u.ShadowAmount) from MemberShadowBalance u inner join WalletMasters w on w.Id=u.WalletID inner join WalletTypeMasters wt on wt.Id= u.WalletTypeId where w.Id = {0} and w.UserID = {1} and w.Status =0),0) as ShadowBalance,ISNULL((select SUM(StakingAmount) from TokenStakingHistory where WalletID={0} and UserId={1} And Status in (1,4)),0) as StackingBalance", walletid, userid).First();

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<BalanceResponse> GetAvailableBalanceNew(long userid, long walletId)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                List<BalanceResponse> items = (from wa in _dbContext.WalletAuthorizeUserMaster
                                               join w in _dbContext.WalletMasters on wa.WalletID equals w.Id
                                               join wt in _dbContext.WalletTypeMasters
                                                       on w.WalletTypeID equals wt.Id
                                               where wa.WalletID == walletId && wa.UserID == userid && wa.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                                               select new BalanceResponse
                                               {
                                                   Balance = w.Balance,
                                                   WalletId = w.Id,
                                                   WalletType = wt.WalletTypeName
                                               }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<BalanceResponse> GetAllAvailableBalanceNew(long userid)
        {
            try
            {
                List<BalanceResponse> items = (from wa in _dbContext.WalletAuthorizeUserMaster
                                               join w in _dbContext.WalletMasters on wa.WalletID equals w.Id
                                               join wt in _dbContext.WalletTypeMasters
                                                       on w.WalletTypeID equals wt.Id
                                               where wa.UserID == userid && wa.Status == Convert.ToInt16(ServiceStatus.Active)
                                               select new BalanceResponse
                                               {
                                                   Balance = w.Balance,
                                                   WalletId = w.Id,
                                                   WalletType = wt.WalletTypeName,
                                               }).AsEnumerable().ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public decimal GetTotalAvailbleBalNew(long userid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var total = (from wa in _dbContext.WalletAuthorizeUserMaster
                             join w in _dbContext.WalletMasters on wa.WalletID equals w.Id
                             where wa.UserID == userid && wa.Status == Convert.ToInt16(ServiceStatus.Active) && w.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)
                             select w.Balance
                            ).Sum();
                return total;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<BalanceResponseLimit> GetAvailbleBalTypeWiseNew(long userid)
        {
            try
            {
                #region OldCode

                //var result = (from w in _dbContext.WalletMasters
                //              join wt in _dbContext.WalletTypeMasters
                //              on w.WalletTypeID equals wt.Id
                //              where w.UserID == userid && w.Status == Convert.ToInt16(ServiceStatus.Active)
                //              group w by new { wt.WalletTypeName } into g
                //              select new BalanceResponseLimit
                //              {
                //                  Balance = g.Sum(order => order.Balance),
                //                  WalletType = g.Key.WalletTypeName,
                //              }).AsEnumerable().ToList();
                #endregion
                //2019-2-18 added condi for only used trading wallet
                var result = _dbContext.BalanceResponseLimit.FromSql(@"select wt.WalletTypeName as WalletType,ISNULL(SUM(w.Balance),0) as Balance from WalletTypeMasters wt  left join WalletMasters w on w.WalletTypeID=wt.Id and w.UserID={0} and w.status=1 and w.WalletUsageType=0  group by wt.WalletTypeName", userid).ToList();

                return result;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<StakingHistoryRes> GetStackingHistoryData(DateTime? fromDate, DateTime? toDate, EnStakeUnStake? type, int pageSize, int pageNo, EnStakingSlabType? slab, EnStakingType? stakingType, long userID, ref int TotalCount)
        {
            try
            {
                string Query = "SELECT TSH.Id AS 'StakingHistoryId',TSH.StakingPolicyDetailID AS 'PolicyDetailID',TSH.StakingType," +
                            "CASE TSH.StakingType WHEN 1 THEN 'FD' WHEN 2 THEN 'Charge' END AS 'StakingTypeName',TSH.SlabType," +
                            "CASE TSH.SlabType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Range' END AS 'SlabTypeName',TSH.WalletTypeID," +
                            "ISNULL(WT.WalletTypeName, '-') AS 'StakingCurrency',TSH.InterestType," +
                            "ISNULL(CASE TSH.InterestType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Percentage' END, '-') AS 'InterestTypeName'," +
                            "TSH.InterestValue,SPD.StakingDurationWeek AS 'DurationWeek',SPD.StakingDurationMonth AS 'DurationMonth'," +
                            "TSH.InterestWalletTypeID," +
                            "ISNULL((SELECT WTM.WalletTypeName FROM WalletTypeMasters WTM WHERE WTM.id = TSH.InterestWalletTypeID),'-') AS 'MaturityCurrency'," +
                            "CASE TSH.SlabType WHEN 1 THEN CAST(TSH.MinAmount AS varchar) " +
                            "WHEN 2 THEN CAST(TSH.MinAmount AS varchar) +'-' + CAST(TSH.MaxAmount AS varchar) END AS 'AvailableAmount'," +
                            "TSH.MakerCharges,TSH.TakerCharges,TSH.EnableAutoUnstaking," +
                            "CASE TSH.EnableAutoUnstaking WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableAutoUnstaking',TSH.EnableStakingBeforeMaturity," +
                            "CASE TSH.EnableStakingBeforeMaturity WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrEnableStakingBeforeMaturity'," +
                            "TSH.EnableStakingBeforeMaturityCharge,TSH.RenewUnstakingEnable," +
                            "CASE TSH.Status WHEN 0 THEN 'Inactive' WHEN 1 THEN 'Active' WHEN 4 THEN 'Unstaking Request To Admin' WHEN 5 THEN 'Unstake' END AS 'StrStatus'," +
                            "CASE TSH.RenewUnstakingEnable WHEN 1 THEN 'Yes' ELSE 'No' END AS 'StrRenewUnstakingEnable',TSH.RenewUnstakingPeriod," +
                            "TSH.StakingAmount,TSH.MaturityDate,TSH.MaturityAmount,TSH.ChannelID,CH.ChannelName,TSH.UserID," +
                            "(BU.FirstName + ' ' + BU.LastName) AS 'UserName',TSH.WalletID,ISNULL(WM.WalletName, '-') AS 'WalletName'," +
                            "TSH.WalletOwnerID,TSH.Status,TUH.TokenStakingHistoryID,TUH.AmountCredited,TUH.UnstakeType,TUH.InterestCreditedValue,TUH.ChargeBeforeMaturity," +
                            "CASE TUH.UnstakeType WHEN 1 THEN 'Full' WHEN 2 THEN 'Partial' END AS 'StrUnstakeType'," +
                            "TUH.DegradeStakingHistoryRequestID,TUH.CreatedDate AS 'UnstakingDate'" +
                            "FROM TokenStakingHistory TSH " +
                            "INNER JOIN StakingPolicyDetail SPD ON SPD.Id = TSH.StakingPolicyDetailID " +
                            "LEFT JOIN WalletTypeMasters WT ON WT.Id = TSH.WalletTypeID " +
                            "LEFT JOIN BizUser BU ON BU.Id = TSH.UserID " +
                            "LEFT JOIN TokenUnStakingHistory TUH ON TUH.TokenStakingHistoryID = TSH.Id " +
                            "INNER JOIN AllowedChannels CH ON CH.ChannelID = TSH.ChannelID " +
                            "LEFT JOIN WalletMasters WM ON WM.Id = TSH.WalletID " +
                            "WHERE TSH.Status < 9 AND (TSH.UserID = {0} OR {0}=0) AND (TSH.SlabType = {1} OR {1}=0) " +
                            "AND (TSH.StakingType = {2} OR {2}=0) AND (TSH.Status = {3} OR {3}=0) ";

                if (fromDate != null && toDate != null)
                {
                    toDate = Convert.ToDateTime(toDate).AddHours(23).AddMinutes(59).AddSeconds(59);
                    Query += "AND (TUH.CreatedDate BETWEEN {4} AND {5} OR TSH.CreatedDate BETWEEN {4} AND {5}) "; //> {4} AND TSH.CreatedDate < 
                    var data = _dbContext.StakingHistoryRes.FromSql(Query, userID, (slab == null ? 0 : Convert.ToInt16(slab)), (stakingType == null ? 0 : Convert.ToInt16(stakingType)), (type == null ? 0 : Convert.ToInt16(type)), fromDate, toDate);
                    TotalCount = data.Count();
                    if (pageNo > 0)
                    {
                        int skip = pageSize * (pageNo - 1);
                        data = data.Skip(skip).Take(pageSize);
                    }
                    var test = (from i in data
                                orderby i.TokenStakingHistoryID descending
                                select i).ToList();
                    //return data.ToList();
                    return test;
                    //data.ToList();
                }
                else
                {
                    //Query += "Order By TSH.Id DESC";
                    var data = _dbContext.StakingHistoryRes.FromSql(Query, userID, (slab == null ? 0 : Convert.ToInt16(slab)), (stakingType == null ? 0 : Convert.ToInt16(stakingType)), (type == null ? 0 : Convert.ToInt16(type)));
                    TotalCount = data.Count();
                    if (pageNo > 0)
                    {
                        int skip = pageSize * (pageNo - 1);
                        data = data.Skip(skip).Take(pageSize);
                    }
                    //data = data.OrderByDescending(x => x.TokenStakingHistoryID);
                    //return data.ToList();
                    var test = (from i in data
                                orderby i.TokenStakingHistoryID descending
                                select i).ToList();
                    //return data.ToList();
                    return test;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public int IsSelfAddress(string address, long userID, string smscode)
        {
            try
            {

                GetCount count;
                string query = "select count(AM.ID) As Count from AddressMasters AM inner join WalletMasters WM on wm.id = am.WalletId " +
                "inner join WalletTypeMasters wtm on wtm.Id=wm.WalletTypeID where wtm.WalletTypeName = {0} and wm.UserID = {1} and AM.Address = {2}";
                IQueryable<GetCount> Result1 = _dbContext.GetCount.FromSql(query, smscode, userID, address);
                count = Result1.First();
                return count.Count;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public int IsInternalAddress(string address, long userID, string smscode)
        {
            try
            {

                GetCount count;
                string query = "select count(AM.ID) As Count from AddressMasters AM inner join WalletMasters WM on wm.id = am.WalletId " +
                "inner join WalletTypeMasters wtm on wtm.Id=wm.WalletTypeID where wtm.WalletTypeName = {0} and wm.UserID <> {1} and AM.Address = {2}";
                IQueryable<GetCount> Result1 = _dbContext.GetCount.FromSql(query, smscode, userID, address);
                count = Result1.First();
                return count.Count;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public List<WalletTransactiondata> GetWalletStatisticsdata(long userID, short month, short year)
        {
            try
            {
                //    //ntrivedi enum taken wrong 22-01-2018 and joining table WTrnTypeMaster instead of TrnTypeMaster 
                //    string Query = "SELECT TrnType AS 'TrnTypeId',TrnTypeName,((ISNULL(SUM(ST.Amount),0)) * CRM.CurrentRate) AS TotalAmount," +
                //                    "ISNULL(SUM(ST.Count), 0) AS 'TotalCount' " +
                //                    "FROM Statastics ST INNER JOIN WTrnTypeMaster TM ON ST.TrnType = TM.TrnTypeId " +
                //                    "INNER JOIN CurrencyRateMaster CRM ON CRM.WalletTypeId = ST.WalletType " +
                //                    "WHERE TrnType IN({0},{1}) AND ST.Status = 1 AND ST.Month = {2} AND ST.UserId = {3} " +
                //                    "AND ST.Year = {4} GROUP BY TrnType,TrnTypeName,CurrentRate";

                //uday 22-01-2018 only get available trn type record so change query as per nupoora mam given
                string Query = "SELECT TM.TrnTypeID AS 'TrnTypeId',TrnTypeName,((ISNULL(SUM(ST.Amount),0)) * isNull(CRM.CurrentRate,0)) AS TotalAmount," +
                                "ISNULL(SUM(ST.Count), 0) AS 'TotalCount'" +
                                "FROM WTrnTypeMaster TM left join Statastics ST ON ST.TrnType = TM.TrnTypeId AND ST.Status = 1 AND ST.Month = {2}  AND ST.UserId = {3} AND ST.Year = {4} " +
                                "left JOIN CurrencyRateMaster CRM ON CRM.WalletTypeId = ST.WalletType " +
                                "WHERE TM.TrnTypeID IN({0},{1})  GROUP BY TM.TrnTypeID,TrnTypeName,CurrentRate";

                var BalanceData = _dbContext.WalletTransactiondata.FromSql(Query, Convert.ToInt16(enWalletTrnType.Deposit), Convert.ToInt16(enWalletTrnType.Withdrawal), month, userID, year);//Convert.ToInt16(enTrnType.Deposit)  , Convert.ToInt16(enTrnType.Withdraw)
                return BalanceData.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletStatisticsdata", "WalletRepository", ex);
                throw ex;
            }
        }

        public List<TranDetails> GetYearlyWalletStatisticsdata(long userID, short year)
        {
            try
            {
                //ntrivedi enum taken wrong 22-01-2018 and joining table WTrnTypeMaster instead of TrnTypeMaster 
                string Query = "SELECT CAST(ST.Month as bigint) AS 'Month',ST.TrnType AS 'TrnTypeId',TM.TrnTypeName, ((ISNULL(SUM(ST.Amount),0)) * CRM.CurrentRate) AS TotalAmount," +
                    "ISNULL(SUM(ST.Count), 0) AS 'TotalCount' FROM Statastics ST " +
                    "INNER JOIN WTrnTypeMaster TM ON ST.TrnType = TM.TrnTypeId " +
                    "INNER JOIN CurrencyRateMaster CRM ON CRM.WalletTypeId = ST.WalletType " +
                    "WHERE ST.Status = 1 AND TrnType IN({0}, {1}) AND ST.UserId = {2} AND ST.Year = {3} " +
                    "GROUP BY ST.Month,ST.Year,ST.TrnType,TM.TrnTypeName,CRM.CurrentRate " +
                    "ORDER BY ST.Month DESC, ST.Year DESC";
                var BalanceData = _dbContext.TranDetails.FromSql(Query, Convert.ToInt16(enWalletTrnType.Deposit), Convert.ToInt16(enWalletTrnType.Withdrawal), userID, year);//Convert.ToInt16(enTrnType.Deposit)  , Convert.ToInt16(enTrnType.Withdraw)
                return BalanceData.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetYearlyWalletStatisticsdata", "WalletRepository", ex);
                throw ex;
            }
        }

        public bool AddAddressIntoDB(long userID, string Address, string TxnID, string Key, long SerProDetailId, short Islocal)
        {
            try
            {
                var serPro = (from s in _dbContext.ServiceProviderDetail
                              where s.Id == SerProDetailId
                              select s).FirstOrDefault();

                var walletObj = (from w in _dbContext.WalletMasters
                                 join wt in _dbContext.WalletTypeMasters on w.WalletTypeID equals wt.Id
                                 where w.UserID == userID && w.WalletTypeID == wt.Id && wt.IsLocal == Islocal && (w.PublicAddress == null || w.PublicAddress == "")
                                 select new WalletMaster
                                 {
                                     AccWalletID = w.AccWalletID,
                                     Walletname = w.Walletname,
                                     CreatedBy = w.CreatedBy,
                                     CreatedDate = w.CreatedDate,
                                     Balance = w.Balance,
                                     InBoundBalance = w.InBoundBalance,
                                     OutBoundBalance = w.OutBoundBalance,
                                     ExpiryDate = w.ExpiryDate,
                                     IsDefaultWallet = w.IsDefaultWallet,
                                     IsValid = w.IsValid,
                                     OrgID = w.OrgID,
                                     Status = w.Status,
                                     UserID = w.UserID,
                                     WalletTypeID = w.WalletTypeID,
                                     WalletUsageType = w.WalletUsageType,
                                     PublicAddress = Address,
                                     UpdatedBy = userID,
                                     UpdatedDate = UTC_To_IST()
                                 });
                _dbContext.WalletMasters.UpdateRange(walletObj);
                //_dbContext.SaveChanges();

                var addObj = (from w in _dbContext.WalletMasters
                              join wt in _dbContext.WalletTypeMasters on w.WalletTypeID equals wt.Id
                              where w.UserID == userID && w.WalletTypeID == wt.Id && wt.IsLocal == Islocal
                              select new AddressMaster
                              {
                                  Address = Address,
                                  TxnID = TxnID,
                                  UpdatedBy = userID,
                                  UpdatedDate = UTC_To_IST(),
                                  CreatedBy = userID,
                                  CreatedDate = UTC_To_IST(),
                                  Status = 1,
                                  AddressLable = "Self Address: " + wt.WalletTypeName,
                                  GUID = Key,
                                  WalletId = w.Id,
                                  IsDefaultAddress = 0,
                                  SerProID = serPro.ServiceProID,
                                  OriginalAddress = Address
                              });
                _dbContext.AddressMasters.AddRange(addObj);
                _dbContext.SaveChanges();

                if (Islocal == 5)
                {
                    var NeoAddressObj = (from a in _dbContext.AddressMasters
                                         join w in _dbContext.WalletMasters on a.WalletId equals w.Id
                                         join wt in _dbContext.WalletTypeMasters on w.WalletTypeID equals wt.Id
                                         where w.UserID == userID && w.WalletTypeID == wt.Id && wt.IsLocal == Islocal && a.Status == 1
                                         select new NEODepositCounter
                                         {
                                             UpdatedBy = userID,
                                             UpdatedDate = UTC_To_IST(),
                                             CreatedBy = userID,
                                             CreatedDate = UTC_To_IST(),
                                             Status = 1,
                                             AddressId = a.Id,
                                             PickUpDate = Helpers.UTC_To_IST(),
                                             RecordCount = 1,
                                             Limit = 0,
                                             LastTrnID = "",
                                             MaxLimit = 0,
                                             WalletTypeID = wt.Id,
                                             SerProId = serPro.ServiceProID,
                                             PreviousTrnID = "",
                                             prevIterationID = "",
                                             FlushAddressEnable = 0,
                                             TPSPickupStatus = 0,
                                             AppType = 7,
                                             StartTime = 0,
                                             EndTime = 0
                                         });
                    _dbContext.NEODepositCounter.AddRange(NeoAddressObj);
                    _dbContext.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("AddAddressIntoDB", "WalletRepository", ex);
                return false;
            }
        }

        public List<LeaderBoardRes> LeaderBoard(int? UserCount, long[] LeaderId)
        {
            try
            {
                UserCount = (UserCount == null ? Convert.ToInt32(25) : Convert.ToInt32(UserCount));
                string id = string.Join(",", LeaderId);
                string sql = "SELECT TOP " + UserCount + " b.UserName,b.Email,u.UserId, SUM(ProfitPer) AS ProfitPer,SUM(ProfitAmount) AS ProfitAmount,ROW_NUMBER() OVER(ORDER BY SUM(u.ProfitPer)) AS AutoId  FROM  UserProfitStatistics u INNER JOIN BizUser b ON b.Id=u.UserId  where u.userid in (" + id + ")  GROUP BY u.UserId,b.UserName,b.Email ORDER BY ProfitPer DESC";

                var data = _dbContext.LeaderBoardRes.FromSql(sql).ToList();

                //var data = _dbContext.LeaderBoardRes.FromSql("").Take((UserCount == null ? Convert.ToInt32(25) : Convert.ToInt32(UserCount))).ToList();

                //var data = _dbContext.LeaderBoardRes.FromSql("; WITH cte AS(SELECT top {0} ROW_NUMBER() OVER(ORDER BY u.UserId) AS AutoId ,b.UserName, b.Email, u.UserId, SUM(ProfitPer) AS ProfitPer, SUM(ProfitAmount) as ProfitAmount FROM  UserProfitStatistics u INNER JOIN BizUser b ON b.Id = u.UserId GROUP BY u.UserId, b.UserName, b.Email)SELECT * FROM cte ORDER BY ProfitPer DESC",(UserCount==null? Convert.ToInt32(25): Convert.ToInt32(UserCount))).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LeaderBoard", "WalletRepository", ex);
                throw ex;
            }
        }

        public List<LeaderBoardRes> LeaderBoardWeekWiseTopFive(long[] LeaderId, DateTime Date, short IsGainer, int Count)
        {
            try
            {
                DateTime ToDate = new DateTime();
                ToDate = Date.AddDays(-7);//before 7 days record from Date

                int ToDay = ToDate.Day;
                int ToMonth = ToDate.Month;
                int ToYear = ToDate.Year;

                int FromDay = Date.Day;
                int FromMonth = Date.Month;
                int FromYear = Date.Year;
                string id = string.Join(",", LeaderId);
                string IsDesc = "";
                if (IsGainer == 1)
                {
                    IsDesc = " DESC";
                }
                string sql = "SELECT TOP(" + Count + ") b.UserName,b.Email,u.UserId, SUM(u.ProfitPer) AS ProfitPer,ROW_NUMBER() OVER(ORDER BY sum(u.ProfitPer) " + IsDesc + ") AS AutoId ,SUM(u.ProfitAmount) AS ProfitAmount FROM  UserProfitStatistics u INNER JOIN BizUser b ON b.Id=u.UserId where u.userid in (" + id + ") AND  (u.Day <=" + FromDay + " AND u.Day >= " + ToDay + ") AND (u.Month <=" + FromMonth + " AND u.Month >= " + ToMonth + ") AND (u.Year <=" + FromYear + " AND u.Year >= " + ToYear + ") GROUP BY u.UserId,b.UserName,b.Email ORDER BY SUM(u.ProfitPer) " + IsDesc;
                var data = _dbContext.LeaderBoardRes.FromSql(sql).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LeaderBoard", "WalletRepository", ex);
                throw ex;
            }
        }

        public List<HistoricalPerformanceTemp> GetHistoricalPerformanceYearWise(long UserId, int Year)
        {
            try
            {
                string sql = "SELECT A.AutoNo,isNull(SUM(ProfitPer),0) as ProfitPer from (SELECT top 12 ROW_NUMBER() OVER (ORDER BY (SELECT 12)) as AutoNo FROM WalletTypeMasters) as A left join UserProfitStatistics u on u.Month = a.AutoNo and u.userid={0} and year={1}  GROUP BY A.AutoNo";
                var data = _dbContext.HistoricalPerformanceTemp.FromSql(sql, UserId, Year).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LeaderBoard", "WalletRepository", ex);
                throw ex;
            }
        }

        public decimal FindChargeValueHold(string Timestamp, long TrnRefNo)
        {
            try
            {
                var charge = _dbContext.BalanceTotal.FromSql("SELECT ISNULL(DeductedChargeAmount,isNull(HoldChargeAmount,0)) AS TotalBalance  FROM WalletTransactionqueues WHERE TimeStamp='" + Timestamp + "' AND trnrefno= {0}", TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.TotalBalance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueHold", "WalletRepository", ex);
                throw ex;
            }
        }

        public long FindChargeValueWalletId(string Timestamp, long TrnRefNo)
        {
            try
            {
                var charge = _dbContext.ChargeWalletId.FromSql("SELECT top 1 ISNULL(Dwalletid,0) as Id FROM TrnChargeLog WHERE trnno=(SELECT trnno FROM WalletTransactionqueues WHERE TimeStamp='" + Timestamp + "' and trnrefno= {0}) and trnrefno= {1} order by id desc", TrnRefNo, TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.Id;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueWalletId", "WalletRepository", ex);
                throw ex;
            }
        }

        public long FindChargeValueReleaseWalletId(string Timestamp, long TrnRefNo)
        {
            try
            {
                HelperForLog.WriteLogIntoFileAsync("FindChargeValueReleaseWalletId", "Get walletid and currency walletid=" + "TrnRefNo: " + TrnRefNo.ToString() + "timestamp : " + Timestamp.ToString());

                var charge = _dbContext.ChargeWalletId.FromSql("SELECT top 1 ISNULL(OWalletID,0) as Id FROM TrnChargeLog tc WHERE tc.trnno=(SELECT trnno FROM WalletTransactionqueues WHERE TimeStamp='" + Timestamp + "' and trnrefno= {1}) and tc.trnrefno= {0} order by tc.id desc", TrnRefNo, TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.Id;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueReleaseWalletId", "WalletRepository", ex);
                throw ex;
            }
        }

        public decimal FindChargeValueDeduct(string Timestamp, long TrnRefNo)
        {
            try
            {
                HelperForLog.WriteLogIntoFileAsync("FindChargeValueDeduct", "Get walletid and currency walletid=" + "TrnRefNo: " + TrnRefNo.ToString() + "timestamp : " + Timestamp.ToString());

                var charge = _dbContext.BalanceTotal.FromSql(" select Charge AS TotalBalance from TrnChargeLog where TrnNo in ( SELECT TrnNo FROM WalletTransactionqueues WHERE TimeStamp = '" + Timestamp + "' AND trnrefno = {1}) and trnrefno = {0}", TrnRefNo, TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.TotalBalance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueDeduct", "WalletRepository", ex);
                throw ex;
            }
        }

        public decimal FindChargeValueRelease(string Timestamp, long TrnRefNo)
        {
            try
            {
                var charge = _dbContext.BalanceTotal.FromSql("SELECT ISNULL(Charge,0) as TotalBalance FROM TrnChargeLog WHERE trnno=(SELECT trnno FROM WalletTransactionqueues WHERE TimeStamp='" + Timestamp + "' and trnrefno= {0})", TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.TotalBalance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValue", "WalletRepository", ex);
                throw ex;
            }
        }

        public string FindChargeCurrencyDeduct(long TrnRefNo)
        {
            try
            {
                //string charge = _dbContext.ChargeCurrency.FromSql("select ISnull(wt.WalletTypeName,'') as Name from Trnchargelog tc inner join ChargeConfigurationDetail cd on cd.Id=tc.ChargeConfigurationDetailID inner join WalletTypeMasters wt on wt.Id=cd.DeductionWalletTypeId where trnfno={0} and tc.Status=6", TrnRefNo).FirstOrDefault().Name;
                HelperForLog.WriteLogIntoFileAsync("FindChargeCurrencyDeduct", "Get walletid and currency walletid=" + "TrnRefNo: " + TrnRefNo.ToString());
                var chargeWalletType = _dbContext.ChargeCurrency.FromSql("select top 1 ISnull(wt.WalletTypeName,'') as Name from Trnchargelog tc inner join ChargeConfigurationDetail cd on cd.Id=tc.ChargeConfigurationDetailID inner join WalletTypeMasters wt on wt.Id=cd.DeductionWalletTypeId where trnrefno={0} order by tc.id desc", TrnRefNo).FirstOrDefault();
                if (chargeWalletType == null)
                {
                    return "";
                }
                return chargeWalletType.Name;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeCurrencyDeduct", "WalletRepository", ex);
                throw ex;
            }
        }

        public TransactionPolicyRes ListTransactionPolicy(long TrnType, long userId)
        {
            try
            {
                int IsKYCEnable = 0;
                var obj = (from p in _dbContext.PersonalVerification
                           where p.UserID == userId
                           select p.VerifyStatus).FirstOrDefault();
                if (obj != null)
                {
                    IsKYCEnable = obj;
                }
                var items = _dbContext.TransactionPolicyRes.FromSql(@"SELECT  t.IsKYCEnable,t.Id ,w.TrnTypeName AS StrTrnType,t.Status,CASE t.Status WHEN 1 THEN 'Enable' WHEN 0 THEN 'Disable' ELSE 'Deleted' END AS StrStatus,t.TrnType,t.AllowedIP,t.AllowedLocation,t.AuthenticationType,t.StartTime,t.EndTime,t.DailyTrnCount,t.DailyTrnAmount,t.MonthlyTrnCount,t.MonthlyTrnAmount,t.WeeklyTrnCount,t.WeeklyTrnAmount,t.YearlyTrnCount,t.YearlyTrnAmount,t.MinAmount,t.MaxAmount,t.AuthorityType,t.AllowedUserType,r.Id as RoleId,r.RoleType as RoleName FROM TransactionPolicy t inner join  WTrnTypeMaster w ON w.TrnTypeId = t.TrnType inner join UserRoleMaster r on r.Id=t.RoleId WHERE t.Status < 9 and t.TrnType={0} and t.IsKYCEnable={1}", TrnType, IsKYCEnable).FirstOrDefault();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<WalletType> GetChargeWalletType(long? WalletTypeId)
        {
            //List<ChargesTypeWise> Resp = new List<ChargesTypeWise>();
            try
            {
                var _WalletType = (from w in _dbContext.ChargeConfigurationMaster
                                   join wt in _dbContext.WalletTypeMasters
                                   on w.WalletTypeID equals wt.Id
                                   where wt.Status == 1 && (WalletTypeId == null || (w.WalletTypeID == WalletTypeId && WalletTypeId != null))
                                   group w by new { w.WalletTypeID, wt.WalletTypeName } into g
                                   select new WalletType { WalletTypeId = g.Key.WalletTypeID, WalletTypeName = g.Key.WalletTypeName }).ToList();

                return _WalletType;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public List<ChargesTypeWise> ListChargesTypeWise(long WalletTypeId, long? TrntypeId)
        {
            List<ChargesTypeWise> Resp = new List<ChargesTypeWise>();
            try
            {
                var ChargeData = _dbContext.ChargesTypeWise.FromSql("SELECT cd.ChargeValue,wtm.WalletTypeName as DeductWalletTypeName,wt.TrnTypeName, cd.MakerCharge, cd.TakerCharge, wt.TrnTypeId FROM ChargeConfigurationDetail cd inner join ChargeConfigurationMaster cm ON cm.id = cd.ChargeConfigurationMasterID INNER JOIN WTrnTypeMaster wt ON wt.TrnTypeId = cm.TrnType inner join WalletTypemasters wtm on wtm.id = cd.DeductionWalletTypeId WHERE cm.TrnType in (3, 8,9) AND cd.Status = 1 AND cm.Status = 1 AND cm.WalletTypeID ={0} and(cm.TrnType ={1} or {1}= 0)", WalletTypeId, (TrntypeId == null ? 0 : Convert.ToInt64(TrntypeId))).ToList();

                return ChargeData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        //khushali 11-04-2019 Process for Release Stuck Order - wallet side   

        public enTransactionStatus CheckTransactionSuccessOrNot(long TrnRefNo)
        {
            try
            {
                IQueryable<CheckTransactionSuccessOrNotRes> Result = _dbContext.CheckTransactionSuccessOrNotRes.FromSql("SELECT Status from wallettransactionqueues where trnrefno={0} and TrnType=1 and " +
                    "wallettrntype in(3,8) ", TrnRefNo);
                return Result.FirstOrDefault().Status;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 25-4-19 if settlement proceed then does not revert txn
        public bool CheckSettlementProceed(long MakerTrnNo, long TakerTrnNo)
        {
            try
            {
                IQueryable<WalletTransactionQueue> Result = _dbContext.WalletTransactionQueues.FromSql("select * from wallettransactionqueues where trnrefno={0} and " +
                                                                                "timestamp in(select timestamp from wallettransactionqueues where trnrefno={1}) and status=1 and wallettrntype in(3,8)  ", TakerTrnNo, MakerTrnNo);
                var FirstEntry = Result.FirstOrDefault();

                if (FirstEntry != null)//found entry then does not revert Txn
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<UserUnstakingReq2> GetStakingdataForChrone()
        {
            try
            {
                DateTime FromDate = UTC_To_IST().Date;
                DateTime ToDate = FromDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                FromDate = FromDate.AddHours(0).AddMinutes(0).AddSeconds(0);
                string Query = "SELECT Id,UserID,StakingPolicyDetailID,ChannelID,StakingAmount,MaturityDate,EnableAutoUnstaking FROM TokenStakingHistory WHERE Status IN(1,4) AND EnableAutoUnstaking = 1 AND MaturityDate>={0} AND MaturityDate<={1}";
                var data = _dbContext.UserUnstakingReq2.FromSql(Query, FromDate, ToDate);
                return data.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ValidationWithdrawal CheckActivityLog(long UserId, int Type)
        {
            try
            {
                var data = _dbContext.ValidationWithdrawal.FromSql("SELECT TOP(1) ActivityDate as Date FROM ActivityTypeLog WHERE userid={0} and ActivityType={1} ORDER BY ActivityDate DESC", UserId, Type).FirstOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
    }

    //public class WalletTQInsert
    //{
    //    private readonly CleanArchitectureContext _dbContext;

    //   // private readonly ILogger<WalletRepository> _log;

    //    public WalletTQInsert(CleanArchitectureContext dbContext)
    //    {
    //       // _log = log;
    //        _dbContext = dbContext;
    //    }

    //    public WalletTransactionQueue AddIntoWalletTransactionQueue(WalletTransactionQueue wtq, byte AddorUpdate)//1=add,2=update
    //    {
    //        try
    //        {
    //            //WalletTransactionQueue w = new WalletTransactionQueue();
    //            if (AddorUpdate == 1)
    //            {
    //                _dbContext.WalletTransactionQueues.Add(wtq);
    //            }
    //            else
    //            {
    //                _dbContext.Entry(wtq).State = EntityState.Modified;
    //            }
    //            _dbContext.SaveChanges();
    //            return wtq;
    //        }
    //        catch (Exception ex)
    //        {
    //            HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
    //            throw ex;
    //        }

    //    }
    //}

}
