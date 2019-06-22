using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.IpWiseDataViewModel
{
    public  class IPWiseDataViewModel
    {
        //public string CountryCode { get; set; }
        // public string Location { get; set; }
        public bool IsValid { get; set; }
        public string Location { get; set; } = "Localhost";
        public string CountryCode { get; set; } = "IN";
    }
}
