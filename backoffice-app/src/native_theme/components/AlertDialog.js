import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ImageButton from './ImageTextButton';
import CommonToast from './CommonToast';
import R from '../R';
import Button from './Button';
import { Fonts, Events, ServiceUtilConstant } from '../../controllers/Constants';
import { getCardStyle } from './CardView';
import { addListener } from '../../controllers/CommonUtils';
import DeviceInfo from 'react-native-device-info';
import { getData } from '../../App';

export default class AlertDialog extends Component {
    constructor(props) {
        super(props);
        this.toast = React.createRef();

        this.state = {
            isPortrait: getData(ServiceUtilConstant.KEY_DIMENSIONS).isPortrait,
            ...Dimensions.get('window'),
        }
    }

    componentDidMount() {
        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {
            this.setState(Object.assign({}, this.state, data))
        });
    }

    componentWillUnmount() {
        if (this.dimensionListener) {
            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    render() {

        // Getting params from props
        let visible = this.props.visible;
        let dialogTitle = this.props.title;
        let negativeOnPress = this.props.negativeButton.onPress;
        let negativeButtonHide = this.props.negativeButton.hide;
        let negativeStyle = this.props.negativeButton.style;

        let positiveTitle = this.props.positiveButton.title ? this.props.positiveButton.title : R.strings.submit;
        let positiveOnPress = this.props.positiveButton.onPress;
        let positiveDisable = this.props.positiveButton.disabled;
        let positiveTextStyle = this.props.positiveButton.textStyle;
        let requestClose = this.props.requestClose;
        let isCancelButton = this.props.isCancelButton;

        let titleStyle = this.props.titleStyle;
        let backgroundStyle = this.props.backgroundStyle;
        let ButtonViewStyle = this.props.ButtonViewStyle;
        let buttonStyle = {};
        let toastRef = this.props.toastRef;

        let dialogStyle = {
            background: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0, 0.2)',
            },
            container: {
                width: this.state.width * ((!this.state.isPortrait && DeviceInfo.isTablet()) ? 55 : 75) / 100,
                backgroundColor: R.colors.background,
                borderRadius: R.dimens.roundButtonRedius,
                ...getCardStyle(R.dimens.CardViewElivation)
            },
            title: {
                padding: R.dimens.WidgetPadding,
                color: R.colors.textPrimary,
                fontSize: R.dimens.mediumText,
                textAlign: 'center',
                fontFamily: Fonts.MontserratBold,
            },
            separator: {
                backgroundColor: R.colors.textSecondary,
                height: R.dimens.separatorHeight,
                width: '100%'
            },
            childrenContainer: {
                paddingTop: 0,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
                paddingBottom: R.dimens.padding_left_right_margin
            },
            buttonStyleRow: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
            },
            buttonStyleColumn: {
                justifyContent: 'center',
                alignItems: 'center',

            }
        }

        if (ButtonViewStyle) {
            if (ButtonViewStyle.flexDirection) {
                buttonStyle = ButtonViewStyle.flexDirection === 'row' ? dialogStyle.buttonStyleRow : dialogStyle.buttonStyleColumn;
            }
            else {
                buttonStyle = dialogStyle.buttonStyleRow;
            }
        }
        else {
            buttonStyle = dialogStyle.buttonStyleRow;
        }

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={visible}
                transparent={true}
                animationType={"fade"}
                onRequestClose={requestClose}>

                <View style={dialogStyle.background} >
                    <CommonToast ref={component => {
                        if (toastRef) {
                            toastRef(component)
                        } else {
                            this.toast = component;
                        }
                    }} />
                    <View
                        style={[
                            dialogStyle.container,
                            backgroundStyle,
                            R.colors.getTheme().includes('ni') ? { borderColor: R.colors.textPrimary, borderWidth: R.dimens.pickerBorderWidth } : {},
                            { paddingBottom: R.dimens.ButtonHeight }
                        ]}>

                        <View style={{
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            marginTop: R.dimens.margin_top_bottom,
                            marginRight: R.dimens.margin_left_right,
                            height: R.dimens.dashboardMenuIcon
                        }}>
                            {!negativeButtonHide && <ImageButton
                                icon={R.images.IC_CANCEL}
                                iconStyle={{
                                    tintColor: R.colors.accent,
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                }}
                                onPress={negativeOnPress}
                                style={[buttonStyle, negativeStyle]} />
                            }
                        </View>

                        {/* Title of Dialog */}
                        <Text style={[dialogStyle.title, titleStyle]}>
                            {dialogTitle}
                        </Text>

                        <View style={dialogStyle.childrenContainer}>
                            {this.props.children}
                        </View>
                    </View>

                    <View>
                        <Button
                            title={positiveTitle}
                            onPress={positiveOnPress}
                            disabled={positiveDisable}
                            isRound={true}
                            isAlert={true}
                            style={{ position: 'absolute', bottom: R.dimens.dialogButtonMargin, elevation: (R.dimens.CardViewElivation * 2) }}
                            textStyle={positiveTextStyle} />
                    </View>

                    {isCancelButton ?
                        <View style={{ backgroundColor: 'transparent', marginTop: R.dimens.activity_margin, justifyContent: 'center', alignContent: 'center', borderColor: R.colors.accent, borderWidth: R.dimens.LineHeight, borderRadius: 90, padding: R.dimens.WidgetPadding }}>
                            <TouchableOpacity
                                onPress={requestClose} style={{ alignItems: 'center' }}>
                                <Image style={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.accent
                                }} source={R.images.IC_CANCEL}
                                />
                            </TouchableOpacity>
                        </View>
                        : null}
                </View>
            </Modal>
        );
    }
}

function button() {
    return {
        title: PropTypes.string,
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        progressive: PropTypes.bool,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        hide: PropTypes.bool
    }
}

AlertDialog.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    negativeButton: PropTypes.objectOf(button),
    positiveButton: PropTypes.objectOf(button)
}

AlertDialog.defaultProps = {
    visible: false,
    title: 'Dialog',
    negativeButton: {
        title: R.strings.cancel,
        onPress: () => null,
        hide: false,
    },
    positiveButton: {
        title: R.strings.cancel,
        onPress: () => null,
        disabled: false,
        progress: false,
    }
}