import validator from 'validator';

module.exports = function validateResetPassword(data) {
    let errors = {};
    
    //Check Empty Password...
    if (validator.isEmpty(data.newpassword))
    {
        errors.newpassword = "my_account.err.PasswordRequired";
    }     

    //Check Empty ConfirmPassword...
    if (validator.isEmpty(data.confirmpassword))
    {
        errors.confirmpassword = "my_account.err.ConfirmPasswordRequired";
    } 
    else if(!validator.equals(data.newpassword, data.confirmpassword)) 
    {
        errors.confirmpassword = 'my_account.err.PasswordMatch';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};