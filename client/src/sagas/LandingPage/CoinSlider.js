/* 
    Createdby : Devang Parekh
    CreatedDate : 26-12-2018
    Description : Coin Slider Saga for call and get coin slider infromation
*/

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import action types
import {
    COIN_SLIDER_LIST
} from 'Actions/types';

//import function from action
import {
    getCoinSliderListSuccess,
    getCoinSliderListFailure
} from 'Actions/LandingPage';

// import call to swagger api
import { swaggerGetAPI } from 'Helpers/helpers';

// get detail from swagger list
function* getCoinSliderListAPI({payload}) { 

    try {

        const response = yield call(swaggerGetAPI,'api/Transaction/GetMarketTicker',{});
        //console.log('coinSlider Response',response,new Date());

        if(response.ReturnCode === 0) {
            yield put(getCoinSliderListSuccess(response.Response));
        } else {
            yield put(getCoinSliderListFailure(response));
        }

    } catch (error) {
        yield put(getCoinSliderListFailure(error));
    }
  
}

// intiate saga function 
export function* getCoinSliderList() {
    yield takeEvery(COIN_SLIDER_LIST, getCoinSliderListAPI);
}

// manage saga function
export default function* rootSaga() {
    yield all([
        fork(getCoinSliderList)
    ]);
}