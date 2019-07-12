import React, { Component } from 'react'
import { StatusBar, Platform } from 'react-native'
import R from '../R';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { connect } from 'react-redux';

class CommonStatusBar extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.backgroundColor === nextProps.backgroundColor &&
            this.props.barStyle === nextProps.barStyle &&
            this.props.translucent === nextProps.translucent &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false
        }
        return true
    }

    render() {
        let props = this.props;
        let backgroundColor = props.backgroundColor ? props.backgroundColor : R.colors.background;
        let barStyle = props.barStyle ? props.barStyle : 'light-content'; //default light-content
        let transclucent = false; //This is important to declare false so that statusbar won't crop

        //To change statusbar to transparent if its not null.
        if (props.translucent == null) {

            //get existing theme mode
            let themeMode = getData(ServiceUtilConstant.KEY_Theme);

            if (backgroundColor === R.colors.background) {
                //To change content color based on theme to reverse of current theme.
                barStyle = themeMode.includes('night') ? 'light-content' : 'dark-content';
            }
        } else {

            //If platform is android than change color to transparent
            if (Platform.OS === 'android') {

                if (props.translucent !== undefined && props.translucent == true) {

                    //need to transparent if need to use translucent
                    backgroundColor = 'transparent';

                    //Set transclucent to true so that it can show transparent statusbar
                    transclucent = true;
                }
            }
        }

        return (
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={barStyle}
                translucent={transclucent}>
            </StatusBar>)
    }

}

const mapStateToProps = (state) => {
    return {
        preference: state.preference,
        isPortrait: state.preference.dimensions.isPortrait
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CommonStatusBar);