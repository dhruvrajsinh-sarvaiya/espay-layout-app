// Action types for Add Currency Logo
import {
    //Add Currecny Logo
    ADD_CURRENCY_LOGO,
    ADD_CURRENCY_LOGO_SUCCESS,
    ADD_CURRENCY_LOGO_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Add Currency Logo
const INTIAL_STATE = {
    // Add Currency Logo
    AddCurrencyLogoFetchData: true,
    AddCurrencyLogodata: '',
    AddCurrencyLogoisFetching: false,
}

const AddCurrencyLogoReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Add Currency Logo method data
        case ADD_CURRENCY_LOGO:
            return Object.assign({}, state, {
                AddCurrencyLogoFetchData: true,
                AddCurrencyLogoisFetching: true,
                AddCurrencyLogodata: ''
            });
        // Set Add Currency Logo success data
        case ADD_CURRENCY_LOGO_SUCCESS:
            return Object.assign({}, state, {
                AddCurrencyLogoFetchData: false,
                AddCurrencyLogoisFetching: false,
                AddCurrencyLogodata: action.payload
            });
        // Set Add Currency Logo failure data
        case ADD_CURRENCY_LOGO_FAILURE:
            return Object.assign({}, state, {
                AddCurrencyLogoFetchData: false,
                AddCurrencyLogoisFetching: false,
                AddCurrencyLogodata: action.payload
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default AddCurrencyLogoReducer;