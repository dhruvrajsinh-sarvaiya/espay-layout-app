/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Withdraw Reducer action manager
*/
import { NotificationManager } from 'react-notifications';
// import only required withdraw actions
import {
    // get currency lsit
    GET_WD_CURRENCY,
    GET_WD_CURRENCY_SUCCESS,
    GET_WD_CURRENCY_FAILURE,
    // get wallets and balance,
    GET_WD_WALLETS,
    GET_WD_WALLETS_SUCCESS,
    GET_WD_WALLETS_FAILURE,
    //get wallet Balance
    GET_WD_BALANCE,
    GET_WD_BALANCE_SUCCESS,
    GET_WD_BALANCE_FAILURE,
    //get fee & min max withdraw limit
    GET_FEEANDLIMIT,
    GET_FEEANDLIMIT_SUCCESS,
    GET_FEEANDLIMIT_FAILURE,
    // withdraw proccess
    DO_WITHDRAW,
    DO_WITHDRAW_SUCCESS,
    DO_WITHDRAW_FAILURE,
    // address by wallet id
    ADDRESSBYWALLETID,
    ADDRESSBYWALLETID_SUCCESS,
    ADDRESSBYWALLETID_FAILURE,
    // 2FA AUTHENTICATION
    WITHDRAWA2FAAUTH,
    WITHDRAWA2FAAUTH_SUCCESS,
    WITHDRAWA2FAAUTH_FAILURE,
    //withdraw confirmation...
    WITHDRAWCONFRIMATION,
    WITHDRAWCONFRIMATION_SUCCESS,
    WITHDRAWCONFRIMATION_FAILURE,
    //get withdrawal history...
    GET_WITHDRAW_HISTORY,
    GET_WITHDRAW_HISTORY_SUCCESS,
    GET_WITHDRAW_HISTORY_FAILURE,
    //resend mail confirmation...
    RESENDMAIL,
    RESENDMAIL_SUCCESS,
    RESENDMAIL_FAILURE,
    //withdrawal policy
    WITHDRAW_POLICY,
    WITHDRAW_POLICY_SUCCESS,
    WITHDRAW_POLICY_FAILURE,
} from 'Actions/types';

//Set Initial State
const INITIAL_STATE = {
    currencies: [],
    wallets: [],
    addresses: [],
    balance: {},
    feeAndLimit: {},
    response: {},
    response2fa: { loading: false },
    IsWhitelisting: 0,
    WithdrawalDailyLimit: 0,
    errors: {},
    loading: false,
    confirmationResponse: { loading: false },
    withdrawhistory: [],
    resendMailResponse: {},
    withdrawhistoryLoading: false,
    withdrawalPolicy: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get currency list
        case GET_WD_CURRENCY:
            return {
                ...state,
                loading: true,
                wallets: [],
                addresses: [],
                balance: {},
                feeAndLimit: {},
                response: {},
                IsWhitelisting: 0,
                WithdrawalDailyLimit: 0,
                response2fa: { loading: false },
                errors: {},
                resendMailResponse: {}
            };
        case GET_WD_CURRENCY_SUCCESS:
            return { ...state, loading: false, currencies: action.payload, response: {}, errors: {}, response2fa: { loading: false }, };
        case GET_WD_CURRENCY_FAILURE:
            return { ...state, loading: false, response2fa: { loading: false }, errors: {} };
        // get wallets
        case GET_WD_WALLETS:
            return { ...state, loading: true, response: {}, balance: {}, response2fa: { loading: false }, errors: {}, resendMailResponse: {} };
        case GET_WD_WALLETS_SUCCESS:
            return {
                ...state,
                loading: false,
                wallets: action.payload.Wallets,
                IsWhitelisting: action.payload.IsWhitelisting,
                response: {},
                balance: {},
                feeAndLimit: {},
                response2fa: { loading: false },
                errors: {}
            };
        case GET_WD_WALLETS_FAILURE:
            return { ...state, loading: false, wallets: [], balance: {}, response2fa: { loading: false }, errors: {} };
        // GET BALANCE BY WALLET ID
        case GET_WD_BALANCE:
            return { ...state, loading: true, balance: {}, addresses: [], response2fa: { loading: false }, errors: {}, resendMailResponse: {} }
        case GET_WD_BALANCE_SUCCESS:
            return {
                ...state,
                loading: false,
                balance: action.payload.Balance,
                WithdrawalDailyLimit: action.payload.WithdrawalDailyLimit,
                response: {},
                response2fa: { loading: false },
                errors: {}
            }
        case GET_WD_BALANCE_FAILURE:
            return { ...state, loading: false, balance: {}, WithdrawalDailyLimit: 0, response2fa: { loading: false }, errors: {} }
        //get fee & min max withdraw limit
        case GET_FEEANDLIMIT:
            return { ...state, loading: true, feeAndLimit: {}, response2fa: { loading: false }, errors: {}, resendMailResponse: {} }
        case GET_FEEANDLIMIT_SUCCESS:
            return { ...state, loading: false, feeAndLimit: action.payload, response2fa: { loading: false }, errors: {} }
        case GET_FEEANDLIMIT_FAILURE:
            return { ...state, loading: false, feeAndLimit: {}, response2fa: { loading: false }, errors: {} }
        // DO WITHDRAW
        case DO_WITHDRAW:
            return { ...state, loading: true, response: {}, errors: {}, response2fa: { loading: false }, resendMailResponse: {} }
        case DO_WITHDRAW_SUCCESS:
            return { ...state, loading: false, response: action.payload, errors: {}, response2fa: { loading: false }, }
        case DO_WITHDRAW_FAILURE:
            return { ...state, loading: false, response: {}, errors: {}, response2fa: { loading: false }, }
        // GET ADDRESS LIST BY WALLET ID
        case ADDRESSBYWALLETID:
            return { ...state, loading: true, response: {}, addresses: [], response2fa: { loading: false }, errors: {}, resendMailResponse: {} }
        case ADDRESSBYWALLETID_SUCCESS:
            return { ...state, loading: false, addresses: action.payload, response: {}, response2fa: { loading: false }, errors: {} }
        case ADDRESSBYWALLETID_FAILURE:
            return { ...state, loading: false, response2fa: { loading: false }, errors: {} }
        // VERIFY 2FA AUTHENTICATION FOR WITHDRAWAL
        case WITHDRAWA2FAAUTH:
            return { ...state, response2fa: { loading: true }, errors: {}, resendMailResponse: {} }
        case WITHDRAWA2FAAUTH_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, response2fa: action.payload, errors: {} }
        case WITHDRAWA2FAAUTH_FAILURE:
            return { ...state, errors: action.payload, response2fa: { loading: false } }
        // withdraw confirmation...
        case WITHDRAWCONFRIMATION:
            return { ...state, confirmationResponse: { loading: true }, errors: {}, resendMailResponse: {} }
        case WITHDRAWCONFRIMATION_SUCCESS:
            action.payload['loading'] = false;
            return { ...state, confirmationResponse: action.payload, errors: {} }
        case WITHDRAWCONFRIMATION_FAILURE:
            action.payload['loading'] = false;
            return { ...state, confirmationResponse: action.payload, errors: {} }
        //get withdrawal history...
        case GET_WITHDRAW_HISTORY:
            return { ...state, withdrawhistoryLoading: true, resendMailResponse: {} };
        case GET_WITHDRAW_HISTORY_SUCCESS:
            return { ...state, withdrawhistoryLoading: false, withdrawhistory: action.payload };
        case GET_WITHDRAW_HISTORY_FAILURE:
            return { ...state, withdrawhistoryLoading: false, withdrawhistory: [] };
        //resend mail confirmation
        case RESENDMAIL:
            return { ...state, withdrawhistoryLoading: true, resendMailResponse: {} };
        case RESENDMAIL_SUCCESS:
            return { ...state, withdrawhistoryLoading: false, resendMailResponse: action.payload };
        case RESENDMAIL_FAILURE:
            return { ...state, withdrawhistoryLoading: false, resendMailResponse: action.error };
        //withdrawal policy...
        case WITHDRAW_POLICY:
            return { ...state, withdrawalPolicy: {} }
        case WITHDRAW_POLICY_SUCCESS:
            return { ...state, withdrawalPolicy: action.payload }
        case WITHDRAW_POLICY_FAILURE:
            return { ...state, withdrawalPolicy: action.payload }

        default: return { ...state };

    }
}