import React from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import OpenDataManifest from '../../../config/OpenDataManifest';
import colorScale from 'colormap/colorScale';
import defaults from '../../../config/defaults';

import './style.css';
  
const colorRampOptions = colorScale ? Object.entries(colorScale).map(([key,value]) => {
  const numberOfBins = value ? value.length : null;
  const widthOfBins = numberOfBins ? 100/numberOfBins : null  
  const content = value ? value.map(item => 
    <div style={{ float:'left', width: widthOfBins + '%', backgroundColor: item.rgb}}/>
    ) : null; 

    return({
      key: key,
      text: key,
      value: key,
      // content: (content)
    })
  }) : null;



const DataLayerLegend = props => {

    const primaryField = props.primaryField;
    const dataTray = props.dataTray;

    const fieldOptions = Object.entries(dataTray).map(([key, value]) =>
      ({
         key: key,
         text: value.text,
         value: key
      })
    );
    console.log(fieldOptions);
    console.log(dataTray);

    return (
        <div style={{
         backgroundColor: props.style.backgroundColor,
         padding: props.style.padding,
         width: props.style.width,
         borderRadius: props.style.borderRadius}}>
            <h2>Data Layer(s)</h2>
            <Popup
                position={'right center'}
                on='hover'
                hoverable
                pinned 
                trigger={
                  <h3>{props.geoLabel.text}</h3>
                } 
                children={
                  props.geo ? 
                  <Dropdown 
                      selection
                      scrolling 
                      value={props.geo} 
                      onChange={(event, data) => {
                          // props.setPreviousServiceID(props.serviceID)
                          props.setSumLevel(data.value)
                      }} 
                      // placeholder='Select Geography' 
                      options={defaults.geoOptions}
                  />
                  : null }/> 
            <Popup
              position={'right center'}
              on='hover'
              hoverable
              pinned 
              children={
                dataTray ? 
                <Dropdown 
                    selection
                    scrolling 
                    value={primaryField} 
                    onChange={(event, data) => {
                        // props.setPreviousServiceID(props.serviceID)
                        props.setPrimaryField(data.value)
                    }} 
                    // placeholder='Select Geography' 
                    options={fieldOptions} /> : null
              }
              trigger={

                <h4 style={{ paddingLeft: '10px',
                marginBottom: '0px',
                lineHeight: '20px' }}>
                {
                  primaryField && props.dataTray && props.dataTray[primaryField] && props.data ?
                  props.dataTray[primaryField].text :
                  'Data loading...'
                  // DataManifest.map(item => item.Variable === primaryField ? item.Long : null)
                }
              </h4>
  
              } /> 
            <p style={{paddingLeft: '10px', lineHeight: '20px' }}> 
              Source:&nbsp;
              {
                primaryField && props.dataTray ?
                OpenDataManifest[props.dataTray[primaryField].manifest].find(item => item.Variable === primaryField) ?
                OpenDataManifest[props.dataTray[primaryField].manifest].find(item => item.Variable === primaryField).Source :
                'Unable to find field information'
                // DataManifest.map(item => item.Variable === primaryField ? item.Long : null)
                : null
              }
              <Popup
                position={'top center'}
                on='hover'
                hoverable
                pinned 
                trigger={
                  <div style={{marginTop: '10px', marginBottom: '20px', width: '100%', height: '30px'}}>
                  {props.colorRamp}
                  </div>
                }
                children={
                  <Dropdown
                    scrolling
                    value={props.layout.colorMap}
                    options={colorRampOptions}
                    onChange={(e, data) => props.setLayout({...props.layout,  colorMap: data.value}) }/>
                } 
              />

              <div style={{padding: '5px', textAlign: 'center'}}>
              {props.browseDataButton}
              </div>

            </p>
            {/* {dataLayerInfo} */}
        </div>
    )

}

export default DataLayerLegend;
