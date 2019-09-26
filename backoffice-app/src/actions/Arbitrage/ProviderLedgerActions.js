import {
    // Get Provider Ledger Data
    GET_PROVIDER_LEDGER_DATA,
    GET_PROVIDER_LEDGER_DATA_SUCCESS,
    GET_PROVIDER_LEDGER_DATA_FAILURE,

    // Clear Provider Ledger Data
    CLEAR_PROVIDER_LEDGER_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Provider Ledger
export function getProviderLedger(payload = {}) {
    return action(GET_PROVIDER_LEDGER_DATA, { payload })
}

// Redux action for Get Provider Ledger Success
export function getProviderLedgerSuccess(data) {
    return action(GET_PROVIDER_LEDGER_DATA_SUCCESS, { data })
}

// Redux action for Get Provider Ledger Failure
export function getProviderLedgerFailure() {
    return action(GET_PROVIDER_LEDGER_DATA_FAILURE)
}

// Redux action for Clear Provider Ledger Data
export function clearProviderLedgerData() {
    return action(CLEAR_PROVIDER_LEDGER_DATA)
}