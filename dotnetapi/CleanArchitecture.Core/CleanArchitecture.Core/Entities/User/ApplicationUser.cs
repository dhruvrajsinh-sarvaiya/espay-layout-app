using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Core.Entities.User
{
    public partial class ApplicationUser : IdentityUser<int>
    {       
        public bool IsEnabled { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }
        [StringLength(250)]
        public string FirstName { get; set; }
        [StringLength(250)]
        public string LastName { get; set; }
        [Phone]
        public string Mobile { get; set; }
        [StringLength(5)]
        public string CountryCode { get; set; }
        //[DataType("decimal(18,2)")]
        //public decimal Balance { get; set; }

        //[Required]
        //[Range(6, Int64.MaxValue)]
        //public long OTP { get; set; }
        public int RegTypeId { get; set; }  // Added by pankaj kathiriya for get the user login type

        public ApplicationUserPhotos ProfilePhoto { get; set; }
        public bool IsBlocked { get; set; }

        public bool Thememode { get; set; }

        [StringLength(8)]
        public string ReferralCode { get; set; }

        //[Required]
        [DefaultValue(0)]
        public short IsCreatedByAdmin { get; set; }

        public short Status { get; set; }

        // Added column to Map user with Group for Access permissions. -Nishit Jani on A 2019-03-27 9:34 PM
        // Default set to 2 as supposed to remove error.        
        [Required]
        public int GroupID { get; set; } = 2;

        // [Required]
        [StringLength(5)]
        public string PreferedLanguage { get; set; } = "en";//Locale

        [NotMapped]
        public string Name
        {
            get
            {
                return this.FirstName + " " + this.LastName;
            }
        }
    }
}
