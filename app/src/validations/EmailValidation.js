//To Check Enter Email is Valid or Not
export function CheckEmailValidation(Email) {
    try {
        //regex for Email validation
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //To check if user input anything or not
        if (Email) {
            //if regex is success then store new input 
            if (regex.test(Email)) {
                return false;
            }
            return true;
        }
    } catch (error) {
        //logger(error.message)
        return true;
    }
}