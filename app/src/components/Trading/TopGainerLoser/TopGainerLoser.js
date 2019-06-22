import React, { Component } from 'react';
import { View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import Separator from '../../../native_theme/components/Separator';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { getTopGainersLosersData, clearTopGainersLosersData } from '../../../actions/Trade/TopGainerLoser/TopGainerLoserActions';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import SafeView from '../../../native_theme/components/SafeView';

class TopGainerLoser extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            refreshing: false,
            response: [],
            search: '',
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check for internet connection
        if (await isInternet()) {

            //To get top gainers
            this.props.getTopGainersLosers();
        }
    };

    componentWillUnmount = () => {
        // clear reducer data
        this.props.clearTopGainersLosersData();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.data.topGainersLosers !== nextProps.data.topGainersLosers ||
            this.props.data.loading !== nextProps.data.loading ||
            this.state.refreshing !== nextState.refreshing ||
            this.state.search !== nextState.search ||
            this.state.response !== nextState.response) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // To Skip Render if old and new props are equal
        if (TopGainerLoser.oldProps !== props) {
            TopGainerLoser.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {
            try {
                //Get All Updated field of Particular actions 
                let { topGainersLosers } = props.data;

                //if topGainersLosers response is not null then handle resposne
                if (topGainersLosers) {

                    //if local topGainersLosers state is null or its not null and also different then new response then and only then validate response.
                    if (state.topGainersLosers == null || (state.topGainersLosers != null && topGainersLosers !== state.topGainersLosers)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: topGainersLosers, isList: true })) {
                            let response = parseArray(topGainersLosers.Response);

                            return Object.assign({}, state, {
                                topGainersLosers, response, refreshing: false
                            });
                        } else {
                            return Object.assign({}, state, {
                                topGainersLosers, response: [], refreshing: false
                            });
                        }
                    }
                }
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        // check for internet connection
        if (await isInternet()) {

            this.setState({ topGainers: null });

            //To get top gainer losers
            this.props.getTopGainersLosers();
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {

        let filteredList = null;

        //for final items from search input (validate on PairName)
        //default searchInput is empty so it will display all records.
        if (this.state.response) {
            filteredList = this.state.response.filter(item => (
                item.PairName.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background,
            }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.topGainerLoser}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(input) => this.setState({ search: input })}
                />

                {/* Progress and List*/}
                {(this.props.data.loading && !this.state.refreshing)
                    ?
                    <ListLoader />
                    :
                    <View style={{ flex: 1 }}>
                        {filteredList.length > 0 ?
                            <ScrollView showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }>
                                <CardView
                                    cardRadius={R.dimens.detailCardRadius}
                                    style={{
                                        flex: 1,
                                        margin: R.dimens.padding_left_right_margin,
                                        padding: 0,
                                    }}>
                                    <FlatList
                                        data={filteredList}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return <TopGainersLosersItem
                                                index={index}
                                                item={item}
                                                size={filteredList.length}
                                            />
                                        }}
                                        contentContainerStyle={contentContainerStyle(filteredList)}
                                        keyExtractor={(_item, index) => index.toString()}
                                    />
                                </CardView>
                            </ScrollView>
                            :
                            <ListEmptyComponent />
                        }
                    </View>
                }
            </SafeView>
        );
    }
}

class TopGainersLosersItem extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size
        ) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        // Get params from props
        let { item: { PairName, Volume, LTP, ChangePer, High, Low }, index, size } = this.props;

        let sign = ChangePer != 0 ? (ChangePer > 0 ? '+' : '') : '';
        let firstCurrency = PairName.split('_')[0];
        let secondCurrency = '/' + PairName.split('_')[1];

        // apply color based on sign
        let changeColor;
        if (sign === '' && ChangePer == 0) {
            changeColor = R.colors.textSecondary;
        } else if (sign === '+') {
            changeColor = R.colors.successGreen;
        } else {
            changeColor = R.colors.failRed;
        }

        return (
            <View style={{ flex: 1, }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <View style={{ width: '40%' }}>
                        <TextViewMR style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText }}><TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{firstCurrency}</TextViewMR>{secondCurrency}</TextViewMR>
                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.vol_24h} {Volume.toFixed(8)}</TextViewHML>
                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText, }}>{R.strings.h}: {High.toFixed(8)}</TextViewHML>
                    </View>

                    <View style={{ width: '30%' }}>
                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{LTP.toFixed(8)}</TextViewHML>
                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{' '}</TextViewHML>
                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.l}: {Low.toFixed(8)}</TextViewHML>
                    </View>

                    <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TextViewHML style={{
                            width: '75%',
                            padding: R.dimens.widgetMargin,
                            backgroundColor: changeColor,
                            color: R.colors.white,
                            fontSize: R.dimens.secondCurrencyText,
                            textAlign: 'center',
                            alignSelf: 'center'
                        }}>
                            {sign + ChangePer.toFixed(2) + '%'}
                        </TextViewHML>
                    </View>
                </View >
                {index !== size - 1 &&
                    < Separator />
                }
            </View>
        )
    }
}

function mapStatToProps(state) {
    // updated state from reducer
    return { data: state.topGainerLoserReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform action for TopGainerLoser 
        getTopGainersLosers: () => dispatch(getTopGainersLosersData()),
        // Perform action for clear TopGainerLoser Data
        clearTopGainersLosersData: () => dispatch(clearTopGainersLosersData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TopGainerLoser);