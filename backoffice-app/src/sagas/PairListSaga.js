// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";

// import actions methods for handle response
import {
  pairListSuccess, pairListFailure,
  getCurrencyListSuccess, getCurrencyListFailure,
  getOrgListSuccess, getOrgListFail,
  getWalletTypeMasterSuccess, getWalletTypeMasterFailure,
  getWalletTypeSuccess, getWalletTypeFailure,
  getRoleDetailsSuccess, getRoleDetailsFailure,
  getWalletTransactionTypeSuccess, getWalletTransactionTypeFailure,
  getWalletsSuccess, getWalletsFailure,
  getUserDataListSuccess, getUserDataListFailure,
  getProviderListSuccess, getProviderListFailure,
  getReferralServiceSuccess, getReferralServiceFailure,
  getReferralPaytypeSuccess, getReferralPaytypeFailure,
  getReferralChannelTypeSuccess, getReferralChannelTypeFailure,
  getSiteTokenSuccess, getSiteTokenFailure,
  getBaseCurrencyListSuccess, getBaseCurrencyListFailure,
  getMarginWalletListSuccess, getMarginWalletListFailure,
  affiliateUserDataSuccess, affiliateUserDataFailure,
  getArbitrageProviderListSuccess, getArbitrageProviderListFailure,
  getArbitrageCurrencyListSuccess, getArbitrageCurrencyListFailure,
  getProviderWalletListSuccess, getProviderWalletListFailure,
  getProviderAddressListSuccess, getProviderAddressListFailure, getListPairArbitrageSuccess, getListPairArbitrageFailure, getBaseMarketArbitrageSuccess, getBaseMarketArbitrageFailure, getChatUserListSuccess, getChatUserListFailure, getThirdPartyApiResponseSuccess, getThirdPartyApiResponseFailure, getApiPlanConfigListSuccess, getApiPlanConfigListFailure, getAppTypeSuccess, getAppTypeFailure
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
  AFFILIATE_USER_DATA,
  GET_ARBITRAGE_PROVIDER_LIST,
  GET_ARBITRAGE_CURRENCY_LIST,
  GET_PROVIDER_WALLET_LIST,
  GET_PROVIDER_ADDRESS_LIST,
  LIST_PAIR_ARBITRAGE,
  ARBITRGAE_BASE_MARKET,
  GET_CHATUSERLIST,
  GET_ALL_THIRD_PARTY_RESPONSE,
  GET_API_PLAN_CONFIG_LIST,
  GET_APP_TYPE
} from "../actions/ActionTypes";
import { swaggerPostAPI, swaggerGetAPI, queryBuilder } from '../api/helper';
import { Method } from "../controllers/Methods";
import { userAccessToken } from '../selector';

function* getPairList({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    let url = Method.ListPair
    if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
      url += '?IsMargin=' + payload.IsMargin;
    }

    const response = yield call(swaggerPostAPI, url, {}, headers);
    // call success method of action
    yield put(pairListSuccess(response));
  } catch (error) {
    // call failed method of action
    yield put(pairListFailure(error));
  }
}

function* getPairCurrencies() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, Method.ListCurrency, {}, headers);
    // call success method of action
    yield put(getCurrencyListSuccess(response));
  } catch (error) {
    // call failed method of action
    yield put(getCurrencyListFailure(error));
  }
}


//get organization list from API
function* getOrgListAPI() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, Method.ListOrgDetails, {}, headers);
    yield put(getOrgListSuccess(response));
  } catch (error) {
    yield put(getOrgListFail(error));
  }
}

//For Get Wallet Types Master From API
function* getWalletTypeMasterAPI() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, Method.ListAllWalletTypeMaster, {}, headers);
    yield put(getWalletTypeMasterSuccess(response));
  } catch (error) {
    yield put(getWalletTypeMasterFailure(error));
  }
}

function* getWalletTypeAPI({ payload }) {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    let obj = {}
    let url = Method.ListWalletTypeDetails

    if (payload.ServiceProviderId !== undefined && payload.ServiceProviderId !== 0) {
      obj = {
        ...obj,
        ServiceProviderID: payload.ServiceProviderId
      }
      url += queryBuilder(obj)
    }

    const response = yield call(swaggerGetAPI, url, obj, headers);
    yield put(getWalletTypeSuccess(response));
  } catch (error) {
    yield put(getWalletTypeFailure(error));
  }
}

//get roles details 
function* getRoleDetailsAPI() {
  try {
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }
    const response = yield call(swaggerGetAPI, Method.ListRoleDetailss, {}, headers);
    yield put(getRoleDetailsSuccess(response));
  }
  catch (error) {
    yield put(getRoleDetailsFailure(error));
  }
}

//get trasancation type 
function* getWalletTransactionTypeAPI() {
  try {
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }
    const response = yield call(swaggerGetAPI, Method.ListWalletTrnType, {}, headers);
    yield put(getWalletTransactionTypeSuccess(response));
  } catch (error) {
    yield put(getWalletTransactionTypeFailure(error));
  }
}

//Get Wallets
function* getWallets() {
  try {
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }
    const responseFromSocket = yield call(swaggerGetAPI, Method.ListWallet, {}, headers);
    yield put(getWalletsSuccess(responseFromSocket));
  } catch (error) {
    yield put(getWalletsFailure());
  }
}

// Get Users Data
function* getUserDataAPI() {
  try {
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }
    const response = yield call(swaggerGetAPI, Method.GetAllUserData, {}, headers);
    yield put(getUserDataListSuccess(response));
  } catch (error) {
    yield put(getUserDataListFailure(error));
  }
}

//For Get Provider List From Api
function* getProviderListData() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, Method.GetProviderList, {}, headers);
    yield put(getProviderListSuccess(response));
  } catch (error) {
    yield put(getProviderListFailure(error));
  }
}

//For Get Referral Service From Api
function* getReferralServiceData(action) {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, Method.DropDownReferralService + queryBuilder(action.payload), {}, headers);
    yield put(getReferralServiceSuccess(response));
  } catch (error) {
    yield put(getReferralServiceFailure(error));
  }
}

//For Get Referral Service From Api
function* getReferralPaytypeData() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, Method.DropDownReferralPayType, {}, headers);
    yield put(getReferralPaytypeSuccess(response));
  } catch (error) {
    yield put(getReferralPaytypeFailure(error));
  }
}

//For Get Referral Channel Type Data From Api
function* getReferralChannelTypeData() {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, Method.DropDownReferralChannelType, {}, headers);
    yield put(getReferralChannelTypeSuccess(response));
  } catch (error) {
    yield put(getReferralChannelTypeFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* getSiteTokenDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, Method.GetAllSiteToken, {}, headers);
    yield put(getSiteTokenSuccess(response));
  } catch (error) {
    yield put(getSiteTokenFailure(error));
  }
}

// Function to Get Base Currency List Data From Api
function* getBaseCurrencyListApi({ payload }) {
  try {
    const request = payload;
    var swaggerUrl = Method.GetBaseMarket;
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    let req = {};
    if (request) {
      if (request.ActiveOnly !== undefined) {
        req = {
          ...req,
          ActiveOnly: request.ActiveOnly
        }
      }
    }
    const response = yield call(swaggerGetAPI, swaggerUrl + queryBuilder(req), {}, headers);
    yield put(getBaseCurrencyListSuccess(response));
  } catch (error) {
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
    let req = {};
    if (request) {
      if (request.Status !== undefined) {
        req = {
          ...req,
          Status: request.Status
        }
      }
      if (request.WalletTypeId !== undefined) {
        req = {
          ...req,
          WalletTypeId: request.WalletTypeId
        }
      }
      if (request.WalletUsageType !== undefined) {
        req = {
          ...req,
          WalletUsageType: request.WalletUsageType
        }
      }
    }
    const response = yield call(swaggerGetAPI, swaggerUrl + queryBuilder(req), request, headers);
    yield put(getMarginWalletListSuccess(response));
  } catch (error) {
    yield put(getMarginWalletListFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* getAllAffiliateUserDataRequest() {
  try {
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerGetAPI, Method.GetAllAffiliateUser, {}, headers);
    yield put(affiliateUserDataSuccess(response));
  } catch (error) {
    yield put(affiliateUserDataFailure());
  }
}

function* getArbitrageProviderList({ payload }) {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    const response = yield call(swaggerPostAPI, Method.GetProviderListArbitrage, {}, headers);
    // call success method of action
    yield put(getArbitrageProviderListSuccess(response));
  } catch (error) {
    // call failed method of action
    yield put(getArbitrageProviderListFailure());
  }
}

function* getArbitrageCurrencyList({ payload }) {
  try {
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }
    let obj = {}
    let url = Method.ArbitrageListCurrency

    if (payload.Status !== undefined && payload.Status !== 0) {
      obj = {
        ...obj,
        Status: payload.Status
      }
      url += queryBuilder(obj)
    }

    const response = yield call(swaggerGetAPI, url, obj, headers);
    // call success method of action
    yield put(getArbitrageCurrencyListSuccess(response));
  } catch (error) {
    // call failed method of action
    yield put(getArbitrageCurrencyListFailure());
  }
}

// Generator for Get Provider Wallet
function* getProviderWalletList({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // create request
    let obj = {}

    if (payload.PageNo !== undefined && payload.PageNo !== '') {
      obj = { ...obj, PageNo: payload.PageNo }
    }
    if (payload.PageSize !== undefined && payload.PageSize !== '') {
      obj = { ...obj, PageSize: payload.PageSize }
    }
    if (payload.Status !== undefined && payload.Status !== '') {
      obj = { ...obj, Status: payload.Status }
    }
    if (payload.SerProId !== undefined && payload.SerProId !== '') {
      obj = { ...obj, SerProId: payload.SerProId }
    }
    if (payload.SMSCode !== undefined && payload.SMSCode !== '') {
      obj = { ...obj, SMSCode: payload.SMSCode }
    }

    // Create New Request
    let newRequest = Method.ListProviderWallet + queryBuilder(obj)

    // To call Get Provider Wallet Data Api
    const data = yield call(swaggerGetAPI, newRequest, {}, headers);

    // To set Get Provider Wallet success response to reducer
    yield put(getProviderWalletListSuccess(data));
  } catch (error) {
    // To set Get Provider Wallet failure response to reducer
    yield put(getProviderWalletListFailure());
  }
}


// Generator for Get Provider Address
function* getProviderAddressList({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // create request
    let obj = {}

    if (payload.PageNo !== undefined && payload.PageNo !== '') {
      obj = {
        ...obj,
        PageNo: payload.PageNo
      }
    }
    if (payload.PageSize !== undefined && payload.PageSize !== '') {
      obj = {
        ...obj,
        PageSize: payload.PageSize
      }
    }
    if (payload.ServiceProviderId !== undefined && payload.ServiceProviderId !== '') {
      obj = {
        ...obj,
        ServiceProviderId: payload.ServiceProviderId
      }
    }
    if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
      obj = {
        ...obj,
        WalletTypeId: payload.WalletTypeId
      }
    }
    if (payload.Address !== undefined && payload.Address !== '') {
      obj = {
        ...obj,
        Address: payload.Address
      }
    }

    // Create New Request
    let newRequest = Method.ListArbitrageAddress + queryBuilder(obj)

    // To call Get Provider Address Data Api
    const data = yield call(swaggerGetAPI, newRequest, {}, headers);

    // To set Get Provider Address success response to reducer
    yield put(getProviderAddressListSuccess(data));
  } catch (error) {
    // To set Get Provider Address failure response to reducer
    yield put(getProviderAddressListFailure());
  }
}

// Generator for Get Provider Address
function* getListPairArbitrageApi({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Get ListPairArbitrage Data Api
    const data = yield call(swaggerPostAPI, Method.ListPairArbitrage + queryBuilder(payload), {}, headers);

    // To set Get ListPairArbitrage success response to reducer
    yield put(getListPairArbitrageSuccess(data));
  } catch (error) {
    // To set Get ListPairArbitrage failure response to reducer
    yield put(getListPairArbitrageFailure());
  }
}

// Generator for getBaseMarketArbitrageApi
function* getBaseMarketArbitrageApi({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Get ListPairArbitrage Data Api
    const data = yield call(swaggerGetAPI, Method.GetBaseMarketArbitrage + queryBuilder(payload), {}, headers);

    // To set Get ListPairArbitrage success response to reducer
    yield put(getBaseMarketArbitrageSuccess(data));
  } catch (error) {
    // To set Get ListPairArbitrage failure response to reducer
    yield put(getBaseMarketArbitrageFailure());
  }
}

// Get chatuserlist data From Server
function* getChatUserlistApi() {
  try {
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };
    const response = yield call(swaggerGetAPI, Method.GetUserList, {}, headers);
    yield put(getChatUserListSuccess(response));
  } catch (error) {
    yield put(getChatUserListFailure(error));
  }
}

// for all third party response
function* ThirdPartyResponse() {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Get all third party response Data Api
    const data = yield call(swaggerGetAPI, Method.GetAllThirdPartyAPIRespose, {}, headers)

    // To set Get all third party response success response to reducer
    yield put(getThirdPartyApiResponseSuccess(data))
  } catch (error) {
    // To set Get all third party response failure response to reducer
    yield put(getThirdPartyApiResponseFailure())
  }
}

// Generator for Api Plan Config List
function* getApiPlanConfigList({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call Api Plan Config List Data Api
    const data = yield call(swaggerGetAPI, Method.GetAPIPlan, {}, headers)

    // To set Api Plan Config List success response to reducer
    yield put(getApiPlanConfigListSuccess(data))
  } catch (error) {
    // To set Api Plan Config List failure response to reducer
    yield put(getApiPlanConfigListFailure())
  }
}

function* getAppTypeApi({ payload }) {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call app type Api
    const response = yield call(swaggerGetAPI, Method.GetAppType, payload, headers);

    // To set app type success response to reducer
    yield put(getAppTypeSuccess(response));
  } catch (error) {

    // To set app type failure response to reducer
    yield put(getAppTypeFailure(error));
  }
}

/**
 * appTypeApi Response...
 */
export function* appTypeApi() {
  // call getAppTypeApi Response Api action type and sagas api function
  yield takeLatest(GET_APP_TYPE, getAppTypeApi);
}

/**
 * ThirdParty Response...
 */
export function* ThirdPartyResponseApi() {
  // call ThirdParty Response Api action type and sagas api function
  yield takeLatest(GET_ALL_THIRD_PARTY_RESPONSE, ThirdPartyResponse);
}

export function* pairList() {
  // call pair list action type and sagas api function
  yield takeLatest(GET_PAIR_LIST, getPairList);
}

/**
 * Currency List...
 */
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

// Affiliate user data
function* getAllAffiliateUserData() {
  yield takeLatest(AFFILIATE_USER_DATA, getAllAffiliateUserDataRequest)
}

// Arbitrage Provider List
function* getArbitrageProviderData() {
  yield takeLatest(GET_ARBITRAGE_PROVIDER_LIST, getArbitrageProviderList)
}

// Arbitrage Currency List
function* getArbitrageCurrencyData() {
  yield takeLatest(GET_ARBITRAGE_CURRENCY_LIST, getArbitrageCurrencyList)
}

function* getProviderWalletData() {
  // To register Get Provider Wallet List method
  yield takeLatest(GET_PROVIDER_WALLET_LIST, getProviderWalletList)
}

function* getProviderAddressData() {
  // To register Get Provider address List method
  yield takeLatest(GET_PROVIDER_ADDRESS_LIST, getProviderAddressList)
}

function* getListPairArbitrageData() {
  // ListPairArbitrage
  yield takeLatest(LIST_PAIR_ARBITRAGE, getListPairArbitrageApi)
}

function* getBaseMarketArbitrageData() {
  // ListPairArbitrage
  yield takeLatest(ARBITRGAE_BASE_MARKET, getBaseMarketArbitrageApi)
}

// Get cht user list
function* getChatUserList() {
  yield takeLatest(GET_CHATUSERLIST, getChatUserlistApi);
}

// Get api plan configuration
function* getApiPlanConfig() {
  yield takeLatest(GET_API_PLAN_CONFIG_LIST, getApiPlanConfigList);
}

/**
 * Pair Listing Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
  yield all([
    fork(pairList),
    fork(pairCurrency),
    fork(getOrgList),
    fork(getWalletTypeMaster),
    fork(getWalletType),
    fork(getRoleDetails),
    fork(getWalletTransactionType),
    fork(getWalletList),
    fork(getUserDataSagas),
    fork(getProviderList),
    fork(getReferralService),
    fork(getReferralPaytype),
    fork(getReferralChannelType),
    fork(getSiteToken),
    fork(getBaseCurrencyList),
    fork(getMarginWalletList),
    fork(getAllAffiliateUserData),
    fork(getArbitrageProviderData),
    fork(getArbitrageCurrencyData),
    fork(getProviderWalletData),
    fork(getProviderAddressData),
    fork(getListPairArbitrageData),
    fork(getBaseMarketArbitrageData),
    fork(getChatUserList),
    fork(ThirdPartyResponseApi),
    fork(getApiPlanConfig),
    fork(appTypeApi),
  ]);
}
