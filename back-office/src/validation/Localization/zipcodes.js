// Added by dhara gajera 9/2/2019 for adding zipcodes module - start 
const Validator = require('validator');
//const isEmpty = require('../is-empty');

exports.validateAddZipcodesInput = function (data) {

  let errors = {};

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    //zip code 
    if (data.zipCode === undefined || data.zipCode == "" || data.zipCode.length == 0 || Validator.isEmpty(data.zipCode + '')) {
      errors.zipCode = 'zipCodes.zipcodeform.error.zipCodesReq';
    } else if (!Validator.isLength(data.zipCode + '', { min: 2, max: 30 })) {
      errors.zipCode = 'zipCodes.zipcodeform.error.zipCodesCharLimit';
    }
    //zip area
    if (data.zipAreaName === undefined || data.zipAreaName == "" || data.zipAreaName.length == 0 || Validator.isEmpty(data.zipAreaName + '')) {
      errors.zipAreaName = 'zipCodes.zipcodeform.error.zipCodesReq';
    } else if (!Validator.isLength(data.zipAreaName + '', { min: 2, max: 100 })) {
      errors.zipAreaName = 'zipCodes.zipcodeform.error.zipAreaNameCharLimit';
    }
    // city id
    if (data.cityId === undefined || data.cityId == "" || data.cityId.length == 0 || Validator.isEmpty(data.cityId + '')) {
      errors.cityId = 'zipCodes.zipcodeform.error.cityIdReq';
    } else if (!Validator.isInt(data.cityId + '', { min: 1 })) {
      errors.cityId = 'zipCodes.zipcodeform.error.cityIdNum';
    }
    //countryId
    if (data.countryId === undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
      errors.countryId = 'zipCodes.zipcodeform.error.countryIdReq';
    }
    //stateId
    if (data.stateId === undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
      errors.stateId = 'zipCodes.zipcodeform.error.stateIdReq';
    }
    if (data.status === undefined || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
      errors.status = 'states.stateform.error.statusReq';
    } else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'states.stateform.error.statusNum';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
//validate update input
exports.validateUpdateZipcodeInput = function (data) {

  let errors = {};

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    //zip code 
    if (data.zipcode === undefined || data.zipcode == "" || data.zipcode.length == 0 || Validator.isEmpty(data.zipcode + '')) {
      errors.zipcode = 'zipCodes.zipcodeform.error.zipCodesReq';
    } else if (!Validator.isLength(data.zipCode + '', { min: 2, max: 30 })) {
      errors.zipcode = 'zipCodes.zipcodeform.error.zipCodesCharLimit';
    }
    //zip area
    if (data.zipAreaName === undefined || data.zipAreaName == "" || data.zipAreaName.length == 0 || Validator.isEmpty(data.zipAreaName + '')) {
      errors.zipAreaName = 'zipCodes.zipcodeform.error.zipCodesReq';
    } else if (!Validator.isLength(data.zipAreaName + '', { min: 2, max: 100 })) {
      errors.zipAreaName = 'zipCodes.zipcodeform.error.zipAreaNameCharLimit';
    }
    // city id
    if (data.cityId === undefined || data.cityId == "" || data.cityId.length == 0 || Validator.isEmpty(data.cityId + '')) {
      errors.cityId = 'zipCodes.zipcodeform.error.cityIdReq';
    } else if (!Validator.isInt(data.cityId + '', { min: 1 })) {
      errors.cityId = 'zipCodes.zipcodeform.error.cityIdNum';
    }
    //countryId
    if (data.countryId === undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
      errors.countryId = 'zipCodes.zipcodeform.error.countryIdReq';
    }
    //stateId
    if (data.stateId === undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
      errors.stateId = 'zipCodes.zipcodeform.error.stateIdReq';
    }
    if (data.status === undefined || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
      errors.status = 'states.stateform.error.statusReq';
    } else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
      errors.status = 'states.stateform.error.statusNum';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};
//validate get zipcode by id input
exports.validateGetZipcodeByIdInput = function (data) {

  let errors = {};

  if (data === undefined) {
    errors.message = 'common.api.invalidrequest';
  }
  else {
    //zip code id 
    if (data.zipcodesId === undefined || data.zipcodesId == "" || data.zipcodesId.length == 0 || Validator.isEmpty(data.zipcodesId + '')) {
      errors.zipcodesId = 'zipCodes.zipcodeform.error.zipCodesReq';
    } else if (!Validator.isInt(data.zipcodesId + '', { min: 1 })) {
      errors.zipcodesId = 'zipCodes.zipcodeform.error.zipcodeLimit';
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
};

// Added by dhara gajera 9/2/2019 for adding zipcodes module - end 