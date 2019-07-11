/**
 * Trade App Widgets By Tejas
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

// Component For Display BalanceInfo Tab
const BalanceInfo = Loadable({
    loader: () => import("./BalanceInfo"),
    loading: MyLoadingComponent
})

// Component For Display UserTrade Tab
const UserTrade = Loadable({
    loader: () => import("./UserTrade"),
    loading: MyLoadingComponent
})

// Component For Display Expenses Tab
const Expenses = Loadable({
    loader: () => import("./Expenses"),
    loading: MyLoadingComponent
})

// Component For Display Profit Tab
const Profit = Loadable({
    loader: () => import("./Profit"),
    loading: MyLoadingComponent
})

// Component For Display Revenue Tab
const Revenue = Loadable({
    loader: () => import("./Revenue"),
    loading: MyLoadingComponent
})

// Component For Display Trade Summary Tab
const TradeSummary = Loadable({
    loader: () => import("./TradeSummary"),
    loading: MyLoadingComponent
})

// Component For Display Order Summary Tab
const OrderSummary = Loadable({
    loader: () => import("./OrderSummary"),
    loading: MyLoadingComponent
})

// Component For Display Chart Tab
const TradingChart = Loadable({
    loader: () => import("./TradingChart"),
    loading: MyLoadingComponent
})

// Component For Display Markets Tab
const Markets = Loadable({
    loader: () => import("./Markets"),
    loading: MyLoadingComponent
})

// Component For Display ActiveUserTrade Tab
const ActiveUserTrade = Loadable({
    loader: () => import("./UserTrade/Components/UserTradeDashboard"),
    loading: MyLoadingComponent
})

// Component For Display ProfitData Tab
const ProfitData = Loadable({
    loader: () => import("./Profit/Components/ProfitDashboard"),
    loading: MyLoadingComponent
})

// Component For Display Tradesummary Tab
const TradeSummaryData = Loadable({
    loader: () => import("./TradeSummary/Components/TradeSumamryData"),
    loading: MyLoadingComponent
})

// Component For Display OrderSummaryData Tab
const OrderSummaryData = Loadable({
    loader: () => import("./OrderSummary/Components/OrderSumamryData"),
    loading: MyLoadingComponent
})

// Component For Display UserTradeList Tab
const UserTradeList = Loadable({
    loader: () => import("./UserTrade/Components/TodaysTrade"),
    loading: MyLoadingComponent
})

// Component For Display Reports Tab
const Reports = Loadable({
    loader: () => import("./Reports"),
    loading: MyLoadingComponent
})

// Component For Display Configuration Tab
const Configuration = Loadable({
    loader: () => import("./Configuration"),
    loading: MyLoadingComponent
})

// Component For Display Reports Tab
const ReportsData = Loadable({
    loader: () => import("./Reports/Components/ReportsData"),
    loading: MyLoadingComponent
})

// Component For Display Configuration Tab
const ConfiguratioData = Loadable({
    loader: () => import("./Configuration/Components/ConfigurationData"),
    loading: MyLoadingComponent
})

// Component For Display ExpenseList Tab
const ExpenseList = Loadable({
    loader: () => import("./Expenses/ExpenseList"),
    loading: MyLoadingComponent
})

// Component For Display RevenueList Tab
const RevenueList = Loadable({
    loader: () => import("./Revenue/RevenueList"),
    loading: MyLoadingComponent
})

// Component For Display Gainers Tab
const Gainers = Loadable({
    loader: () => import("./TopGainer/index"),
    loading: MyLoadingComponent
})


// Component For Display Gainers List Tab
const GainersList = Loadable({
    loader: () => import("./TopGainer/TopGainer"),
    loading: MyLoadingComponent
})

// Component For Display Losers Tab
const Losers = Loadable({
    loader: () => import("./TopLoser/index"),
    loading: MyLoadingComponent
})

// Component For Display Losers List Tab
const LoserList = Loadable({
    loader: () => import("./TopLoser/TopLoser"),
    loading: MyLoadingComponent
})

// Component For Display MarketMakingList  Added by Palak Gajjar 04.06.2019
const MarketMakingList = Loadable({
    loader: () => import("./MarketMakingList"),
    loading: MyLoadingComponent
})
// Export components 
export {
    BalanceInfo,
    UserTrade,
    Expenses,
    Profit,
    Revenue,
    TradeSummary,
    OrderSummary,
    TradingChart,
    Markets,
    ActiveUserTrade,
    ProfitData,
    TradeSummaryData,
    OrderSummaryData,
    UserTradeList,
    Reports,
    Configuration,
    ReportsData,
    ConfiguratioData,
    ExpenseList,
    RevenueList,
    Gainers,
    GainersList,
    Losers,
    LoserList,
    MarketMakingList,//Palak Gajjar 04.06.2019 for MarketMakingList
}