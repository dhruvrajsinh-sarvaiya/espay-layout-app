using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.UserRoleManagement
{
    //public partial class RoleMaster : IdentityRole<int>
    //{
    //    public RoleMaster() : base()
    //    {
                
    //    }
    //    [StringLength(250)]
    //    public string RoleDescription { get; set; }

    //    [Required]
    //    public long PermissionGroupID { get; set; }

    //    [DataType(DataType.DateTime)]
    //    public DateTime CreatedDate { get; set; }

    //    public long CreatedBy { get; set; }

    //    public long? UpdatedBy { get; set; }

    //    [DataType(DataType.DateTime)]
    //    public DateTime? UpdatedDate { get; set; }

    //    [Required]
    //    public short Status { get; set; }
    //}

    public class RoleHistory : BizBase
    {
        [Required]
        [StringLength(250)]
        public string ModificationDetail { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public EnModuleType Module { get; set; }

        public string IPAddress { get; set; }
    }
}
