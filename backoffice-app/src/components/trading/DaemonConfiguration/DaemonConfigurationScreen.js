import {
    View,
    FlatList,
    RefreshControl,
    Text
} from 'react-native';
import React, { Component } from 'react';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import { getDaemonData, clearDiamonConfiguration } from '../../../actions/Trading/DaemonConfigureAction'
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class DaemonConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            refreshing: false,
            searchInput: '',
            response: [],
            isFirstTime: true,
        };
        //----------
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Daemon List API 
            this.props.getDaemonData();
            //----------
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
        if (DaemonConfigurationScreen.oldProps !== props) {
            DaemonConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { daemonConfig, loading } = props.appData;

            if (!loading) {
                try {
                    if (daemonConfig != null) {
                        //handle response of API
                        if (validateResponseNew({ response: daemonConfig, isList: true })) {
                            //check News Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
               
                            let res = parseArray(daemonConfig.Response);

                            //for add status static
                            for (var daemonConfigKey in res) {
                                let item = res[daemonConfigKey];
                                if (item.Status == 1)
                                    item.statusStatic = R.strings.Active
                                else
                                    item.statusStatic = R.strings.Inactive
                            }

                            return { ...state, response: res, refreshing: false };
                        }
                        else {
                            return { ...state, refreshing: false, response: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, response: [] };
                }
            }

        }
        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Daemon List API
            this.props.getDaemonData();
            //----------
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        this.props.clearDiamonConfiguration();
    };

    render() {
        //Get loading value For All APIs to handle Progress bar in All Activity
        let { loading } = this.props.appData

        let finalItem = [];

        //for search
        if (this.state.response != undefined) {
            finalItem = this.state.response.filter((item) => (item.statusStatic.toLowerCase().includes(this.state.searchInput.toLowerCase())))
        }
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.daemonConfiguration}
                    rightIcon={R.images.IC_PLUS}
                    isBack={true}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    onRightMenuPress={() => this.props.navigation.navigate('AddEditDaemonConfiguration')}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1, flexDirection: 'column' }}>

                    {/* To Check Response fetch or not if damon is loading = true then display progress bar else display List*/}
                    {(loading && !this.state.refreshing) ?
                        <ListLoader /> :
                        <View style={{ flex: 1 }}>
                            {finalItem.length ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={finalItem}
                                        showsVerticalScrollIndicator={false}
                                        /* render all item in list */
                                        renderItem={({ item, index }) =>
                                            <DaemonConfigurationItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onEdit={() => this.props.navigation.navigate('AddEditDaemonConfiguration', { item, edit: true })}
                                            />
                                        }
                                        /* For Refresh Functionality In FlatList */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                                :
                                <ListEmptyComponent response={finalItem}
                                    module={R.strings.AddDaemon}
                                    onPress={() => this.props.navigation.navigate('AddEditDaemonConfiguration')}
                                />
                            }

                        </View>
                    }
                </View>
            </SafeView>
        );
    };
}

// This Class is used for display record in list
class DaemonConfigurationItem extends Component {
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
        let item = this.props.item;
        let props = this.props;
        let size = props.size;
        let index = props.index;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                    }}>

                        <View style={{ flexDirection: 'row' }}>

                            {/* for show recycle icon */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageTextButton
                                    icon={R.images.ic_recycle}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show IpAddress,port no,url  */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <View >
                                    <Text style={{
                                        flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                        fontFamily: Fonts.MontserratSemiBold,
                                    }}>{item.IPAdd ? item.IPAdd : '-'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.port + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.PortAdd ? item.PortAdd : '-'}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.url + ': '}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Url ? item.Url : '-'}</TextViewHML>
                                </View>
                            </View>

                        </View>

                        {/* for show time and status ,edit icon */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.statusStatic}></StatusChip>

                            <ImageTextButton
                                style={
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 0,
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        padding: R.dimens.CardViewElivation,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={this.props.onEdit} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updates Data For daemon configuration
        appData: state.daemonConfigureReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Daemon configuration list Api Data 
        getDaemonData: () => dispatch(getDaemonData()),
        clearDiamonConfiguration: () => dispatch(clearDiamonConfiguration()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DaemonConfigurationScreen)