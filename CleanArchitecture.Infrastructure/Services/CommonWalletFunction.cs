using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    public class CommonWalletFunction : ICommonWalletFunction
    {
        private readonly ICommonRepository<WalletMaster> _commonRepository;
        private readonly ICommonRepository<WalletLimitConfiguration> _WalletLimitRepository;
        //private readonly ICommonRepository<WalletLimitConfigurationMaster> _WalletLimitMasterRepository;
        private readonly ICommonRepository<MemberShadowBalance> _ShadowBalRepo;
        private readonly IWalletRepository _walletRepository1;
        private readonly IWalletRepository _repository;
        private readonly ICommonRepository<MemberShadowLimit> _ShadowLimitRepo;
        private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        private readonly ICommonRepository<ChargeRuleMaster> _chargeRuleMaster;
        //private readonly ICommonRepository<LimitRuleMaster> _limitRuleMaster;
        private readonly ICommonRepository<WalletTrnLimitConfiguration> _walletTrnLimitConfiguration;
        private readonly ICommonRepository<AddressMaster> _addressMaster;
        private readonly IWalletSPRepositories _walletSPRepositories;


        public CommonWalletFunction(ICommonRepository<WalletTrnLimitConfiguration> walletTrnLimitConfiguration, ICommonRepository<WalletLimitConfiguration> WalletLimitRepository, ICommonRepository<WalletMaster> commonRepository, IWalletRepository repository, ICommonRepository<MemberShadowBalance> ShadowBalRepo, IWalletRepository walletRepository, ICommonRepository<MemberShadowLimit> ShadowLimitRepo, ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository, ICommonRepository<ChargeRuleMaster> chargeRuleMaster,  ICommonRepository<AddressMaster> addressMaster, IWalletSPRepositories walletSPRepositories)//ICommonRepository<LimitRuleMaster> limitRuleMaster,ICommonRepository<WalletLimitConfigurationMaster> WalletLimitMasterRepository,
        {
            _commonRepository = commonRepository;
            _walletSPRepositories = walletSPRepositories;
            _repository = repository;
            _ShadowBalRepo = ShadowBalRepo;
            _walletRepository1 = walletRepository;
            _ShadowLimitRepo = ShadowLimitRepo;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            //_limitRuleMaster = limitRuleMaster;
            _chargeRuleMaster = chargeRuleMaster;
            //_WalletLimitMasterRepository = WalletLimitMasterRepository;
            _WalletLimitRepository = WalletLimitRepository;
            _addressMaster = addressMaster;
            _walletTrnLimitConfiguration = walletTrnLimitConfiguration;
        }

        public decimal GetLedgerLastPostBal(long walletId)
        {
            try
            {
                var bal = _repository.GetLedgerLastPostBal(walletId);
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public enErrorCode CheckShadowLimit(long WalletID, decimal Amount , EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                //ntrivedi 15-02-2019 for margin wallet
                var Walletobj = _commonRepository.GetSingle(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(enWalletUsageType));
                if (Walletobj != null)
                {
                    var Balobj = _ShadowBalRepo.GetSingle(item => item.WalletID == WalletID);
                    if (Balobj != null)
                    {
                        if ((Balobj.ShadowAmount + Amount) <= Walletobj.Balance)
                        {
                            return enErrorCode.Success;
                        }
                        return enErrorCode.InsufficientBalance;
                    }
                    else
                    {
                        var typeobj = _walletRepository1.GetTypeMappingObj(Walletobj.UserID);
                        if (typeobj != -1) //ntrivedi 04-11-2018 
                        {
                            var Limitobj = _ShadowLimitRepo.GetSingle(item => item.MemberTypeId == typeobj);
                            if (Limitobj != null)
                            {
                                if ((Limitobj.ShadowLimitAmount + Amount) <= Walletobj.Balance)
                                {
                                    return enErrorCode.Success;
                                }
                                return enErrorCode.InsufficientBalance;
                            }
                            return enErrorCode.Success; // IF ENTRY NOT FOUND THEN SUCCESS NTRIVEDI
                        }
                        return enErrorCode.MemberTypeNotFound;
                    }
                }
                return enErrorCode.WalletNotFound;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        //public ServiceLimitChargeValue GetServiceLimitChargeValue(enTrnType TrnType, string CoinName)
        //{
        //    try
        //    {
        //        ServiceLimitChargeValue response;
        //        var walletType = _WalletTypeMasterRepository.GetSingle(x => x.WalletTypeName == CoinName);
        //        if (walletType != null)
        //        {
        //            response = new ServiceLimitChargeValue();
        //            var limitData = _limitRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
        //            var chargeData = _chargeRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);

        //            if (limitData != null && chargeData != null)
        //            {
        //                response.CoinName = walletType.WalletTypeName;
        //                response.TrnType = limitData.TrnType;
        //                response.MinAmount = limitData.MinAmount;
        //                response.MaxAmount = limitData.MaxAmount;
        //                response.ChargeType = chargeData.ChargeType;
        //                response.ChargeValue = chargeData.ChargeValue;
        //            }
        //            return response;
        //        }
        //        else
        //        {
        //            return null;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //vsolanki 2018-11-24

        public ServiceLimitChargeValue GetServiceLimitChargeValue(enWalletTrnType TrnType, string CoinName)
        {
            try
            {
                ServiceLimitChargeValue response;
                var walletType = _WalletTypeMasterRepository.GetSingle(x => x.WalletTypeName == CoinName);
                if (walletType != null)
                {
                    response = new ServiceLimitChargeValue();
                    //var limitData = _limitRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
                    var limitData = _walletTrnLimitConfiguration.GetSingle(x => x.TrnType == Convert.ToInt16(TrnType) && x.WalletType == walletType.Id);
                    var chargeData = _chargeRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);

                    if (limitData != null && chargeData != null)
                    {
                        response.CoinName = walletType.WalletTypeName;
                        response.TrnType = (enWalletTrnType)limitData.TrnType;
                        response.MinAmount = limitData.MinAmount;
                        response.MaxAmount = limitData.MaxAmount;
                        response.ChargeType = chargeData.ChargeType;
                        response.ChargeValue = chargeData.ChargeValue;
                    }
                    return response;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<enErrorCode> CheckShadowLimitAsync(long WalletID, decimal Amount, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                Task<WalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                WalletMaster Walletobj = await obj1;
                if (Walletobj != null)
                {
                    Task<MemberShadowBalance> Balobj1 = _ShadowBalRepo.GetSingleAsync(item => item.WalletID == WalletID);
                    MemberShadowBalance Balobj = await Balobj1;
                    if (Balobj != null)
                    {
                        if ((Balobj.ShadowAmount + Amount) <= Walletobj.Balance)
                        {
                            return enErrorCode.Success;
                        }
                        return enErrorCode.InsufficientBalance;
                    }
                    else
                    {
                        Task<long> typeobj1 = _walletRepository1.GetTypeMappingObjAsync(Walletobj.UserID);
                        long typeobj = await typeobj1;
                        if (typeobj != -1) //ntrivedi 04-11-2018 
                        {
                            Task<MemberShadowLimit> Limitobj1 = _ShadowLimitRepo.GetSingleAsync(item => item.MemberTypeId == typeobj);
                            MemberShadowLimit Limitobj = await Limitobj1;
                            if (Limitobj != null)
                            {
                                if ((Limitobj.ShadowLimitAmount + Amount) <= Walletobj.Balance)
                                {
                                    return enErrorCode.Success;
                                }
                                return enErrorCode.InsufficientBalance;
                            }
                            return enErrorCode.Success; // IF ENTRY NOT FOUND THEN SUCCESS NTRIVEDI
                        }
                        return enErrorCode.MemberTypeNotFound;
                    }
                }
                return enErrorCode.WalletNotFound;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        //vsolanki 2018-11-24
        public async Task<enErrorCode> InsertUpdateShadowAsync(long WalletID, decimal Amount,string Remarks,long WalleTypeId, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                //ntrivedi 15-02-2019 for margin wallet not use other wallet
                Task<WalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(enWalletUsageType));
                Task<MemberShadowBalance> Balobj1 = _ShadowBalRepo.GetSingleAsync(item => item.WalletID == WalletID);
                WalletMaster Walletobj = await obj1;
                if (Walletobj != null)
                {
                    MemberShadowBalance Balobj = await Balobj1;
                    if (Balobj != null)
                    {
                        Balobj.ShadowAmount = Balobj.ShadowAmount + Amount;
                        //update
                        var objs = _ShadowBalRepo.UpdateAsync(Balobj);
                        return enErrorCode.Success;
                    }
                    else
                    {
                        //insert
                        MemberShadowBalance newBalobj = new MemberShadowBalance();
                        newBalobj.CreatedDate = Helpers.UTC_To_IST();
                        newBalobj.CreatedBy = 1;
                        newBalobj.UpdatedBy = 1;
                        newBalobj.UpdatedDate = Helpers.UTC_To_IST();
                        newBalobj.Status = 1;
                        newBalobj.WalletID = WalletID;
                        newBalobj.ShadowAmount = Amount;
                        newBalobj.Remarks = Remarks;
                        newBalobj.MemberShadowLimitId = 0;
                        newBalobj.WalletTypeId = WalleTypeId;
                        _ShadowBalRepo.Add(newBalobj);
                        return enErrorCode.Success;
                    }
                }
                return enErrorCode.WalletNotFound;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        //vsolanki 2018-11-26
        public async Task<enErrorCode> UpdateShadowAsync(long WalletID, decimal Amount, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {

                //ntrivedi 15-02-2019 for margin wallet not use other wallet
                Task<WalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(enWalletUsageType));
                Task<MemberShadowBalance> Balobj1 = _ShadowBalRepo.GetSingleAsync(item => item.WalletID == WalletID);
                WalletMaster Walletobj = await obj1;
                if (Walletobj != null)
                {
                    MemberShadowBalance Balobj = await Balobj1;
                    if (Balobj != null)
                    {
                        if(Balobj.ShadowAmount>Amount)
                        {
                            Balobj.ShadowAmount = Balobj.ShadowAmount - Amount;
                            //update
                            var objs = _ShadowBalRepo.UpdateAsync(Balobj);
                            return enErrorCode.Success;
                        }
                        return enErrorCode.InvalidAmount;  
                    }
                }
                return enErrorCode.WalletNotFound;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        //public async Task<enErrorCode> CheckWalletLimitAsync(enWalletLimitType TrnType, long WalletId , decimal Amount)
        //{
        //    //WalletId = 26;
        //    //TrnType = enWalletLimitType.TradingLimit;
            
        //    #region Old Code
        //    //TimeSpan StartTime, EndTime;
        //    //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        //    //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //    //dateTime1 = istDate.AddSeconds(request.StartTime);
        //    //StartTime = dateTime1.TimeOfDay;
        //    //EndTime = dateTime1.TimeOfDay;

        //    //TimeSpan StartTime, EndTime;
        //    //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        //    //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //    //StartTime = istDate.AddSeconds(request.StartTime).TimeOfDay;
        //    //EndTime = istDate.AddSeconds(request.EndTime).TimeOfDay;
        //    #endregion
        //    try
        //    {
        //        HistoryAllSumAmount SumAmt = new HistoryAllSumAmount();
        //        WalletLimitConfiguration config = new WalletLimitConfiguration();
        //        WalletLimitConfigurationMaster MasterConfig = new WalletLimitConfigurationMaster();

        //        var MasterLimit = _WalletLimitMasterRepository.GetSingleAsync(item => item.TrnType == Convert.ToInt32(TrnType) && item.Status == Convert.ToInt16(ServiceStatus.Active));
        //        var Histories = _walletRepository1.GetHistorySum(WalletId);
        //        var limitobj = _WalletLimitRepository.GetSingleAsync(item => item.WalletId == WalletId && item.TrnType == Convert.ToInt32(TrnType) && item.Status == Convert.ToInt16(ServiceStatus.Active));

        //        DateTime myUTC = DateTime.UtcNow;                
        //        DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(myUTC, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //        TimeSpan TodayTime = istdate.TimeOfDay;

        //        config = await limitobj;
        //        SumAmt = await Histories;
        //        if (config == null)
        //        {
        //            MasterConfig = await MasterLimit;
        //            if (MasterConfig != null)
        //            {
        //                DateTime dtMStart = new DateTime();
        //                DateTime dtMEnd = new DateTime();
        //                dtMStart = dtMStart.AddSeconds(Convert.ToDouble(MasterConfig.StartTimeUnix/1000)).ToLocalTime();
        //                dtMEnd = dtMEnd.AddSeconds(Convert.ToDouble(MasterConfig.EndTimeUnix/1000)).ToLocalTime();

        //                TimeSpan MStartTime = dtMStart.TimeOfDay;
        //                TimeSpan MEndTime = dtMEnd.TimeOfDay;
                        
        //                if ((TodayTime >= MStartTime && TodayTime <= MEndTime) || (MasterConfig.StartTimeUnix == 0 && MasterConfig.EndTimeUnix == 0))
        //                {
        //                    if (SumAmt.Daily == 0 && SumAmt.Hourly == 0 && SumAmt.LifeTime == 0)
        //                    { 
        //                        if ((Amount <= MasterConfig.LimitPerTransaction || MasterConfig.LimitPerTransaction == 0) && (Amount <= MasterConfig.LimitPerHour || MasterConfig.LimitPerHour == 0) && (Amount <= MasterConfig.LimitPerDay || MasterConfig.LimitPerDay == 0))
        //                        {
        //                            return enErrorCode.Success;
        //                        }
        //                        return enErrorCode.MasterLimitValidationFail;
        //                    }
        //                    if ((MasterConfig.LimitPerDay >= 0) && (MasterConfig.LimitPerHour >= 0) && (MasterConfig.LimitPerTransaction >= 0))
        //                    {
        //                        if (((Amount + MasterConfig.LifeTime) <= MasterConfig.LifeTime) || MasterConfig.LifeTime == 0)
        //                        {
        //                            if (((Amount + SumAmt.Daily) <= MasterConfig.LimitPerDay) || MasterConfig.LimitPerDay == 0)
        //                            {
        //                                if (((Amount + SumAmt.Hourly) <= MasterConfig.LimitPerHour) || MasterConfig.LimitPerHour == 0)
        //                                {
        //                                    if ((Amount <= MasterConfig.LimitPerTransaction) || MasterConfig.LimitPerTransaction == 0)
        //                                    {
        //                                        return enErrorCode.Success;
        //                                    }
        //                                    return enErrorCode.MasterTransactionLimitValidationFail;
        //                                }
        //                                return enErrorCode.MasterHourlyLimitValidationFail;
        //                            }
        //                            return enErrorCode.MasterDailyLimitValidationFail;
        //                        }
        //                        return enErrorCode.MasterLifetimeLimitValidationFail;
        //                    }
        //                    return enErrorCode.MasterLimitValidationFail;
        //                }
        //                return enErrorCode.MasterTimeValidationFail;
        //            }
        //            return enErrorCode.Success;
        //        }
        //        DateTime dtStart = new DateTime();
        //        DateTime dtEnd = new DateTime();
        //        dtStart = dtStart.AddSeconds(Convert.ToDouble(config.StartTimeUnix/1000)).ToLocalTime();
        //        dtEnd = dtEnd.AddSeconds(Convert.ToDouble(config.EndTimeUnix/1000)).ToLocalTime();
        //       // DateTime dtEnd = istdate.AddSeconds(Convert.ToDouble(config.EndTimeUnix)).ToLocalTime();


        //        TimeSpan StartTime = dtStart.TimeOfDay;
        //        TimeSpan EndTime = dtEnd.TimeOfDay;

        //        if ((TodayTime >= StartTime && TodayTime<=EndTime) || (config.StartTimeUnix == 0 && config.EndTimeUnix == 0))
        //        {                    
        //            if (SumAmt.Daily == 0 && SumAmt.Hourly == 0 && SumAmt.LifeTime == 0)
        //            {
        //                if ((Amount <= config.LimitPerTransaction || config.LimitPerTransaction == 0)  && (Amount <= config.LimitPerHour || config.LimitPerHour == 0) && (Amount <= config.LimitPerDay || config.LimitPerDay == 0 ))
        //                {
        //                    return enErrorCode.Success;
        //                }
        //                return enErrorCode.LimitValidationFail;
        //            }
        //            if (config.LimitPerDay == 0 && config.LimitPerHour == 0 && config.LimitPerTransaction == 0)
        //            {
        //                return enErrorCode.Success;
        //            }
        //            if ((config.LimitPerDay >= 0) && (config.LimitPerHour >= 0) && (config.LimitPerTransaction >= 0))
        //            {
        //                if (((Amount + SumAmt.LifeTime) <= config.LifeTime) || config.LifeTime == 0)
        //                {
        //                    if (((Amount + SumAmt.Daily) <= config.LimitPerDay) || config.LimitPerDay == 0)
        //                    {
        //                        if (((Amount + SumAmt.Hourly) <= config.LimitPerHour) || config.LimitPerHour == 0)
        //                        {
        //                            if ((Amount <= config.LimitPerTransaction) || config.LimitPerTransaction == 0)
        //                            {
        //                                return enErrorCode.Success;
        //                            }
        //                            return enErrorCode.TransactionLimitValidationFail;
        //                        }
        //                        return enErrorCode.HourlyLimitValidationFail;
        //                    }
        //                    return enErrorCode.DailyLimitValidationFail;
        //                }
        //                return enErrorCode.LifetimeLimitValidationFail;
        //            }
        //            return enErrorCode.LimitValidationFail;
        //        }
        //        return enErrorCode.TimeValidationFail;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        public WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
           long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType,
           Int64 ErrorCode = 0 , decimal holdChargeAmount = 0,decimal chargeAmount = 0)
        {
            WalletTransactionQueue walletTransactionQueue = new WalletTransactionQueue();
            // walletTransactionQueue.TrnNo = TrnNo;
            walletTransactionQueue.Guid = Guid;
            walletTransactionQueue.TrnType = TrnType;
            walletTransactionQueue.Amount = Amount;
            walletTransactionQueue.TrnRefNo = TrnRefNo;
            walletTransactionQueue.TrnDate = TrnDate;
            walletTransactionQueue.UpdatedDate = UpdatedDate;
            walletTransactionQueue.WalletID = WalletID;
            walletTransactionQueue.WalletType = WalletType;
            walletTransactionQueue.MemberID = MemberID;
            walletTransactionQueue.TimeStamp = TimeStamp;
            walletTransactionQueue.Status = Status;
            walletTransactionQueue.StatusMsg = StatusMsg;
            walletTransactionQueue.WalletTrnType = enWalletTrnType;
            return walletTransactionQueue;
        }

        public async Task<BizResponseClass> CheckWithdrawBeneficiary(string address,long userID,string smscode)
        {
            try
            {
                //BizResponseClass BizResponse;
                //var walletTypeMasterAsync = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == smscode && e.Status == 1);               
                //var walletTypeMaster = await walletTypeMasterAsync;
                //if (walletTypeMaster == null)
                //{
                //    return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName };
                //}
                int cnt = _walletRepository1.IsSelfAddress(address, userID, smscode);
                if(cnt > 0)
                {
                    return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.CheckWithdrawBeneficiary_SelfAddressFound };
                }
                cnt = _walletRepository1.IsInternalAddress(address, userID, smscode);
                if (cnt > 0)
                {
                    return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.CheckWithdrawBeneficiary_InternalAddressFound };
                }
                else
                {
                    return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.CheckWithdrawBeneficiary_AddressNotFound };
                }
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public async Task<WalletTrnLimitResponse> CheckWalletLimitAsyncV1(enWalletLimitType TrnType, long WalletId, decimal Amount,long TrnNo=0)
        {
            try
            {
                //BizResponseClass Resp = new BizResponseClass();
                WalletTrnLimitResponse Resp2 = new WalletTrnLimitResponse();
                Resp2 = _walletSPRepositories.Callsp_CheckWalletTranLimit(Convert.ToInt16(TrnType), WalletId, Amount, TrnNo);
                //return Resp;
                return Resp2;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        //public async Task<enErrorCode> CheckWalletTranLimitAsync(enWalletLimitType TrnType, long WalletId, decimal Amount)
        //{
        //    //WalletId = 26;
        //    //TrnType = enWalletLimitType.TradingLimit;
        //    BizResponseClass Resp = new BizResponseClass();
        //    #region Old Code
        //    //TimeSpan StartTime, EndTime;
        //    //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        //    //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //    //dateTime1 = istDate.AddSeconds(request.StartTime);
        //    //StartTime = dateTime1.TimeOfDay;
        //    //EndTime = dateTime1.TimeOfDay;

        //    //TimeSpan StartTime, EndTime;
        //    //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        //    //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //    //StartTime = istDate.AddSeconds(request.StartTime).TimeOfDay;
        //    //EndTime = istDate.AddSeconds(request.EndTime).TimeOfDay;
        //    #endregion
        //    try
        //    {
        //        HistoryAllSumAmount SumAmt = new HistoryAllSumAmount();
        //        WalletLimitConfiguration config = new WalletLimitConfiguration();
        //        WalletLimitConfigurationMaster MasterConfig = new WalletLimitConfigurationMaster();

        //        var MasterLimit = _WalletLimitMasterRepository.GetSingleAsync(item => item.TrnType == Convert.ToInt32(TrnType) && item.Status == Convert.ToInt16(ServiceStatus.Active));
        //        var Histories = _walletRepository1.GetHistorySum(WalletId);
        //        var limitobj = _WalletLimitRepository.GetSingleAsync(item => item.WalletId == WalletId && item.TrnType == Convert.ToInt32(TrnType) && item.Status == Convert.ToInt16(ServiceStatus.Active));

        //        DateTime myUTC = DateTime.UtcNow;
        //        DateTime istdate = TimeZoneInfo.ConvertTimeFromUtc(myUTC, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        //        TimeSpan TodayTime = istdate.TimeOfDay;

        //        config = await limitobj;
        //        SumAmt = await Histories;
        //        if (config == null)
        //        {
        //            MasterConfig = await MasterLimit;
        //            if (MasterConfig != null)
        //            {
        //                DateTime dtMStart = new DateTime();
        //                DateTime dtMEnd = new DateTime();
        //                dtMStart = dtMStart.AddSeconds(Convert.ToDouble(MasterConfig.StartTimeUnix)).ToLocalTime();
        //                dtMEnd = dtMEnd.AddSeconds(Convert.ToDouble(MasterConfig.EndTimeUnix)).ToLocalTime();

        //                TimeSpan MStartTime = dtMStart.TimeOfDay;
        //                TimeSpan MEndTime = dtMEnd.TimeOfDay;

        //                if ((TodayTime >= MStartTime && TodayTime <= MEndTime) || (MasterConfig.StartTimeUnix == 0 && MasterConfig.EndTimeUnix == 0))
        //                {
        //                    if (SumAmt.Daily == 0 && SumAmt.Hourly == 0 && SumAmt.LifeTime == 0)
        //                    {
        //                        if ((Amount <= MasterConfig.LimitPerTransaction || MasterConfig.LimitPerTransaction == 0) && (Amount <= MasterConfig.LimitPerHour || MasterConfig.LimitPerHour == 0) && (Amount <= MasterConfig.LimitPerDay || MasterConfig.LimitPerDay == 0))
        //                        {
        //                            Resp.ErrorCode = enErrorCode.Success;
        //                            Resp.ReturnCode = enResponseCode.Success;
        //                            Resp.ReturnMsg = EnResponseMessage.WalletLimitValidationSuccess;
        //                            return Resp;
        //                            //return enErrorCode.Success;
        //                        }
        //                        Resp.ErrorCode = enErrorCode.MasterLimitValidationFail;
        //                        Resp.ReturnCode = enResponseCode.Fail;
        //                        Resp.ReturnMsg = EnResponseMessage.WalletMasterLimitValidationFail;
        //                        return Resp;
        //                        //return enErrorCode.MasterLimitValidationFail;
        //                    }
        //                    if ((MasterConfig.LimitPerDay >= 0) && (MasterConfig.LimitPerHour >= 0) && (MasterConfig.LimitPerTransaction >= 0))
        //                    {
        //                        if (((Amount + MasterConfig.LifeTime) <= MasterConfig.LifeTime) || MasterConfig.LifeTime == 0)
        //                        {
        //                            if (((Amount + SumAmt.Daily) <= MasterConfig.LimitPerDay) || MasterConfig.LimitPerDay == 0)
        //                            {
        //                                if (((Amount + SumAmt.Hourly) <= MasterConfig.LimitPerHour) || MasterConfig.LimitPerHour == 0)
        //                                {
        //                                    if ((Amount <= MasterConfig.LimitPerTransaction) || MasterConfig.LimitPerTransaction == 0)
        //                                    {
        //                                        Resp.ErrorCode = enErrorCode.Success;
        //                                        Resp.ReturnCode = enResponseCode.Success;
        //                                        Resp.ReturnMsg = EnResponseMessage.WalletLimitValidationSuccess;
        //                                        return Resp;
        //                                        //return enErrorCode.Success;
        //                                    }
        //                                    Resp.ErrorCode = enErrorCode.MasterTransactionLimitValidationFail;
        //                                    Resp.ReturnCode = enResponseCode.Fail;
        //                                    Resp.ReturnMsg = EnResponseMessage.AmountLimitValidationFail;
        //                                    return Resp;
        //                                    //return enErrorCode.MasterTransactionLimitValidationFail;
        //                                }
        //                                return enErrorCode.MasterHourlyLimitValidationFail;
        //                            }
        //                            return enErrorCode.MasterDailyLimitValidationFail;
        //                        }
        //                        return enErrorCode.MasterLifetimeLimitValidationFail;
        //                    }
        //                    return enErrorCode.MasterLimitValidationFail;
        //                }
        //                return enErrorCode.MasterTimeValidationFail;
        //            }
        //            return enErrorCode.Success;
        //        }
        //        DateTime dtStart = new DateTime();
        //        DateTime dtEnd = new DateTime();
        //        dtStart = dtStart.AddSeconds(Convert.ToDouble(config.StartTimeUnix)).ToLocalTime();
        //        dtEnd = dtEnd.AddSeconds(Convert.ToDouble(config.EndTimeUnix)).ToLocalTime();
        //        // DateTime dtEnd = istdate.AddSeconds(Convert.ToDouble(config.EndTimeUnix)).ToLocalTime();


        //        TimeSpan StartTime = dtStart.TimeOfDay;
        //        TimeSpan EndTime = dtEnd.TimeOfDay;

        //        if ((TodayTime >= StartTime && TodayTime <= EndTime) || (config.StartTimeUnix == 0 && config.EndTimeUnix == 0))
        //        {
        //            if (SumAmt.Daily == 0 && SumAmt.Hourly == 0 && SumAmt.LifeTime == 0)
        //            {
        //                if ((Amount <= config.LimitPerTransaction || config.LimitPerTransaction == 0) && (Amount <= config.LimitPerHour || config.LimitPerHour == 0) && (Amount <= config.LimitPerDay || config.LimitPerHour == 0))
        //                {
        //                    Resp.ErrorCode = enErrorCode.Success;
        //                    Resp.ReturnCode = enResponseCode.Success;
        //                    Resp.ReturnMsg = EnResponseMessage.WalletLimitValidationSuccess;
        //                    return Resp;
        //                    //return enErrorCode.Success;
        //                }
        //                return enErrorCode.LimitValidationFail;
        //            }
        //            if (config.LimitPerDay == 0 && config.LimitPerHour == 0 && config.LimitPerTransaction == 0)
        //            {
        //                Resp.ErrorCode = enErrorCode.Success;
        //                Resp.ReturnCode = enResponseCode.Success;
        //                Resp.ReturnMsg = EnResponseMessage.WalletLimitValidationSuccess;
        //                return Resp;
        //                //return enErrorCode.Success;
        //            }
        //            if ((config.LimitPerDay >= 0) && (config.LimitPerHour >= 0) && (config.LimitPerTransaction >= 0))
        //            {
        //                if (((Amount + SumAmt.LifeTime) <= config.LifeTime) || config.LifeTime == 0)
        //                {
        //                    if (((Amount + SumAmt.Daily) <= config.LimitPerDay) || config.LimitPerDay == 0)
        //                    {
        //                        if (((Amount + SumAmt.Hourly) <= config.LimitPerHour) || config.LimitPerHour == 0)
        //                        {
        //                            if ((Amount <= config.LimitPerTransaction) || config.LimitPerTransaction == 0)
        //                            {
        //                                Resp.ErrorCode = enErrorCode.Success;
        //                                Resp.ReturnCode = enResponseCode.Success;
        //                                Resp.ReturnMsg = EnResponseMessage.WalletLimitValidationSuccess;
        //                                return Resp;
        //                                //return enErrorCode.Success;
        //                            }
        //                            return enErrorCode.TransactionLimitValidationFail;
        //                        }
        //                        return enErrorCode.HourlyLimitValidationFail;
        //                    }
        //                    return enErrorCode.DailyLimitValidationFail;
        //                }
        //                return enErrorCode.LifetimeLimitValidationFail;
        //            }
        //            return enErrorCode.LimitValidationFail;
        //        }
        //        return enErrorCode.TimeValidationFail;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
    }
}
