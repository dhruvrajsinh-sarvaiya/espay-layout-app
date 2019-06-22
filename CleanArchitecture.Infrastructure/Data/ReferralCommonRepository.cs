using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Referral;
using CleanArchitecture.Core.ViewModels.Referral;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Infrastructure.Data
{
    public class ReferralCommonRepository : IReferralCommonRepo
    {
        private readonly CleanArchitectureContext _dbContext;

        public ReferralCommonRepository(CleanArchitectureContext dbContext)
        {            
            _dbContext = dbContext;
        }

        public ReferralSchemeTypeMappingRes GetByIdMappingData(long id)
        {
            try
            {
                string Query = "SELECT TM.Id,TM.PayTypeId,PT.PayTypeName,TM.ServiceTypeMstId,ST.ServiceTypeName,TM.MinimumDepositionRequired," +
                    "TM.Description,TM.FromDate,TM.ToDate,TM.Status," +
                    "CASE TM.Status WHEN 0 THEN 'Disable' WHEN 1 THEN 'Enable' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ReferralSchemeTypeMapping TM " +
                    "INNER JOIN ReferralPayType PT ON PT.Id = TM.PayTypeId AND PT.Status = 1 " +
                    "INNER JOIN ReferralServiceType ST ON ST.Id = TM.ServiceTypeMstId AND ST.Status = 1 " +
                    "WHERE TM.Id={0}";
                var data = _dbContext.ReferralSchemeTypeMappingData.FromSql(Query,id);
                return data.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ReferralServiceDetailRes GetByIdReferralServiceDetail(long id)
        {
            try
            {
                string Query = "SELECT SD.Id,SD.SchemeTypeMappingId,TM.Description As 'SchemeTypeMappingName',SD.MaximumLevel,SD.MaximumCoin,SD.MaximumValue," +
                    "SD.MinimumValue,SD.CreditWalletTypeId,WTM.WalletTypeName,SD.CommissionType," +
                    "CASE SD.CommissionType WHEN 1 THEN 'Fix' WHEN 2 THEN 'Percentage' ELSE 'Unknown' END AS 'CommissionTypeName'," +
                    "SD.CommissionValue,SD.Status," +
                    "CASE SD.Status WHEN 0 THEN 'Disable' WHEN 1 THEN 'Enable' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ReferralServiceDetail SD " +
                    "INNER JOIN ReferralSchemeTypeMapping TM ON TM.Id = SD.SchemeTypeMappingId AND TM.Status = 1 " +
                    "LEFT JOIN WalletTypeMasters WTM ON WTM.Id = SD.CreditWalletTypeId AND SD.Status = 1 " +
                    "WHERE SD.Id={0}";
                var data = _dbContext.ReferralServiceDetailResData.FromSql(Query, id);
                return data.FirstOrDefault();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ReferralSchemeTypeMappingRes> ListMappingData(long? payTypeId, long? serviceTypeMstId, short? status)
        {
            try
            {
                string Query = "SELECT TM.Id,TM.PayTypeId,PT.PayTypeName,TM.ServiceTypeMstId,ST.ServiceTypeName,TM.MinimumDepositionRequired," +
                    "TM.Description,TM.FromDate,TM.ToDate,TM.Status," +
                    "CASE TM.Status WHEN 0 THEN 'Disable' WHEN 1 THEN 'Enable' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ReferralSchemeTypeMapping TM " +
                    "LEFT JOIN ReferralPayType PT ON PT.Id = TM.PayTypeId AND PT.Status = 1 " +
                    "LEFT JOIN ReferralServiceType ST ON ST.Id = TM.ServiceTypeMstId AND ST.Status = 1 " +
                    "WHERE (TM.PayTypeId={0} OR {0}=0) AND (TM.ServiceTypeMstId={1} OR {1}=0) AND (TM.Status={2} OR {2}=999)";
                var data = _dbContext.ReferralSchemeTypeMappingData.FromSql(Query, (payTypeId==null?0:payTypeId),(serviceTypeMstId==null?0:serviceTypeMstId),Convert.ToInt16(status==null?999:status));
                return data.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ReferralServiceDetailRes> ListReferralServiceDetail(long? schemeTypeMappingId, long? creditWalletTypeId, short? status)
        {
            try
            {
                string Query = "SELECT SD.Id,SD.SchemeTypeMappingId,TM.Description As 'SchemeTypeMappingName',SD.MaximumLevel,SD.MaximumCoin,SD.MaximumValue," +
                    "SD.MinimumValue,SD.CreditWalletTypeId,WTM.WalletTypeName,SD.CommissionType," +
                    "CASE SD.CommissionType WHEN 1 THEN 'Fix' WHEN 2 THEN 'Percentage' ELSE 'Unknown' END AS 'CommissionTypeName'," +
                    "SD.CommissionValue,SD.Status," +
                    "CASE SD.Status WHEN 0 THEN 'Disable' WHEN 1 THEN 'Enable' WHEN 9 THEN 'Delete' ELSE 'Unknown' END AS 'StrStatus' " +
                    "FROM ReferralServiceDetail SD " +
                    "INNER JOIN ReferralSchemeTypeMapping TM ON TM.Id = SD.SchemeTypeMappingId AND TM.Status = 1 " +
                    "LEFT JOIN WalletTypeMasters WTM ON WTM.Id = SD.CreditWalletTypeId AND SD.Status = 1 " +
                    "WHERE (SD.SchemeTypeMappingId={0} OR {0}=0) AND (creditWalletTypeId={1} OR {1}=0) AND (SD.Status={2} OR {2}=999)";
                var data = _dbContext.ReferralServiceDetailResData.FromSql(Query, (schemeTypeMappingId==null?0: schemeTypeMappingId),(creditWalletTypeId==null?0: creditWalletTypeId),Convert.ToInt16(status == null ? 999 : status));
                return data.ToList();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
    }
}
