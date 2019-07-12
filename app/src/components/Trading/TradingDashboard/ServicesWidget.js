import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CardView from '../../../native_theme/components/CardView';
import R from '../../../native_theme/R';
import { isCurrentScreen } from '../../Navigation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';

class ServicesWidget extends Component {
    constructor(props) {
        super(props)

        //Define All initial State
        this.state = {};
    };

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    }

    render() {
        return <View style={{ flex: 1, marginBottom: R.dimens.widget_top_bottom_margin }}>
            <TextViewMR style={{
                fontSize: R.dimens.mediumText,
                color: R.colors.textPrimary,
                paddingLeft: R.dimens.margin_left_right,
                paddingRight: R.dimens.margin_left_right,
            }}>{R.strings.services}</TextViewMR>

            <CardView
                cardRadius={R.dimens.LoginButtonBorderRadius * 2}
                style={{
                    marginLeft: R.dimens.margin_left_right,
                    marginRight: R.dimens.margin_left_right,
                    marginTop: R.dimens.widget_top_bottom_margin,
                    marginBottom: R.dimens.widget_top_bottom_margin
                }}>

                <View style={{ paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.Fiat.toUpperCase()}</TextViewMR>
                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.fiatDetail}</TextViewHML>
                </View>
            </CardView>

            <View style={{ flex: 1 }}>
                <ServiceItem
                    title={R.strings.index}
                    detail={R.strings.indexDetail}
                    preference={this.props.preference}
                />

                <ServiceItem
                    title={R.strings.Funds}
                    detail={R.strings.fundDetail}
                    preference={this.props.preference}
                />

                <ServiceItem
                    title={R.strings.Margin}
                    detail={R.strings.marginDetail}
                    preference={this.props.preference}
                />
            </View>
        </View>
    }
}

class ServiceItem extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else if (this.props.title !== nextProps.title || this.props.detail !== nextProps.detail) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        // Get required params from props
        let props = this.props;

        return (<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', padding: R.dimens.widgetMargin }}>
            <LinearGradient
                style={{
                    width: R.dimens.dashboardMenuIcon,
                    height: R.dimens.dashboardMenuIcon,
                    margin: R.dimens.margin,
                    borderRadius: R.dimens.LoginButtonBorderRadius,
                }}
                locations={[0, 1]}
                colors={[R.colors.linearStart, R.colors.linearEnd]} />
            <View style={{ flex: 1 }}>
                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{props.title}</TextViewMR>
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{props.detail}</TextViewHML>
            </View>
        </View>)
    }
}

const mapStateToProps = (state) => {
    return {
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ServicesWidget);