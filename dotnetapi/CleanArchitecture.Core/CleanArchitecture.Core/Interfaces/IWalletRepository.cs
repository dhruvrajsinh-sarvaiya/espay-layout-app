using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IWalletRepository
    {
        //T GetById(long id); moved to icommonrepository
        //List<T> List();
        //T Add(T entity);
        //void Update(T entity);
        //void Delete(T entity);
        //T AddProduct(T entity);
        Balance GetAllBalancesV1(long userid, long walletid);
        TradeBitGoDelayAddresses GetUnassignedETH();
        bool WalletOperation(WalletLedger wl1, WalletLedger wl2, TransactionAccount ta1, TransactionAccount ta2, WalletMaster wm2, WalletMaster wm1);
        bool WalletDeduction(WalletLedger wl1, TransactionAccount ta1, WalletMaster wm2, decimal amount);
        bool WalletDeductionwithTQ(WalletLedger wl1, TransactionAccount ta1, long walletID, WalletTransactionQueue wtq, decimal amount);
        List<WalletMasterResponse> ListWalletMasterResponse(long UserId);

        List<AddressMasterResponse> ListAddressMasterResponse(string AccWaletID); //Rushabh 15-10-2018

        List<WalletMasterResponse> GetWalletMasterResponseByCoin(long UserId, string coin);

        List<WalletMasterResponse> GetWalletMasterResponseById(long UserId, string coin, string walletId);

        Task<int> CheckTrnRefNoAsync(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType enWalletTrn);

        Task<CheckTrnRefNoRes> CheckTranRefNoAsync(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType enWalletTrn);

        int CheckTrnRefNoForCredit(long TrnRefNo, enWalletTranxOrderType TrnType);

        WalletTransactionQueue AddIntoWalletTransactionQueue(WalletTransactionQueue wtq, byte AddorUpdate);

        WalletTransactionOrder AddIntoWalletTransactionOrder(WalletTransactionOrder wo, byte AddorUpdate);

        bool CheckarryTrnID(CreditWalletDrArryTrnID[] arryTrnID, string coinName);

        //vsolanki 16-10-2018 
        WithdrawHistoryResponse DepositHistoy(DateTime FromDate, DateTime ToDate, string Coin, string TrnNo, decimal? Amount, byte? Status, long Userid, int PageNo);

        //vsolanki 16-10-2018 
        WithdrawHistoryNewResponse WithdrawalHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, long Userid, int PageNo);

        //decimal GetCrSumAmtWallet(long walletid);
        //decimal GetDrSumAmtWallet(long walletid);
        bool WalletCreditwithTQ(WalletLedger wl1, TransactionAccount ta1, WalletMaster wm2, WalletTransactionQueue wtq, CreditWalletDrArryTrnID[] arryTrnID, decimal amount);
        List<WalletLimitConfigurationRes> GetWalletLimitResponse(string AccWaletID);
        List<AddressMasterResponse> GetAddressMasterResponse(string AccWaletID); //Rushabh 23-10-2018

        //vsolanki 24-10-2018
        List<BalanceResponse> GetAvailableBalance(long userid, long walletId);
        List<BalanceResponse> GetAllAvailableBalance(long userid);
        List<BalanceResponse> GetUnSettledBalance(long userid, long walletId);
        List<BalanceResponse> GetAllUnSettledBalance(long userid);
        List<BalanceResponse> GetUnClearedBalance(long userid, long walletId);
        List<BalanceResponse> GetUnAllClearedBalance(long userid);
        List<StackingBalanceRes> GetStackingBalance(long userid, long walletId);
        List<StackingBalanceRes> GetAllStackingBalance(long userid);
        List<BalanceResponse> GetShadowBalance(long userid, long walletId);
        List<BalanceResponse> GetAllShadowBalance(long userid);
        Balance GetAllBalances(long userid, long walletid);
        decimal GetTotalAvailbleBal(long userid);

        List<BeneficiaryMasterRes1> GetAllWhitelistedBeneficiaries(long WalletTypeID, long UserId);

        List<BeneficiaryMasterRes> GetAllBeneficiaries(long UserID);
        //vsolanki 25-10-2018
        List<BalanceResponseLimit> GetAvailbleBalTypeWise(long userid);

        decimal NewGetTotalAvailbleBal(long userid);

        //bool BeneficiaryBulkEdit(BulkBeneUpdateReq arryTrnID);
        BeneUpdate BeneficiaryBulkEdit(string id, short bit);

        //void GetSetLimitConfigurationMaster(int[] AllowTrnType, long userid, long WalletId);

        //vsolanki 24-10-2018 
        decimal GetTodayAmountOfTQ(long userId, long WalletId);
        List<WalletLedgerRes> GetWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page);

        List<WalletLedgerRes> GetWalletLedgerV1(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount);

        Task<int> CreateDefaulWallet(long UserId);

        int CreateWalletForAllUser_NewService(string WalletType);

        //vsolanki 2018-10-29
        int AddBizUserTypeMapping(BizUserTypeMapping bizUser);

        long GetTypeMappingObj(long userid);

        Task<long> GetTypeMappingObjAsync(long userid);
        //vsolanki 2018-10-29
        List<IncomingTrnRes> GetIncomingTransaction(long Userid, string Coin);

        long getOrgID();

        // ntrivedi 29102018

        WalletTransactionQueue GetTransactionQueue(long TrnNo);

        // ntrivedi 29102018
        bool WalletCreditDebitwithTQ(WalletLedger wl1, WalletLedger wl2, TransactionAccount ta1, TransactionAccount ta2, WalletMaster wm2, WalletMaster wm1, WalletTransactionQueue wtq1, WalletTransactionQueue wtq2, WalletTransactionOrder order);
        //List<BalanceResponseLimit> (long userid);

        decimal GetLedgerLastPostBal(long walletId);

        List<OutgoingTrnRes> GetOutGoingTransaction(long Userid, string Coin);

        List<TransfersRes> GetTransferIn(string Coin, int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId, ref int TotalCount);

        List<TransfersRes> TransferOutHistory(string CoinName, int Page, int PageSize, long? UserId, string Address, string TrnID, long? OrgId, ref int TotalCount);

        //vsolanki 2018-11-3
        List<TokenConvertHistoryRes> ConvertFundHistory(long Userid, DateTime FromDate, DateTime ToDate, string Coin);

        //vsoalnki 2018-10-15
        //bool CheckUserBalanceV1(long WalletId);

        Task<WalletTransactionQueue> GetTransactionQueueAsync(long TrnNo);

        int CheckTrnRefNo(long TrnRefNo, enWalletTranxOrderType TrnType, enWalletTrnType walletTrnType);

        Task<int> CheckTrnRefNoForCreditAsync(long TrnRefNo, enWalletTranxOrderType TrnType);

        //Task<bool> CheckTrnIDDrForHoldAsync(CreditWalletDrArryTrnID arryTrnID, string coinName);

        Task<WalletTransactionOrder> AddIntoWalletTransactionOrderAsync(WalletTransactionOrder wo, byte AddorUpdate);

        Task<bool> WalletCreditDebitwithTQTest(MemberShadowBalance FirstDebitShadowWallet, MemberShadowBalance SecondDebitShadowWallet, WalletTransactionQueue firstDrTQ, WalletTransactionQueue secondDrTQ, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletLedger wl1, WalletLedger wl2, WalletLedger wl3, WalletLedger wl4, TransactionAccount ta1, TransactionAccount ta2, TransactionAccount ta3, TransactionAccount ta4);
        Task<bool> CheckTrnIDDrForHoldAsync(CommonClassCrDr arryTrnID);
        Task<bool> WalletCreditDebitwithTQTestFinal(WalletTransactionQueue FirstCurrWT, WalletTransactionQueue SecondCurrWT, WalletTransactionOrder SecondCurrWO, WalletTransactionOrder firstCurrWO, MemberShadowBalance FirstDebitShadowWallet, MemberShadowBalance SecondDebitShadowWallet, WalletTransactionQueue firstDrTQ, WalletTransactionQueue secondDrTQ, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletLedger wl1, WalletLedger wl2, WalletLedger wl3, WalletLedger wl4, TransactionAccount ta1, TransactionAccount ta2, TransactionAccount ta3, TransactionAccount ta4);

        //BizResponseClass Callsp_CrDrWallet(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType);

        void ReloadEntity(WalletMaster wm1, WalletMaster wm2, WalletMaster wm3, WalletMaster wm4);

        Task<bool> CheckTrnIDDrForMarketAsync(CommonClassCrDr arryTrnID);

        bool CheckUserBalanceV1(long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);

        Task<bool> CheckUserBalanceV1Async(long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);

        Task<ApplicationUser> GetUserById(long id);

        //Task<WalletLimitConfiguration> GetWalletLimit(int TranType, long WalletID);

        Task<HistoryAllSumAmount> GetHistorySum(long WalletID);

        Task<AllSumAmount> GetSumForPolicy(long WalletType, long TrnType);
        BeneUpdate UpdateDefaultWallets(long WalletTypeID, long UserID);

        List<AddWalletRequestRes> ListAddUserWalletRequest(long UserId);

        Task<List<UserWalletWise>> ListUserWalletWise(long WalletId);

        List<StakingPolicyDetailRes> GetStakingPolicyData(short statkingTypeID, short currencyTypeID);
        PreStackingConfirmationRes GetPreStackingData(long PolicyDetailID);

        Task<List<WalletMasterRes>> ListWalletMasterResponseNew(long UserId, string Coin);
        Task<List<WalletMasterRes>> GetWalletMasterResponseByCoinNew(long UserId, string coin);
        Task<List<WalletMasterRes>> GetWalletMasterResponseByIdNew(long UserId, string walletId);
        Balance GetAllBalancesNew(long userid, long walletid);
        List<BalanceResponse> GetAvailableBalanceNew(long userid, long walletId);
        List<BalanceResponse> GetAllAvailableBalanceNew(long userid);
        decimal GetTotalAvailbleBalNew(long userid);
        List<BalanceResponseLimit> GetAvailbleBalTypeWiseNew(long userid);
        List<StakingHistoryRes> GetStackingHistoryData(DateTime? fromDate, DateTime? toDate, EnStakeUnStake? type, int pageSize, int pageNo, EnStakingSlabType? slab, EnStakingType? stakingType, long userID, ref int TotalCount);

        //int AddBulkData();

        int IsSelfAddress(string address, long userID, string smscode);

        int IsInternalAddress(string address, long userID, string smscode);
        List<WalletTransactiondata> GetWalletStatisticsdata(long userID, short month, short year);
        List<TranDetails> GetYearlyWalletStatisticsdata(long userID, short year);
        bool AddAddressIntoDB(long userID, string Address, string TxnID, string Key, long SerProDetailId, short Islocal);

        List<LeaderBoardRes> LeaderBoard(int? UserCount,long[] LeaderId);
        List<LeaderBoardRes> LeaderBoardWeekWiseTopFive(long[] LeaderId, DateTime Date, short IsGainer,int Count);

        List<ViewModels.Transaction.HistoricalPerformanceTemp> GetHistoricalPerformanceYearWise(long UserId, int Year);
        long FindChargeValueReleaseWalletId(string Timestamp, long TrnRefNo);

        decimal FindChargeValueHold(string Timestamp, long TrnRefNo);

        decimal FindChargeValueDeduct(string Timestamp, long TrnRefNo);

        decimal FindChargeValueRelease(string Timestamp, long TrnRefNo);

        long FindChargeValueWalletId(string Timestamp, long TrnRefNo);

        string FindChargeCurrencyDeduct(long TrnRefNo);

        TransactionPolicyRes ListTransactionPolicy(long TrnType, long userId);
        List<WalletType> GetChargeWalletType(long? id);
        List<ChargesTypeWise> ListChargesTypeWise(long WalletTypeId, long? TrntypeId);

        //khushali 11-04-2019 Process for Release Stuck Order - wallet side   
        enTransactionStatus CheckTransactionSuccessOrNot(long TrnRefNo);
        bool CheckSettlementProceed(long MakerTrnNo, long TakerTrnNo);
        List<UserUnstakingReq2> GetStakingdataForChrone();

        ValidationWithdrawal CheckActivityLog(long UserId, int Type);
    }

    public interface IWalletTQInsert
    {
        WalletTransactionQueue AddIntoWalletTransactionQueue(WalletTransactionQueue wtq, byte AddorUpdate);

        ArbitrageWalletTransactionQueue AddIntoArbitrageWalletTransactionQueue(ArbitrageWalletTransactionQueue wtq, byte AddorUpdate);
    }
}
