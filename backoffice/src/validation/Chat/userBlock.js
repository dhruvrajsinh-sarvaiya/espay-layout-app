import validator from 'validator';

module.exports = function validateChatListBlockInput(data) {
    let errors = {};
    // console.log("validation:",data);
    if (!validator.isBoolean(data.IsBlocked+'')) {
        errors.IsBlocked = "userlist.form.validation.isBlocked";
    }

    if ( typeof data.blockReason === "undefined" || validator.isEmpty(''+data.blockReason.trim())) {
        errors.blockReason = "userlist.form.validation.reason";
    }
    else if (!validator.isLength(data.blockReason+'', { min: 2, max: 100 })) {
        errors.blockReason = "userlist.form.validation.limit";
    } 
    else if ( typeof data.prevIsBlocked !== "undefined" && data.prevIsBlocked === data.IsBlocked ) {
        errors.blockReason = "userlist.form.validation.isBlocked";  // Added by Jayesh 25-01-2019
    }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };  
};

