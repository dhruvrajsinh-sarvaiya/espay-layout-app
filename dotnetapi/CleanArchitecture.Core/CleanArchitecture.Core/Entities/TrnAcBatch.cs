using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.Helpers;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities
{
    public class TrnAcBatch : BizBase
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.None)]
        //public new long Id { get; set; }
       
        //2018-12-11 Errror: PK 
        //public TrnAcBatch()
        //{

        //}
        public TrnAcBatch()
        {
            CreatedBy = 900;
            CreatedDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            UpdatedBy = 900;
            Status = 1;            
          //  Id = Helpers.Helpers.GenerateBatch();
        }
    }
}
