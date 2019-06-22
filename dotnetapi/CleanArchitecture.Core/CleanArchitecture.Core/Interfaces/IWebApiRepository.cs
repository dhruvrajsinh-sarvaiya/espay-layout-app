using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Wallet;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IWebApiRepository
    {
        WebApiConfigurationResponse GetThirdPartyAPIData(long ThirPartyAPIID);

        GetDataForParsingAPI GetDataForParsingAPI(long ThirPartyAPIID);

        //ntrivedi fetch route
        List<TransactionProviderResponse> GetProviderDataList(TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponse>> GetProviderDataListAsync(TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponseForWithdraw>> GetProviderDataListAsyncForWithdraw(TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponse3>> GetProviderDataListForBalCheckAsync(long SerProId,TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponse2>> GetProviderDataListForBalCheckAsyncV2(long SerProID, TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponse>> GetProviderDataListV2Async(TransactionApiConfigurationRequest Request);
        Task<List<TransactionProviderResponse>> GetProviderDataListArbitrageV2Async(TransactionApiConfigurationRequest Request);
        //List<WalletServiceData> StatusCheck();
        Task<List<TransactionProviderArbitrageResponse>> GetProviderDataListArbitrageAsync(TransactionApiConfigurationRequest Request);//Rita 11-6-19
    }
}
