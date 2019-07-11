/* 
    Created By : Megha Kariya
    Date : 20-02-2019
    Description : CMS Request Format API Validation file
*/
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
import validator from 'validator';

module.exports = function validateRequestFormatApiInput(data) {
  let errors = {};

  if (data.RequestName === "" || data.RequestName == null) {
    errors.RequestName = "sidebar.requestformatapi.list.lable.enter.reqname";
  }
  if (!validator.isEmpty(data.RequestName)) {
    if (isScriptTag(data.RequestName)) {
      errors.RequestName = "my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.RequestName)) {
      errors.RequestName = "my_account.err.htmlTag";
    }
  } else if (data.ContentType === "" || data.ContentType == null) {
    errors.ContentType = "sidebar.requestformatapi.list.lable.enter.contype";
  } else if (data.MethodType === "" || data.MethodType == null) {
    errors.MethodType = "sidebar.requestformatapi.list.lable.enter.methtype";
  } else if (data.RequestFormat === "" || data.RequestFormat == null) {
    errors.RequestFormat = "sidebar.requestformatapi.list.lable.enter.reqformat";
  } else if (!validator.isEmpty(data.RequestFormat)) {
    if (isScriptTag(data.RequestFormat)) {
      errors.RequestFormat = "my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.RequestFormat)) {
      errors.RequestFormat = "my_account.err.htmlTag";
    }
  }
  else if (data.Status === "" || data.Status == null) {
    errors.Status = "sidebar.requestformatapi.list.lable.enter.status";
  } else if (data.RequestType === "" || data.RequestType == null) {
    errors.RequestType = "sidebar.requestformatapi.list.lable.enter.RequestType";
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
