// Added by Jayesh Pathak 17-12-2018 for adding servey module - start
const Validator = require('validator');
const XssFilter = require('./htmlsanitize'); //Added By Bharat Jograna on 19 Jun 2019

exports.validateAddSurveyInput = function (data) {
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

      if (!(data.locale[lg].surveyName) || typeof (data.locale[lg].surveyName) == 'undefined' || (data.locale[lg].surveyName) == "" || data.locale[lg].surveyName.length == 0 || Validator.isEmpty(data.locale[lg].surveyName + '')) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameReq' };
        localeerror = true;
      }
      else if (!Validator.isLength(data.locale[lg].surveyName + '', { min: 2, max: 100 })) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameLimit' };
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (data.surveyJson == undefined || data.surveyJson == "" || data.surveyJson.length == 0) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
    } else if (!Validator.isLength(data.surveyJson + '', { min: 2 })) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsonLimit';
    } else if (typeof data.surveyJson != 'undefined') {
      let innerdata = JSON.parse(data.surveyJson);
      if (typeof innerdata.pages[0].elements == 'undefined') {
        errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
      }
    }
    // Added by Bharat Jograna dt:19 Jun 2019
    else {
      data.surveyJson = XssFilter.validateXssSanitizeHtml(data.surveyJson);
    }
    //End Bharat Jograna code....

    if (typeof data.category_id == 'undefined' || data.category_id.length == 0 || Validator.isEmpty(data.category_id + '')) {
      errors.category_id = 'surveys.surveyform.error.categoryIdReq';
    } else if (!Validator.isInt(data.status + '', { min: 0 })) {
      errors.category_id = 'surveys.surveyform.error.categoryIdNum';
    }

    if (typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
      errors.status = 'surveys.surveyform.error.statusReq';
    } else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'surveys.surveyform.error.statusNum';
    }

  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

exports.validateGetSurveyByIdInput = function (data) {

  let errors = {};

  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    if (data.surveyId == undefined || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
      errors.surveyId = 'surveys.surveyform.error.surveyIdReq';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

exports.validateGetSurveyResultsBySurveyIdInput = function (data) {

  let errors = {};

  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    if (data.surveyId == undefined || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
      errors.message = 'common.api.invalidrequest';
    }

    if (data.userId == undefined || data.userId == "" || data.userId.length == 0 || Validator.isEmpty(data.userId + '')) {
      errors.message = 'common.api.invalidrequest';
    }

  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

exports.validateUpdateSurveyInput = function (data) {

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

      if (!(data.locale[lg].surveyName) || typeof (data.locale[lg].surveyName) == 'undefined' || (data.locale[lg].surveyName) == "" || data.locale[lg].surveyName.length == 0 || Validator.isEmpty(data.locale[lg].surveyName + '')) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameReq' };
        localeerror = true;
      }
      else if (!Validator.isLength(data.locale[lg].surveyName + '', { min: 2, max: 100 })) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameLimit' };
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (data.surveyJson == undefined || data.surveyJson == "" || data.surveyJson.length == 0) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
    } else if (!Validator.isLength(data.surveyJson + '', { min: 2 })) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsonLimit';
    } else if (typeof data.surveyJson != 'undefined') {
      let innerdata = JSON.parse(data.surveyJson);
      if (typeof innerdata.pages[0].elements == 'undefined') {
        errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
      }
    }
    // Added by Bharat Jograna dt:19 Jun 2019
    else {
      data.surveyJson = XssFilter.validateXssSanitizeHtml(data.surveyJson);
    }
    //End Bharat Jograna code....

    if (typeof data.category_id == 'undefined' || data.category_id.length == 0 || Validator.isEmpty(data.category_id + '')) {
      errors.category_id = 'surveys.surveyform.error.categoryIdReq';
    } else if (!Validator.isInt(data.status + '', { min: 0 })) {
      errors.category_id = 'surveys.surveyform.error.categoryIdNum';
    }

    if (typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
      errors.status = 'surveys.surveyform.error.statusReq';
    } else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'surveys.surveyform.error.statusNum';
    }

    if (data.surveyId == undefined || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
      errors.surveyId = 'surveys.surveyform.error.surveyIdReq';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

exports.validateAddSurveyResultInput = function (data) {

  let errors = {};
  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.surveyId == 'undefined' || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
    errors.message = 'surveys.surveyform.error.surveyIdReq';
  }

  else if (typeof data.userId == 'undefined' || data.userId == "" || data.userId.length == 0 || Validator.isEmpty(data.userId + '')) {
    errors.message = 'surveys.surveyform.error.userIdReq';
  }

  else if (typeof data.answerjson == 'undefined' || data.answerjson == "" || typeof data.answerjson !== "object" || Object.keys(data.answerjson).length === 0) {
    errors.message = 'surveys.surveyform.error.answerjsonReq';
  }

  else if (!Validator.isLength(data.answerjson + '', { min: 2 })) {
    errors.message = 'surveys.surveyform.error.answerjsonReq';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

// Added by Jayesh Pathak 17-12-2018 for adding servey module - end