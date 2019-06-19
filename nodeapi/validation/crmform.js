// Added by Jayesh Pathak 27-12-2018 for adding CRM Form module - start
const Validator = require('validator');

exports.validateAddCRMInput = function (data) {
  let errors = {};

  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    if (!(data.firstName) || typeof (data.firstName) == 'undefined' || (data.firstName) == "" || data.firstName.length == 0 || Validator.isEmpty(data.firstName + '')) {
      errors.firstName = 'zohocrm.form.error.firstName';
    }

    if (!(data.lastName) || typeof (data.lastName) == 'undefined' || (data.lastName) == "" || data.lastName.length == 0 || Validator.isEmpty(data.lastName + '')) {
      errors.lastName = 'zohocrm.form.error.lastName';
    }

    if (!(data.company) || typeof (data.company) == 'undefined' || (data.company) == "" || data.company.length == 0 || Validator.isEmpty(data.company + '')) {
      errors.company = 'zohocrm.form.error.company';
    }

    if (!(data.phone) || typeof (data.phone) == 'undefined' || (data.phone) == "" || data.phone.length == 0 || Validator.isEmpty(data.phone + '')) {
      errors.phone = 'zohocrm.form.error.phone';
    }

    if (!(data.description) || typeof (data.description) == 'undefined' || (data.description) == "" || data.description.length == 0 || Validator.isEmpty(data.description + '')) {
      errors.description = 'zohocrm.form.error.description';
    }

  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };

};

// Added by Jayesh Pathak 27-12-2018 for adding CRM Form module - end