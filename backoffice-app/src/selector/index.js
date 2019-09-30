import { ServiceUtilConstant } from "../controllers/Constants";

//Selector for TokenID
//Used to send tokenId in all the request which are called after login
export const userAccessToken = (state) => state.preference[ServiceUtilConstant.ACCESS_TOKEN];
export const userRefreshToken = (state) => state.preference[ServiceUtilConstant.REFRESH_TOKEN];

//Selector for getting user detail
export const userDetail = (state) => state.EditProfileReducer.data;