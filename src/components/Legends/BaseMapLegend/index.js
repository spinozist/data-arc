import React, { useState } from 'react';
import { Radio, Icon, Popup, Image } from 'semantic-ui-react'

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
                boxShadow: '0 0 3px 3px rgba(23, 17, 17, 0.42)',

                // overflow: 'auto'
                height: legendOpen ? legendInfo.length * 30 + 10 + 'px' : null
            }}>
        <h2>Base Map<Icon name='ellipsis vertical' color={legendOpen ? 'grey' : 'black'} style={{float: 'right'}} onClick={() => setLegendOpen(legendOpen ? false : true)}/></h2>
        {legendOpen  ? legendInfo.map(entry =>
            <div 
                style={{ float: 'left',width: '100%', paddingLeft: '10%'}}
                // onClick={() => props.setBaseMap(entry.key)}     
            >
            <Radio
                style={{float: 'left'}}
                checked={props.baseMap === entry.key ? true : false}
                onChange={() => props.setBaseMap(entry.key)}
            />
                <Popup
                    position={'right center'}
                    on='hover'
                    hoverable
                    pinned
                    wide
                    style={{borderRadius: '10px'}}
                    trigger={<h5 style={{float: 'left', fontSize: '1em', margin: '0 0 5px 0'}}>{entry.name}</h5>}
                    children={
                        <Image 
                            src=
                            { entry.thumbUrl ?
                                entry.thumbUrl :
                                    'https://react.semantic-ui.com/images/wireframe/image.png'
                            } 
                            size='small' />}
                />

            </div>
            ) : null}
        </div>
    )
}

export default BaseMapLegend;