import { RootNavigator } from '../components/Navigation';

//This will introduce the first screen to display on app load
const mainStackAction = RootNavigator.router.getActionForPathAndParams('MainStack');
const initialNavState = RootNavigator.router.getStateForAction(mainStackAction);

//Nav reducer is used only for navigation for whole application
export default function navigationReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialNavState;
    }

    let nextState = RootNavigator.router.getStateForAction(action, state);

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}