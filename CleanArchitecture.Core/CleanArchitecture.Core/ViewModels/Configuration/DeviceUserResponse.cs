using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration
{
    public class DeviceUserResponse
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string DeviceID { get; set; }

        public long UserID { get; set; }

    }

    public class DeviceUserResponseRes : BizResponseClass
    {
        public List<DeviceUserResponse> Result { get; set; }
    }
}
