import React, { PureComponent } from "react";
import { BackHandler, Dimensions, Linking } from "react-native";
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions, StackActions } from 'react-navigation';
import { createReactNavigationReduxMiddleware, createReduxContainer, createNavigationReducer } from 'react-navigation-redux-helpers';
import Screens from './';
import { addListener, showAlert, sendEvent } from "../controllers/CommonUtils";
import { Events, ServiceUtilConstant, AllOrientations } from "../controllers/Constants";
import { AppConfig } from "../controllers/AppConfig";
import RNExitApp from 'react-native-exit-app';
import { logoutUser } from "../actions/GlobalActions";
import R from "../native_theme/R";
import { getData, setData } from "../App";
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';

const RootNavigator = createStackNavigator(Screens, {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        opacity: 1
    },
    transitionConfig: () => ({
        containerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        screenInterpolator: () => null
        /* transitionSpec: {
            duration: 0,  // Set the animation duration time as 0 !!
            timing: Animated.timing,
            easing: Easing.step0,
        }, */
    })
});

const navReducer = createNavigationReducer(RootNavigator);

const navigationMiddleware = createReactNavigationReduxMiddleware(
    state => state.navigationReducer
);

const AppNavigator = createReduxContainer(RootNavigator, 'root');

var routes, backPressRoutes = [], resumeRoutes = [], globalDispatch;

class ReduxNavigation extends PureComponent {

    componentDidMount = () => {
        const { dispatch } = this.props;

        this.dialogShowCount = 0;

        //reset all the previous screen if exist and set initial route to SplashScreen
        dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'MainStack',
                    action: NavigationActions.navigate({
                        routeName: AppConfig.initialRoute
                    })
                })
            ],
            key: null
        }));

        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

        //To listen for logout
        this.listenerSessionLogout = addListener(Events.SessionLogout, (isSessionLogout = true) => {

            if (isSessionLogout) {
                dispatch(logoutUser());
            }

            //reset all the previous screen if exist and set initial route to Login Screen
            dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'MainStack',
                        action: NavigationActions.navigate({
                            routeName: 'LoginNormalScreen'
                        })

                    })
                ],
                key: null
            }));
        });

        // To listen dimensions change events
        Dimensions.addEventListener('change', () => {
            // get old dimensions
            let oldDimensions = getData(ServiceUtilConstant.KEY_DIMENSIONS);

            // get new dimension from Dimensions of react-native
            let newDimensions = Dimensions.get('window');

            // if old and new width and height are different than set new dimensions to preference
            if (oldDimensions.width != newDimensions.width && oldDimensions.height != newDimensions.height) {

                let newData = {
                    width: newDimensions.width,
                    height: newDimensions.height,
                    isPortrait: newDimensions.width <= newDimensions.height
                }

                sendEvent(Events.Dimensions, newData);

                // store new dimensions in preference
                setData({
                    [ServiceUtilConstant.KEY_DIMENSIONS]: newData
                });
            }
        })

        // to get initial URL when app is launch
        Linking.getInitialURL().then(url => this._handleOpenURL({ url }));

        // to listen for any upcoming url from any other third party application
        Linking.addEventListener('url', this._handleOpenURL);
    }

    _handleOpenURL({ url }) {
        try {

            // If URL is not undefined than proceed
            if (url) {

                // remove scheme from url
                const route = url.replace(/.*?:\/\//g, "");

                // get all query parameters after quetion mark
                let queryParameters = route.split('?')[1];

                // if query parameters are not undefined than proceed for further action
                if (queryParameters) {

                    // to store true/false based on  query parameters have '&' 
                    let hasMoreThanOneArgument = queryParameters.includes('&')

                    // default arguments are empty
                    let argumentList = {};

                    // if there is single argument in queryParameters than append &
                    if (!hasMoreThanOneArgument) {
                        queryParameters += '&';
                    }

                    // iterrate through each queryParameter separated by &
                    for (let value of queryParameters.split('&')) {
                        try {
                            // To store key by separating left hand value of equalTo
                            let keyPart = value.split('=')[0];

                            // To store value by separating right hand value of equalTo
                            let valuePart = value.split('=')[1];

                            // Add Key Value Pair in argumentList
                            argumentList[keyPart] = valuePart;
                        } catch (error) { }
                    }

                    // Redirect to Device Authentication Screen with authorizeCode
                    navigate('DeviceAuthorization', { authorizeCode: argumentList['authorizecode'] });
                }
            }
        } catch (error) {
            // logger(error.message);
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        Dimensions.removeEventListener("change", () => { });
        if (this.listenerSessionLogout) {
            this.listenerSessionLogout.remove();
        }

        // to remove linking listener
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    /**
     * Set Curent Route Name
     * @param {String} routeName Current Working RouteName
     */
    setRoute(routeName) {
        this.routeName = routeName;
    }

    /**
     *  Get Current Route Name
     */
    getRoute() {
        return this.routeName === undefined ? '' : this.routeName;
    }

    /**
     * To Set Lock Status by true/false value
     * @param {Boolean} status Set Lock Status with passing boolean
     */
    setLockStatus(status) {
        this.lock = status;
    }

    /**
     * To get Locked Status
     */
    isLocked() {
        return this.lock === undefined ? false : this.lock;
    }

    componentDidUpdate(prevProps, _prevState) {

        try {
            let { navigation } = this.props;

            let rootRoute = navigation.routes[navigation.index];

            // get current route from navigation
            let currentRoute = rootRoute.routes[rootRoute.index];

            // if device is tablet than proceed for orientation changes
            if (DeviceInfo.isTablet()) {

                // To get current route and match with live route name, if both are different than set new route
                if (this.getRoute() === '' || this.getRoute() !== currentRoute.routeName) {

                    // Setting new route
                    this.setRoute(currentRoute.routeName);

                    // if current route is exists in All Orientations screen array than unlock its orientation
                    if (AllOrientations.includes(this.getRoute())) {

                        // if status is locked than unlock it
                        if (this.isLocked()) {
                            this.setLockStatus(false)
                        }

                        // Unlock orientation
                        Orientation.unlockAllOrientations();
                    } else {

                        // if lock status is not true than set it true otherwise don't change anything
                        if (!this.isLocked()) {

                            // set lock status to locked
                            this.setLockStatus(true)

                            // lock status to portrait mode
                            Orientation.lockToPortrait();

                            setTimeout(() => {
                                let { width, height } = Dimensions.get('window');

                                let newData = {
                                    width: width < height ? width : height,
                                    height: height > width ? height : width,
                                    isPortrait: true
                                }

                                sendEvent(Events.Dimensions, newData);

                                // store new dimensions in preference
                                setData({
                                    [ServiceUtilConstant.KEY_DIMENSIONS]: newData
                                });
                            }, 0)
                        }
                    }
                }
            } else {
                // if lock status is not true than set it true otherwise don't change anything
                if (!this.isLocked()) {

                    // set lock status to locked
                    this.setLockStatus(true)

                    // lock status to portrait mode
                    Orientation.lockToPortrait();
                }
            }

            if (resumeRoutes.length > 0) {

                let rootPrevRoute = prevProps.navigation.routes[prevProps.navigation.index]

                // it will be undefined when modal dialog is going to open
                if (rootRoute.index !== undefined) {

                    // it will be undefined when modal dialog is going to close
                    if (rootPrevRoute.index !== undefined) {
                        // get previous route from previous navigation
                        let oldRoute = rootPrevRoute.routes[rootPrevRoute.index];

                        // if current route and old route are different
                        if (currentRoute.routeName !== oldRoute.routeName) {

                            // find index of current route in resumeRoutes list
                            let routeIndex = resumeRoutes.findIndex(el => el.currentRoute === currentRoute.routeName);

                            // if current route is found than continue with rest code block
                            if (routeIndex > -1) {

                                // as each route will have single widget (name: default) as default so looping thorugh its widgets list
                                resumeRoutes[routeIndex].widgets.map(widgetName => {

                                    // Note first time params is undefined so params null checking condition is required
                                    // if params is not null or undefined and componentDidResume( as widgetName here) method is not undefined
                                    if (currentRoute.params && currentRoute.params[widgetName] !== undefined) {

                                        // Calling particular widget method of componentDidResume
                                        currentRoute.params[widgetName]();
                                    }
                                })
                            }
                        }
                    }
                }
            }
        } catch (error) {

        }
    }

    onBackPress = async () => {

        const { navigation, dispatch } = this.props;

        let rootRoute = navigation.routes[navigation.index];

        // it will be undefined when modal dialog is going to open
        if (rootRoute.index !== undefined) {

            let currentRoute = rootRoute.routes[rootRoute.index];

            // Routes name which can be handling for Exit App
            let backPressExitRoutes = [
                'LoginNormalScreen', AppConfig.initialHomeRoute
            ]

            let withoutConfirmExitRoutes = ['SplashScreen', 'AppIntroScreen', 'LanguageFreshScreen']

            if (withoutConfirmExitRoutes.includes(currentRoute.routeName)) {
                // exit without confirmation
                RNExitApp.exitApp();

            } else if (backPressExitRoutes.includes(currentRoute.routeName)) {
                //Exit app if screen is LoginScreen or Main Screen
                if (this.dialogShowCount == 0) {
                    this.dialogShowCount++;

                    // Works on both iOS and Android
                    showAlert(R.strings.Exit + '!', R.strings.Exit_Message, 4, async () => {
                        this.dialogShowCount = 0;
                        RNExitApp.exitApp();
                    }, R.strings.cancel, async () => { this.dialogShowCount = 0; });
                }

                return true;
            } else if (backPressRoutes.includes(currentRoute.routeName)) {

                if (currentRoute.params.onBackPress !== undefined) {
                    //To use inbuilt onBackPress event instead of System's back press.
                    currentRoute.params.onBackPress();
                }
                return true;
            }

            dispatch(NavigationActions.back());
            return true;
        } else {
            return false;
        }
    };

    render() {

        const { navigation, dispatch, } = this.props
        routes = navigation.routes;
        if (globalDispatch === undefined || globalDispatch === null) {
            globalDispatch = dispatch;
        }

        return <AppNavigator
            state={navigation}
            dispatch={dispatch} />;
    }
}

const mapStateToProps = state => ({
    navigation: state.navigationReducer,
});

const ReduxNavigator = connect(mapStateToProps)(ReduxNavigation);

/**
 * Pass your current screen Props
 * @param props 
 */
function isCurrentScreen(props) {
    let currentRoute = props.navigation.state.routeName
    let route = routes[routes.length - 1];
    let prevRoute = null;

    while (route.index !== undefined) {
        route = route.routes[route.index]
    }

    // if current route is Modal than get previous route
    if (route.routeName === 'Modal') {

        // get prevRoute by last second record from array
        prevRoute = routes[routes.length - 2];
        while (prevRoute.index !== undefined) {
            prevRoute = prevRoute.routes[prevRoute.index];
        }
    }

    // if currentRoute and route is same then return true, otherwise
    // check if route is Modal and current route & prev route are same than return true, otherwise
    // return false
    return route.routeName == currentRoute || (route.routeName === 'Modal' && prevRoute !== null && prevRoute !== 'undefined' && currentRoute === prevRoute.routeName);
}

/**
 * Pass your current screen Props to add current screen to handle back Press event by hardware back press
 */
function addRouteToBackPress(props, onBackPress) {

    // to get current route name from props.
    let currentRoute = props.navigation.state.routeName

    // if route name is not exists than add to array
    if (!backPressRoutes.includes(currentRoute)) {
        if (onBackPress !== undefined) {
            props.navigation.setParams({ onBackPress: onBackPress })
        }

        backPressRoutes.push(currentRoute);
    }
}

/**
 * Pass your current screen Props to add current screen to handle resume screen event
 */
function addComponentDidResume(data = { props: null, widgetName: 'default', componentDidResume: null }) {

    if (data.props) {
        // to get current route name from props.
        let currentRoute = data.props.navigation.state.routeName

        // index of current route
        let routeIndex = resumeRoutes.findIndex(el => el.currentRoute === currentRoute);

        // if current route is already exists than update its widget items.
        if (routeIndex > -1) {

            // index of current widget
            let widgetIndex = resumeRoutes[routeIndex].widgets.findIndex(wid => wid === data.widgetName);

            // if index of current widget is not found than update item in list's widgets
            widgetIndex === -1 && resumeRoutes[routeIndex].widgets.push(data.widgetName);

            // again fetch current widget's index in list as its updated now
            widgetIndex = resumeRoutes[routeIndex].widgets.findIndex(wid => wid === data.widgetName);

            // if current widget index is found in current route and componentDidResume is not undefined than set in props 
            if (widgetIndex > -1 && data.componentDidResume !== undefined) {

                // name of current route in current widget.
                let methodName = resumeRoutes[routeIndex].widgets[widgetIndex];
                data.props.navigation.setParams({ [methodName]: data.componentDidResume })
            }

        } else {

            // if current route is not added yet in resume screens and componentDidResume is not undefined than set in props 
            if (data.componentDidResume !== undefined) {
                data.props.navigation.setParams({ [data.widgetName]: data.componentDidResume })
            }

            // add current route and its widgetName
            resumeRoutes.push({ currentRoute, widgets: [data.widgetName] });
        }
    }
}

function navigate(routeName, params) {
    globalDispatch(NavigationActions.navigate({ routeName, params }))
}

function navigateReset(routeName) {
    globalDispatch(StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({
                routeName: 'MainStack',
                action: NavigationActions.navigate({
                    routeName: routeName
                })

            })
        ],
        key: null
    }))
}

export { RootNavigator, ReduxNavigator, navigationMiddleware, isCurrentScreen, addRouteToBackPress, addComponentDidResume, navReducer, navigate, navigateReset };