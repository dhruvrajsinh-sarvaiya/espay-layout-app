// CoinListFieldScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, } from 'react-native'
import { changeTheme, parseArray, cloneObject, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { connect } from 'react-redux';
import { getCoinListFieldData, clearCoinListFieldData, updateCoinListFieldData } from '../../../actions/CMS/CoinListFieldAction';
import { validateResponseNew, isInternet, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import EditText from '../../../native_theme/components/EditText';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { Fonts } from '../../../controllers/Constants';

export class CoinListFieldScreen extends Component {
    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        // Define all initial state
        this.state = {
            CoinListFieldState: null,
            CoinListFieldResponse: [],
            coinlistfieldId: '',

            refreshing: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call Coin List Field
            this.props.getCoinListFieldData()
        }
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Coin List Field List API
            this.props.getCoinListFieldData()

        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {

        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount = () => {
        // for clear reducer data
        this.props.clearCoinListFieldData()
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (CoinListFieldScreen.oldProps !== props) {
            CoinListFieldScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { CoinListFieldData, } = props.CoinListFieldResult
            // CoinListFieldData is not null
            if (CoinListFieldData) {
                try {
                    if (state.CoinListFieldState == null || (state.CoinListFieldState !== null && CoinListFieldData !== state.CoinListFieldState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: CoinListFieldData, returnCode: CoinListFieldData.responseCode, isList: true, })) {
                            let res = parseArray(CoinListFieldData.data)
                            let id = CoinListFieldData.data[0]._id
                            let newRes = parseArray(res[0].formfields)

                            newRes.map((item, index) => {
                                if (item)
                                    newRes[index].tempOrder = item.sortOrder;
                            })

                            return Object.assign({}, state, {
                                CoinListFieldState: CoinListFieldData,
                                CoinListFieldResponse: newRes,
                                coinlistfieldId: id,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                CoinListFieldState: null,
                                CoinListFieldResponse: [],
                                coinlistfieldId: '',
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        CoinListFieldState: null,
                        CoinListFieldResponse: [],
                        coinlistfieldId: '',
                        refreshing: false,
                    })
                }
            }
        }
        return null
    }

    componentDidUpdate = async (prevProps, prevState) => {
        // for Add Arbitrage Api request

        const { UpdateCoinlistFieldData } = this.props.CoinListFieldResult;

        if (UpdateCoinlistFieldData !== prevProps.CoinListFieldResult.UpdateCoinlistFieldData) {
            // for show responce update
            if (UpdateCoinlistFieldData) {
                try {
                    if (validateResponseNew({
                        response: UpdateCoinlistFieldData, returnCode: UpdateCoinlistFieldData.responseCode,
                    })) {
                        showAlert(R.strings.Success, UpdateCoinlistFieldData.message, 0, () => {
                            this.props.clearCoinListFieldData()
                            this.props.getCoinListFieldData()
                        });
                    } else {
                        this.props.clearCoinListFieldData()
                    }
                } catch (e) {
                    this.props.clearCoinListFieldData()
                }
            }
        }
    }

    //for change sortOrder
    onChangesortOrderText(item, tempOrder) {
        let tempRes = this.state.CoinListFieldResponse;

        let index = tempRes.findIndex((resItem) => resItem.fieldname === item.fieldname);
        if (index !== -1) {
            tempRes[index].tempOrder = tempOrder;
            tempRes[index].sortOrder = tempOrder;
            this.setState({ CoinListFieldResponse: tempRes });
        }
    }

    // check validation and Call Api
    onUpdateRecords = async () => {
        // on Save Button press

        let listData = this.state.CoinListFieldResponse;
        let checkdata = true;

        listData.forEach((item, index) => {
            if (isEmpty(item.sortOrder)) {
                this.toast.Show(R.strings.sortOrderFieldRequire)
                checkdata = false
                return;
            }
        })

        if (await isInternet() && checkdata) {

            // for get clone of existing state 
            let obj = cloneObject(this.state.CoinListFieldResponse)

            // for remove temporder bit from the array object
            obj.map((item) => {
                delete item.tempOrder
            })

            // make request for update 
            let request = {
                id: this.state.coinlistfieldId,
                formfields: obj,
            }
            // // call for update Coin List Field
            this.props.updateCoinListFieldData(request)
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { CoinListFieldDataLoading, UpdateCoinlistFieldDataLoading } = this.props.CoinListFieldResult

        let finalItems = this.state.CoinListFieldResponse;
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.coinListField}
                    nav={this.props.navigation}
                    rightMenu={R.strings.Save}
                    onRightMenuPress={() => this.onUpdateRecords()}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={UpdateCoinlistFieldDataLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {
                        (CoinListFieldDataLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <CoinListFieldItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onPress={() => {
                                        let response = this.state.CoinListFieldResponse;
                                        response[index].status = response[index].status == 0 ? 1 : 0;
                                        this.setState({ CoinListFieldResponse: response });
                                    }}
                                    onChangeText={(tempOrder) => this.onChangesortOrderText(item, tempOrder)}
                                />}
                                // assign index as key value to Coin List Field list item
                                keyExtractor={(_item, index) => index.toString()}
                                // For Refresh Functionality In Coin List Field FlatList Item
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                // Displayed empty component when no record found 
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class CoinListFieldItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { size, index, item, onPress, } = this.props
        
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1, borderRadius: 0, elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* for show fieldname , status */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.fieldname}{item.Isrequired == 1 && <TextViewMR style={{ color: R.colors.failRed, fontSize: R.dimens.smallText, }}>*</TextViewMR>}</TextViewMR>
                            </View>
                            <ImageTextButton
                                icon={item.status == 1 ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                onPress={onPress}
                                style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                                textStyle={{ color: R.colors.textPrimary }}
                                iconStyle={{ tintColor: item.status == 1 ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                        </View>

                        {/* EditText for shortOrder */}
                        <EditText
                            BorderStyle={{
                                backgroundColor: R.colors.cardBackground,
                                borderColor: R.colors.accent,
                                borderWidth: R.dimens.pickerBorderWidth,
                                marginTop: R.dimens.widgetMargin,
                                justifyContent: 'center',
                            }}
                            textInputStyle={{
                                fontSize: R.dimens.smallText,
                                color: R.colors.textPrimary,
                                fontFamily: Fonts.MontserratRegular,
                            }}
                            placeholder={R.strings.shortOrder}
                            header={R.strings.shortOrder}
                            multiline={false}
                            multiline={false}
                            onlyDigit={true}
                            validate={true}
                            keyboardType='numeric'
                            maxLength={3}
                            returnKeyType={"done"}
                            onChangeText={(tempOrder) => this.props.onChangeText(tempOrder)}
                            value={item.tempOrder ? item.tempOrder.toString() : ''}
                        />
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Coin List Field data from reducer
        CoinListFieldResult: state.CoinListFieldReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Coin List Field Action
    getCoinListFieldData: () => dispatch(getCoinListFieldData()),
    // Perform Update COin List Field Action
    updateCoinListFieldData: (request) => dispatch(updateCoinListFieldData(request)),
    // Clear Coin List Field Action
    clearCoinListFieldData: () => dispatch(clearCoinListFieldData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinListFieldScreen)