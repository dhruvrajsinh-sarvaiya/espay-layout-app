import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import PaginationWidget from '../../widget/PaginationWidget';
import { getRuleFieldList, clearRuleFieldData } from '../../../actions/account/RuleFieldsAction';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';

class RuleFieldsListScreen extends Component {
    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            ruleFieldListData: null,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            row: [],
            statusId: null,
            changedStatus: null,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call referral list Api 
            this.props.getRuleFieldList(this.Request)
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // Stop twice api calling
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
            }

            //call referral list Api 
            this.props.getRuleFieldList(this.Request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        // set number one page if add edit success from add or update screen
        this.setState({ selectedPage: 1 })
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call referral list Api 
            this.props.getRuleFieldList(this.Request)
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
        if (RuleFieldsListScreen.oldProps !== props) {
            RuleFieldsListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ruleFieldListData, ruleFieldUpdateStatusData } = props.Listdata;

            if (ruleFieldListData) {
                try {
                    if (state.ruleFieldListData == null || (state.ruleFieldListData != null && ruleFieldListData !== state.ruleFieldListData)) {
                        if (validateResponseNew({ response: ruleFieldListData, isList: true, })) {
                            //Set State For Api response 
                            let res = parseArray(ruleFieldListData.Result);

                            for (var keyData in res) {
                                let item = res[keyData];

                                //for add Status static
                                if (item.AccressRight == 0)
                                    item.accressRightText = R.strings.readOnly
                                else if (item.AccressRight == 1)
                                    item.accressRightText = R.strings.write
                                else
                                    item.accressRightText = R.strings.invisible

                                //for add Status static
                                if (item.Status == 1)
                                    item.statusText = R.strings.showText
                                else
                                    item.statusText = R.strings.hideText

                                //for add Required status static
                                if (item.Required == 1)
                                    item.requiredText = R.strings.yes_text
                                else
                                    item.requiredText = R.strings.no
                            }


                            return {
                                ...state,
                                ruleFieldListData,
                                response: res,
                                refreshing: false,
                                row: addPages(ruleFieldListData.TotalCount)
                            }
                        } else {
                            //Set State For Api response 
                            return {
                                ...state,
                                ruleFieldListData,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: []
                    }
                }
            }

            //Check enable status Response 
            if (ruleFieldUpdateStatusData) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: ruleFieldUpdateStatusData, isList: true })) {
                        let res = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : res.findIndex(el => el.FieldID === state.statusId);
                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].Status = state.changedStatus;
                        }
                        props.clearRuleFieldData();
                        return {
                            ...state,
                            response: res,
                            statusId: null,
                            changedStatus: null
                        }

                    }
                    else {
                        props.clearRuleFieldData();
                    }

                } catch (e) {
                    props.clearRuleFieldData();
                }
            }
        }
        return null;
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
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                }

                //call referral list api
                this.props.getRuleFieldList(this.Request)
            }
        }
    }


    render() {
        let finalItems = this.state.response;
        const { ruleFieldListLoading, ruleFieldUpdateStatusLoading } = this.props.Listdata;

        //for search
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.FieldName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.statusText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.accressRightText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.requiredText.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listRuleFields}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddEditRuleFieldScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={ruleFieldUpdateStatusLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {
                        (ruleFieldListLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <RuleFieldsListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AddEditRuleFieldScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }
                                                }
                                            ></RuleFieldsListItem>
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
                                    <ListEmptyComponent module={R.strings.addRuleField} onPress={() => this.props.navigation.navigate('AddEditRuleFieldScreen', { onSuccess: this.onSuccessAddEdit })} />
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
class RuleFieldsListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let props = this.props;
        let index = props.index;
        let size = props.size;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                {/* for show list icon */}
                                <ImageTextButton
                                    icon={R.images.IC_COPY}
                                    style={{
                                        margin: 0, padding: 0,
                                        width: R.dimens.SignUpButtonHeight,
                                        height: R.dimens.SignUpButtonHeight,
                                        backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight,
                                        justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start'
                                    }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />

                                <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>

                                    {/* for show FieldName , module type */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
                                        <Text style={{
                                            fontSize: R.dimens.smallText, color: R.colors.textPrimary,
                                            fontFamily: Fonts.MontserratSemiBold,
                                        }}>{validateValue(item.FieldName)}</Text>
                                        <Text style={{
                                            fontSize: R.dimens.smallText, color: item.AccressRight == 1 ? R.colors.successGreen : R.colors.yellow,
                                            fontFamily: Fonts.MontserratSemiBold,
                                        }}>{item.accressRightText}</Text>
                                    </View>

                                    {/* for show GUID */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                            {R.strings.guid + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                            {validateValue(item.GUID)}</TextViewHML>
                                    </View>

                                    {/* for show moduleGuid */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                            {R.strings.moduleGuid + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                            {validateValue(item.ModulleGUID)}</TextViewHML>
                                    </View>

                                    {/* for required */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                            {R.strings.required + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: item.Required == 1 ? R.colors.successGreen : R.colors.yellow }}>
                                            {validateValue(item.requiredText)}</TextViewHML>
                                    </View>
                                </View>
                            </View>

                            {/* for show Status , edit icon */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }} >
                                <StatusChip
                                    style={{ marginLeft: R.dimens.widgetMargin }}
                                    color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                    value={item.statusText}></StatusChip>

                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: R.colors.accent,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                            marginRight: R.dimens.widgetMargin,
                                        }}
                                    icon={R.images.IC_EDIT}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onEdit} />
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated RuleFieldsBoReducer Data 
        Listdata: state.RuleFieldsBoReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //perform getRuleFieldList data
        getRuleFieldList: (request) => dispatch(getRuleFieldList(request)),
        //perform clearRuleFieldData data
        clearRuleFieldData: (request) => dispatch(clearRuleFieldData(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(RuleFieldsListScreen);


