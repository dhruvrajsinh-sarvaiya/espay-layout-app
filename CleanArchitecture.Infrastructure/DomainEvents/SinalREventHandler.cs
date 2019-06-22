using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Communication;
using CleanArchitecture.Core.Entities.SignalR;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.FeedConfiguration;
using CleanArchitecture.Core.SignalR;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace CleanArchitecture.Infrastructure.DomainEvents
{
    public class SinalREventHandler : IRequestHandler<SignalRData, CommunicationResponse>
    {
        private SocketHub _chat;
        public SinalREventHandler(SocketHub chat)
        {
            _chat = chat;
        }
        public async Task<CommunicationResponse> Handle(SignalRData request, CancellationToken cancellationToken)
        {
            CommunicationResponse response = new CommunicationResponse();
            try
            {
                switch (request.Method)
                {
                    case enMethodName.BuyerBook:
                        await _chat.BuyerBook(request.Parameter, request.DataObj);   break;
                    case  enMethodName.SellerBook:
                            await _chat.SellerBook(request.Parameter, request.DataObj);   break;
                        case  enMethodName.StopLimitBuyerBook:
                            await _chat.StopLimitBuyerBook(request.Parameter, request.DataObj);   break;
                        case  enMethodName.StopLimitSellerBook:
                            await _chat.StopLimitSellerBook(request.Parameter, request.DataObj);   break;
                        case  enMethodName.OrderHistory:
                            await _chat.OrderHistory(request.Parameter, request.DataObj);   break;
                        case  enMethodName.ChartData:
                            await _chat.ChartData(request.Parameter, request.DataObj);   break;
                        case  enMethodName.MarketData:
                            await _chat.MarketData(request.Parameter, request.DataObj);   break;
                        case  enMethodName.ActiveOrder:
                            await _chat.ActiveOrder(request.Parameter, request.DataObj);   break;
                        case  enMethodName.OpenOrder:
                            await _chat.OpenOrder(request.Parameter, request.DataObj);   break;
                        case  enMethodName.TradeHistory:
                            await _chat.TradeHistory(request.Parameter, request.DataObj);   break;
                        case  enMethodName.RecentOrder:
                            await _chat.RecentOrder(request.Parameter, request.DataObj);   break;
                        case  enMethodName.BuyerSideWallet:
                            await _chat.WalletBalUpdate(request.Parameter, request.WalletName, request.DataObj);   break;
                        case  enMethodName.SellerSideWallet:
                            await _chat.WalletBalUpdate(request.Parameter, request.WalletName, request.DataObj);   break;
                        case  enMethodName.Price:
                            await _chat.LastPrice(request.Parameter, request.DataObj);   break;
                        case  enMethodName.PairData:
                            await _chat.PairData(request.Parameter, request.DataObj);   break;
                        case  enMethodName.MarketTicker:
                            await _chat.MarketTicker(request.Parameter, request.DataObj);   break;
                        case  enMethodName.ActivityNotification:
                            await _chat.ActivityNotification(request.Parameter, request.DataObj);   break;
                        case  enMethodName.News:
                            await _chat.BroadCastNews(request.DataObj);   break;
                        case  enMethodName.Announcement:
                            await _chat.BroadCastAnnouncement(request.DataObj);   break;
                        //case  enMethodName.SendGroupMessage:
                        //    await _chat.SendGroupMessage(request.Parameter, request.DataObj);   break;
                        case  enMethodName.Time:
                            await _chat.GetTime(request.DataObj);   break;
                        case  enMethodName.WalletActivity:
                            await _chat.WalletActivity(request.Parameter, request.DataObj);   break;
                        case  enMethodName.SessionExpired:
                            await _chat.OnSessionExpired(request.Parameter, request.DataObj);   break;
                        case enMethodName.EnvironmentMode:
                        await _chat.EnvironmentMode(request.DataObj); break;
                }

                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(response);
            }
        }
    }

    //public class SinalREventHandlerV1 : IRequestHandler<SignalRData>
    //{
    //    private SocketHub _chat;
    //    private FeedLimitCounts LimitCount;
    //    private readonly IExchangeFeedConfiguration _exchangeFeed;
    //    private List<SocketFeedConfiguration> feedConfigurationsList = new List<SocketFeedConfiguration>();
    //    private List<SocketFeedLimits> feedLimitsList = new List<SocketFeedLimits>();
    //    private List<FeedLimitCounts> feedLimitCounts = new List<FeedLimitCounts>();
    //    private readonly IFeedlimitcountQueue _feedlimitcountQueue;
    //    private IMemoryCache _cache { get; set; }


    //    public SinalREventHandlerV1(SocketHub chat, IExchangeFeedConfiguration exchangeFeed, IFeedlimitcountQueue feedlimitcountQueue, IMemoryCache cache)
    //    {
    //        _chat = chat;
    //        _exchangeFeed = exchangeFeed;
    //        feedConfigurationsList = _exchangeFeed.GetFeedConfigurations();
    //        feedLimitsList = _exchangeFeed.GetFeedLimits();
    //        feedLimitCounts = _exchangeFeed.GetLimitCounts();
    //        _feedlimitcountQueue = feedlimitcountQueue;
    //        _cache = cache;
    //    }
    //    public Task<Unit> Handle(SignalRData request, CancellationToken cancellationToken)
    //    {
    //        try
    //        {

    //            var res = _exchangeFeed.CheckFeedLimit(Convert.ToInt16(request.Method));
    //            if (res.ReturnCode != enResponseCode.Success)
    //                return Task.FromResult(new Unit());


    //            if (request.Method == enMethodName.BuyerBook)
    //                _chat.BuyerBook(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.SellerBook)
    //            {
    //                _chat.SellerBook(request.Parameter, request.DataObj);
    //            }
    //            else if (request.Method == enMethodName.StopLimitBuyerBook)
    //                _chat.StopLimitBuyerBook(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.StopLimitSellerBook)
    //                _chat.StopLimitSellerBook(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.OrderHistory)
    //                _chat.OrderHistory(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.ChartData)
    //                _chat.ChartData(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.MarketData)
    //                _chat.MarketData(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.ActiveOrder)
    //                _chat.ActiveOrder(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.OpenOrder)
    //                _chat.OpenOrder(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.TradeHistory)
    //                _chat.TradeHistory(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.RecentOrder)
    //                _chat.RecentOrder(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.BuyerSideWallet)
    //                _chat.BuyerSideWalletBal(request.Parameter, request.WalletName, request.DataObj);
    //            else if (request.Method == enMethodName.SellerSideWallet)
    //                _chat.SellerSideWalletBal(request.Parameter, request.WalletName, request.DataObj);
    //            else if (request.Method == enMethodName.Price)
    //                _chat.LastPrice(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.PairData)
    //                _chat.PairData(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.MarketTicker)
    //                _chat.MarketTicker(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.ActivityNotification)
    //                _chat.ActivityNotification(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.News)
    //                _chat.BroadCastNews(request.DataObj);
    //            else if (request.Method == enMethodName.Announcement)
    //                _chat.BroadCastAnnouncement(request.DataObj);
    //            else if (request.Method == enMethodName.SendGroupMessage)
    //                _chat.SendGroupMessage(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.Time)
    //                _chat.GetTime(request.DataObj);
    //            else if (request.Method == enMethodName.WalletActivity)
    //                _chat.WalletActivity(request.Parameter, request.DataObj);
    //            else if (request.Method == enMethodName.SessionExpired)
    //                _chat.OnSessionExpired(request.Parameter, request.DataObj);

    //            return Task.FromResult(new Unit());
    //        }
    //        catch (Exception ex)
    //        {
    //            return Task.FromResult(new Unit());
    //        }
    //    }
    //}
}
