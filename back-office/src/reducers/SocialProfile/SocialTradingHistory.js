/**
 * Author : Saloni Rathod
 * Created : 20/03/2019
 * Social Trading History
 */
import {
    // Social Trading History
    SOCIAL_TRADING_HISTORY_LIST,
    SOCIAL_TRADING_HISTORY_LIST_SUCCESS,
    SOCIAL_TRADING_HISTORY_LIST_FAILURE

} from 'Actions/types';


/*
* Initial State
*/
const INIT_STATE = {
    loading: false,
    Data: []
}

//Check Action  To SOCIAL TRADING HISTORY
export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        // To SOCIAL TRADING HISTORY
        case SOCIAL_TRADING_HISTORY_LIST:
            return { ...state, loading: true, Data: [] };

        case SOCIAL_TRADING_HISTORY_LIST_SUCCESS:
        case SOCIAL_TRADING_HISTORY_LIST_FAILURE:
            return { ...state, loading: false, Data: action.payload };
        default:
            return { ...state };
    }
}