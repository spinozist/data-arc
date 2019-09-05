import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import './style.css';

const BoundaryLayerLegend = props => {

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

        <h2>Boundary Layer(s)</h2>
        {legendInfo.map(entry => 
            <div style={{float: 'left', width: '100%', paddingLeft: '10%'}}>
                <Checkbox 
                    style={{width: '2%', float: 'left'}}
                    onChange={() => props.setOverLayers({
                        ...props.overLayers,
                        [entry.name]: props.overLayers[entry.name] ? false : true
                    })}
                    checked={props.overLayers[entry.name]} 
                />

                <div style={{float: 'left', width: '95%'}}>
                    <h4 style={{paddingLeft: '10px',width: '30%', float: 'left'}}>{entry.name}</h4>
                    
                    <div 
                        style={{
                            float: 'left',
                            height: '20px', 
                            width: '20px',
                            border: 'solid', 
                            borderColor: entry.style.borderColor,
                            borderWidth: entry.style.borderWeight
                        }}>
                    </div>
                </div>
            </div>
                )}
        </div>
    )

}

export default BoundaryLayerLegend;