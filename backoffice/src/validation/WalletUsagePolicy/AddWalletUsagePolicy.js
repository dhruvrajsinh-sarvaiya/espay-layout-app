import validator from "validator";
import { isScriptTag ,isHtmlTag} from 'Helpers/helpers';

module.exports = function validateAddWalletUsagePolicyRequest(data) {
    let errors = {};

    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.WalletType)) {
        errors.WalletType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.PolicyName)) {
        errors.PolicyName = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.AllowedIP)) {
        errors.AllowedIP = "wallet.errRequired";
    } else if (!validator.isIP(data.addNewWalletUsagePolicyDetail.AllowedIP)) {
        errors.AllowedIP = "wallet.validateIp";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.AllowedLocation)) {
        errors.AllowedLocation = "wallet.errRequired";
    } else if ((isScriptTag(data.addNewWalletUsagePolicyDetail.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.scriptTag";
    }else if ((isHtmlTag(data.addNewWalletUsagePolicyDetail.AllowedLocation))) {
        errors.AllowedLocation = "my_account.err.htmlTag";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.AuthenticationType)) {
        errors.AuthenticationType = "wallet.errRequired";
    } else if ((isScriptTag(data.addNewWalletUsagePolicyDetail.AuthenticationType))) {
        errors.AuthenticationType = "my_account.err.scriptTag";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.DailyTrnCount)) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.DailyTrnAmount)) {
        errors.DailyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.HourlyTrnCount)) {
        errors.HourlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.HourlyTrnAmount)) {
        errors.HourlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.MonthlyTrnCount)) {
        errors.MonthlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.MonthlyTrnAmount)) {
        errors.MonthlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.WeeklyTrnCount)) {
        errors.WeeklyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.WeeklyTrnAmount)) {
        errors.WeeklyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.YearlyTrnCount)) {
        errors.YearlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.YearlyTrnAmount)) {
        errors.YearlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.LifeTimeTrnCount)) {
        errors.LifeTimeTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.LifeTimeTrnAmount)) {
        errors.LifeTimeTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.MinAmount)) {
        errors.MinAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.MaxAmount)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    // if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.AuthorityType)) {
    //     errors.AuthorityType = "wallet.errRequired";
    // }
    // if (validator.isEmpty(data.addNewWalletUsagePolicyDetail.AllowedUserType)) {
    //     errors.AllowedUserType = "wallet.errRequired";
    // }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
