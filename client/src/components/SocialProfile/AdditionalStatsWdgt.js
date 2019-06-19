/**
  * Auther : Salim Deraiya
 * Created : 04/02/2018
 * Additional Stats Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Form, FormGroup, Input, Alert, Button } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';

class AdditionalStatsWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Fragment>
                <h2>Additional Stats</h2>
                <div className="row">
                    <div className="col-sm-6 col-md-3">
                        <div className="social-card">
                            <span className="w-40">
                                <h1 className="display-4 font-weight-normal mb-0"><i className="zmdi zmdi-account-circle"></i></h1>
                            </span>
                            <span className="w-60">
                                <h1 className="font-2x font-weight-normal">16.57</h1><span className="fs-14"><span>Trades Per Week</span></span>
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="social-card">
                            <span className="w-40">
                                <h1 className="display-4 font-weight-normal mb-0"><i className="zmdi zmdi-account-circle"></i></h1>
                            </span>
                            <span className="w-60">
                                <h1 className="font-2x font-weight-normal">2 Weeks</h1><span className="fs-14"><span>Avg. Holding Time</span></span>
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="social-card">
                            <span className="w-40">
                                <h1 className="display-4 font-weight-normal mb-0"><i className="zmdi zmdi-account-circle"></i></h1>
                            </span>
                            <span className="w-60">
                                <h1 className="font-2x font-weight-normal">27/03/2017</h1><span className="fs-14"><span>Active Since</span></span>
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="social-card">
                            <span className="w-40">
                                <h1 className="display-4 font-weight-normal mb-0"><i className="zmdi zmdi-account-circle"></i></h1>
                            </span>
                            <span className="w-60">
                                <h1 className="font-2x font-weight-normal">55.57%</h1><span className="fs-14"><span>Profitable Weeks</span></span>
                            </span>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

// default props value
AdditionalStatsWdgt.defaultProps = {
    LeaderId: 0
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
})(AdditionalStatsWdgt)); */

export default AdditionalStatsWdgt;
