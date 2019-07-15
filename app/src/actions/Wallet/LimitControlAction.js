import { action } from '../GlobalActions';
import {
    // Fetch Save Limit
    FETCH_SAVE_LIMIT,

    // Fetch Limit Control
    FETCH_LIMIT_CONTROL,

    // Dropdown Change
    DropdownChange,
} from '../ActionTypes';

// Redux action to Save Limits
export function OnSaveLimits(AccWalletID, LimitPerHour, LimitPerDay, LimitPerTrn, LifeTimeLimit, StartTime, EndTime, trnType) {
    return action(FETCH_SAVE_LIMIT, { AccWalletID, LimitPerHour, LimitPerDay, LimitPerTrn, LifeTimeLimit, StartTime, EndTime, trnType })
}

// Redux action to Fetch Limits
export function OnFetchLimits(getLimitRequest, AccWalletID) {
    return action(FETCH_LIMIT_CONTROL, { getLimitRequest, AccWalletID })
}

//on Dropdown coin or address selection
export function OnDropdownChange() {
    return action(DropdownChange)
}