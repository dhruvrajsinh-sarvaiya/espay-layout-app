using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Infrastructure.Services;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.BGTask
{
    public interface IGenerateAddressQueue<T>
    {
        void Enqueue(T Req);

        Task<T> DequeueAsync(CancellationToken cancellationToken);
    }

    public class BGTaskWalletTaskQueue<T> : IGenerateAddressQueue<T>
    {
        private readonly ConcurrentQueue<T> _transactions = new ConcurrentQueue<T>();
        private readonly SemaphoreSlim _TransactionEnqueuedSignal = new SemaphoreSlim(0);

        public void Enqueue(T Req)
        {
            if (Req == null)
            {
                throw new ArgumentNullException(nameof(Req));
            }

            _transactions.Enqueue(Req);

            _TransactionEnqueuedSignal.Release();
        }

        public async Task<T> DequeueAsync(CancellationToken cancellationToken)
        {
            await _TransactionEnqueuedSignal.WaitAsync(cancellationToken);

            _transactions.TryDequeue(out T Req);

            return Req;
        }
    }
    //=============================================== Db Operation,Notification & Email For Address Generation=================================
    public class ProcessAllAddressDequeuer : IHostedService
    {
        #region DI
        private readonly IServiceProvider _serviceProvider;
        private readonly IGenerateAddressQueue<BGTaskAddressGeneration> _TransactionsQueue;
        private readonly IGenerateAddressQueue<ETHDBOperation> _ETHQueue;
        private readonly ICommonRepository<TradeBitGoDelayAddresses> _bitgoDelayRepository;
        private readonly ICommonRepository<UserActivityLog> _UserActivityLogCommonRepo;
        private readonly CancellationTokenSource _stopTokenSource = new CancellationTokenSource();
        private readonly ICommonRepository<AddressMaster> _addressMstRepository;
        private readonly IMediator _mediator;
        private Task _dequeueMessagesTask;
        private Task _dequeueETHTask;
        private readonly ISignalRService _signalRService;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IWalletService _walletService;

        public ProcessAllAddressDequeuer(IServiceProvider serviceProvider, ICommonRepository<AddressMaster> addressMaster,
            ICommonRepository<UserActivityLog> UserActivityLogCommonRepo,
            ISignalRService signalRService,IGenerateAddressQueue<BGTaskAddressGeneration> TransactionsQueue,
            ICommonRepository<TradeBitGoDelayAddresses> bitgoDelayRepository, IGenerateAddressQueue<ETHDBOperation> ETHQueue,
            IMediator mediator, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue,IWalletService walletService)//ITransactionProcess transactionProcess
        {
            _serviceProvider = serviceProvider;
            _TransactionsQueue = TransactionsQueue;
            _mediator = mediator;
            _pushNotificationsQueue = pushNotificationsQueue;
            _signalRService = signalRService;
            _addressMstRepository = addressMaster;
            _walletService = walletService;
            _bitgoDelayRepository = bitgoDelayRepository;
            _UserActivityLogCommonRepo = UserActivityLogCommonRepo;
            _ETHQueue = ETHQueue;
        }
        #endregion

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _dequeueMessagesTask = Task.Run(DequeueTransactionsAsync);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _stopTokenSource.Cancel();

            return Task.WhenAny(_dequeueMessagesTask, Task.Delay(Timeout.Infinite, cancellationToken));
        }

        private async Task DequeueTransactionsAsync()
        {
            while (!_stopTokenSource.IsCancellationRequested)
            {
                BGTaskAddressGeneration Req = await _TransactionsQueue.DequeueAsync(_stopTokenSource.Token);

                if (!_stopTokenSource.IsCancellationRequested)
                {
                    using (IServiceScope serviceScope = _serviceProvider.CreateScope())
                    {
                        _addressMstRepository.Add(Req.Address);
                        _UserActivityLogCommonRepo.Add(Req.userActivityLog);
                        #region SMS_Email
                        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.GenerateAddressNotification);
                        ActivityNotification.Param1 = Req.WalletName;
                        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                        _walletService.SMSSendAsyncV1(EnTemplateType.SMS_WalletAddressCreated, Req.UID.ToString(), Req.WalletName);
                         Parallel.Invoke(() => _walletService.EmailSendAsyncV1(EnTemplateType.EMAIL_WalletAddressCreated, Req.UID.ToString(), Req.Coin, Req.WalletName, Req.Date, Req.PublicAddress, Req.Amount.ToString()),
                            () => _signalRService.SendActivityNotificationV2(ActivityNotification, Req.Token, 2)
                            );
                        #endregion
                    }
                }
            }
        }
    }

    #region CreateWallet
    public interface ICreateWalletQueue<T>
    {
        void Enqueue(T Req);

        Task<T> DequeueAsync(CancellationToken cancellationToken);
    }

    public class CreateWalletQueue<T> : ICreateWalletQueue<T>
    {
        private readonly ConcurrentQueue<T> _transactions = new ConcurrentQueue<T>();
        private readonly SemaphoreSlim _TransactionEnqueuedSignal = new SemaphoreSlim(0);

        public void Enqueue(T Req)
        {
            if (Req == null)
            {
                throw new ArgumentNullException(nameof(Req));
            }

            _transactions.Enqueue(Req);

            _TransactionEnqueuedSignal.Release();
        }

        public async Task<T> DequeueAsync(CancellationToken cancellationToken)
        {
            await _TransactionEnqueuedSignal.WaitAsync(cancellationToken);

            _transactions.TryDequeue(out T Req);

            return Req;
        }
    }
   

    public class ProcessCreateWalletDequeuer : IHostedService
    {
        #region DI
        private readonly IServiceProvider _serviceProvider;
        private readonly CancellationTokenSource _stopTokenSource = new CancellationTokenSource();
        private readonly IMediator _mediator;
        private Task _dequeueMessagesTask;
        private Task _dequeueETHTask;     
        private readonly IWalletService _walletService;
        private readonly ICreateWalletQueue<WalletReqRes> _createWalletQueue;
        public ProcessCreateWalletDequeuer(IMediator mediator, IWalletService walletService, ICreateWalletQueue<WalletReqRes> createWalletQueue, IServiceProvider serviceProvider)
        {
            _mediator = mediator;          
            _walletService = walletService;
            _createWalletQueue = createWalletQueue;
            _serviceProvider = serviceProvider;
        }
        #endregion

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _dequeueMessagesTask = Task.Run(DequeueTransactionsAsync);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _stopTokenSource.Cancel();

            return Task.WhenAny(_dequeueMessagesTask, Task.Delay(Timeout.Infinite, cancellationToken));
        }

        private async Task DequeueTransactionsAsync()
        {
            while (!_stopTokenSource.IsCancellationRequested)
            {
                var Req = await _createWalletQueue.DequeueAsync(_stopTokenSource.Token);

                if (!_stopTokenSource.IsCancellationRequested)
                {
                    using (IServiceScope serviceScope = _serviceProvider.CreateScope())
                    {
                        Task.Run(() => _mediator.Send(Req));
                    }
                }
            }
        }
    }

    #endregion

    #region MarginCreateWallet
    public interface ICreateMarginWalletQueue<T>
    {
        void Enqueue(T Req);

        Task<T> DequeueAsync(CancellationToken cancellationToken);
    }

    public class CreateMarginWalletQueue<T> : ICreateMarginWalletQueue<T>
    {
        private readonly ConcurrentQueue<T> _transactions = new ConcurrentQueue<T>();
        private readonly SemaphoreSlim _TransactionEnqueuedSignal = new SemaphoreSlim(0);

        public void Enqueue(T Req)
        {
            if (Req == null)
            {
                throw new ArgumentNullException(nameof(Req));
            }

            _transactions.Enqueue(Req);

            _TransactionEnqueuedSignal.Release();
        }

        public async Task<T> DequeueAsync(CancellationToken cancellationToken)
        {
            await _TransactionEnqueuedSignal.WaitAsync(cancellationToken);

            _transactions.TryDequeue(out T Req);

            return Req;
        }
    }


    public class ProcessCreateMarginWalletDequeuer : IHostedService
    {
        #region DI
        private readonly IServiceProvider _serviceProvider;
        private readonly CancellationTokenSource _stopTokenSource = new CancellationTokenSource();
        private readonly IMediator _mediator;
        private Task _dequeueMessagesTask;
        private Task _dequeueETHTask;
        private readonly IMarginWalletService _walletService;
        private readonly ICreateMarginWalletQueue<MarginWalletReqRes> _createWalletQueue;
        public ProcessCreateMarginWalletDequeuer(IMediator mediator, IMarginWalletService walletService, ICreateMarginWalletQueue<MarginWalletReqRes> createWalletQueue, IServiceProvider serviceProvider)
        {
            _mediator = mediator;
            _walletService = walletService;
            _createWalletQueue = createWalletQueue;
            _serviceProvider = serviceProvider;
        }
        #endregion

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _dequeueMessagesTask = Task.Run(DequeueTransactionsAsync);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _stopTokenSource.Cancel();

            return Task.WhenAny(_dequeueMessagesTask, Task.Delay(Timeout.Infinite, cancellationToken));
        }

        private async Task DequeueTransactionsAsync()
        {
            while (!_stopTokenSource.IsCancellationRequested)
            {
                var Req = await _createWalletQueue.DequeueAsync(_stopTokenSource.Token);

                if (!_stopTokenSource.IsCancellationRequested)
                {
                    using (IServiceScope serviceScope = _serviceProvider.CreateScope())
                    {
                        Task.Run(() => _mediator.Send(Req));
                    }
                }
            }
        }
    }

    #endregion
    //=============================================== Db Operation,Notification & Email For ETH Address========================================

    //public class ProcessAllETHAddressDequeuer : IHostedService
    //{
    //    #region DI
    //    private readonly IServiceProvider _serviceProvider;
    //    private readonly IGenerateAddressQueue<ETHDBOperation> _ETHQueue;
    //    private readonly ICommonRepository<TradeBitGoDelayAddresses> _bitgoDelayRepository;
    //    private readonly CancellationTokenSource _stopTokenSource = new CancellationTokenSource();
    //    private readonly IMediator _mediator;
    //    private Task _dequeueMessagesTask;
    //    private Task _dequeueETHTask;
    //    private readonly ISignalRService _signalRService;
    //    private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
    //    private readonly IWalletService _walletService;

    //    public ProcessAllETHAddressDequeuer(IServiceProvider serviceProvider,ISignalRService signalRService, 
    //        ICommonRepository<TradeBitGoDelayAddresses> bitgoDelayRepository, IGenerateAddressQueue<ETHDBOperation> ETHQueue,
    //        IMediator mediator, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, IWalletService walletService)//ITransactionProcess transactionProcess
    //    {
    //        _serviceProvider = serviceProvider;
    //        _mediator = mediator;
    //        _pushNotificationsQueue = pushNotificationsQueue;
    //        _signalRService = signalRService;
    //        _walletService = walletService;
    //        _bitgoDelayRepository = bitgoDelayRepository;
    //        _ETHQueue = ETHQueue;
    //    }
    //    #endregion

    //    public Task StartAsync(CancellationToken cancellationToken)
    //    {
    //        _dequeueMessagesTask = Task.Run(DequeueTransactionsAsync);

    //        return Task.CompletedTask;
    //    }

    //    public Task StopAsync(CancellationToken cancellationToken)
    //    {
    //        _stopTokenSource.Cancel();

    //        return Task.WhenAny(_dequeueMessagesTask, Task.Delay(Timeout.Infinite, cancellationToken));
    //    }

    //    private async Task DequeueETHAddressAsync()
    //    {
    //        while (!_stopTokenSource.IsCancellationRequested)
    //        {
    //            ETHDBOperation Req = await _ETHQueue.DequeueAsync(_stopTokenSource.Token);

    //            if (!_stopTokenSource.IsCancellationRequested)
    //            {
    //                using (IServiceScope serviceScope = _serviceProvider.CreateScope())
    //                {
    //                    _bitgoDelayRepository.Add(Req.Mainaddress);

    //                }
    //            }
    //        }
    //    }
    //}
}
