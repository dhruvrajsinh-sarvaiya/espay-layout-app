import validator from "validator";

module.exports = function validateWithdrawReportRequest(data) {
  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.editWithdrawalReport.Address)) {
    errors.Address = "wallet.errWDReportAddressReq";
  }
  if (validator.isEmpty(data.editWithdrawalReport.FinalAmount)) {
    errors.FinalAmount = "wallet.errWDReportAmountReq";
  }
  if (validator.isEmpty(data.editWithdrawalReport.Status)) {
    errors.Status = "wallet.errWDReportStatusReq";
  }
  if (validator.isEmpty(data.editWithdrawalReport.Comment)) {
    errors.Comment = "wallet.errWDReportCommentReq";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
