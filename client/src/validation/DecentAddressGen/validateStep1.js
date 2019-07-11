import validator from 'validator';
module.exports = function validateStep1Request(data) {
    let errors = {};
    //Check numeric Field...
    if (validator.isEmpty(data.selectedcurrency)) {
        errors.selectedcurrency = "wallet.selectCoin";
    } 

    if (validator.isEmpty(data.password)) {
        errors.password = "wallet.errpassword";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};