/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : Annoucement data Reducer action manager
*/

// action types
import {
    GET_ANNOUCEMENT,
    GET_ANNOUCEMENT_SUCCESS,
    GET_ANNOUCEMENT_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    annoucements: [],
    loading: false,
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }

    switch (action.type) {

        // get Announcement
        case GET_ANNOUCEMENT:
            return { ...state,loading:true};

        // get Announcement success
        case GET_ANNOUCEMENT_SUCCESS:
            return { ...state, loading: false, annoucements:action.payload };

        // get Announcement failure
        case GET_ANNOUCEMENT_FAILURE:
            return {...state, loading: false,};

        default: return { ...state };
    }
}
