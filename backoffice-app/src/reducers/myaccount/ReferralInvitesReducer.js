// ReferralSystemReducer
import {
    //get referral system 
    GET_REFERAL_SYSTEM_DATA,
    GET_REFERAL_SYSTEM_DATA_SUCCESS,
    GET_REFERAL_SYSTEM_DATA_FAILURE,

    //get referral invites 
    GET_REFERAL_INVITES_DATA,
    GET_REFERAL_INVITES_DATA_SUCCESS,
    GET_REFERAL_INVITES_DATA_FAILURE,

    //clear data
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for intial ReferalData
    loading: false,
    referalData: null,
    isReferalDataFetch: true,

    // for initial referral invites data 
    loadingInvitesData: false,
    invitesData: null,
    invitesDataFetch: true,
}

export default function ReferralInvitesReducer(state, action) {

    // If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        //referral system 
        case GET_REFERAL_SYSTEM_DATA:
            return Object.assign({}, state, {
                loading: true,
                referalData: null,
                isReferalDataFetch: true,
            })
        //referral system success
        case GET_REFERAL_SYSTEM_DATA_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                referalData: action.data,
                isReferalDataFetch: false,
            })
        //referral system failure
        case GET_REFERAL_SYSTEM_DATA_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                referalData: null,
                isReferalDataFetch: false,
            })

        // invites list data
        case GET_REFERAL_INVITES_DATA:
            return Object.assign({}, state, {
                loadingInvitesData: true,
                invitesData: null,
                invitesDataFetch: true,
            })
        // invites list data success
        case GET_REFERAL_INVITES_DATA_SUCCESS:
            return Object.assign({}, state, {
                loadingInvitesData: false,
                invitesData: action.data,
                invitesDataFetch: false,
            })
        // invites list data failure
        case GET_REFERAL_INVITES_DATA_FAILURE:
            return Object.assign({}, state, {
                loadingInvitesData: false,
                invitesData: null,
                invitesDataFetch: false,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}