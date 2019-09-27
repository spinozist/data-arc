import React, {useEffect, useState} from "react";
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import API from "../../utils/API";
import * as turf from '@turf/turf';
import './style.css'


const OverlayLayer = props => {

    // const labeled = false;
    // const labelValue = 'NAME'
    //Converts Polygon to LineString so overlay doesn't block GeoJson layer tooltip
    //Need to test for geometry type to handle different inputs
    const [fill, setFill] = useState(false);

    const linestringData = props.data ? props.data.map(feature => !fill ? turf.polygonToLine(feature) : feature) : null ;
    // const centroidData = props.data ? props.data.map(feature => labeled ? turf.centroid(feature, feature.properties) : feature) : null; 

    const borderWeight = props.style.borderWeight;
    const borderColor = props.style.borderColor;
    const borderType = props.style.borderType;

    // console.log(linestringData)
    useEffect(() => console.log('geojson refresh'), [props.style.borderType])

    return (
        <GeoJSON
        dashArray={borderType === 'dashed' ? '4 3 2' : '0'}
        color={borderColor}
        weight={borderWeight}

        data={props.data ? linestringData : null}


      />
    );
};

export default OverlayLayer;