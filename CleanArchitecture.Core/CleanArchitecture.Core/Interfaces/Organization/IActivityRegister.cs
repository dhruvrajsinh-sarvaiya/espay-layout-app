using CleanArchitecture.Core.ViewModels.Organization;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Organization
{
    public interface IActivityRegister
    {
        void AddActivityLog(ActivityRegisterViewModel activityRegisterViewModel,ActivityRegisterDetViewModel activityRegisterDetViewModel);
        void UpdateActivityLog(ActivityRegisterViewModel activityRegisterViewModel, ActivityRegisterDetViewModel activityRegisterDetViewModel);
    }
}
