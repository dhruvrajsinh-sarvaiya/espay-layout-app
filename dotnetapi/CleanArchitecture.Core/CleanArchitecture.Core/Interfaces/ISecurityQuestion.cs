using CleanArchitecture.Core.ViewModels.SecurityQuestion;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces
{
   public interface ISecurityQuestion
    {
        Guid Add(SecurityQuestionMasterReqViewModel securityQuestionMasterViewModel);
        Guid Update(SecurityQuestionMasterReqViewModel securityQuestionMasterViewModel);
    }
}
