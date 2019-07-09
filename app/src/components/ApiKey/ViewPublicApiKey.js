import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, TouchableWithoutFeedback, Text, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, convertDate, showAlert, createOptions, createActions, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../../components/Navigation';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import Separator from '../../native_theme/components/Separator';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { getUserActivePlan } from '../../actions/ApiPlan/ApiPlanListAction';
import { getApiKeyList, getApiKeyByID, clearApikeyData } from '../../actions/ApiKey/ApiKeyAction';
import { deleteApiKey, clearApikeyDeleteData } from '../../actions/ApiKey/ApiKeyDeleteAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import OptionsMenu from "react-native-options-menu";
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts, ServiceUtilConstant } from '../../controllers/Constants';
import CommonToast from '../../native_theme/components/CommonToast';
import { getData } from '../../App';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ViewPublicApiKey extends Component {
    constructor(props) {
        super(props);
        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            apiKeyList: null,
            planName: ' - ',
            TotalAmt: ' - ',
            PlanID: null,
            PlanStatus: null,
            planRespone: [],
            showInfo: false,
            keyTitle: 'Key',
            showMessage: 'xxx',
            APIKeyLimit: '-',
            APIKeyCount: '-',
            delete: false,
            KeyId: null,
            isFirstTime: true,
            callApigetApiKeyList: false,
            UserActivePlanData: null,
            plan: getData(ServiceUtilConstant.KEY_IsPlanChange)
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        const { UserActivePlanData } = this.props.Listdata;

        //if UserActivePlanData is Not Available From Previous Screen Than Call Api
        if ((UserActivePlanData == null || UserActivePlanData === 'undefined') && await isInternet()) {
            this.props.getUserActivePlan({})
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.props.getApiKeyList({ PlanID: this.state.PlanID })
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For add Success Or Delete Than Call List Api
    onSuccessAddEdit = async () => {
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.props.getApiKeyList({ PlanID: this.state.PlanID })
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { UserActivePlanData, deleteApiKeyData } = this.props.Listdata;
        if (UserActivePlanData !== prevProps.UserActivePlanData) {
            if (UserActivePlanData) {
                if (UserActivePlanData.Response && UserActivePlanData.Response.PlanID) {
                    if (this.state.callApigetApiKeyList) {

                        //Check NetWork is Available or not
                        if (await isInternet()) {
                            this.setState({ callApigetApiKeyList: false })

                            //call Api Key List Api if User Has Active Plan
                            this.props.getApiKeyList({ PlanID: UserActivePlanData.Response.PlanID })
                        }
                    }
                }
            }
        }

        //show Reponse Of Delete 
        if (deleteApiKeyData !== prevProps.deleteApiKeyData) {

            if (deleteApiKeyData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: deleteApiKeyData })) {
                        showAlert(R.strings.Success + '!', deleteApiKeyData.ReturnMsg + '\n' + ' ', 0, () => {
                            this.props.clearApikeyDeleteData();
                            this.Request = {
                            }
                            this.props.getApiKeyList({ PlanID: this.state.PlanID })
                        });
                    }
                    else {
                        this.props.clearApikeyDeleteData();
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    this.props.clearApikeyDeleteData();
                }
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ViewPublicApiKey.oldProps !== props) {
            ViewPublicApiKey.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { UserActivePlanData, apiKeyList, apiKeyListByID } = props.Listdata;
            if (UserActivePlanData) {
                try {
                    if (state.UserActivePlanData == null || (state.UserActivePlanData != null && UserActivePlanData !== state.UserActivePlanData)) {
                        if (validateResponseNew({ response: UserActivePlanData, isList: true, })) {

                            //Set State For Api response 
                            let res = UserActivePlanData.Response

                            return {
                                ...state,
                                UserActivePlanData,
                                planRespone: parseArray(res),
                                planName: res.PlanName,
                                TotalAmt: res.TotalAmt,
                                PlanID: res.PlanID,
                                PlanStatus: res.PlanStatus,
                                callApigetApiKeyList: true
                            }
                        } else {
                            //Set State For Api response 
                            return {
                                ...state,
                                planRespone: [],
                                refreshing: false,
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        planRespone: [],
                        refreshing: false,
                    }
                }
            }

            if (apiKeyList) {
                try {
                    if (state.apiKeyList == null || (state.apiKeyList != null && apiKeyList !== state.apiKeyList)) {
                        if (validateResponseNew({ response: apiKeyList, isList: true })) {

                            //Set State For Api response 
                            let res = parseArray(apiKeyList.Response)

                            //clear reducer 
                            props.clearApikeyData();
                            //---
                            return {
                                ...state,
                                apiKeyList,
                                response: res,
                                refreshing: false,
                                APIKeyLimit: apiKeyList.APIKeyLimit,
                                APIKeyCount: apiKeyList.APIKeyCount
                            }
                        } else {
                            //clear reducer 
                            props.clearApikeyData();
                            //---

                            //Set State For Api response 
                            return {
                                ...state,
                                refreshing: false,
                                response: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        refreshing: false,
                        response: []
                    }
                }
            }

            //for Show Key Response
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
                                showMessage: res.SecretKey
                            }
                        } else {
                            return {
                                ...state,
                                showInfo: true,
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
                            showMessage: ''
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        showInfo: false,
                        showMessage: ''
                    }
                }
            }

        }
        return null;
    }

    //For Delete Api key Request
    deleteApiKey = async (item) => {
        this.setState({ delete: false })
        if (await isInternet()) {
            let deleteAPiKeyRequest = {
                planKey: this.state.KeyId,
            }
            this.props.deleteApiKey(deleteAPiKeyRequest);
        }
    }

    //For Get Api key Request
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

    // Previus Refresh From api plan Screen
    refresh = async () => {
        var NewPlan = getData(ServiceUtilConstant.KEY_IsPlanChange)

        if (this.state.plan !== NewPlan) {
            const { UserActivePlanData } = this.props.Listdata;
            if (UserActivePlanData) {
                try {
                    if (this.state.UserActivePlanData == null || (this.state.UserActivePlanData != null && UserActivePlanData !== this.state.UserActivePlanData)) {

                        if (validateResponseNew({ response: UserActivePlanData, isList: true, })) {

                            //Set State For Api response 
                            let res = UserActivePlanData.Response
                            this.setState({
                                UserActivePlanData,
                                planRespone: parseArray(res),
                                planName: res.PlanName,
                                TotalAmt: res.TotalAmt,
                                PlanID: res.PlanID,
                                PlanStatus: res.PlanStatus,
                                callApigetApiKeyList: true
                            })
                            if (await isInternet()) {
                                this.props.getApiKeyList({ PlanID: UserActivePlanData.Response.PlanID })
                            }
                        } else {
                            this.setState({
                                planRespone: [],
                            })
                        }
                    }
                } catch (e) {
                    this.setState({
                        planRespone: [],
                    })
                }
            }
        }
    }

    render() {
        let finalItems = this.state.response;

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { UserActivePlanLoading, apiKeyListLoading, deleteApiKeyLoading, apiKeyListByIDLoading } = this.props.Listdata;

        //for final items from search input (validate on AliasName)
        //default searchInput is empty so it will display all records.
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.AliasName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        var statusColor = ''
        if (this.state.PlanStatus === 0) {
            statusColor = R.colors.failRed

        } else if (this.state.PlanStatus === 1) {
            statusColor = R.colors.successGreen
        }
        else {
            statusColor = R.colors.accent
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.viewPublicApiKey}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={this.state.response.length > 0 ? true : false}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={this.state.planRespone.length > 0 ? R.images.IC_PLUS : null}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddApiKeyScreen', { edit: false, onSuccessAddEdit: this.onSuccessAddEdit, ITEM: { PlanName: this.state.planName, PlanID: this.state.PlanID } })
                    }}
                />

                {/* To Set CommonToast as per out theme */}
                <CommonToast ref='toast' />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={deleteApiKeyLoading || apiKeyListByIDLoading} />

                <KeyDialog
                    showInfo={this.state.showInfo}
                    keyTitle={this.state.keyTitle}
                    showMessage={this.state.showMessage}
                    onPress={this.copyKey}
                    requestClose={() => this.setState({ showInfo: false })}
                />

                {/* Create API Dialog */}
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

                {UserActivePlanLoading ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>
                        {this.state.planRespone.length ?
                            <View style={{ flex: 1 }}>

                                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('ApiPlanListScreen', { refresh: this.refresh })}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: R.dimens.WidgetPadding, marginBottom: R.dimens.widgetMargin }}>
                                        <View>
                                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{(R.strings.apiPlan).toUpperCase()} </TextViewMR>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <View style={{
                                                    width: R.dimens.SMALLEST_ICON_SIZE,
                                                    height: R.dimens.SMALLEST_ICON_SIZE,
                                                    backgroundColor: statusColor,
                                                    borderColor: R.colors.textPrimary,
                                                    borderRadius: R.dimens.LoginButtonBorderRadius,
                                                    marginRight: R.dimens.widgetMargin,
                                                }} />
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.planName}</Text>
                                                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textSecondary, fontFamily: Fonts.MontserratSemiBold, }}>{'(' + this.state.TotalAmt + ')'}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <TextViewMR style={{ textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{(R.strings.keys).toUpperCase()} </TextViewMR>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ textAlign: 'right', fontSize: R.dimens.mediumText, color: R.colors.accent, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.APIKeyCount}</Text>
                                                    <Text style={{ textAlign: 'right', fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{"/" + this.state.APIKeyLimit}</Text>
                                                </View>
                                            </View>
                                            <Image
                                                source={R.images.RIGHT_ARROW_DOUBLE}
                                                style={{ alignSelf: 'center', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>

                                <Separator />

                                {
                                    (apiKeyListLoading && !this.state.refreshing) ?
                                        <ListLoader />
                                        :
                                        (this.state.planRespone.length > 0) ?

                                            <View style={{ flex: 1 }}>
                                                {finalItems.length ?
                                                    <View style={{ flex: 1 }}>

                                                        <FlatList
                                                            showsVerticalScrollIndicator={false}
                                                            data={finalItems}
                                                            /* render all item in list */
                                                            renderItem={({ item, index }) => {
                                                                return <FlatListItem
                                                                    item={item}
                                                                    index={index}
                                                                    size={this.state.response.length}
                                                                    onEdit={() => {
                                                                        this.props.navigation.navigate('ApiKeyUpdateScreen', { item: item, edit: true, onSuccessAddEdit: this.onSuccessAddEdit, PlanName: this.state.planName, PlanID: this.state.PlanID, KeyId: item.KeyId })
                                                                    }}
                                                                    onDetailPress={() => {
                                                                        this.props.navigation.navigate('ViewPublicApiKeyDetail', { item: item, PlanID: this.state.PlanID, onSuccessAddEdit: this.onSuccessAddEdit, })
                                                                    }}
                                                                    onApiKeyPress={() => {
                                                                        this.setState({ showSecretKey: false, keyTitle: R.strings.apiKey })
                                                                        this.getApiKey(item.KeyId);
                                                                    }}
                                                                    onDeletepress={() => {
                                                                        this.setState({ delete: true, KeyId: item.KeyId, item: item })
                                                                    }}
                                                                    onSecretKeyPress={() => {
                                                                        this.setState({ showSecretKey: true, keyTitle: R.strings.secretKey })
                                                                        this.getApiKey(item.KeyId);
                                                                    }}
                                                                />
                                                            }}
                                                            /* assign index as key valye to  list item */
                                                            keyExtractor={(item, index) => index.toString()}
                                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                                            /* For Refresh Functionality In  FlatList Item */
                                                            refreshControl={
                                                                <RefreshControl
                                                                    colors={[R.colors.accent]}
                                                                    progressBackgroundColor={R.colors.background}
                                                                    refreshing={this.state.refreshing}
                                                                    onRefresh={this.onRefresh}
                                                                />
                                                            }
                                                        />
                                                    </View>
                                                    :
                                                    <ListEmptyComponent module={R.strings.generate_api_key} onPress={() => this.props.navigation.navigate('AddApiKeyScreen', { edit: false, onSuccessAddEdit: this.onSuccessAddEdit, ITEM: { PlanName: this.state.planName, PlanID: this.state.PlanID } })} />
                                                }
                                            </View>
                                            :
                                            null
                                }
                            </View>
                            :
                            <ListEmptyComponent module={R.strings.subscribePlan} onPress={() => this.props.navigation.navigate('ApiPlanListScreen')} />
                        }
                    </View>
                }
            </SafeView >
        )
    }
}

class RenderDeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
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
    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
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

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props);
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps) {
        if (this.props.item !== nextProps.item ||
            this.props.onEdit !== nextProps.onEdit ||
            this.props.onDetailPress !== nextProps.onDetailPress ||
            this.props.onApiKeyPress !== nextProps.onApiKeyPress ||
            this.props.onDeletepress !== nextProps.onDeletepress ||
            this.props.onSecretKeyPress !== nextProps.onSecretKeyPress
        ) {
            return true
        }
        return false
    }

    render() {
        let { index, size, item } = this.props;
        let apiAccessColor = R.colors.accent;
        let menuItems = [R.strings.view, R.strings.Delete];
        let menuActions = [this.props.onDetailPress, this.props.onDeletepress]
        if (item.APIAccess === 1) {
            apiAccessColor = R.colors.yellow
        }
        else {
            apiAccessColor = R.colors.accent
        }
        let ipAccessColor = R.colors.accent;
        if (item.IPAccess === 0) {
            ipAccessColor = R.colors.accent
            menuItems = [R.strings.view, R.strings.Delete, R.strings.edit]
            menuActions = [this.props.onDetailPress, this.props.onDeletepress, this.props.onEdit]
        }
        else {
            ipAccessColor = R.colors.yellow
            menuItems = [R.strings.view, R.strings.Delete]
            menuActions = [this.props.onDetailPress, this.props.onDeletepress];
        }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        padding: 0
                    }}>
                        <View style={{ margin: R.dimens.WidgetPadding }}>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center', }}>
                                    <ImageTextButton
                                        icon={R.images.IC_KEY}
                                        style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                        iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                    />
                                </View>

                                <View style={{ width: '90%', paddingLeft: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '90%' }}>
                                        <View>
                                            <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.AliasName ? item.AliasName : '-'}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
                                                {R.strings.key + " : "}
                                            </TextViewHML>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
                                                {item.APIKey.substring(item.APIKey.length - 20, item.APIKey.length)}
                                            </TextViewHML>
                                            <ImageButton
                                                style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                                onPress={this.props.onApiKeyPress}
                                                icon={R.images.IC_EYE_FILLED}
                                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
                                                {R.strings.secret + " : "}
                                            </TextViewHML>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>
                                                {item.SecretKey.substring(item.SecretKey.length - 20, item.SecretKey.length)}
                                            </TextViewHML>
                                            <ImageButton
                                                style={{ marginLeft: R.dimens.widgetMargin, margin: 0, padding: 0 }}
                                                onPress={this.props.onSecretKeyPress}
                                                icon={R.images.IC_EYE_FILLED}
                                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '10%' }}>

                                        <OptionsMenu
                                            ref={component => {
                                                this.optionExchange = component;
                                            }}
                                            customButton={
                                                <ImageButton
                                                    icon={R.images.VERTICAL_MENU}
                                                    onPress={() => {
                                                        this.optionExchange.handlePress();
                                                    }}
                                                    style={{ margin: 0, padding: 0, alignSelf: 'flex-end' }}
                                                    iconStyle={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                                />}
                                            destructiveIndex={1}
                                            options={createOptions(menuItems)}
                                            actions={createActions(menuActions)}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiSemiBold }}>
                                    {R.strings.access}
                                </Text>
                                <Separator style={{ flex: 1, marginRight: 0 }} />
                            </View>

                            <View style={{ marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>
                                        {R.strings.api + " : "}
                                    </TextViewHML>
                                    <TextViewHML style={{ textAlign: 'left', color: apiAccessColor, fontSize: R.dimens.smallText, }}>{item.APIAccess === 1 ? R.strings.adminOnly : R.strings.viewOnly}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                        {R.strings.ipTitle + " : "}
                                    </TextViewHML>
                                    <TextViewHML style={{ textAlign: 'left', color: ipAccessColor, fontSize: R.dimens.smallText, }}>{item.IPAccess === 1 ? R.strings.restrictedAccess : R.strings.unRestrictedAccess}</TextViewHML>
                                </View>

                                <View style={{ flex: 1, alignItems: 'center', alignContent: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ padding: 0, margin: 0, width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss A', false) : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    let Listdata = {
        //Updated Data For Api Key Action
        ...state.ApiKeyReducer,
        //Updated Data For Api Key Delete Action
        ...state.ApiKeyDeleteReducer,
        //Updated Data For Api Plan Action
        ...state.ApiPlanListReducer,
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
    return { Listdata }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform user Active plan Action
        getUserActivePlan: (request) => dispatch(getUserActivePlan(request)),
        //Perform Apikey List Action
        getApiKeyList: (request) => dispatch(getApiKeyList(request)),
        //Perform Delete Apikey Action
        deleteApiKey: (deleteRequest) => dispatch(deleteApiKey(deleteRequest)),
        //Perform show Apikey Action
        getApiKeyByID: (request) => dispatch(getApiKeyByID(request)),
        //Perform clear delete Apikey Action
        clearApikeyDeleteData: () => dispatch(clearApikeyDeleteData()),
        //Perform clear Apikey Action
        clearApikeyData: () => dispatch(clearApikeyData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ViewPublicApiKey);


