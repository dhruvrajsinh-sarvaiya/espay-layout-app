import {
    // Action Logout
    ACTION_LOGOUT,

    // Total Complain Count
    TOTAL_COMPLAIN_COUNT,
    TOTAL_COMPLAIN_COUNT_SUCCESS,
    TOTAL_COMPLAIN_COUNT_FAILURE,

    // Get Complain List
    GET_COMPLAIN_LIST,
    GET_COMPLAIN_LIST_SUCCESS,
    GET_COMPLAIN_LIST_FAILURE,

    // Reply Compalin
    REPLY_COMPLAIN,
    REPLY_COMPLAIN_FAILURE,
    REPLY_COMPLAIN_SUCCESS,

    // Get Complain By Id
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_BY_ID_SUCCESS,
    GET_COMPLAIN_BY_ID_FAILURE,

    // Reply Clear Data
    REPLY_CLEAR_DATA,

    // Clear Complain Data
    CLEAR_COMPLAIN_DATA,
} from "../../actions/ActionTypes";

const INITIAL_STATE = {

    // For Total Complain Count
    TotalComplainCountData: null,
    TotalComplainCountLoading: false,
    TotalComplainCountError: false,

    // For Complain list
    ComplainListData: null,
    ComplainListLoading: false,
    ComplainListError: false,

    // For Complain Type
    ReplyComplainData: null,
    ReplyComplainLoading: false,
    ReplyComplainError: false,

    // For Complain By Id
    ComplainByIdData: null,
    ComplainByIdLoading: false,
    ComplainByIdError: false,
}

export default function HelpAndSupportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get total complaint method data
        case TOTAL_COMPLAIN_COUNT:
            return Object.assign({}, state, {
                TotalComplainCountData: null,
                TotalComplainCountLoading: true
            })
        // Set total complaint success data
        case TOTAL_COMPLAIN_COUNT_SUCCESS:
            return Object.assign({}, state, {
                TotalComplainCountData: action.data,
                TotalComplainCountLoading: false
            })
        // Set total complaint Failure data
        case TOTAL_COMPLAIN_COUNT_FAILURE:
            return Object.assign({}, state, {
                TotalComplainCountData: null,
                TotalComplainCountLoading: false,
                TotalComplainCountError: true
            })

        // Handle Get complaint list method data
        case GET_COMPLAIN_LIST:
            return Object.assign({}, state, {
                ComplainListData: null,
                ComplainListLoading: true
            })
        // Set complaint list success data
        case GET_COMPLAIN_LIST_SUCCESS:
            return Object.assign({}, state, {
                ComplainListData: action.data,
                ComplainListLoading: false
            })
        // Set complaint list Failure data
        case GET_COMPLAIN_LIST_FAILURE:
            return Object.assign({}, state, {
                ComplainListData: null,
                ComplainListLoading: false,
                ComplainListError: true
            })

        // Handle Get complaint list method data
        case REPLY_COMPLAIN:
            return Object.assign({}, state, {
                ReplyComplainData: null,
                ReplyComplainLoading: true
            })
        // Set complaint list success data
        case REPLY_COMPLAIN_SUCCESS:
            return Object.assign({}, state, {
                ReplyComplainData: action.data,
                ReplyComplainLoading: false
            })
        // Set complaint list Failure data
        case REPLY_COMPLAIN_FAILURE:
            return Object.assign({}, state, {
                ReplyComplainData: null,
                ReplyComplainLoading: false,
                ReplyComplainError: true
            })

        // Handle Get complaint by id method data
        case GET_COMPLAIN_BY_ID:
            return Object.assign({}, state, {
                ComplainByIdData: null,
                ComplainByIdLoading: true
            })
        // Set complaint by id success data
        case GET_COMPLAIN_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                ComplainByIdData: action.data,
                ComplainByIdLoading: false
            })
        // Set complaint by id failure data
        case GET_COMPLAIN_BY_ID_FAILURE:
            return Object.assign({}, state, {
                ComplainByIdData: null,
                ComplainByIdLoading: false,
                ComplainByIdError: true
            })

        //clear data replay
        case REPLY_CLEAR_DATA:
            return Object.assign({}, state, {
                ReplyComplainData: null,
                ReplyComplainLoading: false,
            })

        //clear data complain
        case CLEAR_COMPLAIN_DATA:
            return Object.assign({}, state, {
                ReplyComplainData: null,
                ComplainByIdData: null,
                ComplainListData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}