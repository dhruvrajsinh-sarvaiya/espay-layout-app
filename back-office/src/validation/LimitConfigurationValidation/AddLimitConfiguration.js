/**
 *   Developer : Parth Andhariya
 *   Date: 25-03-2019
 *   Component: Add Limit Configuration Form Validation
 */
import validator from "validator";

module.exports = function validateAddLimitConfigurationRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addNewDetail.TrnType + "")) {
        errors.TrnType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewDetail.walletType + "")) {
        errors.walletType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewDetail.PerTranMinAmount + "")) {
        errors.PerTranMinAmount = "wallet.errRequired";
    }
    // else if (parseFloat(data.addNewDetail.PerTranMinAmount) > parseFloat(data.addNewDetail.PerTranMaxAmount)) {
    // errors.PerTranMinAmount = "lable.errMinimum";
    // }
    if (validator.isEmpty(data.addNewDetail.PerTranMaxAmount + "")) {
        errors.PerTranMaxAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewDetail.DailyTrnCount)) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(data.addNewDetail.DailyTrnCount) > parseInt(data.addNewDetail.WeeklyTrnCount)) {
    //     errors.DailyTrnCount = "lable.errDailyCount"
    // }
    if (validator.isEmpty(data.addNewDetail.DailyTrnAmount)) {
        errors.DailyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(data.addNewDetail.DailyTrnAmount) > parseFloat(data.addNewDetail.WeeklyTrnAmount)) {
    //     errors.DailyTrnAmount = "lable.errDailyAmount"
    // }
    if (validator.isEmpty(data.addNewDetail.MonthlyTrnCount)) {
        errors.MonthlyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(data.addNewDetail.MonthlyTrnCount) > parseInt(data.addNewDetail.YearlyTrnCount)) {
    //     errors.MonthlyTrnCount = "lable.errMonthlyCount"
    // }
    if (validator.isEmpty(data.addNewDetail.MonthlyTrnAmount)) {
        errors.MonthlyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(data.addNewDetail.MonthlyTrnAmount) > parseFloat(data.addNewDetail.YearlyTrnAmount)) {
    //     errors.MonthlyTrnAmount = "lable.errMonthlyAmount"
    // }
    if (validator.isEmpty(data.addNewDetail.WeeklyTrnCount)) {
        errors.WeeklyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(data.addNewDetail.WeeklyTrnCount) > parseInt(data.addNewDetail.MonthlyTrnCount)) {
    //     errors.WeeklyTrnCount = "lable.errWeeklyCount"
    // }
    if (validator.isEmpty(data.addNewDetail.WeeklyTrnAmount)) {
        errors.WeeklyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(data.addNewDetail.WeeklyTrnAmount) > parseFloat(data.addNewDetail.MonthlyTrnAmount)) {
    //     errors.WeeklyTrnAmount = "lable.errWeeklyAmount"
    // }
    if (validator.isEmpty(data.addNewDetail.YearlyTrnCount + "")) {
        errors.YearlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewDetail.YearlyTrnAmount + "")) {
        errors.YearlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewDetail.HourlyTrnCount + "")) {
        errors.HourlyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(data.addNewDetail.HourlyTrnCount) > parseInt(data.addNewDetail.DailyTrnCount)) {
    //     errors.HourlyTrnCount = "lable.errHourlyCount";
    // }
    if (validator.isEmpty(data.addNewDetail.HourlyTrnAmount + "")) {
        errors.HourlyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(data.addNewDetail.HourlyTrnAmount) > parseFloat(data.addNewDetail.DailyTrnAmount)) {
    //     errors.HourlyTrnAmount = "lable.errHourlyAmount";
    // }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
