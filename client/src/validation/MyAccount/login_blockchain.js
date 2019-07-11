import validator from 'validator';

module.exports = function validateLoginBlockchain(data) {
    let errors = {};
    
    //Check Empty Email...
    if (data.type === 'key' && validator.isEmpty(data.private_key))
    {
        errors.private_key = "my_account.err.privateKeyRequired";
    }

    //Check Empty Password
    if (data.type === 'file' && validator.isEmpty(data.password))
    {
        errors.password = "my_account.err.passwordRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};