﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Complaint
{
    public class ComplainMasterDataViewModel
    {
        public long ComplainId { get; set; }
        public string Subject { get; set; }
        public string Type { get; set; }
        public string Priority { get; set; }

    }
}
