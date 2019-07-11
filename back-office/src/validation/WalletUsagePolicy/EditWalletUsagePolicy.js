import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';

module.exports = function validateEditWalletUsagePolicyRequest(data) {
    let errors = {};
    let reqObj = {
        Id: "0",
        PolicyName: data.editWalletUsagePolicyDetail.PolicyName,
        AllowedIP: data.editWalletUsagePolicyDetail.AllowedIP,
        AllowedLocation: data.editWalletUsagePolicyDetail.AllowedLocation,
        AuthenticationType: '' + (data.editWalletUsagePolicyDetail.AuthenticationType),
        DailyTrnCount: '' + (data.editWalletUsagePolicyDetail.DailyTrnCount),
        DailyTrnAmount: '' + (data.editWalletUsagePolicyDetail.DailyTrnAmount),
        HourlyTrnCount: '' + (data.editWalletUsagePolicyDetail.HourlyTrnCount),
        HourlyTrnAmount: '' + (data.editWalletUsagePolicyDetail.HourlyTrnAmount),
        MonthlyTrnCount: '' + (data.editWalletUsagePolicyDetail.MonthlyTrnCount),
        MonthlyTrnAmount: '' + (data.editWalletUsagePolicyDetail.MonthlyTrnAmount),
        WeeklyTrnCount: '' + (data.editWalletUsagePolicyDetail.WeeklyTrnCount),
        WeeklyTrnAmount: '' + (data.editWalletUsagePolicyDetail.WeeklyTrnAmount),
        YearlyTrnCount: '' + (data.editWalletUsagePolicyDetail.YearlyTrnCount),
        YearlyTrnAmount: '' + (data.editWalletUsagePolicyDetail.YearlyTrnAmount),
        LifeTimeTrnCount: '' + (data.editWalletUsagePolicyDetail.LifeTimeTrnCount),
        LifeTimeTrnAmount: '' + (data.editWalletUsagePolicyDetail.LifeTimeTrnAmount),
        MinAmount: '' + (data.editWalletUsagePolicyDetail.MinAmount),
        MaxAmount: '' + (data.editWalletUsagePolicyDetail.MaxAmount),
    };

    if (validator.isEmpty(reqObj.PolicyName)) {
        errors.PolicyName = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.AllowedIP)) {
        errors.AllowedIP = "wallet.errRequired";
    } else if (!validator.isIP(reqObj.AllowedIP)) {
        errors.AllowedIP = "wallet.validateIp";
    }
    if (validator.isEmpty(reqObj.AllowedLocation)) {
        errors.AllowedLocation = "wallet.errRequired";
    }else if ((isScriptTag(reqObj.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.scriptTag";
    }
    else if ((isHtmlTag(reqObj.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.htmlTag";
    }
    if (validator.isEmpty(reqObj.AuthenticationType)) {
        errors.AuthenticationType = "wallet.errRequired";
    } else if ((isScriptTag(reqObj.AuthenticationType))) {
        errors.AuthenticationType = "my_account.err.scriptTag";
    }
    if (validator.isEmpty(reqObj.DailyTrnCount)) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.DailyTrnAmount)) {
        errors.DailyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.HourlyTrnCount)) {
        errors.HourlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.HourlyTrnAmount)) {
        errors.HourlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.MonthlyTrnCount)) {
        errors.MonthlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.MonthlyTrnAmount)) {
        errors.MonthlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.WeeklyTrnCount)) {
        errors.WeeklyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.WeeklyTrnAmount)) {
        errors.WeeklyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.YearlyTrnCount)) {
        errors.YearlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.YearlyTrnAmount)) {
        errors.YearlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.LifeTimeTrnCount)) {
        errors.LifeTimeTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.LifeTimeTrnAmount)) {
        errors.LifeTimeTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.MinAmount)) {
        errors.MinAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.MaxAmount)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
