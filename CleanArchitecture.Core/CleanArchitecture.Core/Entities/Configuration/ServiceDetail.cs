using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class ServiceDetail : BizBase
    {
        public long ServiceId { get; set; }

        [Column(TypeName = "text")]
        public string ServiceDetailJson { get; set; } 

    }
    public class ServiceDetailMargin : BizBase
    {
        public long ServiceId { get; set; }

        [Column(TypeName = "text")]
        public string ServiceDetailJson { get; set; }

    }

    //Darshan Dholakiya added this entity for the arbitrage service config. related changes:10-06-2019
    public class ServiceDetailArbitrage : BizBase
    {
        public long ServiceId { get; set; }

        [Column(TypeName = "text")]
        public string ServiceDetailJson { get; set; }

    }
}
