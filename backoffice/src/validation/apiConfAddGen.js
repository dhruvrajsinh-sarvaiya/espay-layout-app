/**
 * Code for use tio validate request for add and update api conf. request
 * Added By devang parekh
 * i have used validator module for checking validation
 */

import validator from "validator";

module.exports = function validateApiConfAddGenRequest(data) {

  let errors = {};
  //Check Required Field...
  if (validator.isEmpty(data.currency)) {
    errors.currency = "sidebar.apiConfAddGen.errors.currency";
  }

  if(validator.isEmpty(data.apiType)) {
    errors.apiType = "sidebar.apiConfAddGen.errors.apiType";
  }

  if (validator.isEmpty(data.apiProvider)) {
    errors.apiProvider = "sidebar.apiConfAddGen.errors.apiProvider";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "sidebar.apiConfAddGen.errors.status";
  }

  // if (validator.isEmpty(data.callback)) {
  //   errors.callback = "sidebar.apiConfAddGen.errors.callback";
  // }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };
  
};
