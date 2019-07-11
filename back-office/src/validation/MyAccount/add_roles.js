import validator from 'validator';

module.exports = function validateAddRole(data) {
    let errors = {};

    //Check Empty New Role...
    if (validator.isEmpty(data.role_name)) {
        errors.role_name = "my_account.err.fieldRequired";
    }

    //Check New Description...
    if (validator.isEmpty(data.role_description)) {
        errors.role_description = "my_account.err.fieldRequired";
    }

    //Check Role Exchange...
    if (validator.isEmpty(data.role_exchange)) {
        errors.role_exchange = "my_account.err.fieldRequired";
    }

    //Check Reports To...
    if (validator.isEmpty(data.reports_to)) {
        errors.reports_to = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};