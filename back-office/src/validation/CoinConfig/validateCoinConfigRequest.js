/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    File Comment : On add & edit coin form validations
*/
import validator from "validator";

module.exports = function validateCoinConfigRequest(data) {
  let errors = {};
  // coin name
  if (validator.isEmpty(data.WalletTypeName)) {
    errors.WalletTypeName = "wallet.errWalletTypeName";
  }
  // coin description
  if (validator.isEmpty(data.Description)) {
    errors.Description = "wallet.errDescription";
  }
  // deposition allowed
  if (validator.isEmpty(data.IsDepositionAllowValue)) {
    errors.IsDepositionAllow = "wallet.errIsDepositionAllow";
  }
  // withdraw allowed
  if (validator.isEmpty(data.IsWithdrawalAllowValue)) {
    errors.IsWithdrawalAllow = "wallet.errIsWithdrawalAllow";
  }
  // transaction allowed
  if (validator.isEmpty(data.IsTransactionWalletValue)) {
    errors.IsTransactionWallet = "wallet.errIsTransactionWallet";
  }
  // validate status
  if (validator.isEmpty(data.StatusValue)) {
    errors.Status = "wallet.errStatus";
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
