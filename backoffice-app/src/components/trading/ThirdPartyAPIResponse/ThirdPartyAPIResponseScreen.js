import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import { getThirdPartyAPIResponseBO, clearAllThirdPartyData } from '../../../actions/Trading/ThirdPartyAPIResponseActions';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ThirdPartyAPIResponseScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            refreshing: false,
            response: [],
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        this.callApiResponse()
    };

    //api call
    callApiResponse = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To get the trading ledgers
            this.props.getThirdPartyAPIResponseBO();
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

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
        if (ThirdPartyAPIResponseScreen.oldProps !== props) {
            ThirdPartyAPIResponseScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { thirdPartyAPIResponse } = props.data;

            if (thirdPartyAPIResponse) {
                try {
                    //if local thirdPartyAPIResponse state is null or its not null and also different then new response then and only then validate response.
                    if (state.thirdPartyAPIResponse == null || (state.thirdPartyAPIResponse != null && thirdPartyAPIResponse !== state.thirdPartyAPIResponse)) {
                        //if thirdPartyAPIResponse response is success then store array list else store empty list
                        if (validateResponseNew({ response: thirdPartyAPIResponse, isList: true })) {
                            let res = parseArray(thirdPartyAPIResponse.Response);

                            return { ...state, thirdPartyAPIResponse, response: res, refreshing: false };
                        } else {
                            return { ...state, thirdPartyAPIResponse, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            //To get the thirdPartyAPIResponse
            this.props.getThirdPartyAPIResponseBO();
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentWillUnmount = () => {
        this.props.clearAllThirdPartyData();
    };

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                <CommonStatusBar />

                {/* Set Toolbar */}
                <CustomToolbar
                    title={R.strings.thirdPartyAPIResponse}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.IC_PLUS}
                    onRightMenuPress={() => this.props.navigation.navigate('AddUpdateThirdPartyAPIResponse', { isEdit: false, onSuccess: this.callApiResponse })}
                />

                {/* Progress */}
                {this.props.data.isLoadingthirdPartyAPIResponse && !this.state.refreshing ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>

                        {this.state.response.length > 0 ?
                            <FlatList
                                data={this.state.response}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <ThirdPartyAPIResponseItem
                                        index={index}
                                        item={item}
                                        onEdit={() => this.props.navigation.navigate('AddUpdateThirdPartyAPIResponse', { item: item, isEdit: true, onSuccess: this.callApiResponse })}
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
                            <ListEmptyComponent module={R.strings.add + ' ' + R.strings.thirdPartyAPIResponse}
                                onPress={() => this.props.navigation.navigate('AddUpdateThirdPartyAPIResponse', { isEdit: false, onSuccess: this.callApiResponse })} />}
                    </View>
                }
            </SafeView>
        );
    }
}

// This Class is used for display record in list
class ThirdPartyAPIResponseItem extends Component {
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
        let { index, size, onEdit, item: { BalanceRegex, StatusRegex, ErrorCodeRegex, TrnRefNoRegex } } = this.props;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.margin,
                    marginRight: R.dimens.margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flex: 1, }}>

                            {/* for show balanceRegex */}
                            <TitleContent title={R.strings.balanceRegex} content={BalanceRegex} />

                            {/* for show statusRegex */}
                            <TitleContent title={R.strings.statusRegex} content={StatusRegex} />

                            {/* for show errorCodeRegex */}
                            <TitleContent title={R.strings.errorCodeRegex} content={ErrorCodeRegex} />

                            {/* for show trnRefNoRegex */}
                            <TitleContent title={R.strings.trnRefNoRegex} content={TrnRefNoRegex} />

                            {/* for show edit icon */}
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
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
                                    onPress={onEdit} />
                            </View>
                        </View >
                    </CardView>

                </View>
            </AnimatableItem>
        )
    }
}

class TitleContent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { title, content } = this.props;
        content = isEmpty(content) ? '-' : content;
        content = content !== '-' ? (isEmpty(content.trim()) ? '-' : content) : content;

        return (
            <View style={{ flex: 1 }}>
                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{title ? title : '-'}</TextViewHML>
                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{content ? content : '-'}</TextViewHML>
            </View>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For thirdPartyAPIResponseBOReducer Data 
    return { data: state.thirdPartyAPIResponseBOReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getThirdPartyAPIResponseBO List Action 
        getThirdPartyAPIResponseBO: () => dispatch(getThirdPartyAPIResponseBO()),
        //clear data
        clearAllThirdPartyData: () => dispatch(clearAllThirdPartyData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ThirdPartyAPIResponseScreen);