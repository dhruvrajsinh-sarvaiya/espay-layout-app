import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { getTransactionPolicy, clearTransactionPolicy, updateTransactionPolicyStatus } from '../../../actions/Wallet/TransactionPolicyAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';

class TransactionPolicyListScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,
            transactionPolicyData: null,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getTransactionPolicy list
            this.props.getTransactionPolicy();
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearTransactionPolicy();
    };

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        //Check NetWork is Available or not
        if (await isInternet()) {
            //To getTransactionPolicy list
            this.props.getTransactionPolicy();
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
        if (TransactionPolicyListScreen.oldProps !== props) {
            TransactionPolicyListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { transactionPolicyData } = props.data;

            if (transactionPolicyData) {
                try {
                    //if local transactionPolicyData state is null or its not null and also different then new response then and only then validate response.
                    if (state.transactionPolicyData == null || (state.transactionPolicyData != null && transactionPolicyData !== state.transactionPolicyData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: transactionPolicyData, isList: true })) {
                            let res = parseArray(transactionPolicyData.Data);

                            //for add kyc status to response
                            for (var key in res) {
                                let item = res[key];
                                item.kycStatus = item.IsKYCEnable === 1 ? R.strings.yes_text : R.strings.no;
                            }

                            return { ...state, transactionPolicyData, response: res, refreshing: false, };
                        } else {
                            return { ...state, transactionPolicyData, response: [], refreshing: false, };
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
                    TrnPolicyId: item.Id,
                    Status: 9, // delete code 9
                }
                //To call delete TransactionPolicy 
                this.props.deleteTransactionPolicy(Request)
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

                            this.props.clearTransactionPolicy();

                            //To call getTransactionPolicy list apie
                            this.props.getTransactionPolicy();
                        });
                    }
                    else {
                        this.props.clearTransactionPolicy();
                    }
                } catch (e) {
                    this.props.clearTransactionPolicy();
                }
            }
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To getTransactionPolicy list
            this.props.getTransactionPolicy();
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {

        let filteredList = [];

        //all search fields
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.StrTrnType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.RoleName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.AllowedIP.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.AllowedLocation.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.kycStatus.toLowerCase().includes(this.state.search.toLowerCase())
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
                    title={R.strings.transactionPolicies}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('TransactionPolicyAddEditScreen', { onSuccess: this.onSuccessAddEdit })}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                />

                <View style={{
                    justifyContent: 'space-between',
                    flex: 1,
                }}>

                    {(this.props.data.Loading && !this.state.refreshing)
                        ? <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredList}
                                extraData={this.state}
                                renderItem={({ item, index }) =>
                                    <TransactionPolicyListItem
                                        onEdit={() => { this.props.navigation.navigate('TransactionPolicyAddEditScreen', { item, onSuccess: this.onSuccessAddEdit, edit: true }) }}
                                        onDelete={() => this.onDeletePress(item)}
                                        index={index}
                                        item={item}
                                        size={this.state.response.length} />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    refreshing={this.state.refreshing}
                                    progressBackgroundColor={R.colors.background}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            <ListEmptyComponent
                                module={R.strings.addTransactionPolicy} onPress={() => this.props.navigation.navigate('TransactionPolicyAddEditScreen', { onSuccess: this.onSuccessAddEdit })} />
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
class TransactionPolicyListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item } = this.props;

        let statusText = ''
        let color = R.colors.failRed
        let statusTextColor = R.colors.successGreen

        //if status is enable=1 than set status colors
        if (item.Status == 1) {
            statusText = item.StrStatus
            statusTextColor = R.colors.successGreen
        }

        //if status is disable=0 than set status colors
        else if (item.Status == 0) {
            statusTextColor = R.colors.failRed
            statusText = item.StrStatus
        }
        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        padding: 0
                    }}>

                        <View style={{ padding: R.dimens.WidgetPadding, }}>

                            <View style={{ flexDirection: 'row' }}>

                                {/* for show transaction type and RoleName*/}
                                <View style={{
                                    flex: 1, justifyContent: 'center'
                                }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.StrTrnType ? item.StrTrnType : '-'}</Text>
                                        <Text style={{ fontSize: R.dimens.smallText, color: R.colors.yellow, fontFamily: Fonts.MontserratSemiBold, }}>{item.RoleName ? ' - ' + item.RoleName : '-'}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* for show kycOnly, allowedIp, allowedLocation */}
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.kycOnly + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{!isEmpty(item.IsKYCEnable) ? item.IsKYCEnable === 0 ? R.strings.no : R.strings.yes_text : '-'}</TextViewHML>
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

                            {/* for show status and button for edit,status,delete */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                                <StatusChip
                                    value={statusText}
                                    color={statusTextColor}
                                >

                                </StatusChip>
                                <View>

                                    <View style={
                                        { flexDirection: 'row' }}>
                                        <ImageTextButton
                                            style={
                                                {
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                    marginRight: R.dimens.widgetMargin,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: R.colors.accent,
                                                }}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            icon={R.images.IC_EDIT}
                                            onPress={this.props.onEdit} />

                                        <ImageTextButton
                                            style={
                                                {
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: color,
                                                }}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            icon={R.images.IC_DELETE}
                                            onPress={this.props.onDelete} />
                                    </View>
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
    //Updated Data For TransactionPolicyReducer Data 
    let data = {
        ...state.TransactionPolicyReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTransactionPolicy Action 
        getTransactionPolicy: (payload) => dispatch(getTransactionPolicy(payload)),
        //Perform deleteTransactionPolicy Action 
        deleteTransactionPolicy: (payload) => dispatch(updateTransactionPolicyStatus(payload)),
        //clear data
        clearTransactionPolicy: () => dispatch(clearTransactionPolicy())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TransactionPolicyListScreen);