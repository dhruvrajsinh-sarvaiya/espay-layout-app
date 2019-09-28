import {
    // Send Email Data
    SEND_EMAIL_DATA,
    SEND_EMAIL_DATA_SUCCESS,
    SEND_EMAIL_DATA_FAILURE,
    CLEAR_SEND_EMAIL_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Send Email Data
export function sendEmailData(payload = {}) {
    return action(SEND_EMAIL_DATA, { payload })
}

// Redux action for Send Email Data Success
export function sendEmailDataSuccess(data) {
    return action(SEND_EMAIL_DATA_SUCCESS, { data })
}

// Redux action for Send Email Data Failure
export function sendEmailDataFailure() {
    return action(SEND_EMAIL_DATA_FAILURE)
}

// Redux action for Clear Send Email Data
export function clearSendEmailData() {
    return action(CLEAR_SEND_EMAIL_DATA)
}