using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Complaint
{
   public class ComplainChildParentViewmodel
    {
        public List<ComplainMasterDataViewModel> ComplainMasterDataViewModel { get; set; }
        public  List<CompainTrailViewModel> CompainTrailViewModel { get; set; }
    }
}
