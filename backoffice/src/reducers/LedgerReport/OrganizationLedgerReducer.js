import {
    GET_ORGANIZATION_LEDGER_LIST,
    GET_ORGANIZATION_LEDGER_LIST_SUCCESS,
    GET_ORGANIZATION_LEDGER_LIST_FAIL
} from 'Actions/types';

const INIT_STATE = {
    OrganizationLedger: [],
    Loading: false
};

export default (state = INIT_STATE, action) => {


    switch (action.type) {
        //For Display Users
        case GET_ORGANIZATION_LEDGER_LIST:
            return { ...state, loading: true };

        case GET_ORGANIZATION_LEDGER_LIST_SUCCESS:
            return { ...state, loading: false, OrganizationLedger: action.payload };

        case GET_ORGANIZATION_LEDGER_LIST_FAIL:
            return { ...state, loading: false,OrganizationLedger:[] };

        //For Delete Users

        default:
            return { ...state };
    }
};
