﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class UserActivityLog : BizBase
    {
        [Required]
        public short ActivityType { get; set; }
        [Required]
        public long UserID { get; set; }
        [Required]
        public long WalletID { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime TrnDate { get; set; }
        [Required]
        public long TrnNo { get; set; }
        public string Remarks { get; set; }
        [Required]
        public short WalletTrnType { get; set; }
    }
}
