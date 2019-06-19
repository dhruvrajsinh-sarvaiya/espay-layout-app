/**
 * SMS Auth Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { GET_LANGUAGE_LIST, SUBMIT_THEME_CONFIG } from "Actions/types";

import {
  getLanguageListSuccess,
  getLanguageListFailure,
  submitThemeConfigSuccess,
  submitThemeConfigFailure
} from "Actions";

const languages = [
  { languageId: "english", locale: "en", name: "English", icon: "en" },
  { languageId: "russian", locale: "ru", name: "Russian", icon: "ru" },
  { languageId: "french", locale: "fr", name: "French", icon: "fr" },
  { languageId: "german", locale: "de", name: "German", icon: "de" }
];

/**
 * For Get Language List
 */
function* getLanguageListMethod() {
  try {
    if (languages !== "") {
      yield put(getLanguageListSuccess(languages));
    } else {
      yield put(getLanguageListFailure(error));
    }
  } catch (error) {
    yield put(getLanguageListFailure(error));
  }
}

/**
 * For Submit ThemeConfig
 */
function* submitThemeConfigMethod({ payload }) {
  const languageListData = payload;

  try {
    if (languageListData !== "") {
      yield put(submitThemeConfigSuccess(languageListData));
    } else {
      yield put(submitThemeConfigFailure(error));
    }
  } catch (error) {
    yield put(submitThemeConfigFailure(error));
  }
}

/**
 * Call Send SMS Auth
 */
export function* getLanguageList() {
  yield takeEvery(GET_LANGUAGE_LIST, getLanguageListMethod);
}

/**
 * Call Submit Send SMS Auth
 */
export function* submitThemeConfig() {
  yield takeEvery(SUBMIT_THEME_CONFIG, submitThemeConfigMethod);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([fork(getLanguageList), fork(submitThemeConfig)]);
}
