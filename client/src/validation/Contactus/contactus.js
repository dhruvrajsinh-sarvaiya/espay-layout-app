// Added by Jayesh Pathak 29-10-2018 for adding country module - start
const Validator = require('validator');
const isEmpty = require('../is-empty');

exports.validateAddContactUsInput = function(data) {
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {
  
	  if( !data.email || typeof data.email == 'undefined' || data.email == "" || data.email.length == 0 || Validator.isEmpty(data.email+'')) {
		errors.email = 'contactus.contactform.error.emailReq';
	  } else if (!Validator.isEmail(data.email+'')) {
		errors.email = 'contactus.contactform.error.emailProper';
	  } 
	  
	  if( !data.subject || typeof data.subject == 'undefined' || data.subject == "" || data.subject.length == 0 || Validator.isEmpty(data.subject.trim()+'')) {
		errors.subject = 'contactus.contactform.error.subjectReq';
	  } else if (!Validator.isAlphanumeric(Validator.blacklist(data.subject, '\\ \\,\\-')+'')) {
		errors.subject = 'contactus.contactform.error.subjectChar';
	  } else if (!Validator.isLength(data.subject+'', { min: 2, max: 100 })) {
		errors.subject = 'contactus.contactform.error.subjectCharLimit';
	  }
	  
	  if( !data.description || typeof data.description == 'undefined' || data.description == "" || data.description.length == 0 || Validator.isEmpty(data.description.trim()+'')) {
		errors.description = 'contactus.contactform.error.descriptionReq';
	  } else if (!Validator.isAlphanumeric(Validator.blacklist(data.description, '\\ \\,\\-')+'')) {
		errors.description = 'contactus.contactform.error.descriptionChar';
	  } else if (!Validator.isLength(data.description+'', { min: 10, max: 300 })) {
		errors.description = 'contactus.contactform.error.descriptionCharLimit';
	  }
	  
	  
	  /* if(typeof data.attachedFile!=undefined && data.attachedFile!=null && data.attachedFile !='')
	  {
		if(typeof data.attachedFile.type!='undefined' && data.attachedFile.type != 'image/jpeg' && data.attachedFile.type != 'image/jpg' && data.attachedFile.type != 'image/png' && data.attachedFile.type != 'image/gif' && data.attachedFile.type != 'application/pdf')
		{
		  errors.attachedFile= 'contactus.contactform.error.validateattachedFile';
		} 
		else if(typeof data.attachedFile.size!='undefined' && data.attachedFile.size > 1048576)
		{
		  errors.attachedFile= 'contactus.contactform.error.fileMaxSize';
		}
	  } */
	  
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

// Added by Jayesh Pathak 29-10-2018 for adding country module - end