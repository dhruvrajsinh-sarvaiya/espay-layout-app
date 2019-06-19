/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : Push Message validation file
 */
import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateSendMessageInput(data) {
  let errors = {};
   
  if (typeof (data.userList)=== 'undefined'  || (typeof (data.userList)!== 'undefined' && validator.isEmpty(data.userList+''))) {
    errors.userList = 'pushMessage.form.error.userList';
  } else if((typeof(data.userList) !== 'undefined' && !validator.isNumeric(data.userList+'')) || (data.userList !== '1' && data.userList !== '0'))
  {
    errors.userList = 'pushMessage.form.error.invalidUserList';
  }

  if (data.userList === '0' && (typeof (data.mobileNoList)=== 'undefined'  || (typeof(data.mobileNoList) !== 'undefined' && (validator.isEmpty(data.mobileNoList+'') || data.mobileNoList === null)))) {
    errors.selectedUser = 'pushMessage.form.error.selectedUser';
  }
  else if(data.userList === '0' && (typeof(data.mobileNoList) !== 'undefined' && (data.mobileNoList.length < 1 || data.mobileNoList.length > 100)))
  {
    errors.selectedUser = 'pushMessage.form.error.invalidUsers';
  }

  if (typeof (data.smsText)=== 'undefined'  || (typeof(data.smsText) !== 'undefined' && validator.isEmpty(data.smsText+''))) {
    errors.smsText = 'pushMessage.form.error.smsText';
  }
  else if(typeof(data.smsText) !== 'undefined' && (!validator.matches(data.smsText,/^[A-Z a-z0-9 _ \/ , \. - \n \!\@\#\%\*$%^&()~`\[\]{};':<>?|]+$/)))
  {
    errors.smsText = 'pushMessage.form.error.invalidSmsText';
  } 
  // else if(typeof(data.smsText) !== 'undefined' && (!/^[A-Z a-z0-9 _ \/ , \. - \n \!\@\#\%\*$%^&()~`\[\]{};':<>?|]+$/.test(data.smsText)))
  // {
  //   errors.smsText = 'pushMessage.form.error.invalidSmsText';
  // }

  else if(typeof(data.smsText) !== 'undefined' && (data.smsText.length < 5 || data.smsText.length > 200))
  {
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
