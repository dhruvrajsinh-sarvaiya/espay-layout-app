import React from "react";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";


import {PushNotificationQueue} from "Components/PushNotificationQueue";
// intl messages
import IntlMessages from "Util/IntlMessages"; 

const PushNotificationData = ({ match }) => (
    <div className="dashboard-wrapper">
    <PageTitleBar
                    title={<IntlMessages id="sidebar.pushnotificationqueue" />}
                    match={match}
                />

      <PushNotificationQueue />
    </div>
  );
  
  export default PushNotificationData;
  