import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateFaqCategoryInput(data) {
  let errors = {};
 
  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {
     errors[lg]={};

    // if (typeof (data.locale[lg].category_name) != 'undefined' && validator.isEmpty((data.locale[lg].category_name).trim())) {
    //   errors[lg] = {category_name:'faq.categoryform.error.category_name'};
    //   localeerror=true;
    // }
    if( !(data.locale[lg].category_name) || typeof (data.locale[lg].category_name) == 'undefined' || (data.locale[lg].category_name) === "" || data.locale[lg].category_name.length == 0 || validator.isEmpty(data.locale[lg].category_name+'' )) {
      errors[lg] = {category_name:'faq.categoryform.error.category_name'};
      localeerror=true;
    } 
    if (!validator.isEmpty(data.locale[lg].category_name)){
      if (isScriptTag(data.locale[lg].category_name)) {
         errors[lg].category_name= "my_account.err.scriptTag";
        localeerror=true;
      }
      else if (isHtmlTag(data.locale[lg].category_name)) {
         errors[lg].category_name= "my_account.err.htmlTag";
        localeerror=true;
      }
    }
    // else if (!validator.isAlpha(validator.blacklist(data.locale[lg].category_name, ' ')+'')) {
    //   errors[lg] = {category_name:'faq.categoryform.error.categoryNameChar'};
    //   localeerror=true;
    // } 
    else if (!validator.isLength(data.locale[lg].category_name+'', { min: 2, max: 50 })) {  // Changed By Megha Kariya (14/02/2019)
      errors[lg] = {category_name:'faq.categoryform.error.categoryNameCharLimit'};
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
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
