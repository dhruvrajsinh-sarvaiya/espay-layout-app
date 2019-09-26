import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert, getDeviceID, getIPAddress, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import { passwordPolicyList, deletePasswordPolicy, clearPasswordPolicy } from '../../../actions/account/PasswordPolicyAction';
import PaginationWidget from '../../widget/PaginationWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class PasswordPolicyListScreen extends Component {
    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            policyListData: null,
            row: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            isFirstTime: true,
            delete: false,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call api passwordPolicyList 
            this.props.passwordPolicyList(this.request)
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
            }

            //call api passwordPolicyList 
            this.props.passwordPolicyList(this.request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        this.setState({ selectedPage: 1 })
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call api to fetch 
            this.props.passwordPolicyList(this.request)
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
        if (PasswordPolicyListScreen.oldProps !== props) {
            PasswordPolicyListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { policyListData, deletePolicyData } = props.Listdata;

            if (policyListData) {

                try {
                    if (state.policyListData == null || (state.policyListData != null && policyListData !== state.policyListData)) {
                        if (validateResponseNew({ response: policyListData, isList: true, })) {
                            //Set State For Api response 
                            return {
                                ...state,
                                policyListData,
                                response: parseArray(policyListData.UserPasswordPolicyMaster),
                                refreshing: false,
                                row: addPages(policyListData.TotalCount)
                            }
                        } else {
                            return {
                                ...state,
                                policyListData,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        row: [],
                        refreshing: false,
                    }
                }
            }

            //Check delete Response 
            if (deletePolicyData) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: deletePolicyData,
                    })) {
                        return {
                            ...state,
                            delete: true,
                            selectedPage: 1
                        }
                    }
                    else {
                        //clear data
                        props.clearPasswordPolicy();
                    }
                } catch (e) {
                    //clear data
                    props.clearPasswordPolicy();
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { deletePolicyData } = this.props.Listdata;
        if (deletePolicyData !== prevProps.Listdata.deletePolicyData) {
            try {
                if (this.state.delete) {
                    this.setState({ delete: false })
                    //Check delete Response 
                    showAlert(R.strings.Success, deletePolicyData.ReturnMsg + '\n' + ' ', 0, () => {
                        //clear data 
                        this.props.clearPasswordPolicy();
                        this.request = {
                            PageIndex: 1,
                            Page_Size: this.state.PageSize,
                        }

                        //call api passwordPolicyList
                        this.props.passwordPolicyList(this.request)
                    });
                }
            } catch (error) {
                //clear data 
                this.props.clearPasswordPolicy();
            }
        }
    }

    deletePolicy = async (item) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let DeviceId = await getDeviceID()
            let IPAddress = await getIPAddress()
            showAlert(R.strings.Delete, R.strings.delete_message, 3, () => {
                //To delete request */ 
                let deletePolicyRequest = {
                    Id: item.Id,
                    DeviceId: DeviceId,
                    Mode: ServiceUtilConstant.Mode,
                    IPAddress: IPAddress,
                    HostName: ServiceUtilConstant.hostName,
                }

                //call deletePasswordPolicy api
                this.props.deletePasswordPolicy(deletePolicyRequest);
            }, R.strings.cancel, async () => { })
        }
    }

    /* this method is called when page change and also api call */
    onPageChange = async (pageNo) => {
        if (this.state.selectedPage !== pageNo) {
            this.setState({ selectedPage: pageNo });
            //Check NetWork is Available or not
            if (await isInternet()) {
                this.Request = {
                    PageIndex: this.state.selectedPage,
                    Page_Size: this.state.PageSize,
                }

                //call passwordPolicyList api
                this.props.passwordPolicyList(this.Request)
            }
        }
    }

    render() {

        let finalItems = null;
        const { Loading, isDelete } = this.props.Listdata;

        //for search if response length >0
        if (this.state.response) {
            finalItems = this.state.response.filter(item =>
                ('' + item.PwdExpiretime).includes(this.state.searchInput) ||
                ('' + item.UserId).includes(this.state.searchInput) ||
                ('' + item.MaxfppwdDay).includes(this.state.searchInput) ||
                ('' + item.MaxfppwdMonth).includes(this.state.searchInput) ||
                ('' + item.LinkExpiryTime).includes(this.state.searchInput) ||
                ('' + item.OTPExpiryTime).includes(this.state.searchInput) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.passwordPolicy}
                    nav={this.props.navigation}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    searchable={true}
                    onRightMenuPress={() => 
                        {
                        this.props.navigation.navigate('AddEditPasswordPolicy', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}

                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={isDelete} />

                <View style={{ 
                    flex: 1, 
                    justifyContent: 'space-between' }}
                    >

                    {
                        (Loading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <PasswordPolicyListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                ctx={this}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AddEditPasswordPolicy', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }}
                                                onDelete={() => this.deletePolicy(item)}
                                            />
                                            }

                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            /* For Refresh Functionality In Withdrawal FlatList Item */
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
                                    <ListEmptyComponent module={R.strings.addPasswordPolicy} onPress={() => this.props.navigation.navigate('AddEditPasswordPolicy', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }

                    {/*To Set Pagination View  */}
                    <View>
                        {
                            finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }

                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class PasswordPolicyListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { item, index, size } = this.props
       
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={
                    {
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView 
                    style={{  elevation: R.dimens.listCardElevation,  flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                    }}>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {/* for show lock image */}
                            <ImageTextButton
                                icon={R.images.IC_LOCK}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        {/* for show UserId , date */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextViewHML style={{
                                                fontSize: R.dimens.smallestText,
                                                color: R.colors.textSecondary,
                                            }}>{R.strings.userId + ': '}</TextViewHML>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                                {validateValue(item.UserId) ? validateValue(item.UserId) : '-'}</TextViewHML>
                                        </View>
                                        <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <ImageTextButton
                                                style={{ margin: 0, padding: 0, paddingRight: R.dimens.LineHeight, }}
                                                icon={R.images.IC_TIMER}
                                                iconStyle={{ padding: 0, margin: 0, width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                            />
                                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(convertDateTime(item.CreatedDate))}</TextViewHML>
                                        </View>
                                    </View>

                                    {/* for show passwordExpireTime , maxfppwdDay, maxfppwdMonth,linkExpiryTime,otpExpireTime */}
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                            {R.strings.passwordExpireTime + ': '}</TextViewHML>
                                        <TextViewHML style={{
                                            flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                            marginLeft: R.dimens.widgetMargin
                                        }}>{validateValue(item.PwdExpiretime) ? validateValue(item.PwdExpiretime) : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                            {R.strings.maxfppwdDay + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.MaxfppwdDay) ? validateValue(item.MaxfppwdDay) : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                            {R.strings.maxfppwdMonth + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.MaxfppwdMonth) ? validateValue(item.MaxfppwdMonth) : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                            {R.strings.linkExpiryTime + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.LinkExpiryTime) ? validateValue(item.LinkExpiryTime) : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>
                                            {R.strings.otpExpireTime + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{validateValue(item.OTPExpiryTime) ? validateValue(item.OTPExpiryTime) : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* for show edit ,delete icon */}
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                            <ImageTextButton style={
                                    {
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        alignItems: 'center',  justifyContent: 'center',
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        backgroundColor: R.colors.accent,
                                        marginRight: R.dimens.widgetMargin,
                                    }}
                                icon={R.images.IC_EDIT}
                                onPress={this.props.onEdit} 
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                />
                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.failRed,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_DELETE}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={this.props.onDelete} />
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data password policy 
        Listdata: state.PasswordPolicyReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //list data
        passwordPolicyList: (Request) => dispatch(passwordPolicyList(Request)),
        //delete 
        deletePasswordPolicy: (deletePolicyRequest) => dispatch(deletePasswordPolicy(deletePolicyRequest)),
        //clear 
        clearPasswordPolicy: () => dispatch(clearPasswordPolicy()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(PasswordPolicyListScreen);


