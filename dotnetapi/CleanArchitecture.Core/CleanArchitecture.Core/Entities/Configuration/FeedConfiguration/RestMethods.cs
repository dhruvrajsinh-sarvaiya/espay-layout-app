using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration.FeedConfiguration
{
    public class RestMethods :BizBase
    {
        [Required]
        [StringLength(50)]
        public string MethodName { get; set; }
        //public short IsReadOnly { get; set; }
        //public short IsFullAccess { get; set; }
        public string Path { get; set; }
        //[DefaultValue(0)]
        //public short MethodType { get; set; }
    }
    public class APIMethods: BizBase
    {
        [Required]
        [StringLength(50)]
        public string MethodName { get; set; }
        public short IsReadOnly { get; set; }
        public short IsFullAccess { get; set; }
    }
    public class APIMethodConfiguration : BizBase
    {
        //api method and rest method configuration
        public long ParentID { get; set; }
        public long MethodID { get; set; }
        public long MethodType { get; set; }
    }
    public class APIPlanMethodConfiguration : BizBase
    {
        //API Plan and Its method configuration
        public long RestMethodID { get; set; }
        public long APIPlanMasterID { get; set; }
        public long CustomeLimitId { get; set; }
    }
    public class APIPlanMethodConfigurationHistory : BizBase
    {
        public long APIPlanHistoryID { get; set; }
        public long RestMethodID { get; set; }
        public long APIPlanMasterID { get; set; }
        public long CustomeLimitId { get; set; }
    }
}
