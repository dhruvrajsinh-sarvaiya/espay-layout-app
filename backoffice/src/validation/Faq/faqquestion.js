import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateFaqQuestionInput(data) {
  let errors = {};
  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {
    
    errors[lg]={};

    if( !(data.locale[lg].question) || typeof (data.locale[lg].question) ==='undefined' || (data.locale[lg].question) ==="" || data.locale[lg].question.length == 0 || validator.isEmpty(data.locale[lg].question.trim()+'' )) {
      errors[lg].question = 'faq.questionform.error.question';
      localeerror=true;
    } 
    if (!validator.isEmpty(data.locale[lg].question)){
      if (isScriptTag(data.locale[lg].question)) {
        errors[lg].question= "my_account.err.scriptTag";
        localeerror=true;
      }
      else if (isHtmlTag(data.locale[lg].question)) {
        errors[lg].question= "my_account.err.htmlTag";
        localeerror=true;
      }
    }
    else if ((data.locale[lg].question) && typeof (data.locale[lg].question) !== 'undefined' && (data.locale[lg].question) !== "" && data.locale[lg].question.length > 150) {  // Added By Megha Kariya (14/02/2019)
      errors[lg].question = 'faq.questionform.error.questionCharLimit';
      localeerror=true;
    }

    if( !(data.locale[lg].answer) || typeof (data.locale[lg].answer) ==='undefined' || (data.locale[lg].answer) ==="" || data.locale[lg].answer.length == 0 || validator.isEmpty(data.locale[lg].answer.trim()+'' )) {
      errors[lg].answer = 'faq.questionform.error.answer';
      localeerror=true;
    } 
    if (!validator.isEmpty(data.locale[lg].answer)) {
      
      if (isScriptTag(data.locale[lg].answer)) {
        errors[lg].answer= "my_account.err.scriptTag";
        localeerror=true;
      }
      else if (isHtmlTag(data.locale[lg].answer)) {
        errors[lg].answer= "my_account.err.htmlTag";
        localeerror=true;
      }
    }
    if(!localeerror)
    {
      delete  errors[lg];
    }
  });

  if (typeof(data.category_id) !== 'undefined' && validator.isEmpty(data.category_id)) {
    errors.category = 'faq.questionform.error.category';
  }
  // else if(typeof(data.category_id) != 'undefined' && !validator.isNumeric(data.category_id) || parseInt(data.category_id) == 0) {
  //   errors.mobile = "faq.questionform.error.validcategory";
  // }

  
  if (typeof(data.sort_order) != 'undefined' && validator.isEmpty(data.sort_order)) {
    errors.sort_order = 'faq.questionform.error.sort_order';
  }
  else if(typeof(data.sort_order) !=='undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/))
  {
    errors.sort_order = 'faq.questionform.error.sortorderNumber';
  }


  if( !data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status+'')) {
    errors.status = 'faq.questionform.error.status';
  } 
  else if (!validator.isInt(data.status+'', { min: 0, max: 1 })) {
    errors.status = 'faq.questionform.error.statusNum';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
