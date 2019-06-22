using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class UserWalletMaster : BizBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Required]
        [StringLength(50)]
        public string WalletName { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Balance { get; set; }

        [Required]
        public long WalletTypeID { get; set; }

        [Required]
        public bool IsValid { get; set; }

        [Required]
        [StringLength(16)]
        [Key]
        public string AccWalletID { get; set; } // dynamically generated accountid 

        [Required]
        public long UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string PublicAddress { get; set; }

        public byte IsDefaultWallet { get; set; }

        [Required]
        public long OrganizationID { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime ExpiryDate { get; set; }

        public void CreditBalance(decimal amount)
        {
            Balance = Balance + amount;
            Events.Add(new WalletCrEvent<UserWalletMaster>(this));

        }
        public void DebitBalance(decimal amount)
        {
            Balance = Balance - amount;
            Events.Add(new WalletDrEvent<UserWalletMaster>(this));
        }
        public void WalletPublicAddress(string publicAddress)
        {
            PublicAddress = publicAddress;
            Events.Add(new WalletPublicAddress<UserWalletMaster>(this));
        }

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<UserWalletMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<UserWalletMaster>(this));
        }
    }
}
