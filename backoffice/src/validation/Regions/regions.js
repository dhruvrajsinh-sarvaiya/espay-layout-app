import validator from 'validator';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateRegionFromInput(data) {
  let errors = {};
  let localeerror = false;

  Object.keys(data.locale).forEach((lg, index) => {
    errors[lg]={};

    // if( !(data.locale[lg].title) || typeof (data.locale[lg].title) == 'undefined' || (data.locale[lg].title) == "" || data.locale[lg].title.length == 0 || validator.isEmpty(data.locale[lg].title.trim()+'' )) {
    //   errors[lg].title = 'region.regionform.error.title';
    //   localeerror=true;
    // } 

    if( !(data.locale[lg].content) || typeof (data.locale[lg].content) == 'undefined' || (data.locale[lg].content) == "" || data.locale[lg].content.length == 0 || validator.isEmpty(data.locale[lg].content.trim()+'' )) {
      errors[lg].content = 'region.regionform.error.content';
      localeerror=true;
    }

    if(!localeerror)
    {
      delete  errors[lg];
    }
  });

  if( !(data.regionname) || typeof (data.regionname) == 'undefined' || (data.regionname) == "" || data.regionname.length == 0 || validator.isEmpty(data.regionname.trim()+'' )) {
    errors.regionname = 'region.regionform.error.name'; 
  } 
  else if( typeof (data.regionname) !== 'undefined' && (data.regionname) !== "" && data.regionname.length > 30) { // Added By Megha Kariya (15/02/2019)
    errors.regionname = 'region.regionform.error.nameLimit'; 
  }
  if (!validator.isEmpty(data.regionname)){
    if (isScriptTag(data.regionname)) {
        errors.regionname= "my_account.err.scriptTag";
      localeerror=true;
    }
    else if (isHtmlTag(data.regionname)) {
        errors.regionname= "my_account.err.htmlTag";
      localeerror=true;
    }
  }

  if( !data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status+'')) {
    errors.type = 'cmspage.pageform.error.status';
  } 
  else if (!validator.isInt(data.status+'', { min: 0, max: 1 })) {
    errors.type = 'cmspage.pageform.error.statusNum';
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};
