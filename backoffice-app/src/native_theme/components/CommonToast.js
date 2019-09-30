import React from 'react'
import { Component } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import R from '../R';
import { changeTheme, addListener } from '../../controllers/CommonUtils';
import TextViewHML from './TextViewHML';
import { getCardStyle } from './CardView';
import { Events } from '../../controllers/Constants';

//Create Common Toast Method For Common Use
class CommonToast extends Component {

    constructor() {
        super();
        this.animateOpacityValue = new Animated.Value(0);

        //Define All initial State
        this.state = {
            showToast: false,
            ...Dimensions.get('window'),
        }
        this.toastMessage = '';
    }

    componentDidMount() {
        changeTheme();

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {
            this.setState(Object.assign({}, this.state, data))
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showToast != nextState.showToast) {
            return true;
        }
        return false;
    }

    componentWillUnmount() {
        this.timerID && clearTimeout(this.timerID);

        if (this.dimensionListener) {
            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    // method for showing toast
    Show(message, duration = 3000) {
        this.toastMessage = message;

        this.setState({ showToast: true }, () => {
            Animated.timing
                (
                    this.animateOpacityValue,
                    {
                        toValue: 1,
                        duration: 300
                    }
                ).start(() => {
                    this.timerID = setTimeout(() => {
                        Animated.timing
                            (
                                this.animateOpacityValue,
                                {
                                    toValue: 0,
                                    duration: 300
                                }
                            ).start(() => {
                                this.setState({ showToast: false });
                                clearTimeout(this.timerID);
                            })
                    }, duration);
                })
        });
    }

    render() {

        if (this.state.showToast) {
            return (
                <Animated.View style={[{
                    width: (this.props.isMainScreen && this.state.width > this.state.height) ? this.state.width * 65 / 100 : Dimensions.get('window').width,
                    top: '80%',
                    zIndex: 9999,
                    padding: R.dimens.activity_margin,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: this.animateOpacityValue,
                    ...getCardStyle(R.dimens.toastElevation, 0),
                }, this.props.styles]}>
                    <View style={{ backgroundColor: R.colors.toastBackground, borderRadius: R.dimens.margin }}>
                        <TextViewHML numberOfLines={3} style={{
                            marginLeft: R.dimens.text_left_right_margin,
                            marginRight: R.dimens.text_left_right_margin,
                            padding: R.dimens.margin,
                            fontSize: R.dimens.smallText,
                            textAlign: 'center',
                            color: R.colors.toastText,
                        }}>{this.toastMessage}</TextViewHML>
                    </View>

                </Animated.View>
            );
        } else return null;
    }
}

export default CommonToast