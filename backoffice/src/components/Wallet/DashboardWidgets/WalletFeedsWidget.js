/**
 * Wallet Feeds Widget
 */
import React from 'react';
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';

const WalletFeedsWidget = ({ feedsTitle, feedsCount, icon }) => (
    // <div className="social-card">
    //     <span className="w-20"><h1 className="display-4 font-weight-normal mb-0"><i className={`${icon}`}></i></h1></span>
    //     <span className="w-80">
    //         <h1 className="font-1x font-weight-normal">{feedsCount}</h1>
    //         <span className="fs-14">{feedsTitle}</span>
    //     </span>
    // </div >
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
