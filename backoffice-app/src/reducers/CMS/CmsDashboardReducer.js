import {
    // Get CMS Dashboard Details
    GET_CMS_DASHBOARD_DETAILS,
    GET_CMS_DASHBOARD_DETAILS_SUCCESS,
    GET_CMS_DASHBOARD_DETAILS_FAILURE,

    // Clear CMS Dashboard Details
    CLEAR_DATA_GET_CMS_DASHBOARD_DETAILS
} from "../../actions/ActionTypes";
import { ACTION_LOGOUT } from "../../actions/ActionTypes";

const initialState = {

    // Initial State For admin Data
    loading: false,
    cmsDashboardData: null,
}

const CmsDashboardReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        //To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // Handle Get CMS Dashboard Detail method data
        case GET_CMS_DASHBOARD_DETAILS:
            return Object.assign({}, state, { loading: true, cmsDashboardData: null })

        // Set CMS Dashboard Detail success data
        case GET_CMS_DASHBOARD_DETAILS_SUCCESS:
            return Object.assign({}, state, { loading: false, cmsDashboardData: action.response })

        // Set CMS Dashboard Detail failure data
        case GET_CMS_DASHBOARD_DETAILS_FAILURE:
            return Object.assign({}, state, { loading: false, cmsDashboardData: action.response })

        // Clear CMS Dashboard Detail data
        case CLEAR_DATA_GET_CMS_DASHBOARD_DETAILS:
            return initialState

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default CmsDashboardReducer;



