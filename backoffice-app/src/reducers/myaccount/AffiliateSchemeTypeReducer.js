// AffiliateSchemeTypeReducer.js
import {
    //for affiliate scheme type list
    AFFILIATE_SCHEME_TYPE_LIST,
    AFFILIATE_SCHEME_TYPE_LIST_SUCCESS,
    AFFILIATE_SCHEME_TYPE_LIST_FAILURE,

    //for affiliate scheme type change status
    AFFILIATE_SCHEME_TYPE_STATUS,
    AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS,
    AFFILIATE_SCHEME_TYPE_STATUS_FAILURE,

    //for affiliate scheme type add
    ADD_AFFILIATE_SCHEME_TYPE,
    ADD_AFFILIATE_SCHEME_TYPE_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_FAILURE,

    //for affiliate scheme type edit
    EDIT_AFFILIATE_SCHEME_TYPE,
    EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_FAILURE,

    //clear reducer data
    AFFILIATE_SCHEME_TYPE_LIST_CLEAR,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of schemeTypeList data
    isSchemeTypeListFetch: false,
    schemeTypeListData: null,
    schemeTypeListDataFetch: true,

    //for affiliate scheme type change status data
    isSchemeTypeStatusFetch: false,
    schemeTypeStatusData: null,
    schemeTypeStatusDataFetch: true,

    //for affiliate scheme type add data
    isAddSchemeTypeFetch: false,
    addSchemeTypeData: null,
    addSchemeTypeDataFetch: true,

    //for affiliate scheme type edit data
    isEditSchemeTypeFetch: false,
    editSchemeTypeData: null,
    editSchemeTypeDataFetch: true,
}

export default function AffiliateSchemeTypeReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case AFFILIATE_SCHEME_TYPE_LIST_CLEAR:
            return initialState

        // for get list of schemeType
        case AFFILIATE_SCHEME_TYPE_LIST:
            return Object.assign({}, state, {
                isSchemeTypeListFetch: true,
                schemeTypeListData: null,
                schemeTypeListDataFetch: true,
                schemeTypeStatusDataFetch: true,
            })
        // for get list of schemeType success
        case AFFILIATE_SCHEME_TYPE_LIST_SUCCESS:
            return Object.assign({}, state, {
                isSchemeTypeListFetch: false,
                schemeTypeListData: action.data,
                schemeTypeListDataFetch: false,
                schemeTypeStatusDataFetch: true,
            })
        // for get list of schemeType failure
        case AFFILIATE_SCHEME_TYPE_LIST_FAILURE:
            return Object.assign({}, state, {
                isSchemeTypeListFetch: false,
                schemeTypeListData: null,
                schemeTypeListDataFetch: false,
                schemeTypeStatusDataFetch: true,
            })

        // for get list of schemeType status
        case AFFILIATE_SCHEME_TYPE_STATUS:
            return Object.assign({}, state, {
                isSchemeTypeStatusFetch: true,
                schemeTypeStatusData: null,
                schemeTypeStatusDataFetch: true,
                schemeTypeListDataFetch: true,
            })
        // for get list of schemeType status success
        case AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS:
            return Object.assign({}, state, {
                isSchemeTypeStatusFetch: false,
                schemeTypeStatusData: action.data,
                schemeTypeStatusDataFetch: false,
                schemeTypeListDataFetch: true,
            })
        // for get list of schemeType status failure
        case AFFILIATE_SCHEME_TYPE_STATUS_FAILURE:
            return Object.assign({}, state, {
                isSchemeTypeStatusFetch: false,
                schemeTypeStatusData: null,
                schemeTypeStatusDataFetch: false,
                schemeTypeListDataFetch: true,
            })
        // for Add schemeType 
        case ADD_AFFILIATE_SCHEME_TYPE:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: true,
                addSchemeTypeData: null,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for Add schemeType success
        case ADD_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: false,
                addSchemeTypeData: action.data,
                addSchemeTypeDataFetch: false,
                editSchemeTypeDataFetch: true,
            })
        // for Add schemeType failure
        case ADD_AFFILIATE_SCHEME_TYPE_FAILURE:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: false,
                addSchemeTypeData: null,
                addSchemeTypeDataFetch: false,
                editSchemeTypeDataFetch: true,
            })

        // for Edit schemeType 
        case EDIT_AFFILIATE_SCHEME_TYPE:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: true,
                editSchemeTypeData: null,
                editSchemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
            })
        // for Edit schemeType success
        case EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: false,
                editSchemeTypeData: action.data,
                editSchemeTypeDataFetch: false,
                addSchemeTypeDataFetch: true,
            })
        // for Edit schemeType failure
        case EDIT_AFFILIATE_SCHEME_TYPE_FAILURE:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: false,
                editSchemeTypeData: null,
                editSchemeTypeDataFetch: false,
                addSchemeTypeDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}