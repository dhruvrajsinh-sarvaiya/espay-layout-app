﻿using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class ServiceProConfiguration : BizBase
    {
        //[Required]
        //public long ServiceProID { get; set; }

        [Required]
        [StringLength(50)]
        public string AppKey { get; set; }

        [Required]
        [StringLength(500)]
        public string APIKey { get; set; }

        [Required]
        [StringLength(500)]
        public string SecretKey { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        [StringLength(50)]
        public string Password { get; set; }

        public string Param1 { get; set; }

        public string Param2 { get; set; }

        public string Param3 { get; set; }

        public string Param4 { get; set; }

        public string Param5 { get; set; }

        public void DisableProConfiguration()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<ServiceProConfiguration>(this));
        }
        public void EnableProConfiguration()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceProConfiguration>(this));
        }

    }

    //khushali 04-06-2019 for Arbitrage trading 
    public class ServiceProConfigurationArbitrage : BizBase
    {
        //[Required]
        //public long ServiceProID { get; set; }

        [Required]
        [StringLength(50)]
        public string AppKey { get; set; }

        [Required]
        [StringLength(500)]
        public string APIKey { get; set; }

        [Required]
        [StringLength(500)]
        public string SecretKey { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        [StringLength(50)]
        public string Password { get; set; }

        public string Param1 { get; set; }

        public string Param2 { get; set; }

        public string Param3 { get; set; }

        public string Param4 { get; set; }

        public string Param5 { get; set; }

        public void DisableProConfiguration()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<ServiceProConfigurationArbitrage>(this));
        }
        public void EnableProConfiguration()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ServiceProConfigurationArbitrage>(this));
        }

    }
}   
