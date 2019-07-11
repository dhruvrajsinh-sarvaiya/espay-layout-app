/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
  Affiliate Report 
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from '../../helpers/helpers';

module.exports = function validateAffiliateReport(data) {
    let errors = {};

    if (validator.isEmpty(data.FromDate)) {
        errors.FromDate = "my_account.err.fieldRequired";
    }

    if (validator.isEmpty(data.ToDate)) {
        errors.ToDate = "my_account.err.fieldRequired";
    }

    if (typeof (data.TrnRefNo) !== 'undefined' && !validator.isEmpty(data.TrnRefNo + '')) {
        if (isScriptTag(data.TrnRefNo)) {
            errors.TrnRefNo = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.TrnRefNo)) {
            errors.TrnRefNo = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.TrnRefNo)) {
            errors.TrnRefNo = "my_account.err.fieldNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};