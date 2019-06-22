using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Affiliate;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.UserRoleManagement;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.BackOffice;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.RoleConfig;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.ControlPanel
{
    public interface IControlPanelRepository
    {
        //long GetUserRecCount(long? OrgID, long? UserType, short? Status, long? RoleID);
        List<GetRoleDetail2> ListRoleDetails(short? Status);
        TodaysCounts GetUserRecCounts(long? OrgID, long? UserType, short? Status, long? RoleID, DateTime FromDate, DateTime Todate);
        TempCount GetWalletRecCounts(long? walletTypeID, short? status, long? orgID, long? userID);
        long GetOrgRecCount(short? status);
        long GetTodaysOrgRecCount(short? status, DateTime FromDate, DateTime Todate);
        long GetTodaysUserRecCount(short? status, DateTime FromDate, DateTime Todate);
        List<CommonCountClass> GetStatusWiseCount();
        List<CommonCountClass> GetTypeWiseCount();
        List<CommonCountClass> GetOrgWiseCount();
        List<CommonCountClass> GetRoleWiseCount();
        Task<List<OrgMasterRes>> ListOrgDetail(short? status, long? orgID);
        bool SetDefaultZero(long userid, DateTime UpdatedDate);
        Task<int> GetWCount(long OrgID);
        Task<int> GetUCount(long OrgID);

        long GetWalletRecCount(long? walletTypeID, short? status, long? orgID, long? userID);
        List<CommonCountClass> GetWalletTypeWiseCount();
        List<CommonCountClass> GetWalletStatusWiseCount();
        List<CommonCountClass> GetWalletOrgWiseCount();
        List<CommonCountClass> GetWalletUserWiseCount();

        long GetWalletAuthUserCount(short? status, long? orgID, long? userID, long? RoleID);
        List<CommonCountClass> GetWalletAuthUserStatusWiseCount();
        List<CommonCountClass> GetWalletAuthUserOrgWiseCount();
        List<CommonCountClass> GetWalletAuthUserRoleWiseCount();

        long GetUserRoleCount(short? status);
        List<RoleMasterRes> ListRoleDetail(short? status);

        long GetCurrencyCount(short? status);
        List<CurrencyMasterRes> ListCurrencyDetail(short? status);
        long GetMaxPlusOneChannelID();
        long GetWalletTypeCount(short? status, long? CurrencyType);
        List<WalletTypeMasterRes> ListWalletTypeDetail(short? status, long? ServiceProviderId, long? CurrencyType, short IsMargin = 0);
        ListWalletGraphRes GraphForOrgCount();
        ListTransactionTypewiseCount GraphForTrnTypewiseCount();
        ListChannels ListChannels();
        List<ProviderRes> ListProvider();
        List<ChannelwiseTranCount> ChannelwiseTranCount();
        List<AuthAppRes> GetAllAuthAppDetail(short? status);
        List<AuthAppRes> GetAuthAppDetail(long appId, short? status);

        //vsolanki 24-11-2018
        long GetChargeTypeCount(short? status, long? ChargeTypeID);
        List<ChargeTypeMasterRes> ListChargeTypeDetail(short? status, long? ChargeTypeID);

        //vsolanki 24-11-2018
        long GetCommissionTypeCount(short? status, long? TypeID);
        List<CommissionTypeMasterRes> ListCommisssionTypeDetail(short? status, long? TypeID);

        //vsolanki 24-11-2018
        long GetChargePolicyRecCount(long? WalletTypeID, short? status, long? WalletTrnTypeID);
        List<CommonCountClass> GetChargePolicyWalletTypeWiseCount();
        List<CommonCountClass> GetChargePolicyStatusWiseCount();
        List<CommonCountClass> GetChargePolicyWalletTrnTypeWiseCount();
        List<ChargePolicyRes> GetChargePolicyList(short? status, long? WalletType, long? WalletTrnType);
        List<ChargePolicyRes> ListChargePolicyLast5();

        //vsolanki 24-11-2018
        long GetCommissionPolicyRecCount(long? WalletTypeID, short? status, long? WalletTrnTypeID);
        List<CommonCountClass> GetCommissionPolicyWalletTypeWiseCount();
        List<CommonCountClass> GetCommissionPolicyStatusWiseCount();
        List<CommonCountClass> GetCommissionPolicyWalletTrnTypeWiseCount();
        List<CommissionPolicyRes> GetCommissionPolicyList(short? status, long? WalletType, long? WalletTrnType);
        List<CommissionPolicyRes> ListCommissionPolicy();
        //  object GetCurrencyWiseOrgBalanceTotal(List<OrgMasterRes> obj);

        ListWalletGraphRes GraphForUserCount();

        List<WalletusagePolicyRes2> ListUsagePolicyLast5();
        List<UserRes> ListUserLast5();
        List<TypeRes> ListWalletType();
        List<TypeRes> ListWalletTrnType();
        List<TypeRes> GetBlockWTypewiseTrnTypeList(long WalletType);

        Task<long> GetTypecount();
        Task<long> GetWalletcount();
        Task<decimal> GetTotalBal();
        Task<long> GetUcount();

        Task<long> GetTranTypeWise(string WalletType);
        Task<long> GetUserTypeWise(long WalletType);
        Task<decimal> GetTotalBalTypeWise(long WalletType);
        Task<long> GetWalletTypeWise(long WalletType);

        OrgDetail GetOrgAllDetail();
        List<TypeWiseDetail> GetDetailTypeWise();


        //komal for test only
        List<TradeHistoryResponce> GetTradeHistory(long MemberID);

        List<TransactionPolicyRes> ListTransactionPolicy();
        //RUSHABH 13-12-2018
        ListUserDetailRes ListAllUserDetail(long? orgID, long? userType, short? status, int? pageNo, int? pageSize);
        List<UserTypeRes> ListAllUserTypes(short? status);
        List<UserWalletBlockTrnTypeRes> ListUserWalletBlockTrnType(string WalletId, long? TrnTypeId);

        BizResponseClass InsertUpdateChargeType(ChargeTypeReq Req, long UserId);
        List<WalletAuthorizeUserRes> ListWalletAuthorizeUser(string WalletId);
        BizResponseClass ChangeChargeTypeStatus(long Id, short Status, long UserId);
        List<UserActivityLoging> ListUserActivityData(long? userID, DateTime? fromDate, DateTime? toDate);
        ListBlockTrnTypewiseReport GetBlockedTrnTypeWiseWalletData(enWalletTrnType type, int? PageNo, int? PageSize);
        List<TransactionBlockedChannelRes> GetBlockTranChannelDetail(long iD, short? status, long? ChannelID);
        //List<TransactionBlockedChannelRes> ListBlockTranChannelDetail(short? trnType, long? channelID, short? status);
        List<TransactionBlockedChannelRes> ListBlockTranChannelDetail(enWalletTrnType? trnType, long? channelID, short? status);
        long GetMaxPlusOne();
        long GetMaxCommissionId();

        List<WalletRes> ListAllWallet(DateTime? FromDate, DateTime? ToDate, short? Status, int PageSize, int Page, long? UserId, long? OrgId, string WalletType, ref long TotalCount);
        WalletRes GetWalletIdWise(string AccWalletId);
        List<WalletPolicyAllowedDayRes> GetWPolicyAllowedDays(long ID, EnWeekDays? DayNo, long? PolicyID, short? Status);
        //List<ApplicationUser> GetAssociatedUser(long roleId);
        List<WalletPolicyAllowedDayRes> ListWPolicyAllowedDays(EnWeekDays? DayNo, long? PolicyID, short? Status);
        List<WalletusagePolicyRes2> ListUsagePolicyData(long? walletTypeID, short? status);
        List<ChannelMasterRes> GetChannelDetail(long channelID, short? status);

        Task<List<AllowTrnTypeRoleWiseRes>> ListAllowTrnTypeRoleWise(long? RoleId, long? TrnTypeId, short? Status);
        WalletTypeMasterResp GetWalletTypeDetails(long typeID);

        BizResponseClass AddWPolicyAllowedDay(short[] DayNo, long WalletPolicyID, long UserId, short type);
        MinMaxRanges GetMinMaxRange(long newID);
        int GetRange(decimal MaxRange, decimal MinRange, long StackingPolicyId);
        ListStakingPolicyDetailRes2 ListStakingPolicyDetails(long StackingPolicyMasterId, EnStakingType? stakingType, EnStakingSlabType? slabType, short? status);
        List<StakingPolicyDetailRes> GetStakingPolicy(long policyDetailID, short? status);
        //decimal GetMaxRange(long newID);

        Task<List<StopLossRes>> ListStopLoss(long? WalletTypeId, short? Status);
        Task<List<LeverageRes>> ListLeverage(long? WalletTypeId, short? Status);
        List<ImpExpAddressRes> GetExportAddressList(long? ServiceProviderID, long? UserID, long? WalletTypeID);
        BizResponseClass AddBulkData(List<ImpExpAddressRes3> details);
        List<AddressRes> ListAddressDetails(long? ServiceProviderID, long? UserID, long? WalletTypeID, string Address, int PageNo, int PageSize, ref int TotalCount);
        Task<List<StakingPolicyRes>> ListStakingPolicyMaster(long? WalletTypeId, short? Status, short? enStakingSlabType, short? enStakingType);
        BeneUpdate BulkUpdateDetail(long id, short bit);
        List<ChargesTypeWise> ListChargesTypeWise(long WalletTypeId, long? TrntypeId);
        List<WalletType> GetChargeWalletType(long? WalletTypeId);
        long getProviderId(string ProviderName);
        List<TrnChargeLogRes> TrnChargeLogReport(int PageNo, int PageSize, short? Status, long? TrnTypeID, long? WalleTypeId, short? SlabType, DateTime? FromDate, DateTime? ToDate, long? TrnNo, ref long TotalCount);

        List<DepositeCounterRes> GetDepositCounter(long? WalletTypeID, long? SerProId, int PageNo, int PageSize, ref int Total);

        List<AdminAssetsres> AdminAssets(long? WalletTypeId, EnWalletUsageType? WalletUsageType, long Userid, int PageNo, int PageSize, ref int TotalCount);

        List<OrgWalletres> OrganizationLedger(long? WalletTypeId, EnWalletUsageType? WalletUsageType, ref int TotalCount);
        List<UnStakingHistory> ListUnStakingHistory(long? userid, short? status, EnUnstakeType? UnStackType);
        List<UnStakingHistoryData> ListUnStakingHistoryData(long? userid, short? status, EnUnstakeType unStakingType, string HistoryId);

        List<WalletTypeMaster> MarketCapIsLocal();
        decimal GetLTP(long WalletType);
        List<ChargeConfigurationMasterRes> GetChargeConfigMasterList(long? walletTypeId, long? trnType, short? slabType, short? status);
        ChargeConfigurationMasterRes GetChargeConfigMasterbyId(long masterID);
        List<ChargeConfigurationDetailRes> GetChargeConfigDetailList(long? masterId, long? chargeType, short? chargeValueType, short? chargeDistributionBasedOn, short? status);
        ChargeConfigurationDetailRes GetChargeConfigDetailbyId(long detailID);

        List<LeaverageReportRes> LeveragePendingReport(long? WalletTypeId, long? UserId, DateTime? FromDate, DateTime? ToDate, int PageNo, int PageSize, ref int TotalCount);

        List<LeaverageReport> LeverageReport(long? WalletTypeId, long? UserId, DateTime FromDate, DateTime ToDate, int PageNo, int PageSize, short? Status, ref int TotalCount);

        #region Role and Acccess Rights Methods - Account updated by khushali 04-03-2019
        List<ApplicationGroupRoles> CheckGroupInUse(long permissionGrpID);
        List<ApplicationGroupRoles> IsWithDuplicateRole(long id);
        bool AddGroupRoleMappingData(long PermissionGrpId, long RoleId);
        List<GetPermissionGroup> ListPermissionGrpDetail(DateTime? FromDate, DateTime? Todate, long? RoleId, short? Status);
        List<GetRoleHistoryData> GetRoleHistoryData(long? UserId, DateTime? FromDate, DateTime? ToDate, long? ModuleId, short? Status);
        GetPermissionGroup2 GetPermissionGrpDetail(long permissionGroupId);
        List<GetUserDetail> GetUserListData();
        GetUserDetail GetUserDataById(long userId);
        List<GetUserDetail> SearchUserData(string searchText);
        List<ApplicationGroupRoles> GetPermissionGroupIDByLinkedRole(long RoleID); // khushali 04-03-2019  -- Get permission Group ID by Linked Role
        List<ViewUnAssignedUserRes> ViewUnassignedUsers(string UserName, DateTime? FromDate, DateTime? ToDate, short? Status);// khushali 04-03-2019  -- View Unassigned Users
        bool CheckUserExistWithAnyRole(long id);
        // khushali 29-04-2019 initial level master entry for group access right
        Task<bool> Callsp_AddGroupAccessRight(long GroupId, long UserID, long ErrorCode = 0);
        List<MenuSubDetailViewModelV2> GetGroupAccessRightsGroupWise(long GroupID, string ParentID, bool IscCheckStatus = false);
        List<ChildNodeFiledViewModel> GetFormAccessRightsGroupWise(long ModuleGroupAccessID, bool IscCheckStatus = false);
        bool InsertSubmoduleEntryGroupWise(long SubModuleID, long GroupID); //khuhsali 21-05-2019 for CURD
        bool InsertFieldEntryGroupWise(long FieldID); // khushali 21-05-2019 for CURD
        int UpdateModuleGroupAccess(long UserID, long GroupID, long ModuleGroupAccessID, short Status, string CrudOption, string Utility);
        int UpdateModuleFieldpAccess(long UserID, long ModuleGroupAccessID, long ModuleFormAccessID, short Visibility, short AccessRights);
        #endregion
        List<Dipositions> GetDepositionHistorydata(string trnid, string address, short? isInternal, long? userID, string coin, long? provider, int pageNo, int pageSize, ref int TotalCount);

        List<TradingChargeTypeRes> ListTradingChargeTypeMaster();

        List<WalletTrnLimitConfigResp> ListMasterLimitConfig(long? walletTypeId, long? trnType, EnIsKYCEnable? isKYCEnable, short? status);
        WalletTrnLimitConfigResp GetMasterLimitConfig(long id);

        List<DepositionIntervalListViewModel> ListDepositionInterval();
        DepositionIntervalListViewModel FirstDepositionInterval();
        DepositionIntervalListViewModel GetDepositionInterval(long Id);
        //DepositionIntervalListViewModel GetFirstActiveDepositionInterval();

        AffiliateCommissionCron GetCronData();
        List<TransactionProviderResponse> GetProviderDataListAsync(long ServiceProvider, enTrnType? TransactionType, string CurrencyName);
        List<BlockUserRes> ListBlockUserAddresses(long? userId, string address, DateTime? fromDate, DateTime? toDate, short? status);
        List<WithdrwalAdminReqRes> ListWithdrawalReqData(long? trnNo, DateTime? fromDate, DateTime? toDate, short? status);
        List<TokenSupplyRes> ListIncreaseDecreaseTokenSupply(long? walletTypeId, short? actionType, DateTime? fromDate, DateTime? toDate);
        List<DestroyBlackFundRes> ListDestroyedBlackFund(string address, DateTime? fromDate, DateTime? toDate);
        List<TokenTransferRes> ListTokenTransferHistory(DateTime? fromDate, DateTime? toDate);
        List<SetTransferFeeRes> ListTransferFeeHistory(long? walletTypeId, DateTime? fromDate, DateTime? toDate);
    }
}
