/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Reducer
 */

//Import action types form type.js
import {
    //List Affiliate Scheme Type Mapping
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    mappingList: [],
    listLoading: false,
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //List Affiliate Scheme Type Mapping
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING:
            return { ...state, listLoading: true, mappingList: '' };

        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return { ...state, listLoading: false, mappingList: action.payload };

        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return { ...state, listLoading: false, mappingList: action.payload };

        default:
            return { ...state };
    }
};