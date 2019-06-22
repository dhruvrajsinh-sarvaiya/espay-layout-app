using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.MarginWallet
{
    public interface IMarginSPRepositories
    {
        //BizResponseClass Callsp_CrDrWallet(MarginCommonClassCrDr firstCurrObj, MarginCommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType);

        BizResponseClass Callsp_HoldWallet(MarginWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enMarginWalletTrnType walletTrnType, ref long TrnNo, enWalletDeductionType enWalletDeductionType);

        BizResponseClass Callsp_CrDrWalletForHold(MarginPNL PNLObj, MarginCommonClassCrDr firstCurrObj, MarginCommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType);

        BizResponseClass Callsp_ReleaseHoldWallet(MarginWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enMarginWalletTrnType walletTrnType, ref long trnNo);

        BizResponseClass Callsp_HoldWallet_MarketTrade(MarginWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enMarginWalletTrnType walletTrnType, enWalletDeductionType enWalletDeductionType);

        //BizResponseClass Callsp_DebitWallet(MarginWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType);

        //BizResponseClass Callsp_CreditWallet(MarginWalletMaster cWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType);

        //BizResponseClass Callsp_StakingSchemeRequest(StakingHistoryReq Req, long UserID, long WalletID, long WalletTypeID);

        BizResponseClass Callsp_IsValidWalletTransaction(long WalletID, long UserID, long WalletTypeID, long ChannelID, long WalletTrnType);

        //BizResponseClass Callsp_UnstakingSchemeRequest(UserUnstakingReq request, long userID, int IsReqFromAdmin);

        //sp_BalanceStatisticRes Callsp_GetWalletBalanceStatistics(long userID, int Month, int Year);

        //BizResponseClass Callsp_HoldWalletFinal(MarginWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long TrnNo, enWalletDeductionType enWalletDeductionType);

        //BizResponseClass Callsp_DepositionProcess(ref long TrnNo, EnAllowedChannels channelType, string timeStamp, string WalletType, enWalletTrnType walletTrnType, decimal Amount, long TrnRefNo);

        //WalletTrnLimitResponse Callsp_CheckWalletTranLimit(short TrnType, long WalletID, decimal Amount);

        //BizResponseClass CallSP_InsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD");

        //BizResponseClass CallSP_ConvertFundWalletOperation(string CrCurr, string DrCurr, decimal CrAmt, decimal DrAmt, long UserID, long TrnNo, int channelType, string timeStamp, int serviceType, int walletTrnType, int IsUseDefaultWallet = 1);

        //MarginPreConfirmationRes CallSP_MarginFundTransferCalculation(long WalletTypeId, decimal Amount, long UserID, long WalletID, short LeverageChargeDeductionType);

        //BizResponseClass CallSP_MarginProcess(long WalletTypeId, decimal Amount, long UserID, long WalletID, string TimeStamp, short LeverageChargeDeductionType);

        //BizResponseClass CreateMarginWallet(long WalletTypeId, long UserId);

        //BizResponseClass Callsp_MarginChargeWalletCallBGTask(int Hour);

        MarginPreConfirmationRes CallSP_MarginFundTransferCalculation(long WalletTypeId, decimal Amount, long UserID, long WalletID, short LeverageChargeDeductionType, decimal Leverage);

        BizResponseClass CallSP_MarginProcess(long WalletTypeId, decimal Amount, long UserID, long WalletID, string TimeStamp, short LeverageChargeDeductionType, ref long RequestId, decimal Leverage);

        BizResponseClass CreateMarginWallet(long WalletTypeId, long UserId);

        BizResponseClass CreateAllMarginWallet(long UserId);

        //BizResponseClass Callsp_MarginChargeWalletCallBGTask(int Hour);  //now use Callsp_MarginChargeWalletCallBGTaskNew

        GetMemberBalRes Callsp_MarginGetMemberBalance(long walletID, long UserID, long WalletMasterID, short BalanceType, decimal Amount, int WalletUsageType);

        BizResponseClass CallSP_AdminMarginChargeRequestApproval(short IsApproved, long ReuestId, string TimeStamp, string Remarks);

        BizResponseClass CallSP_CreateMarginWalletForAllWalletType(long UserId);

        BizResponseClass Callsp_MarginChargeWalletCallBGTaskNew(ref long BatchNo); //ntrivedi 10-04-2019

        BizResponseClass Callsp_MarginProcessLeverageAccountEOD(long loanID, long BatchNo, short ActionType); //ntrivedi 10-04-2019

        MarginWithdrawPreConfirmResponse CallSP_MarginWithdrawCalc(long UserId, string currency); //ntrivedi 13-04-2019

        MarginWithdrawPreConfirmResponse CallSP_MarginWithdraw(long UserId, string currency);//ntrivedi 13-04-2019

        BizResponseClass CallSP_UpgradeLoan(long UserID, long LoanID, decimal LeverageX);//ntrivedi 15-04-2019

    }

    public interface ILPSPRepositories
    {
        GetMemberBalRes Callsp_LPGetMemberBalance(long walletID, long UserID, long WalletMasterID, short BalanceType, decimal Amount, int WalletUsageType);

        BizResponseClass Callsp_HoldWallet(LPHoldDr lPHoldDr, LPWalletMaster dWalletobj);
    }

    public interface IArbitrageSPRepositories
    {
        BizResponseClass sp_CreateMarginWallet(string SMSCode, long UserId);

        BizResponseClass Callsp_ArbitrageHoldWallet(LPHoldDr lPHoldDr, LPArbitrageWalletMaster dWalletobj);

        BizResponseClass Callsp_HoldWallet(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo, enWalletDeductionType enWalletDeductionType);

        BizResponseClass Callsp_ReleaseHoldWallet(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, ref long trnNo);

        BizResponseClass Callsp_ArbitrageCrDrWalletForHold(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType = (long)EnAllowedChannels.Web);

        FundTransferResponse Callsp_CreditArbitrageProviderInitialBalance(ProviderFundTransferRequest request);

        BizResponseClass Callsp_LPArbitrageCrDrWalletForHold(ArbitrageCommonClassCrDr firstCurrObj, string timestamp, enServiceType serviceType, long firstCurrWalletType, long secondCurrWalletType, long channelType = (long)EnAllowedChannels.Web);

        FundTransferResponse Call_sp_ArbitrageWalletFundTransfer(FundTransferRequest Request, long UserId);

        BizResponseClass Callsp_HoldWallet_MarketTrade(ArbitrageWalletMaster dWalletobj, string timestamp, enServiceType serviceType, decimal amount, string coin, EnAllowedChannels channelType, long WalletType, long TrnRefNo, long walletID, long UserID, enTrnType TrnType, enWalletTrnType walletTrnType, enWalletDeductionType enWalletDeductionType);

        FundTransferResponse Call_sp_ArbitrageToTradingWalletFundTransfer(FundTransferRequest Request, long UserId);

        List<WalletType> GetArbitrageChargeWalletType(long? id);

        List<ChargesTypeWise> ListArbitrageChargesTypeWise(long WalletTypeId, long? TrntypeId);
    }
}
