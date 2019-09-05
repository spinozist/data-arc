import React from 'react';
import { Radio } from 'semantic-ui-react'

import './style.css';

const BaseMapLegend = props => {

    const legendInfo = props.legendInfo;

    return (
        <div 
            style={{
                marginBottom: '5px',
                backgroundColor: 'white',
                padding: '5px',
                width: '400px',
                borderRadius: '10px',
                overflow: 'auto'
            }}>
        <h2>Base Map(s)</h2>
        {legendInfo.map(entry =>
            <h4 
                style={{paddingLeft: '10%'}}
                // onClick={() => props.setBaseMap(entry.key)}     
            >
            <Radio
                label={entry.name}
                checked={props.baseMap === entry.key ? true : false}
                onChange={() => props.setBaseMap(entry.key)}
            />
            </h4>
            )}
        </div>
    )
}

export default BaseMapLegend;