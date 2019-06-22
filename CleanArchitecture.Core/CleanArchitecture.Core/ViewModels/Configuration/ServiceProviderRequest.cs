﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration
{
    public class ServiceProviderRequest 
    {
        [Required]
        public long Id { get; set; }
        [Required]
        [StringLength(60)]
        public string ProviderName { get; set; }
        [Required]
        public short Status { get; set; }
    }
    public class ServiceProviderResponse : BizResponseClass
    {
       public IEnumerable <ServiceProviderViewModel> Response { get; set; }
    }
    public class ServiceProviderResponseData : BizResponseClass
    {
        public ServiceProviderViewModel Response = new ServiceProviderViewModel();
    }

}
