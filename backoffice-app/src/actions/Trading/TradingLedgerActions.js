import { action } from '../GlobalActions';
import {
    GET_TRADING_LEDGERS,
    GET_TRADING_LEDGERS_SUCCESS,
    GET_TRADING_LEDGERS_FAILURE,
    CLEAR_TRADING_LEDGERS,
} from "../ActionTypes";

//To get trading ledgers list
export function getTradingLedgersBO(payload) { return action(GET_TRADING_LEDGERS, { payload }); }

export function getTradingLedgersBOSuccess(payload) { return action(GET_TRADING_LEDGERS_SUCCESS, { payload }); }

export function getTradingLedgersBOFailure() { return action(GET_TRADING_LEDGERS_FAILURE); }

export function clearTradingLedgersData() { return action(CLEAR_TRADING_LEDGERS); }