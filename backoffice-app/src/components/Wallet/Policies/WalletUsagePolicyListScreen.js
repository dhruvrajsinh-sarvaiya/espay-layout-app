import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { getWalletUsagePolicy, clearWalletPolicy, updateWalletUsagePolicyStatus } from '../../../actions/Wallet/WalletUsagePolicyAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';

class WalletUsagePolicyListScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,
            walletUsagePolicyData: null,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getWalletUsagePolicy list
            this.props.getWalletUsagePolicy();
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearWalletPolicy();
    };

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        //Check NetWork is Available or not
        if (await isInternet()) {
            //To getWalletUsagePolicy list
            this.props.getWalletUsagePolicy();
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
        if (WalletUsagePolicyListScreen.oldProps !== props) {
            WalletUsagePolicyListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletUsagePolicyData } = props.data;

            if (walletUsagePolicyData) {
                try {
                    //if local walletUsagePolicyData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletUsagePolicyData == null || (state.walletUsagePolicyData != null && walletUsagePolicyData !== state.walletUsagePolicyData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletUsagePolicyData, isList: true })) {
                            let res = parseArray(walletUsagePolicyData.Details);

                            return { ...state, walletUsagePolicyData, response: res, refreshing: false, };
                        } else {
                            return { ...state, walletUsagePolicyData, response: [], refreshing: false, };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, };
                }
            }
        }
        return null;
    }

    onDeletePress = async (item) => {
        showAlert(R.strings.Delete_Record, R.strings.areyousure, 3, async () => {
            if (await isInternet()) {
                let Request = {
                    id: item.Id,
                    status: 9, // delete code 9
                }

                //To call delete Wallet Usage Policy 
                this.props.deleteWalletUsagePolicy(Request)
            }
        }, R.strings.cancel)
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { updateStatus } = this.props.data;
        if (updateStatus !== prevProps.data.updateStatus) {
            //Check delete Response 
            if (updateStatus) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: updateStatus,
                        isList: false,
                    })) {
                        showAlert(R.strings.Success, R.strings.delete_success + '\n' + ' ', 0, () => {

                            this.props.clearWalletPolicy();

                            //To call getWalletUsagePolicy list apie
                            this.props.getWalletUsagePolicy();
                        });
                    }
                    else {
                        this.props.clearWalletPolicy();
                    }
                } catch (e) {
                    this.props.clearWalletPolicy();
                }
            }
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To getWalletUsagePolicy list
            this.props.getWalletUsagePolicy();
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {

        let filteredList = [];

        //all search fields
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.WalletType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.PolicyName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.AllowedIP.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.AllowedLocation.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set Progress bar as per our theme */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.isUpdateStatus} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    searchable={true}
                    title={R.strings.walletUsagePolicies} isBack={true}
                    onSearchText={(input) => this.setState({ search: input })} rightIcon={R.images.IC_PLUS}
                    nav={this.props.navigation}
                    onRightMenuPress={() => this.props.navigation.navigate('WalletUsagePolicyAddEditScreen', { onSuccess: this.onSuccessAddEdit })}
                />

                <View
                    style={{ flex: 1, justifyContent: 'space-between' }}>

                    {(this.props.data.Loading && !this.state.refreshing)
                        ? <ListLoader /> :
                        filteredList.length > 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredList}
                                extraData={this.state}
                                renderItem={({ item, index }) =>
                                    <WalletUsagePolicyListItem
                                        index={index}
                                        onDelete={() => this.onDeletePress(item)}
                                        item={item}
                                        onEdit={() => { this.props.navigation.navigate('WalletUsagePolicyAddEditScreen', { item, onSuccess: this.onSuccessAddEdit, edit: true }) }}
                                        size={this.state.response.length} />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            <ListEmptyComponent module={R.strings.addWalletUsagePolicy} onPress={() => this.props.navigation.navigate('WalletUsagePolicyAddEditScreen', { onSuccess: this.onSuccessAddEdit })} />
                    }
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class WalletUsagePolicyListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            { return false }
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item } = this.props;

        let color = R.colors.failRed
        let statusText = ''
        let statusTextColor = R.colors.successGreen

        //if status is active=1 than set status colors
        if (item.Status == 1) { 
            statusText = item.StrStatus
        }

        //if status is inactive=0 than set status colors
        else if (item.Status == 0) {
            statusText = item.StrStatus
            statusTextColor = R.colors.failRed
        }
        return (
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation, flex: 1,
                        padding: R.dimens.WidgetPadding,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row' }}>

                            {/* for show coin image */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageViewWidget url={item.WalletType ? item.WalletType : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
                            </View>

                            {/* for show WalletType, ChargeValueType  */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(item.WalletType ? item.WalletType : '-')}
                                    </Text>
                                </View>

                                {/* for show PolicyName, allowedIp, allowedLocation */}
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.PolicyName + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.PolicyName ? item.PolicyName : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.allowedIp + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.AllowedIP ? item.AllowedIP : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.allowedLocation + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.AllowedLocation ? item.AllowedLocation : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusTextColor}
                                value={statusText}></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                                alignItems: 'center',
                                                backgroundColor: R.colors.yellow,
                                            }}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        icon={R.images.IC_EDIT}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        style={
                                            {
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                justifyContent: 'center',
                                                backgroundColor: color,
                                                padding: R.dimens.CardViewElivation,
                                                alignItems: 'center',
                                            }}
                                        onPress={this.props.onDelete}
                                        icon={R.images.IC_DELETE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    />
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
    //Updated Data For WalletUsagePolicyReducer Data 
    let data = {
        ...state.WalletUsagePolicyReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletUsagePolicy Action 
        getWalletUsagePolicy: (payload) => dispatch(getWalletUsagePolicy(payload)),
        //Perform deleteWalletUsagePolicy Action 
        deleteWalletUsagePolicy: (payload) => dispatch(updateWalletUsagePolicyStatus(payload)),
        //clear data
        clearWalletPolicy: () => dispatch(clearWalletPolicy())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(WalletUsagePolicyListScreen);