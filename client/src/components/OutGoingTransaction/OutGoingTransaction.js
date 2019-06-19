import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from 'Helpers/helpers';
import { injectIntl } from 'react-intl';

class OutGoingTransaction extends Component {
    render() {
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.Sr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnID" }),
                options: { sort: false, filter: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableCoin" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.Address" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableDate" }),
                options: { filter: false, sort: true }
            },
        ];
        const options = {
            filterType: "multiselect",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            }
        };
        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto' : 'DepositWithdrawHistory tbl_overflow_auto'}>
                {this.props.Loading && <JbsSectionLoader />}
                <MUIDataTable
                    data={this.props.data.map(item => {
                        var ExplorerLink = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
                        return [
                            item.AutoNo,
                            <a href={(ExplorerLink.length) ? ExplorerLink[0].Data + '/' + item.TrnID : 'javascript:void(0)'} target="_blank">{item.TrnID}</a>,
                            item.WalletType,
                            item.Address,
                            item.Amount.toFixed(8),
                            changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss'),
                        ];
                    })}
                    columns={columns}
                    options={options}
                />
            </div>
        );
    }
}

export default injectIntl(OutGoingTransaction);