﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.Entities
{   
    public class TransactionQueue : BizBase
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long TrnNo { get; set; }
        public Guid GUID { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime TrnDate { get; set; }
        //[Required]
        //public DateTime SMSDate { get; set; }
        [Required]
        public short TrnMode { get; set; }
        [Required]
        public short TrnType { get; set; }
        [Required]
        public long MemberID { get; set; }
        //[Required]
        public string MemberMobile { get; set; }
        //[Required]
        //public string SMSText { get; set; }

        [Required]
        [StringLength(10)]
        public string SMSCode { get; set; }

        [Required]
        [StringLength(200)]
        public string TransactionAccount { get; set; }//Mob for txn , address for crypto

        [Required]
        //[Range(0, 9999999999.99999999)]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Amount { get; set; }

        //[Required]
        //[StringLength(4)]
        //public string SMSPwd { get; set; }

        //[Required]
        //public short IsSTV { get; set; }

        [DefaultValue(0)]
        public long ServiceID { get; set; }
        [DefaultValue(0)]
        public long SerProID { get; set; }
        [DefaultValue(0)]
        public long ProductID { get; set; }
        [DefaultValue(0)]
        //public int ItemID { get; set; }
        public long RouteID { get; set; }//change column as new structure
        //[Required]
        //public short Status { get; set; }

        public long StatusCode { get; set; }
       
        public string StatusMsg { get; set; }
        [DefaultValue(0)]
        public short VerifyDone { get; set; }

        public string TrnRefNo { get; set; }
        public string ChargeCurrency { get; set; }
        //[Required]
        //public double DiscPer { get; set; }
        //[Required]
        //public decimal DiscRs { get; set; }
        //[Required]
        //public double ORDiscPer { get; set; }
        //[Required]
        //public decimal ORDiscRs { get; set; }
        //[Required]
        //public double SPDiscPer { get; set; }
        //[Required]
        //public decimal SPDiscRs { get; set; }
        //[Required]
        //public double SDDiscPer { get; set; }
        //[Required]
        //public decimal SDDiscRs { get; set; }
        //[Required]
        //public double DTDiscPer { get; set; }
        //[Required]
        //public decimal DTDiscRs { get; set; }
        //[Required]
        //public double RTDiscPer { get; set; }
        //[Required]
        //public decimal RTDiscRs { get; set; }
        //public decimal? OfferedFare { get; set; }
        //public decimal? MarkupValue { get; set; }
        //public long? CouponNo { get; set; }
        public string AdditionalInfo { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargePer { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargeRs { get; set; }

        public short? ChargeType { get; set; }

        public string DebitAccountID { get; set; }

        public short IsVerified { get; set; }       //Uday 11-01-2019 Check For Withdrwal Transaction Is Confirm Or Not

        public short IsInternalTrn { get; set; }    //Uday 11-01-2019 Check For Withdrwal Transaction Is Internal Or OutSide

        [DefaultValue(0)]
        public short IsVerifiedByAdmin { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime EmailSendDate { get; set; } //Uday 11-01-2019 For Withdrwal Transaction Resend Confirmation Email.
        
        public short CallStatus { get; set; } = 0; // khushali 24-01-2019 for LP status Check 

        public object Clone()//for copy object
        {
            return MemberwiseClone();
        }
        //public List<BaseDomainEvent> Events = new List<BaseDomainEvent>();
        public void MakeTransactionInProcess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Pending);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }

        public void MakeTransactionSuccess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Success);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionSystemFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.SystemFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionHold()
        {
            Status = Convert.ToInt16(enTransactionStatus.Hold);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionInActive()
        {
            Status = Convert.ToInt16(enTransactionStatus.InActive);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionOperatorFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void SetTransactionCode(long statuscode)
        {
            StatusCode = statuscode;
            AddValueChangeEvent();
        }
        public void SetTransactionStatusMsg(string statusMsg)
        {
            StatusMsg = statusMsg;
            AddValueChangeEvent();
        }
        public void SetServiceProviderData(long iServiceID,long iSerProID, long iProductID, long iRouteID)
        {
            ServiceID = iServiceID;
            SerProID = iSerProID;
            ProductID = iProductID;
            RouteID = iRouteID;
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TransactionQueue>(this));
        }

    }
    public class TransactionQueueMargin : BizBase
    {
        public Guid GUID { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime TrnDate { get; set; }       
        [Required]
        public short TrnMode { get; set; }
        [Required]
        public short TrnType { get; set; }
        [Required]
        public long MemberID { get; set; }       
        public string MemberMobile { get; set; }
        [Required]
        [StringLength(10)]
        public string SMSCode { get; set; }
        [Required]
        [StringLength(200)]
        public string TransactionAccount { get; set; }
        [Required]        
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Amount { get; set; }
        [DefaultValue(0)]
        public long ServiceID { get; set; }
        [DefaultValue(0)]
        public long SerProID { get; set; }
        [DefaultValue(0)]
        public long ProductID { get; set; }
        [DefaultValue(0)]
        public long RouteID { get; set; }
        public long StatusCode { get; set; }
        public string StatusMsg { get; set; }
        [DefaultValue(0)]
        public short VerifyDone { get; set; }
        public string TrnRefNo { get; set; }
        public string AdditionalInfo { get; set; }
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargePer { get; set; }
        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargeRs { get; set; }
        public short? ChargeType { get; set; }
        public string DebitAccountID { get; set; }
        public short IsVerified { get; set; }
        public short IsInternalTrn { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime EmailSendDate { get; set; }
        public short CallStatus { get; set; } = 0;
        public string ChargeCurrency { get; set; } //2019-4-29
        public object Clone()
        {
            return MemberwiseClone();
        }        
        public void MakeTransactionInProcess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Pending);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionSuccess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Success);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionSystemFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.SystemFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionHold()
        {
            Status = Convert.ToInt16(enTransactionStatus.Hold);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionInActive()
        {
            Status = Convert.ToInt16(enTransactionStatus.InActive);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionOperatorFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void SetTransactionCode(long statuscode)
        {
            StatusCode = statuscode;
            AddValueChangeEvent();
        }
        public void SetTransactionStatusMsg(string statusMsg)
        {
            StatusMsg = statusMsg;
            AddValueChangeEvent();
        }
        public void SetServiceProviderData(long iServiceID, long iSerProID, long iProductID, long iRouteID)
        {
            ServiceID = iServiceID;
            SerProID = iSerProID;
            ProductID = iProductID;
            RouteID = iRouteID;
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TransactionQueueMargin>(this));
        }

    }

    public class TransactionQueueArbitrage : BizBase
    {
        public Guid GUID { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime TrnDate { get; set; }
        [Required]
        public short TrnMode { get; set; }
        [Required]
        public short TrnType { get; set; }
        [Required]
        public long MemberID { get; set; }
        public string MemberMobile { get; set; }

        [Required]
        [StringLength(10)]
        public string SMSCode { get; set; }

        [Required]
        [StringLength(200)]
        public string TransactionAccount { get; set; }//Mob for txn , address for crypto

        [Required]
        //[Range(0, 9999999999.99999999)]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Amount { get; set; }
        [DefaultValue(0)]
        public long ServiceID { get; set; }
        [DefaultValue(0)]
        public long SerProID { get; set; }
        [DefaultValue(0)]
        public long ProductID { get; set; }
        [DefaultValue(0)]

        public long RouteID { get; set; }//change column as new structure
        public long StatusCode { get; set; }

        public string StatusMsg { get; set; }
        [DefaultValue(0)]
        public short VerifyDone { get; set; }

        public string TrnRefNo { get; set; }
        public string ChargeCurrency { get; set; }
        
        public string AdditionalInfo { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargePer { get; set; }

        [DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal? ChargeRs { get; set; }

        public short? ChargeType { get; set; }

        public string DebitAccountID { get; set; }

        public short IsVerified { get; set; }  

        public short IsInternalTrn { get; set; } 

        [DefaultValue(0)]
        public short IsVerifiedByAdmin { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [DefaultValue("dbo.GetISTdate()")]
        public DateTime EmailSendDate { get; set; } 
        public short CallStatus { get; set; } = 0;

        [DefaultValue(0)]
        public short LPType { get; set; } //komal 11-06-2019 for Provider Type
        [DefaultValue(0)]
        public long SerProDetailID { get; set; } //komal 11-06-2019 for Provider Type

        public short IsSmartArbitrage { get; set; } = 0;//for profit log        

        public object Clone()
        {
            return MemberwiseClone();
        }
        public void MakeTransactionInProcess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Pending);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }

        public void MakeTransactionSuccess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Success);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionSystemFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.SystemFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionHold()
        {
            Status = Convert.ToInt16(enTransactionStatus.Hold);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionInActive()
        {
            Status = Convert.ToInt16(enTransactionStatus.InActive);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void MakeTransactionOperatorFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
            UpdatedDate = Helpers.Helpers.UTC_To_IST();
            AddValueChangeEvent();
        }
        public void SetTransactionCode(long statuscode)
        {
            StatusCode = statuscode;
            AddValueChangeEvent();
        }
        public void SetTransactionStatusMsg(string statusMsg)
        {
            StatusMsg = statusMsg;
            AddValueChangeEvent();
        }
        public void SetServiceProviderData(long iServiceID, long iSerProID, long iProductID, long iRouteID, long iSerProDetailID,short iLPType)
        {
            ServiceID = iServiceID;
            SerProID = iSerProID;
            ProductID = iProductID;
            RouteID = iRouteID;
            SerProDetailID = iSerProDetailID;
            LPType = iLPType;
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TransactionQueueArbitrage>(this));
        }

    }
}
