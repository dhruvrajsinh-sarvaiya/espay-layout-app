﻿using CleanArchitecture.Core.Entities.KYC;
using CleanArchitecture.Core.Interfaces.KYC;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.KYC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.KYC
{
    public class PersonalVerificationService : IPersonalVerificationService
    {
        //private readonly CleanArchitectureContext _dbContext;
        private readonly ICustomRepository<PersonalVerification> _personalVerificationRepository;
        private readonly ICustomRepository<KYCLevelMaster> _KYCLevelRepository;
        public PersonalVerificationService(ICustomRepository<PersonalVerification> personalVerificationRepository, ICustomRepository<KYCLevelMaster> KYCLevelRepository)
        {
            _personalVerificationRepository = personalVerificationRepository;
            _KYCLevelRepository = KYCLevelRepository;
            //_dbContext = dbContext;
        }

        public async Task<long> AddPersonalVerification(PersonalVerificationViewModel model)
        {
            try
            {
                var GetVerify = _personalVerificationRepository.Table.Where(i => i.UserID == model.UserId && !i.EnableStatus).FirstOrDefault();
                if (GetVerify != null)
                {
                    model.Id = GetVerify.Id;
                    model.UserId = GetVerify.UserID;
                    model.KYCLevelId = GetVerify.KYCLevelId;

                    return await UpdatePersonalVerification(model);
                }
                else
                {
                    var personalVerificationdata = new PersonalVerification
                    {
                        UserID = model.UserId,
                        Surname = model.Surname,
                        GivenName = model.GivenName,
                        ValidIdentityCard = model.ValidIdentityCard,
                        FrontImage = model.FrontImage,
                        BackImage = model.BackImage,
                        SelfieImage = model.SelfieImage,
                        EnableStatus = model.EnableStatus,
                        VerifyStatus = model.VerifyStatus,
                        CreatedDate = DateTime.UtcNow,
                        CreatedBy = model.UserId,
                        KYCLevelId = _KYCLevelRepository.Table.Where(k => k.KYCName == "Personal Verification" && !k.EnableStatus && !k.IsDelete).FirstOrDefault().Id,
                        //Status = 0,

                    };
                    _personalVerificationRepository.Insert(personalVerificationdata);
                    //_dbContext.SaveChanges();
                    return personalVerificationdata.Id;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public PersonalVerificationViewModel GetPersonalVerification(int Userid)
        {
            try
            {
                var KYCUserData = _personalVerificationRepository.Table.Where(i => i.UserID == Userid).FirstOrDefault();
                PersonalVerificationViewModel modeldata = new PersonalVerificationViewModel();
                if (KYCUserData != null)
                {
                    modeldata.UserId = KYCUserData.UserID;
                    modeldata.Surname = KYCUserData.Surname;
                    modeldata.GivenName = KYCUserData.GivenName;
                    modeldata.ValidIdentityCard = KYCUserData.ValidIdentityCard;
                    modeldata.FrontImage = KYCUserData.FrontImage;
                    modeldata.BackImage = KYCUserData.BackImage;
                    modeldata.SelfieImage = KYCUserData.SelfieImage;
                    modeldata.EnableStatus = KYCUserData.EnableStatus;
                    modeldata.VerifyStatus = KYCUserData.VerifyStatus;
                    modeldata.KYCLevelId = KYCUserData.KYCLevelId;

                    return modeldata;
                }
                else
                    return null;
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw;
            }
        }

        public async Task<long> UpdatePersonalVerification(PersonalVerificationViewModel model)
        {
            var GetVerify = _personalVerificationRepository.Table.Where(i => i.UserID == model.UserId && !i.EnableStatus).FirstOrDefault();
            if (GetVerify != null)
            {

                GetVerify.UserID = model.UserId;
                GetVerify.Surname = model.Surname;
                GetVerify.GivenName = model.GivenName;
                GetVerify.ValidIdentityCard = model.ValidIdentityCard;
                GetVerify.FrontImage = model.FrontImage;
                GetVerify.BackImage = model.BackImage;
                GetVerify.SelfieImage = model.SelfieImage;
                GetVerify.EnableStatus = model.EnableStatus;
                GetVerify.VerifyStatus = model.VerifyStatus;
                GetVerify.KYCLevelId = model.KYCLevelId;
                //CreatedDate = DateTime.UtcNow,
                // CreatedBy = model.UserId,
                GetVerify.UpdatedDate = DateTime.UtcNow;
                GetVerify.UpdatedBy = model.UserId;
                //Status = 0,

                //var personalVerificationdataupdate = new PersonalVerification
                //{
                //   // Id = model.Id,
                //    UserID = model.UserId,
                //    Surname = model.Surname,
                //    GivenName = model.GivenName,
                //    ValidIdentityCard = model.ValidIdentityCard,
                //    FrontImage = model.FrontImage,
                //    BackImage = model.BackImage,
                //    SelfieImage = model.SelfieImage,
                //    EnableStatus = model.EnableStatus,
                //    VerifyStatus = model.VerifyStatus,
                //    KYCLevelId = model.KYCLevelId,
                //    //CreatedDate = DateTime.UtcNow,
                //    // CreatedBy = model.UserId,
                //    UpdatedDate = DateTime.UtcNow,
                //    UpdatedBy = model.UserId,
                //    Status = 0,

                //};
                //return GetVerify;
                _personalVerificationRepository.Update(GetVerify);

                return GetVerify.Id;
            }
            return 0;
        }

        public PersonalVerification IsUserKYCExist(PersonalVerificationViewModel model)
        {
            try
            {
                var GetVerify = _personalVerificationRepository.Table.Where(i => i.UserID == model.UserId && !i.EnableStatus).FirstOrDefault();
                if (GetVerify != null)
                    return GetVerify;
                else
                    return null;
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw ex;
            }
        }

        public int UserKYCStatus(long UserId)
        {
            try
            {
                var GetVerify = _personalVerificationRepository.Table.Where(i => i.UserID == UserId && !i.EnableStatus).FirstOrDefault();
                if (GetVerify != null)
                {
                    return GetVerify.VerifyStatus;
                }

                else
                    return 0;
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw ex;
            }
        }
    }
}
