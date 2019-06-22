import { put, call, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { userAccessToken, tradePairAssetResponse, marginTradePairAssetResponse } from '../../selector';
import { GET_FAVOURITES, ADD_FAVOURITE, REMOVE_FAVOURITE } from '../../actions/ActionTypes';
import { getFavouritesSuccess, getFavouritesFailure, addFavouriteSuccess, addFavouriteFailure, removeFavouriteFailure, removeFavouriteSuccess, getMarginFavouritesSuccess } from '../../actions/Trade/FavouriteActions';
import { onMarketSuccess, onMarginMarketSuccess } from '../../actions/Trade/TradeActions';
import { getColorCode } from '../../validations/CommonValidation';
import { swaggerPostAPI, swaggerGetAPI } from '../../api/helper';
import { parseFloatVal, } from '../../controllers/CommonUtils';

export default function* favouriteSaga() {

    //For getting favourites list
    yield takeLatest(GET_FAVOURITES, getFavourites);

    //For adding to favourite list
    yield takeLatest(ADD_FAVOURITE, addFavourite);

    //For removing from favourite list
    yield takeLatest(REMOVE_FAVOURITE, removeFavourite);
}

function* getFavourites({ payload }) {

    try {

        let url = Method.GetFavouritePair;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        const response = yield call(swaggerGetAPI, url, {}, headers);

        if (response.ReturnCode == 0 || response.ReturnCode == 1) {

            // if favorite response is not null than update its records
            if (response.response !== null){
                let localRes = response.response;

                response.response.map((favItem, index) => {
                    localRes[index].isFavorite = true;
                    localRes[index].CurrentRate = parseFloatVal(favItem.CurrentRate).toFixed(8);
                    localRes[index].Low24Hr = parseFloatVal(favItem.Low24Hr).toFixed(8);
                    localRes[index].High24Hr = parseFloatVal(favItem.High24Hr).toFixed(8);
                    localRes[index].LowWeek = parseFloatVal(favItem.LowWeek).toFixed(8);
                    localRes[index].Low52Week = parseFloatVal(favItem.Low52Week).toFixed(8);
                })

                response.response = localRes;
            }

            //Trade Pair Asset response
            let pairResponse = (payload.IsMargin !== undefined && payload.IsMargin != 0) ? yield select(marginTradePairAssetResponse) : yield select(tradePairAssetResponse);

            //to check if records are exist
            if (pairResponse && pairResponse.ReturnCode == 0) {

                let updatedList = pairResponse.response;

                //Loop thorugh Market list
                pairResponse.response.map((baseItem, baseIndex) => {

                    //Loop through each pairs
                    baseItem.PairList.map((pairItem, pairIndex) => {

                        let index = -1;
                        //Find index of favourite item
                        if (response.response) {
                            index = response.response.findIndex(el => el.PairId == pairItem.PairId);
                        }

                        //Get condition based color with old and new values
                        let currentRateColor = getColorCode(updatedList[baseIndex].PairList[pairIndex].CurrentRate);
                        let changePerColor = getColorCode(updatedList[baseIndex].PairList[pairIndex].ChangePer);

                        //Apply true false based on index found or not
                        updatedList[baseIndex].PairList[pairIndex].isFavorite = index > -1;
                        updatedList[baseIndex].PairList[pairIndex].currentRateColor = currentRateColor;
                        updatedList[baseIndex].PairList[pairIndex].changePerColor = changePerColor;

                        updatedList[baseIndex].PairList[pairIndex].CurrentRate = parseFloatVal(pairItem.CurrentRate).toFixed(8);
                        updatedList[baseIndex].PairList[pairIndex].Low24Hr = parseFloatVal(pairItem.Low24Hr).toFixed(8);
                        updatedList[baseIndex].PairList[pairIndex].High24Hr = parseFloatVal(pairItem.High24Hr).toFixed(8);
                        updatedList[baseIndex].PairList[pairIndex].LowWeek = parseFloatVal(pairItem.LowWeek).toFixed(8);
                        updatedList[baseIndex].PairList[pairIndex].Low52Week = parseFloatVal(pairItem.Low52Week).toFixed(8);
                    })
                })

                //Update new state for updated list
                pairResponse.response = updatedList;

                if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
                    yield put(onMarginMarketSuccess(pairResponse))
                } else {
                    yield put(onMarketSuccess(pairResponse))
                }
            }
        }

        // if isMargin is not undefined and isMargin is not 0 than send margin favourites records, otherwise set normal favourites
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            yield put(getMarginFavouritesSuccess(response))
        } else {
            yield put(getFavouritesSuccess(response))
        }

    } catch (error) {
        yield put(getFavouritesFailure());
    }
}

function* addFavourite({ payload }) {
    try {

        let url = Method.AddToFavouritePair + '/' + payload.PairId;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        const response = yield call(swaggerPostAPI, url, {}, headers);
        yield put(addFavouriteSuccess(response))
    } catch (error) {
        yield put(addFavouriteFailure());
    }
}

function* removeFavourite({ payload }) {
    try {
        let url = Method.RemoveFromFavouritePair + '/' + payload.PairId;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        const response = yield call(swaggerPostAPI, url, {}, headers);
        yield put(removeFavouriteSuccess(response))
    } catch (error) {
        yield put(removeFavouriteFailure());
    }
}