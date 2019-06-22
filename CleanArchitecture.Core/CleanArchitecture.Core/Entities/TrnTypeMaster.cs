using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities
{
    public class TrnTypeMaster :BizBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Required]
        [Key]
        public enTrnType TrnTypeId { get; set; }

        [Required]
        [StringLength(20)]
        public String TrnTypeName { get; set; }

        public void DisableTrnType()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<TrnTypeMaster>(this));
        }

        public void EnableTrnType()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<TrnTypeMaster>(this));
        }
    }
}
