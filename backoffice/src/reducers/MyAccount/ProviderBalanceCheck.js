/* 
    Developer : Salim Deraiya
    Date : 17-06-2019
    File Comment : Provider Balance Check Reducer
*/
import {
    // Get Provider Balance Check list...
    GET_PROVIDER_BALANCE_CHECK_LIST,
    GET_PROVIDER_BALANCE_CHECK_LIST_SUCCESS,
    GET_PROVIDER_BALANCE_CHECK_LIST_FAILURE,

    // Get Service Provider list...
    GET_SERVICE_PROVIDER_LIST,
    GET_SERVICE_PROVIDER_LIST_SUCCESS,
    GET_SERVICE_PROVIDER_LIST_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
    loading: false,
    lstPrvdBlaCheck: {},
    lstSrvPrvd: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Get Provider Balance Check list...
        case GET_PROVIDER_BALANCE_CHECK_LIST:
            return { ...state, loading: true, listPrvdBlaCheck: {} };
        case GET_PROVIDER_BALANCE_CHECK_LIST_SUCCESS:
            return { ...state, loading: false, listPrvdBlaCheck: action.payload };
        case GET_PROVIDER_BALANCE_CHECK_LIST_FAILURE:
            return { ...state, loading: false, listPrvdBlaCheck: action.payload };

        default:
            return { ...state };
    }
};