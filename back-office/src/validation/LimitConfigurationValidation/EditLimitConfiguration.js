/**
 *   Developer : Parth Andhariya
 *   Date: 26-03-2019
 *   Component: Edit Limit Configuration 
 */
import validator from "validator";

module.exports = function validateEditLimitConfigurationRequest(data) {
    let errors = {};
    let reqObj = {
        PerTranMinAmount: data.UpdateRecord.PerTranMinAmount,
        PerTranMaxAmount: data.UpdateRecord.PerTranMaxAmount,
        HourlyTrnCount: data.UpdateRecord.HourlyTrnCount,
        HourlyTrnAmount: data.UpdateRecord.HourlyTrnAmount,
        DailyTrnCount: data.UpdateRecord.DailyTrnCount,
        DailyTrnAmount: data.UpdateRecord.DailyTrnAmount,
        WeeklyTrnCount: data.UpdateRecord.WeeklyTrnCount,
        WeeklyTrnAmount: data.UpdateRecord.WeeklyTrnAmount,
        MonthlyTrnCount: data.UpdateRecord.MonthlyTrnCount,
        MonthlyTrnAmount: data.UpdateRecord.MonthlyTrnAmount,
        YearlyTrnCount: data.UpdateRecord.YearlyTrnCount,
        YearlyTrnAmount: data.UpdateRecord.YearlyTrnAmount,
    };
    if (validator.isEmpty(reqObj.PerTranMinAmount + "")) {
        errors.PerTranMinAmount = "wallet.errRequired";
    }
    // else if (parseFloat(reqObj.PerTranMinAmount) > parseFloat(reqObj.PerTranMaxAmount)) {
    // errors.PerTranMinAmount = "lable.errMinimum";
    // }
    if (validator.isEmpty(reqObj.PerTranMaxAmount + "")) {
        errors.PerTranMaxAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.DailyTrnCount + "")) {
        errors.DailyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(reqObj.DailyTrnCount) > parseInt(reqObj.WeeklyTrnCount)) {
    // errors.DailyTrnCount = "lable.errDailyCount"
    // }
    if (validator.isEmpty(reqObj.DailyTrnAmount + "")) {
        errors.DailyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(reqObj.DailyTrnAmount) > parseFloat(reqObj.WeeklyTrnAmount)) {
    // errors.DailyTrnAmount = "lable.errDailyAmount"
    // }
    if (validator.isEmpty(reqObj.MonthlyTrnCount + "")) {
        errors.MonthlyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(reqObj.MonthlyTrnCount) > parseInt(reqObj.YearlyTrnCount)) {
    // errors.MonthlyTrnCount = "lable.errMonthlyCount"
    // }
    if (validator.isEmpty(reqObj.MonthlyTrnAmount + "")) {
        errors.MonthlyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(reqObj.MonthlyTrnAmount) > parseFloat(reqObj.YearlyTrnAmount)) {
    //     errors.MonthlyTrnAmount = "lable.errMonthlyAmount"
    // }
    if (validator.isEmpty(reqObj.WeeklyTrnCount + "")) {
        errors.WeeklyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(reqObj.WeeklyTrnCount) > parseInt(reqObj.MonthlyTrnCount)) {
    //     errors.WeeklyTrnCount = "lable.errWeeklyCount"
    // }
    if (validator.isEmpty(reqObj.WeeklyTrnAmount + "")) {
        errors.WeeklyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(reqObj.WeeklyTrnAmount) > parseFloat(reqObj.MonthlyTrnAmount)) {
    //     errors.WeeklyTrnAmount = "lable.errWeeklyAmount"
    // }
    if (validator.isEmpty(reqObj.YearlyTrnCount + "")) {
        errors.YearlyTrnCount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.YearlyTrnAmount + "")) {
        errors.YearlyTrnAmount = "wallet.errRequired";
    }
    if (validator.isEmpty(reqObj.HourlyTrnCount + "")) {
        errors.HourlyTrnCount = "wallet.errRequired";
    }
    // else if (parseInt(reqObj.HourlyTrnCount) > parseInt(reqObj.DailyTrnCount)) {
    //     errors.HourlyTrnCount = "lable.errHourlyCount";
    // }
    if (validator.isEmpty(reqObj.HourlyTrnAmount + "")) {
        errors.HourlyTrnAmount = "wallet.errRequired";
    }
    // else if (parseFloat(reqObj.HourlyTrnAmount) > parseFloat(reqObj.DailyTrnAmount)) {
    // errors.HourlyTrnAmount = "lable.errHourlyAmount"
    // }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
