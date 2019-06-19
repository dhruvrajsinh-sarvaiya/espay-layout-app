import validator from 'validator';
module.exports = function validateStep2Request(data) {
    let errors = {};
    //Check numeric Field...
    if (validator.isEmpty(data.filename) && validator.isEmpty(data.privatekey)) {
        errors.file = "wallet.errFile";
        errors.privatekey = "wallet.errPrivateKey";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};