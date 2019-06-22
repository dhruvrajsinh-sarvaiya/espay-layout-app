using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Core.ViewModels.WalletOpnAdvanced;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{

    public interface IWalletService
    {
        //string FindChargeCurrencyDeduct(long TrnRefNo);

        decimal GetUserBalance(long walletId);

        bool WalletBalanceCheck(decimal amount, string walletId);

        bool IsValidWallet(long walletId);

        Task<CreateWalletAddressRes> GenerateAddress(string walletid, string coin, string Token, int GenaratePendingbit = 0, long userId = 0);

        //vsolanki 8-10-2018
        IEnumerable<WalletTypeMaster> GetWalletTypeMaster();

        //vsolanki 10-10-2018
        Task<CreateWalletResponse> InsertIntoWalletMaster(string Walletname, string CoinName, byte IsDefaultWallet, int[] AllowTrnType, long userId, string accessToken = null, int isBaseService = 0, long OrgId = 0, DateTime? ExpiryDate = null);
                                                          
        //ntrivedi 11-10-2018
        //BizResponseClass DebitBalance(long userID, long WalletID, decimal amount, int walletTypeID, enWalletTrnType wtrnType, enTrnType trnType, enServiceType serviceType, long trnNo, string smsCode);

        ListWalletResponse ListWallet(long userid);

        ListWalletResponse GetWalletByCoin(long userid, string coin);

        ListWalletResponse GetWalletById(long userid, string coin, string walletId);

        Task<WalletDrCrResponse> GetWalletDeductionNew(string coinName, string timestamp, enWalletTranxOrderType orderType, decimal amount, long userID, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, string Token = "");

        ListWalletAddressResponse ListAddress(string AccWalletID);

        //vsolanki 16-10-2018

        //RUSHABH 11-12-2018
        WithdrawHistoryResponse DepositHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, string TrnNo, long Userid, int PageNo);
        //DepositHistoryResponse DepositHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, long Userid);


        //vsolanki 16-10-2018
        //RUSHABH 11-12-2018
        WithdrawHistoryNewResponse WithdrawalHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, long Userid, int PageNo);

        //ntrivedi 16-10-2018
        WalletDrCrResponse GetWalletCreditNew(string coinName, string timestamp, enWalletTrnType trnType, decimal TotalAmount, long userID, string crAccWalletID, CreditWalletDrArryTrnID[] arryTrnID, long TrnRefNo, short isFullSettled, enWalletTranxOrderType orderType, enServiceType serviceType, enTrnType routeTrnType, string Token = "");

        //Rushabh 16-10-2018
        Task<LimitResponse> SetWalletLimitConfig(string accWalletID, WalletLimitConfigurationReq request, long userID, string Token);

        //Rushabh 16-10-2018
        LimitResponse GetWalletLimitConfig(string accWalletID);

        //vsolanki 18-10-2018
        WithdrawalRes Withdrawl(string coin, string accWalletID, WithdrawalReq Request, long userid);

        ListWalletAddressResponse GetAddress(string AccWalletID);

        //vsolanki 24-10-2018
        ListBalanceResponse GetAvailableBalance(long userid, string walletId);
        TotalBalanceRes GetAllAvailableBalance(long userid);
        //vsolanki 24-10-2018
        ListBalanceResponse GetUnSettledBalance(long userid, string walletId);
        ListBalanceResponse GetAllUnSettledBalance(long userid);
        //vsolanki 24-10-2018
        ListBalanceResponse GetUnClearedBalance(long userid, string walletId);
        ListBalanceResponse GetAllUnClearedBalance(long userid);
        Task<BizResponseClass> AddConvertedAddress(string address, string convertedAddress, long id);

        //vsolanki 24-10-2018
        ListStackingBalanceRes GetStackingBalance(long userid, string walletId);
        ListStackingBalanceRes GetAllStackingBalance(long userid);
        //vsolanki 24-10-2018
        ListBalanceResponse GetShadowBalance(long userid, string walletId);
        ListBalanceResponse GetAllShadowBalance(long userid);
        //vsolanki 24-10-2018
        AllBalanceResponse GetAllBalances(long userid, string walletId);
        // vsolanki 25-10-2018
        BalanceResponseWithLimit GetAvailbleBalTypeWise(long userid);

        BeneficiaryResponse AddBeneficiary(string CoinName, short WhitelistingBit, string Name, string BeneficiaryAddress, long UserId, string Token);
        BeneficiaryResponse1 ListWhitelistedBeneficiary(string accWalletID, long id);
        BeneficiaryResponse ListBeneficiary(long id);
        UserPreferencesRes SetPreferences(long Userid, int GlobalBit, string Token);
        UserPreferencesRes GetPreferences(long Userid);
        BeneficiaryResponse UpdateBulkBeneficiary(BulkBeneUpdateReq request, long id, string Token);
        BeneficiaryResponse UpdateBeneficiaryDetails(BeneficiaryUpdateReq request, string AccWalletID, long id, string Token);
        //vsolanki 25-10-2018
        ListAllBalanceTypeWiseRes GetAllBalancesTypeWise(long userId, string WalletType);
        ListWalletLedgerRes GetWalletLedger(DateTime FromDate, DateTime ToDate, string WalletId, int page);
        ListWalletLedgerResv1 GetWalletLedgerV1(DateTime FromDate, DateTime ToDate, string WalletId, int page,int PageSize);

        Task<BizResponseClass> CreateDefaulWallet(long UserID, string accessToken = null);
        BizResponseClass CreateWalletForAllUser_NewService(string WalletType);

        //vsolanki 2018-10-29
        BizResponseClass AddBizUserTypeMapping(AddBizUserTypeMappingReq req);

        Task<long> GetWalletID(string AccWalletID);
        Task<string> GetAccWalletID(long WalletID);
        Task<string> GetDefaultAccWalletID(string SMSCode, long UserID);//rita 9-1-19 for 
        Task<enErrorCode> CheckWithdrawalBene(long WalletID, string Name, string DestinationAddress, enWhiteListingBit WhitelistingBit);
        //enCheckWithdrawalBene CheckWithdrawalBene(long WalletID, string Name, string DestinationAddress, short WhitelistingBit);

        WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
           long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType);
        Task<BizResponseClass> UpdateWalletDetail(string AccWalletID, string walletName, short? status, byte? isDefaultWallet,long UserID);

        //int CheckTrnRefNo(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType wType);

        //vsolanki 2018-10-29
        ListIncomingTrnRes GetIncomingTransaction(long Userid, string Coin);

        // ntrivedi 29102018
        long GetWalletByAddress(string address);

        // ntrivedi 29102018

        WalletLedger GetWalletLedgerObj(long WalletID, long toWalletID, decimal drAmount, decimal crAmount, enWalletTrnType trnType, enServiceType serviceType, long trnNo, string remarks, decimal currentBalance, byte status);
        // ntrivedi 29102018

        TransactionAccount GetTransactionAccount(long WalletID, short isSettled, long batchNo, decimal drAmount, decimal crAmount, long trnNo, string remarks, byte status, enBalanceType BalType);
        // ntrivedi 29102018

        WalletTransactionOrder InsertIntoWalletTransactionOrder(DateTime? UpdatedDate, DateTime TrnDate, long OWalletID, long DWalletID, decimal Amount, string WalletType, long OTrnNo, long DTrnNo, enTransactionStatus Status, string StatusMsg);

        //vsolanki 2018-10-29
        bool CheckUserBalance(long WalletId, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);

        //Uday 30-10-2018
        Task<ServiceLimitChargeValue> GetServiceLimitChargeValue(enWalletTrnType TrnType, string CoinName);

        //vsoalnki 2018-10-31
        Task<CreateWalletAddressRes> CreateETHAddress(string Coin, int AddressCount, long UserId, string accessToken);

        ListOutgoingTrnRes GetOutGoingTransaction(long Userid, string Coin);

        //vsolanki 2018-11-03
        ListTokenConvertHistoryRes ConvertFundHistory(long Userid, DateTime FromDate, DateTime ToDate, string Coin);

        //vsolanki 2018-11-03
        decimal ConvertFund(decimal SourcePrice);
        BizResponseClass AddIntoConvertFund(ConvertTockenReq Request, long userid, string accessToken = null);

        bool InsertIntoWithdrawHistory(WithdrawHistory req);

        Task<bool> CheckUserBalanceAsync(decimal amount,long WalletId, enBalanceType enBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);  //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction

        Task<WalletLedger> GetWalletLedgerAsync(long WalletID, long toWalletID, decimal drAmount, decimal crAmount, enWalletTrnType trnType, enServiceType serviceType, long trnNo, string remarks, decimal currentBalance, byte status);
        Task<TransactionAccount> GetTransactionAccountAsync(long WalletID, short isSettled, long batchNo, decimal drAmount, decimal crAmount, long trnNo, string remarks, byte status, enBalanceType BalType);

        Task<WalletDrCrResponse> GetWalletHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        Task<WalletDrCrResponse> GetWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels enAllowedChannels,enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        Task<WalletDrCrResponse> GetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "");

        Task EmailSendAsyncV1(EnTemplateType templateType, string UserID, string Param1 = "", string Param2 = "", string Param3 = "", string Param4 = "", string Param5 = "", string Param6 = "", string Param7 = "", string Param8 = "", string Param9 = "");

        //2018-12-6
        Task SMSSendAsyncV1(EnTemplateType templateType, string UserID, string WalletName = null, string SourcePrice = null, string DestinationPrice = null, string ONOFF = null, string Coin = null, string TrnType = null, string TrnNo = null);

        //2018-12-20
        ListAddWalletRequest ListAddUserWalletRequest(long UserId);
        Task<BizResponseClass> UpdateUserWalletPendingRequest(short Status, long RequestId, long UserId);
        Task<BizResponseClass> InsertUserWalletPendingRequest(InsertWalletRequest request, long UserId);
        //Task<ListStakingPolicyDetailRes> ListStakingPolicy(short statkingTypeID, short currencyTypeID);

        Task<ListUserWalletWise> ListUserWalletWise(string WalletId);

        Task<ListStakingPolicyDetailRes> GetStakingPolicy(short statkingTypeID, short currencyTypeID);
        Task<BizResponseClass> UserStackingRequest(StakingHistoryReq StakingHistoryReq, long UserID);
        Task<ListPreStackingConfirmationRes> GetPreStackingData(PreStackingConfirmationReq request,long UserId);

        //listing method
        Task<ListWalletMasterRes> ListWalletMasterResponseNew(long UserId, string Coin);
        ListWalletResNew GetWalletByCoinNew(long userid, string coin);
        ListWalletResNew GetWalletByIdNew(long userid, string walletId);
        //balance API
        BalanceResponseWithLimit GetAvailbleBalTypeWiseNew(long userid);
        TotalBalanceRes GetAllAvailableBalanceNew(long userid);
        ListBalanceResponse GetAvailableBalanceNew(long userid, string walletId);
        AllBalanceResponse GetAllBalancesNew(long userid, string walletId);
        ListAllBalanceTypeWiseRes GetAllBalancesTypeWiseNew(long userId, string WalletType);
        Task<ListStakingHistoryRes> GetStackingHistoryData(DateTime? FromDate, DateTime? ToDate, EnStakeUnStake? Type, int PageSize, int PageNo, EnStakingSlabType? Slab, EnStakingType? StakingType, long UserID);
        Task<UnstakingDetailRes> GetPreUnstackingData(PreUnstackingConfirmationReq Request, long UserID);
        Task<BizResponseClass> UserUnstackingRequest(UserUnstakingReq request, long UserID);

        //int AddBulkData();
        StatisticsDetailData GetMonthwiseWalletStatistics(long UserID, short Month, short Year);
        StatisticsDetailData2 GetYearwiseWalletStatistics(long UserID,short Year);
        Task<BizResponseClass> ColdWallet(string Coin, InsertColdWalletRequest req,long UserId);
        Task<BizResponseClass> ValidateAddress(string TrnAccountNo, int Length, string StartsWith,string AccNoValidationRegex);
        CreateWalletAddressRes CreateERC20Address(long UserId, string Coin, string AccWalletId,short IsLocal=0);

        ListLeaderBoardRes LeaderBoard(int? UserCount);
        ListLeaderBoardRes LeaderBoardWeekWiseTopFive(long[] LeaderId, DateTime Date, short IsGainer,int Count);
        Task<ServiceLimitChargeValue> GetServiceLimitChargeValueV2(enWalletTrnType trnType, string coinName, long userId);

        GetTransactionPolicyRes ListTransactionPolicy(long TrnType,long userId);

        // khushali 23-03-2019 For Success and Debit Reocn Process
        Task<WalletDrCrResponse> GetDebitWalletWithCharge(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);
        ListChargesTypeWise ListChargesTypeWise(string WalletTypeName, long? TrnTypeId, long UserId);

        //khushali 11-04-2019 Process for Release Stuck Order - wallet side   
        enTransactionStatus CheckTransactionSuccessOrNot(long TrnRefNo);
        bool CheckSettlementProceed(long MakerTrnNo, long TakerTrnNo);
        ListUserUnstakingReq2 GetUnstackingCroneData();

        int CheckActivityLog(long UserId, int Type);
    }
}