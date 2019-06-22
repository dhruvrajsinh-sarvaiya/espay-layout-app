using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.UserRoleManagement
{
    public class ApplicationGroupRoles
        //Mapping Table For PermissionGroupMaster And RoleMaster
    {
        //[Key]
        public long PermissionGroupId { get; set; }

        [Key]
        public long RoleId { get; set; }        
    }
}
