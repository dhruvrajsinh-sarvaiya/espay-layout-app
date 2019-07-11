import validator from 'validator';

module.exports = function validateAntiPhishingCode(data) {
    let errors = {};

    //Check Anti-Phishing code...
    if ((validator.isEmpty(data.antiphishingcode)) || (validator.isAlphanumeric(data.antiphishingcode)) || (validator.isLength(data.antiphishingcode, 4, 20))) {
        errors.antiphishingcode = "my_account.err.antiphishingcodeRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};