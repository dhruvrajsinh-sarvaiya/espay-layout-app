import {
    ACTION_LOGOUT,

    // Get Api Plan Subscription History
    GET_API_PLAN_SUBSCRIPTION_HISTORY,
    GET_API_PLAN_SUBSCRIPTION_HISTORY_SUCCESS,
    GET_API_PLAN_SUBSCRIPTION_HISTORY_FAILURE,

    // Clear Api Plan Subscription History
    CLEAR_API_PLAN_SUBSCRIPTION_HISTORY,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Api Plan Configuration List
    GET_API_PLAN_CONFIG_LIST,
    GET_API_PLAN_CONFIG_LIST_SUCCESS,
    GET_API_PLAN_CONFIG_LIST_FAILURE,
} from "../../actions/ActionTypes";

// Initial State for Get Api Plan Subscription History
const INITIAL_STATE = {

    // Api Plan Subscription History
    ApiPlanSubscriptionHistoryData: null,
    ApiPlanSubscriptionHistoryLoading: false,
    ApiPlanSubscriptionHistoryError: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,
    UserDataListError: false,

    // for Get Api Plan Configuration List
    ApiPlanConfigList: null,
    ApiPlanConfigListLoading: false,
    ApiPlanConfigListError: false,
}

export default function ApiPlanSubscriptionHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Plan Subscription History method data
        case GET_API_PLAN_SUBSCRIPTION_HISTORY:
            return Object.assign({}, state, {
                ApiPlanSubscriptionHistoryData: null,
                ApiPlanSubscriptionHistoryLoading: true
            })
        // Set Api Plan Subscription History success data
        case GET_API_PLAN_SUBSCRIPTION_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                ApiPlanSubscriptionHistoryData: action.data,
                ApiPlanSubscriptionHistoryLoading: false,
            })
        // Set Api Plan Subscription History failure data
        case GET_API_PLAN_SUBSCRIPTION_HISTORY_FAILURE:
            return Object.assign({}, state, {
                ApiPlanSubscriptionHistoryData: null,
                ApiPlanSubscriptionHistoryLoading: false,
                ApiPlanSubscriptionHistoryError: true
            })

        // Handle Api Plan Subscription History method data
        case CLEAR_API_PLAN_SUBSCRIPTION_HISTORY:
            return Object.assign({}, state, {
                ApiPlanSubscriptionHistoryData: null,
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
                UserDataListError: true
            })

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
                ApiPlanConfigListError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}