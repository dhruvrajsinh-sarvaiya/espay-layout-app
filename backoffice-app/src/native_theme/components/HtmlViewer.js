/**
 * Custom WebView with autoHeight feature
 *
 * @prop data: data to be display in html
 * @prop source: Same as WebView
 * @prop autoHeight: true|false
 * @prop defaultHeight: 100
 * @prop width: device Width
 * @prop ...props
 */

import React, { Component } from 'react';
import {
    WebView,
    Platform,
    ScrollView
} from 'react-native';
import R from '../R';
import { parseIntVal } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';

const injectedScript = function () {
    function waitForBridge() {
        if (window.postMessage.length !== 1) {
            setTimeout(waitForBridge, 200);
        }
        else {
            postMessage(
                Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)
            )
        }
    }
    waitForBridge();
};

class HtmlViewer extends Component {
    state = {
        webViewHeight: Number
    };

    static defaultProps = {
        autoHeight: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            webViewHeight: this.props.defaultHeight
        };
        this._onMessage = this._onMessage.bind(this);
    };

    _onMessage(e) {
        this.setState({
            webViewHeight: parseIntVal(e.nativeEvent.data)
        });
    }

    stopLoading() {
        this.webview.stopLoading();
    }

    reload() {
        this.webview.reload();
    }

    // to convert styles and data
    convertData = () => {

        //get html data
        let data = this.props.data.toString();

        //property to apply in div tag, default color
        let properties = 'color: ' + R.colors.textPrimary;

        //if font size is passed in passed than append font size
        if (this.props.fontSize) {
            properties += ', fontSize: ' + this.props.fontSize
        }

        //final div tag
        let divTag = '<div style=' + '"' + properties + '">';

        //if th tag is in html response than add color style
        if (data.includes('<th')) {
            data = data.replace(new RegExp('<th', 'g'), '<th style=' + '"color: ' + R.colors.textPrimary + '"');
        }

        //if td tag is in html response than add color style
        if (data.includes('<td')) {
            data = data.replace(new RegExp('<td', 'g'), '<td style=' + '"color: ' + R.colors.textPrimary + '"');
        }

        //if H4 tag is in html response than increse font size
        if (data.includes('<h4')) {
            data = data.replace(new RegExp('<h4', 'g'), '<h4 style=' + '"font-size: ' + R.dimens.smallText + '"');
        }

        //if P tag is in html response than increse font size
        if (data.includes('<p')) {
            data = data.replace(new RegExp('<p', 'g'), '<p style=' + '"font-size: ' + R.dimens.smallestText + '"');
        }

        //if ol tag is in html response than increse font size
        if (data.includes('<ol')) {
            data = data.replace(new RegExp('<ol', 'g'), '<ol style=' + '"font-size: ' + R.dimens.smallestText + '"');
        }

        //if ol tag is in html response than increse font size
        if (data.includes('<li')) {
            data = data.replace(new RegExp('<li', 'g'), '<li style=' + '"font-size: ' + R.dimens.smallestText + '"');
        }

        //if ol h6 is in html response than increse font size
        if (data.includes('<h6')) {
            data = data.replace(new RegExp('<h6', 'g'), '<h6 style=' + '"font-size: ' + R.dimens.smallText + '"');
        }

        //surround whole data between div tag to apply style 
        data = divTag + data + '</div>'

        return { html: data };
    }

    render() {
        const _w = this.props.width;
        const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.height;
        const androidScript = 'window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');' +
            '(' + String(injectedScript) + ')();';
        const iosScript = '(' + String(injectedScript) + ')();' + 'window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');';

        let backgroundColor = R.colors.background;
        if (this.props.style && this.props.style.backgroundColor !== undefined) {
            backgroundColor = this.props.style.backgroundColor;
        }

        return (
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ backgroundColor: backgroundColor }}>
                <WebView
                    ref={(ref) => { this.webview = ref; }}
                    injectedJavaScript={Platform.OS === 'ios' ? iosScript : androidScript}
                    scrollEnabled={this.props.scrollEnabled || false}
                    onMessage={this._onMessage}
                    javaScriptEnabled={true}
                    source={this.convertData()}
                    automaticallyAdjustContentInsets={true}
                    {...this.props}
                    style={[{ backgroundColor: 'transparent' }, !this.props.applyMargin && { width: _w }, this.props.style, { height: _h }]}
                />
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
    return {
        //For Update width and height as per orientation change
        width: state.preference.dimensions.width,
        height: state.preference.dimensions.height,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HtmlViewer)