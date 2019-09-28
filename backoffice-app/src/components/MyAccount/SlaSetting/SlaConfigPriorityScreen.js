import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget';
import { slaConfigurationList, deleteSLAConfiguration, clearSlaConfig } from '../../../actions/account/SlaConfigPriorityAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

class SlaConfigPriorityScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            slaConfigListData: null,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            totalCount: 0,
            row: [],
            delete: false,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call api to slaConfigurationList 
            this.props.slaConfigurationList(this.Request)
        }
        else {
            this.setState({ refreshing: false })
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
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
            }
            //call api to slaConfigurationList 
            this.props.slaConfigurationList(this.Request)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        this.setState({ selectedPage: 1 })
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call api to slaConfigurationList 
            this.props.slaConfigurationList(this.Request)
            //----------
        } else {
            this.setState({ refreshing: false });
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
        if (SlaConfigPriorityScreen.oldProps !== props) {
            SlaConfigPriorityScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { slaConfigListData, deleteSlaConfigData } = props.Listdata;

            if (slaConfigListData) {
                try {
                    if (state.slaConfigListData == null || (state.slaConfigListData != null && slaConfigListData !== state.slaConfigListData)) {
                        if (validateResponseNew({
                            response: slaConfigListData,
                            isList: true,
                        })) {
                            //Set State For Api response 
                            return {
                                ...state,
                                slaConfigListData,
                                response: parseArray(slaConfigListData.ComplaintPriorityGet),
                                refreshing: false,
                                row: addPages(slaConfigListData.TotalCount)
                            }
                        } else {
                            return {
                                ...state,
                                slaConfigListData,
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
                        refreshing: false,
                        row: []
                    }
                }
            }

            //Check delete Response 
            if (deleteSlaConfigData) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: deleteSlaConfigData,
                        isList: false,
                    })) {
                        return {
                            ...state,
                            selectedPage: 1,
                            delete: true,
                        }
                    } else {
                        props.clearSlaConfig();
                    }
                } catch (e) {
                    props.clearSlaConfig();
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {
        const { deleteSlaConfigData } = this.props.Listdata;
        //show delete response
        if (deleteSlaConfigData !== prevProps.Listdata.deleteSlaConfigData) {
            try {
                if (this.state.delete) {
                    this.setState({ delete: false })
                    showAlert(R.strings.Success, deleteSlaConfigData.ReturnMsg + '\n' + ' ', 0, () => {
                        this.props.clearSlaConfig();
                        this.Request = {
                            PageIndex: 1,
                            Page_Size: this.state.PageSize,
                        }

                        //call api to slaConfigurationList 
                        this.props.slaConfigurationList(this.Request)
                    });
                }
            } catch (error) {
                this.props.clearSlaConfig();
            }
        }
    }

    deleteSlaConfig = async (item) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            showAlert(R.strings.Delete, R.strings.delete_message, 3, () => {
                //To delete request */ 
                let deleteSlaConfigRequest = {
                    Id: item.Id,
                }

                //call deleteSLAConfiguration api 
                this.props.deleteSLAConfiguration(deleteSlaConfigRequest);

            }, R.strings.cancel, async () => { })
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind request 
                this.Request = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                }

                //call api to slaConfigurationList 
                this.props.slaConfigurationList(this.Request)

            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    componentWillUnmount() {
        this.props.clearSlaConfig();
    }

    render() {
        let finalItems = this.state.response;
        const { Loading, isDelete } = this.props.Listdata;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.Priority.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.PriorityTime.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.priorityList}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddEditSlaConfigPriority', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={isDelete} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {
                        (Loading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?

                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={finalItems}
                                        renderItem={({ item, index }) => <SlaListItems
                                            item={item}
                                            index={index}
                                            ctx={this}
                                            size={this.state.response.length}
                                            onEdit={() => {
                                                //if any of list item swipeable is on than recenter it
                                                this.props.navigation.navigate('AddEditSlaConfigPriority', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })

                                            }}
                                            onDelete={() => this.deleteSlaConfig(item)}
                                        ></SlaListItems>
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
                                    :
                                    <ListEmptyComponent module={R.strings.AddPriority} onPress={() => this.props.navigation.navigate('AddEditSlaConfigPriority', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }

                    <View>
                        {finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class SlaListItems extends Component {
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
        let { item, size, index } = this.props

        return (
            // Flatlist item animation

            <AnimatableItem>
                <View style={{
                    flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {/*  setting icon  */}
                            <ImageTextButton
                                icon={R.images.IC_SETTINGS_OUTLINE}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />

                            {/*  Priority , date  */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>

                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Priority)}</Text>

                                    <View style={{ flexDirection: 'row', }}>
                                        <ImageTextButton
                                            style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                            icon={R.images.IC_TIMER}
                                            iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                        />
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false))}</TextViewHML>
                                    </View>
                                </View>

                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{validateValue(item.PriorityTime)}</TextViewHML>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>

                            {/*  edit delete icon  */}
                            <ImageTextButton
                                style={
                                    {
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        marginRight: R.dimens.widgetMargin,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={this.props.onEdit}
                            />

                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        backgroundColor: R.colors.failRed,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        alignItems: 'center',
                                    }}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                icon={R.images.IC_DELETE}
                                onPress={this.props.onDelete} />
                        </View>
                    </CardView>

                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {

    return {
        //Updated Data sla config priority
        Listdata: state.SlaConfigPriorityReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform slaConfiguration List Action 
        slaConfigurationList: (request) => dispatch(slaConfigurationList(request)),
        //Perform deleteSLAConfiguration Action 
        deleteSLAConfiguration: (deleteSlaConfigRequest) => dispatch(deleteSLAConfiguration(deleteSlaConfigRequest)),
        //Perform clearSlaConfig  Action  
        clearSlaConfig: () => dispatch(clearSlaConfig()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(SlaConfigPriorityScreen);


