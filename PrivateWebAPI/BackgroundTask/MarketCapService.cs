using Castle.Core.Logging;
using CleanArchitecture.Core.Entities.Configuration.FeedConfiguration;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.DTOClasses;
using Hangfire.Logging;
using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Web.BackgroundTask
{
    public class MarketCapService : IHostedService, IDisposable
    {
        private readonly Microsoft.Extensions.Logging.ILogger _logger;
        private Timer _timer;
        private Timer _timerForChart;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly IMediator _mediator;
        // private readonly IMarketCap _IMarketCap;

        public MarketCapService(ILogger<MarketCapService> logger, IMediator mediator, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _logger = logger;
            _mediator = mediator;
            _configuration = configuration;
            ///_IMarketCap = IMarketCap;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Timed Background Service is starting.");

                _timer = new Timer(DoWork, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(300));

                _timer = new Timer(DoWorkProfit, null, TimeSpan.Zero,
              TimeSpan.FromHours(1));

                _timer = new Timer(DoWorkActiveAPIPlan, null, TimeSpan.Zero,
             TimeSpan.FromHours(1));

                _timer = new Timer(DoWorkRecurringCharge, null, TimeSpan.Zero,
                TimeSpan.FromMinutes(15));

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
                return Task.CompletedTask;
            }
        }

        private void DoWork(object state)
        {
            try
            {
                _mediator.Send(new MarketCapHandleTemp { strMarketCapHandleTemp = "" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
            }
        }

        private void DoWorkProfit(object state)
        {
            try
            {
                var today = Helpers.UTC_To_IST();
                int Hours = Convert.ToInt32(_configuration["Hours"]);
                if (today.TimeOfDay.Hours == Hours)
                {
                    _mediator.Send(new ProfitTemp { Date = today });
                }
                //DateTime reportAt = Helpers.UTC_To_IST().AddDays(1).Date;
                //var tonight = reportAt.AddHours(00).AddMinutes(00).AddSeconds(00);
                // _mediator.Send(new ProfitTemp { Date = date });
                //if (today == tonight)
                //{
                //    _mediator.Send(new ProfitTemp { Date = today });
                //}
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
            }
        }

        private void DoWorkRecurringCharge(object state)
        {
            try
            {
                var today = Helpers.UTC_To_IST();
                var CurrentHour = today.AddMinutes(15).Hour;
                int RecurringChargeHour = Convert.ToInt32(_configuration["RecurringChargeHour"]);
                if (RecurringChargeHour== CurrentHour)
                {
                    _mediator.Send(new RecurringChargeCalculation { Hour = RecurringChargeHour });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
            }
        }

        private void DoWorkActiveAPIPlan(object state)
        {
            try
            {
                var today = Helpers.UTC_To_IST();
                int Hours = Convert.ToInt32(_configuration["Hours"]);
                if (today.TimeOfDay.Hours == Hours)
                {
                    _mediator.Send(new InvokeAPIPlanCroneObj { Date = today });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
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
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
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
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, Microsoft.Extensions.Logging.LogLevel.Error);
            }
        }
    }
}
