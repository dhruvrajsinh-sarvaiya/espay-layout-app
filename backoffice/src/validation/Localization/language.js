// Added by Jayesh Pathak 26-10-2018 for adding language module - start
import { isScriptTag,isHtmlTag, } from 'Helpers/helpers';
const Validator = require('validator');
const isEmpty = require('../is-empty');

exports.validateAddLanguageInput = function(data) {

  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

	  if( !data.language_name || typeof data.language_name == 'undefined' || data.language_name == "" || data.language_name.length == 0 || Validator.isEmpty(data.language_name+'' )) {
		errors.language_name = 'languages.languageform.error.language_nameReq';
	  } else if (!Validator.isAlpha(Validator.blacklist(data.language_name, ' ')+'')) {
		errors.language_name = 'languages.languageform.error.language_nameChar';
		} else if (!Validator.isLength(data.language_name+'', { min: 2, max: 50 })) { // Changed by Megha Kariya (14/02/2019)
		errors.language_name = 'languages.languageform.error.language_nameCharLimit';
		}
		else if (isScriptTag(data.language_name)) {
			errors.language_name  = "my_account.err.scriptTag";
		}else if (isHtmlTag(data.language_name)) {
			errors.language_name  = "my_account.err.htmlTag";
		}
		
	  
	  if( !data.code || typeof data.code == 'undefined' || data.code == "" || data.code.length == 0 || Validator.isEmpty(data.code+'')) {
		errors.code = 'languages.languageform.error.codeReq';
	  } else if (!Validator.isAlpha(data.code+'')) {
		errors.code = 'languages.languageform.error.language_nameChar';
	  } else if (!Validator.isLength(data.code+'', { min: 2, max: 2 })) {
		errors.code = 'languages.languageform.error.codeCharLimit';
	  }
		else if (isScriptTag(data.code+'')) {
			errors.code = "my_account.err.scriptTag";
		}else if (isHtmlTag(data.code+'')) {
			errors.code = "my_account.err.htmlTag";
		}

	  if( !data.locale || typeof data.locale == 'undefined' || data.locale == "" || data.locale.length == 0 || Validator.isEmpty(data.locale+'' )) {
		errors.locale = 'languages.languageform.error.localeReq';
	  } else if (!Validator.isAlphanumeric(Validator.blacklist(data.locale, '\\ \\,\\-')+'')) {
		errors.locale = 'languages.languageform.error.localeChar';
	  } else if (!Validator.isLength(data.locale+'', { min: 2, max: 255 })) {
		errors.locale = 'languages.languageform.error.localeCharLimit';
	  }
		else if (isScriptTag(data.locale+'')) {
			errors.locale = "my_account.err.scriptTag";
		}else if (isHtmlTag(data.locale+'')) {
			errors.locale = "my_account.err.htmlTag";
		}
	  if( !data.sort_order || typeof data.sort_order == 'undefined' || data.sort_order == "" || data.sort_order.length == 0 || Validator.isEmpty(data.sort_order+'')) {
		errors.sort_order = 'languages.languageform.error.sort_orderReq';
	  } else if (!Validator.isInt(data.sort_order+'', { min: 1 })) {
		errors.sort_order = 'languages.languageform.error.sort_orderNum';
	  }
	  
	  if( !data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || Validator.isEmpty(data.status+'')) {
		errors.status = 'languages.languageform.error.statusReq';
	  } else if (!Validator.isInt(data.status+'', { min: 0, max: 1 })) {
		errors.status = 'languages.languageform.error.statusNum';
		}
		
		if(typeof data.rtlLayout == 'undefined' || data.rtlLayout == "") {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutReq';
		} else if (data.rtlLayout != 'true' && data.rtlLayout != 'false') {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutInvalid';
		}
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};


exports.validateGetLanguageByIdInput = function(data) {
 
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {
	  
	  if( !data.id || typeof data.id == 'undefined' || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id+'')) {
		errors.id = 'languages.languageform.error.idReq';
	  } else if (!Validator.isInt(data.id+'', { min: 1 })) {
		errors.id = 'languages.languageform.error.idNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

exports.validateUpdateLanguageInput = function(data) {
  
  let errors = {};
  
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

	  if( !data.language_name || typeof data.language_name == 'undefined' || data.language_name == "" || data.language_name.length == 0 || Validator.isEmpty(data.language_name+'')) {
		errors.language_name = 'languages.languageform.error.language_nameReq';
	  } else if (!Validator.isAlpha(Validator.blacklist(data.language_name, ' ')+'')) {
		errors.language_name = 'languages.languageform.error.language_nameChar';
	  } else if (!Validator.isLength(data.language_name+'', { min: 2, max: 50 })) { // Changed by Megha Kariya (14/02/2019)
		errors.language_name = 'languages.languageform.error.language_nameCharLimit';
	  }
	  

	  if( !data.code || typeof data.code == 'undefined' || data.code == "" || data.code.length == 0 || Validator.isEmpty(data.code+'')) {
		errors.code = 'languages.languageform.error.codeReq';
	  } else if (!Validator.isAlpha(data.code+'')) {
		errors.code = 'languages.languageform.error.language_nameChar';
	  } else if (!Validator.isLength(data.code+'', { min: 2, max: 2 })) {
		errors.code = 'languages.languageform.error.codeCharLimit';
	  }
	  
	  if( !data.locale || typeof data.locale == 'undefined' || data.locale == "" || data.locale.length == 0 || Validator.isEmpty(data.locale+'' )) {
		errors.locale = 'languages.languageform.error.localeReq';
	  } else if (!Validator.isAlphanumeric(Validator.blacklist(data.locale, '\\ \\,\\-')+'')) {
		errors.locale = 'languages.languageform.error.localeChar';
	  } else if (!Validator.isLength(data.locale+'', { min: 2, max: 255 })) {
		errors.locale = 'languages.languageform.error.localeCharLimit';
	  }
	  
	  if( !data.sort_order || typeof data.sort_order == 'undefined' || data.sort_order == "" || data.sort_order.length == 0 || Validator.isEmpty(data.sort_order+'')) {
		errors.sort_order = 'languages.languageform.error.sort_orderReq';
	  } else if (!Validator.isInt(data.sort_order+'', { min: 1 })) {
		errors.sort_order = 'languages.languageform.error.sort_orderNum';
	  }

	  if(typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status+'')) {
		errors.status = 'languages.languageform.error.statusReq';
	  } else if (!Validator.isInt(data.status+'', { min: 0, max: 1 })) {
		errors.status = 'languages.languageform.error.statusNum';  
	  }

	  if( !data.id || typeof data.id == 'undefined' || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id+'')) {
		errors.id = 'languages.languageform.error.idReq';
	  } else if (!Validator.isInt(data.id+'', { min: 1 })) {
		errors.id = 'languages.languageform.error.idNum';
	  }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

/* exports.validateDeleteLanguageInput = function(data) {
 
 let errors = {};
  
  if( !data.id || typeof data.id == 'undefined' || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id+'')) {
    errors.id = 'languages.languageform.error.idReq';
  } else if (!Validator.isInt(data.id+'', { min: 1 })) {
    errors.id = 'languages.languageform.error.idNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
}; */
// Added by Jayesh Pathak 26-10-2018 for adding language module - end