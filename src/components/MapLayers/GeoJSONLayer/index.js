import React, {useState, useEffect} from "react";
import L from 'leaflet';
import { GeoJSON, Tooltip } from 'react-leaflet';
import colormap from 'colormap';
import dataManifest from '../../../config/datamanifest';
import numeral from 'numeral';


const GeoJSONLayer = props => {


  // const [primaryField, setPrimaryField] = useState()

  const numberOfBins = props.layout.numberOfBins;
  const colorMap = props.layout.colorMap;
  const reverse = props.layout.colorMapReverse;

//  props.data.geojson ? props.data.geojson.forEach(feature => feature.geometry.type === 'Point' ? L.pointToLayer(feature.geometry.type) : console.log('Is not point')) : null;


  let colors = colormap({
    colormap: colorMap,
    nshades: numberOfBins,
    format: 'hex',
    alpha: 1
  });

  colors = reverse ? colors.reverse() : colors;
  
  const primaryField = props.primaryField;
  // console.log(primaryField)

  const valueArray = props.data ? Object.entries(props.data)
  .filter(([key, value]) => value[props.primaryField] !== 'NA' && value[props.primaryField] !== 'NA' && value[props.primaryField] !== null)
  .map(([key,value]) => {

      // console.log(key);
      // console.log(value[primaryField])
      return parseFloat(value[primaryField] !== 'N/A' ? value[primaryField] : null )
    }) : null;

    const maxValue = valueArray !== null ? Math.max(...valueArray) : 'Value array not load yet';
    const minValue = valueArray !== null ? Math.min(...valueArray) : 'Value array not load yet';

  // console.log(valueArray ? valueArray : 'no value array');
  
  // console.log(props.data)
    // console.log(maxValue);
    // console.log(minValue);
  
  const geoJSONGeometry = props.geoJSON ? props.geoJSON : null;
   
  // console.log(geoJSONGeometry);

  const pointData = geoJSONGeometry ? geoJSONGeometry.features[0].geometry.type === 'Point' : false;
  

  // const geojsonData = props.data ? 
  //   Object.entries(props.data).filter(([key,value]) => value[props.primaryField] !== 'NA') : null;
  
  // console.log(geojsonData);

//   props.geographyFilter ? 
//   //If there's a filter type
//   props.data.filter(feature => 
//     feature.properties[props.primaryField] > 0 && feature.properties[props.geographyFilter] === props.geographyFilterValue )
//   //If there isn't a filter type
//     : props.data;

  // const tooltipJSX = () => {
  
  // return <h5>test</h5>
  // }

  const addFeatureFunctions = (feature, layer) => {
          
    const featureID = feature.properties[props.hoverField];

    layer
    .bindTooltip(null, {interactive: true, className: 'map-feature-tooltip'})
      .on('mouseover', e => {
        const joinedFeature = props.data ? props.data[featureID] : null;
        // console.log(joinedFeature)
        
        // const fieldName = dataManifest.
        const content = document.createElement('div');
        const header = document.createElement('h2');
        const headerText = document.createTextNode(joinedFeature['NAME']);
        

        content.style.textAlign = 'center';
        content.style.padding = '5px';

        header.appendChild(headerText);
        content.appendChild(header);

        Object.keys(props.dataTray).map(key => {
          const fieldInfo = dataManifest.find(item => item.Variable === key)
          const fieldName = fieldInfo.Long;
          const fieldType = fieldInfo.Type;

          const value = fieldType === 'Count' ? 
                          numeral(joinedFeature[key]).format('0,0') :
                            fieldType === 'Percent' ?
                              numeral(joinedFeature[key]).format('0.0') + '%' :
                                numeral(joinedFeature[key]).format('0,0.0')


          console.log(fieldType);

          const itemDiv = document.createElement('div');
          const fieldNameText = document.createTextNode(fieldName);
          const fieldNameElement = document.createElement('p');
          const valueText = document.createTextNode(value ? value.toString() : '*')
          const valueElement = document.createElement('h4');
  
          valueElement.appendChild(valueText);
          valueElement.style.marginTop = '0px';
          valueElement.style.paddingTop = '0px';
          valueElement.style.marginBottom = '20px';

          fieldNameElement.appendChild(fieldNameText);
          fieldNameElement.style.marginBottom = '2px'
          itemDiv.appendChild(fieldNameElement);
          itemDiv.appendChild(valueElement);
  
          content.appendChild(itemDiv);
        });
        


        // console.log(value)
        props.handleHover(featureID);
        // console.log(e.target)
        layer.setTooltipContent(content)

      })
      .on('click', () => 
        document
          .getElementById('row-' + featureID) ?
          
        document
          .getElementById('row-' + featureID)
          .scrollIntoView(
            {
             block: 'center',
             behavior: 'smooth'
          }) : null
      )
      .on('mouseout', () => props.handleHover());    
  }

  // const pointData = dataArray && props.data.point ? dataArray

  useEffect(() => {}, [props.layout, props.primaryField]);


  return (

    props.primaryField &&
    props.data &&
    props.geoJSON ?

      <GeoJSON

      onAdd={e => e.target.bringToBack()}
      // Tooltip={'test'}
      key={'geojson-layer'}
      data={ geoJSONGeometry }
      pointToLayer={pointData ? (feature, latlng) => {
        
        const featureID = feature.properties[props.hoverField];


        const joinedFeature = props.data ? props.data[featureID] : null;

        const variable = joinedFeature ? joinedFeature[props.primaryField] : null;
          
        const normalizer = props.normalizedBy ? joinedFeature[props.normalizedBy] : 1;

        const value = variable/normalizer;
        const distFromMin = value - minValue;
        const range = maxValue - minValue;
        const binningRatio = distFromMin/range;
        const indexRange = numberOfBins - 1;
        
        const color = value ? colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)] : null;


        var geojsonMarkerOptions = {
          // radius: 10,
          fillColor: color,
          color: "#000",
          weight: 1,
        };  
        
        // console.log("This is a point")
          return L.circleMarker(latlng, geojsonMarkerOptions )
                  .setRadius(5)
        } : null 
      }


      style={ feature => {

        const featureID = feature.properties[props.hoverField];


        const joinedFeature = props.data ? props.data[featureID] : null;

        const variable = joinedFeature ? joinedFeature[props.primaryField] : null;
          
        const normalizer = props.normalizedBy ? joinedFeature[props.normalizedBy] : 1;

        const value = variable/normalizer;
        const distFromMin = value - minValue;
        const range = maxValue - minValue;
        const binningRatio = distFromMin/range;
        const indexRange = numberOfBins - 1;
        
        const color = value ? colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)] : null;

          return props.data ? ({
            color: props.hoverID === featureID ? props.baseMap === 'tile-layer-dark' ? 'white' : 'black' : '#1a1d62',
            weight: props.hoverID === featureID ? 3 : 0.4,
            fillColor: color,
            fillOpacity: !value ? 0 : props.hoverID === featureID ? 1 : props.layout.colorOpacity,
            zIndex: props.hoverID === featureID ? 999 : 998
          }) : null
        }
      }

    //   onMouse

      onEachFeature={(feature, layer) => 
        props.primaryField && props.data ? 
        addFeatureFunctions(feature, layer) : null }
    /> : null
  ) 
};

export default GeoJSONLayer;