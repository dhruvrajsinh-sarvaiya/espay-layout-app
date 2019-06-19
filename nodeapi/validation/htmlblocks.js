/**
 * Create Sanjay
 * Created Date  27-05-2019
 * Validation File For HTML Blocks
 */

const validator = require('validator');
const isEmpty = require('./is-empty');

exports.validateHTMLBlocksInput = function (data) {
  let errors = {};

  if (validator.isEmpty(data.name.toString())) {
    errors.name = 'Name field is required';
  }

  if (validator.isEmpty((data.status).toString())) {
    errors.status = 'Status field is required';
  }

  if (validator.isEmpty(data.content.toString())) {
    errors.content = 'Content field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

// Validation for Get HTMLBlock By ID  Require to validate HTMLBlockid
exports.validateGetHTMLBlockByIdInput = function (data) {
  let errors = {};

  if (!data.htmlblockid || data.htmlblockid == undefined || data.htmlblockid == "" || data.htmlblockid.length == 0) {
    errors.message = 'HTMLBlock ID field is required';
  } else if (validator.isEmpty(data.htmlblockid + '')) {
    errors.message = 'HTMLBlock ID field is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};