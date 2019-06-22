﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration.FeedConfiguration
{
    public class PublicAPIKeyPolicy :BizBase
    {
        public int AddMaxLimit { get; set; }
        public int AddPerDayFrequency { get; set; }
        public int AddFrequency { get; set; }
        public int AddFrequencyType { get; set; }
        public int DeleteMaxLimit { get; set; }
        public int DeletePerDayFrequency { get; set; }
        public int DeleteFrequency { get; set; }
        public int DeleteFrequencyType { get; set; }
    }
}
