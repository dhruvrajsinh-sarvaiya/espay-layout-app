using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate
{
    public class AddPromotionLinkClickRequest
    {
        [Required(ErrorMessage = "1,IPAddress Not Found,4019")]
        [StringLength(15, ErrorMessage = "1,Invalid IPAddress,4020")]
        public string IPAddress { get; set; }
    }
}
