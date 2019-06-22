using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.Interfaces.User;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.AccountViewModels.SignUp;
using CleanArchitecture.Infrastructure.BGTask;
using MediatR;

namespace CleanArchitecture.Infrastructure.Services.User
{
    public partial class OtpMasterService : IOtpMasterService
    {
        private readonly CleanArchitectureContext _dbContext;
        private readonly IUserService _userService;
        //private readonly ICustomRepository<OtpMaster> _customRepository;
        private readonly IMessageRepository<OtpMaster> _customRepository;
        private readonly IRegisterTypeService _registerTypeService;
        //private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue; //24-11-2018 komal make Email Enqueue
        private IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;//24-11-2018 komal make SMS Enqueue

        public OtpMasterService(
            CleanArchitectureContext dbContext, IUserService userService,
            //ICustomRepository<OtpMaster> customRepository,
            IMessageRepository<OtpMaster> customRepository,


        //IRegisterTypeService registerTypeService, IMediator mediator, IMessageService messageService)
        IRegisterTypeService registerTypeService, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, 
        IMessageService MessageService, IPushNotificationsQueue<SendSMSRequest> PushSMSQueue)
        {
            _dbContext = dbContext;
            _userService = userService;
            _customRepository = customRepository;
            //_customRepository = customRepository;
            _registerTypeService = registerTypeService;
            //_mediator = mediator;
            _messageService = MessageService;
            _pushNotificationsQueue = pushNotificationsQueue; //24-11-2018 komal make Email Enqueue
            _pushSMSQueue = PushSMSQueue; //24-11-2018 komal make SMS Enqueue
        }

        public async Task<OtpMasterViewModel> AddOtp(int UserId, string Email = null, string Mobile = null)
        {
            try//Rita 11-3-19 added try cach as error in LoginWithEmail Object reference not set to an instance of an object.
            {
                var checkotp = await GetOtpData(UserId);
                string OtpValue = string.Empty;
                if (checkotp != null)
                    UpdateOtp(checkotp.Id);
                OtpValue = _userService.GenerateRandomOTPWithPassword().ToString();
                string alpha = string.Empty; string numeric = string.Empty;
                foreach (char str in OtpValue)
                {
                    if (char.IsDigit(str))
                    {
                        if (numeric.Length < 6)
                            numeric += str.ToString();
                        else
                            alpha += str.ToString();
                    }
                    else
                        alpha += str.ToString();
                }

                int Regtypeid = 0;
                if (!String.IsNullOrEmpty(Email))
                {
                    Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Email);
                }
                else if (!String.IsNullOrEmpty(Mobile))
                {
                    Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Mobile);
                }

                var currentotp = new OtpMaster
                {
                    UserId = UserId,
                    RegTypeId = Regtypeid,
                    OTP = numeric,
                    CreatedTime = DateTime.UtcNow,
                    //ExpirTime = DateTime.UtcNow.AddHours(2),
                    ExpirTime = DateTime.UtcNow.AddMinutes(5), // khushali 15-02-2019 OTP expire in 5 min As per discussion with Kartik bhai
                    Status = 0,
                    CreatedDate = DateTime.UtcNow,
                    CreatedBy = UserId
                };
                _customRepository.Add(currentotp);

                if (!String.IsNullOrEmpty(Email))
                {
                    //SendEmailRequest request = new SendEmailRequest();
                    //request.Recepient = Email;
                    // request.Subject = EnResponseMessage.LoginEmailSubject;
                    // request.Body = EnResponseMessage.SendMailBody + numeric;



                    //IQueryable Result = await _messageService.GetTemplateConfigurationAsync
                    //(Convert.ToInt16(enCommunicationServiceType.Email), Convert.ToInt16(EnTemplateType.LoginWithOTP), 0);
                    //foreach (TemplateMasterData Provider in Result)
                    //{
                    //    Provider.Content = Provider.Content.Replace("###USERNAME###".ToUpper(), Email);
                    //    Provider.Content = Provider.Content.Replace("###Password###".ToUpper(), numeric);
                    //    Provider.Content = Provider.Content.Replace("###year###".ToUpper(), DateTime.Now.Year.ToString());
                    //    //string[] splitedarray = Provider.AdditionaInfo.Split(",");
                    //    //foreach (string s in splitedarray)
                    //    //{

                    //    //}
                    //    request.Body = Provider.Content;
                    //    request.Subject = Provider.AdditionalInfo;
                    //}
                    //_pushNotificationsQueue.Enqueue(request); //24-11-2018 komal make Email Enqueue
                    //await _mediator.Send(request);

                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++//
                    // khushali 30-01-2019 for Common Template Method call 
                    TemplateMasterData TemplateData = new TemplateMasterData();
                    CommunicationParamater communicationParamater = new CommunicationParamater();
                    SendEmailRequest request = new SendEmailRequest();
                    communicationParamater.Param1 = Email;
                    communicationParamater.Param2 = numeric.ToString();
                    TemplateData = _messageService.ReplaceTemplateMasterData(EnTemplateType.LoginWithOTP, communicationParamater, enCommunicationServiceType.Email).Result;
                    if (TemplateData != null)
                    {
                        if (TemplateData.IsOnOff == 1)
                        {
                            request.Recepient = Email;
                            request.Body = TemplateData.Content;
                            request.Subject = TemplateData.AdditionalInfo;
                            _pushNotificationsQueue.Enqueue(request);
                        }
                    }
                }
                if (!String.IsNullOrEmpty(Mobile))
                {
                    //SendSMSRequest request = new SendSMSRequest();
                    //request.MobileNo = Convert.ToInt64(Mobile);
                    //request.Message = EnResponseMessage.SendMailBody + numeric;
                    ////await _mediator.Send(request);
                    //_pushSMSQueue.Enqueue(request); //24-11-2018 komal make SMS Enqueue

                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++//
                    // khushali 30-01-2019 for Common Template Method call 
                    TemplateMasterData TemplateData = new TemplateMasterData();
                    CommunicationParamater communicationParamater = new CommunicationParamater();
                    SendSMSRequest request = new SendSMSRequest();
                    communicationParamater.Param1 = numeric.ToString();
                    TemplateData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_VerificationCode, communicationParamater, enCommunicationServiceType.SMS).Result;
                    if (TemplateData != null)
                    {
                        if (TemplateData.IsOnOff == 1)
                        {
                            request.MobileNo = Convert.ToInt64(Mobile);
                            request.Message = TemplateData.Content;
                            _pushSMSQueue.Enqueue(request);
                        }
                    }
                }

                string _Pass1 = alpha.Substring(0, 20);
                string _Pass11 = _Pass1 + numeric.Substring(0, 3);
                string _Pass2 = alpha.Substring(20, 10);
                string _Pass22 = _Pass2 + numeric.Substring(3, 3);
                string _Pass3 = alpha.Substring(30, 28);
                string password = _Pass11 + _Pass22 + _Pass3;

                OtpMasterViewModel model = new OtpMasterViewModel();
                if (currentotp != null)
                {
                    model.UserId = currentotp.UserId;
                    model.RegTypeId = currentotp.RegTypeId;
                    model.OTP = currentotp.OTP;
                    model.CreatedTime = currentotp.CreatedTime;
                    model.ExpirTime = currentotp.ExpirTime;
                    model.Status = currentotp.Status;
                    model.Id = currentotp.Id;
                    model.Password = password;
                    model.appkey = alpha;
                    return model;
                }
                else
                    return null;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("AddOtp", "OtpMasterService", ex);
                return null;
            }
        }

        public async Task<OtpMasterViewModel> AddOptionalOtp(int UserId, string Email = null, string Mobile = null)
        {
            var checkotp = await GetOtpData(UserId);
            string OtpValue = string.Empty;
            if (checkotp != null)
                UpdateOtp(checkotp.Id);

            int Regtypeid = 0;
            if (!String.IsNullOrEmpty(Email))
            {
                Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Email);
            }
            else if (!String.IsNullOrEmpty(Mobile))
            {
                Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Mobile);
            }

            var currentotp = new OtpMaster
            {
                UserId = UserId,
                RegTypeId = Regtypeid,
                OTP = _userService.GenerateRandomOTP().ToString(),
                CreatedTime = DateTime.UtcNow,
                //ExpirTime = DateTime.UtcNow.AddHours(2),
                ExpirTime = DateTime.UtcNow.AddMinutes(5), // khushali 15-02-2019 OTP expire in 5 min As per discussion with Kartik bhai
                Status = 0,
                CreatedDate = DateTime.Now,
                CreatedBy = UserId
            };
            _customRepository.Add(currentotp);

            if (!String.IsNullOrEmpty(Email))
            {
                //SendEmailRequest request = new SendEmailRequest();
                //request.Recepient = Email;
                //IQueryable Result = await _messageService.GetTemplateConfigurationAsync(Convert.ToInt16(enCommunicationServiceType.Email), Convert.ToInt16(EnTemplateType.LoginWithOTP), 0);
                //foreach (TemplateMasterData Provider in Result)
                //{
                //    Provider.Content = Provider.Content.Replace("###USERNAME###".ToUpper(), Email);
                //    Provider.Content = Provider.Content.Replace("###Password###".ToUpper(), currentotp.OTP);
                //    Provider.Content = Provider.Content.Replace("###year###".ToUpper(), DateTime.Now.Year.ToString());
                //    request.Body = Provider.Content;
                //    request.Subject = Provider.AdditionalInfo;
                //}
                //_pushNotificationsQueue.Enqueue(request);

                //+++++++++++++++++++++++++++++++++++++++++++++++++++++//
                // khushali 30-01-2019 for Common Template Method call 
                TemplateMasterData TemplateData = new TemplateMasterData();
                CommunicationParamater communicationParamater = new CommunicationParamater();
                SendEmailRequest request = new SendEmailRequest();
                communicationParamater.Param1 = Email; // param1 - Username
                communicationParamater.Param2 = currentotp.OTP; // param2 - OTP
                TemplateData = _messageService.ReplaceTemplateMasterData(EnTemplateType.LoginWithOTP, communicationParamater, enCommunicationServiceType.Email).Result;
                if (TemplateData != null)
                {
                    if (TemplateData.IsOnOff == 1)
                    {
                        request.Recepient = Email;
                        request.Body = TemplateData.Content;
                        request.Subject = TemplateData.AdditionalInfo;
                        _pushNotificationsQueue.Enqueue(request);
                    }
                }
            }
            if (!String.IsNullOrEmpty(Mobile))
            {
                //SendSMSRequest request = new SendSMSRequest();
                //request.MobileNo = Convert.ToInt64(Mobile);
                //request.Message = EnResponseMessage.SendMailBody + currentotp.OTP;
                //_pushSMSQueue.Enqueue(request);
                TemplateMasterData TemplateData = new TemplateMasterData();
                CommunicationParamater communicationParamater = new CommunicationParamater();
                SendSMSRequest request = new SendSMSRequest();
                communicationParamater.Param1 = currentotp.OTP; // param1 - OTP
                TemplateData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_VerificationCode, communicationParamater, enCommunicationServiceType.SMS).Result;
                if (TemplateData != null)
                {
                    if (TemplateData.IsOnOff == 1)
                    {
                        request.MobileNo = Convert.ToInt64(Mobile);
                        request.Message = TemplateData.Content;
                        _pushSMSQueue.Enqueue(request);
                    }
                }
            }


            OtpMasterViewModel model = new OtpMasterViewModel();
            if (currentotp != null)
            {
                model.UserId = currentotp.UserId;
                model.RegTypeId = currentotp.RegTypeId;
                model.OTP = currentotp.OTP;
                model.CreatedTime = currentotp.CreatedTime;
                model.ExpirTime = currentotp.ExpirTime;
                model.Status = currentotp.Status;
                model.Id = currentotp.Id;
                //model.Password = password;
                //model.appkey = alpha;
                return model;
            }
            else
                return null;
        }

        public async Task<OtpMasterViewModel> GetOtpData(int Id)
        {
            // khushali 12-04-2019  login with OTP it shows invalid OTP every time even if user entering correct otp (resolve Ticket )
            var otpmaster = _dbContext.OtpMaster.Where(i => i.UserId == Id && !i.EnableStatus).OrderByDescending(e => e.Id).FirstOrDefault();
            if (otpmaster != null)
            {
                OtpMasterViewModel model = new OtpMasterViewModel();

                model.UserId = otpmaster.UserId;
                model.RegTypeId = otpmaster.RegTypeId;
                model.OTP = otpmaster.OTP;
                model.CreatedTime = otpmaster.CreatedTime;
                model.ExpirTime = otpmaster.ExpirTime;
                model.EnableStatus = otpmaster.EnableStatus;
                model.Id = otpmaster.Id;
                return model;
            }
            else
                return null;
        }

        public void UpdateOtp(long Id)
        {
            //var tempdata = _customRepository.GetById(Convert.ToInt16(Id));
            var tempdata = _customRepository.GetById(Id);//ntrivedi 29-03-2019 conversion error in paro live 
            tempdata.SetAsOTPStatus();
            tempdata.SetAsUpdateDate(tempdata.UserId);
            //tempdata.Status = true;
            _customRepository.Update(tempdata);
        }
        public async Task<OtpMasterViewModel> AddOtpForSignupuser(int UserId, string Email = null, string Mobile = null)
        {
            var checkotp = await GetOtpData(UserId);
            string OtpValue = string.Empty;
            if (checkotp != null)
                UpdateOtp(checkotp.Id);
            OtpValue = _userService.GenerateRandomOTPWithPassword().ToString();
            string alpha = string.Empty; string numeric = string.Empty;
            foreach (char str in OtpValue)
            {
                if (char.IsDigit(str))
                {
                    if (numeric.Length < 6)
                        numeric += str.ToString();
                    else
                        alpha += str.ToString();
                }
                else
                    alpha += str.ToString();
            }

            int Regtypeid = 0;
            if (!String.IsNullOrEmpty(Email))
            {
                Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Email);
            }
            else if (!String.IsNullOrEmpty(Mobile))
            {
                Regtypeid = await _registerTypeService.GetRegisterId(Core.Enums.enRegisterType.Mobile);
            }

            var currentotp = new OtpMaster
            {
                UserId = UserId,
                RegTypeId = Regtypeid,
                OTP = numeric,
                CreatedTime = DateTime.UtcNow,
                //ExpirTime = DateTime.UtcNow.AddHours(2),
                ExpirTime = DateTime.UtcNow.AddMinutes(5), // khushali 15-02-2019 OTP expire in 5 min As per discussion with Kartik bhai
                Status = 0,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = UserId
            };
            _customRepository.Add(currentotp);





            OtpMasterViewModel model = new OtpMasterViewModel();
            if (currentotp != null)
            {
                model.UserId = currentotp.UserId;
                model.RegTypeId = currentotp.RegTypeId;
                model.OTP = currentotp.OTP;
                model.CreatedTime = currentotp.CreatedTime;
                model.ExpirTime = currentotp.ExpirTime;
                model.Status = currentotp.Status;
                model.Id = currentotp.Id;
                // model.Password = password;
                model.appkey = alpha;
                return model;
            }
            else
                return null;
        }
        public void UpdateEmailAndMobileOTP(long id)
        {
            try
            {
                var otpmaster = _dbContext.OtpMaster.Where(i => i.Id == id).LastOrDefault();
                if (otpmaster != null)
                {
                    otpmaster.EnableStatus = true;
                    otpmaster.UpdatedBy = otpmaster.UserId;
                    otpmaster.UpdatedDate = DateTime.UtcNow;
                    _customRepository.Update(otpmaster);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
