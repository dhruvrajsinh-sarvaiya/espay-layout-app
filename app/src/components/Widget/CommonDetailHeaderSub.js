import React, { Component } from 'react'
import { connect } from 'react-redux';
import { View, Text } from 'react-native'
import R from '../../native_theme/R';
import { Fonts } from '../../controllers/Constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImageViewWidget from './ImageViewWidget';

//Create Common class for All Detail Screen Header
class CommonDetailHeaderSub extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.coin === nextProps.coin &&
            this.props.coinName === nextProps.coinName &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.locale === nextProps.preference.locale &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false
        }
        return true
    }

    render() {

        return (
            <View>
                {/* Holding Currency with Icon and Balance */}
                <View style={{
                    flexDirection: 'row',
                    margin: R.dimens.widget_top_bottom_margin,
                }}>
                    <View style={{ width: wp('20%') }}>
                        <View style={{
                            width: R.dimens.signup_screen_logo_height,
                            height: R.dimens.signup_screen_logo_height,
                            backgroundColor: 'transparent',
                            borderRadius: R.dimens.paginationButtonRadious,
                        }}>
                            <ImageViewWidget url={this.props.coin} width={R.dimens.signup_screen_logo_height} height={R.dimens.signup_screen_logo_height} />
                        </View>
                    </View>
                    <View style={{ width: wp('80%'), justifyContent: 'center' }}>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }}>{this.props.coinName}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // get updated state from reducer
        preference: state.preference
    }
}

export default connect(mapStateToProps)(CommonDetailHeaderSub);