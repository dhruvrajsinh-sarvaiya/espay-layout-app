import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    ADD_AFFILIATE_PROMOTION,
    EDIT_AFFILIATE_PROMOTION,
    CHANGE_AFFILIATE_PROMOTION_STATUS,
    LIST_AFFILIATE_PROMOTION,
} from "../../actions/ActionTypes";
import {
    addAffiliatePromotionSuccess,
    addAffiliatePromotionFailure,
    editAffiliatePromotionSuccess,
    editAffiliatePromotionFailure,
    changeStatusAffiliatePromotionSuccess,
    changeStatusAffiliatePromotionFailure,
    getAffiliatePromotionListSuccess,
} from "../../actions/account/AffiliatePromotionAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";

//Function for Add Affiliate Promotion API
function* addAffiliatePromotionAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add affiliate promotion api
        const response = yield call(swaggerPostAPI, Method.AddAffiliatePromotion, payload, headers);

        // To set add affiliate promotion success response to reducer
        yield put(addAffiliatePromotionSuccess(response));
    } catch (error) {

        // To set add affiliate promotion failure response to reducer
        yield put(addAffiliatePromotionFailure(error));
    }
}

//Function for Edit Affiliate Promotion API
function* editAffiliatePromotionAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call edit affiliate promotion api
        const response = yield call(swaggerPostAPI, Method.UpdateAffiliatePromotion, payload, headers);

        // To set edit affiliate promotion success response to reducer
        yield put(editAffiliatePromotionSuccess(response));
    } catch (error) {

        // To set edit affiliate promotion failure response to reducer
        yield put(editAffiliatePromotionFailure(error));
    }
}

//Function for List Affiliate Promotion API
function* listAffiliatePromotionAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate promotion list api
        const response = yield call(swaggerGetAPI, Method.ListAffiliatePromotion + '/' + payload.PageNo + '?PageSize=' + payload.PageSize, {}, headers);

        // To set affiliate promotion list success response to reducer
        yield put(getAffiliatePromotionListSuccess(response));
    } catch (error) {

        // To set affiliate promotion list failure response to reducer
        yield put(getAffiliatePromotionListFailure(error));
    }
}

//Function for Change Status Affiliate Promotion API
function* changeStatusAffiliatePromotionAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affiliate promotion change status api
        const response = yield call(swaggerPostAPI, Method.ChangeAffiliatePromotionStatus, payload, headers);

        // To set affiliate promotion change status success response to reducer
        yield put(changeStatusAffiliatePromotionSuccess(response));
    } catch (error) {

        // To set affiliate promotion change status failure response to reducer
        yield put(changeStatusAffiliatePromotionFailure(error));
    }
}

/* Create Sagas method for Add Affiliate Promotion */
export function* addAffiliatePromotionSagas() {
    yield takeEvery(ADD_AFFILIATE_PROMOTION, addAffiliatePromotionAPI);
}

/* Create Sagas method for Edit Affiliate Promotion */
export function* editAffiliatePromotionSagas() {
    yield takeEvery(EDIT_AFFILIATE_PROMOTION, editAffiliatePromotionAPI);
}

/* Create Sagas method for List Affiliate Promotion */
export function* listAffiliatePromotionSagas() {
    yield takeEvery(LIST_AFFILIATE_PROMOTION, listAffiliatePromotionAPI);
}

/* Create Sagas method for Change Status Affiliate Promotion */
export function* changeStatusAffiliatePromotionSagas() {
    yield takeEvery(CHANGE_AFFILIATE_PROMOTION_STATUS, changeStatusAffiliatePromotionAPI);
}

//saga middleware
export default function* rootSaga() {
    yield all([
        fork(addAffiliatePromotionSagas),
        fork(editAffiliatePromotionSagas),
        fork(listAffiliatePromotionSagas),
        fork(changeStatusAffiliatePromotionSagas),
    ]);
}