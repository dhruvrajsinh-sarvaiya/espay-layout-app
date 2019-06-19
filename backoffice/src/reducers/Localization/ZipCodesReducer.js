/* 
    Createdby : Dhara gajera 
    CreatedDate : 8/2/2019
    Description : zip code Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_ZIPCODES,
    GET_ZIPCODES_SUCCESS,
    GET_ZIPCODES_FAILURE,
    ADD_NEW_ZIPCODES,
    ADD_NEW_ZIPCODES_SUCCESS,
    ADD_NEW_ZIPCODES_FAILURE,
    GET_ZIPCODES_BY_ID,
    GET_ZIPCODES_BY_ID_SUCCESS,
    GET_ZIPCODES_BY_ID_FAILURE,
    UPDATE_ZIPCODES,
    UPDATE_ZIPCODES_SUCCESS,
    UPDATE_ZIPCODES_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    zipcodes_list: [],
    city_zipcodes_list: [],
    loading: false,
    data: [],
    errors: {},
    zipcodesdata:[]
};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // get zipcodes List
        case GET_ZIPCODES:
            return { ...state, loading: true, data: [],zipcodesdata:[], city_zipcodes_list: [] };

        // get zipcodes List success
        case GET_ZIPCODES_SUCCESS:
            return { ...state, loading: false, data: [], zipcodes_list: action.payload };

        // get zipcodes List failure
        case GET_ZIPCODES_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload };

        // add State
        case ADD_NEW_ZIPCODES:
            return { ...state, loading: true, data: [] };

        case ADD_NEW_ZIPCODES_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, data: action.payload };

        case ADD_NEW_ZIPCODES_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload };
       
        //For Get zipcode By Id
        case GET_ZIPCODES_BY_ID:
            return { ...state, loading: true, data: []};

        case GET_ZIPCODES_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], zipcodesdata: action.payload };

        case GET_ZIPCODES_BY_ID_FAILURE:
            return { ...state, loading: false, data: [] };
 
        // Update zipcode Data
        case UPDATE_ZIPCODES:
            return { ...state, loading: true, data: [] };

        case UPDATE_ZIPCODES_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload};

        case UPDATE_ZIPCODES_FAILURE:
            //NotificationManager.error(action.payload) 
            return { ...state, loading: false, data: action.payload};

        default: return { ...state };
    }
}