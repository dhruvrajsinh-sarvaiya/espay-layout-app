/* 
    Developer : Kevin Ladani
    Date : 16-01-2019
    File Comment : MyAccount IP Range Dashboard
*/
import {
    LIST_IPRANGE_DASHBOARD,
    LIST_IPRANGE_DASHBOARD_SUCCESS,
    LIST_IPRANGE_DASHBOARD_FAILURE,

    ADD_IPRANGE_DASHBOARD,
    ADD_IPRANGE_DASHBOARD_SUCCESS,
    ADD_IPRANGE_DASHBOARD_FAILURE,

    DELETE_IPRANGE_DASHBOARD,
    DELETE_IPRANGE_DASHBOARD_SUCCESS,
    DELETE_IPRANGE_DASHBOARD_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    IPRangeData: [],
    conversion: [],
    data: [],
    loading: false,
    ext_flag: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //List IP Range Configuration..
        case LIST_IPRANGE_DASHBOARD:
            return { ...state, loading: true, ext_flag: false };

        case LIST_IPRANGE_DASHBOARD_SUCCESS:
            return { ...state, loading: false, IPRangeData: action.payload };

        case LIST_IPRANGE_DASHBOARD_FAILURE:
            return { ...state, loading: false, IPRangeData: action.payload };

        //Add IP Range Configuration..
        case ADD_IPRANGE_DASHBOARD:
            return { ...state, loading: true };

        case ADD_IPRANGE_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_IPRANGE_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Delete IP Range Configuration..
        case DELETE_IPRANGE_DASHBOARD:
            return { ...state, loading: true };

        case DELETE_IPRANGE_DASHBOARD_SUCCESS:
            return { ...state, loading: false, conversion: action.payload, ext_flag: true };

        case DELETE_IPRANGE_DASHBOARD_FAILURE:
            return { ...state, loading: false, conversion: action.payload, ext_flag: true };

        default:
            return { ...state };
    }
};