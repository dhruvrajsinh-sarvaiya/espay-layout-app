import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateAddressWhitelistRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.coin)) {
        errors.coin = "wallet.errWDCoinReq";
    }
    if (validator.isEmpty(data.lable)) {
        errors.lable = "wallet.errWDlabelReq";
    } 
    if (isScriptTag(data.lable)) {
        errors.lable="my_account.err.scriptTag";
      }
      else if (isHtmlTag(data.lable)) {
        errors.lable="my_account.err.htmlTag";
    }else if (data.lable.length > 50) {
        errors.lable = "wallet.errWDlabelReq";
    } else if (data.lable.trim().length === 0) {
        errors.lable = "wallet.errWDlabelReq";
    }
    if (validator.isEmpty(data.address)) {
        errors.address = "wallet.errWDAddressReq";
    }     if (isScriptTag(data.address)) {
        errors.address="my_account.err.scriptTag";
      }
      else if (isHtmlTag(data.address)) {
        errors.address="my_account.err.htmlTag";
    }else if (data.address.length > 50) {
        errors.address = "wallet.errWDAddressReq";
    } else if (data.address.trim().length === 0) {
        errors.address = "wallet.errWDAddressReq";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
