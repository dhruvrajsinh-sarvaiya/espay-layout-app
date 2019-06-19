import validator from 'validator';

module.exports = function validateAddUserDashboard(data) {
    let errors = {};

    //Validation For Add New User

    //Check Empty fullName...
    if (validator.isEmpty(data.fullName)) {
        errors.fullName = "my_account.err.fieldRequired";
    }

    //Check Empty Email...
    if (validator.isEmpty(data.email)) {
        errors.email = "my_account.err.fieldRequired";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "sitesetting.form.error.isvalidemailaddress";
    }

    //Check Empty MobileNo...
    if (validator.isEmpty(data.mobileno)) {
        errors.mobileno = "my_account.err.fieldRequired";
    }

    //Check Empty Password...
    if (validator.isEmpty(data.password)) {
        errors.password = "my_account.err.fieldRequired";
    }

    //Check Empty confirmPassword...
    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.fieldRequired";
    }
    else if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.fieldRequired";
    }

    //Check Select Type...
    if (validator.isEmpty(data.type)) {
        errors.type = "my_account.err.fieldRequired";
    }
    //Check Select status...
    if (validator.isEmpty(data.status)) {
        errors.status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};