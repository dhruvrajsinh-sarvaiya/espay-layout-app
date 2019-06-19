/* 
    Createdby : Jayesh Pathak
    Updateby : Kushal Parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 11-01-2019
    Description : handle State for HelpCenter Action
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";

import {
    GET_HELPMANUALMODUALS,
    GET_HELPMANUALMODUALS_SUCCESS,
    GET_HELPMANUALMODUALS_FAILURE,
    GET_HELPMANUALS_BY_ID,
    GET_HELPMANUALS_BY_ID_SUCCESS,
    GET_HELPMANUALS_BY_ID_FAILURE,
    UPDATE_SEARCH_HELP,
    ON_SEARCH_HELP,
    SHOW_HELP_LOADING_INDICATOR,
    HIDE_HELP_LOADING_INDICATOR,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    helpmanualmodules: [],
    data:[],
    loading: false,
    helpmanualdetails:[],
    allhelpmanualdetails:null,
    searchHelpText: '',
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        // get help manual module
        case GET_HELPMANUALMODUALS:
            return { ...state,loading: true,data:[],helpmanualmodules:[]};

        // get help manual module success
        case GET_HELPMANUALMODUALS_SUCCESS:
            return { ...state,loading: false, helpmanualmodules: action.payload };

        // get help manual module failure
        case GET_HELPMANUALMODUALS_FAILURE:
            return {...state,loading: false,data:action.payload,helpmanualmodules:[]};

        //For Get help manual details By Id
        case GET_HELPMANUALS_BY_ID:
            return { ...state, loading: true,data:[],helpmanualdetails:[],searchHelpText:''};

        // get help manual module details By Id success
        case GET_HELPMANUALS_BY_ID_SUCCESS:
            return { ...state, loading: false,data:[],allhelpmanualdetails: action.payload,helpmanualdetails: action.payload};

        // get help manual module details By Id success
        case GET_HELPMANUALS_BY_ID_FAILURE:
            return { ...state, loading: false,data:action.payload,helpmanualdetails:[]};

        // show loading indicator
        case SHOW_HELP_LOADING_INDICATOR:
            return { ...state, loading: true };

        // hide loading indicator
        case HIDE_HELP_LOADING_INDICATOR:
            return { ...state, loading: false };
     
        // update search
        case UPDATE_SEARCH_HELP:
            return { ...state, searchHelpText: action.payload };

        // on search faq
        case ON_SEARCH_HELP:
            if (action.payload === '') {
                return { ...state, helpmanualdetails: state.allhelpmanualdetails, loading: false };
            } else {
                const searchHelps = state.allhelpmanualdetails.filter((help) =>
                help.locale[localStorage.getItem('locale')].title.toLowerCase().indexOf(action.payload.toLowerCase()) > -1);
                return { ...state, helpmanualdetails: searchHelps, loading: false }
            }

        default: return { ...state };
    }
}
