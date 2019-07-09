// Action types for Announcement
import {
    ANNOUCEMENT_FETCH,
    ANNOUCEMENT_FETCH_SUCCESS,
    ANNOUCEMENT_FETCH_FAILURE,
    CLEAR_ANNOUNCEMENT_DATA,
    ACTION_LOGOUT
} from '../actions/ActionTypes'

// Initial state for Announcement
const INTIAL_STATE = {
    // Fetch announcement
    isannouncefetch: false,
    announcementdata: null,
    announcementdataFetch: true,
}

export default function AnnouncementReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Announcement Fetch method data
        case ANNOUCEMENT_FETCH:
            return {
                ...state,
                isannouncefetch: true,
                announcementdata: null,
                announcementdataFetch: true,
            }
        // Set Announcement Fetch success data
        case ANNOUCEMENT_FETCH_SUCCESS:
            return {
                ...state,
                isannouncefetch: false,
                announcementdata: action.data,
                announcementdataFetch: false,
            }
        // Set Announcement Fetch failure data
        case ANNOUCEMENT_FETCH_FAILURE:
            return {
                ...state,
                isannouncefetch: false,
                announcementdata: null,
                announcementdataFetch: false,
            }

        // Clear Announcement Data
        case CLEAR_ANNOUNCEMENT_DATA:
            return INTIAL_STATE;

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
} 