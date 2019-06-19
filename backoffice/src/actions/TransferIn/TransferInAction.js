import {
    GET_TRANSFERIN,
    GET_TRANSFERIN_SUCCESS,
    GET_TRANSFERIN_FAILURE
} from "../types";

export const getTransferIn = (request) => ({
    type: GET_TRANSFERIN,
    request: request
});

export const getTransferInSuccess = (response) => ({
    type: GET_TRANSFERIN_SUCCESS,
    payload: response
});

export const getTransferInFailure = (error) => ({
    type: GET_TRANSFERIN_FAILURE,
    payload: error
});
