import React from 'react';
import { Radio } from 'semantic-ui-react'

import './style.css';

const BaseMapLegend = props => {

    const legendInfo = props.legendInfo;

    return (
        <div 
            style={{
                marginBottom: '5px',
                backgroundColor: props.style.backgroundColor,
                padding: props.style.padding,
                width: props.style.width,
                borderRadius: props.style.borderRadius,
                overflow: 'auto'
            }}>
        <h2>Base Map(s)</h2>
        {legendInfo.map(entry =>
            <h5 
                style={{paddingLeft: '10%', margin: '0 0 14px 0'}}
                // onClick={() => props.setBaseMap(entry.key)}     
            >
            <Radio
                label={entry.name}
                checked={props.baseMap === entry.key ? true : false}
                onChange={() => props.setBaseMap(entry.key)}
            />
            </h5>
            )}
        </div>
    )
}

export default BaseMapLegend;