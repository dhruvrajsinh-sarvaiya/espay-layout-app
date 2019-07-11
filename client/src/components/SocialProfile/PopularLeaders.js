/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Popular Leaders
 */
import React, { Component, Fragment } from "react";
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

export default PopularLeaders;
