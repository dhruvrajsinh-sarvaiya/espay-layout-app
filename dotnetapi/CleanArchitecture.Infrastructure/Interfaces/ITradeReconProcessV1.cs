using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface ITradeReconProcessV1
    {
        Task<BizResponseClass> TradeReconProcessAsyncV1(enTradeReconActionType ActionType, long TranNo, string ActionMessage, long UserId, string AccessToken);
        //Rita 25-04-19 added this for calling from cancellation , as txn found in isprocessing=1
        Task<BizResponseClass> ProcessReleaseStuckOrderOrderAsync(BizResponseClass Response, TradeTransactionQueue TrnObj, long UserID,short IsFromCancellation=0);
        short CheckBuyerSellerListIsProcessing(TradeTransactionQueue TradeTransactionQueueObj);
    }

    public interface ITradeReconProcessMarginV1
    {
        Task<BizResponseClass> ProcessReleaseStuckOrderOrderAsync(BizResponseClass Response, TradeTransactionQueueMargin TrnObj, long UserID, short IsFromCancellation = 0);
        short CheckBuyerSellerListIsProcessing(TradeTransactionQueueMargin TradeTransactionQueueObj);
    }
}
