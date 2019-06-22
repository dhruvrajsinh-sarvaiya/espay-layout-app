using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.APIConfiguration
{
    public class UserAPIPlanHistoryResponse :BizResponseClass
    {
        public long TotalCount { get; set; }
        public List<UserAPIPlanHistoryResponseInfo> Response { get; set; }
    }
    // PM.PlanName,PH.Status,PH.Perticuler,PH.ActivationDate,PH.ExpiryDate,PH.Price,PH.Charge,PH.TotalAmt,PH.PaymentStatus
    public class UserAPIPlanHistoryResponseInfo
    {
        public string PlanName { get; set; }
        public short Status { get; set; }
        public string Perticuler { get; set; }
        public DateTime ActivationDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public Decimal Price { get; set; }
        public Decimal Charge { get; set; }
        public Decimal TotalAmt { get; set; }
        public short? PaymentStatus { get; set; }
    }
    public class UserAPIPlanHistoryQryRes
    {
        public string PlanName { get; set; }
        public short Status { get; set; }
        public string Perticuler { get; set; }
        public DateTime ActivationDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public Decimal Price { get; set; }
        public Decimal Charge { get; set; }
        public Decimal TotalAmt { get; set; }
        public short? PaymentStatus { get; set; }
        public short RenewStatus { get; set; }
    }

    public class UserAPIPlanHistoryRequest
    {
        public long? PlanID { get; set; }
        public short? PaymentStatus { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        //[Required]
        public long? Pagesize { get; set; }
        //[Required]
        public long? PageNo { get; set; }
    }
}
