import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { changeTheme } from '../../../controllers/CommonUtils';
import TopGainerLooser from '../TopGainerLoser/TopGainerLooser';
import R from '../../../native_theme/R';
import Separator from '../../../native_theme/components/Separator';
import DashboardHeaderWidget from './DashboardHeaderWidget';
import MarketTickerWidget from './MarketTickerWidget';
import CoinHorizontalListWidget from './CoinHorizontalListWidget';
import ServicesWidget from './ServicesWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';

class TradingDashboard extends Component {
    constructor(props) {
        super(props);

        // Bind all methods
        this.handleDrawer = this.handleDrawer.bind(this);
        this.onPressTopGainerLoser = this.onPressTopGainerLoser.bind(this);

        //Define All initial State
        this.state = {
            isGainer: true,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    };

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (nextProps.shouldDisplay) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    //To open Drawer
    handleDrawer() {
        this.props.preference.dimensions.isPortrait && this.props.navigation.openDrawer()
    }

    // to update gainer looser selection
    onPressTopGainerLoser(isGainer) {
        this.setState({ isGainer: isGainer })
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                <ScrollView
                    showsVerticalScrollIndicator={false}>

                    <DashboardHeaderWidget navigation={this.props.navigation} onPress={this.handleDrawer} />

                    <MarketTickerWidget navigation={this.props.navigation} />

                    {/* Services */}
                    <ServicesWidget navigation={this.props.navigation} />

                    <Separator />

                    {/* Coins */}
                    <CoinHorizontalListWidget navigation={this.props.navigation} />

                    <Separator />

                    <View style={{
                        flexDirection: 'row',
                        marginTop: R.dimens.widget_top_bottom_margin,
                        marginBottom: R.dimens.widget_top_bottom_margin,
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TouchableWithoutFeedback
                                onPress={() => this.onPressTopGainerLoser(true)}>
                                <View style={{ marginRight: R.dimens.widgetMargin }}>
                                    <TextViewMR
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        style={{
                                            color: this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                            fontSize: R.dimens.mediumText,
                                            paddingLeft: R.dimens.margin_left_right
                                        }}>{R.strings.topGainer}</TextViewMR>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                onPress={() => this.onPressTopGainerLoser(false)}>
                                <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                                    <TextViewMR
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        style={{
                                            color: !this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                            fontSize: R.dimens.mediumText,
                                            paddingRight: R.dimens.margin_left_right
                                        }}>{R.strings.topLoser}</TextViewMR>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <ImageTextButton
                            icon={R.images.RIGHT_ARROW_DOUBLE}
                            onPress={() => this.props.navigation.navigate('TopGainerLoser')}
                            style={{ marginBottom: 0, marginTop: 0 }}
                            iconStyle={{
                                width: R.dimens.dashboardMenuIcon,
                                height: R.dimens.dashboardMenuIcon,
                                tintColor: R.colors.textPrimary
                            }} />
                    </View>

                    <TopGainerLooser navigation={this.props.navigation} isGainer={this.state.isGainer} />
                </ScrollView>
            </SafeView >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TradingDashboard);
