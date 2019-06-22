using CleanArchitecture.Core.Entities.Backoffice.PasswordPolicy;
using CleanArchitecture.Core.ViewModels.BackOffice.PasswordPolicy;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.PasswordPolicy
{
  public  interface IUserLinkMaster
    {
        Guid Add(UserLinkMasterViewModel userLinkMastes);
        Guid Update(UserLinkMasterUpdateViewModel userLinkMastes);
        UserLinkMaster VerifyUserLink(Guid id);
        UserLinkMaster GetUserLinkData(Guid id);
    }
}
