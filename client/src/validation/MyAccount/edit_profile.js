import validator from 'validator';

module.exports = function validateEditProfile(data) {
    let errors = {};

    //Check Empty Username...
    if (typeof(data.Username) != 'undefined' && validator.isEmpty(data.Username)) {
        errors.Username = "my_account.err.fieldRequired";
    } else if(typeof(data.Username) != 'undefined' && !validator.isLength(data.Username, { min: 2, max: 30 })) {
        errors.Username = "my_account.err.length2To30";
    }
    
    //Check Empty Firstname...
    if (typeof(data.FirstName) != 'undefined' && validator.isEmpty(data.FirstName)) {
        errors.FirstName = "my_account.err.fieldRequired";
    } else if(typeof(data.FirstName) != 'undefined' && !validator.isAlpha(data.FirstName)) {
        errors.FirstName = "my_account.err.fieldAlpha";
    } else if(typeof(data.FirstName) != 'undefined' && !validator.isLength(data.FirstName, { min: 2, max: 30 })) {
        errors.FirstName = "my_account.err.length2To30";
    }

    //Check Empty Lastname...
    if (typeof(data.LastName) != 'undefined' && validator.isEmpty(data.LastName)) {
        errors.LastName = "my_account.err.fieldRequired";
    } else if(typeof(data.LastName) != 'undefined' && !validator.isAlpha(data.LastName)) {
        errors.LastName = "my_account.err.fieldAlpha";
    } else if(typeof(data.LastName) != 'undefined' && !validator.isLength(data.LastName, { min: 2, max: 30 })) {
        errors.LastName = "my_account.err.length2To30";
    }

    //Check Empty PhoneNumber...
    if (typeof(data.PhoneNumber) != 'undefined' && validator.isEmpty(data.PhoneNumber)) {
        errors.PhoneNumber = "my_account.err.fieldRequired";
    } else if(typeof(data.PhoneNumber) != 'undefined' && !validator.isNumeric(data.PhoneNumber) || parseInt(data.PhoneNumber) == 0) {
        errors.PhoneNumber = "my_account.err.validPhoneNo";
    } else if(typeof(data.PhoneNumber) != 'undefined' && !validator.isLength(data.PhoneNumber, { min: 10, max: 10 })) {
        errors.PhoneNumber = "my_account.err.mobileLength";
    }

    //Check Empty MobileNo...
    if (typeof(data.MobileNo) != 'undefined' && validator.isEmpty(data.MobileNo)) {
        errors.MobileNo = "my_account.err.fieldRequired";
    } else if(typeof(data.MobileNo) != 'undefined' && !validator.isNumeric(data.MobileNo) || parseInt(data.MobileNo) == 0) {
        errors.MobileNo = "my_account.err.validPhoneNo";
    } else if(typeof(data.MobileNo) != 'undefined' && !validator.isLength(data.MobileNo, { min: 10, max: 10 })) {
        errors.MobileNo = "my_account.err.mobileLength";
    }

    //Check Empty email...
    if (typeof(data.Email) != 'undefined' && validator.isEmpty(data.Email)) {
        errors.Email = "my_account.err.emailRequired";
    } else if (typeof(data.Email) != 'undefined' && !validator.isEmail(data.Email)) {
        errors.Email = "my_account.err.emailFormat";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};