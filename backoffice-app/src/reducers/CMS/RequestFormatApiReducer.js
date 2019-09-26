import {
    //get request format
    GET_REQUEST_FORMAT,
    GET_REQUEST_FORMAT_SUCCESS,
    GET_REQUEST_FORMAT_FAILURE,

    //add request format 
    ADD_REQUEST_FORMAT,
    ADD_REQUEST_FORMAT_SUCCESS,
    ADD_REQUEST_FORMAT_FAILURE,

    //edit request format
    EDIT_REQUEST_FORMAT,
    EDIT_REQUEST_FORMAT_SUCCESS,
    EDIT_REQUEST_FORMAT_FAILURE,

    //get all third party api response
    GET_APP_TYPE,
    GET_APP_TYPE_SUCCESS,
    GET_APP_TYPE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_REQUEST_FORMAT_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    //request format
    requestFormatData: null,
    requestFormatDataFetching: false,

    //add request format   
    addRequestFormatData: null,
    addRequestFormatFetching: false,

    //edit request format  
    editRequestFormatData: null,
    editRequestFormatFetching: false,

    //app type
    appTypeData: null,
    appTypeDataFetching: false,
}

export default function RequestFormatApiReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_REQUEST_FORMAT_DATA:
            return INITIAL_STATE

        //request format 
        case GET_REQUEST_FORMAT:
            return Object.assign({}, state, { requestFormatDataFetching: true, requestFormatData: null })
        //request format success
        case GET_REQUEST_FORMAT_SUCCESS:
            return Object.assign({}, state, { requestFormatDataFetching: false, requestFormatData: action.payload })
        //request format failure
        case GET_REQUEST_FORMAT_FAILURE:
            return Object.assign({}, state, { requestFormatDataFetching: false, requestFormatData: action.payload })

        //add request format  
        case ADD_REQUEST_FORMAT:
            return Object.assign({}, state, { addRequestFormatFetching: true, addRequestFormatData: null })
        //add request format  successs
        case ADD_REQUEST_FORMAT_SUCCESS:
            return Object.assign({}, state, { addRequestFormatFetching: false, addRequestFormatData: action.response })
        //add request format  failure
        case ADD_REQUEST_FORMAT_FAILURE:
            return Object.assign({}, state, { addRequestFormatFetching: false, addRequestFormatData: action.response })

        //edit request format 
        case EDIT_REQUEST_FORMAT:
            return Object.assign({}, state, { editRequestFormatFetching: true, editRequestFormatData: null })
        //edit request format success
        case EDIT_REQUEST_FORMAT_SUCCESS:
            return Object.assign({}, state, { editRequestFormatFetching: false, editRequestFormatData: action.response })
        //edit request format failure
        case EDIT_REQUEST_FORMAT_FAILURE:
            return Object.assign({}, state, { editRequestFormatFetching: false, editRequestFormatData: action.response })

        //app type 
        case GET_APP_TYPE:
            return Object.assign({}, state, { appTypeDataFetching: true, appTypeData: null })
        //app type success
        case GET_APP_TYPE_SUCCESS:
            return Object.assign({}, state, { appTypeDataFetching: false, appTypeData: action.payload })
        //app type failure
        case GET_APP_TYPE_FAILURE:
            return Object.assign({}, state, { appTypeDataFetching: false, appTypeData: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}