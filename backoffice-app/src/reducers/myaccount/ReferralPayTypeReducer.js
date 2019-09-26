/**
 * Created By Dipesh
 * Created Date 28/02/2019
 * Reducer for Referral Pay Type 
 */
import {

    //list referral pay type
    LIST_REFERRAL_PAY_TYPE,
    LIST_REFERRAL_PAY_TYPE_SUCCESS,
    LIST_REFERRAL_PAY_TYPE_FAILURE,

    //add referral pay type
    ADD_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE_SUCCESS,
    ADD_REFERRAL_PAY_TYPE_FAILURE,

    //update referral pay type
    UPDATE_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    UPDATE_REFERRAL_PAY_TYPE_FAILURE,

    //active referral pay type
    ACTIVE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    ACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    //in active referral pay type
    INACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    INACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_REFERRAL_PAY_TYPE_CLEAR,
    CLEAR_DATA_REFERRAL_PAY_TYPE,
    ACTION_LOGOUT,

} from "../../actions/ActionTypes";

const INIT_STATE = {
    //list referral pay type
    referralPayTypeData: null,
    referralPayLoading: false,

    //add referral pay type
    addReferralPayTypeData: null,
    editReferralPayTypeData: null,

    //active referral pay type
    activeReferralPayTypeData: null,
    activeLoading: false,

    //in active referral pay type
    inActiceReferralPayTypeData: null,
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

        //For Display Referral Pay Type Data
        case LIST_REFERRAL_PAY_TYPE:
            return Object.assign({}, state, {
                referralPayLoading: true,
                referralPayTypeData: null,
                addReferralPayTypeData: null,
                editReferralPayTypeData: null,
                activeReferralPayTypeData: null,
                inActiceReferralPayTypeData: null,
                getReferralPayTypeDataById: null
            })

        //For Display Referral Pay Type Data success 
        case LIST_REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { referralPayLoading: false, referralPayTypeData: action.payload })
        //For Display Referral Pay Type Data failure
        case LIST_REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { referralPayLoading: false, referralPayTypeData: action.payload })

        //for add referral type
        case ADD_REFERRAL_PAY_TYPE:
            return Object.assign({}, state, { loading: true, addReferralPayTypeData: null })
        //for add referral type success
        case ADD_REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, addReferralPayTypeData: action.payload })
        //for add referral type success
        case ADD_REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, addReferralPayTypeData: action.payload })

        //for edit referral type
        case UPDATE_REFERRAL_PAY_TYPE:
            return Object.assign({}, state, { loading: true, editReferralPayTypeData: null })
        //for edit referral type success
        case UPDATE_REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, editReferralPayTypeData: action.payload })
        //for edit referral type failure
        case UPDATE_REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, editReferralPayTypeData: action.payload })

        //for active referral type
        case ACTIVE_REFERRAL_PAY_TYPE:
            return Object.assign({}, state, { activeLoading: true, activeReferralPayTypeData: null })
        //for active referral type success
        case ACTIVE_REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { activeLoading: false, activeReferralPayTypeData: action.payload })
        //for active referral type failure
        case ACTIVE_REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { activeLoading: false, activeReferralPayTypeData: action.payload })

        //for inactive referral type
        case INACTIVE_REFERRAL_PAY_TYPE:
            return Object.assign({}, state, { inActiveLoading: true, inActiceReferralPayTypeData: null })
        //for inactive referral type success
        case INACTIVE_REFERRAL_PAY_TYPE_SUCCESS:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralPayTypeData: action.payload })
        //for inactive referral type failure
        case INACTIVE_REFERRAL_PAY_TYPE_FAILURE:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralPayTypeData: action.payload })

        //for edit referral type
        case ACTIVE_INACTIVE_REFERRAL_PAY_TYPE_CLEAR:
            return INIT_STATE

        //clear data
        case CLEAR_DATA_REFERRAL_PAY_TYPE:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};