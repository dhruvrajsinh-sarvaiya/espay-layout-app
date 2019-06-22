import { action } from '../GlobalActions';
import {
    // User Ledger List
    USER_LEDGER_LIST,
    USER_LEDGER_LIST_SUCCESS,
    USER_LEDGER_LIST_FAILURE,
} from '../ActionTypes'

// Redux Actions for User Ledger List
export function fetchUserLedgerList(requestUserLedger) {
    return action(USER_LEDGER_LIST, { requestUserLedger })
}
// Redux Actions for User Ledger List Success
export function fetchUserLedgerListSuccess(data) {
    return action(USER_LEDGER_LIST_SUCCESS, { data })
}
// Redux Actions for User Ledger List Failure
export function fetchUserLedgerListFailure() {
    return action(USER_LEDGER_LIST_FAILURE)
}
