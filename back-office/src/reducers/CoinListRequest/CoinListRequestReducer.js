/* 
    Createdby : dhara gajera
    CreatedDate : 9-01-2019
    Description : coin list request data Reducer action manager
*/
// action types
import {
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    GET_COINLIST_FIELDS,
    GET_COINLIST_FIELDS_SUCCESS,
    GET_COINLIST_FIELDS_FAILURE,

    UPDATE_COINLIST_FIELDS,
    UPDATE_COINLIST_FIELDS_SUCCESS,
    UPDATE_COINLIST_FIELDS_FAILURE,
} from 'Actions/types';

// initial state
const INITIAL_STATE = {
    coinRequest_list: [],
    coinFields_list: {},
    data: [],
    loading: false,
    errors: {},
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // get user coin list request
        case GET_COINLIST_REQUEST:
        // get coin list fields
        case GET_COINLIST_FIELDS:
            return { ...state, loading: true, data: [], coinFields_list: [] };

        // get user coin list request success
        case GET_COINLIST_REQUEST_SUCCESS:
            return { ...state, loading: false, data: [], coinRequest_list: action.payload };

        //  get user coin list request failure
        case GET_COINLIST_REQUEST_FAILURE:
        // get coin list fields failure
        case GET_COINLIST_FIELDS_FAILURE:
        case UPDATE_COINLIST_FIELDS_SUCCESS:
        case UPDATE_COINLIST_FIELDS_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // get coin list fields success
        case GET_COINLIST_FIELDS_SUCCESS:
            return { ...state, loading: false, data: [], coinFields_list: action.payload };

        // Update coin list fields Data
        case UPDATE_COINLIST_FIELDS:
            return { ...state, loading: true, data: [] };

        default: return { ...state };
    }
}
