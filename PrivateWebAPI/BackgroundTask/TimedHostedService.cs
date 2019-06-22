﻿using System;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities.Communication;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CleanArchitecture.Web.BackgroundTask
{
    internal class TimedHostedService : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private Timer _timer;
        private Timer _timerForChart;
        private readonly IMediator _mediator;
        private readonly ISignalRService _signalRService;

        public TimedHostedService(ILogger<TimedHostedService> logger, IMediator mediator, ISignalRService signalRService)
        {
            _logger = logger;
            _mediator = mediator;
            _signalRService = signalRService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Timed Background Service is starting.");

                _timer = new Timer(DoWork, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(1));

                _timerForChart = new Timer(SendChartData, null, TimeSpan.Zero,
                TimeSpan.FromMinutes(1));

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                return Task.CompletedTask;
            }
        }

        private void SendChartData(object state)
        {
            try
            {
                //SignalRComm<string> CommonData = new SignalRComm<string>();
                //CommonData.Data = Helpers.GetUTCTime();
                //CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.Channel);
                //CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.ChartData);
                //CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.RecieveChartData);
                //CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);

                //SignalRData SendData = new SignalRData();
                //SendData.Method = enMethodName.ChartData;
                //SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                //_mediator.Send(SendData).Wait();
                DateTime dt = Helpers.UTC_To_IST();
                dt = dt.AddMinutes(-2);
                _signalRService.ChartDataEveryLastMin(dt);
                //Rita 5-3-19 for Margin Trading
                Task.WaitAll();
                _signalRService.ChartDataEveryLastMin(dt,1);

                _logger.LogInformation("Timed Background Service for ChartData is working.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }

        private void DoWork(object state)
        {
            try
            {

                SignalRComm<string> CommonData = new SignalRComm<string>();
                CommonData.Data = Helpers.GetUTCTime();
                CommonData.EventType = Enum.GetName(typeof(enSignalREventType), enSignalREventType.BroadCast);
                CommonData.Method = Enum.GetName(typeof(enMethodName), enMethodName.Time);
                CommonData.ReturnMethod = Enum.GetName(typeof(enReturnMethod), enReturnMethod.SetTime);
                CommonData.Subscription = Enum.GetName(typeof(enSubscriptionType), enSubscriptionType.Broadcast);

                SignalRData SendData = new SignalRData();
                SendData.Method = enMethodName.Time;
                SendData.DataObj = JsonConvert.SerializeObject(CommonData);
                _mediator.Send(SendData).Wait();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Timed Background Service is stopping.");

                _timer?.Change(Timeout.Infinite, 0);
                _timerForChart?.Change(Timeout.Infinite, 0);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                return Task.CompletedTask;
            }
            
        }

        public void Dispose()
        {
            try
            {
                _timer?.Dispose();
                _timerForChart?.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
    }
}
