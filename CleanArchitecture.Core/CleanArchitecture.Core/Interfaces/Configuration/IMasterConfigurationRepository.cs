using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Configuration
{
    public interface IMasterConfigurationRepository
    {
        #region "Methods"

        //khuhsali 17-01-2019 for device Id with user list
        List<DeviceUserResponse> GetDeviceList();

        //khushali 18-01-2019
        List<RequestFormatViewModel> GetAllRequestFormat();
        List<CommunicationServiceConfigViewModel> GetCommunicationServiceConfiguration(long ServiceType);
        CommunicationServiceConfigViewModel GetCommunicationServiceConfigurationById(long APIID);

        //khushali 12-01-2019
        List<TemplateParameterInfoRes> TemplateParameterInfo(long? id = null);

        //vsoalnki 14-11-2018
        List<TemplateResponse> GetAllTemplateMaster();

        //vsoalnki 14-11-2018
        TemplateResponse GetTemplateMasterById(long TemplateMasterId);

        //khushali 10-01-2019
        TemplateCategoryMasterRes GetTemplateMasterByCategory(long TemplateMasterId);

        //khushali 12-01-2019
        List<Template> ListTemplateType();

        //vsoalnki 14-11-2018
        ListMessagingQueueRes GetMessagingQueue(DateTime FromDate, DateTime ToDate, short? Status, long? MobileNo, int Page, int? PageSize);

        //vsoalnki 14-11-2018
        ListEmailQueueRes GetEmailQueue(DateTime FromDate, DateTime ToDate, short? Status, string Email, int Page, int? PageSize);

        //vsoalnki 14-11-2018
        List<WalletLedgerResponse> GetWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int? PageSize,ref int TotalCount);

        ////vsoalnki 14-11-2018
        //List<LimitRuleMasterRes> GetLimitRuleById(long LimitRuleMasterId);

        ////vsoalnki 14-11-2018
        //List<LimitRuleMasterRes> GetAllLimitRule();

        ////vsoalnki 14-11-2018
        //List<ChargeRuleMasterRes> GetAllChargeRule();

        ////vsoalnki 14-11-2018
        //List<ChargeRuleMasterRes> GetChargeRuleById(long ChargeRuleMasterId);

        //vsoalnki 15-11-2018
        ListNotificationQueueRes GetNotificationQueue(DateTime FromDate, DateTime ToDate, short? Status, int Page, int? PageSize);

        #endregion

        long GetMaxPlusOneTemplate();

        RptWithdrawalRes GetWithdrawalRpt(DateTime FromDate, DateTime ToDate, string CoinName, long? UserID, short? Status, int PageNo, int? PageSize, string Address, string TrnID, string TrnNo, long? OrgId);
        RptDepositionRes GetDepositionRpt(DateTime FromDate, DateTime ToDate, string CoinName, long? UserID, short? Status, int PageNo, int? PageSize,string Address, string TrnID, long? OrgId);

        long GetTemplate(string tempName);

        List<EmailLists> GetEmailLists();
    }
}
