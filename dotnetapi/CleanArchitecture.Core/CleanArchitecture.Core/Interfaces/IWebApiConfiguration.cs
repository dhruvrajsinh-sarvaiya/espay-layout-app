﻿using CleanArchitecture.Core.ApiModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IProviderDataList<in TRequest, TResponse>
    {
        IEnumerable<TResponse> GetProviderDataList(TRequest Request);
    }

    public interface IWebApiData
    {
        WebApiConfigurationResponse GetAPIConfiguration(long ThirPartyAPIID);
    }

    public interface IWebApiSendRequest
    {
        String SendAPIRequestAsync(string Url, string Request, string ContentType, int Timeout, WebHeaderCollection headerDictionary ,string MethodType = "POST",long TrnNo = 0);
        //Task<TResponse> GetTemplateConfigurationAsync(TRequest Request);
        // ntrivedi 04-10-2018 do not need async method due to single wait process
        //vsolanki 8-10-2018 define the method
        Task<string> SendRequestAsync(string Url, string Request = "", string MethodType = "GET", string ContentType = "application/json", WebHeaderCollection Headers = null, int Timeout = 9000, bool IsWrite = true);
        Task<string> SendTCPSocketRequestAsync(string HostName, string Port, string request);
        string SendJsonRpcAPIRequestAsync(string Url, string RequestStr,WebHeaderCollection headerDictionary = null);
        String SendAPIRequestAsyncWallet(string Url, string Request, string ContentType, int Timeout, WebHeaderCollection headerDictionary, string MethodType = "POST");

    }

    public interface IWebApiParseResponse<TResponse>
    {
        //TResponse TransactionParseResponse(string TransactionResponse, long ThirPartyAPIID);             
    }
   
}