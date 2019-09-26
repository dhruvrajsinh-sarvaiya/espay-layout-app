import {
    // Get Profit loss Report List
    GET_PROFITLOSS_LIST,
    GET_PROFITLOSS_LIST_SUCCESS,
    GET_PROFITLOSS_LIST_FAILURE,

    // clear Profit loss data
    CLEAR_PROFITLOSS_DATA
} from "../ActionTypes";

// Redux action for Profit loss Report List
export const getProfitLossList = data => ({
    type: GET_PROFITLOSS_LIST,
    payload: data
});

// Redux action for Profit loss Report List Success
export const getProfitLossListSuccess = response => ({
    type: GET_PROFITLOSS_LIST_SUCCESS,
    payload: response
});

// Redux action for Profit loss Report List Failure
export const getProfitLossListFailure = error => ({
    type: GET_PROFITLOSS_LIST_FAILURE,
    payload: error
});

//clear Profitlossdata
export const clearProfitLossData = () => ({
    type: CLEAR_PROFITLOSS_DATA,
});

