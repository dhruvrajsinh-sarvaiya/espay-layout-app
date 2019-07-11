import validator from 'validator';

module.exports = function validateSmsAuth(data) {
    let errors = {};    

     //Check Empty PhoneNo...
     if (validator.isEmpty(data.phoneno))
     {
         errors.phoneno = "my_account.err.PhonenoRequired";
     }
     else  if (!validator.isLength(data.phoneno, { min: 10, max: 10 })) {
        errors.phoneno = "my_account.err.PhonenoRange";
      }

    //Check Empty SmsAuthentication...
    if (validator.isEmpty(data.smsauthcode))
    {
        errors.smsauthcode = "my_account.err.SmsAuthCodeRequired";
    }
   
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};

