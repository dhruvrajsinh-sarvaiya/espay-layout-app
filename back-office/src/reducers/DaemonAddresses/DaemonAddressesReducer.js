/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    File Comment : Daemon Addressses Listing Reducer 
*/
import {
    //list...
    GET_DAEMON_ADDRESSES,
    GET_DAEMON_ADDRESSES_SUCCESS,
    GET_DAEMON_ADDRESSES_FAILURE,
    //import
    IMPORT_ADDRESSES,
    IMPORT_ADDRESSES_SUCCESS,
    IMPORT_ADDRESSES_FAILURE,
    //export
    EXPORT_ADDRESSES,
    EXPORT_ADDRESSES_SUCCESS,
    EXPORT_ADDRESSES_FAILURE,

    CONFIRM_ADD_EXPORT,
    CONFIRM_ADD_EXPORT_SUCCESS,
    CONFIRM_ADD_EXPORT_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    addresses: [],
    TotalCount: 0,
    response: {},
    exportResponse: {},
    loading: false,
    expFile: {},
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //list...
        case GET_DAEMON_ADDRESSES:
            return { ...state, loading: true, response: {}, exportResponse: {}, expFile: {} };
        case GET_DAEMON_ADDRESSES_SUCCESS:
            return { ...state, loading: false, addresses: action.payload.Data, TotalCount: action.payload.TotalCount };
        case GET_DAEMON_ADDRESSES_FAILURE:
            return { ...state, loading: false, addresses: [], TotalCount: 0 };
        //import...
        case IMPORT_ADDRESSES:
        case EXPORT_ADDRESSES:
            return { ...state, loading: true, response: {}, exportResponse: {} };
        case IMPORT_ADDRESSES_SUCCESS:
        case IMPORT_ADDRESSES_FAILURE:
            return { ...state, loading: false, response: action.payload };
        //export
        case EXPORT_ADDRESSES_SUCCESS:
        case EXPORT_ADDRESSES_FAILURE:
            return { ...state, loading: false, exportResponse: action.payload };
        // confirm address export
        case CONFIRM_ADD_EXPORT:
            return { ...state, loading: true, expFile: {} };
        case CONFIRM_ADD_EXPORT_SUCCESS:
        case CONFIRM_ADD_EXPORT_FAILURE:
            return { ...state, loading: false, expFile: action.payload };

        default:
            return { ...state };
    }
};
