import validator from 'validator';
import { isValidPhoneNumber } from 'react-phone-number-input';

module.exports = function validateReferralSystem(data) {
    let errors = {};

    if (typeof(data.MobileNumber) !== 'undefined' && (data.MobileNumber === 'undefined' || validator.isEmpty(data.MobileNumber))) {
        errors.MobileNumber = "my_account.err.fieldRequired";
    } else if(typeof(data.MobileNumber) !== 'undefined' && !isValidPhoneNumber(data.MobileNumber)) {
        errors.MobileNumber = "my_account.err.validPhoneNo";
    }

    //Check Empty email...
    if (typeof(data.EmailAddress) !== 'undefined' && validator.isEmpty(data.EmailAddress)) {
        errors.EmailAddress = "my_account.err.fieldRequired";
    } else if (typeof(data.EmailAddress) !== 'undefined' && !validator.isEmail(data.EmailAddress)) {
        errors.EmailAddress = "my_account.err.emailFormat";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};