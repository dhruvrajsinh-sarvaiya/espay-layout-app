/* 
    Created By : Megha Kariya
    Date : 13-02-2019
    Description : Social Media reducer
*/
import {
    GET_SOCIAL_MEDIA_DETAIL,
    GET_SOCIAL_MEDIA_DETAIL_SUCCESS,
    GET_SOCIAL_MEDIA_DETAIL_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    loading: false,
    id:'',
    mediaDetail:{},
    facebookMediaDetail:{},
    twitterMediaDetail:{}
};
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        // get Social Media
        case GET_SOCIAL_MEDIA_DETAIL:
            return { ...state,loading: true,twitterMediaDetail:{},facebookMediaDetail:{}};

        // get Social Media success
        case GET_SOCIAL_MEDIA_DETAIL_SUCCESS:
            if(action.payload[0].social_media_type === "1" && action.payload[0].status === 1) {
                return { ...state,loading: false, twitterMediaDetail: action.payload };
            }
            else if(action.payload[0].social_media_type === "2" && action.payload[0].status === 1) {
                return { ...state,loading: false, facebookMediaDetail: action.payload };
            }

        // get Social Media failure
        case GET_SOCIAL_MEDIA_DETAIL_FAILURE:
            return {...state,loading: false,twitterMediaDetail:{},facebookMediaDetail:{}};
            
        default: return { ...state };
    }
}
