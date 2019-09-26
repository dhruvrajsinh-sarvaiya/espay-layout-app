import {
    //TokenTransfer
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_SUCCESS,
    GET_TOKEN_TRANSFER_FAILURE,
    //token transfer list
    GET_TOKEN_TRANSFER_LIST,
    GET_TOKEN_TRANSFER_LIST_SUCCESS,
    GET_TOKEN_TRANSFER_LIST_FAILURE,
    //for clear response
    CLEAR_TOKEN_TRANSFER_DATA
} from '../ActionTypes'

// Redux action Get TokenTransfer add 
export const getTokenTransfer = (payload) => ({
    type: GET_TOKEN_TRANSFER,
    payload: payload
});
// Redux action Get TokenTransfer add success 
export const getTokenTransferSuccess = (response) => ({
    type: GET_TOKEN_TRANSFER_SUCCESS,
    payload: response
});
// Redux action Get TokenTransfer add Failure 
export const getTokenTransferFailure = (error) => ({
    type: GET_TOKEN_TRANSFER_FAILURE,
    payload: error
});

// Redux action Get TokenTransfer List 
export const getTokenTransferlist = (payload) => ({
    type: GET_TOKEN_TRANSFER_LIST,
    payload: payload
});
// Redux action Get TokenTransfer List Succeess
export const getTokenTransferlistSuccess = (response) => ({
    type: GET_TOKEN_TRANSFER_LIST_SUCCESS,
    payload: response
});
// Redux action Get TokenTransfer List Failure
export const getTokenTransferlistFailure = (error) => ({
    type: GET_TOKEN_TRANSFER_LIST_FAILURE,
    payload: error
});

//Redux action  for clear response
export const ClearTokenTransferData = () => ({
    type: CLEAR_TOKEN_TRANSFER_DATA,
});


