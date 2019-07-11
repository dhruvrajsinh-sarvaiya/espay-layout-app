import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateCmsPageInput(data) {
  let errors = {};

  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {
    errors[lg] = {};

    if ((data.locale[lg].title) === undefined || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
      errors[lg].title = 'cmspage.pageform.error.title';
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
    } else if ((data.locale[lg].title) && (data.locale[lg].title) !== undefined && (data.locale[lg].title) !== "" && data.locale[lg].title.length > 30) {  // Added By Megha Kariya (14/02/2019)
      errors[lg].title = 'cmspage.pageform.error.titleLength';
      localeerror = true;
    }

    if ((data.locale[lg].content) === undefined || (data.locale[lg].content) === "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
      errors[lg].content = 'cmspage.pageform.error.content';
      localeerror = true;
    }

    if ((data.locale[lg].meta_title) === undefined || (data.locale[lg].meta_title) === "" || data.locale[lg].meta_title.length == 0 || validator.isEmpty(data.locale[lg].meta_title.trim() + '')) {
      errors[lg].metatitle = 'cmspage.pageform.error.metatitle';
      localeerror = true;
    }

    if (!validator.isEmpty(data.locale[lg].meta_title)) {
      if (isScriptTag(data.locale[lg].meta_title)) {
        errors[lg].metatitle = "my_account.err.scriptTag";
        localeerror = true;
      } else if (isHtmlTag(data.locale[lg].meta_title)) {
        errors[lg].metatitle = "my_account.err.htmlTag";
        localeerror = true;
      }
    }

    if (!validator.isEmpty(data.locale[lg].meta_keyword)) {
      if (isScriptTag(data.locale[lg].meta_keyword)) {
        errors[lg].meta_keyword = "my_account.err.scriptTag";
        localeerror = true;
      } else if (isHtmlTag(data.locale[lg].meta_keyword)) {
        errors[lg].meta_keyword = "my_account.err.htmlTag";
        localeerror = true;
      }
    } else if ((data.locale[lg].meta_title) && (data.locale[lg].meta_title) !== undefined && (data.locale[lg].meta_title) !== "" && data.locale[lg].meta_title.length > 60) {  // Added By Megha Kariya (14/02/2019)
      errors[lg].metatitle = 'cmspage.pageform.error.metatitleLength';
      localeerror = true;
    }

    // Added By Megha Kariya (14/02/2019)
    if ((data.locale[lg].meta_description) && (data.locale[lg].meta_description) !== undefined && (data.locale[lg].meta_description) !== "" && data.locale[lg].meta_description.length > 160) {
      errors[lg].meta_description = 'cmspage.pageform.error.metadescriptionLength';
      localeerror = true;
    }

    if (!validator.isEmpty(data.locale[lg].meta_description)) {
      if (isScriptTag(data.locale[lg].meta_description)) {
        errors[lg].meta_description = "my_account.err.scriptTag";
        localeerror = true;
      } else if (isHtmlTag(data.locale[lg].meta_description)) {
        errors[lg].meta_description = "my_account.err.htmlTag";
        localeerror = true;
      }
    }

    if (!localeerror) {
      delete errors[lg];
    }
  });

  if ((data.route) === undefined || validator.isEmpty(data.route.trim() + '')) {
    errors.route = 'cmspage.pageform.error.route';
  }

  if (!validator.isEmpty(data.route)) {
    if (isScriptTag(data.route)) {
      errors.route = "my_account.err.scriptTag";
    } else if (isHtmlTag(data.route)) {
      errors.route = "my_account.err.htmlTag";
    }
  }

  if ((data.sort_order) !== undefined && validator.isEmpty(data.sort_order)) {
    errors.sort_order = 'cmspage.pageform.error.sort_order';
  } else if (typeof (data.sort_order) != 'undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
    errors.sort_order = 'cmspage.pageform.error.sortorderNumber';
  }

  if (data.status === undefined || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
    errors.status = 'cmspage.pageform.error.status';
  } else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
    errors.status = 'cmspage.pageform.error.statusNum';
  }

  if (data.page_type === undefined || data.page_type == "" || data.page_type.length == 0 || validator.isEmpty(data.page_type + '')) {
    errors.page_type = 'cmspage.pageform.error.pagetype';
  } else if (!validator.isInt(data.page_type + '', { min: 1, max: 2 })) {
    errors.page_type = 'cmspage.pageform.error.pagetypeNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
