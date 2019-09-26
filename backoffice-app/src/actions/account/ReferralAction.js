import {
    //for Refferal Reward List
    GET_REFERRAL_LIST,
    GET_REFERRAL_LIST_SUCCESS,
    GET_REFERRAL_LIST_FAILURE,

    //for Edt Refferal 
    EDIT_REFERRAL,
    EDIT_REFERRAL_SUCCESS,
    EDIT_REFERRAL_FAILURE,

    //for Add Refferal 
    ADD_REFERRAL,
    ADD_REFERRAL_SUCCESS,
    ADD_REFERRAL_FAILURE,

    //for Enable Refferal Status
    ENABLE_REFERRAL_STATUS,
    ENABLE_REFERRAL_STATUS_SUCCESS,
    ENABLE_REFERRAL_STATUS_FAILURE,

    //for Disable Refferal Status
    DISABLE_REFERRAL_STATUS,
    DISABLE_REFERRAL_STATUS_SUCCESS,
    DISABLE_REFERRAL_STATUS_FAILURE,

    //for Clear Refferal
    CLEAR_REFFERAL,

    //for Refferal PayType
    REFERRAL_PAY_TYPE,
    REFERRAL_PAY_TYPE_SUCCESS,
    REFERRAL_PAY_TYPE_FAILURE,

    //for Refferal ServiceType
    REFERRAL_SERVICE_TYPE,
    REFERRAL_SERVICE_TYPE_SUCCESS,
    REFERRAL_SERVICE_TYPE_FAILURE,
} from "../ActionTypes";

//for get Referral Reward List
export const getreferralList = data => ({
    type: GET_REFERRAL_LIST,
    payload: data
});
//for get Referral Reward List success
export const referralListSuccess = list => ({
    type: GET_REFERRAL_LIST_SUCCESS,
    payload: list
});
//for get Referral Reward List failure
export const referralListFailure = error => ({
    type: GET_REFERRAL_LIST_FAILURE,
    payload: error
});

//for Referral Enable
export const enableStatus = payload => ({
    type: ENABLE_REFERRAL_STATUS,
    payload: payload
});
//for Referral Enable success
export const enableStatusSuccess = data => ({
    type: ENABLE_REFERRAL_STATUS_SUCCESS,
    payload: data
});
//for Referral Enable failure
export const enableStatusFailure = error => ({
    type: ENABLE_REFERRAL_STATUS_FAILURE,
    payload: error
});

//for Referral Disable
export const disableStatus = payload => ({
    type: DISABLE_REFERRAL_STATUS,
    payload: payload
});
//for Referral Disable success
export const disableStatusSuccess = data => ({
    type: DISABLE_REFERRAL_STATUS_SUCCESS,
    payload: data
});
//for Referral Disable failure
export const disableStatusFailure = error => ({
    type: DISABLE_REFERRAL_STATUS_FAILURE,
    payload: error
});

//for Referral Edit
export const editReferral = data => ({
    type: EDIT_REFERRAL,
    payload: data
});
//for Referral Edit success
export const editReferralSuccess = data => ({
    type: EDIT_REFERRAL_SUCCESS,
    payload: data
});
//for Referral Edit failure
export const editReferralFailure = error => ({
    type: EDIT_REFERRAL_FAILURE,
    payload: error
});

//for Referral Add
export const addRefferal = data => ({
    type: ADD_REFERRAL,
    payload: data
});
//for Referral Add success
export const addRefferalSuccess = data => ({
    type: ADD_REFERRAL_SUCCESS,
    payload: data
});
//for Referral Add failure
export const addRefferalFailure = error => ({
    type: ADD_REFERRAL_FAILURE,
    payload: error
});

//for Referral Referral ServiceType
export const getRefferalServiceType = () => ({
    type: REFERRAL_SERVICE_TYPE
});
//for Referral Referral ServiceType success
export const getRefferalServiceTypeSuccess = response => ({
    type: REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
//for Referral Referral ServiceType failure
export const getRefferalServiceTypeFailure = error => ({
    type: REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

//for Referral Referral PayType
export const getRefferalPayType = () => ({
    type: REFERRAL_PAY_TYPE
});
//for Referral Referral PayType success
export const getRefferalPayTypeSuccess = response => ({
    type: REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
//for Referral Referral PayType failure
export const getRefferalPayTypeFailure = error => ({
    type: REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

//for Referral Reducer Data Clear
export const clearRefferal = () => ({
    type: CLEAR_REFFERAL,
});




