import validator from "validator";

module.exports = function validateStackingFeesRequest(data) {
  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.editStackingFeesReport.uniqvalues)) {
    errors.uniqvalues = "wallet.errUniqvalues";
  }
  if (validator.isEmpty(data.editStackingFeesReport.makercharges)) {
    errors.makercharges = "wallet.errMakerCharges";
  }
  if (validator.isEmpty(data.editStackingFeesReport.takercharges)) {
    errors.takercharges = "wallet.errTakercharges";
  }
  if (validator.isEmpty(data.editStackingFeesReport.chargetype)) {
    errors.chargetype = "wallet.errchargetype";
  }
  if (validator.isEmpty(data.editStackingFeesReport.currency)) {
    errors.currency = "wallet.errCurrency";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
