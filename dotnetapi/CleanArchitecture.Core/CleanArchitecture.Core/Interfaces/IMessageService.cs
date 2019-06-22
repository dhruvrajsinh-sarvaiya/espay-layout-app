using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IMessageService
    {
        Task<string> SendEmailAsync(string Recepient, string Subject, string BCC,string CC, string Body, string Url, string UserID, string Password,string Port);
        //Task SendEmailViaSendgridAsync(string Email, string Recepient, string Subject, string BCC,string CC, string Body, string Url, string UserID, string Password);
        Task<string> SendSMSAsync(long Mobile, string Message, string Url, string SerderID, string UserID, string Password,long AppType);
        Task<string> SendNotificationAsync(string DeviceID, string tickerText, string contentTitle, string Message, string Url, string Request, string APIKey, string MethodType, string ContentType);
        Task<TemplateMasterData> ReplaceTemplateMasterData(EnTemplateType TemplateType, CommunicationParamater MessageParameter, enCommunicationServiceType CommType);
    }
}
