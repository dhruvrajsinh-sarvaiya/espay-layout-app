import React from 'react'
import { Component } from 'react';
import { View, TouchableOpacity, } from 'react-native'
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { getCardStyle } from '../../native_theme/components/CardView';

//Create Common class for Pagination View
class PaginationWidget extends Component {

    constructor(props) {
        super(props)

        //Define initial state
        this.state = {

            // woking index from whole array to display it sub array
            currentDisplayPageIndex: 0,

            // number of items to display in Pagination
            numOfItems: 5,
        };
    };

    static getDerivedStateFromProps(props, state) {

        // indexes to reset pagination
        let firstIndexes = [0, 1];

        // if selected page is available in firstIndexes then reset pagination with 0
        if (firstIndexes.includes(props.selectedPage)) {

            // return currentDisplayPageIndex with 0
            return Object.assign({}, state, { currentDisplayPageIndex: 0 })
        }
        return null;
    }

    render() {

        let { row, selectedPage, onPageChange } = this.props;

        // if there's only one record then don't display pagination
        if (row.length <= 1) {
            return null;
        }

        // whole array with including sub array to display pagination for e.g. [[1,2],[3,4],....]
        let displayPages = [];

        // number of pages in displayPages
        let fullArray = Math.ceil(row.length / this.state.numOfItems);

        // loop through all pages to add in displayPages
        for (let i = 0; i < fullArray; i++) {

            // subArray Item of main array
            let subArray = [];

            // current item index with formula Current Index * NumberOfItems
            let currentItemIndex = i * this.state.numOfItems;

            // loop to number of items to add in sub array
            for (let j = 0; j < this.state.numOfItems; j++) {

                // if current item is not undefined than add in sub array
                if (row[currentItemIndex + j] !== undefined) {
                    subArray.push(row[currentItemIndex + j]);
                }
            }

            // add final array in displayPages
            displayPages.push(subArray);
        }

        // number of records missing in last block
        let remainingCounts = this.state.numOfItems - displayPages[displayPages.length - 1].length;

        // if there are more than 1 record in displayPages and remaining count is greater than 0 than add missing rows
        if (displayPages.length > 1 && remainingCounts > 0) {

            // last item from displayPages
            let lastItems = displayPages[displayPages.length - 1];

            // Previous Item
            let prevRecord = displayPages[displayPages.length - 2];

            let firstItems = [];

            // number of remaining counts
            for (let i = 1; i <= remainingCounts; i++) {

                // if previous items are not undefined than add in first half blocks
                if (prevRecord[this.state.numOfItems - i] !== undefined) {
                    firstItems.push(prevRecord[this.state.numOfItems - i]);
                }
            }

            // concate first and last blocks to create sub array item
            let finalRecord = firstItems.sort(function (a, b) { return a - b });

            // To remove last item
            displayPages.pop();

            // to add last item as per new structure
            displayPages.push(finalRecord.concat(lastItems));
        }

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <View style={{
                    flexDirection: 'row',
                    margin: R.dimens.margin,
                    alignItems: 'center',
                }}>
                    <DisplayPage
                        isFirst
                        key={-2}
                        pageNo={'<<'}
                        selectedPage={false}
                        disabled={selectedPage == row[0]}
                        onPress={() => {
                            this.setState({ currentDisplayPageIndex: 0 })
                            onPageChange(row[0])
                        }} />
                    <DisplayPage
                        key={-1}
                        pageNo={'<'}
                        selectedPage={false}
                        disabled={selectedPage == row[0]}
                        onPress={() => {
                            if (displayPages[this.state.currentDisplayPageIndex][0] == selectedPage) {
                                this.setState({ currentDisplayPageIndex: this.state.currentDisplayPageIndex - 1 })
                            }
                            onPageChange(row[selectedPage - 2])
                        }} />

                    {displayPages[this.state.currentDisplayPageIndex].map((item, index) => {
                        return <DisplayPage
                            key={index}
                            pageNo={item}
                            selectedPage={selectedPage}
                            disabled={selectedPage == item}
                            onPress={() => onPageChange(item)} />
                    })}

                    <DisplayPage
                        key={row.length + 1}
                        pageNo={'>'}
                        selectedPage={false}
                        disabled={selectedPage == row[row.length - 1]}
                        onPress={() => {
                            if (displayPages[this.state.currentDisplayPageIndex][this.state.numOfItems - 1] == selectedPage) {
                                this.setState({ currentDisplayPageIndex: this.state.currentDisplayPageIndex + 1 })
                            }
                            onPageChange(row[selectedPage])
                        }} />
                    <DisplayPage
                        key={row.length + 2}
                        pageNo={'>>'}
                        selectedPage={false}
                        disabled={selectedPage == row[row.length - 1]}
                        onPress={() => {
                            this.setState({ currentDisplayPageIndex: displayPages.length - 1 })
                            onPageChange(row[row.length - 1])
                        }} />
                </View>

            </View >
        )
    }
}

//To Display Button As Per Response at run Time
//To Display Selected Button Color Green and Other Button Color to White
const DisplayPage = (props) => {
    let bgcolor = '';
    let fontcolor = '';

    //If same page selected then button background Color is Green and text color is white
    //else button background color is white and text color is grey
    if (props.selectedPage == props.pageNo) {
        bgcolor = R.colors.paginationSelectedBox
        fontcolor = R.colors.paginationSelectedText
    } else {
        bgcolor = R.colors.paginationUnSelectedBox
        fontcolor = R.colors.paginationUnSelectedText
    }

    if (['<<', '<', '>', '>>'].includes(props.pageNo) && props.disabled) {
        fontcolor = R.colors.textSecondary
    }

    return (
        <TouchableOpacity style={[{
            height: R.dimens.MENU_ICON_SIZE,
            width: R.dimens.MENU_ICON_SIZE,
            marginRight: R.dimens.widgetMargin,
            marginLeft: props.isFirst ? R.dimens.widgetMargin : 0,
            ...getCardStyle(R.dimens.CardViewElivation),
            justifyContent: 'center',
            alignItems: 'center',
        }, { backgroundColor: bgcolor, }]}
            opacity={0.5}
            disabled={props.disabled}
            onPress={props.onPress}>
            <TextViewHML style={[{
                fontSize: R.dimens.listItemText,
                alignSelf: 'center',
                textAlign: 'center'
            }, { color: fontcolor }]}>{props.pageNo}</TextViewHML>
        </TouchableOpacity>
    )
}
export default PaginationWidget;