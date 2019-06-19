import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateComplainReport(data) {
    let errors = {}

    if (data.hasOwnProperty('ComplainId') && !validator.isEmpty(data.ComplainId + '')) {
        if (isScriptTag(data.ComplainId)) {
            errors.ComplainId = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ComplainId)) {
            errors.ComplainId = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.ComplainId, { no_symbols: true })) {
            errors.ComplainId = "my_account.err.fieldNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};