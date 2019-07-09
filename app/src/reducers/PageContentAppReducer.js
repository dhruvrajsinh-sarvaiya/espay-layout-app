// Action types for Page Content App
import {
    // Get Page Contents
    GET_PAGE_CONTENTS,
    GET_PAGE_CONTENTS_SUCCESS,
    GET_PAGE_CONTENTS_FAILURE,

    // Clear Page Content
    CLEAR_PAGE_CONTENTS,

    // Action Logout
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// initial state for Page Content App
const initialState = {
    loading: false,
    pageContents: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle Page Content method data
        case GET_PAGE_CONTENTS:
            return { ...state, loading: true, pageContents: null };

        // Set Page Content success data
        case GET_PAGE_CONTENTS_SUCCESS:
            return { ...state, loading: false, pageContents: action.payload };

        // Set Page Content failure data
        case GET_PAGE_CONTENTS_FAILURE:
            return { ...state, loading: false, pageContents: null }

        // Clear PAGE_CONTENTS Data
        case CLEAR_PAGE_CONTENTS:
            return {
                ...state,
                loading: false,
                pageContents: null,
            }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
