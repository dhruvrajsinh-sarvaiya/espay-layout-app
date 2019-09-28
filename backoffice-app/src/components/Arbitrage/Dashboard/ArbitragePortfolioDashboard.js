import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import CustomCard from '../../widget/CustomCard';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import { getArbitrageUserTradeCount } from '../../../actions/Arbitrage/ArbitrageUserTradeAction';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import DashboardHeader from '../../widget/DashboardHeader';
let { width } = R.screen()

export class ArbitragePortfolioDashboard extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            response: null,
            viewHeight: 0,
            isGrid: true,
            Data: [
                { title: '0', value: R.strings.UserTrade, icon: R.images.ic_configuration, id: 1 },
            ],
            isFirstTime: true,
            ArbitrageUserCountState: null,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Arbitrage User Count Api
            this.props.getArbitrageUserTradeCount()

        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
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
        if (ArbitragePortfolioDashboard.oldProps !== props) {
            ArbitragePortfolioDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ArbitrageUserCountdata } = props.ArbitrageUserTradeResult;

            //To Check Arbitrage user Count Fetch Or Not
            if (ArbitrageUserCountdata) {
                try {
                    //if local ArbitrageUserCountState state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageUserCountState == null || (ArbitrageUserCountdata !== state.ArbitrageUserCountState)) {

                        if (validateResponseNew({ response: ArbitrageUserCountdata, isList: true })) {

                            //Set Value to Custom Card For Total User Count
                            let oldData = state.Data
                            oldData[0].title = validateValue(ArbitrageUserCountdata.Response.TotalCount)

                            return Object.assign({}, state, {
                                ArbitrageUserCountState: ArbitrageUserCountdata,
                                response: ArbitrageUserCountdata.Response,
                                Data: oldData,
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                ArbitrageUserCountState: null,
                                response: null
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbitrageUserCountState: null,
                        response: null
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

        }
        return null;
    }

    onPress = (id) => {

        // On Card Press Navigate User to User Trade list Screen and Pass response to list screen
        if (id === 1) {
            this.props.navigation.navigate('UserTradeListScreen', { UserTradeResponse: this.state.response })
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ArbitrageUserCountIsFetching } = this.props.ArbitrageUserTradeResult;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.arbitragePortfolio}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={ArbitrageUserCountIsFetching} />

                {/* For Sub Dashboards*/}
                <View style={{ flex: 1 }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        numColumns={this.state.isGrid ? 2 : 1}
                        data={this.state.Data}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        // render all item in card
                        renderItem={({ item, index }) => {
                            return (
                                <CustomCard
                                    title={item.title}
                                    icon={item.icon}
                                    index={index} value={item.value}
                                    width={width} size={this.state.Data.length}
                                    isGrid={this.state.isGrid} type={1}
                                    viewHeight={this.state.viewHeight}
                                    onChangeHeight={(height) => {
                                        this.setState({ viewHeight: height });
                                    }}
                                    onPress={() => this.onPress(item.id)}
                                />

                            )
                        }}
                        // assign index as key value list item
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage User Count Data from reducer
        ArbitrageUserTradeResult: state.ArbitrageUserTradeReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Get Updated Arbitrage User Count
    getArbitrageUserTradeCount: () => dispatch(getArbitrageUserTradeCount()),

})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitragePortfolioDashboard)
