import React, {useEffect, useState, useRef} from "react";
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import API from "../../utils/API";
import * as turf from '@turf/turf';
import './style.css'


const LabelLayer = props => {

    const labelClass = props.labelClass
    // const layerRef = useRef(null);

    // const labeled = true;
    const labelValue = props.labelValue

    //Converts Polygon to LineString so overlay doesn't block GeoJson layer tooltip
    //Need to test for geometry type to handle different inputs
    const centroidData = props.data ? props.data.map(feature => turf.centroid(feature, feature.properties)) : null; 

    // const borderWeight = props.style.borderWeight;
    // const borderColor = props.style.borderColor;
    // const borderType = props.style.borderType;

    // console.log(linestringData)
    useEffect(() => console.log('geojson refresh'), [props.labelValue])

    return (
        <GeoJSON
        // dashArray={borderType === 'dashed' ? '4 3 2' : '0'}
        // color={borderColor}
        // weight={borderWeight}
        onEachFeature={(feature, layer) => {

          layer.options.icon.options.iconSize = [0,0];
          layer.options.icon.options.shadowUrl = '';

          // console.log(feature)
          layer.bindTooltip(feature.properties[labelValue], 
          {
            permanent: true,
            direction: 'center',
            className: labelClass,
            sticky: true,
            // offset: L.point(20, -20)
            // offset: '-20px'

          })

        }

          // console.log(layer.options.icon.options.iconSize)
          }
        
        


        data={props.data ? centroidData : null}


      />
    );
};

export default LabelLayer;