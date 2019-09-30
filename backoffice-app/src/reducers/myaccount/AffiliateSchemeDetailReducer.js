// AffiliateSchemeDetailReducer.js
import {
    //for affiliate scheme detail list
    AFFILIATE_SCHEME_DETAIL_LIST,
    AFFILIATE_SCHEME_DETAIL_LIST_SUCCESS,
    AFFILIATE_SCHEME_DETAIL_LIST_FAILURE,

    //for affiliate scheme detail change status
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE,

    //for affiliate scheme type mapping list
    AFFILIATE_SCHEME_TYPE_MAPPING_LIST,
    AFFILIATE_SCHEME_TYPE_MAPPING_LIST_SUCCESS,
    AFFILIATE_SCHEME_TYPE_MAPPING_LIST_FAILURE,

    //for wallet type master
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTER_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    //for affiliate scheme detail add
    ADD_AFFILIATE_SCHEME_DETAIL,
    ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    ADD_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //for affiliate scheme detail edit
    EDIT_AFFILIATE_SCHEME_DETAIL,
    EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //clear data
    AFFILIATE_SCHEME_DETAIL_CLEAR,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for scheme Detail List
    isSchemeDetailListFetch: false,
    schemeDetailListData: null,
    schemeDetailListDataFetch: true,

    // for change detail status change
    isChangeDetailStatusFetch: false,
    changeDetailStatusData: null,
    changeDetailStatusDataFetch: true,

    // for get list of Scheme type Mapping  data
    isSchemeMappingListFetch: false,
    schemeMappingListData: null,
    schemeMappingListDataFetch: true,

    // for wallet list
    isWalletTypeListFetch: false,
    walletTypeListData: null,
    walletTypeListFetch: true,

    // for Add Scheme Detail
    isAddSchemeDetailFetch: false,
    addSchemeDetailData: null,
    addSchemeDetailDataFetch: true,

    // for Add Scheme Detail
    iseditSchemeDetailFetch: false,
    editSchemeDetailData: null,
    editSchemeDetailDataFetch: true,
}

export default function AffiliateSchemeDetailReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // clear reducer data
        case AFFILIATE_SCHEME_DETAIL_CLEAR:
            return initialState

        // for get list of Scheme Detail 
        case AFFILIATE_SCHEME_DETAIL_LIST:
            return Object.assign({}, state, {
                isSchemeDetailListFetch: true,
                schemeDetailListData: null,
                schemeDetailListDataFetch: true,
                changeDetailStatusDataFetch: true,
            })
        // for get list of Scheme Detail success
        case AFFILIATE_SCHEME_DETAIL_LIST_SUCCESS:
            return Object.assign({}, state, {
                isSchemeDetailListFetch: false,
                schemeDetailListData: action.data,
                schemeDetailListDataFetch: false,
                changeDetailStatusDataFetch: true,
            })
        // for get list of Scheme Detail failure
        case AFFILIATE_SCHEME_DETAIL_LIST_FAILURE:
            return Object.assign({}, state, {
                isSchemeDetailListFetch: false,
                schemeDetailListData: null,
                schemeDetailListDataFetch: false,
                changeDetailStatusDataFetch: true,
            })

        // for change status of scheme detail
        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS:
            return Object.assign({}, state, {
                isChangeDetailStatusFetch: true,
                changeDetailStatusData: null,
                changeDetailStatusDataFetch: true,
                schemeDetailListDataFetch: true,
            })
        // for change status of scheme detail success
        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS:
            return Object.assign({}, state, {
                isChangeDetailStatusFetch: false,
                changeDetailStatusData: action.data,
                changeDetailStatusDataFetch: false,
                schemeDetailListDataFetch: true,
            })
        // for change status of scheme detail failure
        case CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE:
            return Object.assign({}, state, {
                isChangeDetailStatusFetch: false,
                changeDetailStatusData: null,
                changeDetailStatusDataFetch: false,
                schemeDetailListDataFetch: true,
            })

        // for get list of Scheme type Mapping 
        case AFFILIATE_SCHEME_TYPE_MAPPING_LIST:
            return Object.assign({}, state, {
                isSchemeMappingListFetch: true,
                schemeMappingListData: null,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for get list of Scheme type Mapping success
        case AFFILIATE_SCHEME_TYPE_MAPPING_LIST_SUCCESS:
            return Object.assign({}, state, {
                isSchemeMappingListFetch: false,
                schemeMappingListData: action.data,
                schemeMappingListDataFetch: false,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for get list of Scheme type Mapping failure
        case AFFILIATE_SCHEME_TYPE_MAPPING_LIST_FAILURE:
            return Object.assign({}, state, {
                isSchemeMappingListFetch: false,
                schemeMappingListData: null,
                schemeMappingListDataFetch: false,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })

        // for get list of Wallet Type
        case GET_WALLET_TYPE_MASTER:
            return Object.assign({}, state, {
                isWalletTypeListFetch: true,
                walletTypeListData: null,
                walletTypeListFetch: true,
                schemeMappingListDataFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for get list of Wallet Type success
        case GET_WALLET_TYPE_MASTER_SUCCESS:
            return Object.assign({}, state, {
                isWalletTypeListFetch: false,
                walletTypeListData: action.payload,
                walletTypeListFetch: false,
                schemeMappingListDataFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for get list of Wallet Type failure
        case GET_WALLET_TYPE_MASTER_FAILURE:
            return Object.assign({}, state, {
                isWalletTypeListFetch: false,
                walletTypeListData: null,
                walletTypeListFetch: false,
                schemeMappingListDataFetch: true,
                addSchemeDetailDataFetch: true,
                editSchemeDetailDataFetch: true,
            })

        // for Add Scheme Details 
        case ADD_AFFILIATE_SCHEME_DETAIL:
            return Object.assign({}, state, {
                isAddSchemeDetailFetch: true,
                addSchemeDetailData: null,
                addSchemeDetailDataFetch: true,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for Add Scheme Details success
        case ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                isAddSchemeDetailFetch: false,
                addSchemeDetailData: action.data,
                addSchemeDetailDataFetch: false,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                editSchemeDetailDataFetch: true,
            })
        // for Add Scheme Details failure
        case ADD_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return Object.assign({}, state, {
                isAddSchemeDetailFetch: false,
                addSchemeDetailData: null,
                addSchemeDetailDataFetch: false,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                editSchemeDetailDataFetch: true,
            })

        // for edit Scheme Details 
        case EDIT_AFFILIATE_SCHEME_DETAIL:
            return Object.assign({}, state, {
                iseditSchemeDetailFetch: true,
                editSchemeDetailData: null,
                editSchemeDetailDataFetch: true,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
            })
        // for edit Scheme Details success
        case EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                iseditSchemeDetailFetch: false,
                editSchemeDetailData: action.data,
                editSchemeDetailDataFetch: false,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
            })
        // for edit Scheme Details failure
        case EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE:
            return Object.assign({}, state, {
                iseditSchemeDetailFetch: false,
                editSchemeDetailData: null,
                editSchemeDetailDataFetch: false,
                schemeMappingListDataFetch: true,
                walletTypeListFetch: true,
                addSchemeDetailDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}