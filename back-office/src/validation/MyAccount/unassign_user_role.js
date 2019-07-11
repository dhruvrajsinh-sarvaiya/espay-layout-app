/* 
    Developer : Bharat Jograna
    Date : 18 March 2019
    File Comment : MyAccount Unassign User Role Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers'

module.exports = function validateUnassignUserRole(data) {
    let errors = {};

    //Check Username
    if (data.hasOwnProperty('UserName') && !validator.isEmpty(data.UserName, { ignore_whitespace: true })) {
        if (isScriptTag(data.UserName)) {
            errors.UserName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.UserName)) {
            errors.UserName = "my_account.err.htmlTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}