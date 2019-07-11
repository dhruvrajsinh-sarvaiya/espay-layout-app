import {
    // history list
    GET_STAKHISTORY,
    GET_STAKHISTORY_SUCCESS,
    GET_STAKHISTORY_FAILURE,
    // unstaking pre confirmation
    UNSTAKPRECONFIRMATION,
    UNSTAKPRECONFIRMATION_SUCCESS,
    UNSTAKPRECONFIRMATION_FAILURE,
    // unstaking request
    UNSTAKREQUEST,
    UNSTAKREQUEST_SUCCESS,
    UNSTAKREQUEST_FAILURE
} from '../types';

// staking history
export const getStakHistory = (payload) => ({
    type: GET_STAKHISTORY,
    request: payload
})
export const getStakHistorySuccess = (payload) => ({
    type: GET_STAKHISTORY_SUCCESS,
    payload: payload
})
export const getStakHistoryFailure = (error) => ({
    type: GET_STAKHISTORY_FAILURE,
    error: error
})

/* unstaking pre confirmation */
export const getUnstakingPreConfirmation = (request) => ({
    type: UNSTAKPRECONFIRMATION,
    request: request
})
export const getUnstakingPreConfirmationSuccess = (response) => ({
    type: UNSTAKPRECONFIRMATION_SUCCESS,
    payload: response
})
export const getUnstakingPreConfirmationFailure = (error) => ({
    type: UNSTAKPRECONFIRMATION_FAILURE,
    payload: error
})

// unstaking request
export const postUnstakRequest = (request) => ({
    type: UNSTAKREQUEST,
    request: request
})
export const postUnstakRequestSuccess = (response) => ({
    type: UNSTAKREQUEST_SUCCESS,
    payload: response
})
export const postUnstakRequestFailure = (error) => ({
    type: UNSTAKREQUEST_FAILURE,
    payload: error
})
