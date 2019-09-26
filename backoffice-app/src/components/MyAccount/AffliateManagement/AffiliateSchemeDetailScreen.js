// AffiliateSchemeDetailScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, addPages, parseFloatVal } from '../../../controllers/CommonUtils';
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
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { affiliateSchemeDetailList, changeAffiliateSchemeDetailStatus, affiliateSchemeDetailClear } from '../../../actions/account/AffiliateSchemeDetailAction';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageViewWidget from '../../widget/ImageViewWidget';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateSchemeDetailScreen extends Component {

    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            searchInput: '',
            refreshing: false,
            response: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            statusId: null,
            changedStatus: null,
            row: [],
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            // Bind Request for detail list
            this.Request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //call affliate Scheme Detail Api 
            this.props.affiliateSchemeDetailList(this.Request)
        }
    }

    shouldComponentUpdate = (nextProps) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        // clear reducer data
        this.props.affiliateSchemeDetailClear();
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            // Bind Request for detail list
            this.Request = {
                PageSize: this.state.PageSize,
                PageNo: this.state.selectedPage - 1,
            }

            //call affliate Scheme Detail Api 
            this.props.affiliateSchemeDetailList(this.Request)
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
            // Bind Request for detail list
            this.Request = {
                PageSize: this.state.PageSize,
                PageNo: 0,
            }

            //call affliate Scheme Detail Api 
            this.props.affiliateSchemeDetailList(this.Request)
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
        if (AffiliateSchemeDetailScreen.oldProps !== props) {
            AffiliateSchemeDetailScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated data of Particular actions
            const { schemeDetailListData, schemeDetailListDataFetch, changeDetailStatusData, changeDetailStatusDataFetch } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!schemeDetailListDataFetch) {
                try {
                    if (validateResponseNew({ response: schemeDetailListData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var res = parseArray(schemeDetailListData.Data);
                        return { ...state, response: res, refreshing: false, row: addPages(schemeDetailListData.TotalCount) };
                    }
                    else {
                        return { ...state, response: [], refreshing: false, row: [] };
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            //Check enable status Response 
            if (!changeDetailStatusDataFetch) {
                try {
                    //Get Api response
                    if (validateResponseNew({ response: changeDetailStatusData, isList: true })) {
                        let resItem = state.response;
                        let findIndexOfChangeID = state.statusId == null ? -1 : resItem.findIndex(el => el.DetailId === state.statusId);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            resItem[findIndexOfChangeID].Status = state.changedStatus;
                        }

                        props.affiliateSchemeDetailClear();
                        return {
                            ...state,
                            response: resItem,
                            statusId: null,
                            changedStatus: null
                        }
                    }
                    else {
                        props.affiliateSchemeDetailClear();
                    }

                } catch (e) {
                    props.affiliateSchemeDetailClear();
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
                // Bind Request for detail list
                this.Request = {
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                }

                //call affliate Scheme Detail Api 
                this.props.affiliateSchemeDetailList(this.Request)
            }
        }
    }

    onUpdateStatus = async (item, isDelete) => {

        let status

        //if status is inactive=0 than set status call for active 
        if (item.Status == 0) {
            //if status is inactive=0 and delete than call for delete
            if (isDelete) {
                status = 9
            } else {
                status = 1
            }
        }

        //if status is active=1 than set status call for inactive 
        else if (item.Status == 1) {
            //if status is active=0 and delete than call for delete
            if (isDelete) {
                status = 9
            } else {
                status = 0
            }
        }

        //if status is delete=9 than set status call for inactive 
        else if (item.Status == 9) {
            if (isDelete) {
                status = 0
            } else {
                status = 1
            }
        }

        // check Network is Available or not
        if (await isInternet()) {
            // Bind Request forchange  detail status
            this.request = {
                Status: status,
                DetailId: item.DetailId,
            }

            this.setState({
                statusId: item.DetailId,
                changedStatus: status
            })
            // call api for change status of scheme detail
            this.props.changeAffiliateSchemeDetailStatus(this.request);
        }
    }

    render() {

        const { isSchemeDetailListFetch, isChangeDetailStatusFetch } = this.props;

        let finalItems = this.state.response;

        //for search
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.SchemeMappingName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreditWalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CommissionTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.DistributionTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                ('' + item.CommissionValue).includes(this.state.searchInput) ||
                ('' + item.Level).includes(this.state.searchInput) ||
                ('' + item.MinimumValue).includes(this.state.searchInput) ||
                ('' + item.MaximumValue).includes(this.state.searchInput)
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.listAffiliateSchemeDetail}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AffiliateSchemeDetailAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* Progress Dialog Display  */}
                {<ProgressDialog isShow={isChangeDetailStatusFetch} />}

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Check Response fetch or not if isSchemeDetailListFetch = true then display progress bar else display List*/}
                    {
                        (isSchemeDetailListFetch && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) => <AffiliateSchemeDetailItem
                                                size={this.state.response.length}
                                                index={index}
                                                onDeleteStatusChange={() => this.onUpdateStatus(item, true)}
                                                onStatusChange={() => this.onUpdateStatus(item, false)}
                                                item={item}
                                                onEdit={() => {
                                                    this.props.navigation.navigate('AffiliateSchemeDetailAddEditScreen', { item: item, edit: true, onSuccess: this.onSuccessAddEdit })
                                                }
                                                }
                                            />
                                            }
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Withdrawal FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={this.state.refreshing}
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    onRefresh={this.onRefresh}
                                                />
                                            }
                                        />
                                    </View>
                                    :
                                    <ListEmptyComponent module={R.strings.addAffiliateSchemeDetail} onPress={() => this.props.navigation.navigate('AffiliateSchemeDetailAddEditScreen', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }

                    {/* show pagination   */}
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
class AffiliateSchemeDetailItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        let delColor = R.colors.failRed
        let item = this.props.item;
        let size = props.size;
        let delIcon = R.images.IC_DELETE
        let icon = R.images.IC_CHECKMARK
        let color = R.colors.failRed
        let statusText = ''
        let statusTextColor = R.colors.successGreen
        let index = props.index;

        //if status is inactive=0 than set icons and colors
        if (item.Status == 0) {
            color = R.colors.successGreen
            icon = R.images.IC_CHECKMARK

            delColor = R.colors.failRed
            delIcon = R.images.IC_DELETE

            statusTextColor = R.colors.yellow
            statusText = R.strings.inActive
        }

        //if status is active=1 than set icons and colors
        else if (item.Status == 1) {
            icon = R.images.IC_CANCEL
            color = R.colors.yellow

            delColor = R.colors.failRed
            delIcon = R.images.IC_DELETE

            statusText = R.strings.active
            statusTextColor = R.colors.successGreen
        }

        //if status is Delete=9 than set icons and colors
        else if (item.Status == 9) {
            color = R.colors.successGreen
            icon = R.images.IC_CHECKMARK

            delIcon = R.images.IC_CANCEL
            delColor = R.colors.yellow

            statusTextColor = R.colors.failRed
            statusText = R.strings.Delete
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row' }}>
                            {/* for show coin image */}
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                <ImageViewWidget url={item.CreditWalletTypeName ? item.CreditWalletTypeName : ''} width={R.dimens.SignUpButtonHeight} height={R.dimens.SignUpButtonHeight} />
                            </View>

                            {/* for show scheme mapping name, level, commissionType, distributionType*/}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <View style={{ flex: 1, justifyContent: "space-between", flexDirection: 'row' }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{item.SchemeMappingName ? item.SchemeMappingName : '-'}</Text>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{'LV. '}{item.Level === '' ? '-' : item.Level}</TextViewHML>
                                </View>

                                <View style={{ flex: 1, }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.commissionType + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.CommissionTypeName ? item.CommissionTypeName : '-'}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.distributionType + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.DistributionTypeName ? item.DistributionTypeName : '-'}</TextViewHML>
                                    </View>
                                </View>
                            </View>

                        </View>

                        {/* for show minimumvalue, maximum value, commission value */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'center' }}>{R.strings.minivalue}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}> {(parseFloatVal(item.MinimumValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MinimumValue).toFixed(8)) : '-')}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'center' }}>{R.strings.maxivalue}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}> {(parseFloatVal(item.MaximumValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.MaximumValue).toFixed(8)) : '-')}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'center' }}>{R.strings.commValue}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}> {(parseFloatVal(item.CommissionValue).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.CommissionValue).toFixed(8)) : '-')}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                value={statusText}
                                color={statusTextColor}
                            ></StatusChip>
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                margin: 0,
                                                alignItems: 'center',
                                                backgroundColor: R.colors.accent,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                marginRight: R.dimens.widgetMargin,
                                                padding: R.dimens.CardViewElivation,
                                            }}
                                        icon={R.images.IC_EDIT}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onEdit} />

                                    <ImageTextButton
                                        style={
                                            {
                                                padding: R.dimens.CardViewElivation,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: 0,
                                                backgroundColor: color,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                marginRight: R.dimens.widgetMargin,
                                            }}
                                        icon={icon}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onStatusChange} />

                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                backgroundColor: delColor,
                                                padding: R.dimens.CardViewElivation,
                                                margin: 0,
                                            }}
                                        icon={delIcon}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={this.props.onDeleteStatusChange}
                                    />
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data of Scheme Detail List
        isSchemeDetailListFetch: state.AffiliateSchemeDetailReducer.isSchemeDetailListFetch,
        schemeDetailListData: state.AffiliateSchemeDetailReducer.schemeDetailListData,
        schemeDetailListDataFetch: state.AffiliateSchemeDetailReducer.schemeDetailListDataFetch,

        //Updated Data of Scheme Type Status
        isChangeDetailStatusFetch: state.AffiliateSchemeDetailReducer.isChangeDetailStatusFetch,
        changeDetailStatusData: state.AffiliateSchemeDetailReducer.changeDetailStatusData,
        changeDetailStatusDataFetch: state.AffiliateSchemeDetailReducer.changeDetailStatusDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Action for SchemeTypeList
        affiliateSchemeDetailList: (request) => dispatch(affiliateSchemeDetailList(request)),
        //Perform Action for Change status 
        changeAffiliateSchemeDetailStatus: (request) => dispatch(changeAffiliateSchemeDetailStatus(request)),
        //clear Reducer data
        affiliateSchemeDetailClear: () => dispatch(affiliateSchemeDetailClear()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffiliateSchemeDetailScreen);