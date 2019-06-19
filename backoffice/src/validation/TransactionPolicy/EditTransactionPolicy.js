import validator from "validator";
import { isScriptTag } from 'Helpers/helpers';

module.exports = function validateTransactionPolicyRequest(data) {
    let errors = {};
    let reqObj = {
        AllowedIP: data.editTransactionPolicyReport.AllowedIP,
        AllowedLocation: data.editTransactionPolicyReport.AllowedLocation,
        AllowedUserType: '' + (data.editTransactionPolicyReport.AllowedUserType),
        AuthenticationType: '' + (data.editTransactionPolicyReport.AuthenticationType),
        AuthorityType: '' + (data.editTransactionPolicyReport.AuthorityType),
        DailyTrnAmount: '' + (data.editTransactionPolicyReport.DailyTrnAmount),
        DailyTrnCount: '' + (data.editTransactionPolicyReport.DailyTrnCount),
        MaxAmount: '' + (data.editTransactionPolicyReport.MaxAmount),
        MinAmount: '' + (data.editTransactionPolicyReport.MinAmount),
        MonthlyTrnAmount: '' + (data.editTransactionPolicyReport.MonthlyTrnAmount),
        MonthlyTrnCount: '' + (data.editTransactionPolicyReport.MonthlyTrnCount),
        Status: '' + (data.editTransactionPolicyReport.Status),
        WeeklyTrnAmount: '' + (data.editTransactionPolicyReport.WeeklyTrnAmount),
        WeeklyTrnCount: '' + (data.editTransactionPolicyReport.WeeklyTrnCount),
        YearlyTrnAmount: '' + (data.editTransactionPolicyReport.YearlyTrnAmount),
        YearlyTrnCount: '' + (data.editTransactionPolicyReport.YearlyTrnCount)
    };
    if (validator.isEmpty(reqObj.AllowedIP)) {
        errors.AllowedIP = "wallet.errRequired";
    } else if (!validator.isIP(reqObj.AllowedIP)) {
        errors.AllowedIP = "wallet.validateIp";
    }
    if (validator.isEmpty(reqObj.AllowedLocation)) {
        errors.AllowedLocation = "wallet.errRequired";
    } else if ((isScriptTag(reqObj.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.scriptTag";
    } 
    else if ((isScriptTag(reqObj.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.htmlTag";
    } 
    if (validator.isEmpty(reqObj.AuthenticationType)) {
        errors.AuthenticationType = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.DailyTrnCount)) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.DailyTrnAmount)) {
        errors.DailyTrnAmount = "wallet.errRequired";
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
    if (validator.isEmpty(reqObj.MinAmount)) {
        errors.MinAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.MaxAmount)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.AuthorityType)) {
        errors.AuthorityType = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.AllowedUserType)) {
        errors.AllowedUserType = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.Status)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
