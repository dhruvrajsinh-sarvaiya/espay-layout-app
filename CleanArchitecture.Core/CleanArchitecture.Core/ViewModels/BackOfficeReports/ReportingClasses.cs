using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOfficeReports
{
    public class RptWithdrawalReq
    {
        [Required(ErrorMessage = "1,Please Enter Required Parameter,4901")]
        public DateTime FromDate { get; set; }
        [Required(ErrorMessage = "1,Please Enter Required Parameter,4901")]
        public DateTime ToDate { get; set; }
        [Required(ErrorMessage = "1,Please Enter Required Parameter,4901")]
        [Range(1, 1000, ErrorMessage = "1,Invalid Parameter,4911")]
        public int PageNo { get; set; }
        public string CoinName { get; set; }
        public short? Status { get; set; }
        public long? UserID { get; set; }
        public int? PageSize { get; set; }
    }

    public class RptWithdrawal
    {
        public string CoinName { get; set; }
        public string StrStatus { get; set; }
        public short Status { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public string TrnID { get; set; }
        public long TrnNo { get; set; }
        public string ExplorerLink { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public long OrgId { get; set; }
        public string OrganizationName { get; set; }
        public string StrAmount { get; set; }
        public int UserId { get; set; }
        public short IsVerified { get; set; }         //Uday 15-01-2019 Add new Parameter Isverified and EmailSendDate
        public DateTime EmailSendDate { get; set; }
        public decimal ChargeRs { get; set; }
        public string ChargeCurrency { get; set; }
        public string ProviderName { get; set; }
        public string TrnResponse { get; set; }
    }

    public class RptWithdrawalRes
    {
        public List<RptWithdrawal> Withdraw { get; set; }
        public BizResponseClass BizResponseObj { get; set; }
        public long TotalCount { get; set; }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
    }


    public class RptDeposition
    {
        public string CoinName { get; set; }
        public string StrStatus { get; set; }
        public short Status { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string StatusMsg { get; set; }
        public string Address { get; set; }
        public string TrnID { get; set; }
        //public long TrnNo { get; set; }
        public string ExplorerLink { get; set; }
    }
    public class RptDepositionRes
    {
        public List<HistoryObjectNew> Deposit { get; set; }
        public BizResponseClass BizResponseObj { get; set; }
        public long TotalCount { get; set; }
        public int PageNo { get; set; }
        public long PageSize { get; set; }
    }

    public class HistoryObjectNew
    {
        public string CoinName { get; set; }//coin
        public string Information { get; set; }//information
        public DateTime Date { get; set; }
        public short Status { get; set; }
        public decimal Amount { get; set; }
        public string Address { get; set; }
        public string StatusStr { get; set; }
        public long Confirmations { get; set; }
        public long TrnNo { get; set; } // ntrivedi 10-12-2018
        public string TrnId { get; set; } // ntrivedi 10-12-2018
        public string ExplorerLink { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public long OrgId { get; set; }
        public string OrganizationName { get; set; }
        public string StrAmount { get; set; }
        public int UserId { get; set; }
    }
    public class SignReportViewmodel
    {
        //public long Id { get; set; }
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string RegType { get; set; }
        public DateTime CreatedDate { get; set; }
        //public bool RegisterStatus { get; set; }//Comment by Pratik 26-03-2019
        public short Status { get; set; }

    }
    public class SignReportModel
    {
        public int Total { get; set; }

        public List<SignReportViewmodel> SignReportList { get; set; }

    }

    public class SignReportCountViewmodel
    {
        public int Today { get; set; }
        public int Weekly { get; set; }
        public int Monthly { get; set; }
        public int Total { get; set; }
    }
    public class SignReportCountResponseViewmodel : BizResponseClass
    {
        public List<SignReportCountViewmodel> signReportCountViewmodels { get; set; }
    }
    public class SignReportViewmodelResponse : BizResponseClass
    {
        public SignReportModel SignReportViewmodes;
    }

    public class ValidationWithdrawal
    {
        public DateTime Date { get; set; }
    }
}
