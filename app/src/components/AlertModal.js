import React, { Component } from 'react'
import { Image, View, Dimensions } from 'react-native'
import R from '../native_theme/R';
import { getCardStyle } from '../native_theme/components/CardView';
import Button from '../native_theme/components/Button';
import { isEmpty } from '../validations/CommonValidation';
import TextViewMR from '../native_theme/components/TextViewMR';
import TextViewHML from '../native_theme/components/TextViewHML';
import { addRouteToBackPress } from './Navigation';
import { ServiceUtilConstant, Events } from '../controllers/Constants';
import { setData, getData } from '../App';
import DeviceInfo from 'react-native-device-info';
import { addListener } from '../controllers/CommonUtils';

export const DialogTypes = {
    Success: 0,
    Failure: 1,
    SessionExpire: 2,
    Info: 3,
    Logout: 4,
    NetworkError: 5,
    Delete: 6,
}

export class AlertModal extends Component {

    constructor(props) {
        super(props)

        // to disable back press while dialog is open
        addRouteToBackPress(props, () => { });

        let { params } = props.navigation.state;

        let staticTitles = [DialogTypes.Success, DialogTypes.Failure, DialogTypes.SessionExpire, DialogTypes.NetworkError, DialogTypes.Delete];
        let staticDescriptions = [DialogTypes.SessionExpire, DialogTypes.NetworkError];

        let style = [
            {
                type: DialogTypes.Success,
                title: R.strings.Success + '!',
                description: '',
                color: R.colors.successGreen,
                image: R.images.dialogs.ic_dialog_success
            },
            {
                type: DialogTypes.Failure,
                title: R.strings.failure + '!',
                description: '',
                color: R.colors.failRed,
                image: R.images.dialogs.ic_dialog_failure
            },
            {
                type: DialogTypes.SessionExpire,
                title: R.strings.SessionError,
                description: R.strings.SESSION_EXPIRE,
                color: R.colors.sessionExpiredBg,
                image: R.images.dialogs.ic_dialog_session_expire
            },
            {
                type: DialogTypes.Info,
                title: R.strings.status,
                description: '',
                color: R.colors.accent,
                image: R.images.dialogs.ic_dialog_info
            },
            {
                type: DialogTypes.Logout,
                title: R.strings.Logout,
                description: R.strings.logout_message,
                color: R.colors.accent,
                image: R.images.dialogs.ic_dialog_logout
            },
            {
                type: DialogTypes.NetworkError,
                title: R.strings.NetworkError,
                description: R.strings.SLOW_INTERNET,
                color: R.colors.networkErrorBg,
                image: R.images.dialogs.ic_dialog_network_error
            },
            {
                type: DialogTypes.Delete,
                title: R.strings.Delete + '!',
                description: '',
                color: R.colors.accent,
                image: R.images.dialogs.ic_dialog_delete
            }]

        // default dialog state
        let dialogState = {
            dialogType: DialogTypes.Info,
            title: R.strings.status,
            description: R.strings.description,
            positiveText: R.strings.OK,
            onPositive: () => { },
            onNegative: () => { },
        };

        // if params from parent screen is not undefined than set params
        if (params !== undefined) {

            let dialogType = (params.dialogType !== undefined && params.dialogType <= 6) ? params.dialogType : DialogTypes.Info;

            dialogState = {
                dialogType: dialogType,
                title: staticTitles.includes(dialogType) ? style[dialogType].title : (params.title !== undefined && !isEmpty(params.title)) && params.title,
                description: staticDescriptions.includes(dialogType) ? style[dialogType].description : (params.description !== undefined && !isEmpty(params.description)) && params.description,
                positiveText: (params.positiveText !== undefined && !isEmpty(params.positiveText)) ? params.positiveText : R.strings.OK,
                onPositive: (params.onPressPositiveButton !== undefined) ? params.onPressPositiveButton : () => { },
                negativeText: (params.negativeText !== undefined && !isEmpty(params.negativeText)) ? params.negativeText : null,
                onNegative: (params.onPressNegativeButton !== undefined) ? params.onPressNegativeButton : () => { },
            }
        }

        this.state = {
            dialogType: dialogState.dialogType,
            title: dialogState.title,
            description: dialogState.description,
            positiveText: dialogState.positiveText,
            onPositive: dialogState.onPositive,
            negativeText: dialogState.negativeText,
            onNegative: dialogState.onNegative,
            color: style[dialogState.dialogType].color,
            image: style[dialogState.dialogType].image,
            ...Dimensions.get('window'),
            isPortrait: getData(ServiceUtilConstant.KEY_DIMENSIONS).isPortrait,
        }
    }

    componentDidMount() {
        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {
            this.setState(Object.assign({}, this.state, data))
        });
    }

    componentWillUnmount() {
        if (this.dimensionListener) {
            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                <View style={[{
                    width: this.state.width * ((!this.state.isPortrait && DeviceInfo.isTablet()) ? 55 : 75) / 100,
                    backgroundColor: R.colors.background,
                    borderRadius: R.dimens.roundButtonRedius,
                    padding: R.dimens.margin_left_right,
                    ...getCardStyle(R.dimens.CardViewElivation)
                },
                R.colors.getTheme().includes('ni') ? { borderColor: R.colors.textPrimary, borderWidth: R.dimens.pickerBorderWidth } : {},]}>

                    <Image
                        source={this.state.image}
                        style={{
                            width: R.dimens.LoginImageWidthHeight,
                            height: R.dimens.LoginImageWidthHeight,
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            alignSelf: 'center',
                            resizeMode: 'contain'
                        }} />

                    <TextViewMR style={{
                        fontSize: R.dimens.mediumText,
                        color: this.state.color,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        fontWeight: 'bold'
                    }}>{this.state.title}</TextViewMR>

                    <TextViewHML style={{
                        fontSize: R.dimens.smallText,
                        color: R.colors.textPrimary,
                        marginTop: R.dimens.widget_top_bottom_margin,
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}>{this.state.description}</TextViewHML>

                    <View style={{ flexDirection: 'row', marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, }}>

                        <View style={{
                            flex: 1, justifyContent: 'center', alignContent: 'center'
                        }}>
                            {this.state.negativeText &&
                                <Button
                                    isAlert={true}
                                    isRound={true}
                                    title={this.state.negativeText}
                                    onPress={() => {
                                        this.state.onNegative();
                                        this.props.navigation.goBack()
                                        setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
                                    }}
                                    style={[{
                                        backgroundColor: R.colors.cardBackground,
                                    },
                                    R.colors.getTheme().includes('ni') ? { borderColor: R.colors.textPrimary, borderWidth: R.dimens.pickerBorderWidth } : {},
                                    ]}
                                    textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }} />}
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                            <Button
                                isAlert={true}
                                isRound={true}
                                title={this.state.positiveText}
                                onPress={() => {
                                    this.state.onPositive();
                                    this.props.navigation.goBack();
                                    setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
                                }}
                                style={{
                                    backgroundColor: this.state.color,
                                }}
                                textStyle={{ fontSize: R.dimens.smallText }} />
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}

export default AlertModal