// AffiliateCommissionReportAction.js
import {

    //commission report list 
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_COMMISSION_REPORT_SUCCESS,
    AFFILIATE_COMMISSION_REPORT_FAILURE,

    //scheme type mapping 
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //clear reducer data
    CLEAR_COMMISSION_REPORT_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions';

//Redux Action commission report list 
export function affiliateCommissionReport(payload) {
    return action(AFFILIATE_COMMISSION_REPORT, { payload })
}
//Redux Action commission report list Success
export function affiliateCommissionReportSuccess(data) {
    return action(AFFILIATE_COMMISSION_REPORT_SUCCESS, { data })
}
//Redux Action commission report list failure
export function affiliateCommissionReportFailure() {
    return action(AFFILIATE_COMMISSION_REPORT_FAILURE)
}

//Redux Action scheme type mapping 
export function affiliateSchemeTypeMapping(payload) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING, { payload })
}
//Redux Action scheme type mapping Success
export function affiliateSchemeTypeMappingSuccess(data) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS, { data })
}
//Redux Action scheme type mapping failure
export function affiliateSchemeTypeMappingFailure() {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE)
}

//clear reducer data
export function clearCommissionReportData() {
    return action(CLEAR_COMMISSION_REPORT_DATA)
}