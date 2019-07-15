// Added by Jayesh Pathak 26-10-2018 for adding language module - start
const Validator = require('validator');

exports.validateAddLanguageInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {

		if (data.language_name == undefined || data.language_name == "" || data.language_name.length == 0 || Validator.isEmpty(data.language_name + '')) {
			errors.language_name = 'languages.languageform.error.language_nameReq';
		} else if (!Validator.isAlpha(Validator.blacklist(data.language_name, ' ') + '')) {
			errors.language_name = 'languages.languageform.error.language_nameChar';
		} else if (!Validator.isLength(data.language_name + '', { min: 2, max: 100 })) {
			errors.language_name = 'languages.languageform.error.language_nameCharLimit';
		}

		if (data.code == undefined || data.code == "" || data.code.length == 0 || Validator.isEmpty(data.code + '')) {
			errors.code = 'languages.languageform.error.codeReq';
		} else if (!Validator.isAlpha(data.code + '')) {
			errors.code = 'languages.languageform.error.language_nameChar';
		} else if (!Validator.isLength(data.code + '', { min: 2, max: 2 })) {
			errors.code = 'languages.languageform.error.codeCharLimit';
		}

		if (data.locale == undefined || data.locale == "" || data.locale.length == 0 || Validator.isEmpty(data.locale + '')) {
			errors.locale = 'languages.languageform.error.localeReq';
		} else if (!Validator.isAlphanumeric(Validator.blacklist(data.locale, ' ') + '')) {
			errors.locale = 'languages.languageform.error.localeChar';
		} else if (!Validator.isLength(data.locale + '', { min: 2, max: 255 })) {
			errors.locale = 'languages.languageform.error.localeCharLimit';
		}

		if (data.sort_order == undefined || data.sort_order == "" || data.sort_order.length == 0 || Validator.isEmpty(data.sort_order + '')) {
			errors.sort_order = 'languages.languageform.error.sort_orderReq';
		} else if (!Validator.isInt(data.sort_order + '', { min: 1 })) {
			errors.sort_order = 'languages.languageform.error.sort_orderNum';
		}

		if (data.status == undefined || data.status == "" || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
			errors.status = 'languages.languageform.error.statusReq';
		} else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
			errors.status = 'languages.languageform.error.statusNum';
		}

		if (typeof data.rtlLayout == 'undefined' || data.rtlLayout == "") {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutReq';
		} else if (data.rtlLayout != 'true' && data.rtlLayout != 'false') {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutInvalid';
		}

	}

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};


exports.validateGetLanguageByIdInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {
		if (data.id == undefined || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id + '')) {
			errors.id = 'languages.languageform.error.idReq';
		} else if (!Validator.isInt(data.id + '', { min: 1 })) {
			errors.id = 'languages.languageform.error.idNum';
		}
	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

exports.validateUpdateLanguageConfigInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {

		if (data.id == undefined || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id + '')) {
			errors.message = 'languages.languageform.error.idReq';
		} else

			if (typeof data.languagedata == 'undefined' || data.hasOwnProperty("languagedata") == false) {
				errors.message = 'languages.languageform.error.languagedataReq';
			}

		let localeerror = false;

		Object.keys(data.languagedata).forEach((lg, index) => {

			errors[lg] = {};

			if (!(data.languagedata[lg].languageId) || typeof data.languagedata[lg].languageId == 'undefined' || (data.languagedata[lg].languageId) == "" || data.languagedata[lg].languageId.length == 0 || Validator.isEmpty(data.languagedata[lg].languageId + '')) {
				errors[lg].languageId = 'languages.languageform.error.languageIdReq';
				localeerror = true;
			} else if (!Validator.isLength(data.languagedata[lg].languageId + '', { min: 2, max: 100 })) {
				errors[lg].languageId = 'languages.languageform.error.languageIdCharLimit';
				localeerror = true;
			}

			if (typeof data.languagedata[lg].status == 'undefined' || data.languagedata[lg].status.length == 0 || Validator.isEmpty(data.languagedata[lg].status + '')) {
				errors[lg].status = 'languages.languageform.error.statusReq';
				localeerror = true;
			} else if (!Validator.isInt(data.languagedata[lg].status + '', { min: 0, max: 1 })) {
				errors[lg].status = 'languages.languageform.error.statusNum';
				localeerror = true;
			}

			if (typeof data.languagedata[lg].isDefault == 'undefined' || data.languagedata[lg].isDefault.length == 0 || Validator.isEmpty(data.languagedata[lg].isDefault + '')) {
				errors[lg].isDefault = 'languages.languageform.error.isDefaultReq';
				localeerror = true;
			} else if (!Validator.isInt(data.languagedata[lg].isDefault + '', { min: 0, max: 1 })) {
				errors[lg].isDefault = 'languages.languageform.error.isDefaultNum';
				localeerror = true;
			}

			if (!localeerror) {
				delete errors[lg];
			}
		});

	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

exports.validateUpdateLanguageInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {

		if (data.language_name == undefined || data.language_name == "" || data.language_name.length == 0 || Validator.isEmpty(data.language_name + '')) {
			errors.language_name = 'languages.languageform.error.language_nameReq';
		} else if (!Validator.isAlpha(Validator.blacklist(data.language_name, '\\ \\,\\-') + '')) {
			errors.language_name = 'languages.languageform.error.language_nameChar';
		} else if (!Validator.isLength(data.language_name + '', { min: 2, max: 100 })) {
			errors.language_name = 'languages.languageform.error.language_nameCharLimit';
		}


		if (data.code == undefined || data.code == "" || data.code.length == 0 || Validator.isEmpty(data.code + '')) {
			errors.code = 'languages.languageform.error.codeReq';
		} else if (!Validator.isAlpha(data.code + '')) {
			errors.code = 'languages.languageform.error.language_nameChar';
		} else if (!Validator.isLength(data.code + '', { min: 2, max: 2 })) {
			errors.code = 'languages.languageform.error.codeCharLimit';
		}

		if (data.locale == undefined || data.locale == "" || data.locale.length == 0 || Validator.isEmpty(data.locale + '')) {
			errors.locale = 'languages.languageform.error.localeReq';
		} else if (!Validator.isAlphanumeric(Validator.blacklist(data.locale, '\\ \\,\\-') + '')) {
			errors.locale = 'languages.languageform.error.localeChar';
		} else if (!Validator.isLength(data.locale + '', { min: 2, max: 255 })) {
			errors.locale = 'languages.languageform.error.localeCharLimit';
		}

		if (data.sort_order == undefined || data.sort_order == "" || data.sort_order.length == 0 || Validator.isEmpty(data.sort_order + '')) {
			errors.sort_order = 'languages.languageform.error.sort_orderReq';
		} else if (!Validator.isInt(data.sort_order + '', { min: 1 })) {
			errors.sort_order = 'languages.languageform.error.sort_orderNum';
		}

		if (typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
			errors.status = 'languages.languageform.error.statusReq';
		} else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
			errors.status = 'languages.languageform.error.statusNum';
		}

		if (data.id == undefined || data.id == "" || data.id.length == 0 || Validator.isEmpty(data.id + '')) {
			errors.id = 'languages.languageform.error.idReq';
		} else if (!Validator.isInt(data.id + '', { min: 1 })) {
			errors.id = 'languages.languageform.error.idNum';
		}
		if (typeof data.rtlLayout == 'undefined' || data.rtlLayout == "") {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutReq';
		} else if (data.rtlLayout != 'true' && data.rtlLayout != 'false') {
			errors.rtlLayout = 'languages.languageform.error.rtlLayoutInvalid';
		}
	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

// Added by Jayesh Pathak 26-10-2018 for adding language module - end