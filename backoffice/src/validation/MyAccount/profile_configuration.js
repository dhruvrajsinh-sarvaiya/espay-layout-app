import validator from "validator";
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from "Helpers/helpers";

module.exports = function validateProfileConfig(data) {
    let errors = {};
    let transLimitFlag = false;
    let transLimitError = [];
    let withLimitFlag = false;
    let withLimitError = [];
    let tradLimitFlag = false;
    let tradLimitError = [];
    let depositLimitFlag = false;
    let depositLimitError = [];

    // TypeId
    if (data.hasOwnProperty('TypeId') && validator.isEmpty(data.TypeId + "")) {
        errors.TypeId = "my_account.err.fieldRequired";
    }

    // KycLevel
    if (data.hasOwnProperty('KYCLevel') && validator.isEmpty(data.KYCLevel + "")) {
        errors.KYCLevel = "my_account.err.fieldRequired";
    }

    // Profilelevel
    if (data.hasOwnProperty('Profilelevel') && validator.isEmpty(data.Profilelevel + "")) {
        errors.Profilelevel = "my_account.err.fieldRequired";
    }

    // SubscriptionLimit
    if (data.hasOwnProperty('SubscriptionAmount') && validator.isEmpty(data.SubscriptionAmount + "", { ignore_whitespace: true })) {
        errors.SubscriptionAmount = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('SubscriptionAmount') && !validator.isEmpty(data.SubscriptionAmount + "")) {
        if (isScriptTag(data.SubscriptionAmount)) {
            errors.SubscriptionAmount = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SubscriptionAmount)) {
            errors.SubscriptionAmount = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.SubscriptionAmount + '')) {
            errors.SubscriptionAmount = "my_account.err.requireDecimalField";
        } else if (data.SubscriptionAmount + '' <= 0) {
            errors.SubscriptionAmount = "my_account.err.requireGreterThanZero";
        }
    }

    // IsProfileExpiry
    if (data.hasOwnProperty('IsProfileExpiry') && validator.isEmpty(data.IsProfileExpiry + "")) {
        errors.IsProfileExpiry = "my_account.err.fieldRequired";
    }

    // IsRecursive
    if (data.hasOwnProperty('IsRecursive') && validator.isEmpty(data.IsRecursive + "")) {
        errors.IsRecursive = "my_account.err.fieldRequired";
    }

    // ProfileFee
    if (data.hasOwnProperty('ProfileFree') && validator.isEmpty(data.ProfileFree + "", { ignore_whitespace: true })) {
        errors.ProfileFree = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('ProfileFree') && !validator.isEmpty(data.ProfileFree + "")) {
        if (isScriptTag(data.ProfileFree)) {
            errors.ProfileFree = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ProfileFree)) {
            errors.ProfileFree = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.ProfileFree + '', { no_symbols: true })) {
            errors.ProfileFree = "my_account.err.requireDecimalField";
        } else if (data.ProfileFree + '' <= 0) {
            errors.ProfileFree = "my_account.err.requireGreterThanZero";
        }
    }

    // DepositFee
    if (data.hasOwnProperty('DepositFee') && validator.isEmpty(data.DepositFee + "", { ignore_whitespace: true })) {
        errors.DepositFee = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('DepositFee') && !validator.isEmpty(data.DepositFee + "")) {
        if (isScriptTag(data.DepositFee + "")) {
            errors.DepositFee = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.DepositFee)) {
            errors.DepositFee = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.DepositFee + '', { no_symbols: true })) {
            errors.DepositFee = "my_account.err.requireDecimalField";
        } else if (data.DepositFee + '' <= 0) {
            errors.DepositFee = "my_account.err.requireGreterThanZero";
        }
    }

    // Withdrawalfee
    if (data.hasOwnProperty('Withdrawalfee') && validator.isEmpty(data.Withdrawalfee + "", { ignore_whitespace: true })) {
        errors.Withdrawalfee = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Withdrawalfee') && !validator.isEmpty(data.Withdrawalfee + "")) {
        if (isScriptTag(data.Withdrawalfee + "")) {
            errors.Withdrawalfee = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Withdrawalfee)) {
            errors.Withdrawalfee = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.Withdrawalfee + '', { no_symbols: true })) {
            errors.Withdrawalfee = "my_account.err.requireDecimalField";
        } else if (data.Withdrawalfee + '' <= 0) {
            errors.Withdrawalfee = "my_account.err.requireGreterThanZero";
        }
    }

    // TradingFee
    if (data.hasOwnProperty('Tradingfee') && validator.isEmpty(data.Tradingfee + "", { ignore_whitespace: true })) {
        errors.Tradingfee = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Tradingfee') && !validator.isEmpty(data.Tradingfee + "")) {
        if (isScriptTag(data.Tradingfee + "")) {
            errors.Tradingfee = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Tradingfee)) {
            errors.Tradingfee = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.Tradingfee + '', { no_symbols: true })) {
            errors.Tradingfee = "my_account.err.requireDecimalField";
        } else if (data.Tradingfee + '' <= 0) {
            errors.Tradingfee = "my_account.err.requireGreterThanZero";
        }
    }

    // LevelName
    if (data.hasOwnProperty('LevelName') && validator.isEmpty(data.LevelName + "", { ignore_whitespace: true })) {
        errors.LevelName = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('LevelName') && !validator.isEmpty(data.LevelName + "")) {
        if (isScriptTag(data.LevelName + "")) {
            errors.LevelName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.LevelName)) {
            errors.LevelName = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.LevelName)) {
            errors.LevelName = "my_account.err.fieldAlphaSpace";
        }
    }

    // Description
    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description + '', { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description + '')) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
        }
    }



    // ---------------TransactionLimit Selection------------------
    if (!data.TransactionLimit.length) {
        errors.selectTransLimit = "wallet.errSelectRoute";
    }
    //TransactionLimit
    data.TransactionLimit.forEach((transLimit, index) => {
        let newElement = {};
        if (validator.isEmpty(transLimit.CurrencyId + "")) {
            newElement.CurrencyId = "wallet.errRequired";
            transLimitFlag = true;
        }
        if (validator.isEmpty(transLimit.Hourly + "", { ignore_whitespace: true })) {
            newElement.Hourly = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Hourly + '')) {
            if (isScriptTag(transLimit.Hourly)) {
                newElement.Hourly = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Hourly)) {
                newElement.Hourly = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Hourly + '', { no_symbols: true }) || transLimit.Hourly + '' <= 0) {
                newElement.Hourly = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        if (validator.isEmpty(transLimit.Daily + "", { ignore_whitespace: true })) {
            newElement.Daily = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Daily + '')) {
            if (isScriptTag(transLimit.Daily)) {
                newElement.Daily = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Daily)) {
                newElement.Daily = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Daily + '', { no_symbols: true }) || transLimit.Daily + '' <= 0) {
                newElement.Daily = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        if (validator.isEmpty(transLimit.Weekly + "", { ignore_whitespace: true })) {
            newElement.Weekly = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Weekly + '')) {
            if (isScriptTag(transLimit.Weekly)) {
                newElement.Weekly = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Weekly)) {
                newElement.Weekly = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Weekly + '', { no_symbols: true }) || transLimit.Weekly + '' <= 0) {
                newElement.Weekly = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        if (validator.isEmpty(transLimit.Monthly + "", { ignore_whitespace: true })) {
            newElement.Monthly = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Monthly + '')) {
            if (isScriptTag(transLimit.Monthly)) {
                newElement.Monthly = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Monthly)) {
                newElement.Monthly = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Monthly + '', { no_symbols: true }) || transLimit.Monthly + '' <= 0) {
                newElement.Monthly = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        if (validator.isEmpty(transLimit.Qauterly + "", { ignore_whitespace: true })) {
            newElement.Qauterly = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Qauterly + '')) {
            if (isScriptTag(transLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Qauterly + '', { no_symbols: true }) || transLimit.Qauterly + '' <= 0) {
                newElement.Qauterly = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        if (validator.isEmpty(transLimit.Yearly + "", { ignore_whitespace: true })) {
            newElement.Yearly = "wallet.errRequired";
            transLimitFlag = true;
        } else if (!validator.isEmpty(transLimit.Yearly + '')) {
            if (isScriptTag(transLimit.Yearly)) {
                newElement.Yearly = "my_account.err.scriptTag";
                transLimitFlag = true;
            } else if (isHtmlTag(transLimit.Yearly)) {
                newElement.Yearly = "my_account.err.htmlTag";
                transLimitFlag = true;
            } else if (!validator.isInt(transLimit.Yearly + '', { no_symbols: true }) || transLimit.Yearly + '' <= 0) {
                newElement.Yearly = "my_account.err.requireNumericField";
                transLimitFlag = true;
            }
        }
        transLimitError.splice(index, 0, newElement);
    });
    if (transLimitFlag) {
        errors.transLimit = transLimitError;
    }



    // ---------------WithdrawlLimit Selection------------------
    if (!data.WithdrawalLimit.length) {
        errors.selectWithLimit = "wallet.errSelectRoute";
    }
    //WithdrawalLimit
    data.WithdrawalLimit.forEach((withLimit, index) => {
        let newElement = {};
        if (validator.isEmpty(withLimit.CurrencyId + "")) {
            newElement.CurrencyId = "wallet.errRequired";
            withLimitFlag = true;
        }
        if (validator.isEmpty(withLimit.Hourly + "", { ignore_whitespace: true })) {
            newElement.Hourly = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Hourly + '')) {
            if (isScriptTag(withLimit.Hourly)) {
                newElement.Hourly = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Hourly)) {
                newElement.Hourly = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Hourly + '', { no_symbols: true }) || withLimit.Hourly + '' <= 0) {
                newElement.Hourly = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        if (validator.isEmpty(withLimit.Daily + "", { ignore_whitespace: true })) {
            newElement.Daily = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Daily + '')) {
            if (isScriptTag(withLimit.Daily)) {
                newElement.Daily = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Daily)) {
                newElement.Daily = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Daily + '', { no_symbols: true }) || withLimit.Daily + '' <= 0) {
                newElement.Daily = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        if (validator.isEmpty(withLimit.Weekly + "", { ignore_whitespace: true })) {
            newElement.Weekly = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Weekly + '')) {
            if (isScriptTag(withLimit.Weekly)) {
                newElement.Weekly = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Weekly)) {
                newElement.Weekly = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Weekly + '', { no_symbols: true }) || withLimit.Weekly + '' <= 0) {
                newElement.Weekly = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        if (validator.isEmpty(withLimit.Monthly + "", { ignore_whitespace: true })) {
            newElement.Monthly = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Monthly + '')) {
            if (isScriptTag(withLimit.Monthly)) {
                newElement.Monthly = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Monthly)) {
                newElement.Monthly = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Monthly + '', { no_symbols: true }) || withLimit.Monthly + '' <= 0) {
                newElement.Monthly = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        if (validator.isEmpty(withLimit.Qauterly + "", { ignore_whitespace: true })) {
            newElement.Qauterly = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Qauterly + '')) {
            if (isScriptTag(withLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Qauterly + '', { no_symbols: true }) || withLimit.Qauterly + '' <= 0) {
                newElement.Qauterly = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        if (validator.isEmpty(withLimit.Yearly + "", { ignore_whitespace: true })) {
            newElement.Yearly = "wallet.errRequired";
            withLimitFlag = true;
        } else if (!validator.isEmpty(withLimit.Yearly + '')) {
            if (isScriptTag(withLimit.Yearly)) {
                newElement.Yearly = "my_account.err.scriptTag";
                withLimitFlag = true;
            } else if (isHtmlTag(withLimit.Yearly)) {
                newElement.Yearly = "my_account.err.htmlTag";
                withLimitFlag = true;
            } else if (!validator.isInt(withLimit.Yearly + '', { no_symbols: true }) || withLimit.Yearly + '' <= 0) {
                newElement.Yearly = "my_account.err.requireNumericField";
                withLimitFlag = true;
            }
        }
        withLimitError.splice(index, 0, newElement);
    });
    if (withLimitFlag) {
        errors.withLimit = withLimitError;
    }



    // ---------------TradeLimit Selection------------------
    if (!data.TradeLimit.length) {
        errors.selectTradeLimit = "wallet.errSelectRoute";
    }
    //TradeLimit
    data.TradeLimit.forEach((tradLimit, index) => {
        let newElement = {};
        if (validator.isEmpty(tradLimit.CurrencyId + "")) {
            newElement.CurrencyId = "wallet.errRequired";
            tradLimitFlag = true;
        }
        if (validator.isEmpty(tradLimit.Hourly + "", { ignore_whitespace: true })) {
            newElement.Hourly = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Hourly + '')) {
            if (isScriptTag(tradLimit.Hourly)) {
                newElement.Hourly = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Hourly)) {
                newElement.Hourly = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Hourly + '', { no_symbols: true }) || tradLimit.Hourly + '' <= 0) {
                newElement.Hourly = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        if (validator.isEmpty(tradLimit.Daily + "", { ignore_whitespace: true })) {
            newElement.Daily = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Daily + '')) {
            if (isScriptTag(tradLimit.Daily)) {
                newElement.Daily = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Daily)) {
                newElement.Daily = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Daily + '', { no_symbols: true }) || tradLimit.Daily + '' <= 0) {
                newElement.Daily = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        if (validator.isEmpty(tradLimit.Weekly + "", { ignore_whitespace: true })) {
            newElement.Weekly = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Weekly + '')) {
            if (isScriptTag(tradLimit.Weekly)) {
                newElement.Weekly = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Weekly)) {
                newElement.Weekly = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Weekly + '', { no_symbols: true }) || tradLimit.Weekly + '' <= 0) {
                newElement.Weekly = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        if (validator.isEmpty(tradLimit.Monthly + "", { ignore_whitespace: true })) {
            newElement.Monthly = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Monthly + '')) {
            if (isScriptTag(tradLimit.Monthly)) {
                newElement.Monthly = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Monthly)) {
                newElement.Monthly = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Monthly + '', { no_symbols: true }) || tradLimit.Monthly + '' <= 0) {
                newElement.Monthly = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        if (validator.isEmpty(tradLimit.Qauterly + "", { ignore_whitespace: true })) {
            newElement.Qauterly = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Qauterly + '')) {
            if (isScriptTag(tradLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Qauterly + '', { no_symbols: true }) || tradLimit.Qauterly + '' <= 0) {
                newElement.Qauterly = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        if (validator.isEmpty(tradLimit.Yearly + "", { ignore_whitespace: true })) {
            newElement.Yearly = "wallet.errRequired";
            tradLimitFlag = true;
        } else if (!validator.isEmpty(tradLimit.Yearly + '')) {
            if (isScriptTag(tradLimit.Yearly)) {
                newElement.Yearly = "my_account.err.scriptTag";
                tradLimitFlag = true;
            } else if (isHtmlTag(tradLimit.Yearly)) {
                newElement.Yearly = "my_account.err.htmlTag";
                tradLimitFlag = true;
            } else if (!validator.isInt(tradLimit.Yearly + '', { no_symbols: true }) || tradLimit.Yearly + '' <= 0) {
                newElement.Yearly = "my_account.err.requireNumericField";
                tradLimitFlag = true;
            }
        }
        tradLimitError.splice(index, 0, newElement);
    });
    if (tradLimitFlag) {
        errors.tradLimit = tradLimitError;
    }



    // ---------------Deposit Selection------------------
    if (!data.DepositLimit.length) {
        errors.selectDepositLimit = "wallet.errSelectRoute";
    }
    //DepositLimit
    data.DepositLimit.forEach((depositLimit, index) => {
        let newElement = {};
        if (validator.isEmpty(depositLimit.CurrencyId + "")) {
            newElement.CurrencyId = "wallet.errRequired";
            depositLimitFlag = true;
        }
        if (validator.isEmpty(depositLimit.Hourly + "", { ignore_whitespace: true })) {
            newElement.Hourly = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Hourly + '')) {
            if (isScriptTag(depositLimit.Hourly)) {
                newElement.Hourly = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Hourly)) {
                newElement.Hourly = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Hourly + '', { no_symbols: true }) || depositLimit.Hourly + '' <= 0) {
                newElement.Hourly = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        if (validator.isEmpty(depositLimit.Daily + "", { ignore_whitespace: true })) {
            newElement.Daily = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Daily + '')) {
            if (isScriptTag(depositLimit.Daily)) {
                newElement.Daily = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Daily)) {
                newElement.Daily = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Daily + '', { no_symbols: true }) || depositLimit.Daily + '' <= 0) {
                newElement.Daily = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        if (validator.isEmpty(depositLimit.Weekly + "", { ignore_whitespace: true })) {
            newElement.Weekly = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Weekly + '')) {
            if (isScriptTag(depositLimit.Weekly)) {
                newElement.Weekly = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Weekly)) {
                newElement.Weekly = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Weekly + '', { no_symbols: true }) || depositLimit.Weekly + '' <= 0) {
                newElement.Weekly = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        if (validator.isEmpty(depositLimit.Monthly + "", { ignore_whitespace: true })) {
            newElement.Monthly = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Monthly + '')) {
            if (isScriptTag(depositLimit.Monthly)) {
                newElement.Monthly = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Monthly)) {
                newElement.Monthly = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Monthly + '', { no_symbols: true }) || depositLimit.Monthly + '' <= 0) {
                newElement.Monthly = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        if (validator.isEmpty(depositLimit.Qauterly + "", { ignore_whitespace: true })) {
            newElement.Qauterly = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Qauterly + '')) {
            if (isScriptTag(depositLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Qauterly)) {
                newElement.Qauterly = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Qauterly + '', { no_symbols: true }) || depositLimit.Qauterly + '' <= 0) {
                newElement.Qauterly = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        if (validator.isEmpty(depositLimit.Yearly + "", { ignore_whitespace: true })) {
            newElement.Yearly = "wallet.errRequired";
            depositLimitFlag = true;
        } else if (!validator.isEmpty(depositLimit.Yearly + '')) {
            if (isScriptTag(depositLimit.Yearly)) {
                newElement.Yearly = "my_account.err.scriptTag";
                depositLimitFlag = true;
            } else if (isHtmlTag(depositLimit.Yearly)) {
                newElement.Yearly = "my_account.err.htmlTag";
                depositLimitFlag = true;
            } else if (!validator.isInt(depositLimit.Yearly + '', { no_symbols: true }) || depositLimit.Yearly + '' <= 0) {
                newElement.Yearly = "my_account.err.requireNumericField";
                depositLimitFlag = true;
            }
        }
        depositLimitError.splice(index, 0, newElement);
    });
    if (depositLimitFlag) {
        errors.depositLimit = depositLimitError;
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};