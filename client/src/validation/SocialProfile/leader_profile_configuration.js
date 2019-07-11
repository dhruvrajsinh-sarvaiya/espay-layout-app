/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    UpdatedBy : Salim Deraiya 26-12-2018
    File Comment : Leader Profile Configuration Validation
*/

import validator from 'validator';
import { isScriptTag } from 'Helpers/helpers';

module.exports = function validateLeaderProfileConfigForm(data) {
    let errors = {};

    //Check Empty Default_Visibility_of_Profile...
    if (typeof (data.Default_Visibility_of_Profile) !== 'undefined' && validator.isEmpty(data.Default_Visibility_of_Profile.trim())) {
        errors.Default_Visibility_of_Profile = "my_account.err.fieldRequired";
    }

    //Check Empty Max_Number_Followers_can_Follow...
    if (typeof (data.Max_Number_Followers_can_Follow) !== 'undefined' && validator.isEmpty(data.Max_Number_Followers_can_Follow.trim())) {
        errors.Max_Number_Followers_can_Follow = "my_account.err.fieldRequired";
    } else if (typeof (data.Max_Number_Followers_can_Follow) !== 'undefined' && !validator.isNumeric(data.Max_Number_Followers_can_Follow, { no_symbols: true })) {
        errors.Max_Number_Followers_can_Follow = "my_account.err.requireNumericField";
    } else if (typeof (data.Max_Number_Followers_can_Follow) !== 'undefined' && data.Max_Number_Followers_can_Follow.length > 3) {
        errors.Max_Number_Followers_can_Follow = "my_account.err.length3Max";
    } else if (typeof (data.Max_Number_Followers_can_Follow) !== 'undefined' && data.Max_Number_Followers_can_Follow === '0') {
        errors.Max_Number_Followers_can_Follow = "my_account.err.zeroValue";
    }

    //Check Empty groupName...
    if (typeof (data.groupName) !== 'undefined' && validator.isEmpty(data.groupName.trim())) {
        errors.groupName = "my_account.err.fieldRequired";
    } else if (typeof data.groupName !== 'undefined' && isScriptTag(data.groupName)) {
        errors.groupName = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};