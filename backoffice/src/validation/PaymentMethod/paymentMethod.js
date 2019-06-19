import validator from "validator";

module.exports = function validatePaymentMethodRequest(data) {
  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.editPaymentMethod.name)) {
    errors.name = "wallet.errPaymentName";
  }
  if (validator.isEmpty(data.editPaymentMethod.displayName)) {
    errors.displayName = "wallet.errPaymentDisplayName";
  }
  if (validator.isEmpty(data.editPaymentMethod.status)) {
    errors.status = "wallet.errPaymentStatus";
  }
  if (validator.isEmpty(data.editPaymentMethod.withdraw)) {
    errors.withdraw = "wallet.errPaymentWithdraw";
  }
  if (validator.isEmpty(data.editPaymentMethod.withdrawCommission)) {
    errors.withdrawCommission = "wallet.errPaymentWithdrwaCommission";
  }
  if (validator.isEmpty(data.editPaymentMethod.Exchange)) {
    errors.Exchange = "wallet.errPaymentExchange";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
