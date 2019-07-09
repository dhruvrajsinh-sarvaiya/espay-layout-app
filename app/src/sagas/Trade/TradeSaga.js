import {
    FETCH_MARKET_LIST,
} from '../../actions/ActionTypes'
import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
    onMarketSuccess, onMarketFailure, onMarginMarketSuccess, onMarginMarketFailure,
} from '../../actions/Trade/TradeActions';
import { Method, ServiceUtilConstant } from '../../controllers/Constants';
import { favouriteResponse } from '../../selector';
import { getColorCode } from '../../validations/CommonValidation';
import { swaggerGetAPI } from '../../api/helper';
import { parseFloatVal } from '../../controllers/CommonUtils';
import { setData } from '../../App';

export default function* tradeSaga() {
    //For Pair Listing
    yield takeLatest(FETCH_MARKET_LIST, getPairListData);
}

// Function for PAIR LIST DATA
function* getPairListData({ payload }) {

    //From API
    try {

        let url = Method.GetTradePairAsset;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});

        // if response is not null and having records then get first item and set it for default fair for trading
        if (response && response.response.length > 0 && response.response[0].PairList.length > 0 && response.response[0].PairList[0]) {
            setData({ [ServiceUtilConstant.KEY_CurrencyPair]: response.response[0].PairList[0] });
        }

        //Trade Pair Asset response
        let favouriteList = yield select(favouriteResponse);

        if (favouriteList && favouriteList.ReturnCode == 0 && response.ReturnCode == 0) {

            //Update new state of updated list
            response.response = mergeMarketFavoriteResponse(response, favouriteList);
        }

        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            yield put(onMarginMarketSuccess(response))
        } else {
            yield put(onMarketSuccess(response))
        }
    } catch (error) {
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            yield put(onMarginMarketFailure());
        } else {
            yield put(onMarketFailure());
        }
    }
}

export function mergeMarketFavoriteResponse(marketResponse, favoriteResponse) {

    let updatedList = marketResponse.response;

    //Loop thorugh Market list
    marketResponse.response.map((baseItem, baseIndex) => {

        //Loop through each pairs
        baseItem.PairList.map((pairItem, pairIndex) => {

            //Find index of favourite item
            let index = -1;
            //Find index of favourite item
            if (marketResponse.response) {
                index = favoriteResponse.response.findIndex(el => el.PairId == pairItem.PairId);
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

    return updatedList;
}