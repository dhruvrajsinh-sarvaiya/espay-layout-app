using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.KYCConfiguration
{
    public class KYCIdentityConfigurationMapping : BizBaseExtended
    {
        public int Userid { get; set; }
        public Guid KYCConfigurationMasterId { get; set; }
        public long LevelId { get; set; }
    }
}
