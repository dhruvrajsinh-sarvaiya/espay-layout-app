import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { isInternet } from '../../../validations/CommonValidation';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import R from '../../../native_theme/R';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen()

class AffliateManagementDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            isGrid: true,
            response: [
                { id: 0, title: R.strings.Reports, icon: R.images.IC_CHART },
                { id: 1, title: R.strings.affliateScheme, icon: R.images.IC_FILES },
                { id: 2, title: R.strings.affliateSchemeType, icon: R.images.IC_COPY },
                { id: 3, title: R.strings.affliatePromotion, icon: R.images.IC_DOLLAR },
                { id: 4, title: R.strings.affliateSchemeDetail, icon: R.images.IC_COPY },
                { id: 5, title: R.strings.affliateSchemeTypeMapping, icon: R.images.IC_GOOGLE_PAGES },
            ],
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    async onPress(id) {

        //redirect screen based on card select
        //Check NetWork is Available or not
        if (await isInternet()) {
            if (id == 0) {
                this.props.navigation.navigate('AffliateReportsDashboard')
            }
            else if (id == 1) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.listAffliateScheme, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'AffliateSchemeListScreen' },
                        { title: R.strings.addAffliateScheme, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AffiliateSchemeAddEditScreen' },
                    ],
                    title: R.strings.affliateScheme + ' ' + R.strings.dashboard
                })
            }
            else if (id == 2) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.listAffliateScheme + ' ' + R.strings.type, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'AffiliateSchemeTypeListScreen' },
                        { title: R.strings.addAffliateScheme + ' ' + R.strings.type, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AffiliateSchemeTypeAddEditScreen' },
                    ],
                    title: R.strings.affliateSchemeType + ' ' + R.strings.dashboard
                })
            }
            else if (id == 3) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.listAffliatePromotion, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'AffliatePromotionListScreen' },
                        { title: R.strings.addAffliatePromotion, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AffiliatePromotionAddEditScreen' },
                    ],
                    title: R.strings.affliatePromotion + ' ' + R.strings.dashboard
                })
            }
            else if (id == 4) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.listAffliateScheme + ' ' + R.strings.detail, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'AffiliateSchemeDetailScreen' },
                        { title: R.strings.addAffliateScheme + ' ' + R.strings.detail, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AffiliateSchemeDetailAddEditScreen' },
                    ],
                    title: R.strings.affliateSchemeDetail + ' ' + R.strings.dashboard
                })
            }
            else if (id == 5) {
                this.props.navigation.navigate('CommonDashboard', {
                    response: [
                        { title: R.strings.listAffliateSchemeTypeMapping, icon: R.images.ic_list_alt, id: 0, type: 1, navigate: 'AffiliateSchemeTypeMappingScreen' },
                        { title: R.strings.addAffliateSchemeTypeMapping, icon: R.images.IC_PLUS, id: 1, type: 2, navigate: 'AffiliateSchemeTypeMappingAddEditScreen' },
                    ],
                    title: R.strings.affliateSchemeTypeMapping + ' ' + R.strings.dashboard
                })
            }
        }
    }

    render() {

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.affiliateManagementTitle}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <FlatList
                    extraData={this.state}
                    numColumns={this.state.isGrid ? 2 : 1}
                    key={this.state.isGrid ? 'Grid' : 'List'}
                    data={this.state.response}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <CustomCard
                                size={this.state.response.length}
                                icon={item.icon}
                                width={width}
                                type={1}
                                value={item.title}
                                isGrid={this.state.isGrid}
                                viewHeight={this.state.viewHeight}
                                title={item.value}
                                index={index}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                onPress={() => this.onPress(item.id)}
                            />
                        )
                    }}
                    keyExtractor={(_item, index) => index.toString()}
                />

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}


export default AffliateManagementDashboard;