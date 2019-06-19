import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateOrganization(data) {
    let errors = {};

    //Organization Name...
    if (validator.isEmpty(data.OrganizationName.trim())) {
        errors.OrganizationName = "my_account.err.fieldRequired";
    } else if (typeof (data.OrganizationName) != 'undefined' && isScriptTag(data.OrganizationName)) {
        errors.OrganizationName = "my_account.err.scriptTag";
    }

    //Mobile...
    if (validator.isEmpty(data.MobileNo.trim())) {
        errors.MobileNo = "my_account.err.fieldRequired";
    } else if (typeof (data.MobileNo) != 'undefined' && isScriptTag(data.MobileNo)) {
        errors.MobileNo = "my_account.err.scriptTag";
    }

    //Email...
    if (validator.isEmpty(data.Email.trim())) {
        errors.Email = "my_account.err.fieldRequired";
    } else if (typeof (data.Email) != 'undefined' && isScriptTag(data.Email)) {
        errors.Email = "my_account.err.scriptTag";
    }

    //Phone...
    if (validator.isEmpty(data.Phone.trim())) {
        errors.Phone = "my_account.err.fieldRequired";
    } else if (typeof (data.Phone) != 'undefined' && isScriptTag(data.Phone)) {
        errors.Phone = "my_account.err.scriptTag";
    }

    //Fax...
    if (validator.isEmpty(data.Fax.trim())) {
        errors.Fax = "my_account.err.fieldRequired";
    } else if (typeof (data.Fax) != 'undefined' && isScriptTag(data.Fax)) {
        errors.Fax = "my_account.err.scriptTag";
    }

    //Website...
    if (validator.isEmpty(data.Website.trim())) {
        errors.Website = "my_account.err.fieldRequired";
    } else if (typeof (data.Website) != 'undefined' && isScriptTag(data.Website)) {
        errors.Website = "my_account.err.scriptTag";
    }

    //Language...
    if (validator.isEmpty(data.LanguageId + '')) {
        errors.LanguageId = "my_account.err.fieldRequired";
    } else if (typeof (data.LanguageId) != 'undefined' && isScriptTag(data.LanguageId)) {
        errors.LanguageId = "my_account.err.scriptTag";
    }

    //Street...
    if (validator.isEmpty(data.Street.trim())) {
        errors.Street = "my_account.err.fieldRequired";
    } else if (typeof (data.Street) != 'undefined' && isScriptTag(data.Street)) {
        errors.Street = "my_account.err.scriptTag";
    }

    //City...
    if (validator.isEmpty(data.City.trim())) {
        errors.City = "my_account.err.fieldRequired";
    } else if (typeof (data.City) != 'undefined' && isScriptTag(data.City)) {
        errors.City = "my_account.err.scriptTag";
    }

    //State...
    if (validator.isEmpty(data.StateId + '')) {
        errors.stateId = "my_account.err.fieldRequired";
    } else if (typeof (data.StateId) != 'undefined' && isScriptTag(data.StateId)) {
        errors.StateId = "my_account.err.scriptTag";
    }

    //Country...
    if (validator.isEmpty(data.CountryId + '')) {
        errors.CountryId = "my_account.err.fieldRequired";
    } else if (typeof (data.CountryId) != 'undefined' && isScriptTag(data.CountryId)) {
        errors.CountryId = "my_account.err.scriptTag";
    }

    //Pincode...
    if (validator.isEmpty(data.PinCode.trim())) {
        errors.PinCode = "my_account.err.fieldRequired";
    } else if (typeof (data.PinCode) != 'undefined' && isScriptTag(data.PinCode)) {
        errors.PinCode = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};