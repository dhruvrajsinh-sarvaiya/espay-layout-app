using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Organization
{
    public class ActivityType_Master : BizBaseExtended
    {
        [StringLength(4000)]
        public string TypeMaster { get; set; }

        [StringLength(1000)]
        public string AliasName { get; set; }

        public bool IsDelete { get; set; }
    }
}
