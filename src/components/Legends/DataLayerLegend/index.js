import React, { useEffect } from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import dataManifest from '../../../config/datamanifest';
import colorScale from 'colormap/colorScale';
import defaults from '../../../config/defaults';

import './style.css';
  
const colorRampOptions = colorScale ? Object.entries(colorScale).map(([key,value]) => {
  // const numberOfBins = value ? value.length : null;
  // const widthOfBins = numberOfBins ? 100/numberOfBins : null  
  // const content = value ? value.map(item => 
  //   <div style={{ float:'left', width: widthOfBins + '%', backgroundColor: item.rgb}}/>
  //   ) : null; 

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

    return (
        <div 
          style={{
            backgroundColor: props.style.backgroundColor,
            padding: props.style.padding,
            width: props.style.width,
            borderRadius: props.style.borderRadius
          }}
        >
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
                    onChange={(event, data) => 
                        props.setSumLevel(data.value)
                    } 
                    options={defaults.geoOptions}
                /> : null 
              }
            />
          {/* { primaryField && 
            dataTray && 
            dataTray[primaryField] && 
            props.data &&
            props.dataLoaded &&
            dataManifest.find(dataInfo => 
              dataInfo.Variable === dataTray[primaryField].value) ?

            <p 
              style={{ 
                marginBottom: '-15px',
                lineHeight: '10px' ,
              }}
            >
              {
                dataTray[primaryField].category +
                ' | ' +
                dataManifest.find(dataInfo => 
                  dataInfo.Variable === dataTray[primaryField].value).Topic                 }
            </p>

            : null

          }              */}
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
              primaryField && props.dataTray && props.dataTray[primaryField] && props.data ?
              <div 
                style={{ 
                  paddingLeft: '10px',
                  marginBottom: '0px',
                  backgroundColor: props.data ? 'lightgrey' : null,
                  padding: '10px',
                  borderRadius: '5px',
                  textAlign: 'center' 
              }}>
              <p 
              style={{ 
                // marginBottom: '-15px',
                lineHeight: '10px' ,
              }}
            >
              {
                dataTray[primaryField].category +
                ' | ' +
                dataManifest.find(dataInfo => 
                  dataInfo.Variable === dataTray[primaryField].value).Topic                 }
            </p>
              
            <h4 style={{ lineHeight: '20px'}}>{props.dataTray[primaryField].text}</h4>
            <div 
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      marginTop: '5px',
                      marginLeft: '-10px'
                    }}
                  >

                  Source:&nbsp;
                  {
                    dataManifest.find(dataInfo => 
                    dataInfo.Variable === dataTray[primaryField].value).Source
                  }
                  </div> 
            </div> :
                <h4 style={{ width: '100%', textAlign: 'center', lineHeight: '20px'}}>Data loading...</h4>

            } /> 
          <p style={{
              paddingLeft: '10px', 
              lineHeight: '20px'
            }}> 
            {/* {
              primaryField && 
              props.dataTray && 
              props.data &&
              dataManifest.find(dataInfo => 
                dataInfo.Variable === dataTray[primaryField].value) ?

                  <div 
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      marginTop: '5px',
                      marginLeft: '-10px'
                    }}
                  >

                  Source:&nbsp;
                  {
                    dataManifest.find(dataInfo => 
                    dataInfo.Variable === dataTray[primaryField].value).Source
                  }
                  </div> : null
            } */}
            <Popup
              position={'top center'}
              on='hover'
              hoverable
              pinned 
              trigger={
                <div 
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    width: '100%',
                    height: '30px'
                  }}
                >
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
