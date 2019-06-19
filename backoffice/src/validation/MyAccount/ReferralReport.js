import validator from 'validator';

module.exports = function validateReferaals(data) {
    let errors = {};

    //Check Empty Username...
    if (!validator.isEmpty(data.username) && !validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = "my_account.err.length2To30"
    }
    //Check Empty Email...
    if (!validator.isEmpty(data.email) && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.EmailFormatRequired"
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}
