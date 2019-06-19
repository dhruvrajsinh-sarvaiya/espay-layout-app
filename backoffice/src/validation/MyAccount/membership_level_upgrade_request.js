import validator from 'validator';

module.exports = function validateMembershipLevelUpgradeRequest(data) {
    let errors = {};
    
    //Validation For MembershipLevelUpgradeRequest

     //Check Empty Select requestStatus...
     if (validator.isEmpty(data.requestStatus))
     {
         errors.requestStatus = "my_account.err.selectMemberRequestStatus";
     }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};