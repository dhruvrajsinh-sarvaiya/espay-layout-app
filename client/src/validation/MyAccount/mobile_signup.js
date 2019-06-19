import validator from 'validator';
import { isValidPhoneNumber } from 'react-phone-number-input';

module.exports = function validateMobileSignup(data) {
    // console.log('Validate',data,isValidPhoneNumber(data.mobile));
    let errors = {};

    //Check Empty MobileNo...
    if (typeof(data.mobile) !== 'undefined' && (data.mobile === 'undefined' || validator.isEmpty(data.mobile))) {
        errors.mobile = "my_account.err.enterMobile";
    } else if(typeof(data.mobile) !== 'undefined' && !isValidPhoneNumber(data.mobile)) {
        errors.mobile = "my_account.err.validPhoneNo";
    }

    //Check Empty CountryCode... 
    if (typeof(data.CountryCode) !== 'undefined' && validator.isEmpty(data.CountryCode)) {
        errors.mobile = "my_account.err.selectCountry";
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