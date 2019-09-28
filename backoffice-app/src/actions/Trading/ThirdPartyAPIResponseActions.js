import { action } from '../GlobalActions';
import {
    //Third party api response list
    GET_THIRD_PARTY_API_RESPONSE_LIST,
    GET_THIRD_PARTY_API_RESPONSE_LIST_SUCCESS,
    GET_THIRD_PARTY_API_RESPONSE_LIST_FAILURE,

    //Third party api response list by id
    GET_THIRD_PARTY_API_RESPONSE_BYID,
    GET_THIRD_PARTY_API_RESPONSE_BYID_SUCCESS,
    GET_THIRD_PARTY_API_RESPONSE_BYID_FAILURE,

    //Third party api response add
    ADD_THIRD_PARTY_API_RESPONSE,
    ADD_THIRD_PARTY_API_RESPONSE_SUCCESS,
    ADD_THIRD_PARTY_API_RESPONSE_FAILURE,

    //Third party api response update
    UPDATE_THIRD_PARTY_API_RESPONSE,
    UPDATE_THIRD_PARTY_API_RESPONSE_SUCCESS,
    UPDATE_THIRD_PARTY_API_RESPONSE_FAILURE,

    //clear data
    CLEAN_ADD_UPDATE_THIRD_PARTY_RESPONSE,
    CLEAR_ALL_THIRD_PARTY_RESPONSE_DATA,
} from "../ActionTypes";

//clear data
export function cleanAddUpdateThirdPartyResponse() { return action(CLEAN_ADD_UPDATE_THIRD_PARTY_RESPONSE); }

//Redux action To get third party api response list
export function getThirdPartyAPIResponseBO(payload) { return action(GET_THIRD_PARTY_API_RESPONSE_LIST, { payload }); }
//Redux action To get third party api response list success
export function getThirdPartyAPIResponseBOSuccess(payload) { return action(GET_THIRD_PARTY_API_RESPONSE_LIST_SUCCESS, { payload }); }
//Redux action To get third party api response list failure
export function getThirdPartyAPIResponseBOFailure() { return action(GET_THIRD_PARTY_API_RESPONSE_LIST_FAILURE); }

//Redux action To get third party api response by id
export function getThirdPartyAPIResponseByIDBO(payload) { return action(GET_THIRD_PARTY_API_RESPONSE_BYID, { payload }); }
//Redux action To get third party api response by id success
export function getThirdPartyAPIResponseByIDBOSuccess(payload) { return action(GET_THIRD_PARTY_API_RESPONSE_BYID_SUCCESS, { payload }); }
//Redux action To get third party api response by id failure
export function getThirdPartyAPIResponseByIDBOFailure() { return action(GET_THIRD_PARTY_API_RESPONSE_BYID_FAILURE); }

//Redux action To Add third party api response 
export function addThirdpartyAPIResponseBO(payload) { return action(ADD_THIRD_PARTY_API_RESPONSE, { payload }); }
//Redux action To Add third party api response success
export function addThirdPartyAPIResponseBOSuccess(payload) { return action(ADD_THIRD_PARTY_API_RESPONSE_SUCCESS, { payload }); }
//Redux action To Add third party api response failure
export function addThirdPartyAPIResponseBOFailure() { return action(ADD_THIRD_PARTY_API_RESPONSE_FAILURE); }

//Redux action To Update third party api response 
export function updateThirdpartyAPIResponseBO(payload) { return action(UPDATE_THIRD_PARTY_API_RESPONSE, { payload }); }
//Redux action To Update third party api response success
export function updateThirdpartyAPIResponseBOSuccess(payload) { return action(UPDATE_THIRD_PARTY_API_RESPONSE_SUCCESS, { payload }); }
//Redux action To Update third party api response failure
export function updateThirdpartyAPIResponseBOFailure() { return action(UPDATE_THIRD_PARTY_API_RESPONSE_FAILURE); }

//clear data
export function clearAllThirdPartyData() { return action(CLEAR_ALL_THIRD_PARTY_RESPONSE_DATA); }