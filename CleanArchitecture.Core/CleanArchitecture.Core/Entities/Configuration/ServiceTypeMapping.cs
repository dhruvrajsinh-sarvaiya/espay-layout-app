using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class ServiceTypeMapping : BizBase
    {
        public long ServiceId { get; set; }
        public long TrnType { get; set; }
    }
    public class ServiceTypeMappingMargin : BizBase
    {
        public long ServiceId { get; set; }
        public long TrnType { get; set; }
    }

    //Darshan Dholakiya added the entity for  Arbitrage service configuration changes:10-06-2019
    public class ServiceTypeMappingArbitrage : BizBase
    {
        public long ServiceId { get; set; }
        public long TrnType { get; set; }
    }
}
