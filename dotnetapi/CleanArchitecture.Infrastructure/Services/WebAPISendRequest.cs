using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.SharedKernel;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    //For All type of Web Request
    public class WebAPISendRequest : IWebApiSendRequest
    {
        //public readonly ILogger<WebAPISendRequest> _log;

        //public WebAPISendRequest(ILogger<WebAPISendRequest> log)
        //{
        //    _log = log;
        //}

        public string  SendAPIRequestAsync(string Url, string Request, string ContentType,int Timeout= 180000, WebHeaderCollection   headerDictionary = null, string MethodType = "POST" , long TrnNo=0)
        {
            string responseFromServer = "";
            try
            {               
                object ResponseObj = new object();
           //     ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
           //| SecurityProtocolType.Tls11
           //| SecurityProtocolType.Tls12
           //| SecurityProtocolType.Ssl3;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(Url);
                
                
                httpWebRequest.Method = MethodType.ToUpper();
                httpWebRequest.KeepAlive = false;
                httpWebRequest.Timeout = Timeout;
                httpWebRequest.Headers = headerDictionary;
                //httpWebRequest.Headers.Add("Sign", "5cef5eae0f2fb5ec3b82f4632d5bc368eb3afea718611917283fae5fdd781ac55d39a48c6966696034fa20b6277d8a8008e724a48531febcbc317f64d2ce250b");
                //httpWebRequest.Headers.Add("Key", "e0018de31c203c1a32eeb6e0f6245387");
                //ContentType = "application/json";
                httpWebRequest.ContentType = ContentType;  //ntrivedi 11-12-2018 moving contenttype after the headers assgning otherwise content type is overwritten by headerDirectory

                //_log.LogInformation(System.Reflection.MethodBase.GetCurrentMethod().Name, Url, Request);
                HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name,Url + "TrnNo::" + TrnNo.ToString() + "::Request::"+ Request); //ntrivedi logging TrnNo 15-05-2019
               // Request = "admin_id=0&wallet_id=5ae6fce3cee2f9225448f44cf9154900&destination_address=0x65b8e3c2b429bf912d9d2109539b48dada560845&coin=fun&amount=2.0000000000000000&action=sendTransaction&nonce=10122018190117"; //ntrivedi temperory
                if (Request != null)
                {
                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(Request);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }
                }
                HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                using (StreamReader sr = new StreamReader(httpWebResponse.GetResponseStream()))
                {
                    responseFromServer = sr.ReadToEnd();
                    sr.Close();
                    sr.Dispose();

                }
                httpWebResponse.Close();
                //_log.LogInformation(System.Reflection.MethodBase.GetCurrentMethod().Name, responseFromServer); 
                HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "SendAPIRequestAsync Response TrnNo::" + TrnNo.ToString() + "::" +  responseFromServer); //ntrivedi 15-05-2019 adding Trnno in logging
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                
                //throw ex;
            }
            
            return responseFromServer;
        }

        public Task<string> SendRequestAsync(string Url, string Request="", string MethodType = "GET", string ContentType="application/json", WebHeaderCollection Headers = null, int Timeout = 9000,bool IsWrite = true)
        {
            string responseFromServer = "";
            try
            {
                try
                {
                    object ResponseObj = new object();
                    var httpWebRequest = (HttpWebRequest)WebRequest.Create(Url);

                    httpWebRequest.Method = MethodType.ToUpper();
                    if (Headers != null)
                    {
                        httpWebRequest.Headers = Headers;
                    }
                    httpWebRequest.KeepAlive = false;
                    httpWebRequest.Timeout = Timeout;
                    httpWebRequest.ContentType = ContentType;
                    //if (!string.IsNullOrEmpty(Headers))
                    //{
                    // httpWebRequest.Headers.Add(string.Format("Authorization: key={0}", Headers));
                    // }

                    if (IsWrite)
                    {
                        HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, Url);
                    }                    
                    if (Request != "")
                    {
                        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                        {
                            streamWriter.Write(Request);
                            streamWriter.Flush();
                            streamWriter.Close();
                        }
                    }

                    HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                    using (StreamReader sr = new StreamReader(httpWebResponse.GetResponseStream()))
                    {
                        responseFromServer = sr.ReadToEnd();
                        sr.Close();
                        sr.Dispose();
                    }
                    httpWebResponse.Close();
                    if (IsWrite)
                    {
                        HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, responseFromServer);
                    }
                    return Task.FromResult(responseFromServer);
                }
                catch (WebException webex)
                {
                    if (webex.Response != null)
                    {
                        WebResponse errResp = webex.Response;
                        Stream respStream = errResp.GetResponseStream();
                        StreamReader reader = new StreamReader(respStream);
                        string Text = reader.ReadToEnd();
                        if (Text.ToLower().Contains("code"))
                        {
                            responseFromServer = Text;
                        }
                        if (Text.ToLower().Contains("<html>"))
                        {
                            responseFromServer = Text;
                        }
                    }
                    else
                    {
                        responseFromServer = webex.Message;
                    }
                    webex = null;
                    return Task.FromResult(responseFromServer);
                }                
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }            
        }

        public async Task<string> SendTCPSocketRequestAsync(string HostName, string Port, string request)
        {
            string responseFromServer = "";

            int read;
            byte[] buffer1 = new byte[2048];
            bool IsSocketCallDone = false;

            try
            {
                if (string.IsNullOrEmpty(HostName) || string.IsNullOrEmpty(Port))
                {
                    responseFromServer = "Configuration Not Found";
                    return responseFromServer;
                }
                IPAddress ipAddress = IPAddress.Parse(HostName);
                System.Net.Sockets.TcpClient client = new TcpClient();
                await client.ConnectAsync(ipAddress, Convert.ToInt32(Port));
                client.ReceiveTimeout = 61000;
                client.SendTimeout = 61000;
                NetworkStream networkStream = client.GetStream();
                StreamWriter writer = new StreamWriter(networkStream, Encoding.UTF8);

                writer.AutoFlush = true;
                await writer.WriteLineAsync(request);

                read = networkStream.Read(buffer1, 0, buffer1.Length);
                IsSocketCallDone = true;
                byte[] data = new byte[read];
                Array.Copy(buffer1, data, read);
                responseFromServer = Encoding.UTF8.GetString(data);

                networkStream.Close();
                client.Close();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

            return responseFromServer;
        }

        public string SendJsonRpcAPIRequestAsync(string Url,string RequestStr,WebHeaderCollection headerDictionary = null)
        {
            try
            {
                string WSResponse = "";
                try
                {
                    //var authInfo = UserName + ":" + Password;
                    //authInfo = Convert.ToBase64String(Encoding.Default.GetBytes(authInfo));

                    var myReqrpc = WebRequest.Create(Url);
                    //myReqrpc.Headers.Add("Authorization", "Basic " + authInfo);
                    if(headerDictionary!=null)
                    {
                        myReqrpc.Headers = headerDictionary;

                    }
                    myReqrpc.Method = "Post";
                    var sw = new StreamWriter(myReqrpc.GetRequestStream());
                    sw.Write(RequestStr);
                    sw.Close();

                    WebResponse response;
                    response = myReqrpc.GetResponse();

                    StreamReader StreamReader = new StreamReader(response.GetResponseStream());
                    WSResponse = StreamReader.ReadToEnd();
                    StreamReader.Close();
                    response.Close();

                    return WSResponse;
                }
                catch(WebException webex)
                {
                    if(webex.Response!=null)
                    {
                        WebResponse errResp = webex.Response;
                        Stream respStream = errResp.GetResponseStream();
                        StreamReader reader = new StreamReader(respStream);
                        string Text = reader.ReadToEnd();
                        if (Text.ToLower().Contains("code"))
                        {
                            WSResponse = Text;
                        }
                    }
                    else
                    {
                        WSResponse = webex.Message;
                    }
                    webex = null;

                    return WSResponse;
                }
                
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public string SendAPIRequestAsyncWallet(string Url, string Request, string ContentType, int Timeout = 180000, WebHeaderCollection headerDictionary = null, string MethodType = "POST")
        {
            string responseFromServer = "";
            try
            {
                object ResponseObj = new object();
                //     ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                //| SecurityProtocolType.Tls11
                //| SecurityProtocolType.Tls12
                //| SecurityProtocolType.Ssl3;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(Url);


                httpWebRequest.Method = MethodType.ToUpper();
                httpWebRequest.KeepAlive = false;
                httpWebRequest.Timeout = Timeout;
                httpWebRequest.Headers = headerDictionary;
                //httpWebRequest.Headers.Add("Sign", "5cef5eae0f2fb5ec3b82f4632d5bc368eb3afea718611917283fae5fdd781ac55d39a48c6966696034fa20b6277d8a8008e724a48531febcbc317f64d2ce250b");
                //httpWebRequest.Headers.Add("Key", "e0018de31c203c1a32eeb6e0f6245387");
                httpWebRequest.ContentType = ContentType;  //ntrivedi 11-12-2018 moving contenttype after the headers assgning otherwise content type is overwritten by headerDirectory

                //_log.LogInformation(System.Reflection.MethodBase.GetCurrentMethod().Name, Url, Request);
                HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, Url + "Request::" + Request);
                // Request = "admin_id=0&wallet_id=5ae6fce3cee2f9225448f44cf9154900&destination_address=0x65b8e3c2b429bf912d9d2109539b48dada560845&coin=fun&amount=2.0000000000000000&action=sendTransaction&nonce=10122018190117"; //ntrivedi temperory
                if (Request != null)
                {
                    using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        streamWriter.Write(Request);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }
                }
                HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
                using (StreamReader sr = new StreamReader(httpWebResponse.GetResponseStream()))
                {
                    responseFromServer = sr.ReadToEnd();
                    sr.Close();
                    sr.Dispose();
                }
                ////static
                //if (httpWebResponse.StatusCode == HttpStatusCode.OK)
                //{
                //    responseFromServer = "Success";
                //    return responseFromServer;
                //}
               
                httpWebResponse.Close();
                HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, responseFromServer);
                return responseFromServer;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
       
        }
    }
}
