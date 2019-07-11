import validator from 'validator';

module.exports = function validateEmailSignup(data) {
    let errors = {};
    

     //Check Empty Password...
     if (validator.isEmpty(data.password))
     {
         errors.password = "my_account.err.BlockchainRequired";
     }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};