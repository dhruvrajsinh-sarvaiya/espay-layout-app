//GetBalance Api Static Success Response
export function getBalancesFromAPI() {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "BAL",
                "returnCode": "0",
                "returnMsg": "CURRENT BAL: 100.00, CURRENT DISC: 0.00",
                "BAL": "100.00",
                "DISC": "0.00",
                "WALLET": "0.00",
                "IsExpired": "0",
                "balance": [
                    {
                        "name": "BitCoin",
                        "Amount": 48.96769260,
                        "icon": "btc.png",
                        "symbol": "BTC",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.112000",
                        "btc_Value": "0.01565",
                        "Address": "sdfkhsgdfsjdfgjsdfghdsfgjsdgjhsdgjhsdfg"
                    },
                    {
                        "name": "Indian Rupee",
                        "Amount": 48.96769260,
                        "icon": "xrp.png",
                        "symbol": "INR",
                        "totalBalance": "0.215451",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "LiteCoin",
                        "Amount": 48.96769260,
                        "icon": "ltc.png",
                        "symbol": "LTC",
                        "totalBalance": "0.145454",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "Etherium",
                        "Amount": 48.96769260,
                        "icon": "eth.png",
                        "symbol": "ETH",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "Ripple",
                        "Amount": 48.96769260,
                        "icon": "xrp.png",
                        "symbol": "XRP",
                        "totalBalance": "0.001211",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "American Type ",
                        "Amount": 48.96769260,
                        "icon": "appc.png",
                        "symbol": "ATCC",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "aristocratic",
                        "Amount": 48.96769260,
                        "icon": "xrp.png",
                        "symbol": "ARISTO",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "Bitcoin Interest",
                        "Amount": 48.96769260,
                        "icon": "btcp.png",
                        "symbol": "BCI",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "Bitcoin Cash",
                        "Amount": 48.96769260,
                        "icon": "bch.png",
                        "symbol": "BCH",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    },
                    {
                        "name": "Bether",
                        "Amount": 48.96769260,
                        "icon": "btg.png",
                        "symbol": "BTH",
                        "totalBalance": "0.000000",
                        "AvailableBalance": "0.00000",
                        "inOrder": "0.00000",
                        "btc_Value": "0.01565",
                        "Address": "sdfk445545454545454545gjhsdgjhsdfg"
                    }
                ]
            });
        }, 500);
    });
}

//GetBalance Api Static Failure Response
export function getBalancesFailureFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "BAL",
                "returnCode": "1",
                "returnMsg": "Invalid Mobile No or SMS Password"
            });
        }, 500);
    });
}

//WithdrawCoin Api Static Success Response
export function WithdrawRequestFromAPI(DestinationAddress, Amount) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "WithdrawalResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Transaction No: 18192 is Success",
                    "TrnNo": 18192
                }
            });
        }, 500);
    });
}

//WithdrawCoin Api Static Failure Response
export function WithdrawRequestFailureFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "WithdrawalResult": {
                    "ErrorCode": 2191,
                    "returnCode": 1,
                    "returnMsg": "Invalid Request Detail",
                    "TrnNo": 0
                }
            });
        }, 500);
    });
}

//GenerateAddress Api Static Success Response
export function GenerateAddressFromAPI(WalletId) {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "GENCOINADDR",
                "returnCode": "0",
                "returnMsg": "Success",
                "CoinAddress": [
                    {
                        "KeyPairID": "30",
                        "PrivateKeyID": "12",
                        "Address": "cf70edf28cfff980d1ab493de13acd859a815854",
                        "PrivateAddressName": "Address 12"
                    },
                    {
                        "KeyPairID": "29",
                        "PrivateKeyID": "11",
                        "Address": "443ec351576f81e48b602562ab96c77f8c41ebb8",
                        "PrivateAddressName": "Address 11"
                    },
                    {
                        "KeyPairID": "28",
                        "PrivateKeyID": "10",
                        "Address": "f91c9ace49b27737a85e057ef106b25f5205b30f",
                        "PrivateAddressName": "Address 10"
                    },
                    {
                        "KeyPairID": "27",
                        "PrivateKeyID": "9",
                        "Address": "83b0a5467ef81a36b5eac92c8d4bb71362d02841",
                        "PrivateAddressName": "Address 9"
                    },
                    {
                        "KeyPairID": "16",
                        "PrivateKeyID": "2",
                        "Address": "b32a33534954f43da9b84d716b63735318e10cc5",
                        "PrivateAddressName": "Your Address 2"
                    },
                    {
                        "KeyPairID": "13",
                        "PrivateKeyID": "1",
                        "Address": "24636e78335ffd0bb44d16c1027a50ac3e67b797",
                        "PrivateAddressName": "Your Address 1"
                    }
                ]
            });
        }, 500);
    });
}


//GenerateAddress Api Static Failure Response
export function GenerateAddressFailureFromAPI(WalletId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "GENCOINADDR",
                "returnCode": "7",
                "returnMsg": "Invalid Wallet"
            });
        }, 500);
    });
}

//WithdrawCoin Api Static Success Response
export function WithdrawHistoryFromAPI(DestinationAddress, Amount) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "MYTRANSV",
                "returnCode": "0",
                "returnMsg": "Success",
                "withdrawHistory": [
                    {
                        "trans_id": "19015",
                        "user_id": "8",
                        "payment_method": "Cryptocurrency Account",
                        "transaction_id": "TW81536823693",
                        "currency_name": "PCPL",
                        "name": "PCPL",
                        "type": "Withdraw",
                        "amount": "7.00000000",
                        "datetime": "2018-09-13 12:58:13",
                        "account_number": "",
                        "fee": "0.0700000000",
                        "status": "Cancelled",
                        "payment_status": "Not Paid",
                        "paid_amount": "6.93",
                        "bank_swift_code": "",
                        "bank_name": "",
                        "bank_branch": "",
                        "ifsc_code": "",
                        "bank_address": "",
                        "bank_postalcode": "",
                        "wallet_txid": "",
                        "Comment": "Withdraw Request Cancelled by Customer",
                        "txnid": "",
                        "account_name": "",
                        "bank_city": "",
                        "bank_country": "",
                        "crypto_address": "13QrYs6BAj2pUgJhUJPATJH4HC3o5iDqTLUzhK",
                        "user_tnx": "",
                        "remark": "",
                        "confirmation_count": "6"
                    },
                    {
                        "trans_id": "19012",
                        "user_id": "8",
                        "payment_method": "Cryptocurrency Account",
                        "transaction_id": "TW81536822910",
                        "currency_name": "PCPL",
                        "name": "PCPL",
                        "type": "Withdraw",
                        "amount": "3.00000000",
                        "datetime": "2018-09-13 12:45:10",
                        "account_number": "",
                        "fee": "0.0300000000",
                        "status": "Cancelled",
                        "payment_status": "Not Paid",
                        "paid_amount": "2.97",
                        "bank_swift_code": "",
                        "bank_name": "",
                        "bank_branch": "",
                        "ifsc_code": "",
                        "bank_address": "",
                        "bank_postalcode": "",
                        "wallet_txid": "",
                        "Comment": "Withdraw Request Cancelled by Customer",
                        "txnid": "",
                        "account_name": "",
                        "bank_city": "",
                        "bank_country": "",
                        "crypto_address": "13QrYs6BAj2pUgJhUJPATJH4HC3o5iDqTLUzhK",
                        "user_tnx": "",
                        "remark": "",
                        "confirmation_count": "1"
                    },
                    {
                        "trans_id": "19011",
                        "user_id": "8",
                        "payment_method": "Cryptocurrency Account",
                        "transaction_id": "TW81536822848",
                        "currency_name": "PCPL",
                        "name": "PCPL",
                        "type": "Withdraw",
                        "amount": "7.00000000",
                        "datetime": "2018-09-13 12:44:08",
                        "account_number": "",
                        "fee": "0.0700000000",
                        "status": "Cancelled",
                        "payment_status": "Not Paid",
                        "paid_amount": "6.93",
                        "bank_swift_code": "",
                        "bank_name": "",
                        "bank_branch": "",
                        "ifsc_code": "",
                        "bank_address": "",
                        "bank_postalcode": "",
                        "wallet_txid": "",
                        "Comment": "Withdraw Request Cancelled by Customer",
                        "txnid": "",
                        "account_name": "",
                        "bank_city": "",
                        "bank_country": "",
                        "crypto_address": "13QrYs6BAj2pUgJhUJPATJH4HC3o5iDqTLUzhK",
                        "user_tnx": "",
                        "remark": "",
                        "confirmation_count": "7"
                    },
                    {
                        "trans_id": "16464",
                        "user_id": "8",
                        "payment_method": "Cryptocurrency Account",
                        "transaction_id": "TW81535105240",
                        "currency_name": "BCIM",
                        "name": "BCIM",
                        "type": "Withdraw",
                        "amount": "1.00000000",
                        "datetime": "2018-08-24 15:37:20",
                        "account_number": "",
                        "fee": "0.0100000000",
                        "status": "Cancelled",
                        "payment_status": "Not Paid",
                        "paid_amount": "0.99",
                        "bank_swift_code": "",
                        "bank_name": "",
                        "bank_branch": "",
                        "ifsc_code": "",
                        "bank_address": "",
                        "bank_postalcode": "",
                        "wallet_txid": "",
                        "Comment": "Withdraw Request Cancelled by Customer",
                        "txnid": "",
                        "account_name": "",
                        "bank_city": "",
                        "bank_country": "",
                        "crypto_address": "1tiH9WhX6xXgQGB8ChDxzcWYhhsMPqEe5BS8A",
                        "user_tnx": "",
                        "remark": "",
                        "confirmation_count": "2"
                    },
                    {
                        "trans_id": "16463",
                        "user_id": "8",
                        "payment_method": "Cryptocurrency Account",
                        "transaction_id": "TW81535096257",
                        "currency_name": "BCIM",
                        "name": "BCIM",
                        "type": "Withdraw",
                        "amount": "1.00000000",
                        "datetime": "2018-08-24 13:07:37",
                        "account_number": "",
                        "fee": "0.0100000000",
                        "status": "Completed",
                        "payment_status": "Not Paid",
                        "paid_amount": "0.99",
                        "bank_swift_code": "",
                        "bank_name": "",
                        "bank_branch": "",
                        "ifsc_code": "",
                        "bank_address": "",
                        "bank_postalcode": "",
                        "wallet_txid": "",
                        "Comment": "",
                        "txnid": "3ed68201e0e79102d8286ff56d785c5020e9df55293ffe570678b51f6783a2c9",
                        "account_name": "",
                        "bank_city": "",
                        "bank_country": "",
                        "crypto_address": "1PFDfupJrosxa3VhrMn1tn4ynyUfwEZ5R8FQug",
                        "user_tnx": "",
                        "remark": "",
                        "confirmation_count": "3"
                    }
                ]
            });
        }, 500);
    });
}


// Deposit History Static Success Respons
export function getDepositHistory() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RESPTYPE": "MYTRANSV",
                "returnCode": "0",
                "returnMsg": "Success",
                "depositHistory": [
                    {
                        "deposit_address": "1NcG9RRPMAFMsocezsX5tHPfhSMcV5jJvUXhWz",
                        "from_address": "1E1TCYkF6aBy3hYR7YrRviVN9hpp4nsoAzykKF",
                        "currency": "BTC",
                        "amount": "0.99",
                        "request_date": "2018-09-06 12:59:57",
                        "request_time": "11:55:18",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "Bitcoin",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1TkfX2vSbRoaySfxngGJztoki7XCbXPCj6Esui",
                        "currency": "BTC",
                        "amount": "10",
                        "request_date": "2018-07-20 12:59:57",
                        "request_time": "05:15:24",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "Bitcoin",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1J4Vvu57W5mCjUpRJJqoq6cnjH4gDUWGQScZtt",
                        "currency": "BTC",
                        "amount": "9.98",
                        "request_date": "2018-06-18 12:59:57",
                        "request_time": "04:00:10",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "Bitcoin",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "16kfdMyATYkMrSSczBStYPbS5Tqq9gBqDjtjMJ",
                        "currency": "BCIM",
                        "amount": "5",
                        "request_date": "2018-05-10 12:59:57",
                        "request_time": "12:10:04",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1ZS1y2jtz1b3LxhW7SNVnUvDKynVfyZoqqAmqf",
                        "currency": "BCIM",
                        "amount": "10",
                        "request_date": "2018-05-02 12:59:57",
                        "request_time": "06:41:58",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1NcG9RRPMAFMsocezsX5tHPfhSMcV5jJvUXhWz",
                        "from_address": "1E1TCYkF6aBy3hYR7YrRviVN9hpp4nsoAzykKF",
                        "currency": "BCIM",
                        "amount": "0.99",
                        "request_date": "2018-09-06 12:59:57",
                        "request_time": "11:55:17",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1TkfX2vSbRoaySfxngGJztoki7XCbXPCj6Esui",
                        "currency": "BCIM",
                        "amount": "10",
                        "request_date": "2018-07-20 12:59:57",
                        "request_time": "05:15:23",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1J4Vvu57W5mCjUpRJJqoq6cnjH4gDUWGQScZtt",
                        "currency": "BCIM",
                        "amount": "9.98",
                        "request_date": "2018-06-18 12:59:57",
                        "request_time": "04:00:09",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "16kfdMyATYkMrSSczBStYPbS5Tqq9gBqDjtjMJ",
                        "currency": "BCIM",
                        "amount": "5",
                        "request_date": "2018-05-10 12:59:57",
                        "request_time": "12:10:03",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1ZS1y2jtz1b3LxhW7SNVnUvDKynVfyZoqqAmqf",
                        "currency": "BCIM",
                        "amount": "10",
                        "request_date": "2018-05-02 12:59:57",
                        "request_time": "06:41:54",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1NcG9RRPMAFMsocezsX5tHPfhSMcV5jJvUXhWz",
                        "from_address": "1E1TCYkF6aBy3hYR7YrRviVN9hpp4nsoAzykKF",
                        "currency": "BTC",
                        "amount": "0.99",
                        "request_date": "2018-09-06 12:59:57",
                        "request_time": "11:55:18",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    },
                    {
                        "deposit_address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR",
                        "from_address": "1TkfX2vSbRoaySfxngGJztoki7XCbXPCj6Esui",
                        "currency": "BTC",
                        "amount": "10",
                        "request_date": "2018-07-20 12:59:57",
                        "request_time": "05:15:24",
                        "information": "Deposit",
                        "status": "Confirmed",
                        "name": "BCIM",
                        "confirmation_count": "3"
                    }
                ]
            });
        }, 500);
    });
}


//Get Transfer In History Api Static Response
export function getTransferInHistoryFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TransferInResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "TransferInList": [
                        {
                            "AccountNo": "1QpnuYdTpdJrDyUSjDErEFoPu5knvbjSKqx7gh",
                            "Confirmations": 44,
                            "DeliveryGivenDate": "5/21/2018 12:13:57 PM",
                            "MemberCode": "RT000004",
                            "OrderAmt": 0.03,
                            "OrderID": 163,
                            "ResultDateTime": "5/12/2018 4:25:14 PM",
                            "SMSCode": "ATCC",
                            "name": "ATC Coin",
                            "StatusText": "Success",
                            "TxnID": "1862990307efad28591eb3e1569817a2df99f2d4d5992227ae0883033e90611f"
                        },
                        {
                            "AccountNo": "1QpnuYdTpdJrDyUSjDErEFoPu5knvbjSKqx7gh",
                            "Confirmations": 22,
                            "DeliveryGivenDate": "5/21/2018 11:37:52 AM",
                            "MemberCode": "RT000004",
                            "OrderAmt": 0.03,
                            "OrderID": 162,
                            "ResultDateTime": "5/12/2018 4:25:14 PM",
                            "SMSCode": "ATCC",
                            "name": "ATC Coin",
                            "StatusText": "Success",
                            "TxnID": "1862990307efad28591eb3e1569817a2df99f2d4d5992227ae0883033e90611f1"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//Get Transfer In History Api Static Failure Response
export function getTransferInHistoryFailureFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TransferInResult": {
                    "ErrorCode": 2172,
                    "StatusCode": 1,
                    "StatusMsg": "No Record Found",
                    "TransferInList": null
                }
            });
        }, 500);
    });
}


//Get Transfer In History Api Static Response
export function getTransferOutHistoryFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TransferOutResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "TransferOutList": [
                        {
                            "AccountNo": "1zcyztqb86f46my2hsrpope9djgdxorpnuqqls",
                            "Confirmations": 0,
                            "MemberCode": "RT000004",
                            "OrderAmt": 12.00005,
                            "PostBal": 1999,
                            "PreBal": 2000,
                            "ResultDateTime": "7/13/2018 4:23:24 PM",
                            "SMSCode": "ATCC",
                            "name": "ATC Coin",
                            "StatusText": "Pending",
                            "ToAddress": "1zcyztqb86f46my2hsrpope9djgdxorpnuqqls",
                            "TrnDate": "5/10/2018 1:18:48 PM",
                            "TrnNo": 176,
                            "TxnID": "eb0d3f57990e62019632fc3c592f8a8947383618be1c844b93a07efe2dae84c6"
                        },
                        {
                            "AccountNo": "1QpnuYdTpdJrDyUSjDErEFoPu5knvbjSKqx7gh",
                            "Confirmations": 509,
                            "MemberCode": "RT000004",
                            "OrderAmt": 0.005866,
                            "PostBal": 1980,
                            "PreBal": 2000,
                            "ResultDateTime": "7/13/2018 3:29:22 PM",
                            "SMSCode": "ATCC",
                            "name": "ATC Coin",
                            "StatusText": "Success",
                            "ToAddress": "1QpnuYdTpdJrDyUSjDErEFoPu5knvbjSKqx7gh",
                            "TrnDate": "5/9/2018 7:30:55 PM",
                            "TrnNo": 25,
                            "TxnID": "1862990307efad28591eb3e1569817a2df99f2d4d5992227ae0883033e90611f"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//Get Transfer In History Api Static Failure Response
export function getTransferOutHistoryFailureFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TransferOutResult": {
                    "ErrorCode": 2172,
                    "StatusCode": 1,
                    "StatusMsg": "No Record Found",
                    "TransferOutList": null
                }
            });
        }, 500);
    });
}

//Get Buy Currency Api Static Success Response
export function getBuyCurrencyFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "convertTokenInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "buyCurrency": [
                        {
                            "name": "BTC"
                        },
                        {
                            "name": "BAT"
                        },
                        {
                            "name": "BTF"
                        },
                        {
                            "name": "BCH"
                        },
                        {
                            "name": "FUN"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//Get From Currency Api Static Success Response
export function getFromCurrencyFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "convertTokenInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "fromCurrency": [
                        {
                            "name": "ATCC",
                            "AvailableBalance": "50.0000",
                            "price": "2",
                            "addresses": "1NcG9RRPMAFMsocezs"
                        },
                        {
                            "name": "ATCP",
                            "AvailableBalance": "100.0000",
                            "price": "4",
                            "addresses": "1NcG9RRPMAFMsocez"
                        },
                        {
                            "name": "BCIM",
                            "AvailableBalance": "150.0000",
                            "price": "6",
                            "addresses": "1NcG9RRPMAFMsocezsf"
                        },
                        {
                            "name": "LMX",
                            "AvailableBalance": "200.0000",
                            "price": "8",
                            "addresses": "1NcG9RRPMAFMsocezsf"
                        },
                        {
                            "name": "ARISTO",
                            "AvailableBalance": "250.0000",
                            "price": "7",
                            "addresses": "1NcG9RRPMAFMsocezsx"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//Get convertHistory Api Static Success Response
export function getconvertHistoryFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "convertTokenInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "convertHistory": [
                        {
                            "coin": "BTC",
                            "amount": 10.100000,
                            "price": "10",
                            "total": "1010",
                            "date": "2018-09-21 10:11:42",
                            "status": "Confirmed",
                        },
                        {
                            "coin": "BTC",
                            "amount": 10.100000,
                            "price": "10",
                            "total": "1010",
                            "date": "2018-09-21 10:11:42",
                            "status": "Cancel",
                        }
                    ]
                }
            });
        }, 500);
    });
}

//Convert Token 
export function getConvertTokenFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "convertTokenInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Convert Token is Success",
                }
            });
        }, 500);
    });
}

//For Limits Control
export function getSaveLimitsFromAPI(tabItem) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "LimitControlInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "You have successfully updated " + tabItem + " Limits",
                }
            });
        }, 500);
    });
}

//For Limits Control
export function getLimitsControlFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "WalletLimitConfigurationRes": [
                    {
                        "AccWalletID": "1744944779000020",
                        "TrnType": 1,
                        "LimitPerHour": 12,
                        "LimitPerDay": 12,
                        "LimitPerTransaction": 12
                    },
                    {
                        "AccWalletID": "1744944779000020",
                        "TrnType": 2,
                        "LimitPerHour": 20,
                        "LimitPerDay": 23,
                        "LimitPerTransaction": 1
                    },
                    {
                        "AccWalletID": "1744944779000020",
                        "TrnType": 1,
                        "LimitPerHour": 12,
                        "LimitPerDay": 12,
                        "LimitPerTransaction": 12
                    }
                ],
                "ReturnCode": 0,
                "ReturnMsg": "Record Found Successfully!",
                "ErrorCode": 0,
                "statusCode": 200
            })
        }, 500);
    });
}

//Get Selected Slab Data Api Static Response
export function GetSelectedSlabFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "selectedSlabResult": {
                    "ErrorCode": 2169,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "selectedSlab": {
                        "trading_fees_slab_id": "4",
                        "uniq_values": "0.00",
                        "Current_Freezes_Stack": "$75,000.00",
                        "maker_charges": "0.25",
                        "taker_charges": "0.25",
                        "charge_type": "1",
                        "Available_Unq": "659201.01",
                        "Freeze_Unq": "68,181.82",
                        "value_currency": "USD",
                        "freezeStack": 0,
                        "curUnqRate": 0.22
                    }
                }
            });
        }, 500);
    });
}

//Get Selected Slab Data Api Static Response
export function GetSlabListFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "slabListResult": {
                    "ErrorCode": 2169,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "slabList": [
                        {
                            "trading_fees_slab_id": "1",
                            "uniq_values": "0.00",
                            "maker_charges": "0.25",
                            "taker_charges": "0.25",
                            "charge_type": "1",
                            "value_currency": "USD"
                        },
                        {
                            "trading_fees_slab_id": "2",
                            "uniq_values": "10000.00",
                            "maker_charges": "0.22",
                            "taker_charges": "0.22",
                            "charge_type": "1",
                            "value_currency": "USD"
                        },
                        {
                            "trading_fees_slab_id": "3",
                            "uniq_values": "75000.00",
                            "maker_charges": "0.165",
                            "taker_charges": "0.165",
                            "charge_type": "1",
                            "value_currency": "USD"
                        },
                        {
                            "trading_fees_slab_id": "4",
                            "uniq_values": "150000.00",
                            "maker_charges": "0.11",
                            "taker_charges": "0.11",
                            "charge_type": "1",
                            "value_currency": "USD"
                        },
                        {
                            "trading_fees_slab_id": "5",
                            "uniq_values": "300000.00",
                            "maker_charges": "0.05",
                            "taker_charges": "0.05",
                            "charge_type": "1",
                            "value_currency": "USD"
                        },
                        {
                            "trading_fees_slab_id": "6",
                            "uniq_values": "1000000.00",
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "charge_type": "1",
                            "value_currency": "USD"
                        }
                    ]
                }
            });
        }, 500);
    });
}


//Get Token Submit Api Static Success Response
export function getTokenSubmitSuccessFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TokenSubmitResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Token Send Successfully",
                }
            });
        }, 500);
    });
}


//Get Token Stacking History Api Static Response
export function getTokenStackingHistoryFromAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "TokenStackingResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "stackingHistory": [
                        {
                            "type": "Freeze",
                            "amount": 10.00,
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "LTC",
                            "status": "Confirmed",
                        },
                        {
                            "type": "Freeze",
                            "amount": 10.00,
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "BTC",
                            "status": "Confirmed",
                        },
                        {
                            "type": "UnFreeze",
                            "amount": "10.00",
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "ETH",
                            "status": "Cancel",
                        },
                        {
                            "type": "Freeze",
                            "amount": 10.00,
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "BTC",
                            "status": "Confirmed",
                        },
                        {
                            "type": "Freeze",
                            "amount": 10.00,
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "ETH",
                            "status": "Cancel",
                        },
                        {
                            "type": "Freeze",
                            "amount": 10.00,
                            "maker_charges": "0.00",
                            "taker_charges": "0.00",
                            "date": "2018-09-21 11:54:21",
                            "currency_name": "LTC",
                            "status": "Confirmed",
                        }
                    ]
                }
            });
        }, 500);
    });
}

//For Whitdrawal Address Add to Whitelist
export function addressAddToWhitelist() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "AddToWhitelistResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "This Withdrawal Address Successfully Add to Whitelist",
                }
            });
        }, 500);
    });
}

export function GetWhiteListedAddresses() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "whitelistedAddressResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "whitelistedAddresses": [
                        {
                            "coin": "BTC",
                            "label": "BTC Withdrawal",
                            "address": "14mY1poPt4KQxBockNXrcjJu51TdqoJ21K",
                            "iswhitelisted": "yes"
                        },
                        {
                            "coin": "ATC",
                            "label": "ATC Withdrawal",
                            "address": "Xq1CWPpuAJJWBG6MunSXbeiFJyz8HCdhUC",
                            "iswhitelisted": "yes"
                        },
                        {
                            "coin": "ETH",
                            "label": "ETH Withdrawal",
                            "address": "14mY1poPt4KQxBockNXrcjJu51TdqoJ21K",
                            "iswhitelisted": "no"
                        },
                        {
                            "coin": "BTC",
                            "label": "BTC Withdrawal",
                            "address": "14mY1poPt4KQxBockNXrcjJu51TdqoJ21K",
                            "iswhitelisted": "no"
                        },
                        {
                            "coin": "ATC",
                            "label": "ATC Withdrawal",
                            "address": "Xq1CWPpuAJJWBG6MunSXbeiFJyz8HCdhUC",
                            "iswhitelisted": "no"
                        },
                        {
                            "coin": "ETH",
                            "label": "ETH Withdrawal",
                            "address": "14mY1poPt4KQxBockNXrcjJu51TdqoJ21K",
                            "iswhitelisted": "yes"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//For Add Whitdrawal Address to Whitelist
export function addWhitelistedAddress() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "AddWhitelistedAddressResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Address Successfully Add To Whitelist",
                }
            });
        }, 500);
    });
}


//For Remove Whitdrawal Address to Whitelist
export function removeWhitelistedAddress() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "RemoveWhitelistedAddressResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Address Successfully Remove From Whitelist",
                }
            });
        }, 500);
    });
}

//For Delete Whitdrawal Address to Whitelist
export function deleteWithdrawalHistoryAddress() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "DeleteWithdrawalHistoryAddressResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Address Deleted From Whitdrawal Address History",
                }
            });
        }, 500);
    });
}

//For Generate New Address For Deposit
export function GenerateNewAddress() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "GenerateNewAddressResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Generate New Address Successfully",
                    "Address": "1YdjbWugSCC8D175TW1jnp5pGQqy4V1auagxNR"
                }
            });
        }, 500);
    });
}
// data pass for about us url
const urlpass = {
    "STCODE": "0",
    "STMSG": "Invalid Request",
    "url": "https://github.com/facebook/react-native"
}
// for news saction data
const mainnews = {
    "returnCode": "0",
    "returnMsg": "Invalid request",
    "data": [
        { id: '1', title: "Has Distributed August NPXS", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '2', title: "is Now Available in Polish", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "17 sep 2018 | 10:10 A.M" },
        { id: '3', title: "NULS Competition Has Now Concluded", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "18 sep 2018 | 13:10 A.M" },
        { id: '4', title: "Has Distributed August GAS, ONG and VTHO", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "18 sep 2018 | 13:10 A.M" },
        { id: '5', title: "Distributes Community Coin Round 9 Lucky Draw Rewards", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '6', title: "TRX Trading Competition: 1,000,000 TRX to Give Away!", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "18 sep 2018 | 13:10 A.M" },
        { id: '7', title: "Opens Deposits and Withdrawals for Bitcoin Diamond (BCD)", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "18 sep 2018 | 13:10 A.M" },
        { id: '8', title: "Community Coin Round 9 Winner - GoChain (GO)", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '9', title: "NULS Competition - 50,000 NULS Giveaway!", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '10', title: "YOYO Competition Has Now Concluded", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '11', title: "Notice Regarding Updated NPXS Monthly Token Unlock Program", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '12', title: "Voting Opens for Community Coin of the Month - Round 9", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '13', title: "Labs Incubation Program", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '14', title: "Will Support Nuls (NULS) Mainnet Token Swap", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '15', title: "Community Coin of the Month - Round 9", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
        { id: '16', title: "YOYOW Competition: 1,500,000 YOYO and 6,500 BNB Giveaway!", content: "Cryptocurrency investment is subject to high market risk. Please make your investments cautiously.   will make best efforts to choose high quality coins, but will not be responsible for your investment losses.", date: "16 sep 2018 | 12:10 A.M" },
    ],
    "pages": 'true',

}
// for announcement data 
const announcement = {
    "returnCode": "0",
    "returnMsg": "Data Send Successfully",
    "announcementdata": [
        { "id": "1", "title": "Technology", "Content": "Telecom Commission approves net neutrality, new telecome policy", "fromcity": "mumbai september 22 2018", "hours": "3 Hours Ago" },
        { "id": "2", "title": "Wether", "Content": "check status of mumbai local, long distance trains as rains continue ", "fromcity": "mumbai september 22 2018", "hours": "4 Hours ago" },
        { "id": "3", "title": "Technology", "Content": "Telecom Commission approves net neutrality, new telecome policy", "fromcity": "mumbai september 21 2018", "hours": "yesterday" },
        { "id": "4", "title": "Technology", "Content": "Telecom Commission approves net neutrality, new telecome policy", "fromcity": "mumbai september 21 2018", "hours": "yesterday" },
        { "id": "5", "title": "Wether", "Content": "check status of mumbai local, long distance trains as rains continue", "fromcity": "mumbai september 21 2018", "hours": "yesterday" },
        { "id": "6", "title": "Wether", "Content": "check status of mumbai local, long distance trains as rains continue", "fromcity": "mumbai september 21 2018", "hours": "yesterday" },
    ],
    "pages": 'true',
}

// for api screen data 
const apidata = {
    "returnCode": "0",
    "returnMsg": "Data Send Successfully",
    "apidata": [
        { "id": "1", "title": "Method 1", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "2", "title": "Method 2", "Description": "name and description of the api will be display here and it's usage, name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "3", "title": "Method 3", "Description": "name and description of the api will be display here and it's usage, name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "4", "title": "Method 4", "Description": "name and description of the api will be display here and it's usage, name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "5", "title": "Method 5", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "6", "title": "Method 6", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "7", "title": "Method 7", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "8", "title": "Method 8", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },
        { "id": "9", "title": "Method 9", "Description": "name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage,name and description of the api will be display here and it's usage" },

    ],
    "pages": 'true',

}

const urldata = 'https://github.com/facebook/react-native'

//for contact us data success string  
// const contactdata = 'Request Submit Successfully'
const contactdata = {
    "returnCode": "0",
    "returnMsg": "Request Submit Successfully"
}

//for referral code 
const referapp = {
    "returnCode": "0",
    "returnMsg": "pass data",
    "CODE": "4025826",
    "LINK": "https//www.NewsExchange.com?ref=4025826"
}

// pass contact us data string contact us screen
export function contactsuccess() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(contactdata)
        }, 200)
    })
}

//pass about us data to about us screen
export function passurl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(urlpass)
        }, 200)
    })
}

//pass new Sectio data  for news section
export function newssuccess() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(mainnews)
        }, 200)
    })
}

//pass referral code for refere screen
export function passrefercode() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(referapp)
        }, 200)
    })
}

//pass announcement data for announcement screen
export function passannouncemnet() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(announcement)
        }, 200)
    })
}

//pass api data from api screen
export function passapidata() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(apidata)
        }, 200)
    })
}
// for sign up data
const signupdata = {
    "STCODE": "0",
    "STMSG": "Data Send Successfully",
}
export function signupsuccess() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(signupdata)
        }, 200)
    })
}

//for blockchain success data blockchainsuccess
const blockchaindata = {
    "STCODE": "0",
    "STMSG": "Success data",
    "privateKey": "1d4a2e0ee960ad1883fc003af21732b6696e0ea0a9e450e5a10d43a8c"
}

export function blockchainsuccess() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(blockchaindata)
        }, 200)
    })
}

// Login History Static Success Response
export function getLoginHistory() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "LoginHistoryResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "LoginHistoryList": [
                        {
                            "dateTimes": "2018-06-07 10:08 IST",
                            "IPAddress": "45.116.123.43",
                            "Location": "India",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 IST",
                            "IPAddress": "45.173.183.43",
                            "Location": "India",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 IST",
                            "IPAddress": "45.173.183.43",
                            "Location": "India",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "devices": "Mobile"
                        }
                    ]
                }
            });
        }, 500);
    });
}


// Ip History Static Success Response
export function getIpHistory() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "IpHistoryResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "IpHistoryList": [
                        {
                            "dateTimes": "2018-06-07 10:08 IST",
                            "IPAddress": "45.116.123.43",
                            "Location": "India",
                            "AliasName": "John",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "AliasName": "Kevin",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "AliasName": "Merlin",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 IST",
                            "IPAddress": "45.173.183.43",
                            "Location": "India",
                            "AliasName": "Zack",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "AliasName": "Luise",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 IST",
                            "IPAddress": "45.173.183.43",
                            "Location": "India",
                            "AliasName": "James",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "AliasName": "Kevin",
                            "devices": "Mobile"
                        },
                        {
                            "dateTimes": "2018-08-06 07:08 CEST",
                            "IPAddress": "45.173.183.43",
                            "Location": "France",
                            "AliasName": "Merlin",
                            "devices": "Web"
                        },
                        {
                            "dateTimes": "2018-02-11 16:04 SAST",
                            "IPAddress": "45.173.183.43",
                            "Location": "Johannesburg",
                            "AliasName": "Zack",
                            "devices": "Mobile"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//For Decentralized Address Generation
export function getDecentralizedAddGenFromAPI(Password, SourceName, PrivateKey, symbol) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "DecentralizedAddInfo": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "success",
                    "Address": "fndjlkfpo54j458klmngmnfddfdfdfdf56456dfgdfg546",
                    "PrivateKey": "kdlfhflkdshflhlk4655knnk6546kknkngffg4544",
                    "symbol": symbol,
                    "Balance": 0.00467832
                }
            });
        }, 500);
    });
}


// Fee And Limit History Static Success Response
export function getFeeLImitHistory() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "feesAndLimitPatternHistoryResult": {
                    "ErrorCode": 2173,
                    "returnCode": 0,
                    "returnMsg": "Success",
                    "feesAndLimitPatterns": [
                        {
                            "id": 1,
                            "patternName": "Basic",
                            "patternDescription": "A Pattern for Basic users",
                            "status": "Active",
                            "exchange": "UNIQ Exchange",
                            "CreatedBy": "Indrani Tiwari on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Indrani Tiwari on July 16,2018 at 7:16 PM"
                        },
                        {
                            "id": 2,
                            "patternName": "Standard",
                            "patternDescription": "A Pattern for standard users",
                            "status": "Active",
                            "exchange": "UNIQ Exchange",
                            "CreatedBy": "Dipesh Pandya on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Dipesh Pandya on July 16,2018 at 7:16 PM"
                        },
                        {
                            "id": 3,
                            "patternName": "Premium",
                            "patternDescription": "A Pattern for Premium users",
                            "status": "InActive",
                            "exchange": "UNIQ Exchange",
                            "CreatedBy": "Jeet Das on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Jeet Das on July 16,2018 at 7:16 PM"
                        },
                        {
                            "id": 4,
                            "patternName": "Basic",
                            "patternDescription": "A Pattern for Basic users",
                            "status": "Active",
                            "exchange": "OHO Cash",
                            "CreatedBy": "Jaydev Zukerberg on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Jaydev Zukerberg on July 16,2018 at 7:16 PM"
                        },
                        {
                            "id": 5,
                            "patternName": "Standard",
                            "patternDescription": "A Pattern for Standard users",
                            "status": "Active",
                            "exchange": "OHO Cash",
                            "CreatedBy": "Ravi Vasoya on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Ravi Vasoya on July 16,2018 at 7:16 PM"
                        },
                        {
                            "id": 6,
                            "patternName": "Basic",
                            "patternDescription": "A Pattern for Basic users",
                            "status": "Active",
                            "exchange": "UNIQ Exchange",
                            "CreatedBy": "Dhruvit Malya on July 9,2018 at 3:12 PM",
                            "ModifiedBy": "Dhruvit Malya on July 16,2018 at 7:16 PM"
                        }
                    ]
                }
            });
        }, 500);
    });
}

//For Delete Whitdrawal Address to Whitelist
export function deleteFeeAndLimitItem() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "DeletefeesAndLimitPatternHistoryResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Item Deleted Successfully",
                }
            });
        }, 500);
    });
}

//For Add New Pattern in Fee And Limit Matrix
export function addFeeAndLimitMatrixItem() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "addFeesAndLimitPatternResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your New Pattern Added Successfully",
                }
            });
        }, 500);
    });
}

//For Edit Pattern in Fee And Limit Matrix
export function editFeeAndLimitMatrixItem() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "editFeesAndLimitPatternResult": {
                    "ErrorCode": 2172,
                    "returnCode": 0,
                    "returnMsg": "Your Pattern Edited Successfully",
                }
            });
        }, 500);
    });
}

//For VerifySignUp Otp
export function VerifyOTP() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "VerifyOTPResult": {
                    "ErrorCode": 2172,
                    "StatusCode": 0,
                    "StatusMsg": "Your OTP Successfully Verified",
                }
            });
        }, 500);
    });
}


