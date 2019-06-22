﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate
{
    public class GetFacebookLinkClickRequest
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public long? UserId { get; set; }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
    }
}
