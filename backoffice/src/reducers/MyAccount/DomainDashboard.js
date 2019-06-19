/* 
    Developer : Kevin Ladani
    Date : 24-11=2-2018
    File Comment : MyAccount Domain Dashboard
*/
import {
    DOMAIN_DASHBOARD,
    DOMAIN_DASHBOARD_SUCCESS,
    DOMAIN_DASHBOARD_FAILURE,

    ADD_DOMAIN,
    ADD_DOMAIN_SUCCESS,
    ADD_DOMAIN_FAILURE,

    LIST_DOMAIN,
    LIST_DOMAIN_SUCCESS,
    LIST_DOMAIN_FAILURE,

    LIST_ACTIVE_DOMAIN,
    LIST_ACTIVE_DOMAIN_SUCCESS,
    LIST_ACTIVE_DOMAIN_FAILURE,

    LIST_INACTIVE_DOMAIN,
    LIST_INACTIVE_DOMAIN_SUCCESS,
    LIST_INACTIVE_DOMAIN_FAILURE,

    ACTIVE_DOMAIN,
    ACTIVE_DOMAIN_SUCCESS,
    ACTIVE_DOMAIN_FAILURE,

    INACTIVE_DOMAIN,
    INACTIVE_DOMAIN_SUCCESS,
    INACTIVE_DOMAIN_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    domainDashData: [],
    data: [],
    addEditDomainData: [],
    loading: false,
    ext_flag: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case DOMAIN_DASHBOARD:
            return { ...state, loading: true, domainDashData: '' };

        case DOMAIN_DASHBOARD_SUCCESS:
            return { ...state, loading: false, domainDashData: action.payload };

        case DOMAIN_DASHBOARD_FAILURE:
            return { ...state, loading: false, domainDashData: action.payload };

        case ADD_DOMAIN:
            return { ...state, loading: true, addEditDomainData: '' };

        case ADD_DOMAIN_SUCCESS:
            return { ...state, loading: false, addEditDomainData: action.payload };

        case ADD_DOMAIN_FAILURE:
            return { ...state, loading: false, addEditDomainData: action.payload };

        case LIST_DOMAIN:
            return { ...state, loading: true, ext_flag: false, data: '' };

        case LIST_DOMAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case LIST_DOMAIN_FAILURE:
            return { ...state, loading: false, data: action.payload };

        case LIST_ACTIVE_DOMAIN:
            return { ...state, loading: true, ext_flag: false, data: '' };

        case LIST_ACTIVE_DOMAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case LIST_ACTIVE_DOMAIN_FAILURE:
            return { ...state, loading: false, data: action.payload };

        case LIST_INACTIVE_DOMAIN:
            return { ...state, loading: true, ext_flag: false, data: '' };

        case LIST_INACTIVE_DOMAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case LIST_INACTIVE_DOMAIN_FAILURE:
            return { ...state, loading: false, data: action.payload };

        case ACTIVE_DOMAIN:
            return { ...state, loading: true, data: '' };

        case ACTIVE_DOMAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        case ACTIVE_DOMAIN_FAILURE:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        case INACTIVE_DOMAIN:
            return { ...state, loading: true, data: '' };

        case INACTIVE_DOMAIN_SUCCESS:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        case INACTIVE_DOMAIN_FAILURE:
            return { ...state, loading: false, data: action.payload, ext_flag: true };

        default:
            return { ...state };
    }
};