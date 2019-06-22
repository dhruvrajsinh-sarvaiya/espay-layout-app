using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Configuration.FeedConfiguration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class BackOfficeTrnRepository : IBackOfficeTrnRepository
    {
        private readonly CleanArchitectureContext _dbContext;
        private readonly ILogger<BackOfficeTrnRepository> _logger;

        public BackOfficeTrnRepository(CleanArchitectureContext dbContext, ILogger<BackOfficeTrnRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        #region History methods

        public List<GetTradingSummary> GetTradingSummary(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                if (!string.IsNullOrEmpty(SMSCode))
                    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status == 91) // Order History
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) + " And IsCancelled=0 ";  //uday 27-12-2018 because its give partial cancel also
                else if (status == 95) //Active Order
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Hold) + " ";
                else if (status == 92) // partial settled
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Hold);
                else if (status == 93) // cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.OperatorFail) + " ";  //uday 27-12-2018 In Spot Order IsCanceled = 0 So its also consider as systemfail
                else if (status == 94) //fail
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.SystemFail) + " ";
                else if (status == 96) // partial Cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " AND IsCancelled=1 ";
                else if (status == 97) // For User Trade count
                    sCondition += " And TTQ.Status in (1,4,2)";

                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                //        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(18,8))as ChargeRs, " +
                //        " ISNULL(PreBal,0) as PreBal,ISNULL(PostBal,0) as PostBal from TradeTransactionQueue TTQ  " +
                //        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN WalletLedgers WL ON WL.Id = TTQ.MemberID  " +
                //        " WHERE TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate()) And TTQ.TrnType in (4,5) And TTQ.Status>0 "+ sCondition + " Order By TTQ.TrnNo Desc ";
                //Rita 4-3-19 remove pre-post bal ,not required
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(28,18))as ChargeRs, " +
                        " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty from TradeTransactionQueue TTQ  " +
                        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN WalletLedgers WL ON WL.Id = TTQ.MemberID  " +
                        " WHERE TTQ.TrnType in (4,5) And TTQ.Status In (1,2,3,4) " + sCondition + " Order By TTQ.TrnNo Desc ";

                IQueryable<GetTradingSummary> Result;
                //if (!String.IsNullOrEmpty(FromDate))
                //{
                //    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                //    ToDate = ToDate + " 23:59:59";
                //    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                Result = _dbContext.GetTradingSummary.FromSql(Qry, fDate, tDate);
                //}   
                //else
                //    Result = _dbContext.GetTradingSummary.FromSql(Qry);


                //Uday 12-01-2019 Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        //Rita 4-2-19 for Margin Trading
        public List<GetTradingSummary> GetTradingSummaryMargin(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                if (!string.IsNullOrEmpty(SMSCode))
                    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status == 91) // Order History
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) + " And IsCancelled=0 ";  //uday 27-12-2018 because its give partial cancel also
                else if (status == 95) //Active Order
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Hold) + " ";
                else if (status == 92) // partial settled
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Hold);
                else if (status == 93) // cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.OperatorFail) + " ";  //uday 27-12-2018 In Spot Order IsCanceled = 0 So its also consider as systemfail
                else if (status == 94) //fail
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.SystemFail) + " ";
                else if (status == 96) // partial Cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " AND IsCancelled=1 ";
                else if (status == 97) // For User Trade count
                    sCondition += " And TTQ.Status in (1,4,2)";

                //Rita 4-3-19 remove pre-post bal ,not required
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(28,18))as ChargeRs, " +
                        " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty from TradeTransactionQueueMargin TTQ  " +
                        " WHERE TTQ.TrnType in (4,5) And TTQ.Status In (1,2,3,4) " + sCondition + " Order By TTQ.TrnNo Desc ";

                IQueryable<GetTradingSummary> Result;

                Result = _dbContext.GetTradingSummary.FromSql(Qry, fDate, tDate);

                //Uday 12-01-2019 Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetTradingSummaryLP> GetTradingSummaryLP(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, string LPType, ref long TotalPages)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (!string.IsNullOrEmpty(LPType))//Rita 27-3-19 if no filter then display all lists
                    sCondition += " AND SD.AppTypeID In (" + LPType + ") ";

                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                if (!string.IsNullOrEmpty(SMSCode))
                    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status == 91) // Order History
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) + " And IsCancelled=0 ";  //uday 27-12-2018 because its give partial cancel also
                else if (status == 95) //Active Order
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Hold) + " ";
                else if (status == 92) // partial settled
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Hold);
                else if (status == 93) // cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.OperatorFail) + " ";  //uday 27-12-2018 In Spot Order IsCanceled = 0 So its also consider as systemfail
                else if (status == 94) //fail
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.SystemFail) + " ";
                else if (status == 96) // partial Cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " AND IsCancelled=1 ";
                else if (status == 97) // For User Trade count
                    sCondition += " And TTQ.Status in (1,4,2)";

                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                //        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(18,8))as ChargeRs, " +
                //        " ISNULL(PreBal,0) as PreBal,ISNULL(PostBal,0) as PostBal from TradeTransactionQueue TTQ  " +
                //        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN WalletLedgers WL ON WL.Id = TTQ.MemberID  " +
                //        " WHERE TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate()) And TTQ.TrnType in (4,5) And TTQ.Status>0 "+ sCondition + " Order By TTQ.TrnNo Desc ";

                //komal 01-02-2018 solve error add ServiceProviderDetail join
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(28,18))as ChargeRs, " +
                        " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty , Case When SD.AppTypeID = 9 Then 'Binance' When SD.AppTypeID = 10 Then 'Bittrex'" +
                        " When SD.AppTypeID = 11 Then 'TradeSatoshi' When SD.AppTypeID = 12 Then 'Poloniex' When SD.AppTypeID = 13 Then 'Coinbase' " +
                        " End As ProviderName from TradeTransactionQueue TTQ  " +
                        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo " +
                        " INNER JOIN ServiceProviderDetail SD ON TQ.SerProID=SD.ServiceProID " +
                        " WHERE TTQ.TrnType in (4,5) And TTQ.Status In (1,2,3,4) " + sCondition + " Order By TTQ.TrnNo Desc ";

                IQueryable<GetTradingSummaryLP> Result;
                //if (!String.IsNullOrEmpty(FromDate))
                //{
                //    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                //    ToDate = ToDate + " 23:59:59";
                //    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                Result = _dbContext.GetTradingSummaryLP.FromSql(Qry, fDate, tDate);
                //}   
                //else
                //    Result = _dbContext.GetTradingSummary.FromSql(Qry);


                //Uday 12-01-2019 Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetTradingReconHistory> GetTradingReconHistory(long MemberID, string FromDate, string ToDate, long TrnNo, short status, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, int LPType, ref long TotalPages, short? IsProcessing)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (trade != 999)
                    sCondition += " TTQ.TrnType=" + trade;
                else
                    sCondition += " TTQ.TrnType in (4, 5) ";

                if (LPType != 0)//Rita 27-3-19 if no filter then display all lists
                    sCondition += " AND SD.AppTypeID In (" + LPType + ") ";

                if (IsProcessing != 999 && IsProcessing != null) // khushali 30-03-2019 for IsProcessing filteration
                    sCondition += " AND (TS.IsProcessing = " + IsProcessing + " OR TB.IsProcessing = " + IsProcessing + " )";

                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                //if (!string.IsNullOrEmpty(SMSCode))
                //    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";                

                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status != 0)
                    sCondition += " And TTQ.Status =" + status;
                else if (status == 0) // For All status
                    sCondition += " And TTQ.Status In (1,2,3,4,9)";

                //khuhsali 04-04-2019 for with Fail mark - Success Mark case , success and debit
                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                //   " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price," +
                //   " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                //   " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast(0 as decimal(28, 18)) as ChargeRs, " +
                //   " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty," +
                //   " (Select Top 1 AppTypeName From Apptype Where ID = SD.AppTypeID) As ProviderName," +
                //   " CASE WHEN TTQ.TrnType = 5 THEN Isnull(TS.IsProcessing,0) WHEN TTQ.TrnType = 4 THEN Isnull(TB.IsProcessing,0) ELSE 0 END as IsProcessing, " +
                //   "Case When TTQ.Status = 1 Then '5,13' When TTQ.Status = 2 Then '2,3,13' When TTQ.Status = 3 Then '13' When TTQ.Status = 4 Then '3,5,8,9,10,12' When TTQ.Status = 9 Then '11' Else '0' End As ActionStage " +
                //   "from TradeTransactionQueue TTQ" +
                //   " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo " +
                //   " LEFT JOIN ServiceProviderDetail SD ON TQ.SerProID = SD.ServiceProID" +
                //   " LEFT JOIN  TradeSellerListV1 TS ON TS.TrnNo = TTQ.TrnNo" +
                //   " LEFT JOIN  TradeBuyerListV1 TB ON TB.TrnNo = TTQ.TrnNo" +
                //    " WHERE " + sCondition + " Order By TTQ.TrnNo Desc ";

                Qry = "Select Isnull(MM.UserName,'') AS UserName, Isnull(TTQ.IsAPITrade,0) AS IsAPITrade , TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                   " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price," +
                   " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                   " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast(0 as decimal(28, 18)) as ChargeRs, " +
                   " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty," +
                   " (Select Top 1 AppTypeName From Apptype Where ID = SD.AppTypeID) As ProviderName," +
                   " CASE WHEN TTQ.TrnType = 5 THEN Isnull(TS.IsProcessing,0) WHEN TTQ.TrnType = 4 THEN Isnull(TB.IsProcessing,0) ELSE 0 END as IsProcessing, " +
                   "Case When TTQ.Status = 1 Then '13' When TTQ.Status = 2 Then '13' When TTQ.Status = 3 Then '13' When TTQ.Status = 4 Then '8,9,10,12' When TTQ.Status = 9 Then '11' Else '0' End As ActionStage " +
                   "from TradeTransactionQueue TTQ" +
                   " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo " +
                   " LEFT JOIN ServiceProviderDetail SD ON TQ.SerProID = SD.ServiceProID" +
                   " LEFT JOIN  TradeSellerListV1 TS ON TS.TrnNo = TTQ.TrnNo" +
                   " LEFT JOIN  TradeBuyerListV1 TB ON TB.TrnNo = TTQ.TrnNo" +
                    " WHERE " + sCondition + " Order By TTQ.TrnNo Desc ";
                IQueryable<GetTradingReconHistory> Result;

                Result = _dbContext.GetTradingReconList.FromSql(Qry, fDate, tDate);

                // Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public List<TrnChargeSummaryViewModel> ChargeSummary(string FromDate, string ToDate, short trade)
        {
            string Qry = "";
            string sCondition = " 1=1 ";
            DateTime fDate, tDate;
            try
            {
                IQueryable<TrnChargeSummaryViewModel> Result;

                if (!String.IsNullOrEmpty(FromDate))
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TQ.Status>0 ";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                Qry = "select TTQ.TrnNo,TTQ.TrnTypeName,TTQ.TrnDate,TTQ.PairName,TQ.Amount,TQ.ChargePer,TQ.ChargeRs, " +
                                        " CASE WHEN TQ.ChargeType = 1 THEN 'Percentage' WHEN TQ.ChargeType = 1 THEN 'Fixed' END as ChargeType " +
                                        " from TransactionQueue TQ Inner Join TradeTransactionQueue TTQ on TTQ.TrnNo = TQ.Id where " + sCondition + " AND TQ.Status = 1";

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                    Result = _dbContext.chargeSummaryViewModels.FromSql(Qry, fDate, tDate);
                }
                else
                    Result = _dbContext.chargeSummaryViewModels.FromSql(Qry);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<WithdrawalSummaryViewModel> GetWithdrawalSummary(WithdrawalSummaryRequest Request)
        {
            try
            {
                IQueryable<WithdrawalSummaryViewModel> Result;
                DateTime fDate, tDate;
                string Qry = "";

                fDate = DateTime.ParseExact(Request.FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                Request.ToDate = Request.ToDate + " 23:59:59";
                tDate = DateTime.ParseExact(Request.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                Qry = "Select TQ.Id as TrnNo,TQ.MemberID,TQ.Amount,TQ.TrnDate,TQ.TransactionAccount As DestAddress,ISNULL(TQ.DebitAccountId,'') As DebitAccountId," +
                      " CASE TQ.Status WHEN 0 THEN 'Initialize' WHEN 1 THEN 'Success' WHEN 2 THEN 'OperatorFail' WHEN 3 THEN" +
                      "'SystemFail'  WHEn 4 THEN 'Hold' WHEN 5 THEN 'Refunded' WHEN 6 THEN 'Pending' ELSE 'Other' END AS 'StatusText'," +
                      " TQ.SMSCode As ServiceName,ISNULL(TQ.ChargeRs,0) As ChargeRs From TransactionQueue TQ" +
                      " Where TQ.TrnType = 6 And TQ.TrnDate Between {0} And {1} And (TQ.MemberID = {2} Or {2} = 0) And (TQ.Id = {3} Or {3} = 0) " +
                      " And (TQ.Status = {4} Or {4} = 0) And (TQ.SMSCode = {5} or {5} = '')";

                Result = _dbContext.WithdrawalSummaryViewModel.FromSql(Qry, fDate, tDate, Request.MemberID, Request.TrnNo, Request.Status, Request.SMSCode);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<PairTradeSummaryQryResponse> PairTradeSummary(long PairID, short Market, short Range)
        {
            try
            {
                using (_dbContext)
                {
                    String Condi = " ";
                    String str = "";

                    if (Range == 1)//day
                        Condi += " AND TTQ.TrnDate > DATEADD(HOUR, -24,dbo.GetISTDate()) ";
                    if (Range == 2)//week
                        Condi += " AND TTQ.TrnDate > DATEADD(DAY, -7,dbo.GetISTDate()) ";
                    if (Range == 3)//month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -1,dbo.GetISTDate()) ";
                    if (Range == 4)//3month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -3,dbo.GetISTDate()) ";
                    if (Range == 5)//6month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -6,dbo.GetISTDate()) ";
                    if (Range == 6)//1year
                        Condi += " AND TTQ.TrnDate > DATEADD(YEAR, -1,dbo.GetISTDate()) ";
                    if (Market != 999)
                        Condi += " AND TTQ.ordertype=" + Market;

                    IQueryable<PairTradeSummaryQryResponse> Result = null;

                    str = "select TPM.Id,TPM.PairName,TTQ.ordertype,count(TTQ.TrnNo) as TradeCount, " +
                        "count(CASE WHEN TTQ.TrnType = 4 then 1 end) as buy,count(CASE WHEN TTQ.TrnType = 5 then 1 end) as sell, " +
                        "count(CASE WHEN TTQ.status = 1 then 1 end) as Settled,count(CASE WHEN TTQ.status = 2 then 1 end) as Cancelled, " +
                        "max(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) else 0 end) as high," +
                        "ISNULL(min(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) end), 0) as low," +
                        "ISNULL(sum(SettledBuyQty * BidPrice) + sum(SettledSellQty * askprice), 0) as Volume," +
                        "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueue TTQ " +
                        "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo Desc),0) As LTP, " +
                        "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueue TTQ " +
                        "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo),0) As OpenP " +
                        "from TradePairMaster TPM INNER Join TradeTransactionQueue TTQ On TTQ.PairID = TPM.Id " + Condi + " Group By TPM.Id,TPM.PairName,TTQ.ordertype order by TPM.PairName";
                    if (PairID != 999)
                    {
                        str = "select TPM.Id,TPM.PairName,TTQ.ordertype,count(TTQ.TrnNo) as TradeCount, " +
                       "count(CASE WHEN TTQ.TrnType = 4 then 1 end) as buy,count(CASE WHEN TTQ.TrnType = 5 then 1 end) as sell, " +
                       "count(CASE WHEN TTQ.status = 1 then 1 end) as Settled,count(CASE WHEN TTQ.status = 2 then 1 end) as Cancelled, " +
                       "max(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) else 0 end) as high," +
                       "ISNULL(min(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) end), 0) as low," +
                       "ISNULL(sum(SettledBuyQty * BidPrice) + sum(SettledSellQty * askprice), 0) as Volume," +
                       "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueue TTQ " +
                       "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo Desc),0) As LTP, " +
                       "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueue TTQ " +
                       "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo),0) As OpenP " +
                       "from TradePairMaster TPM INNER Join TradeTransactionQueue TTQ On TTQ.PairID = TPM.Id Where TPM.Id={0}" + Condi + " Group By TPM.Id,TPM.PairName,TTQ.ordertype order by TPM.PairName";
                    }
                    Result = _dbContext.PairTradeSummaryViewModel.FromSql(str, PairID);

                    return Result.ToList();
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rita 5-3-19 for Margin Trading Data bit
        public List<PairTradeSummaryQryResponse> PairTradeSummaryMargin(long PairID, short Market, short Range)
        {
            try
            {
                using (_dbContext)
                {
                    String Condi = " ";
                    String str = "";

                    if (Range == 1)//day
                        Condi += " AND TTQ.TrnDate > DATEADD(HOUR, -24,dbo.GetISTDate()) ";
                    if (Range == 2)//week
                        Condi += " AND TTQ.TrnDate > DATEADD(DAY, -7,dbo.GetISTDate()) ";
                    if (Range == 3)//month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -1,dbo.GetISTDate()) ";
                    if (Range == 4)//3month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -3,dbo.GetISTDate()) ";
                    if (Range == 5)//6month
                        Condi += " AND TTQ.TrnDate > DATEADD(MONTH, -6,dbo.GetISTDate()) ";
                    if (Range == 6)//1year
                        Condi += " AND TTQ.TrnDate > DATEADD(YEAR, -1,dbo.GetISTDate()) ";
                    if (Market != 999)
                        Condi += " AND TTQ.ordertype=" + Market;

                    IQueryable<PairTradeSummaryQryResponse> Result = null;

                    str = "select TPM.Id,TPM.PairName,TTQ.ordertype,count(TTQ.TrnNo) as TradeCount, " +
                        "count(CASE WHEN TTQ.TrnType = 4 then 1 end) as buy,count(CASE WHEN TTQ.TrnType = 5 then 1 end) as sell, " +
                        "count(CASE WHEN TTQ.status = 1 then 1 end) as Settled,count(CASE WHEN TTQ.status = 2 then 1 end) as Cancelled, " +
                        "max(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) else 0 end) as high," +
                        "ISNULL(min(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) end), 0) as low," +
                        "ISNULL(sum(SettledBuyQty * BidPrice) + sum(SettledSellQty * askprice), 0) as Volume," +
                        "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueueMargin TTQ " +
                        "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo Desc),0) As LTP, " +
                        "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueueMargin TTQ " +
                        "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo),0) As OpenP " +
                        "from TradePairMasterMargin TPM INNER Join TradeTransactionQueueMargin TTQ On TTQ.PairID = TPM.Id " + Condi + " Group By TPM.Id,TPM.PairName,TTQ.ordertype order by TPM.PairName";
                    if (PairID != 999)
                    {
                        str = "select TPM.Id,TPM.PairName,TTQ.ordertype,count(TTQ.TrnNo) as TradeCount, " +
                       "count(CASE WHEN TTQ.TrnType = 4 then 1 end) as buy,count(CASE WHEN TTQ.TrnType = 5 then 1 end) as sell, " +
                       "count(CASE WHEN TTQ.status = 1 then 1 end) as Settled,count(CASE WHEN TTQ.status = 2 then 1 end) as Cancelled, " +
                       "max(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) else 0 end) as high," +
                       "ISNULL(min(case when TTQ.status = 1 then(CASE WHEN TTQ.TrnType = 4 then BidPrice WHEN TTQ.TrnType = 5 then AskPrice end) end), 0) as low," +
                       "ISNULL(sum(SettledBuyQty * BidPrice) + sum(SettledSellQty * askprice), 0) as Volume," +
                       "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueueMargin TTQ " +
                       "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo Desc),0) As LTP, " +
                       "ISNULL((Select Top 1 Case When TTQ.TrnType = 4 Then TTQ.BidPrice When TTQ.TrnType = 5 Then TTQ.AskPrice END From TradeTransactionQueueMargin TTQ " +
                       "Where TTQ.PairID = TPM.Id And TTQ.Status = 1 " + Condi + " Order By TTQ.TrnNo),0) As OpenP " +
                       "from TradePairMasterMargin TPM INNER Join TradeTransactionQueueMargin TTQ On TTQ.PairID = TPM.Id Where TPM.Id={0}" + Condi + " Group By TPM.Id,TPM.PairName,TTQ.ordertype order by TPM.PairName";
                    }
                    Result = _dbContext.PairTradeSummaryViewModel.FromSql(str, PairID);

                    return Result.ToList();
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TradeSettledHistory> TradeSettledHistory(int PageSize, int PageNo, ref long TotalPages, ref long TotalCount, ref int PageSize1, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0)
        {
            try
            {
                List<TradeSettledHistory> list = new List<TradeSettledHistory>();
                List<TradePoolHistory> TradesH;
                IQueryable<TradeSettledHistoryQueryResponse2> Result;
                DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
                string str = "";
                string Condition = "";

                if (!string.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    Todate = Todate + " 23:59:59";
                    tDate = DateTime.ParseExact(Todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    Condition += " AND TTQ.TrnDate between {0} AND {1} ";
                }
                else
                {
                    Condition += " AND TTQ.TrnDate > DATEADD(day, -7,dbo.GetISTDate())";
                }

                if (PairID != 999)
                    Condition += " AND TTQ.PairID=" + PairID;
                if (TrnType != 999)
                    Condition += " AND TTQ.TrnType=" + TrnType;
                if (OrderType != 999)
                    Condition += " AND TTQ.orderType=" + OrderType;
                if (MemberID != 0)
                    Condition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo != 0)
                    Condition += " AND TTQ.TrnNo=" + TrnNo;

                str = "select TTQ.PairID,TTQ.PairName,TTQ.TrnDate,TTQ.MemberID,TTQ.orderType, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice END AS Price1, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END AS Qty1, TTQ.TrnNo, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerTrnNo WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerTrnNo END AS Trade, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerPrice WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerPrice END AS Price, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerQty WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerQty END AS QTY, TTQ.TrnTypeName, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerType WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerType END AS TradeType " +
                            "from TradeTransactionQueue TTQ INNER Join TradePoolQueueV1 TP ON(TP.MakerTrnNo= TTQ.TrnNo or TP.TakerTrnNo= TTQ.TrnNo) " +
                            "where TTQ.Status in (1, 4) " + Condition + " order by TTQ.TrnNo";

                //Result = _dbContext.SettledHistory2.FromSql(
                //                    @"select TTQ.PairID,TTQ.PairName,TTQ.TrnDate,TTQ.MemberID,TTQ.orderType,
                //                        CASE WHEN TTQ.TrnType=4 THEN TTQ.BidPrice WHEN TTQ.TrnType=5 THEN TTQ.AskPrice END AS Price1,
                //                        CASE WHEN TTQ.TrnType=4 THEN TTQ.BuyQty WHEN TTQ.TrnType=5 THEN TTQ.SellQty END AS Qty1,TTQ.TrnNo,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerTrnNo WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerTrnNo END AS Trade,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerPrice WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerPrice END AS Price,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerQty WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerQty END AS QTY,TTQ.TrnTypeName,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerType WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerType END AS TradeType
                //                        from TradeTransactionQueue TTQ INNER Join TradePoolQueueV1 TP ON (TP.MakerTrnNo=TTQ.TrnNo or TP.TakerTrnNo=TTQ.TrnNo)
                //                        where (TTQ.TrnDate > {4} and TTQ.TrnDate < {5} )AND TTQ.Status in (1,4) AND (TTQ.TrnType={1} or {1}=999) 
                //                        AND (TTQ.PairID={0} or {0}=999) AND (TTQ.orderType={2} or {2}=999) AND (TTQ.MemberID={3} or {3}=0) AND (TTQ.TrnNo={6} or {6}=0)
                //                        order by TTQ.TrnNo", PairID, TrnType, OrderType,MemberID, fDate,tDate,TrnNo);


                Result = _dbContext.SettledHistory2.FromSql(str, fDate, tDate);
                var HistoryData = Result.ToList().GroupBy(e => e.TrnNo);
                var Count = 0;
                foreach (var History in HistoryData.ToList())
                {

                    TradesH = new List<TradePoolHistory>();
                    TradeSettledHistory obj = null;
                    Count += 1;
                    var cnt = 0;
                    foreach (var subHistory in History)
                    {
                        TradesH.Add(new TradePoolHistory()
                        {
                            Price = subHistory.Price,
                            Qty = subHistory.QTY,
                            TrnNo = subHistory.Trade,
                            TrnType = subHistory.TradeType,
                        });
                        if (cnt == 0)
                        {
                            obj = new TradeSettledHistory()
                            {
                                MemberID = subHistory.MemberID,
                                PairID = subHistory.PairID,
                                PairName = subHistory.PairName,
                                Price = subHistory.Price1,
                                Qty = subHistory.Qty1,
                                TrnDate = subHistory.TrnDate,
                                TrnType = subHistory.TrnTypeName,
                                TrnNo = subHistory.TrnNo,
                                OrderType = Enum.GetName(typeof(enTransactionMarketType), subHistory.orderType),
                                Trades = TradesH
                            };
                            cnt = 1;
                        }
                    }
                    list.Add(obj);
                }

                //return list;

                //Uday 12-01-2019 Add Pagination
                var items = list;
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 22-2-19 for Margin Trading Data bit
        public List<TradeSettledHistory> TradeSettledHistoryMargin(int PageSize, int PageNo, ref long TotalPages, ref long TotalCount, ref int PageSize1, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0)
        {
            try
            {
                List<TradeSettledHistory> list = new List<TradeSettledHistory>();
                List<TradePoolHistory> TradesH;
                IQueryable<TradeSettledHistoryQueryResponse2> Result;
                DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
                string str = "";
                string Condition = "";

                if (!string.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    Todate = Todate + " 23:59:59";
                    tDate = DateTime.ParseExact(Todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    Condition += " AND TTQ.TrnDate between {0} AND {1} ";
                }
                else
                {
                    Condition += " AND TTQ.TrnDate > DATEADD(day, -7,dbo.GetISTDate())";
                }

                if (PairID != 999)
                    Condition += " AND TTQ.PairID=" + PairID;
                if (TrnType != 999)
                    Condition += " AND TTQ.TrnType=" + TrnType;
                if (OrderType != 999)
                    Condition += " AND TTQ.orderType=" + OrderType;
                if (MemberID != 0)
                    Condition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo != 0)
                    Condition += " AND TTQ.TrnNo=" + TrnNo;

                str = "select TTQ.PairID,TTQ.PairName,TTQ.TrnDate,TTQ.MemberID,TTQ.orderType, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice END AS Price1, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END AS Qty1, TTQ.TrnNo, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerTrnNo WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerTrnNo END AS Trade, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerPrice WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerPrice END AS Price, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerQty WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerQty END AS QTY, TTQ.TrnTypeName, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerType WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerType END AS TradeType " +
                            "from TradeTransactionQueueMargin TTQ INNER Join TradePoolQueueMarginV1 TP ON(TP.MakerTrnNo= TTQ.TrnNo or TP.TakerTrnNo= TTQ.TrnNo) " +
                            "where TTQ.Status in (1, 4) " + Condition + " order by TTQ.TrnNo";

                Result = _dbContext.SettledHistory2.FromSql(str, fDate, tDate);
                var HistoryData = Result.ToList().GroupBy(e => e.TrnNo);
                var Count = 0;
                foreach (var History in HistoryData.ToList())
                {

                    TradesH = new List<TradePoolHistory>();
                    TradeSettledHistory obj = null;
                    Count += 1;
                    var cnt = 0;
                    foreach (var subHistory in History)
                    {
                        TradesH.Add(new TradePoolHistory()
                        {
                            Price = subHistory.Price,
                            Qty = subHistory.QTY,
                            TrnNo = subHistory.Trade,
                            TrnType = subHistory.TradeType,
                        });
                        if (cnt == 0)
                        {
                            obj = new TradeSettledHistory()
                            {
                                MemberID = subHistory.MemberID,
                                PairID = subHistory.PairID,
                                PairName = subHistory.PairName,
                                Price = subHistory.Price1,
                                Qty = subHistory.Qty1,
                                TrnDate = subHistory.TrnDate,
                                TrnType = subHistory.TrnTypeName,
                                TrnNo = subHistory.TrnNo,
                                OrderType = Enum.GetName(typeof(enTransactionMarketType), subHistory.orderType),
                                Trades = TradesH
                            };
                            cnt = 1;
                        }
                    }
                    list.Add(obj);
                }

                //return list;

                //Uday 12-01-2019 Add Pagination
                var items = list;
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        #endregion

        #region  Configuration And BackOffice Get methods

        public List<TradePairConfigRequest> GetAllPairConfiguration()
        {
            try
            {
                IQueryable<TradePairConfigRequest> Result;

                Result = _dbContext.PairConfigurationResponse.FromSql(
                                    @"Select TPM.Id,TPM.PairName,SM.Name as MarketName,TPM.SecondaryCurrencyId,TPM.WalletMasterID,TPM.BaseCurrencyId,TPM.Status,'' as StatusText,TPD.ChargeType, ISNULL(TPD.OpenOrderExpiration,0)as OpenOrderExpiration,
                                    TPD.BuyMinQty,TPD.BuyMaxQty,TPD.SellMinQty,TPD.SellMaxQty,TPD.SellPrice,TPD.BuyPrice,TPD.BuyMinPrice,TPD.BuyMaxPrice,
                                    TPD.SellMinPrice,TPD.SellMaxPrice,TPD.BuyFees,TPD.SellFees,TPD.FeesCurrency,TPS.ChangeVol24 As Volume,TPS.CurrentRate As Currentrate,TPS.CurrencyPrice
                                    from TradePairMaster TPM Inner Join TradePairDetail TPD On TPD.PairId = TPM.Id  Inner Join TradePairStastics TPS On TPS.PairId = TPM.Id Inner join ServiceMaster SM on TPM.BaseCurrencyId=SM.Id Where TPM.Status = 1 or TPM.Status = 0 Order By TPM.Id");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 22-2-19 for Margin Trading Data bit

        public List<TradePairConfigRequest> GetAllPairConfigurationMargin()
        {
            try
            {
                IQueryable<TradePairConfigRequest> Result;

                Result = _dbContext.PairConfigurationResponse.FromSql(
                                    @"Select TPM.Id,TPM.PairName,SM.Name as MarketName,TPM.SecondaryCurrencyId,TPM.WalletMasterID,TPM.BaseCurrencyId,TPM.Status,'' as StatusText,TPD.ChargeType, ISNULL(TPD.OpenOrderExpiration,0)as OpenOrderExpiration,
                                    TPD.BuyMinQty,TPD.BuyMaxQty,TPD.SellMinQty,TPD.SellMaxQty,TPD.SellPrice,TPD.BuyPrice,TPD.BuyMinPrice,TPD.BuyMaxPrice,
                                    TPD.SellMinPrice,TPD.SellMaxPrice,TPD.BuyFees,TPD.SellFees,TPD.FeesCurrency,TPS.ChangeVol24 As Volume,TPS.CurrentRate As Currentrate,TPS.CurrencyPrice
                                    from TradePairMasterMargin TPM Inner Join TradePairDetailMargin TPD On TPD.PairId = TPM.Id  Inner Join TradePairStastics TPS On TPS.PairId = TPM.Id Inner join ServiceMaster SM on TPM.BaseCurrencyId=SM.Id Where TPM.Status = 1 or TPM.Status = 0 Order By TPM.Id");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ProductConfigrationGetInfo> GetAllProductConfiguration()
        {
            try
            {
                IQueryable<ProductConfigrationGetInfo> Result;

                Result = _dbContext.ProductConfigrationResponse.FromSql(
                                    @"Select PC.Id,PC.ProductName,PC.ServiceID,PC.CountryID,SM.Name As ServiceName,CM.CountryName From ProductConfiguration PC
                                      Inner Join ServiceMaster SM On SM.Id = PC.ServiceID Inner Join CountryMaster CM ON CM.Id = PC.CountryID Where PC.Status = 1 Order By PC.Id");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<AvailableRoute> GetAvailableRoute()
        {
            try
            {
                IQueryable<AvailableRoute> Result;

                Result = _dbContext.AvailableRoutes.FromSql(
                                    @"select PM.ProviderName,TPC.APIName,TPC.APISendURL,PD.Id from ServiceProviderMaster PM
                                        INNER JOIN ServiceProviderDetail PD ON PD.ServiceProID=PM.Id INNER JOIN ThirdPartyAPIConfiguration TPC ON PD.ThirPartyAPIID=TPC.Id
                                        Where PD.TrnTypeID=6 AND PD.Status=1");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<WithdrawRouteConfig> GetWithdrawRoute(long ID, enTrnType? TrnType)
        {
            try
            {
                IQueryable<IGrouping<long,RouteConfiguration>> listserviceid;
                IQueryable<GetAllWithdrawQueryResponse> Result;
                List<WithdrawRouteConfig> list = new List<WithdrawRouteConfig>();
                List<ProviderRoute> routes;
                if (TrnType != null)
                {
                    listserviceid = _dbContext.RouteConfiguration.Where(e => ((e.ServiceID == ID || ID == 0) && e.Status != 9 && e.TrnType==TrnType)).GroupBy(e => e.ServiceID);
                }
                else
                {
                     listserviceid= _dbContext.RouteConfiguration.Where(e => ((e.ServiceID == ID || ID == 0) && e.Status != 9)).GroupBy(e => e.ServiceID);
                }
                foreach (var service in listserviceid)
                {
                    Result = _dbContext.WithdrawRoute.FromSql(
                                   @"select Id,RouteName,status,Priority ,ServiceID ,OpCode ,ProviderWalletID ,SerProDetailID,(select top 1 PM.ProviderName from ServiceProviderMaster PM
                                        INNER JOIN ServiceProviderDetail PD ON PD.ServiceProID=PM.Id Where PD.Status=1  AND (PD.TrnTypeID={1} OR {1}=0)) as route ,ConvertAmount,ConfirmationCount,
                                        TrnType,ISNULL(AccNoStartsWith,'')AS 'AccNoStartsWith',ISNULL(AccNoValidationRegex,'')AS 'AccNoValidationRegex',AccountNoLen
                                        from RouteConfiguration where ServiceID={0} AND (TrnType={1} OR {1}=0) and Status<>9 order by CreatedDate ", service.Key, Convert.ToInt16(TrnType == null ? 0 : TrnType));//TrnType=6 AND PD.TrnTypeID=6 Rushabh
                    var CurName = "";
                    short st = 1;
                    int Ttype = 0;
                    //var AccNoStartsWith = "";
                    //var AccNoValidationRegex = "";
                    //var AccountNoLen = 0;
                    routes = new List<ProviderRoute>();
                    foreach (var model in Result.ToList())
                    {
                        CurName = model.RouteName;
                        st = model.status;
                        Ttype = Convert.ToInt32(model.TrnType);
                        //AccNoStartsWith = model.AccNoStartsWith;
                        //AccNoValidationRegex = model.AccNoValidationRegex;
                        //AccountNoLen = model.AccountNoLen;

                        routes.Add(new ProviderRoute()
                        {
                            AssetName = model.OpCode,
                            ConfirmationCount = model.ConfirmationCount,
                            ConvertAmount = model.ConvertAmount,
                            Id = model.Id,
                            Priority = model.Priority,
                            ProviderWalletID = model.ProviderWalletID,
                            ServiceProDetailId = model.SerProDetailID,
                            RouteName = model.route,
                            AccNoStartsWith = model.AccNoStartsWith,
                            AccNoValidationRegex = model.AccNoValidationRegex,
                            AccountNoLen = model.AccountNoLen
                        });
                    }
                    list.Add(new WithdrawRouteConfig()
                    {
                        CurrencyName = CurName,
                        TrnType = (enTrnType)Ttype,
                        status = st,
                        ServiceID = service.Key,
                        AvailableRoute = routes
                    });
                }
                return list;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ListPairInfo> ListPairInfo()
        {
            try
            {
                IQueryable<ListPairInfo> Result;

                Result = _dbContext.ListPairInfo.FromSql(
                                    @"select TP.Id as PairId,TP.PairName,TP.Status,(Select top 1 Name from ServiceMaster Where id=TP.BaseCurrencyId) as BaseCurrency,
                                        (Select top 1 Name from ServiceMaster Where id=TP.SecondaryCurrencyId) as ChildCurrency  from TradePairMaster TP  where TP.Status=1");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        //Rita 12-3-19 for Margin Trading
        public List<ListPairInfo> ListPairInfoMargin()
        {
            try
            {
                IQueryable<ListPairInfo> Result;

                Result = _dbContext.ListPairInfo.FromSql(
                                    @"select TP.Id as PairId,TP.PairName,TP.Status,(Select top 1 Name from ServiceMasterMargin Where id=TP.BaseCurrencyId) as BaseCurrency,
                                        (Select top 1 Name from ServiceMasterMargin Where id=TP.SecondaryCurrencyId) as ChildCurrency  from TradePairMasterMargin TP  where TP.Status=1");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetTradeRouteConfigurationData> GetTradeRouteConfiguration(long Id)
        {
            try
            {
                IQueryable<GetTradeRouteConfigurationData> Result;

                Result = _dbContext.TradeRouteConfigurationData.FromSql(
                                    @"Select RC.Id,RC.RouteName As TradeRouteName,RC.PairId,TPM.PairName,RC.OrderType,'' As OrderTypeText,RC.TrnType,'' As TrnTypeText,
                                        RC.Status,'' As StatusText,RC.SerProDetailID As RouteUrlId,TPA.APISendURL As RouteUrl,RC.OpCode As AssetName,
                                        RC.ConvertAmount,RC.ConfirmationCount,RC.Priority from RouteConfiguration RC
                                        Inner Join TradePairMaster TPM On TPM.Id = RC.PairId
                                        Inner Join ServiceProviderDetail SPD On SPD.Id = RC.SerProDetailID
                                        Left Outer Join ThirdPartyAPIConfiguration TPA On TPA.Id = SPD.ThirPartyAPIID
                                        Where RC.ID = {0} Or {0} = 0", Id);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<AvailableRoute> GetAvailableTradeRoute(int TrnType)
        {
            try
            {
                IQueryable<AvailableRoute> Result;

                Result = _dbContext.AvailableRoutes.FromSql(
                                    @"Select PM.ProviderName,TPC.APIName,TPC.APISendURL,PD.Id from ServiceProviderMaster PM
                                      INNER JOIN ServiceProviderDetail PD ON PD.ServiceProID=PM.Id Left Outer JOIN ThirdPartyAPIConfiguration TPC ON PD.ThirPartyAPIID=TPC.Id
                                      Where PD.TrnTypeID= {0} AND PD.Status=1", TrnType);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetTradeRouteConfigurationData> GetTradeRouteForPriority(long PairId, long OrderType, int TrnType)
        {
            try
            {
                IQueryable<GetTradeRouteConfigurationData> Result;

                Result = _dbContext.TradeRouteConfigurationData.FromSql(
                                    @"Select RC.Id,RC.RouteName As TradeRouteName,RC.PairId,TPM.PairName,RC.OrderType,'' As OrderTypeText,RC.TrnType,'' As TrnTypeText,
                                        RC.Status,'' As StatusText,RC.SerProDetailID As RouteUrlId,TPA.APISendURL As RouteUrl,RC.OpCode As AssetName,
                                        RC.ConvertAmount,RC.ConfirmationCount,RC.Priority from RouteConfiguration RC
                                        Inner Join TradePairMaster TPM On TPM.Id = RC.PairId
                                        Inner Join ServiceProviderDetail SPD On SPD.Id = RC.SerProDetailID
                                        Left Outer Join ThirdPartyAPIConfiguration TPA On TPA.Id = SPD.ThirPartyAPIID
                                        Where RC.PairId = {0} And RC.OrderType = {1} And RC.TrnType = {2}", PairId, OrderType, TrnType);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<MarketTickerPairData> GetMarketTickerPairData()
        {
            try
            {
                IQueryable<MarketTickerPairData> Result;

                Result = _dbContext.MarketTickerPairData.FromSql(
                                    @"Select TPM.Id As PairId,TPM.PairName,TPD.IsMarketTicker from TradePairMaster TPM Inner Join TradePairDetail TPD ON TPD.PairId = TPM.Id Order By TPM.BaseCurrencyId,TPM.SecondaryCurrencyId");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<MarketTickerPairData> GetMarketTickerPairDataMargin()
        {
            try
            {
                IQueryable<MarketTickerPairData> Result;

                Result = _dbContext.MarketTickerPairData.FromSql(
                                    @"Select TPM.Id As PairId,TPM.PairName,TPD.IsMarketTicker from TradePairMasterMargin TPM Inner Join TradePairDetailMargin TPD ON TPD.PairId = TPM.Id Order By TPM.BaseCurrencyId,TPM.SecondaryCurrencyId");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public int UpdateMarketTickerPairData(List<long> PairId, long UserId)
        {
            try
            {
                var MarketTickerIsOn = _dbContext.TradePairDetail.Where(x => PairId.Contains(x.PairId));

                var MarketTickerIsOff = _dbContext.TradePairDetail.Where(x => !PairId.Contains(x.PairId));

                _dbContext.Database.BeginTransaction();

                foreach (var pair in MarketTickerIsOn)
                {
                    pair.IsMarketTicker = 1;
                    _dbContext.Entry(pair).State = EntityState.Modified;
                }

                foreach (var pair in MarketTickerIsOff)
                {
                    pair.IsMarketTicker = 0;
                    _dbContext.Entry(pair).State = EntityState.Modified;
                }

                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();

                return 1;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }
        
        //Rita 5-3-19 for Margin Trading
        public int UpdateMarketTickerPairDataMargin(List<long> PairId, long UserId)
        {
            try
            {
                var MarketTickerIsOn = _dbContext.TradePairDetailMargin.Where(x => PairId.Contains(x.PairId));

                var MarketTickerIsOff = _dbContext.TradePairDetailMargin.Where(x => !PairId.Contains(x.PairId));

                _dbContext.Database.BeginTransaction();

                foreach (var pair in MarketTickerIsOn)
                {
                    pair.IsMarketTicker = 1;
                    _dbContext.Entry(pair).State = EntityState.Modified;
                }

                foreach (var pair in MarketTickerIsOff)
                {
                    pair.IsMarketTicker = 0;
                    _dbContext.Entry(pair).State = EntityState.Modified;
                }

                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();

                return 1;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public List<VolumeDataRespose> GetUpdatedMarketTicker()
        {
            try
            {
                IQueryable<VolumeDataRespose> Result;

                Result = _dbContext.MarketTickerVolumeDataRespose.FromSql(
                                    @"Select TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume24,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit from TradePairMaster TPM
                                    Inner Join TradePairDetail TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Where TPD.IsMarketTicker = 1");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        //Rita 5-3-19 for Margin Trading
        public List<VolumeDataRespose> GetUpdatedMarketTickerMargin()
        {
            try
            {
                IQueryable<VolumeDataRespose> Result;

                Result = _dbContext.MarketTickerVolumeDataRespose.FromSql(
                                    @"Select TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume24,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit from TradePairMasterMargin TPM
                                    Inner Join TradePairDetailMargin TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Where TPD.IsMarketTicker = 1");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetTopGainerPair(int Type)
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise)) //Volume Wise (High to Low Volume Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                   @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Where TPM.Status = 1 Order By TPS.ChangeVol24 Desc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise)) //Chnage Per Wise (High to Low ChangePer Wise Pair Data, And Only > 0 ChnagePer)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                 @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Where TPS.ChangePer24 > 0 And TPM.Status = 1 Order By TPS.ChangePer24 Desc ");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise))  //LTP Wise (High to Low LTP Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                        Where TPS.LTP > 0 And TPM.Status = 1 Order By TPS.LTP Desc ");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))  //Change Value Wise (High to Low ChangeValue Wise Pair Data, And Only > 0 Chnagevalue)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                        Where TPS.ChangeValue > 0 And TPM.Status = 1 Order By TPS.ChangeValue Desc ");
                }

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        //Rita 5-3-19 for Margin Trading
        public List<TopLooserGainerPairData> GetTopGainerPairMargin(int Type)
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise)) //Volume Wise (High to Low Volume Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                   @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Where TPM.Status = 1 Order By TPS.ChangeVol24 Desc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise)) //Chnage Per Wise (High to Low ChangePer Wise Pair Data, And Only > 0 ChnagePer)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                 @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Where TPS.ChangePer24 > 0 And TPM.Status = 1 Order By TPS.ChangePer24 Desc ");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise))  //LTP Wise (High to Low LTP Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                        Where TPS.LTP > 0 And TPM.Status = 1 Order By TPS.LTP Desc ");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))  //Change Value Wise (High to Low ChangeValue Wise Pair Data, And Only > 0 Chnagevalue)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                        Where TPS.ChangeValue > 0 And TPM.Status = 1 Order By TPS.ChangeValue Desc ");
                }

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetTopLooserPair(int Type)
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise))  //Volume Wise (Low to High Volume Wise Pair Data) 
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                   @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Where TPM.Status = 1 Order By TPS.ChangeVol24 Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise))  //Chnage Per Wise (Low to High ChangePer Wise Pair Data, And Only < 0 ChnagePer)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                 @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Where TPS.ChangePer24 < 0 And TPM.Status = 1 Order By TPS.ChangePer24 Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise))  // LTP Wise (Low to High LTP Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                        Where TPS.LTP > 0 And TPM.Status = 1 Order By TPS.LTP Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))  // Change Value Wise (Low to High ChangeValue Wise Pair Data, And Only < 0 Chnagevalue)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                        Where TPS.ChangeValue < 0 And TPM.Status = 1 Order By TPS.ChangeValue Asc");
                }

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        //Rita 5-3-19 for Margin Trading
        public List<TopLooserGainerPairData> GetTopLooserPairMargin(int Type)
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                if (Type == Convert.ToInt32(EnTopLossGainerFilterType.VolumeWise))  //Volume Wise (Low to High Volume Wise Pair Data) 
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                   @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Where TPM.Status = 1 Order By TPS.ChangeVol24 Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangePerWise))  //Chnage Per Wise (Low to High ChangePer Wise Pair Data, And Only < 0 ChnagePer)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                 @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                    TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Where TPS.ChangePer24 < 0 And TPM.Status = 1 Order By TPS.ChangePer24 Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.LTPWise))  // LTP Wise (Low to High LTP Wise Pair Data)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                        Where TPS.LTP > 0 And TPM.Status = 1 Order By TPS.LTP Asc");
                }
                else if (Type == Convert.ToInt32(EnTopLossGainerFilterType.ChangeValueWise))  // Change Value Wise (Low to High ChangeValue Wise Pair Data, And Only < 0 Chnagevalue)
                {
                    Result = _dbContext.TopLooserPairData.FromSql(
                                       @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                        TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                        Where TPS.ChangeValue < 0 And TPM.Status = 1 Order By TPS.ChangeValue Asc");
                }

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetTopLooserGainerPair()
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                //Uday 01-01-2019  Pair Name Wise Filteration in Ascending Order 
                Result = _dbContext.TopLooserPairData.FromSql(
                                @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMaster TPM Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                Where TPM.Status = 1 Order By TPM.PairName");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
       
        //Rita 5-3-19 for Margin Trading
        public List<TopLooserGainerPairData> GetTopLooserGainerPairMargin()
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                //Uday 01-01-2019  Pair Name Wise Filteration in Ascending Order 
                Result = _dbContext.TopLooserPairData.FromSql(
                                @"Select TPM.Id As PairId,TPM.PairName,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,
                                TPS.LTP,TPS.High24Hr As High,TPS.Low24Hr As Low,TPS.ChangeValue,TPS.UpDownBit From TradePairMasterMargin TPM Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                Where TPM.Status = 1 Order By TPM.PairName");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        
        #endregion

        #region ReconMethod
        public bool WithdrawalRecon(TransactionRecon transactionRecon, TransactionQueue TransactionQueue, WithdrawHistory _WithdrawHistory = null, WithdrawERCTokenQueue _WithdrawERCTokenQueueObj = null, TransactionRequest TransactionRequestobj = null, short IsInsert = 2)
        {
            try
            {
                _dbContext.Database.BeginTransaction();
                _dbContext.Entry(TransactionQueue).State = EntityState.Modified;
                if (_WithdrawHistory != null)
                {
                    if (IsInsert == 1)
                    {
                        _dbContext.Entry(_WithdrawHistory).State = EntityState.Added;
                    }
                    else if (IsInsert == 0)
                    {
                        _dbContext.Entry(_WithdrawHistory).State = EntityState.Modified;
                    }
                }
                if (_WithdrawERCTokenQueueObj != null)
                {
                    _dbContext.Entry(_WithdrawERCTokenQueueObj).State = EntityState.Modified;
                }
                if (TransactionRequestobj != null)
                {
                    _dbContext.Entry(TransactionRequestobj).State = EntityState.Modified;
                }
                _dbContext.Entry(transactionRecon).State = EntityState.Added;
                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WithdrawalRecon", "BackOfficeTrnRepository", ex);
                return false;
            }
        }
        #endregion

        #region FeedConfiguration
        public List<SocketFeedConfigQueryRes> GetAllFeedConfiguration()
        {
            try
            {
                IQueryable<SocketFeedConfigQueryRes> Result = null;
                Result = _dbContext.feedConfigQueryRes.FromSql(
                               @"SELECT SC.Id,SM.id as MethodID,sl.Id as LimitID, SM.MethodName,SM.EnumCode,SL.LimitDesc,SL.LimitType,SL.MaxLimit,SL.MinLimit,SL.MaxSize,SL.MinSize,SL.MaxRecordCount,SL.RowLenghtSize,SL.MaxRowCount,SC.Status from SocketFeedConfiguration SC
                                INNER JOIN SocketMethods SM ON SC.MethodID=SM.Id  INNER JOIN SocketFeedLimits SL ON SC.FeedLimitID = SL.Id AND SL.Status=1 WHERE SC.Status in(1,0)");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion
        //Darshan Dholakiya added region for the arbitrage configuration changes:05-06-2019
        #region Arbitrage
        public List<TradePairConfigRequest> GetAllPairConfigurationArbitrageData()
        {
            try
            {
                IQueryable<TradePairConfigRequest> Result;
                Result = _dbContext.PairConfigurationResponse.FromSql(
                                    @"Select TPM.Id,TPM.PairName,SM.Name as MarketName,TPM.SecondaryCurrencyId,TPM.WalletMasterID,TPM.BaseCurrencyId,TPM.Status,'' as StatusText,TPD.ChargeType, ISNULL(TPD.OpenOrderExpiration,0)as OpenOrderExpiration,
                                    TPD.BuyMinQty,TPD.BuyMaxQty,TPD.SellMinQty,TPD.SellMaxQty,TPD.SellPrice,TPD.BuyPrice,TPD.BuyMinPrice,TPD.BuyMaxPrice,
                                    TPD.SellMinPrice,TPD.SellMaxPrice,TPD.BuyFees,TPD.SellFees,TPD.FeesCurrency,TPS.ChangeVol24 As Volume,TPS.CurrentRate As Currentrate,TPS.CurrencyPrice
                                    from TradePairMasterArbitrage TPM Inner Join TradePairDetailArbitrage TPD On TPD.PairId = TPM.Id  Inner Join TradePairStasticsArbitrage TPS On TPS.PairId = TPM.Id Inner join ServiceMasterArbitrage SM on TPM.BaseCurrencyId=SM.Id Where TPM.Status = 1 or TPM.Status = 0 Order By TPM.Id");
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
                
        }
        public List<ListPairInfo> ListPairArbitrageInfo()
        {
            try
            {
                IQueryable<ListPairInfo> Result;
                Result = _dbContext.ListPairInfo.FromSql(
                                    @"select TP.Id as PairId,TP.PairName,TP.Status,(Select top 1 Name from ServiceMasterArbitrage Where id=TP.BaseCurrencyId) as BaseCurrency,
                                        (Select top 1 Name from ServiceMasterArbitrage Where id=TP.SecondaryCurrencyId) as ChildCurrency  from TradePairMasterArbitrage TP  where TP.Status=1");
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public List<GetTradingSummary> GetTradingSummaryArbitrageInfo(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                if (!string.IsNullOrEmpty(SMSCode))
                    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status == 91) // Order History
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) + " And IsCancelled=0 ";  //uday 27-12-2018 because its give partial cancel also
                else if (status == 95) //Active Order
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Hold) + " ";
                else if (status == 92) // partial settled
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Hold);
                else if (status == 93) // cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.OperatorFail) + " ";  //uday 27-12-2018 In Spot Order IsCanceled = 0 So its also consider as systemfail
                else if (status == 94) //fail
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.SystemFail) + " ";
                else if (status == 96) // partial Cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " AND IsCancelled=1 ";
                else if (status == 97) // For User Trade count
                    sCondition += " And TTQ.Status in (1,4,2)";

                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                //        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(18,8))as ChargeRs, " +
                //        " ISNULL(PreBal,0) as PreBal,ISNULL(PostBal,0) as PostBal from TradeTransactionQueue TTQ  " +
                //        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN WalletLedgers WL ON WL.Id = TTQ.MemberID  " +
                //        " WHERE TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate()) And TTQ.TrnType in (4,5) And TTQ.Status>0 "+ sCondition + " Order By TTQ.TrnNo Desc ";
                //Rita 4-3-19 remove pre-post bal ,not required
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(28,18))as ChargeRs, " +
                        " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty from TradeTransactionQueueArbitrage TTQ  " +
                        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN ArbitrageWalletLedger WL ON WL.Id = TTQ.MemberID  " +
                        " WHERE TTQ.TrnType in (4,5) And TTQ.Status In (1,2,3,4) " + sCondition + " Order By TTQ.TrnNo Desc ";
                IQueryable<GetTradingSummary> Result;
                //if (!String.IsNullOrEmpty(FromDate))
                //{
                //    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                //    ToDate = ToDate + " 23:59:59";
                //    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                Result = _dbContext.GetTradingSummary.FromSql(Qry, fDate, tDate);
                //}   
                //else
                //    Result = _dbContext.GetTradingSummary.FromSql(Qry);


                //Uday 12-01-2019 Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<GetTradingSummaryLP> GetTradingSummaryLPArbitrageInfo(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, string LPType, ref long TotalPages)
        {
            string Qry = "";
            string sCondition = "";
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (!string.IsNullOrEmpty(LPType))//Rita 27-3-19 if no filter then display all lists
                    sCondition += " AND SD.AppTypeID In (" + LPType + ") ";

                if (PairID != 999)
                    sCondition += " AND TTQ.PairId=" + PairID;

                if (MemberID > 0)
                    sCondition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo > 0)
                    sCondition += " AND TTQ.TrnNo=" + TrnNo;

                if (!String.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {0} And {1} And TTQ.Status>0 ";
                }
                else
                    sCondition += " AND TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate())";

                if (!string.IsNullOrEmpty(SMSCode))
                    sCondition += " AND TTQ.Order_Currency='" + SMSCode + "'";

                if (trade != 999)
                    sCondition += " AND TTQ.TrnType=" + trade;
                if (Market != 999)
                    sCondition += " AND TTQ.ordertype=" + Market;

                if (status == 91) // Order History
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) + " And IsCancelled=0 ";  //uday 27-12-2018 because its give partial cancel also
                else if (status == 95) //Active Order
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Hold) + " ";
                else if (status == 92) // partial settled
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Hold);
                else if (status == 93) // cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.OperatorFail) + " ";  //uday 27-12-2018 In Spot Order IsCanceled = 0 So its also consider as systemfail
                else if (status == 94) //fail
                    sCondition += " And TTQ.Status =" + Convert.ToInt16(enTransactionStatus.SystemFail) + " ";
                else if (status == 96) // partial Cancel
                    sCondition += " And TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " AND IsCancelled=1 ";
                else if (status == 97) // For User Trade count
                    sCondition += " And TTQ.Status in (1,4,2)";

                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                //        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(18,8))as ChargeRs, " +
                //        " ISNULL(PreBal,0) as PreBal,ISNULL(PostBal,0) as PostBal from TradeTransactionQueue TTQ  " +
                //        " LEFT JOIN BizUser MM On MM.Id = TTQ.MemberID LEFT JOIN WalletLedgers WL ON WL.Id = TTQ.MemberID  " +
                //        " WHERE TTQ.TrnDate > DATEADD(DAY, -10,dbo.GetISTDate()) And TTQ.TrnType in (4,5) And TTQ.Status>0 "+ sCondition + " Order By TTQ.TrnNo Desc ";

                //komal 01-02-2018 solve error add ServiceProviderDetail join
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.MemberID AS MemberID,TTQ.TrnTypeName as Type, TTQ.Status as StatusCode,TTQ.IsCancelled, " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  " +
                        " TTQ.TrnDate as DateTime, TTQ.StatusMsg as StatusText, TTQ.PairID,TTQ.PairName,cast (0 as decimal(28,18))as ChargeRs, " +
                        " Case When TTQ.TrnType = 4 Then TTQ.SettledBuyQty When TTQ.TrnType = 5 Then TTQ.SettledSellQty End As SettleQty , Case When SD.AppTypeID = 9 Then 'Binance' When SD.AppTypeID = 10 Then 'Bittrex'" +
                        " When SD.AppTypeID = 11 Then 'TradeSatoshi' When SD.AppTypeID = 12 Then 'Poloniex' When SD.AppTypeID = 13 Then 'Coinbase' " +
                        " ELSE 'LocalTrade' End As ProviderName from TradeTransactionQueueArbitrage TTQ  " +
                        " INNER JOIN BizUser MM On MM.Id = TTQ.MemberID INNER JOIN TransactionQueueArbitrage TQ ON TQ.Id = TTQ.TrnNo " +
                        " LEFT JOIN ServiceProviderDetailArbitrage SD ON TQ.SerProID=SD.ID " +
                        " WHERE TTQ.TrnType in (4,5) And TTQ.Status In (1,2,3,4) " + sCondition + " Order By TTQ.TrnNo Desc ";

                IQueryable<GetTradingSummaryLP> Result;
                //if (!String.IsNullOrEmpty(FromDate))
                //{
                //    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                //    ToDate = ToDate + " 23:59:59";
                //    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                Result = _dbContext.GetTradingSummaryLP.FromSql(Qry, fDate, tDate);
                //}   
                //else
                //    Result = _dbContext.GetTradingSummary.FromSql(Qry);


                //Uday 12-01-2019 Add Pagination
                var items = Result.ToList();
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<TradeSettledHistory> TradeSettledHistoryArbitrageInfo(int PageSize, int PageNo, ref long TotalPages, ref long TotalCount, ref int PageSize1, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0)
        {
            try
            {
                List<TradeSettledHistory> list = new List<TradeSettledHistory>();
                List<TradePoolHistory> TradesH;
                IQueryable<TradeSettledHistoryQueryResponse2> Result;
                DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
                string str = "";
                string Condition = "";

                if (!string.IsNullOrEmpty(FromDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    Todate = Todate + " 23:59:59";
                    tDate = DateTime.ParseExact(Todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    Condition += " AND TTQ.TrnDate between {0} AND {1} ";
                }
                else
                {
                    Condition += " AND TTQ.TrnDate > DATEADD(day, -7,dbo.GetISTDate())";
                }

                if (PairID != 999)
                    Condition += " AND TTQ.PairID=" + PairID;
                if (TrnType != 999)
                    Condition += " AND TTQ.TrnType=" + TrnType;
                if (OrderType != 999)
                    Condition += " AND TTQ.orderType=" + OrderType;
                if (MemberID != 0)
                    Condition += " AND TTQ.MemberID=" + MemberID;
                if (TrnNo != 0)
                    Condition += " AND TTQ.TrnNo=" + TrnNo;

                str = "select TTQ.PairID,TTQ.PairName,TTQ.TrnDate,TTQ.MemberID,TTQ.orderType, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice END AS Price1, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END AS Qty1, TTQ.TrnNo, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerTrnNo WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerTrnNo END AS Trade, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerPrice WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerPrice END AS Price, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerQty WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerQty END AS QTY, TTQ.TrnTypeName, " +
                            "CASE WHEN TP.MakerTrnNo = TTQ.TrnNo THEN TP.TakerType WHEN  TP.TakerTrnNo = TTQ.TrnNo THEN TP.MakerType END AS TradeType " +
                            "from TradeTransactionQueueArbitrage TTQ INNER Join TradePoolQueueArbitrageV1 TP ON(TP.MakerTrnNo= TTQ.TrnNo or TP.TakerTrnNo= TTQ.TrnNo) " +
                            "where TTQ.Status in (1, 4) " + Condition + " order by TTQ.TrnNo";

                //Result = _dbContext.SettledHistory2.FromSql(
                //                    @"select TTQ.PairID,TTQ.PairName,TTQ.TrnDate,TTQ.MemberID,TTQ.orderType,
                //                        CASE WHEN TTQ.TrnType=4 THEN TTQ.BidPrice WHEN TTQ.TrnType=5 THEN TTQ.AskPrice END AS Price1,
                //                        CASE WHEN TTQ.TrnType=4 THEN TTQ.BuyQty WHEN TTQ.TrnType=5 THEN TTQ.SellQty END AS Qty1,TTQ.TrnNo,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerTrnNo WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerTrnNo END AS Trade,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerPrice WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerPrice END AS Price,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerQty WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerQty END AS QTY,TTQ.TrnTypeName,
                //                        CASE WHEN TP.MakerTrnNo=TTQ.TrnNo THEN TP.TakerType WHEN  TP.TakerTrnNo=TTQ.TrnNo THEN TP.MakerType END AS TradeType
                //                        from TradeTransactionQueue TTQ INNER Join TradePoolQueueV1 TP ON (TP.MakerTrnNo=TTQ.TrnNo or TP.TakerTrnNo=TTQ.TrnNo)
                //                        where (TTQ.TrnDate > {4} and TTQ.TrnDate < {5} )AND TTQ.Status in (1,4) AND (TTQ.TrnType={1} or {1}=999) 
                //                        AND (TTQ.PairID={0} or {0}=999) AND (TTQ.orderType={2} or {2}=999) AND (TTQ.MemberID={3} or {3}=0) AND (TTQ.TrnNo={6} or {6}=0)
                //                        order by TTQ.TrnNo", PairID, TrnType, OrderType,MemberID, fDate,tDate,TrnNo);


                Result = _dbContext.SettledHistory2.FromSql(str, fDate, tDate);
                var HistoryData = Result.ToList().GroupBy(e => e.TrnNo);
                var Count = 0;
                foreach (var History in HistoryData.ToList())
                {

                    TradesH = new List<TradePoolHistory>();
                    TradeSettledHistory obj = null;
                    Count += 1;
                    var cnt = 0;
                    foreach (var subHistory in History)
                    {
                        TradesH.Add(new TradePoolHistory()
                        {
                            Price = subHistory.Price,
                            Qty = subHistory.QTY,
                            TrnNo = subHistory.Trade,
                            TrnType = subHistory.TradeType,
                        });
                        if (cnt == 0)
                        {
                            obj = new TradeSettledHistory()
                            {
                                MemberID = subHistory.MemberID,
                                PairID = subHistory.PairID,
                                PairName = subHistory.PairName,
                                Price = subHistory.Price1,
                                Qty = subHistory.Qty1,
                                TrnDate = subHistory.TrnDate,
                                TrnType = subHistory.TrnTypeName,
                                TrnNo = subHistory.TrnNo,
                                OrderType = Enum.GetName(typeof(enTransactionMarketType), subHistory.orderType),
                                Trades = TradesH
                            };
                            cnt = 1;
                        }
                    }
                    list.Add(obj);
                }

                //return list;

                //Uday 12-01-2019 Add Pagination
                var items = list;
                TotalCount = items.Count;
                var pagesize = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                var t1 = Convert.ToDouble(TotalCount) / pagesize;
                TotalPages = Convert.ToInt64(Math.Ceiling(t1));
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }

                PageSize1 = (PageSize == 0) ? Helpers.PageSize : Convert.ToInt32(PageSize);

                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }




        #endregion

        //Darshan Dholakiya added region for the arbitrage Trade changes:12-06-2019

        #region Arbitrage Trade
        public List<GetTradeRouteConfigurationData> GetTradeRouteConfigurationArbitrage(long Id)
        {
            try
            {
                IQueryable<GetTradeRouteConfigurationData> Result;

                Result = _dbContext.TradeRouteConfigurationData.FromSql(
                                    @"Select RC.Id,RC.RouteName As TradeRouteName,RC.PairId,TPM.PairName,RC.OrderType,'' As OrderTypeText,RC.TrnType,'' As TrnTypeText,
                                        RC.Status,'' As StatusText,RC.SerProDetailID As RouteUrlId,TPA.APISendURL As RouteUrl,RC.OpCode As AssetName,
                                        RC.ConvertAmount,RC.ConfirmationCount,RC.Priority from RouteConfigurationArbitrage RC
                                        Inner Join TradePairMasterArbitrage TPM On TPM.Id = RC.PairId
                                        Inner Join ServiceProviderDetailArbitrage SPD On SPD.Id = RC.SerProDetailID
                                        Left Outer Join ArbitrageThirdPartyAPIConfiguration TPA On TPA.Id = SPD.ThirPartyAPIID
                                        Where RC.ID = {0} Or {0} = 0", Id);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<GetTradeRouteConfigurationData> GetTradeRouteForPriorityArbitrage(long PairId, long OrderType, int TrnType)
        {
            try
            {
                IQueryable<GetTradeRouteConfigurationData> Result;

                Result = _dbContext.TradeRouteConfigurationData.FromSql(
                                    @"Select RC.Id,RC.RouteName As TradeRouteName,RC.PairId,TPM.PairName,RC.OrderType,'' As OrderTypeText,RC.TrnType,'' As TrnTypeText,
                                        RC.Status,'' As StatusText,RC.SerProDetailID As RouteUrlId,TPA.APISendURL As RouteUrl,RC.OpCode As AssetName,
                                        RC.ConvertAmount,RC.ConfirmationCount,RC.Priority from RouteConfigurationArbitrage RC
                                        Inner Join TradePairMasterArbitrage TPM On TPM.Id = RC.PairId
                                        Inner Join ServiceProviderDetailArbitrage SPD On SPD.Id = RC.SerProDetailID
                                        Left Outer Join ArbitrageThirdPartyAPIConfiguration TPA On TPA.Id = SPD.ThirPartyAPIID
                                        Where RC.PairId = {0} And RC.OrderType = {1} And RC.TrnType = {2}", PairId, OrderType, TrnType);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<AvailableRoute> GetAvailableTradeRouteArbitrageInfo(int TrnType)
        {
            try
            {
                IQueryable<AvailableRoute> Result;

                Result = _dbContext.AvailableRoutes.FromSql(
                                    @"Select PM.ProviderName,TPC.APIName,TPC.APISendURL,PD.Id from ServiceProviderMasterArbitrage PM
                                      INNER JOIN ServiceProviderDetailArbitrage PD ON PD.ServiceProID=PM.Id Left Outer JOIN ArbitrageThirdPartyAPIConfiguration TPC ON PD.ThirPartyAPIID=TPC.Id
                                      Where PD.TrnTypeID= {0} AND PD.Status=1", TrnType);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ProductConfigrationGetInfo> GetAllProductConfigurationArbitrageInfo()
        {
            try
            {
                IQueryable<ProductConfigrationGetInfo> Result;

                Result = _dbContext.ProductConfigrationResponse.FromSql(
                                    @"Select PC.Id,PC.ProductName,PC.ServiceID,PC.CountryID,SM.Name As ServiceName,CM.CountryName From ProductConfigurationArbitrage PC
                                      Inner Join ServiceMasterArbitrage SM On SM.Id = PC.ServiceID Inner Join CountryMaster CM ON CM.Id = PC.CountryID Where PC.Status = 1 Order By PC.Id");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        #endregion

    }
}

