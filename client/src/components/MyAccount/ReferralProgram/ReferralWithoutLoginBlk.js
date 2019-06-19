/**
 * Active User Component
 */
import React, { Component, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class ReferralWithoutLoginBlk extends Component {
    render() {
        return (
            <Fragment>
                <div className="card">
                    <div className="w-75 mx-auto p-50  text-center">
                        <p><IntlMessages id="my_account.referralWithoutLogin" /></p>
                        <div className="btn_area">
                            <Button component={Link} to="/app/my-account/login" className="text-white btn-primary h-25 font-weight-bold"><IntlMessages id="sidebar.btnLogin" /></Button>
                            <span className="mx-25"><IntlMessages id="sidebar.or" /></span>
                            <Button component={Link} to="/app/my-account/register" className="text-white btn-primary h-25 font-weight-bold"><IntlMessages id="sidebar.btnRegister" /></Button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ReferralWithoutLoginBlk;
