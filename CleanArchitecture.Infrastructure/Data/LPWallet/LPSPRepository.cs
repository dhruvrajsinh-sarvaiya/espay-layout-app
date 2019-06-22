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

namespace CleanArchitecture.Infrastructure.Data
{
    public class LPSPRepository : ILPSPRepositories
    {
        private readonly CleanArchitectureContext _dbContext;

        public LPSPRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        public GetMemberBalRes Callsp_LPGetMemberBalance(long walletID, long UserID, long WalletMasterID, short BalanceType, decimal Amount, int WalletUsageType)
        {
            try
            {
                GetMemberBalRes Res = new GetMemberBalRes();
                SqlParameter[] param1 = new SqlParameter[]{
                new SqlParameter("@WalletID",SqlDbType.BigInt, 10, ParameterDirection.InputOutput, false, 0, 0, String.Empty, DataRowVersion.Default,walletID),
                new SqlParameter("@UserID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,UserID),
                new SqlParameter("@WalletMasterID",SqlDbType.BigInt, 10, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default,WalletMasterID),
                new SqlParameter("@WalletBalance",SqlDbType.Decimal, 10, ParameterDirection.Output, false, 28, 18, String.Empty, DataRowVersion.Default,Res.WalletBalance),
                new SqlParameter("@WalletOutboundBalance",SqlDbType.Decimal, 10, ParameterDirection.Output, false,28,18,String.Empty, DataRowVersion.Default,Res.WalletOutboundBalance),
                new SqlParameter("@WalletInboundBalance",SqlDbType.Decimal, 10, ParameterDirection.Output, false,28,18,String.Empty, DataRowVersion.Default,Res.WalletInboundBalance),
                new SqlParameter("@ReturnCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ReturnCode) ,
                new SqlParameter("@ReturnMsg",SqlDbType.VarChar, 500, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ReturnMsg) ,
                new SqlParameter("@ErrorCode",SqlDbType.Int, 8, ParameterDirection.Output, false, 0, 0, String.Empty, DataRowVersion.Default, Res.ErrorCode),
                new SqlParameter("@BalanceType",SqlDbType.SmallInt, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, BalanceType),
                new SqlParameter("@Amount",SqlDbType.Decimal, 12, ParameterDirection.Input, false, 28, 18, String.Empty, DataRowVersion.Default, Amount),
                new SqlParameter("@WalletUsageType",SqlDbType.SmallInt, 8, ParameterDirection.Input, false, 0, 0, String.Empty, DataRowVersion.Default, WalletUsageType)
                };
                var res = _dbContext.Database.ExecuteSqlCommand("sp_LPGetMemberBalance @WalletID OUTPUT,@UserID,@WalletMasterID,@WalletBalance OUTPUT,@WalletOutboundBalance OUTPUT,@WalletInboundBalance OUTPUT,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@BalanceType,@Amount,@WalletUsageType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_LPGetMemberBalance", "LPSPRepository", " ReturnCode:" + @param1[6].Value.ToString() + " ReturnMsg:" + @param1[7].Value.ToString() + " ErrorCode :" + @param1[8].Value.ToString()));

                Res.WalletID = Convert.ToInt64(@param1[0].Value);
                Res.WalletBalance = Convert.ToDecimal(@param1[3].Value);
                Res.WalletOutboundBalance = Convert.ToDecimal(@param1[4].Value);
                Res.WalletInboundBalance = Convert.ToDecimal(@param1[5].Value);
                Res.ReturnCode = (enResponseCode)Convert.ToInt32(@param1[6].Value);
                Res.ReturnMsg = @param1[7].Value.ToString();
                Res.ErrorCode = (enErrorCode)Convert.ToInt32(@param1[8].Value);
                return Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass Callsp_HoldWallet(LPHoldDr lPHoldDr,LPWalletMaster dWalletobj)
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
                var res = _dbContext.Database.ExecuteSqlCommand("sp_LPHoldWalletWithCharge @TrnNo output,@ChannelType ,@timeStamp  ,@serviceType ,@Coin ,@WalletType ,@Amount ,@TrnRefNo ,@DrWalletID ,@UserID  ,@TrnType ,@WalletTrnType ,@ReturnCode  OUTPUT,@ReturnMsg OUTPUT , @ErrorCode  OUTPUT,@WalletDeductionType", param1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("sp_LPMarginHoldWallet", "LPSPRepository", "timestamp:" + lPHoldDr.Timestamp + " ,ReturnCode=" + bizResponseClass.ReturnCode + ",Message=" + bizResponseClass.ReturnMsg + ",ErrorCode=" + bizResponseClass.ErrorCode));

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
    }
}
