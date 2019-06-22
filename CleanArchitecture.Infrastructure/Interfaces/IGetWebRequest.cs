using System;
using System.Collections.Generic;
using System.Text;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IGetWebRequest
    {
        ThirdPartyAPIRequest MakeWebRequest(long routeID, long thirdpartyID, long serproDetailID, TransactionQueue TQ = null, WithdrawERCAdminAddress AdminAddress = null);
        ThirdPartyAPIRequest MakeWebRequestV2(string RefKey, string Address,long routeID, long thirdpartyID, long serproDetailID, TransactionQueue TQ = null, WithdrawERCAdminAddress AdminAddress = null, short IsValidateUrl = 0);
        ThirdPartyAPIRequest MakeWebRequestWallet(long routeID, long thirdpartyID, long serproDetailID, string FileName, string Coin);
        ThirdPartyAPIRequest MakeWebRequestColdWallet(long routeID, long thirdpartyID, long serproDetailID, string ReqBody, string Coin);
        //khushali 29-01-2019 for LP integration
        ServiceProConfiguration GetServiceProviderConfiguration(long serproDetailID);
        ThirdPartyAPIRequest MakeWebRequestERC20(long routeID, long thirdpartyID, long serproDetailID, string password, string sitename, string siteid);

        //Rita for Arbitrage LP trasaction
        ServiceProConfigurationArbitrage GetServiceProviderConfigurationArbitrage(long serproDetailID);

        ThirdPartyAPIRequest ArbitrageMakeWebRequest(long routeID, long thirdpartyID, long serproDetailID, TransactionQueueArbitrage TQ = null, WithdrawERCAdminAddress AdminAddress = null);
    }
}
