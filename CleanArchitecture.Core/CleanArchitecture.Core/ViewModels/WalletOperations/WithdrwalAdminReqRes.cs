using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.WalletOperations
{
    public class WithdrwalAdminReqRes
    {
        public long AdminReqId { get; set; }
        public long TrnNo { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public DateTime TrnDate { get; set; }
        public long ActionByUserId { get; set; }
        public string ActionByUserName { get; set; }
        public DateTime? ActionDate { get; set; }
        public short Status { get; set; }
        public string StrStatus { get; set; }
        public string Remarks { get; set; }
    }

    public class ListWithdrawalAdminRes : BizResponseClass
    {
        public List<WithdrwalAdminReqRes> Data { get; set; }
    }

    public class WithdrwalAdminReq
    {
        [Required(ErrorMessage ="1,Please Enter Required Parameter,17079")]
        public long AdminReqId { get; set; }

        [Required(ErrorMessage = "1,Please Enter Required Parameter,17080")]
        public ApprovalStatus Bit { get; set; }

        [Required(ErrorMessage = "1,Please Enter Required Parameter,17081")]
        public string Remarks { get; set; }
    }
}
