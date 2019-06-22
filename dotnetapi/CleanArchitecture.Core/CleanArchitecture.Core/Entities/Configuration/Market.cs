using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Communication
{
    public class Market : BizBase
    {
        [Required]
        public string CurrencyName { get; set; }
        public short isBaseCurrency { get; set; }
        public long ServiceID { get; set; }

        public short Priority { get; set; }//rita 01-5-19 for manage list

        public void DisableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<Market>(this));
        }
        public void EnableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<Market>(this));
        }
    }
    public class MarketMargin : BizBase
    {
        [Required]
        public string CurrencyName { get; set; }
        public short isBaseCurrency { get; set; }
        public long ServiceID { get; set; }
        public short Priority { get; set; }//rita 01-5-19 for manage list

        public void DisableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<MarketMargin>(this));
        }
        public void EnableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<MarketMargin>(this));
        }
    }

    public class MarketArbitrage : BizBase
    {
        [Required]
        public string CurrencyName { get; set; }
        public short isBaseCurrency { get; set; }
        public long ServiceID { get; set; }
        public short Priority { get; set; }//rita 01-5-19 for manage list

        public void DisableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<MarketArbitrage>(this));
        }
        public void EnableAppType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<MarketArbitrage>(this));
        }
    }
}
