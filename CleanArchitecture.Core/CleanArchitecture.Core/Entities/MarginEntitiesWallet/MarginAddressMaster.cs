﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.Entities.MarginEntitiesWallet
{
    public class MarginAddressMaster : BizBase
    {
        [Required]
        public long WalletId { get; set; }

        [StringLength(50)]
        public string Address { get; set; }

        [Required]
        public byte IsDefaultAddress { get; set; }

        [Required]
        public long SerProID { get; set; }

        [Required]
        [StringLength(50)]
        public string AddressLable { get; set; }
        // Removed as it is no longer required. By -Nishit Jani on B 2018-10-11 6:45.
        //[Required]
        //[StringLength(5)]
        //public string CoinName { get; set; }

        [Required]
        [StringLength(50)]
        public string OriginalAddress { get; set; }

        public string GUID { get; set; }//used for store key (response from ERC-20 Api)
                
        public enAddressType AddressType { get; set; }//ntrivedi 18-04-2019

        [StringLength(150)]
        public string TxnID { get; set; }
    }

    public class ArbitrageLPAddressMaster : BizBase
    {
        public long WalletId { get; set; }

        [StringLength(70)]
        public string Address { get; set; }

        [Required]
        public byte IsDefaultAddress { get; set; }

        [Required]
        public long SerProID { get; set; }

        [Required]
        [StringLength(50)]
        public string AddressLable { get; set; }

        [Required]
        [StringLength(70)]
        public string OriginalAddress { get; set; }

        public string GUID { get; set; }

        public enAddressType AddressType { get; set; }

        [StringLength(150)]
        public string TxnID { get; set; }

        public long WalletTypeId { get; set; }
    }
}
