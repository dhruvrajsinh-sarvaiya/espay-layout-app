using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.ViewModels.Wallet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.LPWallet
{
    public class ArbitrageWalletRepository : IArbitrageWalletRepository
    {
        private readonly CleanArchitectureContext _dbContext;


        public ArbitrageWalletRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ArbitrageWalletMasterRes> ListArbitrageWallet(long? WalletTypeId, short? WalletUsageType, short? Status, string AccWalletId, long? UserId)
        {
            try
            {
                List<ArbitrageWalletMasterRes> res = new List<ArbitrageWalletMasterRes>();
                res = _dbContext.ArbitrageWalletMasterRes.FromSql("select c.IsLeaverageAllow ,r.Id as RoleId ,r.RoleName as RoleName ,u.AccWalletID,u.ExpiryDate,u.UserId,ISNULL(u.OrgID,0) AS OrgID, " +
                " u.Walletname as WalletName, c.WalletTypeName as CoinName, '' as PublicAddress, u.Balance, u.IsDefaultWallet, " +
                " u.InBoundBalance, u.OutBoundBalance,case u.WalletUsageType when 0 then 'Trading Wallet' else 'Unknown' end as WalletUsageTypeName,u.WalletUsageType, " +
                " u.Status,case u.Status when 0 then 'InActive' WHEN 1 then 'Active' When 9 then 'Delete' ELSE 'N/A' End as StrStatus " +
                " from ArbitrageWalletAuthorizeUserMaster wa inner join ArbitrageWalletMaster u on u.Id = wa.WalletID inner join ArbitrageWalletTypeMaster c on c.Id = u.WalletTypeID inner " +
                " join UserRoleMaster r on r.id = wa.RoleID where wa.Status = 1 AND u.Status=1 AND (wa.UserID={3} or {3}=0) and  ( u.walletusagetype ={0} Or {0}=999 ) AND (u.wallettypeid ={1} Or {1}=0) AND (wa.status ={2} Or {2}=999) and (u.AccWalletId={4} or {4}='')", (WalletUsageType == null ? Convert.ToInt16(999) : Convert.ToInt16(WalletUsageType)), (WalletTypeId == null ? 0 : WalletTypeId), (Status == null ? 999 : Status), (UserId == null ? 0 : UserId), (AccWalletId == null ? "" : AccWalletId)).ToList();
                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListArbitrageWalletMaster", "ArbitrageWalletRepository", ex);
                throw ex;
            }
        }
        public List<WalletLedgerRes> GetArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount)
        {
            try
            {
                List<WalletLedgerRes> wl = (from w in _dbContext.ArbitrageWalletLedger
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
                                            }).Take(1).Union((from w in _dbContext.ArbitrageWalletLedger
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
                decimal DrAmount = 0, CrAmount = 0, Amount = 0;
                wl.ForEach(e =>
                {
                    Amount = e.PreBal + e.CrAmount - e.DrAmount;
                    e.PostBal = Amount;
                    e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;

                });
                return wl;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ArbitrageAddressRes> ListArbitrageAddress(string Address, long? WalletTypeId, long? ServiceProviderId)
        {
            try
            {
                var Query = "SELECT AM.Id,WalletTypeId,WalletTypeName,AM.SerProId AS ServiceProviderId,SPM.ProviderName AS ServiceProviderName,Address,IsDefaultAddress FROM ArbitrageLPAddressMaster AM INNER JOIN ServiceProviderMasterArbitrage SPM on SPM.Id=AM.SerProID INNER JOIN ArbitrageWalletTypeMaster WTM ON WTM.Id = AM.WalletTypeId WHERE AM.Status=1 AND (AM.Address={0} OR {0}='')  AND (AM.SerProID={1} OR {1}=0) AND (AM.WalletTypeId={2} OR {2}=0)";
                var data = _dbContext.ArbitrageAddressRes.FromSql(Query, (Address == null ? "" : Address), (ServiceProviderId == null ? 0 : ServiceProviderId), (WalletTypeId == null ? 0 : WalletTypeId)).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public void ReloadEntity(ArbitrageWalletMaster wm1, ArbitrageWalletMaster wm2, ArbitrageWalletMaster wm3, ArbitrageWalletMaster wm4)
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

        public async Task<bool> CheckTrnIDDrForHoldAsync(CommonClassCrDr arryTrnID)
        {
            try
            {
                //bool i = false;
                //decimal totalAmtDrTranx;
                //for (int t = 0; t <= arryTrnID.Length - 1; t++)
                //{
                var response = (from u in _dbContext.ArbitrageWalletTransactionQueue
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

                var deliveredAmt = (from p in _dbContext.ArbitrageWalletTransactionOrder
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

        public async Task<List<ArbitrageTransactionProviderResponse>> ArbitrageGetProviderDataList(ArbitrageTransactionApiConfigurationRequest Request)
        {
            try
            {
                IQueryable<ArbitrageTransactionProviderResponse> Result = _dbContext.ArbitrageTransactionProviderResponse.FromSql(
                           @"select SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                                PC.ID as ProductID,RC.RouteName,cast(SC.ServiceType as int) as ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                                LC.MaxAmt as MaximumAmountItem,RC.ProviderWalletID,RC.IsAdminApprovalRequired,RC.OpCode,cast(1  as bigint) as ProTypeID ,'' as APIBalURL,'' as APISendURL,'' as APIValidateURL,'' as ContentType,
                                '' as MethodType,0 as ParsingDataID,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen
                                from ServiceMasterArbitrage SC inner join  ProductConfigurationArbitrage PC on
                                PC.ServiceID = SC.Id inner join RouteConfigurationArbitrage RC on RC.ProductID = PC.Id  
                                inner join ServiceProviderDetailArbitrage PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID={1} 
                                inner join Limits LC on LC.ID = RC.LimitID 
                                where SC.SMSCode = {0}  and RC.TrnType={1} 
                                and {2} between LC.MinAmt and LC.MaxAmt			                
                                and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
                                order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount);
                var list = new List<ArbitrageTransactionProviderResponse>(Result);
                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListArbitrageTopUpHistory TopUpHistory(int PageNo, int PageSize, long userid, short? Status, string Address, string CoinName, long? FromServiceProviderId, long? ToServiceProviderId, string TrnId, DateTime? FromDate, DateTime? ToDate, ref int TotalCount)
        {
            try
            {
                var list = new List<ArbitrageTopUpHistory>();
                ListArbitrageTopUpHistory Resp = new ListArbitrageTopUpHistory();
                string Query = "SELECT  ISNULL(W.TrnID,'') as 'TrnId',u.Id as 'TrnNo',u.SMSCode as 'CoinName' ,ISNULL(u.TransactionAccount,'') as 'Address',u.Amount,u.CreatedDate as 'TrnDate', u.Status,CASE When u.Status = 4 or u.Status = 6 Then  Case When u.IsVerified = 0 Then 'ConfirmationPending' When u.IsVerified = 1 Then 'Confirm' When u.IsVerified = 9 Then 'Cancelled' End Else CASE  WHEN u.Status = 0 THEN 'Initialize' WHEN u.Status = 1 THEN 'Success' WHEN u.Status = 2 THEN 'ProviderFail' WHEN u.Status = 3 THEN 'SystemFail'  WHEn u.Status = 4 THEN 'Hold' WHEN u.Status = 5 And u.IsVerified = 9 THEN 'Cancelled' WHEN u.Status = 5 THEN 'Refunded' WHEN u.Status = 6 THEN 'Pending' ELSE 'Other' END End AS 'StatusStr', w.FromSerProId as FromServiceProviderId,w.ToSerProId as ToServiceProviderId,(select Providername from Serviceprovidermasterarbitrage where id=w.fromserproid) as FromServiceProviderName ,(select Providername from Serviceprovidermasterarbitrage where id=w.toserproid) as ToServiceProviderName,u.StatusMsg as Remarks,ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink' FROM TransactionQueueArbitrage u inner JOIN ArbitrageDepositFund w ON w.TrnNo=u.Id LEFT JOIN ServiceDetailArbitrage SD ON u.ServiceID = SD.ServiceId WHERE u.TrnType = 6 and (u.status=4 or u.status=1) and (u.MemberID={0})  and (u.Status={1} or {1}=999) and (u.TransactionAccount={2} or {2}='') and (w.TrnId={3} or {3}='') and (u.SMSCode={4} or {4}='') and (w.FromSerProId={5} or {5}=0) and (w.ToserProId={6} or {6}=0) ";

                if (FromDate != null && ToDate != null)
                {
                    FromDate = Convert.ToDateTime(FromDate).AddHours(0).AddMinutes(0).AddSeconds(0);
                    ToDate = Convert.ToDateTime(ToDate).AddHours(23).AddMinutes(59).AddSeconds(59);
                    Query = Query + " AND w.TrnDate >={7} and  w.TrnDate <= {8} ";
                    Query = Query + " ORDER BY u.CreatedDate DESC";
                    list = _dbContext.ArbitrageTopUpHistory.FromSql(Query, userid, (Status == null ? 999 : Status), (Address == null ? "" : Address), (TrnId == null ? "" : TrnId), (CoinName == null ? "" : CoinName), (FromServiceProviderId == null ? 0 : FromServiceProviderId), (ToServiceProviderId == null ? 0 : ToServiceProviderId), FromDate, ToDate).ToList();
                }
                else
                {
                    Query = Query + " ORDER BY u.CreatedDate DESC";
                    list = _dbContext.ArbitrageTopUpHistory.FromSql(Query, userid, (Status == null ? 999 : Status), (Address == null ? "" : Address), (TrnId == null ? "" : TrnId), (CoinName == null ? "" : CoinName), (FromServiceProviderId == null ? 0 : FromServiceProviderId), (ToServiceProviderId == null ? 0 : ToServiceProviderId)).ToList();
                }
                TotalCount = list.Count();
                if (PageNo > 0)
                {
                    int skip = PageSize * (PageNo - 1);
                    list = list.Skip(skip).Take(PageSize).ToList();
                }
                Resp.Data = list;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
        public void ReloadEntitySingle(ArbitrageWalletMaster wm1, LPArbitrageWalletMaster wm2)
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
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "w1", this.GetType().Name, ex);
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
            }
        }


        public AnalyticsGraphRes AnalyticsGraphAPI(string CurrencyName, long UserId)
        {
            AnalyticsGraphRes Resp = new AnalyticsGraphRes();
            try
            {
                decimal Amount = (from w in _dbContext.ArbitrageWalletMaster
                                  join wt in _dbContext.ArbitrageWalletTypeMaster on w.WalletTypeID equals wt.Id
                                  where wt.WalletTypeName == CurrencyName && w.UserID == UserId
                                  select w).Sum(e => e.Balance);
                Resp.Amount = Amount;
                decimal USDPrice = (from c in _dbContext.CurrencyRateMaster
                                    join wt in _dbContext.ArbitrageWalletTypeMaster on c.WalletTypeId equals wt.Id
                                    where wt.WalletTypeName == CurrencyName
                                    select c.CurrentRate).FirstOrDefault();
                decimal USDTotalAmount = Amount * USDPrice;
                Resp.USDTotalAmount = USDTotalAmount;


                var res = _dbContext.NewGraphRes.FromSql("SELECT  EndingBalance,USDEndingBalance,aps.Day,aps.Month from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and aps.createddate>=DATEADD(day, -30, dbo.GetISTDate()) and aps.createddate<dbo.GetISTDate() and w.status=1 order by month desc", CurrencyName, UserId).ToList();

                decimal[] EndingBalanceArray = new decimal[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                decimal[] USDEndingBalanceArray = new decimal[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                string[] newArray = new string[] { " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " " };

                if (res.Count > 0)
                {
                    for (int i = 29; i >= 0; i--)
                    //for (int i = 0; i < 30; i++)
                    {
                        //newArray[i] = res[i].Day + " " + DateTimeFormatInfo.CurrentInfo.GetAbbreviatedMonthName(res[i].Month);
                        newArray[i] = Helpers.UTC_To_IST().AddDays(-i).Day + " " + DateTimeFormatInfo.CurrentInfo.GetAbbreviatedMonthName(Helpers.UTC_To_IST().AddDays(-i).Month);

                        var obj = res.Where(x => x.Day == Helpers.UTC_To_IST().AddDays(-i).Day && x.Month == Helpers.UTC_To_IST().AddDays(-i).Month).FirstOrDefault();
                        if (obj != null)
                        {
                            EndingBalanceArray[i] = obj.EndingBalance;
                            USDEndingBalanceArray[i] = obj.USDEndingBalance;
                        }
                        else
                        {
                            EndingBalanceArray[i] = 0;
                            USDEndingBalanceArray[i] = 0;
                        }
                    }
                    Resp.AmountArray = EndingBalanceArray;
                    Resp.USDAmountArray = USDEndingBalanceArray;
                    Resp.DayMonth = newArray;
                }
                else
                {
                    decimal[] newOn = new decimal[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                    Resp.AmountArray = newOn;
                    Resp.USDAmountArray = newOn;
                    Resp.DayMonth = new string[] { };
                }

                //var res = _dbContext.sqlGraphRes.FromSql("SELECT top 1 CAST (cast( round(ISNULL((CASE month WHEN 1 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 2 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 3 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 4 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 5 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 6 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 7 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 8 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 9 THEN (EndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 10 THEN (EndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 11 THEN (EndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 12 THEN (EndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) AS AmountString,CAST (cast( round(ISNULL((CASE month WHEN 1 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 2 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 3 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 4 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 5 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 6 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 7 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 8 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 9 THEN (USDEndingBalance) END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 10 THEN (USDEndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 11 THEN (USDEndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) + ','+CAST ( cast( round(ISNULL((CASE month WHEN 12 THEN (USDEndingBalance)END),0),3) as decimal(28,3)) AS VARCHAR(50)) AS USDAmountString from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 order by aps.day desc", CurrencyName, UserId).FirstOrDefault();
                //int[] MonthArray = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };
                //Resp.Month = MonthArray;
                //if (res != null)
                //{
                //    if (res.AmountString == null)
                //    {
                //        res.AmountString = "0,0,0,0,0,0,0,0,0,0,0,0";
                //    }
                //    else { Resp.AmountArray = Array.ConvertAll(res.AmountString.Split(','), decimal.Parse); }
                //    if (res.USDAmountString == null)
                //    {
                //        res.USDAmountString = "0,0,0,0,0,0,0,0,0,0,0,0";
                //    }
                //    else { Resp.USDAmountArray = Array.ConvertAll(res.USDAmountString.Split(','), decimal.Parse); }
                //}
                //else
                //{
                //    decimal[] newOn = new decimal[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                //    Resp.AmountArray = newOn;
                //    Resp.USDAmountArray = newOn;
                //}

                var respAmount = _dbContext.sqlGraphAmountRes.FromSql("select isnull((select top 1  aps.EndingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and  wt.wallettypename={0} and w.status=1 order by aps.id desc),0) as EndingBalance,isnull((select top 1 aps.StartingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id = aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid ={2} and wt.wallettypename ={3} and w.status = 1 order by aps.id ),0) as StartingBalance", CurrencyName, UserId, UserId, CurrencyName).FirstOrDefault();

                ChangeClass TotalChange = new ChangeClass();
                TotalChange.Change = respAmount.EndingBalance - respAmount.StartingBalance;
                TotalChange.USDChange = (TotalChange.Change * USDPrice);
                if (TotalChange.Change == Convert.ToDecimal(0))
                {
                    TotalChange.IsProfit = 0;
                }
                if (TotalChange.Change < Convert.ToDecimal(0))
                {
                    TotalChange.IsProfit = 2;
                }
                if (TotalChange.Change > Convert.ToDecimal(0))
                {
                    TotalChange.IsProfit = 1;
                }
                TotalChange.Percentage = (TotalChange.Change / 100);
                Resp.TotalChange = TotalChange;
                DateTime todate = Helpers.UTC_To_IST();
                DateTime fromdate = todate.AddDays(-1);

                var respAmount24H = _dbContext.sqlGraphAmountRes.FromSql("select isnull((select top 1  aps.EndingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id desc) ,0)as EndingBalance,isnull((select top 1  aps.StartingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id ) ,0)as StartingBalance", CurrencyName, UserId, fromdate.Year, todate.Year, fromdate.Month, todate.Month, fromdate.Day, todate.Day).FirstOrDefault();

                ChangeClass TotalChange24H = new ChangeClass();
                TotalChange24H.Change = respAmount24H.EndingBalance - respAmount24H.StartingBalance;
                TotalChange24H.USDChange = (TotalChange24H.Change * USDPrice);
                if (TotalChange24H.Change < Convert.ToDecimal(0))
                {
                    TotalChange24H.IsProfit = 0;
                }
                else
                {
                    TotalChange24H.IsProfit = 1;
                }
                TotalChange24H.Percentage = (TotalChange24H.Change / 100);
                Resp.TotalChange24H = TotalChange24H;
                todate = Helpers.UTC_To_IST();
                fromdate = todate.AddDays(-7);

                var respAmount7D = _dbContext.sqlGraphAmountRes.FromSql("select isnull((select top 1  aps.EndingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id desc) ,0)as EndingBalance,isnull((select top 1  aps.StartingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id ) ,0)as StartingBalance", CurrencyName, UserId, fromdate.Year, todate.Year, fromdate.Month, todate.Month, fromdate.Day, todate.Day).FirstOrDefault();

                ChangeClass TotalChange7D = new ChangeClass();
                TotalChange7D.Change = respAmount7D.EndingBalance - respAmount7D.StartingBalance;
                TotalChange7D.USDChange = (TotalChange7D.Change * USDPrice);
                if (TotalChange7D.Change < Convert.ToDecimal(0))
                {
                    TotalChange7D.IsProfit = 0;
                }
                else
                {
                    TotalChange7D.IsProfit = 1;
                }
                TotalChange7D.Percentage = (TotalChange7D.Change / 100);
                Resp.TotalChange7D = TotalChange7D;

                todate = Helpers.UTC_To_IST();
                fromdate = todate.AddMonths(-1);
                var respAmount30D = _dbContext.sqlGraphAmountRes.FromSql("select isnull((select top 1  aps.EndingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id desc) ,0)as EndingBalance,isnull((select top 1  aps.StartingBalance from ArbitrageUserProfitStatistics aps INNER JOIN ArbitrageWalletMaster w ON w.id=aps.userid inner join arbitragewallettypemaster wt on wt.id = w.wallettypeid  where w.userid={1} and wt.wallettypename={0} and w.status=1 and (aps.Year>={2} and aps.year<={3})and (aps.month>={4} and aps.month<={5})  and (aps.day>={6} and aps.day<={7})  order by aps.id ) ,0)as StartingBalance", CurrencyName, UserId, fromdate.Year, todate.Year, fromdate.Month, todate.Month, fromdate.Day, todate.Day).FirstOrDefault();

                ChangeClass TotalChange30D = new ChangeClass();
                TotalChange30D.Change = respAmount30D.EndingBalance - respAmount30D.StartingBalance;
                TotalChange30D.USDChange = (TotalChange30D.Change * USDPrice);
                if (TotalChange30D.Change < Convert.ToDecimal(0))
                {
                    TotalChange30D.IsProfit = 0;
                }
                else
                {
                    TotalChange30D.IsProfit = 1;
                }
                TotalChange30D.Percentage = (TotalChange30D.Change / 100);
                Resp.TotalChange30D = TotalChange30D;

                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public async Task<bool> CheckTrnIDDrForMarketAsync(CommonClassCrDr arryTrnID)
        {
            try
            {
                GetCount count;
                TQTrnAmt sumAmount;

                IQueryable<GetCount> Result1 = _dbContext.GetCount.FromSql(@"SELECT count(TrnNo)  as 'Count' FROM ArbitrageWalletTransactionQueue WHERE TrnRefNo = {0} and Status=4 and TrnType={1} and WalletDeductionType={2}  and LPType<>1", arryTrnID.debitObject.TrnRefNo, enWalletTranxOrderType.Debit, enWalletDeductionType.Market);
                IQueryable<TQTrnAmt> Result2 = _dbContext.TQTrnAmt.FromSql(@"SELECT Amount-SettedAmt as 'DifferenceAmount',TrnNo  FROM ArbitrageWalletTransactionQueue WHERE TrnRefNo = {0} and Status=4 and TrnType={1} and WalletDeductionType={2}  and LPType<>1", arryTrnID.debitObject.TrnRefNo, enWalletTranxOrderType.Debit, enWalletDeductionType.Market);
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
        public decimal FindChargeValueHold(string Timestamp, long TrnRefNo)
        {
            try
            {
                var charge = _dbContext.BalanceTotal.FromSql("SELECT ISNULL(DeductedChargeAmount,isNull(HoldChargeAmount,0)) AS TotalBalance  FROM ArbitrageWalletTransactionqueue WHERE TimeStamp='" + Timestamp + "' AND trnrefno= {0}  and LPType<>1", TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.TotalBalance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueHold", "ArbitrageWalletRepository", ex);
                throw ex;
            }
        }

        public long FindChargeValueWalletId(string Timestamp, long TrnRefNo)
        {
            try
            {
                var charge = _dbContext.ChargeWalletId.FromSql("SELECT top 1 ISNULL(Dwalletid,0) as Id FROM TrnChargeLogArbitrage WHERE trnno=(SELECT trnno FROM ArbitrageWalletTransactionqueue WHERE TimeStamp='" + Timestamp + "' and trnrefno= {0} and LPType<>1 ) and trnrefno= {1}  order by id desc", TrnRefNo, TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.Id;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueWalletId", "ArbitrageWalletRepository", ex);
                throw ex;
            }
        }
        public decimal FindChargeValueDeduct(string Timestamp, long TrnRefNo)
        {
            try
            {
                HelperForLog.WriteLogIntoFileAsync("FindChargeValueDeduct", "Get walletid and currency walletid=" + "TrnRefNo: " + TrnRefNo.ToString() + "timestamp : " + Timestamp.ToString());

                var charge = _dbContext.BalanceTotal.FromSql(" select Charge AS TotalBalance from TrnChargeLogArbitrage where TrnNo in ( SELECT TrnNo FROM ArbitrageWalletTransactionqueue WHERE TimeStamp = '" + Timestamp + "' AND trnrefno = {1}) and trnrefno = {0} and LPType<>1", TrnRefNo, TrnRefNo).FirstOrDefault();
                if (charge == null) //ntrivedi null condition 26-02-2019
                {
                    return 0;
                }
                return charge.TotalBalance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("FindChargeValueDeduct", "ArbitrageWalletRepository", ex);
                throw ex;
            }
        }
    }
}
