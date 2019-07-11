/* 
    Developer : Nishant Vadgama
    File Comment : Transaction Types card page
    Date : 04-12-2018
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
//import actions
import {
    getWithdrawSummary,
} from "Actions/Wallet";
class Withdrawal extends Component {
    componentWillMount() {
        this.props.getWithdrawSummary();
    }
    render() {
        const columns = [
            { name: <IntlMessages id="table.sr" /> },
            { name: <IntlMessages id="table.walletId" /> },
            { name: <IntlMessages id="table.name" /> },
            { name: <IntlMessages id="table.currency" /> },
            { name: <IntlMessages id="table.balance" /> },
            { name: <IntlMessages id="table.status" /> }
        ];

        const options = {
            filterType: "multiselect",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            search: false,
            pagination: false
        };

        return (
            <Fragment>
                {this.props.withdrawalSummary.loading == true && <PreloadWidget />}
                {this.props.withdrawalSummary.hasOwnProperty('response') &&
                    <MUIDataTable
                        title={"Withdrawals"}
                        data={this.props.withdrawalSummary.response.map(item => {
                            return [
                                item.TrnNo,
                                item.DebitAccountId,
                                item.ServiceName,
                                item.ServiceName,
                                item.Amount,
                                item.StatusText
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                }
            </Fragment>

        );
    }
}

const mapToProps = ({ transactionTypesReducer }) => {
    const { withdrawalSummary } = transactionTypesReducer;
    return { withdrawalSummary };
};

export default connect(mapToProps, {
    getWithdrawSummary
})(Withdrawal);