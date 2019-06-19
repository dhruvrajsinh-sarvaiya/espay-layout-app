// Added by Kushal parekh 22-12-2018 for adding servey module - start
import validator from 'validator';
exports.validateAddSurveyResultInput = function(data) {
 
  let errors = {};
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }

  else if(typeof data.surveyId == 'undefined' || data.surveyId == "" || data.surveyId.length == 0 || validator.isEmpty(data.surveyId+'')) {
    errors.message = 'surveys.surveyform.error.surveyIdReq';
  } 

  else if(typeof data.userId == 'undefined' || data.userId == "" || data.userId.length == 0 || validator.isEmpty(data.userId+'')) {
    errors.message = 'surveys.surveyform.error.userIdReq';
  }

  else if(typeof data.answerjson == 'undefined' || data.answerjson == "" || typeof data.answerjson !== "object" || Object.keys(data.answerjson).length === 0) {
    errors.message = 'surveys.surveyform.error.answerjsonReq';
  }

  else if (!validator.isLength(data.answerjson+'', { min: 2 })) {
    errors.message = 'surveys.surveyform.error.answerjsonReq';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};

// Added by Jayesh Pathak 17-12-2018 for adding servey module - end