/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : Region Reducer action manager
*/
import React from 'react';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// action types
import {
    GET_REGIONS,
    GET_REGIONS_SUCCESS,
    GET_REGIONS_FAILURE,
    ADD_NEW_REGION,
    ADD_NEW_REGION_SUCCESS,
    ADD_NEW_REGION_FAILURE,
    UPDATE_REGION,
    UPDATE_REGION_SUCCESS,
    UPDATE_REGION_FAILURE,
    GET_REGION_BY_ID,
    GET_REGION_BY_ID_SUCCESS ,
    GET_REGION_BY_ID_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    region_list:[],
    loading: false,
    data:[],
    regiondetail:{},
    updatestatus:'',
    errors:{},
    localebit:1,
};


export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        // get Region List
        case GET_REGIONS:
        case ADD_NEW_REGION:
            return { ...state, loading: true,data:[],localebit:0};

        // get Region List success
        case GET_REGIONS_SUCCESS:
            return { ...state, loading: false,data:[],region_list:action.payload,localebit:0};

        // get Region List failure
        case GET_REGIONS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};
     
        case ADD_NEW_REGION_SUCCESS:
            NotificationManager.success(<IntlMessages id="region.regionform.addregion_success" />);
            return { ...state, loading: false,data:action.payload,localebit:0};

        case ADD_NEW_REGION_FAILURE:
            return {...state, loading: false, data:action.payload, localebit:0};

        // Update Region Data
        case UPDATE_REGION:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};
 
        case UPDATE_REGION_SUCCESS:
            NotificationManager.success(<IntlMessages id="region.regionform.editregion_success" />);
            return { ...state, loading: false, data: action.payload,updatestatus:action.payload.status,localebit:0};

        case UPDATE_REGION_FAILURE:
            NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload,localebit:0};

        //For Get Region By Id
        case GET_REGION_BY_ID:
            return { ...state, loading: true,data:[],updatestatus:'',localebit:0};

        case GET_REGION_BY_ID_SUCCESS:
            return { ...state, loading: false,data:[],regiondetail: action.payload,localebit:0};

        case GET_REGION_BY_ID_FAILURE:
            return { ...state, loading: false,data:[],localebit:0};

        default: return { ...state };
    }
}
