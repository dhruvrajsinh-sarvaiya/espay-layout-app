/**
 * Author : Saloni Rathod
 * Created :  04/03/2019
 * Invite friends email validation
 */
import validator from 'validator';
module.exports = function emailvalidate(data) {
    let errors = {};
    let emaildata = []
    if (data.hasOwnProperty('EmailList')) {
        if (!validator.isEmpty(data.EmailList)) {
            var emails = data.EmailList.replace(/\s/g, '').split(",");
            var valid = true;
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //     for (var i = 0,j=0; i < emails.length; i++) {
        //         if (emails[i] !== "" && !regex.test(emails[i])) {
        //             emaildata[j] = emails[i]
        //             j++
        //             errors.EmailList="sidebar.invalidEmailId"
        //         }
               
        //     }
        // }
        for (var i = 0,j=0; i < emails.length; i++) {
            if (emails[i] !== "" && !validator.matches(emails[i],regex)) {
                emaildata[j] = emails[i]
                j++
                errors.EmailList="sidebar.invalidEmailId"
            }
           
        }
    }
        else
        errors.EmailList = "my_account.err.fieldRequired";
     
    }
    else if (validator.isEmpty(data+'')) {
        errors.EmailList = "my_account.err.fieldRequired";
    }


    return {
        errors,
        emaildata,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};