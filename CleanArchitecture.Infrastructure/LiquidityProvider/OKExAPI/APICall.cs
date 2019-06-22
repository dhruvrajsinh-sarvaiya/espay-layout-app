using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
//using OKExSDK;
//using OKExSDK.Models;
using System.Net.Http.Headers;
using System.Threading;

namespace CleanArchitecture.Infrastructure.LiquidityProvider.OKExAPI
{
    static class Encryptor
    {
        public static string HmacSHA256(string infoStr, string secret)
        {
            byte[] sha256Data = Encoding.UTF8.GetBytes(infoStr);
            byte[] secretData = Encoding.UTF8.GetBytes(secret);
            using (var hmacsha256 = new HMACSHA256(secretData))
            {
                byte[] buffer = hmacsha256.ComputeHash(sha256Data);
                return Convert.ToBase64String(buffer);
            }
        }

        public static string MakeSign(string apiKey, string secret, string phrase)
        {
            var timeStamp = (DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;
            var sign = Encryptor.HmacSHA256($"{timeStamp}GET/users/self/verify", secret);
            var info = new
            {
                op = "login",
                args = new List<string>()
                        {
                        apiKey,phrase,timeStamp.ToString(),sign
                        }
            };
            return JsonConvert.SerializeObject(info);
        }
    }

    public class objRootObject
    {
        public DateTime iso { get; set; }
        public string epoch { get; set; }
    }

    public class APICall
    {
        #region Private API for cancel Order
        public async static Task<OKExCancelOrderReturn> cancelOrderAsync(string instrument_id, string order_id)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var Url = new Uri("https://www.okex.com/api/futures/v3/cancel_order/");
                    string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                    JObject post_params = new JObject();
                    post_params.Add("instrument_id", instrument_id.ToString());
                    post_params.Add("order_id", order_id.ToString());
                    string serializedParms = JsonConvert.SerializeObject(post_params);
                    string Signature = CreateSignature(Url, serializedParms, nonce, "GET");
                    var content = CreateHttpContent(serializedParms);
                    var request = CreateHttpRequestMessage(Url, Signature, content, nonce);
                    var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<OKExCancelOrderReturn>(result);
                    return response;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        #endregion

        #region public API for GetOrderBook
        public async static Task<OKExGetOrderBookReturn> getBookAsync(string instrument_id, int? size, int? depth)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var Result = await client.GetAsync("https://www.okex.com/api/spot/v3/instruments/" + instrument_id + "/book?size=" + size.ToString() + "&depth=" + depth.ToString()).Result.Content.ReadAsStringAsync();
                    //var Result = "{\"asks\":[[\"7980\",\"3.23064069\",\"11\"],[\"7990\",\"1.8687824\",\"6\"]],\"bids\":[[\"7970\",\"8.16271663\",\"18\"]],\"timestamp\":\"2019-06-12T12:57:35.483Z\"}";

                    if (!Result.Contains("<!DOCTYPE html>") && Result != null)
                    {
                        try
                        {
                            var Response = JsonConvert.DeserializeObject<OKExGetOrderBookReturn>(Result);
                            return Response;
                        }
                        catch (Exception e)
                        {
                            return null;
                        }

                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        #endregion

        #region Public API for GetMarketData
        public async static Task<OKExGetMarketDataReturn> getCandlesAsync(string instrument_id, DateTime? start, DateTime? end, int? granularity)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var Result = await client.GetAsync("https://www.okex.com/api/spot/v3/instruments" + instrument_id + "/candles?granularity" + granularity.ToString() + "&start=" + start.ToString() + "&end=" + end.ToString()).Result.Content.ReadAsStringAsync();
                    if (!Result.Contains("<!DOCTYPE html>") && Result != null)
                    {
                        try
                        {
                            var Response = JsonConvert.DeserializeObject<OKExGetMarketDataReturn>(Result);
                            return Response;
                        }
                        catch (Exception e)
                        {
                            return null;
                        }

                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        #endregion

        #region Public API for GetFillerInformation(Trade History)
        public async static Task<GetOKEXTradeHistoryResult> getTradesAasync(string instrument_id, int? from, int? to, int? limit)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    //var Result = await client.GetAsync("https://www.okex.com/api/spot/v3/instruments" + instrument_id + "/trades?limit" + limit.ToString() + "&from=" + from.ToString() + "&to=" + to.ToString()).Result.Content.ReadAsStringAsync();
                    var Result = await client.GetAsync("https://www.okex.com/api/spot/v3/instruments/" + instrument_id + "/trades").Result.Content.ReadAsStringAsync();
                    //var Result = "{\"result\":[{\"time\":\"2019-06-17T06:28:34.535Z\",\"timestamp\":\"2019-06-17T06:28:34.535Z\",\"trade_id\":\"1612709497\",\"price\":\"9103.2\",\"size\":\"0.0373\",\"side\":\"buy\"}]}";
                    if (!Result.Contains("<!DOCTYPE html>") && Result != null)
                    {
                        try
                        {
                            Result = "{\"result\":" + Result + "}";
                            var Response = JsonConvert.DeserializeObject<GetOKEXTradeHistoryResult>(Result);
                            return Response;
                        }
                        catch (Exception e)
                        {
                            return null;
                        }

                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        #endregion

        #region Private API for Place an Order
        public async static Task<OKExPlaceOrderReturn> makeOrderAsync(string instrument_id, string type, decimal price, decimal size, int leverage, string client_oid, string match_price)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var uri = new Uri("https://www.okex.com/api/futures/v3/order");
                    string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                    JObject post_params = new JObject();
                    post_params.Add("client_oid", client_oid);
                    post_params.Add("instrument_id", instrument_id);
                    post_params.Add("type", type);
                    post_params.Add("price", price);
                    post_params.Add("size", size);
                    post_params.Add("match_price", match_price);
                    post_params.Add("leverage", leverage);
                    string serializedParms = JsonConvert.SerializeObject(post_params);
                    string signature = CreateSignature(uri, serializedParms, nonce, "GET");
                    var content = CreateHttpContent(serializedParms);
                    var request = CreateHttpRequestMessage(uri, signature, content, nonce);
                    var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<OKExPlaceOrderReturn>(result);
                    return response;
                }
                catch (Exception e) { throw e; };
            }
        }
        #endregion

        #region Private API for GetOrderInformation
        public async static Task<OKExGetOrderInfoReturn> getOrdersAsync(string instrument_id, string order_id, string client_oid)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var uri = new Uri("https://www.okex.com/api/futures/v3/orders/");
                    string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                    JObject post_params = new JObject();
                    post_params.Add("instrument_id", instrument_id);
                    post_params.Add("order_id", order_id);
                    post_params.Add("client_oid", client_oid);
                    string serializedParms = JsonConvert.SerializeObject(post_params);
                    string signature = CreateSignature(uri, serializedParms, nonce, "GET");
                    var content = CreateHttpContent(serializedParms);
                    var request = CreateHttpRequestMessage(uri, signature, content, nonce);
                    var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<OKExGetOrderInfoReturn>(result);
                    return response;
                }
                catch (Exception e) { throw e; };
            }
        }

        //public async static Task<OKExGetOrderInfoReturn> getOrdersAsync(string instrument_id, string order_id, string client_oid)
        //{

        //    try
        //    {
        //        var url = $"{"https://www.okex.com/"}{"api/futures/v3"}/orders";
        //        var body = new
        //        {
        //            instrument_id = instrument_id,
        //            client_oid = client_oid,
        //            order_id = order_id
        //        };
        //        var bodyStr = JsonConvert.SerializeObject(body);
        //        using (var client = new HttpClient(new HttpInterceptor(OKEXGlobalSettings.API_Key, OKEXGlobalSettings.Secret, OKEXGlobalSettings.PassPhrase, null)))
        //        {
        //            var res = await client.PostAsync(url, new StringContent(bodyStr, Encoding.UTF8, "application/json"));
        //        }
        //        //var response = JsonConvert.DeserializeObject<OKExGetOrderInfoReturn>(result);
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //}

        #endregion

        #region Private API for GetAllOpenOrder
        public async static Task<OKExGetAllOpenOrderReturn> getPendingOrdersAsync(string instrument_id, int? from, int? to, int? limit)
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var uri = new Uri("https://www.okex.com/api/spot/v3/orders_pending");
                string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                JObject post_params = new JObject();
                post_params.Add("instrument_id", instrument_id);
                post_params.Add("from", from);
                post_params.Add("to", to);
                post_params.Add("limit", limit);
                string serializedParms = JsonConvert.SerializeObject(post_params);
                string signature = CreateSignature(uri, serializedParms, nonce, "GET");
                var content = CreateHttpContent(serializedParms);
                var request = CreateHttpRequestMessage(uri, signature, content, nonce);
                var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
                var response = JsonConvert.DeserializeObject<OKExGetAllOpenOrderReturn>(result);
                return response;
            }
            catch (Exception e) { throw e; };
        }
    }
    #endregion

    #region Private API for GetWalletBalance(Funding Account Information)
    //public async static Task<OKExGetWalletBalanceReturn> getWalletInfoAsync()
    //{
    //    using (HttpClient client = new HttpClient())
    //    {
    //        try
    //        {
    //            var uri =  new Uri("https://www.okex.com/api/account/v3/wallet");
    //            string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
    //            //JObject post_params = new JObject();
    //            //string serializedParms = JsonConvert.SerializeObject(post_params);
    //            //string signature = GetSignature(uri, nonce).Result;
    //            //string authenticationString = "Basic " + GlobalSettings.API_Key + ":" + signature + ":" + nonce;
    //            //client.DefaultRequestHeaders.Add("Authentication", authenticationString);
    //            //string result = await client.PostAsync(uri, null).Result.Content.ReadAsStringAsync();
    //            JObject post_params = new JObject();
    //            //post_params.Add("Currency", "XMR"); //not needed for getbalances, but I left it in here to show how post params would be used
    //            string serializedParms = JsonConvert.SerializeObject(post_params);
    //            string signature = CreateSignature(uri, serializedParms, nonce);
    //            var content = CreateHttpContent(serializedParms);
    //            var request = CreateHttpRequestMessage(uri, signature, content, nonce);
    //            //var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();   
    //            var result ="{\"available\":37.11827078,\"balance\":37.11827078,\"currency\":\"EOS\",\"hold\":\"0\"}";
    //            var response = JsonConvert.DeserializeObject<OKExGetWalletBalanceReturn>(result);
    //            return response;
    //        }
    //        catch (Exception e) { throw e; };
    //    }
    //}

    //public async static Task<OKExGetWalletBalanceReturn> getWalletInfoAsync()
    //{
    //    using (HttpClient client = new HttpClient())
    //    {
    //        try
    //        {
    //            var uri = new Uri("https://www.okex.com/api/account/v3/wallet");
    //            string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
    //            var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://www.okex.com/api/general/v3/time");
    //            string responseFromServer = "";
    //            httpWebRequest.Method = "GET";
    //            HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
    //            using (StreamReader sr = new StreamReader(httpWebResponse.GetResponseStream()))
    //            {
    //                responseFromServer = sr.ReadToEnd();
    //                sr.Close();
    //                sr.Dispose();
    //            }
    //            httpWebResponse.Close();
    //            if (!String.IsNullOrEmpty(responseFromServer))
    //            {
    //                var data = JsonConvert.DeserializeObject<objRootObject>(responseFromServer);
    //                nonce = data.epoch;
    //            }
    //            //JObject post_params = new JObject();
    //            //string serializedParms = JsonConvert.SerializeObject(post_params);
    //            //string signature = GetSignature(uri, nonce).Result;
    //            //string authenticationString = "Basic " + GlobalSettings.API_Key + ":" + signature + ":" + nonce;
    //            //client.DefaultRequestHeaders.Add("Authentication", authenticationString);
    //            //string result = await client.PostAsync(uri, null).Result.Content.ReadAsStringAsync();
    //            JObject post_params = new JObject();
    //            //post_params.Add("Currency", "XMR"); //not needed for getbalances, but I left it in here to show how post params would be used                    
    //            string serializedParms = JsonConvert.SerializeObject(post_params);
    //            string signature = CreateSignature(uri,"", nonce, "GET");
    //            //string signature = CreateSignature(uri, serializedParms, nonce, "GET");
    //            //string signature = "Nwg8+NaDZjU7euoeNNKgy+VNAV/h5gk+J1X38wBasmI=";
    //            var content = CreateHttpContent(serializedParms);
    //            var request = CreateHttpRequestMessage(uri, signature, content, nonce);
    //            var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
    //            //var result ="{\"available\":37.11827078,\"balance\":37.11827078,\"currency\":\"EOS\",\"hold\":\"0\"}";
    //            var response = JsonConvert.DeserializeObject<OKExGetWalletBalanceReturn>(result);
    //            return response;
    //        }
    //        catch (Exception e) { throw e; };
    //    }
    //}

    public async static Task<OKEBalanceResult> getWalletInfoAsync()
    {
        OKEBalanceResult response = new OKEBalanceResult();
        try
        {
            var url = $"{"https://www.okex.com/"}{"api/account/v3"}/wallet";
            using (var client = new HttpClient(new HttpInterceptor(OKEXGlobalSettings.API_Key, OKEXGlobalSettings.Secret, OKEXGlobalSettings.PassPhrase, null)))
            {
                var res = await client.GetAsync(url);
                var contentStr = await res.Content.ReadAsStringAsync();
                contentStr = "{\"Data\":" + contentStr + "}";
                response = JsonConvert.DeserializeObject<OKEBalanceResult>(contentStr);
                return response;
            }
        }
        catch (Exception ex)
        {
            HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, "", ex);
            response = null;
        }
        return response;
    }

    #endregion

    #region Private API for GetWithdrawlFee (Trade Fee)
    public async static Task<OKExGetWithdrawalFeeReturn> getWithDrawalFeeAsync(string currency)
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var uri = new Uri("https://www.okex.com/api/account/v3/withdrawal/fee");
                string nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                JObject post_params = new JObject();
                post_params.Add("currency", currency);
                string serializedParms = JsonConvert.SerializeObject(post_params);
                string signature = CreateSignature(uri, serializedParms, nonce, "GET");
                var content = CreateHttpContent(serializedParms);
                var request = CreateHttpRequestMessage(uri, signature, content, nonce);
                var result = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
                var response = JsonConvert.DeserializeObject<OKExGetWithdrawalFeeReturn>(result);
                return response;
            }
            catch (Exception e) { throw e; };
        }
    }
    #endregion

    #region public API for GetExchangeInformation
    public async static Task<OKExGetExchangeRateInfoReturn> getRateAsync()
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var Result = await client.GetAsync("https://www.okex.com/api/futures/v3/rate").Result.Content.ReadAsStringAsync();
                if (!Result.Contains("<!DOCTYPE html>") && Result != null)
                {
                    try
                    {
                        var Response = JsonConvert.DeserializeObject<OKExGetExchangeRateInfoReturn>(Result);
                        return Response;
                    }
                    catch (Exception e)
                    {
                        return null;
                    }

                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region Public API For LTC - Token Pair Detail
    public async static Task<OKExGetTokenPairDetailReturn> getTokenPairDetailAsycn()
    {
        using (HttpClient client = new HttpClient())
        {
            try
            {
                var Result = await client.GetAsync("https://www.okex.com/api/spot/v3/instruments").Result.Content.ReadAsStringAsync();
                if (!Result.Contains("<!DOCTYPE html>") && Result != null)
                {
                    try
                    {
                        var Response = JsonConvert.DeserializeObject<OKExGetTokenPairDetailReturn>(Result);
                        return Response;
                    }
                    catch (Exception e)
                    {
                        return null;
                    }

                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region OLd Code
    //public static string CreateSignature(Uri uri, string parameters, string nonce)
    //{

    //    //SIGNATURE: API_KEY + "POST" + URI + NONCE + POST_PARAMS(signed by secret key according to HMAC - SHA512 method.)
    //    string endpoint = WebUtility.UrlEncode(uri.ToString()).ToLower();
    //    parameters = Convert.ToBase64String(Encoding.UTF8.GetBytes(parameters ?? ""));
    //    var signature = $"{OKEXGlobalSettings.API_Key }POST{endpoint}{nonce}{parameters}";
    //    using (var hashAlgo = new HMACSHA512(Convert.FromBase64String(OKEXGlobalSettings.Secret)))
    //    {
    //        var signedBytes = hashAlgo.ComputeHash(Encoding.UTF8.GetBytes(signature));
    //        return Convert.ToBase64String(signedBytes);
    //    }
    //}

    //public static HttpContent CreateHttpContent(string jsonParams)
    //{
    //    return new StringContent(jsonParams ?? "", Encoding.UTF8, "application/json");
    //}

    //public static HttpRequestMessage CreateHttpRequestMessage(Uri uri, string signature, HttpContent content, string nonce)
    //{
    //    var header = $"Basic {OKEXGlobalSettings.API_Key }:{signature}:{nonce}";
    //    var message = new HttpRequestMessage(HttpMethod.Post, uri);
    //    message.Headers.Add("Authorization", header);
    //    message.Content = content;
    //    return message;
    //}

    //private static Task<string> GetSignature(string uri, string nonce, string post_params = null)
    //{
    //    string signature = "";
    //    ASCIIEncoding encoding = new ASCIIEncoding();
    //    if (post_params != null)
    //    {
    //        post_params = Convert.ToBase64String(encoding.GetBytes(post_params));
    //        signature = OKEXGlobalSettings.API_Key + "POST" + uri + nonce + post_params;
    //    }
    //    else
    //    {
    //        signature = OKEXGlobalSettings.API_Key + "POST" + uri + nonce;
    //    }
    //    byte[] messageBytes = encoding.GetBytes(signature);
    //    using (HMACSHA512 _object = new HMACSHA512(OKEXGlobalSettings.Secret_Key))
    //    {
    //        byte[] hashmessage = _object.ComputeHash(messageBytes);
    //        return Task.FromResult(Convert.ToBase64String(hashmessage));
    //    }
    //}

    //public static string CreateSignature(Uri uri, string parameters, string nonce)
    //{

    //    //SIGNATURE: API_KEY + "POST" + URI + NONCE + POST_PARAMS(signed by secret key according to HMAC - SHA512 method.)
    //    string endpoint = WebUtility.UrlEncode(uri.ToString()).ToLower();
    //    parameters = Convert.ToBase64String(Encoding.UTF8.GetBytes(parameters ?? ""));
    //    var signature = $"{OKEXGlobalSettings.API_Key }POST{endpoint}{nonce}{parameters}";
    //    using (var hashAlgo = new HMACSHA512(Convert.FromBase64String(OKEXGlobalSettings.Secret)))
    //    {
    //        var signedBytes = hashAlgo.ComputeHash(Encoding.UTF8.GetBytes(signature));
    //        return Convert.ToBase64String(signedBytes);
    //    }
    //}


    //public async static Task<JContainer> getWalletInfoAsync()
    //{

    //    var url = $"{"https://www.okex.com/"}{"api/account/v3"}/wallet";
    //    using (var client = new HttpClient(new HttpInterceptor(OKEXGlobalSettings.API_Key, OKEXGlobalSettings.Secret, OKEXGlobalSettings.PassPhrase, null)))
    //    {
    //        var res = await client.GetAsync(url);
    //        var contentStr = await res.Content.ReadAsStringAsync();
    //        if (contentStr[0] == '[')
    //        {
    //            return JArray.Parse(contentStr);
    //        }
    //        return JObject.Parse(contentStr);
    //    }
    //}

    #endregion

    public static string CreateSignature(Uri uri, string parameters, string nonce, string MethodType)
    {

        //sign = HmacSHA256Base64Utils.sign(timestamp, method(request), requestPath(request),
        // queryString(request), body(request), this.credentials.getSecretKey());
        //SIGNATURE: API_KEY + "POST" + URI + NONCE + POST_PARAMS(signed by secret key according to HMAC - SHA512 method.)
        string url = uri.ToString();
        url = url.Replace("https://www.okex.com/api", "");
        string endpoint = WebUtility.UrlEncode(uri.ToString()).ToLower();
        parameters = Convert.ToBase64String(Encoding.UTF8.GetBytes(parameters ?? ""));
        var signature = $"{nonce}{MethodType}{url}{parameters}{OKEXGlobalSettings.Secret }";
        //byte[] key = Encoding.ASCII.GetBytes(signature);
        //var hashAlgo = new HMACSHA256(Encoding.ASCII.GetBytes(Convert.ToBase64String(key)));
        //var signedBytes = hashAlgo.ComputeHash(key);
        //return Convert.ToBase64String(signedBytes);
        string sign = "";
        if (!String.IsNullOrEmpty(parameters))
        {
            sign = Encryptor.HmacSHA256($"{nonce}{MethodType}{url}{parameters}", OKEXGlobalSettings.Secret);
        }
        else
        {
            sign = Encryptor.HmacSHA256($"{nonce}{MethodType}{url}", OKEXGlobalSettings.Secret);
        }
        return sign;
    }

    public static HttpContent CreateHttpContent(string jsonParams)
    {
        return new StringContent(jsonParams ?? "", Encoding.UTF8, "application/json");
    }

    //public static HttpRequestMessage CreateHttpRequestMessage(Uri uri, string signature, HttpContent content, string nonce)
    //{
    //    var header = $"Basic {OKEXGlobalSettings.API_Key }:{signature}:{nonce}";
    //    var message = new HttpRequestMessage(HttpMethod.Post, uri);
    //    message.Headers.Add("Authorization", header);
    //    message.Content = content;
    //    return message;
    //}

    public static HttpRequestMessage CreateHttpRequestMessage(Uri uri, string signature, HttpContent content, string nonce)
    {
        try
        {
            //var header = $"Basic {OKEXGlobalSettings.API_Key }:{signature}:{nonce}:{OKEXGlobalSettings.PassPhrase}";
            var message = new HttpRequestMessage(HttpMethod.Get, uri);
            //message.Headers.Add("Content-Type", "application/json");
            message.Headers.Add("OK-ACCESS-KEY", OKEXGlobalSettings.API_Key);
            message.Headers.Add("OK-ACCESS-SIGN", signature);
            message.Headers.Add("OK-ACCESS-TIMESTAMP", nonce);
            message.Headers.Add("OK-ACCESS-PASSPHRASE", OKEXGlobalSettings.PassPhrase);
            message.Content = content;
            return message;
        }
        catch (Exception ex)
        {
            HelperForLog.WriteErrorLog("CreateHttpRequestMessage", "LiquidityProvider.OKExAPI", ex);
            return null;
        }
    }
}

class HttpInterceptor : DelegatingHandler
{
    private string _apiKey;
    private string _passPhrase;
    private string _secret;
    private string _bodyStr;
    public HttpInterceptor(string apiKey, string secret, string passPhrase, string bodyStr)
    {
        this._apiKey = apiKey;
        this._passPhrase = passPhrase;
        this._secret = secret;
        this._bodyStr = bodyStr;
        InnerHandler = new HttpClientHandler();
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var method = request.Method.Method;
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Headers.Add("OK-ACCESS-KEY", this._apiKey);

        var now = DateTime.Now;
        var timeStamp = TimeZoneInfo.ConvertTimeToUtc(now).ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        var requestUrl = request.RequestUri.PathAndQuery;
        string sign = "";
        if (!String.IsNullOrEmpty(this._bodyStr))
        {
            sign = Encryptor.HmacSHA256($"{timeStamp}{method}{requestUrl}{this._bodyStr}", this._secret);
        }
        else
        {
            sign = Encryptor.HmacSHA256($"{timeStamp}{method}{requestUrl}", this._secret);
        }

        request.Headers.Add("OK-ACCESS-SIGN", sign);
        request.Headers.Add("OK-ACCESS-TIMESTAMP", timeStamp.ToString());
        request.Headers.Add("OK-ACCESS-PASSPHRASE", this._passPhrase);

        return base.SendAsync(request, cancellationToken);
    }
}
}
