/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Actions
 */

//Import action types form type.js
import {
    //List Affiliate Scheme Type Mapping
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

} from '../types';

// Redux Action To List Affiliate Scheme Type Mapping
export const getAffiliateSchemeTypeMappingList = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    payload: data
})

// Redux Action List Affiliate Scheme Type Mapping Success
export const getAffiliateSchemeTypeMappingListSuccess = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Scheme Type Mapping Failure
export const getAffiliateSchemeTypeMappingListFailure = (error) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});