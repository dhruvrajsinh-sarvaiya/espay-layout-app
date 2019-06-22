// Action types for Api Plan Module
import {
    // Action logout
    ACTION_LOGOUT,

    // Get Api Plan List Data
    GET_API_PLAN_LIST_DATA,
    GET_API_PLAN_LIST_DATA_SUCCESS,
    GET_API_PLAN_LIST_DATA_FAILURE,

    // Subscibe Api Plan
    SUBSCRIBE_API_PLAN,
    SUBSCRIBE_API_PLAN_SUCCESS,
    SUBSCRIBE_API_PLAN_FAILURE,

    // Get User Active Plan
    GET_USER_ACTIVE_PLAN,
    GET_USER_ACTIVE_PLAN_SUCCESS,
    GET_USER_ACTIVE_PLAN_FAILURE,

    // Manual Renew Api Plan
    MANUAL_RENEW_API_PLAN,
    MANUAL_RENEW_API_PLAN_SUCCESS,
    MANUAL_RENEW_API_PLAN_FAILURE,

    // Clear Api Plan Data
    CLEAR_API_PLAN_DATA,

    // Set Auto Renew Api Plan
    SET_AUTO_RENEW_API_PLAN,
    SET_AUTO_RENEW_API_PLAN_SUCCESS,
    SET_AUTO_RENEW_API_PLAN_FAILURE,

    // Get Auto Renew Api Plan
    GET_AUTO_RENEW_API_PLAN,
    GET_AUTO_RENEW_API_PLAN_SUCCESS,
    GET_AUTO_RENEW_API_PLAN_FAILURE,

    // Stop Auto Renew Api Plan
    STOP_AUTO_RENEW_API_PLAN,
    STOP_AUTO_RENEW_API_PLAN_SUCCESS,
    STOP_AUTO_RENEW_API_PLAN_FAILURE,

    // Get Custom Limits
    GET_CUSTOM_LIMITS,
    GET_CUSTOM_LIMITS_SUCCESS,
    GET_CUSTOM_LIMITS_FAILURE,

    // Set Custom Limits
    SET_CUSTOM_LIMITS,
    SET_CUSTOM_LIMITS_SUCCESS,
    SET_CUSTOM_LIMITS_FAILURE,

    // Edit Custom Limits
    EDIT_CUSTOM_LIMITS,
    EDIT_CUSTOM_LIMITS_SUCCESS,
    EDIT_CUSTOM_LIMITS_FAILURE,

    // Set Default Custom Limits
    SET_DEFAULT_CUSTOM_LIMITS,
    SET_DEFAULT_CUSTOM_LIMITS_SUCCESS,
    SET_DEFAULT_CUSTOM_LIMITS_FAILURE,

    // Fetch Wallet List
    FETCH_WALLET_LIST,
    FETCH_WALLET_LIST_SUCCESS,
    FETCH_WALLET_LIST_FAILURE
} from '../actions/ActionTypes'

// Initial State for Api Plan Module
const INITIAL_STATE = {
    // Api Plan List
    loading: false,
    apiPlanlist: null,
    apiPlanListFetch: true,

    // Subscribe Data
    subscribing: false,
    subscribeData: null,
    subscribeDataFetch: true,

    // User Active Plan
    UserActivePlanData: null,
    UserActivePlanLoading: null,
    UserActivePlanError: null,

    // Manual Renew Api Plan Data
    ManualRenewPlanData: null,
    ManualRenewPlanLoading: false,
    ManualRenewPlanError: false,

    // Set Auto Renew Api Plan
    SetAutoRenewPlanLoading: false,
    SetAutoRenewPlanData: null,
    SetAutoRenewPlanError: false,

    // Get Auto Renew Api Plan
    AutoRenewPlanLoading: false,
    AutoRenewPlanData: null,
    AutoRenewPlanError: false,

    // Stop Auto Renew Api Plan
    StopRenewPlanLoading: false,
    StopRenewPlanData: null,
    StopRenewPlanError: false,

    // Get Custom Limits
    CustomLimitsLoading: false,
    CustomLimitsData: null,
    CustomLimitsError: true,

    // Set Custom Limits
    SetCustomLimitsLoading: false,
    SetCustomLimitsData: null,
    SetCustomLimitsError: false,

    // Set Default Custom Limits Data
    SetDefCustomLimitsLoading: false,
    SetDefCustomLimitsData: null,
    SetDefCustomLimitsError: false,

    // Get Wallet Detail
    WalletListData: null,
    WalletListLoading: false,
    WalletListError: false,
}

export default function ApiPlanListReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle api plan list method data
        case GET_API_PLAN_LIST_DATA:
            return Object.assign({}, state, {
                loading: true,
                apiPlanlist: null,
                apiPlanListFetch: true,
            })
        // Set api plan list success data
        case GET_API_PLAN_LIST_DATA_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                apiPlanlist: action.data,
                apiPlanListFetch: false,
            })
        // Set api plan list failure data
        case GET_API_PLAN_LIST_DATA_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                apiPlanlist: null,
                apiPlanListFetch: false,
            })

        // Handle subscribe api plan method data
        case SUBSCRIBE_API_PLAN:
            return Object.assign({}, state, {
                subscribing: true,
                subscribeData: null,
                subscribeDataFetch: true,
            })
        // Set subscribe api plan success data
        case SUBSCRIBE_API_PLAN_SUCCESS:
            return Object.assign({}, state, {
                subscribing: false,
                subscribeData: action.data,
                subscribeDataFetch: false,
            })
        // Set subscribe api plan failure data
        case SUBSCRIBE_API_PLAN_FAILURE:
            return Object.assign({}, state, {
                subscribing: false,
                subscribeData: null,
                subscribeDataFetch: false,
            })

        // Handle user active api plan method data
        case GET_USER_ACTIVE_PLAN:
            return Object.assign({}, state, {
                UserActivePlanLoading: true,
                UserActivePlanData: null,
            })
        // Set user active api plan success data
        case GET_USER_ACTIVE_PLAN_SUCCESS:
            return Object.assign({}, state, {
                UserActivePlanLoading: false,
                UserActivePlanData: action.data,
            })
        // Set user active api plan failure data
        case GET_USER_ACTIVE_PLAN_FAILURE:
            return Object.assign({}, state, {
                UserActivePlanLoading: false,
                UserActivePlanData: null,
                UserActivePlanError: false,
            })

        // Handle manual renew api plan method data
        case MANUAL_RENEW_API_PLAN:
            return Object.assign({}, state, {
                ManualRenewPlanLoading: true,
                ManualRenewPlanData: null,
            })
        // Set manual renew api plan success data
        case MANUAL_RENEW_API_PLAN_SUCCESS:
            return Object.assign({}, state, {
                ManualRenewPlanLoading: false,
                ManualRenewPlanData: action.data,
            })
        // Set manual renew api plan success data
        case MANUAL_RENEW_API_PLAN_FAILURE:
            return Object.assign({}, state, {
                ManualRenewPlanLoading: false,
                ManualRenewPlanData: null,
                ManualRenewPlanError: false,
            })

        // Handle auto renew api plan method data
        case SET_AUTO_RENEW_API_PLAN:
            return Object.assign({}, state, {
                SetAutoRenewPlanLoading: true,
                SetAutoRenewPlanData: null,
            })
        // Set auto renew api plan success data
        case SET_AUTO_RENEW_API_PLAN_SUCCESS:
            return Object.assign({}, state, {
                SetAutoRenewPlanLoading: false,
                SetAutoRenewPlanData: action.data,
            })
        // Set auto renew api plan failure data
        case SET_AUTO_RENEW_API_PLAN_FAILURE:
            return Object.assign({}, state, {
                SetAutoRenewPlanLoading: false,
                SetAutoRenewPlanData: null,
                SetAutoRenewPlanError: true,
            })

        // Handle 'get auto renew api' plan method data
        case GET_AUTO_RENEW_API_PLAN:
            return Object.assign({}, state, {
                AutoRenewPlanLoading: true,
                AutoRenewPlanData: null,
            })
        // Get auto renew api plan success data
        case GET_AUTO_RENEW_API_PLAN_SUCCESS:
            return Object.assign({}, state, {
                AutoRenewPlanLoading: false,
                AutoRenewPlanData: action.data,
            })
        // Get auto renew api plan failure data
        case GET_AUTO_RENEW_API_PLAN_FAILURE:
            return Object.assign({}, state, {
                AutoRenewPlanLoading: false,
                AutoRenewPlanData: null,
                AutoRenewPlanError: true,
            })

        // Handle stop auto renew api plan method data
        case STOP_AUTO_RENEW_API_PLAN:
            return Object.assign({}, state, {
                StopRenewPlanLoading: true,
                StopRenewPlanData: null,
            })
        // Set stop auto renew api plan success data
        case STOP_AUTO_RENEW_API_PLAN_SUCCESS:
            return Object.assign({}, state, {
                StopRenewPlanLoading: false,
                StopRenewPlanData: action.data,
            })
        // Set stop auto renew api plan failure data
        case STOP_AUTO_RENEW_API_PLAN_FAILURE:
            return Object.assign({}, state, {
                StopRenewPlanLoading: false,
                StopRenewPlanData: null,
                StopRenewPlanError: true,
            })

        // Handle 'get custom limits' method data
        case GET_CUSTOM_LIMITS:
            return Object.assign({}, state, {
                CustomLimitsLoading: true,
                CustomLimitsData: null,
            })
        // Set custom limits success data
        case GET_CUSTOM_LIMITS_SUCCESS:
            return Object.assign({}, state, {
                CustomLimitsLoading: false,
                CustomLimitsData: action.data,
            })
        // Set custom limits failure data
        case GET_CUSTOM_LIMITS_FAILURE:
            return Object.assign({}, state, {
                CustomLimitsLoading: false,
                CustomLimitsData: null,
                CustomLimitsError: true,
            })

        // Handle custom limits method data
        case SET_CUSTOM_LIMITS:
            return Object.assign({}, state, {
                SetCustomLimitsLoading: true,
                SetCustomLimitsData: null,
            })
        // Set custom limits success data
        case SET_CUSTOM_LIMITS_SUCCESS:
            return Object.assign({}, state, {
                SetCustomLimitsLoading: false,
                SetCustomLimitsData: action.data,
            })
        // Set custom limits failure data
        case SET_CUSTOM_LIMITS_FAILURE:
            return Object.assign({}, state, {
                SetCustomLimitsLoading: false,
                SetCustomLimitsData: null,
                SetCustomLimitsError: true,
            })

        // Handle edit custom limits method data
        case EDIT_CUSTOM_LIMITS:
            return Object.assign({}, state, {
                EditCustomLimitsLoading: true,
                EditCustomLimitsData: null,
            })
        // Set edit custom limits success data
        case EDIT_CUSTOM_LIMITS_SUCCESS:
            return Object.assign({}, state, {
                EditCustomLimitsLoading: false,
                EditCustomLimitsData: action.data,
            })
        // Set edit custom limits failure data
        case EDIT_CUSTOM_LIMITS_FAILURE:
            return Object.assign({}, state, {
                EditCustomLimitsLoading: false,
                EditCustomLimitsData: null,
                EditCustomLimitsError: true,
            })

        // Handle default custom limits method data
        case SET_DEFAULT_CUSTOM_LIMITS:
            return Object.assign({}, state, {
                SetDefCustomLimitsLoading: true,
                SetDefCustomLimitsData: null,
            })
        // Set default custom limits success data
        case SET_DEFAULT_CUSTOM_LIMITS_SUCCESS:
            return Object.assign({}, state, {
                SetDefCustomLimitsLoading: false,
                SetDefCustomLimitsData: action.data,
            })
        // Set default custom limits failure data
        case SET_DEFAULT_CUSTOM_LIMITS_FAILURE:
            return Object.assign({}, state, {
                SetDefCustomLimitsLoading: false,
                SetDefCustomLimitsData: null,
                SetDefCustomLimitsError: true,
            })

        // Clear api plan data
        case CLEAR_API_PLAN_DATA:
            return Object.assign({}, state, {
                ManualRenewPlanData: null,
                UserActivePlanData: null,
                SetAutoRenewPlanData: null,
                AutoRenewPlanData: null,
                StopRenewPlanData: null,
                apiPlanlist: null,
                SetCustomLimitsData: null,
                EditCustomLimitsData: null,
                subscribeData: null,
            })

        // Handle wallet list method data
        case FETCH_WALLET_LIST:
            return Object.assign({}, state, {
                WalletListLoading: true,
                WalletListData: null,
            })
        // Set wallet list success data
        case FETCH_WALLET_LIST_SUCCESS:
            return Object.assign({}, state, {
                WalletListLoading: false,
                WalletListData: action.data,
            })
        // Set wallet list failure
        case FETCH_WALLET_LIST_FAILURE:
            return Object.assign({}, state, {
                WalletListLoading: false,
                WalletListData: null,
                WalletListError: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}