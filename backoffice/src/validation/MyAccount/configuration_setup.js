import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from "Helpers/helpers";

module.exports = function validateConfigSetup(data) {
    let errors = {};

    if (data.hasOwnProperty('MinLimitRefer') && validator.isEmpty(data.MinLimitRefer + '', { ignore_whitespace: true })) {
        errors.MinLimitRefer = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MinLimitRefer') && !validator.isEmpty(data.MinLimitRefer + '')) {
        if (isScriptTag(data.MinLimitRefer)) {
            errors.MinLimitRefer = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MinLimitRefer)) {
            errors.MinLimitRefer = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.MinLimitRefer)) {
            errors.MinLimitRefer = "my_account.err.fieldNum";
        }
    }

    if (data.hasOwnProperty('MaxLimitRefer') && validator.isEmpty(data.MaxLimitRefer + '', { ignore_whitespace: true })) {
        errors.MaxLimitRefer = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MaxLimitRefer') && !validator.isEmpty(data.MaxLimitRefer + '')) {
        if (isScriptTag(data.MaxLimitRefer)) {
            errors.MaxLimitRefer = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaxLimitRefer)) {
            errors.MaxLimitRefer = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.MaxLimitRefer)) {
            errors.MaxLimitRefer = "my_account.err.fieldNum";
        } else if (data.MaxLimitRefer <= 0) {
            errors.MaxLimitRefer = "my_account.err.requireGreterThanZero";
        }
    }

    if (data.hasOwnProperty('Reward') && validator.isEmpty(data.Reward + '', { ignore_whitespace: true })) {
        errors.Reward = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Reward') && !validator.isEmpty(data.Reward + '')) {
        if (isScriptTag(data.Reward)) {
            errors.Reward = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Reward)) {
            errors.Reward = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.Reward)) {
            errors.Reward = "my_account.err.fieldNum";
        } else if (data.Reward <= 0) {
            errors.Reward = "my_account.err.requireGreterThanZero";
        }
    }

    if (data.hasOwnProperty('RewardCurrency') && validator.isEmpty(data.RewardCurrency)) {
        errors.RewardCurrency = "my_account.err.fieldRequired";
    }

    if (data.hasOwnProperty('RewardPayType') && validator.isEmpty(data.RewardPayType)) {
        errors.RewardPayType = "my_account.err.fieldRequired";
    }

    if (data.hasOwnProperty('RewardServiceType') && validator.isEmpty(data.RewardServiceType)) {
        errors.RewardServiceType = "my_account.err.fieldRequired";
    }

    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description + '', { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description + '')) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
        }
    }

    if (data.hasOwnProperty('ExpireDate') && validator.isEmpty(data.ExpireDate)) {
        errors.ExpireDate = "my_account.err.fieldRequired";
    }

    if (data.hasOwnProperty('ActiveDate') && validator.isEmpty(data.ActiveDate)) {
        errors.ActiveDate = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};