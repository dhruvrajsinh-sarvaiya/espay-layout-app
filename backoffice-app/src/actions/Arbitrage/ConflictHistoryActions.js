import {
    // Get Conflict History
    GET_CONFLICT_HISTORY,
    GET_CONFLICT_HISTORY_SUCCESS,
    GET_CONFLICT_HISTORY_FAILURE,

    // Clear Conflict History
    CLEAR_CONFLICT_HISTORY,

    // Conflict Recon Process
    CONFLICT_RECON_PROCESS,
    CONFLICT_RECON_PROCESS_SUCCESS,
    CONFLICT_RECON_PROCESS_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Conflict History
export function getConflictHistory(payload = {}) {
    return action(GET_CONFLICT_HISTORY, { payload })
}

// Redux action for Get Conflict History Success
export function getConflictHistorySuccess(data) {
    return action(GET_CONFLICT_HISTORY_SUCCESS, { data })
}

// Redux action for Get Conflict History Failure
export function getConflictHistoryFailure() {
    return action(GET_CONFLICT_HISTORY_FAILURE)
}

// Redux action for Conflict Recon Process
export function conflictReconProcess(payload = {}) {
    return action(CONFLICT_RECON_PROCESS, { payload })
}

// Redux action for Conflict Recon Process Success
export function conflictReconProcessSuccess(data) {
    return action(CONFLICT_RECON_PROCESS_SUCCESS, { data })
}

// Redux action for Conflict Recon Process Failure
export function conflictReconProcessFailure() {
    return action(CONFLICT_RECON_PROCESS_FAILURE)
}

// Redux action for Clear Conflict History
export function clearConflictHistory() {
    return action(CLEAR_CONFLICT_HISTORY)
}