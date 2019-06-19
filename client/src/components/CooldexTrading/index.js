/**
 * Trade App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

// Components For Display Marquee Text By Tejas Date:12/9/2018
const NewsTicker = Loadable({
  loader: () => import("./NewsTickers/NewsTicker"),
  loading: MyLoadingComponent
});


const BasePairList = Loadable({
  loader: () => import("./dashboard/BasePairList"),
  loading: MyLoadingComponent
});

// Components For Display Market Cap By Tejas Date:12/9/2018
const CurrentMarket = Loadable({
  loader: () => import("./MarketCap/CurrentMarket"),
  loading: MyLoadingComponent
});

// Components For Display My Holdings Data By Tejas Date:12/9/2018
const Holdings = Loadable({
  loader: () => import("./Holdings/MyHoldings"),
  loading: MyLoadingComponent
});

// Components For Display News Tickers By Tejas Date:12/9/2018
const Tickers = Loadable({
  loader: () => import("./NewsTickers/Tickers"),
  loading: MyLoadingComponent
});

// Components For Display Currency Pair Data By Tejas Date:13/9/2018
const PairList = Loadable({
  loader: () => import("./PairListing/PairList"),
  loading: MyLoadingComponent
});

// Components For Display Buyer Order Data By Tejas Date:13/9/2018
const BuyTrade = Loadable({
  loader: () => import("./BuySell/BuyTrade"),
  loading: MyLoadingComponent
});

// Components For Display Seller Order Data By Tejas Date:13/9/2018
const SellTrade = Loadable({
  loader: () => import("./BuySell/SellTrade"),
  loading: MyLoadingComponent
});

// Components For Display Seller Order Data By Tejas Date:13/9/2018
const BuySellTrade = Loadable({
  loader: () => import("./BuySell"),
  loading: MyLoadingComponent
});

// Components For Display Place Order Table By Tejas Date:13/9/2018
const PlaceOrder = Loadable({
  loader: () => import("./PlaceOrders"),
  loading: MyLoadingComponent
});

// Components For Display Market Trade History Data By Tejas Date:13/9/2018
const MarketTrade = Loadable({
  loader: () => import("./MarketTradeHistory/MarketTradeHistory"),
  loading: MyLoadingComponent
});

// Components For Display Active Orders Data By Tejas Date:13/9/2018
const ActiveOrders = Loadable({
  loader: () => import("./ActiveOrders"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const TradingChart = Loadable({
  loader: () => import("./Chart/TradingChart"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const MyOpenOrder = Loadable({
  loader: () => import("./ActiveOrders/MyOrders"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const OpenOrders = Loadable({
  loader: () => import("./ActiveOrders/OpenOrders"),
  loading: MyLoadingComponent
});

// Components For Display CoinBasicList Data  By Manish Vora Date:30/11/2018
const CoinBasicList = Loadable({
  loader: () => import("./CoinBasic/CoinBasicList"),
  loading: MyLoadingComponent
});

// Components For Display MarketDepth Data  By Manish Vora Date:30/11/2018
const MarketDepth = Loadable({
  loader: () => import("./CoinBasic/MarketDepth"),
  loading: MyLoadingComponent
});

// Components For Display News List Data  By Manish Vora Date:30/11/2018
const NewsList = Loadable({
  loader: () => import("./News/NewsList"),
  loading: MyLoadingComponent
});

// Components For Display News List Data  By Manish Vora Date:30/11/2018
const InviteList = Loadable({
  loader: () => import("./Invite/InviteList"),
  loading: MyLoadingComponent
});

// Components For Display Token Value Data  By Manish Vora Date:30/11/2018
const TokenValue = Loadable({
  loader: () => import("./Token/TokenValue"),
  loading: MyLoadingComponent
});

// Components For Display Top Gainer Data List By Tejas Date:4-1-2019
const TopGainer = Loadable({
  loader: () => import("./TopGainer/TopGainerList"),
  loading: MyLoadingComponent
});

// Components For Display Top Loser Data List By Tejas Date:4-1-2019
const TopLoser = Loadable({
  loader: () => import("./TopLoser/TopLoser"),
  loading: MyLoadingComponent
});

// Export components
export {
  NewsTicker,
  BasePairList,
  CurrentMarket,
  Holdings,
  Tickers,
  PairList,
  BuyTrade,
  SellTrade,
  PlaceOrder,  
  OpenOrders,
  MyOpenOrder,
  MarketTrade,  
  ActiveOrders,
  BuySellTrade,  
  TradingChart,
  CoinBasicList,
  MarketDepth,
  NewsList,
  InviteList,
  TokenValue,
  TopGainer,
  TopLoser
};
