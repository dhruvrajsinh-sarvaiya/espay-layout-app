// sagas For Trade Ledger Actions By Tejas

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import { GET_TRADING_LEDGER_DATA } from "Actions/types";

// action sfor set data or response
import {
  getTradingLedgerDataListSuccess,
  getTradingLedgerDataListFailure
} from "Actions/Trading";

// Sagas Function for get Trade Ledger by :Tejas
function* getTradingLedgerDataList() {

  yield takeEvery(GET_TRADING_LEDGER_DATA, getTradingLedgerDataListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradingLedgerDataListDetail({ payload }) {
  const { Data } = payload
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradeSettledHistory', Data, {}, headers);


    // check response status and histopry length
    if (response && response != null && response.ReturnCode === 0) {

      // call success method of action
      yield put(getTradingLedgerDataListSuccess(response));
    } else {
      // call failed method of action
      yield put(getTradingLedgerDataListFailure(response));
    }
  } catch (error) {
    // call failed method of action
    yield put(getTradingLedgerDataListFailure(error));
  }

}

export default function* rootSaga() {
  yield all(
    [
      fork(getTradingLedgerDataList)
    ]
  );
}
