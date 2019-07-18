import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

var GlobalEventEmit = NativeModules.GlobalEventEmitter;

export function emitGlobalEvent(eventName = null, ...restArguments) {

    // if event name is not null
    if (eventName) {

        // if platform is iOS than generate emit manually
        if (Platform.OS == 'ios') {

            // create arguments object, default with eventName
            let argumentObj = { eventName: eventName };

            for (var i = 0; i < restArguments.length; i++) {
                argumentObj['arg' + i] = restArguments;
            }

            // emit event at Xcode native module method
            GlobalEventEmit.emit(argumentObj);
        } else {

            // use inbuilt NativeEventEmitter if Platform is android
            new NativeEventEmitter().emit(eventName, ...restArguments);
        }
    }
}

export function addListenerGlobalEvent(eventName, methodExec) {

    // if platform is iOS than handle methodExec manually
    if (Platform.OS == 'ios') {

        // create listener of GlobalEventEmit for 'EMITTER' method
        let listener = new NativeEventEmitter(GlobalEventEmit).addListener('EMITTER', (obj) => {
            
            // default argments can be empty
            let restArguments = [];

            // add arguments to restArguments if it has other objects than eventName
            for (let index = 0; index < Object.keys(obj.arg).length - 1; index++) {
                restArguments.push(obj.arg['arg' + index]);
            }

            // if argument event name and received object from listener method is same than execute method
            if (eventName === obj.arg.eventName) {

                // execute method with rest arguments
                methodExec(...restArguments)
            }
        });

        // returning listener so it can be removed in componentWillUnmount method
        return listener;
    } else {

        // use inbuilt DeviceEventEmitter if Platform is android
        return DeviceEventEmitter.addListener(eventName, methodExec);
    }
}