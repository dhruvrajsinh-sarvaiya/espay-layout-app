/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Popular Leaders
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { SimpleCard } from './Widgets';

class PopularLeaders extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }    

    render() {
        return (
            <Fragment>                
                <Link to="/app/social-profile/popular-leaders" className="text-dark">                
                    <SimpleCard
                        title="Popular Leaders"
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
})(PopularLeaders)); */

export default PopularLeaders;
