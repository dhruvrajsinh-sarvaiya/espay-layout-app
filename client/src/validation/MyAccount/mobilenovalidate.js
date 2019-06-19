/**
 * Author : Saloni Rathod
 * Created :  04/03/2019
 * Invite friends mobile validation
 */
import validator from 'validator';
module.exports = function mobilenovalidate(data) {
    let errors = {};
    let mobiledata = [];
    if (data.hasOwnProperty('MobileNumberList')) {
        if (!validator.isEmpty(data.MobileNumberList)) {
            var number = data.MobileNumberList.replace(/\s/g, '').split(",");
            var valid = true;
    //         for (var i = 0,j=0; i < number.length; i++) {
    //             if (number[i] !== "" && ! /^(\d{10},)*\d{10}$/.test(number[i])) {
    //                 mobiledata[j] = number[i];
    //                 j++;
    //                 errors.MobileNumberList = "sidebar.invalidMobileNo";
    //    }
    for (var i = 0,j=0; i < number.length; i++) {
        if (number[i] !== "" && !validator.matches(number[i],/^(\d{10},)*\d{10}$/)) {
            mobiledata[j] = number[i];
            j++;
            errors.MobileNumberList = "sidebar.invalidMobileNo";
}
               
            }
        }
        else
        errors.MobileNumberList = "my_account.err.fieldRequired";
    }
    else if ((validator.isEmpty(data))) {
        errors.MobileNumberList = "my_account.err.fieldRequired";
    }
    return {
        mobiledata,
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};