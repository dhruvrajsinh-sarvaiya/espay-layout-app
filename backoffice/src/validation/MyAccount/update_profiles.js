import validator from 'validator';

module.exports = function validateUpdateProfiles(data) {
    let errors = {};
    
    //Check Empty profileName...
    if (validator.isEmpty(data.profileName))
    {
        errors.profileName = "my_account.err.profileNameRequired";
    }     

    //Check Empty profileDescription...
    if (validator.isEmpty(data.profileDescription))
    {
        errors.profileDescription ="my_account.err.profileDescriptionRequired";
    } 

     //Check Empty exchange...
     if (validator.isEmpty(data.exchange))
     {
         errors.exchange ="my_account.err.profileExchangeRequired";
     }  

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};