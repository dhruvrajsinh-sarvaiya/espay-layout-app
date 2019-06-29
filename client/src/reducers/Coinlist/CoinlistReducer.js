/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 30-10-2018
    UpdatedDate : 30-10-2018
    Description : Coinlist data Reducer action manager
*/

// action types
import {
    GET_COINLIST,
    GET_COINLIST_SUCCESS,
    GET_COINLIST_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    data: [],
    loading: false,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {

        // get Coinlist
        case GET_COINLIST:
            return { ...state,loading:true,data:[]};

        // get Coinlist success
        case GET_COINLIST_SUCCESS:
            return { ...state, loading: false, data:action.payload };

        // get Coinlist failure
        case GET_COINLIST_FAILURE:
            return {...state, loading: false,};

        default: return { ...state };
    }
}
