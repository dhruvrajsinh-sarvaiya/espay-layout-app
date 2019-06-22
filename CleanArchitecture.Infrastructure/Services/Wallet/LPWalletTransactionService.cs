using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Wallet
{
    public class LPWalletTransactionService : ILPWalletTransaction
    {
        #region cotr
        //private readonly CleanArchitectureContext _dbContext;
        private readonly ICommonRepository<LPWalletMaster> _LPWalletMaster;
        private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        private readonly IWalletTQInsert _WalletTQInsert;
        private readonly ILPSPRepositories _walletSPRepositories;


        public LPWalletTransactionService(CleanArchitectureContext dbContext, ICommonRepository<LPWalletMaster> LPWalletMaster, ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository,
            IWalletTQInsert WalletTQInsert, ILPSPRepositories lPWalletRepository)
        {
            //_dbContext = dbContext;
            _LPWalletMaster = LPWalletMaster;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _WalletTQInsert = WalletTQInsert;//ntrivedi 22-01-2018
            _walletSPRepositories = lPWalletRepository;
        }
        #endregion

        public async Task<WalletDrCrResponse> LPGetWalletCreditDrForHoldNewAsyncFinal(LPWalletCrDr LPObj, string timestamp, EnAllowedChannels allowedChannels = EnAllowedChannels.Web)
        {
            BizResponseClass bizResponse = new BizResponseClass();
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile("LPGetWalletCreditDrForHoldNewAsyncFinal ", "LPTransactionWalletService", "timestamp:" + timestamp + " " + Helpers.JsonSerialize(LPObj)));
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LPGetWalletCreditDrForHoldNewAsyncFinal charge exception  Timestamp" + timestamp, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "LPGetWalletCreditDrForHoldNewAsyncFinal");
            }

        }

        public async Task<WalletDrCrResponse> LPGetWalletHoldNew(LPHoldDr LPObj)
        {
            try
            {

                WalletDrCrResponse resp = new WalletDrCrResponse();
                //bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Debit;
                WalletTypeMaster walletTypeMaster;
                long userID = 0, TrnNo = 0;
                WalletTransactionQueue objTQ;
                LPWalletMaster dWalletobj;

                HelperForLog.WriteLogIntoFileAsync("LPGetWalletHoldNew", "MarginTransactionWalletService", Helpers.JsonSerialize(LPObj));

                //Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
                if (LPObj.SerProID == 0 || LPObj.CoinName == string.Empty)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = LPObj.Timestamp };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetForceSingle(e => e.WalletTypeName == LPObj.CoinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
                //2019-2-18 added condi for only used trading wallet
                var dWalletobjTask = _LPWalletMaster.GetForceSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.SerProID == LPObj.SerProID);

                if (LPObj.TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, LPObj.Amount, LPObj.TrnRefNo, Helpers.UTC_To_IST(), null, 0, LPObj.CoinName, userID, LPObj.Timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, LPObj.trnType, enErrorCode.InvalidTradeRefNo);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
                if (LPObj.Amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, LPObj.Amount, LPObj.TrnRefNo, Helpers.UTC_To_IST(), null, 0, LPObj.CoinName, userID, LPObj.Timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, LPObj.trnType, enErrorCode.InvalidAmount);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
                dWalletobj = await dWalletobjTask;
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
                LPObj.WalletID = dWalletobj.Id;
                //userID = dWalletobj.UserID;
                HelperForLog.WriteLogIntoFileAsync("LPGetWalletHoldNew", "CheckUserBalance Pre sp call TrnNo=" + LPObj.TrnRefNo.ToString() + " timestamp:" + LPObj.Timestamp);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_HoldWallet(LPObj, dWalletobj);
                HelperForLog.WriteLogIntoFileAsync("LPGetWalletHoldNew", "CheckUserBalance Post sp call TrnNo=" + LPObj.TrnRefNo.ToString() + " timestamp:" + LPObj.Timestamp);
                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = LPObj.TrnNo, Status = 0, StatusMsg = bizResponse.ReturnMsg, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
                else
                {
                    // ntrivedi 12-02-2018 status message changed
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = EnResponseMessage.InternalError, TimeStamp = LPObj.Timestamp }, "LPGetWalletHoldNew");
                //throw ex;
            }
        }

        public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "MarginTransactionWalletService", Helpers.JsonSerialize(obj)));
                return obj;
            }
            catch (Exception ex)
            {
                return obj;
            }
        }

        public WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
           long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType, enErrorCode enErrorCodeObj, LPOrderType LPType = LPOrderType.LPHoldUser)
        {
            try
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
                walletTransactionQueue.IsProcessing = 0;
                walletTransactionQueue.LPType = LPType;
                walletTransactionQueue.ErrorCode = Convert.ToInt64(enErrorCodeObj);
                return walletTransactionQueue;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }



        //public BizResponseClass LPWalletChecking(long SerProID,string CoinName)
        //{
        //    BizResponseClass responseClass = new BizResponseClass ();
        //    WalletTypeMaster walletTypeMaster;

        //    try
        //    {
        //        walletTypeMaster = _WalletTypeMasterRepository.GetForceSingle(e => e.WalletTypeName == CoinName);
        //        if (walletTypeMaster == null)
        //        {
        //            responseClass.ReturnMsg = EnResponseMessage.InvalidCoinName;
        //            responseClass.ReturnCode = enResponseCode.Fail;
        //            responseClass.ErrorCode = enErrorCode.InvalidCoinName;
        //            return responseClass;
        //        }

        //        return responseClass;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);                
        //    }


        //}
    }
}
