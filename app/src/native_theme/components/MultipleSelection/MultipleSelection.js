import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../CommonStatusBar';
import CustomToolbar from '../CustomToolbar';
import MenuListItem from '../MenuListItem';
import Button from '../Button';
import R from '../../R';

class MultipleSelection extends Component {
    constructor(props) {
        super(props);

        // get data from props
        let data = props.navigation.state.params.data;
        let selectedList = props.navigation.state.params.selectedList;

        let multiSelectArray = [];
        if (data) {
            data.map(item => {
                let selectedItemIndex = selectedList.findIndex(el => el.value === item.value);
                multiSelectArray.push({ value: item.value, selected: selectedItemIndex > -1 });
            })
        }

        //Define All initial State
        this.state = {
            selectedList: multiSelectArray,
            searchInput: ''
        };
    }

    updateList = (item) => {

        let selectedList = this.state.selectedList;

        //item index
        let itemIndex = this.state.selectedList.findIndex(el => el.value === item.value);

        //if index found then revert its boolean result
        (itemIndex > -1) && (selectedList[itemIndex].selected = !selectedList[itemIndex].selected);

        //update result
        this.setState({ selectedList })
    }

    render() {

        let filteredList = null;
        if (this.state.selectedList) {
            filteredList = this.state.selectedList.filter(item => (
                item.value.toLowerCase().includes(this.state.searchInput.toLowerCase())
            ));
        }

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    visibleSearch={true}
                    searchHint={R.strings.searchHere2}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    onSearchCancel={() => {
                        if (this.state.searchInput !== '') {
                            this.setState({ searchInput: '' });
                        } else {
                            this.props.navigation.goBack()
                        }
                    }}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView >
                        <View>
                            {filteredList.map((item, index) =>
                                <MenuListItem
                                    key={item.value}
                                    rightIcon={R.images.IC_CHECKMARK}
                                    isSelected={item.selected}
                                    title={item.value}
                                    onPress={() => this.updateList(item)} />)}

                        </View>
                    </ScrollView>

                    <View style={{ padding: R.dimens.WidgetPadding, }}>
                       
                       {/* To Set Save Button */}
                        <Button title={R.strings.submit} onPress={() => {
                            let list = this.state.selectedList;
                            let filteredList = list.filter(el => el.selected)
                            this.props.navigation.state.params.updateList(filteredList);
                            this.props.navigation.goBack();
                        }}></Button>
                    </View>
                </View>


            </View>
        );
    }
}

export default MultipleSelection;