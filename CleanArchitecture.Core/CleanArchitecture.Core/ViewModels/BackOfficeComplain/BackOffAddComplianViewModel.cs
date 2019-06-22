using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOfficeComplain
{
    public class BackOffAddComplianViewModel 
    {
        [Required(ErrorMessage ="1,Please Enter ComplainId, 9024")]
        public long ComplainId { get; set; }

        [Required(ErrorMessage = "1,Please Enter complaint description,9020")]
        [StringLength(4000)]
        public string Description { get; set; }

        public string Remark { get; set; }

        [Required(ErrorMessage = "1,Please Enter Complain status Id, 9025")]
        public long ComplainstatusId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }
    }

    public class BackOffAddCom : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please Enter ComplainId, 9024")]
        public long ComplainId { get; set; }

        [Required(ErrorMessage = "1,Please Enter complaint description,9020")]
        [StringLength(4000)]
        public string Description { get; set; }

        public string Remark { get; set; }

        [Required(ErrorMessage = "1,Please Enter Complain status Id, 9025")]
        public long ComplainstatusId { get; set; }
    }


    public class BackOffAddComResponse : BizResponseClass
    {

    }

}
