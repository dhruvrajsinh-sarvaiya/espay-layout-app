/* 
    Developer : Vishva shah
    Date : 23-05-2019
    File Comment : Staking History Report Reducer
*/
import {
    // list...
    GET_STAKINGHISTORY_LIST,
    GET_STAKINGHISTORYLIST_SUCCESS,
    GET_STAKINGHISTORYLIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    StakingHistoryList: [],
    TotalCount: 0
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list...
        case GET_STAKINGHISTORY_LIST:
            return { ...state, loading: true };
        case GET_STAKINGHISTORYLIST_SUCCESS:
            return { ...state, loading: false, StakingHistoryList: action.payload.Stakings, TotalCount: action.payload.TotalCount };
        case GET_STAKINGHISTORYLIST_FAILURE:
            return { ...state, loading: false, StakingHistoryList: [], TotalCount: 0 };

        default:
            return { ...state };
    }
}
