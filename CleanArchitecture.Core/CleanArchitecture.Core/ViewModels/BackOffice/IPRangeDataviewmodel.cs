using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOffice
{
    public class IPRangeDataviewmodel
    {
        public string StartIp { get; set; }
        public string EndIp { get; set; }
        public int UserId { get; set; }
        public bool Status { get; set; }
    }
}
