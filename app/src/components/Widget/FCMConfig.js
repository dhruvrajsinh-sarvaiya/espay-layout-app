import React, { Component } from 'react';
import FCM, { FCMEvent } from "react-native-fcm";
import { getData, setData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { isEmpty } from '../../validations/CommonValidation';
import { AppConfig } from '../../controllers/AppConfig';

class FCMConfig extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        //To request permission which is require for FCM
        FCM.requestPermissions();

        //FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
        FCM.createNotificationChannel({
            id: 'default',
            name: 'Default',
            description: AppConfig.appName,
            priority: 'high'
        })

        //if token is empty in preference then get token
        if (isEmpty(getData(ServiceUtilConstant.FCMToken))) {

            //To get the FCM token
            FCM.getFCMToken().then(token => {
                // logger("FCM Token : ", token);

                //To store token in Preference
                setData({[ServiceUtilConstant.FCMToken]: token})
            });
        } else {
            //Token is already stored
            // logger("FCM Token : ", getData(ServiceUtilConstant.FCMToken))
        }

        //To get initial notification if any from FCM
        FCM.getInitialNotification().then(notif => {
            // logger("INITIAL NOTIFICATION", notif);
        });

        //This method is used to show notification when any notification is sent from server API
        this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, notif => {

            //To show push notification
            this.sendRemote(notif);
        });

        // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
        this.refreshUnsubscribe = FCM.on(FCMEvent.RefreshToken, token => {
            //logger("TOKEN (refreshUnsubscribe)", token);

            //To store refreshed token
            setData({[ServiceUtilConstant.FCMToken]: token})
        });
    };

    sendRemote(notif) {
        //logger(JSON.stringify(notif));

        try {
            //If title and message is available in notification details then show notification
            if (notif.contentTitle && notif.message) {
                let tickerText = notif.tickerText;
                let contentTitle = notif.contentTitle;
                let message = notif.message;

                FCM.presentLocalNotification({
                    channel: 'default',
                    id: new Date().valueOf().toString(), // (optional for instant notification)
                    ticker: tickerText,
                    title: contentTitle,
                    body: message,
                    click_action: setData({
                        [ServiceUtilConstant.KEY_FromTray]: true,
                        notification: {
                            ticker: tickerText,
                            title: contentTitle,
                            message: message,
                        }
                    }),
                    show_in_foreground: true,
                    priority: "high",
                })
            } else {

                //if nothing is there is notificaiton then return
                return;
            }

        } catch (error) {
            //logger(error.message);

            //if throw any exception then return
            return;
        }
    }

    render() {
        return null;
    }
}

export default FCMConfig;