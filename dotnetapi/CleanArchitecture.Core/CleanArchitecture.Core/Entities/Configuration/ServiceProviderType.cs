﻿using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class ServiceProviderType : BizBase
    {
        [Required]
        [StringLength(20)]
        public string ServiveProTypeName { get; set; }

        public void DisableProviderType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<ServiceProviderType>(this));
        }
        public void EnableProviderType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceProviderType>(this));
        }
    }

    //khushali 04-06-2019 for Arbitrage trading 
    public class ServiceProviderTypeArbitrage : BizBase
    {
        [Required]
        [StringLength(20)]
        public string ServiveProTypeName { get; set; }

        public void DisableProviderType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<ServiceProviderTypeArbitrage>(this));
        }
        public void EnableProviderType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceProviderTypeArbitrage>(this));
        }
    }
}
