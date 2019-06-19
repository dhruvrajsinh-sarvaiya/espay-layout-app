/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Promotion
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

class Promotion extends Component {
    constructor() {
        super();
        this.state = {            
        };
    }

    render() {        
        return (
            <Fragment>
                Affiliate Promotion.
            </Fragment>
        );
    }
}

export default Promotion;