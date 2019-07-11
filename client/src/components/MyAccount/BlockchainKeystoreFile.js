/**
 * Active User Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
    FormGroup,
    Input,
    Button
} from 'reactstrap';

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Import Login Blockchain...
import { loginBlockchain } from 'Actions/MyAccount';

const validateLoginBlockchain = require('../../validation/MyAccount/login_blockchain');

class BlockchainKeystoreFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            password: '',
            type: 'file',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ password: event.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        const { errors, isValid } = validateLoginBlockchain(this.state);
        this.setState({ errors: errors });

        if (isValid) {
            this.props.loginBlockchain(this.state);
        }
    }
    render() {
        const { errors } = this.state;
        return (
            <Fragment>
                <form>
                    <FormGroup>
                        <Input type="file" name="file" id="File" />
                    </FormGroup>
                    <FormGroup className="row">
                        <span className="has-icon col-md-2 pt-10"><i className="ti-lock"></i></span>
                        
                        <Input type="password" name="password" className="col-md-10" id="password" placeholder="Enter Password" onChange={this.onChange} />
                        {errors.password && <span className="ml-70 text-danger"><IntlMessages id={errors.password} /></span>}
                    </FormGroup>
                    <Button variant="raised" color="success" className="text-white btn-block" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                </form>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ loginRdcer }) => {
    return (loginRdcer);
}

export default connect(mapStateToProps, { loginBlockchain })(BlockchainKeystoreFile);
