/**
 * Wallet Feeds Widget
 */
import React from 'react';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';

const WalletFeedsWidget = ({ feedsTitle, feedsCount, icon }) => (
     <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="display-3 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="text-right pt-25">
                    <h1 className="font-weight-normal lh_100">{feedsCount}</h1>
                    <span className="fs-14">{feedsTitle}</span>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

export { WalletFeedsWidget };
