import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import AppConfig from 'Constants/AppConfig';
import { connect } from "react-redux";
import { confirmAddExport } from "Actions/DaemonAddresses"
import qs from 'query-string';
import IntlMessages from "Util/IntlMessages";
const FileDownload = require('js-file-download');
class ExportConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSuccess: false,
            responseMessage: "",
            showError: false
        };
    }
    componentWillMount() {
        const parsed = qs.parse(location.search);
        if (parsed.emailConfirmCode !== '') {
            var reqObj = {
                emailConfirmCode: parsed.emailConfirmCode
            }
            this.props.confirmAddExport(reqObj);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.expFile.hasOwnProperty('data')) {
            if (nextProps.expFile.status === 200 && nextProps.expFile.data.size !== 0) {    //success
                FileDownload(nextProps.expFile.data, 'ExportAddress_' + new Date().toISOString().slice(0, 16) + '.xls');
                this.setState({
                    loading: false,
                    showSuccess: true,
                    responseMessage: <IntlMessages id="wallet.expAddressSuccess" />
                })
            } else {
                //failure
                this.setState({
                    loading: false,
                    showError: true,
                    responseMessage: <IntlMessages id="wallet.expAddressFail" />
                })
            }

        }
    }
    render() {
        return (

            <div className="mx-auto w-50 text-center mt-50">
                <div className="text-center">
                    <a href="/"><img src={AppConfig.appLogo} alt="session-logo" /></a>
                </div>
                <div className="card p-20 mt-30">
                    {
                        this.props.loading
                            ?
                            <div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
                            :
                            (this.state.showError ?
                                <h1 className="text-danger">{this.state.responseMessage}</h1> :
                                <h1 className="text-success">{this.state.responseMessage}</h1>
                            )
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({ daemonAddressReducer }) => {
    const { expFile, loading } = daemonAddressReducer;
    return { expFile, loading };
};
export default connect(mapStateToProps, {
    confirmAddExport
})(ExportConfirm);

