using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.Entities.Log
{
    public class DeviceMaster : BizBase
    {
        
        public int UserId { get; set; }
        
        [StringLength(250)]
        public string Device { get; set; }

        [Required]
        [StringLength(250)]
        public string DeviceOS { get; set; }

        [StringLength(250)]
        public string DeviceId { get; set; }

        public bool IsEnable { get; set; }
        public bool IsDeleted { get; set; }

        //komal 18-06-2019 for validate device authorize
        public Guid Guid { get; set; }
        public string Location { get; set; }
        public string IPAddress { get; set; }
        public DateTime ExpiryTime { get; set; }

        public void SetAsIpDeletetatus()
        {
            IsDeleted = true;
            Status = 0;
            Events.Add(new ServiceStatusEvent<DeviceMaster>(this));
        }

        public void SetAsIsDisabletatus()
        {
            IsEnable = false;
            Status = 0;
            Events.Add(new ServiceStatusEvent<DeviceMaster>(this));
        }

        public void SetAsIsEnabletatus()
        {
            IsEnable = true;
            Status = 1;
            Events.Add(new ServiceStatusEvent<DeviceMaster>(this));
        }
    }
}
