import validator from "validator";

module.exports = function validateAddCommissionTypeRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addNewCommissionTypeDetail.TypeId)) {
        errors.TypeId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewCommissionTypeDetail.TypeName)) {
        errors.TypeName = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
