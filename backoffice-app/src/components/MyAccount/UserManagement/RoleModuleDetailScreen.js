import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { viewUSerByRoleData, clearRoleModuleData } from '../../../actions/account/UserManagementActions';
import TextViewMR from '../../../native_theme/components/TextViewMR';

class RoleModuleDetailScreen extends Component {

    constructor(props) {
        super(props);

        //item for from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //Define all initial state
        this.state = {
            //item for from List screen 
            itemData: item,
            refreshing: false,
            search: '',
            response: [],
            viewUserByRoleDataState: null,
            isFirstTime: true,
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet is Available or not
        if (await isInternet()) {
            //To get callTopupHistoryApi 
            this.callViewUserByRoleListApi()
        }
    }

    //api call for list and filter reset
    callViewUserByRoleListApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To viewUSerByRoleData list
            this.props.viewUSerByRoleData({ RoleID: this.state.itemData.RoleID });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        //for Data clear on Backpress
        this.props.clearRoleModuleData()
    }

    static oldProps = {};

    //handle reponse 
    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (RoleModuleDetailScreen.oldProps !== props) {
            RoleModuleDetailScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            // Get all upadated field of particular actions
            const { viewUserByRoleData } = props.data;

            if (viewUserByRoleData) {
                try {
                    //if local viewUserByRoleData state is null or its not null and also different then new response then and only then validate response.
                    if (state.viewUserByRoleDataState == null || (state.viewUserByRoleDataState != null && viewUserByRoleData !== state.viewUserByRoleDataState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: viewUserByRoleData, isList: true })) {

                            let res = parseArray(viewUserByRoleData.Data);

                            //for add status static
                            for (var key in res) {
                                let item = res[key];

                                //active
                                if (item.Status == 1) {
                                    item.statusStatic = R.strings.Active
                                }
                                //Inactive
                                else {
                                    item.statusStatic = R.strings.Inactive
                                }
                            }

                            return {
                                ...state, viewUserByRoleDataState: viewUserByRoleData,
                                response: res, refreshing: false,
                            };
                        } else {
                            return { ...state, viewUserByRoleDataState: viewUserByRoleData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    // this method is called when swipe page api call
    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To viewUSerByRoleData list
            this.props.viewUSerByRoleData(
                {
                    RoleID: this.state.itemData.RoleID
                });
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {
        let filteredList = [];

        let { itemData } = this.state

        // For searching functionality
        if (this.state.response.length) {
            filteredList = this.state.response.filter(searchItem => (
                searchItem.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                searchItem.Email.toLowerCase().includes(this.state.search.toLowerCase()) ||
                searchItem.RoleName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                searchItem.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
                searchItem.statusStatic.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        let color

        //set status color based on status
        if (itemData.Status == 1) {
            color = R.colors.successGreen
        }
        else {
            color = R.colors.failRed
        }

        return (

            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set Progress bar as per our theme */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.lpChargeConfigDetailAddEditDeleteFetching} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.roleDetails}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{
                        marginTop: R.dimens.widgetMargin,
                        marginBottom: R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginRight: R.dimens.widget_left_right_margin,
                    }}>
                        <CardView style={{
                            borderRadius: 0,
                            elevation: R.dimens.listCardElevation,
                            borderBottomLeftRadius: R.dimens.margin,
                            borderTopRightRadius: R.dimens.margin,
                        }}>

                            <View>

                                {/* RoleName */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                    <Text style={{
                                        fontSize: R.dimens.mediumText, color: R.colors.textPrimary, textAlign: 'left',
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>
                                        {validateValue(itemData.RoleName)}
                                    </Text>
                                </View>

                                {/* RoleDescription */}
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'space-between',
                                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                                }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'left' }} >
                                        {R.strings.RoleDescription}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, textAlign: 'right' }}>
                                        {validateValue(itemData.RoleDescription)}
                                    </TextViewHML>
                                </View>

                                {/* Status */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'left' }}>{R.strings.status}</TextViewHML>
                                    <TextViewHML style={{ color: color, textAlign: 'right', fontSize: R.dimens.smallestText }}>
                                        {validateValue(itemData.StatusText)}
                                    </TextViewHML>
                                </View>
                            </View>
                        </CardView>
                    </View>

                    <TextViewMR style={{
                        fontSize: R.dimens.mediumText,
                        color: R.colors.textPrimary,
                        margin: R.dimens.margin,
                        marginBottom: R.dimens.widgetMargin,

                    }}>{R.strings.assosiatedUsers}</TextViewMR>

                    {(this.props.data.viewUserByRoleDataLoading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                style={{ flex: 1 }}
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) =>
                                    <RoleModuleDetailItem
                                        index={index}
                                        detailItem={item}
                                        onUpdateAssignRolePress={() => this.props.navigation.navigate('UpdateAssignRoleScreen', { item, onRefresh: this.callViewUserByRoleListApi })}
                                        size={this.state.response.length} />
                                }
                                // assign index as key value list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In FlatList Item
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            <ListEmptyComponent />
                    }
                </ScrollView>
            </SafeView >
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
class RoleModuleDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.detailItem === nextProps.detailItem) {
            return false
        }
        return true
    }

    render() {
        // Get required fields from props
        let { index, size, detailItem } = this.props;

        return (
            // flatlist detailItem animation
            <AnimatableItem>
                
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={this.props.onDetailPress}>
                        <View style={{ flexDirection: 'row' }}>

                            {/* for show image user */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
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
                                    icon={R.images.IC_USER}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {/* for show UserName */}
                                    <Text style={{
                                        flex: 1, fontSize: R.dimens.smallText,
                                        color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold,
                                    }}>{validateValue(detailItem.UserName)}</Text>

                                    {/* for update assign role  */}
                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.yellow,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                            }}
                                        onPress={this.props.onUpdateAssignRolePress}
                                        icon={R.images.IC_CLIPBOARD_CHECKLIST}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    />
                                </View>

                                {/* for show Email */}
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{validateValue(detailItem.Email)}</TextViewHML>

                                {/* for show RoleName */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.RoleName + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                        {validateValue(detailItem.RoleName)}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show status , date */}
                        <View style={{
                            flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: R.dimens.widgetMargin
                        }}>
                            <StatusChip
                                color={detailItem.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={detailItem.statusStatic} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(detailItem.CreatedDate)}</TextViewHML>
                            </View>

                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For UserManagementReducer Data 
    let data = {
        ...state.UserManagementReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform viewUSerByRoleData List Action 
        viewUSerByRoleData: (payload) => dispatch(viewUSerByRoleData(payload)),
        //Perform clearRoleModuleData Action 
        clearRoleModuleData: () => dispatch(clearRoleModuleData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(RoleModuleDetailScreen);