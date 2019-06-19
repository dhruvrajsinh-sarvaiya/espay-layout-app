/**
 * IP History Reducers (code added by Parth Jani 17-9-2018)
 */
import {
    IP_HISTORY_LIST,
    IP_HISTORY_LIST_SUCCESS,
    IP_HISTORY_LIST_FAIL,
} from 'Actions/types';

/**
 * initial IP History
 */
const INIT_STATE = {
    data: [],
    loading: true
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case IP_HISTORY_LIST:
            return { ...state, loading: true, data : '' };

        case IP_HISTORY_LIST_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case IP_HISTORY_LIST_FAIL:
            return { ...state, loading: false, data : action.payload };
            
        default: 
            return { ...state };
    }
}
