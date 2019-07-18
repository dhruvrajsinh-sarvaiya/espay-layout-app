import { ServiceUtilConstant } from "../controllers/Constants";

//Selector for baseCurrency which will upated from MarketListScreen.
//Used in TradeSaga > getVolumeData() : For request parameter
export const baseCurrency = (state) => state.tradeData.baseCurrency;

//Selector for GetTradePairAsset response
//Used in TradeSaga > For update its response based on new volume data response
export const tradePairAssetResponse = (state) => state.tradeData.marketList;

//Selector for GetTradePairAsset response
//Used in TradeSaga > For update its response based on new volume data response
export const marginTradePairAssetResponse = (state) => state.marginTradeReducer.marketList;

//Selector for TokenID
//Used to send tokenId in all the request which are called after login
export const userAccessToken = (state) => state.preference[ServiceUtilConstant.ACCESS_TOKEN];
export const userRefreshToken = (state) => state.preference[ServiceUtilConstant.REFRESH_TOKEN];
export const userIDToken = (state) => state.preference[ServiceUtilConstant.ID_TOKEN];

//Selector For Favourite Response
//Use to merge the market list repsonse with favourite list so that user can identify either pair is in favourite or not.
export const favouriteResponse = (state) => state.favouriteReducer.favouriteList;

//Selector for getting user detail
export const userDetail = (state) => state.EditProfileReducer.data;