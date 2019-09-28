import {
    //reward list
    REFERRAL_REWARD_REPORT,
    REFERRAL_REWARD_REPORT_SUCCESS,
    REFERRAL_REWARD_REPORT_FAILURE,

    //clear data
    CLEAR_REFERRAL_REWARD_REPORT,
    ACTION_LOGOUT,

    //get referral service
    GET_REFERRAL_SERVICE,
    GET_REFERRAL_SERVICE_SUCCESS,
    GET_REFERRAL_SERVICE_FAILURE,

    //get user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE
} from "../../actions/ActionTypes";

const INITIAL_STATE = {
    //reward list
    loading: false,
    listReferralRewardData: null,

    // referral service
    listServiceData: null,
    listServiceDataloading: false,

    // user data
    userData: null,
    isLoadingUserData: false,
};

const ConvertsReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle referral reward report method data
        case REFERRAL_REWARD_REPORT:
            return Object.assign({}, state, { loading: true, listReferralRewardData: null })
        // Set referral reward report success data
        case REFERRAL_REWARD_REPORT_SUCCESS:
            return Object.assign({}, state, { loading: false, listReferralRewardData: action.payload })
        // Set referral reward report failure data
        case REFERRAL_REWARD_REPORT_FAILURE:
            return Object.assign({}, state, { loading: false, listReferralRewardData: action.payload })

        // Handle referral service method data
        case GET_REFERRAL_SERVICE:
            return Object.assign({}, state, { listServiceDataloading: true, listServiceData: null })
        // Set referral service success data
        case GET_REFERRAL_SERVICE_SUCCESS:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })
        // Set referral service failure data
        case GET_REFERRAL_SERVICE_FAILURE:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })

        // Handle user data method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null, isLoadingUserData: true })
        // Set user data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload, isLoadingUserData: false })
        // Set user data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: null, isLoadingUserData: false })

        //clear data
        case CLEAR_REFERRAL_REWARD_REPORT:
            return INITIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};

export default ConvertsReducer