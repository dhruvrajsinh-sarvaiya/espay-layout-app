import React, { Component } from 'react'
import { View, Platform, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-navigation';

export class SafeView extends Component {
    constructor() {
        super();
        this.state = {
            layout: {
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
            }
        };
    }

    _onLayout = event => {
        this.setState({
            layout: {
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width
            }
        });
    };

    render() {
        if (Platform.OS == 'ios') {

            // if isDetail bit is not undefined and set to true means it will have collapse and expand animation for screen transition
            // therefore add forceInset property to forcefully shrink screen
            if (this.props.isDetail !== undefined && this.props.isDetail){
                this.props = Object.assign({}, this.props, {
                    forceInset: {
                        top: 'always',
                        bottom: 'always'
                    }
                })
            }
            
            // to display proper UI in notch devices using SafeAreaView for iOS platform
            return (<SafeAreaView style={{ flex: 1 }} {...this.props}><View onLayout={this._onLayout} style={{ flex: 1 }} {...this.props}>{this.props.children}</View></SafeAreaView>)
        } else {
            return (<View onLayout={this._onLayout} style={{ flex: 1 }} {...this.props}>{this.props.children}</View>)
        }
    }
}

export default SafeView
