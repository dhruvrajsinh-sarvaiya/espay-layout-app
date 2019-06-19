import validator from "validator";

export function validateOnlyNumeric(data) {

    // const regexNumeric = /^[0-9.]+$/;

    // if(!regexNumeric.test(data)){
    //     return false;
    // } else {
    //     return true;
    // }
 // Check Value is numeric and containes proper value 
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){        
        return false;
    }else{
        return true;
    }
}

// export function validateDecimalPoints(data) {

//     let errors = {};
//     const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

//     if(!regexNumeric.test(data)){
//         errors.buyPrice = "trade.errTradePriceIsNumber";
//     }

//     return {
//         errors, isValid: Object.keys(errors).length > 0 ? false : true
//     };

// }