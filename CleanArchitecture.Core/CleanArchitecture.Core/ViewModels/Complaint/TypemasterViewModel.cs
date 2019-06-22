using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Complaint
{
    public class TypemasterViewModel
    {
        public long id { get; set; }
        public string Type { get; set; }
        //public string SubType { get; set; }
        //public bool EnableStatus { get; set; }
    }

    public class TypeMasterResponse : BizResponseClass
    {
       
        public List<TypemasterViewModel> TypeMasterList { get; set; }
    }

    public class ComplainStatusTypeModel
    {
        public int StatusId { get; set; }
        public string ComplainStatus { get; set; }
    }

    public class ComplainStatusTypeResponse : BizResponseClass
    {
        public List<ComplainStatusTypeModel> ComplainStatus { get; set; }
    }
    }
