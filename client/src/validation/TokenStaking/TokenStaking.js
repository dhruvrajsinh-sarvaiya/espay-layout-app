import validator from 'validator';

module.exports = function validateStakingRequest(data, wallet, policy) {
    let errors = {};
    let walletBalance = wallet.length ? wallet[0].Balance : 0;
    //Check Required Field...
    if (validator.isEmpty(data.PolicyDetailID)) {
        errors.PolicyDetailID = "wallet.errSelectPlan";
    }
    if (validator.isEmpty(data.AccWalletID)) {
        errors.AccWalletID = "wallet.errSelectWallet";
    }
    if (validator.isEmpty(data.amount)) {
        errors.amount = "wallet.errAmountRequired";
    }
    //checked wallet balance
    if (policy.length && wallet.length) {
        if (policy[0].SlabType === 1) { // fixed
            let policyAmount = parseFloat(policy[0].AvailableAmount).toFixed(8);
            if (walletBalance < policyAmount) {
                //dont have enough balance
                errors.AccWalletID = "trading.placeorder.error.minBalance";
            } else if (parseFloat(policyAmount).toFixed(8) !== parseFloat(data.amount).toFixed(8)) {
                errors.amount = "wallet.errWDInvalidAmount";
            }
        } else if (policy[0].SlabType === 2) { // range
            let minAmount = parseFloat(policy[0].MinAmount).toFixed(8);
            let maxAmount = parseFloat(policy[0].MaxAmount).toFixed(8);
            if (walletBalance < minAmount) {
                //dont have enough balance
                errors.AccWalletID = "trading.placeorder.error.minBalance";
            } else if (maxAmount < parseFloat(data.amount).toFixed(8) || minAmount > parseFloat(data.amount).toFixed(8)) {
                errors.amount = "wallet.errWDInvalidAmount";
            }
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};