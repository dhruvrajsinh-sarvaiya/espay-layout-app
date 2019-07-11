/* 
    Developer : Vishva shah
    Date : 15-04-2019
    File Comment : Service Provider Balance Reducer
*/
import {
    // list...
    GET_SERVICEPROVIDER_LIST,
    GET_SERVICEPROVIDERLIST_SUCCESS,
    GET_SERVICEPROVIDERLIST_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    ServiceProviderList: [],
}

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list...
        case GET_SERVICEPROVIDER_LIST:
            return { ...state, loading: true};
        case GET_SERVICEPROVIDERLIST_SUCCESS:
            return { ...state, loading: false, ServiceProviderList: action.payload.Data};
        case GET_SERVICEPROVIDERLIST_FAILURE:
            return { ...state, loading: false, ServiceProviderList: []};
    
        default:
            return { ...state };
    }
}
