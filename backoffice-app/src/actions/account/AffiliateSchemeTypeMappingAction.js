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

    //affiliate scheme type mapping add
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE,

    //affiliate scheme type mapping edit
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE,

    //clear redcuer data
    CLEAR_AFFILIATE_SCHEME_TYPE_MAPPPING_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for Change Affiliate Scheme type Mapping status
export function changeAffiliateSchemeTypeMappingStatus(payload) {
    return action(CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS, { payload })
}
// Redux action for Change Affiliate Scheme type Mapping status
export function changeAffiliateSchemeTypeMappingStatusSuccess(data) {
    return action(CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS, { data })
}
// Redux action for Change Affiliate Scheme type Mapping status
export function changeAffiliateSchemeTypeMappingStatusFailure() {
    return action(CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE)
}

// Redux action for Scheme Mapping List
export function listAffiliateSchemeTypeMappingData(payload) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA, { payload })
}
// Redux action for Scheme Mapping List success
export function listAffiliateSchemeTypeMappingDataSuccess(data) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_SUCCESS, { data })
}
// Redux action for Scheme Mapping List failure
export function listAffiliateSchemeTypeMappingDataFailure() {
    return action(LIST_AFFILIATE_SCHEME_TYPE_MAPPING_DATA_FAILURE)
}

// Redux action for scheme
export function listAffiliateSchemeData(payload) {
    return action(LIST_AFFILIATE_SCHEME_DATA, { payload })
}
// Redux action for scheme success
export function listAffiliateSchemeDataSuccess(data) {
    return action(LIST_AFFILIATE_SCHEME_DATA_SUCCESS, { data })
}
// Redux action for scheme failure
export function listAffiliateSchemeDataFailure() {
    return action(LIST_AFFILIATE_SCHEME_DATA_FAILURE)
}

// Redux action scheme type
export function listAffiliateSchemeTypeData(payload) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_DATA, { payload })
}
// Redux action scheme type success
export function listAffiliateSchemeTypeDataSuccess(data) {
    return action(LIST_AFFILIATE_SCHEME_TYPE_DATA_SUCCESS, { data })
}
// Redux action scheme type failure
export function listAffiliateSchemeTypeDataFailure() {
    return action(LIST_AFFILIATE_SCHEME_TYPE_DATA_FAILURE)
}

// Redux action for add mapping data
export function addAffiliateSchemeTypeMapping(payload) {
    return action(ADD_AFFILIATE_SCHEME_TYPE_MAPPPING, { payload })
}
// Redux action for add mapping data success
export function addAffiliateSchemeTypeMappingSuccess(data) {
    return action(ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS, { data })
}
// Redux action for add mapping data failure
export function addAffiliateSchemeTypeMappingFailure() {
    return action(ADD_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE)
}

// Redux action for add mapping data
export function editAffiliateSchemeTypeMapping(payload) {
    return action(EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING, { payload })
}
// Redux action for add mapping data success
export function editAffiliateSchemeTypeMappingSuccess(data) {
    return action(EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_SUCCESS, { data })
}
// Redux action for add mapping data failure
export function editAffiliateSchemeTypeMappingFailure() {
    return action(EDIT_AFFILIATE_SCHEME_TYPE_MAPPPING_FAILURE)
}

// clear data
export function affiliateSchemeMappingDataClear() {
    return action(CLEAR_AFFILIATE_SCHEME_TYPE_MAPPPING_DATA)
}