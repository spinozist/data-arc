import React, {useState, useEffect} from "react";
// import L from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import colormap from 'colormap';


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
  // .filter(([key, value]) => value[props.primaryField] !== 'NA')
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
  
  const geoJSONGeometry = props.geoJSON ? props.geoJSON : null
   
  // console.log(geoJSONGeometry);

  // const geojsonData = props.data ? 
  //   Object.entries(props.data).filter(([key,value]) => value[props.primaryField] !== 'NA') : null;
  
  // console.log(geojsonData);

//   props.geographyFilter ? 
//   //If there's a filter type
//   props.data.filter(feature => 
//     feature.properties[props.primaryField] > 0 && feature.properties[props.geographyFilter] === props.geographyFilterValue )
//   //If there isn't a filter type
//     : props.data;

  // const pointData = dataArray.map(feature => feature.geometry.type === 'Point' ? console.log(feature.geometry.type) : null);
  // var geojsonMarkerOptions = {
  //   radius: 20,
  //   fillColor: "#ff7800",
  //   color: "#000",
  //   weight: 1,
  //   opacity: 1,
  //   fillOpacity: 0.8
  // };

  const addFeatureFunctions = (feature, layer) => {
          
    // const variable=feature.properties[props.data.primaryField];
    // const normalizer=props.data.normalizedBy ? feature.properties[props.data.normalizedBy] : 1

    // const value = variable/normalizer;

    // console.log(feature.geometry.type);
    
    const featureID = feature.properties[props.hoverField];
    // const value = feature.properties[props.primaryField];
    // console.log(String(value))

    layer.bindTooltip(String(featureID))
      .on('mouseover', e => {
          props.handleHover(featureID)
        })
      .on('mouseout', () => {
          props.handleHover()
        });
  }


  // const pointData = dataArray && props.data.point ? dataArray.map(feature => L.circleMarker(feature.geometry.coordinates, geojsonMarkerOptions)) : null;
  //   // L.geoJSON(dataArray, {
  //   // pointToLayer: (feature, latlng) => {
  //   //   console.log("This is a point")
  //   //   return L.circleMarker(latlng, geojsonMarkerOptions )
  //   // }
  //   // }) 


  return (

      <GeoJSON
      key={'geojson-layer'}
      data={ geoJSONGeometry }
    //   pointToLayer={props.data.point ? (feature, latlng) => {
        
    //     const variable=feature.properties[props.data.primaryField];
    //     const normalizer=props.data.normalizedBy ? feature.properties[props.data.normalizedBy] : 1

    //     // console.log(props.data.primaryField);
    //     const value = variable/normalizer;
    //     const distFromMin = value - minValue;
    //     const range = maxValue - minValue;
    //     const binningRatio = distFromMin/range;
    //     const indexRange = numberOfBins - 1;
    //     // const opacity = value;
    //     const color = colors[Math.floor(binningRatio * indexRange)];

    //     // const featureID = feature.properties[props.data.hoverField];

    //     var geojsonMarkerOptions = {
    //       // radius: 10,
    //       fillColor: color,
    //       color: "#000",
    //       weight: 1,
    //     };  
        
    //     // console.log("This is a point")
    //       return L.circleMarker(latlng, geojsonMarkerOptions )
    //               .setRadius(5)
    //     } : null 
    //   }


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
        // const opacity = value;
        const color = value ? colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)] : null;



        // console.log(featureID);

          return ({
            color: props.hoverID === featureID ? props.baseMap === 'tile-layer-dark' ? 'white' : 'black' : '#1a1d62',
            weight: props.hoverID === featureID ? 3 : 0.4,
            fillColor: color,
            fillOpacity: !value ? 0 : props.hoverID === featureID ? 1 : props.layout.colorOpacity,
            zIndex: props.hoverID === featureID ? 999 : 998
          })
        }
      }

    //   onMouse

      onEachFeature={(feature, layer) => addFeatureFunctions(feature, layer)}
    />
  );
};

export default GeoJSONLayer;