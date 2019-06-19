/**
 * Active User Component
 */
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Button } from '@material-ui/core';

const GoogleAuthenticationBlk = () => {
    return (
        <Fragment>
            <div className="p-50">
                <div className="row">
                    <div className="col-md-9">
                        <div className="media">
                            <div className="media-left"><i className="material-icons mr-10">dashboard</i></div>
                            <div className="media-body">
                                <h2><IntlMessages id="my_account.googleAuthentication" /></h2>
                                <p><IntlMessages id="my_account.googleAuthenticationInfo" /></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 text-right">
                        <Button component={Link} to="/app/my-account/google-auth" className="text-white btn-primary pb-15 pt-15 h-25 font-weight-bold"><IntlMessages id="sidebar.btnEnable" /></Button>
                        <Button component={Link} to="/app/my-account/disable-google-auth" className="text-white btn-primary h-25 font-weight-bold"><IntlMessages id="sidebar.btnDisable" /></Button>
                    </div>
                </div>                
            </div>
        </Fragment>
    )
}

export default GoogleAuthenticationBlk;
