import validator from "validator";

module.exports = function validateAdminAssetRequest(data) {
  let errors = {};
  if (validator.isEmpty(data.editAdminAssetReport.name)) {
    errors.name = "wallet.errAdminAssteName";
  }
  if (validator.isEmpty(data.editAdminAssetReport.quantity)) {
    errors.quantity = "wallet.errAdminAssetQuantity";
  }
  if (validator.isEmpty(data.editAdminAssetReport.units)) {
    errors.units = "wallet.errAdminAssetunit";
  }
  if (validator.isEmpty(data.editAdminAssetReport.issuer)) {
    errors.issuer = "wallet.errAdminAssetIssue";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
