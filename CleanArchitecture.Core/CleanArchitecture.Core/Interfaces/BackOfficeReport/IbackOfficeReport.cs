﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.BackOfficeReports;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.BackOfficeReport
{
   public interface IBackOfficeReport
    {
        SignReportModel GetSignUpReport(int PageIndex = 0, int Page_Size = 0, string EmailAddress = null, string Username = null,
            string Mobile = null,string filtration=null, DateTime? FromDate = null, DateTime? ToDate = null);
        List<SignReportCountViewmodel> GetUserReportCount();

        GetSubscribeNewLetterResponse GetSubscribeNewLetter(long PageSize, long PageNo);
        GetSubscribeNewLetterCountResponse GetSubscribeNewLetterCount();
        BizResponseClass RemoveSubscribeNewsLetter(long ID);
    }
}
