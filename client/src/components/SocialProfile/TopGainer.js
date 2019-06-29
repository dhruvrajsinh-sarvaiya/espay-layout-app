/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Top Gainer
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SimpleCard } from './Widgets';

class TopGainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Fragment>
                <Link to="/app/social-profile/top-gainer" className="text-dark">
                    <SimpleCard
                        title="Top Gainer"
                        icon="zmdi zmdi-plus-circle"
                        bgClass="bg-dark"
                        clickEvent={this.onClick}
                    />
                </Link>
            </Fragment>
        );
    }
}

export default TopGainer;
