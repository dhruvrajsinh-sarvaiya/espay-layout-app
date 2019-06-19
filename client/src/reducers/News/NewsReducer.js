/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 18-10-2018
    Description : handle State for News Action
*/
import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    newslist: [],
    loading: false,
    id:'',
    newsdetail:{}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get News
        case GET_NEWS:
            return { ...state,loading: true};

        // get News success
        case GET_NEWS_SUCCESS:
            return { ...state,loading: false, newslist: action.payload };

        // get News failure
        case GET_NEWS_FAILURE:
            return {...state,loading: false};
            
        default: return { ...state };
    }
}
