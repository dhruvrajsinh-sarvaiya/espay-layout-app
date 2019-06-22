using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.DomainEvents
{
    //==========================================TRADING START====================================================
    public class TransactionHandler : IRequestHandler<NewTransactionRequestCls>
    {
        //private readonly ITransactionProcess _transactionProcess;
        private readonly ITransactionProcessV1 _transactionProcessV1;
        public TransactionHandler(ITransactionProcessV1 transactionProcessV1)//ITransactionProcess transactionProcess
        {
            //_transactionProcess = transactionProcess;
            _transactionProcessV1 = transactionProcessV1;
        }
        public Task<Unit> Handle(NewTransactionRequestCls request, CancellationToken cancellationToken)
        {
            //Thread.Sleep(10000);
            //_transactionProcess.ProcessNewTransactionAsync(request);
            _transactionProcessV1.ProcessNewTransactionAsync(request);
            //HelperForLog.WriteLogForSocket("Handle", "TransactionHandler ", " -Data- " + JsonConvert.SerializeObject(request));
            return Task.FromResult(new Unit());
        }
    }

    public class TransactionMarginHandler : IRequestHandler<NewTransactionRequestMarginCls>
    {
        private readonly ITransactionProcessMarginV1 _transactionProcessV1;
        public TransactionMarginHandler(ITransactionProcessMarginV1 transactionProcessV1)
        {
            _transactionProcessV1 = transactionProcessV1;
        }
        public Task<Unit> Handle(NewTransactionRequestMarginCls request, CancellationToken cancellationToken)
        {
            _transactionProcessV1.ProcessNewTransactionAsync(request);
            return Task.FromResult(new Unit());
        }
    }
    //rita 4-6-19 for arbitrage trading
    public class TransactionArbitrageHandler : IRequestHandler<NewTransactionRequestArbitrageCls>
    {
        private readonly ITransactionProcessArbitrageV1 _transactionProcessV1;
        public TransactionArbitrageHandler(ITransactionProcessArbitrageV1 transactionProcessV1)
        {
            _transactionProcessV1 = transactionProcessV1;
        }
        public Task<Unit> Handle(NewTransactionRequestArbitrageCls request, CancellationToken cancellationToken)
        {
            _transactionProcessV1.ProcessNewTransactionArbitrageAsync(request);
            return Task.FromResult(new Unit());
        }
    }

    public class TransactionOfFollowersHandler : IRequestHandler<FollowersOrderRequestCls>
    {
        private readonly IFollowersTrading _FollowersTrading;
        public TransactionOfFollowersHandler(IFollowersTrading FollowersTrading)
        {
            _FollowersTrading = FollowersTrading;
        }
        public Task<Unit> Handle(FollowersOrderRequestCls request, CancellationToken cancellationToken)
        {
            _FollowersTrading.ProcessFollowersNewTransactionAsync(request);           
            return Task.FromResult(new Unit());
        }
    }
    //==========================================TRADING END=======================================================
    public class WithdrawHandler : IRequestHandler<NewWithdrawRequestCls>
    {
        private readonly IWithdrawTransactionV1 _IWithdrawTransaction;
        public WithdrawHandler(IWithdrawTransactionV1 IWithdrawTransaction)
        {
            _IWithdrawTransaction = IWithdrawTransaction;
        }
        public Task<Unit> Handle(NewWithdrawRequestCls request, CancellationToken cancellationToken)
        {
            _IWithdrawTransaction.WithdrawTransactionTransactionAsync(request);
            //HelperForLog.WriteLogForSocket("Handle", "WithdrawHandler ", " -Data- " + JsonConvert.SerializeObject(request));
            return Task.FromResult(new Unit());
        }
    }

    public class CancelOrderHandler : IRequestHandler<NewCancelOrderRequestCls>
    {
        private readonly ICancelOrderProcessV1 _cancelOrderProcess;//ICancelOrderProcess Rita 5-2-19 for API cancellation mane new Class
        private readonly ICancelOrderProcessMarginV1 _cancelOrderProcessMargin;
        public CancelOrderHandler(ICancelOrderProcessV1 cancelOrderProcess, ICancelOrderProcessMarginV1 cancelOrderProcessMargin)
        {
            _cancelOrderProcess = cancelOrderProcess;
            _cancelOrderProcessMargin = cancelOrderProcessMargin;
        }
        public Task<Unit> Handle(NewCancelOrderRequestCls request, CancellationToken cancellationToken)
        {
            if (request.IsMargin == 1)//Margin trading
                _cancelOrderProcessMargin.ProcessCancelOrderAsyncV1(request);
            else
                _cancelOrderProcess.ProcessCancelOrderAsyncV1(request);

            return Task.FromResult(new Unit());
        }
    }

    //komal 07-06-2019 cancel arbitrage Trade
    public class CancelOrderArbitrageHandler : IRequestHandler<NewCancelOrderArbitrageRequestCls>
    {
        private readonly ICancelOrderProcessArbitrageV1 _cancelOrderProcess;//ICancelOrderProcess Rita 5-2-19 for API cancellation mane new Class
        //private readonly ICancelOrderProcessMarginV1 _cancelOrderProcessMargin;
        public CancelOrderArbitrageHandler(ICancelOrderProcessArbitrageV1 cancelOrderProcess)//, ICancelOrderProcessMarginV1 cancelOrderProcessMargin)
        {
            _cancelOrderProcess = cancelOrderProcess;
           // _cancelOrderProcessMargin = cancelOrderProcessMargin;
        }
        public Task<Unit> Handle(NewCancelOrderArbitrageRequestCls request, CancellationToken cancellationToken)
        {
            //if (request.IsMargin == 1)//Margin trading
            //    _cancelOrderProcessMargin.ProcessCancelOrderAsyncV1(request);
            //else
                _cancelOrderProcess.ProcessCancelOrderAsyncV1(request);

            return Task.FromResult(new Unit());
        }
    }

    //Rita 23-1-19 for backgoup pairdata calculation , as singletone service have one time old data
    public class PairDataCalculationHandler : IRequestHandler<PairDataCalculationCls>
    {
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        private readonly IFrontTrnRepository _frontTrnRepository;
        public PairDataCalculationHandler(ICommonRepository<TradePairStastics> tradePairStastics, IFrontTrnRepository frontTrnRepository)
        {
            _tradePairStastics = tradePairStastics;
            _frontTrnRepository = frontTrnRepository;
        }
        public Task<Unit> Handle(PairDataCalculationCls request, CancellationToken cancellationToken)
        {
            //ISignalRService.PairDataCalculation();
            List<TradePairStastics> PairDataUpdated = new List<TradePairStastics>();

            var PairData = _tradePairStastics.GetAll().ToList();
            var PairCalcData = _frontTrnRepository.GetPairStatisticsCalculation();
            if (PairCalcData != null)
            {
                if (PairData.Count > 0 && PairCalcData.Count > 0)
                {
                    foreach (var PairStatisticsObj in PairData)
                    {
                        //_tradePairStastics.ReloadEntity(PairStatisticsObj);//this will take latest data, no need for Mediator

                        var PairCalcObj = PairCalcData.Where(x => x.PairId == PairStatisticsObj.PairId).FirstOrDefault();

                        if (PairCalcObj != null)
                        {
                            var HighLowDataDay = _frontTrnRepository.GetHighLowValue(PairStatisticsObj.PairId, -1);
                            var HighLowDataWeek = _frontTrnRepository.GetHighLowValue(PairStatisticsObj.PairId, -7);
                            var HighLowDataYear = _frontTrnRepository.GetHighLowValue(PairStatisticsObj.PairId, -365);


                            PairStatisticsObj.ChangeVol24 = PairCalcObj.Volume;
                            PairStatisticsObj.ChangePer24 = PairCalcObj.ChangePer;
                            PairStatisticsObj.ChangeValue = PairCalcObj.ChangeValue;

                            if (HighLowDataDay != null)
                            {
                                PairStatisticsObj.Low24Hr = HighLowDataDay.LowPrice;
                                PairStatisticsObj.High24Hr = HighLowDataDay.HighPrice;
                            }
                            if (HighLowDataWeek != null)
                            {
                                PairStatisticsObj.LowWeek = HighLowDataWeek.LowPrice;
                                PairStatisticsObj.LowWeek = HighLowDataWeek.HighPrice;
                            }
                            if (HighLowDataYear != null)
                            {
                                PairStatisticsObj.Low52Week = HighLowDataYear.LowPrice;
                                PairStatisticsObj.High52Week = HighLowDataYear.HighPrice;
                            }

                            //Calculate Up DownBit
                            if (PairStatisticsObj.ChangePer24 < PairCalcObj.ChangePer)
                            {
                                PairStatisticsObj.UpDownBit = 1;
                            }
                            else if (PairStatisticsObj.ChangePer24 > PairCalcObj.ChangePer)
                            {
                                PairStatisticsObj.UpDownBit = 0;
                            }

                            PairStatisticsObj.CronDate = Helpers.UTC_To_IST();

                            PairDataUpdated.Add(PairStatisticsObj);
                        }
                    }
                    if (PairDataUpdated.Count > 0)
                    {
                        _frontTrnRepository.UpdatePairStatisticsCalculation(PairDataUpdated);
                    }
                }
            }
            return Task.FromResult(new Unit());
        }
    }

    //khushali 26-04-2019 for trade recon
    public class CancelOrderHandlerV2 : IRequestHandler<NewCancelOrderRequestClsV2, NewCancelOrderResponseClsV2>
    {
        private readonly ICancelOrderProcessV1 _cancelOrderProcess;//ICancelOrderProcess Rita 5-2-19 for API cancellation mane new Class
        private readonly ICancelOrderProcessMarginV1 _cancelOrderProcessMargin;
        public CancelOrderHandlerV2(ICancelOrderProcessV1 cancelOrderProcess, ICancelOrderProcessMarginV1 cancelOrderProcessMargin)
        {
            _cancelOrderProcess = cancelOrderProcess;
            _cancelOrderProcessMargin = cancelOrderProcessMargin;
        }
        public Task<Unit> Handle(NewCancelOrderRequestCls request, CancellationToken cancellationToken)
        {
            if (request.IsMargin == 1)//Margin trading
                _cancelOrderProcessMargin.ProcessCancelOrderAsyncV1(request);
            else
                _cancelOrderProcess.ProcessCancelOrderAsyncV1(request);

            return Task.FromResult(new Unit());
        }

        public async Task<NewCancelOrderResponseClsV2> Handle(NewCancelOrderRequestClsV2 Request, CancellationToken cancellationToken)
        {
            NewCancelOrderResponseClsV2 newCancelOrderResponseClsV2 = new NewCancelOrderResponseClsV2();
            BizResponse _Resp = new BizResponse();
            try
            {
                NewCancelOrderRequestCls request = new NewCancelOrderRequestCls()
                {
                    accessToken = Request.accessToken,
                    CancelAll = Request.CancelAll,
                    IsMargin = Request.IsMargin,
                    MemberID = Request.MemberID,
                    OrderType = Request.OrderType,
                    TranNo = Request.TranNo,
                    TrnMode = Request.TrnMode,
                    TrnRefNo = Request.TrnRefNo
                };

                if (request.IsMargin == 1)//Margin trading
                    _Resp = await _cancelOrderProcessMargin.ProcessCancelOrderAsyncV1(request);
                else
                    _Resp = await _cancelOrderProcess.ProcessCancelOrderAsyncV1(request);

                newCancelOrderResponseClsV2.ErrorCode = _Resp.ErrorCode;
                newCancelOrderResponseClsV2.ReturnCode = _Resp.ReturnCode;
                newCancelOrderResponseClsV2.ReturnMsg = _Resp.ReturnMsg;
                return newCancelOrderResponseClsV2;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                newCancelOrderResponseClsV2.ErrorCode = enErrorCode.InternalError;
                newCancelOrderResponseClsV2.ReturnCode = enResponseCodeService.InternalError;
                newCancelOrderResponseClsV2.ReturnMsg = "internal error";
                return newCancelOrderResponseClsV2;
            }
            
        }
    }
}
