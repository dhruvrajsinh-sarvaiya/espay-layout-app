import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import R from '../../../native_theme/R';
import { Fonts } from '../../../controllers/Constants';
import { getApiMethodData, updateApiMethod, clearApiMethod } from '../../../actions/ApiKeyConfiguration/ApiMethodAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';

class ListApiMethodScreen extends Component {

    constructor(props) {

        super(props)

        // Define all initial state
        this.state = {
            response: [],
            GetApiMethodListData: null,
            searchInput: '',
            refreshing: false,
            statusId: null,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //call GetApiMethodListData for api call
        this.GetApiMethodListData();
    }

    GetApiMethodListData = async () => {
        // Check NetWork is Available or not
        if (await isInternet()) {
            //For Call api method list
            this.props.getApiMethodData()
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //For Call api method list
            this.props.getApiMethodData()
        } else
            this.setState({ refreshing: false })
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, }
        }

        // To Skip Render if old and new props are equal
        if (ListApiMethodScreen.oldProps !== props) {
            ListApiMethodScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ApiMethodListData, UpdateApiMethodData } = props.ApiMethoddata;

            if (ApiMethodListData) {
                try {
                    if (state.GetApiMethodListData == null || (state.GetApiMethodListData != null && ApiMethodListData !== state.GetApiMethodListData)) {
                        if (validateResponseNew({ response: ApiMethodListData, isList: true, })) {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                refreshing: false,
                                GetApiMethodListData: ApiMethodListData,
                                response: parseArray(ApiMethodListData.Response),
                            })
                        } else {
                            return Object.assign({}, state, {
                                GetApiMethodListData: null,
                                response: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        response: [], refreshing: false,
                    })
                }
            }

            // check for update data is available or not
            if (UpdateApiMethodData) {
                try {
                    if (validateResponseNew({ response: UpdateApiMethodData, isList: true })) {

                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.ID === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = res[findIndexOfChangeID].Status == 1 ? 0 : 1;
                        }

                        // clear reducer
                        props.clearApiMethod();
                        return Object.assign({}, state, {
                            response: res,
                        })

                    }
                } catch (e) {
                    //console.warn(e)
                }
            }

        }
        return null;
    }

    // Render Right Side Menu 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('ListApiMethodAddEditScreen', { edit: false, onSuccess: this.GetApiMethodListData })} />
            </View>
        )
    }

    updateFeature = async (item, status) => {

        // Check NetWork is Available or not
        if (await isInternet()) {

            let socket = parseArray(item.SocketMethods);
            let rest = parseArray(item.RestMethods);

            // Bind request for update api method list
            let request = {
                ID: item.ID,
                IsReadOnly: item.IsReadOnly,
                IsFullAccess: item.IsFullAccess,
                Status: status,
                SocketMethods: socket != null ? Object.keys(item.SocketMethods) : [],
                RestMethods: rest != null ? Object.keys(item.RestMethods) : [],
            }
            this.setState({ statusId: item.ID })

            //Call Update Api method list method
            this.props.updateApiMethod(request);
        }
    }

    render() {
        let finalItems = this.state.response;

        // Loading status for Progress bar which is fetching from reducer
        const { ApiMethodListDataLoading, UpdateApiMethodDataLoading } = this.props.ApiMethoddata;

        //For searching functionality
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.MethodName.toLowerCase().includes(this.state.searchInput.toLowerCase()))
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Statusbar as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.ListApiMethod}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightMenuRenderChilds={this.rightMenuRender()}
                />

                <ProgressDialog isShow={UpdateApiMethodDataLoading} />

                <View style={{ flex: 1, }}>
                    {
                        (ApiMethodListDataLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            // render all item in list
                                            renderItem={({ item, index }) => <ApiMethodListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                response={this.state.response}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('ListApiMethodAddEditScreen', { item: item, edit: true, onSuccess: this.GetApiMethodListData })
                                                }}

                                                onDetailPress={() => {
                                                    this.props.navigation.navigate('ListApiMethodDetailScreen', { item: item })
                                                }}
                                                onUpdateFeature={() => {
                                                    let data = this.state.response;
                                                    let status = data[index].Status == 1 ? 0 : 1
                                                    this.updateFeature(item, status)
                                                }}

                                            ></ApiMethodListItem>
                                            }
                                            // assign index as key value to list item
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
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent module={R.strings.AddApiMethod} onPress={() => this.props.navigation.navigate('ProfileConfigAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ApiMethodListItem extends Component {

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature) {
            return true
        }
        return false
    }

    render() {
        let props = this.props
        let item = props.item;
        let size = props.size;
        let index = props.index;
        //Check Condition For Dispaly Api Access
        let ApiAccess;
        if (item.IsReadOnly == 1) {
            ApiAccess = R.strings.ReadOnly;
        } else {
            ApiAccess = R.strings.FullAccess;
        }

        //Store Enable Disable Status 
        let isEnable = item.Status == 1 ? true : false

        return (
            // flatlist item animation
            <AnimatableItem>

                <View style={{
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={props.onDetailPress}>

                        <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                            {/* for show MethodName and detail icon */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                <Text style={{
                                    flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                    fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.WidgetPadding
                                }}>{item.MethodName ? item.MethodName : '-'}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>

                                    <ImageTextButton
                                        style={{ margin: 0, padding: 0, paddingRight: 0 }}
                                        onPress={this.props.onDetailPress}
                                        icon={R.images.RIGHT_ARROW_DOUBLE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* for show ApiAccess */}
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.ApiAccess + ': '}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{ApiAccess}</TextViewHML>
                            </View>

                            {/* for show time and status */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <FeatureSwitch
                                    isToggle={isEnable}
                                    onValueChange={() => this.props.onUpdateFeature(item)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        paddingBottom: R.dimens.widgetMargin,
                                        paddingTop: R.dimens.widgetMargin,
                                        paddingLeft: R.dimens.widgetMargin,
                                        paddingRight: R.dimens.widgetMargin,
                                    }}
                                />

                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: R.colors.accent,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                        }}
                                    icon={R.images.IC_EDIT}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onEdit} />

                            </View>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data
        ApiMethoddata: state.ApiMethodReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //For Api List Method
        getApiMethodData: () => dispatch(getApiMethodData()),

        //For Update Api List Method
        updateApiMethod: (request) => dispatch(updateApiMethod(request)),

        //For Clear api method list reducer
        clearApiMethod: () => dispatch(clearApiMethod()),

    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ListApiMethodScreen);


