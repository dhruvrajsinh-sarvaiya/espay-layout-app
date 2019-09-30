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
    AFFILIATE_SCHEME_TYPE_LIST_CLEAR
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for get scheme type List
export function affiliateSchemeTypeList(payload) {
    return action(AFFILIATE_SCHEME_TYPE_LIST, { payload })
}
// Redux action for get scheme type List success
export function affiliateSchemeTypeListSuccess(data) {
    return action(AFFILIATE_SCHEME_TYPE_LIST_SUCCESS, { data })
}
// Redux action for get scheme type List failure
export function affiliateSchemeTypeListFailure() {
    return action(AFFILIATE_SCHEME_TYPE_LIST_FAILURE)
}

// Redux action for change affiliate scheme type status
export function changeAffiliateSchemeTypeStatus(payload) {
    return action(AFFILIATE_SCHEME_TYPE_STATUS, { payload })
}
// Redux action for change affiliate scheme type status success
export function changeAffiliateSchemeTypeStatusSuccess(data) {
    return action(AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS, { data })
}
// Redux action for change affiliate scheme type status failure
export function changeAffiliateSchemeTypeStatusFailure() {
    return action(AFFILIATE_SCHEME_TYPE_STATUS_FAILURE)
}

// Redux action for get affiliate scheme add
export function addAffiliateSchemeType(payload) {
    return action(ADD_AFFILIATE_SCHEME_TYPE, { payload })
}
// Redux action for get affiliate scheme add success
export function addAffiliateSchemeTypeSuccess(data) {
    return action(ADD_AFFILIATE_SCHEME_TYPE_SUCCESS, { data })
}
// Redux action for get affiliate scheme add failure
export function addAffiliateSchemeTypeFailure() {
    return action(ADD_AFFILIATE_SCHEME_TYPE_FAILURE)
}

// Redux action for get edit affiliate scheme
export function editAffiliateSchemeType(payload) {
    return action(EDIT_AFFILIATE_SCHEME_TYPE, { payload })
}
// Redux action for get edit affiliate scheme success
export function editAffiliateSchemeTypeSuccess(data) {
    return action(EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS, { data })
}
// Redux action for get edit affiliate scheme failure
export function editAffiliateSchemeTypeFailure() {
    return action(EDIT_AFFILIATE_SCHEME_TYPE_FAILURE)
}

//action for clear reducer data
export function affiliateSchemeTypeListClear() {
    return action(AFFILIATE_SCHEME_TYPE_LIST_CLEAR)
}