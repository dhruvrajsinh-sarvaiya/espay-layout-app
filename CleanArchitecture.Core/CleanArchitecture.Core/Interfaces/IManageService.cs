using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.ManageViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IManageService
    {
        UserInfoResponse GetUserInfo(int UserId);
        BizResponseClass AddSubscribeNewsLetter(string Email);
        BizResponseClass RemoveSubscribeNewsLetter(string Email);
    }
}
