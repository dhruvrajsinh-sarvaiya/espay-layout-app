/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 04-10-2018
    UpdatedDate : 04-10-2018
    Description : News Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAILURE,
    ADD_NEWS,
    ADD_NEWS_SUCCESS,
    ADD_NEWS_FAILURE,
    UPDATE_NEWS,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAILURE,
    DELETE_NEWS,
    DELETE_NEWS_SUCCESS,
    DELETE_NEWS_FAILURE,
    GET_NEWS_BY_ID,
    GET_NEWS_BY_ID_SUCCESS,
    GET_NEWS_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    news_list:[],
    newsdetail:{},
    data:[],
    loading: false,
    errors:{},
    localebit:1,
    deleteevent:0
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // get News List
        case GET_NEWS:
            return { ...state,loading:true,data:[],localebit:0,deleteevent:0};

        // get News List success
        case GET_NEWS_SUCCESS:
            return { ...state, loading: false,data:[],news_list:action.payload,localebit:0};

        // get News List failure
        case GET_NEWS_FAILURE:
            return {...state, loading: false,data:action.payload,localebit:0};

         // add News
         case ADD_NEWS:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};
     
        case ADD_NEWS_SUCCESS:
            NotificationManager.success(<IntlMessages id="news.form.addnews_success" />);
            return { ...state, loading: false, data:action.payload, localebit:0};

        case ADD_NEWS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false, data:action.payload, localebit:0};

        // Update News Data
        case UPDATE_NEWS:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};
 
        case UPDATE_NEWS_SUCCESS:
            NotificationManager.success(<IntlMessages id="news.form.editnews_success" />);
            return { ...state, loading: false,data: action.payload,localebit:0};

        case UPDATE_NEWS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

         // delete News
        case DELETE_NEWS:
            return {...state, loading: true,data:[],localebit:0,deleteevent:0};

        case DELETE_NEWS_SUCCESS:
            NotificationManager.success(<IntlMessages id="news.form.deletenews_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0,deleteevent:1};

        case DELETE_NEWS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        //For Get News By Id
        case GET_NEWS_BY_ID:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};

        case GET_NEWS_BY_ID_SUCCESS:
            return { ...state, loading: false, data:[],newsdetail: action.payload,localebit:0};

        case GET_NEWS_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        default: return { ...state };
    }
}
