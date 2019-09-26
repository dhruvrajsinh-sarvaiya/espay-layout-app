import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { getWithdrawRouteList, deleteWithdrawRoute, clearAddressGenrationData } from '../../../actions/Wallet/AddressGenrationRouteAction';
import ImageViewWidget from '../../widget/ImageViewWidget';

class AddressGenrationRoute extends Component {

    constructor(props) {
        super(props);

        // TrnType=9 for address genration route else withdraw route
        let TrnType = props.navigation.state.params && props.navigation.state.params.TrnType

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            //For Drawer First Time Close
            isDrawerOpen: false,
            stakingList: null,
            walletData: null,
            TrnType: TrnType,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //call getWithdrawRouteList 
        this.callGetWithdrawRouteList()
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearAddressGenrationData();
    };

    //call getWithdrawRouteList 
    callGetWithdrawRouteList = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To get getWithdrawRouteList list
            this.props.getWithdrawRouteList({ TrnType: this.state.TrnType });
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

        // To Skip Render if old and new props are equal`
        if (AddressGenrationRoute.oldProps !== props) {
            AddressGenrationRoute.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { withdrawRouteList } = props.data;

            if (withdrawRouteList) {
                try {
                    //if local withdrawRouteList state is null or its not null and also different then new response then and only then validate response.
                    if (state.withdrawRouteList == null || (state.withdrawRouteList != null && withdrawRouteList !== state.withdrawRouteList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: withdrawRouteList, isList: true })) {
                            let res = parseArray(withdrawRouteList.Response);

                            //for add status
                            for (var withdrawRouteListKey in res) {
                                let item = res[withdrawRouteListKey];
                                item.statusText = item.status === 1 ? R.strings.Active : R.strings.Inactive;
                            }

                            return { ...state, withdrawRouteList, response: res, refreshing: false, };
                        } else {
                            return { ...state, withdrawRouteList, response: [], refreshing: false, };
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
                    ServiceID: item.ServiceID,
                    status: 9,
                    AvailableRoute: [],
                    TrnType: this.state.TrnType,
                    CurrencyName: "",
                }

                this.props.deleteWithdrawRoute(Request)
            }
        }, R.strings.cancel)
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { deleteRoute } = this.props.data;
        if (deleteRoute !== prevProps.data.deleteRoute) {
            //Check delete Response 
            if (deleteRoute) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: deleteRoute,
                        isList: false,
                    })) {
                        showAlert(R.strings.Success, R.strings.delete_success + '\n' + ' ', 0, () => {

                            this.props.clearAddressGenrationData();

                            //To call address genration list api
                            this.callGetWithdrawRouteList();
                        });
                    }
                    else {
                        this.props.clearAddressGenrationData();
                    }
                } catch (e) {
                    this.props.clearAddressGenrationData();
                }
            }
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getWithdrawRouteList list
            this.props.getWithdrawRouteList({ TrnType: this.state.TrnType });
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {

        let filteredList = [];

        // for searching
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.CurrencyName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set Progress bar as per our theme */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.deleteRouteFetching} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.TrnType == 9 ? R.strings.addressGenrationRoute : R.strings.withdrawRoute}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('AddressGenrationRouteDetail', { onSuccess: this.callGetWithdrawRouteList, TrnType: this.state.TrnType })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {(this.props.data.loading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <AddressGenrationRouteItem
                                        index={index}
                                        item={item}
                                        onEdit={() => { this.props.navigation.navigate('AddressGenrationRouteDetail', { item, onSuccess: this.callGetWithdrawRouteList, edit: true, TrnType: this.state.TrnType }) }}
                                        onDelete={() => this.onDeletePress(item)}
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
                            <ListEmptyComponent module={R.strings.addressGenrationRoute} onPress={() => this.props.navigation.navigate('AddressGenrationRouteDetail', { onSuccess: this.callGetWithdrawRouteList, TrnType: this.state.TrnType })} />
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
class AddressGenrationRouteItem extends Component {
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

        let statusTextColor = R.colors.failRed
        let color = R.colors.failRed

        //if status is active=1 than set icons and colors
        if (item.status == 1) {
            statusTextColor = R.colors.successGreen
        }

        return (
            <AnimatableItem>
                <View 
                style=
                {{ flex: 1,  marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{  borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        padding: R.dimens.WidgetPadding,
                        borderRadius: 0,
                    }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            {/* for show coin image */}
                            <ImageViewWidget url={item.CurrencyName ? item.CurrencyName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ paddingLeft: R.dimens.widgetMargin, }}>
                                <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.CurrencyName)}</Text>
                            </View>

                        </View>
                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.margin, }}>
                            <StatusChip
                                color={statusTextColor}
                                value={item.statusText}></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>

                                    <ImageTextButton
                                        style={
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                                backgroundColor: R.colors.accent,  borderRadius: R.dimens.titleIconHeightWidth,  margin: 0,
                                            }}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton  icon={R.images.IC_DELETE} style={
                                            {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                backgroundColor: color,
                                                padding: R.dimens.CardViewElivation,
                                            }} 
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, 
                                            height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onDelete} />
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
    //Updated Data For AddressGenrationRouteReducer Data 
    let data = {
        ...state.AddressGenrationRouteReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWithdrawRouteList Action 
        getWithdrawRouteList: (payload) => dispatch(getWithdrawRouteList(payload)),
        //Perform deleteWithdrawRoute Action 
        deleteWithdrawRoute: (payload) => dispatch(deleteWithdrawRoute(payload)),
        //clear data
        clearAddressGenrationData: () => dispatch(clearAddressGenrationData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AddressGenrationRoute);