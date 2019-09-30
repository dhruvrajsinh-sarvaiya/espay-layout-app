import {
    //Edit Profile
    EDIT_PROFILE,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,

    //Get Profile By ID
    GET_PROFILE_BY_ID,
    GET_PROFILE_BY_ID_SUCCESS,
    GET_PROFILE_BY_ID_FAILURE,

    //to clear reducer
    CLEAR_THINGS,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// Initial state for edit profile 
const initialState = {
    data: null,
    loading: false,

    dataUpdateProfile: null,
    loadingUpdateProfile: false
}

export default (state, action) => {

    //If state is undefine then return with initial state		
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        // Handle Edit Profile method data
        case EDIT_PROFILE:
            return Object.assign({}, state, { loadingUpdateProfile: true, dataUpdateProfile: null })
        // Set Edit Profile success data
        case EDIT_PROFILE_SUCCESS:
            return Object.assign({}, state, { loadingUpdateProfile: false, dataUpdateProfile: action.payload })
        // Set Edit Profile failure data
        case EDIT_PROFILE_FAILURE:
            return Object.assign({}, state, { loadingUpdateProfile: false, error: action.payload, dataUpdateProfile: null })

        // Handle Get Profile By ID method data
        case GET_PROFILE_BY_ID:
            return Object.assign({}, state, { loading: true, data: null })
        // Set Profile By ID success data
        case GET_PROFILE_BY_ID_SUCCESS:
            return Object.assign({}, state, { loading: false, data: action.payload })
        // Set Profile By ID failure data
        case GET_PROFILE_BY_ID_FAILURE:
            return Object.assign({}, state, { loading: false, error: action.payload })

        // Clear data
        case CLEAR_THINGS:
            return Object.assign({}, state, { data: null, dataUpdateProfile: null })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}
