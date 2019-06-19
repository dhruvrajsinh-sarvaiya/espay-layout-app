import validator from 'validator';

module.exports = function validateResetPassword(data) {
    let errors = {};
    
    //Check Empty Password...
    if (validator.isEmpty(data.newpassword))
    {
        errors.newpassword = "my_account.err.resetPasswordRequired";
    }     

    //Check Empty ConfirmPassword...
    if (validator.isEmpty(data.confirmpassword))
    {
        errors.confirmpassword ="my_account.err.resetConfirmPasswordRequired";
    } 
    else if(!validator.equals(data.newpassword, data.confirmpassword)) 
    {
        errors.confirmpassword = "my_account.err.resetPasswordMatch";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};