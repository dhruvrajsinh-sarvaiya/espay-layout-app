using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.SocialProfile
{
    public class GroupMasterViewModel : TrackerViewModel
    {
        //[Required]
        //public int UserId { get; set; }       
        [Required(ErrorMessage = "1,Please enter group name,12040")]
        [StringLength(200, ErrorMessage = "1,Please enter valid group name,12040")]        
        public string GroupName { get; set; }
    }

    public class GroupMasterAddModel
    {
        //[Required]
        public int UserId { get; set; }
        [StringLength(200)]
        public string GroupName { get; set; }
    }
    public class GroupMasterModel 
    {
        public long Id { get; set; }
        ////[Required]
        //public int UserId { get; set; }

        //[StringLength(200)]
        public string GroupName { get; set; }

        //[DataType(DataType.DateTime)]
        //public DateTime CreatedDate { get; set; }

        //public long CreatedBy { get; set; }

        //public long? UpdatedBy { get; set; }

        //[DataType(DataType.DateTime)]
        //public DateTime? UpdatedDate { get; set; }//rita 29-10-2018 allow null entry at new records

        //public short Status { get; set; }
    }

    public class GroupMasterResponse : BizResponseClass
    {
    }

    public class GroupListResponse : BizResponseClass
    {
        public List<GroupMasterModel> GroupList { get; set; }
    }

}
