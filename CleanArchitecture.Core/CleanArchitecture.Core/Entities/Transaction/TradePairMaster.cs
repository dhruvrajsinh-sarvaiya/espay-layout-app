﻿using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class TradePairMaster : BizBase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public new long Id
        {
            get => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
            set => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
        }
        [Required]
        public string PairName { get; set; }

        [Required]
        public long SecondaryCurrencyId { get; set; }

        //[Required]
        //public long Serviceid { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal Currentrate { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal BuyMinQty { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public short BuyMaxQty { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal SellMinQty { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal SellMaxQty { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal DailyHigh { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal DailyLow { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal CurrencyPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal Volume { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal SellPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal BuyPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal BuyMinPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal BuyMaxPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal SellMinPrice { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal SellMaxPrice { get; set; }

        [Required]
        public long WalletMasterID { get; set; }

        [Required]
        public long BaseCurrencyId { get; set; }

        public short Priority { get; set; }//rita 01-5-19 for manage list

        //[Required]
        //public long WalletServiceID { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal Fee { get; set; }
        //public short FeeType { get; set; }
        //public long LastTrnNo { get; set; }

        public void MakePairActive()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            AddValueChangeEvent();
        }
        public void MakePairInActive()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TradePairMaster>(this));
        }
    }

    public class TradePairMasterMargin : BizBase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public new long Id
        {
            get => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
            set => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
        }
        [Required]
        public string PairName { get; set; }

        [Required]
        public long SecondaryCurrencyId { get; set; }       

        [Required]
        public long WalletMasterID { get; set; }

        [Required]
        public long BaseCurrencyId { get; set; }

        public short Priority { get; set; }//rita 01-5-19 for manage list

        public void MakePairActive()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            AddValueChangeEvent();
        }
        public void MakePairInActive()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TradePairMasterMargin>(this));
        }
    }

    public class TradePairMasterArbitrage : BizBase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public new long Id
        {
            get => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
            set => Convert.ToInt64(SecondaryCurrencyId.ToString() + BaseCurrencyId.ToString());
        }
        [Required]
        public string PairName { get; set; }

        [Required]
        public long SecondaryCurrencyId { get; set; }

        [Required]
        public long WalletMasterID { get; set; }

        [Required]
        public long BaseCurrencyId { get; set; }

        public short Priority { get; set; }

        public void MakePairActive()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            AddValueChangeEvent();
        }
        public void MakePairInActive()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TradePairMasterArbitrage>(this));
        }
    }
}
