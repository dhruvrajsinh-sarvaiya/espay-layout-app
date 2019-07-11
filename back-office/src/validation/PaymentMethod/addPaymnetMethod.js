import validator from "validator";

module.exports = function validateAddPaymentMethodRequest(data) {
  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.addNewPaymentMethodDetails.name)) {
    errors.name = "wallet.errPaymentName";
  }
  if (validator.isEmpty(data.addNewPaymentMethodDetails.displayName)) {
    errors.displayName = "wallet.errPaymentDisplayName";
  }
  if (validator.isEmpty(data.addNewPaymentMethodDetails.status)) {
    errors.status = "wallet.errPaymentStatus";
  }
  if (validator.isEmpty(data.addNewPaymentMethodDetails.withdraw)) {
    errors.withdraw = "wallet.errPaymentWithdraw";
  }
  if (validator.isEmpty(data.addNewPaymentMethodDetails.withdrawCommission)) {
    errors.withdrawCommission = "wallet.errPaymentWithdrwaCommission";
  }
  if (validator.isEmpty(data.addNewPaymentMethodDetails.Exchange)) {
    errors.Exchange = "wallet.errPaymentExchange";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
