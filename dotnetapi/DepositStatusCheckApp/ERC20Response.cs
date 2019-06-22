using System;
using System.Collections.Generic;
using System.Text;

namespace DepositStatusCheckApp
{
    public class ERC20Response
    {
        public bool isError { get; set; }
        public long confirmations { get; set; }
        public string txnid { get; set; }
        public string msg { get; set; }
    }

    public class MainERC20Response
    {
        public ERC20Response response { get; set; }
    }

    public class MainFlushResponse
    {
        public FlushResponse response { get; set; }
    }

    public class FlushResponse
    {
        public int isError { get; set; }
        public string txn_hash { get; set; }
        public string forwarder_address { get; set; }
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

    public class NeoSubClassRes
    {
        public decimal value { get; set; }
        public string txid { get; set; }
        public int n { get; set; }
        public string asset { get; set; }
        public string address_hash { get; set; }
    }

    public class NeoMainClassRes
    {
        public List<NeoSubClassRes> vouts { get; set; }
        public List<NeoSubClassRes> claims { get; set; }
        public List<NeoSubClassRes> vin { get; set; }
        public int version { get; set; }
        public string type { get; set; }
        public string txid { get; set; }
        public double time { get; set; }
        public decimal sys_fee { get; set; }
        public int size { get; set; }
        public List<scripts> scripts { get; set; }
        public string pubkey { get; set; }
        public string nonce { get; set; }
        public decimal net_fee { get; set; }
        public string block_hash { get; set; }
        public string description { get; set; }
        public string contract { get; set; }
        public int block_height { get; set; }
        public List<attributes> attributes { get; set; }
        public string asset { get; set; }
    }

    public class scripts
    {
        public string verification { get; set; }
        public string invocation { get; set; }
    }

    public class attributes
    {
        public string usage { get; set; }
        public string data { get; set; }
    }

    public class GetConfirm
    {
        public long height { get; set; }
    }

}
