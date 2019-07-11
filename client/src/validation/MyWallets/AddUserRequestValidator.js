/* 
    Developer : Nishant Vadgama
    Date : 10-01-2019
    File Comment : add wallet user request validator
*/

import validator from 'validator';

module.exports = function validateAddUserRequest(data) {
    let errors = {};
    //validate email address
    if (validator.isEmpty(data.Email)) {
        errors.email = "my_account.err.emailRequired";
    } else if (data.Email.trim().length === 0) {
        errors.email = "my_account.err.emailRequired";
    } else if (!validator.isEmail(data.Email)) {
        errors.email = "my_account.err.EmailFormatRequired";
    }
    // validate invite message
    if (validator.isEmpty(data.Message)) {
        errors.message = "wallet.errMessageRequired";
    } else if (data.Message.trim().length === 0) {
        errors.message = "wallet.errMessageRequired";
    } else if (data.Message.trim().length > 200) {
        errors.message = "wallet.errMessageLimit";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};