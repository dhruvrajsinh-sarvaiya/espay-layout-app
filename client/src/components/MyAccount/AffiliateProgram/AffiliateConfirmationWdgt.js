/**
 * Auther : Salim Deraiya
 * Created : 15/02/2019
 * updated by :Saloni Rathod(15th April 2019)
 * Affiliate Confirmation Component
 */
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
// redux action
import { affiliateConfirmationLink } from "Actions/MyAccount";
// intl messages
import IntlMessages from "Util/IntlMessages";
//queryString
import qs from 'query-string';
const AffiliateConfirmScreen = ({data}) => {
    if(Object.keys(data).length > 0) {
        if(data.ReturnCode === 0) {
            return (            
                <Fragment>
                    <div className="forgotconfirmbox">                                                     
                    <span className="bg-success"><i className="material-icons font-2x">done</i></span>                                    
                    </div>
                    <h1 className="font-weight-bold mb-20 text-center"> <IntlMessages id="my_account.emailConfTitle" /></h1>
                    <p className="text-center"><IntlMessages id="my_account.emailConfNote" /></p>
                    <Link to="/signin" className="lnkToBtn btn-danger w-25 mx-auto" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className="forgotconfirmbox">
                        <span className="bg-danger"><i className="material-icons font-2x">close</i></span>                                    
                    </div>
                    <h1 className="font-weight-bold mb-20 text-center"> <IntlMessages id="my_account.emailNotConfTitle" /></h1>
                    <p className="text-center"><IntlMessages id={`apiErrCode.${data.ErrorCode}`} /></p>
                    <Link to="/signin" className="lnkToBtn btn-danger w-25 mx-auto" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
                </Fragment>
            );
        }
    } else {
        return '';
    }
}

class EmailConfirmationWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: false
        };
    }

    componentWillMount() {
        const parsed = qs.parse(location.search);
        if(parsed.emailConfirmCode !== '') {
            var reqObj = {
                emailConfirmCode : parsed.emailConfirmCode
            }
            this.props.affiliateConfirmationLink(reqObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, data : nextProps.data });
    }

    render() {
        const { data, loading } = this.state;
        return (
            <div className="jbs-session-wrapper inner_bg">
                <div className="container">
                    <div className="inner_box rmv_brd">
                        <div className="text-center mb-30">
                            {/* <a href="/"><img src={AppConfig.appLogo} alt="session-logo"/></a> */}
                        </div>
                        <div className="card p-20 mt-70 forgotconfirmradius">
                            { loading 
                                ? <div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
                                : <AffiliateConfirmScreen data={data} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ affiliateRdcer }) => {
    const response = {
        data : affiliateRdcer.data,
        loading : affiliateRdcer.loading
    }
    return response;
};

export default connect(mapStateToProps, {
    affiliateConfirmationLink
})(EmailConfirmationWdgt);