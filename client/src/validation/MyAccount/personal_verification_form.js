import validator from 'validator';

module.exports = function validatePersonalVerifyForm(data) {
    let errors = {};
    
    //Check Empty Surname...
    if (typeof(data.Surname) !== 'undefined' && validator.isEmpty(data.Surname, { ignore_whitespace: true }))
    {
        errors.Surname = "my_account.err.fieldRequired";
    } 
    else if(!validator.isAlpha(data.Surname))
    {
        errors.Surname = "my_account.err.fieldAlpha";
    }

    //Check Empty GivenName...
    if (typeof(data.GivenName) !== 'undefined' && validator.isEmpty(data.GivenName, { ignore_whitespace: true }))
    {
        errors.GivenName = "my_account.err.fieldRequired";
    } 
    else if(!validator.isAlpha(data.GivenName))
    {
        errors.GivenName = "my_account.err.fieldAlpha";
    }

    //Check Empty ValidIdentityCard...
    if (validator.isEmpty(data.ValidIdentityCard))
    {
        errors.ValidIdentityCard = "my_account.err.fieldRequired";
    } 
    //Check Empty Back...
    if(typeof data.Back==='undefined' || data.Back=='')
    {
      errors.Back= 'my_account.err.fieldRequired';
    }
    else if(typeof data.Back.name!=='undefined' && parseInt(data.Back.name.split('.').length)>2)
    {
      errors.Back= 'my_account.err.doubleExtension';
    }
    else if(typeof data.Back.type!=='undefined' && data.Back.type != 'image/jpeg' && data.Back.type != 'image/jpg' && data.Back.type != 'image/png')
    {
      errors.Back= 'my_account.err.validFormat';
    } 
    else if(typeof data.Back.size!=='undefined' && data.Back.size > 2097152)
    {
      errors.Back= 'my_account.err.fileSize';
    }

    //Check Empty Front...
    if(typeof data.Front==='undefined' || data.Front=='')
    {
      errors.Front= 'my_account.err.fieldRequired';
    }
    else if(typeof data.Front.name!=='undefined' && parseInt(data.Front.name.split('.').length)>2)
    {
      errors.Front= 'my_account.err.doubleExtension';
    }
    else if(typeof data.Front.type!=='undefined' && data.Front.type != 'image/jpeg' && data.Front.type != 'image/jpg' && data.Front.type != 'image/png')
    {
      errors.Front= 'my_account.err.validFormat';
    } 
    else if(typeof data.Front.size!=='undefined' && data.Front.size > 2097152)
    {
      errors.Front= 'my_account.err.fileSize';
    }

    //Check Empty Selfie...
    if(typeof data.Selfie==='undefined' || data.Selfie=='')
    {
      errors.Selfie= 'my_account.err.fieldRequired';
    }
    else if(typeof data.Selfie.name!=='undefined' && parseInt(data.Selfie.name.split('.').length)>2)
    {
      errors.Selfie= 'my_account.err.doubleExtension';
    }
    else if(typeof data.Selfie.type!=='undefined' && data.Selfie.type != 'image/jpeg' && data.Selfie.type != 'image/jpg' && data.Selfie.type != 'image/png')
    {
      errors.Selfie= 'my_account.err.validFormat';
    } 
    else if(typeof data.Selfie.size!=='undefined' && data.Selfie.size > 2097152)
    {
      errors.Selfie= 'my_account.err.fileSize';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};