using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface ICancelOrderProcess
    {
        Task<BizResponse> ProcessCancelOrderAsync(CancelOrderRequest Req,string accessToken);
        Task<BizResponse> ProcessCancelOrderAsyncV1(NewCancelOrderRequestCls Req);
    }
    public interface ICancelOrderProcessV1
    {        
        Task<BizResponse> ProcessCancelOrderAsyncV1(NewCancelOrderRequestCls Req);
    }
    //Rita 21-2-19 for margin trading
    public interface ICancelOrderProcessMarginV1
    {
        Task<BizResponse> ProcessCancelOrderAsyncV1(NewCancelOrderRequestCls Req);
    }
    //komal 07-06-2019 cancel arbitrage Trade
    public interface ICancelOrderProcessArbitrageV1
    {
        Task<BizResponse> ProcessCancelOrderAsyncV1(NewCancelOrderArbitrageRequestCls Req);
    }
}
