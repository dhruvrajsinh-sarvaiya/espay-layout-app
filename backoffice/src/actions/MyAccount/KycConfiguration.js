/**
 * Auther : Salim Deraiya
 * Created : 27/12/2018
 * KYC Configuration Actions Method
 */

import {
	//For Add KYC Document Config
	KYC_ADD_DOCUMENT_CONFIG,
	KYC_ADD_DOCUMENT_CONFIG_SUCCESS,
	KYC_ADD_DOCUMENT_CONFIG_FAILURE,

	//For Edit KYC Document Config
	KYC_EDIT_DOCUMENT_CONFIG,
	KYC_EDIT_DOCUMENT_CONFIG_SUCCESS,
	KYC_EDIT_DOCUMENT_CONFIG_FAILURE,

	//For Get KYC Document List
	KYC_LIST_DOCUMENT_CONFIG,
	KYC_LIST_DOCUMENT_CONFIG_SUCCESS,
	KYC_LIST_DOCUMENT_CONFIG_FAILURE,

	//For Add User KYC Document Config
	USER_ADD_KYC_DOCUMENT_CONFIG,
	USER_ADD_KYC_DOCUMENT_CONFIG_SUCCESS,
	USER_ADD_KYC_DOCUMENT_CONFIG_FAILURE,

	//For Edit User KYC Document Config
	USER_EDIT_KYC_DOCUMENT_CONFIG,
	USER_EDIT_KYC_DOCUMENT_CONFIG_SUCCESS,
	USER_EDIT_KYC_DOCUMENT_CONFIG_FAILURE,

	//For Get User KYC Document List
	USER_LIST_KYC_DOCUMENT_CONFIG,
	USER_LIST_KYC_DOCUMENT_CONFIG_SUCCESS,
	USER_LIST_KYC_DOCUMENT_CONFIG_FAILURE,

	//For List KYC Config
	KYC_LIST_CONFIG,
	KYC_LIST_CONFIG_SUCCESS,
	KYC_LIST_CONFIG_FAILURE,
} from "../types";

//Add KYC Document Config
/**
 * Redux Action To Add KYC Document Config
 */
export const addKYCDocumentConfig = (data) => ({
	type: KYC_ADD_DOCUMENT_CONFIG,
	payload: data
});

/**
 * Redux Action To Add KYC Document Config Success
 */
export const addKYCDocumentConfigSuccess = (data) => ({
	type: KYC_ADD_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Add KYC Document Config Failure
 */
export const addKYCDocumentConfigFailure = (error) => ({
	type: KYC_ADD_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For Edit KYC Document Config
/**
 * Redux Action To Edit Kyc Verify
 */
export const editKYCDocumentConfig = (data) => ({
	type: KYC_EDIT_DOCUMENT_CONFIG,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Success
 */
export const editKYCDocumentConfigSuccess = (data) => ({
	type: KYC_EDIT_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Failure
 */
export const editKYCDocumentConfigFailure = (error) => ({
	type: KYC_EDIT_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For Get KYC Document List
/**
 * Redux Action To Get KYC Document List
 */
export const getKYCDocumentTypeList = (data) => ({
	type: KYC_LIST_DOCUMENT_CONFIG,
	payload: data
});

/**
 * Redux Action To Get KYC Document List Success
 */
export const getKYCDocumentTypeListSuccess = (data) => ({
	type: KYC_LIST_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Get KYC Document List Failure
 */
export const getKYCDocumentTypeListFailure = (error) => ({
	type: KYC_LIST_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For Add User KYC Document Config
/**
 * Redux Action To Add KYC Document Config
 */
export const addUserKYCDocumentConfig = (data) => ({
	type: USER_ADD_KYC_DOCUMENT_CONFIG,
	payload:data
});

/**
 * Redux Action To Add KYC Document Config Success
 */
export const addUserKYCDocumentConfigSuccess = (data) => ({
	type: USER_ADD_KYC_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Add KYC Document Config Failure
 */
export const addUserKYCDocumentConfigFailure = (error) => ({
	type: USER_ADD_KYC_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For Edit User KYC Document Config
/**
 * Redux Action To Edit Kyc Verify
 */
export const editUserKYCDocumentConfig = (data) => ({
	type: USER_EDIT_KYC_DOCUMENT_CONFIG,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Success
 */
export const editUserKYCDocumentConfigSuccess = (data) => ({
	type: USER_EDIT_KYC_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Failure
 */
export const editUserKYCDocumentConfigFailure = (error) => ({
	type: USER_EDIT_KYC_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For Get User KYC Document List
/**
 * Redux Action To Get User KYC Document List
 */
export const getUserKYCDocumentList = (data) => ({
	type: USER_LIST_KYC_DOCUMENT_CONFIG,
	payload: data
});

/**
 * Redux Action To Get User KYC Document List Success
 */
export const getUserKYCDocumentListSuccess = (data) => ({
	type: USER_LIST_KYC_DOCUMENT_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To Get User KYC Document List Failure
 */
export const getUserKYCDocumentListFailure = (error) => ({
	type: USER_LIST_KYC_DOCUMENT_CONFIG_FAILURE,
	payload: error
});

//For List KYC Config
/**
 * Redux Action To List KYC Config
 */
export const listKYCConfig = () => ({
	type: KYC_LIST_CONFIG
});

/**
 * Redux Action To List KYC Config Success
 */
export const listKYCConfigSuccess = (data) => ({
	type: KYC_LIST_CONFIG_SUCCESS,
	payload: data
});

/**
 * Redux Action To List KYC Config Failure
 */
export const listKYCConfigFailure = (error) => ({
	type: KYC_LIST_CONFIG_FAILURE,
	payload: error
});