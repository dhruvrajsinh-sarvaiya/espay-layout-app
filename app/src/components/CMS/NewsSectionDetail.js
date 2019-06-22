import React, { Component } from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, convertDateTime } from '../../controllers/CommonUtils';
import HtmlViewer from '../../native_theme/components/HtmlViewer';
import Separator from '../../native_theme/components/Separator';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import { connect } from 'react-redux';

class NewsSectionDetail extends Component {
    constructor(props) {
        super(props)
    };

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        // params from previous screen
        const { params } = this.props.navigation.state;
        return (
            <SafeView isDetail={true} style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.News_Section}
                    titleClickable={false}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* display news selected by user  */}
                <View style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    {/* Title display */}
                    <TextViewMR style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary }}>{params.maintitle ? params.maintitle : '-'}</TextViewMR>

                    <View style={{ marginLeft: R.dimens.widget_left_right_margin, marginTop: R.dimens.LoginScreenTopMargin, flexDirection: 'row', }}>
                        <TextViewHML style={{ flex: 1, color: R.colors.accent, fontSize: R.dimens.smallText }}>{R.strings.NewStack}</TextViewHML>
                        <TextViewHML style={{ alignItems: 'flex-end', marginRight: R.dimens.margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{params.maindate ? convertDateTime(params.maindate) : '-'}</TextViewHML>
                    </View>

                    {/* horizontal line display */}
                    <Separator style={{ marginTop: R.dimens.widgetMargin, }} />

                    {/* description display  */}
                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <CardView style={{ margin: R.dimens.margin, }}>

                                {/* Add HTML View for parsing HTML tags to react native */}
                                <HtmlViewer
                                    applyMargin={true}
                                    data={params.maincontent ? params.maincontent : '-'} />
                            </CardView>
                        </ScrollView>
                    </View>
                </View>
            </SafeView>
        )
    }
}

export default connect(state => { return { isPortrait: state.preference.dimensions.isPortrait } })(NewsSectionDetail);