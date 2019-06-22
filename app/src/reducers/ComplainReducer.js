// Action types for Complain Module
import {
    // List Complain
    LIST_COMPLAIN,
    LIST_COMPLAIN_SUCCESS,
    LIST_COMPLAIN_FAILURE,

    // Add Complain
    ADD_COMPLAIN,
    ADD_COMPLAIN_SUCCESS,
    ADD_COMPLAIN_FAILURE,
    ADD_COMPLAIN_CLEAR,

    // Get Complain By ID
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_BY_ID_SUCCESS,
    GET_COMPLAIN_BY_ID_FAILURE,

    //Replay Complain
    REPLAY_COMPLAIN,
    REPLAY_COMPLAIN_SUCCESS,
    REPLAY_COMPLAIN_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Reply Send 
    REPLAY_SEND,
    REPLAY_SEND_SUCCESS,
    REPLAY_SEND_FAILURE,
    REPLAY_SEND_CLEAR,

    // Get Complain
    GET_COMPLAIN_TYPE,
    GET_COMPLAIN_TYPE_SUCCESS,
    GET_COMPLAIN_TYPE_FAILURE,

    // Clear Complain Data
    CLEAR_COMPLAIN_DATA
} from '../actions/ActionTypes';

// Initial State for Complaint Module
const initialState = {
    // Complain List
    loading: false,
    data: [],
    list: [],
    complainListFetchData: true,
    complainisFetching: false,
    /// list: '',

    // Reply Send
    ReplySendData: null,
    ReplySendLoading: false,
    ReplySendError: false,

    // Add Complain
    AddComplaintData: null,
    AddComplaintLoading: false,
    AddComplaintError: false,

    // Complain Type
    ComplaintTypeData: null,
    ComplaintTypeLoading: false,
    ComplaintTypeError: false,

    // Reply Complain
    ReplyComplaintData: null,
    ReplyComplaintLoading: false,
    ReplyComplaintError: false,

    // Complain By id
    ComplaintByIdData: null,
    ComplaintByIdError: false,
    ComplaintByIdLoading: false,
}

export default (state = initialState, action) => {

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle complain list method data
        case LIST_COMPLAIN:
            return {
                ...state,
                complainisFetching: true,
                list: null,
                complainListFetchData: true,
            }
        // Set complain list success data
        case LIST_COMPLAIN_SUCCESS:
            return {
                ...state,
                complainisFetching: false,
                list: action.payload,
                complainListFetchData: false,
            }
        // Set complain list failure data
        case LIST_COMPLAIN_FAILURE:
            return {
                ...state,
                complainisFetching: false,
                list: null,
                complainListFetchData: false,
            }

        // Handle add complain method data
        case ADD_COMPLAIN:
            return {
                ...state,
                AddComplaintLoading: true
            };
        // Set add complain success data
        case ADD_COMPLAIN_SUCCESS:
            return {
                ...state,
                AddComplaintLoading: false,
                AddComplaintData: action.payload
            };
        // Set add complain failure data
        case ADD_COMPLAIN_FAILURE:
            return {
                ...state,
                AddComplaintLoading: false,
                AddComplaintError: true
            };
        // Clear add complain data
        case ADD_COMPLAIN_CLEAR:
            return {
                ...state,
                AddComplaintLoading: false,
                AddComplaintData: null
            };

        // Handle Complain By ID method data
        case GET_COMPLAIN_BY_ID:
            return {
                ...state,
                ComplaintByIdLoading: true,
                ComplaintByIdData: null,
                ReplySendData: null
            };
        // Set Complain By ID success data
        case GET_COMPLAIN_BY_ID_SUCCESS:
            return {
                ...state,
                ComplaintByIdLoading: false,
                ComplaintByIdData: action.payload
            };
        // Set Complain By ID failure data
        case GET_COMPLAIN_BY_ID_FAILURE:
            return {
                ...state,
                ComplaintByIdLoading: false,
                ComplaintByIdError: true
            };

        // Handle replay Complain method data
        case REPLAY_COMPLAIN:
            return {
                ...state,
                ReplyComplaintLoading: true,
                ReplyComplaintData: null
            };
        // Set replay Complain success data
        case REPLAY_COMPLAIN_SUCCESS:
            return {
                ...state,
                ReplyComplaintLoading: false,
                ReplyComplaintData: action.payload
            };
        // Set replay Complain failure data
        case REPLAY_COMPLAIN_FAILURE:
            return {
                ...state,
                ReplyComplaintLoading: false,
                ReplyComplaintError: true
            };

        // Handle reply send method data
        case REPLAY_SEND:
            return {
                ...state,
                ReplySendLoading: true,
                ReplySendData: null
            };
        // Set reply send success data
        case REPLAY_SEND_SUCCESS:
            return {
                ...state,
                ReplySendLoading: false,
                ReplySendData: action.payload
            };
        // Set reply send failure data
        case REPLAY_SEND_FAILURE:
            return {
                ...state,
                ReplySendLoading: false,
                ReplySendError: true
            };
        // Clear reply send data
        case REPLAY_SEND_CLEAR:
            return {
                ...state,
                ReplySendLoading: false,
                ReplySendData: null
            };

        // Handle complain type method data
        case GET_COMPLAIN_TYPE:
            return { 
                ...state, 
                ComplaintTypeLoading: true, 
                ComplaintTypeData: null, 
            };
        // Set complain type success data
        case GET_COMPLAIN_TYPE_SUCCESS:
            return { 
                ...state, 
                ComplaintTypeLoading: false, 
                ComplaintTypeData: action.data 
            };
        // Set complain type failure data
        case GET_COMPLAIN_TYPE_FAILURE:
            return { 
                ...state, 
                ComplaintTypeLoading: false, 
                ComplaintTypeData: null, 
                ComplaintTypeError: true 
            };

        // Clear complain data
        case CLEAR_COMPLAIN_DATA: {
            return initialState;
        }
        
        // If no actions were found from reducer than return default [existing] state value
        default:
            return { ...state, loading: false };
    }
}