/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Affiliate Scheme Reducer
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme
    ADD_AFFILIATE_SCHEME,
    ADD_AFFILIATE_SCHEME_SUCCESS,
    ADD_AFFILIATE_SCHEME_FAILURE,

    //Edit Affiliate Scheme
    EDIT_AFFILIATE_SCHEME,
    EDIT_AFFILIATE_SCHEME_SUCCESS,
    EDIT_AFFILIATE_SCHEME_FAILURE,

    //Change Affiliate Scheme Status
    CHANGE_AFFILIATE_SCHEME_STATUS,
    CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE,

    //List Affiliate Scheme
    LIST_AFFILIATE_SCHEME,
    LIST_AFFILIATE_SCHEME_SUCCESS,
    LIST_AFFILIATE_SCHEME_FAILURE,

    //Get By Id Affiliate Scheme    
    GET_BY_ID_AFFILIATE_SCHEME,
    GET_BY_ID_AFFILIATE_SCHEME_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    data: [],
    list: [],
    getData: [],
    listLoading: false,
    loading: false,
    chngStsData: [],
    plist: [], //Added by Saloni Rathod
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //Add Affiliate Scheme
        case ADD_AFFILIATE_SCHEME:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_AFFILIATE_SCHEME_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_AFFILIATE_SCHEME_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Affiliate Scheme
        case EDIT_AFFILIATE_SCHEME:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_AFFILIATE_SCHEME_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_AFFILIATE_SCHEME_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Added By Bharat Jograna variable chngStsData to get change data
        //Change Affiliate Scheme Status
        case CHANGE_AFFILIATE_SCHEME_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Affiliate Scheme
        case LIST_AFFILIATE_SCHEME:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_AFFILIATE_SCHEME_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_AFFILIATE_SCHEME_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Affiliate Scheme
        case GET_BY_ID_AFFILIATE_SCHEME:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_AFFILIATE_SCHEME_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_AFFILIATE_SCHEME_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};