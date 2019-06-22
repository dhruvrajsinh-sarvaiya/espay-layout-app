﻿using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CleanArchitecture.Core.Entities
{
    public class ProductConfiguration : BizBase
    {
       // [Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long ProductID { get; set; }

        [Required]
        [StringLength(30)]
        public string ProductName { get; set; }
        //public short Status { get; set; }
        [Required]
        public long ServiceID { get; set; } // ntrivedi added 03-11-2018

        //[Required]
        //public long StateID { get; set; }    

        [Required]
        public long CountryID { get; set; }   

        public void SetActiveProduct()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ProductConfiguration>(this));
        }
        public void SetInActiveProduct()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ProductConfiguration>(this));
        }
    }

    //Darshan Dholakiya added this entity for the arbitrage service related changes:10-06-2019
    public class ProductConfigurationArbitrage : BizBase
    {
        // [Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public long ProductID { get; set; }

        [Required]
        [StringLength(30)]
        public string ProductName { get; set; }
        //public short Status { get; set; }
        [Required]
        public long ServiceID { get; set; } // ntrivedi added 03-11-2018

        //[Required]
        //public long StateID { get; set; }    

        [Required]
        public long CountryID { get; set; }

        public void SetActiveProduct()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ProductConfigurationArbitrage>(this));
        }
        public void SetInActiveProduct()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<ProductConfigurationArbitrage>(this));
        }
    }
}
