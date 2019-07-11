
/* 
    Developer : Nishant Vadgama
    Date : 24-11-2018
    File Comment : wallet dashboard organization list actions
*/
import {
    //Organization LIST
    ORGLIST,
    ORGLIST_SUCCESS,
    ORGLIST_FAIL,
} from '../types';

// get organization list
export const getOrgList = () => ({
    type: ORGLIST
});
export const getOrgListSuccess = (response) => ({
    type: ORGLIST_SUCCESS,
    payload: response
});
export const getOrgListFail = (error) => ({
    type: ORGLIST_FAIL,
    payload: error
});
