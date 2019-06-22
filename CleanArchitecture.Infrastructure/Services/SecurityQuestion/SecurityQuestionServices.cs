using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.SecurityQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Infrastructure.Services.SecurityQuestion
{
    public class SecurityQuestionServices : ISecurityQuestion
    {
        private readonly CleanArchitectureContext _dbContext;
        private readonly ICustomExtendedRepository<SecurityQuestionMaster> _securityQuestionRepository;
        public SecurityQuestionServices(CleanArchitectureContext dbContext, ICustomExtendedRepository<SecurityQuestionMaster> securityQuestionRepository)
        {
            _dbContext = dbContext;
            _securityQuestionRepository = securityQuestionRepository;
        }
        public Guid Add(SecurityQuestionMasterReqViewModel securityQuestionMasterViewModel)
        {
            try
            {
                var _securityQuestion = _securityQuestionRepository.Table.FirstOrDefault(i => i.UserId == securityQuestionMasterViewModel.Userid && i.Status == true);
                if (_securityQuestion == null)
                {
                    SecurityQuestionMaster securityQuestionMaster = new SecurityQuestionMaster();
                    securityQuestionMaster.SecurityQuestion = securityQuestionMasterViewModel.SecurityQuestion;
                    securityQuestionMaster.Answer = securityQuestionMasterViewModel.Answer;
                    securityQuestionMaster.UserId = securityQuestionMasterViewModel.Userid;
                    securityQuestionMaster.CreatedDate = DateTime.UtcNow;
                    securityQuestionMaster.CreatedBy = securityQuestionMasterViewModel.Userid;
                    _securityQuestionRepository.Insert(securityQuestionMaster);
                    return securityQuestionMaster.Id;
                }
                else
                {
                    _securityQuestion.SecurityQuestion = securityQuestionMasterViewModel.SecurityQuestion;
                    _securityQuestion.Answer = securityQuestionMasterViewModel.Answer;
                    _securityQuestion.UserId = securityQuestionMasterViewModel.Userid;
                    _securityQuestion.UpdatedDate = DateTime.UtcNow;
                    _securityQuestion.UpdatedBy = securityQuestionMasterViewModel.Userid;
                    _securityQuestionRepository.Update(_securityQuestion);
                    return _securityQuestion.Id;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                throw ex;
            }
        }

        public Guid Update(SecurityQuestionMasterReqViewModel securityQuestionMasterViewModel)
        {
            try
            {
                var _securityQuestion = _securityQuestionRepository.Table.FirstOrDefault(i => i.UserId == securityQuestionMasterViewModel.Userid);
                if (_securityQuestion != null)
                {
                    _securityQuestion.SecurityQuestion = securityQuestionMasterViewModel.SecurityQuestion;
                    _securityQuestion.Answer = securityQuestionMasterViewModel.Answer;
                    _securityQuestion.UserId = securityQuestionMasterViewModel.Userid;
                    _securityQuestion.UpdatedDate = DateTime.UtcNow;
                    _securityQuestion.UpdatedBy = securityQuestionMasterViewModel.Userid;
                    _securityQuestionRepository.Update(_securityQuestion);
                    return _securityQuestion.Id;
                }
                else
                {
                    return Guid.Empty;
                }

            }
            catch (Exception ex)
            {
                ex.ToString();
                throw ex;
            }
        }
    }
}
