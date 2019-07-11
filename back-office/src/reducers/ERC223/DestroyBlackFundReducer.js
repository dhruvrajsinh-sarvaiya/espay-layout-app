/* 
    Developer : Vishva shah
    Date : 03-06-2019
    File Comment : Destroy black fund Reducer
*/
import {
    //Destroy black fund list
    GET_DESTROYBLACKFUND_LIST,
    GET_DESTROYBLACKFUND_LIST_SUCCESS,
    GET_DESTROYBLACKFUND_LIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    destroyList: []
}
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // Destroy black fund list...
        case GET_DESTROYBLACKFUND_LIST:
            return { ...state, loading: true };
        case GET_DESTROYBLACKFUND_LIST_SUCCESS:
            return { ...state, loading: false, destroyList: action.payload.Data };
        case GET_DESTROYBLACKFUND_LIST_FAILURE:
            return { ...state, loading: false, destroyList: [] };
        default:
            return { ...state };
    }
}