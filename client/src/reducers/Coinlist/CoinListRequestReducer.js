/* 
    Createdby :dhara gajera
    CreatedDate : 4-1-2019
    Description : Coinlist request data Reducer action manager
*/
// action types
import {
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    ADD_COINLIST_REQUEST,
    ADD_COINLIST_REQUEST_SUCCESS,
    ADD_COINLIST_REQUEST_FAILURE,

    GET_COUNTRY,
    GET_COUNTRY_SUCCESS,
    GET_COUNTRY_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    coinFields_list:[],
    data: [],
    loading: false,
    country_list:[]
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get Coinlist
        case GET_COINLIST_REQUEST:
            return { ...state,loading:true,data:[]};

        // get Coinlist success
        case GET_COINLIST_REQUEST_SUCCESS:
            return { ...state, loading: false, data:[],coinFields_list:action.payload };

        // get Coinlist failure
        case GET_COINLIST_REQUEST_FAILURE:
            return {...state, loading: false,data:[]};

        // add coin list request form data Result
        case ADD_COINLIST_REQUEST:
            return { ...state, loading: true,data:[]};

        // add coin list request form data Success
        case ADD_COINLIST_REQUEST_SUCCESS:
            return { ...state, loading: false,data:action.payload};

        // add coin list request form data  Failure
        case ADD_COINLIST_REQUEST_FAILURE:
            return {...state, loading: false,data:action.payload};

        // get country list 
        case GET_COUNTRY:
        return { ...state, loading: true,data:[]};

        // get country list Success
        case GET_COUNTRY_SUCCESS:
            return { ...state, loading: false,country_list:action.payload};

        // get country list Failure
        case GET_COUNTRY_FAILURE:
            return {...state, loading: false,data:action.payload};

        default: return { ...state };
    }
}
