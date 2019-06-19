import validator from 'validator';

module.exports = function validateLogin(data) {
    let errors = {};
    
    //Check Empty Username...
    if (typeof(data.username) != 'undefined' && validator.isEmpty(data.username)) {
        errors.username = "my_account.err.fieldRequired";
    } else if(typeof(data.username) != 'undefined' && !validator.isLength(data.username, { min: 0, max: 50 })) {
        errors.username = "my_account.err.length0To50";
    }

    //Check Empty Email...
    if (typeof(data.email) != 'undefined' && validator.isEmpty(data.email)) {
        errors.email = "my_account.err.fieldRequired";
    } else if (typeof(data.email) != 'undefined' && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.emailFormat";
    }

    //Check Empty Password...
    if (typeof(data.password) != 'undefined' && validator.isEmpty(data.password)) {
        errors.password = "my_account.err.fieldRequired";
    } else if(typeof(data.password) != 'undefined' && !validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "my_account.err.passwordLength";
    } else if(typeof(data.password) != 'undefined' && !validator.matches(data.password,"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")){
        errors.password = "my_account.err.passAlphaNumSpecial";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};