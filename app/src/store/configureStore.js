import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSensitiveStorage from "redux-persist-sensitive-storage";
import rootFrontReducer from '../reducers';
import rootSaga from '../sagas';
import { navigationMiddleware, navReducer } from '../components/Navigation';
import createSagaMiddleware from 'redux-saga';

// function to return store when its ready
const configureStore = async () => {

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
    const rootReducer = combineReducers({ nav: navReducer, ...rootFrontReducer })

    // Merging rootReducer with persist reducer
    const reducer = persistReducer(persistConfig, rootReducer);

    // Creating Saga Middleware to Call Backend APIs
    const sagaMiddleware = createSagaMiddleware();

    // Creating store which contains reducer, navigation & saga
    const store = createStore(reducer, applyMiddleware(navigationMiddleware, sagaMiddleware));

    // Starting saga to listen dispatch actions
    sagaMiddleware.run(rootSaga);

    // creating persistor using persistStore
    const persistor = persistStore(store);

    return { store, persistor };
}
export default configureStore;