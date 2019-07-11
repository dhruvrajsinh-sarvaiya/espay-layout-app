/**
 * Auther : Salim Deraiya
 * Created : 26/10/2018
 * updated by :Saloni Rathod(15th April 2019)
 * Email Confirmation Widget
 */
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
// redux action
import { deviceAuthorize } from "Actions/MyAccount";
// intl messages
import IntlMessages from "Util/IntlMessages";
//queryString
import qs from 'query-string';

const DeviceScreen = ({ data }) => {
    if (data.ReturnCode === 0) {
        var deviceData = data.AuthorizeData;
        return (
            <Fragment>
                <h2 className="mb-20"><IntlMessages id="my_account.newDevice" /></h2>
                <p className="mb-30"><IntlMessages id="my_account.newDeviceNote" /></p>
                <table className="table table-striped table-bordered">
                    <tr>
                        <th><IntlMessages id="myaccount.ipWhitelistColumn.device" /></th>
                        <td>{deviceData.DeviceName}</td>
                    </tr>
                    <tr>
                        <th><IntlMessages id="sidebar.location" /></th>
                        <td>{deviceData.Location}</td>
                    </tr>
                    <tr>
                        <th><IntlMessages id="my_account.IPWhitelis.addColumn.ip" /></th>
                        <td>{deviceData.IPAddress}</td>
                    </tr>
                </table>
                <Link to="/signin" className="lnkToBtn btn-danger w-25 mx-auto" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
            </Fragment>
        );
    } else {
        var errMsg = Object.keys(data).length > 0 && (data.ErrorCode === 1 ? data.ReturnMsg : <IntlMessages id={`apiErrCode.${data.ErrorCode}`} />);
        return (
            <Fragment>
                <div className="forgotconfirmbox">
                    <span className="bg-danger"><i className="material-icons font-2x">close</i></span>
                </div>
                <h1 className="font-weight-bold mb-20 text-center"><IntlMessages id="my_account.unauthorizeDevice" /></h1>
                <p className="text-center">{errMsg}</p>
                <Link to="/signin" className="lnkToBtn btn-danger w-25 mx-auto" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
            </Fragment>
        );
    }
}

class DeviceAuthorizeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: false
        };
    }

    componentWillMount() {
        const parsed = qs.parse(location.search);
        if (parsed.authorizecode !== '') {
            var reqObj = {
                authorizecode: parsed.authorizecode
            }
            this.props.deviceAuthorize(reqObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, data: nextProps.data });
    }

    render() {
        const { data, loading } = this.state;
        return (
            <div className="jbs-session-wrapper inner_bg">
                <div className="container">
                    <div className="inner_box rmv_brd">
                        <div className="text-center mb-30 mt-30">
                        </div>
                        <div className="card p-20 my-50 forgotconfirmradius">
                            {loading
                                ? <div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
                                : <DeviceScreen data={data} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ devAuthRdcer }) => {
    const response = {
        data: devAuthRdcer.data,
        loading: devAuthRdcer.loading
    }
    return response;
};

export default connect(mapStateToProps, {
    deviceAuthorize
})(DeviceAuthorizeScreen);