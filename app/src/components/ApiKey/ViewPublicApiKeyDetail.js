import React, { Component } from 'react';
import { View, Image, ScrollView, Clipboard, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, showAlert, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../../components/Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { deleteApiKey, clearApikeyDeleteData } from '../../actions/ApiKey/ApiKeyDeleteAction';
import Separator from '../../native_theme/components/Separator';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { getApiKeyByID, clearApikeyData } from '../../actions/ApiKey/ApiKeyAction';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CommonToast from '../../native_theme/components/CommonToast';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Fonts } from '../../controllers/Constants';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class ViewPublicApiKeyDetail extends Component {
    constructor(props) {
        super(props);

        //Get Date From Previous Screen
        let item = props.navigation.state.params && props.navigation.state.params.item
        let PlanID = props.navigation.state.params && props.navigation.state.params.PlanID
        let PlanName = props.navigation.state.params && props.navigation.state.params.PlanName

        //Define All initial State
        this.state = {
            item: item,
            PlanID: PlanID,
            planName: PlanName,
            showInfo: false,
            isFirstTime: true,
        };
    }

    componentDidMount() {
        changeTheme()
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { deleteApiKeyData } = this.props.Listdata;

        if (deleteApiKeyData !== prevProps.deleteApiKeyData) {

            //Check delete Response 
            if (deleteApiKeyData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: deleteApiKeyData })) {
                        showAlert(R.strings.Success + '!', deleteApiKeyData.ReturnMsg + '\n' + ' ', 0, () => {
                            this.props.clearApikeyDeleteData();

                            //refresh previous screen list
                            this.props.navigation.state.params.onSuccessAddEdit()
                            //----

                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        });
                    }
                    else {
                        this.props.clearApikeyDeleteData();
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                    this.props.clearApikeyDeleteData();
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

        if (isCurrentScreen(props)) {
            const { apiKeyListByID } = props.Listdata;
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

    // Render Right Side Menu 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {this.state.item.IPAccess === 0 &&
                    <ImageButton
                        icon={R.images.IC_EDIT}
                        style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                        iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                        onPress={() => this.props.navigation.navigate('ApiKeyUpdateScreen', { item: this.state.item, edit: true, onSuccessAddEdit: this.props.navigation.state.params.onSuccessAddEdit, PlanName: this.state.planName, PlanID: this.state.PlanID, KeyId: this.state.item.KeyId })} />
                }
                <ImageButton
                    icon={R.images.IC_DELETE}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.setState({ delete: true })} />
            </View>
        )
    }

    //For Delete Api Key Request
    deleteApiKey = async (item) => {
        this.setState({ delete: false })
        if (await isInternet()) {
            let deleteAPiKeyRequest = {
                planKey: this.state.item.KeyId,
            }
            this.props.deleteApiKey(deleteAPiKeyRequest);
        }
    }

    //For Get Api Key Request
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
        await Clipboard.setString(this.state.showMessage);
        this.refs.toast.Show(R.strings.Copy_SuccessFul);
    }

    render() {
        const { deleteApiKeyLoading, apiKeyListByIDLoading } = this.props.Listdata;
        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.item.AliasName}
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={this.rightMenuRender()}
                />

                {/* To Set CommonToast as per out theme */}
                <CommonToast ref='toast' />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={deleteApiKeyLoading || apiKeyListByIDLoading} />

                {/* For Show Key */}
                <KeyDialog
                    showInfo={this.state.showInfo}
                    keyTitle={this.state.keyTitle}
                    showMessage={this.state.showMessage}
                    onPress={this.copyKey}
                    requestClose={() => this.setState({ showInfo: false })}
                />

                {/* For Delete Key */}
                {this.state.delete === true &&
                    <RenderDeleteDialog
                        delete={this.state.delete}
                        onPress={() => this.setState({ delete: !this.state.delete })}
                        requestClose={() => this.setState({ delete: !this.state.delete })}
                        AliasName={this.state.item.AliasName}
                        CreatedDate={convertDate(this.state.item.CreatedDate)}
                        APIAccess={this.state.item.APIAccess}
                        deleteApiKey={this.deleteApiKey}
                    />}

                <View style={{ flex: 1 }}>

                    <View style={{ marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, }}>
                        {/* For CreatedDate */}
                        <TextViewMR style={{
                            fontSize: R.dimens.smallestText,
                            color: R.colors.textSecondary,
                            textAlign: 'left',
                        }}>{R.strings.createdOn}{' '}{convertDateTime(this.state.item.CreatedDate)}</TextViewMR>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

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
                                        {/* For Key Qr Code */}
                                        <Image
                                            source={{ uri: 'https://chart.googleapis.com/chart?cht=qr&chl=' + this.state.item.APIKey + '&chs=150x150&chld=L|0' }}
                                            style={{ width: R.dimens.QRCodeIconWidthHeightD, height: R.dimens.QRCodeIconWidthHeightD, alignSelf: 'center', marginBottom: R.dimens.WidgetPadding }} />

                                        {/* For whitelistedIPAddress  */}
                                        {this.state.item.IPAccess === 1 &&
                                            <CustomButton
                                                image={false}
                                                title={R.strings.whitelistedIPAddress}
                                                onPress={() => this.props.navigation.navigate('ApiKeyIpWhitelist', { isList: true, PlanID: this.state.PlanID, isFromView: true })}
                                            />
                                        }

                                        <TextViewMR style={{
                                            fontSize: R.dimens.smallestText,
                                            color: R.colors.textSecondary,
                                            textAlign: 'center',
                                        }}>{R.strings.apiKey}</TextViewMR>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* For Api Key  */}
                                            <TextViewHML style={this.styles().contentItem}>{this.state.item.APIKey.substring(this.state.item.APIKey.length - 20, this.state.item.APIKey.length)}</TextViewHML>
                                            {/* For Show Api Key  */}
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

                                        <TextViewMR style={{
                                            fontSize: R.dimens.smallestText,
                                            color: R.colors.textSecondary,
                                            textAlign: 'center',
                                        }}>{R.strings.secretKey}</TextViewMR>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* For Secret Key  */}
                                            <TextViewHML style={this.styles().contentItem}>{this.state.item.SecretKey.substring(this.state.item.SecretKey.length - 20, this.state.item.SecretKey.length)}</TextViewHML>
                                            {/* For Show Secret Key  */}
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

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiSemiBold }}>
                                                {R.strings.access}
                                            </Text>
                                            <Separator style={{ flex: 1, marginRight: 0 }} />
                                        </View>

                                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, }}>
                                            <View style={{ width: wp('10%'), marginTop: R.dimens.widgetMargin, }}>
                                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                                    {R.strings.api + " "}
                                                </TextViewHML>

                                            </View>

                                            {/* Confirmation of Image Status  */}
                                            <View style={{ width: wp('90%'), marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.widgetMargin }}>
                                                {this.returnImageCheckerText({
                                                    text: this.state.item.APIAccess === 1 ? R.strings.adminOnly : R.strings.viewOnly,
                                                    code: true,
                                                    name: R.strings.restrictedAccess
                                                })}

                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, }}>
                                            <View style={{ width: wp('10%'), marginTop: R.dimens.widgetMargin, }}>
                                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                                    {R.strings.ipTitle + " "}
                                                </TextViewHML>
                                            </View>

                                            {/* Confirmation of Image Status  */}
                                            <View style={{ width: wp('90%'), marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.widgetMargin }}>
                                                {this.returnImageCheckerText({
                                                    text: R.strings.restrictAccessToWhitelist,
                                                    code: this.state.item.IPAccess === 1 ? true : false,
                                                    name: R.strings.ipTitle
                                                })}
                                                {this.returnImageCheckerText({
                                                    text: R.strings.unrestrictedAccess,
                                                    code: this.state.item.IPAccess === 0 ? true : false
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </CardView>
                            </View>

                            <View style={{ marginTop: R.dimens.padding_top_bottom_margin }} >
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.securityApiKeyWarningNote}</TextViewHML>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeView >
        );
    }

    returnImageCheckerText = (props) => {
        let { text, code } = props;
        return <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {/* if state is empty then display cross otherwise checkmark */}
            <Image
                source={code === true ? R.images.IC_CHECKMARK : R.images.IC_CANCEL} successGreen
                style={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: code === true ? R.colors.successGreen : R.colors.failRed }} />
            <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{text}</TextViewHML>
        </View>
    }

    styles = () => {
        return {
            contentItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary
            }
        }
    }
}

class RenderDeleteDialog extends Component {
    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.delete !== nextProps.delete ||
            this.props.onPress !== nextProps.onPress ||
            this.props.requestClose !== nextProps.requestClose ||
            this.props.AliasName !== nextProps.AliasName ||
            this.props.CreatedDate !== nextProps.CreatedDate ||
            this.props.APIAccess !== nextProps.APIAccess ||
            this.props.deleteApiKey !== nextProps.deleteApiKey
        ) {
            return true
        }
        return false
    }
    render() {
        return (
            <AlertDialog
                visible={this.props.delete}
                title={R.strings.deleteApiKey}
                negativeButton={{
                    title: R.strings.cancel,
                    onPress: this.props.onPress
                }}
                positiveButton={{
                    title: R.strings.OK,
                    onPress: () => this.props.deleteApiKey(),
                    progressive: false
                }}
                requestClose={this.props.requestClose}>
                <View>
                    <Separator style={{ marginLeft: 0, marginRight: 0 }} />
                    <View style={{ padding: R.dimens.widgetMargin }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextViewHML style={{ flex: 1, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {R.strings.aliasName}</TextViewHML>
                            <TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {this.props.AliasName}</TextViewHML>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextViewHML style={{ flex: 1, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {R.strings.createdDate}</TextViewHML>
                            <TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {this.props.CreatedDate}</TextViewHML>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextViewHML style={{ flex: 1, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {R.strings.allowedAccess}</TextViewHML>
                            <TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}> {this.props.APIAccess === 1 ? R.strings.admin_rights : R.strings.view_rights}</TextViewHML>
                        </View>
                    </View>
                    <Separator style={{ marginLeft: 0, marginRight: 0 }} />
                    <TextViewHML style={{ marginTop: R.dimens.widgetMargin, textAlign: 'left', fontSize: R.dimens.smallestText, color: R.colors.yellow }}> {R.strings.apiKeyDeleteNote}</TextViewHML>
                </View>
            </AlertDialog>
        )
    }
}

class KeyDialog extends Component {
    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.showInfo !== nextProps.showInfo ||
            this.props.keyTitle !== nextProps.keyTitle ||
            this.props.showMessage !== nextProps.showMessage ||
            this.props.onPress !== nextProps.onPress ||
            this.props.requestClose !== nextProps.requestClose
        ) {
            return true
        }
        return false
    }

    render() {
        return (
            <AlertDialog
                visible={this.props.showInfo}
                title={this.props.keyTitle}
                negativeButton={{
                    hide: false,
                    onPress: this.props.requestClose,
                }}
                positiveButton={{
                    title: R.strings.copy,
                    onPress: this.props.onPress,
                }}
                requestClose={this.props.requestClose}>

                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>
                    {this.props.showMessage}
                </TextViewHML>
            </AlertDialog>
        )
    }
}

function CustomButton(props) {
    let color = R.colors.accent;
    return (
        <View style={{ marginBottom: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <ImageButton
                name={props.title}
                style={{
                    flexDirection: 'row-reverse',
                    borderColor: color,
                    borderWidth: R.dimens.pickerBorderWidth,
                    paddingLeft: R.dimens.margin,
                    paddingRight: R.dimens.margin,
                    paddingTop: R.dimens.widgetMargin,
                    paddingBottom: R.dimens.widgetMargin,
                    backgroundColor: R.colors.background,
                    borderRadius: R.dimens.cardBorderRadius,
                    margin: 0
                }}
                onPress={props.onPress}
                textStyle={{
                    fontSize: R.dimens.smallestText,
                    color: color,
                }} />
        </View>
    )
}

function mapStatToProps(state) {
    let Listdata = {
        //Updated Data For delete Api key Action
        ...state.ApiKeyDeleteReducer,
        //Updated Data For Api key Action
        ...state.ApiKeyReducer,
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
    return { Listdata }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Delete Apikey Action
        deleteApiKey: (deleteRequest) => dispatch(deleteApiKey(deleteRequest)),
        //Perform show Apikey Action
        getApiKeyByID: (request) => dispatch(getApiKeyByID(request)),
        //Perform clear Apikey Action
        clearApikeyData: () => dispatch(clearApikeyData()),
        //Perform clear delete Apikey Action
        clearApikeyDeleteData: () => dispatch(clearApikeyDeleteData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ViewPublicApiKeyDetail);



