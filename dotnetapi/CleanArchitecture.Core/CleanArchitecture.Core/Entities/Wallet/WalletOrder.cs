﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.Services;
using CleanArchitecture.Core.SharedKernel;
using Microsoft.Extensions.Logging;


namespace CleanArchitecture.Core.Entities
{
    //ntrivedi table not in use 19-02-2019
    public class WalletOrder : BizBase // Similler to MemberOrder table
    {
        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        public enOrderType OrderType { get; set; }

        [Required]
        public long OWalletMasterID { get; set; }

        [Required]
        public long DWalletMasterID { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal OrderAmt { get; set; }

        [Required]
        public new enOrderStatus Status { get; set; }

        [Required]
        [StringLength(100)]
        public string ORemarks { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal DeliveryAmt { get; set; }

        public string DRemarks { get; set; }

        public long? DeliveryGivenBy { get; set; }

        public DateTime? DeliveryGivenDate { get; set; }



        //readonly ILogger<WalletOrder> _log;

        //public WalletOrder(ILogger<WalletOrder> log)
        //{
        //    _log = log;
        //}

        public void SetAsSuccess()
        {
            try
            {
                Status = enOrderStatus.Success;
                Events.Add(new ServiceStatusEvent<WalletOrder>(this));
            }
            catch (Exception ex)
            {
                // _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name,LogLevel.Error);
                throw ex;
            }

        }
        public void SetAsRejected()
        {
            try
            {

                Status = enOrderStatus.Rejected;
                Events.Add(new ServiceStatusEvent<WalletOrder>(this));
            }
            catch (Exception ex)
            {
                //_log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

    }



}
