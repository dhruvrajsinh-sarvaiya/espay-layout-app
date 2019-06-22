using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.UserRoleManagement
{
    public class PermissionGroupMaster : BizBase
    {
        [Required]
        [StringLength(50)]
        public string GroupName { get; set; }

        [StringLength(100)]
        public string GroupDescription { get; set; }

        //Removed as per the discussion with khushali on 01-03-2019
        //[Required]
        //public long AccessRightId { get; set; }

        public string IPAddress { get; set; }

        //Removed as per the discussion with khushali on 01-03-2019
        //[Required]
        //public long LinkedRoles { get; set; }
    }
}
