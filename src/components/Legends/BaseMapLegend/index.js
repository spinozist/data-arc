import React, { useState } from 'react';
import { Radio, Icon } from 'semantic-ui-react'

import './style.css';

const BaseMapLegend = props => {

    const [ legendOpen, setLegendOpen ] = useState(false);

    const [legendInfo, setLegendInfo] = useState(props.legendInfo);

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
        <h2>Base Map<Icon name='ellipsis vertical' color={legendOpen ? 'grey' : 'black'} style={{float: 'right'}} onClick={() => setLegendOpen(legendOpen ? false : true)}/></h2>
        {legendOpen  ? legendInfo.map(entry =>
            <div 
                style={{paddingLeft: '10%', fontSize: '1em', margin: '0 0 5px 0'}}
                // onClick={() => props.setBaseMap(entry.key)}     
            >
            <Radio
                // label={entry.name}
                checked={props.baseMap === entry.key ? true : false}
                onChange={() => props.setBaseMap(entry.key)}
            />
                        {entry.name}

            </div>
            ) : null}
        </div>
    )
}

export default BaseMapLegend;