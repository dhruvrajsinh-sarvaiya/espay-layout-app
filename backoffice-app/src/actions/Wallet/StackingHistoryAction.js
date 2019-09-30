import {
    //Stacking History List
    GET_STAKINGHISTORY_LIST,
    GET_STAKINGHISTORYLIST_SUCCESS,
    GET_STAKINGHISTORYLIST_FAILURE,

    //clear data
    CLEAR_STAKINGHISTORY_DATA,
} from '../ActionTypes'

// Redux action get Charges Collected List
export const getStakingHistoryList = (request) => ({
    type: GET_STAKINGHISTORY_LIST,
    payload: request
});
// Redux action get Charges Collected List success
export const getStakingHistoryListSuccess = (response) => ({
    type: GET_STAKINGHISTORYLIST_SUCCESS,
    payload: response
});
// Redux action get Charges Collected List Failure
export const getStakingHistoryListFailure = (error) => ({
    type: GET_STAKINGHISTORYLIST_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearStackingHistoryData = () => ({
    type: CLEAR_STAKINGHISTORY_DATA,
});