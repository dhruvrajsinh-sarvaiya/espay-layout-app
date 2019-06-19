const validator = require('validator');

exports.validateFaqQuestionInput = function (data) {
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

      if (!(data.locale[lg].question) || typeof (data.locale[lg].question) == 'undefined' || (data.locale[lg].question) == "" || data.locale[lg].question.length == 0 || validator.isEmpty(data.locale[lg].question.trim() + '')) {
        errors[lg].question = 'faq.questionform.error.question';
        localeerror = true;
      }

      if (!(data.locale[lg].answer) || typeof (data.locale[lg].answer) == 'undefined' || (data.locale[lg].answer) == "" || data.locale[lg].answer.length == 0 || validator.isEmpty(data.locale[lg].answer.trim() + '')) {
        errors[lg].answer = 'faq.questionform.error.answer';
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (typeof (data.category_id) != 'undefined' && validator.isEmpty(data.category_id)) {
      errors.category = 'faq.questionform.error.category';
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


// Validation for Get Faq Question By ID  Require to validate faqquestionId
exports.validateGetFaqQuestionByIdInput = function (data) {
  let errors = {};

  if (!data.faqquestionId || data.faqquestionId == undefined || data.faqquestionId == "" || data.faqquestionId.length == 0) {
    errors.message = 'faq.questionform.error.questionidrequired';
  } else if (validator.isEmpty(data.faqquestionId + '')) {
    errors.message = 'faq.questionform.error.questionidrequired';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Delete Faq Question  Require to validate faqquestionId
exports.validateDeleteFaqQuestionInput = function (data) {
  let errors = {};

  if (!data.faqquestionId || data.faqquestionId == undefined || data.faqquestionId == "" || data.faqquestionId.length == 0) {
    errors.message = 'faq.questionform.error.questionidrequired';
  } else if (validator.isEmpty(data.faqquestionId + '')) {
    errors.message = 'faq.questionform.error.questionidrequired';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};