//To Allow only Digits and only one decimal Point in Edit Text
//Also handle Condition to enter max. 8 digits after decimal point
export function CheckAmountValidation(Amount) {
    try {
        //regex for #.######## validation
        let regex = /^\d+(\.\d{0,8})?$/;

        //To check if user input anything or not
        if (Amount) {

            //If input contains 0 then length will be 19 otherwise 18
            let length = Amount.indexOf('.') == -1 ? 18 : 19;

            //if length validate success then match with regex and if regex is success then store new input 
            if (Amount.length <= length && regex.test(Amount)) {
                return Amount;
            }
        } else {
            //If user erase all input then set empty input
            return '';
        }
        return null;
    } catch (error) {
        //logger(error.message)
        return null;
    }
}