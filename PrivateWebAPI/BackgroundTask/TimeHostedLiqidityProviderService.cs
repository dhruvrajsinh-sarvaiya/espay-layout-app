using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.LiquidityProvider;
using CleanArchitecture.Infrastructure.Services;
using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Web.BackgroundTask
{
    public class TimeHostedLiqidityProviderService : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private Timer _timerPoloniex;
        private Timer _timerTardeSatoshi;
        private Timer _timerCoinbase;
        private Timer _timerBinance;
        private Timer _timerBittrex;
        private readonly IMediator _mediator;
        private readonly ISignalRService _signalRService;
        public readonly ILiquidityProviderService _liquidityProviderService;
        public string[] Symbol;

        public TimeHostedLiqidityProviderService(ILogger<TimeHostedLiqidityProviderService> logger, IMediator mediator, ISignalRService signalRService,
            ILiquidityProviderService liquidityProviderService)
        {
            _logger = logger;
            _mediator = mediator;
            _signalRService = signalRService;
            _liquidityProviderService = liquidityProviderService;
            
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                Symbol = _liquidityProviderService.GetPair();
                _timerPoloniex = new Timer(SendPoloniex, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(5));
                _timerTardeSatoshi = new Timer(SendTardeSatoshi, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(5));
                _timerBinance = new Timer(SendBinance, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(5));
                _timerBittrex = new Timer(SendBittrex, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(5));
                _timerCoinbase = new Timer(SendCoinBase, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(5));
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                return Task.CompletedTask;
            }
        }

        private void SendPoloniex(object state)
        {
            try
            {
                
                _liquidityProviderService.SendPoloniexOrderBookAsync(Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
        private void SendTardeSatoshi(object state)
        {
            try
            {
                _liquidityProviderService.SendTradesatoshiOrderBookAsync(Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
        private void SendBinance(object state)
        {
            try
            {
                _liquidityProviderService.SendBinanceOrderBookAsync(Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
        private void SendBittrex(object state)
        {
            try
            {
                _liquidityProviderService.SendBittrexOrderBookAsync(Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
        private void SendCoinBase(object state)
        {
            try
            {
                _liquidityProviderService.SendCoinBaseOrderBookAsync(Symbol);
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

                _timerTardeSatoshi?.Change(Timeout.Infinite, 0);
                _timerPoloniex?.Change(Timeout.Infinite, 0);

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
                _timerTardeSatoshi?.Dispose();
                _timerPoloniex?.Dispose();
                _timerBinance?.Dispose();
                _timerBittrex?.Dispose();
                _timerCoinbase?.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
            }
        }
    }
}

