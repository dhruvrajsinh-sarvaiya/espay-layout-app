/**
 * Author : Saloni Rathod
 * Created : 27/03/2019
 * Affiliate Validation Report 
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from 'Helpers/helpers';

module.exports = function validateAffiliateScheme(data) {
    let errors = {};

    //Check  SchemeName...
    if (data.hasOwnProperty('SchemeName') && validator.isEmpty(data.SchemeName, { ignore_whitespace: true })) {
        errors.SchemeName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('SchemeName') && !validator.isEmpty(data.SchemeName)) {
        if (isScriptTag(data.SchemeName)) {
            errors.SchemeName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SchemeName)) {
            errors.SchemeName = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.SchemeName)) {
            errors.SchemeName = "my_account.err.fieldAlpha";
        }
    }

    //Check  SchemeType...
    if (data.hasOwnProperty('SchemeType') && validator.isEmpty(data.SchemeType, { ignore_whitespace: true })) {
        errors.SchemeType = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('SchemeType') && !validator.isEmpty(data.SchemeType)) {
        if (isScriptTag(data.SchemeType)) {
            errors.SchemeType = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SchemeType)) {
            errors.SchemeType = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.SchemeType)) {
            errors.SchemeType = "my_account.err.fieldAlpha";
        }
    }

    //Check Status
    if (validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};