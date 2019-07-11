/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Affiliate Scheme Type Reducer
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Type
    ADD_AFFILIATE_SCHEME_TYPE,
    ADD_AFFILIATE_SCHEME_TYPE_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Edit Affiliate Scheme Type
    EDIT_AFFILIATE_SCHEME_TYPE,
    EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Change Affiliate Scheme Type Status
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS,
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_FAILURE,

    //List Affiliate Scheme Type
    LIST_AFFILIATE_SCHEME_TYPE,
    LIST_AFFILIATE_SCHEME_TYPE_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Get By Id Affiliate Scheme Type    
    GET_BY_ID_AFFILIATE_SCHEME_TYPE,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_FAILURE,

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

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //Add Affiliate Scheme Type
        case ADD_AFFILIATE_SCHEME_TYPE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_AFFILIATE_SCHEME_TYPE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Affiliate Scheme Type
        case EDIT_AFFILIATE_SCHEME_TYPE:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_AFFILIATE_SCHEME_TYPE_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // Added By Bharat Jograna variable chngStsData to get change data
        //Change Affiliate Scheme Type Status
        case CHANGE_AFFILIATE_SCHEME_TYPE_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Affiliate Scheme Type
        case LIST_AFFILIATE_SCHEME_TYPE:
            return { ...state, listLoading: true, list: '', chngStsData: '' };

        case LIST_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_AFFILIATE_SCHEME_TYPE_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Affiliate Scheme Type
        case GET_BY_ID_AFFILIATE_SCHEME_TYPE:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_AFFILIATE_SCHEME_TYPE_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};