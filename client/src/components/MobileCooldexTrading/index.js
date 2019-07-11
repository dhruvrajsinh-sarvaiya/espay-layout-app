/**
 * Trade App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

// Components For Display Marquee Text By Tejas Date:12/9/2018
const MobileNewsTicker = Loadable({
  loader: () => import("./NewsTickers/NewsTicker"),
  loading: MyLoadingComponent
});


// Components For Display Market Cap By Tejas Date:12/9/2018
const MobileCurrentMarket = Loadable({
  loader: () => import("./MarketCap/CurrentMarket"),
  loading: MyLoadingComponent
});

// Components For Display My Holdings Data By Tejas Date:12/9/2018
const MobileHoldings = Loadable({
  loader: () => import("./Holdings/MyHoldings"),
  loading: MyLoadingComponent
});

// Components For Display News Tickers By Tejas Date:12/9/2018
const MobileTickers = Loadable({
  loader: () => import("./NewsTickers/Tickers"),
  loading: MyLoadingComponent
});

// Components For Display Currency Pair Data By Tejas Date:13/9/2018
const MobilePairList = Loadable({
  loader: () => import("./PairListing/PairList"),
  loading: MyLoadingComponent
});

// Components For Display Buyer Order Data By Tejas Date:13/9/2018
const MobileBuyTrade = Loadable({
  loader: () => import("./BuySell/BuyTrade"),
  loading: MyLoadingComponent
});

// Components For Display Seller Order Data By Tejas Date:13/9/2018
const MobileSellTrade = Loadable({
  loader: () => import("./BuySell/SellTrade"),
  loading: MyLoadingComponent
});

// Components For Display Seller Order Data By Tejas Date:13/9/2018
const MobileBuySellTrade = Loadable({
  loader: () => import("./BuySell"),
  loading: MyLoadingComponent
});

// Components For Display Place Order Table By Tejas Date:13/9/2018
const MobilePlaceOrder = Loadable({
  loader: () => import("./PlaceOrders"),
  loading: MyLoadingComponent
});

// Components For Display Market Trade History Data By Tejas Date:13/9/2018
const MobileMarketTrade = Loadable({
  loader: () => import("./MarketTradeHistory/MarketTradeHistory"),
  loading: MyLoadingComponent
});

// Components For Display Active Orders Data By Tejas Date:13/9/2018
const MobileActiveOrders = Loadable({
  loader: () => import("./ActiveOrders"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const MobileTradingChart = Loadable({
  loader: () => import("./Chart/TradingChart"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const MobileMyOpenOrder = Loadable({
  loader: () => import("./ActiveOrders/MyOrders"),
  loading: MyLoadingComponent
});

// Components For Display Chart Data  By Tejas Date:25/9/2018
const MobileOpenOrders = Loadable({
  loader: () => import("./ActiveOrders/OpenOrders"),
  loading: MyLoadingComponent
});

// Components For Display CoinBasicList Data  By Manish Vora Date:30/11/2018
const MobileCoinBasicList = Loadable({
  loader: () => import("./CoinBasic/CoinBasicList"),
  loading: MyLoadingComponent
});

// Components For Display MarketDepth Data  By Manish Vora Date:30/11/2018
const MobileMarketDepth = Loadable({
  loader: () => import("./CoinBasic/MarketDepth"),
  loading: MyLoadingComponent
});

// Components For Display News List Data  By Manish Vora Date:30/11/2018
const MobileNewsList = Loadable({
  loader: () => import("./News/NewsList"),
  loading: MyLoadingComponent
});

// Components For Display News List Data  By Manish Vora Date:30/11/2018
const MobileInviteList = Loadable({
  loader: () => import("./Invite/InviteList"),
  loading: MyLoadingComponent
});

// Components For Display Token Value Data  By Manish Vora Date:30/11/2018
const MobileTokenValue = Loadable({
  loader: () => import("./Token/TokenValue"),
  loading: MyLoadingComponent
});

// Components For Display Top Gainer Data List By Tejas Date:4-1-2019
const MobileTopGainer = Loadable({
  loader: () => import("./TopGainer/TopGainerList"),
  loading: MyLoadingComponent
});

// Components For Display Top Loser Data List By Tejas Date:4-1-2019
const MobileTopLoser = Loadable({
  loader: () => import("./TopLoser/TopLoser"),
  loading: MyLoadingComponent
});

// Export components
export {
  MobileNewsTicker,
  MobileCurrentMarket,
  MobileHoldings,
  MobileTickers,
  MobilePairList,
  MobileBuyTrade,
  MobileSellTrade,
  MobilePlaceOrder,
  MobileOpenOrders,
  MobileMyOpenOrder,
  MobileMarketTrade,
  MobileActiveOrders,
  MobileBuySellTrade,
  MobileTradingChart,
  MobileCoinBasicList,
  MobileMarketDepth,
  MobileNewsList,
  MobileInviteList,
  MobileTokenValue,
  MobileTopGainer,
  MobileTopLoser
};
