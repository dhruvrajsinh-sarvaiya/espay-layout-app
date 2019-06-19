import {
    GET_TRANSFEROUT,
    GET_TRANSFEROUT_SUCCESS,
    GET_TRANSFEROUT_FAILURE
} from "../types";

export const getTransferOut = (request) => ({
    type: GET_TRANSFEROUT,
    request: request
});

export const getTransferOutSuccess = (response) => ({
    type: GET_TRANSFEROUT_SUCCESS,
    payload: response
});

export const getTransferOutFailure = (error) => ({
    type: GET_TRANSFEROUT_FAILURE,
    payload: error
});
