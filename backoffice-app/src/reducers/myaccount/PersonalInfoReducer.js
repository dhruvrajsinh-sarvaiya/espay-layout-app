import {
    // For Get Personal Information
    GET_PERSONAL_INFO,
    GET_PERSONAL_INFO_SUCCESS,
    GET_PERSONAL_INFO_FAILURE,

    // For Update Personal Information
    EDIT_PERSONAL_INFO,
    EDIT_PERSONAL_INFO_SUCCESS,
    EDIT_PERSONAL_INFO_FAILURE,

    //clear data
    CLEAR_PERSONAL_INFO,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {

    //Personal Information data
    getProfileLoading: false,
    ProfileData: null,

    //Update Personal Information data
    editProfileLoading: false,
    EditProfileData: null
}

export default function PersonalInfoReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        //Handle personal info method data
        case GET_PERSONAL_INFO:
            return Object.assign({}, state, { getProfileLoading: true, ProfileData: null })
        //Set personal info success method data
        case GET_PERSONAL_INFO_SUCCESS:
            return Object.assign({}, state, { getProfileLoading: false, ProfileData: action.payload })
        //Set personal info failure method data
        case GET_PERSONAL_INFO_FAILURE:
            return Object.assign({}, state, { getProfileLoading: false, ProfileData: null })

        //Handle update personal info method data
        case EDIT_PERSONAL_INFO:
            return Object.assign({}, state, { editProfileLoading: true, EditProfileData: null })
        //Set update personal info success method data
        case EDIT_PERSONAL_INFO_SUCCESS:
            return Object.assign({}, state, { editProfileLoading: false, EditProfileData: action.payload })
        //Set update personal info failure method data
        case EDIT_PERSONAL_INFO_FAILURE:
            return Object.assign({}, state, { editProfileLoading: false, EditProfileData: null })

        //clear data
        case CLEAR_PERSONAL_INFO:
            return initialState

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
} 