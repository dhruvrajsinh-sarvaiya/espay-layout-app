import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import CommonStatusBar from '../CommonStatusBar';
import CustomToolbar from '../CustomToolbar';
import MenuListItem from '../MenuListItem';
import Button from '../Button';
import R from '../../R';
import CardView from '../CardView';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../ImageTextButton';

class MultipleSelection extends Component {
    constructor(props) {
        super(props);

        // get data from props
        let data = props.navigation.state.params.data;
        let selectedList = props.navigation.state.params.selectedList;

        let multiSelectArray = [];
        let totalCount = 0;
        let selectAll = false;

        if (data.length > 0) {
            data.map(item => {

                if (multiSelectArray.every(mItem => mItem.value !== item.value)) {
                    
                    let selectedItemIndex = selectedList.findIndex(el => el.value === item.value);
                    multiSelectArray.push({ value: item.value, selected: selectedItemIndex > -1 });

                    if (selectedItemIndex > -1) {
                        totalCount++;
                    }
                    selectAll = selectedItemIndex > -1 ? true : false
                }
            })
        }

        //Define All initial State
        this.state = {
            selectedList: multiSelectArray,
            searchInput: '',
            selectedItemCount: totalCount,
            isSelectAll: selectAll,
        };
    }

    updateList = (item) => {

        let selectedList = this.state.selectedList;

        //item index
        let itemIndex = selectedList.findIndex(el => el.value === item.value);

        //if index found then revert its boolean result
        (itemIndex > -1) && (selectedList[itemIndex].selected = !selectedList[itemIndex].selected);

        // count
        let count = 0
        if (!item.selected)
            count = this.state.selectedItemCount - 1
        else
            count = this.state.selectedItemCount + 1

        //update result
        this.setState({ selectedList, selectedItemCount: count })
    }

    //For Select All Items From List 
    selectAllItems = () => {

        //reverse curent all select value
        let isSelectAll = !this.state.isSelectAll;
        let checkArr = [];

        //loop through all records and set isSelected = isSelectAll
        this.state.selectedList.map((item) => {
            item.selected = isSelectAll;
            checkArr.push(item)
        })
        this.setState({ selectedList: checkArr, isSelectAll, selectedItemCount: checkArr.length })
        if (!isSelectAll) {
            this.setState({ selectedItemCount: 0 })
        }
    }

    render() {

        let filteredList = null;
        if (this.state.selectedList) 
        {
            filteredList = this.state.selectedList.filter(item => 
                (
                item.value.toLowerCase().includes(this.state.searchInput.toLowerCase()
                )
            ));
        }

        return (
            <View style={{ 
                flex: 1, 
                backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    searchHint={R.strings.searchHere2}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    visibleSearch={true}
                    onSearchCancel={() => 
                        {
                        if (this.state.searchInput !== '') {
                            this.setState({ searchInput: '' });
                        } 
                        else {
                            this.props.navigation.goBack()
                        }
                    }}
                />

                <View>
                    {this.state.selectedItemCount > 0 ?
                        <CardView style={{
                            elevation: R.dimens.listCardElevation,
                            borderRadius: 0,
                            margin: R.dimens.margin,
                            flexDirection: 'row'
                        }}>
                            <Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{this.state.selectedItemCount + ' ' + R.strings.Selected}</Text>

                            <ImageTextButton
                                style={{ margin: 0, padding: 0, }}
                                icon={R.images.IC_SELECT_ALL}
                                onPress={this.selectAllItems}
                                iconStyle={{ padding: 0, margin: 0, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                            />
                        </CardView> : null
                    }
                </View>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView >
                        <View>
                            {filteredList.map((item, index) =>
                                <MenuListItem
                                    key={index.toString()}
                                    rightIcon={R.images.IC_CHECKMARK}
                                    isSelected={item.selected}
                                    title={item.value}
                                    onPress={() => this.updateList(item)} />
                            )}

                        </View>
                    </ScrollView>

                    <View style={{ padding: R.dimens.WidgetPadding, }}>

                        {/* To Set Save Button */}
                        <Button title={R.strings.submit} onPress={() => {
                            let list = this.state.selectedList;
                            let updatedFilteredList = list.filter(el => el.selected)
                            this.props.navigation.state.params.updateList(updatedFilteredList);
                            this.props.navigation.goBack();
                        }}></Button>
                    </View>
                </View>


            </View>
        );
    }
}

export default MultipleSelection;