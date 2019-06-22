using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.ControlPanel
{
   public class MultichainViewModel 
    {
       public string address { get; set; }
    }

    public class ListMultichainAddressViewModel : BizResponseClass
    {
        public List<string> listaddressitem { get; set; }
        public int TotalCount { get; set; }
    }

    public class MultichainConnectionViewModel
    {
        public string hostname { get; set; }
        public string port { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string chainName { get; set; }
    }
}
