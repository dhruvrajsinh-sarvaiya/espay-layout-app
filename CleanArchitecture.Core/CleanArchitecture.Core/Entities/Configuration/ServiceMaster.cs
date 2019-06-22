﻿using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class ServiceMaster : BizBase
    {
        [StringLength(30)]
        [Required]
        public string Name { get; set; }
        [StringLength(6)]
        [Required]
        public string SMSCode { get; set; }
        public short ServiceType { get; set; }
        public long LimitId { get; set; }
        public long WalletTypeID { get; set; }

        public  short IsIntAmountAllow { get; set; }//2019-6-7

        public void SetActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceMaster>(this));
        }
        public void SetInActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ServiceMaster>(this));
        }
    }
    public class ServiceMasterMargin : BizBase
    {
        [StringLength(30)]
        [Required]
        public string Name { get; set; }
        [StringLength(6)]
        [Required]
        public string SMSCode { get; set; }
        public short ServiceType { get; set; }
        public long LimitId { get; set; }
        public long WalletTypeID { get; set; }
        public void SetActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceMasterMargin>(this));
        }
        public void SetInActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ServiceMasterMargin>(this));
        }
    }

    public class ServiceMasterArbitrage : BizBase
    {
        [StringLength(30)]
        [Required]
        public string Name { get; set; }
        [StringLength(6)]
        [Required]
        public string SMSCode { get; set; }
        public short ServiceType { get; set; }
        public long LimitId { get; set; }
        public long WalletTypeID { get; set; }
        public short IsIntAmountAllow { get; set; }
        public void SetActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceMasterArbitrage>(this));
        }
        public void SetInActiveService()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ServiceMasterArbitrage>(this));
        }
    }
}
