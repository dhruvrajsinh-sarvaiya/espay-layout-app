// Added by Jayesh Pathak 09-10-2018 for adding state module - start 
const Validator = require('validator');
//const isEmpty = require('../is-empty');

exports.validateAddStateInput = function(data) {
  
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

		let localeerror = false;

		Object.keys(data.locale).forEach((lg, index) => {
			localeerror = false; // Added By Megha Kariya (26/02/2019)
			errors[lg]={};
			
			if( !(data.locale[lg]) || typeof (data.locale[lg]) == 'undefined' || (data.locale[lg]) == "" || data.locale[lg].length == 0 || Validator.isEmpty(data.locale[lg]+'' )) {
				errors[lg] = 'states.stateform.error.stateNameReq';
				localeerror=true;
			} 
		
			else if (!Validator.isLength(data.locale[lg]+'', { min: 2, max: 50 })) { // Change By Megha Kariya (27/02/2019) : set max length as 50 instead of 100
				errors[lg] = 'states.stateform.error.stateNameCharLimit';
				localeerror=true;
			}
			 else if(typeof(data.locale[lg]) !== 'undefined' && (!Validator.matches(data.locale[lg]),/^[A-Z a-z -]+$/)) // Added By Megha Kariya (27/02/2019)
			 {
			 	errors[lg] = 'states.stateform.error.invalidStateName';
			 	localeerror=true;
			 }			

			// else if(typeof(data.locale[lg]) !== 'undefined' && (!/^[A-Z a-z -]+$/.test(data.locale[lg]))) // Added By Megha Kariya (27/02/2019)
			// {
			// 	errors[lg] = 'states.stateform.error.invalidStateName';
			// 	localeerror=true;
			// }

			if(!localeerror)
			{
				delete errors[lg];
			}
  	});
  
	  if( !data.stateCode || typeof data.stateCode == 'undefined' || data.stateCode == "" || data.stateCode.length == 0 || Validator.isEmpty(data.stateCode+'')) {
		errors.stateCode = 'states.stateform.error.stateCodeReq';
	  } else if (!Validator.isAlpha(data.stateCode+'')) {
		errors.stateCode = 'states.stateform.error.stateCodeChar';
	  } else if (!Validator.isLength(data.stateCode+'', { min: 2, max: 2 })) {
		errors.stateCode = 'states.stateform.error.stateCodeCharLimit';
	  }

	  if( !data.countryId || typeof data.countryId == 'undefined' || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId+'')) {
		errors.countryId = 'states.stateform.error.countryIdReq';
	  } else if (!Validator.isInt(data.countryId+'', { min: 1 })) {
		errors.countryId = 'states.stateform.error.countryIdNum';
	  }
	  
	  if(typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status+'')) {
		errors.status = 'states.stateform.error.statusReq';
	  } else if (!Validator.isInt(data.status+'', { min: 0, max: 1 })) {
		errors.status = 'states.stateform.error.statusNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};


exports.validateGetStateByIdInput = function(data) {
  
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {
 
	  if( !data.stateId || typeof data.stateId == 'undefined' || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId+'')) {
		errors.stateId = 'states.stateform.error.stateIdReq';
	  } else if (!Validator.isInt(data.stateId+'', { min: 1 })) {
		errors.stateId = 'states.stateform.error.stateIdNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

exports.validateGetStateBycountryIdInput = function(data) {
  
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

	  if( !data.countryId || typeof data.countryId == 'undefined' || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId+'')) {
		errors.countryId = 'states.stateform.error.countryIdReq';
	  } else if (!Validator.isInt(data.countryId+'', { min: 1 })) {
		errors.countryId = 'states.stateform.error.countryIdNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

exports.validateUpdateStateInput = function(data) {
  
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

		let localeerror = false;

		Object.keys(data.locale).forEach((lg, index) => {
			localeerror = false; // Added By Megha Kariya (26/02/2019)
			errors[lg]={};
			
			if( !(data.locale[lg]) || typeof (data.locale[lg]) == 'undefined' || (data.locale[lg]) == "" || data.locale[lg].length == 0 || Validator.isEmpty(data.locale[lg]+'' )) {
				errors[lg] = 'states.stateform.error.stateNameReq';
				localeerror=true;
			} 
		
			else if (!Validator.isLength(data.locale[lg]+'', { min: 2, max: 50 })) { // Change By Megha Kariya (27/02/2019) : set max length as 50 instead of 100
				errors[lg] = 'states.stateform.error.stateNameCharLimit';
				localeerror=true;
			}
			else if(typeof(data.locale[lg]) !== 'undefined' && (!Validator.matches(data.locale[lg]),/^[A-Z a-z -]+$/)) // Added By Megha Kariya (27/02/2019)
			 {
			 	errors[lg] = 'states.stateform.error.invalidStateName';
			 	localeerror=true;
			 }			
			// else if(typeof(data.locale[lg]) !== 'undefined' && (!/^[A-Z a-z -]+$/.test(data.locale[lg]))) // Added By Megha Kariya (27/02/2019)
			// {
			// 	errors[lg] = 'states.stateform.error.invalidStateName';
			// 	localeerror=true;
			// }

			if(!localeerror)
			{
				delete errors[lg];
			}
		});
		
		

	  if( !data.stateId || typeof data.stateId == 'undefined' || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId+'')) {
		errors.stateId = 'states.stateform.error.stateIdReq';
	  } else if (!Validator.isInt(data.stateId+'', { min: 1 })) {
		errors.stateId = 'states.stateform.error.stateIdNum';
	  }

	  if( !data.stateCode || typeof data.stateCode == 'undefined' || data.stateCode == "" || data.stateCode.length == 0 || Validator.isEmpty(data.stateCode+'')) {
		errors.stateCode = 'states.stateform.error.stateCodeReq';
	  } else if (!Validator.isAlpha(data.stateCode+'')) {
		errors.stateCode = 'states.stateform.error.stateCodeChar';
	  } else if (!Validator.isLength(data.stateCode+'', { min: 2, max: 2 })) {
		errors.stateCode = 'states.stateform.error.stateCodeCharLimit';
	  }

	  if( !data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 ) {
		errors.status = 'states.stateform.error.statusReq';
	  } else if (Validator.isEmpty(data.status+'')) {
		errors.status = 'states.stateform.error.statusReq';
	  } else if (!Validator.isInt(data.status+'', { min: 0, max: 1 })) {
		errors.status = 'states.stateform.error.statusNum';
	  }

	  if( !data.countryId || typeof data.countryId == 'undefined' || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId+'')) {
		errors.countryId = 'states.stateform.error.countryIdReq';
	  } else if (!Validator.isInt(data.countryId+'', { min: 1 })) {
		errors.countryId = 'states.stateform.error.countryIdNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

// Added by Jayesh Pathak 09-10-2018 for adding state module - end 