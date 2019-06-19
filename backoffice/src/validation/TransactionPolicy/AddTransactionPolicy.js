import validator from "validator";
import { isScriptTag ,isHtmlTag} from 'Helpers/helpers';

module.exports = function validateaddTransactionPolicyRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.TrnType)) {
        errors.TrnType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.AllowedIP)) {
        errors.AllowedIP = "wallet.errRequired";
    } else if (!validator.isIP(data.addNewTransactionPolicyDetail.AllowedIP)) {
        errors.AllowedIP = "wallet.validateIp";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.AllowedLocation)) {
        errors.AllowedLocation = "wallet.errRequired";
    } else if ((isScriptTag(data.addNewTransactionPolicyDetail.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.scriptTag";
    }
    else if ((isHtmlTag(data.addNewTransactionPolicyDetail.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.htmlTag";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.AuthenticationType)) {
        errors.AuthenticationType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.DailyTrnCount)) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.DailyTrnAmount)) {
        errors.DailyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.MonthlyTrnCount)) {
        errors.MonthlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.MonthlyTrnAmount)) {
        errors.MonthlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.WeeklyTrnCount)) {
        errors.WeeklyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.WeeklyTrnAmount)) {
        errors.WeeklyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.YearlyTrnCount)) {
        errors.YearlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.YearlyTrnAmount)) {
        errors.YearlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.MinAmount)) {
        errors.MinAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.MaxAmount)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.AuthorityType)) {
        errors.AuthorityType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.AllowedUserType)) {
        errors.AllowedUserType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewTransactionPolicyDetail.RoleId)) {
        errors.RoleId = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
