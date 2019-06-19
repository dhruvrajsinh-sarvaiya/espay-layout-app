/**
 * Auther : Salim Deraiya
 * Created : 27/05/2019
 * Arbitrage Dashboard
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
);

const Dashboard = Loadable({
    loader: () => import("./Dashboard"),
    loading: MyLoadingComponent
});

// Components For Display Buyer Order Data
const BuyTrade = Loadable({
    loader: () => import("./BuySell/BuyTrade"),
    loading: MyLoadingComponent
});

// Components For Display Seller Order
const SellTrade = Loadable({
    loader: () => import("./BuySell/SellTrade"),
    loading: MyLoadingComponent
});

// Components For Display Seller Order
const BuySellTrade = Loadable({
    loader: () => import("./BuySell"),
    loading: MyLoadingComponent
});

const BuySellForm = Loadable({
    loader: () => import("./BuySellForm"),
    loading: MyLoadingComponent
});

const ExchangeList = Loadable({
    loader: () => import("./ExchangeList"),
    loading: MyLoadingComponent
});

const OpenOrder = Loadable({
    loader: () => import("./OpenOrder"),
    loading: MyLoadingComponent
});

const MyTradeHistory = Loadable({
    loader: () => import("./MyTradeHistory"),
    loading: MyLoadingComponent
});

const TradeHistory = Loadable({
    loader: () => import("./TradeHistory"),
    loading: MyLoadingComponent
});

const OrderTabList = Loadable({
    loader: () => import("./OrderTabList"),
    loading: MyLoadingComponent
});

const PairSelection = Loadable({
    loader: () => import("./PairSelection"),
    loading: MyLoadingComponent
});

const ArbitrageChart = Loadable({
    loader: () => import("./TradingChart"),
    loading: MyLoadingComponent
});

// code added by devang parekh (7-6-2019)
const ProfitIndicator = Loadable({
    loader: () => import("./ProfitIndicator"),
    loading: MyLoadingComponent
});

const LedgerReport = Loadable({
    loader: () => import("./LedgerReport/LedgerReport"),
    loading: MyLoadingComponent
})
const ListArbitrageWallet = Loadable({
    loader: () => import("./Wallet/ListArbitrageWallet"),
    loading: MyLoadingComponent
});
const CreateArbitrageWallet = Loadable({
    loader: () => import("./Wallet/CreateArbitrageWallet"),
    loading: MyLoadingComponent
});

//added by Tejas fro trading (Arbitrage() 11/6/2019
const ArbitrageTrading = Loadable({
    loader: () => import("./ArbitrageTrading"),
    loading: MyLoadingComponent
});

//added by Parth Andhariya   12/6/2019
const Analytics = Loadable({
    loader: () => import("./Analytics/index"),
    loading: MyLoadingComponent
});

export {
    Dashboard,
    BuyTrade,
    SellTrade,
    BuySellTrade,
    BuySellForm,
    ExchangeList,
    OpenOrder,
    TradeHistory,
    MyTradeHistory,
    OrderTabList,
    PairSelection,
    ArbitrageChart,
    ProfitIndicator,
    LedgerReport,
    ListArbitrageWallet,
    CreateArbitrageWallet,
    ArbitrageTrading,
    Analytics
}