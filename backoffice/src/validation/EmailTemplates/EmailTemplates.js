//import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
const validator = require('validator');

exports.validateNewEmailTemplateformInput = function(data) {
  
  let errors = {};

  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {

    if(typeof data.AdditionalInfo == 'undefined' || data.AdditionalInfo == "" || data.AdditionalInfo.length == 0 || validator.isEmpty(''+data.AdditionalInfo)) {
        errors.AdditionalInfo = 'emailtemplate.form.error.subject';
    }
    if (isScriptTag(data.AdditionalInfo)) {
      errors.AdditionalInfo="my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.AdditionalInfo)) {
      errors.AdditionalInfo="my_account.err.htmlTag";
  }
    if(typeof data.templateName == 'undefined' || data.templateName == "" || data.templateName.length == 0 || validator.isEmpty(''+data.templateName)) {
        errors.templateName = 'emailtemplate.form.error.templateName';
    }
    if (isScriptTag(data.templateName )) {
      errors.templateName="my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.templateName )) {
      errors.templateName="my_account.err.htmlTag";
  }
    else if(typeof data.templateName !== 'undefined' && data.templateName !== "" && data.templateName.length > 30) { // Added By Megha Kariya (15/02/2019)
        errors.templateName = 'emailtemplate.form.error.templateNameLimit';
    }

    if(typeof data.CommServiceTypeID == 'undefined' || data.CommServiceTypeID == "" || data.CommServiceTypeID.length == 0 || validator.isEmpty(''+data.CommServiceTypeID)) {
        errors.CommServiceTypeID = 'emailtemplate.form.error.commServiceType';
    }
    
    if(typeof data.templateType == 'undefined' || data.templateType == "" || data.templateType.length == 0 || validator.isEmpty(''+data.templateType)) {
        errors.templateType = 'emailtemplate.form.error.templateType';
    }  

    if(typeof data.Content == 'undefined' || data.Content.length == 0 || data.Content == "" || validator.isEmpty(''+data.Content)) {
        errors.Content = 'emailtemplate.form.error.content';
    }
    if (isScriptTag(data.Content )) {
      errors.Content="my_account.err.scriptTag";
   }
   else if (isHtmlTag(data.Content )) {
      errors.Content="my_account.err.htmlTag";
 }
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};

exports.validateUpdateEmailTemplateformInput = function(data) {
  
    let errors = {};

    if (typeof data == 'undefined')
    {
      errors.message = 'common.api.invalidrequest';
    }
    else
    {
  
      if(typeof data.AdditionalInfo == 'undefined' || data.AdditionalInfo == "" || data.AdditionalInfo.length == 0 || validator.isEmpty(''+data.AdditionalInfo)) {
          errors.AdditionalInfo = 'emailtemplate.form.error.subject';
      }
      if (isScriptTag(data.AdditionalInfo)) {
        errors.AdditionalInfo="my_account.err.scriptTag";
      }
      else if (isHtmlTag(data.AdditionalInfo)) {
        errors.AdditionalInfo="my_account.err.htmlTag";
    }
      if(typeof data.TemplateName == 'undefined' || data.TemplateName == "" || data.TemplateName.length == 0 || validator.isEmpty(''+data.TemplateName)) {
          errors.templateName = 'emailtemplate.form.error.templateName';
      }
      else if(typeof data.TemplateName !== 'undefined' && data.TemplateName !== "" && data.TemplateName.length > 30) { // Added By Megha Kariya (15/02/2019)
            errors.templateName = 'emailtemplate.form.error.templateNameLimit';
      }
      if (isScriptTag(data.templateName )) {
        errors.templateName="my_account.err.scriptTag";
      }
      else if (isHtmlTag(data.templateName )) {
        errors.templateName="my_account.err.htmlTag";
    }
      if(typeof data.CommServiceTypeID == 'undefined' || data.CommServiceTypeID == "" || data.CommServiceTypeID.length == 0 || validator.isEmpty(''+data.CommServiceTypeID)) {
          errors.CommServiceTypeID = 'emailtemplate.form.error.commServiceType';
      }
  
      if(typeof data.Content == 'undefined' || data.Content.length == 0 || data.Content == "" || validator.isEmpty(''+data.Content)) {
          errors.Content = 'emailtemplate.form.error.content';
      }
      if (isScriptTag(data.Content )) {
         errors.Content="my_account.err.scriptTag";
      }
      else if (isHtmlTag(data.Content )) {
         errors.Content="my_account.err.htmlTag";
    }
      if(typeof data.TemplateID == 'undefined' || data.TemplateID == "" || data.TemplateID.length == 0 || validator.isEmpty(''+data.TemplateID)) {
          errors.templateType = 'emailtemplate.form.error.templateType';
      }

      if(typeof data.ID == 'undefined' || data.ID == "" || data.ID.length == 0 || validator.isEmpty(data.ID+'')) {
		errors.message = 'emailtemplate.form.error.templateId';
	  }

    }

    return {
      errors,
      isValid: Object.keys(errors).length > 0 ? true : false
    };
  };


  exports.validateUpdateEmailTemplateConfigformInput = function(data) {
  
    let errors = {};

    if (typeof data == 'undefined')
    {
      errors.message = 'common.api.invalidrequest';
    }
    else
    {
      if(typeof data.TemplateID == 'undefined' || data.TemplateID == "" || data.TemplateID.length == 0 || validator.isEmpty(''+data.TemplateID)) {
          errors.templateName = 'emailtemplate.form.error.templateNameSelectBox';
      }

      if(typeof data.TemplateType == 'undefined' || data.TemplateType == "" || data.TemplateType.length == 0 || validator.isEmpty(''+data.TemplateType)) {
          errors.templateType = 'emailtemplate.form.error.templateType';
      }

      if(typeof data.Status == 'undefined' || data.Status == "" || data.Status.length == 0 || validator.isEmpty(data.Status+'')) {
		  errors.IsOnOff = 'emailtemplate.form.error.IsOnOff';
	  }

    }

    return {
      errors,
      isValid: Object.keys(errors).length > 0 ? true : false
    };
  };
  