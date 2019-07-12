// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";

// import actions methods for handle response
import {
	pairListSuccess,
	pairListFailure,
	getCurrencyListSuccess,
	getCurrencyListFailure,
	getOrgListSuccess,
	getOrgListFail,
	getWalletTypeMasterSuccess,
	getWalletTypeMasterFailure,
	getWalletTypeSuccess,
	getWalletTypeFailure,
	getRoleDetailsSuccess,
	getRoleDetailsFailure,
	getWalletTransactionTypeSuccess,
	getWalletTransactionTypeFailure,
	getWalletsSuccess,
	getWalletsFailure,
	getUserDataListSuccess,
	getUserDataListFailure,
	getProviderListSuccess,
	getProviderListFailure,
	getReferralServiceSuccess,
	getReferralServiceFailure,
	getReferralPaytypeSuccess,
	getReferralPaytypeFailure,
	getReferralChannelTypeSuccess,
	getReferralChannelTypeFailure,
	getSiteTokenSuccess,
	getSiteTokenFailure,
	getBaseCurrencyListSuccess,
	getBaseCurrencyListFailure,
	getMarginWalletListSuccess,
	getMarginWalletListFailure,
} from "../actions/PairListAction";

// import action types which is neccessary
import {
	GET_PAIR_LIST, GET_CURRENCY_LIST,
	ORGLIST,
	GET_WALLET_TYPE_MASTER,
	GET_WALLET_TYPE,
	GET_ROLE_DETAILS,
	GET_WALLET_TRANSACTION_TYPE,
	FETCH_WALLET_LIST,
	GET_USER_DATA,
	GET_PROVIDER_LIST,
	GET_REFERRAL_SERVICE,
	GET_REFERRAL_PAYTYPE,
	GET_REFERRAL_CHANNEL_TYPE,
	GET_SITE_TOKEN,
	GET_BASE_CURRENCY_LIST,
	LIST_MARGIN_WALLETS,
} from "../actions/ActionTypes";
import { swaggerPostAPI, swaggerGetAPI, queryBuilder } from '../api/helper';
import { Method } from "../controllers/Constants";
import { userAccessToken } from '../selector';

function* getPairList() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Pair List api
		const response = yield call(swaggerPostAPI, Method.ListPair, {}, headers);

		// To set Pair List success response to reducer
		yield put(pairListSuccess(response));
	} catch (error) {
		// To set Pair List failre response to reducer
		yield put(pairListFailure(error));
	}
}

function* getPairCurrencies() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Pair Currency api
		const response = yield call(swaggerPostAPI, Method.ListCurrency, {}, headers);

		// To set Pair Currency List success response to reducer
		yield put(getCurrencyListSuccess(response));
	} catch (error) {
		// To set Pair Currency List failure response to reducer
		yield put(getCurrencyListFailure(error));
	}
}


//get organization list from API
function* getOrgListAPI() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Organization List api
		const response = yield call(swaggerGetAPI, Method.ListOrgDetails, {}, headers);

		// To set Organization List success response to reducer
		yield put(getOrgListSuccess(response));
	} catch (error) {
		// To set Organization List failure response to reducer
		yield put(getOrgListFail(error));
	}
}

//For Get Wallet Types Master From API
function* getWalletTypeMasterAPI() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Wallet Type Master api
		const response = yield call(swaggerGetAPI, Method.ListAllWalletTypeMaster, {}, headers);

		// To set Wallet Type Master success response to reducer
		yield put(getWalletTypeMasterSuccess(response));
	} catch (error) {
		// To set Wallet Type Master failure response to reducer
		yield put(getWalletTypeMasterFailure(error));
	}
}

function* getWalletTypeAPI() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Wallet Type api
		const response = yield call(swaggerGetAPI, Method.ListWalletTypeDetails, {}, headers);

		// To set Wallet Type success response to reducer
		yield put(getWalletTypeSuccess(response));
	} catch (error) {
		// To set Wallet Type failure response to reducer
		yield put(getWalletTypeFailure(error));
	}
}

//get roles details 
function* getRoleDetailsAPI() {
	try {
		// To get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Role Detail api
		const response = yield call(swaggerGetAPI, Method.ListRoleDetails, {}, headers);

		// To set Role Details success response to reducer
		yield put(getRoleDetailsSuccess(response));
	}
	catch (error) {
		// To set Role Details failure response to reducer
		yield put(getRoleDetailsFailure(error));
	}
}

//get trasancation type 
function* getWalletTransactionTypeAPI() {
	try {
		// To get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Wallet Transaction Type api
		const response = yield call(swaggerGetAPI, Method.ListWalletTrnType, {}, headers);

		// To set Wallet Transaction Type success response to reducer
		yield put(getWalletTransactionTypeSuccess(response));
	} catch (error) {
		// To set Wallet Transaction Type failure response to reducer
		yield put(getWalletTransactionTypeFailure(error));
	}
}

//Get Wallets
function* getWallets() {
	try {
		// To get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Wallets api
		const responseFromSocket = yield call(swaggerGetAPI, Method.ListWallet, {}, headers);

		// To set Wallet success response to reducer
		yield put(getWalletsSuccess(responseFromSocket));
	} catch (error) {
		// To set Wallet failure response to reducer
		yield put(getWalletsFailure(error));
	}
}

// Get Users Data
function* getUserDataAPI() {
	try {
		// To get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call User Data api
		const response = yield call(swaggerGetAPI, Method.GetAllUserData, {}, headers);

		// To set User Data List success response to reducer
		yield put(getUserDataListSuccess(response));
	} catch (error) {
		// To set User Data List failure response to reducer
		yield put(getUserDataListFailure(error));
	}
}

//For Get Provider List From Api
function* getProviderListData() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Provider List api
		const response = yield call(swaggerGetAPI, Method.GetProviderList, {}, headers);

		// To set Provider List success response to reducer
		yield put(getProviderListSuccess(response));
	} catch (error) {
		// To set Provider List failure response to reducer
		yield put(getProviderListFailure(error));
	}
}

//For Get Referral Service From Api
function* getReferralServiceData(action) {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Referral Service api
		const response = yield call(swaggerPostAPI, Method.DropDownReferralService + queryBuilder(action.payload), {}, headers);

		// To set Referral Service success response to reducer
		yield put(getReferralServiceSuccess(response));
	} catch (error) {
		// To set Referral Service failure response to reducer
		yield put(getReferralServiceFailure(error));
	}
}

//For Get Referral Service From Api
function* getReferralPaytypeData() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Referral Paytype api
		const response = yield call(swaggerPostAPI, Method.DropDownReferralPayType, {}, headers);

		// To set Referral Paytype success response to reducer
		yield put(getReferralPaytypeSuccess(response));
	} catch (error) {
		// To set Referral Paytype failure response to reducer
		yield put(getReferralPaytypeFailure(error));
	}
}

//For Get Referral Channel Type Data From Api
function* getReferralChannelTypeData() {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Referral Channel Type api
		const response = yield call(swaggerPostAPI, Method.DropDownReferralChannelType, {}, headers);

		// To set Referral Channel Type success response to reducer
		yield put(getReferralChannelTypeSuccess(response));
	} catch (error) {
		// To set Referral Channel Type failure response to reducer
		yield put(getReferralChannelTypeFailure(error));
	}
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenDetail({ payload }) {
	try {
		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// To call Site Token Detail api
		const response = yield call(swaggerGetAPI, Method.GetAllSiteToken, {}, headers);

		// To set Site Token Detail success response to reducer
		yield put(getSiteTokenSuccess(response));
	} catch (error) {
		// To set Site Token Detail failure response to reducer
		yield put(getSiteTokenFailure(error));
	}
}

// Function to Get Base Currency List Data From Api
function* getBaseCurrencyListApi({ payload }) {
	try {
		const request = payload;
		var swaggerUrl = Method.GetBaseMarket;

		// To get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// Create request
		let req = {};
		if (request) {

			// ActiveOnly is not undefined
			if (request.ActiveOnly !== undefined) {
				req = {
					...req,
					ActiveOnly: request.ActiveOnly
				}
			}
		}

		// To call Base Currency List api
		const response = yield call(swaggerGetAPI, swaggerUrl + queryBuilder(req), {}, headers);

		// To set Base Currency List success response to reducer
		yield put(getBaseCurrencyListSuccess(response));
	} catch (error) {
		// To set Base Currency List failure response to reducer
		yield put(getBaseCurrencyListFailure(error));
	}

}

//Function To Get Margin Wallet List Data From Api
function* getMarginWalletListRequest(payload) {
	try {
		const request = payload.request;
		var swaggerUrl = Method.ListMarginWalletMaster;
		//to get tokenID of currently logged in user.
		let tokenID = yield select(userAccessToken);
		var headers = { 'Authorization': tokenID }

		// Create request
		let req = {};
		if (request) {

			// Status is not undefined
			if (request.Status !== undefined) {
				req = {
					...req,
					Status: request.Status
				}
			}

			// WalletTypeId is not undefined
			if (request.WalletTypeId !== undefined) {
				req = {
					...req,
					WalletTypeId: request.WalletTypeId
				}
			}

			// WalletUsageType is not undefined
			if (request.WalletUsageType !== undefined) {
				req = {
					...req,
					WalletUsageType: request.WalletUsageType
				}
			}
		}

		// To call Margin Wallet List Request api
		const response = yield call(swaggerGetAPI, swaggerUrl + queryBuilder(req), request, headers);

		// To set Margin Wallet List success response to reducer
		yield put(getMarginWalletListSuccess(response));
	} catch (error) {
		// To set Margin Wallet List failure response to reducer
		yield put(getMarginWalletListFailure(error));
	}
}

// Pair List
export function* pairList() {
	// call pair list action type and sagas api function
	yield takeLatest(GET_PAIR_LIST, getPairList);
}

// Pair Currency List
export function* pairCurrency() {
	// call Currency action type and sagas api function
	yield takeLatest(GET_CURRENCY_LIST, getPairCurrencies);
}

/* for organization list */
export function* getOrgList() {
	yield takeLatest(ORGLIST, getOrgListAPI);
}

/* for Wallet Type Master List  */
function* getWalletTypeMaster() {
	yield takeLatest(GET_WALLET_TYPE_MASTER, getWalletTypeMasterAPI);
}

/* for Get Wallet Type List */
function* getWalletType() {
	yield takeLatest(GET_WALLET_TYPE, getWalletTypeAPI);
}

/* For Get Role Details */
function* getRoleDetails() {
	yield takeLatest(GET_ROLE_DETAILS, getRoleDetailsAPI);
}

/* For Get Wallet trn Type Api */
function* getWalletTransactionType() {
	yield takeLatest(GET_WALLET_TRANSACTION_TYPE, getWalletTransactionTypeAPI);
}

/* For Get Wallet List Api */
function* getWalletList() {
	yield takeLatest(FETCH_WALLET_LIST, getWallets);
}

/* Create Sagas method for Get User Data */
export function* getUserDataSagas() {
	yield takeLatest(GET_USER_DATA, getUserDataAPI);
}

//Get Provider List
function* getProviderList() {
	yield takeLatest(GET_PROVIDER_LIST, getProviderListData);
}

//Get Referral Service
function* getReferralService() {
	yield takeLatest(GET_REFERRAL_SERVICE, getReferralServiceData);
}

//Get Referral Paytype
function* getReferralPaytype() {
	yield takeLatest(GET_REFERRAL_PAYTYPE, getReferralPaytypeData);
}

//Get Referral Channel type
function* getReferralChannelType() {
	yield takeLatest(GET_REFERRAL_CHANNEL_TYPE, getReferralChannelTypeData);
}

// Sagas Function for get site token 
function* getSiteToken() {
	yield takeLatest(GET_SITE_TOKEN, getSiteTokenDetail);
}

// call trading ledger action type and sagas api function
export function* getBaseCurrencyList() {
	yield takeLatest(GET_BASE_CURRENCY_LIST, getBaseCurrencyListApi);
}

// get a list of marging wallets...
function* getMarginWalletList() {
	yield takeLatest(LIST_MARGIN_WALLETS, getMarginWalletListRequest)
}

export default function* rootSaga() {
	yield all([
		// To register pairList method
		fork(pairList),
		// To register pairCurrency method
		fork(pairCurrency),
		// To register getOrgList method
		fork(getOrgList),
		// To register getWalletTypeMaster method
		fork(getWalletTypeMaster),
		// To register getWalletType method
		fork(getWalletType),
		// To register getRoleDetails method
		fork(getRoleDetails),
		// To register getWalletTransactionType method
		fork(getWalletTransactionType),
		// To register getWalletList method
		fork(getWalletList),
		// To register getUserDataSagas method
		fork(getUserDataSagas),
		// To register getProviderList method
		fork(getProviderList),
		// To register getReferralService method
		fork(getReferralService),
		// To register getReferralPaytype method
		fork(getReferralPaytype),
		// To register getReferralChannelType method
		fork(getReferralChannelType),
		// To register getSiteToken method
		fork(getSiteToken),
		// To register getBaseCurrencyList method
		fork(getBaseCurrencyList),
		// To register getMarginWalletList method
		fork(getMarginWalletList),
	]);
}
