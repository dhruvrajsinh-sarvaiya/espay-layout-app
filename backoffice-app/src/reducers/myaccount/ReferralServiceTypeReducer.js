/**
 * Created By Dipesh
 * Created Date 27/02/2019
 * Reducer for Referral Service Type 
 */
import {

    //list referral service type
    LIST_REFERRAL_SERVICE_TYPE,
    LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    LIST_REFERRAL_SERVICE_TYPE_FAILURE,

    //add referral service type
    ADD_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    ADD_REFERRAL_SERVICE_TYPE_FAILURE,

    //edit referral service type
    UPDATE_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    UPDATE_REFERRAL_SERVICE_TYPE_FAILURE,

    //active referral service type
    ACTIVE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    //in active referral service type
    INACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_SERVICE_CLEAR,
    CLEAR_DATA_SERVICE_TYPE,
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

const INIT_STATE = {
    //list referral service type data
    referralServiceTypeData: null,
    referralServiceLoading: false,

    //add,edit referral service type data
    addReferralServiceTypeData: null,
    editReferralServiceTypeData: null,

    //active referral service type data
    activeReferralServiceTypeData: null,
    activeLoading: false,

    //inactive referral service type data
    inActiceReferralServiceTypeData: null,
    inActiveLoading: false,
    loading: false,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        // Handle service type method data
        case LIST_REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, {
                referralServiceLoading: true,
                referralServiceTypeData: null,
                addReferralServiceTypeData: null,
                editReferralServiceTypeData: null,
                activeReferralServiceTypeData: null,
                inActiceReferralServiceTypeData: null,
            })
        // Set service type success data
        case LIST_REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { referralServiceLoading: false, referralServiceTypeData: action.payload })
        // Set service type failure data
        case LIST_REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { referralServiceLoading: false, referralServiceTypeData: action.payload })

        // Handle add referral service type method data
        case ADD_REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, { loading: true, addReferralServiceTypeData: null })
        // Set add referral service type success data
        case ADD_REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, addReferralServiceTypeData: action.payload })
        // Set add referral service type failure data
        case ADD_REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, addReferralServiceTypeData: action.payload })

        // Handle edit referral service type method data
        case UPDATE_REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, { loading: true, editReferralServiceTypeData: null })
        // Set edit referral service type success data
        case UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, editReferralServiceTypeData: action.payload })
        // Set edit referral service type failure data
        case UPDATE_REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, editReferralServiceTypeData: action.payload })

        // Handle active referral service type method data
        case ACTIVE_REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, { activeLoading: true, activeReferralServiceTypeData: null })
        // Set active referral service type success data
        case ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { activeLoading: false, activeReferralServiceTypeData: action.payload })
        // Set active referral service type failure data
        case ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { activeLoading: false, activeReferralServiceTypeData: action.payload })

        // Handle inactive referral service type method data
        case INACTIVE_REFERRAL_SERVICE_TYPE:
            return Object.assign({}, state, { inActiveLoading: true, inActiceReferralServiceTypeData: null })
        // Set inactive referral service type success data
        case INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralServiceTypeData: action.payload })
        // Set inactive referral service type failure data
        case INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralServiceTypeData: action.payload })

        //clear active , inactive  data
        case ACTIVE_INACTIVE_SERVICE_CLEAR:
            return INIT_STATE

        //clear data
        case CLEAR_DATA_SERVICE_TYPE:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};