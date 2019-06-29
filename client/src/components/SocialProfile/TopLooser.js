/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Top Looser
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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

export default TopLooser;
