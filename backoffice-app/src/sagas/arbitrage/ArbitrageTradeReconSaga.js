import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI } from "../../api/helper";
import { ARBITRAGE_TRADE_RECON_LIST, ARBITRAGE_TRADE_RECON_SET, } from "../../actions/ActionTypes";
import {
    getArbiTradeReconListSuccess, getArbiTradeReconListFailure,
    setArbiTradeReconSuccess, setArbiTradeReconFailure,
} from "../../actions/Arbitrage/ArbitrageTradeReconActions";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";

// Generator for Arbitrage Trade Recon List
function* getArbiTradeReconListApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let request = {};

        if (payload.MemberID !== undefined && payload.MemberID !== '') {
            request = { ...request, MemberID: payload.MemberID }
        }
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            request = { ...request, FromDate: payload.FromDate }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            request = { ...request, ToDate: payload.ToDate }
        }
        if (payload.TrnNo !== undefined && payload.TrnNo !== '') {
            request = { ...request, TrnNo: payload.TrnNo }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            request = { ...request, Status: payload.Status }
        }
        if (payload.Trade !== undefined && payload.Trade !== '') {
            request = { ...request, Trade: payload.Trade }
        }
        if (payload.Pair !== undefined && payload.Pair !== '') {
            request = { ...request, Pair: payload.Pair }
        }
        if (payload.MarketType !== undefined && payload.MarketType !== '') {
            request = { ...request, MarketType: payload.MarketType }
        }
        if (payload.LPType !== undefined && payload.LPType !== '') {
            request = { ...request, LPType: payload.LPType }
        }
        if (payload.PageIndex !== undefined && payload.PageIndex !== '') {
            request = { ...request, PageNo: payload.PageIndex }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            request = { ...request, PageSize: payload.PageSize }
        }
        if (payload.IsMargin !== undefined && payload.IsMargin !== '') {
            request = { ...request, IsMargin: payload.IsMargin }
        }
        if (payload.IsProcessing !== undefined && payload.IsProcessing !== '') {
            request = { ...request, IsProcessing: payload.IsProcessing }
        }

        let Url = ''

        //screenType == 1 for abitrage trade recon ,screenType == 2 for trade recon 
        if (payload.screenType == 1) {
            Url = Method.TradingReconHistoryArbitrage
        }
        else if (payload.screenType == 2) {
            Url = Method.TradingReconHistory
        }

        // To call Arbitrage Trade recon list Api
        const response = yield call(swaggerPostAPI, Url, request, headers);

        // To set Arbitrage Trade recon list success response to reducer
        yield put(getArbiTradeReconListSuccess(response));
    } catch (error) {

        // To set Arbitrage Trade recon list failure response to reducer
        yield put(getArbiTradeReconListFailure(error));
    }
}

// Generator for Set Arbitrage Trade Recon
function* setArbiTradeReconApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        let Url = ''

        //screenType == 1 for abitrage trade recon ,screenType == 2 for trade recon 
        if (payload.screenType == 1) {
            Url = Method.ArbitrageTradeReconV1
        }
        else if (payload.screenType == 2) {
            Url = Method.TradeReconV1
        }

        // screenType is not include in request 
        delete payload['screenType']

        // To call Arbitrage Pair Config add Api
        const response = yield call(swaggerPostAPI, Url, payload, headers);

        // To set Arbitrage Trade recon success response to reducer
        yield put(setArbiTradeReconSuccess(response));
    } catch (error) {

        // To set Arbitrage Trade recon failure response to reducer
        yield put(setArbiTradeReconFailure(error));
    }
}

//call Apis
export function* ArbitrageTradeReconSaga() {
    // To register Arbitrage Trade Recon List method
    yield takeEvery(ARBITRAGE_TRADE_RECON_LIST, getArbiTradeReconListApi);
    // To register Arbitrage Trade Recon Set method
    yield takeEvery(ARBITRAGE_TRADE_RECON_SET, setArbiTradeReconApi);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ArbitrageTradeReconSaga),
    ]);
}
