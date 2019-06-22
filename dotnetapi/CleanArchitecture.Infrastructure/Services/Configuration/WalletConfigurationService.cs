﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.ViewModels.WalletConfiguration;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure.Services.Configuration
{
    public class WalletConfigurationService : BasePage, IWalletConfigurationService
    {
        #region "DI"

        private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        private readonly ILogger<WalletConfigurationService> _log;
        private readonly IWalletRepository _walletRepository;

        #endregion

        #region "cotr"
        public WalletConfigurationService(ILogger<WalletConfigurationService> log, ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository, ILogger<BasePage> logger, IWalletRepository walletRepository) : base(logger)
        {
            _log = log;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _walletRepository = walletRepository;
        }
        #endregion

        #region "Methods"

        #region "WalletTypeMaster"

        //vsolanki 11-10-2018 List the wallettypemaster
        public ListWalletTypeMasterResponse ListAllWalletTypeMaster()
        {
            ListWalletTypeMasterResponse listWalletTypeMasterResponse = new ListWalletTypeMasterResponse();
            try
            {
                IEnumerable<WalletTypeMaster> coin = new List<WalletTypeMaster>();
                coin = _WalletTypeMasterRepository.FindBy(item => item.Status != Convert.ToInt16(ServiceStatus.Disable));
                if (coin == null)
                {
                    listWalletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    listWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletTypeMasterResponse.ErrorCode = enErrorCode.RecordNotFound;

                }
                else
                {
                    listWalletTypeMasterResponse.walletTypeMasters = coin;
                    listWalletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    listWalletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    listWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.FindRecored;
                }

                return listWalletTypeMasterResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletTypeMasterResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletTypeMasterResponse;
            }
        }

        //vsolanki 11-10-2018 insert into wallettypemaster
        public WalletTypeMasterResponse AddWalletTypeMaster(WalletTypeMasterRequest addWalletTypeMasterRequest, long Userid)
        {
            WalletTypeMasterResponse walletTypeMasterResponse = new WalletTypeMasterResponse();
            WalletTypeMaster _walletTypeMaster = new WalletTypeMaster();
            try
            {
                if (addWalletTypeMasterRequest == null)
                {
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    return walletTypeMasterResponse;
                }
                else
                {
                    //Rushabh 04-04-2019 Added Duplicate Record Condition
                    var IsExist = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == addWalletTypeMasterRequest.WalletTypeName);
                    if(IsExist != null)
                    {
                        if(IsExist.Status == Convert.ToInt16(ServiceStatus.Disable))
                        {
                            IsExist.Status = addWalletTypeMasterRequest.Status;
                            IsExist.IsDepositionAllow = addWalletTypeMasterRequest.IsDepositionAllow;
                            IsExist.IsWithdrawalAllow = addWalletTypeMasterRequest.IsWithdrawalAllow;
                            IsExist.IsTransactionWallet = addWalletTypeMasterRequest.IsTransactionWallet;
                            IsExist.Description = addWalletTypeMasterRequest.Description;
                            IsExist.UpdatedBy = Userid;
                            IsExist.UpdatedDate = UTC_To_IST();
                            _WalletTypeMasterRepository.UpdateWithAuditLog(IsExist);

                            walletTypeMasterResponse.walletTypeMaster = IsExist;
                            walletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                            walletTypeMasterResponse.ReturnMsg = EnResponseMessage.RecordAdded;
                            walletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                            return walletTypeMasterResponse;
                        }
                        else
                        {
                            walletTypeMasterResponse.walletTypeMaster = _walletTypeMaster;
                            walletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                            walletTypeMasterResponse.ReturnMsg = EnResponseMessage.DuplicateRecord;
                            walletTypeMasterResponse.ErrorCode = enErrorCode.DuplicateRecord;
                            return walletTypeMasterResponse;
                        }
                    }
                    _walletTypeMaster.CreatedBy = Userid;
                    _walletTypeMaster.CreatedDate = UTC_To_IST();
                    _walletTypeMaster.IsDepositionAllow = addWalletTypeMasterRequest.IsDepositionAllow;
                    _walletTypeMaster.IsTransactionWallet = addWalletTypeMasterRequest.IsTransactionWallet;
                    _walletTypeMaster.IsWithdrawalAllow = addWalletTypeMasterRequest.IsWithdrawalAllow;
                    _walletTypeMaster.WalletTypeName = addWalletTypeMasterRequest.WalletTypeName;
                    _walletTypeMaster.Description = addWalletTypeMasterRequest.Description;
                    _walletTypeMaster.Status = Convert.ToInt16(ServiceStatus.Active);
                    _WalletTypeMasterRepository.Add(_walletTypeMaster);
                    walletTypeMasterResponse.walletTypeMaster = _walletTypeMaster;
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.RecordAdded;
                    walletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    return walletTypeMasterResponse;
                }
                //return _walletTypeMaster;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                walletTypeMasterResponse.ReturnCode = enResponseCode.InternalError;
                return walletTypeMasterResponse;
            }
        }

        //vsolanki 11-10-2018 upadte into wallettypemaster
        public WalletTypeMasterResponse UpdateWalletTypeMaster(WalletTypeMasterUpdateRequest updateWalletTypeMasterRequest, long Userid, long WalletTypeId)
        {
            WalletTypeMasterResponse walletTypeMasterResponse = new WalletTypeMasterResponse();
            try
            {
                // WalletTypeMaster _walletTypeMaster = new WalletTypeMaster();
                var _walletTypeMaster = _WalletTypeMasterRepository.GetById(WalletTypeId);
                if (_walletTypeMaster == null)
                {
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    return walletTypeMasterResponse;
                }
                else
                {                    
                    _walletTypeMaster.UpdatedBy = Userid;
                    _walletTypeMaster.UpdatedDate = UTC_To_IST();

                    _walletTypeMaster.IsDepositionAllow = updateWalletTypeMasterRequest.IsDepositionAllow;
                    _walletTypeMaster.IsTransactionWallet = updateWalletTypeMasterRequest.IsTransactionWallet;
                    _walletTypeMaster.IsWithdrawalAllow = updateWalletTypeMasterRequest.IsWithdrawalAllow;                    
                    _walletTypeMaster.Description = updateWalletTypeMasterRequest.Description;
                    _walletTypeMaster.Status = updateWalletTypeMasterRequest.Status;

                    _WalletTypeMasterRepository.Update(_walletTypeMaster);
                    walletTypeMasterResponse.walletTypeMaster = _walletTypeMaster;
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.RecordUpdated;
                    walletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    return walletTypeMasterResponse;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                walletTypeMasterResponse.ReturnCode = enResponseCode.InternalError;
                return walletTypeMasterResponse;
            }
        }

        //vsolanki 11-10-2018 delete from wallettypemaster
        public BizResponseClass DisableWalletTypeMaster(long WalletTypeId)
        {
            try
            {
                var _walletTypeMaster = _WalletTypeMasterRepository.GetById(WalletTypeId);
                if (_walletTypeMaster == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }
                else
                {
                    //_WalletTypeMasterRepository.Delete(_walletTypeMaster);
                    _walletTypeMaster.DisableStatus();
                    _WalletTypeMasterRepository.Update(_walletTypeMaster);
                    return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordDisable ,ErrorCode=enErrorCode.Success};
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                return new BizResponseClass { ReturnCode = enResponseCode.InternalError, };
            }
        }

        //vsolanki 11-10-2018 wallettypemaster Get by id
        public WalletTypeMasterResponse GetWalletTypeMasterById(long WalletTypeId)
        {
            WalletTypeMasterResponse walletTypeMasterResponse = new WalletTypeMasterResponse();
            try
            {
                var _walletTypeMaster = _WalletTypeMasterRepository.GetSingle(item => item.Id == WalletTypeId && item.Status != Convert.ToInt16(ServiceStatus.Disable));
                if (_walletTypeMaster == null)
                {
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    return walletTypeMasterResponse;
                }
                else
                {
                    walletTypeMasterResponse.walletTypeMaster = _walletTypeMaster;
                    walletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    walletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    walletTypeMasterResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    return walletTypeMasterResponse;
                }
                //return _walletTypeMaster;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                walletTypeMasterResponse.ReturnCode = enResponseCode.InternalError;
                return walletTypeMasterResponse;
            }
        }

        #endregion

        #region "Other Methods"

        //vsolanki 2018-11-2
        public TransferInOutRes GetTransferIn(string Coin,int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId)
        {
            TransferInOutRes transfer = new TransferInOutRes();
            transfer.BizResponseObj = new BizResponseClass();
            int TotalCount = 0;
            try
            {
                var trans = _walletRepository.GetTransferIn(Coin,Page+1, PageSize, UserId, Address, TrnID, OrgId,ref TotalCount);
                transfer.TotalCount = TotalCount;
                transfer.PageNo = Page;
                transfer.PageSize = PageSize;
                if (trans == null || trans.Count == 0)
                {
                    transfer.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    transfer.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    transfer.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return transfer;
                }
                else
                {
                    transfer.Transfers = trans;
                    transfer.BizResponseObj.ReturnCode = enResponseCode.Success;
                    transfer.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                    transfer.BizResponseObj.ErrorCode = enErrorCode.Success;  
                    return transfer;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TransferInOutRes GetTransferOutHistory(string CoinName,int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId)
        {
            TransferInOutRes transfer = new TransferInOutRes();
            transfer.BizResponseObj = new BizResponseClass();
            int TotalCount = 0;
            try
            {
                var trans = _walletRepository.TransferOutHistory(CoinName,Page+1,PageSize, UserId, Address, TrnID, OrgId,ref TotalCount);
                transfer.TotalCount = TotalCount;
                transfer.PageNo = Page;
                transfer.PageSize = PageSize;
                if (trans == null || trans.Count == 0)
                {
                    transfer.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    transfer.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    transfer.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return transfer;
                }
                else
                {
                    transfer.Transfers = trans;
                    transfer.BizResponseObj.ReturnCode = enResponseCode.Success;
                    transfer.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                    transfer.BizResponseObj.ErrorCode = enErrorCode.Success;
                    return transfer;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        #endregion
    }
}
