const validator = require('validator');

exports.validateRegionFormInput = function (data) {
  let errors = {};
  if (typeof data == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.locale == 'undefined') {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    let localeerror = false;
    // TO DO: Trim Apply Remaining
    Object.keys(data.locale).forEach((lg, index) => {

      errors[lg] = {};

      if (!(data.locale[lg].content) || typeof (data.locale[lg].content) == 'undefined' || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim() + '')) {
        errors[lg].content = 'region.regionform.error.content';
        localeerror = true;
      }
      if (!localeerror) {
        delete errors[lg];
      }
    });

    if (!(data.regionname) || typeof (data.regionname) == 'undefined' || (data.regionname) == "" || data.regionname.length == 0 || validator.isEmpty(data.regionname.trim() + '')) {
      errors.regionname = 'region.regionform.error.name';
    }

    if (!data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
      errors.type = 'cmspage.pageform.error.status';
    }
    else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.type = 'cmspage.pageform.error.statusNum';
    }

  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

// Validation for Get Region By ID  Require to validate regionId
exports.validateGetRegionByIdInput = function (data) {
  let errors = {};

  if (!data.regionId || data.regionId == undefined || data.regionId == "" || data.regionId.length == 0) {
    errors.message = 'region.regionform.editregion_reqregionid';
  } else if (validator.isEmpty(data.regionId + '')) {
    errors.message = 'region.regionform.editregion_reqregionid';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
