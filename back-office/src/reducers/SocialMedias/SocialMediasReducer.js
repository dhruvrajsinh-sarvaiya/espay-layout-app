/* 
    Created By : Megha Kariya
    Date : 12-02-2019
    Description : CMS Social Media Reducer
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_SOCIAL_MEDIAS,
    GET_SOCIAL_MEDIAS_SUCCESS,
    GET_SOCIAL_MEDIAS_FAILURE,
    ADD_NEW_SOCIAL_MEDIA,
    ADD_NEW_SOCIAL_MEDIA_SUCCESS,
    ADD_NEW_SOCIAL_MEDIA_FAILURE,
    UPDATE_SOCIAL_MEDIA,
    UPDATE_SOCIAL_MEDIA_SUCCESS,
    UPDATE_SOCIAL_MEDIA_FAILURE,
   
} from 'Actions/types';

// initial state
const INIT_STATE = {
    cms_SocialMedias_list:[],
    loading: false,
    data:[],
    SocialMediadetail:{},
    updatestatus:'',
    errors:{},
    localebit:1,
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        // get SocialMedias List
        case GET_SOCIAL_MEDIAS:
                case ADD_NEW_SOCIAL_MEDIA:
            return { ...state,loading:true,data:[],localebit:0};

        // get SocialMedias List success
        case GET_SOCIAL_MEDIAS_SUCCESS:
            return { ...state, loading: false,data:[],cms_SocialMedias_list:action.payload,localebit:0};

        // get SocialMedias List failure
        case GET_SOCIAL_MEDIAS_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };
        
        case ADD_NEW_SOCIAL_MEDIA_SUCCESS:
            NotificationManager.success(<IntlMessages id="cmssocialmedia.socialmediaform.addsocialmedia_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0};

        case ADD_NEW_SOCIAL_MEDIA_FAILURE:
            return {...state, loading: false, data:action.payload, localebit:0};

        // Update SocialMedia Data
        case UPDATE_SOCIAL_MEDIA:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};
 
        case UPDATE_SOCIAL_MEDIA_SUCCESS:
            NotificationManager.success(<IntlMessages id="cmssocialmedia.socialmediaform.editsocialmedia_success" />);
            return { ...state, loading: false, data: action.payload,updatestatus:action.payload.status,localebit:0};

        case UPDATE_SOCIAL_MEDIA_FAILURE:
            // NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        default: return { ...state };
    }
}
