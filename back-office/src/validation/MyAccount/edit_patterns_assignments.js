import validator from 'validator';

module.exports = function validateEditPatternsAssignments(data) {
    let errors = {};
    
    //Validation For Edit PatternsAssignments

     //Check Empty exchange...
     if (validator.isEmpty(data.exchange))
     {
         errors.exchange = "my_account.err.patternExchange";
     }

      //Check Empty membership...
      if (validator.isEmpty(data.membership))
      {
          errors.membership ="my_account.err.patternMembership";
      }

       //Check Empty feeslimits...
       if (validator.isEmpty(data.feeslimits))
       {
           errors.feeslimits = "my_account.err.patternFeeslimits";
       }

           //Check Empty referalpattern...
           if (validator.isEmpty(data.referalpattern))
           {
               errors.referalpattern = "my_account.err.referalPattern";
           }

        //Check Empty remark...
        if (validator.isEmpty(data.remark))
        {
            errors.remark = "my_account.err.patternremark";
        }
          
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};