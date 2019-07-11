import validator from 'validator';

module.exports = function validateSetNewPassword(data) {
    let errors = {};

    //Check Empty New Password...    
    if (typeof(data.password) !== 'undefined' && validator.isEmpty(data.password)) {
        errors.password = "my_account.err.fieldRequired";
    } else if(typeof(data.password) !== 'undefined' && !validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "my_account.err.passwordLength";
    } else if(typeof(data.password) !== 'undefined' && !validator.matches(data.password,"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")){
        errors.password = "my_account.err.passAlphaNumSpecial";
    }

    //Check Empty Confirm Password...
    if (typeof(data.confirmPassword) != 'undefined' && validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.fieldRequired";
    } else if(typeof(data.confirmPassword) != 'undefined' && !validator.isLength(data.confirmPassword, { min: 6, max: 30 })) {
        errors.confirmPassword = "my_account.err.passwordLength";
    } else if(typeof(data.confirmPassword) != 'undefined' && !validator.matches(data.confirmPassword,"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")){
        errors.confirmPassword = "my_account.err.passAlphaNumSpecial";
    } else if (typeof(data.confirmPassword) != 'undefined' && !validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'my_account.err.PasswordMatch';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};