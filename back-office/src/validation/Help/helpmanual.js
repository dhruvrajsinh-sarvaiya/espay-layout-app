import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
module.exports = function validateHelpManualInput(data) {
  let errors = {};
  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {

    errors[lg] = {};

    if (!(data.locale[lg].title) || (data.locale[lg].title) === undefined || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
      errors[lg].title = 'helpmanualform.error.title';
      localeerror = true;
    }
    if (!validator.isEmpty(data.locale[lg].title)) {
      if (isScriptTag(data.locale[lg].title)) {
        errors[lg].title = "my_account.err.scriptTag";
        localeerror = true;
      }
      else if (isHtmlTag(data.locale[lg].title)) {
        errors[lg].title = "my_account.err.htmlTag";
        localeerror = true;
      }
    }
    else if ((data.locale[lg].title) !== undefined && (data.locale[lg].title) !== "" && data.locale[lg].title.length > 150) { // Added By Megha Kariya (15/02/2019)
      errors[lg].title = 'helpmanualform.error.titleLimit';
      localeerror = true;
    }

    if (!(data.locale[lg].content) || (data.locale[lg].content) === undefined || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
      errors[lg].content = 'helpmanualform.error.content';
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

  if ((data.module_id) !== undefined && validator.isEmpty(data.module_id)) {
    errors.module = 'helpmanualform.error.helpmodule';
  }


  if ((data.sort_order) !== undefined && validator.isEmpty(data.sort_order)) {
    errors.sort_order = 'faq.questionform.error.sort_order';
  }
  else if ((data.sort_order) !== undefined && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
    errors.sort_order = 'faq.questionform.error.sortorderNumber';
  }


  if (data.status === undefined || !data.status || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
    errors.status = 'faq.questionform.error.status';
  }
  else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
    errors.status = 'faq.questionform.error.statusNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
