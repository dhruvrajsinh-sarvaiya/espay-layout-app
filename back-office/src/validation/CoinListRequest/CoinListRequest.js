// Added by  dhara gajera 4-1-2019 for coin list fields
const validator = require('validator');

module.exports = function validateCoinListFieldsformInput(data) {
	let errors = {};
	if (data === undefined) {
		errors.message = 'common.api.invalidrequest';
	} else if (data.formfields === undefined) {
		errors.message = 'common.api.invalidrequest';
	} else {
		data.formfields.forEach((info) => {
			if (info.sortOrder === undefined || info.sortOrder === null || info.sortOrder + "" == "") {
				errors.message = 'coinListField.error.sortOrder';
			} else if (!validator.isNumeric(info.sortOrder + '')) {
				errors.message = 'coinListField.error.sortOrderNumeric';
			}

			if (info.status === undefined || info.status === null || info.status + "" == "") {
				errors.message = 'coinListField.error.status';
			} else if (!validator.isInt(info.status + '', { min: 0, max: 1 })) {
				errors.message = 'coinListField.error.statusNum';
			}
		});
	}

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? true : false
	};
}