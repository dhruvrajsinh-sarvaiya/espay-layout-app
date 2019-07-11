/**
 * IP History Reducers (code added by Parth Jani 17-9-2018)
 */
import {
    IP_HISTORY_LIST,
    IP_HISTORY_LIST_SUCCESS,
    IP_HISTORY_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial IP History
 */
const INIT_STATE = {
    data: [],
    loading: true
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        case IP_HISTORY_LIST:
            return { ...state, loading: true, data : '' };

        case IP_HISTORY_LIST_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case IP_HISTORY_LIST_FAILURE:
            return { ...state, loading: false, data : action.payload };
            
        default: 
            return { ...state };
    }
}
