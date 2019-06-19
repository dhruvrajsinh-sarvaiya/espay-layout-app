import validator from 'validator';

module.exports = function validate2FAGoogleAuth(data) {
    let errors = {};
    
    //Check Empty Code...
    if (typeof(data.Code) != 'undefined' && validator.isEmpty(data.Code)) {
        errors.Code = "my_account.err.fieldRequired";
    } else if(typeof(data.Code) != 'undefined' && !validator.isNumeric(data.Code) || parseInt(data.Code) == 0) {
        errors.Code = "my_account.err.fieldNum";
    } else if(typeof(data.Code) != 'undefined' && !validator.isLength(data.Code, { min: 6, max: 6 })) {
        errors.Code = "my_account.err.codeLength";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};

/* module.exports = function validate2FASMSAuth(data) {
    let errors = {};
    
    //Check Empty auth code...
    if (validator.isEmpty(data.authCode))
    {
        errors.authCode = "my_account.err.codeRequired";
    } 
    else if (!validator.isInt(data.authCode))
    {
        errors.authCode = "my_account.err.codeSMSFormat";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}; */