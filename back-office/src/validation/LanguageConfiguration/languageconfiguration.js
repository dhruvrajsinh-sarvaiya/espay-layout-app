// Added by Kushal Parekh 13-12-2018 for adding language configuration module - start
const Validator = require('validator');

module.exports = function validateUpdateLanguageConfigInput(data) {

	let errors = {};

	let localeerror = false;

	Object.keys(data).forEach((lg, index) => {

		errors[lg] = {};

		if (typeof data[lg].status == 'undefined' || data[lg].status.length == 0 || Validator.isEmpty(data[lg].status + '')) {
			errors[lg].status = 'languages.languageform.error.statusReq';
			localeerror = true;
		} else if (!Validator.isInt(data[lg].status + '', { min: 0, max: 1 })) {
			errors[lg].status = 'languages.languageform.error.statusNum';
			localeerror = true;
		}

		if (typeof data[lg].isDefault == 'undefined' || data[lg].isDefault.length == 0 || Validator.isEmpty(data[lg].isDefault + '')) {
			errors[lg].isDefault = 'languages.languageform.error.isDefaultReq';
			localeerror = true;
		} else if (!Validator.isInt(data[lg].isDefault + '', { min: 0, max: 1 })) {
			errors[lg].isDefault = 'languages.languageform.error.isDefaultNum';
			localeerror = true;
		}

		if (!localeerror) {
			delete errors[lg];
		}
	});

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? true : false
	};
};