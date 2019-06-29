import validator from 'validator';

module.exports = function validateGoogleAuth(data) {
    let errors = {};
    //Check Empty Code...
    if (typeof (data.Code) != 'undefined' && validator.isEmpty(data.Code)) {
        errors.Code = "my_account.err.fieldRequired";
    } else if (typeof (data.Code) != 'undefined' && !validator.isNumeric(data.Code) || parseInt(data.Code) == 0) {
        errors.Code = "my_account.err.fieldNum";
    } else if (typeof (data.Code) != 'undefined' && !validator.isLength(data.Code, { min: 6, max: 6 })) {
        errors.Code = "my_account.err.codeLength";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};