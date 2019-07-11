import validator from 'validator';

module.exports = function validateEmailSignup(data) {
    let errors = {};

    //Check Empty Email...
    if (typeof(data.email) !== 'undefined' && validator.isEmpty(data.email)) {
        errors.email = "my_account.err.EmailRequired";
    } else if (typeof(data.email) !== 'undefined' && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.EmailFormatRequired";
    }

    //Check Empty mobile...
    if (typeof(data.mobile) !== 'undefined' && validator.isEmpty(data.mobile)) {
        errors.mobile = "my_account.err.enterMobile";
    } else if (typeof(data.mobile) !== 'undefined' && !validator.isInt(data.mobile)) {
        errors.mobile = "my_account.err.validPhoneNo";
    }

    //Check Empty OTP...
    if (typeof(data.otp) !== 'undefined' && validator.isEmpty(data.otp)) {
        errors.otp = "my_account.err.fieldRequired";
    } else if(typeof(data.otp) !== 'undefined' && !validator.isNumeric(data.otp)) {
        errors.otp = "my_account.err.fieldNum";
    } else if(typeof(data.otp) !== 'undefined' && parseInt(data.otp) == 0) {
        errors.otp = "my_account.err.validOTP";
    } else if(typeof(data.otp) !== 'undefined' && !validator.isLength(data.otp, { min: 6, max: 6 })) {
        errors.otp = "my_account.err.otpLength";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};