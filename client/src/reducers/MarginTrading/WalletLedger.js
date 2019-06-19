/* 
    Developer : Vishva shah
    Date : 1-03-2019
    File Comment : list margin wallets Ledger reducer
*/
import {
    //list
    MARGIN_WALLET_LEDGER,
    MARGIN_WALLET_LEDGER_SUCCESS,
    MARGIN_WALLET_LEDGER_FAILURE

} from 'Actions/types';

const INITIAL_STATE = {
    loading: false,
    walletLedgerList: [],
    TotalCount: 0

}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MARGIN_WALLET_LEDGER:
            return { ...state, loading: true, walletLedgerList: [], TotalCount: 0 }
        case MARGIN_WALLET_LEDGER_SUCCESS:
            return { ...state, loading: false, walletLedgerList: action.payload.WalletLedgers, TotalCount: action.payload.TotalCount }
        case MARGIN_WALLET_LEDGER_FAILURE:
            return { ...state, loading: false, walletLedgerList: [], TotalCount: 0 }

        default:
            return { ...state };
    }
}