// ReferralSystemReducer
import {
    //clear data
    ACTION_LOGOUT,

    //referal system dashboard
    REFERRAL_SYSTEM_DASHBOARD_DATA,
    REFERRAL_SYSTEM_DASHBOARD_DATA_SUCCESS,
    REFERRAL_SYSTEM_DASHBOARD_DATA_FAILURE,

    //chanel list
    GET_ADMIN_REFERRAL_CHANNNEL_LIST,
    GET_ADMIN_REFERRAL_CHANNNEL_LIST_SUCCESS,
    GET_ADMIN_REFERRAL_CHANNNEL_LIST_FAILURE
} from '../../actions/ActionTypes'

const initialState = {
    // for intial ReferalData
    loading: true,
    referalData: null,
    isReferalDataFetch: true,

    //chaneldata
    AdminRefChannelData: null,
    AdminRefChannelLoading: false,
    AdminRefChannelError: false,
}
export default function ReferralSystemReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        //referral system dashboard
        case REFERRAL_SYSTEM_DASHBOARD_DATA:
            return Object.assign({}, state, {
                loading: true,
                referalData: null,
                isReferalDataFetch: true,
            })
        //referral system dashboard success
        case REFERRAL_SYSTEM_DASHBOARD_DATA_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                referalData: action.data,
                isReferalDataFetch: false,
            })
        //referral system dashboard failure
        case REFERRAL_SYSTEM_DASHBOARD_DATA_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                referalData: null,
                isReferalDataFetch: false,
            })

        //chanel list
        case GET_ADMIN_REFERRAL_CHANNNEL_LIST:
            return Object.assign({}, state, {
                AdminRefChannelData: null,
                AdminRefChannelLoading: true
            })
        //chanel list success
        case GET_ADMIN_REFERRAL_CHANNNEL_LIST_SUCCESS:
            return Object.assign({}, state, {
                AdminRefChannelData: action.data,
                AdminRefChannelLoading: false
            })
        //chanel list failure
        case GET_ADMIN_REFERRAL_CHANNNEL_LIST_FAILURE:
            return Object.assign({}, state, {
                AdminRefChannelData: null,
                AdminRefChannelLoading: false,
                AdminRefChannelError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}