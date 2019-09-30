import {
    //Add Currecny Logo
    ADD_CURRENCY_LOGO,
    ADD_CURRENCY_LOGO_SUCCESS,
    ADD_CURRENCY_LOGO_FAILURE,

    // Clear data
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {
    //Initial State For Add Currency Logo
    isLoadinCurrencyLogo: false,
    AddCurrencyLogodata: null,
}

export default function AddCurrencyLogoReducer(state, action) {

    // If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        //For Add Currency Logo
        case ADD_CURRENCY_LOGO:
            return Object.assign({}, state, {
                isLoadinCurrencyLogo: true,
                AddCurrencyLogodata: null
            });
        case ADD_CURRENCY_LOGO_SUCCESS:
        case ADD_CURRENCY_LOGO_FAILURE:
            return Object.assign({}, state, {
                isLoadinCurrencyLogo: false,
                AddCurrencyLogodata: action.payload
            });
    
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}