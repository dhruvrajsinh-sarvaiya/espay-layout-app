import {
    // Forgot Password
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,

    // Clear Data
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    //for forgot password
    ForgotPasswordFetchData: true,
    ForgotPasswordisFetching: false,
    ForgotPassworddata: '',
}

export default function ForgotPasswordReducer(state, action) {

    //If state is undefine then return with initial state		
    if (typeof state === 'undefined')
        return initialState;

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        // Handle Forgot Password method data
        case FORGOT_PASSWORD:
            return Object.assign({}, state, {
                ForgotPasswordFetchData: true,
                ForgotPasswordisFetching: true,
                ForgotPassworddata: null
            })
        // Set Forgot Password success data
        case FORGOT_PASSWORD_SUCCESS:
            return Object.assign({}, state, {
                ForgotPasswordFetchData: false,
                ForgotPasswordisFetching: false,
                ForgotPassworddata: action.payload
            })
        // Set Forgot Password failure data
        case FORGOT_PASSWORD_FAILURE:
            return Object.assign({}, state, {
                ForgotPasswordFetchData: false,
                ForgotPasswordisFetching: false,
                ForgotPassworddata: action.payload,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
} 