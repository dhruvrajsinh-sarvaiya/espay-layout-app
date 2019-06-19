/**
 * Jbs Bar Loader Added By :Tejas 14/6/2019
 */
import React from 'react';
import Loader from 'react-loader-spinner'   

const JbsBarLoader = (props) => (
    <div className="d-flex justify-content-center loader-overlay-bar mb-10">
       <Loader 
         type="Bars"
         color="#00BFFF"
         height="70"	
         width="70"
      />   
    </div>
);

export default JbsBarLoader;
