﻿using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;

namespace CleanArchitecture.Core.Entities
{
    public class RouteConfiguration : BizBase
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long RouteID { get; set; }

        [Required]
        [StringLength(30)]
        public string RouteName { get; set; }
        //public short Status { get; set; }
        [Required]
        public long ServiceID { get; set; } // spelling mistake ntrivedi 03-10-2018

        //[Required]
        //public long SerProID { get; set; }

        [Required]
        public long SerProDetailID { get; set; }

        [Required]
        public long ProductID { get; set; }

        [Required]
        public short Priority { get; set; }

        public string StatusCheckUrl { get; set; }
        public string ValidationUrl { get; set; }
        public string TransactionUrl { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal MinimumAmount { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal MaximumAmount { get; set; }
        public long LimitId { get; set; }

        [StringLength(50)]
        public string OpCode { get; set; }

        [Required]
        public enTrnType TrnType { get; set; }

        [DefaultValue(0)]
        public byte IsDelayAddress { get; set; }

        [StringLength(100)]
        public string ProviderWalletID { get; set; }

        [Range(0, 99999999999999999999.99), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(22, 2)")]
        public decimal ConvertAmount { get; set; }      
        
        // ntrivedi 01-11-2018 for confirmation count
        [DefaultValue(3)]
        public int ConfirmationCount { get; set; }

        public long OrderType { get; set; }
        
        public long PairId { get; set; }

        public long GasLimit { get; set; } // Uday 29-01-2019  In ErC20Withdrwa Provider Send GasLimit
        
        [DefaultValue(0)]
        public int AccountNoLen { get; set; }//Rushabh 23-03-2019 For Address Validation

        [StringLength(30)]
        public string AccNoStartsWith { get; set; } //Rushabh 23-03-2019 For Address Validation

        [StringLength(80)]
        public string AccNoValidationRegex { get; set; } //Rushabh 23-03-2019 For Address Validation

        [StringLength(100)]
        public string ContractAddress { get; set; } //Rushabh 22-05-2019 For ERC-223

        [DefaultValue(0)]
        public short IsAdminApprovalRequired { get; set; }

        public void SetActiveRoute()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<RouteConfiguration>(this));
        }

        public void SetInActiveRoute()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<RouteConfiguration>(this));
        }
    }

    //khushali 04-06-2019 for Arbitrage trading 
    public class RouteConfigurationArbitrage : BizBase
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long RouteID { get; set; }

        [Required]
        [StringLength(30)]
        public string RouteName { get; set; }
        //public short Status { get; set; }
        [Required]
        public long ServiceID { get; set; } // spelling mistake ntrivedi 03-10-2018

        //[Required]
        //public long SerProID { get; set; }

        [Required]
        public long SerProDetailID { get; set; }

        [Required]
        public long ProductID { get; set; }

        [Required]
        public short Priority { get; set; }

        public string StatusCheckUrl { get; set; }
        public string ValidationUrl { get; set; }
        public string TransactionUrl { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal MinimumAmount { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //public decimal MaximumAmount { get; set; }
        public long LimitId { get; set; }

        [StringLength(50)]
        public string OpCode { get; set; }

        [Required]
        public enTrnType TrnType { get; set; }

        [DefaultValue(0)]
        public byte IsDelayAddress { get; set; }

        [StringLength(100)]
        public string ProviderWalletID { get; set; }

        [Range(0, 99999999999999999999.99), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(22, 2)")]
        public decimal ConvertAmount { get; set; }

        // ntrivedi 01-11-2018 for confirmation count
        [DefaultValue(3)]
        public int ConfirmationCount { get; set; }

        public long OrderType { get; set; }

        public long PairId { get; set; }

        public long GasLimit { get; set; } // Uday 29-01-2019  In ErC20Withdrwa Provider Send GasLimit

        [DefaultValue(0)]
        public int AccountNoLen { get; set; }//Rushabh 23-03-2019 For Address Validation

        [StringLength(30)]
        public string AccNoStartsWith { get; set; } //Rushabh 23-03-2019 For Address Validation

        [StringLength(80)]
        public string AccNoValidationRegex { get; set; } //Rushabh 23-03-2019 For Address Validation

        [StringLength(100)]
        public string ContractAddress { get; set; } //Rushabh 22-05-2019 For ERC-223

        [DefaultValue(0)]
        public short IsAdminApprovalRequired { get; set; }

        public void SetActiveRoute()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<RouteConfigurationArbitrage>(this));
        }

        public void SetInActiveRoute()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<RouteConfigurationArbitrage>(this));
        }
    }
}
