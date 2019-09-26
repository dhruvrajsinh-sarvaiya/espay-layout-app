import { action } from "../GlobalActions";
import {
    //KYC Verify List
    GET_KYC_VERIFY_LIST,
    GET_KYC_VERIFY_LIST_SUCCESS,
    GET_KYC_VERIFY_LIST_FAILURE,

    //Edit KYC Verify List
    EDIT_KYC_VERIFY_STATUS,
    EDIT_KYC_VERIFY_STATUS_SUCCESS,
    EDIT_KYC_VERIFY_STATUS_FAILURE,

    //clear data
    CLEAR_KYC_STATUS_DATA
} from "../ActionTypes";

/* Action for KYC Verify List  */
export function getKycVerifyList(payload) {
    /* for loading */
    return action(GET_KYC_VERIFY_LIST, { payload })
}
export function getKycVerifyListSuccess(data) {
    /* for success call */
    return action(GET_KYC_VERIFY_LIST_SUCCESS, { data })
}
export function getKycVerifyListFailure() {
    /* for failure call */
    return action(GET_KYC_VERIFY_LIST_FAILURE)
}

/* Action for Edit KYC Status Verify   */
export function editKycStatus(payload) {
    /* for loading */
    return action(EDIT_KYC_VERIFY_STATUS, { payload })
}
export function editKycStatusSuccess(data) {
    /* for success call */
    return action(EDIT_KYC_VERIFY_STATUS_SUCCESS, { data })
}
export function editKycStatusFailure() {
    /* for failure call */
    return action(EDIT_KYC_VERIFY_STATUS_FAILURE)
}

/* Action for Clear KYC Status */
export function clearKycStatus() {
    /* for loading */
    return action(CLEAR_KYC_STATUS_DATA)
}