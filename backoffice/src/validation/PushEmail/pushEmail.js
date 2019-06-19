import validator from 'validator';
import {isScriptTag,isHtmlTag} from "Helpers/helpers";
module.exports = function validateEmail(data) {
    let errors = {};
    if(data.Recepient.length <= 0){
        errors.selectedUser = "pushEmail.error.RecipientAddressEmpty";
    }else if (validator.isEmpty(data.Subject)) {
        errors.Subject = "pushEmail.error.subjectEmpty";
    }
    if (!validator.isEmpty(data.Subject)){
        if (isScriptTag(data.Subject)) {
           errors.Subject= "my_account.err.scriptTag";
        }
        else if (isHtmlTag(data.Subject)) {
           errors.Subject= "my_account.err.htmlTag";
        }
      }else if (validator.isEmpty(data.Body)) {
        errors.Body = "pushEmail.error.BodyEmpty";
    }else if(isScriptTag(data.Body)){
        errors.Body = "pushEmail.error.BodyScript";
    }
    else if(isHtmlTag(data.Body)){
        errors.Body = "pushEmail.error.BodyScript";
    }
    else {
        if(data.Recepient.length > 0){
            data.Recepient.forEach(function(value){
                if(!validator.isEmail(value)){
                    errors.selectedUser = "BCCAddress.error.RecipientAddress";
                }
            });
        }else if(data.BCC.length > 0){
            data.BCC.forEach(function(value){
                if(!validator.isEmail(value)){
                    errors.selectedBCCUser = "pushEmail.error.BCCAddress";
                }
            });
        }else if(data.CC.length > 0){
            data.CC.forEach(function(value){
                if(!validator.isEmail(value)){
                    errors.selectedBCCUser = "pushEmail.error.CCAddress";
                }
            });
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};