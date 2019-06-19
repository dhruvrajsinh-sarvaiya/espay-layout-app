import validator from "validator";

module.exports = function validateDepositReportRequest(data) {
  let errors = {};

  if (validator.isEmpty(data.editDepositReport.CreatedAmount)) {
    errors.CreatedAmount = "wallet.errdepositReportAmountReq";
  }
  if (validator.isEmpty(data.editDepositReport.Status)) {
    errors.Status = "wallet.errdepositReportStatusReq";
  }
  if (validator.isEmpty(data.editDepositReport.Comment)) {
    errors.Comment = "wallet.errdepositReportCommentReq";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
