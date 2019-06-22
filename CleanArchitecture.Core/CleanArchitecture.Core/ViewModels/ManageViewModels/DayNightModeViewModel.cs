using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.ManageViewModels
{
    public class DayNightModeViewModel : TrackerViewModel
    {
        public bool DayNightMode { get; set; }
    }

    public class DayNightModeResponse : BizResponseClass
    {

    }

}
