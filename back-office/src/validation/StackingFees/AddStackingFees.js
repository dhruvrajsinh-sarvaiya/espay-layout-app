import validator from "validator";

module.exports = function validateaddStackingFeesRequest(data) {
  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.addNewStackingFeesDetails.uniqvalues)) {
    errors.uniqvalues = "wallet.errUniqvalues";
  }
  if (validator.isEmpty(data.addNewStackingFeesDetails.makercharges)) {
    errors.makercharges = "wallet.errMakerCharges";
  }
  if (validator.isEmpty(data.addNewStackingFeesDetails.takercharges)) {
    errors.takercharges = "wallet.errTakercharges";
  }
  if (validator.isEmpty(data.addNewStackingFeesDetails.chargetype)) {
    errors.chargetype = "wallet.errchargetype";
  }
  if (validator.isEmpty(data.addNewStackingFeesDetails.currency)) {
    errors.currency = "wallet.errCurrency";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
