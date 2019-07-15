//To Check Enter Email is Valid or Not
export function CheckEmailValidation(Email) {
    try {
        //regex for Email validation
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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