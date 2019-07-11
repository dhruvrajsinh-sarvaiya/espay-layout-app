import validator from 'validator';

module.exports = function validateEditCustomer(data) {
    let errors = {};
    
    //Validation For Add New User

     //Check Empty FirstName...
     if (validator.isEmpty(data.firstname))
     {
         errors.firstname = "my_account.err.displayCustomersFirstname";
     }

      //Check Empty LastName...
      if (validator.isEmpty(data.lastname))
      {
          errors.lastname ="my_account.err.displayCustomersLastname";
      }

       //Check Empty Email...
       if (validator.isEmpty(data.email))
       {
           errors.email = "my_account.err.displayCustomersEmail";
       } else if (!validator.isEmail(data.email)) 
       {
        errors.email = "sitesetting.form.error.isvalidemailaddress";
       }

           //Check Empty PhoneNo...
           if (validator.isEmpty(data.phoneno))
           {
               errors.phoneno = "my_account.err.displayCustomersPhoneNumber";
           }

        //Check Empty Email...
        if (validator.isEmpty(data.country))
        {
            errors.country = "my_account.err.displayCustomersContry";
        }

       //Check Empty Password...
       if (validator.isEmpty(data.password))
       {
           errors.password = "my_account.err.displayCustomersPassword";
       }

        //Check Empty confirmPassword...
        if (validator.isEmpty(data.confirmpassword))
        {
            errors.confirmpassword = "my_account.err.displayCustomersConfirmPassword";
        }
        else if(!validator.equals(data.password, data.confirmpassword)) 
        {
            errors.confirmpassword = "my_account.err.displayCustomersPasswordMatch";
        }

        //Check Select Exchange...
        if (validator.isEmpty(data.exchange))
        {
            errors.exchange = "my_account.err.displayCustomersExchange";
        }

        //Check Select profile...
        if (validator.isEmpty(data.usertype))
        {
            errors.usertype = "my_account.err.displayCustomersUserType";
        }

          //Check Select TFA...
          if (validator.isEmpty(data.tfa))
          {
              errors.tfa = "my_account.err.displayCustomerstfa";
          }

            //Check Select documents...
        if (validator.isEmpty(data.documents))
        {
            errors.documents = "my_account.err.displayCustomersdocuments";
        }

          //Check Select googleauth...
          if (validator.isEmpty(data.googleauth))
          {
              errors.googleauth = "my_account.err.displayCustomersgoogleauth";
          }

            //Check Select smsauth...
        if (validator.isEmpty(data.smsauth))
        {
            errors.smsauth = "my_account.err.displayCustomerssmsauth";
        }

          //Check Select antipishing...
          if (validator.isEmpty(data.antipishing))
          {
              errors.antipishing = "my_account.err.displayCustomersantipishing";
          }

            //Check Select whitelist...
        if (validator.isEmpty(data.whitelist))
        {
            errors.whitelist = "my_account.err.displayCustomerswhitelist";
        }

           //Check Select accountstatus...
           if (validator.isEmpty(data.accountstatus))
           {
               errors.accountstatus = "my_account.err.displayCustomersaccountstatus";
           }
   
       
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};