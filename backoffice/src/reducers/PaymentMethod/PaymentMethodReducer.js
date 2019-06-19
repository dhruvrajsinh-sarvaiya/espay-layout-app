import {
  GET_PAYMENTMETHOD,
  GET_PAYMENTMETHOD_SUCCESS,
  GET_PAYMENTMETHOD_FAILURE,
  UPDATE_PAYMENTMETHOD,
  UPDATE_PAYMENTMETHOD_SUCCESS,
  UPDATE_PAYMENTMETHOD_FAILURE,
  ADD_PAYMENTMETHOD,
  ADD_PAYMENTMETHOD_SUCCESS,
  ADD_PAYMENTMETHOD_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  paymentMethodData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PAYMENTMETHOD:
      return { ...state, Loading: true };

    case GET_PAYMENTMETHOD_SUCCESS:
      return {
        ...state,
        Loading: false,
        paymentMethodData: action.payload
      };

    case GET_PAYMENTMETHOD_FAILURE:
      return { ...state, Loading: false };

    case UPDATE_PAYMENTMETHOD:
      return { ...state, loading: true, success: action.payload };

    case UPDATE_PAYMENTMETHOD_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case UPDATE_PAYMENTMETHOD_FAILURE:
      return { ...state, loading: false };

    case ADD_PAYMENTMETHOD:
      return { ...state, loading: true, success: action.payload };

    case ADD_PAYMENTMETHOD_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case ADD_PAYMENTMETHOD_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
