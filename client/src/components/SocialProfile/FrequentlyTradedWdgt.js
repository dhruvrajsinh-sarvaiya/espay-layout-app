/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Frequently Traded Component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { AveProfitLossLayout, ProfitableCircle } from './Widgets';

class FrequentlyTradedWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }    

    render() {
        return (
            <Fragment>
                <h2>Frequently Traded</h2>
                <ul className="list-group mb-50">                    
                    <li className="list-group-item">
                        <h2 className="ds-block">24.04 (213 Trades)</h2>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col">
                                <div className="media"><img src={require('Assets/img/device-1.jpg')} alt="project logo" className="media-object" width="40" height="40" /></div>
                                <div className="media-left">EURAUD</div>
                            </div>
                            <div className="col-md-4 col-sm-4 col">
                                <AveProfitLossLayout profit="2.40" loss="4.66" {...this.props} />
                            </div>
                            <div className="col-md-4 col-sm-4 col pi_chart">
                                <ProfitableCircle profit="87.75" />
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <h2 className="ds-block">24.04 (213 Trades)</h2>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col">
                                <div className="media"><img src={require('Assets/img/device-1.jpg')} alt="project logo" className="media-object" width="40" height="40" /></div>
                                <div className="media-left">EURAUD</div>
                            </div>
                            <div className="col-md-4 col-sm-4 col">
                                <AveProfitLossLayout profit="2.40" loss="4.66" {...this.props} />
                            </div>
                            <div className="col-md-4 col-sm-4 col pi_chart">
                                <ProfitableCircle profit="87.75" />
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <h2 className="ds-block">24.04 (213 Trades)</h2>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col">
                                <div className="media"><img src={require('Assets/img/device-1.jpg')} alt="project logo" className="media-object" width="40" height="40" /></div>
                                <div className="media-left">EURAUD</div>
                            </div>
                            <div className="col-md-4 col-sm-4 col">
                                <AveProfitLossLayout profit="2.40" loss="4.66" {...this.props} />
                            </div>
                            <div className="col-md-4 col-sm-4 col pi_chart">
                                <ProfitableCircle profit="87.75" />
                            </div>
                        </div>
                    </li>
                </ul>
            </Fragment>
        );
    }
}

// default props value
FrequentlyTradedWdgt.defaultProps = {
    LeaderId : 0
}

// map state to props
/* const mapStateToProps = ({ forgotPassRdcer }) => {
    var response = {
        data: forgotPassRdcer.data,
        loading: forgotPassRdcer.loading
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    forgotPassword
})(FrequentlyTradedWdgt)); */

export default FrequentlyTradedWdgt;
