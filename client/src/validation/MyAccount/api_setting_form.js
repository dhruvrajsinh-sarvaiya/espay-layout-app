import validator from 'validator';

module.exports = function validateAPISetting(data) {
    let errors = {};

    //Check Empty email...
    if (data.type == 'create') {
        if (validator.isEmpty(data.new_api_key)) {
            errors.new_api_key = "my_account.err.fieldRequired";
        }
        else if (!validator.isAlphanumeric(data.new_api_key)) {
            errors.new_api_key = "my_account.err.fieldAlphaNum";
        }
    } else {
        if (data.api_option.length == 0) {
            errors.api_option = "my_account.err.atleastOne";
        }

        if (validator.isEmpty(data.ip_access_rest)) {
            errors.ip_access_rest = "my_account.err.fieldRequired";
        }

        if (validator.isEmpty(data.trusted_ip)) {
            errors.trusted_ip = "my_account.err.fieldRequired";
        }
        else if (!validator.isIP(data.trusted_ip, 4)) {
            errors.trusted_ip = "my_account.err.validIPAddress";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};