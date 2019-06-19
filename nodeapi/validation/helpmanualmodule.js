const validator = require('validator');

exports.validateHelpManualModuleInput = function (data) {
    let errors = {};
    if (typeof data == 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }
    else if (typeof data.locale == 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }
    else {
        let localeerror = false;

        Object.keys(data.locale).forEach((lg, index) => {

            errors[lg] = {};

            if (!(data.locale[lg].module_name) || typeof (data.locale[lg].module_name) == 'undefined' || (data.locale[lg].module_name) == "" || data.locale[lg].module_name.length == 0 || validator.isEmpty(data.locale[lg].module_name + '')) {
                errors[lg].module_name = 'helpmanualform.error.module_name';
                localeerror = true;
            }
            else if (!validator.isLength(data.locale[lg].module_name + '', { min: 2, max: 100 })) {
                errors[lg].module_name = '"helpmanualform.error.modulenameCharLimit';
                localeerror = true;
            }

            if (!(data.locale[lg].description) || typeof (data.locale[lg].description) == 'undefined' || (data.locale[lg].description) == "" || data.locale[lg].description.length == 0 || validator.isEmpty(data.locale[lg].description + '')) {
                errors[lg].description = 'helpmanualform.error.description';
                localeerror = true;
            }
            else if (!validator.isLength(data.locale[lg].description + '', { min: 2, max: 300 })) {
                errors[lg].description = 'helpmanualform.error.descriptionCharLimit';
                localeerror = true;
            }

            if (!localeerror) {
                delete errors[lg];
            }
        });

        if (validator.isEmpty(data.sort_order)) {
            errors.sort_order = 'faq.categoryform.error.sort_order';
        }
        else if (typeof (data.sort_order) != 'undefined' && (!validator.isNumeric(data.sort_order) || data.sort_order < 0) || data.sort_order.length > 2 || data.sort_order.match(/^[-+]?[0-9]+\.[0-9]+$/)) {
            errors.sort_order = 'faq.categoryform.error.sortorderNumber';
        }

        if (!data.status || typeof data.status == 'undefined' || data.status == "" || data.status.length == 0 || validator.isEmpty(data.status + '')) {
            errors.status = 'faq.categoryform.error.status';
        } else if (!validator.isInt(data.status + '', { min: 0, max: 1 })) {
            errors.status = 'faq.categoryform.error.statusNum';
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };
};


// Validation for Get Help Manual By ID  Require to validate moduleId
exports.validateHelpManualModuleByIdInput = function (data) {
    let errors = {};

    if (!data.moduleId || typeof data.moduleId == 'undefined' || data.moduleId == "" || data.moduleId.length == 0) {
        errors.message = 'common.api.invalidrequest';
    } else if (validator.isEmpty(data.moduleId + '')) {
        errors.message = 'common.api.invalidrequest';
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };
};

// Validation for Delete Help Module Require to validate moduleId
exports.validateDeleteHelpModuleInput = function (data) {
    let errors = {};

    if (!data.moduleId || typeof data.moduleId == 'undefined' || data.moduleId == "" || data.moduleId.length == 0) {
        errors.message = 'common.api.invalidrequest';
    } else if (validator.isEmpty(data.moduleId + '')) {
        errors.message = 'common.api.invalidrequest';
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? true : false
    };
};