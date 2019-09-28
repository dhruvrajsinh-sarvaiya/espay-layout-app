import React, { Component } from 'react';
import { View, Text, FlatList, Image, RefreshControl, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addPages, convertDateTime, getCurrentDate } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { getComplainList, clearComplainData, } from '../../../actions/account/HelpAndSupportActions';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import R from '../../../native_theme/R';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { DateValidation } from '../../../validations/DateValidation';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

class ComplainReportScreen extends Component {
   constructor(props) {
      super(props)

      // Getting data from previous screen
      let status = props.navigation.state.params && props.navigation.state.params.Status
      let all = props.navigation.state.params && props.navigation.state.params.All

      // Define initial state
      this.state = {
         All: all,
         ComplainListResponse: [],
         row: [],
         selectedPage: 1,
         refreshing: false,

         searchInput: '',
         ComplainId: '',
         PriorityType: [
            { value: R.strings.Please_Select },
            { value: R.strings.urgent, Id: 1 },
            { value: R.strings.high, Id: 2 },
            { value: R.strings.medium, Id: 3 },
            { value: R.strings.low, Id: 4 },
         ],
         selecetdPriority: R.strings.Please_Select,
         priorityId: '',

         StatusArray: [
            { value: R.strings.select_status },
            { value: R.strings.open, Id: 1 },
            { value: R.strings.Close, Id: 2 },
            { value: R.strings.Pending, Id: 3 },
         ],
         selectedStatus: R.strings.select_status,

         Type: [
            { value: R.strings.Please_Select },
            { value: R.strings.Transaction, Id: 2 },
            { value: R.strings.Wallet, Id: 5 },
            { value: R.strings.MyAccount, Id: 6 },
         ],
         selectedType: R.strings.Please_Select,
         typeId: '',

         Status: !all ? status : '',
         isFirstTime: true,
         isDrawerOpen: false,

         FromDate: getCurrentDate(),
         ToDate: getCurrentDate(),
      };

      this.Request = {
         PageIndex: 0,
         Page_Size: AppConfig.pageSize,
         FromDate: getCurrentDate(),
         ToDate: getCurrentDate(),
         Status: !all ? status : '',
      }

      // create reference
      this.drawer = React.createRef();
      this.inputs = {};

      addRouteToBackPress(props);
      this.onBackPress = this.onBackPress.bind(this);
      this.props.navigation.setParams({ onBackPress: this.onBackPress });
   }

   // for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
   onBackPress() {
      if (this.state.isDrawerOpen) {
         this.drawer.closeDrawer();
         this.setState({ isDrawerOpen: false })
      }
      else {
         //goging back screen
         this.props.navigation.goBack();
      }
   }

   componentDidMount = async () => {
      //Add this method to change theme based on stored theme name.
      changeTheme();

      // Check internet connection
      if (await isInternet()) {

         // Called Complain List Api
         this.props.getComplainList(this.Request)

      }
   }

   componentWillUnmount() {

      //clear data backpress
      this.props.clearComplainData()
   }

   shouldComponentUpdate = (nextProps, _nextState) => {
      // stop twice api call
      return isCurrentScreen(nextProps)
   };

   // this method is called when page change and also api call
   onPageChange = async (pageNo) => {
      if (this.state.selectedPage !== pageNo) {

         this.setState({ selectedPage: pageNo });

         //Check NetWork is Available or not
         if (await isInternet()) {
            this.Request = {
               ...this.Request,
               PageIndex: pageNo - 1,
            }
            // Called Complain List Api
            this.props.getComplainList(this.Request)
         } else {
            this.setState({ refreshing: false })
         }
      }
   }

   //this Method is used to focus on next feild 
   focusNextField(id) {
      this.inputs[id].focus();
   }

   // When user swipe on
   onRefresh = async (needUpdate, fromRefreshControl = false) => {
      if (fromRefreshControl)
         this.setState({ refreshing: true });

      // Check internet connection
      if (needUpdate && await isInternet()) {
         // Called Complain List Api
         this.props.getComplainList(this.Request)
      } else {
         this.setState({ refreshing: false })
      }
   }

   // User press on detail button
   onDetail = (item) => {
      let { navigate } = this.props.navigation
      navigate('ComplainReportDetailScreen', { ITEM: item })
   }

   // User press on reset button from Drawer
   onReset = async () => {
      // Close Drawer user press on Complete button bcoz display flatlist item on Screen
      this.drawer.closeDrawer();

      this.setState({
         ComplainId: '',
         selectedPage: 1,
         FromDate: getCurrentDate(),
         ToDate: getCurrentDate(),
         selectedStatus: R.strings.select_status,
         selectedType: R.strings.Please_Select,
         selecetdPriority: R.strings.Please_Select
      })

      // Check internet connection
      if (await isInternet()) {
         this.Request = {
            PageIndex: 0,
            Page_Size: AppConfig.pageSize,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
         }

         // Called Complain List Api
         this.props.getComplainList(this.Request)
      }
   }

   // User press on complete button from Drawer
   onComplete = async () => {
      // Close Drawer user press on Complete button bcoz display flatlist item on Screen
      this.drawer.closeDrawer();

      //Check All From Date Validation
      if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
         this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
         return;
      }

      // Check internet connection
      if (await isInternet()) {

         this.Request = {
            ...this.Request,
            PageIndex: 0,
            FromDate: this.state.FromDate,
            ToDate: this.state.ToDate,
            ComplainId: this.state.ComplainId,
            Status: this.state.All ? (this.state.selectedStatus !== R.strings.select_status ? this.state.Status : '') : this.state.Status,
            TypeId: this.state.selectedType !== R.strings.Please_Select ? this.state.typeId : '',
            PriorityId: this.state.selecetdPriority !== R.strings.Please_Select ? this.state.priorityId : '',
         }
         // Called Complain List Api
         this.props.getComplainList(this.Request)
      }
   }

   static oldProps = {};

   static getDerivedStateFromProps(props, state) {
      //To Skip Render First Time for available reducer data if exists
      if (state.isFirstTime) {
         return {
            ...state,
            isFirstTime: false,
         };
      }

      // To Skip Render if old and new props are equal
      if (ComplainReportScreen.oldProps !== props) {
         ComplainReportScreen.oldProps = props;
      } else {
         return null;
      }

      if (isCurrentScreen(props)) {
         //Get All Updated Feild of Particular actions
         const { ComplainListData } = props.ComplainListResult;

         //  ComplainListData is not null
         if (ComplainListData) {
            try {
               if (state.ComplainListData == null || (state.ComplainListData != null && ComplainListData !== state.ComplainListData)) {

                  if (validateResponseNew({ response: ComplainListData, isList: true })) {
                     //check Complain List is an Array Or not
                     //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                     let finalRes = parseArray(ComplainListData.GetTotalCompList);

                     return Object.assign({}, state, {
                        ComplainListResponse: finalRes,
                        refreshing: false,
                        row: addPages(ComplainListData.TotalCount),
                        ComplainListData
                     })
                  } else {
                     return Object.assign({}, state, { ComplainListResponse: [], refreshing: false, ComplainListData: null, row: [] })
                  }
               }
            } catch (error) {
               //logger('Complain List Error', e.message)
               return Object.assign({}, state, { ComplainListResponse: [], refreshing: false, ComplainListData: null, row: [] })
            }
         }
      }
      return null
   }

   navigationDrawer = () => {
      let pickers = [
         {
            title: R.strings.priority,
            array: this.state.PriorityType,
            selectedValue: this.state.selecetdPriority,
            onPickerSelect: (item, object) => this.setState({ selecetdPriority: item, priorityId: object.Id })
         },
      ]

      if (this.state.All) {
         pickers = [
            ...pickers,
            {
               title: R.strings.Status,
               array: this.state.StatusArray,
               selectedValue: this.state.selectedStatus,
               onPickerSelect: (item, object) => this.setState({ selectedStatus: item, Status: object.Id })
            },
         ]
      }
      pickers = [
         ...pickers,
         {
            title: R.strings.Type,
            array: this.state.Type,
            selectedValue: this.state.selectedType,
            onPickerSelect: (item, object) => this.setState({ selectedType: item, typeId: object.Id })
         },
      ]

      return (
         <FilterWidget
            FromDatePickerCall={(date) => this.setState({ FromDate: date })}
            ToDatePickerCall={(date) => this.setState({ ToDate: date })}
            toastRef={component => this.toast = component}
            FromDate={this.state.FromDate}
            ToDate={this.state.ToDate}
            textInputStyle={{ marginTop: 0, marginBottom: 0, }}
            textInputs={[
               {
                  header: R.strings.complaint_id,
                  placeholder: R.strings.complaint_id,
                  multiline: false,
                  keyboardType: 'numeric',
                  returnKeyType: "done",
                  onChangeText: (text) => { this.setState({ ComplainId: text }) },
                  value: this.state.ComplainId,
               },
            ]}
            comboPickerStyle={{ marginTop: 0, }}
            pickers={pickers}
            onResetPress={this.onReset}
            onCompletePress={this.onComplete}
         />
      )
   }

   render() {

      //set title of screen
      let actionbarTitle = R.strings.complaint_list
      if (this.state.Status == 1)
         actionbarTitle = R.strings.OpenComplain
      else if (this.state.Status == 2)
         actionbarTitle = R.strings.CloseComplain
      else if (this.state.Status == 3)
         actionbarTitle = R.strings.PendingComplain

      // Loading status for Progress bar which is fetching from reducer
      let { ComplainListLoading } = this.props.ComplainListResult

      // For searching functionality
      let finalItems = this.state.ComplainListResponse

      finalItems = finalItems.filter(item =>
         item.ComplainId.toString().includes(this.state.searchInput) ||
         item.Type.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
         item.Status.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
      )


      return (
         // Drawer for Complain Report Filteration
         <Drawer
            ref={component => this.drawer = component}
            drawerWidth={R.dimens.FilterDrawarWidth}
            drawerPosition={Drawer.positions.Right}
            drawerContent={this.navigationDrawer()}
            onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            onDrawerClose={() => this.setState({ isDrawerOpen: false })}
            type={Drawer.types.Overlay}
            easingFunc={Easing.ease}>

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
               {/* To set status bar as per our theme */}
               <CommonStatusBar />

               {/* To set toolbar as per our theme */}
               <CustomToolbar
                  title={actionbarTitle}
                  isBack={true}
                  nav={this.props.navigation}
                  searchable={true}
                  onSearchText={(text) => this.setState({ searchInput: text })}
                  rightIcon={R.images.FILTER}
                  onRightMenuPress={() => this.drawer.openDrawer()}
               />

               <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  {
                     (ComplainListLoading && !this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                           <FlatList
                              showsVerticalScrollIndicator={false}
                              data={finalItems}
                              // render all item in list
                              renderItem={({ item, index }) => {
                                 return <ComplainReportItem
                                    index={index}
                                    item={item}
                                    size={this.state.ComplainListResponse.length}
                                    onDetail={() => this.onDetail(item)}
                                 />
                              }}
                              /* assign index as key valye to list item */
                              keyExtractor={(item, index) => index.toString()}
                              contentContainerStyle={contentContainerStyle(finalItems)}
                              ListEmptyComponent={<ListEmptyComponent />}
                              refreshControl={<RefreshControl
                                 colors={[R.colors.accent]}
                                 progressBackgroundColor={R.colors.background}
                                 refreshing={this.state.refreshing}
                                 onRefresh={() => this.onRefresh(true, true)}
                              />}
                           />
                        </View>
                  }

                  {/*To Set Pagination View  */}
                  <View>
                     {
                        finalItems.length > 0 &&
                        <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                     }
                  </View>
               </View>
            </SafeView>
         </Drawer>
      )
   }
}

export class ComplainReportItem extends Component {
   constructor(props) {
      super(props);
   }

   shouldComponentUpdate(nextProps, _nextState) {
      //if old item and new item are different than only render list item
      if (this.props.item !== nextProps.item)
         return true
      return false
   }

   render() {
      let { index, size, item } = this.props;

      //set status color
      let statusColor = R.colors.yellow
      if (item.Status.toLowerCase() === 'open')
         statusColor = R.colors.successGreen
      else if (item.Status.toLowerCase() === 'close')
         statusColor = R.colors.failRed

      return (
         // Flatlist item animation
         <AnimatableItem>
            <View style={{
               flex: 1,
               marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
               marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
               marginLeft: R.dimens.widget_left_right_margin,
               marginRight: R.dimens.widget_left_right_margin
            }}>
               <CardView style={{
                  elevation: R.dimens.listCardElevation,
                  flex: 1,
                  borderRadius: 0,
                  borderBottomLeftRadius: R.dimens.margin,
                  borderTopRightRadius: R.dimens.margin,
               }} onPress={this.props.onDetail}>

                  {/* for show Subject ,Type or icon for detail  */}
                  <View style={{ flexDirection: 'row' }}>
                     <View style={{ width: '94%', flexDirection: 'row', }}>
                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ width: '60%', fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{item.Subject ? item.Subject : '-'}</Text>
                        <Text style={{ width: '40%', fontSize: R.dimens.smallText, color: R.colors.successGreen, fontFamily: Fonts.MontserratSemiBold, textAlign: 'right' }}>{item.Type ? item.Type : '-'}</Text>
                     </View>
                     <View style={{ width: '6%', justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end', }}>
                        <Image
                           source={R.images.RIGHT_ARROW_DOUBLE}
                           style={{
                              padding: R.dimens.widgetMargin,
                              paddingLeft: 0,
                              paddingRight: 0,
                              tintColor: R.colors.textPrimary,
                              width: R.dimens.dashboardMenuIcon,
                              height: R.dimens.dashboardMenuIcon,
                           }} />
                     </View>
                  </View>

                  {/* for show ComplainId ,priority,Description */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.complaint_id}</TextViewHML>
                     <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{': '}{item.ComplainId ? item.ComplainId : '-'}</TextViewHML>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.priority}</TextViewHML>
                     <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{': '}{item.Priority ? item.Priority : '-'}</TextViewHML>
                  </View>

                  <TextViewHML
                     numberOfLines={2}
                     ellipsizeMode="tail"
                     style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{item.Description ? item.Description : '-'}</TextViewHML>

                  {/* for show Status ,date */}
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                     <StatusChip
                        color={statusColor}
                        value={item.Status ? item.Status : '-'}></StatusChip>
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ImageTextButton
                           style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                           icon={R.images.IC_TIMER}
                           iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                        />
                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate) : '-'}</TextViewHML>
                     </View>
                  </View>
               </CardView>
            </View>
         </AnimatableItem>
      )
   }

   styles = () => {
      return {
         simpleText: {
            color: R.colors.textPrimary,
            fontSize: R.dimens.smallText,
         },
         simpleItem: {
            flexDirection: 'row',
            marginTop: R.dimens.widget_top_bottom_margin,
            marginLeft: R.dimens.widget_left_right_margin,
            marginRight: R.dimens.widgetMargin,
         },
      }
   }
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
   return {
      ComplainListResult: state.HelpAndSupportReducer,
   }
}

const mapDispatchToProps = (dispatch) => ({
   // Method for Complaint List
   getComplainList: (payload) => dispatch(getComplainList(payload)),
   // Method for clear complain list
   clearComplainData: () => dispatch(clearComplainData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ComplainReportScreen);
