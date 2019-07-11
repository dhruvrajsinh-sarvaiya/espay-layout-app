/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Country Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_COUNTRY,
    GET_COUNTRY_SUCCESS,
    GET_COUNTRY_FAILURE,
    ADD_NEW_COUNTRY,
    ADD_NEW_COUNTRY_SUCCESS,
    ADD_NEW_COUNTRY_FAILURE,
    UPDATE_COUNTRY,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAILURE,
    //DELETE_COUNTRY,
    GET_COUNTRY_BY_ID,
    GET_COUNTRY_BY_ID_SUCCESS,
    GET_COUNTRY_BY_ID_FAILURE
} from 'Actions/types';

// initial state
const INITIAL_STATE = {
    country_list: [],
    loading: false,
    data: [],
    updatedata: {},
    localebit: 1,
    errors: {}
};
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // get Country List
        case GET_COUNTRY:
            return { ...state, loading: true, data: [], updatedata: {}, localebit: 0 };

        // get Country List success
        case GET_COUNTRY_SUCCESS:
            return { ...state, loading: false, data: [], country_list: action.payload, localebit: 0 };

        // get Country List failure
        case GET_COUNTRY_FAILURE:
        case UPDATE_COUNTRY_FAILURE:
        case ADD_NEW_COUNTRY_FAILURE:
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        // add Country
        case ADD_NEW_COUNTRY:
        //For Get Country By Id
        case GET_COUNTRY_BY_ID:
        // Update Country Data
        case UPDATE_COUNTRY:
            return { ...state, loading: true, data: [], localebit: 0 };

        case ADD_NEW_COUNTRY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case UPDATE_COUNTRY_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case GET_COUNTRY_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], updatedata: action.payload, localebit: 0 };

        case GET_COUNTRY_BY_ID_FAILURE:
            return { ...state, loading: false, data: [], localebit: 0 };

        default: return { ...state };
    }
}