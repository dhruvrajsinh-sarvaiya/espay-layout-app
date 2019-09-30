// MarketMakingActions.js
import {
    // for get Market Making List
    GET_MARKING_MAKING_LIST,
    GET_MARKING_MAKING_LIST_SUCCESS,
    GET_MARKING_MAKING_LIST_FAILURE,

    // for Change Market Making Status
    CHANGE_MARKING_MAKING_STATUS,
    CHANGE_MARKING_MAKING_STATUS_SUCCESS,
    CHANGE_MARKING_MAKING_STATUS_FAILURE,

    // for clear Data
    CLEAR_MARKING_MAKING_DATA
} from "../ActionTypes";
import { action } from '../GlobalActions';

//To get market making list
export function getMarketMakingList() {
    return action(GET_MARKING_MAKING_LIST);
}
//To get market making list success
export function getMarketMakingListSuccess(data) {
    return action(GET_MARKING_MAKING_LIST_SUCCESS, { data });
}
//To get market making list failure
export function getMarketMakingListFailure() {
    return action(GET_MARKING_MAKING_LIST_FAILURE);
}

//To change market making status
export function changeMarketMakingStatus(payload = {}) {
    return action(CHANGE_MARKING_MAKING_STATUS, { payload });
}

//To change market making status success
export function changeMarketMakingStatusSuccess(data) {
    return action(CHANGE_MARKING_MAKING_STATUS_SUCCESS, { data });
}

//To change market making status failure
export function changeMarketMakingStatusFailure() {
    return action(CHANGE_MARKING_MAKING_STATUS_FAILURE);
}

//To clear market making 
export function clearMarkeMakingData() {
    return action(CLEAR_MARKING_MAKING_DATA);
}