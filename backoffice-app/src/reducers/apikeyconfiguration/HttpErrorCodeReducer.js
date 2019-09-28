// HttpErrorCodeReducer.js
import {
    // for Http Error Code Data
    GET_HTTP_ERROR_CODE_LIST,
    GET_HTTP_ERROR_CODE_LIST_SUCCESS,
    GET_HTTP_ERROR_CODE_LIST_FAILURE,

    // for Clear Http Error Code Data
    CLEAR_HTTP_ERROR_CODE_LIST,

    // Action Logout
    ACTION_LOGOUT,

} from "../../actions/ActionTypes";

// Initial State for Http Error Code Data
const INITIAL_STATE = {

    // for Http Error Code Data
    HttpErrorCodeList: null,
    HttpErrorCodeListLoading: false,
}

export default function HttpErrorCodeReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Http Error Code method data
        case GET_HTTP_ERROR_CODE_LIST:
            return Object.assign({}, state, {
                HttpErrorCodeList: null,
                HttpErrorCodeListLoading: true
            })

        // Set Http Error Code success data
        case GET_HTTP_ERROR_CODE_LIST_SUCCESS:
            return Object.assign({}, state, {
                HttpErrorCodeList: action.data,
                HttpErrorCodeListLoading: false,
            })

        // Set Http Error Code failure data
        case GET_HTTP_ERROR_CODE_LIST_FAILURE:
            return Object.assign({}, state, {
                HttpErrorCodeList: null,
                HttpErrorCodeListLoading: false,
            })

        // for Clear Http Error Code Data
        case CLEAR_HTTP_ERROR_CODE_LIST:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}