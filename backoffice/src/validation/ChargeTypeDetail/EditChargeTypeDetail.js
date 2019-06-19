import validator from "validator";

module.exports = function validateEditChargeTypeRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.editChargeTypeDetail.TypeName)) {
        errors.TypeName = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
