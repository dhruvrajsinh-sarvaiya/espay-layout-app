import validator from 'validator';
import { isAlphaWithSpace } from "Helpers/helpers";

module.exports = function validateEnterpriseVerifyForm(data) {
    let errors = {};
    
    //Check Empty Register Company Name...
    if (validator.isEmpty(data.register_company_name))
    {
        errors.register_company_name = "my_account.err.fieldRequired";
    } 
    else if(!isAlphaWithSpace(data.register_company_name))
    {
        errors.register_company_name = "my_account.err.fieldAlpha";
    }

    //Check Empty Company Address...
    if (validator.isEmpty(data.company_address))
    {
        errors.company_address = "my_account.err.fieldRequired";
    }

    //Check Empty Register Country...
    if (validator.isEmpty(data.registered_country))
    {
        errors.registered_country = "my_account.err.fieldRequired";
    }

    //Check Empty Source Of Founding...
    if (validator.isEmpty(data.sources_of_founding))
    {
        errors.sources_of_founding = "my_account.err.fieldRequired";
    }

    //Check Empty Url Of Goverment...
    if (validator.isEmpty(data.url_of_goverment_website))
    {
        errors.url_of_goverment_website = "my_account.err.fieldRequired";
    }
    else if(!validator.isURL(data.url_of_goverment_website)) 
    {
        errors.url_of_goverment_website = "my_account.err.validUrl";
    }

    //Check Empty Applicant Full Name...
    if (validator.isEmpty(data.applicant_full_name))
    {
        errors.applicant_full_name = "my_account.err.fieldRequired";
    } 
    else if(!isAlphaWithSpace(data.applicant_full_name))
    {
        errors.applicant_full_name = "my_account.err.fieldAlpha";
    }

    //Check Empty Applicant country...
    if (validator.isEmpty(data.applicant_country))
    {
        errors.applicant_country = "my_account.err.fieldRequired";
    }
    
    //Check Empty Applicant Job Title...
    if (validator.isEmpty(data.applicant_job_title))
    {
        errors.applicant_job_title = "my_account.err.fieldRequired";
    }
    else if(!isAlphaWithSpace(data.applicant_job_title))
    {
        errors.applicant_job_title = "my_account.err.fieldAlpha";
    }

    //Check Empty Applicant Phone Number...
    if (validator.isEmpty(data.applicant_phone_no))
    {
        errors.applicant_phone_no = "my_account.err.fieldRequired";
    }
    else if(!validator.isNumeric(data.applicant_phone_no))
    {
        errors.applicant_phone_no = "my_account.err.validPhoneNo";
    }

    //Check Empty Original Certificate of Incorporation and Business Registration...
    if (validator.isEmpty(data.orgnal_crtf_of_incrpt_bsnc))
    {
        errors.orgnal_crtf_of_incrpt_bsnc = "my_account.err.fieldRequired";
    }

    //Check Empty Memorandum and Articles of Association...
    if (validator.isEmpty(data.memrnd_n_article_of_association))
    {
        errors.memrnd_n_article_of_association = "my_account.err.fieldRequired";
    }

    //Check Empty Ownership and Control Structure...
    if (validator.isEmpty(data.ownership_n_cntr_strct))
    {
        errors.ownership_n_cntr_strct = "my_account.err.fieldRequired";
    }

    //Check Empty List of all directors...
    if (validator.isEmpty(data.list_of_all_directors))
    {
        errors.list_of_all_directors = "my_account.err.fieldRequired";
    }

    //Check Empty Certificate of Incumbency...
    if (validator.isEmpty(data.crtf_of_incumbency))
    {
        errors.crtf_of_incumbency = "my_account.err.fieldRequired";
    }

    //Check Empty Applicant's Passport Cover...
    if (validator.isEmpty(data.applicant_passport_cover))
    {
        errors.applicant_passport_cover = "my_account.err.fieldRequired";
    }

    //Check Empty Applicant's Passport Personal Page...
    if (validator.isEmpty(data.applicant_passport_personal_page))
    {
        errors.applicant_passport_personal_page = "my_account.err.fieldRequired";
    }

    //Check Empty Applicant's Selfie with Photo Passport and Note...
    if (validator.isEmpty(data.applicant_selfie))
    {
        errors.applicant_selfie = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};