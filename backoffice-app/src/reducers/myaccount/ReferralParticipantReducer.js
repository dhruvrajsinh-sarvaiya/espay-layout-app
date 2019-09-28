/**
 * Created By Dipesh 
 * Created Date 01/03/2019
 * Reducer For Referral participant
 */

import {
    // for participant list
    GET_REFERRAL_PARTICIPATE_LIST,
    GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPATE_LIST_FAILURE,

    // for chanel type 
    GET_REFERRAL_CHANNEL_TYPE,
    GET_REFERRAL_CHANNEL_TYPE_SUCCESS,
    GET_REFERRAL_CHANNEL_TYPE_FAILURE,

    // for referral service 
    GET_REFERRAL_SERVICE,
    GET_REFERRAL_SERVICE_SUCCESS,
    GET_REFERRAL_SERVICE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_PARTICIPANT
} from "../../actions/ActionTypes";

const INIT_STATE = {

    // for participant list
    listReferralParticipateData: null,
    listChannelTypeData: null,

    // for referral service 
    listServiceData: null,
    loading: false,

    // for chanel type
    listChannelTypeDataloading: false,
    listServiceDataloading: false,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        // Handle Get participant list method data
        case GET_REFERRAL_PARTICIPATE_LIST:
            return Object.assign({}, state, { loading: true, listReferralParticipateData: null })
        // Set Get participant list success data
        case GET_REFERRAL_PARTICIPATE_LIST_SUCCESS:
            return Object.assign({}, state, { loading: false, listReferralParticipateData: action.payload })
        // Set Get participant list success failure
        case GET_REFERRAL_PARTICIPATE_LIST_FAILURE:
            return Object.assign({}, state, { loading: false, listReferralParticipateData: action.payload })

        // Handle referral chanel type method data
        case GET_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { listChannelTypeDataloading: true, listChannelTypeData: null })
        // set referral chanel type method data success
        case GET_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { listChannelTypeDataloading: false, listChannelTypeData: action.payload })
        // set referral chanel type method data failure
        case GET_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { listChannelTypeDataloading: false, listChannelTypeData: action.payload })

        // Handle referral service method data
        case GET_REFERRAL_SERVICE:
            return Object.assign({}, state, { listServiceDataloading: true, listServiceData: null })
        // set referral service method data success
        case GET_REFERRAL_SERVICE_SUCCESS:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })
        // set referral service method data success
        case GET_REFERRAL_SERVICE_FAILURE:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })

        //clear reducer data
        case CLEAR_PARTICIPANT:
            return Object.assign({}, state, { listReferralParticipateData: null, listServiceData: null, listChannelTypeData: null })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};