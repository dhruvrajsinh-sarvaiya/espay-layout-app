/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Top Looser
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Form, FormGroup, Input, Alert, Button } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from './Widgets';

class TopLooser extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }    

    render() {
        return (
            <Fragment>
                <Link to="/app/social-profile/top-looser" className="text-dark">                
                    <SimpleCard
                        title="Top Looser"
                        icon="zmdi zmdi-plus-circle"
                        bgClass="bg-dark"
                        clickEvent={this.onClick}
                    />
                </Link>
            </Fragment>
        );
    }
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
})(TopLooser)); */

export default TopLooser;
