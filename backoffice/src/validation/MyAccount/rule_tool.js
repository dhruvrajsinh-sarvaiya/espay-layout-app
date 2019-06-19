/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : MyAccount Rule Tool Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateRuleTool(data) {
    let errors = {};

    //Check Empty SubModuleID...
    if (data.hasOwnProperty('SubModuleID') && validator.isEmpty(data.SubModuleID + '', { ignore_whitespace: true })) {
        errors.SubModuleID = "my_account.err.fieldRequired";
    }

    //Check Empty ToolName...
    if (data.hasOwnProperty('ToolName') && validator.isEmpty(data.ToolName + '', { ignore_whitespace: true })) {
        errors.ToolName = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('ToolName') && !validator.isEmpty(data.ToolName + '')) {
        if (isScriptTag(data.ToolName)) {
            errors.ToolName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ToolName)) {
            errors.ToolName = "my_account.err.htmlTag";
        } else if (!validator.isAlphanumeric(data.ToolName + '')) {
            errors.ToolName = "my_account.err.fieldAlphaNum";
        }
    }

    //Check Empty Status...
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '', { ignore_whitespace: true })) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};