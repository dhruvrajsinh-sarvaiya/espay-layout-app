using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class FrontTrnRepository : IFrontTrnRepository
    {
        private readonly CleanArchitectureContext _dbContext;
        private readonly ILogger<FrontTrnRepository> _logger;

        public FrontTrnRepository(CleanArchitectureContext dbContext, ILogger<FrontTrnRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
            _dbContext.Database.SetCommandTimeout(180);
        }

        #region History method

        public List<ActiveOrderDataResponse> GetActiveOrder(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<ActiveOrderDataResponse> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;

                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
                }

                //Uday 23-11-2018 Optimize the query
                //Qry = @"Select top 100 TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                //   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                //   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,  " +
                //   "TTQ.IsCancelled from TradeTransactionQueue TTQ  " +
                //   "Where " + sCondition + " AND TTQ.Status ={1} And TTQ.MemberID ={0} Order By TTQ.TrnDate desc";

                //komal 29-12-2018 optimize with stop limit order query
                //Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                //    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                //    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                //    "TTQ.IsCancelled from TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo = TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID = TPS.PairId " +
                //    "where(((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4 or TTQ.ordertype != 4 ) " +
                //    "AND TTQ.Status = {1} AND TTQ.MemberID = {0} " + sCondition + " Order By TTQ.TrnDate desc";

                //komal 12-01-2018 remove stop-limit order condition 
                //Rita 12-3-19 added for needed at front side
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                   "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                   "TTQ.IsCancelled from TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo = TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID = TPS.PairId " +
                   "where TTQ.Status = {1} AND TTQ.MemberID = {0} AND TSL.ordertype<>3 " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.ActiveOrderDataResponse.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Hold), fDate, tDate);

                return Result.ToList();
                #region unusedcode
                //Qry = @"Select TQ.Id,TSL.ordertype,TTQ.PairName,TTQ.PairId,TQ.TrnDate,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type,TTQ.Order_Currency,TTQ.Delivery_Currency, " +
                //   "ISNULL((CASE WHEN TTQ.BuyQty = 0 THEN TTQ.SellQty WHEN TTQ.SellQty = 0 THEN TTQ.BuyQty END),0) as Amount, " +
                //   "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN ISNULL(TTQ.AskPrice,0) WHEN TTQ.AskPrice = 0 THEN ISNULL(TTQ.BidPrice,0) END),0) as Price, " +
                //   "TTQ.IsCancelled from TransactionQueue TQ INNER JOIN TradeTransactionQueue TTQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                //   "Where " + sCondition + " AND TQ.Status ={1} And TQ.MemberID ={0} ";

                //using (_dbContext)
                //{
                //    SqlParameter param1 = new SqlParameter("@MemberId", MemberID);
                //    var res = _dbContext.ActiveOrderDataResponse.FromSql("sp_ActiveOrder @MemberId", param1).ToList();
                //    return res;
                //}

                //var res = (from TQ in _dbContext.TransactionQueue
                //           join TTQ in _dbContext.TradeTransactionQueue on TQ.Id equals TTQ.TrnNo
                //           join TSL in _dbContext.TradeStopLoss on TQ.Id equals TSL.TrnNo
                //           where TQ.Status == 4 && TQ.MemberID == MemberID
                //           orderby TQ.TrnDate
                //           select new ActiveOrderInfo
                //           {
                //               Id = TQ.Id,
                //               TrnDate=TTQ.TrnDate,
                //               Type=TTQ.TrnTypeName,
                //               OrderType = Enum.GetName(typeof(enTransactionMarketType), TSL.ordertype),
                //               PairName = TTQ.PairName,
                //               PairId = TTQ.PairID,
                //               Order_Currency = TTQ.Order_Currency,
                //               Delivery_Currency = TTQ.Delivery_Currency,
                //               Amount = (TTQ.TrnType == 5) ? TTQ.SellQty : (TTQ.TrnType == 4) ? TTQ.BuyQty : 0,
                //               Price = (TTQ.TrnType == 5) ? TTQ.AskPrice : (TTQ.TrnType == 4) ? TTQ.BidPrice : 0,
                //               IsCancelled = TTQ.IsCancelled
                //           }).ToList();
                //return res.ToList();
                #endregion
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        //Rita 22-2-19 for Margin Trading
        public List<ActiveOrderDataResponse> GetActiveOrderMargin(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<ActiveOrderDataResponse> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;

                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
                }
                //Rita 01-05-19 margin system order does not display , also cancellation not allowed
                sCondition += " AND (TTQ.OrderType!=4 OR (TTQ.IsWithoutAmtHold=0 AND TTQ.ISOrderBySystem=0))";

                //Rita 12-3-19 added for needed at front side
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                   "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                   "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                   "TTQ.IsCancelled from TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo = TSL.TrnNo INNER join TradePairStasticsMargin TPS on TTQ.PairID = TPS.PairId " +
                   "where TTQ.Status = {1} AND TTQ.MemberID = {0} AND TSL.ordertype<>3 " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.ActiveOrderDataResponse.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Hold), fDate, tDate);

                return Result.ToList();

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<RecentOrderRespose> GetRecentOrder(long PairId, long MemberID)
        {
            string sCondition = "";
            IQueryable<RecentOrderRespose> Result;
            try
            {
                if (PairId != 999)
                    sCondition = " AND TTQ.PairID ={4} ";

                #region unused code
                //string Qry = "Select TTQ.TrnNo,TSL.ordertype,TTQ.PairName,TTQ.PairId,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type, " +
                //        "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price, " +
                //        "ISNULL((CASE WHEN TTQ.Status =1 AND TTQ.TrnType=4 THEN TTQ.SettledBuyQty WHEN TTQ.Status=1 AND TTQ.TrnType=5 THEN TTQ.SettledSellQty WHEN TTQ.Status =4 AND TTQ.TrnType=4 THEN TTQ.BuyQty WHEN TTQ.Status=4 AND TTQ.TrnType=5 THEN TTQ.SellQty END),0) as Qty, " +
                //        "TTQ.TrnDate as DateTime,TTQ.Status from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                //        "WHERE TTQ.MemberID ={0} AND TTQ.Status in ({1},{2}) AND TQ.TrnDate > DATEADD(HOUR, -24, getdate()) " + sCondition +
                //        "UNION ALL Select TTQ.TrnNo,TSL.ordertype,TTQ.PairName,TTQ.PairId,CASE WHEN TTQ.TrnType = 4 THEN 'BUY' WHEN TTQ.TrnType = 5 THEN 'SELL' END as Type, " +
                //        "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price, " +
                //        "ISNULL((CASE WHEN TTQ.TrnType = 4 THEN TCQ.PendingBuyQty else TCQ.DeliverQty END),0) as Qty, " +
                //        "TTQ.TrnDate as DateTime,TTQ.Status from TradeCancelQueue TCQ INNER JOIN TradeTransactionQueue TTQ ON TTQ.TrnNo = TCQ.TrnNo  " +
                //        "INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id WHERE  TTQ.MemberID ={0} " +
                //        "AND TCQ.Status in ({2}) AND TQ.TrnDate > DATEADD(HOUR, -24, getdate()) " + sCondition +
                //        "UNION ALL Select TTQ.TrnNo,TSL.ordertype,TTQ.PairName,TTQ.PairId,CASE WHEN TTQ.TrnType = 4 THEN 'BUY' WHEN TTQ.TrnType = 5 THEN 'SELL' END as Type, " +
                //        "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price,  " +
                //        "ISNULL((CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END),0) as Qty, " +
                //        "TTQ.TrnDate as DateTime,TTQ.Status from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                //        "WHERE TTQ.MemberID ={0} AND TTQ.Status in ({3}) AND TQ.TrnDate > DATEADD(HOUR, -24, getdate()) " + sCondition + " Order By TTQ.TrnDate Desc";
                //string Qry = "Select TTQ.TrnNo,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                //        " CASE WHEN TTQ.Status =1 AND TTQ.TrnType=4 THEN TTQ.SettledBuyQty WHEN TTQ.Status=1 AND TTQ.TrnType=5 THEN TTQ.SettledSellQty WHEN TTQ.Status =4 AND TTQ.TrnType=4 THEN TTQ.BuyQty WHEN TTQ.Status=4 AND TTQ.TrnType=5 THEN TTQ.SellQty END as Qty, " +
                //        " TTQ.TrnDate as DateTime,case when TTQ.Status=1 then 'Success' when TTQ.Status=4 then 'Hold' end as status from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                //        " WHERE TTQ.MemberID ={0} AND TTQ.Status in ({1},{2}) AND TQ.TrnDate > DATEADD(HOUR, -24, getdate()) " + sCondition +
                //        " UNION ALL Select TTQ.TrnNo,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type, " +
                //        " CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                //        " CASE WHEN TTQ.TrnType = 4 THEN TCQ.PendingBuyQty else TCQ.DeliverQty END as Qty, " +
                //        " TTQ.TrnDate as DateTime,case when TTQ.Status=1 then 'Cancel' end as status from TradeCancelQueue TCQ INNER JOIN TradeTransactionQueue TTQ ON TTQ.TrnNo = TCQ.TrnNo  " +
                //        " INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id WHERE  TTQ.MemberID ={0} " +
                //        " AND TCQ.Status in ({2}) AND TQ.TrnDate > DATEADD(HOUR, -24, getdate()) " + sCondition +
                //        " Order By TTQ.TrnDate Desc";
                #endregion
                //Uday 23-11-2018 Optimize the Query
                //Rita 18-1-19 Remove in above Qry as partial settlement also in SettledTradeTransactionQueue --> OR (TTQ.Status = 1 and TTQ.IsCancelled = 1)
                //change from (TTQ.ordertype<>3 AND TTQ.Status = 4) to (TTQ.ordertype<>3 OR (TTQ.ordertype=3 AND TTQ.Status <> 4))
                string Qry = "Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END as Qty , " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 4  then 'Hold' when TTQ.Status = 2 OR TTQ.Status = 1 then 'Cancel' end as status from TradeTransactionQueue TTQ " +
                            "INNER JOIN TradeStopLoss TSL ON TSL.TrnNo = TTQ.TrnNo WHERE TTQ.Status in ({2}, {3}) AND (TTQ.ordertype<>3 OR (TTQ.ordertype=3 AND TTQ.Status <> 4)) And TTQ.MemberID ={0} AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition +
                            "UNION ALL Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as Qty ," +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 1  then 'Success'  end as status from SettledTradeTransactionQueue TTQ " +
                            "INNER JOIN TradeStopLoss TSL ON TSL.TrnNo = TTQ.TrnNo WHERE TTQ.Status in ({1})  And TTQ.MemberID ={0} AND TSL.ordertype<>3 AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition + " order by TrnDate desc";

                if (PairId == 999)
                    Result = _dbContext.RecentOrderRespose.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail));
                else
                    Result = _dbContext.RecentOrderRespose.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail), PairId);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 22-2-19 for Margin Trading
        public List<RecentOrderRespose> GetRecentOrderMargin(long PairId, long MemberID)
        {
            string sCondition = "";
            string sCondition1 = "";
            IQueryable<RecentOrderRespose> Result;
            try
            {
                if (PairId != 999)
                    sCondition = " AND  {4} ";
                //Rita 01-05-19 margin system order does not display , also cancellation not allowed

                sCondition1 = sCondition;
                sCondition1 += " AND (TTQ.OrderType!=4 OR (TTQ.IsWithoutAmtHold=0 AND TTQ.ISOrderBySystem=0))";

                string Qry = "Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END as Qty , " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 4  then 'Hold' when TTQ.Status = 2 OR TTQ.Status = 1 then 'Cancel' end as status from TradeTransactionQueueMargin TTQ " +
                            "INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo = TTQ.TrnNo WHERE TTQ.Status in ({2}, {3}) AND (TTQ.ordertype<>3 OR (TTQ.ordertype=3 AND TTQ.Status <> 4)) And TTQ.MemberID ={0} AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition1 +
                            "UNION ALL Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as Qty ," +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 1  then 'Success'  end as status from SettledTradeTransactionQueueMargin TTQ " +
                            "INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo = TTQ.TrnNo WHERE TTQ.Status in ({1})  And TTQ.MemberID ={0} AND TSL.ordertype<>3 AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition + " order by TrnDate desc";

                if (PairId == 999)
                    Result = _dbContext.RecentOrderRespose.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail));
                else
                    Result = _dbContext.RecentOrderRespose.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail), PairId);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TradeHistoryResponce> GetTradeHistory(long MemberID, string sCondition, string FromDate, string ToDate, int page, int IsAll, long TrnNo = 0)
        {
            IQueryable<TradeHistoryResponce> Result = null;
            string qry = "";
            DateTime fDate, tDate;

            try
            {
                if (IsAll == 0) //case for OrderHistory settled only
                {
                    var sCon = "";

                    long PairId = MemberID;
                    if (PairId != 999)
                        sCon = "and TTQ.PairID =" + PairId;
                    if (TrnNo != 0)
                        sCon = "and TTQ.TrnNo =" + TrnNo;

                    //Uday 24-11-2018 Optimize The Query
                    //Rita 19-11-18 May be Qty not fully sell from Pool , change from TTQ.SettledSellQty to TTQ.SellQty
                    //komal 30-11-2018 change  TTQ.SellQty to TTQ.SettledSellQty
                    //Rita 8-4-19 IF buy then take last settle price from queue instead of TTQ.BidPrice
                    //rita 30-4-19 if ordertype=2 then take price from settlementpoolqueue,error solve convert to null to decimal  CAST (0 AS DECIMAL(28,18))
                    //komal 30 April 2019 add charge
                    qry = "Select top 100 TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN (select top 1 TakerPrice from TradePoolQueueV1 where (MakerTrnNo=TTQ.TrnNo or TakerTrnNo=TTQ.TrnNo) and status=1 order by id desc) " +
                            " WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                            "WHERE TTQ.Status in (1,4) " + sCon + " Order By TTQ.SettledDate desc";//Rita 22-3-19 order by settledDate

                    #region Unused code
                    //qry = "Select top 100 TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type, " +
                    //        "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price, " +
                    //        "ISNULL((CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END),0) as Amount, " +
                    //        "TTQ.TrnDate as DateTime, TTQ.Status, TTQ.StatusMsg as StatusText, TP.PairName,ISNULL(TQ.ChargeRs, 0) as ChargeRs,TTQ.IsCancelled from " +
                    //        "TradeTransactionQueue TTQ inner join TransactionQueue TQ on TQ.Id = TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id = TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                    //        "WHERE TTQ.Status in ({0}) and (TTQ.SettledSellQty > 0 or TTQ.SettledBuyQty > 0) " + sCon + " Order By TTQ.TrnDate DESC";

                    //qry = "Select top 100 TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type, " +
                    //        "ISNULL((CASE WHEN TTQ.BidPrice = 0 THEN TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price, " +
                    //        "ISNULL((CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END),0) as Amount, " +
                    //        "TTQ.TrnDate as DateTime, TTQ.Status, TTQ.StatusMsg as StatusText, TP.PairName,ISNULL(TQ.ChargeRs, 0) as ChargeRs,TTQ.IsCancelled from " +
                    //        "SettledTradeTransactionQueue TTQ inner join TransactionQueue TQ on TQ.Id = TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id = TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                    //        "WHERE TTQ.Status in ({0}) and (TTQ.SettledSellQty > 0 or TTQ.SettledBuyQty > 0) " + sCon + " Order By TTQ.TrnDate DESC";
                    #endregion
                    Result = _dbContext.TradeHistoryInfo.FromSql(qry);

                }
                else //case for tradehistory 
                {
                    if (IsAll == 1)//success
                    {
                        //Uday 24-11-2018 Optimize The Query
                        //komal 30 April 2019 add charge
                        #region unused code
                        //qry = @"Select  TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type, " +
                        //           "ISNULL((CASE WHEN TTQ.BidPrice=0 THEN TTQ.AskPrice WHEN TTQ.AskPrice=0 THEN TTQ.BidPrice END),0) as Price, " +
                        //           "ISNULL((CASE WHEN TTQ.TrnType = 4  THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END),0) as Amount," +
                        //           "TTQ.TrnDate as DateTime,TTQ.Status,TTQ.StatusMsg as StatusText,TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,TTQ.IsCancelled " +
                        //           "from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                        //           "WHERE " + sCondition + " AND TTQ.IsCancelled=0 AND TTQ.MemberID=" + MemberID + " AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.Success) + " Order By TrnNo desc";
                        #endregion
                        qry = "Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                            "WHERE " + sCondition + " AND TTQ.Status in (1,4) AND TTQ.IsCancelled=0 AND TTQ.MemberID=" + MemberID + " Order By TTQ.SettledDate desc";
                        //Rita 22-3-19 order by settledDate
                    }
                    else if (IsAll == 2) //system fail
                    {
                        //Rita 17-1-19 4:05:00 added Inner join with TradeStopLoss as sCondition parameter required TSL.ordertype
                        //Uday 24-11-2018 Optimize The Query
                        //komal 30 April 2019 add charge
                        #region unused code
                        //qry = @"Select  TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type," +
                        //       " ISNULL((CASE WHEN TTQ.BidPrice=0 THEN TTQ.AskPrice WHEN TTQ.AskPrice=0 THEN TTQ.BidPrice END),0) as Price," +
                        //        "ISNULL((CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END),0) as Amount,TTQ.TrnDate as DateTime," +
                        //        "TTQ.Status,TTQ.StatusMsg as StatusText,TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,TTQ.IsCancelled " +
                        //        "from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id=TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                        //        "WHERE " + sCondition + "AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.SystemFail) + " AND TTQ.MemberID=" + MemberID + " Order By TrnNo desc";
                        #endregion
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Fail' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                               "WHERE " + sCondition + "AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.SystemFail) + " AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else if (IsAll == 9) // Cancel
                    {
                        //Rita 17-1-19 4:05:00 added Inner join with TradeStopLoss as sCondition parameter required TSL.ordertype
                        //Uday 24-11-2018 Optimize The Query
                        //komal 30 April 2019 add charge
                        #region unused code
                        //qry = @"Select TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type," +
                        //       " ISNULL((CASE WHEN TTQ.BidPrice=0 THEN TTQ.AskPrice WHEN TTQ.AskPrice=0 THEN TTQ.BidPrice END),0) as Price," +
                        //        "ISNULL((CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END),0) as Amount,TTQ.TrnDate as DateTime," +
                        //        "TTQ.Status,TTQ.StatusMsg as StatusText,TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,TTQ.IsCancelled " +
                        //        "from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id=TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID  INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                        //        "WHERE " + sCondition + "AND TTQ.Status in(" + Convert.ToInt16(enTransactionStatus.Success) + "," + Convert.ToInt16(enTransactionStatus.OperatorFail) +
                        //        ") AND TTQ.MemberID=" + MemberID + " AND TTQ.IsCancelled=1  Order By TrnNo desc";
                        #endregion
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Cancel' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                               "WHERE " + sCondition + " AND TTQ.IsCancelled=1 AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                        //"WHERE " + sCondition + "AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.OperatorFail) + " AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else //settle,cancel,fail
                    {
                        //Uday 24-11-2018 Optimize The Query
                        //komal 30 April 2019 add charge
                        #region unused code
                        //qry = @"Select TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type,ISNULL((CASE WHEN TTQ.BidPrice=0 THEN TTQ.AskPrice " +
                        //        " WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price,ISNULL((CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END),0) as Amount,TTQ.TrnDate as DateTime,TTQ.Status,TTQ.StatusMsg as StatusText," +
                        //        " TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,CAST(0 as smallint) As IsCancelled from  TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id  = TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                        //        " WHERE " + sCondition + " AND TTQ.MemberID=" + MemberID + "  and TTQ.Status =" + Convert.ToInt16(enTransactionStatus.Success) +
                        //        " UNION  ALL Select TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type,ISNULL((CASE WHEN TTQ.BidPrice=0 THEN " +
                        //        " TTQ.AskPrice WHEN TTQ.AskPrice = 0 THEN TTQ.BidPrice END),0) as Price,ISNULL((CASE WHEN TTQ.TrnType = 4 THEN TCQ.PendingBuyQty else TCQ.DeliverQty END),0) as Amount,TTQ.TrnDate as DateTime,TTQ.Status, " +
                        //        " TCQ.StatusMsg as StatusText,TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,CAST(1 as smallint) as 'IsCancelled' from TradeCancelQueue TCQ INNER JOIN TradeTransactionQueue TTQ ON TTQ.TrnNo = TCQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID" +
                        //        " INNER JOIN TransactionQueue TQ ON TQ.Id  = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id  WHERE " + sCondition + " AND TTQ.MemberID=" + MemberID + " and TCQ.Status=" + Convert.ToInt16(enTransactionStatus.Success) +
                        //        " UNION ALL Select TTQ.TrnNo,TSL.ordertype,CASE WHEN TTQ.TrnType=4 THEN 'BUY' WHEN TTQ.TrnType=5 THEN 'SELL' END as Type,ISNULL((CASE WHEN TTQ.BidPrice=0 THEN TTQ.AskPrice WHEN TTQ.AskPrice=0 THEN TTQ.BidPrice END),0) as Price, " +
                        //        " ISNULL((CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END),0) as Amount,TTQ.TrnDate as DateTime,TTQ.Status,TTQ.StatusMsg as StatusText,TP.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,TTQ.IsCancelled " +
                        //        " from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id=TTQ.TrnNo INNER JOIN TradePairMaster TP ON TP.Id =TTQ.PairID INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id  WHERE " + sCondition + " AND TTQ.MemberID=" + MemberID + " AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.OperatorFail) +
                        //        " Order By TTQ.TrnNo Desc";

                        //qry = @"Select TTQ.TrnNo,TSL.ordertype,TTQ.TrnTypeName as Type,CASE WHEN TTQ.TrnType=5 THEN TTQ.AskPrice " +
                        //        " WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price,CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime,TTQ.Status,TTQ.StatusMsg as StatusText," +
                        //        " TTQ.PairName,ISNULL(TQ.ChargeRs,0) as ChargeRs,CAST(0 as smallint) As IsCancelled from  TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id  = TTQ.TrnNo  INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id " +
                        //        " WHERE " + sCondition + " AND TTQ.MemberID=" + MemberID + "  And  TTQ.Status in(" + Convert.ToInt16(enTransactionStatus.Success) + "," + Convert.ToInt16(enTransactionStatus.OperatorFail) + ")" +
                        //        " UNION  ALL Select TTQ.TrnNo,TSL.ordertype,TTQ.TrnTypeName as Type,CASE WHEN TTQ.TrnType=5 THEN " +
                        //        " TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price,CASE WHEN TTQ.TrnType = 4 THEN TCQ.PendingBuyQty else TCQ.DeliverQty END as Amount,TTQ.TrnDate as DateTime,TTQ.Status, " +
                        //        " TCQ.StatusMsg as StatusText,TTQ.PairName,ISNULL(TQ.ChargeRs,0)as ChargeRs,CAST(1 as smallint) as 'IsCancelled' from TradeCancelQueue TCQ INNER JOIN TradeTransactionQueue TTQ ON TTQ.TrnNo = TCQ.TrnNo " +
                        //        " INNER JOIN TransactionQueue TQ ON TQ.Id  = TTQ.TrnNo INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TQ.Id  WHERE " + sCondition + " AND TTQ.MemberID=" + MemberID + " and TCQ.Status=" + Convert.ToInt16(enTransactionStatus.Success) +
                        //        " Order By TTQ.TrnNo Desc";
                        #endregion
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from SettledTradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                                "WHERE " + sCondition + "AND TTQ.Status in (1,4) and TTQ.IsCancelled = 0 AND TTQ.MemberID=" + MemberID + " " +
                                "UNION ALL Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, CASE WHEN TTQ.Status=2 THEN 'Cancel' ELSE 'Cancel' END as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from TradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueue TQ ON TTQ.TrnNo=TQ.ID " +
                                "WHERE " + sCondition + "AND (TTQ.Status=" + Convert.ToInt16(enTransactionStatus.OperatorFail) + " OR (TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " and TTQ.IsCancelled = 1)) AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";

                    }
                    if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                    {
                        fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        ToDate = ToDate + " 23:59:59";
                        tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                        Result = _dbContext.TradeHistoryInfo.FromSql(qry, FromDate, ToDate);
                    }
                    else
                        Result = _dbContext.TradeHistoryInfo.FromSql(qry);

                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        //Rita 22-2-19 for Margin Trading
        public List<TradeHistoryResponce> GetTradeHistoryMargin(long MemberID, string sCondition, string FromDate, string ToDate, int page, int IsAll, long TrnNo = 0)
        {
            IQueryable<TradeHistoryResponce> Result = null;
            string qry = "";
            DateTime fDate, tDate;

            try
            {
                if (IsAll == 0) //case for OrderHistory settled only
                {
                    var sCon = "";

                    long PairId = MemberID;
                    if (PairId != 999)
                        sCon = "and TTQ.PairID =" + PairId;
                    if (TrnNo != 0)
                        sCon = "and TTQ.TrnNo =" + TrnNo;

                    //Rita 8-4-19 IF buy then take last settle price from queue instead of TTQ.BidPrice
                    //rita 30-4-19 if ordertype=2 then take price from settlementpoolqueue,error solve convert to null to decimal  CAST (0 AS DECIMAL(28,18))
                    qry = "Select top 100 TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN (select top 1 TakerPrice from TradePoolQueueMarginV1 where (MakerTrnNo=TTQ.TrnNo or TakerTrnNo=TTQ.TrnNo) and status=1 order by id desc) " +
                            "WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                            "WHERE TTQ.Status in (1,4) " + sCon + " Order By TTQ.SettledDate desc"; //Rita 22-3-19 order by settledDate
                    Result = _dbContext.TradeHistoryInfo.FromSql(qry);

                }
                else //case for tradehistory 
                {
                    if (IsAll == 1)//success
                    {
                        qry = "Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                            "WHERE " + sCondition + " AND TTQ.Status in (1,4) AND TTQ.IsCancelled=0 AND TTQ.MemberID=" + MemberID + " Order By TTQ.SettledDate desc";
                        //Rita 22-3-19 order by settledDate
                    }
                    else if (IsAll == 2) //system fail
                    {
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Fail' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                               "WHERE " + sCondition + "AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.SystemFail) + " AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else if (IsAll == 9) // Cancel
                    {
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Cancel' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                               "WHERE " + sCondition + " AND TTQ.IsCancelled=1 AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else //settle,cancel,fail
                    {
                        #region unused code                        
                        #endregion
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from SettledTradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                                "WHERE " + sCondition + "AND TTQ.Status in (1,4) and TTQ.IsCancelled = 0 AND TTQ.MemberID=" + MemberID + " " +
                                "UNION ALL Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, CASE WHEN TTQ.Status=2 THEN 'Cancel' ELSE 'Cancel' END as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from TradeTransactionQueueMargin TTQ INNER JOIN TradeStopLossMargin TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueMargin TQ ON TTQ.TrnNo=TQ.Id " +
                                "WHERE " + sCondition + "AND (TTQ.Status=" + Convert.ToInt16(enTransactionStatus.OperatorFail) + " OR (TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " and TTQ.IsCancelled = 1)) AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";

                    }
                    if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                    {
                        fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        ToDate = ToDate + " 23:59:59";
                        tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                        Result = _dbContext.TradeHistoryInfo.FromSql(qry, FromDate, ToDate);
                    }
                    else
                        Result = _dbContext.TradeHistoryInfo.FromSql(qry);

                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<OpenOrderQryResponse> GetOpenOrder(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<OpenOrderQryResponse> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;
                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {1} AND {2} ";
                }

                Qry = @"Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                    "TTQ.IsCancelled from TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId " +
                    "where ((TSL.MarketIndicator=0 AND TSL.StopPrice<=TPS.LTP) OR (TSL.MarketIndicator=1 AND TSL.StopPrice >= TPS.LTP)) AND TTQ.Status=4 AND TTQ.ordertype=4  And TTQ.MemberID ={0} " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.OpenOrderRespose.FromSql(Qry, MemberID, fDate, tDate);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 22-2-19 for Margin Trading
        public List<OpenOrderQryResponse> GetOpenOrderMargin(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<OpenOrderQryResponse> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;
                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {1} AND {2} ";
                }

                Qry = @"Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                    "TTQ.IsCancelled from TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId " +
                    "where ((TSL.MarketIndicator=0 AND TSL.StopPrice<=TPS.LTP) OR (TSL.MarketIndicator=1 AND TSL.StopPrice >= TPS.LTP)) AND TTQ.Status=4 AND TTQ.ordertype=4  And TTQ.MemberID ={0} " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.OpenOrderRespose.FromSql(Qry, MemberID, fDate, tDate);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public OpenOrderInfo CheckOpenOrderRange(long TrnNo)
        {
            try
            {
                IQueryable<OpenOrderQryResponse> Result;
                Result = _dbContext.OpenOrderRespose.FromSql(@"Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  
                        CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,
                        CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price,
                        TTQ.IsCancelled from TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo = TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID = TPS.PairId
                        where ((TSL.MarketIndicator = 0 AND TSL.StopPrice <= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice >= TPS.LTP)) AND TTQ.Status = 4
                        AND TTQ.ordertype = 4 and TTQ.TrnNo = {0}", TrnNo);

                if (Result.SingleOrDefault() != null)
                {
                    var model = Result.SingleOrDefault();
                    OpenOrderInfo _Res = new OpenOrderInfo()
                    {
                        Amount = model.Amount,
                        Delivery_Currency = model.Delivery_Currency,
                        Id = model.TrnNo,
                        IsCancelled = model.IsCancelled,
                        Order_Currency = model.Order_Currency,
                        Price = model.Price,
                        TrnDate = model.TrnDate,
                        Type = model.Type,
                        PairName = model.PairName,
                        PairId = model.PairId,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype)
                    };
                    return _Res;
                }
                return null;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetFrontTopGainerPair(int Type)
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

        public List<TopLooserGainerPairData> GetFrontTopLooserPair(int Type)
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

        public List<TopLooserGainerPairData> GetFrontTopLooserGainerPair()
        {
            try
            {
                IQueryable<TopLooserGainerPairData> Result = null;

                //Uday 04-01-2019  Pair Name Wise Filteration in Ascending Order 
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

        public decimal GetHistoricalPerformanceData(long UserId, int Type)
        {
            try
            {
                HistoricalPerformance Data = null;

                if (Type == 1) // Deposit Value
                {
                    Data = _dbContext.HistoricalPerformance.FromSql(@"select Isnull(Sum(Amount * 72),0) As Amount from DepositHistory Where Status = 1 
                                                                 And UserId = {0} And MONTH(CreatedDate) = MONTH(dbo.getistdate())", UserId).FirstOrDefault();

                    //var DepositData = _dbContext.DepositHistory.Where(x => x.Status == 1 && x.UserId == UserId).ToList();

                    //if(DepositData.Count > 0)
                    //{
                    //    Amount = DepositData.Sum(x => x.Amount * 72);
                    //}
                }
                else if (Type == 2) // Withdrwal Value
                {
                    Data = _dbContext.HistoricalPerformance.FromSql(@"Select Isnull(Sum(Amount * 72),0) As Amount from TransactionQueue 
                                                            Where TrnType = 6 And Status = 1 And MemberId = {0} And MONTH(TrnDate) = MONTH(dbo.getistdate())", UserId).FirstOrDefault();

                    //var WithdrwalData = _dbContext.TransactionQueue.Where(x => x.Status == 1 && x.TrnType == 6 && x.MemberID == UserId).ToList();

                    //if (WithdrwalData.Count > 0)
                    //{
                    //    Amount = WithdrwalData.Sum(x => x.Amount * 72);
                    //}
                }

                return Data.Amount;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<CopiedLeaderOrdersQryRes> GetCopiedLeaderOrders(long MemberID, string FromDate = null, string ToDate = null, long PairId = 999, short trnType = 999, string FollowTradeType = "", long FollowingTo = 0)
        {
            IQueryable<CopiedLeaderOrdersQryRes> Result = null;
            string qry = "", sCon = " ";
            DateTime fDate, tDate;
            try
            {
                if (PairId != 999)
                    sCon = " AND TTQ.PairID =" + PairId;
                if (trnType != 999)
                    sCon += " AND TTQ.TrnType =" + trnType;
                if (FollowingTo != 0)
                    sCon += " AND TSL.FollowingTo =" + FollowingTo;
                if (!string.IsNullOrEmpty(FollowTradeType))
                    sCon += " AND TSL.FollowTradeType ='" + FollowTradeType + "' ";
                if (MemberID != 0)
                    sCon += " AND TTQ.MemberID =" + MemberID;

                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCon += " AND TTQ.TrnDate Between {0} AND {1} ";
                }

                qry = "Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,cast(0 as decimal) as ChargeRs,TTQ.IsCancelled, " +
                        "CASE WHEN TSL.ordertype = 2 THEN CAST(0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                        "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                        "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate,TSL.FollowingTo,TSL.FollowTradeType " +
                        "from SettledTradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo = TTQ.TrnNo " +
                        "WHERE TTQ.Status in (1, 4) and TTQ.IsCancelled = 0 AND TSL.ISFollowersReq = 1 " + sCon +
                        "UNION ALL Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, " +
                        "CASE WHEN TTQ.Status = 2 THEN 'Cancel' WHEN TTQ.Status=4 THEN 'Hold' ELSE 'Cancel' END as StatusText,TTQ.PairName,cast(0 as decimal) as ChargeRs,TTQ.IsCancelled, " +
                        "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                        "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount," +
                        "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate,TSL.FollowingTo,TSL.FollowTradeType " +
                        "from TradeTransactionQueue TTQ INNER JOIN TradeStopLoss TSL ON TSL.TrnNo = TTQ.TrnNo " +
                        "WHERE(TTQ.Status = 2 OR(TTQ.Status = 1 and TTQ.IsCancelled = 1) OR TTQ.Status=4) AND TSL.ISFollowersReq = 1 " + sCon + " Order By TTQ.TrnDate desc";

                Result = _dbContext.copiedLeaderOrders.FromSql(qry, FromDate, ToDate);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLeaderListInfo> TopLeaderList(int IsAll = 0)
        {
            try
            {
                IQueryable<TopLeaderListInfo> Result;
                if (IsAll == 0)
                {
                    Result = _dbContext.topLeaderLists.FromSql(
                      @"select top 5 count(FM.FolowerId) NoOfFollowers,FM.LeaderId,BU.username as LeaderName from FollowerMaster FM Inner join Bizuser BU on FM.LeaderId=BU.Id where FM.status=1 
                        group by FM.LeaderId, BU.username order by NoOfFollowers desc");
                }
                else
                {
                    Result = _dbContext.topLeaderLists.FromSql(
                      @"select count(FM.FolowerId) NoOfFollowers,FM.LeaderId,BU.username as LeaderName from FollowerMaster FM Inner join Bizuser BU on FM.LeaderId=BU.Id where FM.status=1 
                        group by FM.LeaderId, BU.username order by NoOfFollowers desc");
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TradeWatchLists> getTradeWatchList(List<TradeWatchLists> TradeWatcher)
        {
            List<TradeWatchLists> watchLists = new List<TradeWatchLists>();
            try
            {

                long[] leaderArray = TradeWatcher.Select(x => (long)x.LeaderId).ToArray();
                string leaderIDlist = String.Join(",", leaderArray);
                string Qry = "select TTQ.MemberID as LeaderId,cast(Count(TTQ.TrnNo) as bigint) as Total,count(CASE WHEN TTQ.TrnType = 4 then 1 end) as buy,count(CASE WHEN TTQ.TrnType = 5 then 1 end) as sell,'' as LeaderName" +
                            " from SettledTradeTransactionQueue TTQ where TTQ.MemberID in (" + leaderIDlist + ") group by TTQ.MemberID";
                IQueryable<TradeWatchListsQryRes> Result = _dbContext.tradeWatchLists.FromSql(Qry);

                foreach (var obj in Result.ToList())
                {
                    decimal Max;
                    string trnType;
                    decimal per;

                    if (obj.sell >= obj.buy)
                    {
                        Max = obj.sell;
                        trnType = "SELL";
                    }
                    else
                    {
                        Max = obj.buy;
                        trnType = "BUY";
                    }
                    if (obj.Total == 0)
                        per = 0;
                    else
                        per = (Max * 100) / obj.Total;
                    watchLists.Add(new TradeWatchLists()
                    {
                        LeaderId = obj.LeaderId,
                        MaxTrade = Max,
                        Total = obj.Total,
                        TrnType = trnType,
                        Percentage = per,
                        LeaderName = obj.LeaderName
                    });
                }
                foreach (var obj in watchLists)
                {
                    var model = TradeWatcher.SingleOrDefault(e => e.LeaderId == obj.LeaderId);
                    model.MaxTrade = obj.MaxTrade;
                    model.Percentage = obj.Percentage;
                    model.Total = obj.Total;
                    model.TrnType = obj.TrnType;
                }
                return TradeWatcher;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<SiteTokenConversionQueryRes> GetSiteTokenConversionData(long? UserId, string SourceCurrency = "", string TargetCurrency = "", string FromDate = "", string ToDate = "", short IsMargin = 0)
        {
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                String Condition = " ";
                if (UserId != null)
                    Condition += " AND UserID ={0} ";
                if (!string.IsNullOrEmpty(SourceCurrency))
                    Condition += " AND SourceCurrency ='" + SourceCurrency + "'";
                if (!string.IsNullOrEmpty(TargetCurrency))
                    Condition += " AND TargerCurrency ='" + TargetCurrency + "'";

                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    Condition += " AND CreatedDate Between {1} AND {2} ";
                }
                string Qry;//Rita 19-4-19 for margin data report
                if (IsMargin == 1)
                    Qry = "select UserID, SourceCurrencyID, SourceCurrency, TargerCurrencyID, TargerCurrency, SourceToBaseQty, SourceCurrencyQty, TargerCurrencyQty,SourceToBasePrice, TokenPrice,CreatedDate from SiteTokenConversionMargin Where status=1 " + Condition;
                else
                    Qry = "select UserID, SourceCurrencyID, SourceCurrency, TargerCurrencyID, TargerCurrency, SourceToBaseQty, SourceCurrencyQty, TargerCurrencyQty,SourceToBasePrice, TokenPrice,CreatedDate from SiteTokenConversion Where status=1 " + Condition;

                IQueryable<SiteTokenConversionQueryRes> Result = _dbContext.siteTokenConversions.FromSql(Qry, UserId, fDate, tDate);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #region Trade data Method

        public long GetPairIdByName(string pair)
        {

            try
            {
                var model = _dbContext.TradePairMaster.Where(p => p.PairName == pair && p.Status == 1).FirstOrDefault();
                if (model == null)
                    return 0;

                return model.Id;
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<GetBuySellBook> GetBuyerBook(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;

                #region UnUsedCode
                //Uday  05-11-2018 As Per Instruction by ritamam not get the OrderId From TradePoolMaster

                //if (Price != -0)
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                  @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,
                //                Count(TTQ.BidPrice) As RecordCount,(Select Top 1 GUID From TradePoolMaster TPM Where TPM.BidPrice = TTQ.BidPrice And TPM.PairId = TTQ.PairID) As OrderId
                //                From TradeTransactionQueue TTQ  Where TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID = {0}
                //                AND TTQ.IsCancelled = 0 AND TTQ.BidPrice={1} Group By TTQ.BidPrice,PairID Order By TTQ.BidPrice desc", id, Price);
                //}
                //else
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                  @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,
                //                Count(TTQ.BidPrice) As RecordCount,(Select Top 1 GUID From TradePoolMaster TPM Where TPM.BidPrice = TTQ.BidPrice And TPM.PairId = TTQ.PairID) As OrderId
                //                From TradeTransactionQueue TTQ  Where TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID = {0}
                //                AND TTQ.IsCancelled = 0 Group By TTQ.BidPrice,PairID Order By TTQ.BidPrice desc", id);
                //}

                //if (Price != -1)
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                  @"Select Top 1 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,
                //                Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId
                //                From TradeTransactionQueue TTQ  Where TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID = {0}
                //                AND TTQ.IsCancelled = 0 AND TTQ.BidPrice={1} AND TTQ.ordertype<>3 Group By TTQ.BidPrice,PairID Order By TTQ.BidPrice desc", id, Price);
                //   // HelperForLog.WriteLogForSocket("GetBuyerBook" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), "FrontTrnService", "2 BuyerBook call Price " + Price.ToString());
                //}
                //else
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                  @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,
                //                Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId
                //                From TradeTransactionQueue TTQ  Where TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID = {0}
                //                AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group By TTQ.BidPrice,PairID Order By TTQ.BidPrice desc", id);
                //}
                #endregion
                //Uday  05-11-2018 As Per Instruction by ritamam not get the OrderId From TradePoolMaster
                //Uday 19 - 11 - 2018 As Per ritamam instruction get all status record but check condition sum(TTQ.OrderTotalQty) -Sum(TTQ.SettledSellQty)
                //komal 29-12-2018 modify for Stop-limit order
                //Uday 03-01-2019 add condition for amount > 0
                //komal 05-02-2019 add AND TTQ.IsAPITrade=0 
                if (Price != -1)//SignalR call
                {
                    //Rita 16-1-19 OrderType=4 goes Separate , so remove from here
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"Select Top 1 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                    From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                                    Where (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.BidPrice={1}
                                    Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id, Price);
                    //INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                    //Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4 or TTQ.ordertype != 4 ) 
                    // HelperForLog.WriteLogForSocket("GetBuyerBook" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), "FrontTrnService", "2 BuyerBook call Price " + Price.ToString());
                }
                else//API call
                {
                    //Rita 16-1-19 separate Order Type=4 records with bit , front side handle separate array
                    //Result = _dbContext.BuyerSellerInfo.FromSql(
                    //              @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId
                    //                From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                    //                Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4 or TTQ.ordertype != 4 ) 
                    //                AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                    //                Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id);

                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype <> 4 AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                                    SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0
                                    GROUP By TTQ.BidPrice,TTQ.PairID HAVING (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 20-2-19 for Margin Trading
        public List<GetBuySellBook> GetBuyerBookMargin(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;

                if (Price != -1)//SignalR call
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"Select Top 1 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                    From TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                                    Where (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.BidPrice={1}
                                    Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id, Price);
                }
                else//API call
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype <> 4 AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                                    SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0
                                    GROUP By TTQ.BidPrice,TTQ.PairID HAVING (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetBuySellBook> GetSellerBook(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;
                //Uday  05-11-2018 As Per Instruction by ritamam not get the OrderId From TradePoolMaster
                //Uday 19 - 11 - 2018 As Per ritamam instruction get all status record but check condition sum(TTQ.OrderTotalQty) -Sum(TTQ.SettledSellQty)
                //komal 29-12-2018 modify for Stop-limit order
                //Uday 03-01-2019 add condition for amount > 0
                //komal 05-02-2019 add AND TTQ.IsAPITrade=0 
                if (Price != -1)
                {
                    //Rita 16-1-19 OrderType=4 goes Separate , so remove from here
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                @"SELECT Top 1 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                                Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                FROM TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo
                                WHERE (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.AskPrice={1}
                                AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id, Price);
                    //INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                    //WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4 or TTQ.ordertype != 4 ) 
                    //HelperForLog.WriteLogForSocket("GetSellerBook" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), "FrontTrnService", "2 SellerBook call Price " + Price.ToString());
                }
                else
                {
                    //Rita 16-1-19 separate Order Type=4 records with bit , front side handle separate array
                    //Result = _dbContext.BuyerSellerInfo.FromSql(
                    //            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                    //                Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId 
                    //                from TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                    //                Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4 or TTQ.ordertype != 4 ) 
                    //                AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} 
                    //                AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id);
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                               @"SELECT Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype != 4 AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0
                                    AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                                    SELECT TOP 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER JOIN TradePairStastics TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id);
                }

                #region UnusedCode
                //Uday 19 - 11 - 2018 As Per ritamam instruction get all status record but check condition sum(TTQ.OrderTotalQty) -Sum(TTQ.SettledSellQty)
                //if (Price != -1)
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 1 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId
                //              from TradeTransactionQueue TTQ Where TTQ.Status = 4 and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.AskPrice={1} AND TTQ.ordertype<>3 Group by TTQ.AskPrice,PairID order by TTQ.AskPrice", id, Price);
                //    //HelperForLog.WriteLogForSocket("GetSellerBook" + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss.ffff"), "FrontTrnService", "2 SellerBook call Price " + Price.ToString());
                //}
                //else
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId
                //              from TradeTransactionQueue TTQ Where TTQ.Status = 4 and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,PairID order by TTQ.AskPrice", id);
                //}
                //Uday 19 - 11 - 2018 As Per ritamam instruction get all status record but check condition sum(TTQ.OrderTotalQty) -Sum(TTQ.SettledSellQty)
                //if (Price != -0)
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,(Select Top 1 GUID From TradePoolMaster TPM Where TPM.BidPrice = TTQ.AskPrice And TPM.PairId = TTQ.PairID) As OrderId
                //              from TradeTransactionQueue TTQ Where TTQ.Status = 4 and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.AskPrice={1} Group by TTQ.AskPrice,PairID order by TTQ.AskPrice", id, Price);
                //}
                //else
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,(Select Top 1 GUID From TradePoolMaster TPM Where TPM.BidPrice = TTQ.AskPrice And TPM.PairId = TTQ.PairID) As OrderId
                //              from TradeTransactionQueue TTQ Where TTQ.Status = 4 and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 Group by TTQ.AskPrice,PairID order by TTQ.AskPrice", id);
                //}


                //if (Price != -0)
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId
                //              from TradeTransactionQueue TTQ Where (TTQ.Status = 4 Or TTQ.Status = 1) and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.AskPrice={1} Group by TTQ.AskPrice,PairID 
                //              Having sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) > 0 order by TTQ.AskPrice", id, Price);
                //}
                //else
                //{
                //    Result = _dbContext.BuyerSellerInfo.FromSql(
                //                @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                //              Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId
                //              from TradeTransactionQueue TTQ Where (TTQ.Status = 4 Or TTQ.Status = 1) and TTQ.TrnType = 5 AND 
                //              TTQ.pairID = {0} AND TTQ.IsCancelled = 0 Group by TTQ.AskPrice,PairID 
                //              Having sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) > 0 order by TTQ.AskPrice", id);
                //}
                #endregion

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 20-2-19 for Margin Trading
        public List<GetBuySellBook> GetSellerBookMargin(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;
                if (Price != -1)
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                @"SELECT Top 1 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                                Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                FROM TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo
                                WHERE (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.AskPrice={1}
                                AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id, Price);
                }
                else
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                               @"SELECT Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype != 4 AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0
                                    AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                                    SELECT TOP 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER JOIN TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<StopLimitBuySellBook> GetStopLimitBuySellBooks(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0)
        {
            try
            {
                IQueryable<StopLimitBuySellBook> Result = null;
                if (IsCancel == 0)
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                else
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueue TTQ  INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo  INNER Join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueue TTQ INNER join TradeStopLoss TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStastics TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 20-2-19 for Margin Trading
        public List<StopLimitBuySellBook> GetStopLimitBuySellBooksMargin(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0)
        {
            try
            {
                IQueryable<StopLimitBuySellBook> Result = null;
                if (IsCancel == 0)
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                else
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueueMargin TTQ  INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo  INNER Join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueueMargin TTQ INNER join TradeStopLossMargin TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticsMargin TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetGraphDetailInfo> GetGraphData(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0)
        {
            try
            {
                string Query = "";
                //IQueryable<GetGraphResponse> Result;
                IQueryable<GetGraphDetailInfo> Result;
                if (socket == 0)
                {
                    #region unuseddata
                    //Uday 14-11-2018 Direct Query On Absolute View

                    //Query = "Select DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0) As DataDate," +
                    //               "MAX(T.High) As High, MIN(T.Low) As Low, SUM(T.Volume) As Volume," +
                    //               "(Select T1.OpenVal From TradeData T1 Where T1.TranNo = MIN(T.TranNo)) As OpenVal," +
                    //               "(Select T1.CloseVal From TradeData T1 Where T1.TranNo = MAX(T.TranNo)) As CloseVal From TradeData T" +
                    //               " Where PairId = {0} And DATEADD(#IntervalData#, DATEDIFF(MINUTE, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0) > DATEADD(Day,-30,dbo.GetISTDate()) GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0)" +
                    //               " Order By DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0) desc";

                    //Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());
                    //Result = _dbContext.GetGraphResponse.FromSql(Query, id);

                    //Query = "Select (DataDate * 1000) As DataDate,High,Low,[Open],[Close],Volume From TradeData1 Where PairId = {0} " +
                    //        " And DataDateVal > DATEADD(Day, -60, dbo.GetISTDate()) Order By DataDateVal Desc";
                    //Result = _dbContext.GetGraphResponse.FromSql(Query, id);

                    #endregion

                    //Uday 30-01-2019 Give Data In Proper Interval wise

                    //Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0))) * 1000 DataDate," +
                    //        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                    //        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[Open]," +
                    //        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[Close]" +
                    //        " FROM dbo.TradeGraphDetail AS T Where T.PairId = {0} And T.DataDate > DATEADD(Day, -30, dbo.GetISTDate())" +
                    //        " GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) Order By DataDate";

                    //Uday 22-02-2019 Change DataDate TO CreatedDatebcas DataDate In Transaction Date.
                    //Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, DataDate) / #IntervalTime# * #IntervalTime#, 0))) * 1000 DataDate," +
                    //      "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                    //      "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[Open]," +
                    //      "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[Close]" +
                    //      " FROM dbo.TradeGraphDetail AS T Where T.PairId = {0} " +
                    //      " GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, DataDate) / #IntervalTime# * #IntervalTime#, 0) Order By DataDate";

                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, CreatedDate) / #IntervalTime# * #IntervalTime#, 0))) * 1000 DataDate," +
                         "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                         "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MIN(T.Id))) AS[Open]," +
                         "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MAX(T.Id))) AS[Close]" +
                         " FROM dbo.TradeGraphDetail AS T Where T.PairId = {0} " +
                         " GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, CreatedDate) / #IntervalTime# * #IntervalTime#, 0)";

                    Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id);
                }
                else
                {
                    #region unuseddata
                    //Uday 14-11-2018 Direct Query On Absolute View

                    //Query = "Select DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0) As DataDate," +
                    //               "MAX(T.High) As High, MIN(T.Low) As Low, SUM(T.Volume) As Volume," +
                    //               "(Select T1.OpenVal From TradeData T1 Where T1.TranNo = MIN(T.TranNo)) As OpenVal," +
                    //               "(Select T1.CloseVal From TradeData T1 Where T1.TranNo = MAX(T.TranNo)) As CloseVal From TradeData T" +
                    //               " Where PairId = {0} And DataDate = {1} GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0)" +
                    //               " Order By DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, T.DataDate) / #IntervalTime# * #IntervalTime#, 0) desc";

                    //Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());


                    //Query = "Select (DataDate * 1000) As DataDate,High,Low,[Open],[Close],Volume From TradeData1 Where PairId = {0} And DataDateVal = {1}";

                    #endregion

                    //Uday 22-02-2019 Change DataDate TO CreatedDatebcas DataDate In Transaction Date.
                    //Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0))) DataDate," +
                    //      "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                    //      "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[Open]," +
                    //      "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[Close]" +
                    //      " FROM dbo.TradeGraphDetail AS T Where T.PairId = {0} And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) = {1}" +
                    //      " GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) Order By DataDate";

                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0))) * 1000 DataDate," +
                        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MIN(T.Id))) AS[Open]," +
                        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MAX(T.Id))) AS[Close]" +
                        " FROM dbo.TradeGraphDetail AS T Where T.PairId = {0} And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0) = {1}" +
                        " GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0)";

                    string MinuteData = Minute.ToString("yyyy-MM-dd HH:mm:00:000");
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id, MinuteData);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetGraphDetailInfo> GetGraphDataMargin(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0)
        {
            try
            {
                string Query = "";
                IQueryable<GetGraphDetailInfo> Result;
                if (socket == 0)
                {

                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, DataDate) / #IntervalTime# * #IntervalTime#, 0))) * 1000 DataDate," +
                          "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                          "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[Open]," +
                          "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[Close]" +
                          " FROM dbo.TradeGraphDetailMargin AS T Where T.PairId = {0} " +
                          " GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, DataDate) / #IntervalTime# * #IntervalTime#, 0) Order By DataDate";

                    Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id);
                }
                else
                {
                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0))) DataDate," +
                          "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                          "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[Open]," +
                          "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[Close]" +
                          " FROM dbo.TradeGraphDetailMargin AS T Where T.PairId = {0} And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) = {1}" +
                          " GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) Order By DataDate";

                    string MinuteData = Minute.ToString("yyyy-MM-dd HH:mm:00:000");
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id, MinuteData);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public decimal LastPriceByPair(long PairId, ref short UpDownBit)
        {
            try
            {
                Decimal lastPrice = 0;
                var pairStastics = _dbContext.TradePairStastics.Where(x => x.PairId == PairId).SingleOrDefault();
                UpDownBit = pairStastics.UpDownBit;
                lastPrice = pairStastics.LTP;
                return lastPrice;
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public PairRatesResponse GetPairRates(long PairId)
        {
            try
            {
                decimal BuyPrice = 0;
                decimal SellPrice = 0;
                PairRatesResponse response = new PairRatesResponse();
                var BidPriceRes = _dbContext.SettledTradeTransactionQueue.Where(e => e.TrnType == Convert.ToInt16(enTrnType.Buy_Trade) && e.Status == Convert.ToInt16(enTransactionStatus.Success) && e.PairID == PairId).OrderByDescending(e => e.TrnNo).FirstOrDefault();
                if (BidPriceRes != null)
                {
                    BuyPrice = BidPriceRes.BidPrice;
                }
                else
                {
                    BuyPrice = 0;
                }

                var AskPriceRes = _dbContext.TradeTransactionQueue.Where(e => e.TrnType == Convert.ToInt16(enTrnType.Sell_Trade) && e.Status == Convert.ToInt16(enTransactionStatus.Success) && e.PairID == PairId).OrderByDescending(e => e.TrnNo).FirstOrDefault();
                if (AskPriceRes != null)
                {
                    SellPrice = AskPriceRes.AskPrice;
                }
                else
                {
                    SellPrice = 0;
                }

                var PairResponse = _dbContext.TradePairDetail.Where(e => e.PairId == PairId).FirstOrDefault();

                if (PairResponse != null)
                {
                    if (BuyPrice == 0)
                    {
                        response.BuyPrice = PairResponse.BuyPrice;
                    }
                    else
                    {
                        response.BuyPrice = BuyPrice;
                    }
                    if (SellPrice == 0)
                    {
                        response.SellPrice = PairResponse.SellPrice;
                    }
                    else
                    {
                        response.SellPrice = SellPrice;
                    }
                    response.BuyMaxPrice = PairResponse.BuyMaxPrice;
                    response.BuyMinPrice = PairResponse.BuyMinPrice;
                    response.SellMaxPrice = PairResponse.SellMaxPrice;
                    response.SellMinPrice = PairResponse.SellMinPrice;
                }

                return response;
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 20-2-19 for Margin Trading
        public PairRatesResponse GetPairRatesMargin(long PairId)
        {
            try
            {
                decimal BuyPrice = 0;
                decimal SellPrice = 0;
                PairRatesResponse response = new PairRatesResponse();
                var BidPriceRes = _dbContext.SettledTradeTransactionQueueMargin.Where(e => e.TrnType == Convert.ToInt16(enTrnType.Buy_Trade) && e.Status == Convert.ToInt16(enTransactionStatus.Success) && e.PairID == PairId).OrderByDescending(e => e.TrnNo).FirstOrDefault();
                if (BidPriceRes != null)
                {
                    BuyPrice = BidPriceRes.BidPrice;
                }
                else
                {
                    BuyPrice = 0;
                }

                var AskPriceRes = _dbContext.TradeTransactionQueueMargin.Where(e => e.TrnType == Convert.ToInt16(enTrnType.Sell_Trade) && e.Status == Convert.ToInt16(enTransactionStatus.Success) && e.PairID == PairId).OrderByDescending(e => e.TrnNo).FirstOrDefault();
                if (AskPriceRes != null)
                {
                    SellPrice = AskPriceRes.AskPrice;
                }
                else
                {
                    SellPrice = 0;
                }

                var PairResponse = _dbContext.TradePairDetailMargin.Where(e => e.PairId == PairId).FirstOrDefault();

                if (PairResponse != null)
                {
                    if (BuyPrice == 0)
                    {
                        response.BuyPrice = PairResponse.BuyPrice;
                    }
                    else
                    {
                        response.BuyPrice = BuyPrice;
                    }
                    if (SellPrice == 0)
                    {
                        response.SellPrice = PairResponse.SellPrice;
                    }
                    else
                    {
                        response.SellPrice = SellPrice;
                    }
                    response.BuyMaxPrice = PairResponse.BuyMaxPrice;
                    response.BuyMinPrice = PairResponse.BuyMinPrice;
                    response.SellMaxPrice = PairResponse.SellMaxPrice;
                    response.SellMinPrice = PairResponse.SellMinPrice;
                }

                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TradePairTableResponse> GetTradePairAsset(long BaseId = 0)
        {
            try
            {
                IQueryable<TradePairTableResponse> Result;

                if (BaseId == 0)
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from Market M 
                                    Inner Join TradePairMaster TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetail TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMaster SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMaster SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 Order By M.ID");

                }
                else
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from Market M 
                                    Inner Join TradePairMaster TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetail TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStastics TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMaster SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMaster SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 And M.ServiceID = {0}", BaseId);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 22-2-19 for Margin Trading
        public List<TradePairTableResponse> GetTradePairAssetMargin(long BaseId = 0)
        {
            try
            {
                IQueryable<TradePairTableResponse> Result;

                if (BaseId == 0)
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from MarketMargin M 
                                    Inner Join TradePairMasterMargin TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetailMargin TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMasterMargin SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMasterMargin SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 Order By M.ID");

                }
                else
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from MarketMargin M 
                                    Inner Join TradePairMasterMargin TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetailMargin TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStasticsMargin TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMasterMargin SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMasterMargin SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 And M.ServiceID = {0}", BaseId);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ServiceMasterResponse> GetAllServiceConfiguration(int StatusData = 0)
        {

            try
            {
                IQueryable<ServiceMasterResponse> Result = null;

                if (StatusData == 0)
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select SM.IsIntAmountAllow as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID,
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMaster SM
                            Inner Join ServiceDetail SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStastics SS On SS.ServiceId = SM.Id Where SM.Status = 1");

                }
                else
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select SM.IsIntAmountAllow as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID, 
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMapping STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMaster SM
                            Inner Join ServiceDetail SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStastics SS On SS.ServiceId = SM.Id Where SM.Status = 1 Or SM.Status = 0");
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 5-3-19 for Margin Tradin
        public List<ServiceMasterResponse> GetAllServiceConfigurationMargin(int StatusData = 0)
        {
            try
            {
                IQueryable<ServiceMasterResponse> Result = null;

                if (StatusData == 0)
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select cast (0 as smallint) as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID,
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMasterMargin SM
                            Inner Join ServiceDetailMargin SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStasticsMargin SS On SS.ServiceId = SM.Id Where SM.Status = 1");

                }
                else
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select cast (0 as smallint) as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID, 
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingMargin STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMasterMargin SM
                            Inner Join ServiceDetailMargin SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStasticsMargin SS On SS.ServiceId = SM.Id Where SM.Status = 1 Or SM.Status = 0");
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<GetGraphResponsePairWise> GetGraphDataEveryLastMin(string Interval)
        {
            try
            {
                Interval = Interval.Replace(".", ":");  // Uday 01-03-2019 Solve error for convertion
                string Query = "";
                IQueryable<GetGraphResponsePairWise> Result;

                //Uday 28-02-2019  Give Transaction date wise data so give data as per crteated date wise
                //Query = " SELECT (Select Top 1 PairName From TradePairMaster TPM Where TPM.Id = T.PairId) As PairName," +
                //        "CONVERT(BIGINT, DATEDIFF(ss, '01-01-1970 00:00:00', DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0))) * 1000 DataDate, " +
                //        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume, " +
                //        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MIN(T.TranNo))) AS[OpenVal], " + //komal solve error
                //        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.TranNo = MAX(T.TranNo))) AS[CloseVal] " +
                //        "FROM dbo.TradeGraphDetail AS T Where T.PairId In(Select TM.Id From TradePairMaster TM) " +
                //        "And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0) = {0} " +
                //        "GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, DataDate) / 1 * 1, 0),PairId Order By DataDate ";


                Query = " SELECT (Select Top 1 PairName From TradePairMaster TPM Where TPM.Id = T.PairId) As PairName," +
                        "CONVERT(BIGINT, DATEDIFF(ss, '01-01-1970 00:00:00', DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0))) * 1000 DataDate, " +
                        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume, " +
                        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MIN(T.Id))) AS[OpenVal], " + //komal solve error
                        "(SELECT LTP FROM dbo.TradeGraphDetail AS T1 WHERE(T1.Id = MAX(T.Id))) AS[CloseVal] " +
                        "FROM dbo.TradeGraphDetail AS T Where T.PairId In(Select TM.Id From TradePairMaster TM) " +
                        "And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0) = {0} " +
                        "GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0),PairId";

                //Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());
                //string MinuteData = Minute.ToString("yyyy-MM-dd HH:mm:00:000");
                //Interval = "2018-10-11 23:06:00";
                Result = _dbContext.GetGraphResponseByPair.FromSql(Query, Interval);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return null;
            }
        }
        //Rita 5-3-19 for Margin Tradin
        public List<GetGraphResponsePairWise> GetGraphDataEveryLastMinMargin(string Interval)
        {
            try
            {
                Interval = Interval.Replace(".", ":");  // Uday 01-03-2019 Solve error for convertion
                string Query = "";
                IQueryable<GetGraphResponsePairWise> Result;

                Query = " SELECT (Select Top 1 PairName From TradePairMasterMargin TPM Where TPM.Id = T.PairId) As PairName," +
                        "CONVERT(BIGINT, DATEDIFF(ss, '01-01-1970 00:00:00', DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0))) * 1000 DataDate, " +
                        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume, " +
                        "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.Id = MIN(T.Id))) AS[OpenVal], " + //komal solve error
                        "(SELECT LTP FROM dbo.TradeGraphDetailMargin AS T1 WHERE(T1.Id = MAX(T.Id))) AS[CloseVal] " +
                        "FROM dbo.TradeGraphDetailMargin AS T Where T.PairId In(Select TM.Id From TradePairMasterMargin TM) " +
                        "And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0) = {0} " +
                        "GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0),PairId";

                Result = _dbContext.GetGraphResponseByPair.FromSql(Query, Interval);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public HighLowViewModel GetHighLowValue(long PairId, int Day)
        {
            try
            {
                IQueryable<HighLowViewModel> Result;

                Result = _dbContext.HighLowViewModel.FromSql(
                            @"Select IsNull(MIN(T.Price),0) As LowPrice,IsNull(MAX(T.Price),0) As HighPrice From 
                                (Select Case TTQ.TrnType WHEN 4 Then TTQ.BidPrice WHEN 5 Then TTQ.AskPrice END As Price From SettledTradeTransactionQueue TTQ Where TTQ.Status = 1 And PairId = {0}
                                And TTQ.TrnDate Between DateAdd(Day,{1},dbo.GetISTDate()) And dbo.GetISTDate()) As T", PairId, Day);

                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public HighLowViewModel GetHighLowValueMargin(long PairId, int Day)
        {
            try
            {
                IQueryable<HighLowViewModel> Result;

                Result = _dbContext.HighLowViewModel.FromSql(
                            @"Select IsNull(MIN(T.Price),0) As LowPrice,IsNull(MAX(T.Price),0) As HighPrice From 
                                (Select Case TTQ.TrnType WHEN 4 Then TTQ.BidPrice WHEN 5 Then TTQ.AskPrice END As Price From SettledTradeTransactionQueueMargin TTQ Where TTQ.Status = 1 And PairId = {0}
                                And TTQ.TrnDate Between DateAdd(Day,{1},dbo.GetISTDate()) And dbo.GetISTDate()) As T", PairId, Day);

                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<FavouritePairInfo> GetFavouritePairs(long UserId)
        {
            try
            {
                IQueryable<FavouritePairInfo> Result;

                Result = _dbContext.FavouritePairViewModel.FromSql(
                            @"Select FP.PairId,TPM.PairName As Pairname,TPS.Currentrate,TPD.BuyFees,TPD.SellFees,
                            SM1.Name As ChildCurrency,SM1.SMSCode As Abbrevation,SM2.Name As BaseCurrency,SM2.SMSCode As BaseAbbrevation,
                            TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr,TPS.Low24Hr,TPS.HighWeek,TPS.LowWeek,
                            TPS.High52Week,TPS.Low52Week,TPS.UpDownBit  From FavouritePair FP 
                            Inner Join TradePairMaster TPM On TPM.Id = FP.PairId
                            Inner Join TradePairDetail TPD On TPD.PairId = TPM.Id
                            Inner Join ServiceMaster SM1 On SM1.Id = TPM.SecondaryCurrencyId
                            Inner Join ServiceMaster SM2 On SM2.Id = TPM.BaseCurrencyId
                            Inner Join TradePairStastics TPS On TPS.PairId = TPM.Id
                            Where FP.UserId = {0} And FP.Status = 1 and TPM.Status=1", UserId);//Rita 23-5-19 added enable pair condition

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 23-2-19 for Margin Trading
        public List<FavouritePairInfo> GetFavouritePairsMargin(long UserId)
        {
            try
            {
                IQueryable<FavouritePairInfo> Result;

                Result = _dbContext.FavouritePairViewModel.FromSql(
                            @"Select FP.PairId,TPM.PairName As Pairname,TPS.Currentrate,TPD.BuyFees,TPD.SellFees,
                            SM1.Name As ChildCurrency,SM1.SMSCode As Abbrevation,SM2.Name As BaseCurrency,SM2.SMSCode As BaseAbbrevation,
                            TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr,TPS.Low24Hr,TPS.HighWeek,TPS.LowWeek,
                            TPS.High52Week,TPS.Low52Week,TPS.UpDownBit  From FavouritePairMargin FP 
                            Inner Join TradePairMasterMargin TPM On TPM.Id = FP.PairId
                            Inner Join TradePairDetailMargin TPD On TPD.PairId = TPM.Id
                            Inner Join ServiceMasterMargin SM1 On SM1.Id = TPM.SecondaryCurrencyId
                            Inner Join ServiceMasterMargin SM2 On SM2.Id = TPM.BaseCurrencyId
                            Inner Join TradePairStasticsMargin TPS On TPS.PairId = TPM.Id
                            Where FP.UserId = {0} And FP.Status = 1 and TPM.Status=1", UserId);//Rita 23-5-19 added enable pair condition

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<PairStatisticsCalculation> GetPairStatisticsCalculation()
        {
            try
            {
                IQueryable<PairStatisticsCalculation> Result;

                Result = _dbContext.PairStatisticsCalculation.FromSql(
                            @"Select TPM.Id As PairId,
                            SUM((Case When STTQ.TrnType = 4 Then STTQ.BidPrice When STTQ.TrnType = 5 Then STTQ.AskPrice Else 0 End) * 
                            (Case When STTQ.TrnType = 4 Then STTQ.BuyQty When STTQ.TrnType = 5 Then STTQ.SellQty Else 0 End)) As Volume,
                            IsNull((((Select Top 1 (Case When STTQ.TrnType = 4 Then STTQ.BidPrice When STTQ.TrnType = 5 Then STTQ.AskPrice Else 0 End) As Price From SettledTradeTransactionQueue STTQ Where STTQ.PairId=TPM.Id And STTQ.TrnDate >= DateAdd(Day,-1,dbo.GetISTDate()) And STTQ.Status = 1 Order By Id desc) * 100 ) /
                            (Select Top 1 (Case When STTQ.TrnType = 4 Then STTQ.BidPrice When STTQ.TrnType = 5 Then STTQ.AskPrice Else 0 End) As Price From SettledTradeTransactionQueue STTQ Where STTQ.PairId=TPM.Id And STTQ.TrnDate >= DateAdd(Day,-1,dbo.GetISTDate()) And STTQ.Status = 1 Order By Id Asc) - 100),0) As ChangePer,
                            IsNull((Select Top 1 (Case When STTQ.TrnType = 4 Then STTQ.BidPrice When STTQ.TrnType = 5 Then STTQ.AskPrice Else 0 End) As Price From SettledTradeTransactionQueue STTQ Where STTQ.PairId=TPM.Id And STTQ.TrnDate >= DateAdd(Day,-1,dbo.GetISTDate()) And STTQ.Status = 1 Order By Id desc) -
                            (Select Top 1 (Case When STTQ.TrnType = 4 Then STTQ.BidPrice When STTQ.TrnType = 5 Then STTQ.AskPrice Else 0 End) As Price From SettledTradeTransactionQueue STTQ Where STTQ.PairId=TPM.Id And STTQ.TrnDate >= DateAdd(Day,-1,dbo.GetISTDate()) And STTQ.Status = 1 Order By Id Asc),0) As ChangeValue From TradePairMaster TPM 
                            Left Outer Join SettledTradeTransactionQueue STTQ On STTQ.PairID = TPM.Id And STTQ.TrnDate >= DateAdd(Day,-1,dbo.GetISTDate()) And STTQ.Status = 1
                            Group By TPM.Id");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null; // Uday 07-01-2019 not throw the exception
            }
        }

        public void UpdatePairStatisticsCalculation(List<TradePairStastics> PairDataUpdated)
        {
            try
            {
                _dbContext.Database.BeginTransaction();

                foreach (var pair in PairDataUpdated)
                {
                    _dbContext.Entry(pair).State = EntityState.Modified;
                }

                _dbContext.SaveChanges();
                _dbContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public List<LPStatusCheckData> LPstatusCheck()
        {
            try
            {
                IQueryable<LPStatusCheckData> Result;

                Result = _dbContext.LPStatusCheckData.FromSql(
                            @"Select SD.ID AS SerProDetailID, TR.TrnID AS TrnRefNo, SD.AppTypeID ,TTQ.TrnNo,CallStatus,TTQ.ordertype,TTQ.TrnType, TTQ.Status,RC.OpCode As Pair,
                                CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, 
                                CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  
                                TTQ.TrnDate as DateTime from TradeTransactionQueue TTQ INNER JOIN TransactionQueue TQ ON TQ.Id = TTQ.TrnNo INNER JOIN TransactionRequest TR 
                                ON TR.TrnNo = TQ.Id
                                INNER JOIN ServiceProviderDetail SD ON SD.ID = TQ.SerProId INNER JOIN RouteConfiguration RC ON RC.id  = Tq.RouteID
                                WHERE SD.ProTypeID = 3 AND TTQ.IsAPITrade = 1  AND TTQ.Status = 4 AND TQ.Status = 4  AND TQ.CallStatus = 0 Order By TTQ.TrnNo Desc");

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null; // Uday 07-01-2019 not throw the exception
            }
        }

        public List<LPStatusCheckDataArbitrage> LPstatusCheckArbitrage()
        {
            try
            {
                IQueryable<LPStatusCheckDataArbitrage> Result;

                //Commented by khushali old
                Result = _dbContext.LPStatusCheckDataArbitrage.FromSql(
                            @"Select SD.ID AS SerProDetailID, TR.TrnID AS TrnRefNo, SD.AppTypeID ,TTQ.TrnNo,CallStatus,TTQ.ordertype,TTQ.TrnType, TTQ.Status,RC.OpCode As Pair,
                                CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  
                                TTQ.TrnDate as DateTime from TradeTransactionQueueArbitrage TTQ INNER JOIN TransactionQueueArbitrage TQ ON TQ.Id = TTQ.TrnNo INNER JOIN ArbitrageTransactionRequest TR 
                                ON TR.TrnNo = TQ.Id INNER JOIN ServiceProviderDetailArbitrage SD ON SD.ID = TQ.SerProDetailId INNER JOIN RouteConfigurationArbitrage RC ON RC.id  = Tq.RouteID
                                WHERE SD.ProTypeID = 3 AND TTQ.IsAPITrade = 1  AND TTQ.Status = 4 AND TQ.Status = 4  AND TQ.CallStatus = 0 and dbo.GetISTDate() >= DATEADD(MINUTE,5,TTQ.CreatedDate) Order By TTQ.TrnNo Desc
                                ");

                //Result = _dbContext.LPStatusCheckDataArbitrage.FromSql(
                //           @"Select SD.ID AS SerProDetailID, TR.TrnID AS TrnRefNo, SD.AppTypeID ,TTQ.TrnNo,CallStatus,
                //            TTQ.ordertype,TTQ.TrnType, TTQ.Status,RC.OpCode As Pair,
                //            CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, 
                //            CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount,  
                //            TTQ.TrnDate as DateTime from TradeTransactionQueueArbitrage TTQ 
                //            INNER JOIN TransactionQueueArbitrage TQ ON TQ.Id = TTQ.TrnNo 
                //            INNER JOIN ArbitrageTransactionRequest TR 
                //            ON TR.TrnNo = TQ.Id
                //            INNER JOIN ServiceProviderDetailArbitrage SD ON SD.ServiceProID = TQ.SerProId and SD.ID = TQ.SerProDetailID  and SD.TrnTypeID = TTQ.TrnType
                //            INNER JOIN RouteConfigurationArbitrage RC ON RC.id  = Tq.RouteID
                //            WHERE SD.ProTypeID = 3 AND TTQ.IsAPITrade = 1  AND TTQ.Status = 4 
                //            AND TQ.Status = 4  AND TQ.CallStatus = 0 Order By TTQ.TrnNo Desc");
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null; // Uday 07-01-2019 not throw the exception
            }
        }

        public List<ReleaseAndStuckOrdercls> ReleaseAndStuckOrder(DateTime Date)
        {
            IQueryable<ReleaseAndStuckOrdercls> Result = null;
            string Qry = "";

            try
            {
                Qry = "Select TTQ.TrnNo " +
                  "from TradeTransactionQueue TTQ" +
                  " LEFT JOIN  TradeSellerListV1 TS ON TS.TrnNo = TTQ.TrnNo" +
                  " LEFT JOIN  TradeBuyerListV1 TB ON TB.TrnNo = TTQ.TrnNo" +
                   " WHERE TTQ.Status = 4 AND ( TS.IsProcessing = 1 OR TB.IsProcessing = 1 ) AND TTQ.UpdatedDate <= {0} Order By TTQ.TrnNo Desc ";

                Result = _dbContext.ReleaseAndStuckOrder.FromSql(Qry, Date);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }

        }
        //khuhsali 15-05-2019 for Marging trading ReleaseAndStuckOrder cron 
        public List<ReleaseAndStuckOrdercls> MarginReleaseAndStuckOrder(DateTime Date)
        {
            IQueryable<ReleaseAndStuckOrdercls> Result = null;
            string Qry = "";

            try
            {
                Qry = @"Select TTQ.TrnNo 
                        from TradeTransactionQueueMargin TTQ 
                        LEFT JOIN TradeSellerListMarginV1 TS ON TS.TrnNo = TTQ.TrnNo 
                        LEFT JOIN  TradeBuyerListMarginV1 TB ON TB.TrnNo = TTQ.TrnNo 
                        WHERE TTQ.Status = 4 AND(TS.IsProcessing = 1 OR TB.IsProcessing = 1) AND TTQ.UpdatedDate <= {0} 
                        Order By TTQ.TrnNo Desc";
                Result = _dbContext.ReleaseAndStuckOrder.FromSql(Qry, Date);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }

        }

        #endregion

        #region Liquidity Configuration

        //khuhsali 14-05-2019 for Liquidity configuration
        public List<ConfigureLP> GetLiquidityConfigurationData(short LPType)
        {
            IQueryable<ConfigureLP> Result = null;
            string Qry = "";

            try
            {
                //Qry = @"select distinct TM.PairName as Pair , cast (AP.Id as smallint) as LPType
                //        FROM RouteConfiguration RC
                //        INNER JOIN ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID
                //        INNER JOIN  AppType AP ON AP.Id = SD.AppTypeID
                //        INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID
                //        INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                //        WHERE RC.TrnType in (4, 5) and 
                //        SD.Status = 1 AND SM.Status = 1 AND RC.Status = 1 AND TM.Status = 1 and AP.Id in (9,10,11,12,13)"; //AP.Id = {0} and

                /// Change in query add AP.Id 20 For OkEx by Pushpraj as on 11-06-2019
                Qry = @"select distinct TM.PairName as Pair , cast (AP.Id as smallint) as LPType
                        FROM RouteConfiguration RC
                        INNER JOIN ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID
                        INNER JOIN  AppType AP ON AP.Id = SD.AppTypeID
                        INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID
                        INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                        WHERE RC.TrnType in (4, 5) and 
                        SD.Status = 1 AND SM.Status = 1 AND RC.Status = 1 AND TM.Status = 1 and AP.Id in (9,10,11,12,13,18,19,20)"; //AP.Id = {0} and

                Result = _dbContext.ConfigureLP.FromSql(Qry); //LPType

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }

        }

        //komal 10-06-2019 make Arbitrage Method
        public List<ConfigureLPArbitrage> GetLiquidityConfigurationDataArbitrage(short LPType)
        {
            IQueryable<ConfigureLPArbitrage> Result = null;
            string Qry = "";

            try
            {
                Qry = @"select distinct TM.PairName as Pair , cast (AP.Id as smallint) as LPType,SM.ProviderName,TM.Id AS PairID
                        FROM RouteConfigurationArbitrage RC
                        INNER JOIN ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID
                        INNER JOIN  AppType AP ON AP.Id = SD.AppTypeID
                        INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID
                        INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                        WHERE RC.TrnType in (4, 5) and 
                        SD.Status = 1 AND SM.Status = 1 AND RC.Status = 1 AND TM.Status = 1 and AP.Id in (9,10,11,12,13,18)"; //AP.Id = {0} and

                Result = _dbContext.ConfigureLPArbitrage.FromSql(Qry); //LPType

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }

        }

        public bool GetLocalConfigurationData(short LPType)
        {
            string Qry = "";
            try
            {
                Qry = @"insert into cryptowatcher (LTP,pair,Lptype) 
                        select distinct TP.LTP, TM.PairName as Pair , 8  as Lptype 
                        FROM  TradePairMaster TM 
                        INNER JOIN  TradePairStastics TP ON TP.PairId = TM.id 
                        WHERE TM.Status = 1 and TM.PairName not in (select pair from cryptowatcher where LPType = {0});
                        UPDATE cryptowatcher SET cryptowatcher.LTP = TP.LTP 
                        FROM  TradePairMaster TM 
                        INNER JOIN  TradePairStastics TP ON TP.PairId = TM.id 
                        WHERE TM.Status = 1 and  cryptowatcher.LPType = {0} and cryptowatcher.pair = TM.PairName";

                var res = _dbContext.Database.ExecuteSqlCommand(Qry, LPType);
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return false;
            }
        }

        public bool UpdateLTPData(LTPcls LTPData)
        {
            //IQueryable<ConfigureLP> Result = null;
            string Qry = "";

            try
            {
                Qry = @"update CryptoWatcher set LTP = {0} where  Pair = {1} and LPType = {2} ";
                var res = _dbContext.Database.ExecuteSqlCommand(Qry, LTPData.Price, LTPData.Pair, LTPData.LpType);

                if (res > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return false;
            }
        }

        public List<CryptoWatcher> GetPairWiseLTPData(GetLTPDataLPwise LTPData)
        {
            IQueryable<CryptoWatcher> Result = null;
            string Qry = "";

            try
            {
                Qry = @"select * from CryptoWatcher where Pair = {0} and LPType in ( " + LTPData.LpType + " )";
                Result = _dbContext.CryptoWatcher.FromSql(Qry, LTPData.Pair.Trim());

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public bool InsertLTPData(LTPcls LTPData)
        {
            //IQueryable<ConfigureLP> Result = null;
            string Qry = "";

            try
            {
                Qry = @"insert into CryptoWatcher values ({0} ,{1} ,{2})";

                var res = _dbContext.Database.ExecuteSqlCommand(Qry, LTPData.Price, LTPData.Pair.Trim(), LTPData.LpType);

                if (res > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return false;
            }
        }

        public LPKeyVault BalanceCheckLP(long SerproID)
        {
            IQueryable<LPKeyVault> Result = null;
            string Qry = "";
            LPKeyVault Data = new LPKeyVault();
            try
            {
                Qry = @"SELECT TOP 1 APIKey , SecretKey , AppTypeID FROM ServiceProviderMaster SM 
                    INNER JOIN ServiceProviderDetail SD ON SM.Id = SD.ServiceProID 
                    INNER JOIN ServiceProConfiguration SC ON SC.Id = SD.ServiceProConfigID where SM.ID = {0}";

                Result = _dbContext.LPKeyVault.FromSql(Qry, SerproID);

                if (Result != null)
                    Data = Result.ToList().FirstOrDefault();

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Data;
            }
        }

        public LPKeyVault BalanceCheckLPArbitrage(long SerproID)
        {
            IQueryable<LPKeyVault> Result = null;
            string Qry = "";
            LPKeyVault Data = new LPKeyVault();
            try
            {
                Qry = @"SELECT TOP 1 APIKey , SecretKey , AppTypeID FROM ServiceProviderMasterArbitrage SM 
                    INNER JOIN ServiceProviderDetailArbitrage SD ON SM.Id = SD.ServiceProID 
                    INNER JOIN ServiceProConfigurationArbitrage SC ON SC.Id = SD.ServiceProConfigID where SM.ID = {0}";

                Result = _dbContext.LPKeyVault.FromSql(Qry, SerproID);

                if (Result != null)
                    Data = Result.ToList().FirstOrDefault();

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Data;
            }
        }

        #endregion

        #region History method

        public List<ActiveOrderDataResponseArbitrage> GetActiveOrderArbitrage(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<ActiveOrderDataResponseArbitrage> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;

                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {2} AND {3} ";
                }
                Qry = "Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                      "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                      "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                      "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                      "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                      "TTQ.IsCancelled from TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo = TSL.TrnNo INNER join TradePairStasticsArbitrage TPS on TTQ.PairID = TPS.PairId " +
                      "INNER JOIN TransactionQueueArbitrage TQ on TTQ.TrnNo=TQ.Id " +
                      "where TTQ.Status = {1} AND TTQ.MemberID = {0} AND TSL.ordertype<>3 " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.ActiveOrderDataResponseArbitrage.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Hold), fDate, tDate);

                return Result.ToList();

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public List<RecentOrderResposeArbitrage> GetRecentOrderArbitrage(long PairId, long MemberID)
        {
            string sCondition = "";
            IQueryable<RecentOrderResposeArbitrage> Result;
            try
            {
                if (PairId != 999)
                    sCondition = " AND TTQ.PairID ={4} ";

                string Qry = "Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty END as Qty , " +
                            "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 4  then 'Hold' when TTQ.Status = 2 OR TTQ.Status = 1 then 'Cancel' end as status from TradeTransactionQueueArbitrage TTQ " +
                            "INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo = TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID WHERE TTQ.Status in ({2}, {3}) AND (TTQ.ordertype<>3 OR (TTQ.ordertype=3 AND TTQ.Status <> 4)) And TTQ.MemberID ={0} AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition +
                            "UNION ALL Select TTQ.TrnNo,TTQ.Status as StatusCode,TSL.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnTypeName as Type,TSL.ISFollowersReq, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as Qty ," +
                            "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty END as SettledQty,TTQ.SettledDate," +
                            "TTQ.TrnDate as DateTime,case when TTQ.Status = 1  then 'Success'  end as status from SettledTradeTransactionQueueArbitrage TTQ " +
                            "INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo = TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ on TTQ.TrnNo=TQ.Id WHERE TTQ.Status in ({1})  And TTQ.MemberID ={0} AND TSL.ordertype<>3 AND TTQ.TrnDate > DATEADD(HOUR, -24, dbo.GetISTDate()) " + sCondition + " order by TTQ.TrnDate desc";

                if (PairId == 999)
                    Result = _dbContext.RecentOrderResposeArbitrage.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail));
                else
                    Result = _dbContext.RecentOrderResposeArbitrage.FromSql(Qry, MemberID, Convert.ToInt16(enTransactionStatus.Success), Convert.ToInt16(enTransactionStatus.Hold), Convert.ToInt16(enTransactionStatus.OperatorFail), PairId);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<OpenOrderQryResponse> GetOpenOrderArbitrage(long MemberID, string FromDate, string ToDate, long PairId, short trnType)
        {
            string Qry = "";
            string sCondition = " ";
            IQueryable<OpenOrderQryResponse> Result;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {
                if (PairId != 999)
                    sCondition += " AND TTQ.PairId =" + PairId;
                if (trnType != 999)
                    sCondition += " AND TTQ.TrnType =" + trnType;
                if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND TTQ.TrnDate Between {1} AND {2} ";
                }

                Qry = @"Select TTQ.TrnNo,TTQ.ordertype,TTQ.PairName,TTQ.PairId,TTQ.TrnDate,TTQ.TrnTypeName as Type,TTQ.Order_Currency,TTQ.Delivery_Currency,  " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.SellQty WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty ELSE 0 END as Amount, " +
                    "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice ELSE 0 END as Price, " +
                    "TTQ.IsCancelled from TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId " +
                    "where ((TSL.MarketIndicator=0 AND TSL.StopPrice<=TPS.LTP) OR (TSL.MarketIndicator=1 AND TSL.StopPrice >= TPS.LTP)) AND TTQ.Status=4 AND TTQ.ordertype=4  And TTQ.MemberID ={0} " + sCondition + " Order By TTQ.TrnDate desc";

                Result = _dbContext.OpenOrderRespose.FromSql(Qry, MemberID, fDate, tDate);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<TradeHistoryResponceArbitrage> GetTradeHistoryArbitrage(long MemberID, string sCondition, string FromDate, string ToDate, int page, int IsAll, long TrnNo = 0)
        {
            IQueryable<TradeHistoryResponceArbitrage> Result = null;
            string qry = "";
            DateTime fDate, tDate;

            try
            {
                if (IsAll == 0) //case for OrderHistory settled only
                {
                    var sCon = "";

                    long PairId = MemberID;
                    if (PairId != 999)
                        sCon = "and TTQ.PairID =" + PairId;
                    if (TrnNo != 0)
                        sCon = "and TTQ.TrnNo =" + TrnNo;

                    qry = "Select top 100 TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN (select top 1 TakerPrice from TradePoolQueueArbitrageV1 where (MakerTrnNo=TTQ.TrnNo or TakerTrnNo=TTQ.TrnNo) and status=1 order by id desc) " +
                            " WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                            "WHERE TTQ.Status in (1,4) AND TQ.SerProID=2000002 " + sCon + " Order By TTQ.SettledDate desc";
                    //Rita 22-3-19 order by settledDate
                    //komal 10-06-2019 AND "TQ.SerProID=0" for local trade only

                    Result = _dbContext.TradeHistoryInfoArbitrage.FromSql(qry);

                }
                else //case for tradehistory 
                {
                    if (IsAll == 1)//success
                    {
                        qry = "Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, " +
                            "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                            "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty, " +
                            "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                            "TTQ.SettledDate,TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled from " +
                            "SettledTradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                            "WHERE " + sCondition + " AND TTQ.Status in (1,4) AND TTQ.IsCancelled=0 AND TTQ.MemberID=" + MemberID + " Order By TTQ.SettledDate desc";
                        //Rita 22-3-19 order by settledDate
                    }
                    else if (IsAll == 2) //system fail
                    {
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime, " +
                               "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Fail' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                               "WHERE " + sCondition + "AND TTQ.Status=" + Convert.ToInt16(enTransactionStatus.SystemFail) + " AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else if (IsAll == 9) // Cancel
                    {
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TTQ.ordertype,TTQ.TrnTypeName as Type, " +
                               "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price," +
                               "CASE WHEN TTQ.TrnType = 4  THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount,TTQ.TrnDate as DateTime," +
                               "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                               "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate," +
                               "TTQ.Status,'Cancel' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled " +
                               "from TradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                               "WHERE " + sCondition + " AND TTQ.IsCancelled=1 AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";
                    }
                    else //settle,cancel,fail
                    {
                        qry = @"Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, 'Success' as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TSL.ordertype=2 THEN CAST (0 AS DECIMAL(28,18)) WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from SettledTradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                                "WHERE " + sCondition + "AND TTQ.Status in (1,4) and TTQ.IsCancelled = 0 AND TTQ.MemberID=" + MemberID + " " +
                                "UNION ALL Select TTQ.TrnNo,TTQ.StatusCode,TSL.ordertype,TTQ.TrnTypeName as Type, TTQ.TrnDate as DateTime, TTQ.Status, CASE WHEN TTQ.Status=2 THEN 'Cancel' ELSE 'Cancel' END as StatusText,TTQ.PairName,TQ.ChargeRs,TQ.Chargecurrency,TTQ.IsCancelled, " +
                                "CASE WHEN TTQ.TrnType = 5 THEN TTQ.AskPrice WHEN TTQ.TrnType = 4 THEN TTQ.BidPrice Else 0 END as Price, " +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.BuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SellQty Else 0 END as Amount, " +
                                "CASE WHEN TQ.SerProID=0 THEN 'LOCAL' ELSE (select ProviderName from ServiceProviderMasterArbitrage where id=TQ.SerProID) END as ExchangeName," +
                                "CASE WHEN TTQ.TrnType = 4 THEN TTQ.SettledBuyQty WHEN TTQ.TrnType = 5 THEN TTQ.SettledSellQty Else 0 END as SettledQty,TTQ.SettledDate " +
                                "from TradeTransactionQueueArbitrage TTQ INNER JOIN TradeStopLossArbitrage TSL ON TSL.TrnNo =TTQ.TrnNo INNER JOIN TransactionQueueArbitrage TQ ON TTQ.TrnNo=TQ.ID " +
                                "WHERE " + sCondition + "AND (TTQ.Status=" + Convert.ToInt16(enTransactionStatus.OperatorFail) + " OR (TTQ.Status = " + Convert.ToInt16(enTransactionStatus.Success) + " and TTQ.IsCancelled = 1)) AND TTQ.MemberID=" + MemberID + " Order By TTQ.TrnDate desc";

                    }
                    if (!string.IsNullOrEmpty(FromDate) && !string.IsNullOrEmpty(ToDate))
                    {
                        fDate = DateTime.ParseExact(FromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        ToDate = ToDate + " 23:59:59";
                        tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                        Result = _dbContext.TradeHistoryInfoArbitrage.FromSql(qry, FromDate, ToDate);
                    }
                    else
                        Result = _dbContext.TradeHistoryInfoArbitrage.FromSql(qry);

                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        #endregion ====================================

        #region Arbitrage Trade data Method
        public List<GetBuySellBook> GetBuyerBookArbitrage(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;

                if (Price != -1)//SignalR call
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"Select Top 1 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                    From TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                                    Where (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.BidPrice={1}
                                    Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id, Price);
                }
                else//API call
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                  @"SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype <> 4 AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                                    SELECT Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER join TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0} AND TTQ.IsAPITrade=0
                                    GROUP By TTQ.BidPrice,TTQ.PairID HAVING (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc", id);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetBuySellBook> GetSellerBookArbitrage(long id, decimal Price = -1)
        {
            try
            {
                IQueryable<GetBuySellBook> Result;

                if (Price != -1)
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                                @"SELECT Top 1 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,
                                Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit 
                                FROM TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo
                                WHERE (TTQ.ordertype != 4 ) AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.AskPrice={1}
                                AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id, Price);
                }
                else
                {
                    Result = _dbContext.BuyerSellerInfo.FromSql(
                               @"SELECT Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                                    WHERE TTQ.ordertype != 4 AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0
                                    AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                                    SELECT TOP 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsStopLimit
                                    FROM TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER JOIN TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId
                                    WHERE (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                                    AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsAPITrade=0 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                                    GROUP by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice", id);
                }

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " #PairId# : " + id + " #Price# : " + Price, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetGraphDetailInfo> GetGraphDataArbitrage(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0)
        {
            try
            {
                string Query = "";
                IQueryable<GetGraphDetailInfo> Result;
                if (socket == 0)
                {
                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, CreatedDate) / #IntervalTime# * #IntervalTime#, 0))) * 1000 DataDate," +
                         "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                         "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MIN(T.Id))) AS[Open]," +
                         "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MAX(T.Id))) AS[Close]" +
                         " FROM dbo.TradeGraphDetailArbitrage AS T Where T.PairId = {0} " +
                         " GROUP BY DATEADD(#IntervalData#, DATEDIFF(#IntervalData#, 0, CreatedDate) / #IntervalTime# * #IntervalTime#, 0)";

                    Query = Query.Replace("#IntervalData#", IntervalData).Replace("#IntervalTime#", IntervalTime.ToString());
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id);
                }
                else
                {
                    Query = "SELECT CONVERT(BIGINT,DATEDIFF(ss,'01-01-1970 00:00:00',DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0))) * 1000 DataDate," +
                        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume," +
                        "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MIN(T.Id))) AS[Open]," +
                        "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MAX(T.Id))) AS[Close]" +
                        " FROM dbo.TradeGraphDetailArbitrage AS T Where T.PairId = {0} And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0) = {1}" +
                        " GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0)";

                    string MinuteData = Minute.ToString("yyyy-MM-dd HH:mm:00:000");
                    Result = _dbContext.GetGraphResponse.FromSql(Query, id, MinuteData);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<GetGraphResponsePairWise> GetGraphDataEveryLastMinArbitrage(string Interval)
        {
            try
            {
                Interval = Interval.Replace(".", ":");
                string Query = "";
                IQueryable<GetGraphResponsePairWise> Result;

                Query = " SELECT (Select Top 1 PairName From TradePairMasterArbitrage TPM Where TPM.Id = T.PairId) As PairName," +
                        "CONVERT(BIGINT, DATEDIFF(ss, '01-01-1970 00:00:00', DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0))) * 1000 DataDate, " +
                        "MAX(LTP) AS High, MIN(LTP) AS Low, SUM(Quantity * LTP) AS Volume, " +
                        "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MIN(T.Id))) AS[OpenVal], " +
                        "(SELECT LTP FROM dbo.TradeGraphDetailArbitrage AS T1 WHERE(T1.Id = MAX(T.Id))) AS[CloseVal] " +
                        "FROM dbo.TradeGraphDetailArbitrage AS T Where T.PairId In(Select TM.Id From TradePairMasterArbitrage TM) " +
                        "And DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0) = {0} " +
                        "GROUP BY DATEADD(MINUTE, DATEDIFF(MINUTE, 0, CreatedDate) / 1 * 1, 0),PairId";

                Result = _dbContext.GetGraphResponseByPair.FromSql(Query, Interval);
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
        public List<StopLimitBuySellBook> GetStopLimitBuySellBooksArbitrage(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0)
        {
            try
            {
                IQueryable<StopLimitBuySellBook> Result = null;
                if (IsCancel == 0)
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo 
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < {1}) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > {1})) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                else
                {
                    if (OrderType == enOrderType.BuyOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            From TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 UNION ALL
                            Select Top 100 TTQ.BidPrice As Price, Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty) As Amount,Count(TTQ.BidPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            From TradeTransactionQueueArbitrage TTQ  INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo  INNER Join TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 4 AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 AND TTQ.PairID ={0}
                            Group By TTQ.BidPrice,TTQ.PairID Having (Sum(TTQ.DeliveryTotalQty) - Sum(TTQ.SettledBuyQty)) > 0 Order By TTQ.BidPrice desc"
                            , Pair, LTP);
                    }
                    else if (OrderType == enOrderType.SellOrder)
                    {
                        Result = _dbContext.StopLimitBuyerSellerBook.FromSql(
                            @"Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(1 AS smallint)AS IsAdd
                            from TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticsArbitrage TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice >= TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice <= TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 UNION ALL
                            Select Top 100 TTQ.AskPrice As Price,sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty) as Amount,Count(TTQ.AskPrice) As RecordCount,NEWID() As OrderId,CAST(0 AS smallint)AS IsAdd
                            from TradeTransactionQueueArbitrage TTQ INNER join TradeStopLossArbitrage TSL on TTQ.TrnNo=TSL.TrnNo INNER Join TradePairStasticArbitrage TPS on TTQ.PairID=TPS.PairId
                            Where (((TSL.MarketIndicator = 0 AND TSL.StopPrice < TPS.LTP) OR(TSL.MarketIndicator = 1 AND TSL.StopPrice > TPS.LTP)) AND TTQ.ordertype = 4) 
                            AND TTQ.Status = 4 and TTQ.TrnType = 5 AND TTQ.pairID = {0} AND TTQ.IsCancelled = 0 AND TTQ.ordertype<>3 
                            Group by TTQ.AskPrice,TTQ.PairID Having (sum(TTQ.OrderTotalQty) - Sum(TTQ.SettledSellQty)) > 0 order by TTQ.AskPrice"
                            , Pair, LTP);
                    }
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public HighLowViewModel GetHighLowValueArbitrage(long PairId, int Day)
        {
            try
            {
                IQueryable<HighLowViewModel> Result;

                Result = _dbContext.HighLowViewModel.FromSql(
                            @"Select IsNull(MIN(T.Price),0) As LowPrice,IsNull(MAX(T.Price),0) As HighPrice From 
                                (Select Case TTQ.TrnType WHEN 4 Then TTQ.BidPrice WHEN 5 Then TTQ.AskPrice END As Price From SettledTradeTransactionQueueArbitrage TTQ Where TTQ.Status = 1 And PairId = {0}
                                And TTQ.TrnDate Between DateAdd(Day,{1},dbo.GetISTDate()) And dbo.GetISTDate()) As T", PairId, Day);

                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<ExchangeProviderListArbitrage> GetExchangeProviderListArbitrage(long PairId)
        {
            try
            {
                IQueryable<ExchangeProviderListArbitrage> Result;

                Result = _dbContext.ExchangeProviderListArbitrage.FromSql(
                            @"select C.LPType,RC.ID as RouteID,rc.ordertype,RC.RouteName,SM.ID as ProviderID,SM.ProviderName,
                            SD.ID as SerProDetailID,SD.TrnTypeID as TrnType,C.LTP,C.Volume,C.ChangePer,C.UpDownBit
                            FROM RouteConfigurationArbitrage RC 
                            INNER JOIN  ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                            INNER JOIN cryptowatcherarbitrage C ON C.LPType = SD.AppTypeID and c.Pair=TM.PairName
                            WHERE SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND RC.PairId = {0}", PairId);

                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        public List<SmartArbitrageHistoryInfo> SmartArbitrageHistoryList(long PairId,long MemberID, string FromDat, string ToDate)
        {
            string sCondition = " ";
            string Qry;
            DateTime fDate = DateTime.UtcNow, tDate = DateTime.UtcNow;
            try
            {

                if (PairId != 999)
                    sCondition = " AND TT.PairID ={1} ";

                if (!string.IsNullOrEmpty(FromDat) && !string.IsNullOrEmpty(ToDate))
                {
                    fDate = DateTime.ParseExact(FromDat, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    ToDate = ToDate + " 23:59:59";
                    tDate = DateTime.ParseExact(ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    sCondition += " AND tt.TrnDate Between '"+ fDate + "' AND '"+ tDate + "' ";
                }


                IQueryable<SmartArbitrageHistoryInfo> Result;


                Qry = @"select t.GUID,tt.PairName,min(tt.TrnDate) TrnDate,string_agg(sp.ProviderName, ', ') Market,
                            sum(CASE WHEN tt.trntype=5 THEN DeliveryTotalQty ELSE 0 END) - sum(CASE WHEN tt.trntype=4 THEN orderTotalQty ELSE 0 END) Profit
                            ,string_agg(CASE WHEN tt.trntype=4 THEN Order_Currency ELSE '' END, '') ProfitCurrency
                            ,sum(CASE WHEN tt.trntype=4 THEN BuyQty ELSE 0 END) as  FundUsed ,
                            string_agg(CASE WHEN tt.trntype=4 THEN Delivery_Currency ELSE '' END, '') FundUsedCurrency
                            from transactionqueuearbitrage t inner join tradetransactionqueuearbitrage tt on t.id=tt.TrnNo
                            inner join ServiceProviderMasterArbitrage SP on t.SerProID=SP.ID
                            where t.IsSmartArbitrage=1 and tt.MemberID={0} " + sCondition + " group by t.GUID,tt.PairName order by min(tt.TrnDate) desc";

                if (PairId == 999)
                    Result = _dbContext.SmartArbitrageHistoryInfo.FromSql(Qry, MemberID);
                else
                    Result = _dbContext.SmartArbitrageHistoryInfo.FromSql(Qry, MemberID, PairId);



                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ArbitrageBuySellViewModel> GetExchangeProviderBuySellBookArbitrage(long PairId,short TrnType)
        {
            IQueryable<ArbitrageBuySellViewModel> Result;
            try
            {
                if(TrnType==4)//Buy
                {
                    Result = _dbContext.ExchangeProviderBuySellBookArbitrage.FromSql(
                            @"SELECT C.LPType,SM.ProviderName,C.LTP,C.Fees
                            FROM RouteConfigurationArbitrage RC 
                            INNER JOIN  ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                            INNER JOIN cryptowatcherarbitrage C ON C.LPType = SD.AppTypeID and c.Pair=TM.PairName
                            WHERE SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND TrnType=4 AND RC.PairId = {0} Order by LTP", PairId);
                }
                else  //Sell ,TrnType==5
                {
                    Result = _dbContext.ExchangeProviderBuySellBookArbitrage.FromSql(
                            @"SELECT C.LPType,SM.ProviderName,C.LTP,C.Fees
                            FROM RouteConfigurationArbitrage RC 
                            INNER JOIN  ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                            INNER JOIN cryptowatcherarbitrage C ON C.LPType = SD.AppTypeID and c.Pair=TM.PairName
                            WHERE SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND TrnType=5 AND RC.PairId = {0} Order by LTP DESC", PairId);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //komal 10-06-2019 For Arbitrage 
        public async Task<ArbitrageCryptoWatcherQryRes> UpdateLTPDataArbitrage(ArbitrageLTPCls LTPData)
        {
            //IQueryable<ConfigureLP> Result = null;
            string Qry = "";
            IQueryable<ArbitrageCryptoWatcherQryRes> Result;
            try
            {
                //Result = _dbContext.ArbitrageCryptoWatcherQryRes.FromSql(
                //        "select Pair,LPType,LTP as Price,Volume,PairId,UpDownBit,ChangePer,Fees from " +
                //        "CryptoWatcherArbitrage Where LpType={0} AND PairID={1} AND LTP={2}", LTPData.LpType, LTPData.PairID, LTPData.Price);
                //if (Result.FirstOrDefault() == null)
                //{
                    Qry = @"update CryptoWatcherArbitrage set LTP = {0},Volume= {1} ,ChangePer = {2}, UpDownBit=CASE WHEN LTP > {0} THEN 1  WHEN LTP < {0} THEN 0 ELSE UpDownBit END where  PairId = {3} and LPType = {4} ";
                    var res = _dbContext.Database.ExecuteSqlCommand(Qry, LTPData.Price, LTPData.Volume, LTPData.ChangePer, LTPData.PairID, LTPData.LpType);

                    Result = _dbContext.ArbitrageCryptoWatcherQryRes.FromSql(
                        "select Pair,LPType,LTP as Price,Volume,PairId,UpDownBit,ChangePer,Fees from " +
                        "CryptoWatcherArbitrage Where LpType={0} AND PairID={1}",LTPData.LpType,LTPData.PairID);
                    var Res = Result.FirstOrDefault();
                    return Res;
                //}
                //return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ArbitrageCryptoWatcherQryRes InsertLTPDataArbitrage(ArbitrageLTPCls LTPData)
        {
            //IQueryable<ConfigureLP> Result = null;
            string Qry = "";
            IQueryable<ArbitrageCryptoWatcherQryRes> Result;
            try
            {
                //case Added for Duplicate record
                Result = _dbContext.ArbitrageCryptoWatcherQryRes.FromSql(
                         "select Pair,LPType,LTP as Price,Volume,PairId,UpDownBit,ChangePer,Fees from " +
                         "CryptoWatcherArbitrage Where LpType={0} AND PairID={1}", LTPData.LpType, LTPData.PairID);
                if (Result.FirstOrDefault() == null)
                {
                    Qry = @"insert into CryptoWatcherArbitrage values ({0} ,{1} ,{2},{3},{4},{5},{6},{7})";
                    var res = _dbContext.Database.ExecuteSqlCommand(Qry, LTPData.Price, LTPData.Pair, LTPData.LpType, LTPData.ChangePer, LTPData.Fees, LTPData.PairID, LTPData.UpDownBit, LTPData.Volume);

                    if (res > 0)
                    {
                        Result = _dbContext.ArbitrageCryptoWatcherQryRes.FromSql(
                             "select Pair,LPType,LTP as Price,Volume,PairId,UpDownBit,ChangePer,Fees from " +
                             "CryptoWatcherArbitrage Where LpType={0} AND PairID={1}", LTPData.LpType, LTPData.PairID);
                        var Res = Result.FirstOrDefault();
                        return Res;
                    }
                }
                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public bool GetLocalConfigurationDataArbitrage(short LPType)
        {
            string Qry = "";
            try
            {
                Qry = @"insert into cryptowatcherArbitrage (LTP,pair,Lptype,ChangePer,Fees,PairID,UpDownBit,Volume) 
                        select distinct TP.LTP, TM.PairName as Pair , 8  as Lptype ,TP.ChangePer24 as ChangePer,0 as Fees,TP.PairID,1 as UpDownBit, TP.ChangeVol24 as Volume
                        FROM  TradePairMasterArbitrage TM 
                        INNER JOIN  TradePairStasticsArbitrage TP ON TP.PairId = TM.id 
                        WHERE TM.Status = 1 and TM.PairName not in (select pair from cryptowatcherArbitrage where LPType = {0});
                        UPDATE cryptowatcherArbitrage SET cryptowatcherArbitrage.LTP = TP.LTP ,cryptowatcherArbitrage.Volume=TP.ChangeVol24,cryptowatcherArbitrage.ChangePer=TP.ChangePer24,cryptowatcherArbitrage.UpDownBit=TP.UpDownBit
                        FROM  TradePairMasterArbitrage TM 
                        INNER JOIN  TradePairStasticsArbitrage TP ON TP.PairId = TM.id 
                        WHERE TM.Status = 1 and  cryptowatcherArbitrage.LPType = {0} and cryptowatcherArbitrage.pair = TM.PairName";

                var res = _dbContext.Database.ExecuteSqlCommand(Qry, LPType);
                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return false;
            }
        }

        public LPKeyVault GetTradeFeesLPArbitrage(long LPType)
        {
            IQueryable<LPKeyVault> Result = null;
            string Qry = "";
            LPKeyVault Data = new LPKeyVault();
            try
            {
                Qry = @"select top 1 APIKey,SecretKey,AppTypeID from ServiceProviderDetailArbitrage SD
                        INNER JOIN ServiceProConfigurationArbitrage SC ON SC.Id = SD.ServiceProConfigID
                        where AppTypeID={0}";

                Result = _dbContext.LPKeyVault.FromSql(Qry, LPType);

                if (Result != null)
                    Data = Result.ToList().FirstOrDefault();

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Data;
            }
        }

        //Darshan dholakiya added this method for Trade pair arbitrage changes:07-06-2019
        public List<TradePairTableResponse> GetTradePairAssetArbitrageInfo(long BaseId = 0)
        {
            try
            {
                IQueryable<TradePairTableResponse> Result;
                if (BaseId == 0)
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from Market M 
                                    Inner Join TradePairMasterArbitrage TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetailArbitrage TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStasticsArbitrage TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMasterArbitrage SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMasterArbitrage SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 Order By M.ID");
                }
                else
                {
                    Result = _dbContext.TradePairTableResponse.FromSql(
                                @"Select SM1.Id As BaseId,SM1.Name As BaseName,SM1.SMSCode As BaseCode,TPM.ID As PairId,TPM.PairName As Pairname,TPS.CurrentRate As Currentrate,TPD.BuyFees As BuyFees,TPD.SellFees As SellFees,
                                    SM2.Name As ChildCurrency,SM2.SMSCode As Abbrevation,TPS.ChangePer24 As ChangePer,TPS.ChangeVol24 As Volume,TPS.High24Hr AS High24Hr,TPS.Low24Hr As Low24Hr,
                                    TPS.HighWeek As HighWeek,TPS.LowWeek As LowWeek,TPS.High52Week AS High52Week,TPS.Low52Week As Low52Week,TPS.UpDownBit As UpDownBit,TPM.Priority from Market M 
                                    Inner Join TradePairMasterArbitrage TPM ON TPM.BaseCurrencyId = M.ServiceID
                                    Inner Join TradePairDetailArbitrage TPD ON TPD.PairId = TPM.Id
                                    Inner Join TradePairStasticsArbitrage TPS ON TPS.PairId = TPM.Id
                                    Inner Join ServiceMasterArbitrage SM1 ON SM1.Id = TPM.BaseCurrencyId
                                    Inner Join ServiceMasterArbitrage SM2 ON SM2.Id = TPM.SecondaryCurrencyId Where TPM.Status = 1 And M.Status = 1 And M.ServiceID = {0}", BaseId);
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khuhsali 10-06-2019 Route configuration wise exchange info
        public ExchangeProviderListArbitrage GetExchangeProviderListArbitrageRouteWise(long RouteID)
        {
            try
            {
                IQueryable<ExchangeProviderListArbitrage> Result;

                Result = _dbContext.ExchangeProviderListArbitrage.FromSql(
                            @"select C.LPType,RC.ID as RouteID,rc.ordertype,RC.RouteName,SM.ID as ProviderID,SM.ProviderName,
                            SD.ID as SerProDetailID,SD.TrnTypeID as TrnType,C.LTP
                            FROM RouteConfigurationArbitrage RC 
                            INNER JOIN  ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                            INNER JOIN cryptowatcherarbitrage C ON C.LPType = SD.AppTypeID and c.Pair=TM.PairName
                            WHERE SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND RC.ID = {0}", RouteID);

                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public List<ServiceMasterResponse> GetAllServiceConfigurationArbitrage(int StatusData = 0)
        {
            try
            {
                IQueryable<ServiceMasterResponse> Result = null;

                if (StatusData == 0)
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select SM.IsIntAmountAllow as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID,
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMasterArbitrage SM
                            Inner Join ServiceDetailArbitrage SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStasticsArbitrage SS On SS.ServiceId = SM.Id Where SM.Status = 1");

                }
                else
                {
                    Result = _dbContext.ServiceMasterResponse.FromSql(
                                @"Select SM.IsIntAmountAllow as IsOnlyIntAmountAllow,SM.Id As ServiceId,SM.Name As ServiceName,SM.SMSCode,SM.ServiceType,SD.ServiceDetailJson,
                            SS.CirculatingSupply,SS.IssueDate,SS.IssuePrice,SM.Status,SM.WalletTypeID, 
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 1),0) TransactionBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 6),0) WithdrawBit,
                            ISNULL((Select STM.Status From ServiceTypeMappingArbitrage STM Where STM.ServiceId = SM.Id and TrnType = 8),0) DepositBit
                            From ServiceMasterArbitrage SM
                            Inner Join ServiceDetailArbitrage SD On SD.ServiceId = SM.Id
                            Inner Join ServiceStasticsArbitrage SS On SS.ServiceId = SM.Id Where SM.Status = 1 Or SM.Status = 0");
                }
                return Result.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public LocalPairStatisticsQryRes GetLocalPairStatistics(long Pair)
        {
            try
            {
                IQueryable<LocalPairStatisticsQryRes> Result = null;

                Result = _dbContext.LocalPairStatisticsQryRes.FromSql(
                    "select ChangePer24 as ChangePer,ChangeVol24 as Volume,UpDownBit from TradePairStasticsArbitrage where PairID={0}", Pair);
                return Result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }


        #endregion
    }
}
