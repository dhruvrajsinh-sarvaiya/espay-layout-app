using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels.APIConfiguration;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data
{
    public class WalletSPRepository : IWalletSPRepositories
    {

        private readonly CleanArchitectureContext _dbContext;
        private readonly CleanArchitectureContext _dbContext2;

        public WalletSPRepository(CleanArchitectureContext dbContext, CleanArchitectureContext dbContext2)
        {
            _dbContext = dbContext;
            _dbContext2 = dbContext2;
        }

        public BizResponseClass Callsp_CrDrWallet(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt32(serviceType)),
                new SqlParameter("@firstCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.Coin),
                new SqlParameter("@secondCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.Coin),
                new SqlParameter("@firstCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrWalletType) ,
                new SqlParameter("@secondCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,secondCurrWalletType) ,
                new SqlParameter("@firstCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, firstCurrObj.Amount) ,
                new SqlParameter("@secondCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, secondCurrObj.Amount) ,
                new SqlParameter("@firstCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WTQTrnNo) ,
                new SqlParameter("@secondCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WTQTrnNo) ,
                new SqlParameter("@firstCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,firstCurrObj.creditObject.TrnRefNo) ,
                new SqlParameter("@firstCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.TrnRefNo) ,
                new SqlParameter("@secondCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.TrnRefNo) ,
                new SqlParameter("@secondCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.TrnRefNo) ,
                new SqlParameter("@firstCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.WalletId) ,
                new SqlParameter("@firstCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WalletId) ,
                new SqlParameter("@secondCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.WalletId) ,
                new SqlParameter("@secondCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WalletId) ,
                new SqlParameter("@firstCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.UserID) ,
                new SqlParameter("@firstCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.UserID) ,
                new SqlParameter("@secondCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.UserID) ,
                new SqlParameter("@secondCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.UserID) ,
                new SqlParameter("@firstCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.isFullSettled) ,
                new SqlParameter("@firstCurrDrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.isFullSettled) ,
                new SqlParameter("@secondCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.isFullSettled) ,
                new SqlParameter("@secondCurrDrisFullSettledD",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.isFullSettled) ,
                new SqlParameter("@firstCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.trnType) ,
                new SqlParameter("@firstCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.trnType) ,
                new SqlParameter("@secondCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.trnType) ,
                new SqlParameter("@secondCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.trnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode) ,
            };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_CrDrWallet @timeStamp ,@serviceType ,@firstCurrCoin ,@secondCurrCoin ,@firstCurrWalletType ,@secondCurrWalletType ,@firstCurrAmount ,@secondCurrAmount ,@firstCurrDrTQTrnno  ,@secondCurrDrTQTrnno  ,@firstCurrCrTrnRefNo ,@firstCurrDrTrnRefNo ,@secondCurrCrTrnRefNo ,@secondCurrDrTrnRefNo ,@firstCurrCrWalletID ,@firstCurrDrWalletID ,@secondCurrCrWalletID ,@secondCurrDrWalletID ,@firstCurrCrUserID ,@firstCurrDrUserID, @secondCurrCrUserID ,@secondCurrDrUserID ,@firstCurrCrisFullSettled ,@firstCurrDrisFullSettled ,@secondCurrCrisFullSettled ,@secondCurrDrisFullSettledD ,@firstCurrCrTrnType ,@firstCurrDrTrnType ,@secondCurrCrTrnType ,@secondCurrDrTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_CrDrWallet", "WalletService", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[30].Value);
                bizResponseClass.ReturnMsg = @param1[31].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[32].Value);

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_HoldWallet(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, enWalletDeductionType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_HoldWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_HoldWallet", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    trnNo = Convert.ToInt64(@param1[0].Value);
                }

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_CrDrWalletForHold(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType = (long)EnAllowedChannels.Web)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt32(serviceType)),
                new SqlParameter("@firstCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.Coin),
                new SqlParameter("@secondCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.Coin),
                new SqlParameter("@firstCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrWalletType) ,
                new SqlParameter("@secondCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,secondCurrWalletType) ,
                new SqlParameter("@firstCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, firstCurrObj.Amount) ,
                new SqlParameter("@secondCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, secondCurrObj.Amount) ,
                new SqlParameter("@firstCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WTQTrnNo) ,
                new SqlParameter("@secondCurrDrTQTrnno",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WTQTrnNo) ,
                new SqlParameter("@firstCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,firstCurrObj.creditObject.TrnRefNo) ,
                new SqlParameter("@firstCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.TrnRefNo) ,
                new SqlParameter("@secondCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.TrnRefNo) ,
                new SqlParameter("@secondCurrDrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.TrnRefNo) ,
                new SqlParameter("@firstCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.WalletId) ,
                new SqlParameter("@firstCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.WalletId) ,
                new SqlParameter("@secondCurrCrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.WalletId) ,
                new SqlParameter("@secondCurrDrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.WalletId) ,
                new SqlParameter("@firstCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.UserID) ,
                new SqlParameter("@firstCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.UserID) ,
                new SqlParameter("@secondCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.UserID) ,
                new SqlParameter("@secondCurrDrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.UserID) ,
                new SqlParameter("@firstCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.isFullSettled) ,
                new SqlParameter("@firstCurrDrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.isFullSettled) ,
                new SqlParameter("@secondCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.isFullSettled) ,
                new SqlParameter("@secondCurrDrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.isFullSettled) ,
                new SqlParameter("@firstCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.creditObject.trnType) ,
                new SqlParameter("@firstCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.debitObject.trnType) ,
                new SqlParameter("@secondCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.trnType) ,
                new SqlParameter("@secondCurrDrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.trnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode) ,
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@secondCurrCrIsMaker",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.creditObject.IsMaker) ,
                new SqlParameter("@secondCurrDrIsMaker",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, secondCurrObj.debitObject.IsMaker) ,

            };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_CrDrWalletForHoldWithCharge @timeStamp ,@serviceType ,@firstCurrCoin ,@secondCurrCoin ,@firstCurrWalletType ,@secondCurrWalletType ,@firstCurrAmount ,@secondCurrAmount ,@firstCurrDrTQTrnno  ,@secondCurrDrTQTrnno  ,@firstCurrCrTrnRefNo ,@firstCurrDrTrnRefNo ,@secondCurrCrTrnRefNo ,@secondCurrDrTrnRefNo ,@firstCurrCrWalletID ,@firstCurrDrWalletID ,@secondCurrCrWalletID ,@secondCurrDrWalletID ,@firstCurrCrUserID ,@firstCurrDrUserID, @secondCurrCrUserID ,@secondCurrDrUserID ,@firstCurrCrisFullSettled ,@firstCurrDrisFullSettled ,@secondCurrCrisFullSettled ,@secondCurrDrisFullSettled ,@firstCurrCrTrnType ,@firstCurrDrTrnType ,@secondCurrCrTrnType ,@secondCurrDrTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@ChannelType,@secondCurrCrIsMaker,@secondCurrDrIsMaker", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("Callsp_CrDrWalletForHold", "WalletService", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[30].Value);
                bizResponseClass.ReturnMsg = @param1[31].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[32].Value);

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_ReleaseHoldWallet(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode) ,
            };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ReleaseHoldWalletWithCharge @TrnNo ,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ReleaseHoldWallet", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                trnNo = Convert.ToInt64(@param1[0].Value);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ReleaseHoldWallet copy", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));


                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_HoldWallet_MarketTrade(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TQTrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_HoldWallet_MarketTrade @ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TQTrnNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_HoldWallet_MarketTrade", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[11].Value);
                bizResponseClass.ReturnMsg = @param1[12].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[13].Value);
                //trnNo = Convert.ToInt64(@param1[0].Value);

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_DebitWallet(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, enWalletDeductionType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_DebitWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_DebitWallet", "WalletService", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    trnNo = Convert.ToInt64(@param1[0].Value);
                }

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_CreditWallet(WalletMaster cWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@CrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, enWalletDeductionType)

                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_CreditWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@CrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_CreditWallet", "WalletService", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(cWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    trnNo = Convert.ToInt64(@param1[0].Value);
                }

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_StakingSchemeRequest(StakingHistoryReq Req, long UserID, long WalletID, long WalletTypeID)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@StakingPolicyDetailID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Req.StakingPolicyDetailID),
                new SqlParameter("@StakingAmount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 18, 8, String.Empty, DataRowVersion.Default,Req.Amount),
                new SqlParameter("@WalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,WalletID),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, UserID),
                new SqlParameter("@ChannelID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Req.ChannelID),
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Req.DeductionAmount),
                new SqlParameter("@MaturityDate",SqlDbType.DateTime, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Req.MaturityDate) ,
                new SqlParameter("@InterestValueUser",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Req.InterestValue) ,
                new SqlParameter("@MaturityAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default,Req.MaturityAmount) ,
                new SqlParameter("@MakerCharge",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28,18, String.Empty, DataRowVersion.Default, Req.MakerCharges) ,
                new SqlParameter("@TakerCharge",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28,18, String.Empty, DataRowVersion.Default, Req.TakerCharges) ,
                new SqlParameter("@WalletTypeID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletTypeID) ,
                new SqlParameter("@EnableAutoUnstaking",SqlDbType.SmallInt, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Req.EnableAutoUnstaking) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_StakingSchemeRequest @StakingPolicyDetailID,@StakingAmount,@WalletID ,@UserID  ,@ChannelID ,@Amount ,@MaturityDate ,@InterestValueUser ,@MaturityAmount ,@MakerCharge ,@TakerCharge  ,@WalletTypeID ,@EnableAutoUnstaking ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_StakingSchemeRequest", "WalletService", "timestamp:" + Helpers.UTC_To_IST() + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));


                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[13].Value);
                bizResponseClass.ReturnMsg = @param1[14].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[15].Value);


                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_IsValidWalletTransaction(long WalletID, long UserID, long WalletTypeID, long ChannelID, long WalletTrnType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@WalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,WalletID),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,UserID),
                new SqlParameter("@WalletTypeID",SqlDbType.BigInt, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, WalletTypeID),
                new SqlParameter("@ChannelID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, ChannelID),
                new SqlParameter("@WalletTrnType",SqlDbType.BigInt, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, WalletTrnType),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_IsValidWalletTransaction @WalletID,@UserID ,@WalletTypeID,@ChannelID ,@WalletTrnType,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_IsValidWalletTransaction", "WalletService", "timestamp:" + Helpers.UTC_To_IST() + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));


                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.ReturnMsg = @param1[6].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[7].Value);


                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_UnstakingSchemeRequest(UserUnstakingReq Req, long userID, int IsReqFromAdmin)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                    new SqlParameter("@ReqFromAdmin",SqlDbType.Int,8,ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, IsReqFromAdmin),
                    new SqlParameter("@UserStakingAmount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 8, String.Empty, DataRowVersion.Default,Req.StakingAmount),
                    new SqlParameter("@NewStakingPolicyDetailID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Req.StakingPolicyDetailId),
                    new SqlParameter("@RequestID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Req.StakingHistoryId),
                    new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, userID),
                    new SqlParameter("@ChannelID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Req.ChannelID),
                    new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                    new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                    new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_UnStakingSchemeRequestPreV2 @ReqFromAdmin,@UserStakingAmount,@NewStakingPolicyDetailID,@RequestID ,@UserID  ,@ChannelID ,@ReturnCode  OUTPUT ,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_UnStakingSchemeRequest", "WalletService", "timestamp:" + Helpers.UTC_To_IST() + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));


                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[6].Value);
                bizResponseClass.ReturnMsg = @param1[7].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[8].Value);

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public sp_BalanceStatisticRes Callsp_GetWalletBalanceStatistics(long userID, int Month, int Year)
        {
            try
            {
                sp_BalanceStatisticRes bizResponseClass = new sp_BalanceStatisticRes();
                SqlParameter[] param1 = new SqlParameter[]
                {
                    new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, userID),
                    new SqlParameter("@Month",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Month),
                    new SqlParameter("@Year",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Year),

                    new SqlParameter("@StartingBalance",SqlDbType.Decimal, 28, ParameterDirection.Output, false, 28,18, String.Empty, DataRowVersion.Default, bizResponseClass.StartingBalance) ,
                    new SqlParameter("@EndingBalance",SqlDbType.Decimal, 28, ParameterDirection.Output, false, 28, 18, String.Empty, DataRowVersion.Default, bizResponseClass.EndingBalance) ,

                    new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                    new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                    new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_GetWalletBalanceStatisticstemp @UserID ,@Month ,@Year,@StartingBalance  OUTPUT ,@EndingBalance  OUTPUT ,@ReturnCode  OUTPUT ,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_GetWalletBalanceStatisticstemp", "WalletService", "timestamp:" + Helpers.UTC_To_IST() + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                bizResponseClass.StartingBalance = Convert.ToDecimal(@param1[3].Value);
                bizResponseClass.EndingBalance = Convert.ToDecimal(@param1[4].Value);
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.ReturnMsg = @param1[6].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[7].Value);

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_HoldWalletFinal(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, enWalletDeductionType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_HoldWalletFinal @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_HoldWalletFinal", "WalletSPRepository", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    trnNo = Convert.ToInt64(@param1[0].Value);
                }
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_HoldWalletFinal again", "WalletSPRepository", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_DepositionProcess(ref long TrnNo, EnAllowedChannels channelType, string timeStamp, string WalletType, enWalletTrnType walletTrnType, decimal Amount, long TrnRefNo)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timeStamp),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType),
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Amount) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_DepositionProcess @TrnNo output,@ChannelType ,@timeStamp,@Coin,@TrnRefNo,@WalletTrnType,@Amount,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_DepositionProcess", "WalletService", "timestamp:" + timeStamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[7].Value);
                bizResponseClass.ReturnMsg = @param1[8].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[9].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    TrnNo = Convert.ToInt64(@param1[0].Value);
                }
                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public WalletTrnLimitResponse Callsp_CheckWalletTranLimit(short TrnType, long WalletID, decimal Amount,long TrnNo=0)
        {
            try
            {
                WalletTrnLimitResponse bizResponseClass = new WalletTrnLimitResponse();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@ITrntype",SqlDbType.SmallInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnType),
                new SqlParameter("@IWalletId",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,WalletID),
                new SqlParameter("@IAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Amount) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@MinimumAmounts",SqlDbType.VarChar, 50, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.MinimumAmounts) ,
                new SqlParameter("@MaximumAmounts",SqlDbType.VarChar, 50, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.MaximumAmounts),
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnNo),
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_CheckWalletTranLimitTemp @ITrntype, @IWalletId ,@IAmount,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT, @MinimumAmounts OUTPUT, @MaximumAmounts OUTPUT,@TrnNo", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_CheckWalletTranLimit", "WalletService", " ReturnCode:" + @param1[3].Value.ToString() + " ReturnMsg:" + @param1[4].Value.ToString() + " ErrorCode :" + @param1[5].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[3].Value);
                bizResponseClass.ReturnMsg = @param1[4].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.MinimumAmounts = param1[6].Value.ToString();
                bizResponseClass.MaximumAmounts = param1[7].Value.ToString();
                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass CallSP_InsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD")
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnDate",SqlDbType.DateTime, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnDate),
                new SqlParameter("@CurrencyName",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,CurrencyName),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };
                var res = _dbContext.Database.ExecuteSqlCommand("SP_InsertUpdateProfit @TrnDate, @CurrencyName,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("SP_InsertUpdateProfit", "WalletService", " ReturnCode:" + @param1[2].Value.ToString() + " ReturnMsg:" + @param1[3].Value.ToString() + " ErrorCode :" + @param1[4].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[2].Value);
                bizResponseClass.ReturnMsg = @param1[3].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[4].Value);
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass CallSP_ArbitrageInsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD")
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnDate",SqlDbType.DateTime, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnDate),
                new SqlParameter("@CurrencyName",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,CurrencyName),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };
                var res = _dbContext.Database.ExecuteSqlCommand("SP_ArbitrageInsertUpdateProfit @TrnDate, @CurrencyName,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("SP_ArbitrageInsertUpdateProfit", "WalletService", " ReturnCode:" + @param1[2].Value.ToString() + " ReturnMsg:" + @param1[3].Value.ToString() + " ErrorCode :" + @param1[4].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[2].Value);
                bizResponseClass.ReturnMsg = @param1[3].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[4].Value);
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass CallSP_ConvertFundWalletOperation(string CrCurr, string DrCurr, decimal CrAmt, decimal DrAmt, long UserID, long TrnNo, int channelType, string timeStamp, int serviceType, int walletTrnType, int IsUseDefaultWallet = 1)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@CrCurr",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,CrCurr),
                new SqlParameter("@DrCurr",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,DrCurr),
                new SqlParameter("@CrAmt",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, CrAmt),
                new SqlParameter("@DrAmt",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, DrAmt),
                new SqlParameter("@IsUseDefaultWallet",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, IsUseDefaultWallet),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID),
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnNo),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timeStamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ConvertFundWalletOperation @CrCurr,@DrCurr,@CrAmt,@DrAmt,@IsUseDefaultWallet,@UserID,@TrnNo,@ChannelType,@timeStamp,@serviceType,@WalletTrnType,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT ", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ConvertFundWalletOperation", "WalletService", " ReturnCode:" + @param1[11].Value.ToString() + " ReturnMsg:" + @param1[12].Value.ToString() + " ErrorCode :" + @param1[13].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[11].Value);
                bizResponseClass.ReturnMsg = @param1[12].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[13].Value);
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return (new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        //rita 16-4-19 added for margin site token conversion
        public BizResponseClass CallSP_MarginConvertFundWalletOperation(string CrCurr, string DrCurr, decimal CrAmt, decimal DrAmt, long UserID, long TrnNo, int channelType, string timeStamp, int serviceType, int walletTrnType, long PairID, decimal BidPrice, ref string CreditAccoutID, ref string DebitAccoutID, int IsUseDefaultWallet = 1)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@CrCurr",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,CrCurr),
                new SqlParameter("@DrCurr",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,DrCurr),
                new SqlParameter("@CrAmt",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, CrAmt),
                new SqlParameter("@DrAmt",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, DrAmt),
                new SqlParameter("@IsUseDefaultWallet",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, IsUseDefaultWallet),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID),
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnNo),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timeStamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode),
                new SqlParameter("@PairID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, PairID),
                new SqlParameter("@BidPrice",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, BidPrice),
                new SqlParameter("@CreditAccoutID",SqlDbType.VarChar, 20, ParameterDirection.Output, false, 28, 18, String.Empty, DataRowVersion.Default, CreditAccoutID),
                new SqlParameter("@DebitAccoutID",SqlDbType.VarChar, 20, ParameterDirection.Output, false, 28, 18, String.Empty, DataRowVersion.Default, DebitAccoutID),
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_MarginConvertFundWalletOperation @CrCurr,@DrCurr,@CrAmt,@DrAmt,@IsUseDefaultWallet,@UserID,@TrnNo,@ChannelType,@timeStamp,@serviceType,@WalletTrnType,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT,@PairID,@BidPrice,@CreditAccoutID OUTPUT,@DebitAccoutID OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_MarginConvertFundWalletOperation", "WalletService", " ReturnCode:" + @param1[11].Value.ToString() + " ReturnMsg:" + @param1[12].Value.ToString() + " ErrorCode :" + @param1[13].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[11].Value);
                bizResponseClass.ReturnMsg = @param1[12].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[13].Value);
                CreditAccoutID = @param1[16].Value.ToString();
                DebitAccoutID = @param1[17].Value.ToString();
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return (new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        public BizResponseClass CallSP_DepositionRecon(long TrnNo, DepositionReconReq request, long UserId)
        {
            try
            {
                string timestamp = Helpers.GetTimeStamp();
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnNo),
                new SqlParameter("@ActionType",SqlDbType.VarChar, 5, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,request.ActionType),
                new SqlParameter("@ActionBy",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserId),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@ActionRemarks",SqlDbType.VarChar, 100, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, request.ActionRemarks),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 1000, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_DepositionRecon @TrnNo,@ActionType,@ActionBy,@timeStamp,@ActionRemarks,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT ", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_DepositionRecon", "WalletService", " ReturnCode:" + @param1[5].Value.ToString() + " ReturnMsg:" + @param1[6].Value.ToString() + " ErrorCode :" + @param1[7].Value.ToString()));

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.ReturnMsg = @param1[6].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[7].Value);
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return (new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }

        public sp_APIPlanDepositProcessResponse Callsp_APIPlanDepositProcess(long UserID, long ServiceID, short ChannelID, decimal Amount, long TrnRefNo, short TrnType)
        {
            sp_APIPlanDepositProcessResponse _Res = new sp_APIPlanDepositProcessResponse();
            try
            {
                //sp_APIPlanDepositProces
                string timestamp = Helpers.GetTimeStamp();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(ChannelID)),
                new SqlParameter("@Amount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Amount),
                new SqlParameter("@ServiceID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,ServiceID),
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo),
                new SqlParameter("@WalletTrnType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(TrnType)),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, _Res.ReturnCode),
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 1000, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, _Res.ReturnMsg),
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, _Res.ErrorCode),
                new SqlParameter("@AccWalletId",SqlDbType.VarChar, 50, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, _Res.AccountID),
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_APIPlanDepositProcess @timeStamp,@ChannelType,@Amount,@ServiceID,@TrnRefNo,@WalletTrnType,@UserID,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT,@AccWalletId OUTPUT", param1);

                _Res.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[7].Value);
                _Res.ReturnMsg = @param1[8].Value.ToString();
                _Res.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[9].Value);
                _Res.AccountID = @param1[10].Value.ToString();

                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return (new sp_APIPlanDepositProcessResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }


        // khushali 23-03-2019 For Success and Debit Reocn Process

        public BizResponseClass Callsp_ReconSuccessAndDebitWalletWithCharge(WalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, Convert.ToInt32(serviceType)),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, coin),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletType) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletID) ,
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, UserID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, TrnType) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, walletTrnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, enWalletDeductionType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ReconSuccessAndDebitWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ReconSuccessAndDebitWalletWithCharge", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                try
                {
                    _dbContext.Entry(dWalletobj).Reload();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[12].Value);
                bizResponseClass.ReturnMsg = @param1[13].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[14].Value);
                if (bizResponseClass.ReturnCode == enResponseCode.Success)
                {
                    trnNo = Convert.ToInt64(@param1[0].Value);
                }

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_ReferCommissionSignUp(long CronRefNo, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                string timestamp = Helpers.GetTimeStamp();
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@CronRefNo ",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,CronRefNo),
                new SqlParameter("@FromDate",SqlDbType.DateTime, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,FromDate),
                new SqlParameter("@ToDate",SqlDbType.DateTime, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, ToDate),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 1000, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                };

                _dbContext2.Database.SetCommandTimeout(TimeSpan.FromMinutes(4));
                var res = _dbContext2.Database.ExecuteSqlCommand("sp_ReferCommissionSignUp @CronRefNo,@FromDate,@ToDate,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT ", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ReferCommissionSignUp", "WalletService", " ReturnCode:" + @param1[3].Value.ToString() + " ReturnMsg:" + @param1[4].Value.ToString() + " ErrorCode :" + @param1[5].Value.ToString()));

                //var res1 = _dbContext.Database.ExecuteSqlCommand("sp_ReferCommissionSignUp @CronRefNo,@FromDate,@ToDate,@ReturnCode OUTPUT,@ReturnMsg OUTPUT,@ErrorCode OUTPUT ", param1);

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[3].Value);
                bizResponseClass.ReturnMsg = @param1[4].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[5].Value);
                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return (new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
    }
}
