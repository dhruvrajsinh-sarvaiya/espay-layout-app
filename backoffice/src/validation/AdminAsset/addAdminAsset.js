import validator from "validator";

module.exports = function validateaddAdminAssetRequest(data) {
  let errors = {};
  if (validator.isEmpty(data.addNewAdminAssetDetails.name)) {
    errors.name = "wallet.errAdminAssteName";
  }
  if (validator.isEmpty(data.addNewAdminAssetDetails.quantity)) {
    errors.quantity = "wallet.errAdminAssetQuantity";
  }
  if (validator.isEmpty(data.addNewAdminAssetDetails.units)) {
    errors.units = "wallet.errAdminAssetunit";
  }
  if (validator.isEmpty(data.addNewAdminAssetDetails.issuer)) {
    errors.issuer = "wallet.errAdminAssetIssuer";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
