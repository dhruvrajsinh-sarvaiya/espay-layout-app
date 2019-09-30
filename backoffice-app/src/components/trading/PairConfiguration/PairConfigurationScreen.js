import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen } from '../../../components/Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, } from '../../../controllers/CommonUtils';
import { getPairConfigurationList, clearPairConfigurationData } from '../../../actions/Trading/PairConfigurationActions';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class PairConfigurationScreen extends Component {
    constructor(props) {
        super(props);

        // getting isMargin bit from previous screen
        let isMargin = props.navigation.state.params && props.navigation.state.params.isMargin

        //Define all initial state
        this.state = {
            refreshing: false,
            paginationBit: true,
            PairConfigResponse: [],
            searchInput: '',
            isFirstTime: true,
            isMargin: isMargin
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {

        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount = async () => {
        changeTheme()

        // Check internet connection available or not
        if (await isInternet()) {

            if (this.state.isMargin) {
                // Pair Configuration List Api call
                this.props.getPairConfigurationList({ IsMargin: 1 })
            } else {

                // Pair Configuration List Api call
                this.props.getPairConfigurationList()
            }
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            if (this.state.isMargin) {
                // Pair Configuration List Api call
                this.props.getPairConfigurationList({ IsMargin: 1 })
            } else {

                // Pair Configuration List Api call
                this.props.getPairConfigurationList()
            }
        } else {
            this.setState({ refreshing: false })
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
        if (PairConfigurationScreen.oldProps !== props) {
            PairConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { pairConfigurationData } = props.PairConfigurationResult;

            //if feedLimitList response is not null then handle resposne
            if (pairConfigurationData) {
                try {
                    if (state.pairConfigurationData == null || (state.pairConfigurationData != null && pairConfigurationData !== state.pairConfigurationData)) {

                        if (validateResponseNew({ response: pairConfigurationData, isList: true })) {

                            //check Pair Configuration List Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = parseArray(pairConfigurationData.Response);

                            //for add status static
                            for (var keyDataKey in res) {
                                let item = res[keyDataKey];
                                if (item.Status == 1)
                                    item.statusStatic = R.strings.Active
                                else
                                    item.statusStatic = R.strings.Inactive
                            }


                            return { ...state, PairConfigResponse: res, refreshing: false, };
                        } else {
                            return { ...state, PairConfigResponse: [], refreshing: false, pairConfigurationData };
                        }
                    }
                } catch (error) {
                    return { ...state, PairConfigResponse: [], refreshing: false, };
                }
            }
        }
        return null;
    }

    componentWillUnmount = () => {
        // clear data from reducer
        this.props.clearPairConfigurationData();
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { pairConfigurationLoading } = this.props.PairConfigurationResult

        //for final items from search input (validate on MarketName, PairName, Volume, StatusText, CurrentRate)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.PairConfigResponse

        // for searching functionlity
        if (finalItems) {

            finalItems = finalItems.filter((item) =>
                item.MarketName.toLowerCase().toString().includes(this.state.searchInput.toLowerCase()) ||
                item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.Volume.toString().includes(this.state.searchInput) ||
                item.statusStatic.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CurrentRate.toString().includes(this.state.searchInput)
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.PairConfiguration}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('AddPairConfiguration', { onRefresh: this.onRefresh, activityName: 'Add', isMargin: this.state.isMargin })}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />
                <View style={{ flex: 1, }}>
                    {
                        (pairConfigurationLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            finalItems.length > 0
                                ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) =>
                                        <PairConfigurationItem
                                            index={index}
                                            item={item}
                                            onEdit={() => this.props.navigation.navigate('AddPairConfiguration', { ITEM: item, onRefresh: this.onRefresh, activityName: 'Edit', isMargin: this.state.isMargin })}
                                            onDetail={() => this.props.navigation.navigate('PairConfigurationDetail', { ITEM: item })}
                                            size={finalItems.length} />
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    // Refresh functionality in list
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh(true, true)}
                                        />
                                    }
                                />
                                :
                                // Displayed empty component when no record found
                                <ListEmptyComponent module={R.strings.AddNewPair} onPress={() => this.props.navigation.navigate('AddPairConfiguration', { onRefresh: this.onRefresh, activityName: 'Add', isMargin: this.state.isMargin })} />
                    }
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class PairConfigurationItem extends Component {
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
        let { index, size, onDetail, onEdit } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View
                    style=
                    {{
                        marginRight: R.dimens.widget_left_right_margin,
                        flex: 1,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    }}
                >

                    <CardView style=
                        {{
                            flex: 1,
                            borderTopRightRadius: R.dimens.margin,
                            borderRadius: 0,
                            borderBottomLeftRadius: R.dimens.margin,
                            elevation: R.dimens.listCardElevation,
                        }} onPress={onDetail}>

                        {/* for show PairName , MarketName  */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.PairName !== undefined ? item.PairName.replace('_', '/') : '-'}</TextViewMR>
                                <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin }}>{item.MarketName ? item.MarketName : '-'}</TextViewMR>
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, padding: 0, }}
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                iconStyle={{ padding: 0, margin: 0, marginRight: R.dimens.widgetMargin, width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                            />
                        </View>

                        {/* for show Volume , CurrentRate */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.volume}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.Volume}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.DefaultRate}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.CurrentRate}</TextViewHML>
                            </View>
                        </View>

                        {/* for show status , edit icon */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.statusStatic}></StatusChip>
                            <ImageTextButton
                                icon={R.images.IC_EDIT}
                                style={
                                    {
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth, margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        justifyContent: 'center', alignItems: 'center',
                                    }}
                                iconStyle={{
                                    width: R.dimens.titleIconHeightWidth,
                                    height: R.dimens.titleIconHeightWidth,
                                    tintColor: 'white'
                                }}
                                onPress={onEdit} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    //Updated pairConfigurationReducer Data 
    return {
        PairConfigurationResult: state.pairConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform getPairConfigurationList action
    getPairConfigurationList: (payload) => dispatch(getPairConfigurationList(payload)),
    //Clear data
    clearPairConfigurationData: () => dispatch(clearPairConfigurationData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PairConfigurationScreen);
