/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Email Provider Dashboard
*/
import {
    EMAIL_PROVIDER_DASHBOARD,
    EMAIL_PROVIDER_DASHBOARD_SUCCESS,
    EMAIL_PROVIDER_DASHBOARD_FAILURE
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    emlPrvdrDashData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EMAIL_PROVIDER_DASHBOARD:
            return { ...state, loading: true, emlPrvdrDashData: '' };

        case EMAIL_PROVIDER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, emlPrvdrDashData: action.payload };

        case EMAIL_PROVIDER_DASHBOARD_FAILURE:
            return { ...state, loading: false, emlPrvdrDashData: action.payload };

        default:
            return { ...state };
    }
};