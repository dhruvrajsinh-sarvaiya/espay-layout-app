/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 21-09-2018
    UpdatedDate : 21-09-2018
    Description : API data Reducer action manager
*/
import { NotificationManager } from 'react-notifications';
// action types
import {
    GET_API,
    GET_API_SUCCESS,
    GET_API_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    apis:null,
    apiloading: false,
};

export default (state = INIT_STATE, action) => {
   // console.log("actiontype",action.type);
    switch (action.type) {

        // get Api
        case GET_API:
            return { ...state,apiloading:true};

        // get Api success
        case GET_API_SUCCESS:
            return { ...state, apiloading: false,apis:action.payload};

        // get Api failure
        case GET_API_FAILURE:
            NotificationManager.error(action.payload)
            return {...state, faqloading: false,};

        default: return { ...state };
    }
}
