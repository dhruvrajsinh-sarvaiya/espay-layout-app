// component for Set API Custom limits By Tejas 14/9/2019


import React, { Component, Fragment } from 'react';
// intl messages means convert text into selected languages
import IntlMessages from 'Util/IntlMessages';

// class for Set API Custom Limits
class CustomLimitsNotAvailable extends Component {


    //renders the component
    render() {
        return (
            <Fragment>
                <div className="m-20 p-10" style={{ border: "2px solid lavenderblush" }}>
                    <div className="m-0 text-center">
                        <a href="javascript:void(0)" onClick={this.props.setCustomLimitData}>   <i className="material-icons" style={{ fontSize: "70px" }}>add</i></a>
                    </div>

                    <div className="m-0 text-center font-weight-bold">
                        <IntlMessages id="sidebar.customLimits.note.title.set" />
                    </div>
                    <div className="m-0 mb-10 font-weight-bold text-warning">
                        <IntlMessages id="sidebar.customLimits.note.title.info" />
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default CustomLimitsNotAvailable