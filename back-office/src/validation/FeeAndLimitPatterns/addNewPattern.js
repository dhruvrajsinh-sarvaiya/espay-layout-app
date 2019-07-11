/* 
    Developer : Nishant Vadgam
    Date : 02-10-2018
    File Comment : Add new limit & fee pattern validator file
*/

import validator from 'validator';

module.exports = function validateAddNewRequest(data) {
    let errors = {};

    //Check Main Form details...
    if (validator.isEmpty(data.patternName)) {
        errors.patternName = "wallet.errPatternName";
    }
    if (validator.isEmpty(data.patternDesc)) {
        errors.patternDesc = "wallet.errPatternDesc";
    }
    if (validator.isEmpty(data.patternExchange)) {
        errors.patternExchange = "wallet.errPatternExchange";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};