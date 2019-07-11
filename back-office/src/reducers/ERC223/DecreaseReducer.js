/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Decrease Reducer
*/
import {
    //decrease token supply
    DECREASE_TOKENSUPPLY,
    DECREASE_TOKENSUPPLY_SUCCESS,
    DECREASE_TOKENSUPPLY_FAILURE,
    // decrease token list
    GET_DECREASE_TOKENSUPPLY_LIST,
    GET_DECREASE_TOKENSUPPLY_LIST_SUCCESS,
    GET_DECREASE_TOKENSUPPLY_LIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    TotalCount: 0,
    Decrease: [],
    DecreaseList: []
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // decrease...
        case DECREASE_TOKENSUPPLY:
        case GET_DECREASE_TOKENSUPPLY_LIST:
            return { ...state, loading: true };
        case DECREASE_TOKENSUPPLY_SUCCESS:
        case DECREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Decrease: action.payload };

        // decrease list...
        case GET_DECREASE_TOKENSUPPLY_LIST_SUCCESS:
            return { ...state, loading: false, DecreaseList: action.payload.Data };
        case GET_DECREASE_TOKENSUPPLY_LIST_FAILURE:
            return { ...state, loading: false, DecreaseList: [] };
        default:
            return { ...state };
    }
}