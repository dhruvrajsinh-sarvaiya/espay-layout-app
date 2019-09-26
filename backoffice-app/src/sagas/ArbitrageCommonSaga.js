// import neccessary saga effects from sagas/effects
import { call, put, takeEvery, select } from "redux-saga/effects";
// import actions methods for handle response
import {
  getServiceConfigByBaseArbitrageSuccess, getServiceConfigByBaseArbitrageFailure,
  getArbitrageThirdPartyResponseSuccess, getArbitrageThirdPartyResponseFailure
} from "../actions/ArbitrageCommonActions";
// import action types which is neccessary
import {
  ARBITRGAE_SERVICE_CONFIG_BASE, GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST
} from "../actions/ActionTypes";
import { swaggerGetAPI } from '../api/helper';
import { Method } from "../controllers/Methods";
import { userAccessToken } from '../selector';

export default function* ArbitrageCommonSaga() {
  yield takeEvery(ARBITRGAE_SERVICE_CONFIG_BASE, getServiceConfiguByBaseArbitrageApi)
  yield takeEvery(GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST, arbitrageThirdPartyResponse)
}

// Generator for getServiceConfiguByBaseArbitrageApi
function* getServiceConfiguByBaseArbitrageApi({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    let url = Method.GetAllServiceConfigurationByBaseArbitrage + '/' + payload.Base

    if (payload.IsMargin !== undefined && payload.IsMargin !== '') {
      url += "?IsMargin=" + payload.IsMargin;
    }

    // To call Get ListPairArbitrage Data Api
    const data = yield call(swaggerGetAPI, url, {}, headers);

    // To set Get getServiceConfigByBaseArbitrageFailure success response to reducer
    yield put(getServiceConfigByBaseArbitrageSuccess(data));
  } catch (error) {
    // To set Get getServiceConfigByBaseArbitrageFailure failure response to reducer
    yield put(getServiceConfigByBaseArbitrageFailure());
  }
}

// for all third party response
function* arbitrageThirdPartyResponse() {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Get all third party response Data Api
    const data = yield call(swaggerGetAPI, Method.GetAllThirdPartyAPIResposeArbitrage, {}, headers)

    // To set Get all third party response success response to reducer
    yield put(getArbitrageThirdPartyResponseSuccess(data))
  } catch (error) {
    // To set Get all third party response failure response to reducer
    yield put(getArbitrageThirdPartyResponseFailure())
  }
}



