/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 24-09-2018
    UpdatedDate : 20-10-2018
    Description : Faq data Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_FAQ_CATEGORIES,
    GET_FAQ_CATEGORIES_SUCCESS,
    GET_FAQ_CATEGORIES_FAILURE,
    ADD_FAQ_CATEGORY,
    ADD_FAQ_CATEGORY_SUCCESS,
    ADD_FAQ_CATEGORY_FAILURE,
    UPDATE_FAQ_CATEGORY,
    UPDATE_FAQ_CATEGORY_SUCCESS,
    UPDATE_FAQ_CATEGORY_FAILURE,
    DELETE_FAQ_CATEGORY,
    DELETE_FAQ_CATEGORY_SUCCESS,
    DELETE_FAQ_CATEGORY_FAILURE,
    GET_FAQ_CATEGORY_BY_ID,
    GET_FAQ_CATEGORY_BY_ID_SUCCESS,
    GET_FAQ_CATEGORY_BY_ID_FAILURE,
    FILTER_EXCHANGE_CATEGORY
} from 'Actions/types';

// initial state
const INIT_STATE = {
    faqs_categories_list:[],
    categorydetail:{},
    data:[],
    loading: false,
    errors:{},
    localebit:1,
    deleteevent:0

};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }

    switch (action.type) {
        // get Faq Category
        case GET_FAQ_CATEGORIES:
            return { ...state,loading:true,data:[],localebit:0,deleteevent:0};

        // get Faq Category success
        case GET_FAQ_CATEGORIES_SUCCESS:
            return { ...state, loading: false,data:[],faqs_categories_list:action.payload,localebit:0};

        // get Faq Category failure
        case GET_FAQ_CATEGORIES_FAILURE:
        case DELETE_FAQ_CATEGORY_FAILURE:
            return {...state, loading: false,data:action.payload,localebit:0};

         // add new Faq Category
        case ADD_FAQ_CATEGORY:
        case GET_FAQ_CATEGORY_BY_ID:
            return { ...state, loading: true,data:[],localebit:0,deleteevent:0};
     
        case ADD_FAQ_CATEGORY_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.categoryform.addcategory_success" />);
            return { ...state, loading: false,data:action.payload, localebit:0};

        case ADD_FAQ_CATEGORY_FAILURE:
            return {...state, loading: false,data:action.payload, localebit:0};

        // Update Faq Category
        case UPDATE_FAQ_CATEGORY:
            return { ...state, loading: false,data:[],localebit:0,deleteevent:0};
 
        case UPDATE_FAQ_CATEGORY_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.categoryform.editcategory_success" />);
            return { ...state, loading: false,data: action.payload,localebit:0};

        case UPDATE_FAQ_CATEGORY_FAILURE:
            return {...state, loading: false,data: action.payload,localebit:0};

        // delete Faq category
        case DELETE_FAQ_CATEGORY:
            return {...state, loading: true,data:[],localebit:0,deleteevent:0};

        case DELETE_FAQ_CATEGORY_SUCCESS:
            NotificationManager.success(<IntlMessages id="faq.categoryform.deletecategory_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0,deleteevent:1}; 

        case GET_FAQ_CATEGORY_BY_ID_SUCCESS:
            return { ...state, loading: false, data:[], categorydetail: action.payload,localebit:0};

        case GET_FAQ_CATEGORY_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        // Filter Exchange Category
        case FILTER_EXCHANGE_CATEGORY:
            return { ...state };
            
        default: return { ...state };
    }
}
