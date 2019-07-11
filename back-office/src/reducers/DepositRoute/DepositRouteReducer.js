/* 
    Developer : Nishant Vadgama
    Date : 31-01-2019
    File Comment : Deposit Routing Reducer
*/
import {
    // list...
    DEPOSITROUTELIST,
    DEPOSITROUTELIST_SUCCESS,
    DEPOSITROUTELIST_FAILURE,
    // insert update...
    INSERTUPDATEDEPOSITROUTE,
    INSERTUPDATEDEPOSITROUTE_SUCCESS,
    INSERTUPDATEDEPOSITROUTE_FAILURE,
    // remove...
    REMOVEDEPOSITROUTE,
    REMOVEDEPOSITROUTE_SUCCESS,
    REMOVEDEPOSITROUTE_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    TotalCount: 0,
    depositRouteList: [],
    insertUpdateResponse: {},
    removeResponse: {},
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list...
        case DEPOSITROUTELIST:
            return { ...state, loading: true, insertUpdateResponse: {}, removeResponse: {} };
        case DEPOSITROUTELIST_SUCCESS:
            return { ...state, loading: false, insertUpdateResponse: {}, depositRouteList: action.payload.Data, TotalCount: action.payload.TotalCount };
        case DEPOSITROUTELIST_FAILURE:
            return { ...state, loading: false, insertUpdateResponse: {}, depositRouteList: [], TotalCount: 0 };
        // insert update..
        case INSERTUPDATEDEPOSITROUTE:
            return { ...state, loading: true, insertUpdateResponse: {}, removeResponse: {} };
        case INSERTUPDATEDEPOSITROUTE_SUCCESS:
        case INSERTUPDATEDEPOSITROUTE_FAILURE:
            return { ...state, loading: false, insertUpdateResponse: action.payload };
        // remove ..
        case REMOVEDEPOSITROUTE:
            return { ...state, loading: true, removeResponse: {}, insertUpdateResponse: {} };
        case REMOVEDEPOSITROUTE_SUCCESS:
        case REMOVEDEPOSITROUTE_FAILURE:
            return { ...state, loading: false, removeResponse: action.payload };

        default:
            return { ...state };
    }
}
