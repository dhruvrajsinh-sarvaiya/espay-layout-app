/* 
    Developer : Nishant Vadgama
    File Comment : Transaction Types card page
    Date : 04-12-2018
*/
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";

export default class Transaction extends Component {
    render() {
        const columns = [
            { name: <IntlMessages id="table.sr" /> },
            { name: <IntlMessages id="table.walletId" /> },
            { name: <IntlMessages id="table.name" /> },
            { name: <IntlMessages id="table.currency" /> },
            { name: <IntlMessages id="table.balance" /> },
            { name: <IntlMessages id="table.status" /> }
        ];
        const data = [
            {
                sr: 1,
                walletId: "3as2d13216a5sd4f3a2s1d3213df1",
                name: "BTC_Admin",
                currency: "BTC",
                balance: 6548.184844,
                status: "Transaction"
            },
            {
                sr: 2,
                walletId: "3as2d13216a5sd4f3a2s1d3213df1",
                name: "ETH_Default",
                currency: "ETH",
                balance: 15422.254544,
                status: "Active"
            },
            {
                sr: 3,
                walletId: "3as2d13216a5sd4f3a2s1d3213df1",
                name: "ATCC_Fist",
                currency: "ATCC",
                balance: 15422.254544,
                status: "Active"
            }
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
            <MUIDataTable
                title={"Tramsaction"}
                data={data.map(item => {
                    return [
                        item.sr,
                        item.walletId,
                        item.name,
                        item.currency,
                        item.balance,
                        item.status
                    ];
                })}
                columns={columns}
                options={options}
            />
        );
    }
}
