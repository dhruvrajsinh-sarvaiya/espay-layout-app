import {
    //email api manager data
    GET_EMAIL_API_MANAGER_LIST,
    GET_EMAIL_API_MANAGER_LIST_SUCCESS,
    GET_EMAIL_API_MANAGER_LIST_FAILURE,

    //add email api manager
    ADD_EMAIL_API_MANAGER,
    ADD_EMAIL_API_MANAGER_SUCCESS,
    ADD_EMAIL_API_MANAGER_FAILURE,

    //edit email api manager
    EDIT_EMAIL_API_MANAGER,
    EDIT_EMAIL_API_MANAGER_SUCCESS,
    EDIT_EMAIL_API_MANAGER_FAILURE,

    //get request format
    GET_REQUEST_FORMAT,
    GET_REQUEST_FORMAT_SUCCESS,
    GET_REQUEST_FORMAT_FAILURE,

    //get all third party api response
    GET_ALL_THIRD_PARTY_RESPONSE,
    GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS,
    GET_ALL_THIRD_PARTY_RESPONSE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_API_MANAGER_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {

    //email api manager list 
    emailApiData: null,
    emailApiDataFetching: false,

    //add email api manager  
    addEmailApiData: null,
    addEmailApiDataFetching: false,

    //edit email api manager  
    editEmailApiData: null,
    editEmailApiDataFetching: false,

    //request format
    requestFormatData: null,
    requestFormatDataFetching: false,

    //third party api response
    thirdPartyApiResponseData: null,
    thirdPartyApiResponseDataFetching: false,
}

export default function ApiManagerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_API_MANAGER_DATA:
            return INITIAL_STATE

        //email api manager list 
        case GET_EMAIL_API_MANAGER_LIST:
            return { ...state, emailApiDataFetching: true, emailApiData: null };
        //email api manager list  success
        case GET_EMAIL_API_MANAGER_LIST_SUCCESS:
            return { ...state, emailApiDataFetching: false, emailApiData: action.payload };
        //email api manager list  failure
        case GET_EMAIL_API_MANAGER_LIST_FAILURE:
            return { ...state, emailApiDataFetching: false, emailApiData: action.payload };

        //add email api manager 
        case ADD_EMAIL_API_MANAGER:
            return { ...state, addEmailApiDataFetching: true, addEmailApiData: null };
        //add email api manager successs
        case ADD_EMAIL_API_MANAGER_SUCCESS:
            return { ...state, addEmailApiDataFetching: false, addEmailApiData: action.payload };
        //add email api manager failure
        case ADD_EMAIL_API_MANAGER_FAILURE:
            return { ...state, addEmailApiDataFetching: false, addEmailApiData: action.payload };

        //edit email api manager 
        case EDIT_EMAIL_API_MANAGER:
            return { ...state, editEmailApiDataFetching: true, editEmailApiData: null };
        //edit email api manager success
        case EDIT_EMAIL_API_MANAGER_SUCCESS:
            return { ...state, editEmailApiDataFetching: false, editEmailApiData: action.payload };
        //edit email api manager failure
        case EDIT_EMAIL_API_MANAGER_FAILURE:
            return { ...state, editEmailApiDataFetching: false, editEmailApiData: action.payload };

        //request format 
        case GET_REQUEST_FORMAT:
            return { ...state, requestFormatDataFetching: true, requestFormatData: null };
        //request format success
        case GET_REQUEST_FORMAT_SUCCESS:
            return { ...state, requestFormatDataFetching: false, requestFormatData: action.payload };
        //request format failure
        case GET_REQUEST_FORMAT_FAILURE:
            return { ...state, requestFormatDataFetching: false, requestFormatData: action.payload };

        //third party api response 
        case GET_ALL_THIRD_PARTY_RESPONSE:
            return { ...state, thirdPartyApiResponseDataFetching: true, thirdPartyApiResponseData: null };
        //third party api response success
        case GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS:
            return { ...state, thirdPartyApiResponseDataFetching: false, thirdPartyApiResponseData: action.payload };
        //third party api response failure
        case GET_ALL_THIRD_PARTY_RESPONSE_FAILURE:
            return { ...state, thirdPartyApiResponseDataFetching: false, thirdPartyApiResponseData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}