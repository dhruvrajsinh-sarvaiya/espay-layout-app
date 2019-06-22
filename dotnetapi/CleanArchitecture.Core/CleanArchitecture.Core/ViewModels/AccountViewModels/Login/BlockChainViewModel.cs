﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
    public class BlockChainViewModel : TrackerViewModel
    {
        [Required]
        [StringLength(50, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string KeyPassword { get; set; }
    }

    //public class BlockChainResponse : BizResponseClass
    //{
    //    public string PasswordNotes { get; set; }

    //    public string KeystoreNotes { get; set; }

    //    public string EncryptedPrivateKey { get; set; }

    //    public string  PaperWalletLink { get; set; }

    //    public string KeyStoreFileLink { get; set; }

    //}
}
