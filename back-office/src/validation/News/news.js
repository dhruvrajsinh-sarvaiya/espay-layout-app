import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateNewsInput(data) {
  let errors = {};
  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {

    errors[lg] = {};

    if ((data.locale[lg].title) === undefined || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
      errors[lg].title = 'news.form.error.title';
      localeerror = true;
    }

    if (!validator.isEmpty(data.locale[lg].title)) {
      if (isScriptTag(data.locale[lg].title)) {
        errors[lg].title = "my_account.err.scriptTag";
        localeerror = true;
      } else if (isHtmlTag(data.locale[lg].title)) {
        errors[lg].title = "my_account.err.htmlTag";
        localeerror = true;
      }
    } else if ((data.locale[lg].title) && (data.locale[lg].title) !== undefined && (data.locale[lg].title) !== "" && data.locale[lg].title.length > 200) { // Added By Megha Kariya (14/02/2019)
      errors[lg].title = 'news.form.error.titleLimit';
      localeerror = true;
    }

    if ((data.locale[lg].content) === undefined || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
      errors[lg].content = 'news.form.error.content';
      localeerror = true;
    }

    if (!validator.isEmpty(data.locale[lg].content)) {
      if (isScriptTag(data.locale[lg].content)) {
        errors[lg].content = "my_account.err.scriptTag";
        localeerror = true;
      }
    }
    if (!localeerror) {
      delete errors[lg];
    }
  });

  if (data.type === undefined || data.type == "" || data.type.length == 0 || validator.isEmpty(data.type + '')) {
    errors.type = 'news.form.error.type';
  }
  else if (!validator.isInt(data.type + '', { min: 1, max: 2 })) {
    errors.type = 'news.form.error.typeNum';
  }

  if ((data.sort_order) !== undefined && validator.isEmpty(data.sort_order)) {
    errors.sort_order = 'news.form.error.sort_order';
  } else if ((data.sort_order) !== undefined && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
    errors.sort_order = 'news.form.error.sortorderNumber';
  }

  if ((data.to_date) !== undefined && (validator.isEmpty(data.to_date) || data.to_date == "")) {
    errors.todate = 'news.form.error.todate';
  } else if (data.to_date < new Date().toISOString().slice(0, 10)) {  //Added by Meghaben 29-01-2019
    errors.todate = "news.form.error.tocurrentdate";
  }

  if ((data.from_date) !== undefined && (validator.isEmpty(data.from_date) || data.from_date == "")) {
    errors.fromdate = 'news.form.error.fromdate';
  } else if (data.from_date < new Date().toISOString().slice(0, 10)) {  //Added by Meghaben 29-01-2019
    errors.fromdate = "news.form.error.fromcurrentdate";
  } else if (data.to_date < data.from_date) {
    errors.fromdate = "news.form.error.datediff";
  }

  if (data.status === undefined || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
    errors.status = 'news.form.error.status';
  } else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
    errors.status = 'news.form.error.statusNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
