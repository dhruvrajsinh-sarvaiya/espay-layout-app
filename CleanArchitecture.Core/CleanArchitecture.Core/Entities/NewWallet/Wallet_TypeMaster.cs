using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class Wallet_TypeMaster : BizBase
    {
        [Required]
        [StringLength(7)]
        public string WalletTypeName { get; set; }

        [Required]
        [StringLength(100)]
        public string Discription { get; set; }

        [Required]
        public long CurrencyTypeID { get; set; }

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<Wallet_TypeMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<Wallet_TypeMaster>(this));
        }

    }
}
