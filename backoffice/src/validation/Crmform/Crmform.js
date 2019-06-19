// Added by Jayesh Pathak 27-12-2018 for adding CRM Form module - start
const Validator = require('validator');
//const isEmpty = require('./is-empty');

exports.validateAddCRMInput = function(data) {
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

    if( !(data.firstName) || typeof (data.firstName) == 'undefined' || (data.firstName) == "" || data.firstName.length == 0 || Validator.isEmpty(data.firstName+'' )) {
      errors.firstName = 'zohocrm.form.error.firstName';
    } 
    else if( (data.firstName) && typeof (data.firstName) !== 'undefined' && (data.firstName) !== "" && data.firstName.length > 30) { // Added By Megha Kariya (15/02/2019)
      errors.firstName = 'zohocrm.form.error.firstNameLength';
    } 
    else if( (data.firstName) && typeof (data.firstName) !== 'undefined' && (data.firstName) !== "" && !Validator.isAlpha(data.firstName+'')) { // Added By Megha Kariya (26/02/2019)
      errors.firstName = 'zohocrm.form.error.firstNameOnlyAlpha';
    } 

    if( !(data.lastName) || typeof (data.lastName) == 'undefined' || (data.lastName) == "" || data.lastName.length == 0 || Validator.isEmpty(data.lastName+'' )) {
      errors.lastName = 'zohocrm.form.error.lastName';
    } 
    else if( (data.lastName) && typeof (data.lastName) !== 'undefined' && (data.lastName) !== "" && data.lastName.length > 30) { // Added By Megha Kariya (15/02/2019)
      errors.lastName = 'zohocrm.form.error.lastNameLength';
    } 
    else if( (data.lastName) && typeof (data.lastName) !== 'undefined' && (data.lastName) !== "" && !Validator.isAlpha(data.lastName+'')) { // Added By Megha Kariya (26/02/2019)
      errors.lastName = 'zohocrm.form.error.lastNameOnlyAlpha';
    } 

    if( !(data.company) || typeof (data.company) == 'undefined' || (data.company) == "" || data.company.length == 0 || Validator.isEmpty(data.company+'' )) {
      errors.company = 'zohocrm.form.error.company';
    } 
    else if( (data.company) && typeof (data.company) !== 'undefined' && (data.company) !== "" && data.company.length > 100) { // Added By Megha Kariya (15/02/2019)
      errors.company = 'zohocrm.form.error.companyLength';
    } 

    if( !(data.phone) || typeof (data.phone) == 'undefined' || (data.phone) == "" || data.phone.length == 0 || Validator.isEmpty(data.phone+'' )) {
      errors.phone = 'zohocrm.form.error.phone';
    } 
    else if( (data.phone) && typeof (data.phone) !== 'undefined' && (data.phone) !== "" && data.phone.length > 15) { // Added By Megha Kariya (15/02/2019)
      errors.phone = 'zohocrm.form.error.phoneLength';
    } 
    else if( (data.phone) && typeof (data.phone) !== 'undefined' && (data.phone) !== "" && !Validator.isNumeric(data.phone+'')) { // Added By Megha Kariya (26/02/2019)
      errors.phone = 'zohocrm.form.error.phoneOnlyNumber';
    } 

    if( !(data.description) || typeof (data.description) == 'undefined' || (data.description) == "" || data.description.length == 0 || Validator.isEmpty(data.description+'' )) {
      errors.description = 'zohocrm.form.error.description';
    } 
    else if( (data.description) && typeof (data.description) !== 'undefined' && (data.description) !== "" && data.description.length > 200) { // Added By Megha Kariya (15/02/2019)
      errors.description = 'zohocrm.form.error.descriptionLength';
    }
      
  }
			
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

// Added by Jayesh Pathak 27-12-2018 for adding CRM Form module - end