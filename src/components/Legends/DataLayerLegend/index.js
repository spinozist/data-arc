import React from 'react';
import OpenDataManifest from '../../../config/OpenDataManifest';

// import defaults from '../../config/defaults';
import './style.css';

const DataLayerLegend = props => {


    return (
        <div style={{backgroundColor: 'white', padding: '5px', width: '400px', borderRadius: '10px'}}>

            <h2>Data Layer(s)</h2>
            <h3>{props.geoLabel.text}</h3>
            <h4 style={{ paddingLeft: '10px', marginBottom: '0px', lineHeight: '20px' }}>
              {
                props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Long :
                'No Variable Selected'
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : 'No Variable Selected'
              }
            </h4>
            <p style={{paddingLeft: '10px', lineHeight: '20px' }}> 
              Source:&nbsp;
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

export default DataLayerLegend;
