import validator from 'validator';

module.exports = function validateDisableGoogleAuth(data) {
    let errors = {};    

     //Check Empty Login Password...
     if (validator.isEmpty(data.loginpassword))
     {
         errors.loginpassword = "my_account.err.disableGoogleloginpassword";
     }

    //Check Empty SmsAuthentication...
    if (validator.isEmpty(data.smsauthcode))
    {
        errors.smsauthcode = "my_account.err.disableGoogleAuthCodeRequired";
    }
   
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};

