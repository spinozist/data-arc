import React, { useState } from 'react';
import { Dropdown, Popup, Icon } from 'semantic-ui-react';
import dataManifest from '../../../config/datamanifest';
import colorScale from 'colormap/colorScale';
import defaults from '../../../config/defaults';

import './style.css';
  


const DataLayerLegend = props => {

  const colorRampOptions = colorScale ? 
  Object.entries(colorScale)
    .filter(([key,value]) => key !== 'alpha')
    .map(([key,value]) => {

    return({
      key: key,
      text: key,
      value: key,
      content: (
        <div 
          style={{
            width: '140px',
            height: '50px',
            backgroundColor: key === props.layout.colorMap ? 'black' : null
          }}
        >
          <div 
            style={{
              float: 'left', 
              width: '100%', 
              height: '40%',
              color: key === props.layout.colorMap ? 'white' : null
            }}
          >
            {key}
          </div>
          {
            props.layout.colorMapReverse ? 
            
            value.map(obj => 
                <div style={{float: 'left', width: (100 / value.length) + '%', backgroundColor: `rgb(${obj.rgb[0]},${obj.rgb[1]},${obj.rgb[2]})`, height: '60%' }}/>
            ).reverse()
            :
            value.map(obj => 
              <div style={{float: 'left', width: (100 / value.length) + '%', backgroundColor: `rgb(${obj.rgb[0]},${obj.rgb[1]},${obj.rgb[2]})`, height: '60%' }}/>
          )
          }
        </div>
      )
    })
  }) : null;

  const [ legendOpen, setLegendOpen ] = useState(true);

  const primaryField = props.primaryField;
  const dataTray = props.dataTray;

  // const fieldOptions = Object.entries(dataTray).map(([key, value]) =>
  //   ({
  //       key: key,
  //       text: value.text,
  //       value: key
  //   })
  // );

//   const removeFromDataTray = key => {
//     const tempTray = dataTray;
//     // const removeSecondaryField = () => key === props.secondaryField ? props.secondaryField(props.primaryField) : null;
//     // removeSecondaryField();
//     delete tempTray[key];

//     props.setDataTray({
//         ...tempTray
//     })
// }

  return (
      <div 
        style={{
          backgroundColor: props.style.backgroundColor,
          padding: props.style.padding,
          width: props.style.width,
          borderRadius: props.style.borderRadius
        }}
      >
        <h2>Data
        <Icon name='ellipsis vertical' color={legendOpen ? 'grey' : 'black'} style={{float: 'right'}} onClick={() => setLegendOpen(legendOpen ? false : true)}/>

        </h2>
         { legendOpen ? 
         <div>
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
          flowing
          pinned
          children={
            <div 
                style={{ 
                    // marginTop: '20px',
                    width: '400px',
                    height: '40vh',
                    // float: 'right',
                    overflow: 'auto',
                    textAlign: 'left',
                    boxShadow: 'inset 0 0 5px #000000',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '.8em'
                }}>
                { dataTray ?
                    Object.entries(dataTray).map(([key, value]) =>
                    <div
                    onClick={() => props.setPrimaryField(key)}
                    // basic
                    // color={}
                    style={{
                        border: 'solid',
                        borderWidth: '4px',
                        opacity: '1',
                        backgroundColor: 'teal',
                        borderColor: key === props.primaryField ? 'black' : 'teal',
                        // color: catColors[categories.indexOf(value.category)],
                        float: 'left', borderRadius: '20px', margin: '5px', padding: '2px'}}>
                        {value.text}
                    {/* <Icon 
                        name='delete' 
                        onClick={() => removeFromDataTray(key)}                
                     /> */}
                    </div>
                ) : null 
                }
            
            </div>
            // dataTray ? 
            // <Dropdown 
            //     selection
            //     scrolling 
            //     value={primaryField} 
            //     onChange={(event, data) => {
            //         // props.setPreviousServiceID(props.serviceID)
            //         props.setPrimaryField(data.value)
            //     }} 
            //     // placeholder='Select Geography' 
            //     options={fieldOptions} /> : null
          }
          trigger={
            primaryField && props.dataTray && props.dataTray[primaryField] && props.data ?
            <div 
              style={{ 
                // padding: '10px',
                marginBottom: '0px',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '5px',
                textAlign: 'center',
                boxShadow: 'inset 0 0 5px #000000'
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
                dataInfo.Variable === dataTray[primaryField].value ) ?
              dataManifest.find(dataInfo => 
                dataInfo.Variable === dataTray[primaryField].value ).Topic :
                'info cannot be found'               
             }
          </p>
            
          <h4 style={{ lineHeight: '20px'}}>{props.dataTray[primaryField].text}</h4>
          <div 
                  style={{
                    width: '100%',
                    textAlign: 'center',
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
        <div> 

          {
          primaryField &&
          props.dataTray &&
          props.dataTray[primaryField] &&
          props.data ?

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
                  height: '40px'
                }}
              >
                {props.colorRamp}
              </div>
            }
            children={
              <div style={{ textAlign: 'center'}}>
              <h5 style={{margin: '5px 0 5px 0'}}>
                  Flip Color Ramp
              </h5>
              <div 
                style={{float: 'left',
                width: '100%',
                textAlign: 'center',
                marginBottom: '15px'}}
                >
                <Icon name='sort' size={'big'} rotated={'clockwise'} onClick={() => 
                  props.setLayout({
                    ...props.layout,
                    colorMapReverse: props.layout.colorMapReverse ? false : true
                  })}
                />
              </div>
              <h5 style={{margin: '20px 0 5px 0'}}>
                  Change Color Ramp
              </h5>
                <Dropdown
                  scrolling
                  value={props.layout.colorMap}
                  options={colorRampOptions}
                  onChange={(e, data) => props.setLayout({...props.layout,  colorMap: data.value})}
                />


              </div>
            } 
          /> : null
        }

        <div style={{width: '100%',  height: '40px', padding: '5px', textAlign: 'center'}}>
            {props.dataButton}
        </div>
        </div>
      </div> : null }


          {/* {dataLayerInfo} */}
      </div>
  )

}

export default DataLayerLegend;
