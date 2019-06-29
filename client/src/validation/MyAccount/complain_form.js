/**
 * Updated by:Saloni Rathod
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateComplainForm(data) {
    let errors = {};
    //Check Empty Complain Type...
    if (typeof (data.TypeId) !== 'undefined' && (validator.isEmpty(data.TypeId) || !validator.isNumeric(data.TypeId))) {
        errors.TypeId = "my_account.err.fieldRequired";
    }
    //Check Empty Subject...
    if (typeof (data.Subject) !== 'undefined' && validator.isEmpty(data.Subject, { ignore_whitespace: true })) {
        errors.Subject = "my_account.err.fieldRequired";
    } else if (typeof (data.Subject) !== 'undefined' && isScriptTag(data.Subject)) {
        errors.Subject = "my_account.err.scriptTag";
    }
    else if (typeof (data.Subject) !== 'undefined' && isHtmlTag(data.Subject)) {
        errors.Subject = "my_account.err.htmlTag";
    }
    //Check Empty Description...
    if (typeof (data.Description) !== 'undefined' && validator.isEmpty(data.Description, { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired";
    } else if (typeof (data.Description) !== 'undefined' && isScriptTag(data.Description)) {
        errors.Description = "my_account.err.scriptTag";
    }
    else if (typeof (data.Description) !== 'undefined' && isHtmlTag(data.Description)) {
        errors.Description = "my_account.err.htmlTag";
    }

    if (data.hasOwnProperty('description')) {
        //Check Empty Description...
        if (typeof (data.description) !== 'undefined' && validator.isEmpty(data.description, { ignore_whitespace: true })) {
            errors.description = "my_account.err.fieldRequired";
        } else if (typeof (data.description) !== 'undefined' && isScriptTag(data.description)) {
            errors.description = "my_account.err.scriptTag";
        }
        else if (typeof (data.description) !== 'undefined' && isHtmlTag(data.description)) {
            errors.description = "my_account.err.htmlTag";
        }
    }
    //Check Empty Complain Priority...
    if (typeof (data.ComplaintPriorityId) !== 'undefined' && (validator.isEmpty(data.ComplaintPriorityId) || !validator.isNumeric(data.ComplaintPriorityId))) {
        errors.ComplaintPriorityId = "my_account.err.fieldRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};