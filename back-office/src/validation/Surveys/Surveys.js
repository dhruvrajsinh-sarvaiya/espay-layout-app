// Added by Jayesh Pathak 17-12-2018 for adding servey module - start
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
const Validator = require('validator');
//const isEmpty = require('./is-empty');

exports.validateAddSurveyInput = function (data) {
  let errors = {};

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else if (data.locale === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    let localeerror = false;

    Object.keys(data.locale).forEach((lg, index) => {

      errors[lg] = {};

      if ((data.locale[lg].surveyName) === undefined || !(data.locale[lg].surveyName) || (data.locale[lg].surveyName) == "" || data.locale[lg].surveyName.length == 0 || Validator.isEmpty(data.locale[lg].surveyName + '')) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameReq' };
        localeerror = true;
      }
      else if (!Validator.isLength(data.locale[lg].surveyName + '', { min: 2, max: 100 })) {
        errors[lg] = { surveyName: 'surveys.surveyform.error.surveyNameLimit' };
        localeerror = true;
      }
      if (!validator.isEmpty(data.locale[lg].surveyName + '')) {
        if (isScriptTag(data.locale[lg].surveyName + '')) {
          errors[lg].surveyName = "my_account.err.scriptTag";
          localeerror = true;
        }
        else if (isHtmlTag(data.locale[lg].surveyName + '')) {
          errors[lg].surveyName = "my_account.err.htmlTag";
          localeerror = true;
        }
      }
      if (!localeerror) {
        delete errors[lg];
      }
    });


    if (data.surveyJson === undefined || !data.surveyJson || data.surveyJson == "" || data.surveyJson.length == 0) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
    } else if (!Validator.isLength(data.surveyJson + '', { min: 2 })) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsonLimit';
    } else if (data.surveyJson !== undefined) {
      let innerdata = JSON.parse(data.surveyJson);
      if (innerdata.pages[0].elements === undefined) {
        errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
      }
    }

    if (data.category_id === undefined || data.category_id.length == 0 || Validator.isEmpty(data.category_id + '')) {
      errors.category_id = 'surveys.surveyform.error.categoryIdReq';
    } else if (!Validator.isInt(data.status + '', { min: 0 })) {
      errors.category_id = 'surveys.surveyform.error.categoryIdNum';
    }

    if (data.status === undefined || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
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

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    if (data.surveyId === undefined || !data.surveyId || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
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

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    if (data.surveyId === undefined || !data.surveyId || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
      errors.surveyId = 'surveys.surveyform.error.surveyIdReq';
    }

    if (data.userId === undefined || !data.userId || data.userId == "" || data.userId.length == 0 || Validator.isEmpty(data.userId + '')) {
      errors.userId = 'surveys.surveyform.error.userIdReq';
    }

  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };

};

exports.validateUpdateSurveyInput = function (data) {

  let errors = {};

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else if (data.locale === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {

    let localeerror = false;

    Object.keys(data.locale).forEach((lg, index) => {

      errors[lg] = {};

      if ((data.locale[lg].surveyName) === undefined || !(data.locale[lg].surveyName) || (data.locale[lg].surveyName) == "" || data.locale[lg].surveyName.length == 0 || Validator.isEmpty(data.locale[lg].surveyName + '')) {
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

    if (data.surveyJson === undefined || !data.surveyJson || data.surveyJson == "" || data.surveyJson.length == 0 || Validator.isEmpty(data.surveyJson.trim() + '')) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
    } else if (data.surveyJson !== undefined) {
      let innerdata = JSON.parse(data.surveyJson);
      if (innerdata.pages[0].elements === undefined) {
        errors.surveyJson = 'surveys.surveyform.error.surveyJsoneReq';
      }
    } else if (!Validator.isLength(data.surveyJson + '', { min: 2 })) {
      errors.surveyJson = 'surveys.surveyform.error.surveyJsonLimit';
    }

    if (data.category_id === undefined || data.category_id.length == 0 || Validator.isEmpty(data.category_id + '')) {
      errors.category_id = 'surveys.surveyform.error.categoryIdReq';
    } else if (!Validator.isInt(data.status + '', { min: 0 })) {
      errors.category_id = 'surveys.surveyform.error.categoryIdNum';
    }

    if (data.status === undefined || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
      errors.status = 'surveys.surveyform.error.statusReq';
    } else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'surveys.surveyform.error.statusNum';
    }

    if (data.surveyId === undefined || !data.surveyId || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
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
  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else if (data.surveyId === undefined || data.surveyId == "" || data.surveyId.length == 0 || Validator.isEmpty(data.surveyId + '')) {
    errors.message = 'surveys.surveyform.error.surveyIdReq';
  }

  else if (data.userId === undefined || data.userId == "" || data.userId.length == 0 || Validator.isEmpty(data.userId + '')) {
    errors.message = 'surveys.surveyform.error.userIdReq';
  }
  else if (data.answerjson === undefined || data.answerjson == "") {
    errors.message = 'surveys.surveyform.error.answerjsonReq';
  }
  else if (!Validator.isLength(data.answerjson + '', { min: 2 })) {
    errors.message = 'surveys.surveyform.error.answerjsonCharLimit';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };

};

// Added by Jayesh Pathak 17-12-2018 for adding servey module - end