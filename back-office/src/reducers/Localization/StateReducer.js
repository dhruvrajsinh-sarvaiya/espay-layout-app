/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : State Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_STATE,
    GET_STATE_SUCCESS,
    GET_STATE_FAILURE,
    ADD_NEW_STATE,
    ADD_NEW_STATE_SUCCESS,
    ADD_NEW_STATE_FAILURE,
    UPDATE_STATE,
    UPDATE_STATE_SUCCESS,
    UPDATE_STATE_FAILURE,
    // DELETE_STATE,
    GET_STATE_BY_ID,
    GET_STATE_BY_ID_SUCCESS,
    GET_STATE_BY_ID_FAILURE,
    GET_STATE_BY_COUNTRY_ID,
    GET_STATE_BY_COUNTRY_ID_SUCCESS,
    GET_STATE_BY_COUNTRY_ID_FAILURE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    state_list: [],
    country_state_list: [],
    loading: false,
    data: [],
    statesdata: {},
    localebit: 1,
    errors: {}
};
export default (state, action) => {
    if (typeof state === 'undefined') {
      return INIT_STATE
    }

    switch (action.type) {
        // get State List
        case GET_STATE:
            return { ...state, loading: true, data: [], statesdata: {}, country_state_list: [], localebit: 0 };

        // get State List success
        case GET_STATE_SUCCESS:
            return { ...state, loading: false, data: [], state_list: action.payload, localebit: 0 };

        // get State List failure
        case GET_STATE_FAILURE:
        case ADD_NEW_STATE_FAILURE:
        return { ...state, loading: false, data: action.payload, localebit: 0 };

        // add State
        case ADD_NEW_STATE:
            return { ...state, loading: true, data: [], localebit: 0 };

        case ADD_NEW_STATE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.add.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

            // Update State Data
        case UPDATE_STATE:
        case GET_STATE_BY_ID:
        case GET_STATE_BY_COUNTRY_ID:
            return { ...state, loading: true, data: [], localebit: 0 };

        case UPDATE_STATE_SUCCESS:
            NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case UPDATE_STATE_FAILURE:
            return { ...state, loading: false, data: action.payload, localebit: 0 };

        case GET_STATE_BY_ID_SUCCESS:
            return { ...state, loading: false, data: [], statesdata: action.payload, localebit: 0 };

        case GET_STATE_BY_ID_FAILURE:
        case GET_STATE_BY_COUNTRY_ID_FAILURE:
            return { ...state, loading: false, data: [], localebit: 0 };

        case GET_STATE_BY_COUNTRY_ID_SUCCESS:
            return { ...state, loading: false, data: [], country_state_list: action.payload, localebit: 0 };


        default: return { ...state };
    }
}