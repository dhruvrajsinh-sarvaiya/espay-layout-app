using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.SharedKernel
{
    public class BizBaseExtended
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        public long CreatedBy { get; set; }

        public long? UpdatedBy { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? UpdatedDate { get; set; }

        public bool Status { get; set; }

        public List<BaseDomainEvent> Events = new List<BaseDomainEvent>();
    }
}
