import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSensitiveStorage from "redux-persist-sensitive-storage";
import rootFrontReducer from '../reducers';
import rootSaga from '../sagas';
import { navigationMiddleware } from '../components/Navigation';
import createSagaMiddleware from 'redux-saga';

// Secure storage configuration for android 
const storage = createSensitiveStorage({
    keychainService: "newStackKeyChain",
    sharedPreferencesName: "newStackSharedPrefs"
});

//Configuration for store persist
//here we only need all the preference to store in storage so using whitelist
const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['preference']
}

// Gatthering all reducer in to rootReducer const
const rootReducer = combineReducers(rootFrontReducer)

// Merging rootReducer with persist reducer
const reducer = persistReducer(persistConfig, rootReducer);

// Creating Saga Middleware to Call Backend APIs
const sagaMiddleware = createSagaMiddleware();

// Creating store which contains reducer, navigation & saga
const store = createStore(reducer, applyMiddleware(navigationMiddleware, sagaMiddleware));

// Starting saga to listen dispatch actions
sagaMiddleware.run(rootSaga);

// function to return store when its ready
export default function configureStore() {

    //to return persisted store after its fetched from storage
    return new Promise((resolve) => {

        try {
            persistStore(store, null, () => {
                resolve(store);
            });
        } catch (error) {
            resolve(store);
        }
    });
} 