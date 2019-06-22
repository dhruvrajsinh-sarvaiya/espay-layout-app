using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Wallet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Infrastructure.Data.Configuration
{
    public class MasterConfigurationRepository : IMasterConfigurationRepository
    {
        #region "DI"
        private readonly CleanArchitectureContext _dbContext;

        public MasterConfigurationRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        #endregion

        #region "Methods"


        //khushali 17-01-2019
        #region "User list for android device"

        public List<DeviceUserResponse> GetDeviceList()
        {
            try
            {
                var items = (from tm in _dbContext.DeviceStore
                             join cm in _dbContext.Users
                             on tm.UserID equals cm.Id
                             select new DeviceUserResponse
                             {
                                 DeviceID = tm.DeviceID,
                                 UserID = cm.Id,
                                 FirstName = cm.FirstName,
                                 UserName = cm.UserName,
                                 LastName = cm.LastName
                             }
                             ).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion

        //khushali 18-01-2019
        public List<RequestFormatViewModel> GetAllRequestFormat()
        {
            try
            {

                var items = (from rm in _dbContext.RequestFormatMaster
                             select new RequestFormatViewModel
                             {
                                 RequestID = rm.Id,
                                 RequestFormat = rm.RequestFormat,
                                 RequestName = rm.RequestName,
                                 ContentType = rm.ContentType,
                                 MethodType = rm.MethodType,
                                 RequestType = rm.RequestType,
                                 Status = rm.Status
                             }
                             ).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khushali 18-01-2019
        public List<CommunicationServiceConfigViewModel> GetCommunicationServiceConfiguration(long ServiceType)
        {
            try
            {

                var items = (from am in _dbContext.CommAPIServiceMaster
                             join sm in _dbContext.CommServiceMaster
                             on am.CommServiceID equals sm.Id
                             join sp in _dbContext.CommServiceproviderMaster
                             on sm.CommSerproID equals sp.Id
                             join cm in _dbContext.CommServiceTypeMaster
                             on sp.CommServiceTypeID equals cm.CommServiceTypeID
                             join tp in _dbContext.ThirdPartyAPIConfiguration
                             on sm.ParsingDataID equals tp.Id
                             join rf in _dbContext.RequestFormatMaster
                             on sm.RequestID equals rf.Id
                             where cm.CommServiceTypeID == ServiceType
                             select new CommunicationServiceConfigViewModel
                             {
                                 RequestID = sm.RequestID,
                                 APID = am.Id,
                                 SerproID = sp.Id,
                                 ServiceID = sm.Id,
                                 ServiceTypeID = cm.CommServiceTypeID,
                                 ParsingDataID = sm.ParsingDataID,
                                 Password = sp.Password,
                                 UserID = sp.UserID,
                                 Priority = am.Priority,
                                 SenderID = am.SenderID,
                                 SendURL = am.SMSSendURL,
                                 SerproName = sp.SerproName,
                                 ServiceName = sm.ServiceName,
                                 status = sp.Status,
                                 RequestName = rf.RequestName,
                                 ParsingDataName = tp.APIName
                             }
                             ).ToList();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public CommunicationServiceConfigViewModel GetCommunicationServiceConfigurationById(long APIID)
        {
            try
            {

                var items = (from am in _dbContext.CommAPIServiceMaster
                             join sm in _dbContext.CommServiceMaster
                             on am.CommServiceID equals sm.Id
                             join sp in _dbContext.CommServiceproviderMaster
                             on sm.CommSerproID equals sp.Id
                             join cm in _dbContext.CommServiceTypeMaster
                             on sp.CommServiceTypeID equals cm.CommServiceTypeID
                             join tp in _dbContext.ThirdPartyAPIConfiguration
                             on sm.ParsingDataID equals tp.Id
                             join rf in _dbContext.RequestFormatMaster
                             on sm.RequestID equals rf.Id
                             where am.Id == APIID
                             select new CommunicationServiceConfigViewModel
                             {
                                 RequestID = sm.RequestID,
                                 APID = am.Id,
                                 SerproID = sp.Id,
                                 ServiceID = sm.Id,
                                 ServiceTypeID = cm.CommServiceTypeID,
                                 ParsingDataID = sm.ParsingDataID,
                                 Password = sp.Password,
                                 UserID = sp.UserID,
                                 Priority = am.Priority,
                                 SenderID = am.SenderID,
                                 SendURL = am.SMSSendURL,
                                 SerproName = sp.SerproName,
                                 ServiceName = sm.ServiceName,
                                 status = sp.Status,
                                 RequestName = rf.RequestName,
                                 ParsingDataName = tp.APIName
                             }
                             ).SingleOrDefault();
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 14-11-2018
        public List<TemplateResponse> GetAllTemplateMaster()
        {
            try
            {
                //List<int> AllowTrnType = Helpers.GetEnumValue<EnTemplateType>();

                //var val = Enum.GetNames(typeof(EnTemplateType))
                //  .Cast<string>()
                //  .Select(x => x.ToString())
                //  .ToArray();

                var items = (from tm in _dbContext.TemplateMaster
                             join cm in _dbContext.CommServiceTypeMaster
                             on tm.CommServiceTypeID equals cm.CommServiceTypeID
                             join tcm in _dbContext.TemplateCategoryMaster
                             on tm.TemplateID equals tcm.Id
                             //   join q in AllowTrnType on tm.TemplateID equals q
                             select new TemplateResponse
                             {
                                 ID = tm.Id,
                                 Status = tm.Status,
                                 TemplateID = tm.TemplateID,
                                 TemplateType = tcm.TemplateName,
                                 CommServiceTypeID = tm.CommServiceTypeID,
                                 CommServiceType = cm.CommServiceTypeName,
                                 TemplateName = tm.TemplateName,
                                 Content = tm.Content,
                                 AdditionalInfo = tm.AdditionalInfo,
                                 //IsOnOff = tm.IsOnOff,
                                 ParameterInfo = GetParameters(tcm.ParameterInfo)// tm.ParameterInfo.Split(',')
                             }
                             ).ToList();
                //var items = _TemplateMaster.List();
                // var items = _TemplateMaster.FindBy(i => i.Status == Convert.ToInt16(ServiceStatus.Active));
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khushali 12-01-2019
        public List<TemplateParameterInfoRes> TemplateParameterInfo(long? id = null)
        {
            try
            {
                //List<int> AllowTrnType = Helpers.GetEnumValue<EnTemplateType>();

                //var val = Enum.GetNames(typeof(EnTemplateType))
                //  .Cast<string>()
                //  .Select(x => x.ToString())
                //  .ToArray();
                List<TemplateParameterInfoRes> items = new List<TemplateParameterInfoRes>();
                if (id != null)
                {
                    items = (from tcm in _dbContext.TemplateCategoryMaster
                             join tm in _dbContext.TemplateMaster
                             on tcm.Id equals tm.TemplateID
                             where tm.Id == id
                             select new TemplateParameterInfoRes
                             {
                                 TemplateID = tcm.TemplateId,
                                 TemplateType = tcm.Id,
                                 IsOnOff = tcm.IsOnOff,
                                 ParameterInfo = GetParameters(tcm.ParameterInfo)// tm.ParameterInfo.Split(',')
                             }
                               ).ToList();
                }
                else
                {
                    items = (from tcm in _dbContext.TemplateCategoryMaster
                             join tm in _dbContext.TemplateMaster
                             on tcm.Id equals tm.TemplateID
                             select new TemplateParameterInfoRes
                             {
                                 TemplateID = tcm.TemplateId,
                                 TemplateType = tcm.Id,
                                 IsOnOff = tcm.IsOnOff,
                                 ParameterInfo = GetParameters(tcm.ParameterInfo)// tm.ParameterInfo.Split(',')
                             }
                            ).ToList();
                }

                //var items = _TemplateMaster.List();
                // var items = _TemplateMaster.FindBy(i => i.Status == Convert.ToInt16(ServiceStatus.Active));
                return items;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<ParameterInfo> GetParameters(string Parameter)
        {
            try
            {
                List<ParameterInfo> parameterInfos = new List<ParameterInfo>();
                if (Parameter != null)
                {
                    string[] ParameterDetail = Parameter.Split(',');

                    if (ParameterDetail != null && ParameterDetail.Length > 0)
                    {
                        foreach (var P in ParameterDetail)
                        {
                            string[] Param = P.Split('-');
                            if (Param != null && Param.Length == 2)
                            {
                                parameterInfos.Add(new ParameterInfo
                                {
                                    Name = Param[0],
                                    Aliasname = Param[1]
                                });
                            }
                        }
                    }
                }
                return parameterInfos;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public long GetTemplate(string tempName)
        {
            try
            {
                //var items = (from tm in _dbContext.TemplateMaster
                //             where tm.Status==1
                //             select new Template
                //             {
                //                 TemplateId = tm.TemplateID,
                //                 TemplateName = tm.TemplateName
                //             }
                //             ).ToList();
                var items = Helpers.GetEnumList<EnTemplateType>();

                var id = (from p in items
                          where tempName == p.Key
                          select p.Value).FirstOrDefault();

                return Convert.ToInt64(id);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 14-11-2018
        public TemplateResponse GetTemplateMasterById(long TemplateMasterId)
        {
            try
            {
                //List<int> AllowTrnType = Helpers.GetEnumValue<EnTemplateType>();

                //var val = Enum.GetNames(typeof(EnTemplateType))
                //  .Cast<string>()
                //  .Select(x => x.ToString())
                //  .ToArray();

                var template = (from tm in _dbContext.TemplateMaster
                                join cm in _dbContext.CommServiceTypeMaster
                                on tm.CommServiceTypeID equals cm.CommServiceTypeID
                                join tcm in _dbContext.TemplateCategoryMaster
                                on tm.TemplateID equals tcm.Id
                                // join q in AllowTrnType on tm.TemplateID equals q
                                where tm.Id == TemplateMasterId
                                select new TemplateResponse
                                {
                                    ID = tm.Id,
                                    Status = tm.Status,
                                    TemplateID = tm.TemplateID,
                                    TemplateType = tm.TemplateName,
                                    CommServiceTypeID = tm.CommServiceTypeID,
                                    CommServiceType = cm.CommServiceTypeName,
                                    TemplateName = tm.TemplateName,
                                    Content = tm.Content,
                                    AdditionalInfo = tm.AdditionalInfo,
                                    ParameterInfo = GetParameters(tcm.ParameterInfo)
                                    //IsOnOff = tm.IsOnOff
                                }
                             ).FirstOrDefault();
                return template;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khushali 10-01-2019
        public TemplateCategoryMasterRes GetTemplateMasterByCategory(long TemplateMasterId)
        {
            try
            {
                //List<int> AllowTrnType = Helpers.GetEnumValue<EnTemplateType>();

                //var val = Enum.GetNames(typeof(EnTemplateType))
                //  .Cast<string>()
                //  .Select(x => x.ToString())
                //  .ToArray();
                TemplateCategoryMasterRes TemplateCategory = new TemplateCategoryMasterRes();
                var template = (from tm in _dbContext.TemplateMaster
                                join cm in _dbContext.CommServiceTypeMaster
                                on tm.CommServiceTypeID equals cm.CommServiceTypeID
                                // join q in AllowTrnType on tm.TemplateID equals q
                                where tm.TemplateID == TemplateMasterId && tm.Status == 1
                                select new TemplateResponse
                                {
                                    ID = tm.Id,
                                    Status = tm.Status,
                                    TemplateID = tm.TemplateID,
                                    TemplateType = tm.TemplateName,
                                    CommServiceTypeID = tm.CommServiceTypeID,
                                    CommServiceType = cm.CommServiceTypeName,
                                    TemplateName = tm.TemplateName,
                                    Content = tm.Content,
                                    AdditionalInfo = tm.AdditionalInfo
                                    //ParameterInfo = tm.ParameterInfo
                                }
                             ).ToList();

                var Result = (from tm in _dbContext.TemplateCategoryMaster
                              where tm.Id == TemplateMasterId
                              select new { tm.IsOnOff, tm.TemplateId }).Single();

                TemplateCategory.TemplateMasterObj = template;
                TemplateCategory.IsOnOff = Result.IsOnOff;
                TemplateCategory.TemplateID = Result.TemplateId;
                return TemplateCategory;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khuhshali 12-01-2019
        public List<Template> ListTemplateType()
        {
            try
            {

                List<Template> TemplateCategory = new List<Template>();
                var template = (from tm in _dbContext.TemplateCategoryMaster
                                select new Template
                                {
                                    TemplateID = tm.TemplateId,
                                    IsOnOff = tm.IsOnOff,
                                    Key = tm.Id,
                                    Value = tm.TemplateName,
                                    ServiceType = tm.CommServiceTypeID
                                    //ParameterInfo = tm.ParameterInfo
                                }
                             ).ToList();
                return template;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 14-11-2018
        public ListMessagingQueueRes GetMessagingQueue(DateTime FromDate, DateTime ToDate, short? Status, long? MobileNo, int Page, int? PageSize)
        {
            try
            {
                ListMessagingQueueRes listMessagingQueueRes = new ListMessagingQueueRes();
                var items = (from u in _dbContext.MessagingQueue
                             where u.CreatedDate >= FromDate && u.CreatedDate <= ToDate && (Status == null || (u.Status == Status && Status != null)) && (MobileNo == null || (u.MobileNo == MobileNo && MobileNo != null))
                             orderby u.Id descending
                             select new MessagingQueueRes
                             {
                                 MessageID = u.Id, // khushali 17-01-2019 for resend function
                                 Status = u.Status,
                                 MobileNo = u.MobileNo,
                                 SMSDate = u.CreatedDate.ToString("dd-MM-yyyy h:mm:ss tt"),
                                 SMSText = u.SMSText,
                                 StrStatus = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 6) ? "Pending" : (u.Status == 4) ? "Hold" : "Fail"
                             }
                             ).ToList();
                listMessagingQueueRes.Count = items.Count; // khushali 11-01-2019  list filter so first assign list count 
                var pagesize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                listMessagingQueueRes.TotalPage = Convert.ToInt64(fl);
                if (Page > 0)
                {
                    if (PageSize == null)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (Page - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }
                listMessagingQueueRes.MessagingQueueObj = items;
                listMessagingQueueRes.PageSize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                return listMessagingQueueRes;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsoalnki 14-11-2018
        public ListEmailQueueRes GetEmailQueue(DateTime FromDate, DateTime ToDate, short? Status, string Email, int Page, int? PageSize)
        {
            try
            {
                //MessageStatusType
                //var val = Enum.GetNames(typeof(MessageStatusType))
                //    .Cast<string>()
                //    .Select(x => x.ToString())
                //    .ToArray();
                //List<int> msgInt = Helpers.GetEnumValue<MessageStatusType>();
                ListEmailQueueRes listEmailQueueRes = new ListEmailQueueRes();
                var items = (from u in _dbContext.EmailQueue
                                 //join q in msgInt
                                 //on u.Status equals q
                             where u.CreatedDate >= FromDate && u.CreatedDate <= ToDate && (Status == null || (u.Status == Status && Status != null)) && (Email == null || (u.Recepient == Email && Email != null))
                             orderby u.Id descending
                             select new EmailQueueRes
                             {
                                 EmailID = u.Id, // khushali 17-01-2019 for resend function
                                 Status = u.Status,
                                 RecepientEmail = u.Recepient,
                                 EmailDate = u.CreatedDate.ToString("dd-MM-yyyy h:mm:ss tt"),
                                 Body = u.Body,
                                 CC = u.CC,
                                 BCC = u.BCC,
                                 Subject = u.Subject,
                                 Attachment = u.Attachment,
                                 EmailType = u.EmailType.ToString(),
                                 StrStatus = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 6) ? "Pending" : (u.Status == 4) ? "Hold" : "Fail"
                             }
                             ).ToList();

                listEmailQueueRes.Count = items.Count; // khushali 11-01-2019  list filter so first assign list count 
                var pagesize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                listEmailQueueRes.TotalPage = Convert.ToInt64(fl);

                if (Page > 0)
                {
                    if (PageSize == null)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (Page - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }
                listEmailQueueRes.EmailQueueObj = items;
                listEmailQueueRes.PageSize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                return listEmailQueueRes;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 14-11-2018
        public List<WalletLedgerResponse> GetWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int? PageSize, ref int TotalCount)
        {

            List<WalletLedgerResponse> wl = (from w in _dbContext.WalletLedgers
                                             where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                             orderby w.TrnDate ascending
                                             select new WalletLedgerResponse
                                             {
                                                 LedgerId = w.Id,
                                                 PreBal = w.PreBal,
                                                 PostBal = w.PreBal,
                                                 Remarks = "Opening Balance",
                                                 Amount = 0,
                                                 CrAmount = 0,
                                                 DrAmount = 0,
                                                 TrnDate = w.TrnDate.ToString("dd-MM-yyyy h:mm:ss tt")
                                             }).Take(1).Union((from w in _dbContext.WalletLedgers
                                                               where w.WalletId == WalletId && w.TrnDate >= FromDate && w.TrnDate <= ToDate && w.Type == enBalanceType.AvailableBalance
                                                               orderby w.TrnDate ascending
                                                               select new WalletLedgerResponse
                                                               {
                                                                   LedgerId = w.Id,
                                                                   PreBal = w.PreBal,
                                                                   PostBal = w.PostBal,
                                                                   Remarks = w.Remarks,
                                                                   Amount = w.CrAmt > 0 ? w.CrAmt : w.DrAmt,
                                                                   CrAmount = w.CrAmt,
                                                                   DrAmount = w.DrAmt,
                                                                   TrnDate = w.TrnDate.ToString("dd-MM-yyyy h:mm:ss tt")
                                                               })).ToList();
            TotalCount = wl.Count();

            if (page > 0)
            {
                if (PageSize == null)
                {
                    int skip = Helpers.PageSize * (page - 1);
                    wl = wl.Skip(skip).Take(Helpers.PageSize).ToList();
                }
                else
                {
                    int skip = Convert.ToInt32(PageSize) * (page - 1);
                    wl = wl.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                }
            }
            //var bal = wl[0].PreBal;
            decimal DrAmount = 0, CrAmount = 0, Amount = 0;
            wl.ForEach(e =>
            {
                Amount = e.PreBal + e.CrAmount - e.DrAmount;
                e.PostBal = Amount;
                e.PreBal = e.PostBal + e.DrAmount - e.CrAmount;

            });
            return wl;
        }

        //vsoalnki 14-11-2018
        //public List<LimitRuleMasterRes> GetAllLimitRule()
        //{
        //    try
        //    {
        //        //List<int> AllowTrnType = Helpers.GetEnumValue<enTrnType>();

        //        //var trntype = Enum.GetNames(typeof(enTrnType))
        //        //.Cast<string>()
        //        //.Select(x => x.ToString())
        //        //.ToArray();

        //        var items = (from tm in _dbContext.LimitRuleMaster
        //                     join cm in _dbContext.WalletTypeMasters
        //                     on tm.WalletType equals cm.Id
        //                     join trn in _dbContext.TrnTypeMaster
        //                     on tm.TrnType equals trn.TrnTypeId
        //                     select new LimitRuleMasterRes
        //                     {
        //                         Status = tm.Status,
        //                         Id = tm.Id,
        //                         Name = tm.Name,
        //                         TrnType = tm.TrnType,
        //                         StrTrnType = trn.TrnTypeName,
        //                         MinAmount = tm.MinAmount,
        //                         MaxAmount = tm.MaxAmount,
        //                         WalletTypeName = cm.WalletTypeName,
        //                         WalletType = tm.WalletType,
        //                         StatusStr = (tm.Status == 9) ? "Disable" : (tm.Status == 1) ? "Active" : "InActive"
        //                     }
        //                     ).ToList();
        //        return items;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        ////vsoalnki 14-11-2018
        //public List<LimitRuleMasterRes> GetLimitRuleById(long LimitRuleMasterId)
        //{
        //    try
        //    {
        //        //List<int> AllowTrnType = Helpers.GetEnumValue<enTrnType>();

        //        //var trntype = Enum.GetNames(typeof(enTrnType))
        //        //.Cast<string>()
        //        //.Select(x => x.ToString())
        //        //.ToArray();


        //        var template = (from tm in _dbContext.LimitRuleMaster
        //                        join cm in _dbContext.WalletTypeMasters
        //                        on tm.WalletType equals cm.Id
        //                        join trn in _dbContext.TrnTypeMaster
        //                       on tm.TrnType equals trn.TrnTypeId
        //                        where tm.Id == LimitRuleMasterId
        //                        select new LimitRuleMasterRes
        //                        {
        //                            Status = tm.Status,
        //                            Id = tm.Id,
        //                            Name = tm.Name,
        //                            TrnType = tm.TrnType,
        //                            StrTrnType = trn.TrnTypeName,
        //                            MinAmount = tm.MinAmount,
        //                            MaxAmount = tm.MaxAmount,
        //                            WalletTypeName = cm.WalletTypeName,
        //                            WalletType = tm.WalletType,
        //                            StatusStr = (tm.Status == 9) ? "Disable" : (tm.Status == 1) ? "Active" : "InActive"
        //                        }
        //                     ).ToList();
        //        return template;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        ////vsoalnki 14-11-2018
        //public List<ChargeRuleMasterRes> GetAllChargeRule()
        //{
        //    try
        //    {
        //        var items = (from tm in _dbContext.ChargeRuleMaster
        //                     join cm in _dbContext.WalletTypeMasters
        //                     on tm.WalletType equals cm.Id
        //                     join trn in _dbContext.TrnTypeMaster
        //                     on tm.TrnType equals trn.TrnTypeId
        //                     select new ChargeRuleMasterRes
        //                     {
        //                         Status = tm.Status,
        //                         Id = tm.Id,
        //                         Name = tm.Name,
        //                         TrnType = tm.TrnType,
        //                         StrTrnType = trn.TrnTypeName,
        //                         MinAmount = tm.MinAmount,
        //                         MaxAmount = tm.MaxAmount,
        //                         WalletTypeName = cm.WalletTypeName,
        //                         WalletType = tm.WalletType,
        //                         StatusStr = (tm.Status == 9) ? "Disable" : (tm.Status == 1) ? "Active" : "InActive",
        //                         ChargeValue = tm.ChargeValue,
        //                         ChargeType = (tm.ChargeType == enChargeType.Fixed) ? "Fixed" : "Pecentage"
        //                     }
        //                     ).ToList();
        //        return items;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //vsoalnki 14-11-2018
        //public List<ChargeRuleMasterRes> GetChargeRuleById(long ChargeRuleMasterId)
        //{
        //    try
        //    {
        //        var items = (from tm in _dbContext.ChargeRuleMaster
        //                     join cm in _dbContext.WalletTypeMasters
        //                     on tm.WalletType equals cm.Id
        //                     join trn in _dbContext.TrnTypeMaster
        //                     on tm.TrnType equals trn.TrnTypeId
        //                     where tm.Id == ChargeRuleMasterId
        //                     select new ChargeRuleMasterRes
        //                     {
        //                         Status = tm.Status,
        //                         Id = tm.Id,
        //                         Name = tm.Name,
        //                         TrnType = tm.TrnType,
        //                         StrTrnType = trn.TrnTypeName,
        //                         MinAmount = tm.MinAmount,
        //                         MaxAmount = tm.MaxAmount,
        //                         WalletTypeName = cm.WalletTypeName,
        //                         WalletType = tm.WalletType,
        //                         StatusStr = (tm.Status == 9) ? "Disable" : (tm.Status == 1) ? "Active" : "InActive",
        //                         ChargeValue = tm.ChargeValue,
        //                         ChargeType = (tm.ChargeType == enChargeType.Fixed) ? "Fixed" : "Pecentage"
        //                     }
        //                  ).ToList();
        //        return items;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}


        //vsoalnki 15-11-2018

        public ListNotificationQueueRes GetNotificationQueue(DateTime FromDate, DateTime ToDate, short? Status, int Page, int? PageSize)
        {
            ListNotificationQueueRes listNotificationQueueRes = new ListNotificationQueueRes();
            try
            {
                var items = (from u in _dbContext.NotificationQueue
                                 //join d in _dbContext.DeviceStore
                                 //on u.DeviceID equals d.DeviceID
                                 //join us in _dbContext.Users
                                 //on d.UserID equals us.Id
                             where u.CreatedDate >= FromDate && u.CreatedDate <= ToDate && (Status == null || (u.Status == Status && Status != null))
                             orderby u.Id descending
                             select new NotificationQueueRes
                             {
                                 NotificationID = u.Id, // khushali 17-01-2019 for resend function
                                 Status = u.Status,
                                 NotificationDate = u.CreatedDate.ToString("dd-MM-yyyy h:mm:ss tt"),
                                 StrStatus = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 6) ? "Pending" : (u.Status == 4) ? "Hold" : "Fail",
                                 UserName = "-",
                                 Subject = u.Subject,
                                 Message = u.Message,
                                 DeviceID = u.DeviceID,
                                 ContentTitle = u.ContentTitle,
                                 TickerText = u.TickerText
                             }
                             ).ToList();

                listNotificationQueueRes.Count = items.Count; // khushali 11-01-2019  list filter so first assign list count 
                var pagesize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                listNotificationQueueRes.TotalPage = Convert.ToInt64(fl);

                if (Page > 0)
                {
                    if (PageSize == null)
                    {
                        int skip = Helpers.PageSize * (Page - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (Page - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }
                listNotificationQueueRes.NotificationQueueObj = items;
                listNotificationQueueRes.PageSize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                return listNotificationQueueRes;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public long GetMaxPlusOneTemplate()
        {
            try
            {
                var data = _dbContext.TemplateMaster.Max(item => item.TemplateID);
                return Convert.ToInt64(data + 1);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public RptWithdrawalRes GetWithdrawalRpt(DateTime FromDate, DateTime ToDate, string CoinName, long? UserID, short? Status, int PageNo, int? PageSize, string Address, string TrnID, string TrnNo, long? OrgId)
        {
            RptWithdrawalRes Response = new RptWithdrawalRes();
            Response.PageNo = PageNo;
            try
            {
                #region Old Code
                //var items = (from u in _dbContext.TransactionQueue
                //                             join w in _dbContext.WithdrawHistory
                //                             on u.Id equals w.TrnNo into ps
                //                             from w in ps.DefaultIfEmpty()
                //                             where u.TrnType == 6
                //                                    && u.TrnDate >= FromDate && u.TrnDate <= ToDate
                //                                    && (Status == null || (u.Status == Status && Status != null))
                //                                    && (CoinName == null || (u.SMSCode == CoinName && CoinName != null))
                //                                    && (UserID == null || (u.MemberID == UserID && UserID != null))
                //                             //&& (Request.Amount == null || (u.Amount == Amount && Amount != null))
                //                             //&& u.MemberID == Userid
                //                             select new RptWithdrawal
                //                             {
                //                                 CoinName = u.SMSCode,
                //                                 Status = u.Status,
                //                                 FromAddress = w == null ? "Not Available" : w.Address,
                //                                 ToAddress = u.TransactionAccount == null ? "Not Available" : u.TransactionAccount,
                //                                 TrnID = w == null ? "Not Available" : w.TrnID,
                //                                 TrnNo = w == null ? 0 : w.TrnNo,
                //                                 Amount = u.Amount,
                //                                 Date = u.CreatedDate,
                //                                 StrStatus = (u.Status == 0) ? "Initialize" : (u.Status == 1) ? "Success" : (u.Status == 2) ? "OperatorFail" : (u.Status == 3) ? "SystemFail" : (u.Status == 4) ? "Hold" : (u.Status == 5) ? "Refunded" : "Pending"
                //                                 //Address = u.TransactionAccount == null ? "Not" : u.TransactionAccount,
                //                                 //Confirmations = w == null ? 0 : w.Confirmations,
                //                                 //Information = u.StatusMsg == null ? "Not Found" : u.StatusMsg,
                //                             }).AsEnumerable().ToList();
                #endregion
                //ntrivedi for duplicate record showing added walletmaster join 23-03-2019
                //Uday 15-01-2019 Add new Parameter Isverified and EmailSendDate JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',
                var items = _dbContext.RptWithdrawal.FromSql(@"SELECT ISNULL(SPM.ProviderName,'') AS ProviderName,ISNULL(ResponseData,'') as TrnResponse,  ISNULL( u.ChargeCurrency,'') AS ChargeCurrency,ISNULL(u.ChargeRs,0) as ChargeRs,Isnull(o.Id,0) as OrgId,o.OrganizationName,u.SMSCode as 'CoinName' ,
                        ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',                                                                
                        u.Status,bu.id as UserId,bu.UserName AS 'UserName',ISNULL(bu.Email,'') as Email ,
                        ISNULL( w.Address,'Not Available') as 'FromAddress',ISNULL(u.TransactionAccount,'Not Available') as 'ToAddress',
                        ISNULL(w.TrnID,'Not Available') as TrnID,ISNULL(w.TrnNo,'0') as TrnNo,u.Amount,u.CreatedDate as 'Date',
                        CASE When u.Status = 4 or u.Status = 6 Then 
                        Case When u.IsVerified = 0 Then 'ConfirmationPending' When u.IsVerified = 1 Then 'Confirm' When u.IsVerified = 9 Then 'Cancelled' End
                        Else CASE u.Status WHEN 0 THEN 'Initialize' WHEN 1 THEN 'Success' WHEN 2 THEN 'OperatorFail' 
                        WHEN 3 THEN 'SystemFail'  WHEn 4 THEN 'Hold' WHEN 5 THEN 'Refunded' WHEN 6 THEN 'Pending' 
                        ELSE 'Other' END End AS 'StrStatus',u.IsVerified as 'IsVerified',u.EmailSendDate as 'EmailSendDate',
                        cast(u.Amount as varchar) as StrAmount FROM TransactionQueue u LEFT  JOIN Transactionrequest TR ON TR.Trnno=u.Id 
						LEFT JOIN ServiceProviderMaster SPM ON SPM.Id= u.SerproId 
                        LEFT JOIN WithdrawHistory w ON w.TrnNo=u.Id 
                        LEFT JOIN ServiceMaster s ON s.SMSCode=u.SMSCode 
                        inner JOIN BizUser bu ON bu.Id= u.MemberID 
                        inner join WalletMasters wM on W.WalletID=WM.ID
                        LEFT JOIN ServiceDetail sd ON sd.ServiceId=u.serviceid 
                        LEFT join Organizationmaster o on o.id=wM.OrgID                     
                        WHERE u.TrnType = 6 and u.TrnDate between {0} and {1} and (u.Status={2} or {2}=0) and (u.SMSCode={3} or {3}='') and  (u.MemberID={4} or {4}=0) and (u.TransactionAccount={5} OR {5}='') and (w.trnid={6} or {6}='') and (w.TrnNo={7} or {7}='') and (wm.OrgId={8} or {8}=0)", FromDate, ToDate, (Status == null ? 0 : Status), (CoinName == null ? "" : CoinName), (UserID == null ? 0 : UserID), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID), (TrnNo == null ? "" : TrnNo), (OrgId == null ? 0 : OrgId)).ToList();
                Response.TotalCount = items.Count();

                var pagesize = (PageSize == null || PageSize == 0) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                Response.PageSize = Convert.ToInt32(pagesize);
                var it = Convert.ToDouble(items.Count) / pagesize;
                var fl = Math.Ceiling(it);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == null || PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }
                Response.Withdraw = items;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }


        public RptDepositionRes GetDepositionRpt(DateTime FromDate, DateTime ToDate, string CoinName, long? UserID, short? Status, int PageNo, int? PageSize, string Address, string TrnID, long? OrgId)
        {
            RptDepositionRes Response = new RptDepositionRes();
            Response.PageNo = PageNo;
            //JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer') AS 'ExplorerLink',
            try
            {
                #region Old Code
                //var items = (from d in _dbContext.DepositHistory
                //             where d.CreatedDate >= FromDate && d.CreatedDate <= ToDate
                //                    && (Status == null || (d.Status == Status && Status != null))
                //                    && (CoinName == null || (d.SMSCode == CoinName && CoinName != null))
                //                    && (UserID == null || (d.UserId == UserID && UserID != null))
                //                    && (Address == null || (d.Address == Address && Address != null))
                //             select new RptDeposition
                //             {
                //                 CoinName = d.SMSCode,
                //                 Status = d.Status,
                //                 Address = d.Address,
                //                 TrnID = d.TrnID,
                //                 Amount = d.Amount,
                //                 Date = d.CreatedDate,
                //                 StatusMsg = d.StatusMsg,
                //                 StrStatus = (d.Status == 0) ? "Initialize" : (d.Status == 1) ? "Success" : (d.Status == 2) ? "OperatorFail" : (d.Status == 3) ? "SystemFail" : (d.Status == 4) ? "Hold" : (d.Status == 5) ? "Refunded" : "Pending"
                //             }).AsEnumerable().ToList();
                #endregion
                //ntrivedi for duplicate record showing added walletmaster join 23-03-2019
                List<HistoryObjectNew> items = new List<HistoryObjectNew>();
                if (TrnID != null)
                {
                    items = _dbContext.HistoryObjectNew.FromSql(@"SELECT  o.Id as OrgId,o.OrganizationName,D.Id AS 'TrnNo',ISNULL(D.TrnID,0) AS 'TrnId',D.SMSCode AS 'CoinName',D.Status,
                            D.StatusMsg AS 'Information',D.Amount,D.CreatedDate AS 'Date',D.Address,
                            ISNULL(D.Confirmations,0) AS 'Confirmations',
                            (CASE D.Status WHEN 0 THEN 'Processing' WHEN 1 THEN 'Success' WHEN 9 THEN 'Failed ' 
                            else 'other' END) AS 'StatusStr',                            
                            ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',                                                                
                            u.UserName AS 'UserName',u.id as UserId,ISNULL(u.Email,'') as Email ,cast(D.Amount as varchar) as StrAmount FROM DepositHistory D 
                            INNER JOIN ServiceMaster SM ON D.SMSCode = SM.SMSCode
                            INNER JOIN ServiceDetail SD ON SD.ServiceId = SM.Id
							
							INNER JOIN BizUser u ON u.Id= D.UserId  inner join AddressMasters AM on AM.OriginalAddress=D.Address
							inner join WalletMasters WM on WM.ID=AM.WalletID and wm.WalletTypeID=sm.WalletTypeID inner join Organizationmaster o on o.id=wm.OrgID 
                            WHERE  (D.TrnID={0} or {0}='')
                            ORDER BY D.CreatedDate DESC,D.ID DESC", (TrnID == null ? "" : TrnID)).ToList();
                }
                else
                {
                    items = _dbContext.HistoryObjectNew.FromSql(@"SELECT  o.Id as OrgId,o.OrganizationName,D.Id AS 'TrnNo',ISNULL(D.TrnID,0) AS 'TrnId',D.SMSCode AS 'CoinName',D.Status,
                            D.StatusMsg AS 'Information',D.Amount,D.CreatedDate AS 'Date',D.Address,
                            ISNULL(D.Confirmations,0) AS 'Confirmations',
                            (CASE D.Status WHEN 0 THEN 'Processing' WHEN 1 THEN 'Success' WHEN 9 THEN 'Failed ' 
                            else 'other' END) AS 'StatusStr',                            
                            ISNULL(JSON_QUERY(CAST(ServiceDetailJson as varchar(8000)), '$.Explorer'),'[]') AS 'ExplorerLink',                                                                
                            u.UserName AS 'UserName',u.id as UserId,ISNULL(u.Email,'') as Email ,cast(D.Amount as varchar) as StrAmount FROM DepositHistory D 
                            INNER JOIN ServiceMaster SM ON D.SMSCode = SM.SMSCode
                            INNER JOIN ServiceDetail SD ON SD.ServiceId = SM.Id
							
							INNER JOIN BizUser u ON u.Id= D.UserId  inner join AddressMasters AM on AM.OriginalAddress=D.Address
							inner join WalletMasters WM on WM.ID=AM.WalletID and wm.WalletTypeID=sm.WalletTypeID inner join Organizationmaster o on o.id=wm.OrgID 
                            WHERE (D.UserId={0} OR {0}=0) AND D.CreatedDate BETWEEN {1} AND {2} AND (D.Status={3} OR {3}=999) 
                            AND ({4}='' OR D.SMSCode={4}) AND (D.Address={5} OR {5}='') AND (D.TrnID={6} or {6}='' and (wm.OrgId={7} or {7}=0))
                            ORDER BY D.CreatedDate DESC,D.ID DESC", (UserID == null ? 0 : UserID), FromDate, ToDate, (Status == null ? 999 : Status), (CoinName == null ? "" : CoinName), (Address == null ? "" : Address), (TrnID == null ? "" : TrnID), (OrgId == null ? 0 : OrgId)).ToList();
                }

                Response.TotalCount = items.Count();
                var pagesize = (PageSize == null || PageSize == 0) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                var it = Convert.ToDouble(items.Count()) / pagesize;
                var fl = Math.Ceiling(it);
                //   Response.TotalPages = Convert.ToInt32(fl);
                PageNo = PageNo + 1;
                if (PageNo > 0)
                {
                    if (PageSize == null || PageSize == 0)
                    {
                        int skip = Helpers.PageSize * (PageNo - 1);
                        items = items.Skip(skip).Take(Helpers.PageSize).ToList();
                    }
                    else
                    {
                        int skip = Convert.ToInt32(PageSize) * (PageNo - 1);
                        items = items.Skip(skip).Take(Convert.ToInt32(PageSize)).ToList();
                    }
                }
                Response.Deposit = items;
                Response.PageSize = (PageSize == null) ? Helpers.PageSize : Convert.ToInt64(PageSize);
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public List<EmailLists> GetEmailLists()
        {
            try
            {
                List<EmailLists> lists = new List<EmailLists>();
                lists = _dbContext.emailLists.FromSql("SELECT distinct(Email) AS emailid FROM Bizuser WHERE EmailConfirmed=1 AND Email<> ''").ToList();
                //lists= _dbContext.emailLists.FromSql("SELECT Email AS emailid FROM Bizuser WHERE EmailConfirmed=1 AND Email<> '' and id in(63,76,11,12,13,14,15)").ToList();
                return lists;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #endregion
    }
}
