using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Log
{
    public class AuthorizeDeviceViewModel
    {
        public int UserId { get; set; }
        public string Location { get; set; }
        public string IPAddress { get; set; }
        public string DeviceName { get; set; }
        public string DeviceOS { get; set; }
        public string DeviceId { get; set; }
        public DateTime CurrentTime { get; set; }
        public DateTime Expirytime { get; set; }
    }

    public class AuthorizeDeviceResponse : BizResponseClass
    {
        
    }

    public class AuthorizeDeviceData 
    {
        public string Location { get; set; }
        public string IPAddress { get; set; }
        public string DeviceName { get; set; }
    }

    public class AuthorizeDeviceDataResponse : BizResponseClass
    {
        public AuthorizeDeviceData AuthorizeData { get; set; }
    }

}
