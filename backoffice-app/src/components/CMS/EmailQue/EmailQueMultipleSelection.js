import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import R from '../../../native_theme/R';
import MenuListItem from '../../../native_theme/components/MenuListItem';

class EmailQueMultipleSelection extends Component {
    constructor(props) {
        super(props);

        // get data from props
        let data = props.navigation.state.params.data;

        let multiSelectArray = [];
        if (data) {
            data.map(item => {

                let selectedItemIndex = data.findIndex(el => el.value === item.value);
                multiSelectArray.push({ value: item.value, selected: selectedItemIndex > -1 });
            })
        }

        //Define All initial State
        this.state = {
            data: multiSelectArray,
            searchInput: ''
        };
    }

    render() {

        let filteredList = null;

        // For searching functionality
        if (this.state.data) {
            filteredList = this.state.data.filter(item => (
                item.value.toLowerCase().includes(this.state.searchInput.toLowerCase())
            ));
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: R.colors.background
                }}>

                {/* To set status bar as per our theme */}

                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    searchHint={R.strings.searchHere2}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                    onSearchCancel={() => {
                        if (this.state.searchInput !== '') {
                            this.setState({
                                searchInput: ''
                            });
                        } else {
                            this.props.navigation.goBack()
                        }
                    }}
                    visibleSearch={true}
                />

                <View style={{ flex: 1, }}>
                    <ScrollView >
                        <View>
                            {filteredList.map((item, index) =>
                                <MenuListItem
                                    key={index.toString()}
                                    title={item.value}
                                    isSelected
                                />)}

                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default EmailQueMultipleSelection;