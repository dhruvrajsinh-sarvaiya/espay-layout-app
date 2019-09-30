import {
    //clear data
    ACTION_LOGOUT,
    CLEAR_CLICK_REFERRAL_LINK_REPORT,

    // for service 
    GET_REFERRAL_SERVICE,
    GET_REFERRAL_SERVICE_SUCCESS,
    GET_REFERRAL_SERVICE_FAILURE,

    // for chanel type
    GET_REFERRAL_CHANNEL_TYPE,
    GET_REFERRAL_CHANNEL_TYPE_SUCCESS,
    GET_REFERRAL_CHANNEL_TYPE_FAILURE,

    // for click on link list
    CLICK_REFERRAL_LINK_REPORT,
    CLICK_REFERRAL_LINK_REPORT_SUCCESS,
    CLICK_REFERRAL_LINK_REPORT_FAILURE,
} from "../../actions/ActionTypes";

const INIT_STATE = {

    // for click on link list
    loading: false,
    clickReferralLinkReportData: null,

    // for service 
    listServiceData: null,
    listServiceDataloading: false,

    // for chanel type
    listChannelTypeDatas: null,
    listChannelTypeDataloading: false,
};

export default function ReferralClickOnLinkReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INIT_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE;

        // Handle click on link report list method data
        case CLICK_REFERRAL_LINK_REPORT:
            return Object.assign({}, state, { loading: true, clickReferralLinkReportData: null })
        // Set click on link report list success data
        case CLICK_REFERRAL_LINK_REPORT_SUCCESS:
            return Object.assign({}, state, { loading: false, clickReferralLinkReportData: action.payload })
        // Set click on link report list failure data
        case CLICK_REFERRAL_LINK_REPORT_FAILURE:
            return Object.assign({}, state, { loading: false, clickReferralLinkReportData: action.payload })

        // Handle referral service method data
        case GET_REFERRAL_SERVICE:
            return Object.assign({}, state, { listServiceDataloading: true, listServiceData: null })
        // Set referral service success data
        case GET_REFERRAL_SERVICE_SUCCESS:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })
        // Set referral service failure data
        case GET_REFERRAL_SERVICE_FAILURE:
            return Object.assign({}, state, { listServiceDataloading: false, listServiceData: action.payload })

        // Handle referral chanel type method data
        case GET_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, { listChannelTypeDataloading: true, listChannelTypeDatas: null })
        // Set referral chanel type success data
        case GET_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, { listChannelTypeDataloading: false, listChannelTypeDatas: action.payload })
        // Set referral chanel type failure data
        case GET_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, { listChannelTypeDataloading: false, listChannelTypeDatas: action.payload })

        //clear reducer data
        case CLEAR_CLICK_REFERRAL_LINK_REPORT:
            return INIT_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}