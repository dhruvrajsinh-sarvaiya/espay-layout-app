import validator from "validator";

module.exports = function validateaddTransactionPolicyRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addTrnTypeRoleWiseForm.TrnTypeId)) {
        errors.TrnTypeId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addTrnTypeRoleWiseForm.RoleId)) {
        errors.RoleId = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
