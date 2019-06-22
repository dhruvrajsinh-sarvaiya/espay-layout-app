using CleanArchitecture.Core.ViewModels.KYC;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.KYC
{
    public interface IKYCLevelMaster
    {
        List<KYCLevelViewModel> GetKYCLevelData();
        long ADDKYCLevel(KYCLevelInsertReqViewModel kYCLevelInsertReqViewModel);
        long UpdateKYCLevel(KYCLevelUpdateReqViewModel kYCLevelUpdateReqViewModel);
        long IsKYCKYCLevelExist(string Kyclevelname);
        int KYCUserWiseLevelCount(int Level);
        KYCLevelListResponse GetKYCLevelList(int PageIndex = 0, int Page_Size = 0);
        List<KYCLevelList> GetKYCLevelList();
    }
}
