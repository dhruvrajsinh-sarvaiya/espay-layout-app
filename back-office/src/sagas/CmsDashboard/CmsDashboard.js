/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 27-11-2018
    UpdatedDate : 27-11-2018
    Description : For CMS Dashboard Data through api action saga method 
    Added seprate APIs by dhara gajera 17/1/2019
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    //Added by dhara gajera Added by dhara gajera 17/1/2019
    GET_DASHBOARD_PAGE_COUNT,
    GET_DASHBOARD_FAQ_COUNT,
    GET_DASHBOARD_NEWS_COUNT,
    GET_DASHBOARD_CONTACTUS_COUNT,
    GET_DASHBOARD_SURVEYS_COUNT,
    GET_DASHBOARD_REGIONS_COUNT,
    GET_DASHBOARD_HELPMENUAL_COUNT,
    GET_DASHBOARD_COINLIST_COUNT,
    //Added By Sanjay 
    GET_DASHBOARD_HTMLBLOCKS_COUNT,
    GET_DASHBOARD_IMAGESLIDERS_COUNT
} from 'Actions/types';

//import function from action
import {
    //Added by dhara gajera Added by dhara gajera 17/1/2019
    getCmsDashboardPagesCountSuccess,
    getCmsDashboardPagesCountFailure,
    getCmsDashboardFaqCountSuccess,
    getCmsDashboardFaqCountFailure,
    getCmsDashboardNewsCountSuccess,
    getCmsDashboardNewsCountFailure,
    getCmsDashboardContactusCountSuccess,
    getCmsDashboardContactusCountFailure,
    getCmsDashboardSurveysCountSuccess,
    getCmsDashboardSurveysCountFailure,
    getCmsDashboardRegionsCountSuccess,
    getCmsDashboardRegionsCountFailure,
    getCmsDashboardHelpMenualCountSuccess,
    getCmsDashboardHelpMenualCountFailure,
    getCmsDashboardCoinListCountSuccess,
    getCmsDashboardCoinListCountFailure,
    //Added By Sanjay 
    getCmsDashboardHTMLBlocksCountSuccess,
    getCmsDashboardHTMLBlocksCountFailure,
    getCmsDashboardImageSlidersCountSuccess,
    getCmsDashboardImageSlidersCountFailure

} from 'Actions/CmsDashboard';

//Function check API call for CMS Dashboard pages and policymenegement count..Added by dhara gajera 17/1/2019
const getCmsDashboardPagesCountRequest = async () =>
    await api.get('/api/private/v1/pages/pagesCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard faq count..Added by dhara gajera 17/1/2019
const getCmsDashboardFaqCountRequest = async () =>
    await api.get('/api/private/v1/faqquestion/faqCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard news count..Added by dhara gajera 17/1/2019
const getCmsDashboardNewsCountRequest = async () =>
    await api.get('/api/private/v1/news/newsCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard contactus count..Added by dhara gajera 17/1/2019
const getCmsDashboardContactusCountRequest = async () =>
    await api.get('/api/private/v1/contactus/contactUsCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard surveys count..Added by dhara gajera 17/1/2019
const getCmsDashboardSurveysCountRequest = async () =>
    await api.get('/api/private/v1/surveys/surveysCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard regions count..Added by dhara gajera 17/1/2019
const getCmsDashboardReqionsCountRequest = async () =>
    await api.get('/api/private/v1/regions/regionsCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard HELP MENUAL count..Added by dhara gajera 17/1/2019
const getCmsDashboardHelpMenualCountRequest = async () =>
    await api.get('/api/private/v1/helpmanual/helpmanualCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard coin list count..Added by dhara gajera 17/1/2019
const getCmsDashboardCoinListCountRequest = async () =>
    await api.get('/api/private/v1/CoinListRequest/CoinListCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard htmlBlocks count..Added by Sanjay Rathod 27-05-2019
const getCmsDashboardHTMLBlocksCountRequest = async () =>
    await api.get('/api/private/v1/htmlblocks/htmlblocksCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for CMS Dashboard imageSliders count..Added by Sanjay Rathod 29-05-2019
const getCmsDashboardImageSlidersCountRequest = async () =>
    await api.get('/api/private/v1/imageSliders/imageSlidersCount')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get CMS Dashboard pages and policymenegement count API Added by dhara gajera 17/1/2019
function* getCmsDashboardPagesCountAPI() {
    try {
        const response = yield call(getCmsDashboardPagesCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardPagesCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardPagesCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardPagesCountFailure(error));
    }
}
//Function for Get CMS Dashboard faq count API Added by dhara gajera 17/1/2019
function* getCmsDashboardFaqCountAPI() {
    try {
        const response = yield call(getCmsDashboardFaqCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardFaqCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardFaqCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardFaqCountFailure(error));
    }
}
//Function for Get CMS Dashboard news count API Added by dhara gajera 17/1/2019
function* getCmsDashboardNewsCountAPI() {
    try {
        const response = yield call(getCmsDashboardNewsCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardNewsCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardNewsCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardNewsCountFailure(error));
    }
}
//Function for Get CMS Dashboard Contactus count API Added by dhara gajera 17/1/2019
function* getCmsDashboardContactusCountAPI() {
    try {
        const response = yield call(getCmsDashboardContactusCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardContactusCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardContactusCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardContactusCountFailure(error));
    }
}
//Function for Get CMS Dashboard Surveys count API Added by dhara gajera 17/1/2019
function* getCmsDashboardSurveysCountAPI() {
    try {
        const response = yield call(getCmsDashboardSurveysCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardSurveysCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardSurveysCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardSurveysCountFailure(error));
    }
}
//Function for Get CMS Dashboard regions count API Added by dhara gajera 17/1/2019
function* getCmsDashboardRegionsCountAPI() {
    try {
        const response = yield call(getCmsDashboardReqionsCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardRegionsCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardRegionsCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardRegionsCountFailure(error));
    }
}
//Function for Get CMS Dashboard regions count API Added by dhara gajera 17/1/2019
function* getCmsDashboardHelpMenualCountAPI() {
    try {
        const response = yield call(getCmsDashboardHelpMenualCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardHelpMenualCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardHelpMenualCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardHelpMenualCountFailure(error));
    }
}
//Function for Get CMS Dashboard regions count API Added by dhara gajera 17/1/2019
function* getCmsDashboardCoinListCountAPI() {
    try {
        const response = yield call(getCmsDashboardCoinListCountRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCmsDashboardCoinListCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardCoinListCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardCoinListCountFailure(error));
    }
}

//Function for Get CMS Dashboard htmlBlocks count API Added by Sanjay Rathod 27-05-2019
function* getCmsDashboardHTMLBlocksCountAPI() {
    try {
        const response = yield call(getCmsDashboardHTMLBlocksCountRequest);
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(getCmsDashboardHTMLBlocksCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardHTMLBlocksCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardHTMLBlocksCountFailure(error));
    }
}

//Function for Get CMS Dashboard htmlBlocks count API Added by Sanjay Rathod 27-05-2019
function* getCmsDashboardImageSlidersCountAPI() {
    try {
        const response = yield call(getCmsDashboardImageSlidersCountRequest);        
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(getCmsDashboardImageSlidersCountSuccess(response.data.data));
        } else {
            yield put(getCmsDashboardImageSlidersCountFailure(response.data));
        }
    } catch (error) {
        yield put(getCmsDashboardImageSlidersCountFailure(error));
    }
}

//Get CMS Dashboard faq count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardPagesCount() {
    yield takeEvery(GET_DASHBOARD_PAGE_COUNT, getCmsDashboardPagesCountAPI);
}
//Get CMS Dashboard faq count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardFaqCount() {
    yield takeEvery(GET_DASHBOARD_FAQ_COUNT, getCmsDashboardFaqCountAPI);
}
//Get CMS Dashboard news count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardNewsCount() {
    yield takeEvery(GET_DASHBOARD_NEWS_COUNT, getCmsDashboardNewsCountAPI);
}
//Get CMS Dashboard contact us count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardContactusCount() {
    yield takeEvery(GET_DASHBOARD_CONTACTUS_COUNT, getCmsDashboardContactusCountAPI);
}
//Get CMS Dashboard suerveys count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardSurveysCount() {
    yield takeEvery(GET_DASHBOARD_SURVEYS_COUNT, getCmsDashboardSurveysCountAPI);
}
//Get CMS Dashboard regions count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardRegionsCount() {
    yield takeEvery(GET_DASHBOARD_REGIONS_COUNT, getCmsDashboardRegionsCountAPI);
}
//Get CMS Dashboard help menual count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardHelpMenualCount() {
    yield takeEvery(GET_DASHBOARD_HELPMENUAL_COUNT, getCmsDashboardHelpMenualCountAPI);
}
//Get CMS Dashboard coin list count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardCoinListCount() {
    yield takeEvery(GET_DASHBOARD_COINLIST_COUNT, getCmsDashboardCoinListCountAPI);
}
//Get CMS Dashboard news count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardHTMLBlocksCount() {
    yield takeEvery(GET_DASHBOARD_HTMLBLOCKS_COUNT, getCmsDashboardHTMLBlocksCountAPI);
}
//Get CMS Dashboard news count ,Added by dhara gajera 17/1/2019
export function* getCmsDashboardImageSlidersCount() {
    yield takeEvery(GET_DASHBOARD_IMAGESLIDERS_COUNT, getCmsDashboardImageSlidersCountAPI);
}
//CMS Dashboard Root Saga
export default function* rootSaga() {
    yield all([
        fork(getCmsDashboardPagesCount),
        fork(getCmsDashboardFaqCount),
        fork(getCmsDashboardNewsCount),
        fork(getCmsDashboardContactusCount),
        fork(getCmsDashboardSurveysCount),
        fork(getCmsDashboardRegionsCount),
        fork(getCmsDashboardHelpMenualCount),
        fork(getCmsDashboardCoinListCount),
        fork(getCmsDashboardHTMLBlocksCount),
        fork(getCmsDashboardImageSlidersCount)
    ]);
}