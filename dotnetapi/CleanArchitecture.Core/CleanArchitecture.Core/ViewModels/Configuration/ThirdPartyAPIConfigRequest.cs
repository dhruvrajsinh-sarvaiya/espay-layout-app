﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration
{
    public class ThirdPartyAPIConfigRequest
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "1,Please Enter Required Parameters,4528")]
        [StringLength(30)]
        public string APIName { get; set; }

        [Required(ErrorMessage = "1,Please Enter Required Parameters,4529")]
        [Url(ErrorMessage = "1,Please Enter Valid Parameter Value,4659")]
        public string APISendURL { get; set; }

        [Url(ErrorMessage = "1,Please Enter Valid Parameter Value,4660")]
        public string APIValidateURL { get; set; }

        [Url(ErrorMessage = "1,Please Enter Valid Parameter Value,4661")]
        public string APIBalURL { get; set; }

        [Url(ErrorMessage = "1,Please Enter Valid Parameter Value,4662")]
        public string APIStatusCheckURL { get; set; }

        public string APIRequestBody { get; set; }

        public string TransactionIdPrefix { get; set; }

        public string MerchantCode { get; set; }

        //public string UserID { get; set; }

        //public string Password { get; set; }

        //public long SerProConfigurationID { get; set; }

        public string ResponseSuccess { get; set; }

        public string ResponseFailure { get; set; }

        public string ResponseHold { get; set; }

        public string AuthHeader { get; set; }

        public string ContentType { get; set; }

        public string MethodType { get; set; }

       // public string HashCode { get; set; }

       // public string HashCodeRecheck { get; set; }

       // public short HashType { get; set; }

        public short AppType { get; set; }

        public long ParsingDataID { get; set; }
        public short Status { get; set; }
    }

    public class ThirdPartyAPIConfigResponse : BizResponseClass
    {
        public ThirdPartyAPIConfigViewModel Response { get; set; }
    }
    public class ThirdPartyAPIConfigResponseAllData : BizResponseClass
    {
        public List<ThirdPartyAPIConfigViewModel> Response { get; set; }
    }

}
