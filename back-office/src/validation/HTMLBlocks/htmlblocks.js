/**
 * Cretae By Sanjay 
 * Created Date 28-05-2019
 * Validation File fore HTML Block Input Filed 
 */

import validator from 'validator';
import { isScriptTag,isHtmlTag } from "Helpers/helpers";

module.exports = function validateHTMLBlockFormInput(data) {
    let errors = {};
    
    if (typeof (data.name) !== 'undefined' && validator.isEmpty(data.name.trim())) {
        errors.name = "my_account.err.fieldRequired";
    } else if (typeof (data.name) !== 'undefined' && isScriptTag(data.name)) {
        errors.name = "my_account.err.scriptTag";
    }else if (typeof (data.name) !== 'undefined' && isHtmlTag(data.name)) {
        errors.name = "my_account.err.htmlTag";
    }
    
    if (validator.isEmpty(data.content.trim()) || data.content === "<p><br></p>") {
        errors.content = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};