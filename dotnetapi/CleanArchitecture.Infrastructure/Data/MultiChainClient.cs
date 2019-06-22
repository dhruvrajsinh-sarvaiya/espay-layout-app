using CleanArchitecture.Infrastructure.LiquidityProvider;
using LucidOcean.MultiChain;
using LucidOcean.MultiChain.Util;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure.Data
{
    public class MultiChainClient : JsonRpcClient
    {
        public MultiChainClient(MultiChainConnection connection) : base(connection) { Init(); }
        public MultiChainClient(string hostname, int port, string username, string password, string chainName) : base(hostname, port, username, password, chainName) { Init(); }
       
        internal void Init()
        {
            MultichainLP = new MultichainLP(this);
           
        }

        /// <summary>
        /// Calls relating to Addresses
        /// </summary>
        public MultichainLP MultichainLP { get; internal set; }
        /// <summary>
        /// Calls relating to Assets
        /// </summary>
      

    }
}
