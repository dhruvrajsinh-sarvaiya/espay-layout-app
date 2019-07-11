/*
* CreatedBy : Megha Kariya
* Date : 17-01-2019
* Comment : Push Message validation file
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateSendMessageInput(data) {
  let errors = {};

  if ((data.userList) === undefined || (validator.isEmpty(data.userList + ''))) {
    errors.userList = 'pushMessage.form.error.userList';
  } else if (((data.userList) !== undefined && !validator.isNumeric(data.userList + '')) || (data.userList !== '1' && data.userList !== '0')) {
    errors.userList = 'pushMessage.form.error.invalidUserList';
  }

  if ((data.mobileNoList) !== undefined && data.userList === '0' && (validator.isEmpty(data.mobileNoList + '') || data.mobileNoList === null)) {
    errors.selectedUser = 'pushMessage.form.error.selectedUser';
  } else if (((data.mobileNoList) !== undefined && data.userList === '0' && (data.mobileNoList.length < 1 || data.mobileNoList.length > 100))) {
    errors.selectedUser = 'pushMessage.form.error.invalidUsers';
  }

  if ((data.smsText) === undefined || (validator.isEmpty(data.smsText + ''))) {
    errors.smsText = 'pushMessage.form.error.smsText';
  } else if ((data.smsText) !== undefined && (!validator.matches(data.smsText, /^[a-zA-Z0-9~!@#$%^&*()`[\]{};':,.<>?| ]*$/))) {
    errors.smsText = 'pushMessage.form.error.invalidSmsText';
  } else if ((data.smsText) !== undefined && (data.smsText.length < 5 || data.smsText.length > 200)) {
    errors.smsText = 'pushMessage.form.error.lengthRangeSmsText';
  }

  if (!validator.isEmpty(data.smsText + '')) {
    if (isScriptTag(data.smsText + '')) {
      errors.smsText = "my_account.err.scriptTag";
    } else if (isHtmlTag(data.smsText + '')) {
      errors.smsText = "my_account.err.htmlTag";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};