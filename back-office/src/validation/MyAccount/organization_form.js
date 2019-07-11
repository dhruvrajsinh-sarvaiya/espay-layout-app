import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateOrganization(data) {
    let errors = {};

    //Organization Name...
    if ((data.OrganizationName) !== undefined && validator.isEmpty(data.OrganizationName.trim())) {
        errors.OrganizationName = "my_account.err.fieldRequired";
    } else if ((data.OrganizationName) !== undefined && isScriptTag(data.OrganizationName)) {
        errors.OrganizationName = "my_account.err.scriptTag";
    }

    //Mobile...
    if ((data.MobileNo) !== undefined && validator.isEmpty(data.MobileNo.trim())) {
        errors.MobileNo = "my_account.err.fieldRequired";
    } else if ((data.MobileNo) !== undefined && isScriptTag(data.MobileNo)) {
        errors.MobileNo = "my_account.err.scriptTag";
    }

    //Email...
    if ((data.Email) !== undefined && validator.isEmpty(data.Email.trim())) {
        errors.Email = "my_account.err.fieldRequired";
    } else if ((data.Email) !== undefined && isScriptTag(data.Email)) {
        errors.Email = "my_account.err.scriptTag";
    }

    //Phone...
    if ((data.Phone) !== undefined && validator.isEmpty(data.Phone.trim())) {
        errors.Phone = "my_account.err.fieldRequired";
    } else if ((data.Phone) !== undefined && isScriptTag(data.Phone)) {
        errors.Phone = "my_account.err.scriptTag";
    }

    //Fax...
    if ((data.Fax) !== undefined && validator.isEmpty(data.Fax.trim())) {
        errors.Fax = "my_account.err.fieldRequired";
    } else if ((data.Fax) !== undefined && isScriptTag(data.Fax)) {
        errors.Fax = "my_account.err.scriptTag";
    }

    //Website...
    if ((data.Website) !== undefined && validator.isEmpty(data.Website.trim())) {
        errors.Website = "my_account.err.fieldRequired";
    } else if ((data.Website) !== undefined && isScriptTag(data.Website)) {
        errors.Website = "my_account.err.scriptTag";
    }

    //Language...
    if ((data.LanguageId) !== undefined && validator.isEmpty(data.LanguageId + '')) {
        errors.LanguageId = "my_account.err.fieldRequired";
    } else if ((data.LanguageId) !== undefined && isScriptTag(data.LanguageId)) {
        errors.LanguageId = "my_account.err.scriptTag";
    }

    //Street...
    if ((data.Street) !== undefined && validator.isEmpty(data.Street.trim())) {
        errors.Street = "my_account.err.fieldRequired";
    } else if ((data.Street) !== undefined && isScriptTag(data.Street)) {
        errors.Street = "my_account.err.scriptTag";
    }

    //City...
    if ((data.City) !== undefined && validator.isEmpty(data.City.trim())) {
        errors.City = "my_account.err.fieldRequired";
    } else if ((data.City) !== undefined && isScriptTag(data.City)) {
        errors.City = "my_account.err.scriptTag";
    }

    //State...
    if ((data.StateId) !== undefined && validator.isEmpty(data.StateId + '')) {
        errors.stateId = "my_account.err.fieldRequired";
    } else if ((data.StateId) !== undefined && isScriptTag(data.StateId)) {
        errors.StateId = "my_account.err.scriptTag";
    }

    //Country...
    if ((data.CountryId) !== undefined && validator.isEmpty(data.CountryId + '')) {
        errors.CountryId = "my_account.err.fieldRequired";
    } else if ((data.CountryId) !== undefined && isScriptTag(data.CountryId)) {
        errors.CountryId = "my_account.err.scriptTag";
    }

    //Pincode...
    if ((data.PinCode) !== undefined && validator.isEmpty(data.PinCode.trim())) {
        errors.PinCode = "my_account.err.fieldRequired";
    } else if ((data.PinCode) !== undefined && isScriptTag(data.PinCode)) {
        errors.PinCode = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};