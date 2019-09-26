import {
    //unstaking requests List
    GET_LIST_PENDING_REQUEST,
    GET_LIST_PENDING_REQUEST_SUCCESS,
    GET_LIST_PENDING_REQUEST_FAILURE,

    //unstaking requests accept reject
    ACCEPTREJECT_UNSTAKING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE,

    //for clear response
    CLEAR_UNSTAKING_REQUEST_DATA
} from '../ActionTypes'

// Redux action Get unstaking requests List Action
export const getListPendingRequest = (request) => ({
    type: GET_LIST_PENDING_REQUEST,
    payload: request
});
// Redux action Get unstaking requests List success
export const getListPendingRequestSuccess = response => ({
    type: GET_LIST_PENDING_REQUEST_SUCCESS,
    payload: response
});
// Redux action Get unstaking requests List failure
export const getListPendingRequestFailure = error => ({
    type: GET_LIST_PENDING_REQUEST_FAILURE,
    payload: error
});

//Redux action Accept reject request
export const AccepetRejectRequest = (request) => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST,
    payload: request
});
//Redux action Accept reject request success
export const AccepetRejectRequestSuccess = response => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    payload: response
});
//Redux action Accept reject request failure
export const AccepetRejectRequestFailure = error => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearUnstaking = () => ({
    type: CLEAR_UNSTAKING_REQUEST_DATA,
});




