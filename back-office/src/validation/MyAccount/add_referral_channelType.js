import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from "Helpers/helpers";

module.exports = function validateChannelTypeForm(data) {
    let errors = {};

    //Check Empty ChannelTypeName...
    if (data.hasOwnProperty('ChannelTypeName') && validator.isEmpty(data.ChannelTypeName + '', { ignore_whitespace: true })) {
        errors.ChannelTypeName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('ChannelTypeName') && !validator.isEmpty(data.ChannelTypeName + '')) {
        if (isScriptTag(data.ChannelTypeName)) {
            errors.ChannelTypeName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ChannelTypeName)) {
            errors.ChannelTypeName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.ChannelTypeName)) {
            errors.ChannelTypeName = "my_account.err.fieldAlphaNum";
        }
    }

    if (data.hasOwnProperty('HourlyLimit') && validator.isEmpty(data.HourlyLimit + '', { ignore_whitespace: true })) {
        errors.HourlyLimit = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('HourlyLimit') && !validator.isEmpty(data.HourlyLimit + '')) {
        if (isScriptTag(data.HourlyLimit)) {
            errors.HourlyLimit = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.HourlyLimit)) {
            errors.HourlyLimit = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.HourlyLimit)) {
            errors.HourlyLimit = "my_account.err.requireNumericField";
        } else if (data.HourlyLimit + '' <= 0) {
            errors.HourlyLimit = "my_account.err.requireGreterThanZero";
        }
    }

    if (data.hasOwnProperty('DailyLimit') && validator.isEmpty(data.DailyLimit + '', { ignore_whitespace: true })) {
        errors.DailyLimit = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('DailyLimit') && !validator.isEmpty(data.DailyLimit + '')) {
        if (isScriptTag(data.DailyLimit)) {
            errors.DailyLimit = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.DailyLimit)) {
            errors.DailyLimit = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.DailyLimit)) {
            errors.DailyLimit = "my_account.err.requireNumericField";
        } else if (data.DailyLimit + '' <= 0) {
            errors.DailyLimit = "my_account.err.requireGreterThanZero";
        }
    }

    if (data.hasOwnProperty('WeeklyLimit') && validator.isEmpty(data.WeeklyLimit + '', { ignore_whitespace: true })) {
        errors.WeeklyLimit = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('WeeklyLimit') && !validator.isEmpty(data.WeeklyLimit + '')) {
        if (isScriptTag(data.WeeklyLimit)) {
            errors.WeeklyLimit = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.WeeklyLimit)) {
            errors.WeeklyLimit = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.WeeklyLimit)) {
            errors.WeeklyLimit = "my_account.err.requireNumericField";
        } else if (data.WeeklyLimit + '' <= 0) {
            errors.WeeklyLimit = "my_account.err.requireGreterThanZero";
        }
    }

    if (data.hasOwnProperty('MonthlyLimit') && validator.isEmpty(data.MonthlyLimit + '', { ignore_whitespace: true })) {
        errors.MonthlyLimit = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MonthlyLimit') && !validator.isEmpty(data.MonthlyLimit + '')) {
        if (isScriptTag(data.MonthlyLimit)) {
            errors.MonthlyLimit = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MonthlyLimit)) {
            errors.MonthlyLimit = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.MonthlyLimit)) {
            errors.MonthlyLimit = "my_account.err.requireNumericField";
        } else if (data.MonthlyLimit + '' <= 0) {
            errors.MonthlyLimit = "my_account.err.requireGreterThanZero";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};