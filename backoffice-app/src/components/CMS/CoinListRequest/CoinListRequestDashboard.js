import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import R from '../../../native_theme/R';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import DashboardHeader from '../../widget/DashboardHeader';
import CustomCard from '../../widget/CustomCard';
import { getCoinListReqCount } from '../../../actions/CMS/UserCoinListRequestActions';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';

let width = R.screen().width
export class CoinListRequestDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewHeight: 0,
            isGrid: true,
            data: [
                { id: 1, title: '0', value: R.strings.userCoinListRequest, icon: R.images.IC_CIRCULAR_BLUR, type: 1 },
                { id: 2, title: '0', value: R.strings.coinListField, icon: R.images.IC_CIRCULAR_BLUR, type: 1 },
            ],
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        // Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call Coin List Request Dashboard Count
            this.props.getCoinListReqCount()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps)
    }

    static oldProps = {}

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            }
        }

        // To Skip Render if old and new props are equal
        if (CoinListRequestDashboard.oldProps !== props) {
            CoinListRequestDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { CoinListDashCount } = props.UserCoinListRequestResult

            if (CoinListDashCount) {
                try {
                    if (state.CoinListDashCount == null || (state.CoinListDashCount != null && CoinListDashCount !== state.CoinListDashCount)) {
                        if (validateResponseNew({ response: CoinListDashCount, returnCode: CoinListDashCount.responseCode, })) {
                            let oldData = state.data

                            oldData[0].title = validateValue(CoinListDashCount.data.coinListRequestCount)
                            oldData[1].title = validateValue(CoinListDashCount.data.CoinListField)

                            return Object.assign({}, state, { data: oldData, CoinListDashCount, })

                        } else {
                            return Object.assign({}, state, { data: state.data, CoinListDashCount: null, })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, { data: state.data, CoinListDashCount: null, })
                }
            }
        }
        return null
    }

    onPress = (id) => {
        let { navigate } = this.props.navigation

        //redirect screen based on card select
        if (id == 1)
            navigate('UserCoinListRequestScreen')
        if (id == 2)
            navigate('CoinListFieldScreen')
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { CoinListDashCountLoading } = this.props.UserCoinListRequestResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={CoinListDashCountLoading} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.coinListRequest}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1, }}>
                    {
                        this.state.data.length > 0 ?
                            <FlatList
                                key={this.state.isGrid ? 'Grid' : 'List'}
                                data={this.state.data}
                                numColumns={this.state.isGrid ? 2 : 1}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => {
                                    return (
                                        <CustomCard
                                            isGrid={this.state.isGrid}
                                            index={index}
                                            size={this.state.data.length}
                                            title={item.title}
                                            value={item.value}
                                            type={item.type}
                                            icon={item.icon}
                                            width={width}
                                            onChangeHeight={(height) => {
                                                this.setState({ viewHeight: height })
                                            }}
                                            viewHeight={this.state.viewHeight}
                                            onPress={() => this.onPress(item.id)} />
                                    )
                                }}
                                // assign index as key valye to Ip History list item
                                keyExtractor={(item, index) => index.toString()}
                            />
                            :
                            null
                    }
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get coin list dashboard count from reducer
        UserCoinListRequestResult: state.UserCoinListRequestReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform User List Dashboard Count Action
    getCoinListReqCount: () => dispatch(getCoinListReqCount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinListRequestDashboard)