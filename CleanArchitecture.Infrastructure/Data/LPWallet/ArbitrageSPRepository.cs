using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels.Wallet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace CleanArchitecture.Infrastructure.Data
{
    public class ArbitrageSPRepository : IArbitrageSPRepositories
    {
        private readonly CleanArchitectureContext _dbContext;

        public ArbitrageSPRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        public BizResponseClass sp_CreateMarginWallet(string SMSCode, long UserId)
        {
            try
            {
                BizResponseClass Res = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,UserId),
                new SqlParameter("@SMSCode",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,SMSCode),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("SP_ArbitrageCreateWallet @UserID,@SMSCode,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("SP_ArbitrageCreateWallet", "ArbitrageSPRepository", " ReturnCode:" + @param1[2].Value.ToString() + " ReturnMsg:" + @param1[3].Value.ToString() + " ErrorCode :" + @param1[4].Value.ToString()));

                Res.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[2].Value);
                Res.ReturnMsg = @param1[3].Value.ToString();
                Res.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[4].Value);
                return Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public BizResponseClass Callsp_ArbitrageHoldWallet(LPHoldDr lPHoldDr, LPArbitrageWalletMaster dWalletobj)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@TrnNo",SqlDbType.BigInt, 10, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default,0),
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,EnAllowedChannels.Web),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.Timestamp),
                new SqlParameter("@serviceType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, 0),
                new SqlParameter("@Coin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.CoinName),
                new SqlParameter("@WalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, 0) ,
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, lPHoldDr.Amount) ,
                new SqlParameter("@TrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,lPHoldDr.TrnRefNo) ,
                new SqlParameter("@DrWalletID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.WalletID) ,
                new SqlParameter("@SerProID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.SerProID) ,
                new SqlParameter("@TrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, 1) ,
                new SqlParameter("@WalletTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.trnType) ,
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)  ,
                new SqlParameter("@WalletDeductionType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, lPHoldDr.enWalletDeductionType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageLPHoldWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@SerProID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageLPHoldWalletWithCharge", "ArbitrageSPRepository", "timestamp:" + lPHoldDr.Timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

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
                    lPHoldDr.TrnNo = Convert.ToInt64(@param1[0].Value);
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

        public BizResponseClass Callsp_HoldWallet(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType)
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
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageHoldWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageHoldWalletWithCharge", "WalletService", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

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

        public BizResponseClass Callsp_ReleaseHoldWallet(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo)
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
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageReleaseHoldWalletWithCharge @TrnNo ,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageReleaseHoldWalletWithCharge", "ArbitrageSPRepository", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

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


                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_ArbitrageCrDrWalletForHold(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType = (long)EnAllowedChannels.Web)
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
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageCrDrWalletForHoldWithCharge @timeStamp ,@serviceType ,@firstCurrCoin ,@secondCurrCoin ,@firstCurrWalletType ,@secondCurrWalletType ,@firstCurrAmount ,@secondCurrAmount ,@firstCurrDrTQTrnno  ,@secondCurrDrTQTrnno  ,@firstCurrCrTrnRefNo ,@firstCurrDrTrnRefNo ,@secondCurrCrTrnRefNo ,@secondCurrDrTrnRefNo ,@firstCurrCrWalletID ,@firstCurrDrWalletID ,@secondCurrCrWalletID ,@secondCurrDrWalletID ,@firstCurrCrUserID ,@firstCurrDrUserID, @secondCurrCrUserID ,@secondCurrDrUserID ,@firstCurrCrisFullSettled ,@firstCurrDrisFullSettled ,@secondCurrCrisFullSettled ,@secondCurrDrisFullSettled ,@firstCurrCrTrnType ,@firstCurrDrTrnType ,@secondCurrCrTrnType ,@secondCurrDrTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@ChannelType,@secondCurrCrIsMaker,@secondCurrDrIsMaker", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageCrDrWalletForHoldWithCharge", "ArbitrageSPREpositiory", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));
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

        public FundTransferResponse Callsp_CreditArbitrageProviderInitialBalance(ProviderFundTransferRequest Request)
        {
            try
            {
                FundTransferResponse bizResponseClass = new FundTransferResponse();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@ProviderId",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Request.ServiceProviderId),
                new SqlParameter("@WalletTypeName",SqlDbType.VarChar, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.CurrencyName),
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Request.Amount),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_CreditArbitrageProviderInitialBalance @ProviderId, @Amount ,@WalletTypeName  ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
              
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[3].Value);
                bizResponseClass.ReturnMsg = @param1[4].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[5].Value);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageLPHoldWalletWithCharge", "ArbitrageSPRepository", " ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass Callsp_LPArbitrageCrDrWalletForHold(ArbitrageCommonClassCrDr firstCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType = (long)EnAllowedChannels.Web)
        {
            try
            {
                BizResponseClass bizResponseClass = new BizResponseClass();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@SerProID",SqlDbType.BigInt, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.SerProID),
                new SqlParameter("@timeStamp",SqlDbType.VarChar, 50, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default, timestamp),
                new SqlParameter("@serviceType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt32(serviceType)),
                new SqlParameter("@firstCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.Coin),
                new SqlParameter("@HoldCurrCoin",SqlDbType.VarChar, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.HoldCoin),
                new SqlParameter("@firstCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrWalletType) ,
                new SqlParameter("@holdCurrWalletType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,secondCurrWalletType) ,
                new SqlParameter("@firstCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, firstCurrObj.Amount) ,
                new SqlParameter("@HoldCurrAmount",SqlDbType.Decimal, 28, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, firstCurrObj.HoldAmount) ,                
                new SqlParameter("@firstCurrCrTrnRefNo",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,firstCurrObj.TrnRefNo) ,
                new SqlParameter("@firstCurrCrUserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,firstCurrObj.UserID) ,
                new SqlParameter("@firstCurrCrisFullSettled",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.isFullSettled) ,               
                new SqlParameter("@firstCurrCrTrnType",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.trnType) ,              
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode) ,
                new SqlParameter("@ChannelType",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,Convert.ToInt64(channelType)),
                new SqlParameter("IsMaker",SqlDbType.Int, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, firstCurrObj.IsMaker)             

            };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_LPArbitrageCrDrWalletForHoldWithCharge @SerProID,@timeStamp ,@serviceType ,@firstCurrCoin ,@HoldCurrCoin ,@firstCurrWalletType ,@holdCurrWalletType ,@firstCurrAmount ,@HoldCurrAmount  ,@firstCurrCrTrnRefNo ,@firstCurrCrUserID ,@firstCurrCrisFullSettled ,@firstCurrCrTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@ChannelType,@IsMaker", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_LPArbitrageCrDrWalletForHoldWithCharge", "ArbitrageSPREpositiory", "timestamp:" + timestamp + " ,ReturnCode" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));
                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[13].Value);
                bizResponseClass.ReturnMsg = @param1[14].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[15].Value);

                return bizResponseClass;
                //return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public FundTransferResponse Call_sp_ArbitrageWalletFundTransfer(FundTransferRequest Request, long UserId)
        {
            try
            {
                FundTransferResponse bizResponseClass = new FundTransferResponse();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@UserId",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,UserId),
                 new SqlParameter("@DebitAccWalletId",SqlDbType.VarChar, 70, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.DebitAccWalletId),
                  new SqlParameter("@CreditAccWalletId",SqlDbType.VarChar, 70, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.CreditAccWalletId),
                
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Request.Amount),
                new SqlParameter("@WalletTypeName",SqlDbType.VarChar, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.CurrencyName),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageWalletFundTransfer @UserId, @DebitAccWalletId,@CreditAccWalletId ,@Amount,@WalletTypeName  ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.ReturnMsg = @param1[6].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[7].Value);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageWalletFundTransfer", "ArbitrageSPRepository", " ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public BizResponseClass Callsp_HoldWallet_MarketTrade(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, enWalletDeductionType enWalletDeductionType)
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
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageHoldWallet_MarketTrade @ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TQTrnNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageHoldWallet_MarketTrade", "ArbitrageSPRepository", "timestamp:" + timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

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

        public FundTransferResponse Call_sp_ArbitrageToTradingWalletFundTransfer(FundTransferRequest Request, long UserId)
        {
            try
            {
                FundTransferResponse bizResponseClass = new FundTransferResponse();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@UserId",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,UserId),
                 new SqlParameter("@DebitAccWalletId",SqlDbType.VarChar, 70, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.DebitAccWalletId),
                  new SqlParameter("@CreditAccWalletId",SqlDbType.VarChar, 70, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.CreditAccWalletId),
                new SqlParameter("@Amount",SqlDbType.Decimal, 18, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Request.Amount),
                new SqlParameter("@WalletTypeName",SqlDbType.VarChar, 10, ParameterDirection.Input,false, 0, 0, String.Empty, DataRowVersion.Default,Request.CurrencyName),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 100, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, bizResponseClass.ErrorCode)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_ArbitrageToTradingWalletFundTransfer @UserId, @DebitAccWalletId,@CreditAccWalletId ,@Amount,@WalletTypeName  ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT", param1);

                bizResponseClass.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[5].Value);
                bizResponseClass.ReturnMsg = @param1[6].Value.ToString();
                bizResponseClass.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[7].Value);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_ArbitrageToTradingWalletFundTransfer", "ArbitrageSPRepository", " ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

                return bizResponseClass;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public List<WalletType> GetArbitrageChargeWalletType(long? id)
        {
            try
            {
                var _WalletType = (from w in _dbContext.ChargeConfigurationMasterArbitrage
                                   join wt in _dbContext.ArbitrageWalletTypeMaster
                                   on w.WalletTypeID equals wt.Id
                                   where wt.Status == 1 && (id == null || (w.WalletTypeID == id && id != null))
                                   group w by new { w.WalletTypeID, wt.WalletTypeName } into g
                                   select new WalletType { WalletTypeId = g.Key.WalletTypeID, WalletTypeName = g.Key.WalletTypeName }).ToList();

                return _WalletType;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public List<ChargesTypeWise> ListArbitrageChargesTypeWise(long WalletTypeId, long? TrntypeId)
        {
            List<ChargesTypeWise> Resp = new List<ChargesTypeWise>();
            try
            {
                var ChargeData = _dbContext.ChargesTypeWise.FromSql("SELECT cd.ChargeValue,wtm.WalletTypeName as DeductWalletTypeName,wt.TrnTypeName, cd.MakerCharge, cd.TakerCharge, wt.TrnTypeId FROM ChargeConfigurationDetailArbitrage cd inner join ChargeConfigurationMasterArbitrage cm ON cm.id = cd.ChargeConfigurationMasterID INNER JOIN WTrnTypeMaster wt ON wt.TrnTypeId = cm.TrnType inner join WalletTypemasters wtm on wtm.id = cd.DeductionWalletTypeId WHERE cm.TrnType in (3, 8,9) AND cd.Status = 1 AND cm.Status = 1 AND cm.WalletTypeID ={0} and(cm.TrnType ={1} or {1}= 0)", WalletTypeId, (TrntypeId == null ? 0 : Convert.ToInt64(TrntypeId))).ToList();

                return ChargeData;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }
    }
}
