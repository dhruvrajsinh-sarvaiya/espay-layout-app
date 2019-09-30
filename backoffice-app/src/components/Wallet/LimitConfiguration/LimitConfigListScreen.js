import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { getLimitConfigList, clearLimitConfigured, ChangeLimitsConfiguration } from '../../../actions/Wallet/LimitConfigActions';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';

class LimitConfigListScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To call limit configuration api
            this.props.getLimitConfigList({});
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {

        //for Data clear on Backpress
        this.props.clearLimitConfigured();
    };

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
        if (LimitConfigListScreen.oldProps !== props) {
            LimitConfigListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { configureedLimitsData, } = props.data;

            if (configureedLimitsData) {
                try {
                    //if local tradeSummaryLPWiseData state is null or its not null and also different then new response then and only then validate response.
                    if (state.configureedLimitsData == null || (state.configureedLimitsData != null && configureedLimitsData !== state.configureedLimitsData)) {

                        //if tradeSettledData response is success then store array list else store empty list
                        if (validateResponseNew({ response: configureedLimitsData, isList: true })) {
                            let res = parseArray(configureedLimitsData.Details);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.statusText = item.Status === 1 ? R.strings.Active : R.strings.inActive
                                item.kycText = item.IsKYCEnable === 1 ? R.strings.yes_text : R.strings.no;
                            }

                            return { ...state, configureedLimitsData, response: res, refreshing: false };
                        } else {
                            return { ...state, configureedLimitsData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { deleteData } = this.props.data;
        if (deleteData !== prevProps.data.deleteData) {
            //Check delete Response 
            if (deleteData) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: deleteData,
                        isList: false,
                    })) {
                        showAlert(R.strings.Success, R.strings.recordDeletedSuccessfully, 0, () => {

                            this.props.clearLimitConfigured();

                            //To call limit configuration api
                            this.props.getLimitConfigList({})
                        });
                    }
                    else {
                        this.props.clearLimitConfigured();
                    }
                } catch (e) {
                    this.props.clearLimitConfigured();
                }
            }
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To call limit configuration api
            this.props.getLimitConfigList({});
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        //Check NetWork is Available or not
        if (await isInternet()) {
            //call referral list Api 
            this.props.getLimitConfigList({});
        } else {
            this.setState({ refreshing: false });
        }
    }

    onDeletePress = async (item) => {
        if (await isInternet()) {
            let delRequest = { Id: item.Id, Status: 9, }
            showAlert(R.strings.Delete, R.strings.delete_message, 3, () => {
                //To delete request
                this.props.ChangeLimitsConfiguration(delRequest);
            }, R.strings.cancel, async () => { })
        }
    }

    render() {

        let filteredList = [];
        if (this.state.response.length) {

            // for searching functionality
            filteredList = this.state.response.filter(item => (
                item.StrTrnType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.kycText.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <SafeView style={this.styles().container}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress bar */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.deleteLoading} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.configuredLimits}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('LimitConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {(this.props.data.configureedLimitsLoading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) =>
                                    <LimitConfigListItem
                                        index={index}
                                        item={item}
                                        onEdit={() => this.props.navigation.navigate('LimitConfigAddEditScreen', { item, edit: true, onSuccess: this.onSuccessAddEdit })}
                                        onDelete={() => this.onDeletePress(item)}
                                        size={this.state.response.length} />
                                }
                                // assign index as key valye to Withdrawal list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Withdrawal FlatList Item
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            // Displayed Empty Component when no record found 
                            <ListEmptyComponent module={R.strings.addLimitConfiguration} onPress={() => this.props.navigation.navigate('LimitConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                    }
                </View>
            </SafeView>
        );
    }

    // styles for this class
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
class LimitConfigListItem extends Component {
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
        let { index, size, item } = this.props;
        let statusText = ''
        let statusTextColor = R.colors.successGreen
        let icon = R.images.IC_DELETE
        let color = R.colors.failRed

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {
            statusText = R.strings.inActive
            statusTextColor = R.colors.failRed
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {
            statusText = R.strings.active 
        }

        return (
            <AnimatableItem>
                <View style={{  marginRight: R.dimens.widget_left_right_margin,  flex: 1,
                    flexDirection: 'column',
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{  borderBottomLeftRadius: R.dimens.margin,   elevation: R.dimens.listCardElevation,
                        flex: 1,
                        flexDirection: 'column',
                        borderTopRightRadius: R.dimens.margin,
                        padding: 0,
                        borderRadius: 0,
                    }} onPress={this.props.onPress}>

                        <View style={{ padding: R.dimens.WidgetPadding, }}>

                            <View style={{ flexDirection: 'row' }}>
                                {/* for show coin image */}
                                <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                    <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
                                </View>

                                <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
                                    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : '-'}</Text>
                                    </View>

                                    <View style={{ flex: 1, }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.TrnType + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.StrTrnType ? item.StrTrnType : '-'}</TextViewHML>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.kycCompliant + ': '}</TextViewHML>
                                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IsKYCEnable == 0 ? R.strings.no : R.strings.yes_text}</TextViewHML>
                                        </View>
                                    </View>
                                </View>

                            </View>

                            {/* for show status and button for edit,status,delete */}
                            <View style={{ 
                                flex: 1, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                marginTop: R.dimens.widgetMargin, }}
                                >
                                <StatusChip
                                    color={statusTextColor}
                                    value={statusText}>
                                    </StatusChip>
                                <View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <ImageTextButton
                                            style={
                                                {
                                                    marginRight: R.dimens.widgetMargin,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',  backgroundColor: R.colors.accent,
                                                    borderRadius: R.dimens.titleIconHeightWidth,  margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                }}
                                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                                onPress={this.props.onEdit} 
                                                icon={R.images.IC_EDIT}
                                            />

                                        <ImageTextButton
                                            style={
                                                {
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: color,
                                                    borderRadius: R.dimens.titleIconHeightWidth,
                                                    margin: 0,
                                                    padding: R.dimens.CardViewElivation,
                                                }}
                                            icon={icon}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
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
    //Updated Data For configured limits data 
    let data = {
        ...state.LimitConfigReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getLimitConfigList Action 
        getLimitConfigList: (payload) => dispatch(getLimitConfigList(payload)),
        //Perform ChangeLimitsConfiguration delete Action 
        ChangeLimitsConfiguration: (payload) => dispatch(ChangeLimitsConfiguration(payload)),
        //Perform clearLimitConfigured Action 
        clearLimitConfigured: () => dispatch(clearLimitConfigured())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(LimitConfigListScreen);