/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By : Salim Deraiya (24-01-2019)
 * Personal Verification Form Reducers
 */
import {
    //Add KYC Details
    PERSONAL_VERIFICATION,
    PERSONAL_VERIFICATION_SUCCESS,
    PERSONAL_VERIFICATION_FAILURE,

    //Get KYC Status
    GET_KYC_STATUS,
    GET_KYC_STATUS_SUCCESS,
    GET_KYC_STATUS_FAILURE,
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    kycStatus : []
}

//Check Action for Personal Verification Form...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        //Add KYC Details
        case PERSONAL_VERIFICATION:
            return { ...state, loading : true, data : '' };

        case PERSONAL_VERIFICATION_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case PERSONAL_VERIFICATION_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //Get KYC Status
        case GET_KYC_STATUS:
            return { ...state, loading : true, kycStatus : '' };

        case GET_KYC_STATUS_SUCCESS:
            return { ...state, loading : false, kycStatus : action.payload };

        case GET_KYC_STATUS_FAILURE:
            return { ...state, loading : false, kycStatus : action.payload };

        default : 
            return { ...state };
    }
}