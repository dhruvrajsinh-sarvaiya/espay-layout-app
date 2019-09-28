// AffiliateSchemeTypeMappingReducer.js
import {
    //affiliate scheme type mapping list
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_FAILURE,

    //affiliate scheme type mapping change status
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE,

    //affiliate scheme data
    LIST_AFFILIATE_SCHEME_DATA,
    LIST_AFFILIATE_SCHEME_DATA_SUCCESS,
    LIST_AFFILIATE_SCHEME_DATA_FAILURE,

    //affiliate scheme type data
    LIST_AFFILIATE_SCHEME_TYPE_DATA,
    LIST_AFFILIATE_SCHEME_TYPE_DATA_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_DATA_FAILURE,

    //for wallet type master
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    //affiliate scheme type mapping add
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE,

    //affiliate scheme type mapping edit
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE,

    //clear redcuer data
    CLEAR_AFFILIATE_SCHEME_TYPE_MAPPPING_DATA,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {

    // For Affiliate Scheme Type Mapping
    isSchemeTypeMappingList: false,
    schemeTypeMappingList: null,
    schemeTypeMappingListFetch: true,

    // for change mapping status
    isChangeMappingStatus: false,
    changeMappingStatus: null,
    changeMappingStatusFetch: true,

    // for affiliate Scheme
    isSchemeFetch: false,
    schemeData: null,
    schemeDataFetch: true,

    // for affiliate Scheme type
    isSchemeTypeFetch: false,
    schemeTypeData: null,
    schemeTypeDataFetch: true,

    // for wallet list
    isWalletTypeListFetch: false,
    walletTypeListData: null,
    walletTypeListFetch: true,

    // for add scheme Mapping
    isAddSchemeTypeFetch: false,
    addSchemeTypeData: null,
    addSchemeTypeDataFetch: true,

    // for edit scheme Mapping
    isEditSchemeTypeFetch: false,
    editSchemeTypeData: null,
    editSchemeTypeDataFetch: true,
}

export default function AffiliateSchemeTypeMappingReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAR_AFFILIATE_SCHEME_TYPE_MAPPPING_DATA:
            return initialState

        // for get list affiliate Scheme Type Mapping
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA:
            return Object.assign({}, state, {
                isSchemeTypeMappingList: true,
                schemeTypeMappingList: null,
                schemeTypeMappingListFetch: true,
                changeMappingStatusFetch: true,
            })
        // for get list affiliate Scheme Type Mapping success
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_SUCCESS:
            return Object.assign({}, state, {
                isSchemeTypeMappingList: false,
                schemeTypeMappingList: action.data,
                schemeTypeMappingListFetch: false,
                changeMappingStatusFetch: true,
            })
        // for get list affiliate Scheme Type Mapping failure
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_FAILURE:
            return Object.assign({}, state, {
                isSchemeTypeMappingList: false,
                schemeTypeMappingList: null,
                schemeTypeMappingListFetch: false,
                changeMappingStatusFetch: true,
            })

        // for get list affiliate Scheme Type Mapping status
        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS:
            return Object.assign({}, state, {
                isChangeMappingStatus: true,
                changeMappingStatus: null,
                changeMappingStatusFetch: true,
                schemeTypeMappingListFetch: true,
            })
        // for get list affiliate Scheme Type Mapping status success
        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS:
            return Object.assign({}, state, {
                isChangeMappingStatus: false,
                changeMappingStatus: action.data,
                changeMappingStatusFetch: false,
                schemeTypeMappingListFetch: true,
            })
        // for get list affiliate Scheme Type Mapping status failure
        case CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE:
            return Object.assign({}, state, {
                isChangeMappingStatus: false,
                changeMappingStatus: null,
                changeMappingStatusFetch: false,
                schemeTypeMappingListFetch: true,
            })

        // for get list affiliate Scheme
        case LIST_AFFILIATE_SCHEME_DATA:
            return Object.assign({}, state, {
                isSchemeFetch: true,
                schemeData: null,
                schemeDataFetch: true,
                walletTypeListFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list affiliate Scheme succcess
        case LIST_AFFILIATE_SCHEME_DATA_SUCCESS:
            return Object.assign({}, state, {
                isSchemeFetch: false,
                schemeData: action.data,
                schemeDataFetch: false,
                walletTypeListFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list affiliate Scheme failure
        case LIST_AFFILIATE_SCHEME_DATA_FAILURE:
            return Object.assign({}, state, {
                isSchemeFetch: false,
                schemeData: null,
                schemeDataFetch: false,
                walletTypeListFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })

        // for get list affiliate Scheme type
        case LIST_AFFILIATE_SCHEME_TYPE_DATA:
            return Object.assign({}, state, {
                isSchemeTypeFetch: true,
                schemeTypeData: null,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                schemeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list affiliate Scheme type success
        case LIST_AFFILIATE_SCHEME_TYPE_DATA_SUCCESS:
            return Object.assign({}, state, {
                isSchemeTypeFetch: false,
                schemeTypeData: action.data,
                schemeTypeDataFetch: false,
                walletTypeListFetch: true,
                schemeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list affiliate Scheme type failure
        case LIST_AFFILIATE_SCHEME_TYPE_DATA_FAILURE:
            return Object.assign({}, state, {
                isSchemeTypeFetch: false,
                schemeTypeData: null,
                schemeTypeDataFetch: false,
                walletTypeListFetch: true,
                schemeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })

        // for get list of Wallet Type
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, {
                isWalletTypeListFetch: true,
                walletTypeListData: null,
                walletTypeListFetch: true,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list of Wallet Type success
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, {
                isWalletTypeListFetch: false,
                walletTypeListData: action.payload,
                walletTypeListFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for get list of Wallet Type failure
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, {
                isWalletTypeListFetch: false,
                walletTypeListData: null,
                walletTypeListFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                addSchemeTypeDataFetch: true,
                editSchemeTypeDataFetch: true,
            })

        // for add scheme mapping data
        case ADD_AFFILIATE_SCHEME_TYPE_MAPPPING:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: true,
                addSchemeTypeData: null,
                addSchemeTypeDataFetch: true,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for add scheme mapping data success
        case ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: false,
                addSchemeTypeData: action.data,
                addSchemeTypeDataFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                editSchemeTypeDataFetch: true,
            })
        // for add scheme mapping data failure
        case ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE:
            return Object.assign({}, state, {
                isAddSchemeTypeFetch: false,
                addSchemeTypeData: null,
                addSchemeTypeDataFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                editSchemeTypeDataFetch: true,
            })

        // for edit scheme mapping data
        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: true,
                editSchemeTypeData: null,
                editSchemeTypeDataFetch: true,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                addSchemeTypeDataFetch: true,
            })
        // for edit scheme mapping data success
        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: false,
                editSchemeTypeData: action.data,
                editSchemeTypeDataFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                addSchemeTypeDataFetch: true,
            })
        // for edit scheme mapping data failure
        case EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE:
            return Object.assign({}, state, {
                isEditSchemeTypeFetch: false,
                editSchemeTypeData: null,
                editSchemeTypeDataFetch: false,
                schemeDataFetch: true,
                schemeTypeDataFetch: true,
                walletTypeListFetch: true,
                addSchemeTypeDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}