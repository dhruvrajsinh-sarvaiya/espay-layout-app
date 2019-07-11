/**
  * Auther : Salim Deraiya
 * Created : 13/12/2018
 * Social Posting
 */
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { SimpleCard } from './Widgets';

class SocialPosting extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Fragment>
                <Link to="/app/social-profile/social-posting" className="text-dark">
                    <SimpleCard
                        title="Social Posting"
                        icon="zmdi zmdi-plus-circle"
                        bgClass="bg-dark"
                        clickEvent={this.onClick}
                    />
                </Link>
            </Fragment>
        );
    }
}

export default SocialPosting;
