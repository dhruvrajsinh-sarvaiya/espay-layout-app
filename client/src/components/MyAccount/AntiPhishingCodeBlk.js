/**
 * Active User Component
 */
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Button } from '@material-ui/core';

const AntiPhishingCodeBlk = () => {
    return (
        <Fragment>
            <div className="card p-15 mb-15">
                <div className="row">
                    <div className="col-md-9">
                        <div className="media">
                            <div className="media-left"><i className="material-icons mr-10">insert_chart</i></div>
                            <div className="media-body">
                                <h2><IntlMessages id="my_account.anitPhishingCode" /></h2>
                                <p><IntlMessages id="my_account.anitPhishingInfo" /></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 text-right">
                        <Button component={Link} to="/app/my-account/anti-phishing-code" className="text-white btn-primary h-25 mt-25 font-weight-bold"><IntlMessages id="sidebar.btnSet" /></Button>
                    </div>
                </div>                
            </div>
        </Fragment>
    )
}

export default AntiPhishingCodeBlk;
