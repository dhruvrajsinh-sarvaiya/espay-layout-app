/**
 * Created By Dipesh
 * Created Date 27/02/2019
 * Reducer for Referral Channel Type 
 */
import {

    //list Referral Channel Type
    LIST_REFERRAL_CHANNEL_TYPE,
    LIST_REFERRAL_CHANNEL_TYPE_SUCCESS,
    LIST_REFERRAL_CHANNEL_TYPE_FAILURE,

    //add Referral Channel Type
    ADD_REFERRAL_CHANNEL_TYPE,
    ADD_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ADD_REFERRAL_CHANNEL_TYPE_FAILURE,

    //edit Referral Channel Type
    UPDATE_REFERRAL_CHANNEL_TYPE,
    UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //active Referral Channel Type
    ACTIVE_REFERRAL_CHANNEL_TYPE,
    ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //inactive Referral Channel Type
    INACTIVE_REFERRAL_CHANNEL_TYPE,
    INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_REFERRAL_CLEAR,
    CLEAR_DATA_REFERRAL_CHANNEL_TYPE,
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

const INIT_STATE = {
    //list Referral Channel Type
    referralChannelTypeData: null,
    referralChannelLoading: false,

    //add ,edit Referral Channel Type
    addReferralChannelTypeData: null,
    editReferralChannelTypeData: null,

    //active Referral Channel Type
    activeReferralChannelTypeData: null,
    activeLoading: false,

    //inactive Referral Channel Type
    inActiceReferralChannelTypeData: null,
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

        //Referral Channel Type list
        case LIST_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, {
                referralChannelLoading: true,
                referralChannelTypeData: null,
                addReferralChannelTypeData: null,
                editReferralChannelTypeData: null,
                activeReferralChannelTypeData: null,
                inActiceReferralChannelTypeData: null,
            })
        //Referral Channel Type list success
        case LIST_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { referralChannelLoading: false, referralChannelTypeData: action.payload })
        //Referral Channel Type list failure
        case LIST_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { referralChannelLoading: false, referralChannelTypeData: action.payload })

        //Referral Channel add 
        case ADD_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { loading: true, addReferralChannelTypeData: null })
        //Referral Channel add success
        case ADD_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, addReferralChannelTypeData: action.payload })
        //Referral Channel add failure
        case ADD_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, addReferralChannelTypeData: action.payload })

        //Referral Channel edit 
        case UPDATE_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { loading: true, editReferralChannelTypeData: null })
        //Referral Channel edit success
        case UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { loading: false, editReferralChannelTypeData: action.payload })
        //Referral Channel edit failure
        case UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { loading: false, editReferralChannelTypeData: action.payload })

        //Referral Channel active
        case ACTIVE_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { activeLoading: true, activeReferralChannelTypeData: null })
        //Referral Channel active success
        case ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { activeLoading: false, activeReferralChannelTypeData: action.payload })
        //Referral Channel active failure
        case ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { activeLoading: false, activeReferralChannelTypeData: action.payload })

        //Referral Channel inActive
        case INACTIVE_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { inActiveLoading: true, inActiceReferralChannelTypeData: null })
        //Referral Channel inActive success
        case INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralChannelTypeData: action.payload })
        //Referral Channel inActive failure
        case INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { inActiveLoading: false, inActiceReferralChannelTypeData: action.payload })

        //active clear data
        case ACTIVE_INACTIVE_REFERRAL_CLEAR:
            return INIT_STATE

        //clear data
        case CLEAR_DATA_REFERRAL_CHANNEL_TYPE:
            return INIT_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};