using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Charges;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

//Chirag 11-06-2019 Added
namespace CleanArchitecture.Infrastructure.Services.Wallet
{
    public class ArbitrageWalletServiceCharge : BasePage, IArbitrageWalletServiceCharge
    {
        private readonly ICommonRepository<ArbitrageChargeConfigurationMaster> _ArbitrageChargeConfigurationMaster;
        private readonly ICommonRepository<ChargeConfigurationMasterArbitrage> _chargeConfigurationMasterArbitrage;
        private readonly ICommonRepository<ArbitrageWalletTypeMaster> _arbitrageWalletTypeMaster;
        private readonly ICommonRepository<SpecialChargeConfiguration> _specialChargeConfiguration;
        private readonly IArbitrageWalletChargeRepository _IArbitrageWalletChargeRepository;
        private readonly ICommonRepository<TradePairMasterArbitrage> _tradePairMasterArbitrage;
        private readonly ICommonRepository<ServiceProviderMasterArbitrage> _serviceProviderMasterArbitrage;
        private readonly ICommonRepository<CurrencyTypeMaster> _currencyTypeMaster;
        private readonly ICommonRepository<ChargeConfigurationDetailArbitrage> _ChargeConfigurationDetailArbitrage;

        public ArbitrageWalletServiceCharge(ICommonRepository<ArbitrageChargeConfigurationMaster> ArbitrageChargeConfigurationMaster,
                                            ICommonRepository<ChargeConfigurationMasterArbitrage> chargeConfigurationMasterArbitrage,
                                            ICommonRepository<ArbitrageWalletTypeMaster> arbitrageWalletTypeMaster,
                                            ICommonRepository<SpecialChargeConfiguration> specialChargeConfiguration,
                                            ICommonRepository<TradePairMasterArbitrage> tradePairMasterArbitrage,
                                            ICommonRepository<ServiceProviderMasterArbitrage> serviceProviderMasterArbitrage,
                                            IArbitrageWalletChargeRepository IArbitrageWalletChargeRepository,
                                            ICommonRepository<CurrencyTypeMaster> CurrencyTypeMaster,
                                            ICommonRepository<ChargeConfigurationDetailArbitrage> ChargeConfigurationDetailArbitrage,
                                            ILogger<BasePage> logger) : base(logger)
        {
            _ArbitrageChargeConfigurationMaster = ArbitrageChargeConfigurationMaster;
            _chargeConfigurationMasterArbitrage = chargeConfigurationMasterArbitrage;
            _arbitrageWalletTypeMaster = arbitrageWalletTypeMaster;
            _specialChargeConfiguration = specialChargeConfiguration;
            _IArbitrageWalletChargeRepository = IArbitrageWalletChargeRepository;
            _tradePairMasterArbitrage = tradePairMasterArbitrage;
            _serviceProviderMasterArbitrage = serviceProviderMasterArbitrage;
            _currencyTypeMaster = CurrencyTypeMaster;
            _ChargeConfigurationDetailArbitrage = ChargeConfigurationDetailArbitrage;
        }

        public ListProviderWalletLedgerResv1 GetProviderArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize)
        {
            try
            {
                var wallet = _arbitrageWalletTypeMaster.GetSingle(item => item.Id == WalletId);

                ListProviderWalletLedgerResv1 Response = new ListProviderWalletLedgerResv1();
                Response.PageNo = page;
                Response.PageSize = PageSize;
                if (wallet == null)
                {
                    Response.ErrorCode = enErrorCode.InvalidWallet;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                DateTime newToDate = ToDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                FromDate = FromDate.AddHours(0).AddMinutes(0).AddSeconds(0);
                int TotalCount = 0;
                var wl = _IArbitrageWalletChargeRepository.GetArbitrageProviderWalletLedger(FromDate, newToDate, wallet.Id, page + 1, PageSize, ref TotalCount);
                Response.TotalCount = TotalCount;
                if (wl.Count == 0)
                {
                    Response.ErrorCode = enErrorCode.NotFound;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.ProviderWalletLedgers = wl;
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = EnResponseMessage.FindRecored;
                Response.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass InsertUpdateArbitrageChargeConfigurationMaster(InsertUpdateArbitrageChargeConfigurationMasterReq Req, long UserId)
        {
            try
            {
                if (Req == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                }

                if (Req.Status != 1 && Req.Status != 9)
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };

                if (Req.Id == 0)
                {
                    if ((Req.WalletTypeId != 0 && Req.PairID != 0) || Req.SerProID == 0 || (Req.KYCComplaint < 0 || Req.KYCComplaint > 1))
                    {
                        //Chirag 12/06/2019 At a time only one type of charge either on WalletTypeID or on PairID can be inserted
                        return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                    }

                    var ServiceProviderMasterArbitrage = _serviceProviderMasterArbitrage.GetSingle(i => i.Id == Req.SerProID && i.Status == 1);
                    if (ServiceProviderMasterArbitrage == null)
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };

                    //Chirag 12/06/2019 Insert Based on WalletTypeID
                    if (Req.WalletTypeId != 0)
                    {
                        if (Req.TrnType != (long)enWalletTrnType.BuyTrade && Req.TrnType != (long)enWalletTrnType.SellTrade)
                            return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                        var AbritrageWalletTypeMaster = _arbitrageWalletTypeMaster.GetSingle(i => i.Id == Req.WalletTypeId && i.Status == 1);
                        if (AbritrageWalletTypeMaster == null)
                            return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.WalletNotFound };
                        var ObjExist = _ArbitrageChargeConfigurationMaster.GetSingle(i => i.WalletTypeID == Req.WalletTypeId && i.TrnType == Req.TrnType && i.SerProId == Req.SerProID);
                        if (ObjExist != null)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist };
                    }
                    else if (Req.PairID != 0)
                    {
                        var TradePairMasterArbitrage = _tradePairMasterArbitrage.GetSingle(i => i.Id == Req.PairID && i.Status == 1);
                        if (TradePairMasterArbitrage == null)
                            return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };
                        var ObjExist = _ArbitrageChargeConfigurationMaster.GetSingle(i => i.SerProId == Req.SerProID && i.PairId == Req.PairID && i.KYCComplaint == Req.KYCComplaint);
                        if (ObjExist != null)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist };
                    }
                    else
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                    }

                    ArbitrageChargeConfigurationMaster Obj = new ArbitrageChargeConfigurationMaster();
                    Obj.CreatedDate = UTC_To_IST();
                    Obj.CreatedBy = UserId;
                    Obj.UpdatedBy = null;
                    Obj.UpdatedDate = UTC_To_IST();
                    Obj.Status = Req.Status;
                    Obj.WalletTypeID = Req.WalletTypeId;
                    Obj.PairId = Req.PairID;
                    Obj.SerProId = Req.SerProID;
                    Obj.TrnType = Req.TrnType;
                    Obj.KYCComplaint = Req.KYCComplaint;
                    Obj.Remarks = Req.Remarks;
                    //insert
                    _ArbitrageChargeConfigurationMaster.Add(Obj);
                    return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordAdded };
                }
                else
                {
                    var ObjExist = _ArbitrageChargeConfigurationMaster.GetSingle(i => i.Id == Req.Id);
                    if (ObjExist == null)
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };
                    }
                    else
                    {
                        if (ObjExist.Status == Req.Status)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist };
                        else
                            ObjExist.Status = Req.Status;

                        ObjExist.UpdatedBy = UserId;
                        ObjExist.UpdatedDate = UTC_To_IST();

                        //Update
                        _ArbitrageChargeConfigurationMaster.UpdateWithAuditLog(ObjExist);
                        return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated };
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListArbitrageChargeConfigurationMasterRes ListArbitrageChargeConfigurationMaster(long? WalletTypeId, long? SerProId, long? PairID)
        {
            try
            {
                ListArbitrageChargeConfigurationMasterRes resp = new ListArbitrageChargeConfigurationMasterRes();
                if (WalletTypeId != 0 && PairID != 0)
                {
                    //Chirag 13/06/2019 At a time listing can only be with one thing either on WalletTypeID or on PairID
                    resp.ErrorCode = enErrorCode.InvalidInput;
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.InvalidInput;
                    resp.Data = new List<ArbitrageChargeConfigurationMasterRes>(); ;
                    return resp;
                }
                var data = _IArbitrageWalletChargeRepository.ListArbitrageChargeConfigurationMaster(WalletTypeId, SerProId, PairID);

                if (data.Count == 0)
                {
                    resp.Data = new List<ArbitrageChargeConfigurationMasterRes>();
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.NotFound;
                    resp.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    resp.Data = data;
                    resp.ReturnCode = enResponseCode.Success;
                    resp.ReturnMsg = EnResponseMessage.FindRecored;
                    resp.ErrorCode = enErrorCode.Success;
                }
                return resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListProviderWalletRes ListProviderWallet(short? Status, long? SerProId, string SMSCode)
        {
            try
            {
                ListProviderWalletRes Resp = new ListProviderWalletRes();
                var data = _IArbitrageWalletChargeRepository.ListProviderWallet(Status, SerProId, SMSCode);
                Resp.Data = data;
                //Resp.TotalCount = TotalCount;
                if (data.Count > 0)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListArbitrageWalletTypeMasterRes ListAllWalletTypeMaster()
        {
            ListArbitrageWalletTypeMasterRes listArbitrageWalletTypeMasterResponse = new ListArbitrageWalletTypeMasterRes();
            try
            {
                IEnumerable<ArbitrageWalletTypeMaster> coin = new List<ArbitrageWalletTypeMaster>();
                coin = _arbitrageWalletTypeMaster.FindBy(item => item.Status != Convert.ToInt16(ServiceStatus.Disable));
                if (coin == null)
                {
                    listArbitrageWalletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    listArbitrageWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listArbitrageWalletTypeMasterResponse.ErrorCode = enErrorCode.RecordNotFound;

                }
                else
                {
                    listArbitrageWalletTypeMasterResponse.ArbitrageWalletTypeMasters = coin;
                    listArbitrageWalletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    listArbitrageWalletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    listArbitrageWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.FindRecored;
                }

                return listArbitrageWalletTypeMasterResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass InsertUpdateArbitrageWalletTypeMaster(InsertUpdateArbitrageWalletTypeMasterReq Req, long UserId)
        {
            try
            {
                if (Req == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                }

                if ((Req.Status != 1 && Req.Status != 9) || (Req.IsDepositionAllow != 1 && Req.IsDepositionAllow != 0) || (Req.IsWithdrawalAllow != 1 && Req.IsWithdrawalAllow != 0) || (Req.IsTransactionWallet != 1 && Req.IsTransactionWallet != 0))
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };

                if (Req.Id == 0)
                {
                    if ((Req.IsLeaverageAllow != 1 && Req.IsLeaverageAllow != 0))
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                    }

                    var currencyType = _currencyTypeMaster.GetSingle(i => i.Id == Req.CurrencyTypeID && i.Status == 1);
                    if (currencyType == null)
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };

                    var IsExist = _arbitrageWalletTypeMaster.GetSingle(i => i.WalletTypeName == Req.WalletTypeName);
                    if (IsExist != null)
                    {
                        if (IsExist.Status == Convert.ToInt16(ServiceStatus.Disable))
                        {
                            IsExist.Status = Req.Status;
                            IsExist.IsDepositionAllow = Req.IsDepositionAllow;
                            IsExist.IsWithdrawalAllow = Req.IsWithdrawalAllow;
                            IsExist.IsTransactionWallet = Req.IsTransactionWallet;
                            IsExist.Description = Req.Description;
                            IsExist.UpdatedBy = UserId;
                            IsExist.UpdatedDate = UTC_To_IST();
                            _arbitrageWalletTypeMaster.UpdateWithAuditLog(IsExist);

                            return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordAdded };
                        }
                        else
                        {
                            return new BizResponseClass { ErrorCode = enErrorCode.DuplicateRecord, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.DuplicateRecord };
                        }
                    }

                    ArbitrageWalletTypeMaster Obj = new ArbitrageWalletTypeMaster();
                    Obj.CreatedDate = UTC_To_IST();
                    Obj.CreatedBy = UserId;
                    Obj.UpdatedBy = null;
                    Obj.UpdatedDate = UTC_To_IST();
                    Obj.Status = Req.Status;
                    Obj.WalletTypeName = Req.WalletTypeName;
                    Obj.Description = Req.Description;
                    Obj.IsDepositionAllow = Req.IsDepositionAllow;
                    Obj.IsWithdrawalAllow = Req.IsWithdrawalAllow;
                    Obj.IsTransactionWallet = Req.IsTransactionWallet;
                    Obj.IsDefaultWallet = Req.IsDefaultWallet;
                    Obj.ConfirmationCount = Req.ConfirmationCount;
                    Obj.IsLocal = Req.IsLocal;
                    Obj.CurrencyTypeID = Req.CurrencyTypeID;
                    Obj.IsLeaverageAllow = Req.IsLeaverageAllow;
                    //insert
                    _arbitrageWalletTypeMaster.Add(Obj);
                    return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordAdded };
                }
                else
                {
                    var ObjExist = _arbitrageWalletTypeMaster.GetSingle(i => i.Id == Req.Id);
                    if (ObjExist == null)
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };
                    }
                    else
                    {
                        if (ObjExist.Status == Req.Status)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist };
                        else
                        {
                            ObjExist.Status = Req.Status;
                            ObjExist.IsDepositionAllow = Req.IsDepositionAllow;
                            ObjExist.IsTransactionWallet = Req.IsTransactionWallet;
                            ObjExist.IsWithdrawalAllow = Req.IsWithdrawalAllow;
                            ObjExist.Description = Req.Description;
                        }

                        ObjExist.UpdatedBy = UserId;
                        ObjExist.UpdatedDate = UTC_To_IST();

                        //Update
                        _arbitrageWalletTypeMaster.UpdateWithAuditLog(ObjExist);
                        return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated };
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass InsertUpdateChargeConfigurationMasterArbitrage(InsertUpdateChargeConfigurationMasterArbitrageReq Req, long UserId)
        {
            try
            {
                if (Req == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                }

                if ((Req.Status != 1 && Req.Status != 9) || (Req.SlabType != (short)EnStakingSlabType.Fixed && Req.SlabType != (short)EnStakingSlabType.Range))
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };

                if (Req.SpecialChargeConfigurationID != 0)
                {
                    var SpecialChargeConfiguration = _specialChargeConfiguration.GetSingle(i => i.Id == Req.SpecialChargeConfigurationID && i.Status == 1);
                    if (SpecialChargeConfiguration == null)
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.SpecialChargeConfigurationNotFound };
                }

                if (Req.Id == 0)
                {
                    if ((Req.KYCComplaint < 0 || Req.KYCComplaint > 1) || (Req.TrnType != (long)enWalletTrnType.BuyTrade && Req.TrnType != (long)enWalletTrnType.SellTrade))
                    {
                        //Chirag 12/06/2019 At a time only one type of charge either on WalletTypeID or on PairID can be inserted
                        return new BizResponseClass { ErrorCode = enErrorCode.InvalidInput, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidInput };
                    }

                    var AbritrageWalletTypeMaster = _arbitrageWalletTypeMaster.GetSingle(i => i.Id == Req.WalletTypeId && i.Status == 1);
                    if (AbritrageWalletTypeMaster == null)
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.WalletNotFound };

                    if (Req.SpecialChargeConfigurationID != 0)
                    {
                        var ObjExist = _chargeConfigurationMasterArbitrage.GetSingle(i => i.WalletTypeID == Req.WalletTypeId && i.TrnType == Req.TrnType && i.SpecialChargeConfigurationID == Req.SpecialChargeConfigurationID);
                        if (ObjExist != null)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.RecordAlreadyExists };
                    }
                    else
                    {
                        var ObjExist = _chargeConfigurationMasterArbitrage.GetSingle(i => i.WalletTypeID == Req.WalletTypeId && i.TrnType == Req.TrnType);
                        if (ObjExist != null)
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.RecordAlreadyExists };
                    }

                    ChargeConfigurationMasterArbitrage Obj = new ChargeConfigurationMasterArbitrage();
                    Obj.CreatedDate = UTC_To_IST();
                    Obj.CreatedBy = UserId;
                    Obj.UpdatedBy = null;
                    Obj.UpdatedDate = UTC_To_IST();
                    Obj.Status = Req.Status;
                    Obj.WalletTypeID = Req.WalletTypeId;
                    Obj.TrnType = Req.TrnType;
                    Obj.KYCComplaint = Req.KYCComplaint;
                    Obj.Remarks = Req.Remarks;
                    Obj.SlabType = Req.SlabType;
                    Obj.SpecialChargeConfigurationID = Req.SpecialChargeConfigurationID;
                    //insert
                    _chargeConfigurationMasterArbitrage.Add(Obj);
                    return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordAdded };
                }
                else
                {
                    var ObjExist = _chargeConfigurationMasterArbitrage.GetSingle(i => i.Id == Req.Id);
                    if (ObjExist == null)
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.NoRecordFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProviderDataFetchFail };
                    }
                    else
                    {
                        if (Req.SpecialChargeConfigurationID != 0)
                        {
                            var ObjExistCheck = _chargeConfigurationMasterArbitrage.GetSingle(i => i.WalletTypeID == ObjExist.WalletTypeID && i.TrnType == ObjExist.TrnType && i.SpecialChargeConfigurationID == Req.SpecialChargeConfigurationID);
                            if (ObjExistCheck != null)
                                return new BizResponseClass { ErrorCode = enErrorCode.AlredyExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.RecordAlreadyExists };
                            ObjExist.SpecialChargeConfigurationID = Req.SpecialChargeConfigurationID;
                        }

                        ObjExist.Status = Req.Status;
                        ObjExist.SlabType = Req.SlabType;
                        ObjExist.UpdatedBy = UserId;
                        ObjExist.UpdatedDate = UTC_To_IST();

                        //Update
                        _chargeConfigurationMasterArbitrage.UpdateWithAuditLog(ObjExist);
                        return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated };
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListChargeConfigurationMasterArbitrageRes ListChargeConfigurationMasterArbitrage(long? WalletTypeId)
        {
            try
            {
                ListChargeConfigurationMasterArbitrageRes resp = new ListChargeConfigurationMasterArbitrageRes();
                
                var data = _IArbitrageWalletChargeRepository.ListChargeConfigurationMasterArbitrage(WalletTypeId);

                if (data.Count == 0)
                {
                    resp.Data = new List<ChargeConfigurationMasterArbitrageRes>();
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.NotFound;
                    resp.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    resp.Data = data;
                    resp.ReturnCode = enResponseCode.Success;
                    resp.ReturnMsg = EnResponseMessage.FindRecored;
                    resp.ErrorCode = enErrorCode.Success;
                }
                return resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public async Task<BizResponseClass> AddNewChargeConfigurationDetail(ChargeConfigurationDetailArbitrageReq request, long id)
        {
            BizResponseClass Resp = new BizResponseClass();
            try
            {
                var IsExist = await _ChargeConfigurationDetailArbitrage.GetSingleAsync(i => i.ChargeConfigurationMasterID == request.ChargeConfigurationMasterID && i.ChargeDistributionBasedOn == Convert.ToInt16(request.ChargeDistributionBasedOn) && i.ChargeType == Convert.ToInt64(request.ChargeType) && i.ChargeValue == request.ChargeValue && i.ChargeValueType == Convert.ToInt16(request.ChargeValueType) && i.ChargeValue == request.ChargeValue);
                if (IsExist != null)
                {
                    if (IsExist.Status == 9)
                    {
                        IsExist.Status = 1;
                        IsExist.UpdatedBy = id;
                        IsExist.UpdatedDate = UTC_To_IST();
                        _ChargeConfigurationDetailArbitrage.UpdateWithAuditLog(IsExist);

                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ErrorCode = enErrorCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.RecordAdded;
                    }
                    else
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ErrorCode = enErrorCode.Alredy_Exist;
                        Resp.ReturnMsg = EnResponseMessage.Alredy_Exist;
                    }
                    return Resp;
                }
                else
                {
                    ChargeConfigurationDetailArbitrage NewObj = new ChargeConfigurationDetailArbitrage
                    {
                        ChargeConfigurationMasterID = request.ChargeConfigurationMasterID,
                        ChargeDistributionBasedOn = Convert.ToInt16(request.ChargeDistributionBasedOn),
                        ChargeType = Convert.ToInt64(request.ChargeType),
                        ChargeValue = request.ChargeValue,
                        ChargeValueType = Convert.ToInt16(request.ChargeValueType),
                        DeductionWalletTypeId = request.DeductionWalletTypeId,
                        CreatedBy = id,
                        CreatedDate = UTC_To_IST(),
                        MakerCharge = request.MakerCharge,
                        TakerCharge = request.TakerCharge,
                        MaxAmount = request.MaxAmount,
                        MinAmount = request.MinAmount,
                        Remarks = request.Remarks,
                        Status = Convert.ToInt16(request.Status == null ? 1 : request.Status),
                        DeductChargetType = 0
                    };
                    _ChargeConfigurationDetailArbitrage.Add(NewObj);
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.RecordAdded;
                    return Resp;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("AddNewChargeConfigurationDetail", this.GetType().Name, ex);
                throw;
            }
        }

        public async Task<BizResponseClass> UpdateChargeConfigurationDetail(long detailId, ChargeConfigurationDetailArbitrageReq request, long id)
        {
            BizResponseClass Resp = new BizResponseClass();
            try
            {
                var IsExist = await _ChargeConfigurationDetailArbitrage.GetSingleAsync(i => i.Id == detailId);
                if (IsExist == null)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    return Resp;
                }
                var IsDuplicate = await _ChargeConfigurationDetailArbitrage.GetSingleAsync(i => i.Id != detailId && i.ChargeConfigurationMasterID == request.ChargeConfigurationMasterID && i.ChargeDistributionBasedOn == Convert.ToInt16(request.ChargeDistributionBasedOn) && i.ChargeType == Convert.ToInt64(request.ChargeType) && i.ChargeValue == request.ChargeValue && i.ChargeValueType == Convert.ToInt16(request.ChargeValueType) && i.ChargeValue == request.ChargeValue);
                if (IsDuplicate != null)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.Alredy_Exist;
                    Resp.ReturnMsg = EnResponseMessage.Alredy_Exist;
                    return Resp;
                }
                IsExist.Status = Convert.ToInt16(request.Status == null ? 1 : request.Status);
                IsExist.UpdatedBy = id;
                IsExist.UpdatedDate = UTC_To_IST();
                IsExist.ChargeConfigurationMasterID = request.ChargeConfigurationMasterID;
                IsExist.ChargeDistributionBasedOn = Convert.ToInt16(request.ChargeDistributionBasedOn);
                IsExist.ChargeType = Convert.ToInt64(request.ChargeType);
                IsExist.ChargeValue = request.ChargeValue;
                IsExist.ChargeValueType = Convert.ToInt16(request.ChargeValueType);
                IsExist.DeductionWalletTypeId = request.DeductionWalletTypeId;
                IsExist.MakerCharge = request.MakerCharge;
                IsExist.TakerCharge = request.TakerCharge;
                IsExist.MaxAmount = request.MaxAmount;
                IsExist.MinAmount = request.MinAmount;
                IsExist.Remarks = request.Remarks;
                IsExist.Status = Convert.ToInt16(request.Status == null ? 1 : request.Status);
                _ChargeConfigurationDetailArbitrage.UpdateWithAuditLog(IsExist);

                Resp.ReturnCode = enResponseCode.Success;
                Resp.ErrorCode = enErrorCode.Success;
                Resp.ReturnMsg = EnResponseMessage.RecordUpdated;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("UpdateChargeConfiguration", this.GetType().Name, ex);
                throw;
            }
        }

        public async Task<ChargeConfigurationDetailArbitrageRes2> GetChargeConfigurationDetail(long detailId)
        {
            ChargeConfigurationDetailArbitrageRes2 Resp = new ChargeConfigurationDetailArbitrageRes2();
            try
            {
                var data = _IArbitrageWalletChargeRepository.GetChargeConfigDetailbyId(detailId);
                if (data != null)
                {
                    Resp.Details = data;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListChargeConfiguration", this.GetType().Name, ex);
                throw;
            }
        }

        public async Task<ListChargeConfigurationDetailArbitrageRes> ListChargeConfigurationDetail(long? masterId, long? chargeType, short? chargeValueType, short? chargeDistributionBasedOn, short? status)
        {
            ListChargeConfigurationDetailArbitrageRes Resp = new ListChargeConfigurationDetailArbitrageRes();
            try
            {
                var data = _IArbitrageWalletChargeRepository.GetChargeConfigDetailList(masterId, chargeType, chargeValueType, chargeDistributionBasedOn, status);
                if (data.Count > 0)
                {
                    Resp.Details = data;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListChargeConfiguration", this.GetType().Name, ex);
                throw;
            }
        }
    }
}
