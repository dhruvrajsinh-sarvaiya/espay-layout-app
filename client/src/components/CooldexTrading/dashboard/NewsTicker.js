/**
 * News Ticker Widget
 */
import React from "react";

const NewsTicker = ({ data }) => (
  <div className="clearfix">
    <marquee direction="left" speed="normal" behavior="loop">
      {data.text}
    </marquee>
  </div>
);

export default NewsTicker;
