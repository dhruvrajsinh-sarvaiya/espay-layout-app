import validator from 'validator';

module.exports = function validateDisableSmsAuth(data) {
    let errors = {};    

     //Check Empty Login Password...
     if (validator.isEmpty(data.loginpassword))
     {
         errors.loginpassword = "my_account.err.disableloginpassword";
     }

     //Check Empty PhoneNo...
     if (validator.isEmpty(data.phonenumber))
     {
         errors.phonenumber = "my_account.err.disablePhonenoRequired";
     }
     else  if (!validator.isLength(data.phonenumber, { min: 10, max: 10 })) {
        errors.phonenumber = "my_account.err.PhonenoRange";
      }

    //Check Empty SmsAuthentication...
    if (validator.isEmpty(data.smsauthcode))
    {
        errors.smsauthcode = "my_account.err.disableSmsAuthCodeRequired";
    }
   
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};

