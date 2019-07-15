const validator = require('validator');
const XssFilter = require('./htmlsanitize'); //Added By Bharat Jograna on 19 Jun 2019

exports.validateCmsPageInput = function (data) {
  let errors = {};
  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else if (data.locale === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    let localeerror = false;
    // TO DO: Trim Apply Remaining
    Object.keys(data.locale).forEach((lg, index) => {

      errors[lg] = {};

      if ((data.locale[lg].title) === undefined || !(data.locale[lg].title) || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim() + '')) {
        errors[lg].title = 'cmspage.pageform.error.title';
        localeerror = true;
      }

      if ((data.locale[lg].content) === undefined || !(data.locale[lg].content) || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
        errors[lg].content = 'cmspage.pageform.error.content';
        localeerror = true;
      }
      // Added by Bharat Jograna dt:19 Jun 2019
      else {
        data.locale[lg].content = XssFilter.validateXssSanitizeHtml(data.locale[lg].content);
      }
      //End Bharat Jograna code....

      if ((data.locale[lg].meta_title) === undefined || !(data.locale[lg].meta_title) || (data.locale[lg].meta_title) == "" || data.locale[lg].meta_title.length == 0 || validator.isEmpty(data.locale[lg].meta_title.trim() + '')) {
        errors[lg].metatitle = 'cmspage.pageform.error.metatitle';
        localeerror = true;
      }

      if (!localeerror) {
        delete errors[lg];
      }
    });

    if ((data.route) === undefined || validator.isEmpty(data.route.trim() + '')) {
      errors.route = 'cmspage.pageform.error.route';
    }

    if ((data.sort_order) !== undefined && validator.isEmpty(data.sort_order)) {
      errors.sort_order = 'cmspage.pageform.error.sort_order';
    }
    else if ((data.sort_order) !== undefined && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
      errors.sort_order = 'cmspage.pageform.error.sortorderNumber';
    }

    if (data.status === undefined || !data.status || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
      errors.status = 'cmspage.pageform.error.status';
    }
    else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'cmspage.pageform.error.statusNum';
    }

    if (data.page_type === undefined || !data.page_type || data.page_type == "" || data.page_type.length == 0 || validator.isEmpty(data.page_type + '')) {
      errors.page_type = 'cmspage.pageform.error.pagetype';
    }
    else if (!validator.isInt(data.page_type + '', { min: 1, max: 2 })) {
      errors.page_type = 'cmspage.pageform.error.pagetypeNum';
    }

  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Get Page By ID  Require to validate Pageid
exports.validateGetPageByIdInput = function (data) {
  let errors = {};

  if (data.pageId == undefined || !data.pageId || data.pageId == "" || data.pageId.length == 0 || validator.isEmpty(data.pageId + '')) {
    errors.message = 'cmspage.pageform.editpage_reqpageid';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
