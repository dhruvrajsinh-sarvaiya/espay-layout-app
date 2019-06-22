import React, { Component } from 'react';
import { View, Alert, AppState, Platform } from 'react-native';
import Permissions from 'react-native-permissions';
import PackageChecker from '../helpers/PackageChecker';
import R from '../R';
import { logger } from '../../controllers/CommonUtils';

export default class RuntimePermission extends Component {
    state = {
        types: Platform.OS === 'android' ? ['camera', 'storage'] : ['camera'],
        status: {},
    }

    componentDidMount() {
        let canOpenSettings = Permissions.canOpenSettings()

        this.setState({ canOpenSettings })

        this._handleAppStateChange(AppState.currentState);

        AppState.addEventListener('change', this._handleAppStateChange)
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    //update permissions when app comes back from settings
    _handleAppStateChange = async appState => {

        if (appState == 'active') {
            try {
                let status = await CheckPermissions(this.state.types);

                if (status) {
                    let grantedList = [];
                    let deniedList = [];
                    let restrictedList = [];
                    let undeterminedList = [];

                    this.state.types.map(p => {
                        let res = status[p];

                        if (res == 'authorized') {
                            if (grantedList.every(item => item.name != p)) {
                                grantedList.push(p);
                            }
                        }
                        if (res == 'denied') {
                            if (deniedList.every(item => item.name != p)) {
                                deniedList.push(p);
                            }
                        }
                        if (res == 'restricted') {
                            if (restrictedList.every(item => item.name != p)) {
                                restrictedList.push(p);
                            }
                        }
                        if (res == 'undetermined') {
                            if (undeterminedList.every(item => item.name != p)) {
                                undeterminedList.push(p);
                            }
                        }
                    })

                    //If granted list is empty & undetermined list is empty and denied list empty but restricted list is not empty then show dialog
                    if (grantedList.length == 0 && undeterminedList.length == 0 && deniedList.length == 0 && restrictedList.length > 0) {
                        log('Show Dialog');
                        this.settingsDialog();
                    }

                    //If undetermine list is not empty then request these permision to authroize
                    else if (undeterminedList.length != 0) {
                        this.requestPermissions(undeterminedList);
                    }

                    //If denied list is not empty then request these permision to authroize
                    else if (deniedList.length != 0) {
                        this.requestPermissions(deniedList);
                    }

                    //If granted list is empty then ask for all permissions
                    else if (grantedList.length == 0) {
                        this.requestPermissions(this.state.types);
                    }

                    //If restricted list is not empty then show dialog
                    else if (restrictedList.length > 0) {
                        log('Show Dialog');
                        this.settingsDialog();
                    }

                    //If all above validation are satified it means all permissions are granted.
                    else {

                        //if isAllGranted Prop is passed then send true in params
                        if (this.props.isAllGranted) {
                            this.props.isAllGranted(true);
                        }
                        log('All Granted');
                    }
                }
            } catch (error) {
            }

        }
    }

    _openSettings = () => {
        if (Platform.OS == 'android') {

            PackageChecker.openSettings();

        } else if (Platform.OS == 'ios') {
            Permissions.openSettings().then(() => alert('back to app!!'))
        }
    }

    _updatePermissions = async () => {

        let status = await CheckPermissions(this.state.types);

        if (status) {

            let grantedList = [];
            let deniedList = [];
            let restrictedList = [];
            let undeterminedList = [];

            this.state.types.map(p => {
                let res = status[p];

                if (res == 'authorized') {
                    if (grantedList.every(item => item.name != p)) {
                        grantedList.push(p);
                    }
                }
                if (res == 'denied') {
                    if (deniedList.every(item => item.name != p)) {
                        deniedList.push(p);
                    }
                }
                if (res == 'restricted') {
                    if (restrictedList.every(item => item.name != p)) {
                        restrictedList.push(p);
                    }
                }
                if (res == 'undetermined') {
                    if (undeterminedList.every(item => item.name != p)) {
                        undeterminedList.push(p);
                    }
                }
            })

            log('Granted : ' + grantedList.length + ' Denied : ' + deniedList.length + ' Restricted : ' + restrictedList.length + ' Undetermined: ' + undeterminedList.length);

            if (grantedList.length == 0) {
                this.requestPermissions(this.state.types);
            } else if (undeterminedList.length != 0) {
                this.requestPermissions(undeterminedList);
            } else if (deniedList.length != 0) {
                this.requestPermissions(deniedList);
            } else if (restrictedList.length > 0) {
                log('Show Dialog');
                //this.openDialog();
            } else {
                log('All Granted');
            }
        }
    }

    requestPermissions = (types) => {
        types.map(async (p) => {
            let res = await RequestPermissions(p)
            /* if (res) {

                this.setState({
                    status: { ...this.state.status, [p]: res },
                })
            } */
        })
    }

    settingsDialog() {
        var buttons = [{ text: R.strings.cancel, style: 'cancel', onPress: () => this.settingsDialog() }]
        if (this.state.canOpenSettings)
            buttons.push({
                text: 'Open Settings',
                onPress: this._openSettings,
            })
            
        Alert.alert(
            'Whoops!',
            'There was a problem getting your permission. Please enable it from settings.',
            buttons,
        )
    }

    render() {
        return (<View />);
    }
}

export function CheckPermissions(permissions) {
    log('Check for Status of : ' + JSON.stringify(permissions));

    return new Promise(function (resolve, reject) {
        Permissions.checkMultiple(permissions)
            .then(status => {
                log('Permission Status : ' + JSON.stringify(status));
                resolve(status);
            })
    })
}

export function RequestPermissions(type) {

    log('Request Permisssion : ' + type)
    return new Promise(function (resolve, reject) {

        Permissions.request(type)
            .then(res => {
                log('Result of Permission : ' + res);
                resolve(res);
            })
            .catch(e => logger(e))
    })
}

export function log(msg) { //logger(msg) 
}
