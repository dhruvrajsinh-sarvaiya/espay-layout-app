// ReferaAndEanProgramDetails
import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, } from '../../controllers/CommonUtils'
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';

export default class ReferaAndEanProgramDetails extends Component {
    constructor(props) {
        super(props)

        //get params from previous screen
        const { params } = this.props.navigation.state;

        //init state value from previous screen
        this.state = {
            programDetails: params.programDetails,
            importantNotice: params.importantNotice,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.program_details}
                    isBack={true}
                    nav={this.props.navigation} />

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* card view for details view */}
                    <CardView style={{ flex: 1, margin: R.dimens.margin }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.accent }}>
                                {R.strings.program_details}</TextViewMR>
                        </View>

                        <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{this.state.programDetails ? this.state.programDetails : '-'}</TextViewHML>
                            <TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, marginTop: R.dimens.widget_top_bottom_margin }}>* {R.strings.important_notice}</TextViewMR>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{this.state.importantNotice ? this.state.importantNotice : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </ScrollView>
            </SafeView>
        )
    }
}


