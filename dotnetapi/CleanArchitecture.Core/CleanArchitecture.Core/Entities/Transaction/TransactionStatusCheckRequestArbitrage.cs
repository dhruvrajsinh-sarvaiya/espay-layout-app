using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class TransactionStatusCheckRequestArbitrage : BizBase
    {
        [Required]
        public long TrnNo { get; set; }

        public long SerProDetailID { get; set; }

        public string RequestData { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime ResponseTime { get; set; }

        public string ResponseData { get; set; }

        public string TrnID { get; set; }

        public string OprTrnID { get; set; }

        public void MakeTransactionSuccess()
        {
            Status = Convert.ToInt16(enTransactionStatus.Success);
            AddValueChangeEvent();
        }
        public void MakeTransactionHold()
        {
            Status = Convert.ToInt16(enTransactionStatus.Hold);
            AddValueChangeEvent();
        }
        public void MakeTransactionOperatorFail()
        {
            Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
            AddValueChangeEvent();
        }
        public void SetResponse(string Response)
        {
            ResponseData = Response;
            AddValueChangeEvent();
        }
        public void SetTrnID(string sTrnID)
        {
            TrnID = sTrnID;
            AddValueChangeEvent();
        }
        public void SetOprTrnID(string sOprTrnID)
        {
            OprTrnID = sOprTrnID;
            AddValueChangeEvent();
        }
        public void SetResponseTime(DateTime sResponseTime)
        {
            ResponseTime = sResponseTime;
            AddValueChangeEvent();
        }
        public void AddValueChangeEvent()
        {
            Events.Add(new ServiceStatusEvent<TransactionStatusCheckRequestArbitrage>(this));
        }

    }
}
