/* 
    Developer : Vishva shah
    Date : 13-06-2019
    File Comment : Analytic Graph reducer
*/
import {
    //list
    GET_ANALYTICSGRAPH_RECORD,
    GET_ANALYTICSGRAPH_RECORD_SUCCESS,
    GET_ANALYTICSGRAPH_RECORD_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
    loading: false,
    analyticData: {},
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    switch (action.type) {
        case GET_ANALYTICSGRAPH_RECORD:
            return { ...state, loading: true, analyticData : {} }
        case GET_ANALYTICSGRAPH_RECORD_SUCCESS:
            return { ...state, loading: false, analyticData: action.payload }
        case GET_ANALYTICSGRAPH_RECORD_FAILURE:
            return { ...state, loading: false, analyticData: action.payload }

        default:
            return { ...state };
    }
}