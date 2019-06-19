/* 
    Developer : Nishant Vadgam
    Date : 29-01-2019
    File Comment : staking request validator
*/
import validator from "validator";

module.exports = function StakingRequestValidator(data) {
    let errors = {};
    // validate is empty
    if (validator.isEmpty(data.CurrencyTypeID + "")) {
        errors.CurrencyTypeID = "wallet.errRequired";
    }
    if (validator.isEmpty(data.StakingType + "")) {
        errors.StakingType = "wallet.errRequired";
    }
    if (validator.isEmpty(data.Slab + "")) {
        errors.Slab = "wallet.errRequired";
    }
    // validate on stak type 
    if (data.StakingType == "1") { // fixedDeposit
        if (validator.isEmpty(data.InterestType + "")) {
            errors.InterestType = "wallet.errRequired";
        }
        if (validator.isEmpty(data.InterestValue + "")) {
            errors.InterestValue = "wallet.errRequired";
        }
        //if type is percent and exceed to 100%
        if (data.InterestType === '2' && data.InterestValue > 100) {
            errors.InterestValue = "wallet.errRequired";
        }
        if (validator.isEmpty(data.AutoUnstakingEnable + "")) {
            errors.AutoUnstakingEnable = "wallet.errRequired";
        }
        if (validator.isEmpty(data.RenewUnstakingEnable + "")) {
            errors.RenewUnstakingEnable = "wallet.errRequired";
        }
        if (validator.isEmpty(data.RenewUnstakingPeriod + "")) {
            errors.RenewUnstakingPeriod = "wallet.errRequired";
        }
        if (validator.isEmpty(data.EnableStakingBeforeMaturity + "")) {
            errors.EnableStakingBeforeMaturity = "wallet.errRequired";
        }
        if (validator.isEmpty(data.EnableStakingBeforeMaturityCharge + "")) {
            errors.EnableStakingBeforeMaturityCharge = "wallet.errRequired";
        }
        if (validator.isEmpty(data.MaturityCurrency + "")) {
            errors.MaturityCurrency = "wallet.errRequired";
        }
    } else if (data.StakingType == "2") { // Charge
        if (validator.isEmpty(data.MakerCharges + "")) {
            errors.MakerCharges = "wallet.errRequired";
        }
        if (validator.isEmpty(data.TakerCharges + "")) {
            errors.TakerCharges = "wallet.errRequired";
        }
    }
    //validate based on slab type 
    if (data.Slab == "1") { // fixed
        if (validator.isEmpty(data.Amount + "")) {
            errors.Amount = "wallet.errRequired";
        }
        if (parseFloat(data.Amount) === 0.0) {
            errors.Amount = "wallet.errRequired";
        }
    } else if (data.Slab == "2") { // range
        if (validator.isEmpty(data.MinAmount + "") || parseFloat(data.MinAmount) === 0.0) {
            errors.MinAmount = "wallet.errRequired";
        }
        if (validator.isEmpty(data.MaxAmount + "") || parseFloat(data.MaxAmount) === 0.0) {
            errors.MaxAmount = "wallet.errRequired";
        }
        if (parseFloat(data.MaxAmount) <= parseFloat(data.MinAmount)) {
            errors.MaxMinAmount = "tokenStaking.errMinMax";
        }
    }

    if (validator.isEmpty(data.DurationMonth + "")) {
        errors.DurationMonth = "wallet.errRequired";
    }
    if (validator.isEmpty(data.DurationWeek + "")) {
        errors.DurationWeek = "wallet.errRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
