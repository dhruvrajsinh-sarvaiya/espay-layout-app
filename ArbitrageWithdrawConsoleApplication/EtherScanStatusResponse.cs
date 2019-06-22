using System;
using System.Collections.Generic;
using System.Text;

namespace ArbitrageWithdrawConsoleApplication
{
    public class EtherScanStatusResponse
    {
        public string isError { get; set; }
        public string msg { get; set; }
        public WithdrwaERCStatusCheckData transaction { get; set; }
    }
  
    public class WithdrwaERCStatusCheckData
    {
        public string blockHash { get; set; }
        public string blockNumber { get; set; }
        public string contractAddress { get; set; }
        public string cumulativeGasUsed { get; set; }
        public string gasUsed { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string transactionHash { get; set; }
        public string status { get; set; } 
        public int transactionIndex { get; set; }
    }

    public class TRNOResponse
    {
        public int isError { get; set; }
        public string txn_id { get; set; }
        public long confirmations { get; set; }
    }

    public class ReceiptResponse
    {
        public int isError { get; set; }
        public string status { get; set; }
        public string receipt { get; set; }
    }
}
