import validator from "validator";

module.exports = function validateAddChargeTypeRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addNewChargeTypeDetail.TypeId)) {
        errors.TypeId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewChargeTypeDetail.TypeName)) {
        errors.TypeName = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
