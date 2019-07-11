// Reducer For Handle Get Api Plan List By Tejas 26/2/2019
// import types
import {
    GET_API_PLAN_DATA,
    GET_API_PLAN_DATA_SUCCESS,
    GET_API_PLAN_DATA_FAILURE,
    SUBSCRIBE_API_PLAN,
    SUBSCRIBE_API_PLAN_SUCCESS,
    SUBSCRIBE_API_PLAN_FAILURE,
    GET_USER_ACTIVE_PLAN,
    GET_USER_ACTIVE_PLAN_SUCCESS,
    GET_USER_ACTIVE_PLAN_FAILURE,
    SET_AUTO_RENEWAL_PLAN,
    SET_AUTO_RENEWAL_PLAN_SUCCESS,
    SET_AUTO_RENEWAL_PLAN_FAILURE,
    STOP_AUTO_RENEWAL_PLAN,
    STOP_AUTO_RENEWAL_PLAN_SUCCESS,
    STOP_AUTO_RENEWAL_PLAN_FAILURE,
    GET_AUTO_RENEWAL_PLAN,
    GET_AUTO_RENEWAL_PLAN_SUCCESS,
    GET_AUTO_RENEWAL_PLAN_FAILURE,
    SET_MANUAL_RENEWAL_PLAN,
    SET_MANUAL_RENEWAL_PLAN_SUCCESS,
    SET_MANUAL_RENEWAL_PLAN_FAILURE,

} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiPlanList: [],
    loading: false,
    userPlanBit: 0,
    errorCode: 0,
    userErrorCode: 0,
    subscribeData: [],
    subScribeLoading: false,
    error: [],
    userPlanError: [],
    userPlanLoading: false,
    UserPlanList: null,
    setAutoRenewData: {},
    setAutoRenewLoading: false,
    setAutoRenewError: [],
    stopAutoRenewData: {},
    stopAutoRenewLoading: false,
    stopAutoRenewError: [],
    getAutoRenewLoading: false,
    getAutoRenewData: [],
    getAutoRenewError: [],
    manualRenewLoading: false,
    manualRenewData: [],
    manualRenewError: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    switch (action.type) {
        // get Get Api Plan List
        case GET_API_PLAN_DATA:
            return {
                ...state,
                loading: true,
                errorCode: 0,
                error: [],
                userPlanError: [],
                setAutoRenewError: [],
                stopAutoRenewError: [],
                apiPlanList: []
            };

        // set Data Of Get Api Plan List
        case GET_API_PLAN_DATA_SUCCESS:
            return { ...state, apiPlanList: action.payload.Response, errorCode: action.payload.ErrorCode, loading: false, error: [] };

        // Display Error for Get Api Plan List failure
        case GET_API_PLAN_DATA_FAILURE:

            return { ...state, loading: false, apiPlanList: {}, errorCode: 0, error: action.payload };

        // get Sub scribe Ai plan 
        case SUBSCRIBE_API_PLAN:
            return {
                ...state,
                subScribeLoading: true,
                //userPlanError: [],
                subscribeData: [],
                errorCode: 0,
                error: [],
                userPlanError: [],
                setAutoRenewError: [],
                stopAutoRenewError: [],
            };

        // set Data Of Sub scribe Ai plan 
        case SUBSCRIBE_API_PLAN_SUCCESS:
            return { ...state, subscribeData: action.payload, error: [], subScribeLoading: false };

        // Display Error for Sub scribe Ai plan  failure
        case SUBSCRIBE_API_PLAN_FAILURE:

            return { ...state, subScribeLoading: false, subscribeData: [], error: action.payload };

        // get User Active Plan
        case GET_USER_ACTIVE_PLAN:
            return {
                ...state,
                userPlanLoading: true,
                errorCode: 0,
                error: [],
                userPlanError: [],
                setAutoRenewError: [],
                stopAutoRenewError: [],
                UserPlanList: null,
                userErrorCode: 0
            };

        // set Data Of User Active Plan
        case GET_USER_ACTIVE_PLAN_SUCCESS:
            return {
                ...state,
                userErrorCode: action.payload.ErrorCode,
                userPlanBit: ++state.userPlanBit, UserPlanList: action.payload.Response, userPlanError: [], userPlanLoading: false
            };

        // Display Error for User Active Plan failure
        case GET_USER_ACTIVE_PLAN_FAILURE:

            return { ...state, userErrorCode: 0, userPlanBit: ++state.userPlanBit, userPlanLoading: false, UserPlanList: null, userPlanError: action.payload };

        // get set auto renew Active Plan
        case SET_AUTO_RENEWAL_PLAN:
            return {
                ...state,
                setAutoRenewLoading: true,
                errorCode: 0,
                error: [],
                userPlanError: [],
                setAutoRenewError: [],
                stopAutoRenewError: [],
                setAutoRenewData: []
            };

        // set Data Of  set auto renew
        case SET_AUTO_RENEWAL_PLAN_SUCCESS:
            return { ...state, setAutoRenewData: action.payload, setAutoRenewError: [], setAutoRenewLoading: false };

        // Display Error for  set auto renew failure
        case SET_AUTO_RENEWAL_PLAN_FAILURE:

            return { ...state, setAutoRenewLoading: false, setAutoRenewData: {}, setAutoRenewError: action.payload };


        // get stop auto renewal
        case STOP_AUTO_RENEWAL_PLAN:
            return {
                ...state,
                stopAutoRenewLoading: true,
                errorCode: 0,
                error: [],
                userPlanError: [],
                setAutoRenewError: [],
                stopAutoRenewError: [],
            };

        // stop Data Of stop auto renewal
        case STOP_AUTO_RENEWAL_PLAN_SUCCESS:
            return { ...state, stopAutoRenewData: action.payload, stopAutoRenewError: [], stopAutoRenewLoading: false };

        // Display Error for stop auto renewal failure
        case STOP_AUTO_RENEWAL_PLAN_FAILURE:

            return { ...state, stopAutoRenewLoading: false, stopAutoRenewData: {}, stopAutoRenewError: action.payload };

        // get Auto Renewal Plan
        case GET_AUTO_RENEWAL_PLAN:
            return {
                ...state,
                getAutoRenewLoading: true,
                getAutoRenewData: [],
                getAutoRenewError: [],
            };

        // stop Data Of Auto Renewal Plan
        case GET_AUTO_RENEWAL_PLAN_SUCCESS:
            return { ...state, getAutoRenewData: action.payload.Response, getAutoRenewError: [], getAutoRenewLoading: false };

        // Display Error for Auto Renewal Plan failure
        case GET_AUTO_RENEWAL_PLAN_FAILURE:

            return { ...state, getAutoRenewLoading: false, getAutoRenewData: {}, getAutoRenewError: action.payload };

        // get Manual Renew Plan
        case SET_MANUAL_RENEWAL_PLAN:
            return {
                ...state,
                manualRenewLoading: true,
                manualRenewData: [],
                manualRenewError: []
            };

        // stop Data Of Manual Renew Plan
        case SET_MANUAL_RENEWAL_PLAN_SUCCESS:
            return { ...state, manualRenewData: action.payload, manualRenewError: [], manualRenewLoading: false };

        // Display Error for Manual Renew Plan failure
        case SET_MANUAL_RENEWAL_PLAN_FAILURE:

            return { ...state, manualRenewLoading: false, manualRenewData: {}, manualRenewError: action.payload };


        default:
            return { ...state };
    }
};
