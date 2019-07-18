import React, { Component } from 'react';
import { View, Image, Platform, Dimensions } from 'react-native';
import R from '../../native_theme/R';
import ImageTextButton from './ImageTextButton';
import SafeView from './SafeView';
import { connect } from 'react-redux';
import { getStatusBarHeight } from '../../controllers/iPhoneXHelper';
import { getAppLogo } from '../../controllers/CommonUtils';

class BackgroundImageHeaderWidget extends Component {
    constructor(props) {
        super(props);
    }

    handleBack = () => {

        //To go back to previous screen using screen's current props.
        this.props.navigation.goBack();
    }

    render() {

        let { width, height } = Dimensions.get('window');

        // get image url and replace with logo1 to logo2 for new image get
        let imageUrl = getAppLogo();
        let logoUrl = imageUrl && imageUrl.replace("Logo1", "Logo2");

        return (
            <View style={{ height: height / 2.5 }}>
                <Image
                    source={R.images.IMG_BACKGROUND}
                    style={{
                        width: width,
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        resizeMode: 'stretch'
                    }} />
                {this.props.navigation !== undefined && Platform.OS === 'ios' &&
                    <SafeView style={{ position: 'absolute', }}>
                        <ImageTextButton
                            icon={R.images.BACK_ARROW}
                            style={{ margin: 0, padding: R.dimens.WidgetPadding }}
                            onPress={this.props.onBackPress ? this.props.onBackPress : this.handleBack}
                            iconStyle={[{ marginTop: getStatusBarHeight(), height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.white }]}
                        />
                    </SafeView>}
                {/* if Image Url is get than show logo which is get from Url otherwise Show static image of CoolDex  */}
                {logoUrl != null ?
                    <Image
                        source={{ uri: Platform.OS === 'android' ? logoUrl : ('' + logoUrl) }}
                        style={{
                            flex: 1,
                            width: R.dimens.backGroundImageHeightWidth,
                            height: R.dimens.backGroundImageHeightWidth,
                            marginBottom: R.dimens.backGroundImageBottomMargin,
                            alignSelf: 'center',
                            resizeMode: 'contain'
                        }} />
                    :
                    <Image
                        source={R.images.IC_APP_ICON}
                        style={{
                            flex: 1,
                            width: R.dimens.backGroundImageHeightWidth,
                            height: R.dimens.backGroundImageHeightWidth,
                            marginBottom: R.dimens.backGroundImageBottomMargin,
                            alignSelf: 'center',
                            tintColor: 'white',
                            resizeMode: 'contain'
                        }} />}
            </View>
        );
    }
}

export default connect(state => { return { isPortrait: state.preference.dimensions.isPortrait } })(BackgroundImageHeaderWidget);