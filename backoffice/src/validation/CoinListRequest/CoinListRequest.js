// Added by  dhara gajera 4-1-2019 for coin list fields
const validator = require('validator');

module.exports = function validateCoinListFieldsformInput(data) {
  let errors = {};
  if (typeof data == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else if (typeof data.formfields == 'undefined')
  {
    errors.message = 'common.api.invalidrequest';
  }
  else
  {
       /*if(typeof data.id == 'undefined' || data.id =="" || data.id == null || validator.isEmpty(data.id+'')){
            errors.id = 'coinListField.error.id';
        } */

        data.formfields.forEach((info, index) => {
            /* if (validator.isEmpty(info.fieldname+'')) {
            errors.fieldname = 'coinListField.error.fieldname';
            } */

           if(typeof info.sortOrder+'' == 'undefined' || info.sortOrder+"" =="" || info.sortOrder+"" == null) {
                errors.message = 'coinListField.error.sortOrder';
            }else if(!validator.isNumeric(info.sortOrder+'')){
                errors.message = 'coinListField.error.sortOrderNumeric';
            }

            if(typeof info.status+"" == 'undefined' || info.status+"" =="" || info.status+"" == null && (info.status != 0 || info.status != 1 ) ) {
                errors.message = 'coinListField.error.status';
            } else if (!validator.isInt(info.status+'', { min: 0, max: 1 })) {
                errors.message = 'coinListField.error.statusNum';
            }
        });  
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? true : false
  };
};