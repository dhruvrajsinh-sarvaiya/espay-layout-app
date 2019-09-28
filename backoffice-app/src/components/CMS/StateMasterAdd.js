// Bo_StateMasterAdd
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import { AddCountrylistData, AddCountrylistClear, EditCountrylistData, editCountrylistClear } from '../../actions/CMS/StateMasterAction'
import R from '../../native_theme/R';
import ComboPickerWidget from '../../components/widget/ComboPickerWidget';
import ProgressDialog from '../../native_theme/components/ProgressDialog';

class StateMasterAdd extends Component {
    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        const { params } = this.props.navigation.state;
        this.Country = [{ value: 'India' }, { value: 'Australia' }, { value: 'China' }, { value: 'Brazil' }, { value: 'Japan' }]
        this.status = [{ value: R.strings.active }, { value: R.strings.inActive }];
        this.state = {
            c_name: '',
            country: this.Country[0].value,
            Status: this.status[0].value,
            item: params == undefined ? undefined : params.data,
            getcountryname: params == undefined ? undefined : params.countryName
        }
        this.submitdata = this.submitdata.bind(this);
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        if (this.state.item !== null && this.state.item !== undefined) {
            this.setState({
                c_name: this.state.item.C_name,
                country: this.state.getcountryname,
                Status: this.state.item.C_status
            })
        }
    };

    submitdata = async () => {
        if (isEmpty(this.state.c_name)) {
            this.toast.Show(R.strings.State_name_blank)
            return;
        }
        else {

            if (this.state.item) {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let editCountry = {
                        id: this.state.item.C_id,
                        name: this.state.c_name,
                        country: this.state.country,
                        status: this.state.c_status,
                    }
                    this.props.EditCountrylistData(editCountry);
                }
            }
            else {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let AddCountry = {
                        name: this.state.c_name,
                        country: this.state.country,
                        status: this.state.c_status,
                    }
                    this.props.AddCountrylistData(AddCountry);
                }
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { AddCountrylistdata, AddedCountrylistdata, EditCountrylistdata, EditedCountrylistdata } = this.props;

        if (AddCountrylistdata != prevProps.AddCountrylistdata) {
            // for show responce of add data
            if (!AddedCountrylistdata) {
                try {
                    if (validateResponseNew({ response: AddCountrylistdata, returnCode: AddCountrylistdata.ReturnCode, returnMessage: AddCountrylistdata.ReturnMessage })) {
                        showAlert(R.strings.status, AddCountrylistdata.ReturnMessage, 0, () => {
                            this.props.AddCountrylistClear();
                            this.props.navigation.navigate('StateMaster')
                        })
                    }
                    else {
                        this.props.AddCountrylistClear();
                    }
                } catch (e) {
                    this.props.AddCountrylistClear();
                }
            }
            // -------------------------------
        }

        if (EditCountrylistdata != prevProps.EditCountrylistdata) {
            // for show responce of edit data
            if (!EditedCountrylistdata) {
                try {
                    if (validateResponseNew({ response: EditCountrylistdata, returnCode: EditCountrylistdata.ReturnCode, returnMessage: EditCountrylistdata.ReturnMessage })) {
                        showAlert(R.strings.status, EditCountrylistdata.ReturnMessage, 0, () => {
                            // editNewsLetterClear
                            this.props.editCountrylistClear();
                            this.props.navigation.navigate('StateMaster')
                        })
                    } else {
                        this.props.editCountrylistClear();
                    }
                } catch (e) {
                    this.props.editCountrylistClear();
                }
            }
            // -------------------------------
        }
    };

    render() {
        let { isAddCountrylist, isEditCountrylist } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />
                <CustomToolbar
                    title={this.state.item ? R.strings.EditState : R.strings.AddState}
                    isBack={true}
                    nav={this.props.navigation}
                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddCountrylist || isEditCountrylist} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>

                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                pickers={[
                                    {
                                        title: R.strings.SelectCountry,
                                        array: this.Country,
                                        selectedValue: this.state.country,
                                        onPickerSelect: (item) => this.setState({ country: item })
                                    }
                                ]}
                            />

                            <EditText
                                header={R.strings.State_Name}
                                placeholder={R.strings.State_Name}
                                placeholderTextColor={R.colors.textSecondary}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ c_name: Label })}
                                value={this.state.c_name}
                            />

                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                pickers={[
                                    {
                                        title: R.strings.Status,
                                        array: this.status,
                                        selectedValue: this.state.Status,
                                        onPickerSelect: (item) => this.setState({ Status: item })
                                    }
                                ]}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.state.item ? R.strings.update : R.strings.submit} onPress={this.submitdata}></Button>
                    </View>
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {

        //Adddata get from the reducer and set to NewsLetter
        isAddCountrylist: state.StateMasterReducer.isAddCountrylist,
        AddCountrylistdata: state.StateMasterReducer.AddCountrylistdata,
        AddedCountrylistdata: state.StateMasterReducer.AddedCountrylistdata,

        //  edit Country
        isEditCountrylist: state.StateMasterReducer.isEditCountrylist,
        EditCountrylistdata: state.StateMasterReducer.EditCountrylistdata,
        EditedCountrylistdata: state.StateMasterReducer.EditedCountrylistdata,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        AddCountrylistData: (AddCountry) => dispatch(AddCountrylistData(AddCountry)),
        AddCountrylistClear: () => dispatch(AddCountrylistClear()),

        EditCountrylistData: (editCountry) => dispatch(EditCountrylistData(editCountry)),
        editCountrylistClear: () => dispatch(editCountrylistClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateMasterAdd)