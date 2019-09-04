import React, {useState, useEffect} from 'react';
import OpenDataManifest from '../../config/OpenDataManifest';

// import defaults from '../../config/defaults';
import './style.css';

const InteractiveLegend = props => {

    const baseMapInfo = props.baseMapInfo;
    const overLayersInfo = props.overLayersInfo;

    // const dataLayerInfo = props.dataLayerInfo;

    return (
        <div style={{backgroundColor: 'white', padding: '5px', width: '400px', borderRadius: '10px'}}>
            <h2>Base Map</h2>
            {baseMapInfo.map(layer =>
                <h5>
                    {layer.name}
                </h5>
                )}
            <h2>Boundary Layer(s)</h2>
            {overLayersInfo.map(layer => 
                <div style={{float: 'left', width: '100%'}}>
                    <h4 style={{width: '50%', float: 'left'}}>{layer.name}</h4>
                    <div 
                        style={{
                            float: 'left',
                            height: '20px', 
                            width: '20px',
                            border: 'solid', 
                            borderColor: layer.style.borderColor,
                            borderWidth: layer.style.borderWeight
                        }}>
                    </div>
                </div>
                    )}
            <h2>Data Layer(s)</h2>
            <h3>{props.geoLabel.text}</h3>
            <h4 style={{ margin: '0', lineHeight: '20px' }}>
              {
                props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Long :
                'No Variable Selected'
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : 'No Variable Selected'
              }
            </h4>
            <p style={{ lineHeight: '10px' }}> 
              {
                props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Source :
                null
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : null
              }
                <div style={{width: '100%', height: '50px'}}>
                {props.colorRamp}
                </div>
                <div style={{padding: '5px', textAlign: 'center'}}>
                {props.browseDataButton}
                </div>

            </p>
            {/* {dataLayerInfo} */}
        </div>
    )

}

export default InteractiveLegend;
