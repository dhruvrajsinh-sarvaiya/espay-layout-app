/**
 * Auther : Salim Deraiya
 * Created : 02/10/2018
 * UpdatedBy : Salim Deraiya 29/12/2018
 * Kyc Verify Actions
 */

import {
	//For List Kyc Verify
	LIST_KYC_VERIFY,
	LIST_KYC_VERIFY_SUCCESS,
	LIST_KYC_VERIFY_FAILURE,

	//For Edit Kyc Verify
	EDIT_KYC_VERIFY,
	EDIT_KYC_VERIFY_SUCCESS,
	EDIT_KYC_VERIFY_FAILURE,

	//For Get Edit Kyc Verify By Id
	GET_KYC_VERIFY_BY_ID,
	GET_KYC_VERIFY_BY_ID_SUCCESS,
	GET_KYC_VERIFY_BY_ID_FAILURE
} from "../types";

/**
 * Redux Action To Kyc Verify
 */
export const kycVerify = (data) => ({
	type: LIST_KYC_VERIFY,
	payload : data
});

/**
 * Redux Action To Kyc Verify Success
 */
export const kycVerifySuccess = (list) => ({
	type: LIST_KYC_VERIFY_SUCCESS,
	payload: list
});

/**
 * Redux Action To Kyc Verify Failure
 */
export const kycVerifyFailure = (error) => ({
	type: LIST_KYC_VERIFY_FAILURE,
	payload: error
});

//For Edit KYC_VERIFY
/**
 * Redux Action To Edit Kyc Verify
 */
export const editKycVerify = (data) => ({
	type: EDIT_KYC_VERIFY,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Success
 */
export const editKycVerifySuccess = (data) => ({
	type: EDIT_KYC_VERIFY_SUCCESS,
	payload: data
});

/**
 * Redux Action To Edit Kyc Verify Failure
 */
export const editKycVerifyFailure = (error) => ({
	type: EDIT_KYC_VERIFY_FAILURE,
	payload: error
});

/**
 * Redux Action To Get Kyc Verify By Id
 */
export const getKycVerifyById = (user_id, user_type) => ({
	type: GET_KYC_VERIFY_BY_ID,
	payload: { user_id, user_type }
});

/**
 * Redux Action To Get Kyc Verify By Id Success
 */
export const getKycVerifyByIdSuccess = (data) => ({
	type: GET_KYC_VERIFY_BY_ID_SUCCESS,
	payload: data
});

/**
 * Redux Action To Get Kyc Verify By Id Failure
 */
export const getKycVerifyByIdFailure = (error) => ({
	type: GET_KYC_VERIFY_BY_ID_FAILURE,
	payload: error
});