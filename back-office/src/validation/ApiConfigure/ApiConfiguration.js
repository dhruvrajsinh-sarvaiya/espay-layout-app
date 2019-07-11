import validator from "validator";

export function validateOnlyNumeric(data) {
 // Check Value is numeric and containes proper value 
 return (!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'}) ? true : false)
}