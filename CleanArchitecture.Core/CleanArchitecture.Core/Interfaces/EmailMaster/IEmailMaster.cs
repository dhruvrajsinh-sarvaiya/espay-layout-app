
using CleanArchitecture.Core.ViewModels.EmailMaster;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.EmailMaster
{
  public  interface IEmailMaster
    {
        Guid Add(EmailMasterReqViewModel emailMasterViewModel);
        Guid Update(EmailMasterUpdateReqViewModel emailMasterViewModel);
        Guid  Delete(EmailMasterDeleteViewModel emailMasterViewModel);
        Guid IsEmailExist(string EmailAddress);
        List<EmailListViewModel> GetuserWiseEmailList(int UserId);
    }
}
