import validator from 'validator';

module.exports = function validateAntiPhishingCode(data) {
    let errors = {};

    //Check Anti-Phishing code...
    if (validator.isEmpty(data.antiphishingcode))
    {
        errors.antiphishingcode = "my_account.err.antiphishingcodeRequired";
    }
    else if (validator.isAlphanumeric(data.antiphishingcode))
    {
        errors.antiphishingcode = "my_account.err.antiphishingcodeRequired";
    }
    else if (validator.isLength(data.antiphishingcode, 4 , 20 ))
    {
        errors.antiphishingcode = "my_account.err.antiphishingcodeRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};