/**
 * Author : Saloni Rathod
 * Created : 25/03/2019
 * Affiliate Validation Report 
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from 'Helpers/helpers';

module.exports = function validateAffiliatePromotion(data) {
    let errors = {};

    //to check status
    if (validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    //to check PromotionType
    if (data.hasOwnProperty('PromotionType') && validator.isEmpty(data.PromotionType + '', { ignore_whitespace: true })) {
        errors.PromotionType = "my_account.err.fieldRequired";
    } if (data.hasOwnProperty('PromotionType') && !validator.isEmpty(data.PromotionType + '')) {
        if (isScriptTag(data.PromotionType)) {
            errors.PromotionType = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.PromotionType)) {
            errors.PromotionType = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.PromotionType)) {
            errors.PromotionType = "my_account.err.fieldAlpha";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};