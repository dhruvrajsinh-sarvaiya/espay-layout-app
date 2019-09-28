import React, { Component } from 'react';
import { View, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { ReduxNavigator } from './components/Navigation';
import { saveObjectPreference, saveCache } from './actions/GlobalActions';
import R from './native_theme/R';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
const { width } = Dimensions.get('window').width;

console.disableYellowBox = true;

// global store for preference usage
let globalStore = null;

// To store object in preference
export function setData(object) { globalStore.dispatch(saveObjectPreference(object)); return null; }

// To get single object data
export function getData(key) {
	// if key is dimensions and store is null than return current dimensions data with isPortrait bit
	if (key === 'dimensions' && globalStore == null) {
		return Object.assign({}, Dimensions.get('window'), { isPortrait: Dimensions.get('window').width <= Dimensions.get('window').height });
	}
	return globalStore.getState().preference[key]
}

export const Cache = {
	// To set cache
	setCache: function (object) {
		// logger('Cache Set : ' + JSON.stringify(object));
		globalStore.dispatch(saveCache(object))
	},

	// To get cache
	getCache: function (key) {
		// logger('Cache Get : ' + key + ' : ' + JSON.stringify(globalStore.getState().cacheReducer[key]));
		return globalStore.getState().cacheReducer[key]
	}
}

export default class App extends Component {

	//Default store will be null
	state = {
		storeCreated: false,
		store: null,
		persistor: null,
		isTablet: DeviceInfo.isTablet(), // for check device is tablet or not
		isPortrait: R.screen().isPortrait //for check tablet orientation
	}

	componentWillMount() {

		const isTablet = DeviceInfo.isTablet();

		if (!isTablet) {
			// this locks the view to Portrait Mode
			Orientation.lockToPortrait();
		}
	}

	componentDidMount() {

		// fetch store and persistor from configureStore
		configureStore().then(({ persistor, store }) => {

			// copy store to globalStore variable
			globalStore = store;
			this.setState({ persistor, store, storeCreated: true })
		})
	};

	render() {

		//if store is not ready then display process
		if (!this.state.storeCreated) {
			return (
				<View style={{ flex: 1, backgroundColor: R.colors.background }}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size={"large"} color={R.colors.primary} />
					</View>

					<View style={{ justifyContent: "center" }}>
						{this.state.isTablet && !this.state.isPortrait
							?
							<Image resizeMode={"center"} source={R.images.IC_SPLASH_MAP} style={{ width: width, height: R.dimens.GridImage, opacity: 0.40, tintColor: R.colors.textSecondary }} />
							:
							<Image resizeMode={"stretch"} source={R.images.IC_SPLASH_MAP} style={{ width: width, height: R.dimens.GridImage, opacity: 0.40, tintColor: R.colors.textSecondary }} />
						}
					</View>
				</View>
			)
		}

		return (
			<Provider store={this.state.store}>
				<PersistGate persistor={this.state.persistor} loading={null}>
					<ReduxNavigator />
				</PersistGate>
			</Provider>
		);
	}
}