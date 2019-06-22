import React, { Component } from 'react';
import { View, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore'
import { ReduxNavigator } from './components/Navigation';
import { saveObjectPreference, saveCache } from './actions/GlobalActions';
import R from './native_theme/R';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
const { width } = Dimensions.get('window').width;
console.disableYellowBox = false;

// global store for preference usage
let globalStore = null;

// To store object in preference
export function setData(object) { globalStore.dispatch(saveObjectPreference(object)) };

// To get single object data
export function getData(key) {
	// if key is dimensions and store is null than return current dimensions data with isPortrait bit
	if (key === 'dimensions' && globalStore == null) {
		return Object.assign({}, Dimensions.get('window'), { isPortrait: Dimensions.get('window').width <= Dimensions.get('window').height });
	}
	return globalStore.getState().preference[key]
};
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
		store: null,
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

	componentDidMount = async () => {

		//When store is ready it will be stored and display application
		const store = await configureStore();
		globalStore = store;
		this.setState({ store });
	};

	render() {

		//if store is not ready then display process
		if (this.state.store === null) {
			return (
				<View style={{ flex: 1, backgroundColor: R.colors.background }}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size={"large"} color={R.colors.accent} />
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
				<ReduxNavigator />
			</Provider>
		);
	}
}
