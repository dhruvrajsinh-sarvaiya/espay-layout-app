import validator from "validator";

export function validateOnlyAlphaNumeric(data) {    

    if(validator.isAlphanumeric(data)){
        return true;
    }else{
        return false;
    }
}

export function validateIPAddress(data) {    

    if(validator.isIP(data)){
        return true;
    }else{
        return false;
    }
}

export function validateOnlyNumeric(data) {

    const regexNumeric = /^[0-9.]+$/;

    if(!validator.matches(data,regexNumeric)){
        return false;
    } else {
        return true;
    }

}

export function validateAlphabets(data) {

    if(validator.isAlpha(data)){
        return true;
    }
}


export function validatePasswordData(data){
    let errors = {};

    const passwordExpression  = /^[a-zA-Z0-9!@#$%^&*]{17}$/;
    if(validator.matches(data,passwordExpression)){
        errors.password = "daemonconfigure.daemonaddform.form.error.passworderror";
    }

    if(data.length > 16){
        errors.password = "daemonconfigure.daemonaddform.form.error.passworderrormaxlength";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}


export function validateUsernameData(data){
    let errors = {};
    const usernameExpression  = /^[a-zA-Z0-9.\-_$@*!]{30}$/;
    if(validator.matches(data,usernameExpression)){
        errors.username = "daemonconfigure.daemonaddform.form.error.usernameerror";
    } 
 

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateDaemonConfigurationRequest(daemonRequest) {

    let errors = '';
    // if(validator.isEmpty(daemonRequest.daemonIPAddress.toString())) {
    //     errors = "daemonconfigure.error.emptyIPAddress";
    // } else if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(daemonRequest.daemonIPAddress.toString())) {
    //     errors = "daemonconfigure.error.invalidIPAddress";
    // } else if(validator.isEmpty(daemonRequest.daemonPort.toString())) {
    //     errors = "daemonconfigure.error.emptyPort";
    // }  else if(!/^[0-9.]+$/.test(daemonRequest.daemonPort.toString())) {
    //     errors = "daemonconfigure.error.invalidPort";
    // } else if(validator.isEmpty(daemonRequest.daemonHost.toString())) {
    //     errors = "daemonconfigure.error.emptyHost";
    // } else if(!/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(daemonRequest.daemonHost.toString())) { 
    //     errors = "daemonconfigure.error.invalidHost";
    // }

    if (validator.isEmpty(daemonRequest.daemonIPAddress.toString())) {
        errors = "daemonconfigure.error.emptyIPAddress";
    } else if (!validator.matches(daemonRequest.daemonIPAddress.toString(), /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        errors = "daemonconfigure.error.invalidIPAddress";
    } else if (validator.isEmpty(daemonRequest.daemonPort.toString())) {
        errors = "daemonconfigure.error.emptyPort";
    } else if (!validator.matches(daemonRequest.daemonPort.toString(), /^[0-9.]+$/)) {
        errors = "daemonconfigure.error.invalidPort";
    } else if (validator.isEmpty(daemonRequest.daemonHost.toString())) {
        errors = "daemonconfigure.error.emptyHost";
      } else if(!validator.matches(daemonRequest.daemonHost.toString(),/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)) { 
      errors = "daemonconfigure.error.invalidHost";
     }
    return errors;
}