import { 
    // Get License Detail
    GET_LICENSE_DETAIL, 
    GET_LICENSE_DETAIL_SUCCESS, 
    GET_LICENSE_DETAIL_FAILURE, 

    // Clear data
    ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial State for License Detail
const INITIAL_STATE = {
    // for License Detail
    LicenseDetailData: null,
    LicenseDetailLoading: false,
    LicenseDeatilError: false,
}

export default function SplashScreenReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle License Detail method data
        case GET_LICENSE_DETAIL:
            return Object.assign({}, state, {
                LicenseDetailData: null,
                LicenseDetailLoading: true
            })
        // Set License Detail success data
        case GET_LICENSE_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                LicenseDetailData: action.data,
                LicenseDetailLoading: false,
            })
        // Set License Detail failure data
        case GET_LICENSE_DETAIL_FAILURE:
            return Object.assign({}, state, {
                LicenseDetailData: null,
                LicenseDetailLoading: false,
                LicenseDeatilError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}