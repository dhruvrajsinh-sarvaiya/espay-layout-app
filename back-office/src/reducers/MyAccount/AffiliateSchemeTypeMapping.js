/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Reducer
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Type Mapping
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Edit Affiliate Scheme Type Mapping
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Change Affiliate Scheme Type Mapping Status
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE,

    //List Affiliate Scheme Type Mapping
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Get By Id Affiliate Scheme Type Mapping    
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

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
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //Add Affiliate Scheme Type Mapping
        case ADD_AFFILIATE_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case ADD_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ADD_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Edit Affiliate Scheme Type Mapping
        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, data: '', getData: '', list: '' };

        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //Change Affiliate Scheme Type Mapping Status
        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS:
            return { ...state, listLoading: true, chngStsData: '' };

        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS:
            return { ...state, listLoading: false, chngStsData: action.payload };

        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE:
            return { ...state, listLoading: false, chngStsData: action.payload };

        //List Affiliate Scheme Type Mapping
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING:
            return { ...state, listLoading: true, list: '', chngStsData: '', data: '' };

        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, listLoading: false, list: action.payload };

        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, listLoading: false, list: action.payload };

        //Get By Id Affiliate Scheme Type Mapping
        case GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING:
            return { ...state, loading: true, getData: '', list: '' };

        case GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, loading: false, getData: action.payload };

        case GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, loading: false, getData: action.payload };

        default:
            return { ...state };
    }
};