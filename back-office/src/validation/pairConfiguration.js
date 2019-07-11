/**
 * Added By Devang Parekh
 * Used to validate pari configuration request
 * also check numeric validation for all number inputs
 */


import validator from "validator";

export function validatePairConfigurationRequest(data) {

  let errors = {};

  //Check Required Field...
  if (validator.isEmpty(data.marketName)) {
    errors.marketName = "sidebar.pairConfiguration.errors.markerName";
  } else if (!validator.isAlphanumeric(data.marketName)) {
    errors.marketName = "sidebar.pairConfiguration.errors.validMarkerName";
  }

  if (typeof data.marketCurrency == "object") {
    if (!data.marketCurrency.length) {
      errors.marketCurrency = "sidebar.pairConfiguration.errors.marketCurrency";
    }
  } else if (validator.isEmpty(data.marketCurrency)) {
    errors.marketCurrency = "sidebar.pairConfiguration.errors.marketCurrency";
  }

  if (validator.isEmpty(data.pairCurrency)) {
    errors.pairCurrency = "sidebar.pairConfiguration.errors.pairCurrency";
  }

  if (validator.isEmpty(data.defaultRate)) {
    errors.defaultRate = "sidebar.pairConfiguration.errors.defaultRate";
  } else if (!validator.matches(data.defaultRate, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.defaultRate = "sidebar.pairConfiguration.errors.invalidDefaultRate";
  }

  if (validator.isEmpty(data.minQuantity)) {
    errors.quantity = "sidebar.pairConfiguration.errors.quantity";
  } else if (!validator.matches(data.minQuantity, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.quantity = "sidebar.pairConfiguration.errors.invalidQuantity";
  }
  if (validator.isEmpty(data.maxQuantity)) {
    errors.quantity = "sidebar.pairConfiguration.errors.quantity";
  } else if (!validator.matches(data.maxQuantity, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.quantity = "sidebar.pairConfiguration.errors.invalidQuantity";
  }

  if (validator.isEmpty(data.minPrice)) {
    errors.price = "sidebar.pairConfiguration.errors.price";
  } else if (!validator.matches(data.minPrice, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.price = "sidebar.pairConfiguration.errors.invalidPrice";
  }
  if (validator.isEmpty(data.maxPrice)) {
    errors.price = "sidebar.pairConfiguration.errors.price";
  } else if (!validator.matches(data.maxPrice, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.price = "sidebar.pairConfiguration.errors.invalidPrice";
  }

  if (validator.isEmpty(data.minOpenQuantity)) {
    errors.openQuantity = "sidebar.pairConfiguration.errors.openQuantity";
  } else if (!validator.matches(data.minOpenQuantity, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.openQuantity = "sidebar.pairConfiguration.errors.invalidOpenQuantity";
  }
  if (validator.isEmpty(data.maxOpenQuantity)) {
    errors.openQuantity = "sidebar.pairConfiguration.errors.openQuantity";
  } else if (!validator.matches(data.maxOpenQuantity, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.openQuantity = "sidebar.pairConfiguration.errors.validOpenQuantity";
  }

  if (validator.isEmpty(data.trnChargeType)) {
    errors.trnChargeType = "sidebar.pairConfiguration.errors.trnChargeType";
  }

  if (validator.isEmpty(data.trnCharge)) {
    errors.trnCharge = "sidebar.pairConfiguration.errors.trnCharge";
  } else if (!validator.matches(data.trnCharge, /^[0-9]+(\.[0-9]{1,8})?$/)) {
    errors.trnCharge = "sidebar.pairConfiguration.errors.invalidTrnCharge";
  }

  if (data.trnChargeType == 1 && parseFloat(data.trnCharge) > 100) {
    errors.trnCharge = "sidebar.pairConfiguration.errors.invalidTrnCharge";
  }

  if (validator.isEmpty(data.openOrderExpiration)) {
    errors.openOrderExpiration = "sidebar.pairConfiguration.errors.openOrderExpiration";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "sidebar.pairConfiguration.errors.status";
  }


  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? false : true
  };

}

export function validateOnlyNumeric(data) {
  return !validator.matches(data) ? false : true;
}


export function validateNumericValue(data) {
  return !validator.matches(data) ? false : true;
}


export function validateOnlyAlphaNumeric(data) {
  return !validator.matches(data) ? false : true;
}

export function validateOnlyInteger(data) {
  return !validator.matches(data) ? false : true;
}

export function validateOnlyFloat(data) {
  return !validator.matches(data) ? false : true;
}
