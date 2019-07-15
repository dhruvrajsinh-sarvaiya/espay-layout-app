// Added by Jayesh Pathak 09-10-2018 for adding state module - start 
const Validator = require('validator');

exports.validateAddCityInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {

		let localeerror = false;

		Object.keys(data.locale).forEach((lg, index) => {

			errors[lg] = {};

			if ((data.locale[lg]) == undefined || (data.locale[lg]) == "" || data.locale[lg].length == 0 || Validator.isEmpty(data.locale[lg] + '')) {
				errors[lg] = 'cities.cityform.error.cityNameReq';
				localeerror = true;
			}

			else if (!Validator.isLength(data.locale[lg] + '', { min: 2, max: 100 })) {
				errors[lg] = 'cities.cityform.error.cityNameCharLimit';
				localeerror = true;
			}

			if (!localeerror) {
				delete errors[lg];
			}
		});


		if (data.countryId == undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
			errors.countryId = 'cities.cityform.error.countryIdReq';
		} else if (!Validator.isInt(data.countryId + '', { min: 1 })) {
			errors.countryId = 'cities.cityform.error.countryIdNum';
		}

		if (data.stateId == undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
			errors.stateId = 'cities.cityform.error.stateIdReq';
		} else if (!Validator.isInt(data.stateId + '', { min: 1 })) {
			errors.stateId = 'cities.cityform.error.stateIdNum';
		}

		if (typeof data.status == 'undefined' || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
			errors.status = 'cities.cityform.error.statusReq';
		} else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
			errors.status = 'cities.cityform.error.statusNum';
		}
	}

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};


exports.validateGetCityByIdInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {
		if (data.cityId == undefined || data.cityId == "" || data.cityId.length == 0 || Validator.isEmpty(data.cityId + '')) {
			errors.cityId = 'cities.cityform.error.cityIdReq';
		} else if (!Validator.isInt(data.cityId + '', { min: 1 })) {
			errors.cityId = 'cities.cityform.error.cityIdNum';
		}
	}

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

exports.validateGetCityByStateIdInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {
		if (data.stateId == undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
			errors.stateId = 'cities.cityform.error.stateIdReq';
		} else if (!Validator.isInt(data.stateId + '', { min: 1 })) {
			errors.stateId = 'cities.cityform.error.stateIdNum';
		}
	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};
};

exports.validateGetCityByCountryIdInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {
		if (data.countryId == undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
			errors.countryId = 'cities.cityform.error.countryIdReq';
		} else if (!Validator.isInt(data.countryId + '', { min: 1 })) {
			errors.countryId = 'cities.cityform.error.countryIdNum';
		}
	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

exports.validateGetCityByCountryStateIdInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {

		if (data.countryId == undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
			errors.countryId = 'cities.cityform.error.countryIdReq';
		} else if (!Validator.isInt(data.countryId + '', { min: 1 })) {
			errors.countryId = 'cities.cityform.error.countryIdNum';
		}

		if (data.stateId == undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
			errors.stateId = 'cities.cityform.error.stateIdReq';
		} else if (!Validator.isInt(data.stateId + '', { min: 1 })) {
			errors.stateId = 'cities.cityform.error.stateIdNum';
		}
	}

	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

exports.validateUpdateCityInput = function (data) {

	let errors = {};

	if (typeof data == 'undefined') {
		errors.message = 'common.api.invalidrequest';
	}
	else {
		if (data.cityId == undefined || data.cityId == "" || data.cityId.length == 0 || Validator.isEmpty(data.cityId + '')) {
			errors.cityId = 'cities.cityform.error.cityIdReq';
		} else if (!Validator.isInt(data.cityId + '', { min: 1 })) {
			errors.cityId = 'cities.cityform.error.cityIdNum';
		}

		let localeerror = false;

		Object.keys(data.locale).forEach((lg, index) => {

			errors[lg] = {};

			if ((data.locale[lg]) == undefined || (data.locale[lg]) == "" || data.locale[lg].length == 0 || Validator.isEmpty(data.locale[lg] + '')) {
				errors[lg] = 'cities.cityform.error.cityNameReq';
				localeerror = true;
			}

			else if (!Validator.isLength(data.locale[lg] + '', { min: 2, max: 100 })) {
				errors[lg] = 'cities.cityform.error.cityNameCharLimit';
				localeerror = true;
			}

			if (!localeerror) {
				delete errors[lg];
			}
		});

		if (data.countryId == undefined || data.countryId == "" || data.countryId.length == 0 || Validator.isEmpty(data.countryId + '')) {
			errors.countryId = 'cities.cityform.error.countryIdReq';
		} else if (!Validator.isInt(data.countryId + '', { min: 1 })) {
			errors.countryId = 'cities.cityform.error.countryIdNum';
		}

		if (data.stateId == undefined || data.stateId == "" || data.stateId.length == 0 || Validator.isEmpty(data.stateId + '')) {
			errors.stateId = 'cities.cityform.error.stateIdReq';
		} else if (!Validator.isInt(data.stateId + '', { min: 1 })) {
			errors.stateId = 'cities.cityform.error.stateIdNum';
		}

		if (data.status == undefined || data.status.length == 0 || Validator.isEmpty(data.status + '')) {
			errors.status = 'cities.cityform.error.statusReq';
		} else if (!Validator.isInt(data.status + '', { min: 0, max: 1 })) {
			errors.status = 'cities.cityform.error.statusNum';
		}

	}
	return {
		errors,
		isValid: Object.keys(errors).length > 0 ? false : true
	};

};

// Added by Jayesh Pathak 09-10-2018 for adding state module - end 