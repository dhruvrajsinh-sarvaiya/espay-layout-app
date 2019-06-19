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
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // To SOCIAL TRADING HISTORY
        case SOCIAL_TRADING_HISTORY_LIST:
            return { ...state, loading: true, Data: [] };

        case SOCIAL_TRADING_HISTORY_LIST_SUCCESS:
            return { ...state, loading: false, Data: action.payload };

        case SOCIAL_TRADING_HISTORY_LIST_FAILURE:
            return { ...state, loading: false, Data: action.payload };
        default:
            return { ...state };
    }
}