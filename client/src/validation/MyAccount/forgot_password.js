import validator from 'validator';

module.exports = function validateForgotPassword(data) {
    let errors = {};
    
    //Check Empty email...
    if (typeof(data.email) != 'undefined' && validator.isEmpty(data.email)) {
        errors.email = "my_account.err.fieldRequired";
    } else if (typeof(data.email) != 'undefined' && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.EmailFormatRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};