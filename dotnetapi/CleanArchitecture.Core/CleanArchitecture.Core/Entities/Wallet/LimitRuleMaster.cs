﻿using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    //public class LimitRuleMaster : BizBase

    //{
    //    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    //    public new long Id { get; set; } 
    //    public string Name { get; set; }
    //    [Key]
    //    public enTrnType TrnType { get; set; }
    //    [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
    //    [Column(TypeName = "decimal(28, 18)")]
    //    public decimal MinAmount { get; set; }
    //    [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
    //    [Column(TypeName = "decimal(28, 18)")]
    //    public decimal MaxAmount { get; set; }
    //    [Key]
    //    public long WalletType { get; set; }

    //    public void DisableService()
    //    {
    //        Status = Convert.ToInt16(ServiceStatus.Disable);
    //        Events.Add(new ServiceStatusEvent<LimitRuleMaster>(this));
    //    }

    //    public void EnableService()
    //    {
    //        Status = Convert.ToInt16(ServiceStatus.Active);
    //        Events.Add(new ServiceStatusEvent<LimitRuleMaster>(this));
    //    }
    //}
}
