import React, { Component } from 'react';
import { View, ScrollView, Clipboard, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDateTime, showAlert, } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import AlertDialog from '../../native_theme/components/AlertDialog';
import Button from '../../native_theme/components/Button';
import {
    addIPAddress, clearApikeyData,
    getApiKeyByID
} from '../../actions/ApiKey/ApiKeyAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CommonToast from '../../native_theme/components/CommonToast';
import TextViewMR from '../../native_theme/components/TextViewMR';
import CardView from '../../native_theme/components/CardView';
import Separator from '../../native_theme/components/Separator';
import ApiKeyIpWhitelist from './ApiKeyIpWhitelist';
import { Fonts } from '../../controllers/Constants';
import ImageButton from '../../native_theme/components/ImageTextButton';
import SafeView from '../../native_theme/components/SafeView';

class ApiKeyUpdateScreen extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //bind all methods
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        let item = props.navigation.state.params && props.navigation.state.params.item
        let PlanID = props.navigation.state.params && props.navigation.state.params.PlanID
        let KeyId = props.navigation.state.params && props.navigation.state.params.KeyId

        //Define All initial State
        this.state = {
            item: item,
            planId: PlanID,
            KeyId,
            showInfo: false,
            isRestrictedAccess: item.IPAccess === 1 ? true : false,
            isUnRestrictedAccess: item.IPAccess === 0 ? true : false,
            apiKey: item === 'undefined' ? '' : item.APIKey,
            isRestrictedFromApi: item.IPAccess === 1 ? true : false,
            isDisplayUpdate: false,
            isStatic: item.IPAccess === 0 ? true : false,
            whiteListResponse: [],
            isFirstTime: true,
            update: false,
        };
    }

    componentDidMount() {
        changeTheme()
    }

    componentDidUpdate = async (prevProps, prevState) => {
        let { addIPAddressData } = this.props.appData

        if (addIPAddressData !== prevProps.addIPAddressData) {
            if (addIPAddressData) {
                try {
                    if (validateResponseNew({ response: addIPAddressData })) {
                        showAlert(R.strings.Success + '!', addIPAddressData.ReturnMsg, 0, () => {
                            //clear data
                            this.props.clearApikeyData();
                            //----
                            //chage restricted status of succes response and display whitelist
                            this.setState({
                                isRestrictedFromApi: true,
                                isStatic: false,
                                isDisplayUpdate: false,
                            })
                            //-----
                            //refresh previous screen list
                            this.props.navigation.state.params.onSuccessAddEdit()

                            //goging back to the update screen
                            this.props.navigation.goBack();
                            //----
                        })
                    } else {
                        //clear data
                        this.props.clearApikeyData();
                        //----
                    }
                } catch (e) {
                    //clear data
                    this.props.clearApikeyData();
                    //----
                }
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // check for current screen or not
        if (isCurrentScreen(props)) {
            const { apiKeyListByID } = props.appData;
            if (apiKeyListByID) {
                try {
                    if (validateResponseNew({ response: apiKeyListByID })) {
                        //Set State For Api response 
                        let res = apiKeyListByID.Response
                        //clear reducer 
                        props.clearApikeyData();
                        //---
                        if (state.showSecretKey) {
                            return {
                                ...state,
                                showInfo: true,
                                keyTitle: R.strings.secretKey,
                                showMessage: res.SecretKey
                            }
                        } else {
                            return {
                                ...state,
                                showInfo: true,
                                keyTitle: R.strings.apiKey,
                                showMessage: res.APIKey
                            }
                        }
                    } else {
                        //clear reducer 
                        props.clearApikeyData();
                        //---
                        //Set State For Api response 
                        return {
                            ...state,
                            showInfo: false,
                            keyTitle: '',
                            showMessage: ''
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        showInfo: false,
                        keyTitle: '',
                        showMessage: ''
                    }
                }
            }
        }
        return null;
    }

    onPressUpdate = async () => {
        if (isEmpty(this.state.apiKey)) {
            this.refs.Toast.Show(R.strings.Please_Select_Item);
        } else if (!this.state.isRestrictedAccess) {
            this.refs.Toast.Show(R.strings.select + ' ' + R.strings.restrictedAccess);
        }
        else {
            this.setState({ update: false })
            if (await isInternet()) {
                //call api for update api key details
                let reqArray = this.state.whiteListResponse;
                //deleting Created Date for request
                reqArray.map((item, index) => {
                    delete reqArray[index].CreatedDate
                })
                //----
                const request = {
                    PlanID: this.state.planId,
                    APIKeyID: this.state.KeyId,
                    IPList: reqArray
                }
                this.props.addIPAddress(request)
            }
        }
    }

    //For Getting Data of Adding new IP For white listing
    getStaticWhiteListData = (AddResponse) => {
        if (AddResponse) {
            if (AddResponse.length > 0) {
                //getting add whitelist response for api
                this.setState({ whiteListResponse: AddResponse, isDisplayUpdate: true, isStatic: true });
            }
        }
    }

    // Called when user press on back button of device or custom toolbar
    onBackPress() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.onSuccessAddEdit !== undefined) {
            //refresh previous screen list
            this.props.navigation.state.params.onSuccessAddEdit()
        }
        //goging back to the update screen
        this.props.navigation.goBack();
        //----
    }

    getApiKey = async (key) => {
        if (await isInternet()) {
            //to get user api key and secret key both
            this.props.getApiKeyByID({ KeyID: key });
            //---
        }
    }

    // Copy Functionality
    copyKey = async () => {
        this.setState({ showInfo: false })
        await Clipboard.setString(/* this.state.keyTitle + " : " + */ this.state.showMessage);
        this.refs.toast.Show(R.strings.Copy_SuccessFul);
    }

    render() {
        let { addIPLoading, apiKeyListByIDLoading } = this.props.appData
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.update + ' ' + R.strings.apiKey}
                    isBack={true}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation}
                />

                {/* To Set CommonToast as per out theme */}
                <CommonToast ref='toast' />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={addIPLoading || apiKeyListByIDLoading} />

                {this.alertDialogInfo()}

                {/* Create API Dialog */}
                {this.state.update === true &&
                    <UpdateDialog
                        disabled={addIPLoading || apiKeyListByIDLoading}
                        update={this.state.update}
                        requestClose={() => this.setState({ update: !this.state.update })}
                        onPressUpdate={this.onPressUpdate}
                    />}


                <View style={{ flex: 1 }}>

                    <View style={{ marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, }}>
                        <TextViewMR style={{
                            fontSize: R.dimens.smallestText,
                            color: R.colors.textSecondary,
                            textAlign: 'left',
                        }}>{R.strings.createdOn}{' '}{convertDateTime(this.state.item.CreatedDate)}</TextViewMR>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <ScrollView showsVerticalScrollIndicator={false} >

                            <View style={{
                                flex: 1,
                                margin: R.dimens.margin_left_right,
                            }}>

                                <View style={{ flex: 1 }}>
                                    <CardView style={{
                                        flex: 1,
                                        elevation: R.dimens.listCardElevation,
                                        flexDirection: 'column',
                                        padding: R.dimens.WidgetPadding
                                    }}>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                <TextViewMR style={{
                                                    fontSize: R.dimens.smallestText,
                                                    color: R.colors.textSecondary,
                                                    textAlign: 'center',
                                                }}>{R.strings.apiKey}</TextViewMR>

                                                <ImageButton
                                                    style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                                    onPress={() => {
                                                        this.setState({ showSecretKey: false })
                                                        this.getApiKey(this.state.item.KeyId);
                                                    }}
                                                    icon={R.images.IC_EYE_FILLED}
                                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                                />
                                            </View>

                                            <TextViewHML style={this.styles().contentItem}>{this.state.item.APIKey.substring(this.state.item.APIKey.length - 20, this.state.item.APIKey.length)}</TextViewHML>

                                            <Separator style={{ flex: 1, marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, }} />

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                <TextViewMR style={{
                                                    fontSize: R.dimens.smallestText,
                                                    color: R.colors.textSecondary,
                                                    textAlign: 'center',
                                                }}>{R.strings.secretKey}</TextViewMR>

                                                <ImageButton
                                                    style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                                    onPress={() => {
                                                        this.setState({ showSecretKey: true })
                                                        this.getApiKey(this.state.item.KeyId);
                                                    }}
                                                    icon={R.images.IC_EYE_FILLED}
                                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                                />
                                            </View>

                                            <TextViewHML style={this.styles().contentItem}>{this.state.item.APIKey.substring(this.state.item.APIKey.length - 20, this.state.item.APIKey.length)}</TextViewHML>

                                            <Separator style={{ flex: 1, marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, }} />

                                            <TextViewMR style={{
                                                fontSize: R.dimens.smallestText,
                                                color: R.colors.textSecondary,
                                                textAlign: 'left',
                                            }}>{R.strings.apiAccess}</TextViewMR>

                                            <TextViewHML style={this.styles().contentItem}>{this.state.item.APIAccess === 1 ? R.strings.admin_rights : R.strings.view_rights}</TextViewHML>

                                        </View>
                                    </CardView>

                                    <CardView style={{
                                        flex: 1,
                                        marginTop: R.dimens.margin_top_bottom,
                                        elevation: R.dimens.listCardElevation,
                                        flexDirection: 'column',
                                        padding: R.dimens.WidgetPadding,
                                    }}>

                                        <View style={{ flex: 1 }}>

                                            <TextViewMR style={{
                                                fontSize: R.dimens.smallestText,
                                                marginBottom: R.dimens.widgetMargin,
                                                color: R.colors.textSecondary,
                                                textAlign: 'left',
                                            }}>{R.strings.selectIPAccess}</TextViewMR>

                                            <ImageButton
                                                disabled={this.state.isRestrictedFromApi}
                                                name={R.strings.unrestrictedAccess}
                                                icon={this.state.isUnRestrictedAccess ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                                onPress={() => this.setState({ isUnRestrictedAccess: true, isRestrictedAccess: false })}
                                                style={{ padding: 0, marginTop: 0, marginLeft: R.dimens.widget_left_right_margin, marginBottom: R.dimens.widgetMargin, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                                textStyle={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.WidgetPadding, color: !this.state.isRestrictedFromApi ? R.colors.textPrimary : R.colors.textSecondary, fontSize: R.dimens.smallestText }}
                                                iconStyle={{ margin: 0, padding: 0, tintColor: !this.state.isRestrictedFromApi ? (this.state.isUnRestrictedAccess ? R.colors.accent : R.colors.textPrimary) : R.colors.textSecondary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                            />
                                            <ImageButton
                                                disabled={this.state.isRestrictedFromApi}
                                                name={R.strings.restrictAccessToWhitelist}
                                                icon={this.state.isRestrictedAccess ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                                onPress={() => this.setState({ isRestrictedAccess: true, isUnRestrictedAccess: false })}
                                                style={{ padding: 0, marginTop: 0, marginLeft: R.dimens.widget_left_right_margin, marginBottom: R.dimens.widgetMargin, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                                textStyle={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.WidgetPadding, color: !this.state.isRestrictedFromApi ? R.colors.textPrimary : R.colors.textSecondary, fontSize: R.dimens.smallestText }}
                                                iconStyle={{ margin: 0, padding: 0, tintColor: !this.state.isRestrictedFromApi ? (this.state.isRestrictedAccess ? R.colors.accent : R.colors.textPrimary) : R.colors.textSecondary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                            />
                                        </View>
                                    </CardView>
                                    {!this.state.isRestrictedFromApi && this.state.isRestrictedAccess && this.state.isDisplayUpdate &&
                                        <CardView style={{
                                            flex: 1,
                                            marginTop: R.dimens.margin_top_bottom,
                                            elevation: R.dimens.listCardElevation,
                                            flexDirection: 'column',
                                            padding: R.dimens.WidgetPadding
                                        }}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.whitelistedIPAddress}</Text>

                                                <ImageButton
                                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                                    style={{ margin: 0 }}
                                                    onPress={() => this.props.navigation.navigate('ApiKeyIpWhitelist', { isStatic: true, getStaticWhiteListData: this.getStaticWhiteListData, whiteListResponse: this.state.whiteListResponse })} />

                                            </View>

                                            <ApiKeyIpWhitelist navigation={this.props.navigation} ScreenName={'ApiKeyUpdateScreen'} isStatic={true} isFromView={true} whiteListResponse={this.state.whiteListResponse} />

                                        </CardView>
                                    }
                                    <View style={{ marginTop: R.dimens.padding_top_bottom_margin }} >
                                        <Text style={{ fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.note_text + ' : '}</Text>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.securityApiKeyWarningNote}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        {!this.state.isRestrictedFromApi && this.state.isRestrictedAccess && this.state.isDisplayUpdate &&
                            <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                                <Button
                                    style={{ width: R.screen().width / 2, marginBottom: R.dimens.widgetMargin }}
                                    isRound={true}
                                    title={R.strings.update}
                                    onPress={() => this.setState({ update: true })} />
                            </View>
                        }
                        {this.state.isRestrictedAccess && !this.state.isDisplayUpdate &&
                            <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                                <Button
                                    isRound={true}
                                    title={R.strings.next}
                                    style={{ marginBottom: R.dimens.widgetMargin }}
                                    onPress={() => this.props.navigation.navigate('ApiKeyIpWhitelist', { PlanID: this.state.planId, KeyId: this.state.KeyId, isStatic: this.state.isStatic, getStaticWhiteListData: this.getStaticWhiteListData, whiteListResponse: this.state.whiteListResponse })} />
                            </View>
                        }
                    </View>
                </View>
            </SafeView >
        );
    }

    // style for this class
    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary
            }
        }
    }

    alertDialogInfo() {
        return (<AlertDialog
            visible={this.state.showInfo}
            title={this.state.keyTitle}
            negativeButton={{
                hide: false,
                onPress: () => this.setState({ showInfo: false }),
            }}
            positiveButton={{
                title: R.strings.copy,
                onPress: this.copyKey
            }}
            requestClose={() => null}>

            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>
                {this.state.showMessage}
            </TextViewHML>

        </AlertDialog>)
    }

}

class UpdateDialog extends Component {

    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.update !== nextProps.update ||
            this.props.requestClose !== nextProps.requestClose ||
            this.props.disabled !== nextProps.disabled
        ) {
            return true
        }
        return false
    }

    render() {
        return (
            <AlertDialog
                visible={this.props.update}
                title={R.strings.update + ' ' + R.strings.apiKey}
                negativeButton={{
                    title: R.strings.cancel,
                    onPress: this.props.requestClose
                }}
                positiveButton={{
                    title: R.strings.update,
                    onPress: this.props.onPressUpdate,
                    disabled: this.props.disabled,
                    progressive: false
                }}
                requestClose={this.props.requestClose}>
                <View>
                    <TextViewHML style={{ marginTop: R.dimens.widgetMargin, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.yellow }}> {R.strings.update_button_security_message}</TextViewHML>
                </View>
            </AlertDialog>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data For Api key Action
        appData: state.ApiKeyReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform user add Ip Address Action
        addIPAddress: (request) => dispatch(addIPAddress(request)),
        //Perform APi Key Action
        getApiKeyByID: (request) => dispatch(getApiKeyByID(request)),
        //Perform Clear Api Data Action
        clearApikeyData: () => dispatch(clearApikeyData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ApiKeyUpdateScreen);