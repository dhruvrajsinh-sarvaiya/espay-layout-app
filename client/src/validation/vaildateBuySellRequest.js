import validator from 'validator';
export function validateTradeBuyAmountRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.amountBuy = "trade.errTradeAmountRequired";
    }   

    if(validator.contains(data,'-')){
        errors.amountBuy = "trade.errTradeAmountPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.amountBuy = "trade.errTradeAmountIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};


export function validateTradeBuyLimitRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.limitBuy = "trade.errTradeLimitRequired";
    }   

    if(validator.contains(data,'-')){
        errors.limitBuy = "trade.errTradeLimitPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.limitBuy = "trade.errTradeLimitIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};


export function validateTradeBuyTotalRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.totalBuy = "trade.errTradeTotalRequired";
    }   

    if(validator.contains(data,'-')){
        errors.totalBuy = "trade.errTradeTotalPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.totalBuy = "trade.errTradeTotalIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};

export function validateTradeSellTotalRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.totalSell = "trade.errTradeTotalRequired";
    }   

    if(validator.contains(data,'-')){
        errors.totalSell = "trade.errTradeTotalPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.totalSell = "trade.errTradeTotalIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};



export function validateTradeBuyPriceRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.buyPrice = "trade.errTradePriceRequired";
    }   

    if(validator.contains(data,'-')){
        errors.buyPrice = "trade.errTradePricePositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.buyPrice = "trade.errTradePriceIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};


export function validateTradeBuyStopRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.stopBuy = "trade.errTradeStopRequired";
    }   

    if(validator.contains(data,'-')){
        errors.stopBuy = "trade.errTradeStopPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.stopBuy = "trade.errTradeStopIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};



export function validateTradeSellAmountRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.amountSell = "trade.errTradeAmountRequired";
    }   

    if(validator.contains(data,'-')){
        errors.amountSell = "trade.errTradeAmountPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.amountSell = "trade.errTradeAmountIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};

export function validateTradeSellLimitRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.limitSell = "trade.errTradeLimitRequired";
    }   

    if(validator.contains(data,'-')){
        errors.limitSell = "trade.errTradeLimitPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.limitSell = "trade.errTradeLimitIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};



export function validateTradeSellPriceRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.priceSell = "trade.errTradePriceRequired";
    }   

    if(validator.contains(data,'-')){
        errors.priceSell = "trade.errTradePricePositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.priceSell = "trade.errTradePriceIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};



export function validateTradeSellStopRequest(data) {
    
    let errors = {};
    //Check Required Field...  
    if (validator.isEmpty(data)) {
        errors.stopSell = "trade.errTradeStopRequired";
    }   

    if(validator.contains(data,'-')){
        errors.stopSell = "trade.errTradeStopPositive";
    }

    // Check Value is numeric and containes proper value
    if(!validator.isDecimal(data,{force_decimal: false, decimal_digits: '0,8'})){
        errors.stopSell = "trade.errTradeStopIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
};


export function validateBuyPrice(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,9})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.buyPrice = "trade.errTradePriceIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateBuyAmount(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.buyAmount = "trade.errTradeAmountIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateBuyTotal(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.buyTotal = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}


export function validateSellPrice(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.sellPrice = "trade.errTradePriceIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateSellAmount(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.sellAmount = "trade.errTradeAmountIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateSellTotal(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.sellTotal = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateSellStop(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.sellStop = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}

export function validateSellData(data) {

    let errors = {};
    //const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if(data.priceSell === '' || data.priceSell === 0){
        errors.sellPrice = "trade.errTradePriceRequired";
    }else{
        if(data.amountSell === '' || data.amountSell === 0){
            errors.sellAmount = "trade.errTradeAmountRequired";
        }else{
            if(data.totalSell === '' || data.totalSell === 0){
                errors.sellTotal = "trade.errTradeTotalRequired";
            }
        }
    }

    if(data.amountSell === '' || data.amountSell === 0){
        errors.sellAmount = "trade.errTradeAmountRequired";
    }else{
        if(data.totalSell === '' || data.totalSell === 0){
            errors.sellTotal = "trade.errTradeTotalRequired";
        }
    }

    if(data.totalSell === '' || data.totalSell === 0){
        //errors.sellTotal = "trade.errTradeTotalRequired";
    }

    if(data.limitSell === '' || data.limitSell === 0){
        errors.sellLimit = "trade.errTradeLimitRequired";
    }
    
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}


export function validateBuyData(data) {

    let errors = {};
    if(data.priceBuy === '' || data.priceBuy === 0){
        errors.buyPrice = "trade.errTradePriceRequired";
    }else{
        if(data.amountBuy === '' || data.amountBuy === 0){
            errors.buyAmount = "trade.errTradeAmountRequired";
        }else{
            if(data.totalBuy === '' || data.totalBuy === 0){
                errors.buyTotal = "trade.errTradeTotalRequired";
            }
        }        
    }

    if(data.amountBuy === '' || data.amountBuy === 0){
        errors.buyAmount = "trade.errTradeAmountRequired";
    }else{
         if(data.totalBuy === '' || data.totalBuy === 0){
            errors.buyTotal = "trade.errTradeTotalRequired";
        }
    }

    if(data.totalBuy === '' || data.totalBuy === 0){
        //errors.buyTotal = "trade.errTradeTotalRequired";
    }

    if(data.limitBuy === '' || data.limitBuy === 0){
        errors.buyLimit = "trade.errTradeLimitRequired";
    }

    
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}



export function validateBuyStop(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.buyStop = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}



export function validateSellLimit(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.sellLimit = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}


export function validateBuyLimit(data) {

    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data,regexNumeric)) {
        errors.buyLimit = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };

}


export function validateOnlyNumeric(data) {

    const regexNumeric = /^[0-9.]+$/;

    if (!validator.matches(data,regexNumeric)) {
        return false;
    } else {
        return true;
    }

}