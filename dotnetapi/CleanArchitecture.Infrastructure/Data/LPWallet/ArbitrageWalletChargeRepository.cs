using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.LPWallet
{
    public class ArbitrageWalletChargeRepository : IArbitrageWalletChargeRepository
    {
        private readonly CleanArchitectureContext _dbContext;

        public ArbitrageWalletChargeRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ProviderWalletLedgerRes> GetArbitrageProviderWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount)
        {
            try
            {
                List<ProviderWalletLedgerRes> wl = (from w in _dbContext.LPArbitrageWalletLedger
                                                          where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                            orderby w.Id ascending
                                            select new ProviderWalletLedgerRes
                                            {
                                                LedgerId = w.Id,
                                                PreBal = w.PreBal,
                                                PostBal = w.PreBal,
                                                Remarks = "Opening Balance",
                                                Amount = 0,
                                                CrAmount = 0,
                                                DrAmount = 0,
                                                TrnDate = w.TrnDate
                                            }).Take(1).Union((from w in _dbContext.LPArbitrageWalletLedger
                                                              where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                                              orderby w.Id ascending
                                                              select new ProviderWalletLedgerRes
                                                              {
                                                                  LedgerId = w.Id,
                                                                  PreBal = w.PreBal,
                                                                  PostBal = w.PostBal,
                                                                  Remarks = w.Remarks,
                                                                  Amount = w.CrAmt > 0 ? w.CrAmt : w.DrAmt,
                                                                  CrAmount = w.CrAmt,
                                                                  DrAmount = w.DrAmt,
                                                                  TrnDate = w.TrnDate
                                                              })).ToList();

                TotalCount = wl.Count();
                if (page > 0)
                {
                    int skip = PageSize * (page - 1);
                    wl = wl.Skip(skip).Take(PageSize).ToList();
                }
                decimal DrAmount = 0, CrAmount = 0, Amount = 0;
                wl.ForEach(e =>
                {
                    Amount = e.PreBal + e.CrAmount - e.DrAmount;
                    e.PostBal = Amount;
                    e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;

                });
                return wl;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ChargeConfigurationDetailArbitrageRes GetChargeConfigDetailbyId(long detailID)
        {
            try
            {
                string Query = "SELECT CD.Id AS ChargeConfigDetailId,CD.ChargeConfigurationMasterID,CD.ChargeDistributionBasedOn," +
                    "CASE CD.ChargeDistributionBasedOn WHEN 1 THEN 'Regular' WHEN 2 THEN 'Volume' WHEN 3 THEN 'DayEndBalance' ELSE 'Unknown' END AS 'StrChargeDistributionBasedOn'," +
                    "CD.ChargeType,CASE CD.ChargeType WHEN 1 THEN 'Regular' WHEN 2 THEN 'Recurring' ELSE 'Unknown' END AS 'StrChargeType'," +
                    "CD.DeductionWalletTypeId,WT.WalletTypeName,CD.ChargeValue," +
                    "CD.ChargeValueType,CASE CD.ChargeValueType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Percentage' ELSE 'Unknown' END AS 'StrChargeValueType' ," +
                    "CD.MakerCharge,CD.TakerCharge,CD.MinAmount,CD.MaxAmount,CD.Remarks,CD.Status," +
                    "CASE CD.Status WHEN 0 THEN 'Inactive' WHEN 1 THEN 'Active' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ChargeConfigurationDetailArbitrage CD " +
                    "INNER JOIN ArbitrageWalletTypeMaster WT ON CD.DeductionWalletTypeId = WT.ID " +
                    "WHERE CD.Status < 9 AND CD.Id = {0}";
                var data = _dbContext.ChargeConfigurationDetailArbitrageRes.FromSql(Query, detailID);
                return data.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ChargeConfigurationDetailArbitrageRes> GetChargeConfigDetailList(long? masterId, long? chargeType, short? chargeValueType, short? chargeDistributionBasedOn, short? status)
        {
            try
            {
                string Query = "SELECT CD.Id AS ChargeConfigDetailId,CD.ChargeConfigurationMasterID,CD.ChargeDistributionBasedOn," +
                    "CASE CD.ChargeDistributionBasedOn WHEN 1 THEN 'Regular' WHEN 2 THEN 'Volume' WHEN 3 THEN 'DayEndBalance' ELSE 'Unknown' END AS 'StrChargeDistributionBasedOn'," +
                    "CD.ChargeType,CASE CD.ChargeType WHEN 1 THEN 'Regular' WHEN 2 THEN 'Recurring' ELSE 'Unknown' END AS 'StrChargeType'," +
                    "CD.DeductionWalletTypeId,WT.WalletTypeName,CD.ChargeValue," +
                    "CD.ChargeValueType,CASE CD.ChargeValueType WHEN 1 THEN 'Fixed' WHEN 2 THEN 'Percentage' ELSE 'Unknown' END AS 'StrChargeValueType' ," +
                    "CD.MakerCharge,CD.TakerCharge,CD.MinAmount,CD.MaxAmount,CD.Remarks,CD.Status," +
                    "CASE CD.Status WHEN 0 THEN 'Inactive' WHEN 1 THEN 'Active' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ChargeConfigurationDetailArbitrage CD " +
                    "INNER JOIN ArbitrageWalletTypeMaster WT ON CD.DeductionWalletTypeId = WT.ID " +
                    "WHERE CD.Status < 9 AND (CD.ChargeConfigurationMasterID = {0} OR {0}=0) AND (CD.ChargeType = {1} OR {1}=0) AND (CD.ChargeValueType = {2} OR {2}=0) AND (CD.Status={3} OR {3}=999) AND (CD.ChargeDistributionBasedOn={4} OR {4}=0)";
                var data = _dbContext.ChargeConfigurationDetailArbitrageRes.FromSql(Query, Convert.ToInt64(masterId == null ? 0 : masterId), Convert.ToInt64(chargeType == null ? 0 : chargeType), Convert.ToInt16(chargeValueType == null ? 0 : chargeValueType), Convert.ToInt16(status == null ? 999 : status), Convert.ToInt16(chargeDistributionBasedOn == null ? 0 : chargeDistributionBasedOn));
                return data.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ArbitrageChargeConfigurationMasterRes> ListArbitrageChargeConfigurationMaster(long? WalletTypeId, long? SerProId, long? PairID)
        {
            try
            {
                var Query = "SELECT ACCM.Id,ACCM.Status,CASE ACCM.Status When 1 Then 'Enabled' Else 'Disabled' END as 'StrStatus',IsNULL(AWTP.Id,0) as 'WalletTypeID',ISNULL(AWTP.WalletTypeName,'') as 'WalletTypeName',IsNull(TPM.Id,0) as 'PairID',IsNull(TPM.PairName,'') as 'PairName',SPMA.Id as 'SerProID',SPMA.ProviderName,ACCM.TrnType,IsNULL(TTM.TrnTypeName,'') as 'TrnTypeName',ACCM.KYCComplaint,ACCM.Remarks FROM ArbitrageChargeConfigurationMaster ACCM LEFT JOIN TrnTypeMaster TTM On TTM.TrntypeID=ACCM.TrnType LEFT JOIN ArbitrageWalletTypeMaster AWTP on AWTP.Id=ACCM.WalletTypeID LEFT JOIN TradePairMasterArbitrage TPM ON TPM.Id = ACCM.PairId Inner Join ServiceProviderMasterArbitrage SPMA On SPMA.Id=ACCM.SerProId WHERE (ACCM.WalletTypeID={0} OR {0}=0)  AND (ACCM.SerProID={1} OR {1}=0) AND (ACCM.PairId={2} OR {2}=0)";
                var data = _dbContext.ListArbitrageChargeConfigurationMasterRes.FromSql(Query, (WalletTypeId == null ? 0 : WalletTypeId), (SerProId == null ? 0 : SerProId), (PairID == null ? 0 : PairID)).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public List<ChargeConfigurationMasterArbitrageRes> ListChargeConfigurationMasterArbitrage(long? WalletTypeId)
        {
            try
            {
                var Query = "SELECT ACCM.Id,ACCM.Status,CASE ACCM.Status When 1 Then 'Enabled' Else 'Disabled' END as 'StrStatus',AWTP.Id as 'WalletTypeID',AWTP.WalletTypeName as 'WalletTypeName',ACCM.TrnType as 'TrnType',TTM.TrnTypeName as 'TrnTypeName',ACCM.KYCComplaint,ACCM.SlabType,CASE ACCM.SlabType When 1 Then 'Fixed' Else 'Range' End AS 'SlabTypeName',ACCM.SpecialChargeConfigurationID,ACCM.Remarks FROM ChargeConfigurationMasterArbitrage ACCM LEFT JOIN WTrnTypeMaster TTM On TTM.TrntypeID=ACCM.TrnType LEFT JOIN ArbitrageWalletTypeMaster AWTP on AWTP.Id=ACCM.WalletTypeID WHERE (ACCM.WalletTypeID={0} OR {0}=0)";
                var data = _dbContext.ListChargeConfigurationMasterArbitrageRes.FromSql(Query, (WalletTypeId == null ? 0 : WalletTypeId)).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public List<ProviderWalletRes> ListProviderWallet(short? Status, long? SerProId, string SMSCode)
        {
            try
            {
                var Query = "Select AWTM.Id as WalletTypeID,AWTM.WalletTypeName as 'WalletTypeIDName',PWL.WalletName,PWL.AccWalletID,PWL.Balance,PWL.OutBoundBalance,PWL.InBoundBalance,PWL.SerProID,SPMA.ProviderName as 'SerProIdName',PWL.Status,CASE PWL.Status When 1 Then 'Enabled' Else 'Disabled' End as 'StrStatus' from LPArbitrageWalletMaster PWL Inner Join ArbitrageWalletTypeMaster AWTM On AWTM.Id = PWL.WalletTypeID Inner Join ServiceProviderMasterArbitrage SPMA On SPMA.Id = PWL.SerProID WHERE (PWL.Status={0} OR {0}=0)  AND (PWL.SerProID={1} OR {1}=0) AND (AWTM.WalletTypeName={2} OR {2}='')";
                var data = _dbContext.ProviderWalletRes.FromSql(Query, Status, SerProId, SMSCode).ToList();
                return data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListArbitrageWalletMaster", "ArbitrageWalletRepository", ex);
                throw ex;
            }
        }
    }
}
