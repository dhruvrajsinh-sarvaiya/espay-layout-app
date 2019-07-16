import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import { LinesLoader } from 'react-native-indicator';
import { addListener } from '../../controllers/CommonUtils';
import R from '../R';
import CommonStatusBar from './CommonStatusBar';
import { Events } from '../../controllers/Constants';

export default class ProgressDialog extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isShow: false,
        }
    }

    componentDidMount = () => {
        addListener(Events.ProgressDismiss, () => {
            if (this.state.isShow) {
                this.setState({ isShow: false })
            }
        })
    };

    // for showing progress dialog
    show = () => {
        this.setState({ isShow: true });
    }

    // for hide progress dialog
    dismiss = () => {
        this.setState({ isShow: false });
    }

    // for check progress dialog is showing or not
    isShowing = () => {
        return this.state.isShow;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.isShow === nextProps.isShow &&
            this.state.isShow === nextState.isShow &&
            this.props.translucent === nextProps.translucent) {
            return false
        }
        return true
    }

    render() {
        let isShow;

        //If user is passing isShow then it will show and dismiss manually, otherwise user can use its show() and dismiss() method.
        if (this.props.isShow != undefined) {
            isShow = this.props.isShow;
        } else {
            isShow = this.state.isShow;
        }

        return (
            <View>
                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    visible={isShow}
                    transparent={true}
                    animationType={"fade"}
                    onRequestClose={() => null} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0, 0.5)' }}>
                        <CommonStatusBar backgroundColor={R.colors.progressStatusColor} translucent={this.props.translucent !== undefined ? this.props.translucent : false} />
                        <LinesLoader color={R.colors.accent} />
                    </View>
                </Modal>
            </View>
        );
    }
}
