import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateComplainForm(data) {
    let errors = {};

    //Check Description...
    if (data.hasOwnProperty('description') && validator.isEmpty(data.description, { ignore_whitespace: true })) {
        errors.description = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('description') && !validator.isEmpty(data.description)) {
        if (isScriptTag(data.description)) {
            errors.description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.description)) {
            errors.description = "my_account.err.htmlTag";
        }
    }

    //Check Remark...
    if (data.hasOwnProperty('remark') && validator.isEmpty(data.remark, { ignore_whitespace: true })) {
        errors.remark = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('remark') && !validator.isEmpty(data.remark)) {
        if (isScriptTag(data.remark)) {
            errors.remark = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.remark)) {
            errors.remark = "my_account.err.htmlTag";
        }
    }

    if (data.hasOwnProperty('ComplainstatusId') && validator.isEmpty(data.ComplainstatusId)) {
        errors.ComplainstatusId = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};