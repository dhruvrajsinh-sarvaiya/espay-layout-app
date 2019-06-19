/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Login Reducers
 * Normal / Blockchain
 */
import {
    LOGIN, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE, 
    LOGIN_BLOCKCHAIN,
    LOGIN_BLOCKCHAIN_SUCCESS,
    LOGIN_BLOCKCHAIN_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    auth_type : 'google',
    data : []
}

//Check Action for Login...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case LOGIN:
            return { ...state, loading : true };

        case LOGIN_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case LOGIN_FAILURE:
            return { ...state, loading : false, error : action.payload };

        case LOGIN_BLOCKCHAIN:
            return { ...state, loading : true };

        case LOGIN_BLOCKCHAIN_SUCCESS:
            return { ...state, loading : true, data : action.payload };

        case LOGIN_BLOCKCHAIN_FAILURE:
            return { ...state, loading : false, error : action.payload };

        default : 
            return { ...state };
    }
}