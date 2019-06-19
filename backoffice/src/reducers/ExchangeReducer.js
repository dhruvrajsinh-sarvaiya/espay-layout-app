/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 26-09-2018
    UpdatedDate : 26-09-2018
    Description : Exchange data Reducer action manager
*/
import { NotificationManager } from 'react-notifications';
// action types
import {
    GET_EXCHANGE,
    GET_EXCHANGE_SUCCESS,
    GET_EXCHANGE_FAILURE
} from '../actions/types';

// initial state
const INIT_STATE = {
    exchange_list:[],
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get Exchange Data
        case GET_EXCHANGE:
            return { ...state,loading:true};

        // get Exchange Data success
        case GET_EXCHANGE_SUCCESS:
            return { ...state, loading: false,exchange_list:action.payload};

        // get get Exchange Data failure
        case GET_EXCHANGE_FAILURE:
            NotificationManager.error(action.payload)
            return {...state, loading: false};

        default: return { ...state };
    }
}
