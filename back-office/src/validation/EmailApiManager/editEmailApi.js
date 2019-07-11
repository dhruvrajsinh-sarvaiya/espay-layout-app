import validator from 'validator';
import { isAlphaWithSpace } from 'Helpers/helpers';
module.exports = function validateEmailAPI(data) {
    let errors = {};
    //Check Empty SenderID...
    if (validator.isEmpty(data.SenderID)) {
        errors.SenderID = "emailAPIManager.error.SenderID.null";
    }else if(!validator.isAlphanumeric(data.SenderID)){
        errors.SenderID = "emailAPIManager.error.SenderID";
    }else if(validator.isEmpty(data.SendURL)){
        errors.SendURL = "emailAPIManager.error.SendURL.null";
    }else if(!validator.isURL(data.SendURL)){
        errors.SendURL = "emailAPIManager.error.SendURL";
    }else if(validator.isEmpty(data.Priority.toString())){
        errors.Priority = "emailAPIManager.error.Priority.null";
    }else if(!validator.isNumeric(data.Priority.toString())){
        errors.Priority = "emailAPIManager.error.Priority";
    }else if(data.Priority < 0){
        errors.Priority = "emailAPIManager.error.Priority";
    }else if(validator.isEmpty(data.RequestID.toString())){
        errors.RequestID = "emailAPIManager.error.RequestID.null";
    }else if(!validator.isNumeric(data.RequestID.toString())){
        errors.RequestID = "emailAPIManager.error.RequestID";
    }else if(validator.isEmpty(data.ServiceName)){
        errors.ServiceName = "emailAPIManager.error.ServiceName.null";
    }else if(!isAlphaWithSpace(data.ServiceName)){
        errors.ServiceName = "emailAPIManager.error.ServiceName";
    }else if(validator.isEmpty(data.ParsingDataID.toString())){
        errors.ParsingDataID = "emailAPIManager.error.ParsingDataID.null";
    }else if(!validator.isNumeric(data.ParsingDataID.toString())){
        errors.ParsingDataID = "emailAPIManager.error.ParsingDataID";
    }else if(validator.isEmpty(data.SerproName)){
        errors.SerproName = "emailAPIManager.error.SerproName.null";
    }else if(!isAlphaWithSpace(data.SerproName)){
        errors.SerproName = "emailAPIManager.error.SerproName";
    }else if(validator.isEmpty(data.UserID)){
        errors.UserID = "emailAPIManager.error.UserID.null";
    }else if(!validator.matches(data.UserID,"^[.@_a-zA-Z0-9]+$")){
        errors.UserID = "emailAPIManager.error.UserID";
    }else if(validator.isEmpty(data.Password)){
        errors.Password = "emailAPIManager.error.Password.null";
    }else if(!validator.matches(data.Password,"^[#$.@_a-zA-Z0-9]+$")){
        errors.Password = "emailAPIManager.error.Password";
    }else  if(validator.isEmpty(data.ServiceTypeID.toString())){
        errors.ServiceTypeID = "emailAPIManager.error.ServiceTypeID.null";
    }else if(!validator.isNumeric(data.ServiceTypeID.toString())){
        errors.ServiceTypeID = "emailAPIManager.error.ServiceTypeID";
    }else if(validator.isEmpty(data.Status.toString())){
        errors.Status = "emailAPIManager.error.Status.null";
    }else if(!validator.isNumeric(data.Status.toString())){
        errors.Status = "emailAPIManager.error.Status";
    }else if(data.validateBit == 2){
        if(validator.isEmpty(data.APID.toString())){
            errors.APID = "emailAPIManager.error.APID";
        }else if(!validator.isNumeric(data.APID.toString())){
            errors.APID = "emailAPIManager.error.APID";
        }else if(validator.isEmpty(data.SerproID.toString())){
            errors.SerproID = "emailAPIManager.error.SerproID.null";
        }else if(!validator.isNumeric(data.SerproID.toString())){
            errors.SerproID = "emailAPIManager.error.SerProID";
        }else if(validator.isEmpty(data.ServiceID.toString())){
            errors.ServiceID = "emailAPIManager.error.ServiceID.null";
        }else if(!validator.isNumeric(data.ServiceID.toString())){
            errors.ServiceID = "emailAPIManager.error.ServiceID";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true,
    };
};