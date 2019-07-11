/* 
    Developer : Vishva Shah
    Date : 18-02-2019
    File Comment : LeverageConfig Reducer
*/
import {
    // list...
    LISTLEVERAGE,
    LISTLEVERAGE_SUCCESS,
    LISTLEVERAGE_FAILURE,
    // remove...
    REMOVELEVERAGE,
    REMOVELEVERAGE_SUCCESS,
    REMOVELEVERAGE_FAILURE,
    // insert update...
    INSERTUPDATELEVERAGE,
    INSERTUPDATELEVERAGE_SUCCESS,
    INSERTUPDATELEVERAGE_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    LeverageList: [],
    removeRecord: {},
    insertUpdateResponse: {},
}

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE 
    }
    switch (action.type) {
        // list...
        case LISTLEVERAGE:
            return { ...state, loading: true, insertUpdateResponse: {}, removeRecord: {} };
        case LISTLEVERAGE_SUCCESS:
            return { ...state, loading: false, LeverageList: action.payload.Data, insertUpdateResponse: {} };
        case LISTLEVERAGE_FAILURE:
            return { ...state, loading: false, LeverageList: [], insertUpdateResponse: {} };

        // remove ..
        case REMOVELEVERAGE:
            return { ...state, loading: true, removeRecord: {}, insertUpdateResponse: {} };
        case REMOVELEVERAGE_SUCCESS:
        case REMOVELEVERAGE_FAILURE:
            return { ...state, loading: false, removeRecord: action.payload };

        // insert update..
        case INSERTUPDATELEVERAGE:
            return { ...state, loading: true, insertUpdateResponse: {}, removeRecord: {} };
        case INSERTUPDATELEVERAGE_SUCCESS:
        case INSERTUPDATELEVERAGE_FAILURE:
            return { ...state, loading: false, insertUpdateResponse: action.payload };

        default:
            return { ...state };
    }
}
