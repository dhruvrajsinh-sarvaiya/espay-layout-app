import validator from 'validator';

module.exports = function validateForgotPassword(data) {
    let errors = {};
    
     //Check Empty Email...
     if (validator.isEmpty(data.email))
     {
         errors.email = "my_account.err.forgotEmailRequired";
     }
     else if (!validator.isEmail(data.email)) {
        errors.email = "my_account.err.forgotEmailFormatRequired";
      }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};