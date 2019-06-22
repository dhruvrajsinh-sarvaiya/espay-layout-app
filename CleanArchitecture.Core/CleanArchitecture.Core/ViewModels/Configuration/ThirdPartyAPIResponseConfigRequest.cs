using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration
{
    public class ThirdPartyAPIResponseConfigRequest : ThirdPartyAPIResponseConfigViewModel
    {
        
    }
    public class ThirdPartyAPIResponseConfigResponse : BizResponseClass
    {
        public ThirdPartyAPIResponseConfigViewModel Response { get; set; }
    }
    public class ThirdPartyAPIResponseConfigResponseAllData : BizResponseClass
    {
        public List<ThirdPartyAPIResponseConfigViewModel> Response { get; set; }
    }
}
