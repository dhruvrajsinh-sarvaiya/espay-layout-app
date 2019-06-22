﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.Entities
{
    public class ThirdPartyAPIResponseConfiguration : BizBase
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long ParsingDataID { get; set; }

        public string BalanceRegex { get; set; }

        public string StatusRegex { get; set; }

        public string StatusMsgRegex { get; set; }

        public string ResponseCodeRegex { get; set; }

        public string ErrorCodeRegex { get; set; }

        public string TrnRefNoRegex { get; set; }

        public string OprTrnRefNoRegex { get; set; }

        public string Param1Regex { get; set; }

        public string Param2Regex { get; set; }

        public string Param3Regex { get; set; }

        public void SetActive()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ThirdPartyAPIResponseConfiguration>(this));
        }
        public void SetInActive()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ThirdPartyAPIResponseConfiguration>(this));
        }
    }

    public class ArbitrageThirdPartyAPIResponseConfiguration : BizBase
    {
        public string BalanceRegex { get; set; }

        public string StatusRegex { get; set; }

        public string StatusMsgRegex { get; set; }

        public string ResponseCodeRegex { get; set; }

        public string ErrorCodeRegex { get; set; }

        public string TrnRefNoRegex { get; set; }

        public string OprTrnRefNoRegex { get; set; }

        public string Param1Regex { get; set; }

        public string Param2Regex { get; set; }

        public string Param3Regex { get; set; }

        public void SetActive()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ArbitrageThirdPartyAPIResponseConfiguration>(this));
        }
        public void SetInActive()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ArbitrageThirdPartyAPIResponseConfiguration>(this));
        }
    }
}
