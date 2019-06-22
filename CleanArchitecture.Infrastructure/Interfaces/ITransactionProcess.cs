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
    public interface ITransactionProcess
    {
        Task<BizResponse> ProcessNewTransactionAsync(NewTransactionRequestCls Req);
    }
    public interface ITransactionProcessV1
    {
        Task<BizResponse> ProcessNewTransactionAsync(NewTransactionRequestCls Req);
    }
    public interface ITransactionProcessMarginV1//Rita 15-2-19 for margin trading saperate
    {
        Task<BizResponse> ProcessNewTransactionAsync(NewTransactionRequestMarginCls Req);
    }
    //Rita 04-06-19 for Arbitrage Trading
    public interface ITransactionProcessArbitrageV1
    {
        Task<BizResponse> ProcessNewTransactionArbitrageAsync(NewTransactionRequestArbitrageCls Req);
    }
    public interface IWithdrawTransaction
    {
        Task<BizResponse> WithdrawTransactionTransactionAsync(NewWithdrawRequestCls Req);
    }
    public interface IWithdrawTransactionV1
    {
        Task<BizResponse> WithdrawTransactionTransactionAsync(NewWithdrawRequestCls Req);
        Task<BizResponse> WithdrawTransactionAPICallProcessAsync(WithdrawalConfirmationRequest Request,long UserId,short IsReqFromAdmin);
        Task<BizResponse> ResendEmailWithdrawalConfirmation(long TrnNo, long UserId);
        Task MarkTransactionOperatorFailv2(string StatusMsg, enErrorCode ErrorCode, TransactionQueue Newtransaction);
    }
    //Rita 17-1-19 Added for trading inserts of Followers
    public interface IFollowersTrading
    {
        Task<BizResponse> ProcessFollowersNewTransactionAsync(FollowersOrderRequestCls request);
    }

    //Rita 7-2-19 Site Token Conversion Service
    public interface ISiteTokenConversion
    {
        Task<SiteTokenConversionResponse> SiteTokenConversionAsync(SiteTokenConversionRequest Request, long UserID, string accesstoken);
        Task<SiteTokenCalculationResponse> SiteTokenCalculation(SiteTokenCalculationRequest Request, long UserID, string accesstoken);
        //Rita 16-4-19 added for margin trading
        Task<SiteTokenConversionResponse> SiteTokenConversionAsyncMargin(SiteTokenConversionRequest Request, long UserID, string accesstoken);
        Task<SiteTokenCalculationResponse> SiteTokenCalculationMargin(SiteTokenCalculationRequest Request, long UserID, string accesstoken);
    }
}
