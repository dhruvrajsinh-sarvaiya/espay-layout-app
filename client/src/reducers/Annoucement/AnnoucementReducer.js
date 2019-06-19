/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : Annoucement data Reducer action manager
*/
import { NotificationManager } from 'react-notifications';
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

export default (state = INIT_STATE, action) => {
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
