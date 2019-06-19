const validator = require('validator');

exports.validateHelpManualInput = function (data) {
  let errors = {};
  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.locale == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    let localeerror = false;

    Object.keys(data.locale).forEach((lg, index) => {

      errors[lg] = {};

      if (!(data.locale[lg].title) || typeof (data.locale[lg].title) == 'undefined' || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
        errors[lg].title = 'helpmanualform.error.title';
        localeerror = true;
      }

      if (!(data.locale[lg].content) || typeof (data.locale[lg].content) == 'undefined' || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
        errors[lg].content = 'helpmanualform.error.content';
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (typeof (data.module_id) != 'undefined' && validator.isEmpty(data.module_id)) {
      errors.module = 'helpmanualform.error.helpmodule';
    }

    if (validator.isEmpty(data.sort_order)) {
      errors.sort_order = 'faq.questionform.error.sort_order';
    }

    if (typeof (data.sort_order) != 'undefined' && validator.isEmpty(data.sort_order)) {
      errors.sort_order = 'faq.questionform.error.sort_order';
    }
    else if (typeof (data.sort_order) != 'undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
      errors.sort_order = 'faq.questionform.error.sortorderNumber';
    }

    if (!data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
      errors.status = 'faq.questionform.error.status';
    }
    else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'faq.questionform.error.statusNum';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};


// Validation for Get Help Manual By ID  Require to validate helpmanualId
exports.validateGetHelpManualByIdInput = function (data) {
  let errors = {};

  if (!data.helpmanualId || data.helpmanualId == undefined || data.helpmanualId == "" || data.helpmanualId.length == 0) {
    errors.message = 'helpmanualform.error.helpmanualidrequired';
  } else if (validator.isEmpty(data.helpmanualId + '')) {
    errors.message = 'helpmanualform.error.helpmanualidrequired';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Delete Help Manual Require to validate helpmanualId
exports.validateDeleteHelpManualInput = function (data) {
  let errors = {};

  if (!data.helpmanualId || data.helpmanualId == undefined || data.helpmanualId == "" || data.helpmanualId.length == 0) {
    errors.message = 'helpmanualform.error.helpmanualidrequired';
  } else if (validator.isEmpty(data.helpmanualId + '')) {
    errors.message = 'helpmanualform.error.helpmanualidrequired';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Added Front side api calls validation by Jayesh 09-01-2019 
exports.validateGetHelpManualByModuleIdInput = function (data) {
  let errors = {};
  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    if (!data.moduleId || typeof data.moduleId == 'undefined' || data.moduleId == "" || data.moduleId.length == 0 || validator.isEmpty(data.moduleId + '')) {
      errors.moduleId = 'helpmanualform.error.helpmanualidrequired';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};