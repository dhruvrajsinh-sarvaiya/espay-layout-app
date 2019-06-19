/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : Deposit History Reducer action manager
*/

import { NotificationManager } from 'react-notifications';
//import only required deposit history actions 
import {
    GET_DEPOSIT_HISTORY,
    GET_DEPOSIT_HISTORY_SUCCESS,
    GET_DEPOSIT_HISTORY_FAILURE,
} from 'Actions/types';


//Set Initial State
const INITIAL_STATE = {
    deposithistory: [],
    deposithistoryLoading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_DEPOSIT_HISTORY:
            return { ...state, deposithistoryLoading : true };

        case GET_DEPOSIT_HISTORY_SUCCESS:
            return { ...state, deposithistoryLoading : false, deposithistory: action.payload };

        case GET_DEPOSIT_HISTORY_FAILURE:
            return { ...state, deposithistoryLoading : false, deposithistory : [] };

        default: return { ...state };
    }
}