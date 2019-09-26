// ApiPlanConfigHistoryReducer.js
import {
    // Action Logout
    ACTION_LOGOUT,

    // for  Api Plan Configuration History
    GET_API_PLAN_CONFIG_HISTORY,
    GET_API_PLAN_CONFIG_HISTORY_SUCCESS,
    GET_API_PLAN_CONFIG_HISTORY_FAILURE,

    // User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Api Plan Configuration List
    GET_API_PLAN_CONFIG_LIST,
    GET_API_PLAN_CONFIG_LIST_SUCCESS,
    GET_API_PLAN_CONFIG_LIST_FAILURE,

    // for clear Api Plan Configuration History
    CLEAR_API_PLAN_CONFIG_HISTORY
} from '../../actions/ActionTypes';

// Initial State for Api Key Dashboard Count
const INITIAL_STATE = {

    // for Api Plan Configuration History
    ApiPlanConfigHistoryList: null,
    ApiPlanConfigHistoryListLoading: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,

    // for Api Key Dashboard Count
    ApiPlanConfigList: null,
    ApiPlanConfigListLoading: false,
}

export default function ApiPlanConfigHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Plan Configuration method data
        case GET_API_PLAN_CONFIG_LIST:
            return Object.assign({}, state, {
                ApiPlanConfigList: null,
                ApiPlanConfigListLoading: true
            })
        // Set Api Plan Configuration success data
        case GET_API_PLAN_CONFIG_LIST_SUCCESS:
            return Object.assign({}, state, {
                ApiPlanConfigList: action.data,
                ApiPlanConfigListLoading: false,
            })
        // Set Api Plan Configuration failure data
        case GET_API_PLAN_CONFIG_LIST_FAILURE:
            return Object.assign({}, state, {
                ApiPlanConfigList: null,
                ApiPlanConfigListLoading: false,
            })

        // Handle Get User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: true
            })
        // Set Get User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataListLoading: false,
            })
        // Set Get User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: false,
            })

        // Handle Api Plan Configuration History method data
        case GET_API_PLAN_CONFIG_HISTORY:
            return Object.assign({}, state, {
                ApiPlanConfigHistoryList: null,
                ApiPlanConfigHistoryListLoading: true
            })
        // Set Api Plan Configuration History success data
        case GET_API_PLAN_CONFIG_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                ApiPlanConfigHistoryList: action.data,
                ApiPlanConfigHistoryListLoading: false,
            })
        // Set Api Plan Configuration History failure data
        case GET_API_PLAN_CONFIG_HISTORY_FAILURE:
            return Object.assign({}, state, {
                ApiPlanConfigHistoryList: null,
                ApiPlanConfigHistoryListLoading: false,
            })

        // Clear Api Plan Configuration method data
        case CLEAR_API_PLAN_CONFIG_HISTORY:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}