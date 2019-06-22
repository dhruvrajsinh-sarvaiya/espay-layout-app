using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.SharedKernel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class UserMaster: BizBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }
        [Key]
        [Required]
        public long BizUserID { get; set; }
    }

    //public class UserMaster : IdentityUser<int>
    //{
        //public bool IsEnabled { get; set; }
        //[DataType(DataType.DateTime)]
        //public DateTime CreatedDate { get; set; }         
        //[StringLength(250)]
        //public string FirstName { get; set; }
        //[StringLength(250)]
        //public string LastName { get; set; }
        //[Phone]
        //public string Mobile { get; set; }

        //public ApplicationUserPhotos ProfilePhoto { get; set; }

        //[NotMapped]
        //public string Name
        //{
        //    get
        //    {
        //        return this.FirstName + " " + this.LastName;
        //    }
        //}
    //}
}
