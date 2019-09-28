// LiquidityAPIManager
import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { GetLiquidityAPIManagerList, } from '../../../actions/Trading/LiquidityAPIManagerAction';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class LiquidityAPIManager extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            data: [],
            search: '',
            refreshing: false,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for LiquidityAPI data fetch
            this.props.GetLiquidityAPIManagerList()
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
            //Call Api for get LiquidityAPIdata
            this.props.GetLiquidityAPIManagerList()
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
        if (LiquidityAPIManager.oldProps !== props) {
            LiquidityAPIManager.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { LiquidityAPIManagerDataget, LiquidityAPIManagerdataFetch } = props;

            if (!LiquidityAPIManagerdataFetch) {
                try {
                    // when returncode 0 display success and returncode 1 check for ErrorCode for Display error message
                    if (validateResponseNew({ response: LiquidityAPIManagerDataget, returnCode: LiquidityAPIManagerDataget.ReturnCode, returnMessage: LiquidityAPIManagerDataget.ReturnMsg, isList: true })) {
                        //Get array from response
                        var res = parseArray(LiquidityAPIManagerDataget.Response);

                        //for add status static
                        for (var liqKey in res) {
                            let item = res[liqKey];
                            if (item.Status == 1)
                                item.statusStatic = R.strings.Active
                            else
                                item.statusStatic = R.strings.Inactive
                        }

                        //Set State For Api response 
                        return { ...state, data: res, refreshing: false };
                    } else {
                        return { ...state, refreshing: false, data: [] };
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [] };
                }
            }
        }
        return null;
    }

    render() {

        const { isLiquidityAPIManagerFetch } = this.props;

        // for searching record using api name
        let finalItems = this.state.data.filter(item =>
            (item.Name.toLowerCase().includes(this.state.search)) ||
            (item.statusStatic.toLowerCase().includes(this.state.search))
        );

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.liquidityAPIManager}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('LiquidityAPIManagerAddEdit')}
                />

                <View style={{ flex: 1, }}>

                    {isLiquidityAPIManagerFetch && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {/* for display Headers for list  */}
                            {
                                finalItems.length > 0
                                    ?
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) =>
                                            <LiquidityAPIManagerItem
                                                item={item}
                                                index={index}
                                                size={this.state.data.length}
                                                onEdit={() => this.props.navigation.navigate('LiquidityAPIManagerAddEdit', { data: item })}
                                            />
                                        }
                                        keyExtractor={item => item.Id.toString()}
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />}
                                    />
                                    :
                                    <ListEmptyComponent module={R.strings.AddApiManager} onPress={() => this.props.navigation.navigate('LiquidityAPIManagerAddEdit')} />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class LiquidityAPIManagerItem extends Component {
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

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: index == 0 ? R.dimens.margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.margin,
                    marginRight: R.dimens.margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

                            {/* image store */}
                            <ImageTextButton
                                icon={R.images.ic_store}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />

                            {/* for show Name , Type , Transaction Type */}
                            <View style={{ flex: 1, }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.Name ? item.Name : '-'}</TextViewHML>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Type + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.TransactionTypeName ? item.TransactionTypeName : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show status , edit icon */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }} >
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.statusStatic}></StatusChip>
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
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    //Updated liquidityAPIManagerReducer Data 
    return {
        isLiquidityAPIManagerFetch: state.liquidityAPIManagerReducer.isLiquidityAPIManagerFetch,
        LiquidityAPIManagerDataget: state.liquidityAPIManagerReducer.LiquidityAPIManagerDataget,
        LiquidityAPIManagerdataFetch: state.liquidityAPIManagerReducer.LiquidityAPIManagerdataFetch,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform GetLiquidityAPIManagerList action
        GetLiquidityAPIManagerList: () => dispatch(GetLiquidityAPIManagerList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityAPIManager)