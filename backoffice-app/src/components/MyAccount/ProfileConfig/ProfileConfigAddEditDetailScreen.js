import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import CommonToast from '../../../native_theme/components/CommonToast';
import Button from '../../../native_theme/components/Button';
import { getProfileType, getKYCLevelList, getProfileLevelList, clearProfileConfig, addProfileConfigData, updateProfileConfigData } from '../../../actions/account/ProfileConfigAction';
import { Fonts } from '../../../controllers/Constants';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';

class ProfileConfigAddEditDetailScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {}

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //item for mainmRequest
        let mainmRequest = props.navigation.state.params && props.navigation.state.params.mainmRequest

        //for check redirect from dashboard or not
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        this.state = {
            mainmRequest: mainmRequest,
            edit: edit,
            item: item,
            fromDashboard: fromDashboard,
            tabNames: [R.strings.transaction, R.strings.withdrawal, R.strings.Trade, R.strings.Deposit],
            tabPosition: 0,
            response: edit ? item.TransactionLimit : [],
            TransactionLimit: edit ? item.TransactionLimit : [],
            WithdrawalLimit: edit ? item.WithdrawalLimit : [],
            TradeLimit: edit ? item.TradeLimit : [],
            DepositLimit: edit ? item.DepositLimit : [],
            profileLevelDataState: null,
            kycDataState: null,
            profileTypeDataState: null,
        };
    }

    /* Called when onPage Scrolling */
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    async componentDidUpdate(prevProps, prevState) {

        const { addData, editData } = this.props.data;

        if (addData !== prevProps.data.addData) {
            // for show responce add
            if (addData) {
                try {
                    if (validateResponseNew({
                        response: addData,
                    })) {
                        showAlert(R.strings.Success, addData.ReturnMsg, 0, () => {
                            this.props.clearProfileConfig()
                            if (this.state.fromDashboard) {
                                this.props.navigation.navigate('ProfileConfigDashboard')
                            }
                            else {
                                this.props.navigation.state.params.onSuccess()
                                this.props.navigation.navigate('ProfileConfigListScreen')
                            }
                        });
                    } else {
                        this.props.clearProfileConfig()
                    }
                } catch (e) {
                    this.props.clearProfileConfig()
                }
            }
        }

        if (editData !== prevProps.data.editData) {
            // for show responce update
            if (editData) {
                try {
                    if (validateResponseNew({
                        response: editData
                    })) {
                        showAlert(R.strings.Success, editData.ReturnMsg, 0, () => {
                            this.props.clearProfileConfig()
                            this.props.navigation.state.params.onSuccess()
                            this.props.navigation.navigate('ProfileConfigListScreen')
                        });
                    } else {
                        this.props.clearProfileConfig()
                    }
                } catch (e) {
                    this.props.clearProfileConfig()
                }
            }
        }
    }

    //For Getting Data of Adding new Route Static
    getResponseFromAdd = (AddResponse) => {
        //check for response available or not
        if (AddResponse) {
            if (this.state.tabPosition == 0) {
                //selected tab 0 than TransactionLimit 
                let TransactionLimit = this.state.TransactionLimit
                TransactionLimit.push(AddResponse);
                this.setState({ TransactionLimit: TransactionLimit });
            }
            else if (this.state.tabPosition == 1) {
                //selected tab 1 than WithdrawalLimit 
                let WithdrawalLimit = this.state.WithdrawalLimit
                WithdrawalLimit.push(AddResponse);
                this.setState({ WithdrawalLimit: WithdrawalLimit });
            }
            else if (this.state.tabPosition == 2) {
                //selected tab 2 than TradeLimit 
                let TradeLimit = this.state.TradeLimit
                TradeLimit.push(AddResponse);
                this.setState({ TradeLimit: TradeLimit });
            }
            else if (this.state.tabPosition == 3) {
                //selected tab 3 than DepositLimit 
                let DepositLimit = this.state.DepositLimit
                DepositLimit.push(AddResponse);
                this.setState({ DepositLimit: DepositLimit });
            }
        }
    }

    //For Getting Data of Update response by index
    getResponseFromEdit = (EditResponse, EditItemindex) => {

        //check for response available or not
        if (EditResponse) {
            //selected tab 0 than TransactionLimit 
            if (this.state.tabPosition == 0) {
                let res = this.state.TransactionLimit
                res[EditItemindex] = EditResponse
                this.setState({ TransactionLimit: res });
            }
            //selected tab 1 than WithdrawalLimit 
            else if (this.state.tabPosition == 1) {
                let res = this.state.WithdrawalLimit
                res[EditItemindex] = EditResponse
                this.setState({ WithdrawalLimit: res });
            }
            //selected tab 2 than TradeLimit 
            else if (this.state.tabPosition == 2) {
                let res = this.state.TradeLimit
                res[EditItemindex] = EditResponse
                this.setState({ TradeLimit: res });
            }
            //selected tab 3 than DepositLimit 
            else if (this.state.tabPosition == 3) {
                let res = this.state.DepositLimit
                res[EditItemindex] = EditResponse
                this.setState({ DepositLimit: res });
            }
        }
    }


    submitData = async () => {

        //toast for validations
        let msg = R.strings.pleaseConfigure

        if (this.state.TransactionLimit.length == 0) {
            msg = msg + ',' + R.strings.transactionLimit
        }
        if (this.state.WithdrawalLimit.length == 0) {
            msg = msg + ',' + R.strings.withdrawalLimit
        }
        if (this.state.TradeLimit.length == 0) {
            msg = msg + ',' + R.strings.tradeLimit
        }
        if (this.state.DepositLimit.length == 0) {
            msg = msg + ',' + R.strings.depositLimit
        }
        if (this.state.TransactionLimit.length == 0 || this.state.WithdrawalLimit.length == 0 ||
            this.state.TradeLimit.length == 0 || this.state.DepositLimit.length == 0) {
            this.toast.Show(msg);
            return
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request 
            this.request = {
                ...this.state.mainmRequest,
                TransactionLimit: this.state.TransactionLimit,
                WithdrawalLimit: this.state.WithdrawalLimit,
                DepositLimit: this.state.DepositLimit,
                TradeLimit: this.state.TradeLimit
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    Id: this.state.item.Id,
                }
                //call updateProfileConfigData api
                this.props.updateProfileConfigData(this.request)
            }
            else {
                //call addProfileConfigData api
                this.props.addProfileConfigData(this.request)
            }
        }
    }

    //handle to delete records statically 
    onDeletePress = (item, index) => {
        // for show selected Record in Dialog

        showAlert(
            R.strings.Delete + '!',
            R.strings.delete_message,
            6,
            async () => {
                //selected tab 0 than TransactionLimit 
                if (this.state.tabPosition == 0) {
                    let TransactionLimit = this.state.TransactionLimit
                    TransactionLimit.splice(index, 1);
                    this.setState({ TransactionLimit })
                }
                //selected tab 1 than WithdrawalLimit 
                else if (this.state.tabPosition == 1) {
                    let WithdrawalLimit = this.state.WithdrawalLimit
                    WithdrawalLimit.splice(index, 1);
                    this.setState({ WithdrawalLimit })
                }
                //selected tab 2 than TradeLimit 
                else if (this.state.tabPosition == 2) {
                    let TradeLimit = this.state.TradeLimit
                    TradeLimit.splice(index, 1);
                    this.setState({ TradeLimit })
                }
                //selected tab 3 than DepositLimit 
                else if (this.state.tabPosition == 3) {
                    let DepositLimit = this.state.DepositLimit
                    DepositLimit.splice(index, 1);
                    this.setState({ DepositLimit })
                }
            },
            R.strings.no_text,
            () => { }, R.strings.yes_text
        )
    }

    render() {
        let filteredList = [];
        let title = ''
        //selected tab 0 than TransactionLimit 
        if (this.state.tabPosition == 0) {
            filteredList = this.state.TransactionLimit;
            title = R.strings.addTransactionLimit
        }
        //selected tab 1 than WithdrawalLimit 
        else if (this.state.tabPosition == 1) {
            filteredList = this.state.WithdrawalLimit;
            title = R.strings.addWithdrawalLimit
        }
        //selected tab 2 than TradeLimit 
        else if (this.state.tabPosition == 2) {
            filteredList = this.state.TradeLimit;
            title = R.strings.addTradeLimit
        }
        //selected tab 3 than DepositLimit 
        else if (this.state.tabPosition == 3) {
            filteredList = this.state.DepositLimit;
            title = R.strings.addDepositLimit
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateLimit : R.strings.addLimit}
                    isBack={true} nav={this.props.navigation}
                    rightIcon={/* !this.state.edit && */ R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('ProfileConfigdDetailSubAddEdit', { getResponseFromAdd: this.getResponseFromAdd, tabPosition: this.state.tabPosition })}
                />

                {/* for progress dialog */}
                <ProgressDialog isShow={
                    this.props.data.editLoading ||
                    this.props.data.addLoading
                } />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>


                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='tabs'
                        style={{ flexDirection: 'column-reverse', }}
                        titles={this.state.tabNames}
                        numOfItems={4}
                        horizontalScroll={false}
                        isGradient={true}
                        onPageScroll={this.onPageScroll}>

                        {this.state.tabNames.map((tabItem) =>
                            <View key={tabItem} style={{ flex: 1 }}>

                                {filteredList.length > 0 ?
                                    <FlatList
                                        data={filteredList}
                                        extraData={this.state}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) =>
                                            <ProfileConfigAddEditDetailItem
                                                index={index}
                                                item={item}
                                                edit={this.state.edit}
                                                onDelete={() => this.onDeletePress(item, index)}
                                                onEdit={() => this.props.navigation.navigate('ProfileConfigDetailSubAddEdit', { item, edit: true, index: index, getResponseFromEdit: this.getResponseFromEdit, tabPosition: this.state.tabPosition })}
                                                size={filteredList.length} />
                                        }
                                        keyExtractor={(_item, index) => index.toString()}

                                    />
                                    :
                                    <ListEmptyComponent module={title} onPress={() => this.props.navigation.navigate('ProfileConfigdDetailSubAddEdit', { getResponseFromAdd: this.getResponseFromAdd, tabPosition: this.state.tabPosition })} />
                                }
                            </View>
                        )}
                    </IndicatorViewPager>
                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={this.submitData}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }
}

// This Class is used for display record in list
class ProfileConfigAddEditDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Get required fields from props
        let { index, size, item } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                            <ImageViewWidget url={item.CurrancyName ? item.CurrancyName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* for show currency  */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CurrancyName)}</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: R.dimens.widgetMargin }}>

                                        <ImageTextButton
                                            style={
                                                {
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: R.colors.accent,
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                    marginRight: R.dimens.WidgetPadding,
                                                }}
                                            icon={R.images.IC_EDIT}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            onPress={this.props.onEdit} />
                                        {size > 1 &&
                                            <ImageTextButton
                                                style={
                                                    {
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: R.colors.failRed,
                                                        borderRadius: R.dimens.titleIconHeightWidth,
                                                        margin: 0,
                                                        padding: R.dimens.CardViewElivation,
                                                        marginRight: R.dimens.WidgetPadding,
                                                    }}
                                                icon={R.images.IC_DELETE}
                                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                                onPress={this.props.onDelete} />}
                                    </View>
                                </View>
                            </View>
                        </View >

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>

                                {/* for show hourly Daily Monthly Qauterly  Yearly */}
                                <View style={{ flex: 1, }}>

                                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.hourly + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Hourly)}</TextViewHML>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.daily + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Daily)}</TextViewHML>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.weekly + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Weekly)}</TextViewHML>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.monthly + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Monthly)}</TextViewHML>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.quaterly + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Qauterly)}</TextViewHML>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.yearly + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.Yearly)}</TextViewHML>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For ProfileConfigReducer Data 
    let data = {
        ...state.ProfileConfigReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getProfileType Action 
        getProfileType: () => dispatch(getProfileType()),
        //Perform getKYCLevelList Action 
        getKYCLevelList: () => dispatch(getKYCLevelList()),
        //Perform getProfileLevelList Action 
        getProfileLevelList: () => dispatch(getProfileLevelList()),
        //clear reducer 
        clearProfileConfig: () => dispatch(clearProfileConfig()),
        //Perform addProfileConfigData Action 
        addProfileConfigData: (request) => dispatch(addProfileConfigData(request)),
        //Perform updateProfileConfigData Action 
        updateProfileConfigData: (request) => dispatch(updateProfileConfigData(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ProfileConfigAddEditDetailScreen);