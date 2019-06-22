using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Referral;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralCommonRepo
    {
        ReferralSchemeTypeMappingRes GetByIdMappingData(long id);
        List<ReferralSchemeTypeMappingRes> ListMappingData(long? payTypeId, long? serviceTypeMstId, short? status);
        ReferralServiceDetailRes GetByIdReferralServiceDetail(long id);
        List<ReferralServiceDetailRes> ListReferralServiceDetail(long? schemeTypeMappingId, long? creditWalletTypeId, short? status);
    }
}
