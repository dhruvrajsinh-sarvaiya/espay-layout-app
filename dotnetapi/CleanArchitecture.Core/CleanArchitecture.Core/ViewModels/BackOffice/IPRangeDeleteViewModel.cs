using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOffice
{
    /// <summary>
    /// Create this class for delete the user ip range in database  
    /// </summary>
    public class IPRangeDeleteViewModel : TrackerViewModel
    {
        public Guid Id { get; set; }
    }
    public class IPRangeDeleteReqViewModel : TrackerViewModel
    {
        public Guid Id { get; set; }
        public int Userid { get; set; }
    }

   
}
