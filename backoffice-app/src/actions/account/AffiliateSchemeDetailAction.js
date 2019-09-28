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
} from '../ActionTypes'
import { action } from '../GlobalActions';

//Redux Action for change Scheme Detail status
export function changeAffiliateSchemeDetailStatus(payload) {
    return action(CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS, { payload })
}
//Redux Action for change Scheme Detail status success
export function changeAffiliateSchemeDetailStatusSuccess(data) {
    return action(CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS, { data })
}
//Redux Action for change Scheme Detail status failure
export function changeAffiliateSchemeDetailStatusFailure() {
    return action(CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE)
}

//Redux Action for List Scheme Detail
export function affiliateSchemeDetailList(payload) {
    return action(AFFILIATE_SCHEME_DETAIL_LIST, { payload })
}
//Redux Action for List Scheme Detail success
export function affiliateSchemeDetailListSuccess(data) {
    return action(AFFILIATE_SCHEME_DETAIL_LIST_SUCCESS, { data })
}
//Redux Action for List Scheme Detail failure
export function affiliateSchemeDetailListFailure() {
    return action(AFFILIATE_SCHEME_DETAIL_LIST_FAILURE)
}

//Redux Action for List Scheme scheme Mapping
export function affiliateSchemeMappingList(payload) {
    return action(AFFILIATE_SCHEME_TYPE_MAPPING_LIST, { payload })
}
//Redux Action for List Scheme scheme Mapping success
export function affiliateSchemeMappingListSuccess(data) {
    return action(AFFILIATE_SCHEME_TYPE_MAPPING_LIST_SUCCESS, { data })
}
//Redux Action for List Scheme scheme Mapping failure
export function affiliateSchemeMappingListFailure() {
    return action(AFFILIATE_SCHEME_TYPE_MAPPING_LIST_FAILURE)
}

//Redux Action for Add Scheme Detail
export function addAffiliateSchemeDetail(payload) {
    return action(ADD_AFFILIATE_SCHEME_DETAIL, { payload })
}
//Redux Action for Add Scheme Detail success
export function addAffiliateSchemeDetailSuccess(data) {
    return action(ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS, { data })
}
//Redux Action for Add Scheme Detail failure
export function addAffiliateSchemeDetailFailure() {
    return action(ADD_AFFILIATE_SCHEME_DETAIL_FAILURE)
}

//Redux Action for EDIT Scheme Detail
export function editAffiliateSchemeDetail(payload) {
    return action(EDIT_AFFILIATE_SCHEME_DETAIL, { payload })
}
//Redux Action for EDIT Scheme Detail success
export function editAffiliateSchemeDetailSuccess(data) {
    return action(EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS, { data })
}
//Redux Action for EDIT Scheme Detail failure
export function editAffiliateSchemeDetailFailure() {
    return action(EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE)
}

// Action for clear Scheme Detail data
export function affiliateSchemeDetailClear() {
    return action(AFFILIATE_SCHEME_DETAIL_CLEAR)
}