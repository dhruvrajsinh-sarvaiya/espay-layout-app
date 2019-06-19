import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateHelpModuleInput(data) {
  let errors = {};
 
  let localeerror = false;
  // console.log("data",data);
  Object.keys(data.locale).forEach((lg, index) => {
    
    errors[lg]={};
    
    if( !(data.locale[lg].module_name) || typeof (data.locale[lg].module_name) == 'undefined' || (data.locale[lg].module_name) == "" || data.locale[lg].module_name.length == 0 || validator.isEmpty(data.locale[lg].module_name+'' )) {
      errors[lg].module_name= 'helpmanualform.error.module_name';
      localeerror=true;
    } 
    //  else if (!validator.isAlpha(validator.blacklist(data.locale[lg].module_name, ' ')+'')) {
    //     errors[lg].module_name = 'helpmanualform.error.modulenameChar';
    //   localeerror=true;
    // } 
    else if (!validator.isLength(data.locale[lg].module_name+'', { min: 2, max: 100 })) {
      errors[lg].module_name ='helpmanualform.error.modulenameCharLimit'; // Changed By Megha Kariya (15/02/2019) : remove extra double quotes from error message
      localeerror=true;
    }
    if (!validator.isEmpty(data.locale[lg].module_name)){
      if (isScriptTag(data.locale[lg].module_name)) {
         errors[lg].module_name= "my_account.err.scriptTag";
        localeerror=true;
      }
      else if (isHtmlTag(data.locale[lg].module_name)) {
         errors[lg].module_name= "my_account.err.htmlTag";
        localeerror=true;
      }
    }
    if( !(data.locale[lg].description) || typeof (data.locale[lg].description) == 'undefined' || (data.locale[lg].description) == "" || data.locale[lg].description.length == 0 || validator.isEmpty(data.locale[lg].description+'' )) {
        errors[lg].description = 'helpmanualform.error.description';
        localeerror=true;
    } 
    if (!validator.isEmpty(data.locale[lg].description)){
      if (isScriptTag(data.locale[lg].description)) {
         errors[lg].description= "my_account.err.scriptTag";
        localeerror=true;
      }
      else if (isHtmlTag(data.locale[lg].description)) {
         errors[lg].description= "my_account.err.htmlTag";
        localeerror=true;
      }
    }
    //  else if (!validator.isAlpha(validator.blacklist(data.locale[lg].description, ' ')+'')) {
    //     errors[lg].description = 'helpmanualform.error.descriptionChar';
    //   localeerror=true;
    // } 
    else if (!validator.isLength(data.locale[lg].description+'', { min: 2, max: 200 })) { // Changed By Megha Kariya (15/02/2019)
        errors[lg].description = 'helpmanualform.error.descriptionCharLimit';
        localeerror=true;
    }

    if(!localeerror)
    {
      delete  errors[lg];
    }
  });
 
  if (validator.isEmpty(data.sort_order)) {
    errors.sort_order = 'faq.categoryform.error.sort_order';
  }
  else if(typeof(data.sort_order) != 'undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/))
  {
    errors.sort_order = 'faq.categoryform.error.sortorderNumber';
  }


  if( !data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status+'')) {
    errors.status = 'faq.categoryform.error.status';
  } 
  else if (!validator.isInt(data.status+'', { min: 0, max: 1 })) {
    errors.status = 'faq.categoryform.error.statusNum';
  }
  // console.log("errors",errors);
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};