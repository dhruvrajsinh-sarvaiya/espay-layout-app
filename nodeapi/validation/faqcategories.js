const validator = require('validator');

exports.validateFaqCategoryInput = function (data) {
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

      if (!(data.locale[lg].category_name) || typeof (data.locale[lg].category_name) == 'undefined' || (data.locale[lg].category_name) == "" || data.locale[lg].category_name.length == 0 || validator.isEmpty(data.locale[lg].category_name + '')) {
        errors[lg] = { category_name: 'faq.categoryform.error.category_name' };
        localeerror = true;
      }
      else if (!validator.isLength(data.locale[lg].category_name + '', { min: 2, max: 100 })) {
        errors[lg] = { category_name: 'faq.categoryform.error.categoryNameCharLimit' };
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (validator.isEmpty(data.sort_order)) {
      errors.sort_order = 'faq.categoryform.error.sort_order';
    }
    else if (typeof (data.sort_order) != 'undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
      errors.sort_order = 'faq.categoryform.error.sortorderNumber';
    }

    if (!data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
      errors.status = 'faq.categoryform.error.status';
    } else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'faq.categoryform.error.statusNum';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};


// Validation for Get Faq category By ID  Require to validate faqcategoryId
exports.validateGetFaqcategoryByIdInput = function (data) {
  let errors = {};

  if (!data.faqcategoryId || data.faqcategoryId == undefined || data.faqcategoryId == "" || data.faqcategoryId.length == 0) {
    errors.message = 'Faq category ID field is required';
  } else if (validator.isEmpty(data.faqcategoryId + '')) {
    errors.message = 'Faq category ID field is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Delete Faq category  Require to validate faqcategoryId
exports.validateDeleteFaqCategoryInput = function (data) {
  let errors = {};

  if (!data.faqcategoryId || data.faqcategoryId == undefined || data.faqcategoryId == "" || data.faqcategoryId.length == 0) {
    errors.message = 'common.api.invalidrequest';
  } else if (validator.isEmpty(data.faqcategoryId + '')) {
    errors.message = 'common.api.invalidrequest';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};