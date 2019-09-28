import {
    // Get License Detail
    GET_LICENSE_DETAIL,
    GET_LICENSE_DETAIL_SUCCESS,
    GET_LICENSE_DETAIL_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get License Detail
export function getLicenseDetail() {
    return action(GET_LICENSE_DETAIL)
}

// Redux action for Get License Detail Success
export function getLicenseDetailSuccess(data) {
    return action(GET_LICENSE_DETAIL_SUCCESS, { data })
}

// Redux action for Get License Detail Failure
export function getLicenseDetailFailure() {
    return action(GET_LICENSE_DETAIL_FAILURE)
}