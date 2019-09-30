// BO_StateMasterSaga
import { put, call, takeLatest } from 'redux-saga/effects';
import {
    GET_COUNTYLIST,
    COUNTYLIST_ADD,
    COUNTYLIST_EDIT,
    DELETE_COUNTRY
} from '../../actions/ActionTypes';
import {
    CountrylistDataSuccess, CountrylistDataFailure, AddCountrylistSuccess, AddCountrylistFailure,
    EditCountrylistSuccess, EditCountrylistFailure, DeleteCountrylistSuccess, DeleteCountrylistFailure
} from '../../actions/CMS/StateMasterAction';

// ---------------------------------------------fetching list of Country 
function* CountryListFatchData() {
    try {
        const data = yield call(ResponceList)
        yield put(CountrylistDataSuccess(data))
    } catch (e) {
        yield put(CountrylistDataFailure())
    }
}

//pass list of Country
export function ResponceList() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(responce)
        }, 500)
    })
}
// ----------------------------------------------for add New Country

function* AddCountryData(action) {
    try {
        const data = yield call(Countryadd)
        yield put(AddCountrylistSuccess(data))
    } catch (e) {
        yield put(AddCountrylistFailure())
    }
}

//
export function Countryadd() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "ReturnCode": "0",
                "ReturnMessage": "State Added Successfully"
            })
        }, 200)
    })
}

// ----------------------------------------------for edit Country

function* EditCountryData() {
    try {
        const data = yield call(countryedit)
        yield put(EditCountrylistSuccess(data))
    } catch (e) {
        yield put(EditCountrylistFailure())
    }
}

//pass edit Country
export function countryedit() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "ReturnCode": "0",
                "ReturnMessage": "State edited Successfully"
            })
        }, 200)
    })
}

// ---------------------------------------

// ----------------------------------------------for Delete Country

function* DeleteCountryData() {
    try {
        const data = yield call(countryDelete)
        yield put(DeleteCountrylistSuccess(data))
    } catch (e) {
        yield put(DeleteCountrylistFailure())
    }
}

//pass delete Country
export function countryDelete() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                "ReturnCode": "0",
                "ReturnMessage": "Record Deleted Successfully"
            })
        }, 500)
    })
}

// ---------------------------------------

function* StateMasterSaga() {
    yield takeLatest(GET_COUNTYLIST, CountryListFatchData)
    yield takeLatest(COUNTYLIST_ADD, AddCountryData)
    yield takeLatest(COUNTYLIST_EDIT, EditCountryData)
    yield takeLatest(DELETE_COUNTRY, DeleteCountryData)

}
export default StateMasterSaga;

const responce = {
    "ReturnCode": "0",
    "ReturnMessage": "Success Data",
    "List": [
        {
            "id": "01", "county": "india",
            "stateList": [
                {
                    "C_id": "101", "C_name": "Assam",
                    "C_status": "Active",
                },
                {
                    "C_id": "102",
                    "C_name": "Bihar",
                    "C_status": "InActive",
                },
                {
                    "C_id": "103", "C_name": "Gujarat",
                    "C_status": "Active",
                },
                {
                    "C_id": "104",
                    "C_name": "Haryana",
                    "C_status": "InActive",
                },
                {
                    "C_id": "105",
                    "C_name": "Panjab", "C_status": "InActive",
                },
                {
                    "C_id": "106",
                    "C_name": "Karnataka",
                    "C_status": "Active",
                },
                {
                    "C_id": "107",
                    "C_name": "Chennai", "C_status": "InActive",
                },
                {
                    "C_id": "108", "C_name": "TamilNadu",
                    "C_status": "InActive",
                }

            ]
        },
        {
            "id": "02",
            "county": "Australia", "stateList": [
                {
                    "C_id": "201",
                    "C_name": "New South Wales",
                    "C_status": "InActive",
                },
                {
                    "C_id": "202",
                    "C_name": "Queensland",
                    "C_status": "InActive",
                },
                {
                    "C_id": "203", "C_name": "South Australia",
                    "C_status": "Active",
                },
                {
                    "C_id": "204",
                    "C_name": "Tasmania",
                    "C_status": "InActive",
                },
                {
                    "C_id": "205", "C_name": "Victoria", "C_status": "Active",
                }

            ]
        },
        {
            "id": "03",
            "county": "China",
            "stateList": [
                {
                    "C_id": "301",
                    "C_name": "Beijing",
                    "C_status": "Active",
                },

                {
                    "C_id": "302",
                    "C_name": "Qinghai",
                    "C_status": "InActive",
                },
                {
                    "C_id": "303",
                    "C_name": "Jilin", "C_status": "InActive",
                },
                {
                    "C_id": "304", "C_name": "Gansu",
                    "C_status": "InActive",
                },
                {
                    "C_id": "305",
                    "C_name": "Guangdong",
                    "C_status": "Active",
                }

            ]
        },
        {
            "id": "04",
            "county": "Brazil",
            "stateList": [
                {
                    "C_id": "401", "C_name": "Acre",
                    "C_status": "Active",
                },
                {
                    "C_id": "402",
                    "C_name": "Alagoas",
                    "C_status": "InActive",
                },
                {
                    "C_id": "403", "C_name": "Bahia",
                    "C_status": "InActive",
                },
                {
                    "C_id": "404",
                    "C_name": "Ceara",
                    "C_status": "Active",
                },
                {
                    "C_id": "405", "C_name": "Espirito",
                    "C_status": "Active",
                }

            ]
        },
        {
            "id": "05",
            "county": "Japan",
            "stateList": [{
                "C_id": "501", "C_name": "Chiba", "C_status": "InActive",
            },
            {
                "C_id": "502",
                "C_name": "Gunma",
                "C_status": "InActive",
            },
            {
                "C_id": "503",
                "C_name": "Hiroshima", "C_status": "Active",
            },
            {
                "C_id": "504", "C_name": "Ishikawa",
                "C_status": "InActive",
            },
            { "C_id": "505", "C_name": "Osaka", "C_status": "Active", }

            ]
        },
        {
            "id": "06",
            "county": "india-2", "stateList": [
                {
                    "C_id": "601", "C_name": "Assam",
                    "C_status": "Active",
                },
                {
                    "C_id": "602", "C_name": "Bihar",
                    "C_status": "InActive",
                },
                { "C_id": "603", "C_name": "Gujarat", "C_status": "Active", },
                {
                    "C_id": "604", "C_name": "Haryana",
                    "C_status": "InActive",
                },
                {
                    "C_id": "605",
                    "C_name": "Panjab",
                    "C_status": "InActive",
                },
                {
                    "C_id": "606", "C_name": "Karnataka",
                    "C_status": "Active",
                },
                {
                    "C_id": "607",
                    "C_name": "Chennai", "C_status": "InActive",
                },
                {
                    "C_id": "608",
                    "C_name": "TamilNadu",
                    "C_status": "InActive",
                }

            ]
        },
        {

            "id": "07", "county": "Australia-2", "stateList": [
                {
                    "C_id": "701",

                    "C_name": "New South Wales",
                    "C_status": "InActive",
                },
                { "C_id": "702", 
                    "C_name": "Queensland", "C_status": "InActive", },
                {
                    "C_id": "703",  "C_name": "South Australia",  "C_status": "Active",
                },
                {
                    "C_id": "704", "C_name": "Tasmania",
                    "C_status": "InActive", },
                {
                    "C_id": "705",
                    "C_name": "Victoria", "C_status": "Active",
                }

            ]
        },
        {
            "id": "08",
            "county": "China-2",
            "stateList":
                [ {"C_id": "801", "C_name": "Beijing", "C_status": "Active", },
                    {
                        "C_id": "802",
                        "C_name": "Qinghai", "C_status": "InActive",
                    },
                    {
                        "C_id": "803", "C_name": "Jilin", "C_status": "InActive",
                    },
                    {
                        "C_id": "804",
                        "C_name": "Gansu",
                        "C_status": "InActive",
                    },
                    {
                        "C_id": "805",
                        "C_name": "Guangdong",
                        "C_status": "Active",}

                ]
        },
        {
            "id": "09",
            "county": "Brazil-2", "stateList": [
                {  "C_id": "901", "C_name": "Acre",
                    "C_status": "Active",  },
                {
                    "C_id": "902",
                    "C_name": "Alagoas",
                    "C_status": "InActive",
                },
                {
                    "C_id": "903",
                    "C_name": "Bahia",
                    "C_status": "InActive",
                },
                {
                    "C_id": "904",
                    "C_name": "Ceara",
                    "C_status": "Active",
                },
                {
                    "C_id": "905", "C_name": "Espirito",
                    "C_status": "Active",
                }

            ]
        },
        {
            "id": "10",
            "county": "Japan-2", "stateList": [
                {
                    "C_id": "1001",
                    "C_name": "Chiba",
                    "C_status": "InActive",
                },
                {
                    "C_id": "102",
                    "C_name": "Gunma",
                    "C_status": "InActive",
                },
                {
                    "C_id": "1003",
                    "C_name": "Hiroshima", "C_status": "Active",
                },
                {
                    "C_id": "1004",
                    "C_name": "Ishikawa",
                    "C_status": "InActive",
                },
                {
                    "C_id": "1005", "C_name": "Osaka",
                    "C_status": "Active",
                }

            ]
        }
    ]
}