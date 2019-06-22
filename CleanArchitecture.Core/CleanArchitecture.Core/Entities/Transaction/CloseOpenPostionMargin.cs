using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class CloseOpenPostionMargin : BizBase
    {
        [Required]
        public long UserID { get; set; }

        [Required]
        public long PairID { get; set; }
       
        public string TrnRefNo { get; set; }
    }
}
