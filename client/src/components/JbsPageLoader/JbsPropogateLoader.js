/**
 * Jbs Propogate Loader Added By :Tejas
 */
import React from 'react';
import { PropagateLoader } from 'react-spinners';

const JbsPropogateLoader = (props) => (
    <div className="d-flex justify-content-center loader-overlay mb-10">
        <PropagateLoader
            sizeUnit={"5px"}
            size={1}
            color={'#5D92F4'}
            loading={props.loading}
        />
    </div>
);

export default JbsPropogateLoader;
