/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : City Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_CITY,
    GET_CITY_SUCCESS,
    GET_CITY_FAILURE,
    ADD_NEW_CITY,
    ADD_NEW_CITY_SUCCESS,
    ADD_NEW_CITY_FAILURE,
    UPDATE_CITY,
    UPDATE_CITY_SUCCESS,
    UPDATE_CITY_FAILURE,
    //DELETE_CITY,
    GET_CITY_BY_ID,
    GET_CITY_BY_ID_SUCCESS,
    GET_CITY_BY_ID_FAILURE,
     //Added by dhara gajera 11/2/2019
     GET_CITY_BY_STATE_ID,
     GET_CITY_BY_STATE_ID_SUCCESS,
     GET_CITY_BY_STATE_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    loading: false,
    city_list: [],
    data: [],
    citiesdata: {},
    localebit: 1,
    errors: {},
    state_city_list:[]

};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
        // get City List
        case GET_CITY:
            return { ...state, loading: true, data: [], citiesdata: {}, localebit: 0 };

        // get City List success
        case GET_CITY_SUCCESS:
            return { ...state, loading: false, city_list: action.payload, localebit: 0 };

        // get City List failure
        case GET_CITY_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        // add City
        case ADD_NEW_CITY:
            return { ...state, loading: true, data: [], localebit: 0 };

        case ADD_NEW_CITY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case ADD_NEW_CITY_FAILURE:
            // NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        // Update City Data
        case UPDATE_CITY:
            return { ...state, loading: true, data: [], localebit: 0 };

        case UPDATE_CITY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case UPDATE_CITY_FAILURE:
            //NotificationManager.error(action.payload)
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        //For Get State By Id
        case GET_CITY_BY_ID:
            return { ...state, loading: true, data: [], localebit: 0 };

        case GET_CITY_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], citiesdata: action.payload, localebit: 0 };

        case GET_CITY_BY_ID_FAILURE:
            return { ...state, loading: false, data: [], localebit: 0 };
        
        //For Get cities By state Id Added by dhara gajera 11/2/2019 for zip codes
        case GET_CITY_BY_STATE_ID:
            return { ...state, loading: true, data: [], localebit: 0 };

        case GET_CITY_BY_STATE_ID_SUCCESS:
            return { ...state, loading: false, data: [], state_city_list: action.payload, localebit: 0 };

        case GET_CITY_BY_STATE_ID_FAILURE:
            return { ...state, loading: false, data: [], localebit: 0 };


        default: return { ...state };
    }
}