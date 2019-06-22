using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Complaint
{
   public class UserWiseCompaintDetailResponce
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public long CompainNumber { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }
        public string Remark { get; set; }
        public string Priority { get; set; }



    }
}
