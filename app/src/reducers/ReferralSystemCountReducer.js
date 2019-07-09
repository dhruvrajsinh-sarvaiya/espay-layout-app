// Action types for Referral System Count
import {
    // Referral Invites List
    GET_REFERRAL_INVITES_LIST,
    GET_REFERRAL_INVITES_LIST_SUCCESS,
    GET_REFERRAL_INVITES_LIST_FAILURE,

    // Referral Email List
    GET_REFERRAL_EMAIL_LIST,
    GET_REFERRAL_EMAIL_LIST_SUCCESS,
    GET_REFERRAL_EMAIL_LIST_FAILURE,

    // Referral Participant List
    GET_REFERRAL_PARTICIPANT_LIST,
    GET_REFERRAL_PARTICIPANT_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPANT_LIST_FAILURE,

    // Referral Clicks List
    GET_REFERRAL_CLICKS_LIST,
    GET_REFERRAL_CLICKS_LIST_SUCCESS,
    GET_REFERRAL_CLICKS_LIST_FAILURE,

    // Referral Converts List
    GET_REFERRAL_CONVERTS_LIST,
    GET_REFERRAL_CONVERTS_LIST_SUCCESS,
    GET_REFERRAL_CONVERTS_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
    // Clear all referral data
    CLEAR_ALL_REFERRAL_DATA,
} from '../actions/ActionTypes';

// Initial state for Referral System
const INITIAL_STATE = {
    // for Referral Invite
    referralInvitesData: null,
    isInviting: false,
    invitesDataError: false,

    // for Referral Email Data
    referralEmailData: null,
    isEmaildata: false,
    emailDataError: false,

    // for Referral Participant Data
    referralParticipantData: null,
    isParticipantdata: false,
    participantDataError: false,

    // for Referral Clicks Data
    referralClicksData: null,
    isClicksdata: false,
    clicksDataError: false,

    // for Referral Converts Data
    referralConvertsData: null,
    isConvertsdata: false,
    convertsDataError: false,
}

export default function ReferralSystemCountReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle referral Invites list method data
        case GET_REFERRAL_INVITES_LIST: {
            return Object.assign({}, state, {
                referralInvitesData: null,
                isInviting: true,
                invitesDataError: false,
            })
        }
        // Set referral Invites list success data
        case GET_REFERRAL_INVITES_LIST_SUCCESS: {
            return Object.assign({}, state, {
                referralInvitesData: action.data,
                isInviting: false,
                invitesDataError: false
            })
        }
        // Set referral Invites list failure data
        case GET_REFERRAL_INVITES_LIST_FAILURE: {
            return Object.assign({}, state, {
                referralInvitesData: null,
                isInviting: false,
                invitesDataError: true
            })
        }

        // Handle referral email list method data
        case GET_REFERRAL_EMAIL_LIST: {
            return Object.assign({}, state, {
                referralEmailData: null,
                isEmaildata: true,
                emailDataError: false,
            })
        }
        // Set referral email list success data
        case GET_REFERRAL_EMAIL_LIST_SUCCESS: {
            return Object.assign({}, state, {
                referralEmailData: action.data,
                isEmaildata: false,
                emailDataError: false
            })
        }
        // Set referral email list failure data
        case GET_REFERRAL_EMAIL_LIST_FAILURE: {
            return Object.assign({}, state, {
                referralEmailData: null,
                isEmaildata: false,
                emailDataError: true
            })
        }

        // Handle referral participant list method data
        case GET_REFERRAL_PARTICIPANT_LIST: {
            return Object.assign({}, state, {
                referralParticipantData: null,
                isParticipantdata: true,
                participantDataError: false,
            })
        }
        // Set referral participant list success data
        case GET_REFERRAL_PARTICIPANT_LIST_SUCCESS: {
            return Object.assign({}, state, {
                referralParticipantData: action.data,
                isParticipantdata: false,
                participantDataError: false
            })
        }
        // Set referral participant list failure data
        case GET_REFERRAL_PARTICIPANT_LIST_FAILURE: {
            return Object.assign({}, state, {
                referralParticipantData: null,
                isParticipantdata: false,
                participantDataError: true
            })
        }

        // Handle referral clicks list method data
        case GET_REFERRAL_CLICKS_LIST: {
            return Object.assign({}, state, {
                referralClicksData: null,
                isClicksdata: true,
                clicksDataError: false,
            })
        }
        // Set referral clicks list success data
        case GET_REFERRAL_CLICKS_LIST_SUCCESS: {
            return Object.assign({}, state, {
                referralClicksData: action.data,
                isClicksdata: false,
                clicksDataError: false
            })
        }
        // Set referral clicks list failure data
        case GET_REFERRAL_CLICKS_LIST_FAILURE: {
            return Object.assign({}, state, {
                referralClicksData: null,
                isClicksdata: false,
                clicksDataError: true
            })
        }

        // Handle referral converts list method data
        case GET_REFERRAL_CONVERTS_LIST: {
            return Object.assign({}, state, {
                referralConvertsData: null,
                isConvertsdata: true,
                convertsDataError: false,
            })
        }
        // Set referral converts list success data
        case GET_REFERRAL_CONVERTS_LIST_SUCCESS: {
            return Object.assign({}, state, {
                referralConvertsData: action.data,
                isConvertsdata: false,
                convertsDataError: false
            })
        }
        // Set referral converts list failure data
        case GET_REFERRAL_CONVERTS_LIST_FAILURE: {
            return Object.assign({}, state, {
                referralConvertsData: null,
                isConvertsdata: false,
                convertsDataError: true
            })
        }

        // Clear all referral data
        case CLEAR_ALL_REFERRAL_DATA: {
            return Object.assign({}, state, {
                referralInvitesData: null,
                referralParticipantData: null,
                referralClicksData: null,
                referralEmailData: null,
                referralConvertsData: null,
            })
        }
        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}