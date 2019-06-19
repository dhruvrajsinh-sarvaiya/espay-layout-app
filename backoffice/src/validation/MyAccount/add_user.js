import validator from 'validator';

module.exports = function validateAddUser(data) {
    let errors = {};
    
    //Validation For Add New User

     //Check Empty FirstName...
     if (validator.isEmpty(data.firstname))
     {
         errors.firstname = "my_account.err.displayUsersFirstname";
     }

      //Check Empty LastName...
      if (validator.isEmpty(data.lastname))
      {
          errors.lastname ="my_account.err.displayUsersLastname";
      }

       //Check Empty Email...
       if (validator.isEmpty(data.email))
       {
           errors.email = "my_account.err.displayUsersEmail";
       } else if (!validator.isEmail(data.email)) 
       {
        errors.email = "sitesetting.form.error.isvalidemailaddress";
       }

       //Check Empty Password...
       if (validator.isEmpty(data.password))
       {
           errors.password = "my_account.err.displayUsersPassword";
       }

        //Check Empty confirmPassword...
        if (validator.isEmpty(data.confirmpassword))
        {
            errors.confirmpassword = "my_account.err.displayUsersConfirmPassword";
        }
        else if(!validator.equals(data.password, data.confirmpassword)) 
        {
            errors.confirmpassword = "my_account.err.displayUsersPasswordMatch";
        }
    

         //Check Empty MobileNo...
       if (validator.isEmpty(data.mobileno))
       {
           errors.mobileno = "my_account.err.displayUsersMobileNumber";
       }

        //Check Select Exchange...
        if (validator.isEmpty(data.exchange))
        {
            errors.exchange = "my_account.err.displayUsersExchange";
        }

        //Check Select profile...
        if (validator.isEmpty(data.profile))
        {
            errors.profile = "my_account.err.displayUsersProfile";
        }

        //Check Select role...
        if (validator.isEmpty(data.role))
        {
            errors.role = "my_account.err.displayUsersRole";
        }
        //Check Select status...
        if (validator.isEmpty(data.status))
        {
            errors.status = "my_account.err.displayUsersStatus";
        }
   
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};