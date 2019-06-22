using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.SocialProfile
{
    public class WatchMasterViewModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please enter group id,12043")]
        public string GroupId { get; set; }

        [Required(ErrorMessage = "1,Please enter leader id,12044")]
        public string LeaderId { get; set; }
        
        //public bool WatcherStatus { get; set; }
    }

    public class WatchMasterResponse : BizResponseClass
    {

    }

    //public class UnWatchMasterViewModel : TrackerViewModel
    //{
    //    [Required(ErrorMessage = "1,Please enter group id,12043")]
    //    public string GroupId { get; set; }

    //    [Required(ErrorMessage = "1,Please enter leader id,12044")]
    //    public string LeaderId { get; set; }
    //}

}
