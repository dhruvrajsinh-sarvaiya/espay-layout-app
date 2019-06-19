/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Increase Reducer
*/
import {
    // Increse token supply...
    INCREASE_TOKENSUPPLY,
    INCREASE_TOKENSUPPLY_SUCCESS,
    INCREASE_TOKENSUPPLY_FAILURE,
    //increase token list
    GET_INCREASE_TOKENSUPPLY_LIST,
    GET_INCREASE_TOKENSUPPLY_LIST_SUCCESS,
    GET_INCREASE_TOKENSUPPLY_LIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    Increase: [],
    TotalCount : 0,
    IncreaseList: []
    
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // increase...
        case INCREASE_TOKENSUPPLY:
            return { ...state, loading: true};
        case INCREASE_TOKENSUPPLY_SUCCESS:
            return { ...state, loading: false, Increase: action.payload};
        case INCREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Increase: action.payload};
             // increase token list...
        case GET_INCREASE_TOKENSUPPLY_LIST:
            return { ...state, loading: true};
        case GET_INCREASE_TOKENSUPPLY_LIST_SUCCESS:
            return { ...state, loading: false, IncreaseList: action.payload.Data};
        case GET_INCREASE_TOKENSUPPLY_LIST_FAILURE:
            return { ...state, loading: false, IncreaseList: []};
        default:
            return { ...state };
    }
}