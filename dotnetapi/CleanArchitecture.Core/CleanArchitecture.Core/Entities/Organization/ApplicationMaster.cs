using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Organization
{
    public class ApplicationMaster : BizBaseExtended
    {
        [Required]
        [StringLength(250)]
        public string ApplicationName { get; set; }

        [StringLength(250)]
        public string Description { get; set; }

        public void SetEnableApplicationStatus(long UserId)
        {
            Status = true;
            UpdatedDate = DateTime.UtcNow;
            UpdatedBy = UserId;
            Events.Add(new ServiceStatusEvent<ApplicationMaster>(this));
        }
        public void SetDisableApplicationStatus(long UserId)
        {
            Status = false;
            UpdatedDate = DateTime.UtcNow;
            UpdatedBy = UserId;
            Events.Add(new ServiceStatusEvent<ApplicationMaster>(this));
        }
    }
}
