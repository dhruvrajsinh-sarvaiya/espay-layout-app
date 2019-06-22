import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import { getSocialProfileTopLoserList } from '../../actions/SocialProfile/SocialProfileActions';
import { connect } from 'react-redux';
import { changeTheme, getCurrentDate, parseArray } from '../../controllers/CommonUtils';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../Navigation';
import ListLoader from '../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

export class SocialProfileTopLooserWidget extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isGainer: props.isGainer,
            isFirstTime: true,
            TopLoserResponse: [],
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps)
    }

    componentDidMount = async () => {
        // Change theme as per night and light mode
        changeTheme()
      
        // check internet connection
        if (await isInternet()) {

            let reqTopLoser = { curDate: getCurrentDate(), limit: 5 }
        
            // Call Top Loser List Api
            this.props.getTopLoserList(reqTopLoser)
        }
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { topLoserList } = props.SocailProfileDashboardResult;

            // topLoserList is not null
            if (topLoserList) {
                try {
                    if (state.topLoserList == null || (state.topLoserList != null && topLoserList !== state.topLoserList)) {
                        // Handle response
                        if (validateResponseNew({ response: topLoserList, isList: true })) {
                            return Object.assign({}, state, {
                                TopLoserResponse: parseArray(topLoserList.Response),
                                topLoserList
                            })

                        } else
                            return Object.assign({}, state, { TopLoserResponse: [], topLoserList: null })

                    }
                } catch (error) {
                    return Object.assign({}, state, { TopLoserResponse: [], topLoserList: null })
                    //logger('Error into Social Profile Dashboard', error.message)
                }
            }

        }
        return null
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { topLoserLoading, } = this.props.SocailProfileDashboardResult
        let finalList = this.state.TopLoserResponse

        return (
            <SafeView style={{ flex: 1 }}>
                {
                    (topLoserLoading) ?
                        <ListLoader style={{ marginTop: R.dimens.margin }} />
                        :
                        <FlatList
                            data={finalList}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />}
                            renderItem={({ item, index }) =>
                                <FlatListItem item={item} />}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(finalList)}
                            ListEmptyComponent={<ListEmptyComponent style={{ marginTop: R.dimens.margin }} />}
                        />
                }
            </SafeView>
        )
    }
}


export class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False 
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let item = this.props.item
        let color = R.colors.textSecondary, icon = R.images.IC_CURVE_UP_ARROW
        // change color and image
        if (item.ProfitPer > 0) {
            color = R.colors.successGreen
            icon = R.images.IC_CURVE_UP_ARROW
        }
        else if (item.ProfitPer < 0) {
            icon = R.images.IC_CURVE_DOWN_ARROW
            color = R.colors.failRed
        }

        return (
            <AnimatableItem>
                <View style={{ marginTop: R.dimens.widgetMargin }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.LeaderName}</Text>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Email}</TextViewHML>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    icon={icon}
                                    iconStyle={{ width: R.dimens.normalizePixels(14), height: R.dimens.normalizePixels(14), tintColor: color }}
                                    style={{ margin: 0 }} />
                                <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: color, fontSize: R.dimens.smallText }}>{item.ProfitPer} %</TextViewHML>
                                <TextViewHML style={{ textAlignVertical: 'bottom', color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}> {R.strings.profitLossSmall}</TextViewHML>
                            </View>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>${item.Profit}</TextViewHML>
                        </View>
                    </View>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    //Updated Data For Social Profile Top Looser List Action
    return {
        SocailProfileDashboardResult: state.SocialProfileReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // To get Top Loser List
    getTopLoserList: (payload) => dispatch(getSocialProfileTopLoserList(payload)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SocialProfileTopLooserWidget);