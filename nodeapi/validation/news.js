const validator = require('validator');
const XssFilter = require('./htmlsanitize'); //Added By Bharat Jograna on 19 Jun 2019

exports.validateNewsInput = function (data) {
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

      if ((data.locale[lg].title) === undefined || !(data.locale[lg].title) || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
        errors[lg].title = 'news.form.error.title';
        localeerror = true;
      }

      if ((data.locale[lg].content) === undefined || !(data.locale[lg].content) || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
        errors[lg].content = 'news.form.error.content';
        localeerror = true;
      }
      // Added by Bharat Jograna dt:19 Jun 2019
      else {
        data.locale[lg].content = XssFilter.validateXssSanitizeHtml(data.locale[lg].content);
      }
      //End Bharat Jograna code....

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (data.type === undefined || !data.type || data.type == "" || data.type.length == 0 || validator.isEmpty(data.type + '')) {
      errors.status = 'news.form.error.type';
    }
    else if (!validator.isInt(data.type + '', { min: 1, max: 2 })) {
      errors.type = 'news.form.error.typeNum';
    }

    if ((data.sort_order) !== undefined && validator.isEmpty(data.sort_order)) {
      errors.sort_order = 'news.form.error.sort_order';
    }
    else if ((data.sort_order) !== undefined && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
      errors.sort_order = 'news.form.error.sortorderNumber';
    }

    if ((data.to_date) !== undefined && (validator.isEmpty(data.to_date) || data.to_date == "")) {
      errors.todate = 'news.form.error.todate';
    }

    if ((data.from_date) !== undefined && (validator.isEmpty(data.from_date) || data.from_date == "")) {
      errors.fromdate = 'news.form.error.fromdate';
    }

    if (data.status === undefined || !data.status || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
      errors.type = 'news.form.error.status';
    }
    else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.type = 'news.form.error.statusNum';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Get News By ID  Require to validate Newsid
exports.validateGetNewsByIdInput = function (data) {
  let errors = {};

  if (data.newsId == undefined || !data.newsId || data.newsId == "" || data.newsId.length == 0 || validator.isEmpty(data.newsId + '')) {
    errors.message = 'News ID field is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Delete News  Require to validate Newsid
exports.validateDeleteNewsInput = function (data) {
  let errors = {};

  if (data.newsId == undefined || !data.newsId || data.newsId == "" || data.newsId.length == 0 || validator.isEmpty(data.newsId + '')) {
    errors.message = 'News ID field is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};